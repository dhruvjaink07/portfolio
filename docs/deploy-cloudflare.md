# Deploying to Cloudflare

The site runs as a **Cloudflare Worker**, built with the OpenNext adapter (`@opennextjs/cloudflare`). You don't need a Cloudflare Pages project. "Workers & Pages" is one section of the dashboard, and OpenNext only deploys to Workers.

There's no custom domain, so the site is served from a free `workers.dev` address.

## What you need

| | Notes |
|---|---|
| Node.js 22 (anything from 20.9 up works) | `node -v` |
| git | |
| A Cloudflare account | Free plan is enough. Sign up at dash.cloudflare.com |
| A Resend account | Only for the contact form. Sign up at resend.com with **dhruvkishorjain2508@gmail.com** (see [Contact form](#5-contact-form-resend)) |

## 1. Get the code

```bash
git clone https://github.com/dhruvjaink07/portfolio.git
cd portfolio
git checkout next-migration   # until it's merged into main
npm ci
```

Clone with a plain URL like the one above. Don't put a GitHub token in the remote URL, because git saves it in plain text in `.git/config`.

## 2. Connect wrangler to your Cloudflare account

1. In the dashboard, open **Workers & Pages** once. The first time, it asks you to choose a `workers.dev` subdomain. Your site's address will be `https://dhruvjain-portfolio.<subdomain>.workers.dev`.
2. Sign in from the terminal. A browser window opens for you to approve:

   ```bash
   npx wrangler login
   npx wrangler whoami    # should print your account
   ```

## 3. Test locally (optional)

```bash
cp .dev.vars.example .dev.vars   # paste your Resend key into it, see step 5
npm run dev                      # Next.js dev server, http://localhost:3000
npm run preview                  # the real Workers runtime, http://localhost:8787
```

`.dev.vars` is git-ignored. Never commit it.

## 4. Deploy

```bash
npm run deploy
```

This builds the site with OpenNext and uploads the Worker. When it finishes, it prints the live URL.

### Point the site at its new address

`siteMeta.url` in `data/portfolioData.ts` is still the old `https://dhruvjaink07.github.io/`. Social link previews (LinkedIn, WhatsApp, X) and search engines use it, so the preview image in `public/og.png` won't show until it's updated.

1. Set `url` to your `workers.dev` address, for example `https://dhruvjain-portfolio.<subdomain>.workers.dev/`.
2. Commit and push, then run `npm run deploy` again.
3. Paste the URL into https://www.opengraph.xyz to check the preview card.

## 5. Contact form (Resend)

The form posts to `app/api/contact/route.ts`, which sends the email through Resend.

1. Sign up at resend.com with **dhruvkishorjain2508@gmail.com**. Without a verified domain, Resend only delivers to the address the account was created with. That's why `CONTACT_TO_EMAIL` in `wrangler.jsonc` is set to it.
2. Go to **API Keys → Create API key**. Sending access is enough.
3. Add the key to Cloudflare. Paste it when prompted, so it never lands in a file or your shell history:

   ```bash
   npx wrangler secret put RESEND_API_KEY
   ```

   The secret takes effect straight away, without a redeploy.
4. For local testing, also put it in `.dev.vars` as `RESEND_API_KEY=re_...`.
5. Send yourself a message from the live form. The first one may land in Gmail's spam folder, because `onboarding@resend.dev` is a shared sender. Mark it as "Not spam".

If the key is missing, the form says "The contact form is not configured yet." and shows your email address as a fallback.

## 6. Deploy automatically from GitHub (optional)

`.github/workflows/deploy.yml` deploys on every push to `main`. `.github/workflows/ci.yml` builds and type-checks every pull request. The deploy workflow needs two repository secrets, added under **GitHub → Settings → Secrets and variables → Actions**:

| Secret | Where to get it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → **My Profile → API Tokens → Create Token**, using the **Edit Cloudflare Workers** template |
| `CLOUDFLARE_ACCOUNT_ID` | Shown on the **Workers & Pages** overview page |

Once both are set, merging the pull request into `main` deploys the site. You can also run the workflow by hand from the **Actions** tab.

Don't also turn on Cloudflare's own **Connect to Git** for this Worker, or every push will deploy twice.

## Updating the site later

- **Content:** all copy lives in `data/portfolioData.ts`. Edit it, then push to `main` or run `npm run deploy`.
- **Project screenshots:** put the image in `public/assets/`, then add `image: '/assets/<file>.png'` to that project. A 4:3 crop works best.
- **Resume:** replace `public/assets/resume.pdf`.
- **Headline:** if you change it, regenerate `public/og.png` so the link preview matches.

## Free plan limits

- Workers: 100,000 requests a day.
- Image optimisation (the `IMAGES` binding): 5,000 unique transformations a month.
- Resend: 100 emails a day and 3,000 a month.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `You are not authenticated` | Run `npx wrangler login` |
| Form says "not configured yet" | Run `npx wrangler secret put RESEND_API_KEY` |
| Form says "could not be sent" | Run `npx wrangler tail` and submit again. The log shows Resend's reason, usually a wrong key or a `to` address that isn't the Resend account's email |
| Link preview shows the wrong site or no image | `siteMeta.url` still points at the old address (see step 4) |
| Deploy workflow fails with an auth error | Check both GitHub secrets, and that the token uses the "Edit Cloudflare Workers" template |
