import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X, PlusCircle, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Features', href: '/features' },
    { name: 'Reporting Guide', href: '/reporting-guide' },
    { name: 'Road Safety', href: '/safety' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xs border-b border-[#E2E8F0] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#13856B] flex items-center justify-center text-white shadow-xs group-hover:bg-[#0F6B56] transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-[#172B3A] tracking-tight">RoadGuard</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-[#13856B]">AI</span>
              </div>
              <p className="text-[10px] text-[#64748B] font-medium leading-none -mt-0.5">Municipal Road Care</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-[#13856B] bg-emerald-50 font-semibold'
                    : 'text-[#64748B] hover:text-[#172B3A] hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link to="/login">
              <Button variant="ghost" size="sm" leftIcon={<LogIn className="w-4 h-4" />}>
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" size="sm" leftIcon={<UserPlus className="w-4 h-4" />}>
                Register
              </Button>
            </Link>
            <Link to="/report">
              <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                Report Damage
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#64748B] hover:text-[#172B3A] hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-[#E2E8F0] bg-white px-4 pt-2 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive(link.href)
                    ? 'text-[#13856B] bg-emerald-50 font-semibold'
                    : 'text-[#172B3A] hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link to="/report" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-center" leftIcon={<PlusCircle className="w-4 h-4" />}>
                Report Damage
              </Button>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="secondary" className="w-full justify-center" leftIcon={<LogIn className="w-4 h-4" />}>
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center" leftIcon={<UserPlus className="w-4 h-4" />}>
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
