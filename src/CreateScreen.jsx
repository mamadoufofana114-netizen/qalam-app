import React from "react";
import { Wand2 } from "lucide-react";
import { THEMES, STYLES, VOICES } from "./data";
import { EightStar } from "./Deco";
import { Field, selectStyle } from "./Deco";

export default function CreateScreen({
  prompt, setPrompt, style, setStyle, voice, setVoice,
  duration, setDuration, error, loading, onGenerate,
}) {
  return (
    <div className="fade-up" style={{ padding: "22px 20px" }}>
      <h2 className="display" style={{ fontSize: 24, margin: "2px 0 4px", color: "#F3EFE4" }}>
        Récit Religieux
      </h2>
      <p style={{ fontSize: 12.5, color: "#9CA3B5", margin: "0 0 16px" }}>
        Décris ton idée, ou pars d'un thème.
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {THEMES.map((t) => (
          <button
            key={t.label}
            onClick={() => setPrompt(t.seed)}
            style={{
              fontSize: 12.5, padding: "7px 13px", borderRadius: 20,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,162,75,0.3)",
              color: "#E8C97A", cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ex: Un commerçant refuse d'aider un vieil homme au marché..."
        rows={5}
        style={{
          width: "100%", background: "#11172A", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12, padding: 14, fontSize: 14, color: "#F3EFE4",
          resize: "none", boxSizing: "border-box", outline: "none",
        }}
      />

      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12, color: "#9CA3B5", marginBottom: 8, textTransform: "uppercase" }}>
          Style visuel
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {STYLES.map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              style={{
                flexShrink: 0, fontSize: 12.5, padding: "8px 14px", borderRadius: 10,
                background: style === s ? "rgba(201,162,75,0.15)" : "#11172A",
                border: `1px solid ${style === s ? "#C9A24B" : "rgba(255,255,255,0.1)"}`,
                color: style === s ? "#E8C97A" : "#9CA3B5", cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label="Durée cible">
          <select value={duration} onChange={(e) => setDuration(e.target.value)} style={selectStyle}>
            <option>30 sec</option>
            <option>1 min</option>
            <option>1 min 30</option>
          </select>
        </Field>
        <Field label="Voix off">
          <select value={voice} onChange={(e) => setVoice(e.target.value)} style={selectStyle}>
            {VOICES.map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
      </div>

      {error && <p style={{ color: "#E8898A", fontSize: 12.5, marginTop: 14 }}>{error}</p>}

      <button
        onClick={onGenerate}
        disabled={loading}
        style={{
          marginTop: 22, width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
          background: loading ? "#5C6272" : "linear-gradient(90deg, #C9A24B, #E8C97A)",
          color: "#0A0E17", fontWeight: 700, fontSize: 14.5,
          cursor: loading ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
      >
        {loading ? (
          <>
            <EightStar size={16} spin className="text-[#0A0E17]" /> Écriture en cours…
          </>
        ) : (
          <>
            <Wand2 size={16} /> Générer le récit
          </>
        )}
      </button>
    </div>
  );
                 }
