import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Lock, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const [, navigate] = useLocation();
  const token = new URLSearchParams(window.location.search).get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);

  const mutation = trpc.clientAuth.resetPassword.useMutation({
    onSuccess: () => setDone(true),
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Les mots de passe ne correspondent pas"); return; }
    mutation.mutate({ token, password });
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0B1628" }}>
        <div className="text-center space-y-4">
          <p className="text-[oklch(0.55_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>
            Lien de réinitialisation manquant ou invalide.
          </p>
          <Link href="/forgot-password">
            <Button className="gold-bg text-[#0B1628] font-black" style={{ fontFamily: "var(--font-heading)" }}>
              Demander un nouveau lien
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0B1628" }}>
      <div className="max-w-md w-full">
        <div className="bg-[#0F1E35] border border-[oklch(0.22_0.03_250)] p-10 rounded-sm">
          {done ? (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 mx-auto text-[oklch(0.65_0.12_85)]" />
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>
                Mot de passe mis à jour !
              </h1>
              <p className="text-[oklch(0.55_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="mt-4 gold-bg text-[#0B1628] font-black hover:opacity-90"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Se connecter
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  Nouveau mot de passe
                </h1>
                <p className="text-[oklch(0.50_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                  Choisissez un mot de passe sécurisé d&apos;au moins 8 caractères.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-[oklch(0.65_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                    Nouveau mot de passe
                  </Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="bg-[oklch(0.13_0.025_250)] border-[oklch(0.22_0.03_250)] text-white h-12 focus:border-[oklch(0.65_0.12_85)] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[oklch(0.65_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                    Confirmer le mot de passe
                  </Label>
                  <Input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="bg-[oklch(0.13_0.025_250)] border-[oklch(0.22_0.03_250)] text-white h-12 focus:border-[oklch(0.65_0.12_85)] transition-colors"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full h-12 gold-bg text-[#0B1628] font-black hover:opacity-90 gap-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {mutation.isPending ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Mise à jour...</>
                  ) : (
                    <><Lock className="w-5 h-5" /> Réinitialiser le mot de passe</>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
