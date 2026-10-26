import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, UserPlus, Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

// Regex patterns for validation
const PHONE_REGEX = /^(\+91[\-\s]?)?[6-9]\d{9}$|^\+?[1-9]\d{7,14}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim();
    const cleanPhone = formData.phone.trim();

    if (cleanName.length < 2) {
      setError('Please enter your full legal name (at least 2 characters).');
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError('Please enter a valid email address (e.g. ananya@example.com).');
      return;
    }

    if (cleanPhone) {
      const compact = cleanPhone.replace(/[\s\-]/g, '');
      if (!PHONE_REGEX.test(compact)) {
        setError('Please enter a valid 10-digit mobile number (e.g. 9876543210 or +91 9876543210).');
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long for account security.');
      return;
    }

    if (!formData.agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: cleanName,
        email: cleanEmail,
        password: formData.password,
        phone: cleanPhone || undefined,
      });

      setLoading(false);
      // Smoothly navigate to citizen dashboard without reloading or bouncing
      navigate('/citizen/dashboard', { replace: true });
    } catch (err: any) {
      setLoading(false);
      const detail = err.response?.data?.detail;
      let msg = 'Registration failed. Please check your information.';
      if (typeof detail === 'string') {
        msg = detail;
      } else if (Array.isArray(detail)) {
        msg = detail
          .map((d: any) => {
            const rawField = d.loc?.slice(-1)[0];
            const fieldLabel = rawField
              ? rawField.charAt(0).toUpperCase() + rawField.slice(1).replace(/_/g, ' ')
              : 'Field';
            return `${fieldLabel}: ${d.msg || 'Invalid input'}`;
          })
          .join(' • ');
      }
      setError(msg);
    }
  };

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
          Create Citizen Account
        </h2>
        <p className="text-xs text-[#64748B]">
          Join your local municipal road care network and track your damage reports in real-time.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-6 py-8 sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Ananya Deshmukh"
              leftIcon={<User className="w-4 h-4" />}
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (error) setError('');
              }}
            />

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="ananya@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (error) setError('');
              }}
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+91 98765 43210"
              leftIcon={<Phone className="w-4 h-4" />}
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value });
                if (error) setError('');
              }}
              helperText="Validated standard 10-digit mobile number for status notifications."
            />

            <Input
              label="Create Password"
              type="password"
              required
              placeholder="Minimum 8 characters (12+ recommended)"
              leftIcon={<Lock className="w-4 h-4" />}
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (error) setError('');
              }}
              helperText="Must be at least 8 characters (e.g. Pass@12345678)."
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              placeholder="Repeat your password"
              leftIcon={<Lock className="w-4 h-4" />}
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                if (error) setError('');
              }}
            />

            <div className="flex items-start gap-2 pt-1 text-xs">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={(e) => {
                  setFormData({ ...formData, agreeTerms: e.target.checked });
                  if (error) setError('');
                }}
                className="mt-0.5 rounded border-slate-300 text-[#13856B] focus:ring-[#13856B]"
              />
              <label htmlFor="agreeTerms" className="text-[#64748B] leading-relaxed cursor-pointer">
                I agree to the{' '}
                <Link to="/terms" className="text-[#2563EB] hover:text-blue-700 underline font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-[#2563EB] hover:text-blue-700 underline font-medium">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={loading}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Register & Proceed to Dashboard
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-[#64748B]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#2563EB] hover:text-blue-700 hover:underline"
            >
              Sign In Here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
