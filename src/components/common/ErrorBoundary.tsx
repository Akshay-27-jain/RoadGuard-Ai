import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RoadGuard AI ErrorBoundary caught an unhandled exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-[#F7FAFC]">
          <div className="max-w-lg w-full bg-white rounded-2xl border border-red-200 shadow-sm p-8 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#172B3A]">
                {this.props.fallbackTitle || 'Display Interruption Encountered'}
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {this.props.fallbackMessage ||
                  'The municipal display component encountered an unexpected error while rendering data. Your session remains secure.'}
              </p>
            </div>

            {this.state.error && (
              <details className="text-left text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 font-mono overflow-auto max-h-36">
                <summary className="font-semibold cursor-pointer text-[#13856B] select-none">
                  Technical Diagnostics
                </summary>
                <div className="mt-2 text-[11px] text-red-600 whitespace-pre-wrap">
                  {this.state.error.toString()}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={this.handleReload}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Reload Component
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.location.href = '/';
                }}
                leftIcon={<Home className="w-3.5 h-3.5" />}
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
