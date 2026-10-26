import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, LogIn, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

// Regex for validating input: either a valid email format OR a standard mobile number
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const PHONE_REGEX = /^(\+91[\-\s]?)?[6-9]\d{9}$|^\+?[1-9]\d{7,14}$/;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (user.role === 'officer') navigate('/officer/dashboard', { replace: true });
      else navigate('/citizen/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const validateInput = (): boolean => {
    const clean = identifier.trim();
    if (!clean) {
      setError('Please enter your registered email address or mobile number.');
      return false;
    }

    const compact = clean.replace(/[\s\-]/g, '');
    const isPhoneCandidate = compact.startsWith('+') || /^\d+$/.test(compact);

    if (isPhoneCandidate) {
      if (!PHONE_REGEX.test(compact)) {
        setError('Please enter a valid mobile number (e.g. 9876543210 or +91 9876543210).');
        return false;
      }
    } else if (clean.includes('@')) {
      if (!EMAIL_REGEX.test(clean)) {
        setError('Please enter a valid email address (e.g. name@example.com).');
        return false;
      }
    } else {
      setError('Please enter a valid email address or 10-digit mobile number.');
      return false;
    }

    if (!password) {
      setError('Please enter your account password.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateInput()) {
      return;
    }

    setLoading(true);

    try {
      const loggedUser = await login({
        email: identifier.trim(),
        password,
      });

      // Role-based dynamic dispatch according to credentials
      if (loggedUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (loggedUser.role === 'officer') {
        navigate('/officer/dashboard');
      } else {
        navigate('/citizen/dashboard');
      }
    } catch (err: any) {
      setLoading(false);
      const detail = err.response?.data?.detail;
      let msg = 'Invalid credentials. Please verify your email/phone and password.';
      if (typeof detail === 'string') {
        msg = detail;
      } else if (Array.isArray(detail)) {
        msg = detail.map((d: any) => d.msg || 'Invalid field').join(', ');
      }
      setError(msg);
    }
  };

  const sessionExpired = new URLSearchParams(location.search).get('session_expired');

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#13856B] flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-[#172B3A]">RoadGuard AI</span>
        </Link>
        <h2 className="text-2xl font-bold text-[#172B3A] tracking-tight">
          Sign In to Your Account
        </h2>
        <p className="text-xs text-[#64748B]">
          One unified portal for Citizens, Municipal Officers, and System Administrators.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-6 py-8 sm:px-10">
          
          {/* Informational Role Indicator */}
          <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#64748B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#13856B]" />
              <span className="font-medium text-[#172B3A]">Unified Municipal Access</span>
            </div>
            <span className="text-[11px] text-slate-500">Auto-routes to your role</span>
          </div>

          {sessionExpired && (
            <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Your session has expired. Please sign in again.</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address or Mobile Number"
              type="text"
              required
              placeholder="e.g. citizen@example.com or 9876543210"
              leftIcon={<User className="w-4 h-4" />}
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (error) setError('');
              }}
              helperText="Enter your registered email address or 10-digit mobile number."
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-[#64748B] cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-[#13856B] focus:ring-[#13856B]"
                />
                Remember this device
              </label>

              <Link
                to="/forgot-password"
                className="font-medium text-[#2563EB] hover:text-blue-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={loading}
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              Sign In to Portal
            </Button>
          </form>

          {/* Role Access Capabilities Overview */}
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px] text-[#64748B]">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-[#172B3A] block">Citizen</span>
              Track reports
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-[#172B3A] block">Officer</span>
              Repair tasks
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-[#172B3A] block">Admin</span>
              Full oversight
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#64748B]">
            New to RoadGuard AI?{' '}
            <Link
              to="/register"
              className="font-semibold text-[#2563EB] hover:text-blue-700 hover:underline"
            >
              Create Citizen Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
