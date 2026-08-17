import React, { useState, useRef } from "react";
import { ChevronLeft, Settings, X } from "lucide-react";
import { STYLES, VOICES, IMAGE_MODELS, VIDEO_MODELS } from "./data";
import { generateStory, parseStory, callGenerateImage, callGenerateVideo } from "./api";
import { EightStar, LatticeDivider } from "./Deco";
import HomeScreen from "./HomeScreen";
import SettingsScreen from "./SettingsScreen";
import CreateScreen from "./CreateScreen";
import ResultScreen from "./ResultScreen";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');`;

export default function App() {
  const [screen, setScreen] = useState("home");
  const [toast, setToast] = useState("");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(STYLES[0]);
  const [voice, setVoice] = useState(VOICES[0]);
  const [duration, setDuration] = useState("1 min");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const toastTimer = useRef(null);
  const [imageModel, setImageModel] = useState(IMAGE_MODELS[0].id);
  const [videoModel, setVideoModel] = useState(VIDEO_MODELS[0].id);
  const [genState, setGenState] = useState({ loading: false, error: "", note: "" });

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };

  const handleCategoryClick = (cat) => {
    if (!cat.ready) {
      showToast(`"${cat.label}" — bientôt disponible`);
      return;
    }
    setScreen("create");
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Décris ton idée d'histoire avant de continuer.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const raw = await generateStory(prompt, style);
      setResult(parseStory(raw));
      setScreen("result");
    } catch (e) {
      setError("La génération a échoué. Réessaie dans un instant.");
    } finally {
      setLoading(false);
    }
  };

  const copyScript = () => {
    if (!result) return;
    const full = `${result.titre}\n\n${result.accroche}\n\n${result.histoire}\n\n${result.morale}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleGenerateVisual = async (kind) => {
    setGenState({ loading: true, error: "", note: "" });
    try {
      const modelId = kind === "image" ? imageModel : videoModel;
      const call = kind === "image" ? callGenerateImage : callGenerateVideo;
      await call(modelId, result?.accroche || prompt);
      setGenState({ loading: false, error: "", note: "Génération lancée avec succès." });
    } catch (e) {
      setGenState({
        loading: false,
        error: "",
        note: `Échec : ${e.message}. Vérifie que REPLICATE_API_TOKEN est bien configuré dans Vercel.`,
      });
    }
  };

  const scenes = result
    ? result.histoire.split(/\n+/).map((s) => s.trim()).filter(Boolean).slice(0, 6)
    : [];

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "radial-gradient(ellipse at top, #141B2E 0%, #0A0E17 60%)",
        color: "#F3EFE4",
        minHeight: "100vh",
      }}
    >
      <style>{`
        ${FONT_IMPORT}
        .display { font-family: 'Cormorant Garamond', serif; }
        .brand { font-family: 'Marcellus', serif; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-up 0.4s ease both; }
        textarea::placeholder { color: #6B7280; }
        @media (prefers-reduced-motion: reduce) {
          .spin-slow, .fade-up { animation: none !important; }
        }
      `}</style>

      <div style={{ maxWidth: 460, margin: "0 auto", minHeight: "100vh", position: "relative", paddingBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <EightStar size={20} className="text-[#C9A24B]" />
            <span className="brand" style={{ fontSize: 20, letterSpacing: 1, color: "#E8C97A" }}>
              QALAM
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {screen !== "home" && (
              <button
                onClick={() => setScreen("home")}
                style={{ display: "flex", alignItems: "center", gap: 4, color: "#9CA3B5", fontSize: 13, background: "none", border: "none", cursor: "pointer" }}
              >
                <ChevronLeft size={16} /> Accueil
              </button>
            )}
            <button
              onClick={() => setScreen("settings")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3B5", display: "flex" }}
            >
              <Settings size={17} />
            </button>
          </div>
        </div>
        <div style={{ padding: "0 20px" }}>
          <LatticeDivider />
        </div>

        {screen === "home" && <HomeScreen onCategoryClick={handleCategoryClick} />}

        {screen === "settings" && <SettingsScreen />}

        {screen === "create" && (
          <CreateScreen
            prompt={prompt} setPrompt={setPrompt}
            style={style} setStyle={setStyle}
            voice={voice} setVoice={setVoice}
            duration={duration} setDuration={setDuration}
            error={error} loading={loading}
            onGenerate={handleGenerate}
          />
        )}

        {screen === "result" && result && (
          <ResultScreen
            result={result} style={style} scenes={scenes}
            imageModel={imageModel} setImageModel={setImageModel}
            videoModel={videoModel} setVideoModel={setVideoModel}
            genState={genState} onGenerateVisual={handleGenerateVisual}
            copied={copied} onCopy={copyScript}
            onNewStory={() => setScreen("create")}
          />
        )}

        {toast && (
          <div
            style={{
              position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
              background: "#1B2338", border: "1px solid rgba(201,162,75,0.4)", color: "#F3EFE4",
              padding: "10px 18px", borderRadius: 30, fontSize: 12.5,
              display: "flex", alignItems: "center", gap: 8, zIndex: 50,
            }}
          >
            {toast}
            <X size={13} style={{ cursor: "pointer" }} onClick={() => setToast("")} />
          </div>
        )}
      </div>
    </div>
  );
         }  { id: "religious", label: "Récit Religieux", icon: BookOpen, ready: true },
  { id: "story", label: "Histoire → Vidéo", icon: Film, ready: false },
  { id: "kids", label: "Conte Enfant", icon: Baby, ready: false },
  { id: "interview", label: "Interview", icon: Users, ready: false },
];

const THEMES = [
  { label: "Repentir", seed: "Un homme puissant humilie quelqu'un de pauvre, puis découvre une dette cachée du passé qui bouleverse tout." },
  { label: "Épreuve", seed: "Une famille traverse une épreuve difficile qui met sa foi à rude épreuve, jusqu'à une leçon inattendue." },
  { label: "Vocation", seed: "Un jeune abandonne ses rêves pour suivre un chemin qu'il croit juste devant Allah, malgré le jugement des autres." },
];

const STYLES = ["Pixar 3D", "Réaliste", "Disney", "BD", "Illustration"];
const VOICES = ["Amir — grave, posé", "Nour — douce, narrative", "Souley — ancien, sage"];

const IMAGE_MODELS = [
  { id: "google/nano-banana-2", label: "Nano Banana 2 (Google)", note: "Rapide, fusion multi-images, texte net" },
  { id: "black-forest-labs/flux-2-pro", label: "Flux.2 Pro", note: "Référence pour le rendu produit" },
  { id: "bytedance/seedream-4.5", label: "Seedream 4.5 (ByteDance)", note: "Fort en composition cinématique" },
  { id: "openai/gpt-image-1.5", label: "GPT Image 1.5 (OpenAI)", note: "Excellent pour garder un visage cohérent" },
];

const VIDEO_MODELS = [
  { id: "bytedance/seedance-2.5", label: "Seedance 2.5 (ByteDance)", note: "Jusqu'à 30 sec, audio synchronisé natif" },
  { id: "kwaivgi/kling-v3.0", label: "Kling 3.0", note: "Multi-plans jusqu'à 6 scènes liées" },
  { id: "google/veo-3.1", label: "Veo 3.1 (Google)", note: "Audio natif (dialogues, ambiance)" },
  { id: "runwayml/gen-4.5", label: "Runway Gen-4.5", note: "N°1 physique réaliste — clé Runway requise" },
];

const KEY_LINKS = [
  { name: "Replicate", url: "https://replicate.com/account/api-tokens", unlocks: "Nano Banana, Flux, Seedream, Seedance, Kling, GPT Image" },
  { name: "Google AI Studio", url: "https://aistudio.google.com/apikey", unlocks: "Gemini, Veo 3.1 en direct" },
  { name: "Runway", url: "https://dev.runwayml.com", unlocks: "Runway Gen-4.5 en direct" },
  { name: "ElevenLabs", url: "https://elevenlabs.io/app/settings/api-keys", unlocks: "Voix off" },
];

// Ces appels passent par nos propres routes /api/... (fonctions serverless Vercel).
// Les clés Replicate / ElevenLabs vivent uniquement côté serveur, jamais dans ce fichier.
async function callGenerateImage(modelId, prompt) {
  const res = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelId, prompt, aspectRatio: "9:16" }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `Erreur ${res.status}`);
  return data;
}

async function callGenerateVideo(modelId, prompt) {
  const res = await fetch("/api/generate-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelId, prompt, aspectRatio: "9:16" }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `Erreur ${res.status}`);
  return data;
}

const SYSTEM_PROMPT = `Tu es scénariste spécialisé dans les histoires dramatiques religieuses islamiques africaines pour TikTok/YouTube Shorts, dans un style connu pour cartonner sur les réseaux.
Structure obligatoire de la réponse, en français, sans markdown ni astérisques :
TITRE: (un titre court et accrocheur entre guillemets français)
ACCROCHE: (une phrase choc à dire dans les 3 premières secondes, qui crée un mystère ou un retournement)
HISTOIRE: (récit complet, 5 à 8 paragraphes courts, avec un rebondissement moral, des personnages africains musulmans, un cadre urbain moderne, thèmes de foi/rédemption/épreuve/famille)
MORALE: (une phrase de morale finale à afficher en texte)
Reste concis, dramatique, avec un langage simple et direct adapté à un format court vidéo.`;

async function generateStory(prompt, style) {
  const userMsg = `Style visuel prévu: ${style}. Idée de départ: ${prompt}`;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMsg }],
    }),
  });
  const data = await response.json();
  const text = (data.content || [])
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("\n")
    .trim();
  return text;
}

function parseStory(raw) {
  const grab = (label, nextLabels) => {
    const re = new RegExp(
      `${label}:([\\s\\S]*?)(?=${nextLabels.map((l) => l + ":").join("|")}|$)`,
      "i"
    );
    const m = raw.match(re);
    return m ? m[1].trim() : "";
  };
  return {
    titre: grab("TITRE", ["ACCROCHE", "HISTOIRE", "MORALE"]) || "Histoire sans titre",
    accroche: grab("ACCROCHE", ["HISTOIRE", "MORALE"]),
    histoire: grab("HISTOIRE", ["MORALE"]),
    morale: grab("MORALE", []),
  };
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [toast, setToast] = useState("");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(STYLES[0]);
  const [voice, setVoice] = useState(VOICES[0]);
  const [duration, setDuration] = useState("1 min");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const toastTimer = useRef(null);
  const [imageModel, setImageModel] = useState(IMAGE_MODELS[0].id);
  const [videoModel, setVideoModel] = useState(VIDEO_MODELS[0].id);
  const [genState, setGenState] = useState({ loading: false, error: "", note: "" });

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };

  const handleCategoryClick = (cat) => {
    if (!cat.ready) {
      showToast(`"${cat.label}" — bientôt disponible`);
      return;
    }
    setScreen("create");
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Décris ton idée d'histoire avant de continuer.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const raw = await generateStory(prompt, style);
      setResult(parseStory(raw));
      setScreen("result");
    } catch (e) {
      setError("La génération a échoué. Réessaie dans un instant.");
    } finally {
      setLoading(false);
    }
  };

  const copyScript = () => {
    if (!result) return;
    const full = `${result.titre}\n\n${result.accroche}\n\n${result.histoire}\n\n${result.morale}`;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleGenerateVisual = async (kind) => {
    setGenState({ loading: true, error: "", note: "" });
    try {
      const modelId = kind === "image" ? imageModel : videoModel;
      const call = kind === "image" ? callGenerateImage : callGenerateVideo;
      await call(modelId, result?.accroche || prompt);
      setGenState({ loading: false, error: "", note: "Génération lancée avec succès." });
    } catch (e) {
      setGenState({
        loading: false,
        error: "",
        note: `Échec : ${e.message}. Vérifie que REPLICATE_API_TOKEN est bien configuré dans les variables d'environnement Vercel.`,
      });
    }
  };

  const scenes = result
    ? result.histoire
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 6)
    : [];

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "radial-gradient(ellipse at top, #141B2E 0%, #0A0E17 60%)",
        color: "#F3EFE4",
        minHeight: "100vh",
      }}
    >
      <style>{`
        ${FONT_IMPORT}
        .display { font-family: 'Cormorant Garamond', serif; }
        .brand { font-family: 'Marcellus', serif; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-up 0.4s ease both; }
        textarea::placeholder { color: #6B7280; }
        @media (prefers-reduced-motion: reduce) {
          .spin-slow, .fade-up { animation: none !important; }
        }
      `}</style>

      <div style={{ maxWidth: 460, margin: "0 auto", minHeight: "100vh", position: "relative", paddingBottom: 40 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <EightStar size={20} className="text-[#C9A24B]" />
            <span className="brand" style={{ fontSize: 20, letterSpacing: 1, color: "#E8C97A" }}>
              QALAM
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {screen !== "home" && (
              <button
                onClick={() => setScreen("home")}
                style={{ display: "flex", alignItems: "center", gap: 4, color: "#9CA3B5", fontSize: 13, background: "none", border: "none", cursor: "pointer" }}
              >
                <ChevronLeft size={16} /> Accueil
              </button>
            )}
            <button
              onClick={() => setScreen("settings")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3B5", display: "flex" }}
              title="Paramètres API"
            >
              <Settings size={17} />
            </button>
          </div>
        </div>
        <div style={{ padding: "0 20px" }}>
          <LatticeDivider />
        </div>

        {screen === "home" && (
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
                    onClick={() => handleCategoryClick(cat)}
                    style={{
                      textAlign: "left",
                      background: cat.ready
                        ? "linear-gradient(155deg, #1D4E4A 0%, #12182A 70%)"
                        : "#11172A",
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
                Le rendu vidéo (images animées, voix off) n'est pas encore branché ici : il faudrait connecter
                un service comme Runway, Kling ou Veo pour aller jusqu'à la vidéo finale.
              </p>
            </div>
          </div>
        )}

        {screen === "settings" && (
          <div className="fade-up" style={{ padding: "22px 20px" }}>
            <h2 className="display" style={{ fontSize: 24, margin: "2px 0 4px" }}>Paramètres API</h2>
            <p style={{ fontSize: 12.5, color: "#9CA3B5", margin: "0 0 18px", lineHeight: 1.6 }}>
              Les clés ne se collent plus ici : elles vivent dans les variables d'environnement de ton
              projet Vercel (<code>REPLICATE_API_TOKEN</code>, <code>ELEVENLABS_API_KEY</code>), invisibles
              depuis le navigateur. Plus sûr, et ça évite de les ressaisir à chaque visite.
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
        )}

        {screen === "create" && (
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
                    fontSize: 12.5,
                    padding: "7px 13px",
                    borderRadius: 20,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(201,162,75,0.3)",
                    color: "#E8C97A",
                    cursor: "pointer",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Un commerçant refuse d'aider un vieil homme au marché, sans savoir qui il est vraiment..."
              rows={5}
              style={{
                width: "100%",
                background: "#11172A",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: 14,
                fontSize: 14,
                color: "#F3EFE4",
                resize: "none",
                boxSizing: "border-box",
                outline: "none",
              }}
            />

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 12, color: "#9CA3B5", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Style visuel
              </div>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                {STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    style={{
                      flexShrink: 0,
                      fontSize: 12.5,
                      padding: "8px 14px",
                      borderRadius: 10,
                      background: style === s ? "rgba(201,162,75,0.15)" : "#11172A",
                      border: `1px solid ${style === s ? "#C9A24B" : "rgba(255,255,255,0.1)"}`,
                      color: style === s ? "#E8C97A" : "#9CA3B5",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
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
                  <option>1 
