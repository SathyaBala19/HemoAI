// src/components/shared/Pagination.jsx
import { C } from "../../tokens";

/**
 * Reusable pagination bar.
 * Props:
 *  - page: current page (1-indexed)
 *  - totalItems: total row count
 *  - pageSize: rows per page
 *  - onPageChange: (newPage) => void
 */
export default function Pagination({ page, totalItems, pageSize, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  function go(p) {
    if (p < 1 || p > totalPages || p === page) return;
    onPageChange(p);
  }

  // Build a compact page list: 1 ... p-1 p p+1 ... totalPages
  function pageList() {
    const pages = [];
    const add = p => { if (!pages.includes(p)) pages.push(p); };

    add(1);
    for (let p = page - 1; p <= page + 1; p++) if (p > 1 && p < totalPages) add(p);
    if (totalPages > 1) add(totalPages);

    const withGaps = [];
    let prev = 0;
    for (const p of pages.sort((a, b) => a - b)) {
      if (prev && p - prev > 1) withGaps.push("...");
      withGaps.push(p);
      prev = p;
    }
    return withGaps;
  }

  const btnBase = {
    minWidth: 28, height: 28, borderRadius: 7, border: `1px solid ${C.border}`,
    background: C.white, color: C.slate, fontSize: 12, fontWeight: 600,
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    padding: "0 8px",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 4px", flexWrap: "wrap", gap: 10 }}>
      <div style={{ fontSize: 11.5, color: C.gray }}>
        Showing <strong style={{ color: C.navy }}>{start}–{end}</strong> of <strong style={{ color: C.navy }}>{totalItems}</strong>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button
          onClick={() => go(page - 1)}
          disabled={page === 1}
          style={{ ...btnBase, opacity: page === 1 ? 0.4 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}
        >
          ←
        </button>

        {pageList().map((p, i) =>
          p === "..." ? (
            <span key={`gap-${i}`} style={{ color: C.gray, fontSize: 12, padding: "0 4px" }}>…</span>
          ) : (
            <button
              key={p}
              onClick={() => go(p)}
              style={{
                ...btnBase,
                background: p === page ? C.red700 : C.white,
                color: p === page ? C.white : C.slate,
                border: `1px solid ${p === page ? C.red700 : C.border}`,
              }}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => go(page + 1)}
          disabled={page === totalPages}
          style={{ ...btnBase, opacity: page === totalPages ? 0.4 : 1, cursor: page === totalPages ? "not-allowed" : "pointer" }}
        >
          →
        </button>
      </div>
    </div>
  );
}