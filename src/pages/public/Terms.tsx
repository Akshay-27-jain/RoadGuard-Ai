import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7FAFC] py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-3">
          <Badge variant="secondary">User Agreement</Badge>
          <h1 className="text-3xl font-extrabold text-[#172B3A]">Terms of Service</h1>
          <p className="text-xs text-[#64748B]">Last updated: October 2026 • Municipal Civic Engagement Standard</p>
        </div>

        <Card className="p-8 space-y-6 text-sm text-[#172B3A] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172B3A]">1. Acceptance of Terms</h2>
            <p className="text-[#64748B]">
              By accessing or using the RoadGuard AI platform to submit road damage reports or monitor municipal repairs, you agree to comply with and be bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172B3A]">2. Honest & Safe Citizen Reporting</h2>
            <p className="text-[#64748B]">
              Users agree to report genuine road hazards and maintain personal safety during photography. Submitting malicious, forged, abusive, or non-road media is strictly prohibited and subject to account suspension.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172B3A]">3. Municipal Authority Discretion</h2>
            <p className="text-[#64748B]">
              While RoadGuard AI provides objective AI priority scoring, actual dispatch schedules and resource allocations remain subject to official municipal engineering timelines, safety priorities, and emergency civil response.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172B3A]">4. Intellectual Property & AI Models</h2>
            <p className="text-[#64748B]">
              The underlying algorithms, trained YOLOv11 and XGBoost weights, geospatial clustering services, and user interfaces are proprietary to RoadGuard AI and its municipal civic partners.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
};
