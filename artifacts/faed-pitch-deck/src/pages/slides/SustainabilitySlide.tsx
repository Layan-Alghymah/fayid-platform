export default function SustainabilitySlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "#f5f2ee" }}>
      {/* Brand Logo */}
      <div className="absolute top-[3.5vh] right-[3.5vw] z-50">
        <img src={`${import.meta.env.BASE_URL}logo-light.png`} alt="Faed" style={{ height: "3.2vw", width: "auto", objectFit: "contain" }} />
      </div>
      <div className="absolute top-0 left-0 w-full h-[4px]" style={{ background: "linear-gradient(90deg, #195155, #c9a84c, #0F3D4F)" }} />
      <div className="absolute bottom-0 right-0 w-[40vw] h-[35vh]" style={{ background: "radial-gradient(ellipse at bottom right, rgba(25,81,85,0.05) 0%, transparent 70%)" }} />

      <div className="absolute inset-0 px-[7vw] pt-[7vh] pb-[5vh] flex flex-col">
        <div className="mb-[3vh]">
          <div className="text-[1vw] tracking-[0.2em] font-medium uppercase mb-[1vh]" style={{ color: "#195155", fontFamily: "IBM Plex Sans" }}>
            §8 — PRODUCT ROADMAP
          </div>
          <h2 className="font-black leading-tight" style={{ fontSize: "3.8vw", color: "#0F3D4F", fontFamily: "Cairo" }}>
            خارطة الطريق
          </h2>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-[3vh]">
          <div className="flex items-stretch gap-[0] relative">
            <div className="absolute top-[6vh] left-[16.5%] right-[16.5%] h-[2px]" style={{ background: "linear-gradient(90deg, #195155, #c9a84c, rgba(201,168,76,0.3))" }} />

            <div className="flex-1 flex flex-col items-center gap-[2vh]">
              <div className="w-[14vw] h-[14vw] rounded-full flex flex-col items-center justify-center z-10" style={{ background: "linear-gradient(145deg, #0F3D4F, #195155)", border: "3px solid #c9a84c" }}>
                <div className="font-black text-[1.3vw]" style={{ color: "rgba(201,168,76,0.7)", fontFamily: "IBM Plex Sans" }}>PHASE 1</div>
                <div className="font-black text-[2vw]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>MVP</div>
                <div className="text-[1vw] font-light" style={{ color: "rgba(212,234,236,0.5)", fontFamily: "Cairo" }}>Launch</div>
              </div>

              <div className="text-center px-[1vw]">
                <div className="font-bold text-[1.3vw] mb-[1vh]" style={{ color: "#0F3D4F", fontFamily: "Cairo" }}>2025 — Q3/Q4</div>
                <div className="flex flex-col gap-[0.5vh]">
                  <div className="text-[1.15vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>• تسجيل المستخدمين</div>
                  <div className="text-[1.15vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>• رفع وعرض المنتجات</div>
                  <div className="text-[1.15vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>• الدفع والطلبات</div>
                  <div className="text-[1.15vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>• لوحة إدارة بسيطة</div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center gap-[2vh]">
              <div className="w-[14vw] h-[14vw] rounded-full flex flex-col items-center justify-center z-10" style={{ background: "rgba(25,81,85,0.08)", border: "2px solid rgba(25,81,85,0.3)" }}>
                <div className="font-black text-[1.3vw]" style={{ color: "#195155", fontFamily: "IBM Plex Sans" }}>PHASE 2</div>
                <div className="font-bold text-[1.6vw] text-center leading-tight" style={{ color: "#0F3D4F", fontFamily: "Cairo" }}>أدوات الموردين</div>
              </div>

              <div className="text-center px-[1vw]">
                <div className="font-bold text-[1.3vw] mb-[1vh]" style={{ color: "#0F3D4F", fontFamily: "Cairo" }}>2026 — Q1/Q2</div>
                <div className="flex flex-col gap-[0.5vh]">
                  <div className="text-[1.15vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>• تحليلات الموردين</div>
                  <div className="text-[1.15vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>• نظام المراجعات</div>
                  <div className="text-[1.15vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>• شارة الموردين الموثقين</div>
                  <div className="text-[1.15vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>• تكاملات الشحن المتقدمة</div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center gap-[2vh]">
              <div className="w-[14vw] h-[14vw] rounded-full flex flex-col items-center justify-center z-10" style={{ background: "rgba(201,168,76,0.07)", border: "2px solid rgba(201,168,76,0.2)" }}>
                <div className="font-black text-[1.3vw]" style={{ color: "#c9a84c", fontFamily: "IBM Plex Sans" }}>PHASE 3</div>
                <div className="font-bold text-[1.6vw] text-center leading-tight" style={{ color: "#8a6030", fontFamily: "Cairo" }}>Mobile + AI</div>
              </div>

              <div className="text-center px-[1vw]">
                <div className="font-bold text-[1.3vw] mb-[1vh]" style={{ color: "#0F3D4F", fontFamily: "Cairo" }}>2026 — Q3/Q4</div>
                <div className="flex flex-col gap-[0.5vh]">
                  <div className="text-[1.15vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>• تطبيق الجوال</div>
                  <div className="text-[1.15vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>• توصيات بالذكاء الاصطناعي</div>
                  <div className="text-[1.15vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>• إعلانات داخل المنصة</div>
                  <div className="text-[1.15vw] font-light" style={{ color: "#4a7a80", fontFamily: "Cairo" }}>• التوسع الخليجي</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
