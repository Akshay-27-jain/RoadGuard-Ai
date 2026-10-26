import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ward: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate real feedback state
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <Badge variant="primary">Support & Inquiries</Badge>
          <h1 className="text-4xl font-extrabold text-[#172B3A] tracking-tight">
            Contact RoadGuard AI Municipal Support
          </h1>
          <p className="text-base text-[#64748B] leading-relaxed">
            Have questions about a complaint reference, municipal ward onboarding, or system integration? Our civic technology support desk is ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-[#172B3A] pb-3 border-b border-slate-100">
                Municipal Coordination Desk
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#13856B] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#172B3A]">Headquarters</h4>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                      Road Maintenance & Public Works Department<br />
                      Civic Centre, Municipal Complex<br />
                      Pune, Maharashtra 411001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#172B3A]">Official Email</h4>
                    <p className="text-xs text-[#64748B] mt-0.5">support@roadguard.ai</p>
                    <p className="text-xs text-[#64748B]">ward-coordination@roadguard.ai</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#172B3A]">Citizen Helpline</h4>
                    <p className="text-xs text-[#64748B] mt-0.5">Toll Free: 1800-ROADS-AI (9:00 AM – 6:00 PM)</p>
                    <p className="text-xs text-[#64748B]">Emergency Highway Cell: 1033</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Municipal Advisory */}
            <Card className="p-6 bg-emerald-50/50 border-emerald-200">
              <div className="flex items-center gap-2 mb-2 text-[#13856B] font-bold text-sm">
                <MessageSquare className="w-4 h-4" /> Reporting Specific Damage?
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                If you are contacting us to report an active pothole, please use the direct <span className="font-semibold text-[#13856B]">Report Road Damage</span> form instead so our computer vision pipeline can automatically log your GPS coordinates.
              </p>
            </Card>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <Card className="p-8">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#13856B] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[#172B3A]">Message Delivered Successfully</h3>
                  <p className="text-sm text-[#64748B] max-w-md mx-auto">
                    Thank you, {formData.name}. Our municipal technical desk has logged your ticket and will respond to <span className="font-semibold">{formData.email}</span> within 24 business hours.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', ward: '', subject: '', message: '' });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-[#172B3A] mb-4">Send Us a Message</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Your Name"
                      placeholder="e.g. Ramesh Patil"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="you@domain.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Municipal Ward / Area"
                      placeholder="e.g. Ward 4 / Kothrud"
                      value={formData.ward}
                      onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    />
                    <Input
                      label="Subject"
                      placeholder="e.g. Complaint Reference Query"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#172B3A] mb-1.5">
                      Message Details <span className="text-[#DC2626]">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Please provide complete context regarding your inquiry or feedback..."
                      className="block w-full rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-sm text-[#172B3A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#13856B] focus:border-transparent transition-colors"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className="pt-2">
                    <Button type="submit" size="lg" variant="primary" leftIcon={<Send className="w-4 h-4" />}>
                      Submit Inquiries
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>

        </div>

      </div>
    </div>
  );
};
