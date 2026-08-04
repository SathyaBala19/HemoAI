// src/tokens.js
// A single place to define every color used across the app ("design
// tokens"). Instead of typing a hex code everywhere, components import
// C and use C.red700, C.navy, etc. If we ever want to re-theme the app,
// we only have to change the values here.
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

// Turns a status word (like "Safe" or "Critical") into a text color, so
// every screen shows statuses with the same colors instead of each
// screen picking its own.
export function statusColor(val) {
  if (["Safe","Active","Sufficient","Completed"].includes(val)) return C.green;
  if (["Critical","Inactive","Rejected"].includes(val)) return C.red700;
  if (["Low","Moderate","Pending"].includes(val)) return C.amber;
  return C.slate;
}

// Same idea as statusColor(), but returns a light background color to
// use behind a status badge/pill.
export function statusBg(val) {
  if (["Safe","Active","Sufficient","Completed"].includes(val)) return C.green50;
  if (["Critical","Inactive","Rejected"].includes(val)) return C.red50;
  if (["Low","Moderate","Pending"].includes(val)) return C.amber50;
  return C.fog;
}
