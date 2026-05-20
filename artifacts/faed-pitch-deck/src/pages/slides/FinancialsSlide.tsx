export default function FinancialsSlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(145deg, #0a2530 0%, #0F3D4F 50%, #195155 100%)" }}>
      {/* Brand Logo */}
      <div className="absolute top-[3.5vh] right-[3.5vw] z-50">
        <img src={`${import.meta.env.BASE_URL}logo-dark.png`} alt="Faed" style={{ height: "3.2vw", width: "auto", objectFit: "contain" }} />
      </div>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 90%, rgba(201,168,76,0.07) 0%, transparent 55%)" }} />

      <div className="absolute inset-0 px-[7vw] py-[6vh] flex flex-col">
        <div className="mb-[3vh]">
          <div className="text-[1vw] tracking-[0.2em] font-light uppercase mb-[1vh]" style={{ color: "rgba(201,168,76,0.7)", fontFamily: "IBM Plex Sans" }}>
            §7 — TECHNICAL ARCHITECTURE
          </div>
          <h2 className="font-black leading-tight" style={{ fontSize: "3.8vw", color: "#f5f2ee", fontFamily: "Cairo" }}>
            البنية التقنية
          </h2>
        </div>

        <div className="flex-1 flex flex-col gap-[2.5vh]">
          <div className="flex gap-[2vw]">
            <div className="flex-1 rounded-xl p-[2.2vw]" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.22)" }}>
              <div className="text-[1vw] tracking-widests uppercase font-semibold mb-[1.5vh]" style={{ color: "rgba(201,168,76,0.65)", fontFamily: "IBM Plex Sans" }}>
                Frontend
              </div>
              <div className="font-bold text-[2vw] mb-[0.8vh]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>
                React / Next.js
              </div>
              <p className="text-[1.2vw] font-light" style={{ color: "rgba(212,234,236,0.55)", fontFamily: "Cairo" }}>
                واجهة مستخدم حديثة · RTL عربي · Mobile-First
              </p>
            </div>

            <div className="flex-1 rounded-xl p-[2.2vw]" style={{ background: "rgba(245,242,238,0.05)", border: "1px solid rgba(245,242,238,0.1)" }}>
              <div className="text-[1vw] tracking-widests uppercase font-semibold mb-[1.5vh]" style={{ color: "rgba(212,234,236,0.4)", fontFamily: "IBM Plex Sans" }}>
                Backend
              </div>
              <div className="font-bold text-[2vw] mb-[0.8vh]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>
                Supabase / Firebase
              </div>
              <p className="text-[1.2vw] font-light" style={{ color: "rgba(212,234,236,0.55)", fontFamily: "Cairo" }}>
                قاعدة بيانات · مصادقة · Real-time APIs
              </p>
            </div>

            <div className="flex-1 rounded-xl p-[2.2vw]" style={{ background: "rgba(245,242,238,0.05)", border: "1px solid rgba(245,242,238,0.1)" }}>
              <div className="text-[1vw] tracking-widests uppercase font-semibold mb-[1.5vh]" style={{ color: "rgba(212,234,236,0.4)", fontFamily: "IBM Plex Sans" }}>
                Hosting
              </div>
              <div className="font-bold text-[2vw] mb-[0.8vh]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>
                Vercel / AWS
              </div>
              <p className="text-[1.2vw] font-light" style={{ color: "rgba(212,234,236,0.55)", fontFamily: "Cairo" }}>
                استضافة سحابية · CDN · Auto-scaling
              </p>
            </div>
          </div>

          <div className="flex gap-[2vw]">
            <div className="flex-1 rounded-xl p-[2.2vw]" style={{ background: "rgba(245,242,238,0.05)", border: "1px solid rgba(245,242,238,0.1)" }}>
              <div className="text-[1vw] tracking-widests uppercase font-semibold mb-[1.5vh]" style={{ color: "rgba(212,234,236,0.4)", fontFamily: "IBM Plex Sans" }}>
                Payments
              </div>
              <div className="flex flex-col gap-[0.8vh]">
                <div className="flex items-center gap-[1vw]">
                  <div className="w-[1.5vw] h-[1.5vw] rounded flex-shrink-0" style={{ background: "#c9a84c" }} />
                  <span className="text-[1.3vw] font-semibold" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>Mada</span>
                </div>
                <div className="flex items-center gap-[1vw]">
                  <div className="w-[1.5vw] h-[1.5vw] rounded flex-shrink-0" style={{ background: "rgba(201,168,76,0.5)" }} />
                  <span className="text-[1.3vw] font-semibold" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>STC Pay</span>
                </div>
                <div className="flex items-center gap-[1vw]">
                  <div className="w-[1.5vw] h-[1.5vw] rounded flex-shrink-0" style={{ background: "rgba(201,168,76,0.3)" }} />
                  <span className="text-[1.3vw] font-semibold" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>Tabby (BNPL)</span>
                </div>
              </div>
            </div>

            <div className="flex-1 rounded-xl p-[2.2vw]" style={{ background: "rgba(245,242,238,0.05)", border: "1px solid rgba(245,242,238,0.1)" }}>
              <div className="text-[1vw] tracking-widests uppercase font-semibold mb-[1.5vh]" style={{ color: "rgba(212,234,236,0.4)", fontFamily: "IBM Plex Sans" }}>
                Logistics
              </div>
              <div className="flex flex-col gap-[0.8vh]">
                <div className="flex items-center gap-[1vw]">
                  <div className="w-[1.5vw] h-[1.5vw] rounded flex-shrink-0" style={{ background: "#195155" }} />
                  <span className="text-[1.3vw] font-semibold" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>Aramex</span>
                </div>
                <div className="flex items-center gap-[1vw]">
                  <div className="w-[1.5vw] h-[1.5vw] rounded flex-shrink-0" style={{ background: "rgba(25,81,85,0.6)" }} />
                  <span className="text-[1.3vw] font-semibold" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>SMSA</span>
                </div>
                <div className="flex items-center gap-[1vw]">
                  <div className="w-[1.5vw] h-[1.5vw] rounded flex-shrink-0" style={{ background: "rgba(25,81,85,0.4)" }} />
                  <span className="text-[1.3vw] font-semibold" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>Naqel</span>
                </div>
              </div>
            </div>

            <div className="flex-1 rounded-xl p-[2.2vw]" style={{ background: "rgba(245,242,238,0.05)", border: "1px solid rgba(245,242,238,0.1)" }}>
              <div className="text-[1vw] tracking-widests uppercase font-semibold mb-[1.5vh]" style={{ color: "rgba(212,234,236,0.4)", fontFamily: "IBM Plex Sans" }}>
                Storage
              </div>
              <div className="font-bold text-[2vw] mb-[0.8vh]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>
                Cloud Storage
              </div>
              <p className="text-[1.2vw] font-light" style={{ color: "rgba(212,234,236,0.55)", fontFamily: "Cairo" }}>
                صور المنتجات · وثائق الموردين · النسخ الاحتياطية
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
