(() => {
  const S = window.SITE || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ── Links, year, theme ────────────────────────────────
  $$("[data-github-link]").forEach((el) => (el.href = `https://github.com/${S.github}`));
  $$("[data-youtube-link]").forEach((el) => (el.href = S.youtube));
  $$("[data-email-link]").forEach((el) => {
    if (S.email) el.href = `mailto:${S.email}`;
    else el.hidden = true;
  });
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  const root = document.documentElement;
  function setTheme(t, save = true) {
    root.dataset.theme = t;
    if (save) try { localStorage.setItem("theme", t); } catch {}
  }
  // Keep other open tabs in sync
  addEventListener("storage", (e) => { if (e.key === "theme" && (e.newValue === "dark" || e.newValue === "light")) setTheme(e.newValue, false); });

  // Pages opened from disk (file://) can't share saved settings in some browsers (e.g. Firefox),
  // so carry the theme to the next page in the link itself. Online, saved settings are shared already.
  if (location.protocol === "file:") {
    const carryTheme = (e) => {
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      const url = new URL(a.getAttribute("href"), location.href);
      if (url.protocol !== "file:" || !/\.html$/.test(url.pathname)) return;
      url.searchParams.set("theme", root.dataset.theme);
      a.href = url.href;
    };
    document.addEventListener("click", carryTheme, true);
    document.addEventListener("auxclick", carryTheme, true);
  }
  $$(".theme-toggle").forEach((btn) =>
    btn.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      setTheme(next);
    })
  );

  // ── Helpers ───────────────────────────────────────────
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  function ago(date) {
    const s = (new Date(date) - Date.now()) / 1000;
    const units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
    for (const [u, sec] of units) if (Math.abs(s) >= sec) return rtf.format(Math.round(s / sec), u);
    return "just now";
  }
  const langColors = {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", Go: "#00ADD8", Shell: "#89e051",
    Rust: "#dea584", C: "#555555", "C++": "#f34b7d", HTML: "#e34c26", CSS: "#563d7c", Dockerfile: "#384d54",
    Lua: "#000080", Kotlin: "#A97BFF", Java: "#b07219", Jinja: "#a52a22", PHP: "#4F5D95", Ruby: "#701516",
  };
  const arrow = `<span class="arrow" aria-hidden="true">→</span>`;

  // ── GitHub repos ──────────────────────────────────────
  const repoBoxes = $$("[data-repos]");
  if (repoBoxes.length && S.github) {
    repoBoxes.forEach((b) => (b.innerHTML = `<li class="skeleton"></li>`.repeat(Number(b.dataset.repos) || 3)));
    loadRepos()
      .then((repos) => {
        const sorted = repos.filter((r) => !r.fork && !r.archived).sort((a, b) => b.stargazers_count - a.stargazers_count);
        repoBoxes.forEach((box) => {
          const list = sorted.slice(0, Number(box.dataset.repos) || 100);
          box.innerHTML = list.length ? list.map(repoCard).join("") : `<li class="muted">No public repositories yet.</li>`;
        });
      })
      .catch(() => {
        repoBoxes.forEach((box) => (box.innerHTML = `<li class="muted">Couldn't load projects right now. Browse them on <a href="https://github.com/${esc(S.github)}?tab=repositories">GitHub</a>.</li>`));
      });
  }

  async function loadRepos() {
    const key = "repos:" + S.github;
    try {
      const c = JSON.parse(sessionStorage.getItem(key));
      if (c && Date.now() - c.t < 10 * 60 * 1000) return c.data;
    } catch {}
    const r = await fetch(`https://api.github.com/users/${encodeURIComponent(S.github)}/repos?per_page=100&sort=updated`);
    if (!r.ok) throw new Error(r.status);
    const data = (await r.json()).map(({ name, html_url, description, language, stargazers_count, forks_count, pushed_at, fork, archived }) =>
      ({ name, html_url, description, language, stargazers_count, forks_count, pushed_at, fork, archived }));
    try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), data })); } catch {}
    return data;
  }

  function repoCard(r) {
    const lang = r.language
      ? `<span><span class="lang-dot" style="background:${langColors[r.language] || "var(--faint)"}"></span>${esc(r.language)}</span>` : "";
    return `<li><a class="card" href="${esc(r.html_url)}" target="_blank" rel="noopener">
      <p class="card-title">${esc(r.name)}${arrow}</p>
      ${r.description ? `<p class="card-desc">${esc(r.description)}</p>` : ""}
      <div class="card-meta">${lang}<span>★ ${r.stargazers_count}</span><span>Updated ${ago(r.pushed_at)}</span></div>
    </a></li>`;
  }

  // ── Blog posts ────────────────────────────────────────
  const fmtDate = (d) => new Date(d + "T00:00:00").toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" });
  $$("[data-posts]").forEach((box) => {
    const posts = (S.posts || []).slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)).slice(0, Number(box.dataset.posts) || 100);
    box.innerHTML = posts.length
      ? posts.map((p) => `<li><a class="card" href="${esc(p.url)}">
          <p class="card-title">${esc(p.title)}${arrow}</p>
          ${p.description ? `<p class="card-desc">${esc(p.description)}</p>` : ""}
          <div class="card-meta"><time datetime="${esc(p.date)}">${esc(fmtDate(p.date))}</time></div>
        </a></li>`).join("")
      : `<li class="muted">No posts yet.</li>`;
  });

  // ── YouTube videos ────────────────────────────────────
  $$("[data-videos]").forEach((box) => {
    const vids = (S.videos || []).slice(0, Number(box.dataset.videos) || 100);
    if (!vids.length) {
      box.innerHTML = `<a class="card" href="${esc(S.youtube)}" target="_blank" rel="noopener">
        <p class="card-title">Watch on YouTube${arrow}</p>
        <p class="card-desc" style="margin:0">Videos about Linux, networking and software — new uploads land on the channel first.</p>
      </a>`;
      return;
    }
    box.innerHTML = `<div class="video-grid">${vids.map((v) => `
      <div class="video">
        <button class="thumb" data-id="${esc(v.id)}" aria-label="Play ${esc(v.title)}"
          style="background-image:url('https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg')"></button>
        <p class="video-title">${esc(v.title)}</p>
        ${v.date ? `<span class="card-meta">${esc(ago(v.date))}</span>` : ""}
      </div>`).join("")}</div>`;
    box.addEventListener("click", (e) => {
      const btn = e.target.closest(".thumb");
      if (!btn) return;
      const f = document.createElement("iframe");
      f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(btn.dataset.id)}?autoplay=1`;
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      f.allowFullscreen = true;
      f.title = btn.getAttribute("aria-label");
      btn.replaceWith(f);
    });
  });
})();
