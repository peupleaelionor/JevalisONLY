import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { LogOut, Download, FileText, Calendar, MapPin, Loader2, User, ArrowRight, Plus } from "lucide-react";

export default function Account() {
  const [, navigate] = useLocation();
  const { data: currentUser, isLoading: isLoadingUser } = trpc.clientAuth.getCurrentClient.useQuery();
  const { data: simulationsData, isLoading: isLoadingSimulations } = trpc.clientAuth.getMySimulations.useQuery();
  const logoutMutation = trpc.clientAuth.logoutClient.useMutation({
    onSuccess: () => { toast.success("Déconnexion réussie"); navigate("/login"); },
  });

  useEffect(() => {
    if (!isLoadingUser && !currentUser?.user) navigate("/login");
  }, [currentUser, isLoadingUser, navigate]);

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0B1628" }}>
        <Loader2 className="w-10 h-10 gold-text animate-spin"/>
      </div>
    );
  }
  if (!currentUser?.user) return null;

  const COUNTRY_LABELS: Record<string, string> = { france: "🇫🇷 France", suisse: "🇨🇭 Suisse", belgique: "🇧🇪 Belgique", luxembourg: "🇱🇺 Luxembourg", "pays-bas": "🇳🇱 Pays-Bas", allemagne: "🇩🇪 Allemagne" };
  const OP_LABELS: Record<string, string> = { achat: "Achat", vente: "Vente", achat_vente: "Achat + Vente" };

  return (
    <div className="min-h-screen py-0" style={{ background: "#0B1628" }}>
      {/* Top nav */}
      <nav className="border-b border-[oklch(0.15_0.03_250)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/"><span className="font-black text-lg tracking-widest cursor-pointer" style={{ fontFamily: "var(--font-heading)" }}><span className="text-white">JE</span><span className="gold-text">V</span><span className="text-white">ALIS</span></span></Link>
          <div className="flex items-center gap-3">
            <Link href="/"><Button variant="outline" size="sm" className="border-[oklch(0.25_0.03_250)] text-white text-xs" style={{ fontFamily: "var(--font-heading)" }}>Accueil</Button></Link>
            <Button onClick={() => logoutMutation.mutate()} variant="outline" size="sm" className="border-[oklch(0.25_0.03_250)] text-white text-xs gap-1" style={{ fontFamily: "var(--font-heading)" }}>
              <LogOut className="w-3.5 h-3.5"/> Déconnexion
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full gold-bg flex items-center justify-center text-[#0B1628] font-black text-lg" style={{ fontFamily: "var(--font-heading)" }}>
              {currentUser.user.fullName[0]}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-heading)" }}>Bonjour, {currentUser.user.fullName.split(" ")[0]} 👋</h1>
              <p className="text-[oklch(0.50_0.02_250)] text-sm" style={{ fontFamily: "var(--font-caption)" }}>{currentUser.user.email}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left – User info */}
          <div className="space-y-6">
            <div className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.20_0.03_250)] p-6">
              <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}><User className="w-4 h-4 gold-text"/> Mon profil</h2>
              <div className="space-y-4">
                {[
                  { label: "Nom complet", value: currentUser.user.fullName },
                  { label: "Email", value: currentUser.user.email },
                  { label: "Membre depuis", value: new Date(currentUser.user.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[oklch(0.45_0.02_250)] text-xs mb-1" style={{ fontFamily: "var(--font-caption)" }}>{label}</p>
                    <p className="text-white text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.20_0.03_250)] p-6">
              <h2 className="text-base font-bold text-white mb-5" style={{ fontFamily: "var(--font-heading)" }}>Actions rapides</h2>
              <div className="space-y-3">
                <Link href="/#simulation">
                  <Button className="w-full gold-bg text-[#0B1628] font-black gap-2 justify-start" size="sm" style={{ fontFamily: "var(--font-heading)" }}>
                    <Plus className="w-4 h-4"/> Nouvelle simulation
                  </Button>
                </Link>
                <Link href="/apercu-ebook">
                  <Button variant="outline" className="w-full border-[oklch(0.25_0.03_250)] text-white gap-2 justify-start" size="sm" style={{ fontFamily: "var(--font-heading)" }}>
                    <FileText className="w-4 h-4"/> Guide fiscal
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right – Simulations */}
          <div className="lg:col-span-2">
            <div className="bg-[oklch(0.13_0.025_250)] border border-[oklch(0.20_0.03_250)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-bold text-white flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}><FileText className="w-4 h-4 gold-text"/> Mes Simulations</h2>
                {simulationsData?.simulations && simulationsData.simulations.length > 0 && (
                  <span className="text-xs text-[oklch(0.50_0.02_250)] bg-[oklch(0.18_0.03_250)] px-3 py-1" style={{ fontFamily: "var(--font-caption)" }}>
                    {simulationsData.simulations.length} simulation{simulationsData.simulations.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {isLoadingSimulations ? (
                <div className="text-center py-16"><Loader2 className="w-10 h-10 gold-text animate-spin mx-auto"/></div>
              ) : simulationsData?.simulations.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-14 h-14 text-[oklch(0.25_0.02_250)] mx-auto mb-5"/>
                  <p className="text-white font-bold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Aucune simulation</p>
                  <p className="text-[oklch(0.50_0.02_250)] text-sm mb-6" style={{ fontFamily: "var(--font-caption)" }}>Lancez votre première simulation pour obtenir un rapport fiscal professionnel.</p>
                  <Link href="/#simulation">
                    <Button className="gold-bg text-[#0B1628] font-black gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                      Créer ma première simulation <ArrowRight className="w-4 h-4"/>
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {simulationsData?.simulations.map((sim) => (
                    <div key={sim.id} className="bg-[oklch(0.11_0.02_250)] border border-[oklch(0.18_0.03_250)] p-5 hover:border-[oklch(0.30_0.05_85)] transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <MapPin className="w-3.5 h-3.5 gold-text"/>
                            <span className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                              {sim.city}, {COUNTRY_LABELS[sim.country] || sim.country}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-[oklch(0.50_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(sim.createdAt).toLocaleDateString("fr-FR")}</span>
                            {sim.operationType && <span>{OP_LABELS[sim.operationType] || sim.operationType}</span>}
                            {sim.purchasePrice && <span>{Number(sim.purchasePrice).toLocaleString("fr-FR")} €</span>}
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold ${sim.status === "completed" || sim.status === "paid" ? "bg-green-500/15 text-green-400 border border-green-500/20" : sim.status === "pending" ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20" : "bg-red-500/15 text-red-400 border border-red-500/20"}`} style={{ fontFamily: "var(--font-caption)" }}>
                          {sim.status === "completed" || sim.status === "paid" ? "Payé" : sim.status === "pending" ? "En attente" : "Échoué"}
                        </span>
                      </div>
                      {sim.reportUrl && (
                        <a href={sim.reportUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="gold-bg text-[#0B1628] font-bold text-xs gap-1.5 h-8" style={{ fontFamily: "var(--font-heading)" }}>
                            <Download className="w-3.5 h-3.5"/> Télécharger le rapport
                          </Button>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
