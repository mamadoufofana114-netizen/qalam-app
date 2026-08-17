import { BookOpen, Film, Users, Baby } from "lucide-react";

export const CATEGORIES = [
  { id: "religious", label: "Récit Religieux", icon: BookOpen, ready: true },
  { id: "story", label: "Histoire → Vidéo", icon: Film, ready: false },
  { id: "kids", label: "Conte Enfant", icon: Baby, ready: false },
  { id: "interview", label: "Interview", icon: Users, ready: false },
];

export const THEMES = [
  { label: "Repentir", seed: "Un homme puissant humilie quelqu'un de pauvre, puis découvre une dette cachée du passé qui bouleverse tout." },
  { label: "Épreuve", seed: "Une famille traverse une épreuve difficile qui met sa foi à rude épreuve, jusqu'à une leçon inattendue." },
  { label: "Vocation", seed: "Un jeune abandonne ses rêves pour suivre un chemin qu'il croit juste devant Allah, malgré le jugement des autres." },
];

export const STYLES = ["Pixar 3D", "Réaliste", "Disney", "BD", "Illustration"];
export const VOICES = ["Amir — grave, posé", "Nour — douce, narrative", "Souley — ancien, sage"];

export const IMAGE_MODELS = [
  { id: "google/nano-banana-2", label: "Nano Banana 2 (Google)" },
  { id: "black-forest-labs/flux-2-pro", label: "Flux.2 Pro" },
  { id: "bytedance/seedream-4.5", label: "Seedream 4.5 (ByteDance)" },
  { id: "openai/gpt-image-1.5", label: "GPT Image 1.5 (OpenAI)" },
];

export const VIDEO_MODELS = [
  { id: "bytedance/seedance-2.5", label: "Seedance 2.5 (ByteDance)" },
  { id: "kwaivgi/kling-v3.0", label: "Kling 3.0" },
  { id: "google/veo-3.1", label: "Veo 3.1 (Google)" },
  { id: "runwayml/gen-4.5", label: "Runway Gen-4.5" },
];

export const KEY_LINKS = [
  { name: "Replicate", url: "https://replicate.com/account/api-tokens", unlocks: "Nano Banana, Flux, Seedream, Seedance, Kling, GPT Image" },
  { name: "Google AI Studio", url: "https://aistudio.google.com/apikey", unlocks: "Gemini, Veo 3.1 en direct" },
  { name: "Runway", url: "https://dev.runwayml.com", unlocks: "Runway Gen-4.5 en direct" },
  { name: "ElevenLabs", url: "https://elevenlabs.io/app/settings/api-keys", unlocks: "Voix off" },
];
