import { GOLD_KEYWORDS, RSS_FEEDS, INSTITUTION_CARDS } from "./sources.js";

/** Auto-refresh interval (ms). */
const REFRESH_MS = 5 * 60 * 1000;

const statusText = document.getElementById("statusText");
const lastUpdated = document.getElementById("lastUpdated");
const nextRefresh = document.getElementById("nextRefresh");
const feedGrid = document.getElementById("feedGrid");
const feedEmpty = document.getElementById("feedEmpty");
const yearEl = document.getElementById("year");

yearEl.textContent = String(new Date().getFullYear());

let refreshTimer = null;
let countdownTimer = null;
let nextRefreshAt = Date.now() + REFRESH_MS;

function setStatus(msg, variant = "ok") {
  statusText.textContent = msg;
  statusText.classList.remove("status-ok", "status-warn");
  if (variant === "warn") statusText.classList.add("status-warn");
  else statusText.classList.add("status-ok");
}

function formatTime(d) {
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  return div.textContent || div.innerText || "";
}

function matchesGold(text) {
  if (!text) return false;
  const t = text.toLowerCase();
  return GOLD_KEYWORDS.some((k) => t.includes(k));
}

function tagHits(title, snippet) {
  const blob = `${title} ${snippet}`.toLowerCase();
  return GOLD_KEYWORDS.filter((k) => blob.includes(k)).slice(0, 4);
}

/**
 * RSS bridges (pick one that works from your network). FT and some feeds may return empty via free bridges.
 */
async function fetchRssJson(rssUrl) {
  const encoded = encodeURIComponent(rssUrl);
  const endpoints = [
    () => fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encoded}`, { cache: "no-store" }),
    () => fetch(`https://rss2json.com/api.json?rss_url=${encoded}`, { cache: "no-store" }),
  ];

  for (const get of endpoints) {
    try {
      const res = await get();
      if (!res.ok) continue;
      const data = await res.json();
      if (data.status === "ok" && Array.isArray(data.items)) return data;
    } catch {
      /* try next */
    }
  }
  return null;
}

const DEMO_ITEMS = [
  {
    source: "Demo · Macro",
    title: "Real yields and gold: why the spread still matters",
    snippet: "Illustrative card when RSS bridges are blocked or feeds return no gold-tagged items.",
    link: "https://www.worldbank.org/en/research",
    pubDate: new Date().toISOString(),
    tags: ["gold", "inflation"],
  },
  {
    source: "Demo · Institutions",
    title: "ACCA: treasury risk in volatile commodity markets",
    snippet: "Replace demo content by fixing RSS URLs in sources.js or hosting a small proxy.",
    link: "https://www.accaglobal.com/",
    pubDate: new Date().toISOString(),
    tags: ["gold", "treasury"],
  },
];

async function loadFeedItems() {
  const collected = [];

  for (const feed of RSS_FEEDS) {
    const data = await fetchRssJson(feed.rssUrl);
    if (!data?.items?.length) continue;

    for (const item of data.items) {
      const title = item.title || "";
      const rawDesc = item.description || item.content || "";
      const snippet = stripHtml(rawDesc).slice(0, 280);
      if (!matchesGold(title) && !matchesGold(snippet)) continue;

      collected.push({
        source: feed.label,
        title,
        snippet,
        link: item.link || "#",
        pubDate: item.pubDate || new Date().toISOString(),
        tags: tagHits(title, snippet),
      });
    }
  }

  collected.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  return collected;
}

function renderFeed(items) {
  feedGrid.innerHTML = "";
  const list = items.length ? items : DEMO_ITEMS;

  if (!items.length) {
    feedEmpty.classList.remove("hidden");
    setStatus("Live feeds empty — showing demo cards", "warn");
  } else {
    feedEmpty.classList.add("hidden");
    setStatus(`${items.length} gold-tagged items`, "ok");
  }

  const frag = document.createDocumentFragment();
  for (const item of list.slice(0, 24)) {
    const a = document.createElement("a");
    a.className = "feed-card";
    a.href = item.link;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("role", "listitem");

    const src = document.createElement("span");
    src.className = "feed-source";
    src.textContent = item.source;

    const h = document.createElement("h3");
    h.className = "feed-title";
    h.textContent = item.title;

    const p = document.createElement("p");
    p.className = "feed-snippet";
    p.textContent = item.snippet || "Open article for full text.";

    const tagRow = document.createElement("div");
    tagRow.className = "tag-row";
    for (const t of item.tags || []) {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = t;
      tagRow.appendChild(span);
    }

    const d = document.createElement("span");
    d.className = "feed-date";
    d.textContent = formatTime(new Date(item.pubDate));

    a.append(src, h, p);
    if (tagRow.childElementCount) a.appendChild(tagRow);
    a.appendChild(d);
    frag.appendChild(a);
  }

  feedGrid.appendChild(frag);
}

function renderInstitutions() {
  const root = document.getElementById("institutionCards");
  root.innerHTML = "";
  const frag = document.createDocumentFragment();

  for (const inst of INSTITUTION_CARDS) {
    const card = document.createElement("article");
    card.className = "inst-card";

    const type = document.createElement("span");
    type.className = "inst-type";
    type.textContent = inst.type;

    const h = document.createElement("h3");
    h.textContent = inst.name;

    const desc = document.createElement("p");
    desc.className = "inst-desc";
    desc.textContent = inst.desc;

    const links = document.createElement("div");
    links.className = "inst-links";
    for (const L of inst.links) {
      const a = document.createElement("a");
      a.href = L.href;
      a.textContent = L.label;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      links.appendChild(a);
    }

    card.append(type, h, desc, links);
    frag.appendChild(card);
  }

  root.appendChild(frag);
}

async function refreshAll() {
  setStatus("Refreshing…", "ok");
  feedGrid.innerHTML = "";
  const placeholders = Math.min(6, RSS_FEEDS.length || 3);
  for (let i = 0; i < placeholders; i++) {
    const s = document.createElement("div");
    s.className = "shimmer-wrap";
    s.setAttribute("aria-busy", "true");
    feedGrid.appendChild(s);
  }

  const items = await loadFeedItems();
  renderFeed(items);

  const now = new Date();
  lastUpdated.textContent = formatTime(now);
  nextRefreshAt = Date.now() + REFRESH_MS;
  nextRefresh.textContent = formatTime(new Date(nextRefreshAt));
}

function startCountdown() {
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    const ms = Math.max(0, nextRefreshAt - Date.now());
    const sec = Math.ceil(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    nextRefresh.textContent = `${m}m ${String(s).padStart(2, "0")}s`;
  }, 1000);
}

function schedule() {
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(refreshAll, REFRESH_MS);
}

renderInstitutions();
refreshAll();
startCountdown();
schedule();
