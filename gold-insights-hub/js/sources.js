/**
 * Configure RSS endpoints and institution cards. URLs must be allowed by the RSS bridge (see app.js).
 * Add ACCA-specific RSS or insight pages here when you have the exact feed URL.
 */

export const GOLD_KEYWORDS = [
  "gold",
  "xau",
  "bullion",
  "precious metal",
  "commodities",
  "fed",
  "central bank",
  "inflation",
  "treasury",
  "dollar",
  "fx",
  "geopolitic",
];

/** RSS feeds consumed via public JSON bridge (browser CORS). Swap in your own feeds in ACCA or bank research blogs if they publish RSS. */
export const RSS_FEEDS = [
  {
    id: "bbc-business",
    label: "BBC Business",
    rssUrl: "https://feeds.bbci.co.uk/news/business/rss.xml",
  },
  {
    id: "guardian-business",
    label: "The Guardian · Business",
    rssUrl: "https://www.theguardian.com/uk/business/rss",
  },
  {
    id: "cnn-money",
    label: "CNN · Business",
    rssUrl: "https://rss.cnn.com/rss/money_latest.rss",
  },
];

/**
 * Curated hubs: professional bodies, banks, and macro/commodity voices.
 * Replace hrefs with your preferred deep links to gold research where available.
 */
export const INSTITUTION_CARDS = [
  {
    name: "ACCA",
    type: "Professional body",
    desc: "Accounting and finance thought leadership—search insights for commodities, treasury, and risk.",
    links: [
      { label: "ACCA insights", href: "https://www.accaglobal.com/gb/en/professional-insights.html" },
      { label: "Search: gold", href: "https://www.accaglobal.com/gb/en/search.html?query=gold" },
    ],
  },
  {
    name: "World Gold Council",
    type: "Industry research",
    desc: "Supply, demand, ETF flows, and regional gold market reports.",
    links: [{ label: "Research", href: "https://www.gold.org/goldhub/research" }],
  },
  {
    name: "J.P. Morgan Research",
    type: "Global bank",
    desc: "Cross-asset and commodities research hub (client access may apply).",
    links: [{ label: "Research portal", href: "https://www.jpmorgan.com/insights/research" }],
  },
  {
    name: "Goldman Sachs Insights",
    type: "Global bank",
    desc: "Macro and markets commentary; filter for commodities and rates.",
    links: [{ label: "Insights", href: "https://www.goldmansachs.com/insights/" }],
  },
  {
    name: "Deutsche Bank Research",
    type: "Global bank",
    desc: "Fixed income and FX research entry point.",
    links: [{ label: "Research", href: "https://www.dbresearch.com/" }],
  },
  {
    name: "HSBC Global Research",
    type: "Global bank",
    desc: "Markets publications overview (subscriptions vary).",
    links: [{ label: "Research", href: "https://www.gbm.hsbc.com/en-gb/insights/research" }],
  },
  {
    name: "CME Group — Gold",
    type: "Exchange / futures",
    desc: "Gold futures specifications, volumes, and education.",
    links: [{ label: "Gold products", href: "https://www.cmegroup.com/markets/metals/precious/gold.html" }],
  },
  {
    name: "London Bullion Market Association",
    type: "Market infrastructure",
    desc: "Good delivery, market news, and standards.",
    links: [{ label: "LBMA", href: "https://www.lbma.org.uk/" }],
  },
  {
    name: "Federal Reserve",
    type: "Central bank",
    desc: "Policy and speeches that often move gold and real yields.",
    links: [{ label: "Fed news", href: "https://www.federalreserve.gov/feeds/press_all.xml" }],
  },
];
