export default function MarketSlide() {
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
            §4 — PRODUCT FEATURES
          </div>
          <h2 className="font-black leading-tight" style={{ fontSize: "3.8vw", color: "#0F3D4F", fontFamily: "Cairo" }}>
            ميزات المنتج — نظرة عامة
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-[1.8vw] flex-1">
          <div className="rounded-xl p-[1.8vw] flex flex-col gap-[1vh]" style={{ background: "linear-gradient(145deg, #0F3D4F, #195155)" }}>
            <div className="text-[1.1vw] font-bold tracking-widest" style={{ color: "#c9a84c", fontFamily: "IBM Plex Sans" }}>F1</div>
            <div className="font-bold text-[1.4vw]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>Supplier Portal</div>
            <p className="text-[1.1vw] font-light leading-relaxed" style={{ color: "rgba(212,234,236,0.65)", fontFamily: "Cairo" }}>
              لوحة تحكم موردين متكاملة
            </p>
          </div>

          <div className="rounded-xl p-[1.8vw] flex flex-col gap-[1vh]" style={{ background: "rgba(25,81,85,0.07)", border: "1px solid rgba(25,81,85,0.15)" }}>
            <div className="text-[1.1vw] font-bold tracking-widest" style={{ color: "#195155", fontFamily: "IBM Plex Sans" }}>F2</div>
            <div className="font-bold text-[1.4vw]" style={{ color: "#0F3D4F", fontFamily: "Cairo" }}>Product Listing</div>
            <p className="text-[1.1vw] font-light leading-relaxed" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>
              عرض المنتجات للمستهلك
            </p>
          </div>

          <div className="rounded-xl p-[1.8vw] flex flex-col gap-[1vh]" style={{ background: "rgba(25,81,85,0.07)", border: "1px solid rgba(25,81,85,0.15)" }}>
            <div className="text-[1.1vw] font-bold tracking-widest" style={{ color: "#195155", fontFamily: "IBM Plex Sans" }}>F3</div>
            <div className="font-bold text-[1.4vw]" style={{ color: "#0F3D4F", fontFamily: "Cairo" }}>Discovery</div>
            <p className="text-[1.1vw] font-light leading-relaxed" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>
              بحث وفلترة متقدمة
            </p>
          </div>

          <div className="rounded-xl p-[1.8vw] flex flex-col gap-[1vh]" style={{ background: "rgba(25,81,85,0.07)", border: "1px solid rgba(25,81,85,0.15)" }}>
            <div className="text-[1.1vw] font-bold tracking-widets" style={{ color: "#195155", fontFamily: "IBM Plex Sans" }}>F4</div>
            <div className="font-bold text-[1.4vw]" style={{ color: "#0F3D4F", fontFamily: "Cairo" }}>Shopping</div>
            <p className="text-[1.1vw] font-light leading-relaxed" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>
              سلة ودفع وتتبع
            </p>
          </div>

          <div className="rounded-xl p-[1.8vw] flex flex-col gap-[1vh]" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
            <div className="text-[1.1vw] font-bold tracking-widets" style={{ color: "#c9a84c", fontFamily: "IBM Plex Sans" }}>F5</div>
            <div className="font-bold text-[1.4vw]" style={{ color: "#8a6030", fontFamily: "Cairo" }}>Payments</div>
            <p className="text-[1.1vw] font-light" style={{ color: "#6a5030", fontFamily: "Cairo" }}>
              Mada · STC Pay · Tabby
            </p>
          </div>

          <div className="rounded-xl p-[1.8vw] flex flex-col gap-[1vh]" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
            <div className="text-[1.1vw] font-bold tracking-widets" style={{ color: "#c9a84c", fontFamily: "IBM Plex Sans" }}>F6</div>
            <div className="font-bold text-[1.4vw]" style={{ color: "#8a6030", fontFamily: "Cairo" }}>Logistics</div>
            <p className="text-[1.1vw] font-light" style={{ color: "#6a5030", fontFamily: "Cairo" }}>
              Aramex · SMSA · Naqel
            </p>
          </div>

          <div className="rounded-xl p-[1.8vw] flex flex-col gap-[1vh]" style={{ background: "rgba(25,81,85,0.07)", border: "1px solid rgba(25,81,85,0.15)" }}>
            <div className="text-[1.1vw] font-bold tracking-widets" style={{ color: "#195155", fontFamily: "IBM Plex Sans" }}>F7</div>
            <div className="font-bold text-[1.4vw]" style={{ color: "#0F3D4F", fontFamily: "Cairo" }}>Trust System</div>
            <p className="text-[1.1vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>
              تقييمات وشارات التوثيق
            </p>
          </div>

          <div className="rounded-xl p-[1.8vw] flex flex-col gap-[1vh]" style={{ background: "rgba(25,81,85,0.07)", border: "1px solid rgba(25,81,85,0.15)" }}>
            <div className="text-[1.1vw] font-bold tracking-widets" style={{ color: "#195155", fontFamily: "IBM Plex Sans" }}>F8</div>
            <div className="font-bold text-[1.4vw]" style={{ color: "#0F3D4F", fontFamily: "Cairo" }}>Admin Panel</div>
            <p className="text-[1.1vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>
              إدارة المنصة والتقارير
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
