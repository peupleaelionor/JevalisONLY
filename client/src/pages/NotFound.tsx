import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A1628]">
      <div className="text-center space-y-8 px-6">
        <p
          className="text-8xl font-black gold-text"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          404
        </p>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Page introuvable
        </h1>
        <p
          className="text-[oklch(0.50_0.02_250)] max-w-md mx-auto"
          style={{ fontFamily: "var(--font-body)" }}
        >
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button
          onClick={() => setLocation("/")}
          className="gold-bg text-[#0A1628] font-bold px-8 h-12 hover:opacity-90 transition-opacity cursor-pointer"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
}
