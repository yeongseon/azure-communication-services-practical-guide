'use strict';

// Reusable PII-masking utilities for Azure Portal screenshots used across the
// Azure Communication Services Practical Guide. The intent is to keep
// redactions consistent and to prevent leaking real Azure account identifiers
// (subscription, tenant, user) into the published documentation.
//
// Mirrors azure-container-apps-practical-guide/scripts/portal-capture-helpers.js
// with PII rules adjusted for ACS contexts (Communication Services hostnames,
// auto-generated AzureManaged domain GUIDs, ACS connection strings, phone
// numbers, recipient emails).

const PII_RULES = [
  // Generic subscription / tenant / resource GUID (any UUID-shaped value).
  {
    pattern: /(?<![0-9a-f])[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?![0-9a-f])/gi,
    replacement: '00000000-0000-0000-0000-000000000000',
  },
  // Microsoft internal subscription names.
  {
    pattern: /\bMCAPS[-A-Za-z0-9_]*\b/g,
    replacement: 'Visual Studio Enterprise Subscription',
  },
  {
    pattern: /\b1ES-MCP\b/g,
    replacement: 'Visual Studio Enterprise Subscription',
  },
  {
    pattern: /Microsoft\s+Non-Production/gi,
    replacement: 'Contoso',
  },
  // Microsoft.com / onmicrosoft.com email and tenant references.
  {
    pattern: /\b[A-Za-z0-9._%+-]+@microsoft\.com(?![A-Za-z0-9.-])/gi,
    replacement: 'user@example.com',
  },
  {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.onmicrosoft\.com(?![A-Za-z0-9.-])/gi,
    replacement: 'user@example.com',
  },
  {
    pattern: /\b[A-Za-z0-9-]+\.onmicrosoft\.com(?![A-Za-z0-9.-])/gi,
    replacement: 'contoso.onmicrosoft.com',
  },
  // Known operator handles (extend the array, do not regress to a black box).
  {
    pattern: /\bychoe\b/gi,
    replacement: 'demouser',
  },
  {
    pattern: /Yeongseon\s+Choe/g,
    replacement: 'Demo User',
  },
  {
    pattern: /\byeongseon\b/gi,
    replacement: 'demouser',
  },
  // Access tokens / long hex secrets (32+ char hex blob).
  {
    pattern: /\b[0-9A-F]{32,}\b/g,
    replacement: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  },
  // -----------------------------------------------------------------
  // ACS-specific PII rules
  // -----------------------------------------------------------------
  // ACS connection strings (endpoint=...;accessKey=...) - never leak the key.
  // Replaces both `endpoint=https://...azure.com/` and `accessKey=<base64>`.
  {
    pattern: /endpoint=https:\/\/[A-Za-z0-9.-]+\.communication\.azure\.com\/?;accesskey=[A-Za-z0-9+/=]+/gi,
    replacement: 'endpoint=https://<acs-resource>.communication.azure.com/;accesskey=<acs-access-key>',
  },
  // Standalone access key parameter that survives if the endpoint changes.
  {
    pattern: /accesskey=[A-Za-z0-9+/=]{20,}/gi,
    replacement: 'accesskey=<acs-access-key>',
  },
  // ACS resource hostname (e.g. acs-xyz.korea.communication.azure.com).
  {
    pattern: /\b[a-z0-9-]+\.[a-z]+\.communication\.azure\.com\b/gi,
    replacement: '<acs-resource>.<region>.communication.azure.com',
  },
  // Auto-generated AzureManagedDomain sender host (UUID.azurecomm.net).
  // The UUID itself is already covered by the generic rule above, but the
  // hostname suffix should be preserved as `azurecomm.net` since it is part
  // of the documented vocabulary.
  {
    pattern: /DoNotReply@[0-9a-f-]+\.azurecomm\.net/gi,
    replacement: 'DoNotReply@<azure-managed-domain>.azurecomm.net',
  },
  // E.164 phone numbers (+1XXXXXXXXXX). Used in SMS / calling captures but
  // also occasionally surface in the Email blade when SMS-linked numbers are
  // listed in the resource.
  {
    pattern: /\+1\d{10}\b/g,
    replacement: '+1<sender-phone>',
  },
];

