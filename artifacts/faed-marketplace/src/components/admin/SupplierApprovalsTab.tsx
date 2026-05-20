import { useListSuppliers, useApproveSupplier } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2, Clock, Users, Building2, Mail, Search,
} from "lucide-react";

type FilterId = "all" | "pending" | "approved";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all",      label: "الكل" },
  { id: "pending",  label: "قيد المراجعة" },
  { id: "approved", label: "معتمد" },
];

export function SupplierApprovalsTab() {
  const { data: suppliers, isLoading } = useListSuppliers();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [filter, setFilter] = useState<FilterId>("all");
  const [search, setSearch] = useState("");

  const approveMut = useApproveSupplier({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/suppliers"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
        toast({ title: "تم الاعتماد", description: "تم اعتماد المورد بنجاح" });
      },
      onError: () => {
        toast({ title: "خطأ", description: "تعذّر اعتماد المورد", variant: "destructive" });
      },
    },
  });

  const list = (suppliers ?? []).filter((s) => {
    const matchFilter =
      filter === "all" ||
      (filter === "pending"  && s.verificationStatus === "pending") ||
      (filter === "approved" && s.verificationStatus === "approved");
    const matchSearch =
      !search ||
      s.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      s.userEmail?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const pendingCount  = (suppliers ?? []).filter((s) => s.verificationStatus === "pending").length;
  const approvedCount = (suppliers ?? []).filter((s) => s.verificationStatus === "approved").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">اعتماد الموردين</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pendingCount > 0 ? `${pendingCount} طلب ينتظر المراجعة` : "لا توجد طلبات معلّقة"}
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <div className="glass-panel px-4 py-2 rounded-xl text-center border-white/5">
            <p className="font-black text-amber-400">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">معلّق</p>
          </div>
          <div className="glass-panel px-4 py-2 rounded-xl text-center border-white/5">
            <p className="font-black text-green-400">{approvedCount}</p>
            <p className="text-xs text-muted-foreground">معتمد</p>
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
            placeholder="بحث بالاسم أو البريد..."
            className="w-full bg-background/50 border border-border rounded-xl pr-10 pl-4 h-10 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/5 hover:bg-white/10 text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
          <Users className="w-12 h-12 opacity-20" />
          <p className="font-bold">لا يوجد موردون</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((s: any) => {
            const isPending = s.verificationStatus === "pending";
            return (
              <div
                key={s.id}
                className="glass-panel rounded-2xl p-5 border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base">{s.businessName || "—"}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" /> {s.userName || "—"}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {s.userEmail || "—"}
                    </span>
                  </div>
                </div>

                {/* Status + action */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {isPending ? (
                    <>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                        <Clock className="w-3 h-3" /> قيد المراجعة
                      </span>
                      <Button
                        size="sm"
                        onClick={() => approveMut.mutate({ id: s.id })}
                        disabled={approveMut.isPending}
                        className="text-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        اعتماد
                      </Button>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
                      <CheckCircle2 className="w-3 h-3" /> معتمد
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
