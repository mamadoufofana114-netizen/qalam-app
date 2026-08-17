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
}
