export const C = {
  bg: "#050510",
  scene: "#C8C4D8",
  prompt: "#FFFFFF",
  choice: "#DBD7EA",
  choiceBg: "rgba(255,255,255,0.03)",
  choiceHover: "rgba(255,255,255,0.07)",
  choiceBorder: "rgba(255,255,255,0.06)",
  choiceBorderHover: "rgba(232,67,147,0.25)",
  muted: "#7B7590",
  dim: "#4A4460",
  accent: "#E84393",
  accent2: "#6C5CE7",
};

export const PH_SPLASH = {
  warm: "솔직해져도 괜찮아요.\n여기선 아무도 몰라요. 😌",
  core: "지금부터는 좀 달라요.\n머리가 아니라 몸한테 물어보세요. 😏",
  deep: "여기까지 온 거,\n이미 답 알고 있는 거예요.\n근데 진짜는 지금부터예요. 🔥",
  last: "마지막 하나.\n이거 끝나면 당신의 본색이 나와요. 🖤",
};

export const CAT = {
  ID: { name: "불꽃형", emoji: "🔥", desc: "사랑하는 사람을 내 방식으로" },
  IS: { name: "물결형", emoji: "🌊", desc: "사랑하는 사람에게 맡기는" },
  ED: { name: "폭풍형", emoji: "⛓️", desc: "금기를 내가 이끄는" },
  ES: { name: "안개형", emoji: "🦋", desc: "금기 속에서 빠져드는" },
};

export function getCat(code) {
  return CAT[code.slice(0, 2)] || CAT.ID;
}

export const AXIS_META = [
  { l: "친밀", r: "탐험", max: 5 },
  { l: "주도", r: "수용", max: 5 },
  { l: "신체", r: "감정", max: 5 },
  { l: "집중", r: "확산", max: 5 },
];