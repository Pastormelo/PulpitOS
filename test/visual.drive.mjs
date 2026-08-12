// Browser drive for the v2 visual language and the interactions it touches.
//
// Run it against a local server:
//   PORT=4173 node server.mjs &
//   node test/visual.drive.mjs
//
// It needs Playwright and a Chromium binary. On this project's remote
// sessions that is PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers; set
// PF_CHROMIUM to point somewhere else if your machine differs. If Playwright
// is not installed the drive exits 0 with a note, so it never blocks `npm test`.

const BASE = process.env.PF_BASE || "http://127.0.0.1:4173";
const EXEC = process.env.PF_CHROMIUM || "/opt/pw-browsers/chromium";
const SHOTS = process.env.PF_SHOTS || "";

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.log("SKIP  playwright is not installed; skipping the visual drive");
  process.exit(0);
}

const results = [];
const errors = [];
const check = (name, ok, detail = "") => results.push(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` - ${detail}` : ""}`);

const browser = await chromium.launch({ executablePath: EXEC });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
page.on("console", (msg) => {
  if (msg.type() === "error" && !/net::|Failed to load resource/.test(msg.text())) errors.push(`console: ${msg.text()}`);
});

const shot = async (name) => {
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${name}.png` });
};
const go = async (view) => {
  await page.evaluate((v) => {
    window.__pf.state.view = v;
    window.__pf.render();
    window.scrollTo(0, 0);
  }, view);
  await page.waitForTimeout(320);
};

// WCAG contrast of every piece of text against its own painted background.
// Returns only what falls short of AA (4.5:1, or 3:1 for large bold text).
const CONTRAST_AUDIT = `(() => {
  const parse = (value) => {
    const m = String(value).match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(",").map((n) => parseFloat(n));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const lum = (c) =>
    [c.r, c.g, c.b]
      .map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      })
      .reduce((acc, v, i) => acc + v * [0.2126, 0.7152, 0.0722][i], 0);
  const ratio = (a, b) => {
    const l1 = lum(a);
    const l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const bgOf = (el) => {
    let node = el;
    let acc = null;
    while (node && node !== document.documentElement) {
      const c = parse(getComputedStyle(node).backgroundColor);
      if (c && c.a > 0) {
        acc = acc ? over(acc, c) : c;
        if (c.a >= 1) return acc;
      }
      node = node.parentElement;
    }
    return acc || { r: 255, g: 255, b: 255, a: 1 };
  };
  const out = [];
  for (const el of document.querySelectorAll("*")) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) < 0.4) continue;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    const fg = parse(cs.color);
    if (!fg) continue;
    const bg = bgOf(el);
    const flat = fg.a < 1 ? over(fg, bg) : fg;
    const size = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    const need = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
    const cr = ratio(flat, bg);
    if (cr >= need) continue;
    out.push(\`\${Math.round(cr * 100) / 100}:1 (need \${need}) \${Math.round(size)}px \${(el.className && String(el.className).slice(0, 30)) || el.tagName} "\${el.textContent.trim().slice(0, 24)}"\`);
  }
  return [...new Set(out)];
})()`;

