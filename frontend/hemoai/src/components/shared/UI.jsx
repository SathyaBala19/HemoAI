export function Field({ label, placeholder, hint, name, value, onChange, type = "text", error, required }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.slate, marginBottom: 4 }}>
        {label}{required && <span style={{ color: C.red700 }}> *</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        aria-invalid={!!error}
        style={{
          width: "100%", height: 38, borderRadius: 7,
          border: `1px solid ${error ? C.red700 : C.border}`,
          background: C.white, padding: "0 12px", fontSize: 12.5, color: C.navy,
          outline: "none", boxSizing: "border-box",
          transition: "border-color 0.15s",
        }}
        onFocus={e => e.target.style.borderColor = error ? C.red700 : C.blue}
        onBlur={e => e.target.style.borderColor = error ? C.red700 : C.border}
      />
      {error ? (
        <div style={{ fontSize: 10, color: C.red700, marginTop: 3 }}>{error}</div>
      ) : hint ? (
        <div style={{ fontSize: 10, color: C.gray, marginTop: 3 }}>{hint}</div>
      ) : null}
    </div>
  );
}