import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Bike, Car, CloudRain } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const SafetyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7FAFC] py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <Badge variant="warning">Public Awareness</Badge>
          <h1 className="text-4xl font-extrabold text-[#172B3A] tracking-tight">
            Road Safety & Civic Infrastructure Care
          </h1>
          <p className="text-base text-[#64748B] leading-relaxed">
            Road defects cause thousands of preventable accidents each year. Timely citizen reporting coupled with proactive municipal maintenance saves lives.
          </p>
        </div>

        {/* Emergency Contacts Banner */}
        <div className="mb-12 p-6 rounded-2xl bg-white border border-red-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#172B3A]">Urgent Road Hazards & Emergency Helplines</h3>
                <p className="text-xs text-[#64748B]">For life-threatening cave-ins, collapsed bridges, or active accidents:</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="px-3 py-1.5 bg-red-100 text-red-800 rounded-lg">National Police: 112</span>
              <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg">Ambulance: 108</span>
              <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg">NHAI Highway Helpline: 1033</span>
            </div>
          </div>
        </div>

        {/* Key Risk Areas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {/* Two-Wheelers */}
          <Card className="border-t-4 border-t-[#D97706]">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center mb-4">
              <Bike className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#172B3A] mb-2">Two-Wheeler Vulnerability</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Motorcyclists and cyclists represent over 60% of pothole-related casualties. Hidden edges and deep waterlogged cracks can cause sudden loss of balance.
            </p>
          </Card>

          {/* Monsoon Waterlogging */}
          <Card className="border-t-4 border-t-[#2563EB]">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-4">
              <CloudRain className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#172B3A] mb-2">Monsoon Submerged Hazards</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Rainwater obscures pothole depths. When driving in rain, avoid standing water puddles on unfamiliar roads and report pre-monsoon road cracks immediately.
            </p>
          </Card>

          {/* Vehicle Damage & Braking */}
          <Card className="border-t-4 border-t-[#DC2626]">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center mb-4">
              <Car className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#172B3A] mb-2">Sudden Swerving Risks</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Abrupt braking or swerving into adjacent lanes to dodge potholes causes high-speed rear-end collisions. Maintain safe following distances.
            </p>
          </Card>
        </div>

        {/* Defensive Driving Tips */}
        <div className="space-y-6 mb-14">
          <h2 className="text-2xl font-bold text-[#172B3A]">Defensive Driving & Navigation Guidelines</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
              <h4 className="text-sm font-semibold text-[#172B3A]">1. Never Brake Directly Inside a Pothole</h4>
              <p className="text-xs text-[#64748B]">
                Slow down before reaching the pothole, then release the brake pedal before impact. Braking locks the wheel and concentrates violent suspension shock.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
              <h4 className="text-sm font-semibold text-[#172B3A]">2. Maintain Proper Tire Inflation</h4>
              <p className="text-xs text-[#64748B]">
                Properly inflated tires form a resilient cushion protecting rims, wheel bearings, and suspension struts from catastrophic rim cracks.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
              <h4 className="text-sm font-semibold text-[#172B3A]">3. Double Follow Distance at Night</h4>
              <p className="text-xs text-[#64748B]">
                Headlights illuminate road surface irregularities only 20 to 30 meters ahead. Lower speeds grant critical reaction time to steer safely.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] space-y-1">
              <h4 className="text-sm font-semibold text-[#172B3A]">4. Report Potholes Before Accidents Happen</h4>
              <p className="text-xs text-[#64748B]">
                Taking 30 seconds to report a pothole on RoadGuard AI ensures municipal maintenance teams can patch it before a commuter is harmed.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link to="/report">
            <Button size="lg" variant="primary">
              Report an Unsafe Road Defect
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};
