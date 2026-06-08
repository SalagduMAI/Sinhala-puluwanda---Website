import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
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
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== 'undefined') {
      window.location.hash = '';
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl text-center space-y-6">
            <div className="text-6xl animate-bounce">⚠️</div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-saffron-400 to-saffron-600 bg-clip-text text-transparent">
              Something went wrong!
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              An unexpected error occurred in the application. We apologize for the inconvenience.
            </p>
            {this.state.error && (
              <pre className="text-left text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto text-red-400 max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-6 bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-400 hover:to-saffron-500 text-slate-950 font-semibold rounded-2xl shadow-lg shadow-saffron-500/20 hover:shadow-saffron-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Restart App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
