export default function ProblemSlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f5f2ee" }}>
      {/* Brand Logo */}
      <div className="absolute top-[3.5vh] right-[3.5vw] z-50">
        <img src={`${import.meta.env.BASE_URL}logo-light.png`} alt="Faed" style={{ height: "3.2vw", width: "auto", objectFit: "contain" }} />
      </div>
      <div className="absolute top-0 left-0 w-full h-[4px]" style={{ background: "linear-gradient(90deg, #195155, #c9a84c, #0F3D4F)" }} />
      <div className="absolute bottom-0 right-0 w-[40vw] h-[35vh]" style={{ background: "radial-gradient(ellipse at bottom right, rgba(25,81,85,0.06) 0%, transparent 70%)" }} />

      <div className="absolute inset-0 px-[7vw] pt-[7vh] pb-[5vh] flex flex-col">
        <div className="mb-[3.5vh]">
          <div className="text-[1vw] tracking-[0.2em] font-medium uppercase mb-[1vh]" style={{ color: "#195155", fontFamily: "IBM Plex Sans" }}>
            §1 — PRODUCT OVERVIEW & GOALS
          </div>
          <h2 className="font-black leading-tight" style={{ fontSize: "3.8vw", color: "#0F3D4F", fontFamily: "Cairo" }}>
            نظرة عامة على المنتج وأهدافه
          </h2>
        </div>

        <div className="flex gap-[3vw] flex-1">
          <div className="flex-1 flex flex-col gap-[2vh]">
            <div className="p-[2.2vw] rounded-xl" style={{ background: "rgba(25,81,85,0.07)", border: "1px solid rgba(25,81,85,0.12)" }}>
              <div className="text-[1vw] tracking-widest uppercase font-medium mb-[1.5vh]" style={{ color: "#195155", fontFamily: "IBM Plex Sans" }}>
                OVERVIEW
              </div>
              <p className="text-[1.45vw] leading-relaxed" style={{ color: "#2a4a50", fontFamily: "Cairo" }}>
                فائض منصة Marketplace رقمية تربط الموردين بالمشترين لبيع المخزون الفائض من الأزياء والمنسوجات بتجربة موثوقة وشفافة.
              </p>
            </div>

            <div className="flex gap-[2vw] flex-1">
              <div className="flex-1 rounded-xl p-[2vw] flex flex-col items-center justify-center text-center" style={{ background: "linear-gradient(145deg, #0F3D4F, #195155)" }}>
                <div className="text-[3.5vw] mb-[1vh]" style={{ fontFamily: "Cairo" }}>🏭</div>
                <div className="font-bold text-[1.4vw]" style={{ color: "#c9a84c", fontFamily: "Cairo" }}>الموردون</div>
                <div className="text-[1.1vw] font-light mt-[0.5vh]" style={{ color: "rgba(212,234,236,0.65)", fontFamily: "Cairo" }}>Suppliers</div>
              </div>
              <div className="flex items-center justify-center text-[2.5vw]" style={{ color: "#c9a84c" }}>⇄</div>
              <div className="flex-1 rounded-xl p-[2vw] flex flex-col items-center justify-center text-center" style={{ background: "linear-gradient(145deg, #0F3D4F, #195155)" }}>
                <div className="text-[3.5vw] mb-[1vh]" style={{ fontFamily: "Cairo" }}>🛍</div>
                <div className="font-bold text-[1.4vw]" style={{ color: "#c9a84c", fontFamily: "Cairo" }}>المشترون</div>
                <div className="text-[1.1vw] font-light mt-[0.5vh]" style={{ color: "rgba(212,234,236,0.65)", fontFamily: "Cairo" }}>Consumers</div>
              </div>
            </div>
          </div>

          <div className="w-[40vw] flex flex-col gap-[1.6vh]">
            <div className="text-[1vw] font-medium tracking-widest uppercase mb-[0.5vh]" style={{ color: "#195155", fontFamily: "IBM Plex Sans" }}>
              PRODUCT GOALS — §2
            </div>
            <div className="flex items-start gap-[1.5vw] p-[1.8vw] rounded-xl" style={{ background: "rgba(25,81,85,0.06)", border: "1px solid rgba(25,81,85,0.1)" }}>
              <div className="w-[2px] self-stretch" style={{ background: "#c9a84c" }} />
              <p className="text-[1.3vw] font-light leading-relaxed" style={{ color: "#2a4a50", fontFamily: "Cairo" }}>
                تمكين الموردين من عرض منتجاتهم الفائضة بسهولة
              </p>
            </div>
            <div className="flex items-start gap-[1.5vw] p-[1.8vw] rounded-xl" style={{ background: "rgba(25,81,85,0.06)", border: "1px solid rgba(25,81,85,0.1)" }}>
              <div className="w-[2px] self-stretch" style={{ background: "#c9a84c" }} />
              <p className="text-[1.3vw] font-light leading-relaxed" style={{ color: "#2a4a50", fontFamily: "Cairo" }}>
                توفير تجربة اكتشاف منتجات جذابة للمستهلك
              </p>
            </div>
            <div className="flex items-start gap-[1.5vw] p-[1.8vw] rounded-xl" style={{ background: "rgba(25,81,85,0.06)", border: "1px solid rgba(25,81,85,0.1)" }}>
              <div className="w-[2px] self-stretch" style={{ background: "#c9a84c" }} />
              <p className="text-[1.3vw] font-light leading-relaxed" style={{ color: "#2a4a50", fontFamily: "Cairo" }}>
                إتمام عمليات شراء سريعة وآمنة
              </p>
            </div>
            <div className="flex items-start gap-[1.5vw] p-[1.8vw] rounded-xl" style={{ background: "rgba(25,81,85,0.06)", border: "1px solid rgba(25,81,85,0.1)" }}>
              <div className="w-[2px] self-stretch" style={{ background: "#c9a84c" }} />
              <p className="text-[1.3vw] font-light leading-relaxed" style={{ color: "#2a4a50", fontFamily: "Cairo" }}>
                بناء سوق رقمي متخصص بالفوائض
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
