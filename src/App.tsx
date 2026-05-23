import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import Auth from "@/pages/Auth";
import SupplierDashboard from "@/pages/SupplierDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLogin from "@/pages/AdminLogin";
import AdminSuppliers from "@/pages/AdminSuppliers";
import AdminSupplierDetail from "@/pages/AdminSupplierDetail";
import AdminDiscountCodes from "@/pages/AdminDiscountCodes";
import JoinSupplier from "@/pages/JoinSupplier";
import HowItWorks from "@/pages/HowItWorks";
import ReturnPolicy from "@/pages/ReturnPolicy";
import SupplierTerms from "@/pages/SupplierTerms";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

/** Tracks page views on every route change, skipping admin pages. */
function PageTracker() {
  const [location] = useLocation();
  useEffect(() => {
    if (location.startsWith("/admin")) return;
    trackPageView(location);
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/orders/:id" component={OrderDetail} />
      <Route path="/orders" component={Orders} />
      <Route path="/join-supplier" component={JoinSupplier} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/return-policy" component={ReturnPolicy} />
      <Route path="/supplier-terms" component={SupplierTerms} />
      <Route path="/login" component={Auth} />
      <Route path="/register" component={Auth} />
      <Route path="/supplier" component={SupplierDashboard} />
      {/* Admin routes — not linked from public navigation */}
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/suppliers" component={AdminSuppliers} />
      <Route path="/admin/suppliers/:id" component={AdminSupplierDetail} />
      <Route path="/admin/discount-codes" component={AdminDiscountCodes} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <AdminAuthProvider>
              <PageTracker />
              <Router />
              <Toaster />
            </AdminAuthProvider>
          </AuthProvider>
        </WouterRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
