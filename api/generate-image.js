export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "REPLICATE_API_TOKEN manquant dans les variables d'environnement Vercel." });
  }

  const { modelId, prompt, aspectRatio } = req.body || {};
  if (!modelId || !prompt) {
    return res.status(400).json({ error: "modelId et prompt sont requis." });
  }

  try {
    const replicateRes = await fetch(`https://api.replicate.com/v1/models/${modelId}/predictions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        input: { prompt, aspect_ratio: aspectRatio || "9:16" },
      }),
    });

    const data = await replicateRes.json();
    if (!replicateRes.ok) {
      return res.status(replicateRes.status).json({ error: data?.detail || "Erreur Replicate" });
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Échec de l'appel à Replicate." });
  }
}
