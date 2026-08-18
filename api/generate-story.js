export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY manquant dans les variables d'environnement Vercel." });
  }
  console.log("BODY REÇU:", JSON.stringify(req.body));
  const { prompt, style } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "prompt est requis." });
  }

  const SYSTEM_PROMPT = `Tu es scénariste spécialisé dans les histoires dramatiques religieuses islamiques africaines pour TikTok/YouTube Shorts, dans un style connu pour cartonner sur les réseaux.
Structure obligatoire de la réponse, en français, sans markdown ni astérisques :
TITRE: (un titre court et accrocheur entre guillemets français)
ACCROCHE: (une phrase choc à dire dans les 3 premières secondes, qui crée un mystère ou un retournement)
HISTOIRE: (récit complet, 5 à 8 paragraphes courts, avec un rebondissement moral, des personnages africains musulmans, un cadre urbain moderne, thèmes de foi/rédemption/épreuve/famille)
MORALE: (une phrase de morale finale à afficher en texte)
Reste concis, dramatique, avec un langage simple et direct adapté à un format court vidéo.`;

  try {
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: `Style visuel prévu: ${style}. Idée de départ: ${prompt}` }],
      }),
    });

    const data = await claudeRes.json();
    if (!claudeRes.ok) {
      console.log("ERREUR CLAUDE:", JSON.stringify(data));
      return res.status(claudeRes.status).json({ error: data?.error?.message || "Erreur API Claude" });
    }

    const text = (data.content || [])
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n")
      .trim();

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: "Échec de l'appel à l'API Claude." });
  }
}
