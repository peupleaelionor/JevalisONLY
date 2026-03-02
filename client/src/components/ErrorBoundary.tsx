import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-[#0A1628]">
          <div className="flex flex-col items-center w-full max-w-md text-center">
            <AlertTriangle
              size={48}
              className="mb-6 flex-shrink-0"
              style={{ color: "oklch(0.75 0.12 85)" }}
            />

            <h2
              className="text-xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Une erreur est survenue
            </h2>

            <p
              className="text-sm text-[oklch(0.50_0.02_250)] mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Veuillez recharger la page. Si le problème persiste, contactez le support.
            </p>

            <button
              onClick={() => window.location.reload()}
              className={cn(
                "flex items-center gap-2 px-6 py-3 font-bold text-sm",
                "text-[#0A1628] cursor-pointer hover:opacity-90 transition-opacity"
              )}
              style={{
                fontFamily: "var(--font-heading)",
                background: "linear-gradient(135deg, oklch(0.78 0.12 85), oklch(0.65 0.15 75))",
              }}
            >
              <RotateCcw size={16} />
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
