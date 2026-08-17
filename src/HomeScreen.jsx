import React from "react";
import { Sparkles } from "lucide-react";
import { CATEGORIES } from "./data";

export default function HomeScreen({ onCategoryClick }) {
  return (
    <div className="fade-up" style={{ padding: "24px 20px" }}>
      <p className="display" style={{ fontSize: 26, lineHeight: 1.3, color: "#F3EFE4", margin: "4px 0 4px" }}>
        Des histoires qui touchent le cœur.
      </p>
      <p style={{ fontSize: 13.5, color: "#9CA3B5", margin: "0 0 22px" }}>
        Écris une idée. Qalam en fait un récit prêt pour l'écran.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryClick(cat)}
              style={{
                textAlign: "left",
                background: cat.ready ? "linear-gradient(155deg, #1D4E4A 0%, #12182A 70%)" : "#11172A",
                border: `1px solid ${cat.ready ? "rgba(201,162,75,0.4)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 14,
                padding: "16px 14px",
                cursor: "pointer",
                color: "#F3EFE4",
                position: "relative",
                opacity: cat.ready ? 1 : 0.55,
              }}
            >
              <Icon size={20} color={cat.ready ? "#E8C97A" : "#9CA3B5"} />
              <div style={{ marginTop: 26, fontSize: 14.5, fontWeight: 600 }}>{cat.label}</div>
              {!cat.ready && (
                <div style={{ position: "absolute", top: 10, right: 10, fontSize: 9, color: "#9CA3B5", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "2px 7px" }}>
                  BIENTÔT
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 30, padding: 16, borderRadius: 14, background: "rgba(201,162,75,0.06)", border: "1px solid rgba(201,162,75,0.2)" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
          <Sparkles size={15} color="#E8C97A" />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#E8C97A" }}>Comment ça marche</span>
        </div>
        <p style={{ fontSize: 12.5, color: "#9CA3B5", lineHeight: 1.6, margin: 0 }}>
          Qalam rédige un scénario complet — accroche, récit, morale — prêt à filmer ou animer.
        </p>
      </div>
    </div>
  );
}
