export default function ProductSlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(140deg, #0F3D4F 0%, #195155 100%)" }}>
      {/* Brand Logo */}
      <div className="absolute top-[3.5vh] right-[3.5vw] z-50">
        <img src={`${import.meta.env.BASE_URL}logo-dark.png`} alt="Faed" style={{ height: "3.2vw", width: "auto", objectFit: "contain" }} />
      </div>
      <div className="absolute top-0 left-0 w-full h-full" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 55%)" }} />

      <div className="absolute inset-0 px-[7vw] py-[6vh] flex flex-col">
        <div className="mb-[3vh]">
          <div className="text-[1vw] tracking-[0.2em] font-light uppercase mb-[1vh]" style={{ color: "rgba(201,168,76,0.7)", fontFamily: "IBM Plex Sans" }}>
            §4 — FEATURE DETAIL · F1 SUPPLIER PORTAL
          </div>
          <h2 className="font-black leading-tight" style={{ fontSize: "3.8vw", color: "#f5f2ee", fontFamily: "Cairo" }}>
            بوابة الموردين — Supplier Portal
          </h2>
        </div>

        <div className="flex gap-[3vw] flex-1">
          <div className="flex-1 flex flex-col gap-[1.5vh]">
            <div className="flex items-center gap-[1.5vw] p-[1.8vw] rounded-xl" style={{ background: "rgba(245,242,238,0.05)", border: "1px solid rgba(245,242,238,0.1)" }}>
              <div className="w-[4vw] h-[4vw] rounded-lg flex items-center justify-center text-[2vw] flex-shrink-0" style={{ background: "rgba(201,168,76,0.12)" }}>📋</div>
              <div>
                <div className="font-bold text-[1.35vw]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>تسجيل المورد</div>
                <div className="text-[1.15vw] font-light" style={{ color: "rgba(212,234,236,0.55)", fontFamily: "Cairo" }}>تسجيل الحساب · رفع الوثائق · الموافقة</div>
              </div>
            </div>

            <div className="flex items-center gap-[1.5vw] p-[1.8vw] rounded-xl" style={{ background: "rgba(245,242,238,0.05)", border: "1px solid rgba(245,242,238,0.1)" }}>
              <div className="w-[4vw] h-[4vw] rounded-lg flex items-center justify-center text-[2vw] flex-shrink-0" style={{ background: "rgba(201,168,76,0.12)" }}>📸</div>
              <div>
                <div className="font-bold text-[1.35vw]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>إدارة المنتجات</div>
                <div className="text-[1.15vw] font-light" style={{ color: "rgba(212,234,236,0.55)", fontFamily: "Cairo" }}>إضافة · تعديل · حذف · إدارة المخزون</div>
              </div>
            </div>

            <div className="flex items-center gap-[1.5vw] p-[1.8vw] rounded-xl" style={{ background: "rgba(245,242,238,0.05)", border: "1px solid rgba(245,242,238,0.1)" }}>
              <div className="w-[4vw] h-[4vw] rounded-lg flex items-center justify-center text-[2vw] flex-shrink-0" style={{ background: "rgba(201,168,76,0.12)" }}>📊</div>
              <div>
                <div className="font-bold text-[1.35vw]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>متابعة الطلبات</div>
                <div className="text-[1.15vw] font-light" style={{ color: "rgba(212,234,236,0.55)", fontFamily: "Cairo" }}>استقبال · تأكيد · تتبع الشحن</div>
              </div>
            </div>

            <div className="flex items-center gap-[1.5vw] p-[1.8vw] rounded-xl" style={{ background: "rgba(245,242,238,0.05)", border: "1px solid rgba(245,242,238,0.1)" }}>
              <div className="w-[4vw] h-[4vw] rounded-lg flex items-center justify-center text-[2vw] flex-shrink-0" style={{ background: "rgba(201,168,76,0.12)" }}>💵</div>
              <div>
                <div className="font-bold text-[1.35vw]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>متابعة الإيرادات</div>
                <div className="text-[1.15vw] font-light" style={{ color: "rgba(212,234,236,0.55)", fontFamily: "Cairo" }}>تقارير مالية · مستحقات · تحليلات</div>
              </div>
            </div>
          </div>

          <div className="w-[40vw] flex flex-col gap-[2vh]">
            <div className="rounded-2xl p-[3vw] flex-1" style={{ background: "rgba(201,168,76,0.09)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <div className="text-[1vw] font-semibold tracking-widests uppercase mb-[2vh]" style={{ color: "rgba(201,168,76,0.6)", fontFamily: "IBM Plex Sans" }}>
                F2 + F3 — BUYER FEATURES
              </div>

              <div className="flex flex-col gap-[1.5vh]">
                <div>
                  <div className="font-bold text-[1.3vw] mb-[0.8vh]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>عرض المنتجات F2</div>
                  <div className="flex flex-wrap gap-[0.8vw]">
                    <span className="px-[1vw] py-[0.4vh] rounded-full text-[1.1vw] font-light" style={{ background: "rgba(245,242,238,0.08)", color: "rgba(212,234,236,0.7)", fontFamily: "Cairo" }}>الصور</span>
                    <span className="px-[1vw] py-[0.4vh] rounded-full text-[1.1vw] font-light" style={{ background: "rgba(245,242,238,0.08)", color: "rgba(212,234,236,0.7)", fontFamily: "Cairo" }}>الوصف</span>
                    <span className="px-[1vw] py-[0.4vh] rounded-full text-[1.1vw] font-light" style={{ background: "rgba(245,242,238,0.08)", color: "rgba(212,234,236,0.7)", fontFamily: "Cairo" }}>السعر</span>
                    <span className="px-[1vw] py-[0.4vh] rounded-full text-[1.1vw] font-light" style={{ background: "rgba(245,242,238,0.08)", color: "rgba(212,234,236,0.7)", fontFamily: "Cairo" }}>سبب التخفيض</span>
                    <span className="px-[1vw] py-[0.4vh] rounded-full text-[1.1vw] font-light" style={{ background: "rgba(245,242,238,0.08)", color: "rgba(212,234,236,0.7)", fontFamily: "Cairo" }}>حالة المنتج</span>
                  </div>
                </div>

                <div className="w-full h-[1px]" style={{ background: "rgba(201,168,76,0.15)" }} />

                <div>
                  <div className="font-bold text-[1.3vw] mb-[0.8vh]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>الاكتشاف والبحث F3</div>
                  <div className="flex flex-wrap gap-[0.8vw]">
                    <span className="px-[1vw] py-[0.4vh] rounded-full text-[1.1vw] font-light" style={{ background: "rgba(245,242,238,0.08)", color: "rgba(212,234,236,0.7)", fontFamily: "Cairo" }}>السعر</span>
                    <span className="px-[1vw] py-[0.4vh] rounded-full text-[1.1vw] font-light" style={{ background: "rgba(245,242,238,0.08)", color: "rgba(212,234,236,0.7)", fontFamily: "Cairo" }}>الفئة</span>
                    <span className="px-[1vw] py-[0.4vh] rounded-full text-[1.1vw] font-light" style={{ background: "rgba(245,242,238,0.08)", color: "rgba(212,234,236,0.7)", fontFamily: "Cairo" }}>المقاس</span>
                    <span className="px-[1vw] py-[0.4vh] rounded-full text-[1.1vw] font-light" style={{ background: "rgba(245,242,238,0.08)", color: "rgba(212,234,236,0.7)", fontFamily: "Cairo" }}>العلامة التجارية</span>
                  </div>
                </div>

                <div className="w-full h-[1px]" style={{ background: "rgba(201,168,76,0.15)" }} />

                <div>
                  <div className="font-bold text-[1.3vw] mb-[0.8vh]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>بناء الثقة F7</div>
                  <div className="flex flex-wrap gap-[0.8vw]">
                    <span className="px-[1vw] py-[0.4vh] rounded-full text-[1.1vw] font-light" style={{ background: "rgba(245,242,238,0.08)", color: "rgba(212,234,236,0.7)", fontFamily: "Cairo" }}>تقييم المورد</span>
                    <span className="px-[1vw] py-[0.4vh] rounded-full text-[1.1vw] font-light" style={{ background: "rgba(245,242,238,0.08)", color: "rgba(212,234,236,0.7)", fontFamily: "Cairo" }}>مراجعات المستخدمين</span>
                    <span className="px-[1vw] py-[0.4vh] rounded-full text-[1.1vw] font-light" style={{ background: "rgba(245,242,238,0.08)", color: "rgba(212,234,236,0.7)", fontFamily: "Cairo" }}>شارة موثق</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
