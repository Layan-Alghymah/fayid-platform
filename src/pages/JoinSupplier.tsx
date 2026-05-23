import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { ArrowRight, ExternalLink } from "lucide-react";

// ─── Typeform URL ──────────────────────────────────────────────────────────────
// Set VITE_SUPPLIER_TYPEFORM_URL in your .env file to the actual Typeform link.
// Configure Typeform notification email to fayid.comp@gmail.com from Typeform dashboard.
const TYPEFORM_URL =
  import.meta.env.VITE_SUPPLIER_TYPEFORM_URL ||
  "https://YOUR-TYPEFORM-LINK.typeform.com/to/FORM_ID";

// ─── Component ─────────────────────────────────────────────────────────────────

export default function JoinSupplier() {
  const [iframeError, setIframeError] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-background flex flex-col">
      <PageHeader />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10 flex flex-col gap-6">
        {/* Title & intro */}
        <div>
          <h1 className="text-3xl font-extrabold mb-3">انضم كمورد في فائض</h1>
          <p className="text-muted-foreground leading-relaxed">
            هل لديك منتجات فائضة أو نهاية موسم؟ أكمل النموذج أدناه وسيتواصل
            معك فريقنا لاستكمال إجراءات الانضمام.
          </p>
          <p className="mt-3 text-sm text-muted-foreground bg-muted/40 border border-border/50 rounded-xl px-4 py-3">
            بعد إرسال النموذج، سيصل طلبك إلى فريق فائض عبر البريد الإلكتروني،
            وسيتم التواصل معك بعد مراجعة البيانات.
          </p>
        </div>

        {/* Typeform embed */}
        {!iframeError ? (
          <div className="w-full rounded-2xl overflow-hidden border border-border/50 shadow-sm">
            <iframe
              src={TYPEFORM_URL}
              title="نموذج الانضمام كمورد في فائض"
              allow="camera; microphone; autoplay; encrypted-media;"
              className="w-full"
              style={{ minHeight: "700px", border: "none" }}
              onError={() => setIframeError(true)}
            />
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-10 flex flex-col items-center gap-4 text-center">
            <p className="text-muted-foreground">
              تعذّر تحميل نموذج الانضمام. يمكنك فتحه مباشرة من هنا:
            </p>
            <a href={TYPEFORM_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gap-2">
                <ExternalLink className="w-5 h-5" />
                فتح نموذج الانضمام
              </Button>
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── Page header ───────────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <BrandLogo className="h-8 w-auto cursor-pointer" />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </Link>
      </div>
    </header>
  );
}
