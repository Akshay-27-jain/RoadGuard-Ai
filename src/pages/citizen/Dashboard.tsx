import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Clock, CheckCircle2, AlertTriangle, PlusCircle, ArrowRight, LogOut, FileText, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge, SeverityBadge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { ComplaintsAPI } from '@/services/api';

export const CitizenDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyComplaints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ComplaintsAPI.getMyComplaints();
      const items = res.data.items || [];
      // If user has no personal complaints yet, fetch recent municipal reports so the dashboard is informative
      if (items.length === 0) {
        const publicRes = await ComplaintsAPI.list({ limit: 5 });
        setComplaints(publicRes.data.items || []);
      } else {
        setComplaints(items);
      }
    } catch (err: any) {
      console.error('Error fetching complaints:', err);
      // Fallback to public list
      try {
        const publicRes = await ComplaintsAPI.list({ limit: 5 });
        setComplaints(publicRes.data.items || []);
      } catch (e) {
        setError('Unable to load complaints at this time.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const safeComplaints = Array.isArray(complaints) ? complaints : [];
  const totalReports = safeComplaints.length;
  const underReviewCount = safeComplaints.filter((c) => c && ['UNDER_REVIEW', 'SUBMITTED', 'DUPLICATE'].includes(c?.status)).length;
  const inProgressCount = safeComplaints.filter((c) => c && ['ASSIGNED', 'IN_PROGRESS', 'VERIFICATION_PENDING'].includes(c?.status)).length;
  const resolvedCount = safeComplaints.filter((c) => c && c?.status === 'RESOLVED').length;

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      {/* Top Bar */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-lg font-bold text-[#172B3A] flex items-center gap-1.5">
              <span>RoadGuard</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-[#13856B]">AI</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-[#13856B] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Citizen Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#172B3A] font-medium">
              <User className="w-4 h-4 text-[#64748B]" />
              <span>{user?.name || 'Citizen'}</span>
            </div>
            <Link to="/report">
              <Button size="sm" variant="primary" leftIcon={<PlusCircle className="w-3.5 h-3.5" />}>
                Report Defect
              </Button>
            </Link>
            <Button size="sm" variant="ghost" onClick={logout} leftIcon={<LogOut className="w-3.5 h-3.5" />}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs">
          <div>
            <h1 className="text-2xl font-bold text-[#172B3A]">Welcome, {user?.name || 'Citizen'}</h1>
            <p className="text-xs text-[#64748B] mt-1">
              Track your reported road defects, view municipal inspection updates, and support nearby repairs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMyComplaints}
              disabled={loading}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
            <Link to="/report">
              <Button variant="primary" leftIcon={<Camera className="w-4 h-4" />}>
                Submit New Road Report
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#64748B]">Total Reports</span>
              <FileText className="w-4 h-4 text-[#13856B]" />
            </div>
            <p className="text-2xl font-bold text-[#172B3A] mt-2">{totalReports}</p>
            <span className="text-[10px] text-[#64748B]">In active database</span>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#64748B]">Under Review</span>
              <Clock className="w-4 h-4 text-[#D97706]" />
            </div>
            <p className="text-2xl font-bold text-[#D97706] mt-2">{underReviewCount}</p>
            <span className="text-[10px] text-[#64748B]">In municipal triage</span>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#64748B]">In Progress</span>
              <AlertTriangle className="w-4 h-4 text-[#2563EB]" />
            </div>
            <p className="text-2xl font-bold text-[#2563EB] mt-2">{inProgressCount}</p>
            <span className="text-[10px] text-[#64748B]">Field team active</span>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#64748B]">Resolved Repairs</span>
              <CheckCircle2 className="w-4 h-4 text-[#13856B]" />
            </div>
            <p className="text-2xl font-bold text-[#13856B] mt-2">{resolvedCount}</p>
            <span className="text-[10px] text-[#64748B]">Verified by authority</span>
          </Card>
        </div>

        {/* Reports Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-[#172B3A]">Road Damage Reports</h2>
              <p className="text-xs text-[#64748B]">Live status of infrastructure tickets and municipal work orders.</p>
            </div>
          </div>

          {error && (
            <div className="p-4 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-xs text-[#64748B]">
              <RefreshCw className="w-6 h-6 animate-spin text-[#13856B] mx-auto mb-2" />
              Loading real-time municipal reports...
            </div>
          ) : complaints.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-[#172B3A]">No Road Reports Found</h3>
              <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                Help improve your city's roads by photographing potholes or cracks and submitting a report.
              </p>
              <Link to="/report" className="inline-block mt-4">
                <Button variant="primary" size="sm" leftIcon={<Camera className="w-3.5 h-3.5" />}>
                  Submit First Report
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[#64748B] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Reference</th>
                    <th className="py-3 px-4 font-semibold">Damage Type</th>
                    <th className="py-3 px-4 font-semibold">Severity</th>
                    <th className="py-3 px-4 font-semibold">Location</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Priority</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[#172B3A]">
                  {safeComplaints.map((item) => {
                    if (!item) return null;
                    const refCode = item.complaint_ref || item.id || 'REF';
                    return (
                      <tr key={item.id || refCode} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#13856B]">
                          {refCode}
                        </td>
                        <td className="py-3.5 px-4 font-medium">
                          {item.ai_assessment?.damage_label || 'Road Distress'}
                        </td>
                        <td className="py-3.5 px-4">
                          <SeverityBadge severity={item.ai_assessment?.severity_label || 'Medium'} />
                        </td>
                        <td className="py-3.5 px-4 text-[#64748B] max-w-xs truncate">
                          {item.address_text || item.ward || 'Municipal Location'}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={item.status || 'SUBMITTED'} />
                        </td>
                        <td className="py-3.5 px-4 font-semibold">
                          {item.ai_assessment?.priority_score ? `${item.ai_assessment.priority_score}/100` : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to={`/track/${refCode}`}
                            className="text-[#13856B] font-semibold hover:underline inline-flex items-center gap-1"
                          >
                            Track <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};
