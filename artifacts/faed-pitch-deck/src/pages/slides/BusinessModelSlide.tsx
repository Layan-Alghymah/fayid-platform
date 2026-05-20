export default function BusinessModelSlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(150deg, #0c2e3a 0%, #0F3D4F 45%, #195155 100%)" }}>
      {/* Brand Logo */}
      <div className="absolute top-[3.5vh] right-[3.5vw] z-50">
        <img src={`${import.meta.env.BASE_URL}logo-dark.png`} alt="Faed" style={{ height: "3.2vw", width: "auto", objectFit: "contain" }} />
      </div>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 90% 90%, rgba(201,168,76,0.06) 0%, transparent 50%)" }} />

      <div className="absolute inset-0 px-[7vw] py-[6vh] flex flex-col">
        <div className="mb-[3vh]">
          <div className="text-[1vw] tracking-[0.2em] font-light uppercase mb-[1vh]" style={{ color: "rgba(201,168,76,0.7)", fontFamily: "IBM Plex Sans" }}>
            §5 — USER FLOW · BUYER JOURNEY
          </div>
          <h2 className="font-black leading-tight" style={{ fontSize: "3.8vw", color: "#f5f2ee", fontFamily: "Cairo" }}>
            رحلة المشتري — Buyer Flow
          </h2>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center justify-between gap-[1vw]">
            <div className="flex flex-col items-center gap-[1.5vh]" style={{ flex: 1 }}>
              <div className="w-full rounded-xl flex flex-col items-center justify-center py-[3vh] px-[1.5vw]" style={{ background: "rgba(201,168,76,0.15)", border: "2px solid #c9a84c", minHeight: "12vh" }}>
                <div className="text-[2.8vw] mb-[0.8vh]">🌐</div>
                <div className="font-bold text-[1.4vw] text-center" style={{ color: "#c9a84c", fontFamily: "Cairo" }}>زيارة الموقع</div>
                <div className="text-[1.1vw] font-light text-center" style={{ color: "rgba(201,168,76,0.6)", fontFamily: "IBM Plex Sans" }}>Visit</div>
              </div>
              <div className="text-[1.1vw] font-light text-center px-[0.5vw]" style={{ color: "rgba(212,234,236,0.5)", fontFamily: "Cairo" }}>
                التسجيل أو الدخول كضيف
              </div>
            </div>

            <div className="flex flex-col items-center gap-[1vh]" style={{ flex: "0 0 auto" }}>
              <div className="flex items-center gap-[0.3vw]">
                <div className="w-[3vw] h-[2px]" style={{ background: "rgba(201,168,76,0.4)" }} />
                <div style={{ color: "#c9a84c", fontSize: "1.5vw" }}>▶</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-[1.5vh]" style={{ flex: 1 }}>
              <div className="w-full rounded-xl flex flex-col items-center justify-center py-[3vh] px-[1.5vw]" style={{ background: "rgba(245,242,238,0.06)", border: "1px solid rgba(245,242,238,0.15)", minHeight: "12vh" }}>
                <div className="text-[2.8vw] mb-[0.8vh]">🔍</div>
                <div className="font-bold text-[1.4vw] text-center" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>تصفح المنتجات</div>
                <div className="text-[1.1vw] font-light text-center" style={{ color: "rgba(212,234,236,0.45)", fontFamily: "IBM Plex Sans" }}>Browse</div>
              </div>
              <div className="text-[1.1vw] font-light text-center px-[0.5vw]" style={{ color: "rgba(212,234,236,0.5)", fontFamily: "Cairo" }}>
                فلترة حسب السعر والفئة والمقاس
              </div>
            </div>

            <div className="flex flex-col items-center gap-[1vh]" style={{ flex: "0 0 auto" }}>
              <div className="flex items-center gap-[0.3vw]">
                <div className="w-[3vw] h-[2px]" style={{ background: "rgba(201,168,76,0.4)" }} />
                <div style={{ color: "#c9a84c", fontSize: "1.5vw" }}>▶</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-[1.5vh]" style={{ flex: 1 }}>
              <div className="w-full rounded-xl flex flex-col items-center justify-center py-[3vh] px-[1.5vw]" style={{ background: "rgba(245,242,238,0.06)", border: "1px solid rgba(245,242,238,0.15)", minHeight: "12vh" }}>
                <div className="text-[2.8vw] mb-[0.8vh]">👆</div>
                <div className="font-bold text-[1.4vw] text-center" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>اختيار المنتج</div>
                <div className="text-[1.1vw] font-light text-center" style={{ color: "rgba(212,234,236,0.45)", fontFamily: "IBM Plex Sans" }}>Select</div>
              </div>
              <div className="text-[1.1vw] font-light text-center px-[0.5vw]" style={{ color: "rgba(212,234,236,0.5)", fontFamily: "Cairo" }}>
                إضافة للسلة، مراجعة التفاصيل
              </div>
            </div>

            <div className="flex flex-col items-center gap-[1vh]" style={{ flex: "0 0 auto" }}>
              <div className="flex items-center gap-[0.3vw]">
                <div className="w-[3vw] h-[2px]" style={{ background: "rgba(201,168,76,0.4)" }} />
                <div style={{ color: "#c9a84c", fontSize: "1.5vw" }}>▶</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-[1.5vh]" style={{ flex: 1 }}>
              <div className="w-full rounded-xl flex flex-col items-center justify-center py-[3vh] px-[1.5vw]" style={{ background: "rgba(245,242,238,0.06)", border: "1px solid rgba(245,242,238,0.15)", minHeight: "12vh" }}>
                <div className="text-[2.8vw] mb-[0.8vh]">💳</div>
                <div className="font-bold text-[1.4vw] text-center" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>الدفع</div>
                <div className="text-[1.1vw] font-light text-center" style={{ color: "rgba(212,234,236,0.45)", fontFamily: "IBM Plex Sans" }}>Payment</div>
              </div>
              <div className="text-[1.1vw] font-light text-center px-[0.5vw]" style={{ color: "rgba(212,234,236,0.5)", fontFamily: "Cairo" }}>
                Mada · STC Pay · Tabby
              </div>
            </div>

            <div className="flex flex-col items-center gap-[1vh]" style={{ flex: "0 0 auto" }}>
              <div className="flex items-center gap-[0.3vw]">
                <div className="w-[3vw] h-[2px]" style={{ background: "rgba(201,168,76,0.4)" }} />
                <div style={{ color: "#c9a84c", fontSize: "1.5vw" }}>▶</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-[1.5vh]" style={{ flex: 1 }}>
              <div className="w-full rounded-xl flex flex-col items-center justify-center py-[3vh] px-[1.5vw]" style={{ background: "rgba(245,242,238,0.06)", border: "1px solid rgba(245,242,238,0.15)", minHeight: "12vh" }}>
                <div className="text-[2.8vw] mb-[0.8vh]">📦</div>
                <div className="font-bold text-[1.4vw] text-center" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>استلام الطلب</div>
                <div className="text-[1.1vw] font-light text-center" style={{ color: "rgba(212,234,236,0.45)", fontFamily: "IBM Plex Sans" }}>Receive</div>
              </div>
              <div className="text-[1.1vw] font-light text-center px-[0.5vw]" style={{ color: "rgba(212,234,236,0.5)", fontFamily: "Cairo" }}>
                تتبع الشحن حتى التسليم
              </div>
            </div>
          </div>

          <div className="mt-[4vh] p-[2vw] rounded-xl" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}>
            <div className="flex items-center gap-[2vw]">
              <div className="text-[1vw] font-semibold tracking-widest uppercase" style={{ color: "rgba(201,168,76,0.6)", fontFamily: "IBM Plex Sans" }}>
                TOUCHPOINTS
              </div>
              <div className="flex gap-[2vw]">
                <span className="text-[1.2vw] font-light" style={{ color: "rgba(201,168,76,0.75)", fontFamily: "Cairo" }}>F2 عرض المنتجات</span>
                <span style={{ color: "rgba(201,168,76,0.3)" }}>·</span>
                <span className="text-[1.2vw] font-light" style={{ color: "rgba(201,168,76,0.75)", fontFamily: "Cairo" }}>F3 التصفح والاكتشاف</span>
                <span style={{ color: "rgba(201,168,76,0.3)" }}>·</span>
                <span className="text-[1.2vw] font-light" style={{ color: "rgba(201,168,76,0.75)", fontFamily: "Cairo" }}>F4 تجربة الشراء</span>
                <span style={{ color: "rgba(201,168,76,0.3)" }}>·</span>
                <span className="text-[1.2vw] font-light" style={{ color: "rgba(201,168,76,0.75)", fontFamily: "Cairo" }}>F5 الدفع</span>
                <span style={{ color: "rgba(201,168,76,0.3)" }}>·</span>
                <span className="text-[1.2vw] font-light" style={{ color: "rgba(201,168,76,0.75)", fontFamily: "Cairo" }}>F6 الشحن</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
