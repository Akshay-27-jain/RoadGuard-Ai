import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// Public Pages
import { HomePage } from '@/pages/public/Home';
import { HowItWorksPage } from '@/pages/public/HowItWorks';
import { FeaturesPage } from '@/pages/public/Features';
import { ReportingGuidePage } from '@/pages/public/ReportingGuide';
import { SafetyPage } from '@/pages/public/Safety';
import { AboutPage } from '@/pages/public/About';
import { ContactPage } from '@/pages/public/Contact';
import { LoginPage } from '@/pages/public/Login';
import { RegisterPage } from '@/pages/public/Register';
import { ForgotPasswordPage } from '@/pages/public/ForgotPassword';
import { ResetPasswordPage } from '@/pages/public/ResetPassword';
import { PrivacyPage } from '@/pages/public/Privacy';
import { TermsPage } from '@/pages/public/Terms';
import { ReportDamagePage } from '@/pages/public/ReportDamage';
import { TrackComplaintPage } from '@/pages/public/TrackComplaint';
import { NotFoundPage } from '@/pages/public/NotFound';

// Protected Portals
import { CitizenDashboardPage } from '@/pages/citizen/Dashboard';
import { OfficerDashboardPage } from '@/pages/officer/Dashboard';
import { AdminDashboardPage } from '@/pages/admin/Dashboard';

// Layout wrapper for standard public pages
const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFC] text-[#172B3A]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          {/* Public Pages wrapped with Navbar and Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/reporting-guide" element={<ReportingGuidePage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/report" element={<ReportDamagePage />} />
            <Route path="/track" element={<TrackComplaintPage />} />
            <Route path="/track/:id" element={<TrackComplaintPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Route>

          {/* Auth Pages (Clean standalone shell) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Citizen Portal */}
          <Route element={<ProtectedRoute allowedRoles={['citizen']} />}>
            <Route path="/citizen/dashboard" element={<CitizenDashboardPage />} />
          </Route>

          {/* Protected Municipal Officer Portal */}
          <Route element={<ProtectedRoute allowedRoles={['officer', 'admin']} />}>
            <Route path="/officer/dashboard" element={<OfficerDashboardPage />} />
          </Route>

          {/* Protected Administrator Command Centre */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Route>

          {/* Fallback 404 */}
          <Route element={<PublicLayout />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ErrorBoundary>
  );
}

export default App;
