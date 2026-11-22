/* =========================================================================
   Sadaqah Stories — Application Logic (v2)
   Bilingual (EN/AR) with RTL. Flow:
     Home → Language → Age → Age-hub → Module selector → Module → Completion
   No dependencies. 9 playable mini-games preserved from v1.
   ========================================================================= */

(function () {
  "use strict";
  const D = window.SADAQAH_DATA;
  const ASSET = "assets/";
  // merge Arabic content into module arrays
  if (window.mergeArabic) window.mergeArabic();
  function validLang(v) { return v === "en" || v === "ar" ? v : null; }
  function validAge(v) { return v === "7-10" || v === "11-14" || v === "15-18" ? v : null; }

  /* ----------------------------- State ---------------------------------- */
  const state = {
    route: "home",
    params: {},
    lang: validLang(localStorage.getItem("ss_lang")) || "en",
    prefLang: validLang(localStorage.getItem("ss_lang")) || validLang(localStorage.getItem("ss_pref_lang")) || "en",
    age: validAge(localStorage.getItem("ss_age")),   // "7-10" | "11-14" | "15-18"
    lastModule: null,          // for completion screen context
    simId: "water",
    simYear: 0,
    storyArt: 0,
    storyPage: 0,
    storyQuery: "",
    lexQuery: "",
    stars: Number(localStorage.getItem("ss_stars") || 0),
    badges: JSON.parse(localStorage.getItem("ss_badges") || "[]"),
    wall: JSON.parse(localStorage.getItem("ss_wall") || "[]"),
    stats: JSON.parse(localStorage.getItem("ss_stats") || '{"modulesDone":[],"storiesRead":[],"gamesPlayed":[]}'),
    _mem: null, _fill: null, _tree: null, _comm: null, _zakat: null,
    _chain: null, _waqf: null, _dilemma: null, _calc: null,
  };

  function save() {
    localStorage.setItem("ss_stars", String(state.stars));
    localStorage.setItem("ss_badges", JSON.stringify(state.badges));
    localStorage.setItem("ss_wall", JSON.stringify(state.wall));
    localStorage.setItem("ss_stats", JSON.stringify(state.stats));
    if (state.lang) { localStorage.setItem("ss_lang", state.lang); localStorage.setItem("ss_pref_lang", state.lang); state.prefLang = state.lang; }
    else localStorage.removeItem("ss_lang");
    if (state.age) localStorage.setItem("ss_age", state.age);
  }
  function t(key) { return window.t ? window.t(key, state.lang) : key; }
  function L(obj, field) { return window.L ? window.L(obj, field, state.lang) : (obj ? obj[field] : ""); }
  const isRTL = () => state.lang === "ar";

  function track(stat, id) {
    state.stats[stat] = state.stats[stat] || [];
    if (!state.stats[stat].includes(id)) { state.stats[stat].push(id); save(); }
  }
  function addStars(n, reason) {
    state.stars += n; save(); refreshStars();
    if (reason) toast("+" + n + " " + t("stars.count") + " — " + reason);
  }
  function awardBadge(id) {
    if (!state.badges.find((b) => b.id === id)) {
      state.badges.push({ id });
      save();
      toast(t("badge.earned") + ": " + t("b." + id));
      return true;
    }
    return false;
  }

  let toastTimer;
  function toast(msg) {
    let el = document.getElementById("ss-toast");
    if (!el) { el = document.createElement("div"); el.id = "ss-toast"; el.className = "ss-toast"; document.body.appendChild(el); }
    el.textContent = msg; el.style.display = "block";
    clearTimeout(toastTimer); toastTimer = setTimeout(() => (el.style.display = "none"), 2600);
  }
  function refreshStars() { const el = document.getElementById("ss-star-count"); if (el) el.textContent = state.stars; }

  /* ----------------------------- Router --------------------------------- */
  // Each screen gets its own URL hash (#/route or #/route/id) so the browser
  // Back button, reloads and bookmarks work inside the app.
  const ROUTES = ["home","language","age","hub","modules","module-a","story","module-b","module-c","play","module-d","sample","helping-hands","lexic","about","progress","complete"];
  const NEEDS_LANG = ["age","hub","modules","module-a","story","module-b","module-c","play","module-d","sample","helping-hands","lexic","progress","complete"];
  const NEEDS_AGE = ["hub","modules","module-a","story","module-b","module-c","play","module-d","sample","helping-hands","lexic","complete"];
  function routeHash(route, params) {
    return "#/" + route + (params && params.id != null && params.id !== "" ? "/" + encodeURIComponent(params.id) : "");
  }
  function parseHash() {
    const parts = (location.hash || "").replace(/^#\/?/, "").split("/");
    const route = ROUTES.includes(parts[0]) ? parts[0] : "home";
    const params = parts[1] ? { id: decodeURIComponent(parts[1]) } : {};
    return { route, params };
  }
  function go(route, params, opts) {
    opts = opts || {};
    params = params || {};
    // A deep link or Back press can land on a screen that needs a language or age.
    if (NEEDS_LANG.includes(route) && !state.lang) { state.lang = state.prefLang || "en"; save(); }
    if (NEEDS_AGE.includes(route) && !state.age) { route = "age"; params = {}; }
    if (route === "story" && opts.fromHistory) state.storyPage = 0;
    state.route = route; state.params = params;
    if (route === "play" && params.id) track("gamesPlayed", params.id);
    if (route === "story" && params.id) track("storiesRead", params.id);
    if (route === "home") { state.lang = null; save(); }
    const hash = routeHash(route, params);
    try {
      if (opts.replace) history.replaceState({ route, params }, "", hash);
      else if (!opts.fromHistory && location.hash !== hash) history.pushState({ route, params }, "", hash);
    } catch (err) { /* history API unavailable (e.g. file:// in some browsers) */ }
    render();
    window.scrollTo({ top: 0, behavior: opts.fromHistory ? "auto" : "smooth" });
  }
  window.addEventListener("popstate", function () {
    const r = parseHash();
    go(r.route, r.params, { fromHistory: true });
  });

  // Logical parent of each screen, used by the on-page back link.
  const PARENT = {
    language: "home", age: "language", hub: "age", modules: "hub",
    "module-a": "modules", "module-b": "modules", "module-c": "modules", "module-d": "modules",
    "helping-hands": "modules", lexic: "modules",
    story: "module-a", play: "module-c", sample: "module-d",
    about: "home", complete: "modules",
  };
  function backLink() {
    if (state.route === "home") return "";
    let to = PARENT[state.route];
    if (state.route === "progress") to = state.age && state.lang ? "modules" : "home";
    if (!to) return "";
    const label = { home: t("nav.home"), modules: t("nav.modules"), "module-a": t("nav.allStories"), "module-c": t("nav.allGames"), "module-d": t("nav.wall") }[to] || t("nav.back");
    return `<button type="button" class="ss-back" data-go="${to}">${label}</button>`;
  }

  /* ----------------------------- Shell ---------------------------------- */
  function dirAttr() { return isRTL() ? "rtl" : "ltr"; }
  function applyDir() { document.documentElement.setAttribute("dir", dirAttr()); document.documentElement.setAttribute("lang", state.lang || "en"); }

  function shell(inner) {
    applyDir();
    return `
      <div class="ss-topbar">
        <div class="ss-brand" data-act="go-home">
          <img src="${ASSET}icon_tree.png" alt="">
          <div>
            <div class="ss-brand-name">${t("brand.name")}</div>
            <span class="ss-brand-sub">${t("brand.sub")}</span>
          </div>
        </div>
        <div class="ss-spacer"></div>
        <div class="ss-stars" data-go="progress">
          ⭐ <span id="ss-star-count">${state.stars}</span>
        </div>
        ${state.lang ? `<button class="ss-lang-toggle" data-act="toggle-lang">${state.lang === "en" ? "العربية" : "English"}</button>` : ""}
      </div>
      <div class="ss-wrap">
        <div class="ss-view">${backLink()}${inner}</div>
        <footer class="ss-footer">
          <div class="ss-footer-en" dir="ltr">${window.SADAQAH_I18N.en.footer}</div>
          <div class="ss-footer-ar" dir="rtl">${window.SADAQAH_I18N.ar.footer}</div>
        </footer>
      </div>`;
  }

  /* ----------------------------- HOME ----------------------------------- */
  function home() {
    const en = window.SADAQAH_I18N.en, ar = window.SADAQAH_I18N.ar;
    const logos = () => `<div class="ss-logos">
      <img src="${ASSET}nuq.jpg" alt="Northwestern University in Qatar">
      <img src="${ASSET}qrdi.svg" alt="QRDI Council">
      <img src="${ASSET}raca.png" alt="RACA">
    </div>`;
    return `
      <div class="ss-hero ss-hero-home">
        <div class="ss-home-logo"><img src="${ASSET}icon_tree.png" alt=""></div>
        <div class="ss-project-title">
          <div dir="ltr">${en["project.title"]}</div>
          <div dir="rtl">${ar["project.title"]}</div>
        </div>
        <div class="ss-bilingual">
          <div class="ss-lang-block ss-lang-en" dir="ltr">
            <h1>${en["home.h1"]}</h1>
            <p>${en["home.p"]}</p>
            <p class="ss-funding">${en["home.funding"]}</p>
          </div>
          <div class="ss-lang-block ss-lang-ar" dir="rtl">
            <h1>${ar["home.h1"]}</h1>
            <p>${ar["home.p"]}</p>
            <p class="ss-funding">${ar["home.funding"]}</p>
          </div>
        </div>
        <div class="ss-cta" style="margin-top:24px;">
          <button class="ss-btn ss-btn-primary ss-btn-lg" data-go="language">${en["home.cta.start"]} / ${ar["home.cta.start"]}</button>
          <button class="ss-btn ss-btn-ghost" data-go="about">${en["about.title"]} / ${ar["about.title"]}</button>
        </div>
        ${logos()}
      </div>`;
  }

  /* ----------------------------- LANGUAGE ------------------------------- */
  function language() {
    return `
      <div class="ss-center-screen">
        <h2 class="ss-prompt">${t("home.lang")}</h2>
        <p class="ss-prompt-sub">${t("home.lang.sub")}</p>
        <div class="ss-choice-row">
          <button class="ss-big-choice" data-act="pick-lang" data-lang="en" dir="ltr">
            <span class="ss-bc-emoji">🇬🇧</span><span class="ss-bc-label">English</span>
          </button>
          <button class="ss-big-choice" data-act="pick-lang" data-lang="ar" dir="rtl">
            <span class="ss-bc-emoji">📖</span><span class="ss-bc-label">العربية</span>
          </button>
        </div>
      </div>`;
  }

  /* ----------------------------- AGE ------------------------------------ */
  function age() {
    const ages = [["7-10","age.7-10"],["11-14","age.11-14"],["15-18","age.15-18"]];
    return `
      <div class="ss-center-screen">
        <h2 class="ss-prompt">${t("home.age")}</h2>
        <p class="ss-prompt-sub">${t("home.age.sub")}</p>
        <div class="ss-choice-row">
          ${ages.map(([a,key]) => `
            <button class="ss-big-choice" data-act="pick-age" data-age="${a}">
              <span class="ss-bc-emoji">${ageEmoji(a)}</span>
              <span class="ss-bc-label">${t(key)}</span>
            </button>`).join("")}
        </div>
      </div>`;
  }
  function ageEmoji(a) { return a === "7-10" ? "🌱" : a === "11-14" ? "🏗️" : "🌍"; }

  /* ----------------------------- AGE HUB -------------------------------- */
  function hub() {
    const age = state.age || "7-10";
    if (!state.age) state.age = age;
    return `
      <div class="ss-hub-screen">
        <div class="ss-hub-emoji">${ageEmoji(state.age)}</div>
        <h2 class="ss-hub-title">${t("hub." + state.age + ".title")}</h2>
        <p class="ss-hub-desc">${t("hub." + state.age + ".desc")}</p>
        <button class="ss-btn ss-btn-primary ss-btn-lg" data-go="modules">${t("nav.continue")} →</button>
      </div>`;
  }

  /* ----------------------------- MODULE SELECTOR ------------------------ */
  function modules() {
    const mods = [
      { go: "module-a", label: t("mod.stories"), desc: t("mod.stories.desc"), art: "rumah_a.jpeg" },
      { go: "module-b", label: t("mod.impact"), desc: t("mod.impact.desc"), art: "water_a.jpeg" },
      { go: "module-c", label: t("mod.games"), desc: t("mod.games.desc"), art: "trees_b.jpeg" },
      { go: "module-d", label: t("mod.wall"), desc: t("mod.wall.desc"), art: "food_parcel_a.jpeg" },
      { go: "helping-hands", label: t("mod.help"), desc: t("mod.help.desc"), art: "child_donate.jpeg" },
      { go: "lexic", label: t("mod.lexic"), desc: t("mod.lexic.desc"), art: "stories_en/en_22_p1.jpg" },
    ];
    return `
      <div class="ss-section-head">
        <h2>${t("hub." + state.age + ".title")}</h2>
        <p>${t("hub." + state.age + ".desc")}</p>
      </div>
      ${dailyCard()}
      <div class="ss-modules">
        ${mods.map((m, i) => `
          <div class="ss-mod-card" data-go="${m.go}">
            <div class="ss-mod-art" style="background-image:url('${ASSET}${m.art}')"></div>
            <div class="ss-mod-body">
              <h3>${m.label}</h3>
              <p>${m.desc}</p>
              <span class="ss-mod-go">${t("mod.enter")} →</span>
            </div>
          </div>`).join("")}
      </div>`;
  }

  /* ----------------------------- DAILY SADAQAH CHALLENGE -----------------
     One small act per day from SADAQAH_DAILY, chosen by the local date so
     everyone sees the same challenge on the same day. "I did it" gives one
     star, once per day. */
  function todayKey() { const d = new Date(); return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate(); }
  function dailyItem() {
    const list = window.SADAQAH_DAILY || []; if (!list.length) return null;
    const d = new Date(); const dayNum = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
    return list[dayNum % list.length];
  }
  function dailyCard() {
    const it = dailyItem(); if (!it) return "";
    const ar = isRTL();
    let done = false; try { done = localStorage.getItem("ss_daily_done") === todayKey(); } catch (err) {}
    return `
      <div class="ss-daily" aria-label="${ar?"تحدي الصدقة اليومي":"Daily Sadaqah challenge"}">
        <div class="ss-daily-e">${it.e}</div>
        <div class="ss-daily-body">
          <div class="ss-daily-k">${ar?"تحدي الصدقة اليوم":"Today's Sadaqah challenge"}</div>
          <div class="ss-daily-t">${ar?it.ar:it.en}</div>
          <p class="ss-daily-why">${ar?it.why_ar:it.why_en} <a href="${esc(it.url)}" target="_blank" rel="noopener noreferrer">${ar?it.ref_ar:it.ref_en} ↗</a></p>
        </div>
        <div class="ss-daily-act">${done
          ? `<span class="ss-daily-done">✓ ${ar?"أنجزته اليوم. عُد غداً لتحدٍّ جديد.":"Done today. Come back tomorrow for a new one."}</span>`
          : `<button class="ss-btn ss-btn-teal" data-act="daily-done">${ar?"فعلتُها!":"I did it!"}</button>`}</div>
      </div>`;
  }

  /* ----------------------------- MODULE A (stories) ---------------------
     Uses the extracted 41-story dataset (SADAQAH_STORIES) which overrides the
     legacy 10-story MODULE_A. Each story = 4 pages (image + paragraph). */
  const STORIES = window.SADAQAH_STORIES || { en: [], ar: [] };
  function stories() { return STORIES[state.lang] || STORIES.en; }

  function moduleA() {
    const list = stories();
    const q = (state.storyQuery || "").toLowerCase();
    const filtered = q ? list.filter((s) => s.title.toLowerCase().includes(q) || s.pages.some((p) => (p.text || "").toLowerCase().includes(q))) : list;
    const readIds = (state.stats && state.stats.storiesRead) || [];
    return `
      <div class="ss-section-head">
        <h2>${t("mod.stories")}</h2>
        <p>${t("mod.stories.desc")}</p>
      </div>
      <div class="ss-search-bar">
        <input type="search" id="ss-story-search" placeholder="${t("search.stories")}" value="${state.storyQuery || ""}" data-act-input="story-search">
        <span class="ss-search-count">${filtered.length} / ${list.length}</span>
      </div>
      <div class="ss-grid">
        ${filtered.map((s) => {
          const idx = list.indexOf(s) + 1;
          const read = readIds.includes(s.id);
          return `
          <div class="ss-story-card" data-act="open-story" data-id="${s.id}">
            <div class="ss-art" style="background-image:url('${ASSET}${s.pages[0].img}')"></div>
            ${read ? '<span class="ss-read-badge">✓</span>' : ''}
            <div class="ss-body">
              <div class="ss-num">${t("story.of")} ${idx} / ${list.length}</div>
              <h4>${s.title}</h4>
              <div class="ss-evidence-mini">${esc(s.evidenceStatus || "")}</div>
            </div>
          </div>`;
        }).join("")}
      </div>
      ${filtered.length === 0 ? `<div class="ss-empty">${t("search.none")}</div>` : ''}`;
  }
  function storyView() {
    const list = stories();
    const s = list.find((x) => x.id === (state.params.id || ""));
    if (!s) return `<div class="ss-empty">${t("nav.allStories")}</div>`;
    const idx = list.indexOf(s) + 1;
    const page = Math.min(state.storyPage || 0, s.pages.length - 1);
    const pg = s.pages[page];
    const last = page === s.pages.length - 1;
    return `
      <div class="ss-flipbook">
        <div class="ss-fb-head">
          <div class="ss-num">${t("story.of")} ${idx} / ${list.length}</div>
          <h2 class="ss-detail-title">${s.title}</h2>
        </div>
        <div class="ss-fb-page">
          <div class="ss-fb-img"><img src="${ASSET}${pg.img}" alt="" loading="lazy" decoding="async"></div>
          <div class="ss-fb-text ${page===0?'ss-dropcap':''}">${pg.text}</div>
        </div>
        <div class="ss-story-evidence" aria-label="Source and evidence status">
          <div class="ss-evidence-label">${isRTL()?"حالة التوثيق":"Evidence status"}: ${esc(s.evidenceStatus || "")}</div>
          <div class="ss-evidence-disclaimer">${isRTL()?"الصور رسوم توضيحية وليست توثيقاً مصوراً للوقائع. وقد لا تؤيد المصادر كل تفصيل تفسيري.":"Illustrations are artistic interpretations, not historical photographs. Linked sources may not substantiate every interpretive detail."}</div>
          <div class="ss-evidence-links">${(s.sources||[]).map((v,i)=>`<a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer" aria-label="${isRTL()?"المصدر":"Source"} ${i+1}: ${esc(v.name)}">${isRTL()?"المصدر":"Source"} ${i+1} ↗</a>`).join(" ")}</div>
        </div>
        <div class="ss-fb-nav">
          <button class="ss-fb-arrow" data-act="fb-prev" ${page===0?'disabled':''}>${isRTL()?"→":"←"}</button>
          <div class="ss-fb-dots">${s.pages.map((_,i)=>`<span class="ss-fb-dot ${i===page?'on':''}" data-act="fb-goto" data-page="${i}"></span>`).join("")}</div>
          <button class="ss-fb-arrow" data-act="fb-next" ${last?'disabled':''}>${isRTL()?"←":"→"}</button>
        </div>
        ${(last && window.SADAQAH_VIDEOS && window.SADAQAH_VIDEOS[s.id]) ? `<div class="ss-story-video"><div class="ss-video"><iframe src="https://www.youtube-nocookie.com/embed/${window.SADAQAH_VIDEOS[s.id]}?rel=0" title="YouTube video player" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div>` : ''}
        ${last ? storyQuiz(s) : ''}
        ${last ? `<button class="ss-btn ss-btn-primary ss-btn-done" data-act="finish-module" data-mod="stories">${t("complete.opt.progress")} →</button>` : ''}
      </div>`;
  }

  /* ---- Story quiz: 3 questions on the last page, from SADAQAH_QUIZ ----
     In the data the correct option is always first; here the options are
     shuffled in a fixed order per question so the answer is not always first. */
  function seededOrder(key, n) {
    let h = 2166136261;
    for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    const idx = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) { h = (Math.imul(h, 1103515245) + 12345) >>> 0; const j = h % (i + 1); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    return idx;
  }
  function storyQuiz(s) {
    const Q = window.SADAQAH_QUIZ; const qs = Q && Q[state.lang] && Q[state.lang][s.id];
    if (!qs) return "";
    if (!state.quiz || state.quiz.id !== s.id) state.quiz = { id: s.id, ans: {} };
    const st = state.quiz, ar = isRTL();
    const items = qs.map((q, qi) => {
      const order = seededOrder(s.id + "-" + qi, q[1].length), picked = st.ans[qi];
      const opts = order.map((oi) => {
        let cls = ""; if (picked != null) { if (oi === 0) cls = "right"; else if (oi === picked) cls = "wrong"; }
        return `<button class="ss-quiz-opt ${cls}" data-act="quiz" data-q="${qi}" data-o="${oi}" ${picked != null ? "disabled" : ""}>${q[1][oi]}</button>`;
      }).join("");
      const fb = picked == null ? "" : picked === 0
        ? `<p class="ss-quiz-fb ok">${ar ? "إجابة صحيحة!" : "Correct!"}</p>`
        : `<p class="ss-quiz-fb no">${ar ? "الإجابة الصحيحة باللون الأخضر." : "The right answer is in green."} <button type="button" class="ss-linkbtn" data-act="fb-goto" data-page="${q[2] - 1}">${ar ? "ارجع إلى الصفحة " + q[2] : "See page " + q[2]}</button></p>`;
      return `<div class="ss-quiz-q"><p class="ss-quiz-text"><strong>${qi + 1}.</strong> ${q[0]}</p><div class="ss-quiz-opts">${opts}</div>${fb}</div>`;
    }).join("");
    const answered = Object.keys(st.ans).length, score = Object.values(st.ans).filter((v) => v === 0).length;
    return `<div class="ss-quiz"><h3>${ar ? "اختبر فهمك" : "Quick check"}</h3>${items}
      ${answered === qs.length ? `<p class="ss-quiz-score">${ar ? `أجبت إجابة صحيحة عن ${score} من ${qs.length}.` : `You got ${score} of ${qs.length} right.`}</p>` : ""}</div>`;
  }

  /* ----------------------------- MODULE B (impact) ---------------------- */
  function moduleB() {
    const sim = D.MODULE_B.find((p) => p.id === state.simId) || D.MODULE_B[0];
    const yi = state.simYear;
    const yr = sim.years[yi];
    return `
      <div class="ss-section-head">
        <h2>${t("mod.impact")}</h2>
        <p>${t("impact.progression")}</p>
        <p class="ss-editorial-note">${isRTL()?"الأرقام والتكاليف والنتائج افتراضية للتعليم، وليست بيانات مشروع حقيقي أو توقعات مضمونة للعائد أو الأثر.":"Illustrative, hypothetical costs and outcomes only, not verified project data or guaranteed forecasts of charitable impact."}</p>
      </div>
      <div class="ss-sim-tabs">
        ${D.MODULE_B.map((p) => `
          <button class="ss-sim-tab ${p.id===sim.id?'active':''}" data-act="pick-sim" data-sim="${p.id}">${p.icon} ${L(p,"name")}</button>`).join("")}
      </div>
      <div class="ss-sim">
        <div class="ss-sim-head">
          <div class="ss-sim-illu">${impactArt(sim, yi)}</div>
          <div>
            <h3>${sim.icon} ${L(sim,"title")}</h3>
            <div class="ss-cost">${t("impact.cost")}: ${L(sim,"cost")}</div>
            <p class="ss-sim-overview">${L(sim,"overview")}</p>
          </div>
        </div>
        <div class="ss-year-rail">
          ${sim.years.map((y,i) => `
            <button class="ss-year-btn ${i===yi?'active':''}" data-act="pick-year" data-year="${i}">
              ${t("year."+["1","5","10","20"][i])}<small>${L(y,"metric")}</small>
            </button>`).join("")}
        </div>
        <div class="ss-year-panel">
          <div class="ss-year-prog">${[0,1,2,3].map((i) => `<span class="${i<=yi?'on':''}"></span>`).join("")}</div>
          <h3 class="ss-year-h">${t("year."+["1","5","10","20"][yi])}</h3>
          <div class="ss-year-metric">${L(yr,"metric")}</div>
          <ul>${(L(yr,"points") || yr.points).map((p) => `<li>${p}</li>`).join("")}</ul>
        </div>
        ${sim.how ? `<div class="ss-sim-how"><h4>${isRTL()?"كيف قدّرنا هذه الأرقام":"How these numbers are estimated"}</h4><p>${L(sim,"how")}</p></div>` : ""}
      </div>
      <button class="ss-btn ss-btn-primary ss-btn-done" data-act="finish-module" data-mod="impact">${t("complete.opt.progress")} →</button>`;
  }

  /* ---- CSS/SVG year-progression illustrations ----
     Each project draws a simple SVG that grows/progresses Y1→Y20.
     Palette: warm gold/teal matching the app. */
  /* ---- Impact imagery (Adobe Firefly assets with year progression) ----
     Each project carries a `years_art` array: [y1, y5, y10, y20] filenames
     in assets/. If a per-year file is missing (404), the <img> falls back
     to the project's main `art` image via onerror. A CSS class (yr-1..yr-20)
     layers a visual progression effect (scale / saturation / brightness) so
     Y1 -> Y20 visibly "grows" even with a single image.

     TO SWAP IMAGES (for the receiving team):
       1. Export 4 Firefly images per project, named: <id>_y1.jpg, _y5.jpg,
          _y10.jpg, _y20.jpg (e.g. water_y1.jpg ... water_y20.jpg).
       2. Drop them into the assets/ folder.
       3. Update the matching years_art array in data.js if your filenames
          differ. Done — no code changes needed.
  */
  function impactArt(project, yearIdx) {
    const yrClass = ["yr-1", "yr-5", "yr-10", "yr-20"][yearIdx];
    const yearFiles = (project.years_art && project.years_art.length === 4)
      ? project.years_art
      : [project.art, project.art, project.art, project.art];
    const fallback = project.art;
    const file = yearFiles[yearIdx] || fallback;
    // onerror: if the per-year image is absent, fall back to the main art,
    // then strip the handler so it doesn't loop.
    return `<img class="ss-sim-img ${yrClass}" src="${ASSET}${file}" alt="${L(project,"title")}"
      onerror="if(this.src.indexOf('${ASSET}${fallback}')<0){this.src='${ASSET}${fallback}';}else{this.onerror=null;}">`;
  }

  /* ----------------------------- MODULE C (games) ----------------------- */
  // Only the games for the selected age are shown. No age headers, no concept
  // paragraphs, no "Learning:" lines — just title + concept sketch + Play.
  function moduleC() {
    const group = D.MODULE_C.find((g) => g.age === state.age) || D.MODULE_C[0];
    return `
      <div class="ss-section-head">
        <h2>${t("mod.games")}</h2>
      </div>
      <div class="ss-game-grid">
        ${group.games.map((g) => `
          <div class="ss-game-card">
            <div class="ss-gtop">
              <span class="ss-gicon">${g.icon}</span>
              <h4>${L(g,"title")}</h4>
            </div>
            <div class="ss-game-sketch">${gameSketch(g.id)}</div>
            <button class="ss-btn ss-btn-teal ss-play" data-go="play" data-id="${g.id}">▶ ${t("games.play")}</button>
          </div>`).join("")}
      </div>`;
  }
  // Illustrated concept sketch per game — watercolor palette, animated.
  function gameSketch(id) {
    const W = (inner) => `<svg viewBox="0 0 120 60" class="ss-sketch">${inner}</svg>`;
    const s = {
      // Cards: two face-down, one matched pair glowing (memory game)
      "charity-match": W(`<rect x="6" y="12" width="24" height="32" rx="4" fill="#c79a3a" class="ss-anim-float"/><text x="18" y="32" text-anchor="middle" font-size="14" fill="#fff">?</text>
        <rect x="36" y="12" width="24" height="32" rx="4" fill="#5b8c4f" stroke="#3f6b35" stroke-width="2" class="ss-anim-glow"/><path d="M48 22 l2.4 4.8 5.2.8-3.8 3.6.9 5.2-4.7-2.4-4.7 2.4.9-5.2-3.8-3.6 5.2-.8z" fill="#fff"/>
        <rect x="66" y="12" width="24" height="32" rx="4" fill="#c79a3a" class="ss-anim-float" style="animation-delay:.4s"/><text x="78" y="32" text-anchor="middle" font-size="14" fill="#fff">?</text>
        <rect x="96" y="12" width="24" height="32" rx="4" fill="#2f8f87" opacity=".85"/><text x="108" y="32" text-anchor="middle" font-size="14" fill="#fff">?</text>`),
      // Donation box with items dropping in
      "fill-box": W(`<rect x="30" y="26" width="60" height="28" rx="3" fill="#e8d5a8" stroke="#c79a3a" stroke-width="2"/><rect x="40" y="20" width="40" height="8" fill="#c79a3a"/><circle cx="46" cy="12" r="6" fill="#e8a23a" class="ss-anim-drop"/><rect x="60" y="6" width="10" height="10" rx="2" fill="#c66b6b" class="ss-anim-drop" style="animation-delay:.5s"/><path d="M80 14 l3 6 6 .9-4.4 4.2 1 6-5.6-3-5.6 3 1-6-4.4-4.2 6-.9z" fill="#5b8c4f" class="ss-anim-drop" style="animation-delay:1s"/>`),
      // Tree growth stages + water drop
      "giving-tree": W(`<circle cx="14" cy="46" r="3" fill="#5b8c4f"/><circle cx="30" cy="42" r="4.5" fill="#5b8c4f"/><circle cx="52" cy="34" r="7" fill="#5b8c4f"/><circle cx="84" cy="26" r="12" fill="#5b8c4f"/><circle cx="84" cy="26" r="12" fill="none" stroke="#3f6b35" stroke-width="1.5"/><rect x="82" y="36" width="4" height="14" fill="#6b5a48"/><path d="M60 8 c-3 4-5 7-5 10 a5 5 0 0 0 10 0 c0-3-2-6-5-10z" fill="#2f8f87" class="ss-anim-float"/>`),
      // Village skyline: well, school, clinic
      "build-community": W(`<rect x="4" y="28" width="22" height="24" fill="#e8d5a8" stroke="#c79a3a"/><path d="M4 28 l11-8 11 8" fill="#c79a3a"/><rect x="48" y="22" width="24" height="30" fill="#2f8f87"/><rect x="52" y="28" width="6" height="8" fill="#fff"/><rect x="62" y="28" width="6" height="8" fill="#fff"/><rect x="94" y="30" width="22" height="22" rx="2" fill="#c66b6b"/><rect x="99" y="36" width="12" height="3" fill="#fff"/><rect x="103.5" y="32" width="3" height="11" fill="#fff"/><circle cx="26" cy="20" r="4" fill="#5b8c4f" class="ss-anim-glow"/>`),
      // Person chip dropping into labeled bin
      "sort-zakat": W(`<rect x="8" y="18" width="34" height="34" rx="3" fill="none" stroke="#6b5a48" stroke-width="2" stroke-dasharray="4 3"/><rect x="78" y="18" width="34" height="34" rx="3" fill="#c79a3a"/><text x="25" y="38" text-anchor="middle" font-size="7" fill="#6b5a48">؟</text><text x="95" y="38" text-anchor="middle" font-size="7" fill="#fff">✓</text><circle cx="60" cy="10" r="6" fill="#e8c4a0" stroke="#c79a3a" class="ss-anim-drop"/><rect x="55" y="17" width="10" height="12" rx="2" fill="#2f8f87" class="ss-anim-drop"/><path d="M42 30 q18-14 36 0" fill="none" stroke="#c79a3a" stroke-width="1.5" stroke-dasharray="3 3"/>`),
      // Ripple chain with growing impact
      "chain-reaction": W(`<circle cx="10" cy="30" r="4" fill="#c79a3a"/><circle cx="34" cy="30" r="7" fill="#e8a23a"/><circle cx="62" cy="30" r="10" fill="#5b8c4f"/><circle cx="96" cy="30" r="14" fill="#2f8f87" class="ss-anim-glow"/><line x1="14" y1="30" x2="27" y2="30" stroke="#6b5a48" stroke-width="1.5"/><line x1="41" y1="30" x2="52" y2="30" stroke="#6b5a48" stroke-width="1.5"/><line x1="72" y1="30" x2="82" y2="30" stroke="#6b5a48" stroke-width="1.5"/><path d="M96 16 c-2 3-3 5-3 7a3 3 0 0 0 6 0c0-2-1-4-3-7z" fill="#fff"/>`),
      // Building with coin flow
      "waqf-architect": W(`<rect x="8" y="14" width="34" height="40" fill="#e8d5a8" stroke="#c79a3a" stroke-width="2"/><rect x="14" y="20" width="8" height="8" fill="#c79a3a"/><rect x="28" y="20" width="8" height="8" fill="#c79a3a"/><rect x="14" y="32" width="8" height="8" fill="#c79a3a"/><rect x="28" y="32" width="8" height="8" fill="#c79a3a"/><circle cx="70" cy="20" r="7" fill="#c79a3a" class="ss-anim-float"/><text x="70" y="24" text-anchor="middle" font-size="10" fill="#fff">$</text><path d="M80 22 q14 4 12 16" fill="none" stroke="#5b8c4f" stroke-width="2" stroke-dasharray="4 3"/><rect x="88" y="34" width="24" height="20" rx="2" fill="#5b8c4f"/><text x="100" y="47" text-anchor="middle" font-size="8" fill="#fff">٪</text>`),
      // Balance scale, two options
      "giving-dilemma": W(`<rect x="57" y="12" width="5" height="34" fill="#6b5a48"/><line x1="30" y1="14" x2="90" y2="14" stroke="#6b5a48" stroke-width="3" class="ss-anim-tilt"/><circle cx="60" cy="14" r="4" fill="#c79a3a"/><path d="M30 14 l-8 12 h16 z" fill="#2f8f87"/><path d="M90 14 l-8 12 h16 z" fill="#c66b6b"/><rect x="46" y="46" width="28" height="5" rx="2" fill="#6b5a48"/><text x="22" y="40" text-anchor="middle" font-size="7" fill="#2f8f87">A</text><text x="98" y="40" text-anchor="middle" font-size="7" fill="#c66b6b">B</text>`),
      // Calculator + rising chart
      "impact-calc": W(`<rect x="8" y="10" width="26" height="40" rx="3" fill="#2f8f87"/><rect x="12" y="14" width="18" height="8" rx="1" fill="#fff"/><rect x="12" y="26" width="5" height="5" fill="#fff"/><rect x="19" y="26" width="5" height="5" fill="#fff"/><rect x="26" y="26" width="5" height="5" fill="#e8a23a"/><rect x="12" y="33" width="5" height="5" fill="#fff"/><rect x="19" y="33" width="5" height="5" fill="#fff"/><rect x="26" y="33" width="5" height="5" fill="#fff"/><rect x="12" y="40" width="12" height="5" fill="#e8a23a"/><rect x="26" y="40" width="5" height="5" fill="#fff"/><rect x="44" y="38" width="8" height="12" fill="#e8d5a8"/><rect x="56" y="30" width="8" height="20" fill="#c79a3a"/><rect x="68" y="22" width="8" height="28" fill="#5b8c4f"/><rect x="80" y="14" width="8" height="36" fill="#2f8f87"/><rect x="92" y="8" width="8" height="42" fill="#1f6b64" class="ss-anim-grow"/><circle cx="96" cy="4" r="3" fill="#c79a3a" class="ss-anim-glow"/>`),
    };
    // Signpost with three directions (branching story)
    s["choose-path"] = W(`<rect x="58" y="10" width="4" height="46" fill="#6b5a48"/><path d="M62 14 h30 l8 6 -8 6 h-30z" fill="#2f8f87" class="ss-anim-float"/><path d="M58 28 h-30 l-8 6 8 6 h30z" fill="#c79a3a"/><path d="M62 42 h22 l7 5 -7 5 h-22z" fill="#5b8c4f" class="ss-anim-float" style="animation-delay:.5s"/><ellipse cx="60" cy="56" rx="18" ry="3" fill="#e8d5a8"/>`);
    return s[id] || s["charity-match"];
  }

  /* ----------------------------- MODULE D (wall) ------------------------ */
  function moduleD() {
    const imgs = ["food_parcel_a.jpeg","education.jpeg","child_donate.jpeg","food_a.jpeg","water_b.jpeg"];
    return `
      <div class="ss-section-head">
        <h2>${t("wall.guidelines")}</h2>
        <p>${t("wall.guidelinesDesc")}</p>
      </div>
      <div class="ss-guide-grid">
        ${D.MODULE_D.guidelines.map((g,i) => `
          <div class="ss-guide-card">
            <h4>${i+1}. ${L(g,"title")}</h4>
            <div class="ss-do"><div class="ss-list-h">✔ ${t("wall.do")}</div><ul>${(L(g,"do")||g.do).map((d)=>`<li>${d}</li>`).join("")}</ul></div>
            <div class="ss-dont"><div class="ss-list-h">✘ ${t("wall.dont")}</div><ul>${(L(g,"dont")||g.dont).map((d)=>`<li>${d}</li>`).join("")}</ul></div>
          </div>`).join("")}
      </div>
      <div class="ss-section-head" style="margin-top:36px;">
        <h2>${t("nav.wall")}</h2>
      </div>
      <p class="ss-editorial-note">${isRTL()?"القصص الخمس التالية أمثلة تخيلية للتدريب على الكتابة، وليست شهادات واقعية أو حملات تبرع مؤكدة.":"The five example stories below are fictional writing exercises, not verified testimonials or documented fundraising projects."}</p>
      <div class="ss-wall">
        ${D.MODULE_D.samples.map((s,i) => `
          <div class="ss-wall-card" data-go="sample" data-id="${i}">
            <div class="ss-wall-img" style="background-image:url('${ASSET}${imgs[i]}')"></div>
            <div class="ss-wall-body"><h4>${L(s,"title")}</h4><p class="ss-teaser">${L(s,"teaser")}</p></div>
          </div>`).join("")}
        ${state.wall.map((s,i) => `
          <div class="ss-wall-card" data-act="read-own" data-idx="${i}">
            <div class="ss-wall-img" style="background-image:url('${ASSET}icon_donation.png');background-size:60%;background-color:var(--bg-soft)"></div>
            <div class="ss-wall-body"><h4>${esc(s.title)}</h4><p class="ss-teaser">${t("wall.by")} ${esc(s.author)} — ${t("wall.yourStory")}</p></div>
          </div>`).join("")}
      </div>
      <div class="ss-submit">
        <h3>${t("wall.share")}</h3>
        <p class="ss-submit-sub">${t("wall.shareDesc")}</p>
        <div class="ss-field"><label>${t("wall.author")}</label><input id="ss-f-author" placeholder="..."></div>
        <div class="ss-field"><label>${t("wall.title")}</label><input id="ss-f-title" placeholder="..."></div>
        <div class="ss-field"><label>${t("wall.body")}</label><textarea id="ss-f-body" rows="7" placeholder="${t("wall.bodyPlaceholder")}"></textarea>
          <div class="ss-counter"><span id="ss-wc">0</span> ${t("wall.words")} · ${t("wall.wordTarget")}</div></div>
        <button class="ss-btn ss-btn-primary" data-act="submit-story">${t("wall.post")} →</button>
      </div>`;
  }
  function sampleView() {
    const s = D.MODULE_D.samples[Number(state.params.id||0)];
    if (!s) return `<div class="ss-empty"></div>`;
    const body = L(s,"body"); const arr = Array.isArray(body) ? body : s.body;
    return `
      <h2 class="ss-detail-title">${L(s,"title")}</h2>
      <p class="ss-teaser">${L(s,"teaser")}</p>
      <p class="ss-editorial-note">${isRTL()?"مثال تخيلي للكتابة. ليس شهادة واقعية أو مشروعاً موثقاً.":"Fictional writing example. Not a factual personal testimony or verified project."}</p>
      <div class="ss-prose">${arr.map((p)=>`<p>${p}</p>`).join("")}</div>`;
  }

  /* ----------------------------- PROGRESS / BADGES ---------------------- */
  function progress() {
    const all = ["explorer","matcher","grower","zakat","builder","architect","reader","simulator","writer"];
    const imgs = { explorer:"icon_badge.png", matcher:"icon_donation.png", grower:"icon_tree.png", zakat:"icon_zakat.png", builder:"mosque.jpeg", architect:"education.jpeg", reader:"icon_badge.png", simulator:"water_a.jpeg", writer:"icon_donation.png" };
    return `
      <div class="ss-badge-screen">
        <img src="${ASSET}icon_badge.png" alt="">
        <h2 class="ss-badge-h">${t("badges.title")}</h2>
        <p class="ss-badge-sub">⭐ <strong>${state.stars}</strong> ${t("badges.earned")} · ${state.badges.length}/${all.length} ${t("badges.unlocked")}</p>
        <div class="ss-stats-row">
          <div class="ss-stat"><div class="ss-stat-n">${state.stats.modulesDone?.length || 0}</div><div class="ss-stat-l">${t("badges.modulesDone")}</div></div>
          <div class="ss-stat"><div class="ss-stat-n">${state.stats.storiesRead?.length || 0}</div><div class="ss-stat-l">${t("badges.storiesRead")}</div></div>
          <div class="ss-stat"><div class="ss-stat-n">${state.stats.gamesPlayed?.length || 0}</div><div class="ss-stat-l">${t("badges.gamesPlayed")}</div></div>
        </div>
        <div class="ss-badge-list">
          ${all.map((id) => `<div class="ss-badge ${state.badges.find(b=>b.id===id)?'earned':''}"><img src="${ASSET}${imgs[id]}" alt=""><span>${t("b."+id)}</span></div>`).join("")}
        </div>
        <p class="ss-badge-hint">${t("badges.hint")}</p>
      </div>`;
  }

  /* ----------------------------- COMPLETION ----------------------------- */
  function complete() {
    const mod = state.lastModule || "stories";
    const modLabel = { stories: t("mod.stories"), impact: t("mod.impact"), games: t("mod.games"), wall: t("mod.wall") }[mod] || "";
    track("modulesDone", mod);
    return `
      <div class="ss-complete-screen">
        <div class="ss-complete-badge"><img src="${ASSET}icon_badge.png" alt=""></div>
        <h2 class="ss-complete-title">${t("complete.title")}</h2>
        <p class="ss-complete-mod">${modLabel}</p>
        <p class="ss-complete-earned">${t("complete.badge")} 🏆</p>
        <div class="ss-complete-opts">
          <button class="ss-btn ss-btn-ghost" data-go="modules">↩ ${t("complete.opt.return")}</button>
          <button class="ss-btn ss-btn-primary" data-go="progress">📊 ${t("complete.opt.progress")}</button>
          <button class="ss-btn ss-btn-teal" data-go="module-d">✍ ${t("complete.opt.share")}</button>
        </div>
      </div>`;
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])); }

  /* ========================================================================
     PLAYABLE GAMES (preserved + i18n strings)
     ======================================================================== */
  const MATCH_PAIRS = [
    { a:{en:"Water Well",ar:"بئر ماء"}, b:"🚰", note:{en:"A water well is Sadaqah Jariyah — it keeps giving even after you're gone!",ar:"بئر الماء صدقة جارية — يبقى عطاؤها حتى بعد رحيلك!"} },
    { a:{en:"Orphan",ar:"يتيم"}, b:"🧑‍🍼", note:{en:"The Prophet (pbuh) said he and the orphan's sponsor will be neighbours in Paradise.",ar:"قال النبي ﷺ إنه وكافل اليتيم في الجنة كهاتين."} },
    { a:{en:"Mosque",ar:"مسجد"}, b:"🕌", note:{en:"Whoever builds a mosque for Allah, Allah builds a house for him in Paradise.",ar:"من بنى لله مسجداً بنى الله له بيتاً في الجنة."} },
    { a:{en:"School",ar:"مدرسة"}, b:"📚", note:{en:"Knowledge shared multiplies — like Fatima al-Fihri's Al-Qarawiyyin.",ar:"العلم يتناسخ بالعطاء — كجامعة القرويين."} },
    { a:{en:"Food / Iftar",ar:"طعام / إفطار"}, b:"🍪", note:{en:"Whoever feeds a fasting person has the same reward as them.",ar:"من فطّر صائماً فله مثل أجره."} },
    { a:{en:"Zakat",ar:"زكاة"}, b:"⚖️", note:{en:"Zakat purifies wealth and is given to 8 categories.",ar:"الزكاة تطهّر المال وتُصرف لثماني مصارف."} },
    { a:{en:"Doctor",ar:"طبيب"}, b:"🩺", note:{en:"Relieving a believer's hardship earns relief in the next world.",ar:"تفريج الكرب في الدنيا يجلب تفريجاً في الآخرة."} },
    { a:{en:"Sadaqah",ar:"صدقة"}, b:"💜", note:{en:"Every good act — even a smile — is charity.",ar:"كل معروف صدقة — حتى الابتسامة."} },
  ];
  function gCharityMatch() {
    const cards = [];
    MATCH_PAIRS.forEach((p,i) => { cards.push({k:i,face:p.a,b:p.b,note:p.note,t:"word"}); cards.push({k:i,face:p.a,b:p.b,note:p.note,t:"pic"}); });
    shuffle(cards);
    state._mem = { cards, flipped: [], matched: [], moves: 0, locked: false };
    return memField();
  }
  function memField() {
    const m = state._mem;
    return `
      <h3 class="ss-game-title">🧰 ${gt("charity-match")}</h3>${howto("charity-match")}
      <p class="ss-game-sub">${m.matched.length}/${MATCH_PAIRS.length}</p>
      <div class="ss-mem-grid">
        ${m.cards.map((c,i) => {
          const shown = m.flipped.includes(i) || m.matched.includes(c.k);
          const done = m.matched.includes(c.k);
          const face = c.t === "word" ? `<span class="ss-label">${c.face[state.lang]}</span>` : c.b;
          return `<div class="ss-mem-card ${shown?'flipped':''} ${done?'done':''}" data-act="mem" data-mem="${i}">${shown?face:"?"}</div>`;
        }).join("")}
      </div>
      ${m.matched.length===MATCH_PAIRS.length ? `<div class="ss-game-win">🎉</div><button class="ss-btn ss-btn-primary ss-btn-done" data-act="finish-module" data-mod="games">${t("complete.opt.progress")} →</button>` : ""}`;
  }
  function memClick(i) {
    const m = state._mem;
    if (m.locked || m.flipped.includes(i) || m.matched.includes(m.cards[i].k)) return;
    m.flipped.push(i);
    if (m.flipped.length === 2) {
      m.moves++;
      const [a,b] = m.flipped; const ca = m.cards[a], cb = m.cards[b];
      if (ca.k === cb.k && ca.t !== cb.t) {
        m.matched.push(ca.k); m.flipped = [];
        toast(ca.note[state.lang]); addStars(1, t("toast.match"));
        if (m.matched.length === MATCH_PAIRS.length) { awardBadge("matcher"); if (m.moves <= MATCH_PAIRS.length) addStars(5, t("toast.flawless")); }
      } else { m.locked = true; setTimeout(() => { m.flipped = []; m.locked = false; rerenderGame(); }, 900); }
    }
    rerenderGame();
  }

  /* ---- Fill the Box ---- */
  const FILL_ITEMS = { food:"🍚", water:"💧", blanket:"🛏️", clothing:"👕", book:"📖", pencil:"✏️", medicine:"💊" };
  const FILL_NAMES = {
    food:{en:"Food",ar:"طعام"}, water:{en:"Water",ar:"ماء"}, blanket:{en:"Blanket",ar:"بطانية"}, clothing:{en:"Warm clothes",ar:"ملابس دافئة"},
    book:{en:"Book",ar:"كتاب"}, pencil:{en:"Pencil",ar:"قلم"}, medicine:{en:"Medicine",ar:"دواء"},
  };
  function fillName(k) { const n = FILL_NAMES[k]; return n ? (state.lang==="ar" ? n.ar : n.en) : k; }
  function fillField() {
    const scenes = [
      { need_en:"Cold at night", need_ar:"برد في الليل", emoji:"🥶", want:["blanket","clothing"], shelf:["blanket","clothing","book","medicine"] },
      { need_en:"Hungry family", need_ar:"أسرة جائعة", emoji:"🥺", want:["food","water"], shelf:["food","water","book","blanket"] },
      { need_en:"Child with no books", need_ar:"طفل بلا كتب", emoji:"🧑", want:["book","pencil"], shelf:["book","pencil","medicine","blanket"] },
      { need_en:"Sick, no medicine", need_ar:"مريض بلا دواء", emoji:"🤒", want:["medicine","water"], shelf:["medicine","water","food","pencil"] },
    ];
    if (!state._fill) state._fill = { scene:0, placed:[], done:false, scenes };
    const f = state._fill;
    const sc = f.scenes[f.scene];
    const allGood = sc.want.every(w => f.placed.includes(w));
    return `
      <h3 class="ss-game-title">📦 ${gt("fill-box")}</h3>${howto("fill-box")}
      <p class="ss-game-sub">${f.scene+1}/${f.scenes.length}</p>
      <div class="ss-drop-scene">
        <div class="ss-drop-need"><div class="ss-emoji">${allGood?"😊":sc.emoji}</div><div style="font-weight:700;">${state.lang==="ar"?sc.need_ar:sc.need_en}</div></div>
        <div class="ss-drop-box" id="ss-dropbox">${f.placed.map(p=>`<span class="ss-chip"><span class="ss-ie">${FILL_ITEMS[p]}</span>${fillName(p)}</span>`).join("")}</div>
      </div>
      <div class="ss-shelf">${sc.shelf.map(it=>`<button type="button" class="ss-item" data-act="fill" data-item="${it}"><span class="ss-ie">${FILL_ITEMS[it]}</span>${fillName(it)}</button>`).join("")}</div>
      ${f.done?`<div class="ss-game-win">🎉</div><button class="ss-btn ss-btn-primary ss-btn-done" data-act="finish-module" data-mod="games">${t("complete.opt.progress")} →</button>`:""}`;
  }
  function fillDrop(item) {
    const f = state._fill; if (!f) return; const sc = f.scenes[f.scene];
    if (sc.want.includes(item) && !f.placed.includes(item)) {
      f.placed.push(item); toast(t("toast.correct"));
      if (sc.want.every(w=>f.placed.includes(w))) {
        addStars(2,"✓");
        setTimeout(() => { f.scene++; f.placed=[]; if (f.scene>=f.scenes.length){f.scene=f.scenes.length-1;f.done=true;awardBadge("explorer");} rerenderGame(); }, 700);
      }
    } else if (!sc.want.includes(item)) { toast(t("toast.tryAgain")); }
    rerenderGame();
  }

  /* ---- Giving Tree ---- */
  const TREE_Q = [
    { q_en:"What do we call charity that keeps giving after we're gone?", q_ar:"ماذا نسمي الصدقة التي يبقى عطاؤها بعد رحيلنا؟",
      opts:[{e:"🌳",t_en:"Sadaqah Jariyah",t_ar:"صدقة جارية",ok:true},{e:"💵",t_en:"A one-off gift",t_ar:"هدية لمرة واحدة"},{e:"🎁",t_en:"A present",t_ar:"هدية"}] },
    { q_en:"Which of these is Sadaqah Jariyah?", q_ar:"أيٌّ مما يلي صدقة جارية؟",
      opts:[{e:"🍪",t_en:"A biscuit",t_ar:"بسكويت"},{e:"🚰",t_en:"A water well",t_ar:"بئر ماء",ok:true},{e:"💵",t_en:"A coin",t_ar:"عملة"}] },
    { q_en:"Building what earns a house in Paradise?", q_ar:"بناء ماذا يكسب بيتاً في الجنة؟",
      opts:[{e:"🕌",t_en:"A mosque",t_ar:"مسجداً",ok:true},{e:"🏠",t_en:"Own house",t_ar:"بيتك"},{e:"🚧",t_en:"A fence",t_ar:"سوراً"}] },
    { q_en:"Even a ____ is charity, said the Prophet (pbuh).", q_ar:"حتى ____ صدقة، قال النبي ﷺ.",
      opts:[{e:"😊",t_en:"Smile",t_ar:"الابتسامة",ok:true},{e:"💵",t_en:"Coin",t_ar:"عملة"},{e:"🍪",t_en:"Biscuit",t_ar:"بسكويت"}] },
  ];
  const TREE_STAGES = ["🌱","🌿","☘️","🌳"];
  function treeField() {
    const tr = state._tree; if (!tr) return "";
    if (tr.q >= TREE_Q.length) { awardBadge("grower"); return `<div class="ss-tree-win">🌳</div><p>${state.lang==="ar"?"نمت شجرة صدقتك الجارية!":"Your Sadaqah Jariyah tree is fully grown!"}</p><button class="ss-btn ss-btn-primary ss-btn-done" data-act="finish-module" data-mod="games">${t("complete.opt.progress")} →</button>`; }
    const item = TREE_Q[tr.q];
    return `
      <h3 class="ss-game-title">🌳 ${gt("giving-tree")}</h3>${howto("giving-tree")}
      <div class="ss-tree-stage"><div class="ss-tree-emoji">${TREE_STAGES[tr.stage]}</div><div class="ss-tree-stage-n">${tr.stage}/${TREE_STAGES.length-1}</div></div>
      <div class="ss-tree-q">${state.lang==="ar"?item.q_ar:item.q_en}</div>
      <div class="ss-opts">${item.opts.map((o,i)=>`<button class="ss-opt" data-act="tree" data-tree="${i}"><span class="ss-oe">${o.e}</span>${state.lang==="ar"?o.t_ar:o.t_en}</button>`).join("")}</div>`;
  }
  function gGivingTree() { state._tree = { q:0, stage:0 }; return treeField(); }
  function treeAnswer(i) {
    const tr = state._tree; const item = TREE_Q[tr.q];
    if (item.opts[i].ok) { tr.stage = Math.min(tr.stage+1, TREE_STAGES.length-1); tr.q++; addStars(1,"✓"); } else { toast(t("toast.tryAgain")); }
    rerenderGame();
  }

  /* ---- Build Community ---- */
  const COMM_PROJECTS = [
    { id:"well", cost:8000, emoji:"🚰", happy:25, vuln:5, n_en:"Water well", n_ar:"بئر ماء", d_en:"Clean water for the village", d_ar:"ماء نظيف للقرية" },
    { id:"school", cost:6000, emoji:"📚", happy:20, vuln:10, n_en:"School", n_ar:"مدرسة", d_en:"Education for children", d_ar:"تعليم للأطفال" },
    { id:"clinic", cost:7000, emoji:"💚", happy:18, vuln:15, n_en:"Health clinic", n_ar:"مستوصف", d_en:"Healthcare access", d_ar:"وصول للرعاية الصحية" },
    { id:"kitchen", cost:3000, emoji:"🍚", happy:12, vuln:20, n_en:"Food kitchen", n_ar:"مطبخ خيري", d_en:"Daily meals", d_ar:"وجبات يومية" },
    { id:"orphan", cost:4000, emoji:"🧑‍🍼", happy:8, vuln:25, n_en:"Orphan sponsorship", n_ar:"كفالة يتيم", d_en:"Support the vulnerable", d_ar:"دعم الأشد ضعفاً" },
  ];
  const BUDGET = 10000;
  function commField() {
    const c = state._comm; if (!c) return "";
    const spent = c.picked.reduce((s,p)=>s+p.cost,0);
    if (c.outcome) {
      const score = Math.min(100, c.outcome.happy + c.outcome.vuln);
      return `<h3 class="ss-game-title">🏘️</h3><p class="ss-game-sub">${state.lang==="ar"?"النتيجة":"Score"}: <strong>${score}/100</strong></p><div class="ss-budget-bar"><span style="width:${score}%"></span></div>
        <div class="ss-comm-grid">${c.picked.map(p=>`<div class="ss-proj-pick selected"><div class="ss-pi">${p.emoji}</div><div class="ss-pn">${state.lang==="ar"?p.n_ar:p.n_en}</div></div>`).join("")}</div>
        <button class="ss-btn ss-btn-primary ss-btn-done" data-act="finish-module" data-mod="games">${t("complete.opt.progress")} →</button>`;
    }
    return `<h3 class="ss-game-title">🏘️ ${gt("build-community")}</h3>${howto("build-community")}
      <p class="ss-game-sub">$${spent.toLocaleString()} / $${BUDGET.toLocaleString()}</p>
      <div class="ss-budget-bar"><span style="width:${(spent/BUDGET)*100}%"></span></div>
      <div class="ss-comm-grid">${COMM_PROJECTS.map(p=>{
        const sel=c.picked.find(x=>x.id===p.id); const can=!sel&&spent+p.cost<=BUDGET;
        return `<button class="ss-proj-pick ${sel?'selected':''}" data-act="comm" data-comm="${p.id}" ${(!sel&&!can)?'disabled style="opacity:.4"':''}><div class="ss-pi">${p.emoji}</div><div class="ss-pc">$${p.cost.toLocaleString()}</div><div class="ss-pn">${state.lang==="ar"?p.n_ar:p.n_en}</div></button>`;
      }).join("")}</div>
      <button class="ss-btn ss-btn-primary" style="margin-top:14px;" data-act="comm-confirm" ${c.picked.length===0?'disabled':''}>${state.lang==="ar"?"ابنِ القرية":"Build"} →</button>`;
  }
  function gBuildCommunity() { state._comm = { picked:[], outcome:null }; return commField(); }
  function commToggle(id) { const c=state._comm; const p=COMM_PROJECTS.find(x=>x.id===id); const ex=c.picked.find(x=>x.id===id); const spent=c.picked.reduce((s,x)=>s+x.cost,0); if(ex)c.picked=c.picked.filter(x=>x.id!==id); else if(spent+p.cost<=BUDGET)c.picked.push(p); rerenderGame(); }
  function commConfirm() { const c=state._comm; c.outcome={happy:c.picked.reduce((s,p)=>s+p.happy,0),vuln:c.picked.reduce((s,p)=>s+p.vuln,0)}; addStars(3,"✓"); if(c.outcome.vuln>=20)awardBadge("builder"); rerenderGame(); }

  /* ---- Sort Zakat ---- */
  const ZAKAT_CATS = [
    {id:"fuqara",n_en:"The Poor",n_ar:"الفقراء",d_en:"Those who have little",d_ar:"من يملكون القليل"},
    {id:"masakin",n_en:"The Needy",n_ar:"المساكين",d_en:"Those in hardship",d_ar:"في شدّة"},
    {id:"amilun",n_en:"Collectors",n_ar:"العاملون",d_en:"Employed to collect Zakat",d_ar:"العاملون على الزكاة"},
    {id:"muallaf",n_en:"Hearts Reconciled",n_ar:"المؤلّفة قلوبهم",d_en:"Hearts to be reconciled",d_ar:"تأليف القلوب"},
    {id:"riqab",n_en:"Captives",n_ar:"الرقاب",d_en:"To free captives",d_ar:"عتق الأسرى"},
    {id:"gharimun",n_en:"Debtors",n_ar:"الغارمون",d_en:"Cannot pay debts",d_ar:"عاجزون عن الديون"},
    {id:"sabil",n_en:"In Allah's Cause",n_ar:"في سبيل الله",d_en:"In the cause of Allah",d_ar:"في سبيل الله"},
    {id:"ibn-sabil",n_en:"Travellers",n_ar:"ابن السبيل",d_en:"Stranded travellers",d_ar:"المسافر المحتاج"},
  ];
  const ZAKAT_CHARS = [
    {n_en:"Ahmad ran out of money far from home.",n_ar:"أحمد نفد ماله بعيداً عن وطنه.",cat:"ibn-sabil"},
    {n_en:"A man cannot repay his loan.",n_ar:"رجل لا يقدر على سداد قرضه.",cat:"gharimun"},
    {n_en:"A widow struggles to feed her children.",n_ar:"أرملة تجد صعوبة في إطعام أطفالها.",cat:"fuqara"},
    {n_en:"A new Muslim seeking community.",n_ar:"مسلم جديد يطلب المجتمع.",cat:"muallaf"},
    {n_en:"A state Zakat collector.",n_ar:"عامل على جمع الزكاة.",cat:"amilun"},
    {n_en:"A captive whose ransom can be paid.",n_ar:"أسير يُمكن فداؤه.",cat:"riqab"},
    {n_en:"A family whose home burned down.",n_ar:"أسرة احترق منزلها.",cat:"masakin"},
    {n_en:"Funds for the community mosque.",n_ar:"أموال لمسجد المجتمع.",cat:"sabil"},
  ];
  function zakatField() {
    const z = state._zakat; if (!z) return "";
    if (z.queue.length===0) { if(z.correct===z.total)awardBadge("zakat"); return `<h3 class="ss-game-title">⚖️</h3><p class="ss-game-sub">${z.correct}/${z.total}</p><button class="ss-btn ss-btn-primary ss-btn-done" data-act="finish-module" data-mod="games">${t("complete.opt.progress")} →</button>`; }
    const cur = z.queue[0];
    return `<h3 class="ss-game-title">⚖️ ${gt("sort-zakat")}</h3>${howto("sort-zakat")}
      <div class="ss-zchar">${state.lang==="ar"?cur.n_ar:cur.n_en}</div>
      <div class="ss-zakat-bins">${ZAKAT_CATS.map(cat=>`<div class="ss-zbin" data-act="zakat" data-zbin="${cat.id}"><h5>${state.lang==="ar"?cat.n_ar:cat.n_en}</h5><div class="ss-zd">${state.lang==="ar"?cat.d_ar:cat.d_en}</div></div>`).join("")}</div>`;
  }
  function gSortZakat() { state._zakat={queue:[...ZAKAT_CHARS],placed:{},correct:0,total:ZAKAT_CHARS.length}; return zakatField(); }
  function zakatDrop(catId){ const z=state._zakat; const cur=z.queue[0]; if(!cur)return; if(cur.cat===catId){z.correct++;toast(t("toast.correct"));addStars(1,"✓");}else{const r=ZAKAT_CATS.find(c=>c.id===cur.cat);toast((state.lang==="ar"?"في ":"In ")+(state.lang==="ar"?r.n_ar:r.n_en));} z.queue.shift(); rerenderGame(); }

  /* ---- Chain Reaction ---- */
  const CHAIN = [
    { en:"Ibrahim digs a water well.", ar:"إبراهيم يحفر بئر ماء.", emoji:"🚰", choices:[{t_en:"Villagers get clean water",t_ar:"الحصول على ماء نظيف",ok:true,next:1},{t_en:"Dries up in a month",t_ar:"يجف في شهر",next:5}] },
    { en:"Women and girls save hours daily.", ar:"النساء والبنات يوفّرن ساعات يومياً.", emoji:"⏱️", choices:[{t_en:"Girls attend school",t_ar:"البنات يلتحقن بالمدرسة",ok:true,next:2},{t_en:"They just rest",t_ar:"يرحن فقط",next:5}] },
    { en:"A generation of girls finishes school.", ar:"جيل من البنات يُكمل المدرسة.", emoji:"🎓", choices:[{t_en:"Some become nurses & teachers",t_ar:"يصبحن ممرضات ومعلمات",ok:true,next:3},{t_en:"They leave the village",t_ar:"يتركن القرية",next:5}] },
    { en:"Educated women strengthen the economy.", ar:"النساء المتعلّمات يقوين الاقتصاد.", emoji:"💼", choices:[{t_en:"Village no longer needs aid",t_ar:"القرية لا تحتاج معونة",ok:true,next:4},{t_en:"Economy collapses",t_ar:"ينهار الاقتصاد",next:5}] },
    { en:"20 years later — a thriving community.", ar:"بعد 20 عاماً — مجتمع مزدهر.", emoji:"🌳", choices:[] },
    { en:"A one-time gift fades quickly.", ar:"هدية لمرة واحدة تتلاشى بسرعة.", emoji:"🍂", choices:[] },
  ];
  function chainField() {
    const c = state._chain; if (!c) return "";
    const node = CHAIN[c.stage];
    const done = node.choices.length===0;
    return `<h3 class="ss-game-title">🔗 ${gt("chain-reaction")}</h3>${howto("chain-reaction")}
      <div class="ss-chain">${[...Array(c.links).keys()].map(i=>{const nd=CHAIN[i<c.links-1?i:c.stage];return `<div class="ss-chain-link"><span class="ss-cln">${i+1}.</span><span style="font-size:24px">${nd.emoji}</span><span>${state.lang==="ar"?nd.ar:nd.en}</span></div>`;}).join("")}</div>
      ${done?`${c.stage===5?`<p class="ss-game-sub">${state.lang==="ar"?"هذا الطريق انتهى سريعاً. جرّب مرة أخرى واختر الخطوة التي تبقي الخير مستمراً.":"This path ended quickly. Try again and pick the step that keeps the good going."}</p><button class="ss-btn ss-btn-ghost" data-act="chain-restart">↻ ${t("nav.restart")}</button> `:""}<button class="ss-btn ss-btn-primary ss-btn-done" data-act="finish-module" data-mod="games">${t("complete.opt.progress")} →</button>`:`<div class="ss-chain-choices">${node.choices.map((ch,i)=>`<button class="ss-opt" data-act="chain" data-chain="${i}">${state.lang==="ar"?ch.t_ar:ch.t_en}</button>`).join("")}</div>`}`;
  }
  function gChainReaction(){state._chain={stage:0,links:1};return chainField();}
  function chainChoose(i){const c=state._chain;const node=CHAIN[c.stage];const ch=node.choices[i];if(ch.ok)addStars(1,"✓");c.stage=ch.next;c.links++;if(c.stage===4)addStars(4,"✓");rerenderGame();}

  /* ---- Waqf Architect ----
     A deterministic 20-year model so the same choices always give the same
     result and players can compare runs. The $50,000 principal is never spent;
     only income is given out. Each asset and each manager has a trade-off and
     dated events. Cause conversion rates match the Real Impact Calculator. */
  const WAQF_START = 50000;
  const WAQF_ASSETS = [
    { id:"property", n_en:"Commercial property", n_ar:"عقار تجاري", ret:0.08,
      d_en:"Rent from shops or offices. Higher income, but buildings need repairs and tenants can leave.",
      d_ar:"إيجار محلات أو مكاتب. ريع أعلى، لكن المباني تحتاج إلى إصلاحات وقد يغادر المستأجرون.",
      events:[ { y:8, kind:"cost", amt:6000, en:"Year 8: the roof needs repair. $6,000 comes out of that year's income.", ar:"السنة 8: يحتاج السقف إلى إصلاح، فيُقتطع 6,000 دولار من ريع تلك السنة." },
               { y:14, kind:"factor", f:0.5, en:"Year 14: a tenant leaves for six months, so that year's income is cut in half.", ar:"السنة 14: يغادر مستأجر لمدة ستة أشهر، فينخفض ريع تلك السنة إلى النصف." } ] },
    { id:"farmland", n_en:"Farmland", n_ar:"أرض زراعية", ret:0.05,
      d_en:"Income from crops. Lower but steady, until a bad harvest.",
      d_ar:"ريع من المحاصيل. أقل لكنه ثابت، إلا إذا ضعف المحصول.",
      events:[ { y:6, kind:"factor", f:0.3, en:"Year 6: drought. The harvest fails and that year's income falls to 30%.", ar:"السنة 6: جفاف يُتلف المحصول، فينخفض ريع تلك السنة إلى 30%." } ] },
    { id:"fund", n_en:"Waqf fund", n_ar:"صندوق وقفي", ret:0.07,
      d_en:"Money spread across many investments. No repairs, but income rises and falls with the markets.",
      d_ar:"مال موزّع على استثمارات كثيرة. لا يحتاج إلى إصلاحات، لكن ريعه يرتفع وينخفض مع الأسواق.",
      events:[ { y:9, kind:"factor", f:0.4, en:"Year 9: markets fall, and that year's income drops to 40%.", ar:"السنة 9: تهبط الأسواق، فينخفض ريع تلك السنة إلى 40%." } ] },
  ];
  const WAQF_CAUSES = [
    { id:"education", n_en:"Education", n_ar:"التعليم", per:480, u_en:"student-years of school", u_ar:"سنوات دراسة ممولة" },
    { id:"healthcare", n_en:"Healthcare", n_ar:"الرعاية الصحية", per:25, u_en:"clinic consultations", u_ar:"استشارات طبية" },
    { id:"water", n_en:"Clean water", n_ar:"الماء النظيف", per:10, u_en:"people given clean water", u_ar:"أشخاص يحصلون على ماء نظيف" },
    { id:"orphan", n_en:"Orphan care", n_ar:"كفالة الأيتام", per:480, u_en:"years of orphan sponsorship", u_ar:"سنوات كفالة أيتام" },
    { id:"emergency", n_en:"Emergency relief", n_ar:"الإغاثة الطارئة", per:80, u_en:"family emergency kits", u_ar:"حقائب طوارئ عائلية" },
  ];
  const WAQF_GOVS = [
    { id:"family", n_en:"Family trustee", n_ar:"ناظر من العائلة", fee:0, keep:0,
      d_en:"No fees. But one family decides everything, with no outside check.",
      d_ar:"بلا رسوم. لكن العائلة وحدها تقرر كل شيء، دون رقابة خارجية.",
      events:[ { y:15, kind:"pause", en:"Year 15: family members disagree about the income, and that year's income goes on settling the dispute.", ar:"السنة 15: يختلف أفراد العائلة على الريع، فيُصرف ريع تلك السنة في تسوية الخلاف." } ] },
    { id:"charity", n_en:"Charity organisation", n_ar:"جمعية خيرية", fee:0.10, keep:0,
      d_en:"Experienced staff who know the cause. Takes 10% of income for running costs.",
      d_ar:"فريق ذو خبرة في المجال. تأخذ 10% من الريع لتكاليف التشغيل.", events:[] },
    { id:"board", n_en:"Independent board", n_ar:"مجلس نظارة مستقل", fee:0.05, keep:0.10,
      d_en:"Audited every year. Takes 5% for costs and puts 10% back into the waqf so it grows.",
      d_ar:"يُدقَّق كل سنة. يأخذ 5% للتكاليف، ويعيد 10% إلى أصل الوقف لينمو.", events:[] },
  ];
  function wq(o, f) { return state.lang==="ar" ? o[f+"_ar"] : o[f+"_en"]; }
  function money(n) { const v = Math.round(n).toLocaleString("en-US"); return state.lang==="ar" ? v + " دولار" : "$" + v; }
  function units(n, c) { const v = n.toLocaleString("en-US"); return state.lang==="ar" ? `${c.u_ar}: ≈ ${v}` : `≈ ${v} ${c.u_en}`; }
  function waqfSimulate(assetId, causeId, govId) {
    const a = WAQF_ASSETS.find(x=>x.id===assetId), g = WAQF_GOVS.find(x=>x.id===govId), c = WAQF_CAUSES.find(x=>x.id===causeId);
    let principal = WAQF_START, given = 0, fees = 0;
    const snaps = {}, log = [];
    for (let y = 1; y <= 20; y++) {
      let income = principal * a.ret;
      a.events.filter(e=>e.y===y).forEach(e => { if (e.kind==="factor") income *= e.f; if (e.kind==="cost") income = Math.max(0, income - e.amt); log.push(e); });
      const fee = income * g.fee, keep = income * g.keep;
      let give = income - fee - keep;
      g.events.filter(e=>e.y===y).forEach(e => { if (e.kind==="pause") give = 0; log.push(e); });
      principal += keep; given += give; fees += fee;
      if ([1,5,10,20].includes(y)) snaps[y] = { given, principal, units: Math.floor(given / c.per) };
    }
    log.sort((p,q)=>p.y-q.y);
    return { snaps, log, given, principal, fees, cause: c };
  }
  function waqfField() {
    const w = state._waqf; if (!w) return "";
    const ar = state.lang==="ar";
    const chosen = (step, label) => `<button type="button" class="ss-waqf-chosen" data-act="waqf-reset" data-step="${step}">✔ ${label} <small>${ar?"(تغيير)":"(change)"}</small></button>`;
    if (!w.ran) {
      const A = WAQF_ASSETS.find(x=>x.id===w.asset), C = WAQF_CAUSES.find(x=>x.id===w.cause), G = WAQF_GOVS.find(x=>x.id===w.gov);
      return `<h3 class="ss-game-title">🏗️ ${gt("waqf-architect")}</h3>${howto("waqf-architect")}
        <p class="ss-waqf-start">${ar?"المبلغ الموقوف":"Your waqf gift"}: <strong>${money(WAQF_START)}</strong>. ${ar?"لا يُنفَق هذا المبلغ أبداً، بل يُعطى ريعه فقط.":"This amount is never spent. Only its income is given away."}</p>
        <div class="ss-waqf-stepper">
          <div class="ss-waqf-step"><h5>1. ${ar?"أين تستثمر المبلغ؟":"What will the money be invested in?"}</h5>${A?chosen("asset", wq(A,"n")):`<div class="ss-opts">${WAQF_ASSETS.map(a=>`<button class="ss-opt" data-act="waqf-asset" data-wa="${a.id}"><span class="ss-oe">${Math.round(a.ret*100)}%</span><strong>${wq(a,"n")}</strong><small>${wq(a,"d")}</small></button>`).join("")}</div>`}</div>
          <div class="ss-waqf-step"><h5>2. ${ar?"إلى أي مجال يذهب الريع؟":"Which cause gets the income?"}</h5>${C?chosen("cause", wq(C,"n")):(A?`<div class="ss-segments">${WAQF_CAUSES.map(c=>`<button class="ss-seg" data-act="waqf-cause" data-wc="${c.id}">${wq(c,"n")}</button>`).join("")}</div>`:'<span class="ss-muted">…</span>')}</div>
          <div class="ss-waqf-step"><h5>3. ${ar?"من يدير الوقف؟":"Who will manage the waqf?"}</h5>${G?chosen("gov", wq(G,"n")):(C?`<div class="ss-opts">${WAQF_GOVS.map(g=>`<button class="ss-opt" data-act="waqf-gov" data-wg="${g.id}"><strong>${wq(g,"n")}</strong><small>${wq(g,"d")}</small></button>`).join("")}</div>`:'<span class="ss-muted">…</span>')}</div>
        </div>
        ${A&&C&&G?`<button class="ss-btn ss-btn-primary" data-act="waqf-run">${ar?"شغّل 20 سنة":"Run 20 years"} →</button>`:''}`;
    }
    const r = waqfSimulate(w.asset, w.cause, w.gov);
    const A = WAQF_ASSETS.find(x=>x.id===w.asset), G = WAQF_GOVS.find(x=>x.id===w.gov);
    const last = state.waqfLast && state.waqfLast.key !== w.asset+w.cause+w.gov ? state.waqfLast : null;
    return `<h3 class="ss-game-title">🏗️ ${gt("waqf-architect")}</h3>
      <p class="ss-game-sub">${wq(A,"n")} · ${wq(r.cause,"n")} · ${wq(G,"n")}</p>
      <div class="ss-infogrid">${[1,5,10,20].map((y,i)=>`<div class="ss-info"><div class="ss-iy">${t("year."+["1","5","10","20"][i])}</div>
        <div class="ss-iv">${money(r.snaps[y].given)}</div><div class="ss-id">${ar?"أُعطي حتى الآن":"given so far"}</div>
        <div class="ss-iu">${units(r.snaps[y].units, r.cause)}</div>
        <div class="ss-id">${ar?"قيمة الوقف":"Waqf value"}: ${money(r.snaps[y].principal)}</div></div>`).join("")}</div>
      ${r.log.length?`<div class="ss-waqf-log"><h5>${ar?"ما الذي حدث خلال 20 سنة":"What happened over 20 years"}</h5><ul>${r.log.map(e=>`<li>${ar?e.ar:e.en}</li>`).join("")}</ul></div>`:''}
      <div class="ss-waqf-lesson">
        <p>${ar?`المبلغ الأصلي (${money(WAQF_START)}) لم يُنفَق، وقيمة الوقف بعد 20 سنة ${money(r.principal)}. لهذا يستمر الوقف في العطاء.`:`The original ${money(WAQF_START)} was never spent, and after 20 years the waqf is worth ${money(r.principal)}. That is why a waqf can keep giving.`}</p>
        ${r.fees>0?`<p>${ar?`ذهب ${money(r.fees)} إلى تكاليف الإدارة.`:`${money(r.fees)} went on management costs.`}</p>`:''}
        ${last?`<p>${ar?`في محاولتك السابقة أعطى الوقف ${money(last.given)} خلال 20 سنة.`:`Your last run gave ${money(last.given)} over 20 years.`}</p>`:''}
        <p class="ss-rate-note">${ar?"الأرقام افتراضية للتعلّم. العائد الحقيقي يتغيّر من سنة إلى أخرى وقد يكون أقل.":"These figures are made up for learning. Real returns change every year and can be lower."}</p>
      </div>
      <button class="ss-btn ss-btn-ghost" data-act="waqf-again">↻ ${ar?"جرّب اختيارات أخرى":"Try other choices"}</button>
      <button class="ss-btn ss-btn-primary ss-btn-done" data-act="finish-module" data-mod="games">${t("complete.opt.progress")} →</button>`;
  }
  function gWaqfArchitect(){state._waqf={asset:null,cause:null,gov:null,ran:false};return waqfField();}
  function waqfRun(){state._waqf.ran=true;awardBadge("architect");addStars(4,"✓");rerenderGame();}
  function waqfAgain(){const w=state._waqf;const r=waqfSimulate(w.asset,w.cause,w.gov);state.waqfLast={key:w.asset+w.cause+w.gov,given:r.given};state._waqf={asset:null,cause:null,gov:null,ran:false};rerenderGame();}
  function waqfReset(step){const w=state._waqf;if(step==="asset"){w.asset=null;w.cause=null;w.gov=null;}if(step==="cause"){w.cause=null;w.gov=null;}if(step==="gov"){w.gov=null;}rerenderGame();}

  /* ---- Giving Dilemma ----
     After each choice the player sees what each option gains and what it
     misses, then moves on. Religious references: Qur'an 2:215,
     Sahih al-Bukhari 1902 and 6464 (checked on sunnah.com). */
  const DILEMMAS=[
    {q_en:"You have $500.",a_en:"Feed 100 families for one day",b_en:"Dig one well serving 50 families for 20 years",q_ar:"لديك 500 دولار.",a_ar:"إطعام 100 أسرة ليوم واحد",b_ar:"حفر بئر تخدم 50 أسرة لـ 20 عاماً",
     na_en:"Food meets an urgent need today. If people have nothing to eat tonight, that need cannot wait.",
     nb_en:"A well gives clean water for many years, so it is Sadaqah Jariyah. But it takes time to build, and it does not feed anyone who is hungry tonight.",
     nt_en:"Neither choice is wrong. The better one depends on what people need most right now.",
     na_ar:"الطعام يسدّ حاجة عاجلة اليوم. فإذا لم يجد الناس ما يأكلونه الليلة، فهذه الحاجة لا تحتمل الانتظار.",
     nb_ar:"البئر تعطي ماءً نظيفاً سنوات طويلة، فهي صدقة جارية. لكن حفرها يحتاج إلى وقت، ولا يُطعم من هو جائع الليلة.",
     nt_ar:"لا يوجد اختيار خاطئ هنا. الأفضل يعتمد على أشد ما يحتاج إليه الناس الآن."},
    {q_en:"You can give $1,000.",a_en:"Emergency relief today",b_en:"A waqf endowment forever",q_ar:"يمكنك التبرّع بـ 1000 دولار.",a_ar:"إغاثة طارئة اليوم",b_ar:"وقف للأبد",
     na_en:"After a disaster, relief in the first days can save lives. That is when help matters most.",
     nb_en:"A waqf keeps the $1,000 and gives away only the income, so it helps every year. But the yearly amount is small, and it lasts only if it is managed well.",
     nt_en:"Many givers do both: some now for emergencies, and some set aside to keep giving.",
     na_ar:"بعد الكارثة، قد تنقذ الإغاثة في الأيام الأولى أرواحاً. ففي ذلك الوقت تكون الحاجة إلى المساعدة في أشدها.",
     nb_ar:"الوقف يحفظ الألف دولار ويُنفق من ريعها فقط، فينفع كل سنة. لكن المبلغ السنوي صغير، ولا يدوم الوقف إلا إذا أُحسنت إدارته.",
     nt_ar:"كثير من المتصدقين يجمعون بين الأمرين: جزء للطوارئ الآن، وجزء يُحبس ليستمر عطاؤه."},
    {q_en:"Sponsor 1 orphan for 10 years.",a_en:"The child nearest to you",b_en:"The most vulnerable far away",q_ar:"اكفل يتيماً لـ 10 سنوات.",a_ar:"الطفل الأقرب إليك",b_ar:"الأشد ضعفاً البعيد",
     na_en:"A child near you is someone you can visit and follow as they grow, and helping them makes your community stronger. When the Qur'an lists who to spend on, it starts with parents and relatives, then orphans, the needy and travellers (Qur'an 2:215).",
     nb_en:"A child far away may be in greater danger and may have no one else to help. A trusted charity can get your support to them.",
     nt_en:"Both are good. Ask who needs it most, and who else is able to help them.",
     na_ar:"الطفل القريب منك تستطيع أن تزوره وتتابع حاله وهو يكبر، ومساعدته تقوّي مجتمعك. وحين يذكر القرآن الكريم من يُنفَق عليهم، يبدأ بالوالدين والأقربين، ثم اليتامى والمساكين وابن السبيل (البقرة: 215).",
     nb_ar:"قد يكون الطفل البعيد في خطر أكبر، وقد لا يجد من يساعده غيرك. ويمكن أن تصل إليه مساعدتك عبر جمعية خيرية موثوقة.",
     nt_ar:"كلا الاختيارين خير. اسأل نفسك: من الأشد حاجة؟ ومن غيري يستطيع أن يساعده؟"},
    {q_en:"$100/month.",a_en:"Small amounts to many",b_en:"One high-impact project",q_ar:"100 دولار شهرياً.",a_ar:"مبالغ صغيرة لعدّة أسباب",b_ar:"مشروع واحد عالي الأثر",
     na_en:"Small gifts to many causes reach more people, and you lose less if one project fails. But each gift may be too small to change much.",
     nb_en:"One strong project can change a lot for a few people. Check it carefully first, because if it fails, all of your gift is affected.",
     nt_en:"Whichever you choose, give through a trustworthy, licensed charity that reports how it uses donations.",
     na_ar:"المبالغ الصغيرة لأسباب كثيرة تصل إلى عدد أكبر من الناس، وتقلّ خسارتك إذا فشل مشروع واحد. لكن كل مبلغ قد يكون أصغر من أن يغيّر الكثير.",
     nb_ar:"المشروع الواحد القوي قد يغيّر الكثير في حياة عدد قليل من الناس. لكن تحقّق منه جيداً أولاً، لأنه إذا فشل تأثّر عطاؤك كله.",
     nt_ar:"مهما اخترت، تبرّع عبر جمعية موثوقة ومرخّصة تنشر كيف تستخدم التبرعات."},
    {q_en:"Ramadan approaches.",a_en:"All charity in Ramadan",b_en:"Spread across the year",q_ar:"يقترب رمضان.",a_ar:"كل الصدقة في رمضان",b_ar:"موزّعة عبر السنة",
     na_en:"Ramadan is a special time for giving: the Prophet ﷺ was most generous in Ramadan (Sahih al-Bukhari 1902). But if all your giving waits for Ramadan, people in need in the other eleven months get nothing from you.",
     nb_en:"Giving through the year means help arrives whenever it is needed. The Prophet ﷺ said the deeds Allah loves most are the regular ones, even if small (Sahih al-Bukhari 6464).",
     nt_en:"Many people do both: they give through the year and give more in Ramadan.",
     na_ar:"رمضان وقت مميز للعطاء، فقد كان النبي ﷺ أجود ما يكون في رمضان (صحيح البخاري 1902). لكن إذا انتظر عطاؤك كله رمضان، فلن يصل منك شيء إلى المحتاجين في الشهور الأحد عشر الأخرى.",
     nb_ar:"العطاء طوال السنة يوصل المساعدة متى احتاج إليها الناس. وقد أخبر النبي ﷺ أن أحب الأعمال إلى الله أدومها وإن قلّ (صحيح البخاري 6464).",
     nt_ar:"يجمع كثير من الناس بين الأمرين: يعطون طوال السنة، ويُكثرون العطاء في رمضان."},
  ];
  function dilemmaField(){
    const d=state._dilemma; if(!d) return "";
    const ar=state.lang==="ar";
    if(d.i>=DILEMMAS.length){
      const lc=d.picks.filter(p=>p==="b").length;
      const pr=lc>=3?(ar?"أنت باني وقف طويل المدى.":"You are a long-term waqf builder."):lc>=1?(ar?"أنت معطاء متوازن.":"You are a balanced giver."):(ar?"أنت مستجيب للحاجات العاجلة.":"You are an immediate-need responder.");
      return `<h3 class="ss-game-title">⚖️ ${gt("giving-dilemma")}</h3><p class="ss-dilemma-result"><strong>${pr}</strong></p><p>${ar?"لا يوجد جواب واحد صحيح. كل اختيار من هذه الاختيارات يساعد أحداً.":"There is no single right answer. Every choice here helps someone."}</p><button class="ss-btn ss-btn-primary ss-btn-done" data-act="finish-module" data-mod="games">${t("complete.opt.progress")} →</button>`;
    }
    const it=DILEMMAS[d.i];
    const head=`<h3 class="ss-game-title">⚖️ ${gt("giving-dilemma")}</h3>${howto("giving-dilemma")}<p class="ss-game-sub">${d.i+1}/${DILEMMAS.length}</p>`;
    if(!d.reveal){
      return head+`<div class="ss-dilemma"><h4>${ar?it.q_ar:it.q_en}</h4><div class="ss-choice-grid"><button class="ss-choice" data-act="dilemma" data-d="a">${ar?it.a_ar:it.a_en}</button><button class="ss-choice" data-act="dilemma" data-d="b">${ar?it.b_ar:it.b_en}</button></div></div>`;
    }
    const pick=d.picks[d.picks.length-1];
    const opt=(k)=>`<div class="ss-tradeoff ${pick===k?'picked':''}"><div class="ss-tradeoff-h">${pick===k?(ar?"اختيارك: ":"Your choice: "):""}${ar?it[k+"_ar"]:it[k+"_en"]}</div><p>${ar?it["n"+k+"_ar"]:it["n"+k+"_en"]}</p></div>`;
    return head+`<div class="ss-dilemma"><h4>${ar?it.q_ar:it.q_en}</h4>${opt("a")}${opt("b")}<p class="ss-tradeoff-take">${ar?it.nt_ar:it.nt_en}</p><button class="ss-btn ss-btn-primary" data-act="dilemma-next">${d.i+1<DILEMMAS.length?t("nav.next"):(ar?"النتيجة":"See result")} →</button></div>`;
  }
  function gGivingDilemma(){state._dilemma={i:0,picks:[],reveal:false};return dilemmaField();}
  function dilemmaChoose(p){const d=state._dilemma;if(d.reveal)return;d.picks.push(p);d.reveal=true;addStars(1,"✓");rerenderGame();}
  function dilemmaNext(){const d=state._dilemma;d.reveal=false;d.i++;rerenderGame();}

  /* ---- Impact Calculator ----
     Rates are illustrative. Food uses a monthly family parcel at $40 so it
     matches the Impact Simulator's $30–$50 per family food parcel. */
  const CALC_RATES={
    water:{per:10,u_en:"people given clean water",u_ar:"شخص يحصل على ماء نظيف",label_en:"Water",label_ar:"الماء",emoji:"🚰",r_en:"Assumes $10 gives one person clean water.",r_ar:"على افتراض أن 10 دولارات توفّر الماء النظيف لشخص واحد."},
    food:{per:40,u_en:"family food parcels (one month each)",u_ar:"طرد غذائي عائلي (يكفي شهراً)",label_en:"Food",label_ar:"الطعام",emoji:"🍚",r_en:"Assumes $40 for one family food parcel that lasts a month (the Impact Simulator uses $30–$50).",r_ar:"على افتراض أن الطرد الغذائي العائلي الذي يكفي شهراً يكلّف 40 دولاراً (يستخدم محاكي الأثر 30–50 دولاراً)."},
    education:{per:40,u_en:"child-months of school",u_ar:"شهر-طفل من التعليم",label_en:"Education",label_ar:"التعليم",emoji:"📚",r_en:"Assumes $40 pays for one child's schooling for one month.",r_ar:"على افتراض أن 40 دولاراً تغطي تعليم طفل واحد لمدة شهر."},
    healthcare:{per:25,u_en:"clinic consultations",u_ar:"استشارة طبية",label_en:"Healthcare",label_ar:"الرعاية الصحية",emoji:"💚",r_en:"Assumes $25 for one clinic consultation.",r_ar:"على افتراض أن الاستشارة الطبية الواحدة تكلّف 25 دولاراً."},
    orphan:{per:40,u_en:"orphan sponsor months",u_ar:"شهر كفالة يتيم",label_en:"Orphan",label_ar:"كفالة يتيم",emoji:"🧑‍🍼",r_en:"Assumes $40 sponsors one orphan for one month (the Impact Simulator uses $30–$50).",r_ar:"على افتراض أن 40 دولاراً تكفل يتيماً واحداً لمدة شهر (يستخدم محاكي الأثر 30–50 دولاراً)."}
  };
  function calcQty(){const c=state._calc;return Math.floor(c.amount/CALC_RATES[c.area].per);}
  function calcField(){const c=state._calc;if(!c)return"";const r=CALC_RATES[c.area];const ar=state.lang==="ar";return `<h3 class="ss-game-title">💡 ${gt("impact-calc")}</h3>${howto("impact-calc")}
    <div class="ss-calc-card"><label for="ss-calc-slider" style="font-weight:700;">$<span id="ss-calc-amt">${c.amount}</span></label><input id="ss-calc-slider" type="range" min="1" max="1000" value="${c.amount}" class="ss-slider" data-act="calc" data-cal="amount" style="width:100%">
    <div class="ss-segments" style="margin-top:12px;">${Object.keys(CALC_RATES).map(k=>`<button class="ss-seg ${k===c.area?'selected':''}" data-act="calc-area" data-ca="${k}">${CALC_RATES[k].emoji} ${ar?CALC_RATES[k].label_ar:CALC_RATES[k].label_en}</button>`).join("")}</div></div>
    <div class="ss-result"><div class="ss-re">${r.emoji}</div><div><div style="font-size:24px;font-weight:800;color:var(--teal-deep);"><span id="ss-calc-qty">${calcQty().toLocaleString()}</span> ${ar?r.u_ar:r.u_en}</div></div></div>
    <p class="ss-rate-note">${ar?r.r_ar:r.r_en} ${ar?"هذه أسعار تقريبية للتعلّم، والتكلفة الحقيقية تختلف بحسب البلد والجمعية.":"These are example prices for learning. Real costs vary by country and charity."}</p>
    <button class="ss-btn ss-btn-primary ss-btn-done" data-act="finish-module" data-mod="games">${t("complete.opt.progress")} →</button>`;}
  function gImpactCalc(){state._calc={amount:50,area:"water"};return calcField();}

  /* ---- Choose Your Path (branching scenarios from SADAQAH_PATHS) ---- */
  function pathField() {
    const st = state._path; if (!st) return "";
    const ar = state.lang === "ar";
    const P = window.SADAQAH_PATHS || [];
    const tx = (o, f) => ar ? o[f + "_ar"] : o[f + "_en"];
    if (!st.sid) {
      return `<h3 class="ss-game-title">🧭 ${gt("choose-path")}</h3>${howto("choose-path")}
        <div class="ss-path-menu">${P.map(sc => `<button class="ss-path-card" data-act="path-pick" data-path="${sc.id}"><span class="ss-path-e">${sc.e}</span><strong>${tx(sc,"title")}</strong><small>${tx(sc,"intro")}</small>${(state.pathsDone||[]).includes(sc.id)?`<span class="ss-read-badge">✓</span>`:""}</button>`).join("")}</div>`;
    }
    const sc = P.find(x => x.id === st.sid); const node = sc.nodes[st.node];
    const trail = st.trail.length ? `<ol class="ss-path-trail">${st.trail.map(([n, i]) => `<li>${ar ? sc.nodes[n].choices[i].ar : sc.nodes[n].choices[i].en}</li>`).join("")}</ol>` : "";
    if (node.end) {
      const src = node.url ? `<a href="${esc(node.url)}" target="_blank" rel="noopener noreferrer">${ar?node.ref_ar:node.ref_en} ↗</a>` : "";
      return `<h3 class="ss-game-title">${sc.e} ${tx(sc,"title")}</h3>${trail}
        <div class="ss-path-end ${node.good?'good':'hard'}"><p class="ss-path-outcome">${ar?node.ar:node.en}</p>
        <div class="ss-path-lesson"><strong>${ar?"ما نتعلّمه":"What we learn"}:</strong> ${ar?node.lesson_ar:node.lesson_en} ${src}</div></div>
        <p class="ss-game-sub">⭐ ${st.stars}</p>
        <button class="ss-btn ss-btn-ghost" data-act="path-again">↻ ${ar?"جرّب طريقاً آخر":"Try a different path"}</button>
        <button class="ss-btn ss-btn-ghost" data-act="path-menu">${ar?"موقف آخر":"Another situation"}</button>
        <button class="ss-btn ss-btn-primary ss-btn-done" data-act="finish-module" data-mod="games">${t("complete.opt.progress")} →</button>`;
    }
    return `<h3 class="ss-game-title">${sc.e} ${tx(sc,"title")}</h3>${trail}
      <div class="ss-dilemma"><h4>${ar?node.ar:node.en}</h4>
      <div class="ss-path-choices">${node.choices.map((c,i) => `<button class="ss-choice" data-act="path-choose" data-choice="${i}">${ar?c.ar:c.en}</button>`).join("")}</div></div>`;
  }
  function gChoosePath() { state._path = { sid: null }; return pathField(); }
  function pathPick(id) { const sc = (window.SADAQAH_PATHS||[]).find(x => x.id === id); if (!sc) return; state._path = { sid: id, node: sc.start, trail: [], stars: 0 }; rerenderGame(); }
  function pathChoose(i) {
    const st = state._path; const sc = window.SADAQAH_PATHS.find(x => x.id === st.sid); const node = sc.nodes[st.node];
    const c = node.choices[i]; if (!c) return;
    st.trail.push([st.node, i]);
    st.stars += c.stars; if (c.stars) addStars(c.stars, "✓");
    st.node = c.next;
    if (sc.nodes[st.node].end) { state.pathsDone = state.pathsDone || []; if (!state.pathsDone.includes(sc.id)) state.pathsDone.push(sc.id); }
    rerenderGame();
  }
  function pathAgain() { const st = state._path; pathPick(st.sid); }

  /* ---- How to play (one or two lines per game, written from what each game does) ---- */
  const HOWTO = {
    "charity-match":   { en:"Flip two cards at a time to find a word and its matching picture. Each match shows a short lesson.",
                         ar:"اقلب بطاقتين في كل مرة لتجد الكلمة والصورة المطابقة لها. كل تطابق يعرض لك معلومة قصيرة." },
    "fill-box":        { en:"Read who needs help, then tap the items that meet that need. Items that don't help will not go in the box.",
                         ar:"اقرأ من يحتاج إلى المساعدة، ثم اضغط على الأشياء التي تلبّي حاجته. الأشياء التي لا تساعده لن تدخل الصندوق." },
    "giving-tree":     { en:"Answer each question correctly to water the tree. Four right answers grow it fully.",
                         ar:"أجب عن كل سؤال إجابة صحيحة لتسقي الشجرة. أربع إجابات صحيحة تجعلها تكبر تماماً." },
    "build-community": { en:"You have $10,000. Pick projects that fit the budget, then press Build. Your score adds how happy the village is and how well you protect the most vulnerable.",
                         ar:"لديك 10,000 دولار. اختر مشاريع ضمن الميزانية، ثم اضغط «ابنِ القرية». تجمع نتيجتك بين رضا أهل القرية وحماية الأشد ضعفاً." },
    "sort-zakat":      { en:"Read about each person and tap the Zakat category that fits them. The eight categories are listed in Qur'an 9:60.",
                         ar:"اقرأ عن كل شخص واضغط على مصرف الزكاة المناسب له. المصارف الثمانية مذكورة في سورة التوبة (9:60)." },
    "chain-reaction":  { en:"Start with one good deed. At each step, choose what happens next and watch how the good spreads over 20 years.",
                         ar:"ابدأ بعمل خير واحد. في كل خطوة اختر ما يحدث بعد ذلك، وشاهد كيف ينتشر الخير على مدى 20 عاماً." },
    "waqf-architect":  { en:"Choose what to invest $50,000 in, which cause gets the income, and who manages the waqf. Then run 20 years and see what your waqf gives.",
                         ar:"اختر أين تستثمر 50,000 دولار، والمجال الذي يذهب إليه الريع، ومن يدير الوقف. ثم شغّل محاكاة 20 سنة وانظر ماذا يقدّم وقفك." },
    "giving-dilemma":  { en:"Five choices with no single right answer. After each one, read what each option gains and what it misses.",
                         ar:"خمسة اختيارات ليس لها جواب واحد صحيح. بعد كل اختيار، اقرأ ما يكسبه كل خيار وما يفوته." },
    "impact-calc":     { en:"Move the slider to choose an amount, then pick a cause to see what it could pay for.",
                         ar:"حرّك المؤشر لتختار مبلغاً، ثم اختر مجالاً لترى ما يمكن أن يغطيه." },
    "choose-path":     { en:"Read each situation and choose what you would do. Your choices change what happens next.",
                         ar:"اقرأ كل موقف واختر ما ستفعله. اختياراتك تغيّر ما يحدث بعد ذلك." },
  };
  function howto(id) {
    const h = HOWTO[id]; if (!h) return "";
    return `<p class="ss-howto"><strong>${state.lang==="ar"?"طريقة اللعب:":"How to play:"}</strong> ${state.lang==="ar"?h.ar:h.en}</p>`;
  }

  /* ---- Game dispatcher ---- */
  // Bilingual game title lookup by id.
  const GAME_TITLES = {
    "charity-match":   { en: "Charity Match",           ar: "مطابقة الخير" },
    "fill-box":        { en: "Fill the Donation Box",   ar: "املأ صندوق التبرع" },
    "giving-tree":     { en: "The Giving Tree",         ar: "شجرة العطاء" },
    "build-community": { en: "Build Your Community",    ar: "ابنِ مجتمعك" },
    "sort-zakat":      { en: "Sort the Zakat",          ar: "رتّب الزكاة" },
    "chain-reaction":  { en: "Charity Chain Reaction",  ar: "سلسلة الخير" },
    "waqf-architect":  { en: "Waqf Architect",          ar: "مهندس الوقف" },
    "giving-dilemma":  { en: "The Giving Dilemma",      ar: "مُعضلة العطاء" },
    "impact-calc":     { en: "Real Impact Calculator",  ar: "حاسبة الأثر الحقيقي" },
    "choose-path":     { en: "Choose Your Path",        ar: "اختر طريقك" },
  };
  function gt(id) { const g = GAME_TITLES[id]; return g ? (g[state.lang] || g.en) : id; }

  function initGame(id){ state._mem=null;state._fill=null;state._tree=null;state._comm=null;state._zakat=null;state._chain=null;state._waqf=null;state._dilemma=null;state._calc=null;state._path=null;
    switch(id){case"charity-match":return gCharityMatch();case"fill-box":return fillField();case"giving-tree":return gGivingTree();case"build-community":return gBuildCommunity();case"sort-zakat":return gSortZakat();case"chain-reaction":return gChainReaction();case"waqf-architect":return gWaqfArchitect();case"giving-dilemma":return gGivingDilemma();case"impact-calc":return gImpactCalc();case"choose-path":return gChoosePath();default:return `<div class="ss-empty">Game not found.</div>`;} }
  function renderGame(id){ switch(id){case"charity-match":return memField();case"fill-box":return fillField();case"giving-tree":return treeField();case"build-community":return commField();case"sort-zakat":return zakatField();case"chain-reaction":return chainField();case"waqf-architect":return waqfField();case"giving-dilemma":return dilemmaField();case"impact-calc":return calcField();case"choose-path":return pathField();default:return "";} }
  function playView() {
    const id = state.params.id;
    return `<div class="ss-playfield">${initGame(id)}</div>`;
  }
  function rerenderGame(){ if(state.route!=="play")return; const pf=document.querySelector("#ss-app .ss-playfield"); if(pf){pf.innerHTML=renderGame(state.params.id); } }

  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

  /* ----------------------------- HELPING HANDS -------------------------- */
  // Shows only the selected language's content + video (not bilingual).
  function helpingHands() {
    const yt = (id) => `<div class="ss-video"><iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0" title="YouTube video player" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
    const en = {
      dir: "ltr",
      title: "Helping Hands: Learning How to Give and Be Kind!",
      desc: 'Imagine a place where every kind thing you do is a special gift! This section tells you all about <strong>Sadaqah</strong>, which is a beautiful word for being a helper. We will find out that even a <strong>smile</strong> is a wonderful gift you can give to anyone. You\'ll learn secret words from <strong>Qatar</strong>, like how friends all jump in together to help someone (we call this a <strong>"Faz\'ah"</strong>). It shows how one tiny good deed can grow as big as a giant forest of rewards from Allah, and how you can be one of the "People of Good" (<em>Ahl al-Kher</em>) who make the world a happy place!',
      video: "iKOfCm1X79g",
    };
    const ar = {
      dir: "rtl",
      title: "الأيدي المساعدة: تعلم كيف تعطي وتنشر الخير!",
      desc: 'تخيل مكاناً يكون فيه كل عمل طيب تقوم به بمثابة هدية خاصة! هذا القسم يخبرك بكل شيء عن <strong>"الصدقة"</strong>، وهي كلمة جميلة تعني أن تكون مساعداً للآخرين. سنتعلم أن حتى <strong>الابتسامة</strong> هدية رائعة يمكنك تقديمها لأي شخص. ستتعلم كلمات سرية من <strong>قطر</strong>، مثل كيف يقفز الأصدقاء معاً لمساعدة شخص ما (نسمي هذا <strong>"فزعة"</strong>). يُظهر كيف يمكن لعمل خير صغير أن ينمو ليصبح كبيراً كغابة عملاقة من الأجر من الله، وكيف يمكنك أن تكون من <strong>"أهل الخير"</strong> الذين يجعلون العالم مكاناً سعيداً!',
      video: "734vFtBeZ60",
    };
    const c = state.lang === "ar" ? ar : en;
    return `
      <div class="ss-section-head">
        <h2>${t("mod.help")}</h2>
        <p>${t("mod.help.desc")}</p>
      </div>
      <div class="ss-help-block" dir="${c.dir}">
        <h3 class="ss-help-title">${c.title}</h3>
        <p class="ss-help-desc">${c.desc}</p>
        ${yt(c.video)}
      </div>
      <button class="ss-btn ss-btn-primary ss-btn-done" data-act="finish-module" data-mod="help">${t("complete.opt.progress")} →</button>`;
  }

  /* ----------------------------- ABOUT ---------------------------------- */
  function about() {
    const en = window.SADAQAH_I18N.en, ar = window.SADAQAH_I18N.ar;
    return `
      <div class="ss-section-head">
        <h2>${en["about.title"]} / ${ar["about.title"]}</h2>
      </div>
      <div class="ss-about">
        <div class="ss-about-block" dir="ltr">
          <h3>${en["about.funding"]}</h3>
          <p>${en["about.fundingBody"]}</p>
        </div>
        <div class="ss-about-block" dir="rtl">
          <h3>${ar["about.funding"]}</h3>
          <p>${ar["about.fundingBody"]}</p>
        </div>
      </div>
      <div class="ss-logos">
        <img src="${ASSET}nuq.jpg" alt="Northwestern University in Qatar">
        <img src="${ASSET}qrdi.svg" alt="QRDI Council">
        <img src="${ASSET}raca.png" alt="RACA">
      </div>`;
  }

  /* ----------------------------- LEXICON (wiki-style table) ------------- */
  function lexic() {
    const L = window.SADAQAH_LEXICON || [];
    const ar = state.lang === "ar";
    const intro = ar
      ? { title: "معجم متخصص للمصطلحات الخيرية", body: "يُنظَّم المعجم التالي اللغة العربية الفصحى الحديثة بالاستناد إلى الاستخدام القرآني والفقهي والمؤسسي، وكذلك اللهجة القطرية، وهي جزء من سلسلة اللهجات العربية الخليجية الأوسع." }
      : { title: "A Specialised Lexicon of Charitable Terminology", body: "The following lexicon covers Modern Standard Arabic (al-ʿarabiyyah al-fuṣḥā), drawing on Qur'anic, juristic, and institutional usage and the Qatari dialect (lahjat Qaṭar), which is part of the wider Khalījī (Gulf) Arabic continuum." };
    // EN columns: arabic | translit | en_use ; AR columns: arabic | ar_use
    const headers = ar
      ? ["المصطلح", "الاستخدام"]
      : ["Arabic", "Transliteration", "English Usage"];
    function cell(val) { return "<td>" + (val || "") + "</td>"; }
    const q = (state.lexQuery || "").toLowerCase();
    const filtered = q ? L.filter((e) =>
      (e.arabic || "").toLowerCase().includes(q) ||
      (e.translit || "").toLowerCase().includes(q) ||
      (e.en_use || "").toLowerCase().includes(q) ||
      (e.ar_use || "").toLowerCase().includes(q)) : L;
    const rows = filtered.map((e) => {
      if (ar) return "<tr>" + cell(e.arabic) + cell(e.ar_use) + "</tr>";
      return "<tr>" + cell(e.arabic) + cell(e.translit) + cell(e.en_use) + "</tr>";
    }).join("");
    return `
      <div class="ss-section-head">
        <h2>${intro.title}</h2>
        <p class="ss-lex-intro">${intro.body}</p>
      </div>
      <div class="ss-search-bar">
        <input type="search" id="ss-lex-search" placeholder="${t("search.lex")}" value="${state.lexQuery || ""}" data-act-input="lex-search">
        <span class="ss-search-count">${filtered.length} / ${L.length}</span>
      </div>
      <div class="ss-lex-table-wrap">
        <table class="ss-lex-table" dir="${ar ? "rtl" : "ltr"}">
          <thead><tr>${headers.map((h) => "<th>" + h + "</th>").join("")}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      ${filtered.length === 0 ? `<div class="ss-empty">${t("search.none")}</div>` : ''}
      <button class="ss-btn ss-btn-primary ss-btn-done" data-act="finish-module" data-mod="lexic">${t("complete.opt.progress")} →</button>`;
  }

  /* ----------------------------- Render --------------------------------- */
  function viewFor() {
    switch (state.route) {
      case "home": return home();
      case "language": return language();
      case "age": return age();
      case "hub": return hub();
      case "modules": return modules();
      case "module-a": return moduleA();
      case "story": return storyView();
      case "module-b": return moduleB();
      case "module-c": return moduleC();
      case "play": return playView();
      case "module-d": return moduleD();
      case "sample": return sampleView();
      case "helping-hands": return helpingHands();
      case "lexic": return lexic();
      case "about": return about();
      case "progress": return progress();
      case "complete": return complete();
      default: return home();
    }
  }
  function render() {
    const app = document.getElementById("ss-app");
    app.innerHTML = shell(viewFor());
    refreshStars();
  }

  /* ----------------------------- Events --------------------------------- */
  document.addEventListener("click", function (e) {
    const app = document.getElementById("ss-app");
    if (!app || !app.contains(e.target)) return;
    const tEl = e.target.closest("[data-go],[data-act],[data-mem]");
    if (!tEl) return;

    if (tEl.hasAttribute("data-go")) {
      const dest = tEl.getAttribute("data-go");
      const id = tEl.getAttribute("data-id");
      go(dest, id ? { id } : {});
      return;
    }
    const act = tEl.getAttribute("data-act");
    switch (act) {
      case "go-home": state.lang = null; save(); go("home"); break;
      case "toggle-lang": state.lang = state.lang === "en" ? "ar" : "en"; save(); render(); break;
      case "pick-lang": state.lang = tEl.getAttribute("data-lang"); save(); go("age"); break;
      case "pick-age": state.age = tEl.getAttribute("data-age"); save(); go("hub"); break;
      case "pick-sim": state.simId = tEl.getAttribute("data-sim"); state.simYear = 0; render(); break;
      case "pick-year": state.simYear = Number(tEl.getAttribute("data-year")); render(); break;
      case "mem": memClick(Number(tEl.getAttribute("data-mem"))); break;
      case "fill": fillDrop(tEl.getAttribute("data-item")); break;
      case "tree": treeAnswer(Number(tEl.getAttribute("data-tree"))); break;
      case "comm": commToggle(tEl.getAttribute("data-comm")); break;
      case "comm-confirm": commConfirm(); break;
      case "zakat": zakatDrop(tEl.getAttribute("data-zbin")); break;
      case "chain": chainChoose(Number(tEl.getAttribute("data-chain"))); break;
      case "waqf-asset": state._waqf.asset = tEl.getAttribute("data-wa"); rerenderGame(); break;
      case "waqf-cause": state._waqf.cause = tEl.getAttribute("data-wc"); rerenderGame(); break;
      case "waqf-gov": state._waqf.gov = tEl.getAttribute("data-wg"); rerenderGame(); break;
      case "waqf-run": waqfRun(); break;
      case "waqf-again": waqfAgain(); break;
      case "waqf-reset": waqfReset(tEl.getAttribute("data-step")); break;
      case "dilemma": dilemmaChoose(tEl.getAttribute("data-d")); break;
      case "dilemma-next": dilemmaNext(); break;
      case "daily-done": { try { localStorage.setItem("ss_daily_done", todayKey()); } catch (err) {} addStars(1, "✓"); render(); break; }
      case "path-pick": pathPick(tEl.getAttribute("data-path")); break;
      case "path-choose": pathChoose(Number(tEl.getAttribute("data-choice"))); break;
      case "path-again": pathAgain(); break;
      case "path-menu": state._path = { sid: null }; rerenderGame(); break;
      case "chain-restart": state._chain = { stage: 0, links: 1 }; rerenderGame(); break;
      case "calc":
        // handled by input listener
        break;
      case "calc-area": state._calc.area = tEl.getAttribute("data-ca"); rerenderGame(); break;
      case "finish-module": state.lastModule = tEl.getAttribute("data-mod"); go("complete"); break;
      case "open-story": { state.storyPage = 0; state.quiz = null; const sid = tEl.getAttribute("data-id"); go("story", { id: sid }); break; }
      case "quiz": {
        const qi = Number(tEl.getAttribute("data-q")), oi = Number(tEl.getAttribute("data-o"));
        if (state.quiz && state.quiz.ans[qi] == null) { state.quiz.ans[qi] = oi; if (oi === 0) addStars(1, "✓"); render(); }
        break;
      }
      case "fb-prev": state.storyPage = Math.max(0, (state.storyPage||0) - 1); render(); break;
      case "fb-next": { const lst = stories(); const cs = lst.find(x=>x.id===(state.params.id||"")); const max = cs?cs.pages.length-1:3; state.storyPage = Math.min(max, (state.storyPage||0) + 1); render(); break; }
      case "fb-goto": state.storyPage = Number(tEl.getAttribute("data-page")); render(); break;
      case "submit-story": submitStory(); break;
      case "read-own": readOwnStory(Number(tEl.getAttribute("data-idx"))); break;
    }
  });
  document.addEventListener("input", function (e) {
    const app = document.getElementById("ss-app");
    if (!app || !app.contains(e.target)) return;
    if (e.target.hasAttribute("data-cal") && e.target.getAttribute("data-cal") === "amount") {
      state._calc.amount = Number(e.target.value);
      const amt = document.getElementById("ss-calc-amt"), qty = document.getElementById("ss-calc-qty");
      if (amt) amt.textContent = state._calc.amount;
      if (qty) qty.textContent = calcQty().toLocaleString();
    }
    // search boxes: update state and re-render view only (keeps focus)
    const inp = e.target.getAttribute("data-act-input");
    if (inp === "story-search" || inp === "lex-search") {
      const val = e.target.value;
      const selStart = e.target.selectionStart;
      if (inp === "story-search") state.storyQuery = val; else state.lexQuery = val;
      // re-render only the view, then restore focus + caret
      const viewEl = document.querySelector("#ss-app .ss-view");
      if (viewEl) {
        viewEl.innerHTML = backLink() + viewFor();
        const again = document.querySelector('[data-act-input="' + inp + '"]');
        if (again) { again.focus(); try { again.setSelectionRange(selStart, selStart); } catch (err) {} }
      }
    }
  });

  // Keyboard arrows for the story flipbook
  document.addEventListener("keydown", function (e) {
    if (state.route !== "story") return;
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const fwd = isRTL() ? e.key === "ArrowLeft" : e.key === "ArrowRight";
      const list = stories();
      const cs = list.find((x) => x.id === (state.params.id || ""));
      const max = cs ? cs.pages.length - 1 : 3;
      if (fwd) state.storyPage = Math.min(max, (state.storyPage || 0) + 1);
      else state.storyPage = Math.max(0, (state.storyPage || 0) - 1);
      render();
      e.preventDefault();
    }
  });

  function submitStory() {
    const author = (document.getElementById("ss-f-author").value || "Anonymous").trim();
    const title = (document.getElementById("ss-f-title").value || "Untitled").trim();
    const body = (document.getElementById("ss-f-body").value || "").trim();
    const wc = body.split(/\s+/).filter(Boolean).length;
    if (wc < 20) { toast(state.lang === "ar" ? "اكتب أكثر قليلاً" : "Please write more (min 20 words)."); return; }
    state.wall.push({ author, title, body, wc, lang: state.lang }); save();
    addStars(5, "✓"); awardBadge("writer");
    toast("✓"); render();
  }
  function readOwnStory(i) {
    const s = state.wall[i]; if (!s) return;
    const overlay = document.createElement("div");
    overlay.innerHTML = `<div class="ss-modal-bg" data-act="close-modal"><div class="ss-modal"><div class="ss-modal-head"><h3>${esc(s.title)}</h3><span class="ss-x" data-act="close-modal">✕</span></div><div style="padding:20px;"><p style="color:var(--ink-soft);font-style:italic;">${t("wall.by")} ${esc(s.author)} · ${s.wc} ${t("wall.words")}</p><div class="ss-prose">${esc(s.body).split(/\n+/).map(p=>`<p>${p}</p>`).join("")}</div></div></div></div>`;
    document.getElementById("ss-app").appendChild(overlay.firstElementChild);
  }
  document.addEventListener("click", function (e) {
    const el = e.target.closest("[data-act='close-modal']");
    if (el) { const bg = el.closest(".ss-modal-bg"); if (bg) bg.remove(); }
  });

  /* ----------------------------- Boot ----------------------------------- */
  function boot() {
    // Open the screen named in the URL (reload, bookmark or shared link).
    const r = parseHash();
    if (r.route === "home") { state.route = "home"; try { history.replaceState({ route: "home", params: {} }, "", location.hash ? "#/home" : location.pathname + location.search); } catch (err) {} render(); }
    else go(r.route, r.params, { replace: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.SadaqahApp = { state, go, render };
})();
