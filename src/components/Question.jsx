import { C } from "../styles/theme.js";

export default function Question({ q, qi, total, onPick, onBack, fade }) {
  const bgWord = { warm:"11PM", core:"NOW", deep:"DARK", last:"AFTER" }[q.phase] || "";

  return (
    <div style={{
      opacity: fade ? 1 : 0,
      transition: "opacity 0.3s ease",
      padding: "0 20px",
    }}>
      {/* 진행 바 */}
      <div style={{
        height: 2, background: "rgba(255,255,255,0.06)",
        borderRadius: 1, marginBottom: 32,
      }}>
        <div style={{
          height: "100%", borderRadius: 1,
          width: ((qi + 1) / total * 100) + "%",
          background: "linear-gradient(90deg,#E84393,#6C5CE7)",
          transition: "width 0.4s ease",
        }} />
      </div>

      {/* 문항 카드 */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 18, padding: "28px 22px 24px",
        position: "relative", overflow: "hidden", marginBottom: 16,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <p style={{
            fontSize: 72, fontWeight: 900,
            color: "rgba(255,255,255,0.02)",
            margin: 0, lineHeight: 1,
            whiteSpace: "nowrap", letterSpacing: -2,
          }}>{bgWord}</p>
        </div>
        <p style={{
          fontSize: 13, color: C.scene,
          lineHeight: 1.8, margin: "0 0 18px",
          whiteSpace: "pre-line", position: "relative",
        }}>{q.scene}</p>
        <p style={{
          fontSize: 17, color: "#fff", fontWeight: 700,
          margin: 0, position: "relative",
          lineHeight: 1.5, whiteSpace: "pre-line",
        }}>{q.prompt}</p>
      </div>

      {/* 선택지 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {q.a.map((ans, idx) => (
          <button key={idx} onClick={() => onPick(idx)} style={{
            padding: "18px 20px",
            background: C.choiceBg,
            border: "1px solid " + C.choiceBorder,
            borderRadius: 14, color: C.choice,
            fontSize: 14, textAlign: "left",
            lineHeight: 1.65, whiteSpace: "pre-line",
            cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = C.choiceHover;
            e.currentTarget.style.borderColor = C.choiceBorderHover;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = C.choiceBg;
            e.currentTarget.style.borderColor = C.choiceBorder;
          }}
          >{ans}</button>
        ))}
      </div>

      {/* 뒤로가기 */}
      {qi > 0 && (
        <button onClick={onBack} style={{
          background: "transparent", border: "none",
          color: C.muted, fontSize: 13,
          cursor: "pointer", padding: "8px 0",
          fontFamily: "inherit",
        }}>← 이전</button>
      )}
    </div>
  );
}