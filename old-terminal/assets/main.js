(() => {
  const S = window.SITE || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const promptHTML = (path = "~") =>
    `<span class="prompt">${esc(S.user)}@${esc(S.host)}<span class="sym">:</span><span class="path">${esc(path)}</span><span class="sym">$</span></span>`;

  // Fill every prompt placeholder.
  $$("[data-prompt]").forEach((el) => (el.innerHTML = promptHTML(el.dataset.prompt || "~")));
  $$("[data-github-link]").forEach((el) => { el.href = `https://github.com/${S.github}`; el.textContent ||= `github.com/${S.github}`; });
  $$("[data-youtube-link]").forEach((el) => { el.href = S.youtube; el.textContent ||= S.youtube.replace(/^https?:\/\/(www\.)?/, ""); });
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  // ── Typing animation ──────────────────────────────────
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const seenKey = "typed:" + location.pathname;
  let seen = false;
  try { seen = sessionStorage.getItem(seenKey) === "1"; sessionStorage.setItem(seenKey, "1"); } catch {}

  const screen = $(".screen");
  const blocks = $$(".screen > .cmd, .screen > .out");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function animate() {
    document.documentElement.classList.add("js-anim");
    blocks.forEach((b) => b.classList.add("pending"));
    for (const b of blocks) {
      b.classList.remove("pending");
      if (b.classList.contains("cmd")) {
        const t = $(".text", b);
        const full = t.textContent;
        t.textContent = "";
        const cur = document.createElement("span");
        cur.className = "cursor";
        b.appendChild(cur);
        await sleep(180);
        for (const ch of full) { t.textContent += ch; await sleep(28 + Math.random() * 40); }
        await sleep(140);
        cur.remove();
      } else {
        await sleep(60);
      }
    }
  }

  const ready = (!reduce && !seen && blocks.length) ? animate() : Promise.resolve();

  // ── Interactive shell ─────────────────────────────────
  const inputLine = $(".input-line");
  const input = $(".input-line input");
  const pagePath = screen?.dataset.path || "~";

  const pages = { "~": "index.html", home: "index.html", github: "github.html", youtube: "youtube.html" };

  const commands = {
    help: () => `<span class="yellow">available commands:</span>
  <span class="green">whoami</span>      about me
  <span class="green">github</span>      my GitHub projects
  <span class="green">youtube</span>     my YouTube videos
  <span class="green">cd</span> &lt;page&gt;   go to ~, github, youtube
  <span class="green">ls</span>          list pages
  <span class="green">date</span>        print the date
  <span class="green">clear</span>       clear the screen
  <span class="green">help</span>        this message`,
    ls: () => `<span class="blue bold">github/</span>  <span class="blue bold">youtube/</span>  about.txt`,
    whoami: () => go("home"),
    home: () => go("home"),
    github: () => go("github"),
    youtube: () => go("youtube"),
    cd: (arg) => go(arg || "~"),
    date: () => esc(new Date().toString()),
    pwd: () => `/home/${esc(S.user)}${pagePath === "~" ? "" : "/" + esc(pagePath.replace("~/", ""))}`,
    echo: (...a) => esc(a.join(" ")),
    clear: () => { $$(".screen > :not(.input-line)").forEach((n) => n.remove()); return null; },
    sudo: () => `<span class="red">${esc(S.user)} is not in the sudoers file. This incident will be reported.</span>`,
    exit: () => `<span class="dim">there is no escape. try </span><span class="green">help</span>`,
  };

  function go(target) {
    const key = target.replace(/^~\/?/, "").replace(/\/$/, "") || "~";
    const page = pages[key] || (key === ".." ? "index.html" : null);
    if (!page) return `<span class="red">cd: no such file or directory: ${esc(target)}</span>`;
    location.href = page;
    return null;
  }

  function print(cmdText, outHTML) {
    const c = document.createElement("p");
    c.className = "line cmd";
    c.innerHTML = `${promptHTML(pagePath)} <span class="text"></span>`;
    $(".text", c).textContent = cmdText;
    screen.insertBefore(c, inputLine);
    if (outHTML != null) {
      const o = document.createElement("div");
      o.className = "out line";
      o.innerHTML = outHTML;
      screen.insertBefore(o, inputLine);
    }
  }

  const history = [];
  let hIdx = 0;

  if (input) {
    $(".prompt-slot", inputLine).innerHTML = promptHTML(pagePath);
    ready.then(() => { inputLine.hidden = false; if (matchMedia("(pointer: fine)").matches) input.focus({ preventScroll: true }); });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const raw = input.value.trim();
        input.value = "";
        if (!raw) { print("", null); return; }
        history.push(raw); hIdx = history.length;
        const [name, ...args] = raw.split(/\s+/);
        const fn = commands[name.toLowerCase()];
        const out = fn ? fn(...args) : `<span class="red">command not found: ${esc(name)}</span>  <span class="dim">— type</span> <span class="green">help</span>`;
        if (name.toLowerCase() !== "clear") print(raw, out);
        input.scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        if (hIdx > 0) input.value = history[--hIdx];
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        input.value = hIdx < history.length - 1 ? history[++hIdx] : ((hIdx = history.length), "");
        e.preventDefault();
      } else if (e.key === "Tab") {
        e.preventDefault();
        const v = input.value;
        const m = Object.keys(commands).filter((k) => k.startsWith(v));
        if (m.length === 1) input.value = m[0] + " ";
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault(); commands.clear();
      }
    });

    screen.addEventListener("click", () => { if (!getSelection().toString()) input.focus({ preventScroll: true }); });
  }

  // ── GitHub page ───────────────────────────────────────
  const repoBox = $("#repos");
  if (repoBox) {
    const langColor = { JavaScript: "yellow", TypeScript: "blue", Python: "cyan", Go: "cyan", Shell: "green", Rust: "red", C: "dim", "C++": "magenta", HTML: "red", Dockerfile: "blue", Lua: "blue", Kotlin: "magenta", Java: "red", Jinja: "yellow" };
    const fmtDate = (d) => new Date(d).toLocaleDateString("en", { month: "short", day: "2-digit", year: "numeric" });

    fetch(`https://api.github.com/users/${encodeURIComponent(S.github)}/repos?per_page=100&sort=updated`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((repos) => {
        const list = repos
          .filter((r) => !r.fork && !r.archived)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, S.githubRepoLimit || 12);
        if (!list.length) { repoBox.innerHTML = `<span class="dim">total 0</span>`; return; }
        const rows = list.map((r) => `<tr>
          <td class="dim">drwxr-xr-x</td>
          <td class="yellow">★ ${r.stargazers_count}</td>
          <td class="${langColor[r.language] || "dim"}">${esc(r.language || "-")}</td>
          <td class="dim">${fmtDate(r.pushed_at)}</td>
          <td><a href="${esc(r.html_url)}" target="_blank" rel="noopener" class="blue bold">${esc(r.name)}/</a></td>
          <td class="desc">${esc(r.description || "")}</td>
        </tr>`).join("");
        repoBox.innerHTML = `<span class="dim">total ${list.length}</span><div class="listing-wrap"><table class="listing">${rows}</table></div>`;
      })
      .catch(() => {
        repoBox.innerHTML = `<span class="red">ls: cannot reach api.github.com</span> <span class="dim">— browse them directly at</span> <a href="https://github.com/${esc(S.github)}?tab=repositories" target="_blank" rel="noopener">github.com/${esc(S.github)}</a>`;
      });
  }

  // ── YouTube page ──────────────────────────────────────
  const vidBox = $("#videos");
  if (vidBox) {
    const vids = S.videos || [];
    if (!vids.length) {
      vidBox.innerHTML = `<span class="dim">total 0 — no videos listed yet. Visit the channel:</span> <a href="${esc(S.youtube)}" target="_blank" rel="noopener">${esc(S.youtube)}</a>`;
    } else {
      vidBox.innerHTML = `<span class="dim">total ${vids.length}</span><div class="videos">${vids.map((v) => `
        <div class="video">
          <button class="thumb" data-id="${esc(v.id)}" aria-label="Play ${esc(v.title)}"
            style="background-image:url('https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg')"></button>
          <div class="meta"><span class="green">▸</span> ${esc(v.title)}${v.date ? `<br><span class="dim">${esc(v.date)}</span>` : ""}</div>
        </div>`).join("")}</div>`;
      vidBox.addEventListener("click", (e) => {
        const btn = e.target.closest(".thumb");
        if (!btn) return;
        const f = document.createElement("iframe");
        f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(btn.dataset.id)}?autoplay=1`;
        f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        f.allowFullscreen = true;
        btn.replaceWith(f);
      });
    }
  }
})();
