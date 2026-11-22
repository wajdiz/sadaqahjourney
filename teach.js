/* =========================================================================
   Sadaqah Stories: Teachers & Workshops section (route #/teach/<tab|kit>)
   Tabs: guide, kits (k1..k6 open a kit), activities, planner, handouts,
   scholars. Content lives in data-teach.js. The plan is saved in
   localStorage "ss_teach_plan". Printing renders a clean sheet into
   #ss-print-sheet and prints only that (see the print rules in styles.css).
   ========================================================================= */
(function () {
  const M = window.SADAQAH_MODULES = window.SADAQAH_MODULES || {};
  const TD = window.SADAQAH_TEACH;
  if (!TD) return;
  const ALL_AGES = ["7-10", "11-14", "15-18", "adults"];
  const TABS = [
    ["guide", "🧭", { en: "Guidelines", ar: "إرشادات" }],
    ["kits", "🎒", { en: "Workshop kits", ar: "حقائب الورش" }],
    ["activities", "🧩", { en: "Activity bank", ar: "بنك الأنشطة" }],
    ["planner", "🗓️", { en: "My workshop plan", ar: "خطة ورشتي" }],
    ["handouts", "🖨️", { en: "Handouts", ar: "أوراق العمل" }],
    ["scholars", "📚", { en: "For scholars", ar: "للعلماء" }],
  ];
  const ACT = {}; TD.ACTIVITIES.forEach((a) => { ACT[a.id] = a; });
  const KIT = {}; TD.KITS.forEach((k) => { KIT[k.id] = k; });

  /* ---------- small helpers ---------- */
  const L = (c, en, ar) => (c.ar ? ar : en);
  const ageShort = (c, a) => (a === "adults" ? L(c, "Adults", "الكبار") : a.replace("-", "–"));
  function mins(c, n) {
    if (!c.ar) return n + " min";
    if (n === 1) return "دقيقة";
    if (n === 2) return "دقيقتان";
    const r = n % 100;
    return n + (r >= 3 && r <= 10 ? " دقائق" : " دقيقة");
  }
  const list = (arr) => `<ul>${arr.map((x) => `<li>${x}</li>`).join("")}</ul>`;
  const chip = (txt, cls) => `<span class="ss-tchip ${cls || ""}">${txt}</span>`;
  function allRefs() {
    const out = {};
    [TD.REF, window.SADAQAH_REFS, window.SADAQAH_REFS_ADULT].forEach((o) => { if (o) Object.keys(o).forEach((k) => { out[k] = o[k]; }); });
    return out;
  }
  const refLink = (c, r) => (r && r.url ? `<a class="ss-ref" href="${r.url}" target="_blank" rel="noopener noreferrer">${c.T(r)} ↗</a>` : "");

  /* ---------- the saved plan ---------- */
  function loadPlan() {
    try { const p = JSON.parse(localStorage.getItem("ss_teach_plan") || "null"); if (p && Array.isArray(p.items)) return p; } catch (e) {}
    return { title: "", age: "", notes: "", items: [] };
  }
  function savePlan(p) { try { localStorage.setItem("ss_teach_plan", JSON.stringify(p)); } catch (e) {} }
  const planTotal = (p) => p.items.reduce((s, it) => s + (Number(it.min) || 0), 0);

  /* ---------- which age group can open a game ---------- */
  function gameAges(id) {
    const D = window.SADAQAH_DATA || {}, extra = window.SADAQAH_AGE_GAMES || {};
    const out = [];
    ALL_AGES.forEach((a) => {
      const base = (D.MODULE_C || []).find((g) => g.age === a);
      if ((base && base.games.some((g) => g.id === id)) || (extra[a] || []).includes(id)) out.push(a);
    });
    return out;
  }
  function chooseAge(c, pref, gameId) {
    const cur = c.state.age;
    // Only games depend on the age group; other screens keep the current one.
    if (!gameId && cur) return cur;
    let ok = gameId ? gameAges(gameId) : ALL_AGES.slice();
    const want = (pref && pref.length ? pref : ok).filter((a) => ok.includes(a));
    if (cur && want.includes(cur)) return cur;
    if (want.length) return want[0];
    if (cur && ok.includes(cur)) return cur;
    return ok[0] || "11-14";
  }
  function openOnSite(c, spec, pref) {
    const [route, x] = spec.split(":");
    const age = chooseAge(c, pref, route === "play" ? x : null);
    c.setAge(age);
    c.state.teachReturn = c.state.params.id || "guide";
    if (route === "module-b") { if (x) c.state.simId = x; c.state.simYear = 0; c.go("module-b"); return; }
    if (route === "story") { c.state.storyPage = 0; c.state.quiz = null; }
    c.go(route, x ? { id: x } : {});
  }
  const openBtn = (c, spec, pref) => spec
    ? `<button type="button" class="ss-btn ss-btn-ghost ss-btn-sm" data-act="g" data-g="open" data-v="${spec}|${(pref || []).join(",")}">${L(c, "Open on the site", "افتحه في الموقع")} ${c.fwd()}</button>` : "";

  /* ---------- print ---------- */
  function printSheet(c, html) {
    let el = document.getElementById("ss-print-sheet");
    if (!el) { el = document.createElement("div"); el.id = "ss-print-sheet"; document.body.appendChild(el); }
    el.setAttribute("dir", c.ar ? "rtl" : "ltr");
    el.setAttribute("lang", c.ar ? "ar" : "en");
    el.innerHTML = html;
    document.body.classList.add("ss-printing");
    const done = () => { document.body.classList.remove("ss-printing"); window.removeEventListener("afterprint", done); };
    window.addEventListener("afterprint", done);
    try { window.print(); } catch (e) { done(); }
  }
  const brand = (c) => `<div class="ps-brand"><img src="assets/icon_tree.png" alt=""><span>${L(c, "Sadaqah Stories", "حكايات الصدقة")} · sadaqahjourney.com</span></div>`;
  const lines = (n) => `<div class="ps-lines">${"<span></span>".repeat(n)}</div>`;

  /* ---------- handouts ---------- */
  function handoutHTML(c, id) {
    const S = TD.SHEETS, T = c.T, h = TD.HANDOUTS.find((x) => x.id === id);
    if (!h) return "";
    const title = T(h.title);
    if (id === "pledge") {
      const deeds = (window.SADAQAH_DAILY || []).filter((d) => !/mosque/i.test(d.en)).slice(0, 10);
      return `<div class="ps-page">${brand(c)}<h1>${L(c, "My kindness pledge", "عهدي في اللطف")}</h1>
        <p>${L(c, "This week, I will try to:", "سأحاول هذا الأسبوع أن:")}</p>
        <ul class="ps-ticks">${deeds.map((d) => `<li><span class="ps-box"></span><span class="ps-e">${d.e}</span>${c.ar ? d.ar : d.en} <small>(${c.ar ? d.ref_ar : d.ref_en})</small></li>`).join("")}</ul>
        <p>${L(c, "My own idea:", "فكرتي أنا:")}</p>${lines(2)}
        <div class="ps-sign"><span>${L(c, "Name", "الاسم")}: ____________________</span><span>${L(c, "Date", "التاريخ")}: ______________</span></div>
        <p class="ps-note">${L(c, "Each deed comes from a hadith. Ask your teacher to tell you about it.", "لكل عمل من هذه الأعمال حديث، فاطلب من معلمك أن يحدثك عنه.")}</p></div>`;
    }
    if (id === "exit") {
      const one = `<div class="ps-ticket"><h2>🎟️ ${title}</h2><div class="ps-sign"><span>${L(c, "Name (optional)", "الاسم (اختياري)")}: ______________</span><span>${L(c, "Date", "التاريخ")}: __________</span></div>
        ${T(S.exit).map((q) => `<p class="ps-q">${q}</p>${lines(2)}`).join("")}</div>`;
      return `<div class="ps-page">${brand(c)}${one}<div class="ps-cut">✂ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</div>${one}</div>`;
    }
    if (id === "zakat-sort" || id === "zakat-key") {
      const G = window.SADAQAH_GAME_DATA || { ZCATS: [], ZCARDS: [] };
      const catName = (cid) => { const i = G.ZCATS.findIndex((z) => z.id === cid); return i < 0 ? "" : (i + 1) + ". " + (c.ar ? G.ZCATS[i].ar : G.ZCATS[i].en); };
      const cats = `<ol class="ps-cats">${G.ZCATS.map((z) => `<li><strong>${c.ar ? z.ar : z.en}</strong>: ${T(z.d)}</li>`).join("")}</ol>`;
      const ref = (allRefs().q960);
      if (id === "zakat-sort") {
        return `<div class="ps-page">${brand(c)}<h1>${title}</h1>
          <p>${L(c, "Groups 1 to 8 are the eight groups named in", "الأصناف من 1 إلى 8 هي الأصناف الثمانية المذكورة في")} ${c.T(ref)}. ${L(c, "Group 9 means the person should be helped another way. Write the number of the group for each case. Some cases have more than one good answer.", "والرقم 9 يعني أن يُساعَد الشخص بطريقة أخرى. اكتب رقم الصنف أمام كل حالة، فلبعض الحالات أكثر من إجابة صحيحة.")}</p>${cats}
          <table class="ps-table"><thead><tr><th>#</th><th>${L(c, "Case", "الحالة")}</th><th class="ps-narrow">${L(c, "Group", "الصنف")}</th></tr></thead>
          <tbody>${G.ZCARDS.map((z, i) => `<tr><td>${i + 1}</td><td>${T(z.t)}</td><td></td></tr>`).join("")}</tbody></table>
          <p class="ps-note">${L(c, "A learning activity, not a fatwa. For your own zakat, ask a scholar or a zakat authority you trust.", "نشاط تعليمي وليس فتوى. ولحساب زكاتك اسأل عالماً أو جهة زكاة تثق بها.")}</p></div>`;
      }
      return `<div class="ps-page">${brand(c)}<h1>${title}</h1>
        <table class="ps-table"><thead><tr><th>#</th><th>${L(c, "Case", "الحالة")}</th><th>${L(c, "Accepted answers", "الإجابات المقبولة")}</th><th>${L(c, "Why", "السبب")}</th></tr></thead>
        <tbody>${G.ZCARDS.map((z, i) => `<tr><td>${i + 1}</td><td>${T(z.t)}</td><td>${z.ok.map(catName).join("<br>")}</td><td>${T(z.why)}</td></tr>`).join("")}</tbody></table></div>`;
    }
    if (id === "evidence") {
      const cols = T(S.evidenceCols);
      return `<div class="ps-page">${brand(c)}<h1>${title}</h1>
        <p>${L(c, "Open each story, read its evidence label (shown on the story page) and its sources, then fill in a row.", "افتح كل حكاية، واقرأ حالة توثيقها (تظهر في صفحة الحكاية) ومصادرها، ثم املأ سطراً.")}</p>
        <table class="ps-table ps-tall"><thead><tr>${cols.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>${[1, 2, 3, 4].map(() => `<tr>${cols.map(() => "<td></td>").join("")}</tr>`).join("")}</tbody></table>
        <p class="ps-q">${T(S.evidenceQ)}</p>${lines(4)}</div>`;
    }
    if (id === "checklist") {
      return `<div class="ps-page">${brand(c)}<h1>${title}</h1>
        <div class="ps-two"><div><h2>✅ ${L(c, "Good signs", "علامات الثقة")}</h2><ul class="ps-ticks">${T(S.checkGood).map((x) => `<li><span class="ps-box"></span>${x}</li>`).join("")}</ul></div>
        <div><h2>⚠️ ${L(c, "Warning signs", "علامات التحذير")}</h2><ul class="ps-ticks">${T(S.checkBad).map((x) => `<li><span class="ps-box"></span>${x}</li>`).join("")}</ul></div></div>
        <p class="ps-q">🕌 ${T(S.checkZakat)}</p>
        <p class="ps-note">${L(c, "In Qatar, charitable activity is regulated by the Regulatory Authority for Charitable Activities (RACA).", "في قطر تنظّم العملَ الخيري هيئةُ تنظيم الأعمال الخيرية.")}</p></div>`;
    }
    if (id === "project") {
      return `<div class="ps-page">${brand(c)}<h1>${title}</h1>
        ${T(S.projectQ).map((q, i) => `<div class="ps-field"><p class="ps-q">${i + 1}. ${q}</p>${lines(i === 0 || i === 1 ? 1 : 2)}</div>`).join("")}</div>`;
    }
    if (id === "rubric") {
      const sc = T(S.scale);
      return `<div class="ps-page">${brand(c)}<h1>${title}</h1>
        <div class="ps-sign"><span>${L(c, "Team", "الفريق")}: ____________________</span><span>${L(c, "Reviewed by", "المقيِّم")}: ____________________</span></div>
        <table class="ps-table"><thead><tr><th>${L(c, "Criterion", "المعيار")}</th>${sc.map((x, i) => `<th class="ps-narrow">${i + 1}<br><small>${x}</small></th>`).join("")}</tr></thead>
        <tbody>${T(S.rubric).map((r) => `<tr><td>${r}</td>${sc.map(() => "<td></td>").join("")}</tr>`).join("")}</tbody></table>
        <p class="ps-q">${L(c, "One strength", "نقطة قوة واحدة")}</p>${lines(2)}<p class="ps-q">${L(c, "One question for the team", "سؤال واحد للفريق")}</p>${lines(2)}</div>`;
    }
    if (id === "certificate") {
      const cert = c.s.cert || {}, plan = loadPlan();
      const wt = cert.title != null ? cert.title : plan.title;
      const logos = `<div class="ps-logos"><img src="assets/nuq.jpg" alt="Northwestern University in Qatar"><img src="assets/qrdi.svg" alt="QRDI Council"><img src="assets/raca.png" alt="RACA"></div>`;
      return `<div class="ps-page ps-cert"><div class="ps-cert-in">
        <img class="ps-cert-tree" src="assets/icon_tree.png" alt="">
        <h1>${title}</h1>
        <p>${L(c, "This certifies that", "تشهد هذه الشهادة بأن")}</p>
        <div class="ps-cert-line"></div>
        <p>${L(c, "took part in the workshop", "شارك في ورشة")}</p>
        <p class="ps-cert-title">${wt ? c.esc(wt) : "<span class='ps-cert-line ps-short'></span>"}</p>
        <p>${L(c, "Date", "التاريخ")}: ${cert.date ? c.esc(cert.date) : "______________"}</p>
        <p class="ps-cert-proj">${c.t("project.title")}</p>${logos}</div></div>`;
    }
    return "";
  }

  /* ---------- printable kit and plan ---------- */
  function agendaRows(c, items) {
    let t0 = 0;
    return items.map((it) => {
      const a = ACT[it.a]; if (!a) return "";
      const t1 = t0 + (Number(it.min) || 0), row = `<tr><td class="ps-narrow">${t0}–${t1}</td><td><strong>${a.icon} ${c.T(a.title)}</strong>${it.note ? `<br><em>${c.T(it.note)}</em>` : ""}<br>${c.T(a.how)}</td></tr>`;
      t0 = t1; return row;
    }).join("");
  }
  function kitPrint(c, k) {
    const total = k.agenda.reduce((s, x) => s + x.min, 0), T = c.T;
    const hs = k.handouts.map((h) => T(TD.HANDOUTS.find((x) => x.id === h).title)).join(L(c, ", ", "، "));
    return `<div class="ps-doc">${brand(c)}<h1>${k.icon} ${T(k.title)}</h1>
      <p class="ps-meta">${k.ages.map((a) => ageShort(c, a)).join(" · ")} · ${mins(c, total)} · ${T(k.group)}</p><p>${T(k.summary)}</p>
      <h2>${L(c, "Goals", "الأهداف")}</h2>${list(T(k.goals))}
      <h2>${L(c, "Before class", "قبل الحصة")}</h2><ul class="ps-ticks">${T(k.prepare).map((x) => `<li><span class="ps-box"></span>${x}</li>`).join("")}</ul>
      <h2>${L(c, "Agenda", "خطة الجلسة")}</h2><table class="ps-table"><thead><tr><th class="ps-narrow">${L(c, "Minutes", "الدقائق")}</th><th>${L(c, "What to do", "ما تفعله")}</th></tr></thead><tbody>${agendaRows(c, k.agenda)}</tbody></table>
      <h2>${L(c, "Discussion questions", "أسئلة للنقاش")}</h2>${list(T(k.questions))}
      <h2>${L(c, "Going further", "للتوسع")}</h2>${list(T(k.extend))}
      <h2>${L(c, "Take care", "تنبيهات")}</h2>${list(T(k.care))}
      <p class="ps-note">${L(c, "Handouts", "أوراق العمل")}: ${hs}. ${L(c, "Print them from the Handouts tab.", "اطبعها من تبويب «أوراق العمل».")}</p></div>`;
  }
  function planPrint(c, p) {
    return `<div class="ps-doc">${brand(c)}<h1>${p.title ? c.esc(p.title) : L(c, "My workshop plan", "خطة ورشتي")}</h1>
      <p class="ps-meta">${p.age ? ageShort(c, p.age) + " · " : ""}${mins(c, planTotal(p))}</p>
      <table class="ps-table"><thead><tr><th class="ps-narrow">${L(c, "Minutes", "الدقائق")}</th><th>${L(c, "What to do", "ما تفعله")}</th></tr></thead><tbody>${agendaRows(c, p.items)}</tbody></table>
      ${p.notes ? `<h2>${L(c, "Notes", "ملاحظات")}</h2><p class="ps-pre">${c.esc(p.notes)}</p>` : ""}</div>`;
  }
  function planText(c, p) {
    let t0 = 0;
    const rows = p.items.map((it) => { const a = ACT[it.a]; if (!a) return ""; const t1 = t0 + (Number(it.min) || 0); const r = `${t0}–${t1}  ${c.T(a.title)}${it.note ? "\n      " + c.T(it.note) : ""}\n      ${c.T(a.how)}`; t0 = t1; return r; }).filter(Boolean);
    return [(p.title || L(c, "My workshop plan", "خطة ورشتي")), (p.age ? ageShort(c, p.age) + " · " : "") + mins(c, planTotal(p)), "", ...rows, p.notes ? "\n" + L(c, "Notes", "ملاحظات") + ":\n" + p.notes : ""].join("\n");
  }

  /* ---------- views ---------- */
  function tabNav(c, active) {
    return `<nav class="ss-teach-tabs" aria-label="${L(c, "Teacher section", "قسم المعلمين")}">${TABS.map(([id, e, lab]) =>
      `<button type="button" class="ss-teach-tab ${id === active ? "active" : ""}" data-go="teach" data-id="${id}"${id === active ? ' aria-current="page"' : ""}>${e} ${c.T(lab)}${id === "planner" && loadPlan().items.length ? ` <span class="ss-tcount">${loadPlan().items.length}</span>` : ""}</button>`).join("")}</nav>`;
  }

  function guideView(c) {
    const steps = [
      [L(c, "Pick a kit that fits your learners and your time.", "اختر حقيبة تناسب المتعلمين والوقت المتاح."), "kits", L(c, "Workshop kits", "حقائب الورش")],
      [L(c, "Load it into your plan and change it as you like, or build a plan from the activity bank.", "حمّلها في خطتك وعدّلها كما تشاء، أو ابنِ خطة من بنك الأنشطة."), "planner", L(c, "My workshop plan", "خطة ورشتي")],
      [L(c, "Print the handouts you need.", "اطبع أوراق العمل التي تحتاج إليها."), "handouts", L(c, "Handouts", "أوراق العمل")],
      [L(c, "Set up the devices: language and age group.", "جهّز الأجهزة: اللغة والفئة العمرية."), null, ""],
    ];
    return `<div class="ss-teach-quick"><h3>${L(c, "Quick start", "بداية سريعة")}</h3><ol>${steps.map(([txt, tab, lab]) =>
      `<li>${txt}${tab ? ` <button type="button" class="ss-linkbtn" data-go="teach" data-id="${tab}">${lab} ${c.fwd()}</button>` : ""}</li>`).join("")}</ol></div>
      ${TD.GUIDE.map((g) => `<section class="ss-teach-sec"><h3>${g.icon} ${c.T(g.title)}</h3>${list(c.T(g.items))}</section>`).join("")}`;
  }

  function kitsView(c) {
    const s = c.s;
    return `<p class="ss-muted">${L(c, "Each kit is a full session plan: goals, what to prepare, a timed agenda with links into the site, discussion questions and handouts. Load any kit into your plan to change it.", "كل حقيبة خطة جلسة كاملة: الأهداف، وما تحضّره، وخطة زمنية بروابط إلى الموقع، وأسئلة للنقاش، وأوراق عمل. ويمكنك تحميل أي حقيبة في خطتك لتعديلها.")}</p>
      <div class="ss-kit-grid">${TD.KITS.map((k) => {
        const total = k.agenda.reduce((a, x) => a + x.min, 0);
        return `<button type="button" class="ss-kit-card" data-go="teach" data-id="${k.id}">
          <span class="ss-kit-e">${k.icon}</span><strong>${c.T(k.title)}</strong>
          <span class="ss-kit-meta">${k.ages.map((a) => chip(ageShort(c, a))).join("")}${chip("⏱ " + mins(c, total))}${chip(c.T(TD.THEMES[k.theme]), "ss-tchip-theme")}</span>
          <span class="ss-kit-sum">${c.T(k.summary)}</span><span class="ss-mod-go">${L(c, "Open the kit", "افتح الحقيبة")} ${c.fwd()}</span></button>`;
      }).join("")}</div>`;
  }

  function kitView(c, k) {
    const s = c.s, T = c.T, total = k.agenda.reduce((a, x) => a + x.min, 0), plan = loadPlan();
    let t0 = 0;
    const agenda = k.agenda.map((it) => {
      const a = ACT[it.a], t1 = t0 + it.min, spec = it.open || a.open;
      const row = `<li class="ss-ag-item"><span class="ss-ag-time">${t0}–${t1}</span><div class="ss-ag-body">
        <div class="ss-ag-head"><strong>${a.icon} ${T(a.title)}</strong>${chip(mins(c, it.min))}</div>
        ${it.note ? `<p class="ss-ag-note">${T(it.note)}</p>` : ""}<p class="ss-muted">${T(a.how)}</p>
        <div class="ss-ag-actions">${openBtn(c, spec, k.ages)}${a.handout ? `<button type="button" class="ss-btn ss-btn-ghost ss-btn-sm" data-act="g" data-g="print" data-v="handout:${a.handout}">🖨️ ${T(TD.HANDOUTS.find((h) => h.id === a.handout).title)}</button>` : ""}</div></div></li>`;
      t0 = t1; return row;
    }).join("");
    const loadAsk = s.loadAsk === k.id && plan.items.length
      ? `<div class="ss-teach-ask">${L(c, `Your plan already has ${plan.items.length} activities.`, `في خطتك الآن ${plan.items.length} من الأنشطة.`)} ${c.btn(L(c, "Replace my plan", "استبدل خطتي"), "load", k.id + ":replace")} ${c.btn(L(c, "Add to the end", "أضفها إلى آخرها"), "load", k.id + ":append", "ss-btn-ghost")} ${c.btn(L(c, "Cancel", "إلغاء"), "load-cancel", null, "ss-btn-ghost")}</div>` : "";
    return `<article class="ss-kit">
      <button type="button" class="ss-linkbtn" data-go="teach" data-id="kits">${L(c, "All kits", "كل الحقائب")}</button>
      <div class="ss-kit-top"><span class="ss-kit-e">${k.icon}</span><div><h3>${T(k.title)}</h3>
        <div class="ss-kit-meta">${k.ages.map((a) => chip(ageShort(c, a))).join("")}${chip("⏱ " + mins(c, total))}${chip("👥 " + T(k.group))}</div></div></div>
      <p>${T(k.summary)}</p>
      <div class="ss-teach-actions">${c.btn("🗓️ " + L(c, "Use this kit in my plan", "استعمل الحقيبة في خطتي"), "load", k.id)} ${c.btn("🖨️ " + L(c, "Print facilitator sheet", "اطبع ورقة الميسّر"), "print", "kit:" + k.id, "ss-btn-ghost")}</div>${loadAsk}
      <div class="ss-kit-cols">
        <section class="ss-teach-sec"><h4>🎯 ${L(c, "Goals", "الأهداف")}</h4>${list(T(k.goals))}</section>
        <section class="ss-teach-sec"><h4>🧰 ${L(c, "Before class", "قبل الحصة")}</h4><ul class="ss-teach-check">${T(k.prepare).map((x, i) => `<li><label><input type="checkbox"> ${x}</label></li>`).join("")}</ul></section>
      </div>
      <section class="ss-teach-sec"><h4>⏱ ${L(c, "Agenda", "خطة الجلسة")} (${mins(c, total)})</h4><ol class="ss-agenda">${agenda}</ol></section>
      <section class="ss-teach-sec"><h4>💬 ${L(c, "Discussion questions", "أسئلة للنقاش")}</h4>${list(T(k.questions))}</section>
      <div class="ss-kit-cols">
        <section class="ss-teach-sec"><h4>🚀 ${L(c, "Going further", "للتوسع")}</h4>${list(T(k.extend))}</section>
        <section class="ss-teach-sec ss-teach-care"><h4>🤲 ${L(c, "Take care", "تنبيهات")}</h4>${list(T(k.care))}</section>
      </div>
      <section class="ss-teach-sec"><h4>🖨️ ${L(c, "Handouts for this kit", "أوراق العمل لهذه الحقيبة")}</h4><div class="ss-teach-actions">${k.handouts.map((h) => c.btn(T(TD.HANDOUTS.find((x) => x.id === h).title), "print", "handout:" + h, "ss-btn-ghost ss-btn-sm")).join(" ")}</div></section>
    </article>`;
  }

  function activitiesView(c) {
    const s = c.s; s.f = s.f || { age: "all", theme: "all", time: "all" };
    const f = s.f, plan = loadPlan(), refs = allRefs();
    const seg = (k, opts) => `<div class="ss-segments ss-teach-filter">${opts.map(([v, lab]) => `<button type="button" class="ss-seg ${f[k] === v ? "selected" : ""}" data-act="g" data-g="f" data-v="${k}:${v}">${lab}</button>`).join("")}</div>`;
    const timeOk = (m) => f.time === "all" || (f.time === "10" && m <= 10) || (f.time === "15" && m <= 15) || (f.time === "20" && m <= 20) || (f.time === "25" && m >= 25);
    const items = TD.ACTIVITIES.filter((a) => (f.age === "all" || a.ages.includes(f.age)) && (f.theme === "all" || a.theme === f.theme) && timeOk(a.min));
    return `<p class="ss-muted">${L(c, `${TD.ACTIVITIES.length} activities. Filter them, open them on the site, or add them to your plan.`, `${TD.ACTIVITIES.length} نشاطاً. صفِّها، أو افتحها في الموقع، أو أضفها إلى خطتك.`)}</p>
      <div class="ss-teach-filters">
        <div><span class="ss-flabel">${L(c, "Age", "العمر")}</span>${seg("age", [["all", L(c, "All", "الكل")], ...ALL_AGES.map((a) => [a, ageShort(c, a)])])}</div>
        <div><span class="ss-flabel">${L(c, "Theme", "المحور")}</span>${seg("theme", [["all", L(c, "All", "الكل")], ...Object.keys(TD.THEMES).map((k) => [k, c.T(TD.THEMES[k])])])}</div>
        <div><span class="ss-flabel">${L(c, "Time", "المدة")}</span>${seg("time", [["all", L(c, "Any", "أي مدة")], ["10", L(c, "10 min or less", "10 دقائق أو أقل")], ["15", L(c, "15 min or less", "15 دقيقة أو أقل")], ["20", L(c, "20 min or less", "20 دقيقة أو أقل")], ["25", L(c, "25 min or more", "25 دقيقة أو أكثر")]])}</div>
      </div>
      <div class="ss-act-grid">${items.length ? items.map((a) => {
        const inPlan = plan.items.filter((x) => x.a === a.id).length;
        return `<div class="ss-act-card"><div class="ss-act-top"><span class="ss-act-e">${a.icon}</span><strong>${c.T(a.title)}</strong></div>
          <div class="ss-kit-meta">${chip("⏱ " + mins(c, a.min))}${chip(c.T(TD.THEMES[a.theme]), "ss-tchip-theme")}${a.ages.map((x) => chip(ageShort(c, x))).join("")}</div>
          <p>${c.T(a.how)}</p>${a.refs ? `<p class="ss-act-refs">${a.refs.map((r) => refLink(c, refs[r])).join(" ")}</p>` : ""}
          <div class="ss-ag-actions">${c.btn("+ " + L(c, "Add to my plan", "أضف إلى خطتي") + (inPlan ? ` (${inPlan})` : ""), "add", a.id, "ss-btn-sm")}${openBtn(c, a.open, f.age !== "all" ? [f.age] : a.ages)}${a.handout ? c.btn("🖨️ " + c.T(TD.HANDOUTS.find((h) => h.id === a.handout).title), "print", "handout:" + a.handout, "ss-btn-ghost ss-btn-sm") : ""}</div></div>`;
      }).join("") : `<p class="ss-muted">${L(c, "No activity matches these filters.", "لا يوجد نشاط يطابق هذه الاختيارات.")}</p>`}</div>`;
  }

  function plannerView(c) {
    const s = c.s, p = loadPlan(), T = c.T, total = planTotal(p);
    let t0 = 0;
    const rows = p.items.map((it, i) => {
      const a = ACT[it.a]; if (!a) return "";
      const t1 = t0 + (Number(it.min) || 0);
      const r = `<li class="ss-plan-row"><span class="ss-ag-time" data-range="${i}">${t0}–${t1}</span>
        <div class="ss-plan-main"><strong>${a.icon} ${T(a.title)}</strong>${it.note ? `<p class="ss-ag-note">${T(it.note)}</p>` : ""}</div>
        <label class="ss-plan-min"><input type="number" min="1" max="180" value="${it.min}" data-g-input="p-min" data-i="${i}" aria-label="${L(c, "Minutes", "الدقائق")}"> ${L(c, "min", "د")}</label>
        <span class="ss-plan-btns">${c.btn("↑", "up", i, "ss-btn-ghost ss-btn-sm")}${c.btn("↓", "down", i, "ss-btn-ghost ss-btn-sm")}${c.btn("✕", "rm", i, "ss-btn-ghost ss-btn-sm")}</span></li>`;
      t0 = t1; return r;
    }).join("");
    const ages = [["", L(c, "Not set", "غير محدد")], ...ALL_AGES.map((a) => [a, ageShort(c, a)])];
    return `<div class="ss-plan">
      <label class="ss-plan-field"><span>${L(c, "Workshop title", "عنوان الورشة")}</span><input type="text" maxlength="120" value="${c.esc(p.title || "")}" data-g-input="p-title" placeholder="${L(c, "e.g. Sadaqah week, Grade 5", "مثال: أسبوع الصدقة، الصف الخامس")}"></label>
      <div class="ss-plan-field"><span>${L(c, "Age group", "الفئة العمرية")}</span><div class="ss-segments">${ages.map(([v, lab]) => `<button type="button" class="ss-seg ${p.age === v ? "selected" : ""}" data-act="g" data-g="p-age" data-v="${v}">${lab}</button>`).join("")}</div></div>
      ${p.items.length ? `<ol class="ss-plan-list">${rows}</ol>
        <p class="ss-plan-total">${L(c, "Total", "المجموع")}: <strong id="ss-plan-total">${mins(c, total)}</strong></p>`
      : `<div class="ss-empty">${L(c, "Your plan is empty. Add activities from the activity bank, or load a kit.", "خطتك فارغة. أضف أنشطة من بنك الأنشطة، أو حمّل حقيبة.")}</div>`}
      <div class="ss-teach-actions"><button type="button" class="ss-btn ss-btn-ghost" data-go="teach" data-id="activities">+ ${L(c, "Add activities", "أضف أنشطة")}</button> <button type="button" class="ss-btn ss-btn-ghost" data-go="teach" data-id="kits">🎒 ${L(c, "Load a kit", "حمّل حقيبة")}</button></div>
      <label class="ss-plan-field"><span>${L(c, "Notes for yourself", "ملاحظات لنفسك")}</span><textarea rows="3" maxlength="2000" data-g-input="p-notes">${c.esc(p.notes || "")}</textarea></label>
      ${p.items.length ? `<div class="ss-teach-actions">${c.btn("🖨️ " + L(c, "Print plan", "اطبع الخطة"), "print", "plan")} ${c.btn("📋 " + L(c, "Copy as text", "انسخها نصاً"), "copy", null, "ss-btn-ghost")} ${s.clearAsk ? `${L(c, "Remove every activity from the plan?", "أتريد حذف كل الأنشطة من الخطة؟")} ${c.btn(L(c, "Yes, clear it", "نعم، احذفها"), "clear", "yes", "ss-btn-ghost")} ${c.btn(L(c, "Cancel", "إلغاء"), "clear", "no", "ss-btn-ghost")}` : c.btn(L(c, "Clear plan", "امسح الخطة"), "clear", null, "ss-btn-ghost")}</div>` : ""}
      <p class="ss-muted">${L(c, "Your plan is saved in this browser only.", "تُحفظ خطتك في هذا المتصفح فقط.")}</p></div>`;
  }

  function handoutsView(c) {
    const s = c.s; s.cert = s.cert || {};
    const plan = loadPlan(), ct = s.cert.title != null ? s.cert.title : (plan.title || "");
    return `<p class="ss-muted">${L(c, "Each handout prints on its own page in the language on screen. Use the language button at the top to print the other version.", "تُطبع كل ورقة في صفحة مستقلة باللغة الظاهرة على الشاشة. استعمل زر اللغة في الأعلى لطباعة النسخة الأخرى.")}</p>
      <div class="ss-act-grid">${TD.HANDOUTS.map((h) => `<div class="ss-act-card ss-ho-card">
        <div class="ss-act-top"><span class="ss-act-e">${h.icon}</span><strong>${c.T(h.title)}</strong></div>
        <div class="ss-kit-meta">${h.ages.map((x) => chip(ageShort(c, x))).join("")}</div><p>${c.T(h.desc)}</p>
        ${h.id === "certificate" ? `<label class="ss-plan-field"><span>${L(c, "Workshop title", "عنوان الورشة")}</span><input type="text" maxlength="120" value="${c.esc(ct)}" data-g-input="cert-title"></label>
          <label class="ss-plan-field"><span>${L(c, "Date", "التاريخ")}</span><input type="text" maxlength="40" value="${c.esc(s.cert.date || "")}" data-g-input="cert-date"></label>` : ""}
        <div class="ss-ag-actions">${c.btn("🖨️ " + L(c, "Print", "اطبع"), "print", "handout:" + h.id, "ss-btn-sm")}${c.btn(s.prev === h.id ? L(c, "Hide preview", "أخفِ المعاينة") : L(c, "Preview", "معاينة"), "prev", h.id, "ss-btn-ghost ss-btn-sm")}</div>
        ${s.prev === h.id ? `<div class="ss-ho-preview" dir="${c.ar ? "rtl" : "ltr"}">${handoutHTML(c, h.id)}</div>` : ""}</div>`).join("")}</div>`;
  }

  function scholarsView(c) {
    const S = TD.SCHOLARS, T = c.T, refs = allRefs();
    const daily = (window.SADAQAH_DAILY || []).map((d) => ({ en: d.ref_en, ar: d.ref_ar, url: d.url }));
    const seen = {}, all = [];
    Object.keys(refs).map((k) => refs[k]).concat(daily).forEach((r) => { if (r && r.url && !seen[r.url]) { seen[r.url] = 1; all.push(r); } });
    const grp = (r) => /quran\.com/.test(r.url) ? 0 : /bukhari/.test(r.url) ? 1 : /muslim/.test(r.url) ? 2 : 3;
    const num = (r) => { const m = r.url.match(/[:/](\d+)(?:[/:](\d+))?/); return m ? Number(m[1]) * 1000 + Number(m[2] || 0) : 0; };
    all.sort((a, b) => grp(a) - grp(b) || num(a) - num(b));
    const gl = [L(c, "Qur'an", "القرآن الكريم"), L(c, "Sahih al-Bukhari", "صحيح البخاري"), L(c, "Sahih Muslim", "صحيح مسلم"), L(c, "Other collections", "كتب أخرى")];
    const refList = [0, 1, 2, 3].map((g) => { const xs = all.filter((r) => grp(r) === g); return xs.length ? `<p><strong>${gl[g]}:</strong> ${xs.map((r) => refLink(c, r)).join(" ")}</p>` : ""; }).join("");
    const SS = window.SADAQAH_STORIES || {}, stories = (c.ar ? SS.ar : SS.en) || [];
    return `<p>${T(S.intro)}</p>
      <section class="ss-teach-sec"><h3>✂️ ${L(c, "What the site simplifies", "ما بسّطه الموقع")}</h3>${list(T(S.simplify))}</section>
      <section class="ss-teach-sec"><h3>⚖️ ${L(c, "Where the site says scholars differ", "المسائل التي يذكر فيها الموقع اختلاف العلماء")}</h3>
        <div class="ss-table-wrap"><table class="ss-teach-table"><thead><tr><th>${L(c, "Question", "المسألة")}</th><th>${L(c, "What the site does", "ما يفعله الموقع")}</th><th>${L(c, "Where", "أين")}</th></tr></thead>
        <tbody>${S.differ.map((d) => `<tr><td><strong>${T(d.topic)}</strong></td><td>${T(d.site)}</td><td>${T(d.where)}</td></tr>`).join("")}</tbody></table></div></section>
      <section class="ss-teach-sec"><h3>🧑‍🏫 ${L(c, "Using the site with learners", "استعمال الموقع مع المتعلمين")}</h3>${list(T(S.guidance))}</section>
      <section class="ss-teach-sec"><h3>🔗 ${L(c, "Qur'an and hadith cited in the games, activities and daily challenges", "الآيات والأحاديث المذكورة في الألعاب والأنشطة والتحديات اليومية")}</h3>${refList}
        <p class="ss-muted">${L(c, "Each story lists its own sources on its last page and in the table below.", "تذكر كل حكاية مصادرها في صفحتها الأخيرة وفي الجدول أدناه.")}</p></section>
      <section class="ss-teach-sec"><h3>📖 ${L(c, "Stories and their evidence labels", "الحكايات وحالات توثيقها")}</h3>
        <div class="ss-table-wrap"><table class="ss-teach-table"><thead><tr><th>#</th><th>${L(c, "Story", "الحكاية")}</th><th>${L(c, "Evidence label", "حالة التوثيق")}</th><th>${L(c, "Sources", "المصادر")}</th></tr></thead>
        <tbody>${stories.map((st) => `<tr><td>${st.id}</td><td><button type="button" class="ss-linkbtn" data-act="g" data-g="open" data-v="story:${st.id}|adults">${st.title}</button></td><td>${st.evidenceStatus}</td><td>${(st.sources || []).map((src) => src.url ? `<a class="ss-ref" href="${src.url}" target="_blank" rel="noopener noreferrer">${c.esc(src.name)} ↗</a>` : c.esc(src.name)).join("<br>")}</td></tr>`).join("")}</tbody></table></div></section>`;
  }

  M.teach = {
    render(c) {
      const id = c.state.params.id || "guide";
      const kit = KIT[id];
      const tab = kit ? "kits" : (TABS.some((x) => x[0] === id) ? id : "guide");
      const body = kit ? kitView(c, kit) : tab === "kits" ? kitsView(c) : tab === "activities" ? activitiesView(c)
        : tab === "planner" ? plannerView(c) : tab === "handouts" ? handoutsView(c) : tab === "scholars" ? scholarsView(c) : guideView(c);
      return `<div class="ss-section-head ss-teach-head"><h2>🍎 ${c.t("mod.teach")}</h2><p>${L(c,
        "Guidelines, ready-made workshop kits, an activity planner and printable handouts for teachers, parents, scholars and youth leaders.",
        "إرشادات، وحقائب ورش جاهزة، ومخطِّط للأنشطة، وأوراق عمل للطباعة، للمعلمين وأولياء الأمور والعلماء وقادة الشباب.")}</p></div>
        ${tabNav(c, tab)}<div class="ss-teach-body">${body}</div>`;
    },
    act(c, name, el) {
      const v = el.getAttribute("data-v"), s = c.s;
      if (name === "open") { const [spec, pref] = v.split("|"); openOnSite(c, spec, pref ? pref.split(",") : []); return; }
      if (name === "f") { const [k, x] = v.split(":"); s.f[k] = x; c.rerender(); return; }
      if (name === "add") {
        const p = loadPlan(), a = ACT[v]; if (!a) return;
        p.items.push({ a: v, min: a.min }); savePlan(p);
        c.toast(L(c, `Added to your plan (${p.items.length})`, `أُضيف إلى خطتك (${p.items.length})`)); c.rerender(); return;
      }
      if (name === "load") {
        const [kid, mode] = v.split(":"), k = KIT[kid]; if (!k) return;
        const p = loadPlan();
        if (!mode && p.items.length) { s.loadAsk = kid; c.rerender(); return; }
        const items = k.agenda.map((x) => ({ a: x.a, min: x.min, note: x.note || null }));
        if (mode === "append") p.items = p.items.concat(items);
        else { p.items = items; p.title = c.T(k.title); p.age = k.ages[0]; }
        savePlan(p); s.loadAsk = null;
        c.toast(L(c, "Kit loaded into your plan", "حُمّلت الحقيبة في خطتك"));
        c.go("teach", { id: "planner" }); return;
      }
      if (name === "load-cancel") { s.loadAsk = null; c.rerender(); return; }
      if (name === "p-age") { const p = loadPlan(); p.age = v || ""; savePlan(p); c.rerender(); return; }
      if (name === "up" || name === "down" || name === "rm") {
        const p = loadPlan(), i = Number(v), j = name === "up" ? i - 1 : i + 1;
        if (name === "rm") p.items.splice(i, 1);
        else if (j >= 0 && j < p.items.length) { const t = p.items[i]; p.items[i] = p.items[j]; p.items[j] = t; }
        savePlan(p); c.rerender(); return;
      }
      if (name === "clear") {
        if (v === "yes") { savePlan({ title: "", age: "", notes: "", items: [] }); s.clearAsk = false; }
        else if (v === "no") s.clearAsk = false;
        else s.clearAsk = true;
        c.rerender(); return;
      }
      if (name === "copy") {
        const txt = planText(c, loadPlan());
        try { navigator.clipboard.writeText(txt).then(() => c.toast(L(c, "Copied", "نُسخ")), () => c.toast(L(c, "Could not copy", "تعذّر النسخ"))); } catch (e) { c.toast(L(c, "Could not copy", "تعذّر النسخ")); }
        return;
      }
      if (name === "prev") { s.prev = s.prev === v ? null : v; c.rerender(); return; }
      if (name === "print") {
        const [kind, x] = v.split(":");
        const html = kind === "kit" ? kitPrint(c, KIT[x]) : kind === "plan" ? planPrint(c, loadPlan()) : handoutHTML(c, x);
        if (html) printSheet(c, html);
        return;
      }
    },
    input(c, name, el) {
      const s = c.s;
      if (name === "p-title" || name === "p-notes") { const p = loadPlan(); p[name === "p-title" ? "title" : "notes"] = el.value; savePlan(p); return; }
      if (name === "p-min") {
        const p = loadPlan(), i = Number(el.getAttribute("data-i")), n = Math.max(1, Math.min(180, Math.round(Number(el.value) || 0)));
        if (!p.items[i] || !el.value) return;
        p.items[i].min = n; savePlan(p);
        let t0 = 0;
        p.items.forEach((it, k) => { const t1 = t0 + (Number(it.min) || 0); const r = document.querySelector(`[data-range="${k}"]`); if (r) r.textContent = `${t0}–${t1}`; t0 = t1; });
        const tot = document.getElementById("ss-plan-total"); if (tot) tot.textContent = mins(c, planTotal(p));
        return;
      }
      if (name === "cert-title" || name === "cert-date") { s.cert = s.cert || {}; s.cert[name === "cert-title" ? "title" : "date"] = el.value; return; }
    },
  };
})();
