import { AXIS_META } from "../styles/theme.js";

export default function RadarChart({ scores, color }) {
  const cx = 130, cy = 130, r = 90, n = 4;
  const ang = i => (Math.PI * 2 * i) / n - Math.PI / 2;
  const gp = rad => Array.from({ length: n }, (_, i) => [
    cx + rad * Math.cos(ang(i)),
    cy + rad * Math.sin(ang(i)),
  ]);
  const dp = scores.map((s, i) => {
    const ratio = Math.min(s / AXIS_META[i].max, 1);
    return [cx + r * ratio * Math.cos(ang(i)), cy + r * ratio * Math.sin(ang(i))];
  });
  const tp = pts => pts.map((p, i) =>
    (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)
  ).join(" ") + " Z";
  const outer = gp(r);
  const labels = AXIS_META.map((ax, i) => {
    const a = ang(i);
    const dom = scores[i] >= ax.max / 2;
    return {
      x: cx + (r + 22) * Math.cos(a),
      y: cy + (r + 22) * Math.sin(a),
      text: dom ? ax.r : ax.l, dom,
    };
  });

  return (
    <svg viewBox="0 0 260 260" width="100%" style={{ display: "block" }}>
      {[0.33, 0.66, 1].map((t, gi) => (
        <path key={gi} d={tp(gp(r * t))}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: n }, (_, i) => (
        <line key={i} x1={cx} y1={cy} x2={outer[i][0]} y2={outer[i][1]}
          stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      ))}
      <path d={tp(dp)}
        fill={color + "22"} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {dp.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={color} />
      ))}
      {labels.map((lb, i) => (
        <text key={i} x={lb.x} y={lb.y}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="11" fontFamily="'Noto Sans KR',sans-serif"
          fontWeight={lb.dom ? "700" : "400"}
          fill={lb.dom ? color : "rgba(255,255,255,0.3)"}>
          {lb.text}
        </text>
      ))}
    </svg>
  );
}