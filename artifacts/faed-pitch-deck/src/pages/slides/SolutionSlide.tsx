export default function SolutionSlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(155deg, #0F3D4F 0%, #195155 100%)" }}>
      {/* Brand Logo */}
      <div className="absolute top-[3.5vh] right-[3.5vw] z-50">
        <img src={`${import.meta.env.BASE_URL}logo-dark.png`} alt="Faed" style={{ height: "3.2vw", width: "auto", objectFit: "contain" }} />
      </div>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 90% 10%, rgba(201,168,76,0.08) 0%, transparent 50%)" }} />

      <div className="absolute inset-0 px-[7vw] py-[7vh] flex flex-col">
        <div className="mb-[3.5vh]">
          <div className="text-[1vw] tracking-[0.2em] font-light uppercase mb-[1vh]" style={{ color: "rgba(201,168,76,0.7)", fontFamily: "IBM Plex Sans" }}>
            §3 — USER PERSONAS
          </div>
          <h2 className="font-black leading-tight" style={{ fontSize: "3.8vw", color: "#f5f2ee", fontFamily: "Cairo" }}>
            شخصيات المستخدمين
          </h2>
        </div>

        <div className="flex gap-[3vw] flex-1">
          <div className="flex-1 rounded-2xl p-[3vw] flex flex-col" style={{ background: "rgba(245,242,238,0.05)", border: "1px solid rgba(201,168,76,0.25)" }}>
            <div className="flex items-center gap-[1.5vw] mb-[2.5vh]">
              <div className="w-[5vw] h-[5vw] rounded-full flex items-center justify-center text-[2.5vw]" style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}>
                🏭
              </div>
              <div>
                <div className="font-black text-[2vw]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>المورد</div>
                <div className="text-[1.1vw] font-light tracking-widest uppercase" style={{ color: "rgba(201,168,76,0.6)", fontFamily: "IBM Plex Sans" }}>Supplier</div>
              </div>
            </div>

            <div className="mb-[2vh]">
              <div className="text-[1.1vw] font-semibold mb-[1vh]" style={{ color: "rgba(201,168,76,0.7)", fontFamily: "Cairo" }}>من هو؟</div>
              <div className="flex flex-col gap-[0.8vh]">
                <div className="flex items-center gap-[1vw]">
                  <div className="w-[1.2vw] h-[1.2vw] rounded-full flex-shrink-0" style={{ background: "rgba(201,168,76,0.4)" }} />
                  <span className="text-[1.25vw] font-light" style={{ color: "rgba(212,234,236,0.8)", fontFamily: "Cairo" }}>مصنع أو علامة تجارية</span>
                </div>
                <div className="flex items-center gap-[1vw]">
                  <div className="w-[1.2vw] h-[1.2vw] rounded-full flex-shrink-0" style={{ background: "rgba(201,168,76,0.4)" }} />
                  <span className="text-[1.25vw] font-light" style={{ color: "rgba(212,234,236,0.8)", fontFamily: "Cairo" }}>لديه مخزون فائض أو موسمي</span>
                </div>
                <div className="flex items-center gap-[1vw]">
                  <div className="w-[1.2vw] h-[1.2vw] rounded-full flex-shrink-0" style={{ background: "rgba(201,168,76,0.4)" }} />
                  <span className="text-[1.25vw] font-light" style={{ color: "rgba(212,234,236,0.8)", fontFamily: "Cairo" }}>منتجات بعيوب طفيفة</span>
                </div>
              </div>
            </div>

            <div className="mt-auto p-[1.8vw] rounded-xl" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}>
              <div className="text-[1.1vw] font-semibold mb-[1vh]" style={{ color: "#c9a84c", fontFamily: "Cairo" }}>يحتاج إلى</div>
              <div className="flex flex-col gap-[0.6vh]">
                <span className="text-[1.2vw] font-light" style={{ color: "rgba(212,234,236,0.75)", fontFamily: "Cairo" }}>• قناة بيع سريعة</span>
                <span className="text-[1.2vw] font-light" style={{ color: "rgba(212,234,236,0.75)", fontFamily: "Cairo" }}>• لوحة تحكم للمنتجات</span>
                <span className="text-[1.2vw] font-light" style={{ color: "rgba(212,234,236,0.75)", fontFamily: "Cairo" }}>• متابعة المبيعات</span>
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-2xl p-[3vw] flex flex-col" style={{ background: "rgba(245,242,238,0.05)", border: "1px solid rgba(245,242,238,0.12)" }}>
            <div className="flex items-center gap-[1.5vw] mb-[2.5vh]">
              <div className="w-[5vw] h-[5vw] rounded-full flex items-center justify-center text-[2.5vw]" style={{ background: "rgba(245,242,238,0.08)", border: "1px solid rgba(245,242,238,0.15)" }}>
                🛍
              </div>
              <div>
                <div className="font-black text-[2vw]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>المشتري</div>
                <div className="text-[1.1vw] font-light tracking-widest uppercase" style={{ color: "rgba(212,234,236,0.45)", fontFamily: "IBM Plex Sans" }}>Buyer</div>
              </div>
            </div>

            <div className="mb-[2vh]">
              <div className="text-[1.1vw] font-semibold mb-[1vh]" style={{ color: "rgba(201,168,76,0.7)", fontFamily: "Cairo" }}>من هو؟</div>
              <div className="flex flex-col gap-[0.8vh]">
                <div className="flex items-center gap-[1vw]">
                  <div className="w-[1.2vw] h-[1.2vw] rounded-full flex-shrink-0" style={{ background: "rgba(245,242,238,0.25)" }} />
                  <span className="text-[1.25vw] font-light" style={{ color: "rgba(212,234,236,0.8)", fontFamily: "Cairo" }}>مستهلك رقمي نشط</span>
                </div>
                <div className="flex items-center gap-[1vw]">
                  <div className="w-[1.2vw] h-[1.2vw] rounded-full flex-shrink-0" style={{ background: "rgba(245,242,238,0.25)" }} />
                  <span className="text-[1.25vw] font-light" style={{ color: "rgba(212,234,236,0.8)", fontFamily: "Cairo" }}>حساس للسعر ويبحث عن القيمة</span>
                </div>
                <div className="flex items-center gap-[1vw]">
                  <div className="w-[1.2vw] h-[1.2vw] rounded-full flex-shrink-0" style={{ background: "rgba(245,242,238,0.25)" }} />
                  <span className="text-[1.25vw] font-light" style={{ color: "rgba(212,234,236,0.8)", fontFamily: "Cairo" }}>يهتم بالاستدامة والاستهلاك الذكي</span>
                </div>
              </div>
            </div>

            <div className="mt-auto p-[1.8vw] rounded-xl" style={{ background: "rgba(245,242,238,0.05)", border: "1px solid rgba(245,242,238,0.1)" }}>
              <div className="text-[1.1vw] font-semibold mb-[1vh]" style={{ color: "rgba(212,234,236,0.6)", fontFamily: "Cairo" }}>يبحث عن</div>
              <div className="flex flex-col gap-[0.6vh]">
                <span className="text-[1.2vw] font-light" style={{ color: "rgba(212,234,236,0.75)", fontFamily: "Cairo" }}>• منتجات أصلية بأسعار أقل</span>
                <span className="text-[1.2vw] font-light" style={{ color: "rgba(212,234,236,0.75)", fontFamily: "Cairo" }}>• تجربة شراء سهلة وموثوقة</span>
                <span className="text-[1.2vw] font-light" style={{ color: "rgba(212,234,236,0.75)", fontFamily: "Cairo" }}>• عروض محدودة الكمية</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
