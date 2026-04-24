import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "../ui/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });

    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-500"
        >
          {/* Icon */}
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6 border border-rose-100">
            <AlertTriangle size={32} />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Something went wrong
          </h2>

          {/* Message */}
          <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
            We've logged the issue. You can try reloading the page.
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="gap-2"
            >
              Try Again
            </Button>

            <Button
              type="button"
              onClick={this.handleReset}
              className="gap-2"
            >
              <RefreshCcw size={16} />
              Reload Page
            </Button>
          </div>

          {/* Dev Error Details */}
          {import.meta.env.DEV && this.state.error && (
            <div className="mt-8 p-4 bg-slate-900 rounded-xl text-left overflow-auto max-w-2xl w-full">
              <p className="text-rose-400 font-mono text-xs mb-2">
                Error: {this.state.error.message}
              </p>
              <pre className="text-slate-400 font-mono text-[10px] leading-tight">
                {this.state.error.stack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}