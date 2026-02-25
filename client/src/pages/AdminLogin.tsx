import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Shield, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginMutation = trpc.clientAuth.loginAdmin.useMutation({
    onSuccess: () => {
      toast.success("Connexion admin réussie !");
      navigate("/admin");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0D1B2E] to-[#0A1628] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md bg-[oklch(0.12_0.025_250)] border-[oklch(0.25_0.03_250)] p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Administration
          </h1>
          <p className="text-[oklch(0.60_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>
            Accès réservé aux administrateurs
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[oklch(0.70_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>
              Email administrateur
            </Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@jevalis.com"
              required
              className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[oklch(0.70_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>
              Mot de passe
            </Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              required
              className="bg-[oklch(0.15_0.03_250)] border-[oklch(0.25_0.03_250)] text-white h-12"
            />
          </div>

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full h-12 gold-bg text-[#0A1628] font-bold hover:opacity-90"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Connexion...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Se connecter
              </>
            )}
          </Button>
        </form>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm text-[oklch(0.50_0.02_250)] hover:text-[oklch(0.70_0.02_250)] transition-colors"
            style={{ fontFamily: "var(--font-caption)" }}
          >
            ← Retour à l'accueil
          </button>
        </div>
      </Card>
    </div>
  );
}
