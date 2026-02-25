import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import Testimonials from "./pages/Testimonials";
import Success from "./pages/Success";
import Login from "./pages/Login";
import Account from "./pages/Account";
import AdminLogin from "./pages/AdminLogin";
import EbookPreview from "./pages/EbookPreview";
import LegalPage from "./pages/LegalPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={Blog} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={Admin} />
      <Route path="/testimonials" component={Testimonials} />
      <Route path="/success" component={Success} />
      <Route path="/login" component={Login} />
      <Route path="/account" component={Account} />
      <Route path="/apercu-ebook" component={EbookPreview} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/mentions-legales" component={() => <LegalPage page="mentions" />} />
      <Route path="/confidentialite" component={() => <LegalPage page="confidentialite" />} />
      <Route path="/cgv" component={() => <LegalPage page="cgv" />} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
