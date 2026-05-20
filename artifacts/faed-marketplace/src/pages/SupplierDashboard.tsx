import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard, Package, ShoppingBag, TrendingUp, Tag,
  Settings, ChevronLeft, Menu, X, Bell, Store
} from "lucide-react";
import { OverviewTab } from "@/components/supplier/OverviewTab";
import { ProductsTab } from "@/components/supplier/ProductsTab";
import { OrdersTab } from "@/components/supplier/OrdersTab";
import { SalesTab } from "@/components/supplier/SalesTab";
import { DiscountsTab } from "@/components/supplier/DiscountsTab";
import { AddProductTab } from "@/components/supplier/AddProductTab";
import { NotificationsTab } from "@/components/supplier/NotificationsTab";
import { StoreTab } from "@/components/supplier/StoreTab";
import { useGetSupplierStats, useListSupplierOrders, useListSupplierProducts } from "@workspace/api-client-react";

type TabId = "overview" | "products" | "add-product" | "orders" | "sales" | "discounts" | "notifications" | "store";

const TABS = [
  { id: "overview" as TabId, label: "الرئيسية", icon: LayoutDashboard },
  { id: "products" as TabId, label: "المنتجات", icon: Package },
  { id: "orders" as TabId, label: "الطلبات", icon: ShoppingBag },
  { id: "sales" as TabId, label: "المبيعات", icon: TrendingUp },
  { id: "discounts" as TabId, label: "أكواد الخصم", icon: Tag },
  { id: "notifications" as TabId, label: "الإشعارات", icon: Bell },
  { id: "store" as TabId, label: "متجري", icon: Store },
];

export default function SupplierDashboard() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: stats } = useGetSupplierStats();
  const { data: orders } = useListSupplierOrders();
  const { data: products } = useListSupplierProducts();

  // Count unread notifications (pending orders + low/out-of-stock products)
  const pendingOrderCount = (orders ?? []).filter((o) => o.status === "pending").length;
  const stockAlertCount = (products ?? []).filter((p) => p.isActive && p.quantity < 10).length;
  const notifUnreadCount = pendingOrderCount + stockAlertCount;

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "supplier")) {
      setLocation("/");
    }
  }, [isLoading, user, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "supplier") {
    return null;
  }

  const isApproved = user.supplierStatus === "approved";

  const navigate = (tab: TabId) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <Layout hideFooter>
      <div className="flex min-h-[calc(100vh-64px)]" dir="rtl">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-0 md:top-16 right-0 h-full md:h-[calc(100vh-64px)]
          w-72 md:w-64 flex-shrink-0 flex flex-col
          bg-[#0a1f26] border-l border-white/10
          z-50 md:z-auto transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}>
          {/* Sidebar Header */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Store className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">مورد في منصة فائض</p>
              </div>
              <button className="md:hidden p-1" onClick={() => setSidebarOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className={`text-xs px-3 py-1.5 rounded-xl font-bold w-fit flex items-center gap-1.5 ${
              isApproved
                ? "bg-green-500/15 text-green-400 border border-green-500/20"
                : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isApproved ? "bg-green-400" : "bg-yellow-400"} animate-pulse`} />
              {isApproved ? "مورد معتمد" : "بانتظار الاعتماد"}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-4 py-3 border-b border-white/10">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "المنتجات", value: stats?.totalProducts ?? 0 },
                { label: "الطلبات", value: stats?.totalOrders ?? 0 },
                { label: "انتظار", value: stats?.pendingOrders ?? 0 },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-2 text-center">
                  <p className="font-black text-sm text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <p className="text-xs text-muted-foreground px-3 py-2 font-bold uppercase tracking-widest">القائمة</p>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id || (activeTab === "add-product" && tab.id === "products");
              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-right ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "hover:bg-white/8 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-bold text-sm flex-1">{tab.label}</span>
                  {tab.id === "notifications" && notifUnreadCount > 0 && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-primary/30 text-primary"
                    }`}>
                      {notifUnreadCount > 9 ? "9+" : notifUnreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => setLocation("/")}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>العودة للمتجر</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Top bar */}
          <div className="sticky top-16 z-30 flex items-center gap-3 px-4 md:px-8 py-3 bg-background/80 backdrop-blur-md border-b border-white/10">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <p className="font-bold text-sm">
                {activeTab === "overview" && "لوحة التحكم"}
                {activeTab === "products" && "إدارة المنتجات"}
                {activeTab === "add-product" && "إضافة منتج"}
                {activeTab === "orders" && "الطلبات الواردة"}
                {activeTab === "sales" && "المبيعات والتحليلات"}
                {activeTab === "discounts" && "أكواد الخصم"}
                {activeTab === "notifications" && "الإشعارات"}
                {activeTab === "store" && "معلومات المتجر"}
              </p>
            </div>
            <button
              onClick={() => navigate("notifications")}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors relative"
              title="الإشعارات"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {notifUnreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-primary text-primary-foreground text-[9px] font-black rounded-full flex items-center justify-center">
                  {notifUnreadCount > 9 ? "9+" : notifUnreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Page Content */}
          <div className="flex-1 p-4 md:p-8">
            {!isApproved && (
              <div className="mb-6 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
                <span className="text-yellow-400 mt-0.5">⚠️</span>
                <div>
                  <p className="font-bold text-yellow-400 text-sm">حسابك قيد المراجعة</p>
                  <p className="text-xs text-muted-foreground mt-0.5">سيتم إخطارك عند اعتماد حسابك. يمكنك الاطلاع على الداشبورد في الوقت الحالي.</p>
                </div>
              </div>
            )}

            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "products" && (
              <ProductsTab onAddProduct={() => navigate("add-product")} />
            )}
            {activeTab === "add-product" && (
              <AddProductTab
                onSuccess={() => navigate("products")}
                onBack={() => navigate("products")}
              />
            )}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "sales" && <SalesTab />}
            {activeTab === "discounts" && <DiscountsTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "store" && <StoreTab />}
          </div>
        </main>
      </div>
    </Layout>
  );
}
