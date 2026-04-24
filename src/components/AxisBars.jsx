import { AXIS_META, C } from "../styles/theme.js";

export default function AxisBars({ scores, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {AXIS_META.map((ax, i) => {
        const pct = Math.round((scores[i] / ax.max) * 100);
        const dom = scores[i] >= ax.max / 2;
        return (
          <div key={i}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 6,
            }}>
              <span style={{
                fontSize: 10,
                color: dom ? "rgba(255,255,255,0.3)" : color,
                fontWeight: dom ? 400 : 600,
              }}>{ax.l}</span>
              <span style={{
                fontSize: 11, color: "rgba(255,255,255,0.45)",
                fontWeight: 600, letterSpacing: 1,
              }}>{["판타지", "권력", "트리거", "감각"][i]}</span>
              <span style={{
                fontSize: 10,
                color: dom ? color : "rgba(255,255,255,0.3)",
                fontWeight: dom ? 600 : 400,
              }}>{ax.r}</span>
            </div>
            <div style={{
              position: "relative", height: 2,
              background: "rgba(255,255,255,0.07)", borderRadius: 1,
            }}>
              <div style={{
                position: "absolute", left: 0, top: 0,
                height: "100%", width: pct + "%",
                background: "rgba(232,67,147,0.3)", borderRadius: 1,
              }} />
              <div style={{
                position: "absolute", top: "50%",
                transform: "translate(-50%,-50%)",
                left: pct + "%",
                width: 8, height: 8,
                background: color, borderRadius: "50%",
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}