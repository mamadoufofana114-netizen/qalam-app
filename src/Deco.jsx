import React from "react";

const STAR_PATH = "M50 4 L61 35 L94 35 L67 55 L78 88 L50 68 L22 88 L33 55 L6 35 L39 35 Z";

export function EightStar({ size = 22, className = "", spin = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={spin ? { animation: "spin-slow 6s linear infinite" } : undefined}
    >
      <path d={STAR_PATH} fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

export function LatticeDivider() {
  return (
    <svg width="100%" height="14" viewBox="0 0 400 14" preserveAspectRatio="none" className="opacity-30">
      <polyline
        points="0,7 14,1 28,13 42,1 56,13 70,1 84,13 98,1 112,13 126,1 140,13 154,1 168,13 182,1 196,13 210,1 224,13 238,1 252,13 266,1 280,13 294,1 308,13 322,1 336,13 350,1 364,13 378,1 400,7"
        fill="none"
        stroke="#C9A24B"
        strokeWidth="1"
      />
    </svg>
  );
}

export function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11.5, color: "#9CA3B5", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

export const selectStyle = {
  width: "100%",
  background: "#11172A",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 13.5,
  color: "#F3EFE4",
  outline: "none",
};

export const ghostBtn = {
  width: "100%",
  padding: "11px 0",
  borderRadius: 10,
  border: "1px solid rgba(201,162,75,0.35)",
  background: "rgba(201,162,75,0.06)",
  color: "#E8C97A",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 7,
};
