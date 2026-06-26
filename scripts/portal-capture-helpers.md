# Portal capture helpers

Reusable PII-masking utilities for Azure Portal screenshots. Used across every
documentation capture in this repository to keep redactions consistent and to
prevent leaking real Azure account identifiers into the documentation.

This module is a port of
[`azure-container-apps-practical-guide/scripts/portal-capture-helpers.js`](https://github.com/yeongseon/azure-container-apps-practical-guide/blob/main/scripts/portal-capture-helpers.js)
with PII rules extended for Azure Communication Services contexts
(connection strings, AzureManagedDomain hostnames, phone numbers, recipient
emails). Keep the two files in lockstep when adding generic rules.

## What it does

- Replaces real identifiers in text nodes, `aria-label`, `title`, and `input`/
  `textarea` values with documentation-safe placeholders (see
  [PII Replacement Rules](#pii-replacement-rules)).
- Walks the main frame **and** every nested iframe (Portal blades render
  inside iframes).
- Masks the Account-menu avatar with Portal blue (`#0078d4`) so the masked
  region blends into the UI instead of leaving a jarring black rectangle. The
  mechanism differs by execution path:
    - **Node.js path** uses Playwright's native `mask` option on
      `page.screenshot()`.
    - **MCP path** uses a DOM overlay (`<div>` with `position:fixed` and the
      avatar's `getBoundingClientRect()` geometry) injected before capture and
      removed after, because the MCP screenshot pipeline forces `scale: 'css'`
      and cannot honor Playwright's `mask` option at device-pixel resolution.
- Throws by default if the Account-avatar selector matches nothing (the only
  visual element the helper cannot rewrite). The Node.js helper accepts
  `{ requireAvatarMask: false }` to override; the MCP snippet hardcodes the
  throw and should be edited per-capture if a blade legitimately has no top
  bar.

## Setup

```bash
# From repo root
cd scripts
npm install
npx playwright install chromium
```

## Node.js usage

```javascript
const { chromium } = require('playwright');
const { capturePortalScreenshot } = require('./portal-capture-helpers');

const browser = await chromium.launch({ headless: false });
// High-DPI context matches the sister repo convention (5120 x 2472 PNG output).
// viewport: 2560 x 1236 CSS pixels with deviceScaleFactor: 2 = device pixels 5120 x 2472.
const context = await browser.newContext({
  viewport: { width: 2560, height: 1236 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

await page.goto(
  'https://ms.portal.azure.com/#@<tenant>.onmicrosoft.com/resource/' +
  'subscriptions/<sub>/resourceGroups/<rg>/providers/' +
  'Microsoft.Communication/emailServices/<email-service>/overview'
);

await capturePortalScreenshot(
  page,
  'docs/assets/platform/email/01-email-service-overview.png'
);

await browser.close();
```

## MCP `browser_run_code_unsafe` usage

The MCP browser tool executes a single async function in an isolated page
context, so it cannot `require()` this module. Inline the snippet below
(replace `<OUTPUT_PATH>` per capture). Keep this snippet in lockstep with
`PII_RULES` in `portal-capture-helpers.js` - any change in one must be
mirrored in the other and in the [PII Replacement Rules](#pii-replacement-rules) table.

**Why this snippet is more complex than the Node.js path.** The MCP
playwright server forces `scale: 'css'` on `page.screenshot()`, which collapses
the device-pixel resolution to CSS pixels and produces 2560 x 1236 PNGs even
when the page is rendered at `deviceScaleFactor: 2`. To preserve the
5120 x 2472 device-pixel output (matching the sister
`azure-container-apps-practical-guide` convention), the snippet bypasses
`page.screenshot()` and uses:

1. **CDP `Page.captureScreenshot`** to capture device pixels directly.
2. **A DOM overlay** for the avatar mask (since CDP capture cannot honor
   Playwright's `mask` option).
3. **A browser `download` event** triggered by an in-page `<a>` element to
   write the PNG to disk, because the MCP sandbox has no `fs`, `Buffer`, or
   `process` available to `browser_run_code_unsafe`.

```javascript
async (page) => {
  // ---- 0. Ensure DPR=2 via CDP Emulation.setDeviceMetricsOverride ----
  // The MCP default context renders at deviceScaleFactor=1. The override is
  // sticky on the CDP target across navigations within the same page, so
  // re-applying it per capture is idempotent and self-documenting.
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 2560,
    height: 1236,
    deviceScaleFactor: 2,
    mobile: false,
  });

  // ---- 1. PII replacement (text nodes, aria-label, input/textarea values, title) ----
  const piiScript = `(() => {
    const subs = [
      { re: /(?<![0-9a-f])[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?![0-9a-f])/gi, val: '00000000-0000-0000-0000-000000000000' },
      { re: /\\bMCAPS[-A-Za-z0-9_]*\\b/g, val: 'Visual Studio Enterprise Subscription' },
      { re: /\\b1ES-MCP\\b/g, val: 'Visual Studio Enterprise Subscription' },
      { re: /Microsoft\\s+Non-Production/gi, val: 'Contoso' },
      { re: /\\b[A-Za-z0-9._%+-]+@microsoft\\.com(?![A-Za-z0-9.-])/gi, val: 'user@example.com' },
      { re: /\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.onmicrosoft\\.com(?![A-Za-z0-9.-])/gi, val: 'user@example.com' },
      { re: /\\b[A-Za-z0-9-]+\\.onmicrosoft\\.com(?![A-Za-z0-9.-])/gi, val: 'contoso.onmicrosoft.com' },
      { re: /\\bychoe\\b/gi, val: 'demouser' },
      { re: /Yeongseon\\s+Choe/g, val: 'Demo User' },
      { re: /\\byeongseon\\b/gi, val: 'demouser' },
      { re: /\\b[0-9A-F]{32,}\\b/g, val: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' },
      { re: /endpoint=https:\\/\\/[A-Za-z0-9.-]+\\.communication\\.azure\\.com\\/?;accesskey=[A-Za-z0-9+\\/=]+/gi, val: 'endpoint=https://<acs-resource>.communication.azure.com/;accesskey=<acs-access-key>' },
      { re: /accesskey=[A-Za-z0-9+\\/=]{20,}/gi, val: 'accesskey=<acs-access-key>' },
      { re: /\\b[a-z0-9-]+\\.[a-z]+\\.communication\\.azure\\.com\\b/gi, val: '<acs-resource>.<region>.communication.azure.com' },
      { re: /DoNotReply@[0-9a-f-]+\\.azurecomm\\.net/gi, val: 'DoNotReply@<azure-managed-domain>.azurecomm.net' },
      { re: /\\+1\\d{10}\\b/g, val: '+1<sender-phone>' },
    ];
    let count = 0;
    const applySubs = (input) => {
      let out = input;
      for (const { re, val } of subs) { re.lastIndex = 0; out = out.replace(re, val); }
      return out;
    };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const nodes = []; let n; while ((n = walker.nextNode())) nodes.push(n);
    for (const node of nodes) {
      const orig = node.textContent || '';
      const next = applySubs(orig);
      if (next !== orig) { node.textContent = next; count++; }
    }
    document.querySelectorAll('[aria-label]').forEach(el => {
      const orig = el.getAttribute('aria-label') || '';
      const next = applySubs(orig);
      if (next !== orig) el.setAttribute('aria-label', next);
    });
    document.querySelectorAll('input, textarea').forEach(el => {
      const orig = el.value || '';
      const next = applySubs(orig);
      if (next !== orig) { el.value = next; count++; }
    });
    document.querySelectorAll('[title]').forEach(el => {
      const orig = el.getAttribute('title') || '';
      const next = applySubs(orig);
      if (next !== orig) el.setAttribute('title', next);
    });
    return count;
  })()`;

  const mainFrame = page.mainFrame();
  let total = await mainFrame.evaluate(piiScript);
  for (const frame of page.frames()) {
    if (frame === mainFrame) continue;
    try { total += await frame.evaluate(piiScript); } catch (_) {}
  }
  await page.waitForTimeout(400);

  // ---- 2. Avatar mask as DOM overlay (Portal blue, position:fixed) ----
  // The MCP playwright server forces `scale: 'css'` on page.screenshot(), so
  // we use CDP Page.captureScreenshot (step 3) which ignores Playwright's
  // `mask` option. The avatar is masked by inserting an overlay div before
  // capture and removing it afterwards.
  const overlayId = '__pii_avatar_overlay__';
  const overlayPlaced = await page.evaluate((id) => {
    const selectors = ['button[aria-label*="Account menu"]', 'button.fxs-menu-account'];
    let avatar = null;
    for (const s of selectors) { avatar = document.querySelector(s); if (avatar) break; }
    if (!avatar) return false;
    const rect = avatar.getBoundingClientRect();
    const overlay = document.createElement('div');
    overlay.id = id;
    overlay.style.cssText =
      'position:fixed;' +
      'left:' + rect.left + 'px;' +
      'top:' + rect.top + 'px;' +
      'width:' + rect.width + 'px;' +
      'height:' + rect.height + 'px;' +
      'background:#0078d4;' +
      'z-index:2147483647;' +
      'pointer-events:none;';
    document.body.appendChild(overlay);
    return true;
  }, overlayId);

  if (!overlayPlaced) {
    throw new Error('No Account-avatar element matched ["button[aria-label*=\\"Account menu\\"]", "button.fxs-menu-account"]. Wait for the blade to settle before capture; non-English Portals may still match the fxs-menu-account fallback but that is best-effort, not guaranteed.');
  }

  // ---- 3. CDP captureScreenshot -> base64 (device pixels, 5120 x 2472 at DPR=2) ----
  const result = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
    fromSurface: true,
  });

  // ---- 4. Trigger a browser download to write the PNG to disk via saveAs() ----
  // The MCP sandbox has no `fs`, `Buffer`, or `process` available; the only way
  // to land bytes on disk is through Playwright's download API.
  const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
  await page.evaluate((b64) => {
    const a = document.createElement('a');
    a.href = 'data:application/octet-stream;base64,' + b64;
    a.download = 'capture.png';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => a.remove(), 100);
  }, result.data);
  const download = await downloadPromise;
  await download.saveAs('<OUTPUT_PATH>');

  // ---- 5. Remove the avatar overlay so the page is clean for the next capture ----
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  }, overlayId);

  return 'replaced ' + total + ' text occurrences';
};
```

## PII Replacement Rules

| Pattern | Replacement | Rationale |
|---|---|---|
| Any UUID (`[0-9a-f]{8}-[0-9a-f]{4}-...`) | `00000000-0000-0000-0000-000000000000` | Subscription, tenant, object, request IDs |
| `MCAPS-*` | `Visual Studio Enterprise Subscription` | Microsoft internal subscription names |
| `1ES-MCP` | `Visual Studio Enterprise Subscription` | Microsoft internal subscription names (1ES) |
| `Microsoft Non-Production` | `Contoso` | Internal tenant display name |
| `*@microsoft.com` | `user@example.com` | Operator identity |
| `*@*.onmicrosoft.com` | `user@example.com` | Operator identity (federated) |
| `*.onmicrosoft.com` | `contoso.onmicrosoft.com` | Tenant domain |
| `ychoe` / `yeongseon` | `demouser` | Operator handle |
| `Yeongseon Choe` | `Demo User` | Operator display name |
| 32+ hex blob | `A...A` | Access tokens, ARM tokens |
| `endpoint=https://*.communication.azure.com/...;accesskey=...` | `endpoint=https://<acs-resource>.communication.azure.com/;accesskey=<acs-access-key>` | ACS connection string |
| `accesskey=<base64>` | `accesskey=<acs-access-key>` | Standalone ACS access key |
| `<host>.<region>.communication.azure.com` | `<acs-resource>.<region>.communication.azure.com` | ACS resource hostname |
| `DoNotReply@<uuid>.azurecomm.net` | `DoNotReply@<azure-managed-domain>.azurecomm.net` | AzureManaged sender host |
| `+1XXXXXXXXXX` | `+1<sender-phone>` | E.164 phone number |

## Capture workflow rules

- **Re-navigate (`browser_navigate`) between captures.** Portal CSS is
  cumulative, and leftover styles from a previous capture can leak into the
  next page (for example, the left-nav rendering as a black box).
- **Use `ms.portal.azure.com` with the tenant hint fragment** (e.g.
  `#@<tenant>.onmicrosoft.com/...`). Plain `portal.azure.com` triggers a login
  redirect.
- **Prefer the English-language Portal.** The primary avatar selector keys
  off the English `aria-label` "Account menu". A localized Portal may still
  match the `button.fxs-menu-account` fallback class, but that fallback is
  best-effort and not a stable contract. The helper throws if neither
  selector matches; non-English captures should be reviewed manually.
- **Close every transient flyout, drawer, and command-bar dropdown** before
  capture. Account panel, Recent menu, notifications panel, and tenant
  switcher each surface PII the helper cannot fully rewrite (avatar
  thumbnails, embedded canvases, late-rendered iframe content).
- **Wait for the target blade to finish rendering** before applying
  replacements. The 400 ms post-replacement pause inside the helper is not a
  substitute for a per-blade `browser_wait_for` against a stable text or
  element on the blade.
- **Viewport: 2560 x 1236 CSS pixels with `deviceScaleFactor: 2`** captures
  the standard Portal blade layout without horizontal scrollbars and produces
  a 5120 x 2472 device-pixel PNG. This matches the
  `azure-container-apps-practical-guide` `operations/` convention. For MCP
  captures, use `browser_resize(width=2560, height=1236)` and confirm the
  context's DPR via `window.devicePixelRatio` before capture; for Node.js
  captures, pass `viewport: { width: 2560, height: 1236 }` and
  `deviceScaleFactor: 2` to `browser.newContext()`.
- **No black-box masking.** If a value cannot be rewritten and is not a known
  avatar/badge, fail the capture and update `PII_RULES` rather than fall back
  to a black rectangle.

If `PII_RULES` is updated, mirror the change in the
[PII Replacement Rules](#pii-replacement-rules) table above and in the
inline MCP snippet.

## Capture output convention

Save captures to `docs/assets/<section>/<topic>/<NN>-<short-name>.png`:

- `<section>`: top-level docs section (`platform`, `operations`,
  `troubleshooting`, `sdk-guides`)
- `<topic>`: page slug or focused area (`email`, `email-domain-verification`,
  `email-delivery`)
- `<NN>`: zero-padded order index inside the topic (`01`, `02`, ...)
- `<short-name>`: kebab-case descriptor (`overview`, `provision-domain`,
  `verify-spf`)

Examples:

```text
docs/assets/platform/email/01-email-service-overview.png
docs/assets/platform/email/02-azure-managed-domain.png
docs/assets/operations/email-provisioning/03-link-domain.png
docs/assets/troubleshooting/email-delivery/04-kql-statusupdate.png
```
