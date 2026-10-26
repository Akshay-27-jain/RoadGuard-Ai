import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LogOut,
  RefreshCw,
  LayoutDashboard,
  FileText,
  CheckCircle,
  Users,
  Copy,
  Map as MapIcon,
  ShieldCheck,
  UserPlus,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge, SeverityBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { MunicipalMap } from '@/components/maps/MunicipalMap';
import { useAuth } from '@/context/AuthContext';
import { AdminAPI, ComplaintsAPI } from '@/services/api';

export const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'complaints' | 'verification' | 'officers' | 'duplicates' | 'map' | 'audit'
  >('overview');

  // Data states
  const [overview, setOverview] = useState<any | null>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [officers, setOfficers] = useState<any[]>([]);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals state
  const [assignModalComplaint, setAssignModalComplaint] = useState<any | null>(null);
  const [selectedOfficerId, setSelectedOfficerId] = useState<string>('');
  const [assignmentNotes, setAssignmentNotes] = useState<string>('');
  const [assigning, setAssigning] = useState(false);

  const [verifyModalComplaint, setVerifyModalComplaint] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [verificationNotes, setVerificationNotes] = useState<string>('');
  const [verifying, setVerifying] = useState(false);

  const [createOfficerModalOpen, setCreateOfficerModalOpen] = useState(false);
  const [newOfficer, setNewOfficer] = useState({
    name: '',
    email: '',
    password: '',
    ward: 'Ward 4 - Central',
    department: 'Roads & Civil Infrastructure',
    phone: '',
  });
  const [creatingOfficer, setCreatingOfficer] = useState(false);

  // Filter state for complaints tab
  const [filterWard, setFilterWard] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<string>('');

  const loadAllData = async () => {
    setLoading(true);
    setFeedbackMsg(null);
    try {
      const [ovRes, compRes, offRes, dupRes, auditRes] = await Promise.all([
        AdminAPI.getOverview(),
        ComplaintsAPI.list({ limit: 100 }),
        AdminAPI.getOfficers(),
        AdminAPI.getDuplicates(),
        AdminAPI.getAuditLogs(30),
      ]);
      setOverview(ovRes.data);
      setComplaints(compRes.data.items || []);
      setOfficers(offRes.data.officers || []);
      setDuplicates(dupRes.data.duplicates || []);
      setAuditLogs(auditRes.data.audit_logs || []);
    } catch (err: any) {
      console.error('Error loading admin dashboard data:', err);
      setFeedbackMsg({ type: 'error', text: 'Failed to sync live municipal telemetry from database.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handle Complaint Assignment
  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalComplaint || !selectedOfficerId) return;
    setAssigning(true);
    try {
      await AdminAPI.assignComplaint(assignModalComplaint.id, {
        officer_id: selectedOfficerId,
        notes: assignmentNotes || 'Assigned by admin command centre.',
      });
      setFeedbackMsg({
        type: 'success',
        text: `Complaint ${assignModalComplaint.complaint_ref} assigned to officer successfully!`,
      });
      setAssignModalComplaint(null);
      setSelectedOfficerId('');
      setAssignmentNotes('');
      await loadAllData();
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to assign officer.',
      });
    } finally {
      setAssigning(false);
    }
  };

  // Handle Repair Verification (Approve / Reject)
  const handleVerify = async (action: 'APPROVE' | 'REJECT') => {
    if (!verifyModalComplaint) return;
    if (action === 'REJECT' && !rejectionReason.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Please specify the rejection reason before rejecting repair work.' });
      return;
    }

    setVerifying(true);
    try {
      await AdminAPI.verifyRepair(verifyModalComplaint.id, {
        action,
        rejection_reason: action === 'REJECT' ? rejectionReason : undefined,
        notes: verificationNotes || 'Administrative review completed.',
      });
      setFeedbackMsg({
        type: 'success',
        text: `Repair work order ${verifyModalComplaint.complaint_ref} marked as ${action === 'APPROVE' ? 'RESOLVED' : 'RETURNED FOR REWORK'}.`,
      });
      setVerifyModalComplaint(null);
      setRejectionReason('');
      setVerificationNotes('');
      await loadAllData();
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to record verification decision.',
      });
    } finally {
      setVerifying(false);
    }
  };

  // Handle Provisioning New Officer
  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingOfficer(true);
    try {
      await AdminAPI.createOfficer(newOfficer);
      setFeedbackMsg({
        type: 'success',
        text: `Officer account for ${newOfficer.name} (${newOfficer.email}) provisioned successfully.`,
      });
      setCreateOfficerModalOpen(false);
      setNewOfficer({
        name: '',
        email: '',
        password: '',
        ward: 'Ward 4 - Central',
        department: 'Roads & Civil Infrastructure',
        phone: '',
      });
      await loadAllData();
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to provision officer account.',
      });
    } finally {
      setCreatingOfficer(false);
    }
  };

  // Handle Merging Duplicates
  const handleMergeDuplicates = async (primaryId: string, dupIds: string[]) => {
    try {
      await AdminAPI.mergeDuplicates({ primary_id: primaryId, duplicate_ids: dupIds });
      setFeedbackMsg({ type: 'success', text: 'Duplicate reports successfully merged into primary ticket.' });
      await loadAllData();
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to merge duplicates.' });
    }
  };

  // Filter complaints list
  const filteredComplaints = complaints.filter((c) => {
    if (filterWard && c.ward !== filterWard) return false;
    if (filterStatus && c.status !== filterStatus) return false;
    if (filterSeverity && c.ai_assessment?.severity_label !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-lg font-bold text-[#172B3A] flex items-center gap-1.5">
              <span>RoadGuard</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-[#13856B]">AI</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
              Admin Command Centre
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-medium text-[#172B3A]">
              {user?.name || 'Super Admin'} ({user?.email})
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={loadAllData}
              disabled={loading}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            >
              Sync
            </Button>
            <Button size="sm" variant="ghost" onClick={logout} leftIcon={<LogOut className="w-3.5 h-3.5" />}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tab Bar */}
      <nav className="bg-white border-b border-[#E2E8F0] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-2 py-2">
          {[
            { id: 'overview', label: 'Overview & KPIs', icon: LayoutDashboard },
            { id: 'complaints', label: 'All Complaints Queue', icon: FileText },
            {
              id: 'verification',
              label: `Repair Verification (${overview?.status_counts?.verification_pending || 0})`,
              icon: CheckCircle,
            },
            { id: 'officers', label: 'Field Officers', icon: Users },
            {
              id: 'duplicates',
              label: `Duplicates (${overview?.status_counts?.duplicate || 0})`,
              icon: Copy,
            },
            { id: 'map', label: 'GIS Live Map', icon: MapIcon },
            { id: 'audit', label: 'Audit Trail', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#13856B] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#172B3A] hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Global Feedback Banner */}
        {feedbackMsg && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <span>{feedbackMsg.text}</span>
            <button onClick={() => setFeedbackMsg(null)} className="font-bold hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* ================= TAB 1: OVERVIEW & KPIS ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Primary KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-5">
                <span className="text-xs font-medium text-[#64748B]">Total Complaints</span>
                <p className="text-2xl font-bold text-[#172B3A] mt-2">
                  {overview?.status_counts?.total ?? '—'}
                </p>
                <span className="text-[10px] text-[#64748B]">All registered reports</span>
              </Card>

              <Card className="p-5">
                <span className="text-xs font-medium text-[#64748B]">Under AI / Municipal Triage</span>
                <p className="text-2xl font-bold text-[#D97706] mt-2">
                  {overview?.status_counts?.under_review ?? '—'}
                </p>
                <span className="text-[10px] text-amber-600 font-medium">Pending assignment</span>
              </Card>

              <Card className="p-5">
                <span className="text-xs font-medium text-[#64748B]">Active Field Repairs</span>
                <p className="text-2xl font-bold text-[#2563EB] mt-2">
                  {(overview?.status_counts?.assigned || 0) + (overview?.status_counts?.in_progress || 0)}
                </p>
                <span className="text-[10px] text-blue-600 font-medium">With field officers</span>
              </Card>

              <Card className="p-5">
                <span className="text-xs font-medium text-[#64748B]">Resolved Repairs</span>
                <p className="text-2xl font-bold text-[#13856B] mt-2">
                  {overview?.status_counts?.resolved ?? '—'}
                </p>
                <span className="text-[10px] text-[#13856B] font-medium">Verified & completed</span>
              </Card>
            </div>

            {/* Severity & Financials Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Severity Breakdown */}
              <Card className="p-6">
                <h3 className="text-sm font-bold text-[#172B3A] mb-4">Damage Severity Telemetry</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Critical Severity', count: overview?.severity_counts?.critical || 0, color: 'bg-[#DC2626]' },
                    { label: 'High Severity', count: overview?.severity_counts?.high || 0, color: 'bg-[#D97706]' },
                    { label: 'Medium Severity', count: overview?.severity_counts?.medium || 0, color: 'bg-[#2563EB]' },
                    { label: 'Low Severity', count: overview?.severity_counts?.low || 0, color: 'bg-[#13856B]' },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                        <span className="text-[#172B3A] font-medium">{s.label}</span>
                      </div>
                      <span className="font-mono font-bold text-[#172B3A]">{s.count}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Financial & Budget Estimate */}
              <Card className="p-6">
                <h3 className="text-sm font-bold text-[#172B3A] mb-4">Civil Budget Allocation</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-[#64748B]">Total Estimated Open Repair Budget</span>
                    <p className="text-2xl font-bold text-[#13856B] mt-1">
                      ₹{overview?.financials?.total_estimated_budget_inr?.toLocaleString('en-IN') || '0.00'}
                    </p>
                    <span className="text-[10px] text-[#64748B]">Calculated via XGBoost Cost Model</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
                    <span>Verification Pending Queue:</span>
                    <span className="font-bold text-[#172B3A]">
                      {overview?.status_counts?.verification_pending || 0} tasks
                    </span>
                  </div>
                </div>
              </Card>

              {/* Ward Distribution */}
              <Card className="p-6">
                <h3 className="text-sm font-bold text-[#172B3A] mb-4">Ward Infrastructure Load</h3>
                <div className="space-y-2.5">
                  {(overview?.ward_distribution || []).slice(0, 4).map((w: any) => (
                    <div key={w.ward} className="flex items-center justify-between text-xs">
                      <span className="text-[#172B3A] font-medium truncate max-w-[180px]">{w.ward}</span>
                      <span className="font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-[#172B3A]">
                        {w.count} complaints
                      </span>
                    </div>
                  ))}
                  {(!overview?.ward_distribution || overview?.ward_distribution.length === 0) && (
                    <p className="text-xs text-[#64748B]">No ward distribution data available.</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ================= TAB 2: COMPLAINTS QUEUE ================= */}
        {activeTab === 'complaints' && (
          <Card className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-[#172B3A]">Municipal Complaints Master Queue</h2>
                <p className="text-xs text-[#64748B]">
                  Live intake of road damage reports across all wards and jurisdictions.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filterWard}
                  onChange={(e) => setFilterWard(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-[#172B3A] focus:outline-none"
                >
                  <option value="">All Wards</option>
                  <option value="Ward 1 - North">Ward 1 - North</option>
                  <option value="Ward 2 - East">Ward 2 - East</option>
                  <option value="Ward 4 - Central">Ward 4 - Central</option>
                  <option value="Ward 7 - West">Ward 7 - West</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-[#172B3A] focus:outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="VERIFICATION_PENDING">Verification Pending</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="DUPLICATE">Duplicate</option>
                </select>

                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-[#172B3A] focus:outline-none"
                >
                  <option value="">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[#64748B] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Priority</th>
                    <th className="py-3 px-4 font-semibold">Reference</th>
                    <th className="py-3 px-4 font-semibold">Damage Type</th>
                    <th className="py-3 px-4 font-semibold">Severity</th>
                    <th className="py-3 px-4 font-semibold">Ward / Location</th>
                    <th className="py-3 px-4 font-semibold">Assigned Officer</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[#172B3A]">
                  {filteredComplaints.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-700">
                        {item.ai_assessment?.priority_score || '—'}/100
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#13856B]">
                        {item.complaint_ref}
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        {item.ai_assessment?.damage_label || 'Distress'}
                      </td>
                      <td className="py-3.5 px-4">
                        <SeverityBadge severity={item.ai_assessment?.severity_label || 'Medium'} />
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B] max-w-xs truncate">
                        {item.address_text || item.ward}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {item.assigned_officer_name || (
                          <span className="text-amber-600 font-normal italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {['UNDER_REVIEW', 'SUBMITTED', 'DUPLICATE'].includes(item.status) && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => {
                              setAssignModalComplaint(item);
                              setSelectedOfficerId('');
                            }}
                          >
                            Assign Officer
                          </Button>
                        )}
                        <Link to={`/track/${item.complaint_ref}`} target="_blank">
                          <Button size="sm" variant="outline">
                            Inspect
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filteredComplaints.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No complaints match the specified filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ================= TAB 3: REPAIR VERIFICATION CONSOLE ================= */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs">
              <h2 className="text-lg font-bold text-[#172B3A]">Supervisory Repair Verification Console</h2>
              <p className="text-xs text-[#64748B] mt-1">
                Review completed road work photographic evidence submitted by municipal field officers.
              </p>
            </div>

            {complaints.filter((c) => c.status === 'VERIFICATION_PENDING').length === 0 ? (
              <Card className="p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-[#172B3A]">Verification Queue Clear</h3>
                <p className="text-xs text-[#64748B] mt-1">
                  There are no pending repairs awaiting supervisory review at this moment.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {complaints
                  .filter((c) => c.status === 'VERIFICATION_PENDING')
                  .map((task) => (
                    <Card key={task.id} className="p-6 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <span className="font-mono font-bold text-[#13856B] text-sm">
                            {task.complaint_ref}
                          </span>
                          <p className="text-xs text-[#64748B] mt-0.5">{task.address_text || task.ward}</p>
                        </div>
                        <StatusBadge status={task.status} />
                      </div>

                      {/* Side by side Before / After preview */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] font-semibold text-[#64748B] uppercase">
                            Original Defect
                          </span>
                          <img
                            src={task.image_url}
                            alt="Before"
                            className="mt-1 w-full h-36 object-cover rounded-xl border border-slate-200"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-[#64748B] uppercase">
                            Completed Repair
                          </span>
                          <img
                            src={task.repair_evidence?.repair_image_url || task.image_url}
                            alt="After"
                            className="mt-1 w-full h-36 object-cover rounded-xl border border-slate-200"
                          />
                        </div>
                      </div>

                      <div className="text-xs text-[#172B3A] bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                        <p>
                          <span className="font-semibold text-[#64748B]">Officer:</span>{' '}
                          {task.repair_evidence?.officer_name || task.assigned_officer_name}
                        </p>
                        <p>
                          <span className="font-semibold text-[#64748B]">Notes:</span>{' '}
                          {task.repair_evidence?.notes}
                        </p>
                        <p>
                          <span className="font-semibold text-[#64748B]">Materials:</span>{' '}
                          {task.repair_evidence?.materials_used?.join(', ') || 'Standard Mix'}
                        </p>
                        <p>
                          <span className="font-semibold text-[#64748B]">Cost Incurred:</span> ₹
                          {task.repair_evidence?.cost_incurred_inr || '—'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <Button
                          variant="primary"
                          className="flex-1"
                          onClick={() => {
                            setVerifyModalComplaint(task);
                            setRejectionReason('');
                          }}
                          leftIcon={<CheckCircle className="w-4 h-4" />}
                        >
                          Review & Decision
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: OFFICERS ROSTER ================= */}
        {activeTab === 'officers' && (
          <Card className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-[#172B3A]">Municipal Field Officers Roster</h2>
                <p className="text-xs text-[#64748B]">
                  Manage field inspection personnel, ward assignments, and operational workload.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setCreateOfficerModalOpen(true)}
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                Provision Officer
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[#64748B] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Name</th>
                    <th className="py-3 px-4 font-semibold">Email</th>
                    <th className="py-3 px-4 font-semibold">Jurisdiction / Ward</th>
                    <th className="py-3 px-4 font-semibold">Department</th>
                    <th className="py-3 px-4 font-semibold">Active Tasks</th>
                    <th className="py-3 px-4 font-semibold">Resolved</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[#172B3A]">
                  {officers.map((off) => (
                    <tr key={off.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#172B3A]">{off.name}</td>
                      <td className="py-3.5 px-4 text-[#64748B]">{off.email}</td>
                      <td className="py-3.5 px-4 font-medium">{off.ward || 'General'}</td>
                      <td className="py-3.5 px-4 text-[#64748B]">{off.department}</td>
                      <td className="py-3.5 px-4 font-bold text-blue-600">{off.active_tasks || 0}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">{off.resolved_tasks || 0}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            off.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {off.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ================= TAB 5: DUPLICATE MANAGEMENT ================= */}
        {activeTab === 'duplicates' && (
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#172B3A]">Geospatial Duplicate Management</h2>
              <p className="text-xs text-[#64748B] mt-1">
                Complaints flagged within 30-meter proximity sharing matching road distress signatures.
              </p>
            </div>

            {duplicates.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#64748B]">
                <Copy className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                No duplicate complaints currently detected.
              </div>
            ) : (
              <div className="space-y-4">
                {duplicates.map((dup) => (
                  <div
                    key={dup.id}
                    className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-800 text-sm">
                          {dup.complaint_ref}
                        </span>
                        <StatusBadge status={dup.status} />
                      </div>
                      <p className="text-xs text-[#172B3A] mt-1 font-medium">
                        {dup.ai_assessment?.damage_label || 'Distress'} • {dup.address_text || dup.ward}
                      </p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        Nearby Candidates Detected: {dup.duplicate_info?.candidate_count || 1}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {dup.duplicate_info?.candidates?.map((cand: any) => (
                        <Button
                          key={cand.complaint_id}
                          size="sm"
                          variant="primary"
                          onClick={() => handleMergeDuplicates(cand.complaint_id, [dup.id])}
                        >
                          Merge into {cand.complaint_ref}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* ================= TAB 6: GIS LIVE MAP ================= */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#172B3A]">Municipal Infrastructure GIS Telemetry Map</h2>
                <p className="text-xs text-[#64748B] mt-1">
                  Real-time visualization of all reported road distresses with color-coded severity markers.
                </p>
              </div>

              {/* Map Legend */}
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" /> Critical
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> High
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> Medium
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#13856B]" /> Resolved / Low
                </span>
              </div>
            </div>

            <MunicipalMap
              complaints={complaints.map((c) => ({
                id: c.id,
                complaint_ref: c.complaint_ref,
                location: c.location,
                address_text: c.address_text,
                ward: c.ward,
                status: c.status,
                image_url: c.image_url,
                ai_assessment: c.ai_assessment,
              }))}
              height="580px"
              center={[18.5204, 73.8567]}
              zoom={13}
            />
          </div>
        )}

        {/* ================= TAB 7: AUDIT LOGS ================= */}
        {activeTab === 'audit' && (
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#172B3A]">Immutable Administrative Audit Log</h2>
              <p className="text-xs text-[#64748B] mt-1">
                Tamper-evident operational log recording municipal officer assignments, repair decisions, and configuration changes.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[#64748B] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Timestamp</th>
                    <th className="py-3 px-4 font-semibold">Actor</th>
                    <th className="py-3 px-4 font-semibold">Action</th>
                    <th className="py-3 px-4 font-semibold">Target</th>
                    <th className="py-3 px-4 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[#172B3A]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#172B3A]">{log.actor_name}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-xs text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {log.target_type}: {log.target_id.slice(-6)}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B] max-w-sm truncate">
                        {JSON.stringify(log.details)}
                      </td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No audit events recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>

      {/* ================= MODAL: ASSIGN TO OFFICER ================= */}
      {assignModalComplaint && (
        <Modal
          isOpen={true}
          onClose={() => setAssignModalComplaint(null)}
          title={`Assign Work Order: ${assignModalComplaint.complaint_ref}`}
          maxWidth="lg"
        >
          <form onSubmit={handleAssign} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#172B3A]">
              <p className="font-semibold">
                {assignModalComplaint.ai_assessment?.damage_label || 'Distress'} • Severity:{' '}
                {assignModalComplaint.ai_assessment?.severity_label || 'Medium'}
              </p>
              <p className="text-[#64748B] mt-0.5">
                {assignModalComplaint.address_text || assignModalComplaint.ward}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                Select Municipal Field Officer *
              </label>
              <select
                value={selectedOfficerId}
                onChange={(e) => setSelectedOfficerId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#13856B]"
                required
              >
                <option value="">-- Choose Assigned Officer --</option>
                {officers.map((off) => (
                  <option key={off.id} value={off.id}>
                    {off.name} ({off.ward || 'General'}) — Active Tasks: {off.active_tasks || 0}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                Supervisory Instructions & Priority Notes
              </label>
              <textarea
                rows={3}
                value={assignmentNotes}
                onChange={(e) => setAssignmentNotes(e.target.value)}
                placeholder="e.g. High traffic corridor; complete asphalt compaction during low congestion window..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#13856B]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setAssignModalComplaint(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={assigning || !selectedOfficerId}>
                {assigning ? 'Assigning...' : 'Confirm Assignment'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL: SUPERVISORY REPAIR DECISION ================= */}
      {verifyModalComplaint && (
        <Modal
          isOpen={true}
          onClose={() => setVerifyModalComplaint(null)}
          title={`Supervisory Verification: ${verifyModalComplaint.complaint_ref}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-semibold text-[#64748B] uppercase">Before Repair</span>
                <img
                  src={verifyModalComplaint.image_url}
                  alt="Before"
                  className="mt-1 w-full h-44 object-cover rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-[#64748B] uppercase">After Repair Evidence</span>
                <img
                  src={verifyModalComplaint.repair_evidence?.repair_image_url || verifyModalComplaint.image_url}
                  alt="After"
                  className="mt-1 w-full h-44 object-cover rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#172B3A] space-y-1">
              <p>
                <span className="font-semibold text-[#64748B]">Officer:</span>{' '}
                {verifyModalComplaint.repair_evidence?.officer_name || verifyModalComplaint.assigned_officer_name}
              </p>
              <p>
                <span className="font-semibold text-[#64748B]">Notes:</span>{' '}
                {verifyModalComplaint.repair_evidence?.notes}
              </p>
              <p>
                <span className="font-semibold text-[#64748B]">Cost Incurred:</span> ₹
                {verifyModalComplaint.repair_evidence?.cost_incurred_inr}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                Rejection Reason (Required if Rejecting)
              </label>
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Depression exceeds 15mm tolerance; edge sealing incomplete..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#13856B]"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => handleVerify('REJECT')}
                disabled={verifying}
                leftIcon={<XCircle className="w-4 h-4" />}
              >
                Reject Repair (Return to Field)
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleVerify('APPROVE')}
                disabled={verifying}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Approve & Mark Resolved
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL: PROVISION NEW OFFICER ================= */}
      {createOfficerModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setCreateOfficerModalOpen(false)}
          title="Provision New Municipal Field Officer"
          maxWidth="md"
        >
          <form onSubmit={handleCreateOfficer} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">Officer Full Name *</label>
              <input
                type="text"
                value={newOfficer.name}
                onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
                placeholder="e.g. Er. S. Deshpande"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#13856B]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">Official Email *</label>
              <input
                type="email"
                value={newOfficer.email}
                onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
                placeholder="officer.name@roadguard.ai"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#13856B]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">Initial Password *</label>
              <input
                type="password"
                value={newOfficer.password}
                onChange={(e) => setNewOfficer({ ...newOfficer, password: e.target.value })}
                placeholder="Minimum 8 characters"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#13856B]"
                required
                minLength={8}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">Assigned Ward *</label>
                <input
                  type="text"
                  value={newOfficer.ward}
                  onChange={(e) => setNewOfficer({ ...newOfficer, ward: e.target.value })}
                  placeholder="Ward 4 - Central"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#13856B]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">Department</label>
                <input
                  type="text"
                  value={newOfficer.department}
                  onChange={(e) => setNewOfficer({ ...newOfficer, department: e.target.value })}
                  placeholder="PWD Roads"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#13856B]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateOfficerModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={creatingOfficer}>
                {creatingOfficer ? 'Provisioning...' : 'Provision Officer'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
