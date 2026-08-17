import React from "react";
import { Copy, Check, Image as ImageIcon, Video } from "lucide-react";
import { IMAGE_MODELS, VIDEO_MODELS } from "./data";
import { Field, selectStyle, ghostBtn } from "./Deco";

export default function ResultScreen({
  result, style, scenes, imageModel, setImageModel, videoModel, setVideoModel,
  genState, onGenerateVisual, copied, onCopy, onNewStory,
}) {
  return (
    <div className="fade-up" style={{ padding: "22px 20px" }}>
      <p style={{ fontSize: 11, letterSpacing: 1.5, color: "#9CA3B5", textTransform: "uppercase", margin: "0 0 6px" }}>
        Récit religieux · {style}
      </p>
      <h2 className="display" style={{ fontSize: 25, margin: "0 0 14px", color: "#E8C97A" }}>
        {result.titre.replace(/^["«]|["»]$/g, "")}
      </h2>

      <div style={{ background: "#11172A", border: "1px solid rgba(201,162,75,0.25)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 10.5, color: "#E8C97A", letterSpacing: 1, marginBottom: 6 }}>ACCROCHE (0–3 SEC)</div>
        <p style={{ fontSize: 14.5, fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>{result.accroche}</p>
      </div>

      <div style={{ fontSize: 10.5, color: "#9CA3B5", letterSpacing: 1, margin: "0 0 8px" }}>STORYBOARD</div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6, marginBottom: 18 }}>
        {scenes.map((sc, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0, width: 140, height: 190, borderRadius: 12,
              background: `linear-gradient(160deg, hsl(${(i * 47) % 360}, 30%, 18%), #0A0E17)`,
              border: "1px solid rgba(201,162,75,0.2)", padding: 10,
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 10, color: "#E8C97A" }}>SCÈNE {i + 1}</div>
            <p style={{ fontSize: 10.5, color: "#D9D4C6", lineHeight: 1.4, margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 6, WebkitBoxOrient: "vertical" }}>
              {sc}
            </p>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 10.5, color: "#9CA3B5", letterSpacing: 1, marginBottom: 8 }}>RÉCIT COMPLET</div>
      <div style={{ background: "#11172A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
        {result.histoire.split(/\n+/).filter(Boolean).map((p, i) => (
          <p key={i} style={{ fontSize: 13.5, lineHeight: 1.7, color: "#D9D4C6", margin: "0 0 10px" }}>
            {p}
          </p>
        ))}
      </div>

      <div style={{ background: "rgba(201,162,75,0.08)", border: "1px solid rgba(201,162,75,0.3)", borderRadius: 14, padding: 16, marginBottom: 20 }}>
        <div style={{ fontSize: 10.5, color: "#E8C97A", letterSpacing: 1, marginBottom: 6 }}>MORALE FINALE</div>
        <p style={{ fontSize: 14, margin: 0, color: "#F3EFE4" }}>{result.morale}</p>
      </div>

      <div style={{ fontSize: 10.5, color: "#9CA3B5", letterSpacing: 1, margin: "4px 0 8px" }}>
        GÉNÉRER LES VISUELS
      </div>
      <div style={{ background: "#11172A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 16, marginBottom: 20 }}>
        <Field label="Modèle image">
          <select value={imageModel} onChange={(e) => setImageModel(e.target.value)} style={selectStyle}>
            {IMAGE_MODELS.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </Field>
        <button onClick={() => onGenerateVisual("image")} style={{ ...ghostBtn, marginTop: 10 }}>
          <ImageIcon size={14} /> Générer les images clés
        </button>

        <div style={{ height: 16 }} />

        <Field label="Modèle vidéo">
          <select value={videoModel} onChange={(e) => setVideoModel(e.target.value)} style={selectStyle}>
            {VIDEO_MODELS.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </Field>
        <button onClick={() => onGenerateVisual("video")} style={{ ...ghostBtn, marginTop: 10 }}>
          <Video size={14} /> Générer la vidéo
        </button>

        {genState.note && (
          <p style={{ fontSize: 11.5, color: "#9CA3B5", lineHeight: 1.6, marginTop: 12, marginBottom: 0 }}>
            {genState.note}
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onCopy}
          style={{
            flex: 1, padding: "13px 0", borderRadius: 12, border: "1px solid rgba(201,162,75,0.4)",
            background: "transparent", color: "#E8C97A", fontWeight: 600, fontSize: 13.5,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copié" : "Copier le script"}
        </button>
        <button
          onClick={onNewStory}
          style={{
            flex: 1, padding: "13px 0", borderRadius: 12, border: "none",
            background: "linear-gradient(90deg, #C9A24B, #E8C97A)", color: "#0A0E17",
            fontWeight: 700, fontSize: 13.5, cursor: "pointer",
          }}
        >
          Nouveau récit
        </button>
      </div>
    </div>
  );
}
