import { useController, type Control } from "react-hook-form";
import { useState } from "react";
import {
  X, Plus, ImageIcon, CheckCircle2, Package, Clock,
  Tag, Recycle, Star,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

// ─── FormSection ──────────────────────────────────────────────────────────────

export function FormSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-panel rounded-2xl p-6 border-white/5 space-y-5">
      <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-widest flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

// ─── FormField ────────────────────────────────────────────────────────────────

export function FormField({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2">
        {label}
        {required && <span className="text-destructive mr-1">*</span>}
        {hint && <span className="text-muted-foreground font-normal mr-1.5">({hint})</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-destructive mt-1.5 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-destructive flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── SizeSelector ─────────────────────────────────────────────────────────────

const PRESET_SIZES = [
  "فري سايز", "XS", "S", "M", "L", "XL", "XXL", "3XL",
  "36", "38", "40", "42", "44", "46", "48",
];

export function SizeSelector({
  control,
  name,
}: {
  control: Control<any>;
  name: string;
}) {
  const { field } = useController({ control, name });
  const selected: string[] = Array.isArray(field.value) ? field.value : [];
  const [custom, setCustom] = useState("");

  const toggle = (size: string) => {
    const next = selected.includes(size)
      ? selected.filter((s) => s !== size)
      : [...selected, size];
    field.onChange(next);
  };

  const addCustom = () => {
    const val = custom.trim();
    if (val && !selected.includes(val)) {
      field.onChange([...selected, val]);
    }
    setCustom("");
  };

  return (
    <div className="space-y-3">
      {/* Preset chips */}
      <div className="flex flex-wrap gap-2">
        {PRESET_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => toggle(size)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
              selected.includes(size)
                ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground"
            )}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Custom size input */}
      <div className="flex gap-2 items-center">
        <Input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder="مقاس مخصص..."
          className="h-8 text-xs max-w-36"
        />
        <button
          type="button"
          onClick={addCustom}
          className="h-8 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-muted-foreground flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3 h-3" />
          إضافة
        </button>
      </div>

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="text-xs text-muted-foreground self-center">المختار:</span>
          {selected.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 text-xs bg-primary/15 text-primary border border-primary/20 px-2 py-0.5 rounded-full"
            >
              {s}
              <button
                type="button"
                onClick={() => toggle(s)}
                className="hover:text-destructive transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ConditionSelector ────────────────────────────────────────────────────────

const CONDITIONS = [
  {
    value: "production_surplus",
    label: "فائض إنتاج",
    desc: "بضاعة زائدة عن طلبات الإنتاج",
    icon: Package,
    color: "blue",
  },
  {
    value: "season_surplus",
    label: "فائض موسم",
    desc: "مخزون لم يُباع في موسمه",
    icon: Clock,
    color: "amber",
  },
  {
    value: "minor_defect",
    label: "عيب بسيط",
    desc: "عيب مصنعي بسيط لا يؤثر على الاستخدام",
    icon: Tag,
    color: "orange",
  },
  {
    value: "clearance",
    label: "تصفية مخزون",
    desc: "تخليص المستودعات والتصفية الكاملة",
    icon: Recycle,
    color: "purple",
  },
  {
    value: "new_unused",
    label: "جديد غير مستخدم",
    desc: "منتج جديد لم يُستخدم قط",
    icon: Star,
    color: "green",
  },
] as const;

const COND_COLOR: Record<
  string,
  { border: string; bg: string; text: string; iconBg: string }
> = {
  blue:   { border: "border-blue-500/40",   bg: "bg-blue-500/10",   text: "text-blue-400",   iconBg: "bg-blue-500/15"   },
  amber:  { border: "border-amber-500/40",  bg: "bg-amber-500/10",  text: "text-amber-400",  iconBg: "bg-amber-500/15"  },
  orange: { border: "border-orange-500/40", bg: "bg-orange-500/10", text: "text-orange-400", iconBg: "bg-orange-500/15" },
  purple: { border: "border-purple-500/40", bg: "bg-purple-500/10", text: "text-purple-400", iconBg: "bg-purple-500/15" },
  green:  { border: "border-green-500/40",  bg: "bg-green-500/10",  text: "text-green-400",  iconBg: "bg-green-500/15"  },
};

export function ConditionSelector({
  control,
  name,
}: {
  control: Control<any>;
  name: string;
}) {
  const { field } = useController({ control, name });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {CONDITIONS.map((c) => {
        const Icon = c.icon;
        const cls = COND_COLOR[c.color];
        const active = field.value === c.value;

        return (
          <button
            key={c.value}
            type="button"
            onClick={() => field.onChange(c.value)}
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border text-right transition-all",
              active
                ? `${cls.border} ${cls.bg}`
                : "border-white/10 hover:border-white/20 hover:bg-white/5"
            )}
          >
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                active ? `${cls.iconBg} ${cls.text}` : "bg-white/5 text-muted-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 text-right">
              <p className={cn("font-bold text-sm", active ? cls.text : "text-foreground")}>
                {c.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {c.desc}
              </p>
            </div>
            {active && (
              <CheckCircle2 className={cn("w-4 h-4 flex-shrink-0 mt-1", cls.text)} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── ImagePreviewInput ────────────────────────────────────────────────────────

export function ImagePreviewInput({
  control,
  name,
  placeholder,
}: {
  control: Control<any>;
  name: string;
  placeholder?: string;
}) {
  const { field } = useController({ control, name });
  const [imgError, setImgError] = useState(false);
  const url = (field.value as string) ?? "";

  return (
    <div className="flex items-start gap-3">
      <div className="flex-1">
        <Input
          value={url}
          onChange={(e) => {
            setImgError(false);
            field.onChange(e.target.value);
          }}
          placeholder={placeholder ?? "https://..."}
          dir="ltr"
          className="font-mono text-xs h-10"
        />
      </div>
      <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-background/50 flex-shrink-0 flex items-center justify-center">
        {url.trim() && !imgError ? (
          <img
            key={url}
            src={url}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <ImageIcon className="w-4 h-4 text-muted-foreground/40" />
        )}
      </div>
    </div>
  );
}
