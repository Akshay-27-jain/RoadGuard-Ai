import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 text-[#172B3A] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#13856B] flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-[#172B3A]">RoadGuard AI</span>
            </div>
            <p className="text-sm text-[#64748B] leading-relaxed max-w-sm">
              Empowering citizens and municipal road maintenance authorities with automated road damage detection, priority-based repair dispatching, and verified infrastructure resolution.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#64748B] pt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#13856B]" />
                Municipal Corporation Hub
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#13856B]" />
                Toll Free: 1800-ROADS
              </span>
            </div>
          </div>

          {/* Damage Classes */}
          <div>
            <h4 className="text-sm font-semibold text-[#172B3A] uppercase tracking-wider mb-4">
              Damage Classes
            </h4>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li className="hover:text-[#13856B] transition-colors">
                <span className="font-medium text-[#172B3A]">D40:</span> Potholes & Cavities
              </li>
              <li className="hover:text-[#13856B] transition-colors">
                <span className="font-medium text-[#172B3A]">D00:</span> Longitudinal Cracks
              </li>
              <li className="hover:text-[#13856B] transition-colors">
                <span className="font-medium text-[#172B3A]">D10:</span> Transverse Cracks
              </li>
              <li className="hover:text-[#13856B] transition-colors">
                <span className="font-medium text-[#172B3A]">D20:</span> Alligator Cracking
              </li>
              <li className="hover:text-[#13856B] transition-colors">
                <span className="font-medium text-[#172B3A]">Edge:</span> Road Edge Breaks
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-[#172B3A] uppercase tracking-wider mb-4">
              Platform Links
            </h4>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li>
                <Link to="/how-it-works" className="hover:text-[#13856B] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-[#13856B] transition-colors">
                  Platform Features
                </Link>
              </li>
              <li>
                <Link to="/reporting-guide" className="hover:text-[#13856B] transition-colors">
                  Reporting Guidelines
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-[#13856B] transition-colors">
                  Road Safety & Awareness
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#13856B] transition-colors">
                  About RoadGuard AI
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#13856B] transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Municipal & Legal */}
          <div>
            <h4 className="text-sm font-semibold text-[#172B3A] uppercase tracking-wider mb-4">
              Governance & Legal
            </h4>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li>
                <Link to="/privacy" className="hover:text-[#13856B] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#13856B] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#13856B] transition-colors">
                  Officer Login
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#13856B] transition-colors">
                  Admin Portal
                </Link>
              </li>
              <li className="pt-2">
                <a
                  href="https://morth.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#13856B] hover:underline"
                >
                  MoRTH Road Guidelines <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© {new Date().getFullYear()} RoadGuard AI. Public Municipal Road Maintenance Management.</p>
          <div className="flex items-center gap-1">
            <span>Built for Safer Public Infrastructure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
