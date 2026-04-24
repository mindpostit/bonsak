import { useEffect } from "react";
import Test from "./pages/Test.jsx";

export default function App() {
  useEffect(() => {
    document.title = "본색 — 숨겨둔 욕망을 마주하는 시간";
  }, []);

  return (
    <div style={{
      background: "#050510",
      minHeight: "100vh",
      maxWidth: 480,
      margin: "0 auto",
    }}>
      <Test />
    </div>
  );
}