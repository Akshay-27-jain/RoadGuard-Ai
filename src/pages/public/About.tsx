import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, HeartHandshake, Cpu, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7FAFC] py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <Badge variant="primary">Civic Tech Mission</Badge>
          <h1 className="text-4xl font-extrabold text-[#172B3A] tracking-tight">
            About RoadGuard AI
          </h1>
          <p className="text-base text-[#64748B] leading-relaxed">
            An intelligent civic technology initiative bridging citizen awareness and municipal infrastructure maintenance with auditable AI engineering.
          </p>
        </div>

        {/* Mission Card */}
        <Card className="p-8 mb-12 border-l-4 border-l-[#13856B]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#13856B] flex items-center justify-center shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#172B3A]">Our Mission</h2>
              <p className="text-sm text-[#64748B] leading-relaxed">
                Traditional road complaint systems fail because they rely on vague phone descriptions, subjective paper inspections, and noisy duplicate reports. RoadGuard AI was created to solve these exact problems through verified computer vision, automated geospatial deduplication, and data-driven repair prioritization.
              </p>
            </div>
          </div>
        </Card>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <Card className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#13856B] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#172B3A]">100% Engineering Honesty</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              We never fabricate AI accuracy metrics or simulate fake models. Where trained models exist (YOLOv11s and XGBoost), we execute them directly; where data is pending, we use transparent rules.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#172B3A]">Citizen-Authority Partnership</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              We don't just dump complaints into a void. We give citizens an active voice and equip municipal engineers with structured, prioritizeable work queues.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#172B3A]">Standardized Datasets</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              RoadGuard AI aligns with the international Road Damage Dataset (RDD2022) taxonomy, ensuring our damage classes (D00, D10, D20, D40) reflect genuine civil engineering standards.
            </p>
          </Card>
        </div>

        {/* Architecture Summary */}
        <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4 mb-14">
          <h3 className="text-lg font-bold text-[#172B3A]">Modern Production Stack</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#64748B]">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="font-bold text-[#172B3A] block">Frontend</span>
              React 18 + Vite + TypeScript + Tailwind
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="font-bold text-[#172B3A] block">Backend</span>
              FastAPI (Python 3.14) + Pydantic v2
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="font-bold text-[#172B3A] block">Database</span>
              MongoDB with 2dsphere Geo-Indexes
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="font-bold text-[#172B3A] block">AI Models</span>
              YOLOv11s + OpenCV + XGBoost 3.3
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/contact">
            <Button size="lg" variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Connect with Our Engineering Team
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};
