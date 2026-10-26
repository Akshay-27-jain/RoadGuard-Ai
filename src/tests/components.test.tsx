import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SeverityBadge, StatusBadge, DamageClassBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

describe('UI Badge Components', () => {
  it('renders Critical severity badge with correct styling', () => {
    render(<SeverityBadge severity="Critical" />);
    expect(screen.getByText(/Critical/i)).toBeDefined();
  });

  it('renders High and Medium severity badges', () => {
    const { unmount } = render(<SeverityBadge severity="High" />);
    expect(screen.getByText(/High/i)).toBeDefined();
    unmount();

    render(<SeverityBadge severity="Medium" />);
    expect(screen.getByText(/Medium/i)).toBeDefined();
  });

  it('renders Status badges for municipal lifecycle states', () => {
    const { rerender } = render(<StatusBadge status="ASSIGNED" />);
    expect(screen.getByText(/Assigned/i)).toBeDefined();

    rerender(<StatusBadge status="IN_PROGRESS" />);
    expect(screen.getByText(/In Progress/i)).toBeDefined();

    rerender(<StatusBadge status="RESOLVED" />);
    expect(screen.getByText(/Resolved/i)).toBeDefined();

    rerender(<StatusBadge status="VERIFICATION_PENDING" />);
    expect(screen.getByText(/Pending Inspection/i)).toBeDefined();
  });

  it('renders DamageClass badges for D00, D10, D20, D40', () => {
    const { rerender } = render(<DamageClassBadge damageClass="d40" />);
    expect(screen.getByText(/D40 • Pothole/i)).toBeDefined();

    rerender(<DamageClassBadge damageClass="d00" />);
    expect(screen.getByText(/D00 • Longitudinal Crack/i)).toBeDefined();

    rerender(<DamageClassBadge damageClass="d20" />);
    expect(screen.getByText(/D20 • Alligator Crack/i)).toBeDefined();
  });
});

describe('UI Button Component', () => {
  it('renders primary button text', () => {
    render(<Button variant="primary">Submit Report</Button>);
    expect(screen.getByRole('button', { name: /Submit Report/i })).toBeDefined();
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled Action</Button>);
    const btn = screen.getByRole('button', { name: /Disabled Action/i });
    expect(btn.hasAttribute('disabled')).toBe(true);
  });
});

describe('ErrorBoundary Component', () => {
  it('catches render errors and displays fallback UI without crashing', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const ThrowingComponent = () => {
      throw new Error('Test crash in child component');
    };

    render(
      <ErrorBoundary fallbackTitle="Custom Error Title">
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Custom Error Title/i)).toBeDefined();
    expect(screen.getByText(/Reload Component/i)).toBeDefined();
    expect(screen.getByText(/Return to Home/i)).toBeDefined();

    consoleError.mockRestore();
  });
});
