// ─── Customers Tab ────────────────────────────────────────────────────────────
// Uses mock data — no backend /api/admin/users endpoint available yet.
// REAL AUTH SWAP: replace MOCK_CUSTOMERS with useListAdminUsers() hook when ready.

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Users, Search, CheckCircle2, XCircle, Mail, MapPin } from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_CUSTOMERS = [
  { id: 1, name: "محمد علي الزهراني",     email: "m.alzahrani@gmail.com",  city: "الرياض",          orders: 8,  spent: 3240, joinDate: "2024-02-10", active: true  },
  { id: 2, name: "سارة عبدالله الغامدي", email: "sarah.g@outlook.com",     city: "جدة",             orders: 3,  spent: 1180, joinDate: "2024-03-05", active: true  },
  { id: 3, name: "خالد عمر البقمي",       email: "k.baqmi@hotmail.com",    city: "مكة المكرمة",     orders: 1,  spent: 420,  joinDate: "2024-04-18", active: false },
  { id: 4, name: "نورة فهد العتيبي",      email: "noura.f@gmail.com",      city: "الدمام",           orders: 5,  spent: 2100, joinDate: "2024-01-25", active: true  },
  { id: 5, name: "عبدالرحمن الدوسري",    email: "a.aldosari@icloud.com",  city: "الطائف",           orders: 2,  spent: 890,  joinDate: "2024-05-01", active: true  },
  { id: 6, name: "ريم ناصر الشمري",       email: "reem.n@gmail.com",       city: "الرياض",          orders: 12, spent: 5600, joinDate: "2023-11-15", active: true  },
  { id: 7, name: "فيصل عادل الحربي",     email: "faisal.h@outlook.com",   city: "جدة",             orders: 0,  spent: 0,    joinDate: "2024-06-02", active: false },
  { id: 8, name: "لمياء سالم العمري",     email: "lamia.s@gmail.com",      city: "المدينة المنورة", orders: 4,  spent: 1560, joinDate: "2024-03-20", active: true  },
];

export function CustomersTab() {
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState<"all" | "active" | "inactive">("all");

  const list = MOCK_CUSTOMERS.filter((c) => {
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active"   && c.active) ||
      (statusFilter === "inactive" && !c.active);
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.includes(search);
    return matchStatus && matchSearch;
  });

  const activeCount   = MOCK_CUSTOMERS.filter((c) => c.active).length;
  const totalSpent    = MOCK_CUSTOMERS.reduce((s, c) => s + c.spent, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">العملاء</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {MOCK_CUSTOMERS.length} عميل مسجل — بيانات تجريبية
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <div className="glass-panel px-4 py-2 rounded-xl text-center border-white/5">
            <p className="font-black text-green-400">{activeCount}</p>
            <p className="text-xs text-muted-foreground">نشط</p>
          </div>
          <div className="glass-panel px-4 py-2 rounded-xl text-center border-white/5">
            <p className="font-black text-primary">{formatPrice(totalSpent)}</p>
            <p className="text-xs text-muted-foreground">إجمالي الإنفاق</p>
          </div>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو المدينة..."
            className="w-full bg-background/50 border border-border rounded-xl pr-10 pl-4 h-10 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatus(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/5 hover:bg-white/10 text-muted-foreground"
              }`}
            >
              {f === "all" ? "الكل" : f === "active" ? "نشط" : "غير نشط"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Users className="w-12 h-12 opacity-20" />
          <p className="font-bold">لا يوجد عملاء</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden border-white/5">
          <table className="w-full text-sm text-right">
            <thead className="bg-black/20 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-bold">العميل</th>
                <th className="px-5 py-3 font-bold hidden md:table-cell">المدينة</th>
                <th className="px-5 py-3 font-bold hidden sm:table-cell">الطلبات</th>
                <th className="px-5 py-3 font-bold hidden lg:table-cell">الإنفاق</th>
                <th className="px-5 py-3 font-bold hidden lg:table-cell">تاريخ التسجيل</th>
                <th className="px-5 py-3 font-bold">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3">
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {c.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {c.city}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell font-semibold">
                    {c.orders}
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell font-bold text-primary">
                    {formatPrice(c.spent)}
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                    {new Date(c.joinDate).toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-5 py-3">
                    {c.active ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
                        <CheckCircle2 className="w-3 h-3" /> نشط
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/10">
                        <XCircle className="w-3 h-3" /> غير نشط
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted-foreground/50 text-center">
        * بيانات تجريبية — سيتم ربطها بـ API العملاء عند توفّره
      </p>
    </div>
  );
}
