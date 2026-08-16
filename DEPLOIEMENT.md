# Déployer Qalam — guide pas à pas (depuis ton téléphone)

Tout se fait depuis un navigateur, pas besoin d'ordinateur ni de connaître le code.

## Étape 1 — Mettre le projet sur GitHub

1. Va sur **github.com** → crée un compte gratuit (si tu n'en as pas déjà un).
2. Une fois connecté, appuie sur **+** en haut à droite → **New repository**.
3. Nomme-le `qalam-app`, laisse-le en **Public** ou **Private**, puis **Create repository**.
4. Sur la page du repository vide, appuie sur **uploading an existing file**.
5. Depuis ton téléphone, sélectionne **tous les fichiers et dossiers** de ce projet
   (`api/`, `src/`, `package.json`, `vite.config.js`, `index.html`, `.gitignore`)
   et upload-les. Valide avec **Commit changes**.

## Étape 2 — Connecter à Vercel

1. Va sur **vercel.com** → **Sign Up** → choisis **Continue with GitHub** (le plus simple).
2. Une fois connecté, appuie sur **Add New** → **Project**.
3. Choisis le repository `qalam-app` que tu viens de créer → **Import**.
4. Vercel détecte automatiquement que c'est un projet Vite/React — ne change rien aux réglages de build.
5. **Avant de cliquer sur Deploy**, ouvre la section **Environment Variables** sur cette même page et ajoute :

   | Name | Value |
   |---|---|
   | `REPLICATE_API_TOKEN` | ta clé Replicate (commence par `r8_`) |
   | `ELEVENLABS_API_KEY` | ta clé ElevenLabs |

6. Appuie sur **Deploy**. Ça prend 1 à 2 minutes.

## Étape 3 — Tester

Une fois le déploiement terminé, Vercel te donne un lien du type
`qalam-app.vercel.app`. Ouvre-le, crée un récit, choisis un modèle,
et clique sur "Générer les images clés" — cette fois l'appel passe par
ton propre serveur Vercel, qui connaît la clé, donc ça doit fonctionner.

## Si tu changes ou ajoutes une clé plus tard

Project Settings → Environment Variables → modifie la valeur → puis
**Deployments** → les trois points sur le dernier déploiement → **Redeploy**
(les variables d'environnement ne s'appliquent qu'aux nouveaux déploiements).

## En cas d'erreur au clic "Générer"

Le message affiché dans l'app te dira si c'est :
- une clé manquante ou mal collée dans Vercel,
- ou une erreur renvoyée par Replicate/ElevenLabs elle-même (ex: crédit épuisé).
