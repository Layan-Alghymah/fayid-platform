export default function ClosingSlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(145deg, #0a2028 0%, #0F3D4F 45%, #195155 100%)" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(201,168,76,0.1) 0%, transparent 60%)" }} />
      <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #c9a84c 40%, #c9a84c 60%, transparent)" }} />
      <div className="absolute bottom-0 left-0 w-full h-[3px]" style={{ background: "linear-gradient(90deg, transparent, rgba(25,81,85,0.6) 40%, rgba(25,81,85,0.6) 60%, transparent)" }} />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[4vh] px-[10vw]">
        <img
          src={`${import.meta.env.BASE_URL}logo-dark-landscape.png`}
          alt="Faed Platform"
          style={{ height: "8vw", width: "auto", objectFit: "contain" }}
        />

        <div className="w-[18vw] h-[2px] my-[1vh]" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)" }} />

        <p className="text-[2.2vw] font-light leading-relaxed text-center" style={{ color: "rgba(212,234,236,0.75)", fontFamily: "Cairo", maxWidth: "55vw" }}>
          جاهز لتجربة المنصة؟
        </p>
        <p className="text-[1.5vw] font-light text-center" style={{ color: "rgba(212,234,236,0.45)", fontFamily: "Cairo", maxWidth: "50vw" }}>
          اكتشف كيف تحوّل مخزونك الفائض إلى فرصة حقيقية
        </p>

        <div className="mt-[2vh] flex gap-[2.5vw] items-center">
          <div className="px-[4vw] py-[2vh] rounded-xl font-bold text-[1.6vw] text-center" style={{ background: "linear-gradient(135deg, #c9a84c, #a87d2a)", color: "#0F3D4F", fontFamily: "Cairo", minWidth: "18vw" }}>
            جرّب المنصة الآن
          </div>
          <div className="px-[4vw] py-[2vh] rounded-xl font-bold text-[1.6vw] text-center" style={{ background: "rgba(245,242,238,0.07)", border: "1px solid rgba(245,242,238,0.2)", color: "#f5f2ee", fontFamily: "Cairo", minWidth: "18vw" }}>
            Try the Platform
          </div>
        </div>

        <div className="mt-[2vh] flex items-center gap-[3vw]">
          <div className="text-center">
            <div className="font-black text-[2.5vw]" style={{ color: "#c9a84c", fontFamily: "Cairo" }}>١٠٪</div>
            <div className="text-[1.1vw] font-light" style={{ color: "rgba(212,234,236,0.45)", fontFamily: "Cairo" }}>عمولة فقط</div>
          </div>
          <div className="w-[1px] h-[6vh]" style={{ background: "rgba(201,168,76,0.2)" }} />
          <div className="text-center">
            <div className="font-black text-[2.5vw]" style={{ color: "#c9a84c", fontFamily: "Cairo" }}>٤٨h</div>
            <div className="text-[1.1vw] font-light" style={{ color: "rgba(212,234,236,0.45)", fontFamily: "Cairo" }}>SLA شحن</div>
          </div>
          <div className="w-[1px] h-[6vh]" style={{ background: "rgba(201,168,76,0.2)" }} />
          <div className="text-center">
            <div className="font-black text-[2.5vw]" style={{ color: "#c9a84c", fontFamily: "Cairo" }}>٠</div>
            <div className="text-[1.1vw] font-light" style={{ color: "rgba(212,234,236,0.45)", fontFamily: "Cairo" }}>تكلفة تخزين</div>
          </div>
        </div>

        <div className="mt-[1.5vh] text-[1.2vw] font-light" style={{ color: "rgba(212,234,236,0.25)", fontFamily: "IBM Plex Sans" }}>
          faed.sa · PRD v1.0 · 2025
        </div>
      </div>
    </div>
  );
}
