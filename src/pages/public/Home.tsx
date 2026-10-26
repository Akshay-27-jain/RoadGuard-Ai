import React from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  MapPin,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Users2,
  Building2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, DamageClassBadge } from '@/components/ui/Badge';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#E2E8F0] bg-gradient-to-b from-white to-[#F7FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline and Call-to-actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#13856B]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Municipal Road Infrastructure Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#172B3A] tracking-tight leading-[1.15]">
                Intelligent Road Damage Detection & <span className="text-[#13856B]">Municipal Repair</span>
              </h1>

              <p className="text-lg text-[#64748B] leading-relaxed max-w-2xl">
                RoadGuard AI connects citizens with municipal engineers. Report potholes and cracks with automated GPS tagging, AI-verified severity analysis, transparent priority queues, and end-to-end repair tracking.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link to="/report">
                  <Button size="lg" variant="primary" leftIcon={<Camera className="w-5 h-5" />} rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Report Road Damage
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="secondary">
                    Explore Platform
                  </Button>
                </Link>
              </div>

              {/* Verified Trust Indicators */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-6">
                <div>
                  <p className="text-2xl font-bold text-[#172B3A]">4 Classes</p>
                  <p className="text-xs text-[#64748B] font-medium mt-0.5">RDD2022 Compliant</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#13856B]">30-Meter</p>
                  <p className="text-xs text-[#64748B] font-medium mt-0.5">Geo Duplicate Filter</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#172B3A]">100%</p>
                  <p className="text-xs text-[#64748B] font-medium mt-0.5">Transparent Audits</p>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive AI Assessment Visual Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-[#E2E8F0] relative">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-[#172B3A]">AI Vision Telemetry Preview</span>
                  </div>
                  <Badge variant="primary" size="sm">YOLOv11s Active</Badge>
                </div>

                {/* Simulated Road Damage Image with Bounding Boxes */}
                <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-4/3 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-85"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80')`,
                    }}
                  />

                  {/* SVG Overlay representing actual YOLO bounding box */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300">
                    {/* Bounding box for Pothole */}
                    <rect
                      x="90"
                      y="110"
                      width="160"
                      height="100"
                      fill="rgba(220, 38, 38, 0.15)"
                      stroke="#DC2626"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      rx="4"
                    />
                    {/* Label Badge */}
                    <rect x="90" y="86" width="130" height="24" fill="#DC2626" rx="4" />
                    <text x="96" y="102" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                      D40: Pothole (94.2%)
                    </text>
                  </svg>

                  {/* Telemetry pill */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm text-[11px] text-[#172B3A] font-medium flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#13856B]" />
                    <span>Ward 4, MG Road (73.856, 18.520)</span>
                  </div>
                </div>

                {/* AI Assessment Metrics Panel */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-[#64748B] block">Estimated Severity</span>
                    <span className="text-sm font-bold text-[#DC2626] flex items-center gap-1 mt-0.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Critical (D40)
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[11px] text-[#64748B] block">Priority Score</span>
                    <span className="text-sm font-bold text-[#13856B] flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 84.8 / 100
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-[#64748B] pt-2 border-t border-slate-100">
                  <span>Image Quality Gate: <b>PASSED (Laplacian: 142.6)</b></span>
                  <span>Duplicate: <b>Unique (0 candidates)</b></span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="py-16 lg:py-24 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="primary" className="mb-2">Operational Workflow</Badge>
            <h2 className="text-3xl font-bold text-[#172B3A] sm:text-4xl">
              From Citizen Report to Verified Municipal Repair
            </h2>
            <p className="mt-3 text-base text-[#64748B]">
              A 4-step transparent cycle that replaces bureaucratic friction with computer vision intelligence and auditable accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <Card hoverEffect className="relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#13856B] flex items-center justify-center font-bold text-lg mb-5 border border-emerald-100">
                01
              </div>
              <h3 className="text-lg font-semibold text-[#172B3A] mb-2">Snap & Geotag</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Citizens photograph road damage using any smartphone. Browser GPS captures accurate coordinates with fallback pin adjustment.
              </p>
            </Card>

            {/* Step 2 */}
            <Card hoverEffect className="relative">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-lg mb-5 border border-blue-100">
                02
              </div>
              <h3 className="text-lg font-semibold text-[#172B3A] mb-2">AI Damage Detection</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                OpenCV validates image clarity. Ultralytics YOLOv11 classifies damage (pothole or crack) and bounds the exact defect region.
              </p>
            </Card>

            {/* Step 3 */}
            <Card hoverEffect className="relative">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center font-bold text-lg mb-5 border border-amber-100">
                03
              </div>
              <h3 className="text-lg font-semibold text-[#172B3A] mb-2">Priority Dispatch</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Trained XGBoost models calculate an objective repair priority score ($0-100$) and automatically route the work to ward officers.
              </p>
            </Card>

            {/* Step 4 */}
            <Card hoverEffect className="relative">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg mb-5 border border-purple-100">
                04
              </div>
              <h3 className="text-lg font-semibold text-[#172B3A] mb-2">Verified Resolution</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Officers execute repairs and upload completion photos. Lead officers audit side-by-side evidence before closing the complaint.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. ROAD DAMAGE CATEGORIES SECTION */}
      <section className="py-16 lg:py-24 bg-[#F7FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="secondary" className="mb-2">Damage Taxonomy</Badge>
            <h2 className="text-3xl font-bold text-[#172B3A] sm:text-4xl">
              Road Distress Classes Recognized by RoadGuard AI
            </h2>
            <p className="mt-3 text-base text-[#64748B]">
              Standardized against the international Road Damage Dataset (RDD2022) for rigorous classification and targeted engineering repair.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hoverEffect className="border-t-4 border-t-[#DC2626]">
              <DamageClassBadge damageClass="D40" className="mb-3" />
              <h3 className="text-lg font-semibold text-[#172B3A] mb-1">D40 — Pothole</h3>
              <p className="text-xs text-[#64748B] mb-3">Bowl-shaped depressions with structural asphalt failure.</p>
              <div className="text-xs space-y-1 text-slate-700 pt-2 border-t border-slate-100">
                <p><b>Hazard Level:</b> Severe / Critical</p>
                <p><b>Typical Fix:</b> Cold/hot asphalt patch</p>
              </div>
            </Card>

            <Card hoverEffect className="border-t-4 border-t-[#D97706]">
              <DamageClassBadge damageClass="D20" className="mb-3" />
              <h3 className="text-lg font-semibold text-[#172B3A] mb-1">D20 — Alligator Crack</h3>
              <p className="text-xs text-[#64748B] mb-3">Interconnected series of fatigue cracks resembling reptilian skin.</p>
              <div className="text-xs space-y-1 text-slate-700 pt-2 border-t border-slate-100">
                <p><b>Hazard Level:</b> High structural distress</p>
                <p><b>Typical Fix:</b> Full-depth subgrade repair</p>
              </div>
            </Card>

            <Card hoverEffect className="border-t-4 border-t-[#2563EB]">
              <DamageClassBadge damageClass="D00" className="mb-3" />
              <h3 className="text-lg font-semibold text-[#172B3A] mb-1">D00 — Longitudinal</h3>
              <p className="text-xs text-[#64748B] mb-3">Cracks parallel to the roadway centerline or paving joint.</p>
              <div className="text-xs space-y-1 text-slate-700 pt-2 border-t border-slate-100">
                <p><b>Hazard Level:</b> Medium water ingress risk</p>
                <p><b>Typical Fix:</b> Bitumen crack sealing</p>
              </div>
            </Card>

            <Card hoverEffect className="border-t-4 border-t-[#2563EB]">
              <DamageClassBadge damageClass="D10" className="mb-3" />
              <h3 className="text-lg font-semibold text-[#172B3A] mb-1">D10 — Transverse</h3>
              <p className="text-xs text-[#64748B] mb-3">Cracks perpendicular to the roadway centerline caused by thermal shrinkage.</p>
              <div className="text-xs space-y-1 text-slate-700 pt-2 border-t border-slate-100">
                <p><b>Hazard Level:</b> Medium ride discomfort</p>
                <p><b>Typical Fix:</b> Routing and joint sealing</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. DUAL PORTAL CAPABILITIES (CITIZENS & AUTHORITIES) */}
      <section className="py-16 lg:py-24 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Citizens Section */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-semibold">
                <Users2 className="w-4 h-4" /> For Citizens
              </div>
              <h2 className="text-3xl font-bold text-[#172B3A]">
                Empowering Community Voices With Transparent Tracking
              </h2>
              <p className="text-base text-[#64748B] leading-relaxed">
                Say goodbye to unacknowledged helplines. RoadGuard AI gives every citizen a real-time tracking reference, transparent AI analysis feedback, and updates as their complaint moves through repair.
              </p>
              <ul className="space-y-3">
                {[
                  'Instant camera upload with automatic GPS location extraction',
                  'Immediate image quality feedback and defect bounding box display',
                  'One-click support button to upvote existing issues without duplicate spam',
                  'Live status timeline with timestamped officer inspection notes',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#172B3A]">
                    <CheckCircle2 className="w-5 h-5 text-[#13856B] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Link to="/register">
                  <Button variant="primary">Create Citizen Account</Button>
                </Link>
              </div>
            </div>

            {/* Municipal Authority Section */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#13856B] text-xs font-semibold">
                <Building2 className="w-4 h-4" /> For Municipal Authorities
              </div>
              <h2 className="text-3xl font-bold text-[#172B3A]">
                Intelligent Dispatch & Operational Command Center
              </h2>
              <p className="text-base text-[#64748B] leading-relaxed">
                Equip municipal road engineers, ward superintendents, and administrators with an operational control room that automatically prioritizes high-risk hazards.
              </p>
              <ul className="space-y-3">
                {[
                  'XGBoost priority ranking driven by road traffic, severity, and age',
                  'Geospatial duplicate grouping to prevent wasted field inspections',
                  'Side-by-side before/after repair verification to guarantee quality',
                  'Interactive density heatmaps and ward-level repair budget tracking',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#172B3A]">
                    <CheckCircle2 className="w-5 h-5 text-[#13856B] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Link to="/login">
                  <Button variant="secondary">Access Officer Portal</Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="py-16 bg-[#13856B] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Help Make Our City's Roads Safer?
          </h2>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Report a pothole in under 30 seconds. No bureaucratic paperwork, no obscure office visits — just verified municipal resolution.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link to="/report">
              <Button size="lg" className="bg-white text-[#13856B] hover:bg-slate-100 shadow-md">
                Report Damage Now
              </Button>
            </Link>
            <Link to="/safety">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Road Safety Guidelines
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
