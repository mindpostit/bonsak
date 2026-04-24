import { T16 } from "../data/types.js";
import { AXIS_META } from "../styles/theme.js";

const W = [
  { s:30, d:5,  rev:false }, // 판타지
  { s:5,  d:30, rev:true  }, // 권력
  { s:20, d:8,  rev:false }, // 트리거
  { s:15, d:10, rev:false }, // 감각
];

export function calcCompat(a, b) {
  let raw = 0;
  for (let i = 0; i < 4; i++) {
    const same = a[i] === b[i];
    const good = W[i].rev ? !same : same;
    raw += good ? W[i].s : W[i].d;
  }
  return Math.round(Math.min(95, Math.max(25, (raw - 28) / (95 - 28) * 70 + 25)));
}

export function getBestMatch(code) {
  const all = Object.keys(T16);
  let bk = all[0], bs = 0;
  for (const k of all) {
    if (k === code) continue;
    const s = calcCompat(code, k);
    if (s > bs) { bs = s; bk = k; }
  }
  return bk;
}

export function getCode(sc) {
  return [
    sc[0] >= AXIS_META[0].max / 2 ? "E" : "I",
    sc[1] >= AXIS_META[1].max / 2 ? "S" : "D",
    sc[2] >= AXIS_META[2].max / 2 ? "M" : "P",
    sc[3] >= AXIS_META[3].max / 2 ? "W" : "N",
  ].join("");
}

export function findType(code) {
  if (T16[code]) return { code, ...T16[code], match: getBestMatch(code) };
  let bk = "ISMW", bs = -1;
  for (const k of Object.keys(T16)) {
    let s = 0;
    for (let i = 0; i < 4; i++) if (code[i] === k[i]) s++;
    if (s > bs) { bs = s; bk = k; }
  }
  return { code, ...T16[bk], match: getBestMatch(code) };
}

export function isValidCode(c) {
  return c.length === 4 &&
    "IE".includes(c[0]) &&
    "DS".includes(c[1]) &&
    "PM".includes(c[2]) &&
    "NW".includes(c[3]);
}

export function getAxisInsight(a, b) {
  const labels = ["판타지 성향", "권력 역학", "흥분 트리거", "감각 범위"];
  const rules = [
    [["I","I","둘 다 친밀함을 원합니다."],["I","E","한 쪽은 안정, 한 쪽은 모험."],["E","I","한 쪽은 모험, 한 쪽은 안정."],["E","E","둘 다 새로운 것을 원합니다."]],
    [["D","S","주도-수용이 자연스럽게 맞습니다."],["S","D","주도-수용이 자연스럽게 맞습니다."],["D","D","둘 다 주도하려 합니다. 순서를 정하면 불꽃."],["S","S","둘 다 맡기려 합니다. 누군가 먼저 시작해야 해요."]],
    [["P","P","둘 다 몸에서 시작됩니다."],["M","M","둘 다 감정이 먼저. 대화가 최고의 전희."],["P","M","시작점이 다릅니다. 한 쪽이 기다려줘야 해요."],["M","P","시작점이 다릅니다. 한 쪽이 기다려줘야 해요."]],
    [["N","N","둘 다 한 곳에 집중. 깊이가 엄청납니다."],["W","W","둘 다 온몸. 끝없이 탐색하는 밤."],["N","W","한 쪽은 깊이, 한 쪽은 넓이. 조율하면 완벽."],["W","N","한 쪽은 깊이, 한 쪽은 넓이. 조율하면 완벽."]],
  ];
  return rules.map((rule, i) => {
    const f = rule.find(([x, y]) => x === a[i] && y === b[i]);
    if (!f) return null;
    const good = i === 1 ? a[i] !== b[i] : a[i] === b[i];
    return { axis: labels[i], text: f[2], status: good ? "match" : i === 1 ? "tension" : "adjust" };
  }).filter(Boolean);
}