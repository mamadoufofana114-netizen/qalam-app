const SYSTEM_PROMPT = `Tu es scénariste spécialisé dans les histoires dramatiques religieuses islamiques africaines pour TikTok/YouTube Shorts, dans un style connu pour cartonner sur les réseaux.
Structure obligatoire de la réponse, en français, sans markdown ni astérisques :
TITRE: (un titre court et accrocheur entre guillemets français)
ACCROCHE: (une phrase choc à dire dans les 3 premières secondes, qui crée un mystère ou un retournement)
HISTOIRE: (récit complet, 5 à 8 paragraphes courts, avec un rebondissement moral, des personnages africains musulmans, un cadre urbain moderne, thèmes de foi/rédemption/épreuve/famille)
MORALE: (une phrase de morale finale à afficher en texte)
Reste concis, dramatique, avec un langage simple et direct adapté à un format court vidéo.`;

export async function generateStory(prompt, style) {
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

export function parseStory(raw) {
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

export async function callGenerateImage(modelId, prompt) {
  const res = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelId, prompt, aspectRatio: "9:16" }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `Erreur ${res.status}`);
  return data;
}

export async function callGenerateVideo(modelId, prompt) {
  const res = await fetch("/api/generate-video", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelId, prompt, aspectRatio: "9:16" }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `Erreur ${res.status}`);
  return data;
    }
