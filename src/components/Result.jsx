import { C, getCat, AXIS_META } from "../styles/theme.js";
import { T16 } from "../data/types.js";
import { getBestMatch, calcCompat } from "../utils/algorithm.js";
import RadarChart from "./RadarChart.jsx";
import AxisBars from "./AxisBars.jsx";

function KinkChips({ kink, color }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {kink.split(" · ").map((k, i) => (
        <span key={i} style={{
          background: color + "12",
          border: "1px solid " + color + "28",
          borderRadius: 20, padding: "5px 13px",
          fontSize: 12, color: color,
        }}>{k}</span>
      ))}
    </div>
  );
}

function TypeSymbol({ code, color }) {
  const cat = code.slice(0, 2);
  return (
    <svg viewBox="0 0 80 80" width="72" height="72"
      style={{ display: "block", margin: "0 auto 12px" }}>
      <circle cx="40" cy="40" r="32" fill="none"
        stroke={color + "18"} strokeWidth="1" />
      {cat === "ID" && <>
        <circle cx="40" cy="22" r="4" fill={color} />
        <path d="M40 22 L56 46 L40 58 L24 46 Z"
          fill={color + "20"} stroke={color}
          strokeWidth="1.2" strokeLinejoin="round" />
      </>}
      {cat === "IS" && <>
        <rect x="27" y="28" width="26" height="22" rx="5"
          fill="none" stroke={color + "40"} strokeWidth="1.2" />
        <path d="M33 28 L33 23 A7 7 0 0 1 47 23 L47 28"
          fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="40" cy="40" r="3.5" fill={color} />
        <path d="M40 43.5 L40 48" stroke={color}
          strokeWidth="1.5" strokeLinecap="round" />
      </>}
      {cat === "ED" && <>
        <circle cx="40" cy="40" r="20" fill="none"
          stroke={color + "18"} strokeWidth="0.5" />
        <line x1="14" y1="40" x2="66" y2="40"
          stroke={color + "25"} strokeWidth="0.5" />
        <circle cx="60" cy="40" r="5"
          fill={color + "28"} stroke={color} strokeWidth="1.2" />
        <circle cx="40" cy="40" r="3" fill={color} />
      </>}
      {cat === "ES" && <>
        <path d="M40 16 Q58 26 58 40 Q58 58 40 64 Q22 58 22 40 Q22 26 40 16Z"
          fill={color + "12"} stroke={color + "35"} strokeWidth="1" />
        <path d="M40 24 Q52 32 52 40 Q52 52 40 56 Q28 52 28 40 Q28 32 40 24Z"
          fill={color + "18"} stroke={color} strokeWidth="1" />
        <circle cx="40" cy="40" r="3.5" fill={color} />
      </>}
    </svg>
  );
}

export default function Result({ result, scores, onCompare, onRetry }) {
  const cat = getCat(result.code);
  const color = result.color || C.accent;
  const bestKey = getBestMatch(result.code);
  const bestType = T16[bestKey];
  const bestScore = calcCompat(result.code, bestKey);
  const bestCat = getCat(bestKey);

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* 헤더 */}
      <div style={{ textAlign: "center", padding: "36px 24px 20px" }}>
        <p style={{
          fontSize: 10, letterSpacing: 5,
          color: "rgba(255,255,255,0.35)", margin: "0 0 8px",
        }}>당신의  본색</p>
        <p style={{
          fontSize: 12, color: color,
          margin: "0 0 16px", fontWeight: 600, letterSpacing: 1,
        }}>{cat.desc}</p>
        <TypeSymbol code={result.code} color={color} />
        <div style={{
          display: "inline-flex", alignItems: "center",
          background: color + "12",
          border: "1px solid " + color + "30",
          borderRadius: 20, padding: "5px 20px", marginBottom: 14,
        }}>
          <span style={{
            fontSize: 17, color: color,
            letterSpacing: 7, fontWeight: 700,
            fontFamily: "'Bebas Neue',sans-serif",
          }}>{result.code}</span>
        </div>
        <h2 style={{
          fontSize: 36, fontWeight: 900,
          color: "#fff", margin: "0 0 8px",
        }}>{result.name}</h2>
        <p style={{
          fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0,
        }}>"{result.sub}"</p>
      </div>

      {/* 설명 */}
      <div style={{ margin: "0 20px 14px" }}>
        <div style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, padding: 18,
        }}>
          <p style={{
            fontSize: 13.5, color: C.scene,
            lineHeight: 1.75, margin: 0,
          }}>{result.desc}</p>
        </div>
      </div>

      {/* 키워드 */}
      <div style={{ margin: "0 20px 18px" }}>
        <p style={{
          fontSize: 10, letterSpacing: 2,
          color: "rgba(255,255,255,0.28)", margin: "0 0 10px",
        }}>🔥  끌리는 키워드</p>
        <KinkChips kink={result.kink} color={color} />
      </div>

      {/* 레이더 차트 */}
      <div style={{
        margin: "0 20px 14px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 16, padding: "20px 16px 12px",
      }}>
        <p style={{
          fontSize: 10, letterSpacing: 2,
          color: "rgba(255,255,255,0.28)",
          margin: "0 0 4px", textAlign: "center",
        }}>욕망 스펙트럼</p>
        <RadarChart scores={scores} color={color} />
      </div>

      {/* 축 바 */}
      <div style={{
        margin: "0 20px 14px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 16, padding: 18,
      }}>
        <AxisBars scores={scores} color={color} />
      </div>

      {/* 베스트 매치 */}
      <div style={{
        margin: "0 20px 20px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 16, padding: "16px 18px",
      }}>
        <p style={{
          fontSize: 10, letterSpacing: 2,
          color: "rgba(255,255,255,0.4)", margin: "0 0 12px",
        }}>나와 가장 잘 맞는 유형</p>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            background: C.accent2 + "12",
            border: "1px solid " + C.accent2 + "22",
            borderRadius: 12, padding: "10px 14px",
            textAlign: "center", minWidth: 64,
          }}>
            <div style={{ fontSize: 26, marginBottom: 3 }}>{bestType?.emoji}</div>
            <div style={{
              fontSize: 9, color: "rgba(255,255,255,0.3)",
              letterSpacing: 1.5,
              fontFamily: "'Bebas Neue',sans-serif",
            }}>{bestKey}</div>
          </div>
          <div>
            <p style={{
              fontSize: 11, color: C.accent2,
              margin: "0 0 3px", fontWeight: 600,
            }}>{bestCat.name}</p>
            <p style={{
              fontSize: 18, fontWeight: 700,
              color: "#fff", margin: "0 0 3px",
            }}>{bestType?.name}</p>
            <p style={{
              fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0,
            }}>궁합 {bestScore}%</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ margin: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={onCompare} style={{
          padding: 17, border: "none", borderRadius: 14,
          width: "100%",
          background: "linear-gradient(135deg,#E84393,#6C5CE7)",
          color: "#fff", fontSize: 15, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
        }}>본색 궁합 보러가기 →</button>
        <button onClick={onRetry} style={{
          padding: 13,
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, width: "100%",
          background: "transparent", color: C.muted,
          fontSize: 13, cursor: "pointer", fontFamily: "inherit",
        }}>다시 테스트하기</button>
      </div>
    </div>
  );
}