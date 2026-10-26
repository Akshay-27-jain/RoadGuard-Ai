import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Wrench,
  LogOut,
  RefreshCw,
  Clock,
  CheckCircle2,
  MapPin,
  Upload,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge, SeverityBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { AIAssessmentVisualizer } from '@/components/complaints/AIAssessmentVisualizer';
import { useAuth } from '@/context/AuthContext';
import { OfficerAPI } from '@/services/api';

export const OfficerDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState<any[]>([]);
  const [workload, setWorkload] = useState({
    total_assigned: 0,
    pending_inspection: 0,
    in_progress: 0,
    verification_pending: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Repair submission form state
  const [repairImage, setRepairImage] = useState<File | null>(null);
  const [repairPreview, setRepairPreview] = useState<string | null>(null);
  const [repairNotes, setRepairNotes] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState('');
  const [costIncurred, setCostIncurred] = useState('');
  const [submittingRepair, setSubmittingRepair] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const res = await OfficerAPI.getTasks();
      setTasks(res.data.tasks || []);
      if (res.data.workload) {
        setWorkload(res.data.workload);
      }
    } catch (err: any) {
      console.error('Error fetching officer tasks:', err);
      setActionError('Failed to load assigned tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStartWork = async (taskId: string) => {
    setActionError(null);
    try {
      await OfficerAPI.updateStatus(taskId, 'IN_PROGRESS', 'Officer initiated on-site repair operations.');
      setActionSuccess('Task marked as IN_PROGRESS. Field operations initiated.');
      await fetchTasks();
      if (selectedTask) {
        setSelectedTask((prev: any) => ({ ...prev, status: 'IN_PROGRESS' }));
      }
    } catch (err: any) {
      setActionError(err.response?.data?.detail || 'Failed to update task status.');
    }
  };

  const handleRepairImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRepairImage(file);
      setRepairPreview(URL.createObjectURL(file));
      setActionError(null);
    }
  };

  const handleSubmitRepair = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repairImage) {
      setActionError('Please provide a photograph of the completed repair.');
      return;
    }
    if (!repairNotes.trim()) {
      setActionError('Please enter field notes describing the repair work completed.');
      return;
    }

    setSubmittingRepair(true);
    setActionError(null);

    const formData = new FormData();
    formData.append('repair_image', repairImage);
    formData.append('notes', repairNotes);
    if (materialsUsed) formData.append('materials_used', materialsUsed);
    if (costIncurred) formData.append('cost_incurred', costIncurred);

    try {
      const res = await OfficerAPI.submitRepair(selectedTask.id, formData);
      setActionSuccess('Repair evidence submitted successfully! Now pending supervisory verification.');
      setSelectedTask(res.data);
      setRepairImage(null);
      setRepairPreview(null);
      setRepairNotes('');
      setMaterialsUsed('');
      setCostIncurred('');
      await fetchTasks();
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'object' && detail.message) {
        setActionError(`${detail.message} Reason: ${detail.reason}`);
      } else {
        setActionError(detail || 'Failed to submit repair evidence.');
      }
    } finally {
      setSubmittingRepair(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'ALL') return true;
    return t.status === filterStatus;
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
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              Municipal Officer Workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#172B3A] font-medium">
              <Building2 className="w-4 h-4 text-[#64748B]" />
              <span>
                {user?.name || 'Field Officer'} ({user?.ward || 'General Jurisdiction'})
              </span>
            </div>
            <Button size="sm" variant="ghost" onClick={logout} leftIcon={<LogOut className="w-3.5 h-3.5" />}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Officer Overview Banner */}
        <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#172B3A]">Field Inspection & Repair Dispatch</h1>
            <p className="text-xs text-[#64748B] mt-1">
              Department: {user?.department || 'Road Maintenance PWD'} • Assigned Ward:{' '}
              {user?.ward || 'Ward 4 - Central'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTasks}
            disabled={loading}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh Queue
          </Button>
        </div>

        {/* Workload Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <span className="text-xs font-medium text-[#64748B]">Assigned Complaints</span>
            <p className="text-2xl font-bold text-[#172B3A] mt-2">{workload.total_assigned}</p>
            <span className="text-[10px] text-sky-600 font-medium">In your active queue</span>
          </Card>

          <Card className="p-5">
            <span className="text-xs font-medium text-[#64748B]">Pending Inspection</span>
            <p className="text-2xl font-bold text-[#D97706] mt-2">{workload.pending_inspection}</p>
            <span className="text-[10px] text-[#64748B]">Action required</span>
          </Card>

          <Card className="p-5">
            <span className="text-xs font-medium text-[#64748B]">Repairs In Progress</span>
            <p className="text-2xl font-bold text-[#2563EB] mt-2">{workload.in_progress}</p>
            <span className="text-[10px] text-[#64748B]">Work site active</span>
          </Card>

          <Card className="p-5">
            <span className="text-xs font-medium text-[#64748B]">Repairs Verified</span>
            <p className="text-2xl font-bold text-[#13856B] mt-2">{workload.resolved}</p>
            <span className="text-[10px] text-[#13856B] font-medium">Completed & closed</span>
          </Card>
        </div>

        {/* Task Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'ALL', label: 'All Tasks' },
            { id: 'ASSIGNED', label: 'Assigned (Pending)' },
            { id: 'IN_PROGRESS', label: 'In Progress' },
            { id: 'VERIFICATION_PENDING', label: 'Verification Pending' },
            { id: 'RESOLVED', label: 'Resolved' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === tab.id
                  ? 'bg-[#13856B] text-white'
                  : 'bg-white text-[#64748B] hover:text-[#172B3A] border border-[#E2E8F0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tasks Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-[#172B3A]">Field Task Queue</h2>
              <p className="text-xs text-[#64748B]">
                Tasks ranked by XGBoost priority score with civil defect telemetry.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-[#64748B]">
              <RefreshCw className="w-6 h-6 animate-spin text-[#13856B] mx-auto mb-2" />
              Loading officer assignments...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="py-12 text-center">
              <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-[#172B3A]">No Assigned Tasks</h3>
              <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                No road repairs currently match this filter. When administrative supervisors dispatch work orders,
                they will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[#64748B] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Priority</th>
                    <th className="py-3 px-4 font-semibold">Reference</th>
                    <th className="py-3 px-4 font-semibold">Damage Type</th>
                    <th className="py-3 px-4 font-semibold">Severity</th>
                    <th className="py-3 px-4 font-semibold">Location</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[#172B3A]">
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {task.ai_assessment?.priority_score || '—'}/100
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#13856B]">
                        {task.complaint_ref}
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        {task.ai_assessment?.damage_label || 'Road Distress'}
                      </td>
                      <td className="py-3.5 px-4">
                        <SeverityBadge severity={task.ai_assessment?.severity_label || 'Medium'} />
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B] max-w-xs truncate">
                        {task.address_text || task.ward}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTask(task);
                            setActionError(null);
                            setActionSuccess(null);
                          }}
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                        >
                          Inspect / Action
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>

      {/* Task Inspection & Action Modal */}
      {selectedTask && (
        <Modal
          isOpen={true}
          onClose={() => {
            setSelectedTask(null);
            setActionError(null);
            setActionSuccess(null);
            setRepairImage(null);
            setRepairPreview(null);
          }}
          title={`Work Order: ${selectedTask.complaint_ref}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {actionError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {actionError}
              </div>
            )}
            {actionSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                {actionSuccess}
              </div>
            )}

            {/* Top Status Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedTask.status} />
                <SeverityBadge severity={selectedTask.ai_assessment?.severity_label || 'Medium'} />
                <span className="text-xs font-semibold text-[#172B3A]">
                  XGBoost Priority: {selectedTask.ai_assessment?.priority_score || '—'}/100
                </span>
              </div>
              <div className="text-xs text-[#64748B] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#13856B]" />
                <span>{selectedTask.address_text || selectedTask.ward}</span>
              </div>
            </div>

            {/* AI Visualizer / Original Photo */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                AI Defect Inspection & Geolocation
              </h3>
              <AIAssessmentVisualizer
                imageUrl={selectedTask.image_url}
                assessment={selectedTask.ai_assessment || {}}
              />
            </div>

            {/* Workflow Action Based on State */}
            {selectedTask.status === 'ASSIGNED' && (
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-900">Task Ready for Field Operations</h4>
                    <p className="text-xs text-amber-700 mt-1">
                      Dispatch the road maintenance team to the site. Click below to transition the task status to
                      IN_PROGRESS.
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={() => handleStartWork(selectedTask.id)}
                  leftIcon={<Wrench className="w-4 h-4" />}
                >
                  Start Field Work (Dispatch Crew)
                </Button>
              </div>
            )}

            {selectedTask.status === 'IN_PROGRESS' && (
              <form onSubmit={handleSubmitRepair} className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-4">
                <div className="flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-900">Submit Repair Completion Evidence</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Upload photographic proof of completed pothole filling/crack sealing for supervisory municipal verification.
                    </p>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                    After-Repair Photograph *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleRepairImageChange}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    required
                  />
                  {repairPreview && (
                    <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-300 max-h-48 max-w-sm">
                      <img src={repairPreview} alt="Repair Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Field Notes */}
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                    Repair & Material Compaction Notes *
                  </label>
                  <textarea
                    rows={3}
                    value={repairNotes}
                    onChange={(e) => setRepairNotes(e.target.value)}
                    placeholder="Describe the compaction method, asphalt grade, depth, and weather conditions during application..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#13856B]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                      Materials Used
                    </label>
                    <input
                      type="text"
                      value={materialsUsed}
                      onChange={(e) => setMaterialsUsed(e.target.value)}
                      placeholder="e.g. Bitumen VG-30, Aggregate 10mm"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#13856B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#172B3A] mb-1.5">
                      Actual Cost Incurred (INR ₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={costIncurred}
                      onChange={(e) => setCostIncurred(e.target.value)}
                      placeholder="e.g. 4500"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#13856B]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={submittingRepair}
                  leftIcon={<Upload className="w-4 h-4" />}
                >
                  {submittingRepair ? 'Uploading & Validating Quality...' : 'Submit for Supervisory Verification'}
                </Button>
              </form>
            )}

            {selectedTask.status === 'VERIFICATION_PENDING' && selectedTask.repair_evidence && (
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <h4 className="text-sm font-bold text-emerald-900">
                      Repair Evidence Submitted — Awaiting Supervisory Approval
                    </h4>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Pending Admin Review
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-semibold text-[#64748B] uppercase">Before Repair</span>
                    <img
                      src={selectedTask.image_url}
                      alt="Before"
                      className="mt-1 w-full h-40 object-cover rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-[#64748B] uppercase">After Repair</span>
                    <img
                      src={selectedTask.repair_evidence.repair_image_url}
                      alt="After"
                      className="mt-1 w-full h-40 object-cover rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="text-xs text-[#172B3A] space-y-1 bg-white p-3 rounded-xl border border-emerald-100">
                  <p>
                    <span className="font-semibold text-[#64748B]">Officer Notes:</span>{' '}
                    {selectedTask.repair_evidence.notes}
                  </p>
                  <p>
                    <span className="font-semibold text-[#64748B]">Materials:</span>{' '}
                    {selectedTask.repair_evidence.materials_used?.join(', ') || 'Standard Mix'}
                  </p>
                  <p>
                    <span className="font-semibold text-[#64748B]">Cost Incurred:</span> ₹
                    {selectedTask.repair_evidence.cost_incurred_inr}
                  </p>
                </div>
              </div>
            )}

            {selectedTask.status === 'RESOLVED' && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>This repair has been approved by the municipal supervisory authority and marked as RESOLVED.</span>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
