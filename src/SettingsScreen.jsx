import React from "react";
import { ExternalLink, AlertTriangle } from "lucide-react";
import { KEY_LINKS } from "./data";

export default function SettingsScreen() {
  return (
    <div className="fade-up" style={{ padding: "22px 20px" }}>
      <h2 className="display" style={{ fontSize: 24, margin: "2px 0 4px" }}>Paramètres API</h2>
      <p style={{ fontSize: 12.5, color: "#9CA3B5", margin: "0 0 18px", lineHeight: 1.6 }}>
        Les clés vivent dans les variables d'environnement de ton projet Vercel
        (REPLICATE_API_TOKEN, ELEVENLABS_API_KEY), invisibles depuis le navigateur.
      </p>

      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "rgba(201,162,75,0.08)", border: "1px solid rgba(201,162,75,0.3)", borderRadius: 12, padding: 13, marginBottom: 20 }}>
        <AlertTriangle size={15} color="#E8C97A" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: "#E8C97A", margin: 0, lineHeight: 1.6 }}>
          Suis le guide DEPLOIEMENT.md fourni avec le projet pour ajouter tes clés dans Vercel.
        </p>
      </div>

      <div style={{ marginTop: 6, fontSize: 10.5, color: "#9CA3B5", letterSpacing: 1, marginBottom: 10 }}>
        CRÉER UNE CLÉ
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {KEY_LINKS.map((k) => (
          <a
            key={k.name}
            href={k.url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#11172A",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "12px 14px",
              textDecoration: "none",
              color: "#F3EFE4",
            }}
          >
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{k.name}</div>
              <div style={{ fontSize: 11, color: "#9CA3B5", marginTop: 2 }}>{k.unlocks}</div>
            </div>
            <ExternalLink size={15} color="#E8C97A" style={{ flexShrink: 0, marginLeft: 10 }} />
          </a>
        ))}
      </div>
    </div>
  );
      }