await page.goto(`${BASE}/app`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(800);

// ---------- 1. the language itself ----------
const flat = await page.evaluate(() => {
  const rounded = [];
  const shadowed = [];
  for (const el of document.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    if (cs.borderRadius && !/^0px( 0px)*$/.test(cs.borderRadius)) rounded.push(el.className || el.tagName);
    if (cs.boxShadow !== "none" && !cs.boxShadow.includes("inset")) shadowed.push(el.className || el.tagName);
  }
  return { rounded: rounded.slice(0, 5), shadowed: shadowed.slice(0, 5) };
});
check("no rounded corners anywhere", flat.rounded.length === 0, flat.rounded.join(", "));
check("no drop shadows anywhere", flat.shadowed.length === 0, flat.shadowed.join(", "));

const fonts = await page.evaluate(() => {
  const family = (sel) => {
    const el = document.querySelector(sel);
    return el ? getComputedStyle(el).fontFamily : "";
  };
  return {
    nav: family(".pf-nav-btn"),
    h1: family(".pf-h1"),
    body: getComputedStyle(document.body).fontFamily,
  };
});
check("nav and controls are monospace", /Plex Mono|monospace/i.test(fonts.nav), fonts.nav);
check("headings use the display face", /Montserrat/i.test(fonts.h1), fonts.h1);
check("body copy stays in the reading face", /Mulish/i.test(fonts.body), fonts.body);

const headerCells = await page.evaluate(() => {
  const bar = document.querySelector(".pf-topbar");
  const cs = getComputedStyle(bar);
  return { height: Math.round(bar.getBoundingClientRect().height), border: cs.borderBottomWidth, sticky: cs.position };
});
check("header is a 58px sticky bar with a strong rule", headerCells.height === 58 && headerCells.sticky === "sticky" && headerCells.border === "2px", JSON.stringify(headerCells));

// ---------- 2. the app still works ----------
await page.click('[data-action="new-sermon"]');
await page.waitForTimeout(400);
await page.fill("#new-passage", "Ephesians 3:1-13");
await page.fill("#new-title", "The Church on Display");
await page.fill("#new-series", "Family Matters");
await page.click("button[type=submit]");
await page.waitForTimeout(700);
check("a new sermon opens the workspace", (await page.locator(".pf-ws-grid").count()) === 1);
check("metadata strip shows the sermon's facts", (await page.locator(".pf-meta .pf-meta-cell").count()) >= 4);
check("movement tabs replace the old journey dots", (await page.locator(".pf-move-tab").count()) === 4);
check("the active movement is an inverted block", await page.evaluate(() => {
  const tab = document.querySelector(".pf-move-tab.active");
  const inv = getComputedStyle(document.querySelector(".pf-root")).getPropertyValue("--pf-inv-bg").trim();
  return Boolean(tab) && getComputedStyle(tab).backgroundColor !== "rgba(0, 0, 0, 0)" && inv.length > 0;
}));
check("phase rows carry their global number", /^0?1$/.test((await page.locator(".pf-phase-num").first().innerText()).trim()));
await shot("drive-workspace");

const secondPhase = page.locator(".pf-phase-row").nth(1);
const secondName = (await secondPhase.locator(".pf-phase-name").innerText()).trim();
await secondPhase.click();
await page.waitForTimeout(400);
check("the rail still switches phases", (await page.locator(".pf-phase-title").innerText()).trim().toLowerCase() === secondName.toLowerCase());

await page.locator(".pf-check-item").first().click();
await page.waitForTimeout(400);
check("checklist items still toggle", (await page.locator(".pf-check-box.done").count()) >= 1);
check("checkboxes are square", await page.evaluate(() => getComputedStyle(document.querySelector(".pf-check-box")).borderRadius === "0px"));

// ---------- 3. pipeline is a table ----------
await go("pipeline");
check("pipeline has a column header row", (await page.locator(".pf-row-head").count()) === 1);
check("sermons render as rows, not cards", (await page.locator(".pf-row[data-sermon-card]").count()) === 1 && (await page.locator(".pf-card[data-sermon-card]").count()) === 0);
check("status tags are outlined, not filled", await page.evaluate(() => {
  const tag = document.querySelector(".pf-row-status .pf-tag");
  if (!tag) return false;
  const cs = getComputedStyle(tag);
  return cs.backgroundColor === "rgba(0, 0, 0, 0)" && cs.borderStyle === "solid";
}));
await shot("drive-pipeline");
await page.locator(".pf-row[data-sermon-card]").first().click();
await page.waitForTimeout(500);
check("clicking a row still opens the sermon", (await page.locator(".pf-ws-grid").count()) === 1);

// ---------- 3b. one writing document across every phase ----------
await go("workspace");
check("the work box says it is one document", /one document/i.test(await page.locator(".pf-writer-note").innerText()));
await page.click('[data-action="phase-editor"]');
await page.keyboard.type("Carried across the phases.");
await page.waitForTimeout(600);
await page.locator(".pf-phase-row").nth(2).click();
await page.waitForTimeout(500);
check("the writing carries into another phase", (await page.locator('[data-action="phase-editor"]').innerText()).includes("Carried across the phases"));
await go("editor");
check("the Sermon Editor holds the same document", (await page.locator(".pf-doc-canvas").innerText()).includes("Carried across the phases"));
const stored = await page.evaluate(() => {
  const sermon = window.__pf.state.sermons[0];
  return {
    docs: Object.keys(sermon.notes).filter((key) => !key.includes("::")).length,
    logged: Object.keys(sermon.workLog || {}).length,
  };
});
check("only one document is stored", stored.docs === 1, `${stored.docs} documents`);
check("writing is attributed to the phase it happened in", stored.logged >= 1, `${stored.logged} phases logged`);

// ---------- 4. every screen renders in both themes ----------
const views = ["home", "pipeline", "library", "editor", "journal", "sharing", "impact", "map", "series", "diet", "profile", "ahead", "lens", "debrief", "workspace"];
for (const theme of ["light", "dark"]) {
  await page.evaluate((t) => {
    window.__pf.state.theme = t;
    window.__pf.render();
  }, theme);
  for (const view of views) {
    await go(view);
    const painted = await page.evaluate(() => {
      const root = document.querySelector(".pf-root");
      return Boolean(root) && root.getBoundingClientRect().height > 200 && document.body.innerText.trim().length > 40;
    });
    check(`${view} renders in ${theme}`, painted);
  }
  const themedBody = await page.evaluate(() => document.body.dataset.theme);
  check(`the page behind the app follows the ${theme} theme`, themedBody === theme, themedBody);

  // Legibility is a promise, not a preference: every piece of text has to
  // clear WCAG AA against whatever it is actually painted on.
  const failures = new Map();
  for (const view of views) {
    await go(view);
    for (const line of await page.evaluate(CONTRAST_AUDIT)) failures.set(line, view);
  }
  check(
    `every piece of text clears AA contrast in ${theme}`,
    failures.size === 0,
    [...failures.entries()].slice(0, 4).map(([line, view]) => `${view}: ${line}`).join(" | "),
  );
}
await shot("drive-dark");

// ---------- 5. narrow screens ----------
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => {
  window.__pf.state.theme = "light";
  window.__pf.render();
});
await go("workspace");
const mobile = await page.evaluate(() => {
  const grid = getComputedStyle(document.querySelector(".pf-ws-grid")).gridTemplateColumns;
  const rail = getComputedStyle(document.querySelector(".pf-rail")).position;
  const bar = document.querySelector(".pf-topbar").getBoundingClientRect();
  const strip = document.querySelector(".pf-sermon-strip").getBoundingClientRect();
  return { cols: grid.split(" ").length, rail, overlap: Math.round(bar.bottom - strip.top), width: document.documentElement.scrollWidth };
});
check("workspace is one column on a phone", mobile.cols === 1, mobile.cols);
check("the rail unsticks on a phone", mobile.rail === "static", mobile.rail);
check("the header does not cover the strip", mobile.overlap <= 1, `${mobile.overlap}px`);
check("nothing forces sideways scrolling", mobile.width <= 391, `${mobile.width}px`);
await go("pipeline");
check("pipeline drops to passage and status on a phone", (await page.locator(".pf-row-hide").first().isVisible()) === false);
await shot("drive-mobile");

