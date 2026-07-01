import { C, statusColor, statusBg } from "../../tokens";

// Sparklines: each card gets different bar patterns so they don't look cloned
const sparkSets = [
  [28,44,36,58,42,61,55],
  [50,38,62,44,70,54,68],
  [60,48,52,38,44,56,40],
  [32,56,44,60,36,64,48],
];

export function KPICard({ label, value, change, changeUp, accent, spark = 0 }) {
  accent = accent || C.red700;
  const bars = sparkSets[spark % sparkSets.length];
  const max = Math.max(...bars);
  return (
    <div style={{
      background: C.white,
      borderRadius: spark % 2 === 0 ? 14 : 12, // slight variation
      border: `1px solid ${C.border}`,
      boxShadow: "0 1px 3px rgba(17,21,39,0.06), 0 4px 12px rgba(17,21,39,0.07)",
      flex: 1, minWidth: 170, overflow: "hidden",
    }}>
      <div style={{ height: 3, background: accent }} />
      <div style={{ padding: "15px 18px 14px" }}>
        <div style={{ fontSize: 10.5, color: C.gray, marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: C.navy, lineHeight: 1, letterSpacing: "-0.5px" }}>{value}</div>
        <div style={{ fontSize: 11, color: changeUp ? C.green : C.red700, marginTop: 9, fontWeight: 500 }}>{change}</div>
        {/* sparkline */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, marginTop: 12, height: 28 }}>
          {bars.map((h, i) => (
            <div key={i} style={{
              flex: 1, height: Math.round((h / max) * 28),
              background: accent,
              opacity: i === bars.length - 1 ? 0.55 : 0.15 + (i * 0.04),
              borderRadius: "2px 2px 0 0",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function BloodBadge({ group, units, pct, status }) {
  const ac = status === "safe" ? C.green : status === "low" ? C.red700 : C.amber;
  const bg = status === "safe" ? C.green50 : status === "low" ? C.red50 : C.amber50;
  const label = status === "safe" ? "Adequate" : status === "low" ? "Critical" : "Running low";
  return (
    <div style={{
      background: C.white, borderRadius: 12,
      border: `1px solid ${C.border}`,
      boxShadow: "0 1px 4px rgba(17,21,39,0.08)",
      overflow: "hidden", width: 144,
    }}>
      <div style={{ height: 3, background: ac }} />
      <div style={{ padding: "11px 14px 13px" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: ac, letterSpacing: "-0.5px" }}>{group}</div>
        <div style={{ fontSize: 11, color: C.slate, marginTop: 1 }}>{units} units</div>
        <div style={{ height: 5, background: C.fog, borderRadius: 3, margin: "9px 0 7px" }}>
          <div style={{ height: 5, width: `${Math.max(3, pct)}%`, background: ac, borderRadius: 3 }} />
        </div>
        <span style={{ fontSize: 9, fontWeight: 600, color: ac, background: bg, borderRadius: 6, padding: "2px 7px" }}>
          {label}
        </span>
      </div>
    </div>
  );
}

export function AlertRow({ type, title, desc, time }) {
  const ac = type === "critical" ? C.red700 : type === "resolved" ? C.green : C.amber;
  const bg = type === "critical" ? "#FEF2F2" : type === "resolved" ? "#F0FDF8" : "#FFFBEB";
  const typeLabel = type === "critical" ? "Critical" : type === "resolved" ? "Resolved" : "Warning";
  return (
    <div style={{
      background: bg,
      border: `1px solid ${ac}30`,
      borderLeft: `3px solid ${ac}`,
      borderRadius: "0 10px 10px 0",
      padding: "11px 14px",
      marginBottom: 7,
      display: "flex", gap: 12, alignItems: "flex-start",
    }}>
      <div style={{ paddingTop: 1 }}>
        <span style={{
          fontSize: 9, fontWeight: 700, color: ac,
          background: `${ac}18`, borderRadius: 5,
          padding: "2px 7px", display: "block", whiteSpace: "nowrap",
        }}>{typeLabel}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, lineHeight: 1.3 }}>{title}</div>
        <div style={{ fontSize: 11, color: C.gray, marginTop: 3, lineHeight: 1.4 }}>{desc}</div>
      </div>
      <span style={{ fontSize: 10, color: C.gray, whiteSpace: "nowrap", paddingTop: 2, flexShrink: 0 }}>{time}</span>
    </div>
  );
}

export function DataTable({ headers, rows, statusColIndex }) {
  return (
    <div style={{ overflowX: "auto", marginTop: 2 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                textAlign: "left", padding: "8px 13px",
                fontSize: 10.5, fontWeight: 600, color: C.gray,
                background: C.warmgray,
                borderBottom: `1px solid ${C.border}`,
                textTransform: "uppercase", letterSpacing: "0.05em",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const pillIdx = statusColIndex !== undefined ? statusColIndex : row.length - 1;
            return (
              <tr key={ri} style={{ borderBottom: `1px solid ${C.border}80` }}>
                {row.map((cell, ci) => {
                  if (ci === pillIdx) {
                    const col = statusColor(cell);
                    const sbg = statusBg(cell);
                    return (
                      <td key={ci} style={{ padding: "9px 13px" }}>
                        <span style={{ fontSize: 10.5, fontWeight: 600, color: col, background: sbg, borderRadius: 5, padding: "2px 9px" }}>{cell}</span>
                      </td>
                    );
                  }
                  return (
                    <td key={ci} style={{ padding: "9px 13px", color: ci === 0 ? C.navy : C.slate, fontWeight: ci === 0 ? 500 : 400 }}>{cell}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function BarChart({ values, labels, color, height = 150 }) {
  color = color || C.red700;
  const max = Math.max(...values);
  // intentionally unequal gap widths to feel human
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: height + 22, paddingTop: 4 }}>
      {values.map((v, i) => {
        const h = Math.max(6, Math.round((v / max) * height));
        const isLast = i === values.length - 1;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
              width: "100%", height: h, borderRadius: "3px 3px 0 0",
              background: isLast ? color : `${color}`,
              opacity: isLast ? 0.9 : 0.35 + (i * 0.08),
            }} />
            {labels && <span style={{ fontSize: 10, color: C.gray }}>{labels[i]}</span>}
          </div>
        );
      })}
    </div>
  );
}

export function LineChart({ values, labels, color, height = 160 }) {
  color = color || C.red700;
  const W = 500, H = height;
  const max = Math.max(...values), min = Math.min(...values);
  const range = max - min || 1;
  const px = 20, py = 14;
  const iw = W - px * 2, ih = H - py * 2 - 22;
  const pts = values.map((v, i) => ({
    x: px + (i / (values.length - 1)) * iw,
    y: py + (1 - (v - min) / range) * ih,
  }));
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  // area fill
  const areaPath = `M${pts[0].x},${H - 22} ` + pts.map(p => `L${p.x},${p.y}`).join(" ") + ` L${pts[pts.length-1].x},${H - 22} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H + 8}`} style={{ width: "100%", display: "block" }}>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[1,2,3].map(i => {
        const gy = py + (i / 4) * ih;
        return <line key={i} x1={px} y1={gy} x2={W-px} y2={gy} stroke={C.border} strokeWidth={1}/>;
      })}
      <path d={areaPath} fill="url(#lg)" />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round"/>
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill={C.white} stroke={color} strokeWidth={1.8}/>
        </g>
      ))}
      {labels && labels.map((l, i) => (
        <text key={i} x={pts[i].x} y={H + 6} textAnchor="middle" fontSize={10} fill={C.gray}>{l}</text>
      ))}
    </svg>
  );
}

export function Card({ children, accent, style = {} }) {
  return (
    <div style={{
      background: C.white,
      borderRadius: 12,
      border: `1px solid ${C.border}`,
      boxShadow: "0 1px 3px rgba(17,21,39,0.05), 0 4px 10px rgba(17,21,39,0.06)",
      overflow: "hidden",
      ...style,
    }}>
      {accent && <div style={{ height: 3, background: accent }} />}
      {children}
    </div>
  );
}

export function SectionTitle({ children, sub, action, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 13 }}>
      <div>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{children}</span>
        {sub && <span style={{ fontSize: 11, color: C.gray, marginLeft: 7 }}>{sub}</span>}
      </div>
      {action && (
        <span onClick={onAction} style={{ fontSize: 11, fontWeight: 500, color: C.blue, cursor: onAction ? "pointer" : "default", textDecoration: "underline", textUnderlineOffset: 2 }}>
          {action}
        </span>
      )}
    </div>
  );
}

export function Field({ label, placeholder, hint }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.slate, marginBottom: 4 }}>{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        style={{
          width: "100%", height: 38, borderRadius: 7,
          border: `1px solid ${C.border}`,
          background: C.white, padding: "0 12px", fontSize: 12.5, color: C.navy,
          outline: "none", boxSizing: "border-box",
          transition: "border-color 0.15s",
        }}
        onFocus={e => e.target.style.borderColor = C.blue}
        onBlur={e => e.target.style.borderColor = C.border}
      />
      {hint && <div style={{ fontSize: 10, color: C.gray, marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

export function StatusPill({ value }) {
  return (
    <span style={{ fontSize: 10.5, fontWeight: 600, color: statusColor(value), background: statusBg(value), borderRadius: 5, padding: "2px 9px" }}>
      {value}
    </span>
  );
}
