import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: ('citizen' | 'officer' | 'admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading, role } = useAuth();

  // If state is synchronizing, check localStorage fallback to prevent navigation flicker
  const storedUser = !user
    ? (() => {
        try {
          const s = localStorage.getItem('roadguard_user');
          return s ? JSON.parse(s) : null;
        } catch {
          return null;
        }
      })()
    : null;

  const effectiveUser = user || storedUser;
  const effectiveRole = role || effectiveUser?.role || null;
  const effectiveAuth = isAuthenticated || !!effectiveUser;

  if (isLoading && !effectiveUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FAFC]">
        <div className="flex flex-col items-center gap-3 text-[#13856B]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-sm font-medium text-[#64748B]">Verifying municipal credentials...</span>
        </div>
      </div>
    );
  }

  if (!effectiveAuth || !effectiveUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && effectiveRole && !allowedRoles.includes(effectiveRole)) {
    // If citizen tries to access officer/admin or vice-versa, redirect to their role's dashboard
    if (effectiveRole === 'citizen') return <Navigate to="/citizen/dashboard" replace />;
    if (effectiveRole === 'officer') return <Navigate to="/officer/dashboard" replace />;
    if (effectiveRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};
