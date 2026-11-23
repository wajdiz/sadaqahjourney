/* =========================================================================
   Sadaqah Stories — newer games (EN + AR)
     kindness-catch : catch falling good deeds in a basket (7–10)
     water-pipes    : turn the pipes to bring water from the well (7–10, 11–14)
     word-hunt      : word search with words from the lexicon (all ages)
     story-sprint   : quick questions from the story quizzes (11–14 and up)
   Same plug-in shape as games.js. No new religious claims are made here:
   deed notes reuse the references already checked for games.js, plus
   Sahih al-Bukhari 2363 (the man who gave water to a thirsty dog), checked
   on sunnah.com. Word meanings are shortened from data-lexicon.js. Sprint
   questions come unchanged from data-quiz.js.
   ========================================================================= */
(function () {
  const G = window.SADAQAH_GAMES = window.SADAQAH_GAMES || {};
  const R = window.SADAQAH_REFS || {};
  const FX = window.SadaqahFX || { play() {}, confetti() {} };
  const rand = (n) => Math.floor(Math.random() * n);
  const mix = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const ref = (c, r) => r && r.url ? ` <a class="ss-ref" href="${r.url}" target="_blank" rel="noopener noreferrer">${c.T(r)} ↗</a>` : "";
  const best = (k, v, lower) => { try { const old = Number(localStorage.getItem(k)) || 0; if (v != null && (!old || (lower ? v < old : v > old))) { localStorage.setItem(k, v); return v; } return old; } catch (e) { return v || 0; } };

  /* ======================= Kindness Catch (7–10) ======================= */
  const DEEDS = [
    { e: "😊", w: { en: "Smile", ar: "ابتسامة" }, r: "m2626", note: { en: "Do not think any good deed is too small, even meeting someone with a cheerful face.", ar: "لا تحقرنّ من المعروف شيئاً، ولو أن تلقى أخاك بوجه طلق." } },
    { e: "💬", w: { en: "Kind word", ar: "كلمة طيبة" }, r: "b2989", note: { en: "The Prophet ﷺ said that a good word is charity.", ar: "أخبر النبي ﷺ أن الكلمة الطيبة صدقة." } },
    { e: "🧹", w: { en: "Clear the path", ar: "تنظيف الطريق" }, r: "b2989", note: { en: "Removing something harmful from the road is charity.", ar: "إماطة الأذى عن الطريق صدقة." } },
    { e: "🎒", w: { en: "Help carry", ar: "المساعدة في الحمل" }, r: "b2989", note: { en: "The Prophet ﷺ counted helping someone onto their ride, or lifting their bags onto it, as charity.", ar: "عدّ النبي ﷺ إعانة الرجل على دابته، أو رفع متاعه عليها، صدقة." } },
    { e: "🤝", w: { en: "Make peace", ar: "الإصلاح بين اثنين" }, r: "b2989", note: { en: "The Prophet ﷺ said that being fair between two people is charity.", ar: "أخبر النبي ﷺ أن العدل بين الاثنين صدقة." } },
    { e: "🌳", w: { en: "Plant a tree", ar: "غرس شجرة" }, r: "b2320", note: { en: "When a bird, a person or an animal eats from what you planted, it counts as charity for you.", ar: "إذا أكل طير أو إنسان أو بهيمة مما غرسته، كان لك به صدقة." } },
    { e: "🍲", w: { en: "Share food", ar: "مشاركة الطعام" }, r: "m2625", note: { en: "The Prophet ﷺ told Abu Dharr to add water to his broth and share it with his neighbours.", ar: "أوصى النبي ﷺ أبا ذر أن يُكثر ماء المرق ويتعاهد جيرانه." } },
    { e: "💧", w: { en: "Give water", ar: "سقي الماء" }, r: "b2363", note: { en: "The Prophet ﷺ told of a man who gave water to a thirsty dog. Allah thanked him and forgave him.", ar: "أخبر النبي ﷺ عن رجل سقى كلباً عطشان، فشكر الله له فغفر له." } },
  ];
  const NOTS = [
    { e: "🗑️", w: { en: "Littering", ar: "رمي القمامة" } },
    { e: "😠", w: { en: "Mean word", ar: "كلمة جارحة" } },
    { e: "🚿", w: { en: "Wasting water", ar: "إهدار الماء" } },
    { e: "🙈", w: { en: "Ignoring someone in need", ar: "تجاهل المحتاج" } },
    { e: "😤", w: { en: "Pushing in line", ar: "تجاوز الدور" } },
  ];
  const CATCH_SECS = 45;
  let live = null; // the round that the arrow keys control
  document.addEventListener("keydown", (e) => {
    if (!live || live.phase !== "play") return;
    if (e.key === "ArrowLeft") { live.bx = clamp(live.bx - 8, 8, 92); e.preventDefault(); }
    if (e.key === "ArrowRight") { live.bx = clamp(live.bx + 8, 8, 92); e.preventDefault(); }
  });
  function catchLoop(c, s) {
    const field = document.getElementById("ss-kc-field"), basket = document.getElementById("ss-kc-basket");
    if (!field || !basket) return;
    const $ = (id) => document.getElementById(id);
    const items = [], speed0 = s.gentle ? 55 : 90, gap = s.gentle ? 1300 : 850;
    let last = performance.now(), spawnIn = 300, lastLane = -1, shownSec = -1;
    const point = (e) => { const r = field.getBoundingClientRect(); s.bx = clamp((e.clientX - r.left) / r.width * 100, 8, 92); };
    field.addEventListener("pointermove", point); field.addEventListener("pointerdown", point);
    live = s;
    try { field.scrollIntoView({ block: "center", behavior: "auto" }); } catch (e) {}
    function spawn() {
      const good = Math.random() < 0.68, list = good ? DEEDS : NOTS, k = rand(list.length);
      let lane; do { lane = rand(5); } while (lane === lastLane); lastLane = lane;
      const el = document.createElement("div"); el.className = "ss-kc-item";
      el.innerHTML = `<span class="ss-kc-e">${list[k].e}</span><span class="ss-kc-w">${c.T(list[k].w)}</span>`;
      const it = { el, good, k, x: 14 + lane * 18, y: -60 }; el.style.left = it.x + "%";
      field.appendChild(el); items.push(it);
    }
    function end() {
      s.phase = "end"; if (live === s) live = null;
      s.best = best("ss_catch_best", s.score);
      if (s.score > 0) c.addStars(Math.min(5, Math.ceil(s.score / 3)));
      if (s.score >= 10 && s.hearts === 3) c.awardBadge("catcher");
      FX.play("win"); if (s.score >= 8) FX.confetti();
      c.rerender();
    }
    function tick(now) {
      if (c.state._g !== s || s.phase !== "play" || !field.isConnected) { if (live === s) live = null; return; }
      const dt = Math.min(50, now - last); last = now;
      s.left -= dt; spawnIn -= dt;
      const H = field.clientHeight, W = field.clientWidth, v = speed0 * (1 + 0.5 * (1 - Math.max(0, s.left) / (CATCH_SECS * 1000)));
      basket.style.left = s.bx + "%";
      if (spawnIn <= 0) { spawn(); spawnIn = gap * (0.8 + Math.random() * 0.4); }
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i]; it.y += v * dt / 1000; it.el.style.transform = `translate(-50%, ${it.y.toFixed(1)}px)`;
        const hit = it.y + 50 >= H - 56 && it.y <= H - 30 && Math.abs(it.x - s.bx) * W / 100 < 54;
        if (hit) {
          if (it.good) { s.score++; s.caught[it.k] = (s.caught[it.k] || 0) + 1; FX.play("ok"); $("ss-kc-score").textContent = s.score; $("ss-kc-msg").textContent = "⭐ " + c.T(DEEDS[it.k].w); basket.classList.remove("ss-kc-yes"); void basket.offsetWidth; basket.classList.add("ss-kc-yes"); }
          else { s.hearts--; FX.play("no"); $("ss-kc-hearts").textContent = "❤️".repeat(Math.max(0, s.hearts)) + "🤍".repeat(3 - Math.max(0, s.hearts)); $("ss-kc-msg").textContent = NOTS[it.k].e + " " + c.T(NOTS[it.k].w) + (c.ar ? ": ليس من أعمال الخير" : ": not a good deed"); field.classList.remove("ss-shake"); void field.offsetWidth; field.classList.add("ss-shake"); }
        }
        if (hit || it.y > H) { it.el.remove(); items.splice(i, 1); }
      }
      const sec = Math.max(0, Math.ceil(s.left / 1000));
      if (sec !== shownSec) { shownSec = sec; $("ss-kc-time").textContent = sec; }
      if (s.left <= 0 || s.hearts <= 0) return end();
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  G["kindness-catch"] = {
    title: { en: "Kindness Catch", ar: "سلّة الخير" }, icon: "🧺",
    howto: { en: "Good deeds and other things fall from the sky. Move the basket to catch the good deeds and let the rest fall. Move with your finger, the mouse, the arrow keys or the two buttons.", ar: "تتساقط من السماء أعمال خير وأشياء أخرى. حرّك السلة لتلتقط أعمال الخير واترك الباقي يسقط. حرّكها بإصبعك أو بالفأرة أو بمفتاحي الأسهم أو بالزرّين." },
    sketch: `<path d="M44 40 h32 l-4 14 h-24z" fill="#c79a3a"/><path d="M42 40 h36" stroke="#a37d22" stroke-width="3" stroke-linecap="round"/><circle cx="30" cy="14" r="7" fill="#e8a23a" class="ss-anim-drop"/><circle cx="60" cy="8" r="7" fill="#5b8c4f" class="ss-anim-drop" style="animation-delay:.5s"/><circle cx="92" cy="16" r="7" fill="#2f8f87" class="ss-anim-drop" style="animation-delay:1s"/><path d="M60 5 l1 2.2 2.4.3-1.8 1.7.5 2.4-2.1-1.2-2.1 1.2.5-2.4-1.8-1.7 2.4-.3z" fill="#fff"/>`,
    init(c) { Object.assign(c.s, { phase: "intro", gentle: false }); return this.render(c); },
    render(c) {
      const s = c.s, ar = c.ar;
      if (s.phase === "intro") {
        return `${c.head()}
          <div class="ss-kc-legend"><div><h5>✅ ${ar ? "التقط هذه" : "Catch these"}</h5><div class="ss-kc-chips">${DEEDS.map((d) => `<span class="ss-kc-chip">${d.e} ${c.T(d.w)}</span>`).join("")}</div></div>
          <div><h5>🚫 ${ar ? "اترك هذه تسقط" : "Let these fall"}</h5><div class="ss-kc-chips">${NOTS.map((d) => `<span class="ss-kc-chip">${d.e} ${c.T(d.w)}</span>`).join("")}</div></div></div>
          <p class="ss-game-sub">${ar ? `الجولة ${CATCH_SECS} ثانية، ومعك ثلاثة قلوب.` : `A round lasts ${CATCH_SECS} seconds and you have three hearts.`}</p>
          ${c.btn("▶ " + (ar ? "ابدأ" : "Start"), "start", "normal")} ${c.btn("🐢 " + (ar ? "ابدأ بسرعة هادئة" : "Start at a gentle speed"), "start", "gentle", "ss-btn-ghost")}`;
      }
      if (s.phase === "play") {
        return `${c.head()}<div class="ss-kc-hud"><span>⭐ <b id="ss-kc-score">${s.score}</b></span><span id="ss-kc-hearts">❤️❤️❤️</span><span>⏱ <b id="ss-kc-time">${CATCH_SECS}</b></span></div>
          <div class="ss-kc-field" id="ss-kc-field" dir="ltr"><div class="ss-kc-basket" id="ss-kc-basket" style="left:${s.bx}%">🧺</div></div>
          <p class="ss-kc-msg" id="ss-kc-msg" aria-live="polite">&nbsp;</p>
          <div class="ss-kc-pad" dir="ltr">${c.btn("◀", "left", null, "ss-btn-ghost")} ${c.btn("▶", "right", null, "ss-btn-ghost")}</div>`;
      }
      const got = DEEDS.map((d, k) => ({ d, n: s.caught[k] || 0 })).filter((x) => x.n);
      return `${c.head()}<div class="ss-game-win">${s.score >= 8 ? "🎉" : "🧺"}</div>
        <h4>${ar ? `التقطت ${s.score} من أعمال الخير` : `You caught ${s.score} good deeds`}${s.best ? ` · ${ar ? "أفضل نتيجة" : "best"}: ${s.best}` : ""}</h4>
        ${s.hearts <= 0 ? `<p class="ss-hint">${ar ? "انتهت القلوب. اقرأ القائمتين مرة أخرى وجرّب السرعة الهادئة." : "You ran out of hearts. Read the two lists again and try the gentle speed."}</p>` : ""}
        ${got.length ? `<div class="ss-summary"><h4>${ar ? "ما في سلّتك" : "What is in your basket"}</h4><ul>${got.map(({ d, n }) => `<li><strong>${d.e} ${c.T(d.w)} ×${n}:</strong> ${c.T(d.note)}${ref(c, R[d.r])}</li>`).join("")}</ul></div>` : ""}
        ${c.btn("↻ " + c.t("nav.restart"), "restart", null, "ss-btn-ghost")} ${c.finish()}`;
    },
    act(c, name, el) {
      const s = c.s;
      if (name === "restart") { s.phase = "intro"; return c.rerender(); }
      if (name === "start") {
        Object.assign(s, { phase: "play", gentle: el.getAttribute("data-v") === "gentle", score: 0, hearts: 3, left: CATCH_SECS * 1000, bx: 50, caught: {} });
        c.rerender(); FX.play("pop"); return catchLoop(c, s);
      }
      if (name === "left") s.bx = clamp(s.bx - 10, 8, 92);
      if (name === "right") s.bx = clamp(s.bx + 10, 8, 92);
    },
  };

  /* ======================= Bring the Water (7–10, 11–14) =======================
     A pipe puzzle. Each tile has openings on some of its four sides, kept as
     bits: up 1, right 2, down 4, left 8. A level is a random tree of pipes
     grown from the well; the ends of its branches are houses. */
  const OPP = { 1: 4, 2: 8, 4: 1, 8: 2 }, STEP = { 1: [-1, 0], 2: [0, 1], 4: [1, 0], 8: [0, -1] };
  const bits = (m) => [1, 2, 4, 8].filter((b) => m & b).length;
  const turn = (m) => ((m << 1) & 15) | (m >> 3);
  function wet(s) {
    const N = s.N, seen = new Set([s.root]), q = [s.root];
    while (q.length) {
      const a = q.pop(), r = Math.floor(a / N), col = a % N;
      [1, 2, 4, 8].forEach((b) => {
        if (!(s.mask[a] & b)) return;
        const nr = r + STEP[b][0], nc = col + STEP[b][1]; if (nr < 0 || nc < 0 || nr >= N || nc >= N) return;
        const n = nr * N + nc; if (!seen.has(n) && (s.mask[n] & OPP[b])) { seen.add(n); q.push(n); }
      });
    }
    return seen;
  }
  function pipeLevel(N) {
    for (let attempt = 0; attempt < 60; attempt++) {
      const mask = new Array(N * N).fill(0), root = rand(N * N), tree = [root], inTree = new Set(tree);
      const want = Math.max(4, Math.round(N * N * 0.72));
      for (let guard = 0; tree.length < want && guard < 4000; guard++) {
        const a = tree[rand(tree.length)]; if (bits(mask[a]) >= 3) continue;
        const b = mix([1, 2, 4, 8])[0], nr = Math.floor(a / N) + STEP[b][0], nc = a % N + STEP[b][1];
        if (nr < 0 || nc < 0 || nr >= N || nc >= N) continue;
        const n = nr * N + nc; if (inTree.has(n)) continue;
        mask[a] |= b; mask[n] |= OPP[b]; tree.push(n); inTree.add(n);
      }
      const houses = tree.filter((a) => a !== root && bits(mask[a]) === 1);
      if (tree.length < want || houses.length < (N >= 4 ? 3 : 2)) continue;
      const s = { N, root, houses, mask: mask.map((m) => { let x = m; for (let i = rand(4); i > 0; i--) x = turn(x); return x; }) };
      const w = wet(s); if (houses.every((h) => w.has(h))) continue; // already solved: make another
      return s;
    }
    return null;
  }
  const PIPE_FACTS = [
    { t: { en: "A well keeps giving water for years. Charity that keeps helping like this is called Sadaqah Jariyah.", ar: "البئر تعطي الماء سنوات طويلة. والعطاء الذي يستمر نفعه هكذا يسمى صدقة جارية." }, r: "m1631" },
    { t: { en: "The Prophet ﷺ told of a man who gave water to a thirsty dog. Allah thanked him and forgave him.", ar: "أخبر النبي ﷺ عن رجل سقى كلباً عطشان، فشكر الله له فغفر له." }, r: "b2363" },
    { t: { en: "Pipes and wells need care. A water project keeps helping only while someone looks after it.", ar: "الأنابيب والآبار تحتاج إلى رعاية. ومشروع الماء يبقى نافعاً ما دام هناك من يعتني به." }, r: null },
  ];
  const pipeSizes = (c) => (c.state.age === "7-10" ? [3, 4, 5] : [4, 5, 6]);
  function tileSVG(m, on) {
    const col = on ? "#3a9bd9" : "#b9a98a", edge = on ? "#2b7fb8" : "#9c8c6c";
    const arm = { 1: "M50 50 V0", 2: "M50 50 H100", 4: "M50 50 V100", 8: "M50 50 H0" };
    const d = [1, 2, 4, 8].filter((b) => m & b).map((b) => arm[b]).join(" ");
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${d}" stroke="${edge}" stroke-width="30" fill="none"/><path d="${d}" stroke="${col}" stroke-width="22" fill="none"/><circle cx="50" cy="50" r="15" fill="${edge}"/><circle cx="50" cy="50" r="11" fill="${col}"/></svg>`;
  }
  G["water-pipes"] = {
    title: { en: "Bring the Water", ar: "أوصِل الماء" }, icon: "🚰",
    howto: { en: "Tap a pipe to turn it. Join the pipes so that water flows from the well to every house. Pipes with water turn blue.", ar: "اضغط على الأنبوب ليدور. صِل الأنابيب حتى يجري الماء من البئر إلى كل بيت. الأنابيب التي يصلها الماء تصير زرقاء." },
    sketch: `<rect x="8" y="22" width="20" height="18" rx="3" fill="#2f8f87"/><path d="M28 31 H52 V46 H84" stroke="#3a9bd9" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="84" y="36" width="24" height="18" fill="#e8d5a8" stroke="#c79a3a"/><path d="M82 36 l14-10 14 10" fill="#c79a3a"/><path d="M60 8 c-3 4-5 7-5 10 a5 5 0 0 0 10 0 c0-3-2-6-5-10z" fill="#3a9bd9" class="ss-anim-float"/>`,
    start(c, lv) { const sizes = pipeSizes(c), L = pipeLevel(sizes[lv]) || pipeLevel(sizes[lv]); Object.assign(c.s, L, { lv, moves: 0, turned: -1, won: false }); },
    init(c) { this.start(c, 0); return this.render(c); },
    render(c) {
      const s = c.s, ar = c.ar, N = s.N, sizes = pipeSizes(c), w = wet(s), got = s.houses.filter((h) => w.has(h)).length;
      const tiles = s.mask.map((m, i) => {
        if (!m) return `<span class="ss-pipe ss-pipe-empty">${i % 7 === 3 ? "🌵" : i % 11 === 5 ? "🌴" : ""}</span>`;
        const on = w.has(i), isWell = i === s.root, isHouse = s.houses.includes(i);
        const label = (isWell ? (ar ? "البئر" : "Well") : isHouse ? (ar ? "بيت" : "House") : (ar ? "أنبوب" : "Pipe")) + ` ${Math.floor(i / N) + 1}-${i % N + 1}` + (on ? (ar ? "، فيه ماء" : ", has water") : "");
        return `<button type="button" class="ss-pipe ${on ? "on" : ""} ${i === s.turned ? "ss-pipe-turn" : ""}" data-act="g" data-g="turn" data-v="${i}" aria-label="${label}" ${s.won ? "disabled" : ""}>${tileSVG(m, on)}${isWell ? `<span class="ss-pipe-e">🚰</span>` : isHouse ? `<span class="ss-pipe-e">${on ? "🏡" : "🏠"}</span>` : ""}</button>`;
      }).join("");
      const fact = PIPE_FACTS[s.lv];
      return `${c.head()}<p class="ss-game-sub">${ar ? "المستوى" : "Level"} ${s.lv + 1}/${sizes.length} · 💧 ${got}/${s.houses.length} ${ar ? "بيوت" : "houses"} · ${ar ? "الحركات" : "moves"}: ${s.moves}</p>
        <div class="ss-pipes" dir="ltr" style="grid-template-columns:repeat(${N},1fr);max-width:${N * 76}px">${tiles}</div>
        ${s.won ? `<div class="ss-lesson"><span class="ss-lesson-e">💧</span><div><strong>${ar ? "وصل الماء إلى كل البيوت!" : "Every house has water!"}</strong><p>${c.T(fact.t)}${ref(c, R[fact.r])}</p></div></div>
          ${s.lv < sizes.length - 1 ? c.btn((ar ? "المستوى التالي" : "Next level") + " " + c.fwd(), "next") : `<div class="ss-game-win">🎉</div>${c.btn("↻ " + c.t("nav.restart"), "restart", null, "ss-btn-ghost")} ${c.finish()}`}`
          : c.btn("↻ " + (ar ? "لغز جديد" : "New puzzle"), "again", null, "ss-btn-ghost")}`;
    },
    act(c, name, el) {
      const s = c.s;
      if (name === "restart") { this.start(c, 0); return c.rerender(); }
      if (name === "again") { this.start(c, s.lv); return c.rerender(); }
      if (name === "next") { this.start(c, s.lv + 1); return c.rerender(); }
      if (name === "turn" && !s.won) {
        const i = Number(el.getAttribute("data-v")); if (!s.mask[i]) return;
        s.mask[i] = turn(s.mask[i]); s.moves++; s.turned = i;
        const w = wet(s);
        if (s.houses.every((h) => w.has(h))) {
          s.won = true; c.addStars(2, c.ar ? "وصل الماء" : "water delivered"); FX.play("win"); FX.confetti();
          if (s.lv === pipeSizes(c).length - 1) c.awardBadge("plumber");
        } else FX.play("tick");
        c.rerender();
      }
    },
  };

  /* ======================= Word Hunt (all ages) =======================
     Meanings are shortened from the lexicon (data-lexicon.js). */
  const WORDS = [
    { en: "SADAQAH", ar: "صدقة", m: { en: "Charity: any gift given for the sake of Allah.", ar: "كل عطاء يُبذل ابتغاء وجه الله." } },
    { en: "ZAKAT", ar: "زكاة", m: { en: "A required share of wealth given each year. It is one of the five pillars of Islam.", ar: "جزء واجب من المال يُخرج كل سنة، وهي أحد أركان الإسلام الخمسة." } },
    { en: "WAQF", ar: "وقف", m: { en: "Something kept forever so that its benefit keeps going to good causes.", ar: "شيء يُحبس على الدوام ليستمر نفعه في وجوه الخير." } },
    { en: "INFAQ", ar: "إنفاق", m: { en: "Spending for the sake of Allah.", ar: "بذل المال في سبيل الله." } },
    { en: "IHSAN", ar: "إحسان", m: { en: "Doing good, and doing it well.", ar: "فعل الخير وإتقانه." } },
    { en: "KARAM", ar: "كرم", m: { en: "Generosity, especially toward guests.", ar: "الجود والسخاء، ولا سيما مع الضيف." } },
    { en: "FAZAH", ar: "فزعة", m: { en: "When people rush together to help someone in need. A well-known Gulf word.", ar: "أن يهبّ الناس معاً لمساعدة محتاج. كلمة خليجية معروفة." } },
    { en: "ITHAR", ar: "إيثار", m: { en: "Putting someone else's need before your own.", ar: "أن تقدّم حاجة غيرك على حاجتك." } },
    { en: "MARUF", ar: "معروف", m: { en: "Anything known to be good. Even a small kindness counts as charity.", ar: "كل ما عُرف أنه خير، وحتى المعروف الصغير صدقة." } },
    { en: "HIBAH", ar: "هبة", m: { en: "A gift given without asking for anything back.", ar: "عطية تُعطى دون مقابل." } },
    { en: "JUD", ar: "جود", m: { en: "Giving generously, beyond what is required.", ar: "العطاء الواسع فوق ما يجب." } },
    { en: "NAKHWAH", ar: "نخوة", m: { en: "The urge to protect and provide for one's relatives.", ar: "دافع يحمل صاحبه على حماية أهله وإعانتهم." } },
    { en: "IGHATHAH", ar: "إغاثة", m: { en: "Emergency relief.", ar: "المساعدة العاجلة عند الطوارئ." } },
    { en: "MISKIN", ar: "مسكين", m: { en: "A person in need. The needy are one of the groups who can receive zakat.", ar: "المحتاج، والمساكين من أصناف مستحقي الزكاة." } },
    { en: "FIDYAH", ar: "فدية", m: { en: "A payment that makes up for something missed, such as missed fasts.", ar: "ما يُدفع عوضاً عن أمر فائت، كالصيام الفائت." } },
  ];
  // Filler letters are chosen so that they are unlikely to spell real words by accident.
  const FILL = { en: "BCDGJKLNPQRTVWXZ", ar: "ثخذضظغطصقجشعح" };
  function huntGrid(c) {
    const young = c.state.age === "7-10", N = young ? 8 : 10, count = young ? 5 : 7, lang = c.lang === "ar" ? "ar" : "en";
    const dirs = young ? [[0, 1], [1, 0]] : [[0, 1], [1, 0], [1, 1]];
    for (let attempt = 0; attempt < 40; attempt++) {
      const grid = new Array(N * N).fill(""), placed = [];
      const pool = mix(WORDS.map((w, k) => k)).filter((k) => Array.from(WORDS[k][lang]).length <= N).slice(0, count);
      let ok = true;
      for (const k of pool) {
        const letters = Array.from(WORDS[k][lang]); let done = false;
        for (let tries = 0; tries < 150 && !done; tries++) {
          const [dr, dc] = dirs[rand(dirs.length)], r0 = rand(N - dr * (letters.length - 1)), c0 = rand(N - dc * (letters.length - 1));
          const cells = letters.map((_, i) => (r0 + dr * i) * N + c0 + dc * i);
          if (cells.every((cell, i) => grid[cell] === "" || grid[cell] === letters[i])) { cells.forEach((cell, i) => (grid[cell] = letters[i])); placed.push({ k, cells }); done = true; }
        }
        if (!done) { ok = false; break; }
      }
      if (!ok) continue;
      const fill = Array.from(FILL[lang]);
      return { N, lang, grid: grid.map((ch) => ch || fill[rand(fill.length)]), words: placed, found: [], sel: null, last: null, hint: null };
    }
    return null;
  }
  G["word-hunt"] = {
    title: { en: "Word Hunt", ar: "صيد الكلمات" }, icon: "🔎",
    howto: { en: "Find the hidden giving words. Tap the first letter of a word, then its last letter. Words run across or down, and for older players also diagonally. Each word you find shows its meaning.", ar: "ابحث عن كلمات العطاء المخبأة. اضغط على أول حرف من الكلمة ثم على آخر حرف. تمتد الكلمات أفقياً أو عمودياً، وللأكبر سناً بشكل مائل أيضاً. وكل كلمة تجدها تُظهر معناها." },
    sketch: `<rect x="10" y="8" width="62" height="44" rx="4" fill="#fbf6ea" stroke="#c79a3a"/><g font-size="9" font-weight="700" fill="#6b5a48" text-anchor="middle"><text x="20" y="21">W</text><text x="32" y="21">A</text><text x="44" y="21">Q</text><text x="56" y="21">F</text><text x="20" y="34">K</text><text x="32" y="34">D</text><text x="44" y="34">T</text><text x="56" y="34">R</text><text x="20" y="47">Z</text><text x="32" y="47">N</text><text x="44" y="47">B</text><text x="56" y="47">L</text></g><rect x="14" y="12" width="48" height="12" rx="6" fill="#2f8f87" opacity=".28" class="ss-anim-glow"/><circle cx="92" cy="28" r="12" fill="none" stroke="#2f8f87" stroke-width="4"/><path d="M100 37 l10 11" stroke="#2f8f87" stroke-width="5" stroke-linecap="round"/>`,
    init(c) { Object.assign(c.s, huntGrid(c)); return this.render(c); },
    render(c) {
      const s = c.s, ar = c.ar, N = s.N, done = s.found.length === s.words.length;
      const owner = {}; s.found.forEach((wi) => s.words[wi].cells.forEach((cell) => (owner[cell] = wi)));
      const cells = s.grid.map((ch, i) => `<button type="button" class="ss-wh-cell ${owner[i] != null ? "found ss-wh-c" + (owner[i] % 6) : ""} ${s.sel === i ? "sel" : ""} ${s.hint === i ? "hint" : ""}" data-act="g" data-g="cell" data-v="${i}" ${done ? "disabled" : ""}>${ch}</button>`).join("");
      const list = s.words.map((w, wi) => { const W = WORDS[w.k], f = s.found.includes(wi); return `<li class="${f ? "found" : ""}">${f ? "✓ " : ""}<span lang="${s.lang}">${W[s.lang]}</span>${s.lang === "en" ? ` <span class="ss-wh-ar" lang="ar" dir="rtl">${W.ar}</span>` : ""}</li>`; }).join("");
      const lastW = s.last != null ? WORDS[s.words[s.last].k] : null;
      return `${c.head()}<p class="ss-game-sub">${s.found.length}/${s.words.length}${s.sel != null && !done ? ` · ${ar ? "الآن اضغط على آخر حرف" : "now tap the last letter"}` : ""}</p>
        <div class="ss-wh"><div class="ss-wh-grid" style="grid-template-columns:repeat(${N},1fr);max-width:${N * 44}px">${cells}</div>
        <ul class="ss-wh-list">${list}</ul></div>
        ${lastW && !done ? `<div class="ss-lesson ss-pop-in"><span class="ss-lesson-e">🔎</span><div><strong>${lastW[s.lang]}${s.lang === "en" ? ` · <span lang="ar" dir="rtl">${lastW.ar}</span>` : ""}</strong><p>${c.T(lastW.m)}</p></div></div>` : ""}
        ${done ? `<div class="ss-game-win">🎉</div><div class="ss-summary"><h4>${ar ? "الكلمات التي وجدتها" : "The words you found"}</h4><ul>${s.words.map((w) => { const W = WORDS[w.k]; return `<li><strong>${W[s.lang]}${s.lang === "en" ? ` (<span lang="ar" dir="rtl">${W.ar}</span>)` : ""}:</strong> ${c.T(W.m)}</li>`; }).join("")}</ul></div>
          <button type="button" class="ss-btn ss-btn-ghost" data-go="lexic">📖 ${ar ? "افتح المعجم" : "Open the lexicon"}</button> ${c.btn("↻ " + (ar ? "شبكة جديدة" : "New grid"), "restart", null, "ss-btn-ghost")} ${c.finish()}`
          : c.btn("💡 " + (ar ? "تلميح" : "Hint"), "hint", null, "ss-btn-ghost")}`;
    },
    act(c, name, el) {
      const s = c.s;
      if (name === "restart") { Object.assign(s, huntGrid(c)); return c.rerender(); }
      if (name === "hint") { const wi = s.words.findIndex((w, i) => !s.found.includes(i)); if (wi >= 0) { s.hint = s.words[wi].cells[0]; s.hints = (s.hints || 0) + 1; FX.play("pop"); } return c.rerender(); }
      if (name !== "cell") return;
      const i = Number(el.getAttribute("data-v")), N = s.N;
      if (s.sel == null) { s.sel = i; FX.play("tick"); return c.rerender(); }
      if (s.sel === i) { s.sel = null; return c.rerender(); }
      const r0 = Math.floor(s.sel / N), c0 = s.sel % N, r1 = Math.floor(i / N), c1 = i % N, dr = r1 - r0, dc = c1 - c0;
      let hit = -1;
      if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
        const len = Math.max(Math.abs(dr), Math.abs(dc)) + 1, path = [];
        for (let k = 0; k < len; k++) path.push((r0 + Math.sign(dr) * k) * N + c0 + Math.sign(dc) * k);
        const key = path.join(","), rev = path.slice().reverse().join(",");
        hit = s.words.findIndex((w, wi) => !s.found.includes(wi) && (w.cells.join(",") === key || w.cells.join(",") === rev));
      }
      if (hit >= 0) {
        s.found.push(hit); s.last = hit; s.sel = null; s.hint = null; c.addStars(1); FX.play("ok");
        if (s.found.length === s.words.length) { c.addStars(2, c.ar ? "اكتملت الشبكة" : "grid complete"); FX.play("win"); FX.confetti(); if (!s.hints) c.awardBadge("wordsmith"); }
      } else { s.sel = i; FX.play("tick"); }
      c.rerender();
    },
  };

  /* ======================= Story Sprint (11–14 and up) =======================
     Questions are the story quiz questions from data-quiz.js, unchanged. */
  const SPRINT_SECS = 60, RELAXED_N = 10;
  function sprintPool(c) {
    const lang = c.lang === "ar" ? "ar" : "en", Q = (window.SADAQAH_QUIZ || {})[lang] || {};
    const titles = {}; ((window.SADAQAH_STORIES || {})[lang] || []).forEach((st) => (titles[st.id] = st.title));
    const read = ((c.state.stats && c.state.stats.storiesRead) || []).filter((id) => Q[id] && titles[id]);
    const ids = read.length >= 3 ? read : Object.keys(Q).filter((id) => titles[id]);
    const pool = []; ids.forEach((id) => Q[id].forEach((q) => pool.push({ id, title: titles[id], q: q[0], o: q[1] })));
    return { pool: mix(pool), fromRead: read.length >= 3, readCount: read.length };
  }
  function sprintTimer(c, s) {
    let last = performance.now();
    const iv = setInterval(() => {
      if (c.state._g !== s || s.phase !== "play") return clearInterval(iv);
      const now = performance.now(), dt = Math.min(500, now - last); last = now;
      if (s.pick != null) return; // the clock waits while an answer is explained
      s.left -= dt;
      const tEl = document.getElementById("ss-sp-time"), bar = document.getElementById("ss-sp-bar");
      if (tEl) tEl.textContent = Math.max(0, Math.ceil(s.left / 1000));
      if (bar) bar.style.width = Math.max(0, s.left / (SPRINT_SECS * 10)) + "%";
      if (s.left <= 0) { clearInterval(iv); sprintEnd(c, s); }
    }, 200);
  }
  function sprintEnd(c, s) {
    s.phase = "end"; s.best = best("ss_sprint_best", s.timed ? s.score : null);
    if (s.score > 0) c.addStars(Math.min(8, Math.ceil(s.score / 2)));
    if (s.score >= 10) c.awardBadge("sprinter");
    FX.play("win"); if (s.score >= 8) FX.confetti();
    c.rerender();
  }
  G["story-sprint"] = {
    title: { en: "Story Sprint", ar: "سباق الحكايات" }, icon: "⚡",
    howto: { en: "Answer as many story questions as you can in 60 seconds. Three right answers in a row earn a bonus point. The clock waits while an answer is explained. You can also play without the clock.", ar: "أجب عن أكبر عدد من أسئلة الحكايات في 60 ثانية. ثلاث إجابات صحيحة متتالية تمنحك نقطة إضافية. ويتوقف العدّاد أثناء شرح الإجابة. ويمكنك اللعب بلا عدّاد أيضاً." },
    sketch: `<circle cx="34" cy="32" r="20" fill="#fbf6ea" stroke="#c79a3a" stroke-width="3"/><path d="M34 32 V18" stroke="#6b5a48" stroke-width="3" stroke-linecap="round"/><path d="M34 32 l9 6" stroke="#c66b6b" stroke-width="3" stroke-linecap="round" class="ss-anim-tilt"/><rect x="30" y="6" width="8" height="5" rx="2" fill="#c79a3a"/><path d="M84 8 l-14 24 h10 l-6 20 20-28 h-11z" fill="#e8a23a" class="ss-anim-glow"/>`,
    init(c) { Object.assign(c.s, { phase: "intro" }, sprintPool(c)); return this.render(c); },
    render(c) {
      const s = c.s, ar = c.ar;
      if (s.phase === "intro") {
        return `${c.head()}<p class="ss-game-sub">${s.fromRead ? (ar ? `الأسئلة من الحكايات التي قرأتها (${s.readCount}).` : `The questions come from the ${s.readCount} stories you have read.`) : (ar ? "الأسئلة من كل الحكايات. اقرأ ثلاث حكايات أو أكثر لتأتي الأسئلة مما قرأته." : "The questions come from all the stories. Read three or more stories and the questions will come from the ones you have read.")}</p>
          ${s.pool.length ? `${c.btn("⚡ " + (ar ? "ابدأ: 60 ثانية" : "Start: 60 seconds"), "start", "timed")} ${c.btn(ar ? `بلا عدّاد: ${RELAXED_N} أسئلة` : `No clock: ${RELAXED_N} questions`, "start", "relaxed", "ss-btn-ghost")}` : `<p class="ss-hint">${ar ? "لا توجد أسئلة." : "No questions found."}</p>`}
          <button type="button" class="ss-btn ss-btn-ghost" data-go="module-a">📖 ${ar ? "اقرأ الحكايات أولاً" : "Read the stories first"}</button>`;
      }
      if (s.phase === "play") {
        const q = s.pool[s.i];
        return `${c.head()}<div class="ss-sp-hud"><span>⭐ <b>${s.score}</b></span><span>${s.streak >= 2 ? "🔥 " + s.streak : ""}</span>${s.timed ? `<span>⏱ <b id="ss-sp-time">${Math.max(0, Math.ceil(s.left / 1000))}</b></span>` : `<span>${s.i + 1}/${Math.min(RELAXED_N, s.pool.length)}</span>`}</div>
          ${s.timed ? `<div class="ss-sp-track"><i id="ss-sp-bar" style="width:${Math.max(0, s.left / (SPRINT_SECS * 10))}%"></i></div>` : ""}
          <p class="ss-sp-from">${ar ? "من حكاية" : "From the story"}: <strong>${c.esc(q.title)}</strong></p>
          <div class="ss-tree-q ss-pop-in">${c.esc(q.q)}</div>
          <div class="ss-opts">${s.order.map((oi) => `<button type="button" class="ss-opt ${s.pick == null ? "" : oi === 0 ? "right" : oi === s.pick ? "wrong" : ""}" data-act="g" data-g="ans" data-v="${oi}" ${s.pick != null ? "disabled" : ""}>${c.esc(q.o[oi])}</button>`).join("")}</div>
          ${s.pick != null ? c.btn((ar ? "التالي" : "Next") + " " + c.fwd(), "next") : ""}`;
      }
      return `${c.head()}<div class="ss-game-win">${s.score >= 8 ? "🎉" : "⚡"}</div>
        <h4>${ar ? `النتيجة: ${s.score}` : `Score: ${s.score}`} · ${ar ? `أجبت صواباً عن ${s.right} من ${s.asked}` : `${s.right} of ${s.asked} right`}${s.timed && s.best ? ` · ${ar ? "أفضل نتيجة" : "best"}: ${s.best}` : ""}</h4>
        ${s.missed.length ? `<div class="ss-summary"><h4>${ar ? "راجع هذه" : "Look at these again"}</h4><ul>${s.missed.slice(0, 8).map((q) => `<li>${c.esc(q.q)} <em>${c.esc(q.o[0])}</em> <button type="button" class="ss-linkbtn" data-act="open-story" data-id="${c.esc(q.id)}">📖 ${c.esc(q.title)}</button></li>`).join("")}</ul></div>` : `<p>${ar ? "لم تخطئ في أي سؤال!" : "You did not miss a single question!"}</p>`}
        ${c.btn("↻ " + c.t("nav.restart"), "restart", null, "ss-btn-ghost")} ${c.finish()}`;
    },
    act(c, name, el) {
      const s = c.s;
      if (name === "restart") { Object.assign(s, { phase: "intro" }, sprintPool(c)); return c.rerender(); }
      if (name === "start") {
        Object.assign(s, { phase: "play", timed: el.getAttribute("data-v") === "timed", i: 0, score: 0, right: 0, asked: 0, streak: 0, left: SPRINT_SECS * 1000, pick: null, missed: [], order: mix([0, 1, 2]) });
        c.rerender(); FX.play("pop"); if (s.timed) sprintTimer(c, s); return;
      }
      if (name === "ans" && s.pick == null && s.phase === "play") {
        s.pick = Number(el.getAttribute("data-v")); s.asked++;
        if (s.pick === 0) {
          s.right++; s.score++; s.streak++; FX.play("ok");
          if (s.streak % 3 === 0) { s.score++; c.toast(c.ar ? "🔥 ثلاث متتالية: نقطة إضافية" : "🔥 Three in a row: bonus point"); }
          // A right answer needs no explanation, so move on after a moment.
          const at = s.i; setTimeout(() => { if (c.state._g === s && s.phase === "play" && s.i === at && s.pick != null) this.act(c, "next"); }, 650);
        } else { s.streak = 0; s.missed.push(s.pool[s.i]); FX.play("no"); }
        return c.rerender();
      }
      if (name === "next" && s.pick != null && s.phase === "play") {
        s.i++; s.pick = null; s.order = mix([0, 1, 2]);
        if (s.i >= s.pool.length || (!s.timed && s.i >= RELAXED_N) || (s.timed && s.left <= 0)) return sprintEnd(c, s);
        return c.rerender();
      }
    },
  };
})();
