export async function generateStory(prompt, style) {
  const res = await fetch("/api/generate-story", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, style }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `Erreur ${res.status}`);
  return data.text;
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
