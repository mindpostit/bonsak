import { useEffect, useState } from "react";
import { C, PH_SPLASH } from "../styles/theme.js";

export default function Splash({ phase, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(false), 3600);
    const t2 = setTimeout(onDone, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, background: C.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.4s ease",
      zIndex: 100,
    }}>
      <p style={{
        fontSize: 22, fontWeight: 700, color: "#fff",
        textAlign: "center", lineHeight: 1.7,
        whiteSpace: "pre-line", padding: "0 32px",
      }}>{PH_SPLASH[phase] || ""}</p>
    </div>
  );
}