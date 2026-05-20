export default function ArchitectureSlide() {
  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: "linear-gradient(150deg, #0c2e3a 0%, #0F3D4F 50%, #195155 100%)" }}>
      {/* Brand Logo */}
      <div className="absolute top-[3.5vh] right-[3.5vw] z-50">
        <img src={`${import.meta.env.BASE_URL}logo-dark.png`} alt="Faed" style={{ height: "3.2vw", width: "auto", objectFit: "contain" }} />
      </div>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 65%)" }} />
      <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #c9a84c 40%, #c9a84c 60%, transparent)" }} />

      <div className="absolute inset-0 px-[5vw] pt-[5vh] pb-[4vh] flex flex-col">
        <div className="mb-[2.5vh]">
          <div className="text-[1vw] tracking-[0.2em] font-light uppercase mb-[0.7vh]" style={{ color: "rgba(201,168,76,0.7)", fontFamily: "IBM Plex Sans" }}>
            §7 — TECHNICAL ARCHITECTURE · DATA WAREHOUSE
          </div>
          <h2 className="font-black leading-tight" style={{ fontSize: "3vw", color: "#f5f2ee", fontFamily: "Cairo" }}>
            Architecture Diagram — مخطط البنية التقنية
          </h2>
        </div>

        <div className="flex-1 flex items-center justify-between gap-0 relative">

          <div className="flex flex-col justify-center gap-[2.5vh]" style={{ width: "18vw" }}>
            <div className="text-center text-[0.9vw] font-semibold tracking-widest uppercase mb-[1vh]" style={{ color: "rgba(201,168,76,0.5)", fontFamily: "IBM Plex Sans" }}>
              Data Sources
            </div>

            <div className="rounded-xl px-[1.5vw] py-[2vh] text-center" style={{ background: "rgba(245,242,238,0.06)", border: "1.5px solid rgba(212,234,236,0.3)" }}>
              <div className="text-[1.6vw] mb-[0.5vh]">🏗</div>
              <div className="font-bold text-[1.1vw] leading-tight" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>Internal Legacy Systems</div>
              <div className="text-[0.9vw] font-light mt-[0.5vh]" style={{ color: "rgba(212,234,236,0.45)", fontFamily: "Cairo" }}>الأنظمة الداخلية القديمة</div>
            </div>

            <div className="rounded-xl px-[1.5vw] py-[2vh] text-center" style={{ background: "rgba(245,242,238,0.06)", border: "1.5px solid rgba(212,234,236,0.3)" }}>
              <div className="text-[1.6vw] mb-[0.5vh]">📊</div>
              <div className="font-bold text-[1.1vw] leading-tight" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>Special Purpose Data</div>
              <div className="text-[0.9vw] font-light mt-[0.5vh]" style={{ color: "rgba(212,234,236,0.45)", fontFamily: "Cairo" }}>بيانات الأغراض الخاصة</div>
            </div>

            <div className="rounded-xl px-[1.5vw] py-[2vh] text-center" style={{ background: "rgba(245,242,238,0.06)", border: "1.5px solid rgba(212,234,236,0.3)" }}>
              <div className="text-[1.6vw] mb-[0.5vh]">🌐</div>
              <div className="font-bold text-[1.1vw] leading-tight" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>External Data Sources</div>
              <div className="text-[0.9vw] font-light mt-[0.5vh]" style={{ color: "rgba(212,234,236,0.45)", fontFamily: "Cairo" }}>مصادر البيانات الخارجية</div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center gap-[1.5vh]" style={{ width: "10vw" }}>
            <svg width="100%" height="140" viewBox="0 0 120 140" fill="none">
              <defs>
                <marker id="arr1" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                  <polygon points="0 0, 7 3.5, 0 7" fill="#c9a84c" opacity="0.7" />
                </marker>
              </defs>
              <line x1="10" y1="22" x2="110" y2="70" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" markerEnd="url(#arr1)" />
              <line x1="10" y1="70" x2="105" y2="70" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" markerEnd="url(#arr1)" />
              <line x1="10" y1="118" x2="110" y2="70" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" markerEnd="url(#arr1)" />
            </svg>
          </div>

          <div className="flex flex-col items-center justify-center" style={{ width: "15vw" }}>
            <div className="text-center text-[0.9vw] font-semibold tracking-widest uppercase mb-[2vh]" style={{ color: "rgba(201,168,76,0.5)", fontFamily: "IBM Plex Sans" }}>
              Data Warehouse
            </div>
            <div className="flex flex-col items-center">
              <div className="w-[12vw] h-[3vh] rounded-t-full" style={{ background: "linear-gradient(180deg, #c9a84c 0%, #a87d2a 100%)", border: "2px solid #c9a84c" }} />
              <div className="w-[12vw] flex items-center justify-center py-[3vh]" style={{ background: "linear-gradient(180deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.08) 100%)", border: "2px solid rgba(201,168,76,0.5)", borderTop: "none", borderBottom: "none" }}>
                <div className="text-center">
                  <div className="text-[2.5vw]">🗄</div>
                  <div className="font-bold text-[1.3vw] mt-[0.5vh]" style={{ color: "#c9a84c", fontFamily: "Cairo" }}>Data</div>
                  <div className="font-bold text-[1.3vw]" style={{ color: "#c9a84c", fontFamily: "Cairo" }}>Warehouse</div>
                </div>
              </div>
              <div className="w-[12vw] h-[3vh] rounded-b-full" style={{ background: "linear-gradient(180deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.05) 100%)", border: "2px solid rgba(201,168,76,0.5)", borderTop: "none" }} />
            </div>
            <div className="mt-[1.5vh] text-center text-[0.95vw] font-light" style={{ color: "rgba(212,234,236,0.45)", fontFamily: "Cairo" }}>مستودع البيانات</div>
          </div>

          <div className="flex flex-col justify-center items-center gap-[1.5vh]" style={{ width: "8vw" }}>
            <svg width="100%" height="140" viewBox="0 0 100 140" fill="none">
              <defs>
                <marker id="arr2" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                  <polygon points="0 0, 7 3.5, 0 7" fill="#195155" opacity="0.9" />
                </marker>
              </defs>
              <line x1="5" y1="70" x2="85" y2="35" stroke="rgba(25,81,85,0.7)" strokeWidth="1.5" markerEnd="url(#arr2)" />
              <line x1="5" y1="70" x2="85" y2="105" stroke="rgba(25,81,85,0.7)" strokeWidth="1.5" markerEnd="url(#arr2)" />
            </svg>
          </div>

          <div className="flex flex-col justify-center gap-[3vh]" style={{ width: "18vw" }}>
            <div className="text-center text-[0.9vw] font-semibold tracking-widets uppercase mb-[0.5vh]" style={{ color: "rgba(201,168,76,0.5)", fontFamily: "IBM Plex Sans" }}>
              Processing Systems
            </div>

            <div className="rounded-xl px-[1.5vw] py-[2.5vh] text-center" style={{ background: "rgba(25,81,85,0.25)", border: "1.5px solid rgba(25,81,85,0.6)" }}>
              <div className="text-[1.6vw] mb-[0.5vh]">📈</div>
              <div className="font-bold text-[1.1vw] leading-tight" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>Executive Information System</div>
              <div className="text-[0.9vw] font-light mt-[0.5vh]" style={{ color: "rgba(212,234,236,0.45)", fontFamily: "IBM Plex Sans" }}>EIS</div>
            </div>

            <div className="rounded-xl px-[1.5vw] py-[2.5vh] text-center" style={{ background: "rgba(25,81,85,0.25)", border: "1.5px solid rgba(25,81,85,0.6)" }}>
              <div className="text-[1.6vw] mb-[0.5vh]">🧠</div>
              <div className="font-bold text-[1.1vw] leading-tight" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>Decision Support System</div>
              <div className="text-[0.9vw] font-light mt-[0.5vh]" style={{ color: "rgba(212,234,236,0.45)", fontFamily: "IBM Plex Sans" }}>DSS</div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center" style={{ width: "8vw" }}>
            <svg width="100%" height="220" viewBox="0 0 100 220" fill="none">
              <defs>
                <marker id="arr3" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                  <polygon points="0 0, 7 3.5, 0 7" fill="rgba(201,168,76,0.6)" />
                </marker>
              </defs>
              <line x1="5" y1="60" x2="85" y2="27" stroke="rgba(201,168,76,0.45)" strokeWidth="1.5" markerEnd="url(#arr3)" />
              <line x1="5" y1="60" x2="85" y2="82" stroke="rgba(201,168,76,0.45)" strokeWidth="1.5" markerEnd="url(#arr3)" />
              <line x1="5" y1="160" x2="85" y2="140" stroke="rgba(201,168,76,0.45)" strokeWidth="1.5" markerEnd="url(#arr3)" />
              <line x1="5" y1="160" x2="85" y2="195" stroke="rgba(201,168,76,0.45)" strokeWidth="1.5" markerEnd="url(#arr3)" />
            </svg>
          </div>

          <div className="flex flex-col justify-center gap-[1.8vh]" style={{ width: "17vw" }}>
            <div className="text-center text-[0.9vw] font-semibold tracking-widets uppercase mb-[0.3vh]" style={{ color: "rgba(201,168,76,0.5)", fontFamily: "IBM Plex Sans" }}>
              Client Systems
            </div>

            <div className="rounded-lg px-[1.2vw] py-[1.3vh] flex items-center gap-[1vw]" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <div className="text-[1.8vw]">🖥</div>
              <div>
                <div className="font-bold text-[1.1vw]" style={{ color: "#c9a84c", fontFamily: "Cairo" }}>Query System</div>
                <div className="text-[0.85vw] font-light" style={{ color: "rgba(212,234,236,0.4)", fontFamily: "IBM Plex Sans" }}>Direct queries</div>
              </div>
            </div>

            <div className="rounded-lg px-[1.2vw] py-[1.3vh] flex items-center gap-[1vw]" style={{ background: "rgba(245,242,238,0.04)", border: "1px solid rgba(245,242,238,0.1)" }}>
              <div className="text-[1.8vw]">💼</div>
              <div>
                <div className="font-bold text-[1.1vw]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>EIS Client</div>
                <div className="text-[0.85vw] font-light" style={{ color: "rgba(212,234,236,0.4)", fontFamily: "IBM Plex Sans" }}>Executive view</div>
              </div>
            </div>

            <div className="rounded-lg px-[1.2vw] py-[1.3vh] flex items-center gap-[1vw]" style={{ background: "rgba(245,242,238,0.04)", border: "1px solid rgba(245,242,238,0.1)" }}>
              <div className="text-[1.8vw]">💼</div>
              <div>
                <div className="font-bold text-[1.1vw]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>EIS Client</div>
                <div className="text-[0.85vw] font-light" style={{ color: "rgba(212,234,236,0.4)", fontFamily: "IBM Plex Sans" }}>Senior managers</div>
              </div>
            </div>

            <div className="rounded-lg px-[1.2vw] py-[1.3vh] flex items-center gap-[1vw]" style={{ background: "rgba(245,242,238,0.04)", border: "1px solid rgba(245,242,238,0.1)" }}>
              <div className="text-[1.8vw]">📋</div>
              <div>
                <div className="font-bold text-[1.1vw]" style={{ color: "#f5f2ee", fontFamily: "Cairo" }}>DSS Client</div>
                <div className="text-[0.85vw] font-light" style={{ color: "rgba(212,234,236,0.4)", fontFamily: "IBM Plex Sans" }}>Analysts / ad-hoc</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[2vh] flex items-center gap-[3vw] justify-center">
          <div className="flex items-center gap-[0.8vw]">
            <div className="w-[2.5vw] h-[2px]" style={{ background: "rgba(201,168,76,0.5)" }} />
            <div className="w-[0] h-[0]" style={{ borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "8px solid rgba(201,168,76,0.5)" }} />
            <span className="text-[1vw] font-light" style={{ color: "rgba(212,234,236,0.5)", fontFamily: "IBM Plex Sans" }}>Data Flow</span>
          </div>
          <div className="flex items-center gap-[0.8vw]">
            <div className="w-[2.5vw] h-[1.5px]" style={{ background: "rgba(25,81,85,0.7)" }} />
            <span className="text-[1vw] font-light" style={{ color: "rgba(212,234,236,0.5)", fontFamily: "IBM Plex Sans" }}>Processing Pipeline</span>
          </div>
          <div className="flex items-center gap-[0.8vw]">
            <div className="w-[1.2vw] h-[1.2vw] rounded" style={{ background: "rgba(245,242,238,0.06)", border: "1.5px solid rgba(212,234,236,0.3)" }} />
            <span className="text-[1vw] font-light" style={{ color: "rgba(212,234,236,0.5)", fontFamily: "IBM Plex Sans" }}>Data Source</span>
          </div>
          <div className="flex items-center gap-[0.8vw]">
            <div className="w-[1.2vw] h-[1.2vw] rounded" style={{ background: "rgba(25,81,85,0.25)", border: "1.5px solid rgba(25,81,85,0.6)" }} />
            <span className="text-[1vw] font-light" style={{ color: "rgba(212,234,236,0.5)", fontFamily: "IBM Plex Sans" }}>Processing System</span>
          </div>
        </div>
      </div>
    </div>
  );
}
