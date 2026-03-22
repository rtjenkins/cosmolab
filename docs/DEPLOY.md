# CosmoLab — Deploying to Vercel with Google OAuth

This guide walks through deploying CosmoLab to Vercel with Google sign-in and
an email-based access allowlist. Total setup time: ~20 minutes.

---

## Step 1 — Create a Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use an existing one) — e.g. "CosmoLab Beta"
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth client ID**
5. Application type: **Web application**
6. Name: `CosmoLab`
7. Under **Authorised redirect URIs**, add:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
   (Replace `your-app` with your actual Vercel project name. You can also add
   `http://localhost:3000/api/auth/callback/google` for local development.)
8. Click **Create** — copy the **Client ID** and **Client Secret**

> Note: Google will ask you to configure the OAuth consent screen first if you
> haven't already. Set it to **External**, add your app name and email, and add
> the scope `email` and `profile`. You do not need to go through verification
> for a small beta — just add your testers as "Test users" in the consent screen.

---

## Step 2 — Deploy to Vercel

1. Push your code to a GitHub repository (create one if needed):
   ```bash
   git init
   git add .
   git commit -m "Initial CosmoLab deployment"
   gh repo create cosmolab --private --push --source=.
   ```

2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import from GitHub

3. Select your repository. Vercel will auto-detect Next.js — no build config needed.

4. Before deploying, click **Environment Variables** and add the following:

   | Variable | Value |
   |----------|-------|
   | `ANTHROPIC_API_KEY` | Your Anthropic API key |
   | `AUTH_SECRET` | Run `openssl rand -base64 32` in your terminal |
   | `GOOGLE_CLIENT_ID` | From Step 1 |
   | `GOOGLE_CLIENT_SECRET` | From Step 1 |
   | `ALLOWED_EMAILS` | Comma-separated list of tester emails |
   | `NEXT_PUBLIC_PHASE` | `1.5` |

5. Click **Deploy**

---

## Step 3 — Update the Google Redirect URI

After Vercel assigns your URL (e.g. `https://cosmolab-abc123.vercel.app`):

1. Return to Google Cloud Console → **Credentials** → your OAuth client
2. Add the production redirect URI:
   ```
   https://cosmolab-abc123.vercel.app/api/auth/callback/google
   ```
3. Save

---

## Step 4 — Add Beta Testers

To give someone access:

1. Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**
2. Edit `ALLOWED_EMAILS` and add their Gmail address (comma-separated)
3. **Redeploy** the project (Vercel → Deployments → Redeploy latest)

To add them to Google's OAuth consent screen (if your app is still in "Testing" mode):

1. Google Cloud Console → **APIs & Services → OAuth consent screen → Test users**
2. Add their Gmail address

> Once you have more than ~100 testers or want to remove the test user restriction,
> submit the app for Google verification (takes 1–3 days for a simple app).

---

## Local Development with Auth

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Add `http://localhost:3000/api/auth/callback/google` to your Google OAuth
client's authorised redirect URIs, then run:

```bash
pnpm dev        # Phase 1.5 (default)
pnpm dev:phase1 # Phase 1 only
```

---

## Revoking Access

To remove a tester: delete their email from `ALLOWED_EMAILS` and redeploy.
Their existing session will expire at the next sign-in attempt.

---

## Cost Monitoring

- **Vercel**: Free tier (Hobby) supports CosmoLab comfortably for a small beta.
  If you hit function execution limits, upgrade to Pro ($20/month).
- **Anthropic**: Monitor usage at [console.anthropic.com](https://console.anthropic.com).
  Each generation session costs approximately $0.05–$0.30 depending on session length.
  Set a monthly spend limit in your Anthropic account settings.
