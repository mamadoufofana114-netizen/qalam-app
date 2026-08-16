export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const token = process.env.ELEVENLABS_API_KEY;
  if (!token) {
    return res.status(500).json({ error: "ELEVENLABS_API_KEY manquant dans les variables d'environnement Vercel." });
  }

  const { text, voiceId } = req.body || {};
  if (!text || !voiceId) {
    return res.status(400).json({ error: "text et voiceId sont requis." });
  }

  try {
    const elRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: { "xi-api-key": token, "Content-Type": "application/json" },
      body: JSON.stringify({ text, model_id: "eleven_multilingual_v2" }),
    });

    if (!elRes.ok) {
      const errText = await elRes.text();
      return res.status(elRes.status).json({ error: errText || "Erreur ElevenLabs" });
    }

    const buffer = Buffer.from(await elRes.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    return res.status(200).send(buffer);
  } catch (err) {
    return res.status(500).json({ error: "Échec de l'appel à ElevenLabs." });
  }
}
