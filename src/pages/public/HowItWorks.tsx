import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Cpu, Layers, ArrowRight, ShieldAlert, Sparkles, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Citizen Captures Road Photograph & Geolocation',
      icon: <Camera className="w-6 h-6 text-[#13856B]" />,
      description: 'The reporting citizen photographs the road surface. Using HTML5 browser geolocation (or manual pin drop on the interactive Leaflet map), accurate GPS coordinates and ward jurisdiction are recorded.',
      technicalDetails: 'Extracts WGS84 coordinates (latitude/longitude), sets 30-meter proximity bounding box, checks device orientation, and prepares secure multipart payload.',
    },
    {
      num: '02',
      title: 'OpenCV Quality Validation & Image Filtering',
      icon: <ShieldAlert className="w-6 h-6 text-[#2563EB]" />,
      description: 'Before running expensive deep learning inference, the system validates that the photograph is clear, adequately illuminated, and suitable for municipal engineering evaluation.',
      technicalDetails: 'Laplacian variance filter detects motion blur (threshold > 50.0). Grayscale pixel mean checks for dark night photos (brightness > 30.0) or overexposure (< 230.0).',
    },
    {
      num: '03',
      title: 'Ultralytics YOLOv11s Damage Detection',
      icon: <Cpu className="w-6 h-6 text-[#D97706]" />,
      description: 'The trained YOLOv11s model evaluates the image in single-pass inference, predicting bounding boxes and normalized damage classes conforming to RDD2022 standards.',
      technicalDetails: 'Classifies D40 (Pothole), D00 (Longitudinal Crack), D10 (Transverse Crack), D20 (Alligator Crack), and Edge Breaks with normalized confidence scores.',
    },
    {
      num: '04',
      title: 'Geospatial Deduplication & Community Support',
      icon: <Layers className="w-6 h-6 text-[#7C3AED]" />,
      description: 'The system queries MongoDB 2dsphere indexes to check if an existing open complaint exists within a 30-meter radius. If a duplicate is detected, it links candidate records and increments support count rather than cluttering municipal dispatch.',
      technicalDetails: 'MongoDB $geoNear aggregation with 30m maximum distance and matching damage class grouping.',
    },
    {
      num: '05',
      title: 'XGBoost Priority Scoring & Cost Estimation',
      icon: <Sparkles className="w-6 h-6 text-[#059669]" />,
      description: 'A trained gradient-boosted decision tree calculates an objective priority score (0–100) based on damage severity, road classification (Highway vs Arterial vs Local), repair recency, and community votes.',
      technicalDetails: '8-feature XGBoost regressor model (models/xgb_priority.json) generates priority bucket. 5-feature XGBoost model (models/xgb_cost.json) computes estimated repair budget in INR.',
    },
    {
      num: '06',
      title: 'Officer Field Repair & Verification Audit',
      icon: <FileCheck className="w-6 h-6 text-[#172B3A]" />,
      description: 'Assigned municipal officers inspect the site, mark work in progress, and upload after-repair photographic evidence upon completion. Lead engineers audit side-by-side evidence before official closure.',
      technicalDetails: 'Status transitions: SUBMITTED → UNDER_REVIEW → ASSIGNED → IN_PROGRESS → REPAIR_SUBMITTED → VERIFICATION_PENDING → RESOLVED with immutable audit trail.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC] py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <Badge variant="primary">Architecture & Logic</Badge>
          <h1 className="text-4xl font-extrabold text-[#172B3A] tracking-tight">
            How RoadGuard AI Works Under The Hood
          </h1>
          <p className="text-base text-[#64748B] leading-relaxed">
            A step-by-step breakdown of how modern computer vision, geospatial indexing, and municipal workflow engineering work together to repair roads faster.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-8">
          {steps.map((step) => (
            <Card key={step.num} hoverEffect className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                  {step.icon}
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#13856B] uppercase tracking-wider">Step {step.num}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#172B3A]">{step.title}</h3>
                  <p className="text-sm text-[#172B3A] leading-relaxed">{step.description}</p>
                  
                  {/* Technical Deep Dive Callout */}
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-[#64748B]">
                    <span className="font-semibold text-[#172B3A]">Engineering Specification: </span>
                    {step.technicalDetails}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm text-center space-y-4">
          <h3 className="text-2xl font-bold text-[#172B3A]">Experience the Workflow in Action</h3>
          <p className="text-sm text-[#64748B] max-w-xl mx-auto">
            Ready to test road damage detection? Submit a sample road photograph and watch the quality check and AI bounding box pipeline execute.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to="/report">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Try Live Damage Report
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