// ---------- 6. the public pages carry the same language ----------
// The marketing homepage, the philosophy page, and a share link all have
// their own inline styles, so they are checked as their own pages.
const PUBLIC_PAGES = [
  ["landing", "/"],
  ["philosophy", "/philosophy.html"],
  ["share link", "/share.html?t=drive-demo"],
];
const DEMO_SHARE = {
  header: { passage: "Ephesians 3:1-13", series: "Family Matters", date: "Sunday", title: "The Church on Display", bigIdea: "The church itself is the display of God's wisdom." },
  label: "Production team link",
  blocks: [{ label: "Outline", text: "1. The mystery\n2. The minister\n3. The display" }],
  updatedAt: new Date().toISOString(),
};
for (const [label, url] of PUBLIC_PAGES) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${BASE}${url}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(700);
  // A share link with no real token shows its error state; fill it with a
  // demo payload so the reading styles are the thing being checked.
  if (label === "share link") {
    await page.evaluate((payload) => {
      if (typeof renderPayload === "function") renderPayload(payload);
    }, DEMO_SHARE);
    await page.waitForTimeout(400);
  }
  // Scroll the whole page so anything that reveals on scroll is painted
  // before it is measured.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(300);

  const shape = await page.evaluate(() => {
    const rounded = [];
    const shadowed = [];
    for (const el of document.querySelectorAll("*")) {
      const cs = getComputedStyle(el);
      if (cs.borderRadius && !/^0px( 0px)*$/.test(cs.borderRadius)) rounded.push(el.className || el.tagName);
      if (cs.boxShadow !== "none" && !cs.boxShadow.includes("inset")) shadowed.push(el.className || el.tagName);
    }
    const face = (sel) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el).fontFamily : "";
    };
    return {
      rounded: rounded.slice(0, 4),
      shadowed: shadowed.slice(0, 4),
      display: face("h1"),
      mono: face(".eyebrow, .kind, .nav-links a, .meta"),
    };
  });
  check(`${label}: nothing rounded, nothing shadowed`, shape.rounded.length === 0 && shape.shadowed.length === 0, [...shape.rounded, ...shape.shadowed].join(", "));
  check(`${label}: display face on the headline`, /Montserrat/i.test(shape.display), shape.display);
  check(`${label}: labels are monospace`, /Plex Mono|monospace/i.test(shape.mono), shape.mono);
  const publicFailures = await page.evaluate(CONTRAST_AUDIT);
  check(`${label}: every piece of text clears AA contrast`, publicFailures.length === 0, publicFailures.slice(0, 3).join(" | "));
  await shot(`drive-public-${label.replace(/\s+/g, "-")}`);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  check(`${label}: no sideways scrolling on a phone`, width <= 391, `${width}px`);
}

await browser.close();
console.log(results.join("\n"));
console.log(`\nJS errors: ${errors.length}`);
errors.slice(0, 10).forEach((err) => console.log("  " + err));
process.exit(results.some((line) => line.startsWith("FAIL")) || errors.length ? 1 : 0);
