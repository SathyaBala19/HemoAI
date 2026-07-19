export const C = {
  red700:  "#BE0018",
  red500:  "#EC2D3A",
  red100:  "#FDECED",
  red50:   "#FFF4F5",
  navy:    "#111527",
  navy2:   "#191E30",
  navy3:   "#21273D",
  slate:   "#3C4368",
  gray:    "#868CA0",
  silver:  "#DEE1EB",
  fog:     "#F1F2F6",
  white:   "#FFFFFF",
  green:   "#0DAF76",
  green50: "#EAFAF3",
  amber:   "#E89F00",
  amber50: "#FFF9E6",
  blue:    "#3479F0",
  blue50:  "#EEF4FF",
  iceblue: "#E6F3FD",
  // a few intentionally "human-chosen" utility tones
  warmgray: "#F7F6F3",
  border:   "#E3E5EF",
};

export function statusColor(val) {
  if (["Safe","Active","Sufficient","Completed"].includes(val)) return C.green;
  if (["Critical","Inactive","Rejected"].includes(val)) return C.red700;
  if (["Low","Moderate","Pending"].includes(val)) return C.amber;
  return C.slate;
}

export function statusBg(val) {
  if (["Safe","Active","Sufficient","Completed"].includes(val)) return C.green50;
  if (["Critical","Inactive","Rejected"].includes(val)) return C.red50;
  if (["Low","Moderate","Pending"].includes(val)) return C.amber50;
  return C.fog;
}
