import { useState, useRef, useEffect } from "react";
import { C } from "../../tokens";
import { Card } from "../shared/UI";

const systemCtx = {
  "Hospital Admin":     "a hospital admin managing blood inventory, staff, and requests",
  "Blood Bank Officer": "a blood bank officer handling requests and stock",
  "DHO":                "a district health officer overseeing regional supply",
  "Donor":              "a blood donor",
};

const initMsgs = {
  admin: [
    { text: "Hi! I can help with stock queries, donor matching, and demand forecasts. What do you need?", user: false },
    { text: "What's the current O− stock?", user: true },
    { text: "O− is at 12 units — that's critical. Today's predicted demand is 9 units, so you have roughly 1.3 days of cover. I'd recommend sending donor alerts now. Want me to trigger SMS to the 4 eligible donors within 5 km?", user: false },
    { text: "Yes, go ahead.", user: true },
    { text: "Done. SMS sent to Arjun Kumar, Meena Devi, Priya Sharma, and one more. Estimated first response in ~18 minutes. I'll let you know when someone confirms.", user: false },
  ],
  donor: [
    { text: "Hi Arjun! I can help you track donations, check eligibility, or find nearby donation camps. What's up?", user: false },
    { text: "When can I donate next?", user: true },
    { text: "Your last donation was June 14, 2026. You need 90 days between whole blood donations, so you're eligible again from September 12, 2026 — that's about 76 days away. Want me to set a reminder?", user: false },
  ],
};

const quickAdmin = ["Check O− stock", "Find donors within 5 km", "What's today's forecast?", "Any critical alerts?"];
const quickDonor = ["When can I donate again?", "Find camps near me", "How many lives have I saved?", "Am I eligible right now?"];

const ctxAdmin = [
  { label: "Critical stocks",  val: "O−, B−, AB−", col: C.red700 },
  { label: "Open requests",    val: "7 pending",    col: C.amber },
  { label: "Donors alerted",   val: "4 today",      col: C.green },
  { label: "Weekend forecast", val: "+28% demand",  col: C.blue },
];
const ctxDonor = [
  { label: "Blood type",       val: "O+",            col: C.red700 },
  { label: "Donations",        val: "12 total",       col: C.green },
  { label: "Next eligible",    val: "Sep 12, 2026",  col: C.amber },
  { label: "Lives impacted",   val: "~48",           col: C.blue },
];

export default function Chatbot({ role }) {
  const isDonor = role === "Donor";
  const [msgs, setMsgs] = useState(isDonor ? initMsgs.donor : initMsgs.admin);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  function send(text) {
    const t = text || input;
    if (!t.trim()) return;
    setMsgs(m => [...m, { text: t, user: true }]);
    setInput("");
    setTimeout(() => {
      setMsgs(m => [...m, { text: "Connect to the HemoAI backend API to get live responses here.", user: false }]);
    }, 700);
  }

  const ctx   = isDonor ? ctxDonor  : ctxAdmin;
  const quick = isDonor ? quickDonor : quickAdmin;

  return (
    <div style={{ display: "flex", gap: 14, height: "calc(100vh - 114px)", minHeight: 460 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: C.white, boxShadow: "0 1px 3px rgba(17,21,39,0.05)" }}>
        {/* Header */}
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.red700, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.white, flexShrink: 0 }}>AI</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>HemoAI Assistant</div>
            <div style={{ fontSize: 10, color: C.green, display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.green }} />
              Online · {systemCtx[role] || "general mode"}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.user ? "flex-end" : "flex-start" }}>
              {!m.user && <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.fog, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: C.slate, flexShrink: 0, marginRight: 7, alignSelf: "flex-start" }}>AI</div>}
              <div style={{
                maxWidth: "74%", padding: "9px 13px", borderRadius: m.user ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                background: m.user ? C.red700 : C.fog,
                border: m.user ? "none" : `1px solid ${C.border}`,
                fontSize: 12.5, color: m.user ? C.white : C.navy, lineHeight: 1.55,
              }}>{m.text}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "11px 14px", display: "flex", gap: 8, background: C.white }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder={isDonor ? "Ask about your donations..." : "Ask about stock, donors, alerts..."}
            style={{ flex: 1, height: 40, borderRadius: 8, border: `1px solid ${C.border}`, background: C.fog, padding: "0 13px", fontSize: 12.5, color: C.navy, outline: "none" }}
            onFocus={e => e.target.style.borderColor = C.blue}
            onBlur={e => e.target.style.borderColor = C.border}
          />
          <button onClick={() => send()} style={{ height: 40, padding: "0 18px", background: C.red700, color: C.white, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Send</button>
        </div>
      </div>

      {/* Context sidebar */}
      <div style={{ width: 240, display: "flex", flexDirection: "column", gap: 12 }}>
        <Card style={{ padding: "16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>{isDonor ? "Your stats" : "At a glance"}</div>
          {ctx.map((c, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10.5, color: C.gray }}>{c.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: c.col, marginTop: 2 }}>{c.val}</div>
            </div>
          ))}
        </Card>

        <Card style={{ padding: "16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Try asking</div>
          {quick.map((q, i) => (
            <div key={i} onClick={() => send(q)} style={{
              padding: "8px 10px", borderRadius: 7, background: C.fog, border: `1px solid ${C.border}`,
              marginBottom: 6, fontSize: 11.5, color: C.slate, cursor: "pointer", lineHeight: 1.4,
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.blue50}
            onMouseLeave={e => e.currentTarget.style.background = C.fog}
            >{q}</div>
          ))}
        </Card>
      </div>
    </div>
  );
}
