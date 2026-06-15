# Plan: Host Closer on Cloudflare Pages behind a private Cloudflare Access gate

## Context

`closer_game` is a single static `index.html` (a local, single-device party game). We want to:
1. Host it on Cloudflare for free, and
2. Put OIDC/OAuth-style auth in front of it so **only you and your friends** can open it.

Decisions:
- **Auth goal:** *gate access* — nobody unauthorized should even load the page.
- **Provider:** Cloudflare's **own built-in identity** — the **One-time PIN (email OTP)** method. No external IdP, no Google/GitHub app, no client secret.
- **Audience:** private, just you + a handful of friends.

This means **the entire auth layer is Cloudflare configuration, not application code.** Cloudflare Access (Zero Trust) acts as an OIDC-style reverse-proxy gate: it forces a login (email code) and only then proxies the request to the static site. The free Zero Trust plan covers up to 50 users at no cost.

One required code change is unrelated to auth: the app persists state through a non-standard `window.storage` API (`index.html:548-553`) that does **not** exist in a normal browser. Without a fallback the game silently fails to save people / used questions / sessions once hosted. We add a localStorage-backed shim so the static site works standalone. Data stays local per browser (that's fine — the goal was gating, not cross-device sync).

## Part A — Make the static site work standalone (the only code change)

**File:** `index.html`

The app calls `window.storage.get(KEY)` / `window.storage.set(KEY, val)` and expects `get` to return `{value: "..."}`. Add a shim near the top of the `<script>` block (before `loadState`/`saveState`, ~line 544) that provides `window.storage` when it's missing, backed by `localStorage`:

```js
/* Storage shim: use the host-provided window.storage if present, else localStorage. */
if (!window.storage) {
  window.storage = {
    async get(k){ const v = localStorage.getItem(k); return v==null ? null : {value:v}; },
    async set(k,v){ localStorage.setItem(k, v); },
  };
}
```

No other code changes — `loadState`/`saveState` already `await` these and already swallow errors in `try/catch`, so the shim drops in cleanly.

(Optional, not required: self-host or `preconnect` the Google Fonts `@import` at `index.html:8`. It's an external dependency but works fine as-is. Skip unless you want offline/perf hardening.)

## Part B — Deploy to Cloudflare Pages (free)

Pick one path:

- **Drag-and-drop (fastest):** dash.cloudflare.com → Workers & Pages → Create → Pages → Upload assets → drag the project folder. You get `closer-game.pages.dev`.
- **Git-connected (auto-deploy on push):** push this repo to GitHub, then Pages → Connect to Git → select repo → leave build command empty, output dir `/`. Every push to `main` redeploys.
- **CLI:** `npx wrangler pages deploy . --project-name closer-game`

Result: a public `*.pages.dev` URL — open to anyone *until* Part C locks it down.

## Part C — Put Cloudflare Access (Zero Trust) in front, with email One-time PIN

All in the **Zero Trust dashboard** (one.dash.cloudflare.com). No code, no external IdP.

1. **Enable Zero Trust** on the account if not already (choose the **Free** plan; it may ask for a payment method but bills $0 under 50 users).
2. The **One-time PIN** login method is built in and on by default (Settings → Authentication → Login methods → "One-time PIN"). Nothing to configure — it emails a 6-digit code to whatever address the visitor enters, and the policy decides whether that address is allowed.
3. **Access → Applications → Add an application → Self-hosted.**
   - **Application domain:** the Pages hostname, e.g. `closer-game.pages.dev` (Access can protect `*.pages.dev` directly). If you later add a custom domain on Cloudflare, protect that hostname instead.
   - Session duration: your choice (e.g. 1 week, so friends don't re-auth constantly).
4. **Add a policy:**
   - Action: **Allow**.
   - Rule: **Emails** = your + friends' addresses (or **Emails ending in** a shared domain, or an **Access Group** you create once and reuse).
   - Leave One-time PIN as an available login method (it's account-wide, no per-app step).
5. Save. Now visiting the site shows Cloudflare's login page → enter email → receive code → enter code → land on the game. Anyone not on the allow-list is blocked.

### Notes / gotchas
- **Preview deployments:** Pages preview URLs (`<hash>.closer-game.pages.dev`) are separate hostnames. If you want previews gated too, add `*.closer-game.pages.dev` as a second Access app, or just rely on the Git-connected production URL.
- **Free-tier ceiling:** 50 users on Zero Trust free — far above "me + friends."
- **It's a gate, not in-app identity:** the app itself never sees who logged in (no code needed). Cloudflare *does* forward a signed `Cf-Access-Jwt-Assertion` / identity if you ever want the app to read the user later — out of scope here.
- **Why not Google/GitHub OAuth:** those are also supported as Access login methods, but they require registering an OAuth app + secret. The built-in email PIN needs none of that and fits a private friends list, which is exactly what you asked for.

## Verification

1. **Local, pre-deploy:** open `index.html` directly in a browser (`file://` or `python3 -m http.server`). Add names, start a session, reload → confirm people/sessions persist (proves the storage shim works without `window.storage`).
2. **Deployed, pre-Access:** hit the `*.pages.dev` URL in a normal window → game loads.
3. **After Access:**
   - Visit the URL in an **incognito** window → you should be redirected to Cloudflare's login screen, *not* the game.
   - Enter an **allowed** email → receive the 6-digit code → enter it → game loads.
   - Enter a **non-allowed** email → blocked / denied.
   - Re-open within the session window → no re-prompt (session cookie valid).
4. **Optional:** smoke-test against the public URL to confirm the unauthenticated request lands on the Access login page (HTTP 302 to `cloudflareaccess.com`) rather than the app HTML.

## Summary of work

- **Code:** one ~6-line storage shim in `index.html`. That's it.
- **Everything else is Cloudflare dashboard configuration** (Pages deploy + one Access application + one Allow policy using the built-in email One-time PIN).
- **Cost:** $0.
