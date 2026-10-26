import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  BarChart3,
  ShieldCheck,
  MapPin,
  Clock,
  Camera,
  Users,
  FileSpreadsheet,
  History,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const FeaturesPage: React.FC = () => {
  const featureGroups = [
    {
      category: 'Computer Vision & AI Intelligence',
      badge: 'Core Technology',
      features: [
        {
          title: 'Ultralytics YOLOv11s Object Detection',
          desc: 'Trained on the RDD2022 India road damage dataset for bounding box localization of potholes, alligator cracks, longitudinal cracks, and edge breaks.',
          icon: <Cpu className="w-5 h-5 text-[#13856B]" />,
        },
        {
          title: 'Automated OpenCV Image Quality Gate',
          desc: 'Filters out motion-blurred, underexposed night shots, and overexposed glare photographs before committing to backend inference.',
          icon: <Camera className="w-5 h-5 text-[#2563EB]" />,
        },
        {
          title: 'XGBoost Priority Prediction Engine',
          desc: 'A validated gradient-boosted decision tree with 8 structured input features delivering an objective repair priority rating from 0 to 100.',
          icon: <BarChart3 className="w-5 h-5 text-[#D97706]" />,
        },
        {
          title: 'Data-Driven Repair Cost Estimator',
          desc: 'Regression model estimating road repair budget in INR based on damage surface area, road class, and distress category.',
          icon: <FileSpreadsheet className="w-5 h-5 text-[#059669]" />,
        },
      ],
    },
    {
      category: 'Citizen & Community Experience',
      badge: 'Civic Engagement',
      features: [
        {
          title: 'One-Click Geotagged Reporting',
          desc: 'Citizens can report issues in under 30 seconds with automatic GPS coordinate detection and manual map pin verification.',
          icon: <MapPin className="w-5 h-5 text-[#13856B]" />,
        },
        {
          title: 'Transparent Status Timeline',
          desc: 'Full visibility from initial report submission to field inspection, repair start, and final resolution with timestamped officer logs.',
          icon: <Clock className="w-5 h-5 text-[#2563EB]" />,
        },
        {
          title: 'Idempotent Community Upvoting',
          desc: 'Prevents duplicate ticket generation by allowing nearby residents to support existing complaints with a single click.',
          icon: <Users className="w-5 h-5 text-[#D97706]" />,
        },
        {
          title: 'Personal Complaint History',
          desc: 'Citizens maintain a private portal tracking all their submitted reports, resolutions, and municipal feedback.',
          icon: <History className="w-5 h-5 text-[#7C3AED]" />,
        },
      ],
    },
    {
      category: 'Municipal Governance & Security',
      badge: 'Enterprise Security',
      features: [
        {
          title: 'Role-Based Access Control (RBAC)',
          desc: 'Strict multi-tier permission boundaries separating Citizen, Municipal Officer, and Super Administrator privileges on the backend.',
          icon: <Lock className="w-5 h-5 text-[#DC2626]" />,
        },
        {
          title: '30-Meter Geospatial Deduplication',
          desc: 'MongoDB 2dsphere proximity search automatically detects and groups neighboring complaints to eliminate redundant officer dispatches.',
          icon: <Layers className="w-5 h-5 text-[#13856B]" />,
        },
        {
          title: 'Side-by-Side Repair Verification',
          desc: 'Requires authenticated before and after photographs before any road defect can be marked as officially resolved in the public database.',
          icon: <ShieldCheck className="w-5 h-5 text-[#2563EB]" />,
        },
        {
          title: 'Municipal Density Heatmaps',
          desc: 'Interactive OpenStreetMap visualization highlighting spatial clusters, ward performance, and urgent repair hotspots.',
          icon: <MapPin className="w-5 h-5 text-[#059669]" />,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="primary">Comprehensive Capabilities</Badge>
          <h1 className="text-4xl font-extrabold text-[#172B3A] tracking-tight">
            Built for Real Municipal Operations
          </h1>
          <p className="text-base text-[#64748B] leading-relaxed">
            Every feature in RoadGuard AI is engineered to solve a verified bottleneck in city road maintenance, from subjective inspections to duplicate complaints and unverified repairs.
          </p>
        </div>

        {/* Feature Groups */}
        <div className="space-y-16">
          {featureGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{group.badge}</Badge>
                <h2 className="text-2xl font-bold text-[#172B3A]">{group.category}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {group.features.map((feat, fIdx) => (
                  <Card key={fIdx} hoverEffect className="flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
                        {feat.icon}
                      </div>
                      <h3 className="text-base font-semibold text-[#172B3A] mb-2">{feat.title}</h3>
                      <p className="text-xs text-[#64748B] leading-relaxed">{feat.desc}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-20 p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-[#172B3A]">Start Reporting Road Defects Today</h3>
            <p className="text-sm text-[#64748B] mt-1">Join citizens and municipal officers improving our transportation infrastructure.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/report">
              <Button variant="primary">Report Road Damage</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary">Create Account</Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
