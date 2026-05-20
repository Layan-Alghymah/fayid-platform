export default function TitleSlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(135deg, #0F3D4F 0%, #195155 55%, #0d2d38 100%)" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 15%, rgba(201,168,76,0.13) 0%, transparent 55%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 5% 90%, rgba(25,81,85,0.5) 0%, transparent 45%)" }} />

      <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #c9a84c 40%, #c9a84c 60%, transparent)" }} />
      <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: "linear-gradient(180deg, transparent, rgba(201,168,76,0.35), transparent)" }} />
      <div className="absolute bottom-0 left-0 w-full h-[1px]" style={{ background: "rgba(201,168,76,0.1)" }} />

      <div className="absolute top-[8vh] right-[7vw] flex flex-col items-end gap-[0.7vh]">
        <div className="text-[1.1vw] font-light tracking-[0.25em] uppercase" style={{ color: "rgba(201,168,76,0.7)", fontFamily: "IBM Plex Sans" }}>
          Product Requirements Document
        </div>
        <div className="text-[1vw] font-light tracking-[0.15em]" style={{ color: "rgba(212,234,236,0.35)", fontFamily: "IBM Plex Sans" }}>
          Version 1.0 · 2025
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-center px-[8vw]">
        <div className="text-[1.1vw] tracking-[0.25em] font-light uppercase mb-[3vh]" style={{ color: "rgba(201,168,76,0.55)", fontFamily: "IBM Plex Sans" }}>
          وثيقة متطلبات المنتج
        </div>

        <img
          src={`${import.meta.env.BASE_URL}logo-dark-landscape.png`}
          alt="Faed Platform"
          style={{ height: "11vw", width: "auto", objectFit: "contain", objectPosition: "right center" }}
          className="mb-[3vh]"
        />

        <div className="mt-[4vh] max-w-[58vw]">
          <p className="text-[1.8vw] font-light leading-relaxed" style={{ color: "rgba(212,234,236,0.8)", fontFamily: "Cairo" }}>
            منصة Marketplace رقمية لعرض وبيع المخزون الفائض من قطاع الأزياء والمنسوجات
          </p>
          <p className="text-[1.25vw] font-light mt-[1.2vh]" style={{ color: "rgba(212,234,236,0.4)", fontFamily: "IBM Plex Sans" }}>
            Deadstock Fashion & Textile · Digital Marketplace · Saudi Arabia
          </p>
        </div>
      </div>

      <div className="absolute bottom-[6vh] left-[8vw] right-[7vw] flex items-center justify-between">
        <div className="text-[1.1vw] font-light" style={{ color: "rgba(212,234,236,0.3)", fontFamily: "IBM Plex Sans" }}>
          Confidential — For Internal Review Only
        </div>
        <div className="flex items-center gap-[1.5vw]">
          <div className="w-[3vw] h-[1px]" style={{ background: "rgba(201,168,76,0.35)" }} />
          <div className="text-[1.1vw] font-light" style={{ color: "rgba(201,168,76,0.45)", fontFamily: "IBM Plex Sans" }}>
            PRD v1.0
          </div>
        </div>
      </div>
    </div>
  );
}
