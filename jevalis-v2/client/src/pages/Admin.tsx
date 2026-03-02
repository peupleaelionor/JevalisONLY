import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Download,
  Users,
  TrendingUp,
  Globe,
  Loader2,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

export default function Admin() {
  const [, navigate] = useLocation();
  const { data: adminSession, isLoading: loading } = trpc.clientAuth.checkAdminSession.useQuery();
  const logoutMutation = trpc.clientAuth.logoutAdmin.useMutation({
    onSuccess: () => {
      toast.success("Déconnexion réussie");
      navigate("/admin/login");
    },
  });

  const isAuthenticated = adminSession?.isAuthenticated || false;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, loading, navigate]);

  const statsQuery = trpc.admin.stats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const simsQuery = trpc.admin.listSimulations.useQuery(
    { limit: 100, offset: 0 },
    { enabled: isAuthenticated }
  );

  const exportCSV = trpc.admin.exportCSV.useQuery(undefined, {
    enabled: false,
  });

  const handleExport = async () => {
    const result = await exportCSV.refetch();
    if (result.data) {
      const blob = new Blob([result.data.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `jevalis-export-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`${result.data.count} simulations exportées`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin gold-text" />
      </div>
    );
  }

  // La redirection est gérée par useEffect ci-dessus
  if (!isAuthenticated) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Accès refusé
          </h1>
          <p className="text-[oklch(0.55_0.02_250)]">Vous n'avez pas les droits administrateur.</p>
          <Link href="/">
            <Button variant="outline" className="border-[oklch(0.25_0.03_250)] text-white">
              <ArrowLeft className="mr-2 w-4 h-4" /> Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const stats = statsQuery.data;
  const sims = simsQuery.data;

  const countryLabels: Record<string, string> = {
    france: "France",
    suisse: "Suisse",
    belgique: "Belgique",
    luxembourg: "Luxembourg",
  };

  return (
    <div className="min-h-screen bg-[#0A1628]">
      {/* Header */}
      <nav className="border-b border-[oklch(0.20_0.03_250)] bg-[#0A1628]/90 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/">
              <span className="font-bold text-lg tracking-widest" style={{ fontFamily: "var(--font-heading)" }}>
                <span className="text-white">JE</span><span className="gold-text">V</span><span className="text-white">ALIS</span>
              </span>
            </Link>
            <span className="text-xs px-2 py-1 gold-bg text-[#0A1628] font-bold rounded" style={{ fontFamily: "var(--font-caption)" }}>
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[oklch(0.55_0.02_250)]">{adminSession?.user?.email || "Admin"}</span>
            <Button
              onClick={() => logoutMutation.mutate()}
              variant="outline"
              size="sm"
              className="border-[oklch(0.25_0.03_250)] text-white hover:bg-[oklch(0.18_0.03_250)]"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Tableau de bord
          </h1>
          <Button
            onClick={handleExport}
            className="gold-bg text-[#0A1628] font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Download className="mr-2 w-4 h-4" />
            Exporter CSV
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[oklch(0.12_0.025_250)] border border-[oklch(0.20_0.03_250)] p-6 space-y-2">
              <div className="flex items-center gap-2 text-[oklch(0.50_0.02_250)]">
                <Users className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-caption)" }}>
                  Simulations totales
                </span>
              </div>
              <p className="text-3xl font-bold gold-text" style={{ fontFamily: "var(--font-heading)" }}>
                {stats.totalSimulations}
              </p>
            </div>

            <div className="bg-[oklch(0.12_0.025_250)] border border-[oklch(0.20_0.03_250)] p-6 space-y-2">
              <div className="flex items-center gap-2 text-[oklch(0.50_0.02_250)]">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-caption)" }}>
                  Revenus estimés
                </span>
              </div>
              <p className="text-3xl font-bold gold-text" style={{ fontFamily: "var(--font-heading)" }}>
                {stats.totalRevenue.toLocaleString("fr-FR")} €
              </p>
            </div>

            <div className="bg-[oklch(0.12_0.025_250)] border border-[oklch(0.20_0.03_250)] p-6 space-y-2">
              <div className="flex items-center gap-2 text-[oklch(0.50_0.02_250)]">
                <Globe className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-caption)" }}>
                  Pays les plus demandés
                </span>
              </div>
              <div className="space-y-1">
                {Object.entries(stats.byCountry)
                  .sort(([, a], [, b]) => b - a)
                  .map(([country, count]) => (
                    <div key={country} className="flex justify-between text-sm">
                      <span className="text-[oklch(0.65_0.02_250)]">{countryLabels[country] || country}</span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-[oklch(0.12_0.025_250)] border border-[oklch(0.20_0.03_250)] p-6 space-y-2">
              <div className="flex items-center gap-2 text-[oklch(0.50_0.02_250)]">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider" style={{ fontFamily: "var(--font-caption)" }}>
                  Taux de conversion
                </span>
              </div>
              <p className="text-3xl font-bold gold-text" style={{ fontFamily: "var(--font-heading)" }}>
                {stats.totalSimulations > 0
                  ? ((stats.completedSimulations / stats.totalSimulations) * 100).toFixed(1)
                  : "0"} %
              </p>
            </div>
          </div>
        )}

        {/* Simulations Table */}
        <div className="bg-[oklch(0.12_0.025_250)] border border-[oklch(0.20_0.03_250)] overflow-hidden">
          <div className="p-6 border-b border-[oklch(0.20_0.03_250)]">
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
              Dernières simulations
            </h2>
            <p className="text-sm text-[oklch(0.50_0.02_250)]" style={{ fontFamily: "var(--font-caption)" }}>
              {sims?.total ?? 0} simulations au total
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[oklch(0.20_0.03_250)]">
                  {["Date", "Nom", "Email", "Pays", "Ville", "Type", "Statut", "Rapport"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium text-[oklch(0.50_0.02_250)] uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-caption)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sims?.simulations.map((sim) => (
                  <tr key={sim.publicId} className="border-b border-[oklch(0.15_0.03_250)] hover:bg-[oklch(0.14_0.025_250)]">
                    <td className="px-4 py-3 text-sm text-[oklch(0.65_0.02_250)]">
                      {sim.createdAt ? new Date(sim.createdAt).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-medium">{sim.fullName}</td>
                    <td className="px-4 py-3 text-sm text-[oklch(0.65_0.02_250)]">{sim.email}</td>
                    <td className="px-4 py-3 text-sm text-white">{countryLabels[sim.country] || sim.country}</td>
                    <td className="px-4 py-3 text-sm text-[oklch(0.65_0.02_250)]">{sim.city}</td>
                    <td className="px-4 py-3 text-sm text-[oklch(0.65_0.02_250)]">{sim.operationType}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                          sim.status === "completed"
                            ? "bg-green-900/30 text-green-400"
                            : sim.status === "paid"
                            ? "bg-blue-900/30 text-blue-400"
                            : sim.status === "failed"
                            ? "bg-red-900/30 text-red-400"
                            : "bg-yellow-900/30 text-yellow-400"
                        }`}
                      >
                        {sim.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {sim.reportUrl ? (
                        <a href={sim.reportUrl} target="_blank" rel="noopener noreferrer" className="gold-text text-xs hover:underline">
                          PDF
                        </a>
                      ) : (
                        <span className="text-[oklch(0.40_0.02_250)] text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {(!sims || sims.simulations.length === 0) && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-[oklch(0.45_0.02_250)]">
                      Aucune simulation pour le moment
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
