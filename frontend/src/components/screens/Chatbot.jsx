// src/components/screens/Chatbot.jsx
//
// Real chat, backed by chatbot-service (port 8085), which forwards
// messages to a LOCAL Ollama server (https://ollama.com) running on
// your machine - no cloud AI service involved. Requires Ollama to
// actually be running ("ollama serve") with a model pulled - see
// backend/chatbot-service/src/main/resources/application.properties
// for which model it expects.
//
// The sidebar stats are real too: donors see their own donation count
// (from donation-service), staff see live low-stock groups (from
// inventory-service) - same data the Donor Profile / Inventory screens use.
import { useState, useRef, useEffect } from "react";
import { C } from "../../tokens";
import { Card } from "../shared/UI";
import { sendChatMessage, listMyDonations, listInventory, getToken, getStoredUser } from "../../api";

const roleLabels = {
  HOSPITAL_ADMIN: "hospital admin mode",
  BLOOD_BANK_OFFICER: "blood bank officer mode",
  DHO: "DHO mode",
  DONOR: "donor mode",
};

const quickStaff = ["What blood groups are below threshold right now?", "How do I add a new employee?", "What can this app track for donations?"];
const quickDonor = ["When can I donate again?", "How do I log a donation?", "Where can I find my certificate?"];

export default function Chatbot({ role }) {
  const token = getToken();
  const currentUser = getStoredUser();
  const isDonor = currentUser?.role === "DONOR";

  const [messages, setMessages] = useState([]); // [{role: "user"|"assistant", content}]
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const [sidebarStats, setSidebarStats] = useState([]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Load real sidebar data once - donor: their own donation count; staff:
  // which blood groups are currently below their minimum threshold.
  useEffect(() => {
    if (!token) return;
    if (isDonor) {
      listMyDonations(token)
        .then(donations => setSidebarStats([
          { label: "Blood group", val: donations[0]?.bloodGroup || "—", col: C.red700 },
          { label: "Total donations", val: String(donations.length), col: C.green },
          { label: "Last donated", val: donations[0]?.donationDate || "None yet", col: C.blue },
        ]))
        .catch(() => setSidebarStats([]));
    } else {
      listInventory(token)
        .then(rows => {
          const below = rows.filter(r => r.units < r.minimumThreshold);
          setSidebarStats([
            { label: "Blood groups tracked", val: String(rows.length), col: C.blue },
            { label: "Below threshold", val: String(below.length), col: C.red700 },
            { label: "Needs attention", val: below.map(r => r.bloodGroup).join(", ") || "None", col: C.amber },
          ]);
        })
        .catch(() => setSidebarStats([]));
    }
  }, [token, isDonor]);

  async function send(text) {
    const content = (text || input).trim();
    if (!content || sending) return;

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setSending(true);
    try {
      const reply = await sendChatMessage(token, nextMessages);
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err.message || "Could not reach the chatbot");
    } finally {
      setSending(false);
    }
  }

  const quick = isDonor ? quickDonor : quickStaff;

  return (
    <div style={{ display: "flex", gap: 14, height: "calc(100vh - 114px)", minHeight: 460 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: C.white, boxShadow: "0 1px 3px rgba(17,21,39,0.05)" }}>
        {/* Header */}
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.red700, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.white, flexShrink: 0 }}>AI</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>HemoAI Assistant</div>
            <div style={{ fontSize: 10, color: C.gray }}>
              Runs on your local Ollama · {roleLabels[currentUser?.role] || "general mode"}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.length === 0 && (
            <div style={{ fontSize: 12, color: C.gray, textAlign: "center", marginTop: 20 }}>
              Ask a question to get started. Make sure Ollama is running locally (<code>ollama serve</code>).
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              {m.role !== "user" && <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.fog, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: C.slate, flexShrink: 0, marginRight: 7, alignSelf: "flex-start" }}>AI</div>}
              <div style={{
                maxWidth: "74%", padding: "9px 13px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                background: m.role === "user" ? C.red700 : C.fog,
                border: m.role === "user" ? "none" : `1px solid ${C.border}`,
                fontSize: 12.5, color: m.role === "user" ? C.white : C.navy, lineHeight: 1.55, whiteSpace: "pre-wrap",
              }}>{m.content}</div>
            </div>
          ))}
          {sending && (
            <div style={{ fontSize: 11.5, color: C.gray, fontStyle: "italic" }}>Thinking…</div>
          )}
          {error && (
            <div style={{ fontSize: 11.5, color: C.red700, background: C.red50, borderRadius: 7, padding: "8px 12px" }}>{error}</div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "11px 14px", display: "flex", gap: 8, background: C.white }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder={isDonor ? "Ask about your donations..." : "Ask about stock, staff, alerts..."}
            style={{ flex: 1, height: 40, borderRadius: 8, border: `1px solid ${C.border}`, background: C.fog, padding: "0 13px", fontSize: 12.5, color: C.navy, outline: "none" }}
            onFocus={e => e.target.style.borderColor = C.blue}
            onBlur={e => e.target.style.borderColor = C.border}
          />
          <button onClick={() => send()} disabled={sending} style={{ height: 40, padding: "0 18px", background: C.red700, color: C.white, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: sending ? "default" : "pointer", opacity: sending ? 0.7 : 1 }}>
            {sending ? "…" : "Send"}
          </button>
        </div>
      </div>

      {/* Context sidebar */}
      <div style={{ width: 240, display: "flex", flexDirection: "column", gap: 12 }}>
        <Card style={{ padding: "16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>{isDonor ? "Your stats" : "At a glance"}</div>
          {sidebarStats.length === 0 ? (
            <div style={{ fontSize: 11, color: C.gray }}>Loading…</div>
          ) : sidebarStats.map((c, i) => (
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
