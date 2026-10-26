import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const ReportingGuidePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7FAFC] py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <Badge variant="primary">Citizen Guidelines</Badge>
          <h1 className="text-4xl font-extrabold text-[#172B3A] tracking-tight">
            How to Submit an Effective Road Damage Report
          </h1>
          <p className="text-base text-[#64748B] leading-relaxed">
            Follow these simple best practices to ensure your photograph passes the automated AI quality check and provides municipal officers with the exact information needed for immediate dispatch.
          </p>
        </div>

        {/* Safety First Alert */}
        <div className="mb-10 p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-[#D97706] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-900">Personal Safety Comes First</h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Never stand in the middle of active traffic to take a photo. Always photograph road damage safely from the pedestrian sidewalk or footpath. If reporting on a highway, remain inside your vehicle or behind roadside safety barriers.
            </p>
          </div>
        </div>

        {/* Good vs Bad Photos Comparison */}
        <div className="space-y-6 mb-14">
          <h2 className="text-2xl font-bold text-[#172B3A]">Photo Quality Criteria</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Good Photo Card */}
            <Card className="border-t-4 border-t-emerald-500">
              <div className="flex items-center gap-2 mb-4 text-[#13856B]">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-bold text-base text-[#172B3A]">Ideal Road Photo (Passes AI)</h3>
              </div>
              <ul className="space-y-3 text-xs text-[#172B3A]">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#13856B]">✓</span>
                  <span><b>Sharp & In Focus:</b> The crack or pothole edges are distinctly sharp (Laplacian variance &gt; 50).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#13856B]">✓</span>
                  <span><b>Daylight Illumination:</b> Natural daylight without extreme glare or pitch-black darkness.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#13856B]">✓</span>
                  <span><b>Clear Perspective:</b> Shot from an oblique 45° angle showing both the defect and nearby road context.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#13856B]">✓</span>
                  <span><b>Accurate GPS:</b> Captured directly at the damage site with device location enabled.</span>
                </li>
              </ul>
            </Card>

            {/* Bad Photo Card */}
            <Card className="border-t-4 border-t-red-500">
              <div className="flex items-center gap-2 mb-4 text-[#DC2626]">
                <XCircle className="w-5 h-5" />
                <h3 className="font-bold text-base text-[#172B3A]">Unusable Photo (Rejected by AI)</h3>
              </div>
              <ul className="space-y-3 text-xs text-[#172B3A]">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#DC2626]">✕</span>
                  <span><b>Motion Blur:</b> Taking a picture while moving quickly in a car causes unreadable blur.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#DC2626]">✕</span>
                  <span><b>Night Darkness:</b> Dark night shots without streetlights lack sufficient pixel contrast.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#DC2626]">✕</span>
                  <span><b>Zoomed Too Far:</b> Pothole is a tiny speck in the horizon; the detector cannot calculate bounding boxes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#DC2626]">✕</span>
                  <span><b>Non-Road Objects:</b> Pictures of car dashboards, tires, or indoor surfaces are automatically filtered out.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* 4 Steps Checklist */}
        <div className="space-y-6 mb-14">
          <h2 className="text-2xl font-bold text-[#172B3A]">Step-by-Step Reporting Checklist</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-[#E2E8F0]">
              <span className="text-xs font-bold text-[#13856B]">1. Position Safely</span>
              <p className="text-xs text-[#64748B] mt-1">Stand safely on the curb or shoulder facing the roadway damage.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E2E8F0]">
              <span className="text-xs font-bold text-[#13856B]">2. Enable GPS</span>
              <p className="text-xs text-[#64748B] mt-1">Allow your browser location access when prompted for pinpoint accuracy.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E2E8F0]">
              <span className="text-xs font-bold text-[#13856B]">3. Review AI Box</span>
              <p className="text-xs text-[#64748B] mt-1">Check the predicted bounding box and severity rating on screen.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E2E8F0]">
              <span className="text-xs font-bold text-[#13856B]">4. Track Reference</span>
              <p className="text-xs text-[#64748B] mt-1">Save your tracking code (e.g. RGD-2026-XXXXX) to follow repair milestones.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link to="/report">
            <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Road Damage Report Form
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};
