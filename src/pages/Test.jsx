import { useState, useEffect } from "react";
import { C, PH_SPLASH, getCat, AXIS_META } from "../styles/theme.js";
import { T16 } from "../data/types.js";
import { buildQ } from "../data/questions.js";
import { calcCompat, getBestMatch, getCode, findType, isValidCode, getAxisInsight } from "../utils/algorithm.js";
import { saveResult } from "../utils/supabase.js";

const PH = { warm:"워밍업", core:"본격 진입", deep:"더 깊이", last:"마지막" };
const F = "'Pretendard','Noto Sans KR',sans-serif";

export default function Test() {
  const [page, setPage] = useState("test");
  const [scr, setScr] = useState("splash");
  const [gender, setGender] = useState(null);
  const [qs, setQs] = useState([]);
  const [qi, setQi] = useState(0);
  const [sc, setSc] = useState([0,0,0,0]);
  const [history, setHistory] = useState([]);
  const [fade, setFade] = useState(true);
  const [res, setRes] = useState(null);
  const [phTr, setPhTr] = useState(null);
  const [splashDone, setSplashDone] = useState(false);

  // Compare state
  const [myCode, setMyCode] = useState("");
  const [theirCode, setTheirCode] = useState("");
  const [cResult, setCResult] = useState(null);
  const [cTab, setCTab] = useState("compare");
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 3800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (splashDone && scr === "splash") {
      setFade(false);
      setTimeout(() => setScr("landing"), 400);
    }
  }, [splashDone]);

  useEffect(() => {
    setFade(false);
    setTimeout(() => setFade(true), 80);
  }, [scr, qi, page]);

  const go = s => { setFade(false); setTimeout(() => setScr(s), 300); };
  const selG = g => { setGender(g); setQs(buildQ(g)); go("age"); };

  const pick = idx => {
    const ns = [...sc];
    ns[qs[qi].axis] += idx;
    setSc(ns);
    setHistory([...history, { qi, axis: qs[qi].axis, idx }]);
    if (qi < qs.length - 1) {
      const np = qs[qi+1]?.phase, cp = qs[qi]?.phase;
      if (np !== cp && np !== "last") {
        setPhTr(PH[np]); setFade(false);
        setTimeout(() => setFade(true), 80);
        setTimeout(() => {
          setFade(false);
          setTimeout(() => { setPhTr(null); setQi(qi+1); }, 400);
        }, 4000);
      } else if (np === "last") {
        setPhTr(PH["last"]); setFade(false);
        setTimeout(() => setFade(true), 80);
        setTimeout(() => {
          setFade(false);
          setTimeout(() => { setPhTr(null); setQi(qi+1); }, 400);
        }, 4000);
      } else {
        setFade(false);
        setTimeout(() => setQi(qi+1), 280);
      }
    } else {
      const r = findType(getCode(ns));
      setRes(r); setMyCode(r.code);
      saveResult({ gender, result: r.code, scores: ns, answers: [...history.map(h => h.idx), idx] });
      go("result");
    }
  };

  const goBack = () => {
    if (history.length === 0 || phTr) return;
    const prev = history[history.length - 1];
    const ns = [...sc]; ns[prev.axis] -= prev.idx; setSc(ns);
    setHistory(history.slice(0, -1));
    setFade(false); setTimeout(() => setQi(prev.qi), 280);
  };

  const reset = () => {
    setScr("landing"); setGender(null); setQi(0);
    setSc([0,0,0,0]); setHistory([]); setRes(null);
    setPage("test"); setMyCode(""); setTheirCode("");
    setCResult(null); setCTab("compare");
  };

  const goCompare = () => { setPage("compare"); setCResult(null); setCTab("compare"); setFade(false); };

  const doCompare = () => {
    const m = myCode.toUpperCase().trim(), t = theirCode.toUpperCase().trim();
    if (!isValidCode(m) || !isValidCode(t)) { alert("유효한 4글자 코드를 입력해주세요 (예: IDPN)"); return; }
    const score = calcCompat(m, t);
    const insights = getAxisInsight(m, t);
    const mT = T16[m] || findType(m);
    const tT = T16[t] || findType(t);
    setCResult({ my: m, their: t, score, insights, myType: mT, theirType: tT });
    setAnimPct(0); setTimeout(() => setAnimPct(score), 500);
  };

  const Sec = ({ children, sx }) => (
    <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.04)", borderRadius:16, padding:"20px 18px", marginBottom:14, ...sx }}>
      {children}
    </div>
  );
  const Label = ({ children }) => (
    <div style={{ fontSize:11, color:C.dim, letterSpacing:2, marginBottom:10, fontWeight:300 }}>{children}</div>
  );

  const myT16 = T16[myCode?.toUpperCase().trim()];
  const allTypes = Object.entries(T16).sort((a,b) => b[1].pop - a[1].pop);

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:F, color:"#E8E6F0", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"fixed", top:"8%", left:"50%", transform:"translateX(-50%)", width:"100vw", height:"60vh", background:"radial-gradient(ellipse, rgba(232,67,147,0.03) 0%, transparent 55%)", pointerEvents:"none", filter:"blur(80px)" }}/>

      {/* 스플래시 */}
      {scr === "splash" && page === "test" && (
        <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, zIndex:100, background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", animation:"splashFade 3.8s ease forwards" }}>
          <div style={{ position:"absolute", width:"50vw", height:"50vh", background:"radial-gradient(ellipse,rgba(232,67,147,0.06) 0%,transparent 60%)", filter:"blur(60px)" }}/>
          <h1 style={{ fontFamily:F, fontSize:52, fontWeight:900, margin:0, animation:"splashPulse 3.8s ease", letterSpacing:-1 }}>
            <span style={{ background:"linear-gradient(135deg,#E84393,#6C5CE7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>본색</span>
          </h1>
          <div style={{ width:0, height:2, background:"linear-gradient(90deg,#E84393,#6C5CE7)", margin:"16px 0", borderRadius:1, animation:"lineGrow 1s ease 0.6s forwards" }}/>
          <p style={{ fontSize:13, color:C.muted, fontWeight:300, margin:0, letterSpacing:2, opacity:0, animation:"subtitleIn 0.8s ease 1.2s forwards" }}>숨겨둔 욕망을 마주하는 시간</p>
        </div>
      )}

      <div style={{ maxWidth:420, margin:"0 auto", padding:"0 24px", minHeight:"100vh", display:"flex", flexDirection:"column", opacity:fade?1:0, transform:fade?"translateY(0)":"translateY(16px)", transition:"opacity 0.4s ease, transform 0.4s ease" }}>

        {/* ════ TEST PAGE ════ */}
        {page === "test" && (<>

          {/* Phase 전환 */}
          {phTr && (
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ textAlign:"center", padding:"0 24px" }}>
                <div style={{ fontSize:10, color:C.accent, letterSpacing:6, fontWeight:400, textTransform:"uppercase", animation:"phNameIn 0.6s ease forwards", opacity:0 }}>{phTr}</div>
                <div style={{ width:0, height:1, background:`linear-gradient(90deg,transparent,${C.accent},transparent)`, margin:"16px auto 20px", animation:"phLineGrow 0.5s ease 0.4s forwards", opacity:0 }}/>
                <div style={{ fontSize:22, color:"#fff", fontWeight:700, lineHeight:1.8, whiteSpace:"pre-line", animation:"phSubIn 0.6s ease 0.8s forwards", opacity:0 }}>
                  {PH_SPLASH[Object.keys(PH).find(k => PH[k] === phTr)]}
                </div>
              </div>
            </div>
          )}

          {/* 랜딩 */}
          {scr === "landing" && !phTr && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", paddingBottom:48 }}>
              <div style={{ textAlign:"center", marginBottom:48 }}>
                <div style={{ fontSize:11, letterSpacing:6, color:C.dim, marginBottom:28, fontWeight:300 }}>성적 취향 자기발견 테스트</div>
                <h1 style={{ fontSize:42, fontWeight:900, lineHeight:1.2, margin:"0 0 6px", color:"#fff" }}>
                  당신의 <span style={{ background:"linear-gradient(90deg,#E84393,#6C5CE7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>본색</span>을<br/>드러낼 시간
                </h1>
                <p style={{ fontSize:13.5, color:C.muted, lineHeight:1.8, margin:"28px 0 0", fontWeight:300 }}>
                  대부분의 사람은 자기 몸이 진짜 원하는 걸 모릅니다.<br/>사회가 정한 기준에 맞춰 욕망을 숨기고 있을 뿐.
                </p>
                <p style={{ fontSize:13, color:C.scene, marginTop:16, lineHeight:1.6 }}>
                  21개의 질문이 당신을 장면 속으로 데려갑니다.<br/>
                  <span style={{ color:C.accent, fontWeight:600 }}>읽는 순간, 몸이 먼저 답합니다.</span>
                </p>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <div style={{ fontSize:11, color:C.dim, textAlign:"center", marginBottom:4, letterSpacing:2, fontWeight:300 }}>성별을 선택하세요</div>
                {[["남성","M"],["여성","F"]].map(([l,v]) => (
                  <button key={v} onClick={() => selG(v)} style={{ padding:"16px 20px", border:"1px solid "+C.choiceBorder, borderRadius:14, background:C.choiceBg, color:C.scene, fontSize:14.5, cursor:"pointer", transition:"all 0.2s", textAlign:"center", fontWeight:500 }}
                    onMouseEnter={e => { e.target.style.background = C.choiceHover; e.target.style.borderColor = C.choiceBorderHover; }}
                    onMouseLeave={e => { e.target.style.background = C.choiceBg; e.target.style.borderColor = C.choiceBorder; }}
                  >{l}</button>
                ))}
              </div>
              <p style={{ textAlign:"center", fontSize:10, color:C.muted, marginTop:24 }}>🔞 만 19세 이상 · 응답은 통계 목적으로 익명 저장됩니다</p>
              <p style={{ textAlign:"center", fontSize:10, color:"rgba(255,255,255,0.18)", marginTop:8 }}>🔬 성과학 연구 기반 설계 · 의학적 진단 도구가 아닙니다</p>
            </div>
          )}

          {/* 성인 확인 */}
          {scr === "age" && !phTr && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center" }}>
              <div style={{ background:"rgba(232,67,147,0.03)", border:"1px solid rgba(232,67,147,0.1)", borderRadius:20, padding:"40px 28px", textAlign:"center" }}>
                <div style={{ fontSize:36, marginBottom:16 }}>🔞</div>
                <h2 style={{ fontSize:20, fontWeight:800, color:"#fff", margin:"0 0 14px" }}>성인만 참여할 수 있습니다</h2>
                <p style={{ fontSize:13.5, color:C.scene, lineHeight:1.7, margin:"0 0 8px" }}>
                  이 테스트는 구체적인 성적 상황을 묘사하며<br/>
                  <span style={{ color:C.accent, fontWeight:600 }}>성행위, 판타지, 자위, 속박</span> 등의<br/>직접적인 내용을 포함합니다.
                </p>
                <p style={{ fontSize:12, color:C.muted, lineHeight:1.6, margin:"0 0 28px" }}>
                  질문을 읽는 것 자체가 경험입니다.<br/>당신의 몸이 어떻게 반응하는지 관찰해보세요.
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  <button onClick={() => {
                    setPhTr(PH.warm); setFade(false);
                    setTimeout(() => setFade(true), 80);
                    setTimeout(() => {
                      setFade(false);
                      setTimeout(() => { setPhTr(null); go("test"); }, 400);
                    }, 4000);
                  }} style={{ padding:"18px", border:"none", borderRadius:14, background:"linear-gradient(135deg,#E84393,#6C5CE7)", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer" }}>
                    네, 19세 이상입니다
                  </button>
                  <button onClick={reset} style={{ padding:"14px", border:"1px solid "+C.choiceBorder, borderRadius:14, background:"transparent", color:C.dim, fontSize:13, cursor:"pointer" }}>돌아가기</button>
                </div>
              </div>
            </div>
          )}

          {/* 퀴즈 */}
          {scr === "test" && qs.length > 0 && !phTr && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", paddingTop:24, paddingBottom:32 }}>
              <div style={{ marginBottom:36 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    {qi > 0 && (
                      <button onClick={goBack} style={{ padding:"6px 14px", border:"none", borderRadius:10, background:"rgba(232,67,147,0.08)", color:C.accent, fontSize:12, cursor:"pointer", transition:"all 0.2s", fontWeight:500 }}
                        onMouseEnter={e => e.target.style.background = "rgba(232,67,147,0.15)"}
                        onMouseLeave={e => e.target.style.background = "rgba(232,67,147,0.08)"}
                      >← 이전</button>
                    )}
                    <span style={{ fontSize:12, color:C.dim, letterSpacing:2, fontWeight:300 }}>{PH[qs[qi].phase]}</span>
                  </div>
                  <span style={{ fontSize:15, color:C.accent, fontWeight:700 }}>
                    {qi+1}<span style={{ color:C.vdim, fontWeight:400 }}> / {qs.length}</span>
                  </span>
                </div>
                <div style={{ height:2, background:"rgba(255,255,255,0.025)", borderRadius:1 }}>
                  <div style={{ height:"100%", borderRadius:1, background:"linear-gradient(90deg,#E84393,#6C5CE7)", width:((qi+1)/qs.length*100)+"%", transition:"width 0.5s ease" }}/>
                </div>
              </div>
              <div style={{ marginBottom: qs[qi].prompt ? 20 : 32 }}>
                <p style={{ fontSize:15.5, fontWeight:300, lineHeight:2, color:C.scene, whiteSpace:"pre-line", margin:0 }}>{qs[qi].scene}</p>
              </div>
              {qs[qi].prompt && (
                <div style={{ marginBottom:32 }}>
                  <p style={{ fontSize:20, fontWeight:800, lineHeight:1.5, color:C.prompt, whiteSpace:"pre-line", margin:0 }}>{qs[qi].prompt}</p>
                </div>
              )}
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {qs[qi].a.map((a, i) => (
                  <button key={qi+"-"+i} onClick={() => pick(i)} style={{ padding:"20px", border:"1px solid "+C.choiceBorder, borderRadius:14, background:C.choiceBg, color:C.choice, fontSize:14, lineHeight:1.7, textAlign:"left", cursor:"pointer", transition:"all 0.2s", whiteSpace:"pre-line", fontWeight:400 }}
                    onMouseEnter={e => { e.target.style.background = C.choiceHover; e.target.style.borderColor = C.choiceBorderHover; e.target.style.transform = "translateX(3px)"; }}
                    onMouseLeave={e => { e.target.style.background = C.choiceBg; e.target.style.borderColor = C.choiceBorder; e.target.style.transform = "none"; }}
                  >{a}</button>
                ))}
              </div>
            </div>
          )}

          {/* 결과 */}
          {scr === "result" && res && !phTr && (() => {
            const cat = getCat(res.code);
            return (
              <div style={{ flex:1, display:"flex", flexDirection:"column", paddingTop:44, paddingBottom:44 }}>
                <div style={{ textAlign:"center", marginBottom:24 }}>
                  <div style={{ fontSize:12, letterSpacing:4, color:C.dim, marginBottom:16, fontWeight:300 }}>당신의 본색</div>
                  <div style={{ fontSize:14, color:res.color, fontWeight:600, marginBottom:6 }}>{cat.emoji} {cat.name}</div>
                  <div style={{ fontSize:11, color:C.dim, marginBottom:16, fontWeight:300 }}>{cat.desc}</div>
                  {/* 추상 심볼 */}
                  {(() => {
                    const cat = res.code.slice(0,2);
                    const color = res.color;
                    return (
                      <svg viewBox="0 0 80 80" width="72" height="72" style={{ display:"block", margin:"0 auto 14px" }}>
                        <circle cx="40" cy="40" r="32" fill="none" stroke={color+"18"} strokeWidth="1"/>
                        {cat === "ID" && <>
                          <circle cx="40" cy="22" r="4" fill={color}/>
                          <path d="M40 22 L56 46 L40 58 L24 46 Z" fill={color+"20"} stroke={color} strokeWidth="1.2" strokeLinejoin="round"/>
                        </>}
                        {cat === "IS" && <>
                          <rect x="27" y="28" width="26" height="22" rx="5" fill="none" stroke={color+"40"} strokeWidth="1.2"/>
                          <path d="M33 28 L33 23 A7 7 0 0 1 47 23 L47 28" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
                          <circle cx="40" cy="40" r="3.5" fill={color}/>
                          <line x1="40" y1="43" x2="40" y2="48" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
                        </>}
                        {cat === "ED" && <>
                          <circle cx="40" cy="40" r="20" fill="none" stroke={color+"18"} strokeWidth="0.5"/>
                          <circle cx="40" cy="40" r="10" fill="none" stroke={color+"28"} strokeWidth="0.5"/>
                          <line x1="14" y1="40" x2="66" y2="40" stroke={color+"25"} strokeWidth="0.5"/>
                          <circle cx="60" cy="40" r="5" fill={color+"28"} stroke={color} strokeWidth="1.2"/>
                          <circle cx="40" cy="40" r="3" fill={color}/>
                          <path d="M40 37.5 L42.5 40 L40 42.5 L37.5 40 Z" fill="rgba(255,255,255,0.5)"/>
                        </>}
                        {cat === "ES" && <>
                          <path d="M40 16 Q58 26 58 40 Q58 58 40 64 Q22 58 22 40 Q22 26 40 16Z" fill={color+"12"} stroke={color+"35"} strokeWidth="1"/>
                          <path d="M40 26 Q52 33 52 40 Q52 52 40 56 Q28 52 28 40 Q28 33 40 26Z" fill={color+"18"} stroke={color} strokeWidth="1"/>
                          <circle cx="40" cy="40" r="3.5" fill={color}/>
                        </>}
                      </svg>
                    );
                  })()}
                  <div style={{ display:"inline-block", padding:"5px 16px", borderRadius:20, background:res.color+"10", border:"1px solid "+res.color+"22", fontFamily:"'Bebas Neue',sans-serif", fontSize:15, letterSpacing:5, color:res.color, marginBottom:12 }}>{res.code}</div>
                  <h2 style={{ fontSize:32, fontWeight:900, color:"#fff", margin:"0 0 6px" }}>{res.name}</h2>
                  <p style={{ fontSize:14, color:C.scene, margin:0, fontWeight:400 }}>"{res.sub}"</p>
                </div>
                {/* 페르소나 카드 */}
                {res.persona && (
                  <div style={{ background:res.color+"08", border:"1px solid "+res.color+"18", borderRadius:12, padding:"12px 16px", marginBottom:16 }}>
                    <p style={{ fontSize:10, color:res.color+"99", letterSpacing:2, margin:"0 0 6px" }}>이런 사람</p>
                    <p style={{ fontSize:13, color:"rgba(255,255,255,0.75)", lineHeight:1.7, margin:0 }}>{res.persona}</p>
                  </div>
                )}
                <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.04)", borderRadius:18, padding:"24px 22px", marginBottom:16, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", bottom:-30, right:-30, width:120, height:120, background:`radial-gradient(circle,${res.color}0A 0%,transparent 60%)` }}/>
                  <p style={{ fontSize:14, lineHeight:1.9, color:C.scene, margin:0, position:"relative", fontWeight:300 }}>{res.desc}</p>
                </div>
                <div style={{ background:res.color+"06", borderRadius:14, padding:"16px 18px", border:"1px solid "+res.color+"12", marginBottom:16 }}>
                  <div style={{ fontSize:11, color:C.dim, letterSpacing:2, marginBottom:10, fontWeight:300 }}>🔥 끌리는 키워드</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                    {res.kink.split(" · ").map((k,i) => (
                      <span key={i} style={{ background:res.color+"12", border:"1px solid "+res.color+"28", borderRadius:20, padding:"5px 13px", fontSize:12, color:res.color }}>{k}</span>
                    ))}
                  </div>
                </div>
                {/* 레이더 차트 */}
                <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:14, padding:"20px 16px 12px", marginBottom:16, border:"1px solid rgba(255,255,255,0.03)" }}>
                  <div style={{ fontSize:11, color:C.dim, marginBottom:4, letterSpacing:2, fontWeight:300, textAlign:"center" }}>욕망 스펙트럼</div>
                  {(() => {
                    const cx=130, cy=130, r=90, n=4;
                    const ang = i => (Math.PI*2*i)/n - Math.PI/2;
                    const gp = rad => Array.from({length:n}, (_,i) => [cx+rad*Math.cos(ang(i)), cy+rad*Math.sin(ang(i))]);
                    const dp = sc.map((s,i) => { const rat=Math.min(s/AXIS_META[i].max,1); return [cx+r*rat*Math.cos(ang(i)), cy+r*rat*Math.sin(ang(i))]; });
                    const tp = pts => pts.map((p,i) => (i===0?"M":"L")+p[0].toFixed(1)+","+p[1].toFixed(1)).join(" ")+" Z";
                    const outer = gp(r);
                    const lbls = AXIS_META.map((ax,i) => { const a=ang(i); const dom=sc[i]>=ax.max/2; return {x:cx+(r+22)*Math.cos(a), y:cy+(r+22)*Math.sin(a), text:dom?ax.r:ax.l, dom}; });
                    return (
                      <svg viewBox="0 0 260 260" width="100%" style={{display:"block"}}>
                        {[0.33,0.66,1].map((t,gi) => <path key={gi} d={tp(gp(r*t))} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>)}
                        {Array.from({length:n}, (_,i) => <line key={i} x1={cx} y1={cy} x2={outer[i][0]} y2={outer[i][1]} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>)}
                        <path d={tp(dp)} fill={res.color+"22"} stroke={res.color} strokeWidth="1.5" strokeLinejoin="round"/>
                        {dp.map(([x,y],i) => <circle key={i} cx={x} cy={y} r="4" fill={res.color}/>)}
                        {lbls.map((lb,i) => <text key={i} x={lb.x} y={lb.y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontFamily="'Noto Sans KR',sans-serif" fontWeight={lb.dom?"700":"400"} fill={lb.dom?res.color:"rgba(255,255,255,0.3)"}>{lb.text}</text>)}
                      </svg>
                    );
                  })()}
                </div>
                {/* 베스트 매치 */}
                <div onClick={goCompare} style={{ background:`linear-gradient(135deg,${C.accent}12,${C.accent2}12)`, borderRadius:14, padding:"20px 18px", marginBottom:28, border:"1px solid "+C.accent+"20", cursor:"pointer", transition:"all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.border="1px solid "+C.accent+"44"; e.currentTarget.style.transform="scale(1.01)"; }}
                  onMouseLeave={e => { e.currentTarget.style.border="1px solid "+C.accent+"20"; e.currentTarget.style.transform="none"; }}
                >
                  <div style={{ fontSize:11, color:C.scene, marginBottom:8, letterSpacing:2, fontWeight:400 }}>나와 가장 잘 맞는 유형</div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                    <div style={{ fontSize:28 }}>{T16[res.match]?.emoji}</div>
                    <div>
                      <div style={{ fontSize:13, color:C.muted }}>{getCat(res.match).emoji} {getCat(res.match).name}</div>
                      <div style={{ fontSize:18, fontWeight:700, color:"#fff" }}>{T16[res.match]?.name}</div>
                    </div>
                  </div>
                  <div style={{ padding:"14px", borderRadius:12, background:"linear-gradient(135deg,#E84393,#6C5CE7)", color:"#fff", fontSize:14, fontWeight:700, textAlign:"center" }}>본색 궁합 보러가기 →</div>
                </div>
                <button onClick={reset} style={{ padding:12, border:"none", background:"transparent", width:"100%", color:C.scene, fontSize:12, cursor:"pointer" }}>다시 테스트하기</button>
                <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:12, padding:"14px 16px", marginTop:20 }}>
                  <p style={{ fontSize:10, color:"rgba(255,255,255,0.3)", letterSpacing:2, margin:"0 0 8px" }}>연구 기반</p>
                  <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", lineHeight:1.7, margin:0 }}>
                    Wilson WSFQ · Chivers et al. · Basson 모델을 기반으로 설계된 자기이해 도구입니다. 의학적 진단을 대체하지 않습니다.
                  </p>
                </div>
              </div>
            );
          })()}
        </>)}

        {/* ════ COMPARE PAGE ════ */}
        {page === "compare" && (<>
          <div style={{ textAlign:"center", marginTop:28, marginBottom:24 }}>
            <div style={{ fontSize:11, letterSpacing:6, color:C.dim, marginBottom:12, fontWeight:300 }}>본색 궁합</div>
            <h1 style={{ fontSize:28, fontWeight:900, color:"#fff", margin:0, lineHeight:1.3 }}>
              우리의 <span style={{ background:"linear-gradient(90deg,#E84393,#6C5CE7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>욕망</span>은 맞을까?
            </h1>
            <p style={{ fontSize:12, color:C.muted, marginTop:10, fontWeight:300 }}>서로의 유형을 입력하면 4축 궁합을 분석합니다</p>
          </div>

          <div style={{ display:"flex", gap:4, marginBottom:24, background:"rgba(255,255,255,0.03)", borderRadius:12, padding:4 }}>
            {[["compare","🔗 코드 비교"],["stats","📊 욕망 통계"]].map(([id,label]) => (
              <button key={id} onClick={() => { setCTab(id); setCResult(null); }} style={{ flex:1, padding:"12px", border:"none", borderRadius:10, cursor:"pointer", background:cTab===id?`linear-gradient(135deg,${C.accent}20,${C.accent2}20)`:"transparent", color:cTab===id?"#fff":C.muted, fontSize:13, fontWeight:cTab===id?700:400, transition:"all 0.2s" }}>{label}</button>
            ))}
          </div>

          {/* 코드 비교 탭 */}
          {cTab === "compare" && !cResult && (<>
            <Sec>
              <Label>나의 유형</Label>
              <div style={{ width:"100%", padding:"14px 16px", border:"1px solid "+C.accent+"44", borderRadius:12, background:"rgba(255,255,255,0.03)", color:C.accent, fontSize:20, fontWeight:700, letterSpacing:6, textAlign:"center", fontFamily:"'Bebas Neue',sans-serif", boxSizing:"border-box" }}>
                {myCode || "—"}
              </div>
              {myCode && T16[myCode] && <div style={{ textAlign:"center", marginTop:8, fontSize:13, color:C.scene }}>{T16[myCode].emoji} {T16[myCode].name}</div>}
              <div style={{ height:20 }}/>
              <Label>상대의 유형</Label>
              <input value={theirCode} onChange={e => setTheirCode(e.target.value.toUpperCase().slice(0,4))} placeholder="ISMW" maxLength={4}
                style={{ width:"100%", padding:"14px 16px", border:"1px solid "+(theirCode && isValidCode(theirCode) ? C.accent2+"44" : "rgba(255,255,255,0.08)"), borderRadius:12, background:"rgba(255,255,255,0.03)", color:C.accent2, fontSize:20, fontWeight:700, letterSpacing:6, textAlign:"center", fontFamily:"'Bebas Neue',sans-serif", outline:"none", boxSizing:"border-box" }}
              />
              {theirCode && T16[theirCode] && <div style={{ textAlign:"center", marginTop:8, fontSize:13, color:C.scene }}>{T16[theirCode].emoji} {T16[theirCode].name}</div>}
            </Sec>

            {isValidCode(myCode) && (
              <div style={{ marginBottom:16 }}>
                <Label>나의 궁합 미리보기</Label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {(() => {
                    const mc = myCode.toUpperCase().trim();
                    if (!isValidCode(mc)) return null;
                    const best = getBestMatch(mc);
                    const allK = Object.keys(T16).filter(k => k !== mc);
                    const worst = allK.reduce((w,k) => calcCompat(mc,k) < calcCompat(mc,w) ? k : w, allK[0]);
                    const sameDS = allK.find(k => k[1] === mc[1] && k !== best && k !== worst) || allK[2];
                    return [
                      { label:"🔥 최고 궁합", their:best, desc:T16[best]?.name },
                      { label:"⚡ 긴장 궁합", their:sameDS, desc:T16[sameDS]?.name },
                      { label:"🧊 정반대", their:worst, desc:T16[worst]?.name },
                      { label:"🪞 같은 유형", their:mc, desc:"나 vs 나" },
                    ].map((d,i) => (
                      <button key={i} onClick={() => setTheirCode(d.their)} style={{ flex:"1 1 45%", padding:"10px 12px", borderRadius:10, border:"1px solid rgba(255,255,255,0.05)", background:"rgba(255,255,255,0.02)", cursor:"pointer", textAlign:"left", transition:"all 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                      >
                        <div style={{ fontSize:13, color:C.choice }}>{d.label}</div>
                        <div style={{ fontSize:10, color:C.dim, marginTop:2 }}>{d.desc} ({calcCompat(mc, d.their)}%)</div>
                      </button>
                    ));
                  })()}
                </div>
              </div>
            )}

            <button onClick={doCompare} style={{ padding:"18px", border:"none", borderRadius:14, width:"100%", background:"linear-gradient(135deg,#E84393,#6C5CE7)", color:"#fff", fontSize:16, fontWeight:700, cursor:"pointer", textAlign:"center", opacity:isValidCode(myCode)&&isValidCode(theirCode)?1:0.4, transition:"all 0.2s", marginBottom:6 }}>본색 궁합 확인하기</button>
            <button onClick={reset} style={{ padding:12, border:"none", background:"transparent", width:"100%", color:C.scene, fontSize:12, cursor:"pointer", marginTop:4 }}>← 다시 테스트하기</button>
          </>)}

          {/* 궁합 결과 */}
          {cTab === "compare" && cResult && (<>
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <div style={{ position:"relative", width:160, height:160, margin:"0 auto 16px" }}>
                <svg viewBox="0 0 160 160" style={{ transform:"rotate(-90deg)" }}>
                  <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6"/>
                  <circle cx="80" cy="80" r="68" fill="none" stroke="url(#cg)" strokeWidth="6" strokeLinecap="round" strokeDasharray={animPct*4.27+" 427"} style={{ transition:"stroke-dasharray 1.5s cubic-bezier(0.4,0,0.2,1)" }}/>
                  <defs><linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#E84393"/><stop offset="100%" stopColor="#6C5CE7"/></linearGradient></defs>
                </svg>
                <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52, color:"#fff", lineHeight:1 }}>{animPct}<span style={{ fontSize:20, color:C.muted }}>%</span></div>
                </div>
              </div>
              <p style={{ fontSize:14, color:C.scene, lineHeight:1.7, margin:0, fontWeight:300, padding:"0 10px", whiteSpace:"pre-line" }}>
                {cResult.score>=80?"불꽃이 확실합니다.\n서로의 욕망이 자연스럽게 맞물립니다.":cResult.score>=60?"좋은 궁합입니다.\n몇 가지만 맞추면 폭발할 수 있어요.":cResult.score>=40?"흥미로운 긴장감이 있습니다.\n대화가 열쇠입니다.":"정반대의 매력.\n서로를 이해하면 예상치 못한 화학 반응이 가능합니다."}
              </p>
            </div>

            <div style={{ display:"flex", gap:10, marginBottom:10 }}>
              {[{t:cResult.myType,code:cResult.my,label:"나",c:C.accent},{t:cResult.theirType,code:cResult.their,label:"상대",c:C.accent2}].map(({t,code,label,c}) => (
                <div key={label} style={{ flex:1, background:c+"08", border:"1px solid "+c+"18", borderRadius:16, padding:"18px 14px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:C.dim, marginBottom:4, letterSpacing:2 }}>{label}</div>
                  <div style={{ fontSize:10, color:c, marginBottom:6 }}>{getCat(code).name}</div>
                  <div style={{ fontSize:32, marginBottom:6 }}>{t.emoji}</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:14, color:c, letterSpacing:4, marginBottom:4 }}>{code}</div>
                  <div style={{ fontSize:15, color:"#fff", fontWeight:700 }}>{t.name}</div>
                  <div style={{ fontSize:10, color:C.muted, marginTop:4, fontWeight:300 }}>{t.sub}</div>
                </div>
              ))}
            </div>

            <Sec>
              <Label>4축 욕망 비교</Label>
              {cResult.insights.map((ins,i) => (
                <div key={i} style={{ marginBottom:i<cResult.insights.length-1?18:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <span style={{ fontSize:13, color:C.scene, fontWeight:600 }}>{ins.axis}</span>
                    <span style={{ fontSize:10, padding:"3px 10px", borderRadius:10, background:ins.status==="match"?"rgba(0,184,148,0.12)":ins.status==="tension"?"rgba(232,67,147,0.12)":"rgba(162,155,254,0.12)", color:ins.status==="match"?"#00B894":ins.status==="tension"?"#E84393":"#A29BFE", fontWeight:600 }}>
                      {ins.status==="match"?"✓ 일치":ins.status==="tension"?"⚡ 긴장":"△ 조율"}
                    </span>
                  </div>
                  <div style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>{ins.text}</div>
                </div>
              ))}
            </Sec>

            <div style={{ display:"flex", flexDirection:"column", gap:10, marginTop:8 }}>
              <button onClick={() => setCResult(null)} style={{ padding:"16px", border:"1px solid "+C.accent+"20", borderRadius:14, width:"100%", background:C.accent+"08", color:C.accent, fontSize:14, fontWeight:600, cursor:"pointer", textAlign:"center" }}>다른 유형으로 비교하기</button>
              <button onClick={reset} style={{ padding:"16px", border:"none", borderRadius:14, width:"100%", background:"linear-gradient(135deg,#E84393,#6C5CE7)", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", textAlign:"center" }}>다시 테스트하기</button>
            </div>
          </>)}

          {/* 통계 탭 */}
          {cTab === "stats" && (<>
            <Sec>
              <Label>나의 유형</Label>
              <div style={{ width:"100%", padding:"14px 16px", border:"1px solid "+C.accent+"44", borderRadius:12, background:"rgba(255,255,255,0.03)", color:C.accent, fontSize:20, fontWeight:700, letterSpacing:6, textAlign:"center", fontFamily:"'Bebas Neue',sans-serif", boxSizing:"border-box" }}>
                {myCode || "—"}
              </div>
              {myT16 && <div style={{ textAlign:"center", marginTop:8, fontSize:14, color:C.scene }}>{myT16.emoji} {myT16.name}</div>}
            </Sec>

            {myT16 && (<>
              <Sec>
                <Label>📊 당신의 유형 통계</Label>
                <div style={{ padding:"12px 14px", background:"rgba(255,255,255,0.02)", borderRadius:10, fontSize:13, color:C.scene, lineHeight:1.6, marginBottom:6 }}>
                  전체 사용자 중 약 <span style={{ color:"#fff", fontWeight:600 }}>{myT16.pop}%</span>가 당신과 같은 유형입니다
                </div>
                <div style={{ padding:"12px 14px", background:"rgba(255,255,255,0.02)", borderRadius:10, fontSize:13, color:C.scene, lineHeight:1.6 }}>
                  가장 잘 맞는 유형: <span style={{ color:"#fff", fontWeight:600 }}>{T16[getBestMatch(myCode)]?.emoji} {T16[getBestMatch(myCode)]?.name}</span> ({calcCompat(myCode, getBestMatch(myCode))}%)
                </div>
              </Sec>

              <Sec>
                <Label>💕 유형별 궁합 TOP 10</Label>
                {Object.keys(T16).filter(k => k !== myCode).map(k => ({ key:k, ...T16[k], score:calcCompat(myCode,k) })).sort((a,b) => b.score-a.score).slice(0,10).map((ct,i) => (
                  <div key={ct.key} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:i<9?"1px solid rgba(255,255,255,0.03)":"none" }}>
                    <div style={{ fontSize:10, color:C.dim, fontFamily:"'Bebas Neue',sans-serif", width:20, textAlign:"center" }}>{i+1}</div>
                    <div style={{ fontSize:20 }}>{ct.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, color:"#fff", fontWeight:600 }}>{ct.name}</div>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:11, color:C.dim, letterSpacing:2 }}>{ct.key}</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:60, height:4, background:"rgba(255,255,255,0.03)", borderRadius:2, overflow:"hidden" }}>
                        <div style={{ height:"100%", borderRadius:2, width:ct.score+"%", background:ct.score>=80?"linear-gradient(90deg,#E84393,#6C5CE7)":ct.score>=60?"#A29BFE":"rgba(255,255,255,0.15)", transition:"width 1s ease" }}/>
                      </div>
                      <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:14, color:ct.score>=80?"#fff":ct.score>=60?C.scene:C.muted, minWidth:30, textAlign:"right" }}>{ct.score}%</span>
                    </div>
                  </div>
                ))}
              </Sec>

              <Sec>
                <Label>🌍 전체 16유형 분포</Label>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {allTypes.map(([k,t]) => (
                    <div key={k} style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ fontSize:14, width:22, textAlign:"center" }}>{t.emoji}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                          <span style={{ fontSize:10, color:k===myCode?"#fff":C.muted, fontWeight:k===myCode?700:400 }}>{t.name}</span>
                          <span style={{ fontSize:10, color:k===myCode?t.color:C.dim }}>{t.pop}%</span>
                        </div>
                        <div style={{ height:3, background:"rgba(255,255,255,0.03)", borderRadius:2, overflow:"hidden" }}>
                          <div style={{ height:"100%", borderRadius:2, width:(t.pop*12)+"%", background:k===myCode?t.color:"rgba(255,255,255,0.08)", transition:"width 1s ease" }}/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Sec>
            </>)}

            <button onClick={reset} style={{ padding:"16px", border:"none", borderRadius:14, width:"100%", background:"linear-gradient(135deg,#E84393,#6C5CE7)", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", textAlign:"center", marginTop:8 }}>다시 테스트하기</button>
          </>)}

          <p style={{ textAlign:"center", fontSize:8.5, color:"#12101E", marginTop:24, paddingBottom:20, lineHeight:1.5 }}>이 서비스는 사람을 연결하지 않습니다 · 코드 교환은 외부에서 자율적으로 이루어집니다</p>
        </>)}

      </div>
    </div>
  );
}