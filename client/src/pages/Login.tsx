import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { LogIn, UserPlus, Loader2, ArrowLeft, Shield, FileText, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Login() {
  const [, navigate] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", fullName: "" });

  const loginMutation = trpc.clientAuth.loginClient.useMutation({
    onSuccess: () => { toast.success("Connexion réussie !"); navigate("/account"); },
    onError: (e) => toast.error(e.message),
  });
  const registerMutation = trpc.clientAuth.registerClient.useMutation({
    onSuccess: () => { toast.success("Compte créé ! Bienvenue sur Jevalis."); navigate("/account"); },
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) loginMutation.mutate({ email: formData.email, password: formData.password });
    else {
      if (!formData.fullName) { toast.error("Le nom complet est requis"); return; }
      registerMutation.mutate({ email: formData.email, password: formData.password, fullName: formData.fullName });
    }
  };
  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen flex" style={{ background: "#0B1628" }}>
      {/* Left panel – context */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 border-r border-[oklch(0.15_0.03_250)] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15" width="800" height="800" viewBox="0 0 800 800" fill="none">
            <circle cx="400" cy="400" r="280" stroke="oklch(0.75 0.12 85)" strokeWidth="0.8"/>
            <circle cx="400" cy="400" r="360" stroke="oklch(0.65 0.10 85)" strokeWidth="0.5"/>
          </svg>
        </div>
        <Link href="/"><span className="font-black text-xl tracking-widest cursor-pointer" style={{ fontFamily: "var(--font-heading)" }}><span className="text-white">JE</span><span className="gold-text">V</span><span className="text-white">ALIS</span></span></Link>
        <div className="space-y-8 relative z-10">
          <div>
            <h2 className="text-3xl font-black text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              {isLogin ? "Retrouvez vos" : "Commencez à"}<br/>
              <span className="gold-text italic">{isLogin ? "simulations" : "simuler gratuitement"}</span>
            </h2>
            <p className="text-[oklch(0.50_0.02_250)] leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              {isLogin
                ? "Accédez à l'ensemble de vos rapports et simulations immobilières en un clic."
                : "Créez votre compte pour sauvegarder vos simulations et retrouver vos rapports PDF à tout moment."
              }
            </p>
          </div>
          <div className="space-y-4">
            {[
              { icon: Shield, label: "Données sécurisées et confidentielles" },
              { icon: FileText, label: "Historique complet de vos simulations" },
              { icon: Zap, label: "Rapports PDF accessibles à tout moment" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-[oklch(0.55_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                <div className="w-8 h-8 border border-[oklch(0.22_0.03_250)] flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4 gold-text"/></div>
                {label}
              </div>
            ))}
          </div>
        </div>
        <p className="text-[oklch(0.35_0.02_250)] text-xs" style={{ fontFamily: "var(--font-caption)" }}>© 2026 Jevalis. Tous droits réservés.</p>
      </div>

      {/* Right panel – form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile logo */}
          <div className="flex items-center justify-between mb-12 lg:hidden">
            <Link href="/"><span className="font-black text-lg tracking-widest cursor-pointer" style={{ fontFamily: "var(--font-heading)" }}><span className="text-white">JE</span><span className="gold-text">V</span><span className="text-white">ALIS</span></span></Link>
          </div>

          <Link href="/"><span className="flex items-center gap-2 text-[oklch(0.50_0.02_250)] hover:text-white transition-colors text-sm mb-8 cursor-pointer" style={{ fontFamily: "var(--font-caption)" }}><ArrowLeft className="w-4 h-4"/> Retour à l&apos;accueil</span></Link>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              {isLogin ? "Connexion" : "Créer un compte"}
            </h1>
            <p className="text-[oklch(0.50_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>
              {isLogin ? "Accédez à vos simulations et rapports" : "Commencez à utiliser Jevalis gratuitement"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label className="text-[oklch(0.65_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>Nom complet</Label>
                <Input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Jean Dupont" required={!isLogin}
                  className="bg-[oklch(0.13_0.025_250)] border-[oklch(0.22_0.03_250)] text-white h-12 focus:border-[oklch(0.65_0.12_85)] transition-colors"/>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-[oklch(0.65_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="jean@exemple.com" required
                className="bg-[oklch(0.13_0.025_250)] border-[oklch(0.22_0.03_250)] text-white h-12 focus:border-[oklch(0.65_0.12_85)] transition-colors"/>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-[oklch(0.65_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>Mot de passe</Label>
                {isLogin && <span className="text-xs text-[oklch(0.55_0.02_250)] hover:gold-text cursor-pointer transition-colors" style={{ fontFamily: "var(--font-caption)" }}>Mot de passe oublié ?</span>}
              </div>
              <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" required minLength={8}
                className="bg-[oklch(0.13_0.025_250)] border-[oklch(0.22_0.03_250)] text-white h-12 focus:border-[oklch(0.65_0.12_85)] transition-colors"/>
              {!isLogin && <p className="text-xs text-[oklch(0.45_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>Minimum 8 caractères</p>}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-12 gold-bg text-[#0B1628] font-black hover:opacity-90 gap-2 mt-2" style={{ fontFamily: "var(--font-heading)" }}>
              {isLoading ? (<><Loader2 className="w-5 h-5 animate-spin"/> {isLogin ? "Connexion..." : "Création..."}</>) : (<>{isLogin ? <LogIn className="w-5 h-5"/> : <UserPlus className="w-5 h-5"/>} {isLogin ? "Se connecter" : "Créer mon compte"}</>)}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[oklch(0.55_0.02_250)] hover:text-white transition-colors text-sm" style={{ fontFamily: "var(--font-caption)" }}>
              {isLogin ? (<>Pas encore de compte ? <span className="gold-text font-bold">Créer un compte</span></>) : (<>Déjà un compte ? <span className="gold-text font-bold">Se connecter</span></>)}
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-[oklch(0.15_0.03_250)] text-center">
            <p className="text-xs text-[oklch(0.40_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>
              En continuant, vous acceptez nos <span className="hover:text-white cursor-pointer transition-colors">CGV</span> et notre <span className="hover:text-white cursor-pointer transition-colors">politique de confidentialité</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
