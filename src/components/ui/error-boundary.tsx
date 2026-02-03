'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-[#EF4444]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-[#EF4444]" />
            </div>
            <h2 className="text-xl font-semibold text-[#1a1a2e] mb-2">
              Something went wrong
            </h2>
            <p className="text-[#1a1a2e]/60 mb-6">
              We encountered an unexpected error. Please try again.
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="mt-6 p-4 bg-[#1a1a2e]/5 rounded-lg text-left text-xs text-[#EF4444] overflow-auto">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional error component for use with suspense/error boundaries
export function ErrorMessage({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="text-center p-6">
      <div className="w-12 h-12 bg-[#EF4444]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
      </div>
      <h3 className="font-semibold text-[#1a1a2e] mb-1">{title}</h3>
      <p className="text-sm text-[#1a1a2e]/60 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-[#9FE870] font-medium hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
