import { useState, useEffect } from "react";
import { C } from "../styles/theme.js";
import { T16 } from "../data/types.js";
import { getCat } from "../styles/theme.js";
import { isValidCode, calcCompat, getAxisInsight } from "../utils/algorithm.js";

export default function Compare({ myCode: initMyCode, onReset }) {
  const [myCode, setMyCode] = useState(initMyCode || "");
  const [theirCode, setTheirCode] = useState("");
  const [result, setResult] = useState(null);
  const [anim, setAnim] = useState(0);

  const theirT = isValidCode(theirCode) ? T16[theirCode] : null;
  const myT = T16[myCode] || null;

  useEffect(() => {
    if (result) {
      const t = setTimeout(() => setAnim(result.score), 100);
      return () => clearTimeout(t);
    } else setAnim(0);
  }, [result]);

  function doCompare() {
    if (!isValidCode(myCode) || !isValidCode(theirCode)) return;
    const score = calcCompat(myCode, theirCode);
    const insights = getAxisInsight(myCode, theirCode);
    setResult({ score, myType: myT, theirType: theirT, insights });
  }

  if (result) return (
    <div style={{ paddingBottom: 40 }}>
      {/* 점수 링 */}
      <div style={{ textAlign: "center", padding: "28px 20px 20px" }}>
        <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 16px" }}>
          <svg viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="80" cy="80" r="68" fill="none"
              stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
            <circle cx="80" cy="80" r="68" fill="none"
              stroke="url(#cg)" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={anim * 4.27 + " 427"}
              style={{ transition: "stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1)" }} />
            <defs>
              <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E84393" />
                <stop offset="100%" stopColor="#6C5CE7" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)", textAlign: "center",
          }}>
            <div style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 52, color: "#fff", lineHeight: 1,
            }}>{anim}<span style={{ fontSize: 20, color: C.muted }}>%</span></div>
          </div>
        </div>
        <p style={{
          fontSize: 14, color: C.scene, lineHeight: 1.7,
          margin: 0, whiteSpace: "pre-line", padding: "0 10px",
        }}>
          {result.score >= 80 ? "불꽃이 확실합니다.\n서로의 욕망이 자연스럽게 맞물립니다."
            : result.score >= 60 ? "좋은 궁합입니다.\n몇 가지만 맞추면 폭발할 수 있어요."
            : result.score >= 40 ? "흥미로운 긴장감이 있습니다.\n대화가 열쇠입니다."
            : "정반대의 매력.\n서로를 이해하면 예상치 못한 화학 반응이 가능합니다."}
        </p>
      </div>

      {/* 두 유형 카드 */}
      <div style={{ display: "flex", gap: 10, margin: "0 20px 10px" }}>
        {[
          { t: result.myType, code: myCode, label: "나", c: C.accent },
          { t: result.theirType, code: theirCode, label: "상대", c: C.accent2 },
        ].map(({ t, code, label, c }) => (
          <div key={label} style={{
            flex: 1, background: c + "08",
            border: "1px solid " + c + "18",
            borderRadius: 16, padding: "18px 14px", textAlign: "center",
          }}>
            <div style={{ fontSize: 10, color: C.dim, marginBottom: 4, letterSpacing: 2 }}>{label}</div>
            <div style={{ fontSize: 10, color: c, marginBottom: 6 }}>{getCat(code).name}</div>
            <div style={{ fontSize: 32, marginBottom: 6 }}>{t?.emoji}</div>
            <div style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 14, color: c, letterSpacing: 4, marginBottom: 4,
            }}>{code}</div>
            <div style={{ fontSize: 15, color: "#fff", fontWeight: 700 }}>{t?.name}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{t?.sub}</div>
          </div>
        ))}
      </div>

      {/* 4축 인사이트 */}
      <div style={{
        margin: "0 20px 14px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 16, padding: 18,
      }}>
        <p style={{
          fontSize: 10, letterSpacing: 2,
          color: "rgba(255,255,255,0.28)", margin: "0 0 14px",
        }}>4축 욕망 비교</p>
        {result.insights.map((ins, i) => (
          <div key={i} style={{ marginBottom: i < result.insights.length - 1 ? 16 : 0 }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 5,
            }}>
              <span style={{ fontSize: 13, color: C.scene, fontWeight: 600 }}>{ins.axis}</span>
              <span style={{
                fontSize: 10, padding: "3px 10px", borderRadius: 10,
                background: ins.status === "match" ? "rgba(0,184,148,0.12)"
                  : ins.status === "tension" ? "rgba(232,67,147,0.12)"
                  : "rgba(162,155,254,0.12)",
                color: ins.status === "match" ? "#00B894"
                  : ins.status === "tension" ? "#E84393" : "#A29BFE",
                fontWeight: 600,
              }}>
                {ins.status === "match" ? "✓ 일치"
                  : ins.status === "tension" ? "⚡ 긴장" : "△ 조율"}
              </span>
            </div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{ins.text}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "0 20px" }}>
        <button onClick={() => setResult(null)} style={{
          padding: 16,
          border: "1px solid " + C.accent + "20",
          borderRadius: 14, width: "100%",
          background: C.accent + "08", color: C.accent,
          fontSize: 14, fontWeight: 600,
          cursor: "pointer", fontFamily: "inherit",
        }}>다른 유형으로 비교하기</button>
        <button onClick={onReset} style={{
          padding: 16, border: "none", borderRadius: 14,
          width: "100%",
          background: "linear-gradient(135deg,#E84393,#6C5CE7)",
          color: "#fff", fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
        }}>다시 테스트하기</button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "28px 20px" }}>
      <p style={{
        fontSize: 10, letterSpacing: 4,
        color: "rgba(255,255,255,0.3)",
        margin: "0 0 24px", textAlign: "center",
      }}>본색 궁합</p>

      {/* 나의 유형 — 읽기 전용 */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, color: C.muted, margin: "0 0 8px", letterSpacing: 1 }}>나의 유형</p>
        <div style={{
          width: "100%", padding: "14px 16px",
          border: "1px solid " + C.accent + "44",
          borderRadius: 12, background: "rgba(255,255,255,0.03)",
          color: C.accent, fontSize: 24, fontWeight: 700,
          letterSpacing: 8, textAlign: "center",
          fontFamily: "'Bebas Neue',sans-serif",
          boxSizing: "border-box",
        }}>{myCode || "—"}</div>
        {myT && (
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 14, color: C.scene }}>
            {myT.emoji} {myT.name}
          </div>
        )}
      </div>

      {/* 상대 유형 입력 */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, color: C.muted, margin: "0 0 8px", letterSpacing: 1 }}>상대의 유형</p>
        <input
          value={theirCode}
          onChange={e => setTheirCode(e.target.value.toUpperCase().slice(0, 4))}
          placeholder="ESPW"
          maxLength={4}
          style={{
            width: "100%", padding: "14px 16px",
            border: "1px solid " + (theirT ? C.accent2 + "44" : "rgba(255,255,255,0.08)"),
            borderRadius: 12, background: "rgba(255,255,255,0.03)",
            color: C.accent2, fontSize: 24, fontWeight: 700,
            letterSpacing: 8, textAlign: "center",
            fontFamily: "'Bebas Neue',sans-serif",
            outline: "none", boxSizing: "border-box",
          }}
        />
        {theirT && (
          <div style={{ textAlign: "center", marginTop: 8, fontSize: 14, color: C.scene }}>
            {theirT.emoji} {theirT.name}
          </div>
        )}
      </div>

      <button onClick={doCompare} style={{
        padding: 18, border: "none", borderRadius: 14,
        width: "100%",
        background: "linear-gradient(135deg,#E84393,#6C5CE7)",
        color: "#fff", fontSize: 16, fontWeight: 700,
        cursor: "pointer", fontFamily: "inherit",
        opacity: (isValidCode(myCode) && isValidCode(theirCode)) ? 1 : 0.4,
        transition: "all 0.2s",
      }}>본색 궁합 확인하기</button>

      <button onClick={onReset} style={{
        padding: 12, border: "none", background: "transparent",
        width: "100%", color: C.muted, fontSize: 12,
        cursor: "pointer", marginTop: 8, fontFamily: "inherit",
      }}>← 다시 테스트하기</button>
    </div>
  );
}