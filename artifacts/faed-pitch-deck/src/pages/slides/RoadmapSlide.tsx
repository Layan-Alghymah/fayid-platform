export default function RoadmapSlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f5f2ee" }}>
      {/* Brand Logo */}
      <div className="absolute top-[3.5vh] right-[3.5vw] z-50">
        <img src={`${import.meta.env.BASE_URL}logo-light.png`} alt="Faed" style={{ height: "3.2vw", width: "auto", objectFit: "contain" }} />
      </div>
      <div className="absolute top-0 left-0 w-full h-[4px]" style={{ background: "linear-gradient(90deg, #195155, #c9a84c, #0F3D4F)" }} />

      <div className="absolute inset-0 px-[7vw] pt-[7vh] pb-[5vh] flex flex-col">
        <div className="mb-[3vh]">
          <div className="text-[1vw] tracking-[0.2em] font-medium uppercase mb-[1vh]" style={{ color: "#195155", fontFamily: "IBM Plex Sans" }}>
            §6 — MVP SCOPE
          </div>
          <h2 className="font-black leading-tight" style={{ fontSize: "3.8vw", color: "#0F3D4F", fontFamily: "Cairo" }}>
            نطاق النسخة الأولى — MVP
          </h2>
        </div>

        <div className="flex gap-[3vw] flex-1">
          <div className="flex-1 flex flex-col gap-[2vh]">
            <div className="text-[1.1vw] font-semibold" style={{ color: "#195155", fontFamily: "IBM Plex Sans" }}>
              IN SCOPE — ضمن النطاق
            </div>
            <div className="flex flex-col gap-[1.3vh] flex-1">
              <div className="flex items-center gap-[1.5vw] p-[1.8vw] rounded-xl" style={{ background: "linear-gradient(135deg, rgba(25,81,85,0.08), rgba(25,81,85,0.04))", border: "1px solid rgba(25,81,85,0.15)" }}>
                <div className="w-[2.5vw] h-[2.5vw] rounded-full flex items-center justify-center text-[1.3vw] flex-shrink-0" style={{ background: "#195155", color: "#f5f2ee" }}>✓</div>
                <div>
                  <div className="font-semibold text-[1.3vw]" style={{ color: "#0F3D4F", fontFamily: "Cairo" }}>تسجيل المستخدم</div>
                  <div className="text-[1.1vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>موردون ومستهلكون</div>
                </div>
              </div>
              <div className="flex items-center gap-[1.5vw] p-[1.8vw] rounded-xl" style={{ background: "linear-gradient(135deg, rgba(25,81,85,0.08), rgba(25,81,85,0.04))", border: "1px solid rgba(25,81,85,0.15)" }}>
                <div className="w-[2.5vw] h-[2.5vw] rounded-full flex items-center justify-center text-[1.3vw] flex-shrink-0" style={{ background: "#195155", color: "#f5f2ee" }}>✓</div>
                <div>
                  <div className="font-semibold text-[1.3vw]" style={{ color: "#0F3D4F", fontFamily: "Cairo" }}>رفع وعرض المنتجات</div>
                  <div className="text-[1.1vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>F1 + F2 + F3</div>
                </div>
              </div>
              <div className="flex items-center gap-[1.5vw] p-[1.8vw] rounded-xl" style={{ background: "linear-gradient(135deg, rgba(25,81,85,0.08), rgba(25,81,85,0.04))", border: "1px solid rgba(25,81,85,0.15)" }}>
                <div className="w-[2.5vw] h-[2.5vw] rounded-full flex items-center justify-center text-[1.3vw] flex-shrink-0" style={{ background: "#195155", color: "#f5f2ee" }}>✓</div>
                <div>
                  <div className="font-semibold text-[1.3vw]" style={{ color: "#0F3D4F", fontFamily: "Cairo" }}>الدفع الإلكتروني</div>
                  <div className="text-[1.1vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>Mada · STC Pay · Tabby — F5</div>
                </div>
              </div>
              <div className="flex items-center gap-[1.5vw] p-[1.8vw] rounded-xl" style={{ background: "linear-gradient(135deg, rgba(25,81,85,0.08), rgba(25,81,85,0.04))", border: "1px solid rgba(25,81,85,0.15)" }}>
                <div className="w-[2.5vw] h-[2.5vw] rounded-full flex items-center justify-center text-[1.3vw] flex-shrink-0" style={{ background: "#195155", color: "#f5f2ee" }}>✓</div>
                <div>
                  <div className="font-semibold text-[1.3vw]" style={{ color: "#0F3D4F", fontFamily: "Cairo" }}>إدارة الطلبات</div>
                  <div className="text-[1.1vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>F4 + F6 الشحن</div>
                </div>
              </div>
              <div className="flex items-center gap-[1.5vw] p-[1.8vw] rounded-xl" style={{ background: "linear-gradient(135deg, rgba(25,81,85,0.08), rgba(25,81,85,0.04))", border: "1px solid rgba(25,81,85,0.15)" }}>
                <div className="w-[2.5vw] h-[2.5vw] rounded-full flex items-center justify-center text-[1.3vw] flex-shrink-0" style={{ background: "#195155", color: "#f5f2ee" }}>✓</div>
                <div>
                  <div className="font-semibold text-[1.3vw]" style={{ color: "#0F3D4F", fontFamily: "Cairo" }}>لوحة إدارة بسيطة</div>
                  <div className="text-[1.1vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>F8 Admin Dashboard</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[35vw] flex flex-col gap-[2vh]">
            <div className="text-[1.1vw] font-semibold" style={{ color: "#195155", fontFamily: "IBM Plex Sans" }}>
              OUT OF SCOPE — Phase 1
            </div>
            <div className="flex flex-col gap-[1.3vh]">
              <div className="flex items-center gap-[1.5vw] p-[1.8vw] rounded-xl" style={{ background: "rgba(245,242,238,0)", border: "1px solid rgba(25,81,85,0.08)" }}>
                <div className="w-[2.5vw] h-[2.5vw] rounded-full flex items-center justify-center text-[1.1vw] flex-shrink-0" style={{ background: "rgba(25,81,85,0.08)", color: "#4a7a80" }}>✕</div>
                <div className="font-semibold text-[1.3vw]" style={{ color: "#8a9a9d", fontFamily: "Cairo" }}>تطبيق الجوال</div>
              </div>
              <div className="flex items-center gap-[1.5vw] p-[1.8vw] rounded-xl" style={{ background: "rgba(245,242,238,0)", border: "1px solid rgba(25,81,85,0.08)" }}>
                <div className="w-[2.5vw] h-[2.5vw] rounded-full flex items-center justify-center text-[1.1vw] flex-shrink-0" style={{ background: "rgba(25,81,85,0.08)", color: "#4a7a80" }}>✕</div>
                <div className="font-semibold text-[1.3vw]" style={{ color: "#8a9a9d", fontFamily: "Cairo" }}>توصيات الذكاء الاصطناعي</div>
              </div>
              <div className="flex items-center gap-[1.5vw] p-[1.8vw] rounded-xl" style={{ background: "rgba(245,242,238,0)", border: "1px solid rgba(25,81,85,0.08)" }}>
                <div className="w-[2.5vw] h-[2.5vw] rounded-full flex items-center justify-center text-[1.1vw] flex-shrink-0" style={{ background: "rgba(25,81,85,0.08)", color: "#4a7a80" }}>✕</div>
                <div className="font-semibold text-[1.3vw]" style={{ color: "#8a9a9d", fontFamily: "Cairo" }}>الإعلانات داخل المنصة</div>
              </div>
            </div>

            <div className="mt-[1vh] rounded-xl p-[2vw]" style={{ background: "linear-gradient(145deg, #0F3D4F, #195155)", flex: 1 }}>
              <div className="text-[1vw] font-semibold tracking-widets uppercase mb-[1.5vh]" style={{ color: "rgba(201,168,76,0.6)", fontFamily: "IBM Plex Sans" }}>
                NON-FUNCTIONAL
              </div>
              <div className="flex flex-col gap-[1.2vh]">
                <div>
                  <div className="font-semibold text-[1.2vw]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>الأداء</div>
                  <div className="text-[1.1vw] font-light" style={{ color: "rgba(212,234,236,0.55)", fontFamily: "Cairo" }}>تحميل أقل من ٣ ثوان</div>
                </div>
                <div>
                  <div className="font-semibold text-[1.2vw]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>الأمان</div>
                  <div className="text-[1.1vw] font-light" style={{ color: "rgba(212,234,236,0.55)", fontFamily: "Cairo" }}>تشفير البيانات · PCI-DSS</div>
                </div>
                <div>
                  <div className="font-semibold text-[1.2vw]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>الامتثال</div>
                  <div className="text-[1.1vw] font-light" style={{ color: "rgba(212,234,236,0.55)", fontFamily: "Cairo" }}>نظام التجارة الإلكترونية · PDPL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
