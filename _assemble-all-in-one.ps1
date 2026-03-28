$doc = "c:\Users\antha\OneDrive\Documents"
$css = [IO.File]::ReadAllText("$doc\gold-insights-hub\css\styles.css")
$sources = [IO.File]::ReadAllText("$doc\gold-insights-hub\js\sources.js")
$sources = $sources -replace 'export const ', 'const '
$app = [IO.File]::ReadAllText("$doc\gold-insights-hub\js\app.js")
$app = $app -replace '(?m)^import .+$', ''
$accCss = [IO.File]::ReadAllText("$doc\acca-gold-suite\src\index.css")
$accCss = $accCss -replace '@import url\("https://fonts.googleapis.com[^"]+"\);\s*', ''
# Avoid overriding Atlas layout / body background site-wide
$accCss = $accCss -replace '(?ms)\* \{\s*box-sizing: border-box;\s*margin: 0;\s*padding: 0;\s*\}\s*', ''
$accCss = $accCss -replace '(?ms)html,\s*body,\s*#root \{[^}]+\}\s*', ''
$accCss = $accCss -replace '(?ms)body \{\s*background:\s*#040608;\s*\}\s*', ''
$babel = [IO.File]::ReadAllText("$doc\_acca-babel-inner.txt")

$html = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Gold Insight Atlas + ACCA Gold Suite (all-in-one)</title>
  <meta name="description" content="Single-file site: live RSS atlas + ACCA gold dashboard. Requires internet for CDN scripts." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <style>
/* ========== Gold Insight Atlas ========== */
$css
/* ========== ACCA dashboard (scoped) ========== */
#acca-root {
  min-height: 60vh;
}
$accCss
  </style>
</head>
<body>
  <p style="max-width:1120px;margin:12px auto 0;padding:0 1.25rem;font-family:system-ui,sans-serif;font-size:13px;color:#8b929e;">
    <strong style="color:#d4af37;">All-in-one file</strong> — Atlas (static) + ACCA suite (React via CDN). Edit the CONFIG block in the first script, or change <code>ACCAGoldSuite.jsx</code> and re-run <code>_build-all-in-one.ps1</code> + <code>_assemble-all-in-one.ps1</code> to regenerate the Babel section.
  </p>

  <!-- ======== Gold Insight Atlas markup ======== -->
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="header-inner">
      <div class="brand">
        <span class="brand-mark" aria-hidden="true"></span>
        <div>
          <strong class="brand-name">Gold Insight Atlas</strong>
          <span class="brand-tag">Multi-institution · Auto-refresh</span>
        </div>
      </div>
      <nav class="nav" aria-label="Primary">
        <a href="#feed">Live feed</a>
        <a href="#institutions">Institutions</a>
        <a href="#acca-heading">ACCA suite</a>
        <a href="#about">About</a>
      </nav>
      <div class="header-status">
        <span class="pulse" aria-hidden="true"></span>
        <span id="statusText">Initializing…</span>
      </div>
    </div>
  </header>
  <main id="main">
    <section class="hero">
      <div class="hero-inner">
        <p class="eyebrow">Professional gold intelligence</p>
        <h1>One view of how <em>bodies, banks, and markets</em> frame gold.</h1>
        <p class="lead">
          RSS + institution hubs are configured in the <code class="inline-code">CONFIG</code> block inside this file’s first script.
          Scroll down for the full <strong>ACCA Gold &amp; Inflation Audit Suite</strong> (charts, FX, auditor tab).
        </p>
        <div class="hero-meta">
          <div class="meta-pill">
            <span class="mono" id="lastUpdated">—</span>
            <span class="meta-label">Last aggregation</span>
          </div>
          <div class="meta-pill">
            <span class="mono" id="nextRefresh">—</span>
            <span class="meta-label">Next refresh</span>
          </div>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="orbit"><span></span><span></span><span></span></div>
      </div>
    </section>
    <section class="section" id="feed">
      <div class="section-head">
        <h2>Live insight stream</h2>
        <p class="section-desc">Keyword-filtered headlines from global business RSS feeds. Refreshes automatically.</p>
      </div>
      <div id="feedGrid" class="feed-grid" role="list"></div>
      <p id="feedEmpty" class="feed-empty hidden" role="status">No items matched gold-related keywords in this cycle. Try again after the next refresh.</p>
    </section>
    <section class="section alt" id="institutions">
      <div class="section-head">
        <h2>Institution &amp; sell-side hubs</h2>
        <p class="section-desc">Curated entry points. Links open in a new tab.</p>
      </div>
      <div id="institutionCards" class="card-grid"></div>
    </section>
    <section class="section" id="about">
      <div class="section-head">
        <h2>About this file</h2>
        <p class="section-desc">Atlas logic runs in the first script; ACCA dashboard uses React + Recharts from CDN (needs network). For GitHub Pages, upload this single HTML file.</p>
      </div>
      <div class="about-grid">
        <article class="about-card">
          <h3>Configure RSS</h3>
          <p>Edit <code class="inline-code">CONFIG</code> (keywords, feeds, institution cards) in the script below.</p>
        </article>
        <article class="about-card">
          <h3>Refresh cadence</h3>
          <p>Change <code class="inline-code">REFRESH_MS</code> in the same script (default 5 minutes).</p>
        </article>
        <article class="about-card">
          <h3>Disclaimer</h3>
          <p>Not investment advice. Verify research at original publishers.</p>
        </article>
      </div>
    </section>
  </main>
  <footer class="site-footer">
    <p><strong>Gold Insight Atlas</strong> · Single file · © <span id="year"></span></p>
  </footer>

  <hr style="border:0;border-top:1px solid rgba(212,175,55,0.2);margin:48px auto;max-width:1120px;" />

  <h2 id="acca-heading" style="text-align:center;font-family:'Playfair Display',serif;color:#d4af37;margin:32px 16px 8px;">ACCA Gold Suite</h2>
  <p style="text-align:center;font-family:'DM Sans',sans-serif;color:#64748b;font-size:14px;max-width:640px;margin:0 auto 16px;">Loaded below via React. If this area stays blank, check browser console (CDN blocked or script error).</p>
  <div id="acca-root"></div>

  <script>
  /* ========== CONFIG (edit here) — was sources.js ========== */
  $sources
  </script>
  <script>
  /* ========== Atlas runtime — was app.js ========== */
  $app
  </script>

  <script crossorigin src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/recharts@2.12.7/umd/Recharts.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7.26.4/babel.min.js"></script>
  <script type="text/babel" data-presets="react">
$babel
  </script>
</body>
</html>
"@

$outPath = "$doc\gold-complete-all-in-one.html"
[IO.File]::WriteAllText($outPath, $html)
Write-Host "Wrote $outPath ($(([IO.FileInfo]$outPath).Length / 1KB) KB)"
