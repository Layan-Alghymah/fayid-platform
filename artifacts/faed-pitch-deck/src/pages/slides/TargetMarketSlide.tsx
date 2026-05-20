export default function TargetMarketSlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f5f2ee" }}>
      {/* Brand Logo */}
      <div className="absolute top-[3.5vh] right-[3.5vw] z-50">
        <img src={`${import.meta.env.BASE_URL}logo-light.png`} alt="Faed" style={{ height: "3.2vw", width: "auto", objectFit: "contain" }} />
      </div>
      <div className="absolute top-0 left-0 w-full h-[4px]" style={{ background: "linear-gradient(90deg, #195155, #0F3D4F, #c9a84c, transparent)" }} />
      <div className="absolute bottom-0 right-0 w-[40vw] h-[30vh]" style={{ background: "radial-gradient(ellipse at bottom right, rgba(25,81,85,0.05) 0%, transparent 70%)" }} />

      <div className="absolute inset-0 px-[7vw] py-[6vh] flex flex-col">
        <div className="mb-[3vh]">
          <div className="text-[1vw] tracking-[0.2em] font-medium uppercase mb-[1vh]" style={{ color: "#195155", fontFamily: "IBM Plex Sans" }}>
            §5 — USER FLOW · SUPPLIER JOURNEY
          </div>
          <h2 className="font-black leading-tight" style={{ fontSize: "3.8vw", color: "#0F3D4F", fontFamily: "Cairo" }}>
            رحلة المورد — Supplier Flow
          </h2>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-stretch justify-between gap-[1vw]">
            <div className="flex flex-col items-center gap-[1.5vh]" style={{ flex: 1 }}>
              <div className="w-full rounded-xl flex flex-col items-center justify-center py-[3vh] px-[1.5vw]" style={{ background: "linear-gradient(145deg, #0F3D4F, #195155)", border: "2px solid rgba(201,168,76,0.4)", minHeight: "12vh" }}>
                <div className="text-[2.8vw] mb-[0.8vh]">📝</div>
                <div className="font-bold text-[1.4vw] text-center" style={{ color: "#c9a84c", fontFamily: "Cairo" }}>إنشاء حساب</div>
                <div className="text-[1.1vw] font-light text-center" style={{ color: "rgba(212,234,236,0.45)", fontFamily: "IBM Plex Sans" }}>Register</div>
              </div>
              <div className="text-[1.1vw] font-light text-center px-[0.5vw]" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>
                تسجيل المورد ورفع الوثائق والموافقة
              </div>
            </div>

            <div className="flex items-center" style={{ flex: "0 0 auto", paddingBottom: "5vh" }}>
              <div className="flex items-center gap-[0.3vw]">
                <div className="w-[3vw] h-[2px]" style={{ background: "rgba(25,81,85,0.35)" }} />
                <div style={{ color: "#195155", fontSize: "1.5vw" }}>▶</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-[1.5vh]" style={{ flex: 1 }}>
              <div className="w-full rounded-xl flex flex-col items-center justify-center py-[3vh] px-[1.5vw]" style={{ background: "rgba(25,81,85,0.07)", border: "1px solid rgba(25,81,85,0.18)", minHeight: "12vh" }}>
                <div className="text-[2.8vw] mb-[0.8vh]">⬆️</div>
                <div className="font-bold text-[1.4vw] text-center" style={{ color: "#0F3D4F", fontFamily: "Cairo" }}>رفع المنتجات</div>
                <div className="text-[1.1vw] font-light text-center" style={{ color: "#4a7a80", fontFamily: "IBM Plex Sans" }}>Upload</div>
              </div>
              <div className="text-[1.1vw] font-light text-center px-[0.5vw]" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>
                صور، وصف، سعر، كمية، سبب التخفيض
              </div>
            </div>

            <div className="flex items-center" style={{ flex: "0 0 auto", paddingBottom: "5vh" }}>
              <div className="flex items-center gap-[0.3vw]">
                <div className="w-[3vw] h-[2px]" style={{ background: "rgba(25,81,85,0.35)" }} />
                <div style={{ color: "#195155", fontSize: "1.5vw" }}>▶</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-[1.5vh]" style={{ flex: 1 }}>
              <div className="w-full rounded-xl flex flex-col items-center justify-center py-[3vh] px-[1.5vw]" style={{ background: "rgba(25,81,85,0.07)", border: "1px solid rgba(25,81,85,0.18)", minHeight: "12vh" }}>
                <div className="text-[2.8vw] mb-[0.8vh]">🔔</div>
                <div className="font-bold text-[1.4vw] text-center" style={{ color: "#0F3D4F", fontFamily: "Cairo" }}>استقبال الطلبات</div>
                <div className="text-[1.1vw] font-light text-center" style={{ color: "#4a7a80", fontFamily: "IBM Plex Sans" }}>Orders In</div>
              </div>
              <div className="text-[1.1vw] font-light text-center px-[0.5vw]" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>
                إشعار فوري، تأكيد الطلب، التجهيز
              </div>
            </div>

            <div className="flex items-center" style={{ flex: "0 0 auto", paddingBottom: "5vh" }}>
              <div className="flex items-center gap-[0.3vw]">
                <div className="w-[3vw] h-[2px]" style={{ background: "rgba(25,81,85,0.35)" }} />
                <div style={{ color: "#195155", fontSize: "1.5vw" }}>▶</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-[1.5vh]" style={{ flex: 1 }}>
              <div className="w-full rounded-xl flex flex-col items-center justify-center py-[3vh] px-[1.5vw]" style={{ background: "rgba(25,81,85,0.07)", border: "1px solid rgba(25,81,85,0.18)", minHeight: "12vh" }}>
                <div className="text-[2.8vw] mb-[0.8vh]">🚚</div>
                <div className="font-bold text-[1.4vw] text-center" style={{ color: "#0F3D4F", fontFamily: "Cairo" }}>شحن المنتج</div>
                <div className="text-[1.1vw] font-light text-center" style={{ color: "#4a7a80", fontFamily: "IBM Plex Sans" }}>Ship</div>
              </div>
              <div className="text-[1.1vw] font-light text-center px-[0.5vw]" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>
                Aramex · SMSA · Naqel — ٤٨ ساعة
              </div>
            </div>

            <div className="flex items-center" style={{ flex: "0 0 auto", paddingBottom: "5vh" }}>
              <div className="flex items-center gap-[0.3vw]">
                <div className="w-[3vw] h-[2px]" style={{ background: "rgba(201,168,76,0.4)" }} />
                <div style={{ color: "#c9a84c", fontSize: "1.5vw" }}>▶</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-[1.5vh]" style={{ flex: 1 }}>
              <div className="w-full rounded-xl flex flex-col items-center justify-center py-[3vh] px-[1.5vw]" style={{ background: "rgba(201,168,76,0.09)", border: "1px solid rgba(201,168,76,0.25)", minHeight: "12vh" }}>
                <div className="text-[2.8vw] mb-[0.8vh]">💰</div>
                <div className="font-bold text-[1.4vw] text-center" style={{ color: "#8a6030", fontFamily: "Cairo" }}>استلام الإيراد</div>
                <div className="text-[1.1vw] font-light text-center" style={{ color: "#c9a84c", fontFamily: "IBM Plex Sans" }}>Revenue</div>
              </div>
              <div className="text-[1.1vw] font-light text-center px-[0.5vw]" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>
                صافي المبيعات بعد خصم عمولة ١٠٪
              </div>
            </div>
          </div>

          <div className="mt-[4vh] p-[2vw] rounded-xl" style={{ background: "rgba(25,81,85,0.07)", border: "1px solid rgba(25,81,85,0.12)" }}>
            <div className="flex items-center gap-[2vw]">
              <div className="text-[1vw] font-semibold tracking-widests uppercase" style={{ color: "#195155", fontFamily: "IBM Plex Sans" }}>
                TOUCHPOINTS
              </div>
              <div className="flex gap-[2vw]">
                <span className="text-[1.2vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>F1 Supplier Portal</span>
                <span style={{ color: "rgba(25,81,85,0.3)" }}>·</span>
                <span className="text-[1.2vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>F6 Logistics</span>
                <span style={{ color: "rgba(25,81,85,0.3)" }}>·</span>
                <span className="text-[1.2vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>F7 Trust System</span>
                <span style={{ color: "rgba(25,81,85,0.3)" }}>·</span>
                <span className="text-[1.2vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>F8 Admin Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
