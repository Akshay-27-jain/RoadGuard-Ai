import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, MapPin, ThumbsUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { StatusBadge, SeverityBadge, DamageClassBadge } from '@/components/ui/Badge';
import { AIAssessmentVisualizer } from '@/components/complaints/AIAssessmentVisualizer';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export const TrackComplaintPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { isAuthenticated } = useAuth();
  const [searchRef, setSearchRef] = useState(id || 'RGD-2026-10492');
  const [complaint, setComplaint] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supporting, setSupporting] = useState(false);
  const [supportMessage, setSupportMessage] = useState<string | null>(null);

  const fetchComplaint = async (ref: string) => {
    setLoading(true);
    setError(null);
    setSupportMessage(null);

    try {
      const response = await api.get(`/complaints/ref/${ref.trim()}`);
      setComplaint(response.data);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      // If not in database yet, provide clear notice
      setComplaint(null);
      setError(`Complaint reference "${ref}" was not found in municipal records.`);
    }
  };

  useEffect(() => {
    if (id) {
      setSearchRef(id);
      fetchComplaint(id);
    }
  }, [id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchRef.trim()) {
      fetchComplaint(searchRef.trim());
    }
  };

  const handleSupport = async () => {
    if (!complaint?.id) return;
    if (!isAuthenticated) {
      setSupportMessage('Please sign in as a citizen to add community support to this complaint.');
      return;
    }

    setSupporting(true);
    setSupportMessage(null);

    try {
      const response = await api.post(`/complaints/${complaint.id}/support`);
      setSupporting(false);
      setSupportMessage(response.data.message);
      // Refresh complaint data
      fetchComplaint(complaint.complaint_ref);
    } catch (err: any) {
      setSupporting(false);
      const msg = err.response?.data?.detail || 'Unable to register support.';
      setSupportMessage(msg);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Search Bar */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B3A] tracking-tight">
            Track Road Damage Complaint
          </h1>
          <p className="text-sm text-[#64748B] max-w-md mx-auto">
            Enter your complaint reference code to follow field inspection, repair status, and verified resolution.
          </p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2 pt-2">
            <Input
              placeholder="e.g. RGD-2026-10492"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              className="font-mono text-sm"
            />
            <Button type="submit" variant="primary" isLoading={loading} leftIcon={<Search className="w-4 h-4" />}>
              Search
            </Button>
          </form>
        </div>

        {error && (
          <Card className="p-6 text-center text-xs text-[#DC2626] bg-red-50/50 border-red-200">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-500" />
            <p className="font-semibold">{error}</p>
            <p className="text-slate-500 mt-1">Please verify the code format (e.g. RGD-2026-XXXXX) or submit a new report.</p>
          </Card>
        )}

        {/* Complaint Details Card */}
        {complaint && (
          <div className="space-y-6">
            <Card className="p-6 sm:p-8 space-y-6">
              
              {/* Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[#13856B] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {complaint.complaint_ref}
                    </span>
                    <StatusBadge status={complaint.status} />
                  </div>
                  <h2 className="text-xl font-bold text-[#172B3A]">
                    {complaint.ai_assessment?.damage_label || 'Road Distress Report'}
                  </h2>
                  <p className="text-xs text-[#64748B] flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#13856B]" />
                    {complaint.address_text} ({complaint.ward})
                  </p>
                </div>

                <div className="flex sm:flex-col items-end gap-2 text-right">
                  <div className="text-right">
                    <span className="text-[11px] text-[#64748B] block">Priority Score</span>
                    <span className="text-xl font-extrabold text-[#13856B]">
                      {complaint.ai_assessment?.priority_score || 0} <span className="text-xs font-normal text-slate-500">/ 100</span>
                    </span>
                  </div>
                  <SeverityBadge severity={complaint.ai_assessment?.severity_label || 'Low'} />
                </div>
              </div>

              {/* Grid specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[#64748B] block">Damage Class</span>
                  <DamageClassBadge damageClass={complaint.ai_assessment?.primary_damage_class || 'D00'} />
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[#64748B] block">Road Classification</span>
                  <span className="font-semibold text-[#172B3A] capitalize">{complaint.road_class}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[#64748B] block">Est. Repair Budget</span>
                  <span className="font-semibold text-[#172B3A]">
                    ₹{(complaint.ai_assessment?.estimated_cost_inr || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[#64748B] block">Support Count</span>
                    <span className="font-bold text-[#13856B]">{complaint.support_count || 1} citizens</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSupport}
                    isLoading={supporting}
                    leftIcon={<ThumbsUp className="w-3.5 h-3.5" />}
                  >
                    Upvote
                  </Button>
                </div>
              </div>

              {supportMessage && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-[#13856B]">
                  {supportMessage}
                </div>
              )}

              {/* Status Timeline */}
              <div className="pt-4 border-t border-[#E2E8F0] space-y-4">
                <h3 className="text-base font-bold text-[#172B3A]">Repair Progress Milestones</h3>
                
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {(complaint.status_timeline || []).map((step: any, idx: number) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-[#13856B] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#13856B]" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#172B3A]">{step.status}</span>
                          <span className="text-[#64748B]">{new Date(step.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-[#64748B] leading-relaxed">{step.notes}</p>
                        <span className="inline-block text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                          Logged by: {step.actor}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </Card>

            {/* AI Visualizer with Bounding Box Overlay */}
            {complaint.ai_assessment && (
              <AIAssessmentVisualizer
                imageUrl={complaint.image_url}
                assessment={complaint.ai_assessment}
              />
            )}
          </div>
        )}

      </div>
    </div>
  );
};
