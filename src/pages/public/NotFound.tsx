import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center mb-6 border border-amber-200">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-[#172B3A] tracking-tight">404 — Page Not Found</h1>
      <p className="mt-3 text-sm text-[#64748B] max-w-md">
        The municipal road page or complaint record you requested does not exist or has been relocated.
      </p>
      <div className="mt-6 flex gap-3">
        <Link to="/">
          <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
        <Link to="/report">
          <Button variant="secondary">
            Report Road Damage
          </Button>
        </Link>
      </div>
    </div>
  );
};
