import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Mail, CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const mutation = trpc.clientAuth.forgotPassword.useMutation({
    onSuccess: () => setSent(true),
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0B1628" }}>
      <div className="max-w-md w-full">
        <div className="mb-8">
          <Link href="/login">
            <span className="flex items-center gap-2 text-[oklch(0.50_0.02_250)] hover:text-white transition-colors text-sm cursor-pointer" style={{ fontFamily: "var(--font-caption)" }}>
              <ArrowLeft className="w-4 h-4" /> Retour à la connexion
            </span>
          </Link>
        </div>

        <div className="bg-[#0F1E35] border border-[oklch(0.22_0.03_250)] p-10 rounded-sm">
          {sent ? (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 mx-auto text-[oklch(0.65_0.12_85)]" />
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>
                Email envoyé !
              </h1>
              <p className="text-[oklch(0.55_0.02_250)] text-sm leading-relaxed" style={{ fontFamily: "var(--font-caption)" }}>
                Si un compte existe avec l&apos;adresse <strong className="text-white">{email}</strong>, vous recevrez un lien de réinitialisation valable 1 heure.
              </p>
              <Link href="/login">
                <Button variant="outline" className="mt-4 border-[oklch(0.22_0.03_250)] text-[oklch(0.65_0.02_250)] hover:text-white" style={{ fontFamily: "var(--font-caption)" }}>
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  Mot de passe oublié ?
                </h1>
                <p className="text-[oklch(0.50_0.02_250)] text-sm leading-relaxed" style={{ fontFamily: "var(--font-caption)" }}>
                  Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-[oklch(0.65_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>
                    Adresse email
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jean@exemple.com"
                    required
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
                    <><Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours...</>
                  ) : (
                    <><Mail className="w-5 h-5" /> Envoyer le lien</>
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