const PORTAL_BLUE = '#0078d4';

// Selectors are tried in order; the first that matches wins. The English
// Portal exposes `aria-label="Account menu"`; localized Portals may still
// match the `fxs-menu-account` class fallback but that is best-effort.
const ACCOUNT_AVATAR_SELECTORS = [
  'button[aria-label*="Account menu"]',
  'button.fxs-menu-account',
];

// Serialized form of PII_RULES so it can be evaluated inside the browser
// context (page.evaluate / frame.evaluate cannot reach the outer scope).
const PII_REPLACEMENT_SCRIPT = (() => {
  const serialized = PII_RULES
    .map(({ pattern, replacement }) => `{ re: ${pattern.toString()}, val: ${JSON.stringify(replacement)} }`)
    .join(', ');

  return `(() => {
    const subs = [${serialized}];
    let count = 0;
    const applySubs = (input) => {
      let out = input;
      for (const { re, val } of subs) {
        re.lastIndex = 0;
        out = out.replace(re, val);
      }
      return out;
    };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    for (const node of nodes) {
      const orig = node.textContent || '';
      const next = applySubs(orig);
      if (next !== orig) {
        node.textContent = next;
        count++;
      }
    }
    document.querySelectorAll('[aria-label]').forEach((el) => {
      const orig = el.getAttribute('aria-label') || '';
      const next = applySubs(orig);
      if (next !== orig) el.setAttribute('aria-label', next);
    });
    document.querySelectorAll('input, textarea').forEach((el) => {
      const orig = el.value || '';
      const next = applySubs(orig);
      if (next !== orig) {
        el.value = next;
        count++;
      }
    });
    document.querySelectorAll('[title]').forEach((el) => {
      const orig = el.getAttribute('title') || '';
      const next = applySubs(orig);
      if (next !== orig) el.setAttribute('title', next);
    });
    return count;
  })()`;
})();

async function applyPiiReplacements(page) {
  const mainFrame = page.mainFrame();
  let total = await mainFrame.evaluate(PII_REPLACEMENT_SCRIPT);
  // Portal blades render inside iframes - walk them all.
  for (const frame of page.frames()) {
    if (frame === mainFrame) continue;
    try {
      total += await frame.evaluate(PII_REPLACEMENT_SCRIPT);
    } catch (_) {
      // Cross-origin or detached frame; skip silently.
      continue;
    }
  }
  return total;
}

async function resolveAccountAvatarMask(page) {
  for (const selector of ACCOUNT_AVATAR_SELECTORS) {
    const locator = page.locator(selector);
    if ((await locator.count()) > 0) {
      return locator.first();
    }
  }
  return null;
}

async function capturePortalScreenshot(page, outputPath, options = {}) {
  const { fullPage = false, requireAvatarMask = true } = options;

  const replacements = await applyPiiReplacements(page);
  // Give the DOM mutation observer a beat to settle before snapping.
  await page.waitForTimeout(400);

  const avatar = await resolveAccountAvatarMask(page);
  const masks = avatar ? [avatar] : [];

  if (!avatar && requireAvatarMask) {
    const message =
      'capturePortalScreenshot: no Account-avatar element matched any of ' +
      JSON.stringify(ACCOUNT_AVATAR_SELECTORS) +
      '. The English-language Portal exposes the primary `aria-label` selector; ' +
      'a localized Portal may still match the `button.fxs-menu-account` fallback, ' +
      'but neither is guaranteed if the page is not fully rendered. ' +
      'Wait for the target blade to settle before capture, or pass ' +
      '{ requireAvatarMask: false } to override.';
    throw new Error(message);
  }

  await page.screenshot({
    path: outputPath,
    fullPage,
    mask: masks,
    maskColor: PORTAL_BLUE,
  });

  return { replacements, path: outputPath, avatarMasked: Boolean(avatar) };
}

module.exports = {
  PII_RULES,
  PII_REPLACEMENT_SCRIPT,
  PORTAL_BLUE,
  ACCOUNT_AVATAR_SELECTORS,
  applyPiiReplacements,
  resolveAccountAvatarMask,
  capturePortalScreenshot,
};
