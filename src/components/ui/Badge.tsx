import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'info' | 'warning' | 'critical' | 'success' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full transition-colors';

  const variants = {
    primary: 'bg-emerald-50 text-[#13856B] border border-emerald-200',
    secondary: 'bg-slate-100 text-[#172B3A] border border-slate-200',
    info: 'bg-blue-50 text-[#2563EB] border border-blue-200',
    warning: 'bg-amber-50 text-[#D97706] border border-amber-200',
    critical: 'bg-red-50 text-[#DC2626] border border-red-200',
    success: 'bg-emerald-50 text-[#059669] border border-emerald-200',
    outline: 'bg-white text-slate-700 border border-slate-300',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </span>
  );
};

// Specialized badges for road infrastructure workflows
export const SeverityBadge: React.FC<{ severity: string; className?: string }> = ({ severity, className }) => {
  const s = severity?.toLowerCase() || '';
  if (s === 'critical') {
    return <Badge variant="critical" className={className}>Critical Severity</Badge>;
  }
  if (s === 'high') {
    return <Badge variant="warning" className={className}>High Severity</Badge>;
  }
  if (s === 'medium') {
    return <Badge variant="info" className={className}>Medium Severity</Badge>;
  }
  return <Badge variant="primary" className={className}>Low Severity</Badge>;
};

export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className }) => {
  const st = status?.toUpperCase() || 'SUBMITTED';
  switch (st) {
    case 'SUBMITTED':
      return <Badge variant="secondary" className={className}>Submitted</Badge>;
    case 'AI_PROCESSING':
      return <Badge variant="info" className={className}>AI Processing</Badge>;
    case 'UNDER_REVIEW':
      return <Badge variant="warning" className={className}>Under Review</Badge>;
    case 'VERIFIED':
      return <Badge variant="primary" className={className}>Verified</Badge>;
    case 'ASSIGNED':
      return <Badge variant="info" className={clsx('bg-sky-50 text-sky-700 border-sky-200', className)}>Assigned</Badge>;
    case 'IN_PROGRESS':
      return <Badge variant="warning" className={clsx('bg-indigo-50 text-indigo-700 border-indigo-200', className)}>In Progress</Badge>;
    case 'REPAIR_SUBMITTED':
      return <Badge variant="info" className={clsx('bg-purple-50 text-purple-700 border-purple-200', className)}>Repair Submitted</Badge>;
    case 'VERIFICATION_PENDING':
      return <Badge variant="warning" className={clsx('bg-amber-100 text-amber-900 border-amber-300', className)}>Pending Inspection</Badge>;
    case 'RESOLVED':
      return <Badge variant="success" className={className}>Resolved</Badge>;
    case 'REJECTED':
      return <Badge variant="critical" className={className}>Rejected</Badge>;
    case 'DUPLICATE':
      return <Badge variant="secondary" className={clsx('bg-slate-200 text-slate-700', className)}>Duplicate</Badge>;
    default:
      return <Badge variant="secondary" className={className}>{status}</Badge>;
  }
};

export const DamageClassBadge: React.FC<{ damageClass: string; className?: string }> = ({ damageClass, className }) => {
  const d = damageClass?.toLowerCase() || '';
  if (d.includes('pothole') || d === 'd40') {
    return <Badge variant="critical" className={clsx('font-semibold', className)}>D40 • Pothole</Badge>;
  }
  if (d.includes('alligator') || d === 'd20') {
    return <Badge variant="warning" className={clsx('font-semibold', className)}>D20 • Alligator Crack</Badge>;
  }
  if (d.includes('transverse') || d === 'd10') {
    return <Badge variant="info" className={clsx('font-semibold', className)}>D10 • Transverse Crack</Badge>;
  }
  if (d.includes('longitudinal') || d === 'd00') {
    return <Badge variant="info" className={clsx('font-semibold', className)}>D00 • Longitudinal Crack</Badge>;
  }
  return <Badge variant="secondary" className={clsx('font-semibold', className)}>{damageClass || 'Road Defect'}</Badge>;
};
