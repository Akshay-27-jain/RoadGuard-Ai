import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, MapPin, UploadCloud, X, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AIAssessmentVisualizer } from '@/components/complaints/AIAssessmentVisualizer';
import { MunicipalMap } from '@/components/maps/MunicipalMap';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { api, ComplaintsAPI } from '@/services/api';

// Numerical Coordinate Regex
const LAT_REGEX = /^-?([0-8]?[0-9](\.\d+)?|90(\.0+)?)$/;
const LNG_REGEX = /^-?((1[0-7][0-9]|[0-9]?[0-9])(\.\d+)?|180(\.0+)?)$/;

export const ReportDamagePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: string; lng: string }>({ lat: '18.52043', lng: '73.85674' });
  const [address, setAddress] = useState('');
  const [roadClass, setRoadClass] = useState<'local' | 'arterial' | 'highway'>('arterial');
  const [description, setDescription] = useState('');
  const [detectingGps, setDetectingGps] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qualityRejection, setQualityRejection] = useState<any | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 15 * 1024 * 1024) {
        setError('Image file exceeds the 15 MB limit. Please select a smaller photo.');
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError(null);
      setQualityRejection(null);
    }
  };

  const removeImage = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setQualityRejection(null);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Please enter coordinates manually or click on the map.');
      return;
    }
    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({
          lat: lat.toFixed(6),
          lng: lng.toFixed(6),
        });
        setDetectingGps(false);
        setError(null);
        try {
          const res = await ComplaintsAPI.reverseGeocode(lat, lng);
          if (res.data?.address_text) {
            setAddress(res.data.address_text);
          }
        } catch (e) {
          // Keep coords intact
        }
      },
      (err) => {
        setDetectingGps(false);
        setError(`GPS permission denied or unavailable (${err.message}). Click on the map to set location.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a clear photograph of the road damage.');
      return;
    }
    if (!coords.lat || !coords.lng) {
      setError('Please provide GPS coordinates or click "Capture GPS Location".');
      return;
    }

    const latStr = coords.lat.trim();
    const lngStr = coords.lng.trim();

    if (!LAT_REGEX.test(latStr) || !LNG_REGEX.test(lngStr)) {
      setError('Please provide valid numerical GPS coordinates (Latitude: -90 to 90, Longitude: -180 to 180).');
      return;
    }

    const latNum = parseFloat(latStr);
    const lngNum = parseFloat(lngStr);
    if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      setError('Please provide valid numerical GPS coordinates (Latitude: -90 to 90, Longitude: -180 to 180).');
      return;
    }

    setSubmitting(true);
    setError(null);
    setQualityRejection(null);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('file', file);
    formData.append('latitude', latNum.toString());
    formData.append('longitude', lngNum.toString());
    formData.append('road_class', roadClass);
    if (description?.trim()) formData.append('description', description.trim());
    if (address?.trim()) formData.append('address_text', address.trim());

    try {
      const response = await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmissionResult(response.data);
      setSubmitting(false);
    } catch (err: any) {
      setSubmitting(false);
      const detail = err.response?.data?.detail;
      if (
        err.response?.status === 422 &&
        detail &&
        typeof detail === 'object' &&
        !Array.isArray(detail) &&
        (detail.blur_score !== undefined || detail.message?.includes('OpenCV'))
      ) {
        // Genuine OpenCV Quality Gate Rejection
        setQualityRejection(detail);
      } else {
        let msg = 'Submission failed. Please check network connectivity.';
        if (Array.isArray(detail)) {
          msg = detail.map((d: any) => `${d.loc?.slice(-1)[0] || 'Field'}: ${d.msg}`).join(', ');
        } else if (typeof detail === 'string') {
          msg = detail;
        } else if (detail?.message) {
          msg = detail.message;
        }
        setError(msg);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <Badge variant="primary">Citizen Service</Badge>
          <h1 className="text-3xl font-extrabold text-[#172B3A] tracking-tight sm:text-4xl">
            Report Road Damage
          </h1>
          <p className="text-sm text-[#64748B] max-w-xl mx-auto">
            Upload a clear photo and location of the road defect. Our AI engine validates quality, identifies damage severity, and dispatches the complaint directly to municipal road officers.
          </p>
        </div>

        {submissionResult ? (
          <div className="space-y-6">
            <Card className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#13856B] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#13856B] uppercase tracking-wider">Report Submitted Successfully</span>
                <h2 className="text-2xl font-bold text-[#172B3A]">Complaint Reference Generated</h2>
                <div className="inline-block px-5 py-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xl font-mono font-bold text-[#13856B]">
                  {submissionResult.complaint_ref}
                </div>
              </div>

              <p className="text-xs text-[#64748B] max-w-lg mx-auto">
                AI computer vision analysis complete. See predicted bounding boxes, severity assessment, and priority score below.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <Link to={`/track/${submissionResult.complaint_ref}`}>
                  <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Track Progress Milestones
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSubmissionResult(null);
                    removeImage();
                    setDescription('');
                  }}
                >
                  Submit Another Report
                </Button>
              </div>
            </Card>

            {/* Live AI Assessment Visualizer with Bounding Boxes */}
            <ErrorBoundary
              fallbackTitle="Road Defect Registered"
              fallbackMessage="Your damage ticket was saved successfully. AI telemetry breakdown details will display momentarily."
            >
              <AIAssessmentVisualizer
                imageUrl={preview || submissionResult?.image_url}
                assessment={submissionResult?.ai_assessment}
              />
            </ErrorBoundary>
          </div>
        ) : (
          <Card className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {qualityRejection && (
              <div className="mb-6 p-5 rounded-2xl bg-amber-50 border border-amber-300 space-y-2 text-xs text-amber-900">
                <div className="flex items-center gap-2 font-bold text-sm text-[#D97706]">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>OpenCV Quality Gate Rejection</span>
                </div>
                <p className="leading-relaxed font-medium">
                  {qualityRejection.reason || 'Image quality does not meet analysis requirements.'}
                </p>
                <div className="pt-1 flex flex-wrap gap-4 text-[11px] text-amber-800">
                  <span>
                    Blur Score: <b>{qualityRejection.blur_score ?? 'N/A'}</b> (min threshold: 25.0)
                  </span>
                  <span>
                    Brightness: <b>{qualityRejection.brightness ?? 'N/A'}</b> (allowed: 25.0 - 235.0)
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] pt-1">
                  Please hold your camera steady, ensure adequate daylight or street lighting, and re-upload.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Image Upload Section */}
              <div>
                <label className="block text-sm font-semibold text-[#172B3A] mb-2">
                  Road Damage Photograph <span className="text-[#DC2626]">*</span>
                </label>

                {preview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] bg-slate-900 aspect-16/9 flex items-center justify-center">
                    <img src={preview} alt="Damage Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-slate-700 hover:text-red-600 hover:bg-white transition-colors cursor-pointer shadow-sm"
                      title="Remove image"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-md text-xs font-semibold text-[#172B3A] shadow-xs">
                      {file?.name} ({(file!.size / (1024 * 1024)).toFixed(2)} MB)
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E2E8F0] hover:border-[#13856B] rounded-2xl p-8 bg-slate-50 hover:bg-emerald-50/20 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100/60 text-[#13856B] flex items-center justify-center mb-3">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-[#172B3A]">Click to upload or drag & drop</span>
                    <span className="text-xs text-[#64748B] mt-1">PNG, JPG, or WEBP up to 15 MB</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              {/* 2. Geolocation Section */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[#172B3A]">
                    Geographic Location <span className="text-[#DC2626]">*</span>
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGetLocation}
                    isLoading={detectingGps}
                    leftIcon={<MapPin className="w-3.5 h-3.5" />}
                  >
                    Capture GPS Location
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Latitude"
                    placeholder="e.g. 18.520430"
                    required
                    value={coords.lat}
                    onChange={(e) => setCoords({ ...coords, lat: e.target.value })}
                  />
                  <Input
                    label="Longitude"
                    placeholder="e.g. 73.856744"
                    required
                    value={coords.lng}
                    onChange={(e) => setCoords({ ...coords, lng: e.target.value })}
                  />
                </div>

                <div className="pt-1">
                  <label className="text-xs font-semibold text-[#172B3A] block mb-1.5">
                    Pin Location on Map
                  </label>
                  <MunicipalMap
                    interactiveSelectMode={true}
                    selectedCoords={
                      coords.lat && coords.lng
                        ? { lat: parseFloat(coords.lat), lng: parseFloat(coords.lng) }
                        : null
                    }
                    onCoordinatesSelected={(c) =>
                      setCoords({ lat: c.lat.toFixed(6), lng: c.lng.toFixed(6) })
                    }
                    onLocationSelected={(loc) => {
                      setCoords({ lat: loc.lat.toFixed(6), lng: loc.lng.toFixed(6) });
                      if (loc.address_text) setAddress(loc.address_text);
                    }}
                    height="240px"
                  />
                </div>

                <Input
                  label="Street / Landmark Address (Optional)"
                  placeholder="e.g. Outside City Hospital, Karve Road, Pune"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* 3. Road Classification */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-sm font-semibold text-[#172B3A]">
                  Road Classification (Optional)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'arterial', label: 'Arterial / Major' },
                    { id: 'highway', label: 'Highway / Expressway' },
                    { id: 'local', label: 'Local / Residential' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRoadClass(item.id as any)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                        roadClass === item.id
                          ? 'bg-emerald-50 border-[#13856B] text-[#13856B]'
                          : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Description */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-sm font-semibold text-[#172B3A] mb-1.5">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Pothole is approximately 10cm deep, located on the left lane near the bus stop..."
                  className="block w-full rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-sm text-[#172B3A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#13856B] focus:border-transparent transition-colors"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  isLoading={submitting}
                  leftIcon={<UploadCloud className="w-5 h-5" />}
                >
                  Submit Road Damage Report
                </Button>
                <p className="text-[11px] text-[#64748B] text-center mt-2.5">
                  Submissions are authenticated and screened by OpenCV quality check before queueing for municipal dispatch.
                </p>
              </div>

            </form>
          </Card>
        )}

      </div>
    </div>
  );
};
