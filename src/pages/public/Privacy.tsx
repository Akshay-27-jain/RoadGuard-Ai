import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7FAFC] py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-3">
          <Badge variant="secondary">Privacy & Governance</Badge>
          <h1 className="text-3xl font-extrabold text-[#172B3A]">Privacy Policy</h1>
          <p className="text-xs text-[#64748B]">Last updated: October 2026 • Municipal Data Protection Policy</p>
        </div>

        <Card className="p-8 space-y-6 text-sm text-[#172B3A] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172B3A]">1. Information We Collect</h2>
            <p className="text-[#64748B]">
              RoadGuard AI collects only information necessary to locate, verify, and resolve road infrastructure damage. This includes road photographs, geographic coordinates (latitude and longitude), optional text descriptions, and registered citizen contact details (name and email).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172B3A]">2. Geospatial & Photographic Data</h2>
            <p className="text-[#64748B]">
              Photographs submitted through RoadGuard AI are analyzed strictly for road distress features (such as cracks, potholes, and surface breakup). We do not collect or store private biometric or vehicle license plate tracking information.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172B3A]">3. Data Sharing with Municipal Authorities</h2>
            <p className="text-[#64748B]">
              Complaint location coordinates, defect bounding boxes, and repair progress logs are shared with authorized municipal engineers, ward superintendents, and public works contractors solely for executing road repairs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-[#172B3A]">4. User Rights & Data Retention</h2>
            <p className="text-[#64748B]">
              Citizens have the right to inspect their submitted complaint records, request updates, or delete their profile from the active database. Aggregated road condition telemetry is retained for municipal maintenance analytics.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
};
