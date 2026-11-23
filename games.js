/* =========================================================================
   Sadaqah Stories — plug-in games (EN + AR)
   Each game registers: title, icon, howto, sketch (SVG inner markup),
   init(c), render(c), act(c, name, el) and optionally input(c, name, el).
   c is supplied by app.js (see ctx()): c.s is the game's own state,
   c.T({en,ar}) picks the language, c.rerender() redraws the game.
   Hadith numbers follow sunnah.com and were checked there.
   ========================================================================= */
window.SADAQAH_GAMES = window.SADAQAH_GAMES || {};
window.SADAQAH_MODULES = window.SADAQAH_MODULES || {};
window.SADAQAH_AGE_GAMES = {
  "7-10": ["kindness-catch", "water-pipes", "word-hunt"],
  "11-14": ["water-pipes", "word-hunt", "story-sprint"],
  "15-18": ["charity-check", "grant-committee", "word-hunt", "story-sprint"],
  adults: ["zakat-check", "zakat-cases", "charity-check", "giving-budget", "grant-committee", "waqf-architect", "giving-dilemma", "impact-calc", "choose-path", "word-hunt", "story-sprint"],
};
// Games added most recently; the games page marks them "New".
window.SADAQAH_NEW_GAMES = ["kindness-catch", "water-pipes", "word-hunt", "story-sprint"];

(function () {
  const G = window.SADAQAH_GAMES;
  const FX = window.SadaqahFX || { play() {}, confetti() {} };
  const pickN = (arr, n) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, n); };
  const ref = (c, r) => r && r.url ? ` <a class="ss-ref" href="${r.url}" target="_blank" rel="noopener noreferrer">${c.T(r)} ↗</a>` : (r ? ` <span class="ss-ref">(${c.T(r)})</span>` : "");
  const R = {
    m1631: { en: "Sahih Muslim 1631", ar: "صحيح مسلم 1631", url: "https://sunnah.com/muslim:1631" },
    b6005: { en: "Sahih al-Bukhari 6005", ar: "صحيح البخاري 6005", url: "https://sunnah.com/bukhari:6005" },
    b450: { en: "Sahih al-Bukhari 450", ar: "صحيح البخاري 450", url: "https://sunnah.com/bukhari:450" },
    t807: { en: "Jami at-Tirmidhi 807", ar: "جامع الترمذي 807", url: "https://sunnah.com/tirmidhi:807" },
    q960: { en: "Qur'an 9:60", ar: "التوبة: 60", url: "https://quran.com/9/60" },
    m2699: { en: "Sahih Muslim 2699a", ar: "صحيح مسلم 2699", url: "https://sunnah.com/muslim:2699a" },
    m2626: { en: "Sahih Muslim 2626", ar: "صحيح مسلم 2626", url: "https://sunnah.com/muslim:2626" },
    b2320: { en: "Sahih al-Bukhari 2320", ar: "صحيح البخاري 2320", url: "https://sunnah.com/bukhari:2320" },
    b2989: { en: "Sahih al-Bukhari 2989", ar: "صحيح البخاري 2989", url: "https://sunnah.com/bukhari:2989" },
    m2625: { en: "Sahih Muslim 2625b", ar: "صحيح مسلم 2625ب", url: "https://sunnah.com/muslim:2625b" },
    b1417: { en: "Sahih al-Bukhari 1417", ar: "صحيح البخاري 1417", url: "https://sunnah.com/bukhari:1417" },
    b2363: { en: "Sahih al-Bukhari 2363", ar: "صحيح البخاري 2363", url: "https://sunnah.com/bukhari:2363" },
  };
  window.SADAQAH_REFS = R;

  /* ======================= Charity Match (7–10) ======================= */
  const PAIRS = [
    { w: { en: "Water well", ar: "بئر ماء" }, e: "🚰", note: { en: "A well gives water for many years. Charity that keeps helping like this is called Sadaqah Jariyah.", ar: "البئر تعطي الماء سنوات طويلة. والعطاء الذي يستمر نفعه هكذا يسمى صدقة جارية." }, r: "m1631" },
    { w: { en: "Orphan", ar: "يتيم" }, e: "🧑‍🍼", note: { en: "The Prophet ﷺ said that whoever looks after an orphan will be close to him in Paradise.", ar: "أخبر النبي ﷺ أن كافل اليتيم يكون قريباً منه في الجنة." }, r: "b6005" },
    { w: { en: "Mosque", ar: "مسجد" }, e: "🕌", note: { en: "The Prophet ﷺ said that whoever builds a mosque, Allah builds a place like it for them in Paradise.", ar: "أخبر النبي ﷺ أن من بنى مسجداً بنى الله له مثله في الجنة." }, r: "b450" },
    { w: { en: "School", ar: "مدرسة" }, e: "📚", note: { en: "Knowledge that people keep using is one of the good deeds that continue after a person dies.", ar: "العلم الذي ينتفع به الناس من الأعمال التي يستمر أجرها بعد وفاة صاحبها." }, r: "m1631" },
    { w: { en: "Iftar meal", ar: "وجبة إفطار" }, e: "🍲", note: { en: "Whoever gives a fasting person food to break their fast gets a reward like theirs.", ar: "من فطّر صائماً كان له مثل أجره." }, r: "t807" },
    { w: { en: "Zakat", ar: "زكاة" }, e: "⚖️", note: { en: "Zakat is a set share of wealth given each year. The Qur'an names eight groups who can receive it.", ar: "الزكاة جزء محدد من المال يُخرج كل سنة، وقد ذكر القرآن ثمانية أصناف يستحقونها." }, r: "q960" },
    { w: { en: "Doctor", ar: "طبيب" }, e: "🩺", note: { en: "Whoever eases someone's hardship in this world, Allah will ease one of their hardships on the Day of Resurrection.", ar: "من نفّس عن مؤمن كربة من كرب الدنيا، نفّس الله عنه كربة من كرب يوم القيامة." }, r: "m2699" },
    { w: { en: "Smile", ar: "ابتسامة" }, e: "😊", note: { en: "Do not think any good deed is too small, even meeting someone with a cheerful face.", ar: "لا تحقرنّ من المعروف شيئاً، ولو أن تلقى أخاك بوجه طلق." }, r: "m2626" },
    { w: { en: "Planting a tree", ar: "غرس شجرة" }, e: "🌳", note: { en: "When a bird, a person or an animal eats from what you planted, it counts as charity for you.", ar: "إذا أكل طير أو إنسان أو بهيمة مما غرسته، كان لك به صدقة." }, r: "b2320" },
    { w: { en: "Kind word", ar: "كلمة طيبة" }, e: "💬", note: { en: "The Prophet ﷺ said that a good word is charity.", ar: "أخبر النبي ﷺ أن الكلمة الطيبة صدقة." }, r: "b2989" },
    { w: { en: "Neighbour", ar: "الجار" }, e: "🏠", note: { en: "The Prophet ﷺ told Abu Dharr to add water to his broth and share it with his neighbours.", ar: "أوصى النبي ﷺ أبا ذر أن يُكثر ماء المرق ويتعاهد جيرانه." }, r: "m2625" },
    { w: { en: "Clear the path", ar: "تنظيف الطريق" }, e: "🧹", note: { en: "Removing something harmful from the road is charity.", ar: "إماطة الأذى عن الطريق صدقة." }, r: "b2989" },
  ];
  const LEVELS = [4, 6, 8];
  function matchLevel(c, lv) {
    const set = pickN(PAIRS.map((p, i) => i), LEVELS[lv]);
    const cards = [];
    set.forEach((k) => { cards.push({ k, t: "word" }); cards.push({ k, t: "pic" }); });
    Object.assign(c.s, { lv, set, cards: pickN(cards, cards.length), flipped: [], matched: [], moves: 0, locked: false, last: null, anim: null });
  }
  G["charity-match"] = {
    title: { en: "Charity Match", ar: "مطابقة الخير" }, icon: "🧰",
    howto: { en: "Flip two cards to find a word and its picture. Each match teaches a short lesson. Clear three levels, each with more cards.", ar: "اقلب بطاقتين لتجد الكلمة وصورتها. كل تطابق يعلّمك درساً قصيراً. أنهِ ثلاثة مستويات، في كل منها بطاقات أكثر." },
    init(c) { matchLevel(c, 0); c.s.learned = []; return this.render(c); },
    render(c) {
      const s = c.s, n = LEVELS[s.lv], done = s.matched.length === n;
      let best = null; try { best = Number(localStorage.getItem("ss_match_best_" + s.lv)) || null; } catch (e) {}
      const grid = s.cards.map((cd, i) => {
        const shown = s.flipped.includes(i) || s.matched.includes(cd.k), p = PAIRS[cd.k];
        const face = cd.t === "word" ? `<span class="ss-label">${c.T(p.w)}</span>` : `<span class="ss-mem-emoji">${p.e}</span>`;
        const an = s.anim ? (s.anim.match === cd.k ? "ss-match-pop" : s.anim.flip === i ? "ss-flip-in" : "") : "";
        return `<button type="button" class="ss-mem-card ${shown ? "flipped" : ""} ${s.matched.includes(cd.k) ? "done" : ""} ${an}" data-act="g" data-g="flip" data-v="${i}" aria-label="${shown ? "" : "?"}">${shown ? face : "?"}</button>`;
      }).join("");
      const lesson = s.last != null ? `<div class="ss-lesson"><span class="ss-lesson-e">${PAIRS[s.last].e}</span><div><strong>${c.T(PAIRS[s.last].w)}</strong><p>${c.T(PAIRS[s.last].note)}${ref(c, R[PAIRS[s.last].r])}</p></div></div>` : "";
      let end = "";
      if (done) {
        const lvLessons = s.set.map((k) => `<li><strong>${PAIRS[k].e} ${c.T(PAIRS[k].w)}:</strong> ${c.T(PAIRS[k].note)}${ref(c, R[PAIRS[k].r])}</li>`).join("");
        end = `<div class="ss-summary"><h4>${c.ar ? `أنهيت المستوى ${s.lv + 1} في ${s.moves} محاولة` : `Level ${s.lv + 1} done in ${s.moves} moves`}${best ? ` · ${c.ar ? "أفضل نتيجة" : "best"}: ${best}` : ""}</h4><ul>${lvLessons}</ul></div>`
          + (s.lv < LEVELS.length - 1 ? c.btn((c.ar ? "المستوى التالي" : "Next level") + " " + c.fwd(), "next") : `<div class="ss-game-win">🎉</div>${c.btn("↻ " + c.t("nav.restart"), "restart", null, "ss-btn-ghost")} ${c.finish()}`);
      }
      return `${c.head()}<p class="ss-game-sub">${c.ar ? "المستوى" : "Level"} ${s.lv + 1}/${LEVELS.length} · ${s.matched.length}/${n} · ${c.ar ? "المحاولات" : "moves"}: ${s.moves}</p>
        <div class="ss-mem-grid ss-mem-${n}">${grid}</div>${lesson}${end}`;
    },
    act(c, name, el) {
      const s = c.s;
      if (name === "next") { matchLevel(c, s.lv + 1); return c.rerender(); }
      if (name === "restart") { matchLevel(c, 0); return c.rerender(); }
      if (name !== "flip") return;
      const i = Number(el.getAttribute("data-v"));
      if (s.locked || s.flipped.includes(i) || s.matched.includes(s.cards[i].k)) return;
      s.flipped.push(i); s.anim = { flip: i, match: null }; FX.play("flip");
      if (s.flipped.length === 2) {
        s.moves++;
        const [a, b] = s.flipped, ca = s.cards[a], cb = s.cards[b];
        if (ca.k === cb.k && ca.t !== cb.t) {
          s.matched.push(ca.k); s.flipped = []; s.last = ca.k; c.addStars(1); s.anim = { flip: -1, match: ca.k }; FX.play("ok");
          if (s.matched.length === LEVELS[s.lv]) {
            FX.play("win"); FX.confetti();
            c.addStars(2, c.ar ? "مستوى مكتمل" : "level complete");
            if (s.moves <= LEVELS[s.lv] + 1) c.addStars(3, c.t("toast.flawless"));
            try { const k = "ss_match_best_" + s.lv, old = Number(localStorage.getItem(k)); if (!old || s.moves < old) localStorage.setItem(k, s.moves); } catch (e) {}
            if (s.lv === LEVELS.length - 1) c.awardBadge("matcher");
          }
        } else { s.locked = true; FX.play("no"); setTimeout(() => { if (c.state._g !== s) return; s.flipped = []; s.locked = false; s.anim = null; c.rerender(); }, 900); }
      }
      c.rerender();
    },
  };

  /* ======================= Fill the Donation Box (7–10) ======================= */
  const ITEMS = {
    food: { e: "🍚", en: "Food", ar: "طعام" }, water: { e: "💧", en: "Water", ar: "ماء" }, blanket: { e: "🛏️", en: "Blanket", ar: "بطانية" },
    clothing: { e: "🧥", en: "Warm clothes", ar: "ملابس دافئة" }, book: { e: "📖", en: "Book", ar: "كتاب" }, pencil: { e: "✏️", en: "Pencil", ar: "قلم" },
    medicine: { e: "💊", en: "Medicine", ar: "دواء" }, tent: { e: "⛺", en: "Tent", ar: "خيمة" }, torch: { e: "🔦", en: "Torch", ar: "مصباح يدوي" },
    shoes: { e: "👟", en: "Shoes", ar: "حذاء" }, bag: { e: "🎒", en: "School bag", ar: "حقيبة مدرسية" }, toy: { e: "🧸", en: "Toy", ar: "لعبة" }, soap: { e: "🧼", en: "Soap", ar: "صابون" },
  };
  const SCENES = [
    { e: "🥶", need: { en: "Cold at night", ar: "برد في الليل" }, want: ["blanket", "clothing"], extra: ["book", "toy", "soap"], why: { en: "Blankets and warm clothes keep people warm through winter nights.", ar: "البطانيات والملابس الدافئة تحمي الناس من برد ليالي الشتاء." } },
    { e: "🥺", need: { en: "A hungry family", ar: "أسرة جائعة" }, want: ["food", "water"], extra: ["pencil", "toy", "blanket"], why: { en: "Food and clean water are what a hungry family needs first.", ar: "الطعام والماء النظيف أول ما تحتاجه الأسرة الجائعة." } },
    { e: "🧒", need: { en: "A child with no school things", ar: "طفل بلا أدوات مدرسية" }, want: ["book", "pencil"], extra: ["medicine", "tent", "food"], why: { en: "Books and pencils help a child learn.", ar: "الكتب والأقلام تساعد الطفل على التعلّم." } },
    { e: "🤒", need: { en: "Sick, with no medicine", ar: "مريض بلا دواء" }, want: ["medicine", "water"], extra: ["pencil", "toy", "shoes"], why: { en: "Medicine and clean water help a sick person get better.", ar: "الدواء والماء النظيف يساعدان المريض على الشفاء." } },
    { e: "🌧️", need: { en: "A family lost their home in a flood", ar: "أسرة فقدت بيتها في فيضان" }, want: ["tent", "blanket"], extra: ["book", "toy", "pencil"], why: { en: "A tent gives shelter, and blankets keep the family warm until they can rebuild.", ar: "الخيمة مأوى، والبطانيات تدفئ الأسرة حتى تعيد بناء بيتها." } },
    { e: "🌑", need: { en: "No electricity after a storm", ar: "لا كهرباء بعد العاصفة" }, want: ["torch", "food"], extra: ["pencil", "shoes", "soap"], why: { en: "A torch helps people see at night, and food helps while shops are closed.", ar: "المصباح يساعد الناس على الرؤية ليلاً، والطعام يعينهم ما دامت المحلات مغلقة." } },
    { e: "👣", need: { en: "Walking to school with no shoes", ar: "يمشي إلى المدرسة بلا حذاء" }, want: ["shoes", "bag"], extra: ["medicine", "tent", "toy"], why: { en: "Shoes protect feet on the long walk, and a bag carries the books.", ar: "الحذاء يحمي القدمين في الطريق الطويل، والحقيبة تحمل الكتب." } },
    { e: "🏥", need: { en: "A child in hospital feels lonely", ar: "طفل في المستشفى يشعر بالوحدة" }, want: ["toy", "book"], extra: ["tent", "soap", "shoes"], why: { en: "A toy and a book can cheer up a child who has to stay in bed.", ar: "اللعبة والكتاب يُسعدان طفلاً مضطراً إلى البقاء في سريره." } },
    { e: "🏕️", need: { en: "A camp with nowhere to wash", ar: "مخيم بلا مكان للاغتسال" }, want: ["soap", "water"], extra: ["toy", "pencil", "torch"], why: { en: "Soap and clean water help stop illness from spreading.", ar: "الصابون والماء النظيف يمنعان انتشار الأمراض." } },
  ];
  G["fill-box"] = {
    title: { en: "Fill the Donation Box", ar: "املأ صندوق التبرع" }, icon: "📦",
    howto: { en: "Read who needs help, then tap the two things that help most, or drag them into the box. If you pick something else, you will see why it is not the best choice.", ar: "اقرأ من يحتاج إلى المساعدة، ثم اضغط على الشيئين الأكثر نفعاً أو اسحبهما إلى الصندوق. وإذا اخترت شيئاً آخر سترى لماذا ليس هو الاختيار الأفضل." },
    init(c) { Object.assign(c.s, { scenes: pickN(SCENES, 5), i: 0, placed: [], miss: null, mistakes: 0, cleared: false, done: false, lastPut: null }); c.s.shelf = this.shelf(c.s.scenes[0]); return this.render(c); },
    shelf(sc) { return pickN(sc.want.concat(sc.extra), sc.want.length + sc.extra.length); },
    render(c) {
      const s = c.s, ar = c.ar;
      if (s.done) {
        return `${c.head()}<div class="ss-game-win">🎉</div><p>${ar ? `ملأت ${s.scenes.length} صناديق` : `You filled ${s.scenes.length} boxes`}${s.mistakes === 0 ? (ar ? " دون أي خطأ!" : " without a single mistake!") : ""}</p>
          <div class="ss-summary"><ul>${s.scenes.map((sc) => `<li><strong>${sc.e} ${c.T(sc.need)}:</strong> ${sc.want.map((k) => ITEMS[k].e).join(" ")} ${c.T(sc.why)}</li>`).join("")}</ul></div>
          ${c.btn("↻ " + c.t("nav.restart"), "restart", null, "ss-btn-ghost")} ${c.finish()}`;
      }
      const sc = s.scenes[s.i], full = sc.want.every((w) => s.placed.includes(w));
      return `${c.head()}<p class="ss-game-sub">${s.i + 1}/${s.scenes.length}</p>
        <div class="ss-drop-scene">
          <div class="ss-drop-need ${full ? "ss-helped" : ""}"><div class="ss-emoji ${full ? "ss-bounce" : ""}">${full ? "😊" : sc.e}</div><div style="font-weight:700;">${c.T(sc.need)}</div></div>
          <div class="ss-drop-box ${full ? "ss-box-full" : ""}" data-drop>${s.placed.map((p) => `<span class="ss-chip ${p === s.lastPut ? "ss-pop-in" : ""}"><span class="ss-ie">${ITEMS[p].e}</span>${ITEMS[p][c.lang]}</span>`).join("") || `<span class="ss-muted">${ar ? "الصندوق فارغ" : "The box is empty"}</span>`}</div>
        </div>
        ${s.miss ? `<p class="ss-hint ss-shake">${ar ? `${ITEMS[s.miss].ar} هدية لطيفة، لكنها لا تحل هذه المشكلة: ${sc.need.ar}. ابحث عمّا يحتاجونه أكثر.` : `${ITEMS[s.miss].en} is a kind gift, but it does not solve this: ${sc.need.en.toLowerCase()}. Look for what they need most.`}</p>` : ""}
        ${full ? `<div class="ss-lesson"><span class="ss-lesson-e">✅</span><div><p>${c.T(sc.why)}</p></div></div>${c.btn((s.i + 1 < s.scenes.length ? (ar ? "الصندوق التالي" : "Next box") : (ar ? "انتهيت" : "Finish")) + " " + c.fwd(), "next")}`
          : `<div class="ss-shelf">${s.shelf.map((it) => `<button type="button" class="ss-item ${s.placed.includes(it) ? "used" : ""}" data-act="g" data-g="put" data-v="${it}" data-drag="self" ${s.placed.includes(it) ? "disabled" : ""}><span class="ss-ie">${ITEMS[it].e}</span>${ITEMS[it][c.lang]}</button>`).join("")}</div>`}`;
    },
    act(c, name, el) {
      const s = c.s;
      if (name === "restart") { this.init(c); return c.rerender(); }
      if (name === "next") {
        c.addStars(2);
        s.lastPut = null;
        if (s.i + 1 >= s.scenes.length) { s.done = true; FX.play("win"); FX.confetti(); c.awardBadge("explorer"); if (s.mistakes === 0) c.addStars(3, c.t("toast.flawless")); }
        else { s.i++; s.placed = []; s.miss = null; s.shelf = this.shelf(s.scenes[s.i]); }
        return c.rerender();
      }
      if (name === "put") {
        const it = el.getAttribute("data-v"), sc = s.scenes[s.i];
        if (sc.want.includes(it)) { if (!s.placed.includes(it)) s.placed.push(it); s.miss = null; s.lastPut = it; FX.play(sc.want.every((w) => s.placed.includes(w)) ? "ok" : "pop"); }
        else { s.miss = it; s.mistakes++; s.lastPut = null; FX.play("no"); }
        c.rerender();
      }
    },
  };

  /* ======================= The Giving Tree (7–10) ======================= */
  const TREE = [
    { q: { en: "What do we call charity that keeps helping people for a long time, even after we are gone?", ar: "ماذا نسمي الصدقة التي يستمر نفعها طويلاً حتى بعد رحيلنا؟" }, o: [{ en: "Sadaqah Jariyah", ar: "صدقة جارية" }, { en: "A one-off gift", ar: "هدية لمرة واحدة" }, { en: "A birthday present", ar: "هدية عيد ميلاد" }], why: { en: "Sadaqah Jariyah keeps helping for a long time, like a well or a school.", ar: "الصدقة الجارية يستمر نفعها طويلاً، مثل البئر أو المدرسة." }, r: "m1631" },
    { q: { en: "Which of these is Sadaqah Jariyah?", ar: "أيٌّ مما يلي صدقة جارية؟" }, o: [{ en: "A water well", ar: "بئر ماء" }, { en: "One biscuit", ar: "قطعة بسكويت" }, { en: "A balloon", ar: "بالون" }], why: { en: "A well can give water to people and animals for many years.", ar: "البئر قد تسقي الناس والحيوانات سنوات طويلة." }, r: "m1631" },
    { q: { en: "What did the Prophet ﷺ say about someone who builds a mosque?", ar: "ماذا قال النبي ﷺ عمّن يبني مسجداً؟" }, o: [{ en: "Allah builds a place like it for them in Paradise", ar: "يبني الله له مثله في الجنة" }, { en: "Nothing special happens", ar: "لا يحدث شيء مميز" }, { en: "It must be very big", ar: "يجب أن يكون كبيراً جداً" }], why: { en: "Building a mosque is rewarded with a place in Paradise.", ar: "بناء المسجد يُجزى صاحبه بمثله في الجنة." }, r: "b450" },
    { q: { en: "Which small act is also charity?", ar: "أي عمل صغير يُعد صدقة أيضاً؟" }, o: [{ en: "Meeting someone with a smile", ar: "أن تلقى أحداً بوجه مبتسم" }, { en: "Frowning at people", ar: "العبوس في وجوه الناس" }, { en: "Ignoring a friend", ar: "تجاهل صديق" }], why: { en: "No good deed is too small, even a cheerful face.", ar: "لا يوجد معروف صغير، حتى الوجه البشوش." }, r: "m2626" },
    { q: { en: "Something sharp is lying on the path. What can you do?", ar: "شيء حاد ملقى في الطريق. ماذا تفعل؟" }, o: [{ en: "Move it out of the way", ar: "أُبعده عن الطريق" }, { en: "Kick it further along", ar: "أركله إلى مكان آخر في الطريق" }, { en: "Leave it there", ar: "أتركه مكانه" }], why: { en: "Removing something harmful from the road is charity.", ar: "إماطة الأذى عن الطريق صدقة." }, r: "b2989" },
    { q: { en: "A bird eats from a tree you planted. What does that count as?", ar: "طائر يأكل من شجرة غرستها. بماذا يُحسب ذلك؟" }, o: [{ en: "Charity for you", ar: "صدقة لك" }, { en: "Nothing", ar: "لا شيء" }, { en: "A mistake", ar: "خطأ" }], why: { en: "When a bird, a person or an animal eats from what you planted, it is charity for you.", ar: "ما يأكل منه طير أو إنسان أو بهيمة مما غرسته يكون لك صدقة." }, r: "b2320" },
    { q: { en: "What did the Prophet ﷺ say about a good word?", ar: "ماذا قال النبي ﷺ عن الكلمة الطيبة؟" }, o: [{ en: "It is charity", ar: "إنها صدقة" }, { en: "It does not matter", ar: "لا أهمية لها" }, { en: "Only grown-ups can say one", ar: "لا يقولها إلا الكبار" }], why: { en: "A good word is charity, so anyone can give it.", ar: "الكلمة الطيبة صدقة، فيستطيع كل أحد أن يتصدق بها." }, r: "b2989" },
    { q: { en: "Protect yourself from the Fire, even with half a ____.", ar: "اتقوا النار ولو بشق ____." }, o: [{ en: "date", ar: "تمرة" }, { en: "house", ar: "بيت" }, { en: "car", ar: "سيارة" }], why: { en: "Even a very small gift counts.", ar: "حتى العطاء الصغير جداً له قيمة." }, r: "b1417" },
    { q: { en: "You give a fasting person food to break their fast. What do you get?", ar: "قدّمت لصائم طعاماً يفطر عليه. ماذا تنال؟" }, o: [{ en: "A reward like theirs", ar: "مثل أجره" }, { en: "Nothing", ar: "لا شيء" }, { en: "A new toy", ar: "لعبة جديدة" }], why: { en: "Whoever feeds a fasting person gets a reward like theirs, and theirs is not reduced.", ar: "من فطّر صائماً كان له مثل أجره، دون أن ينقص من أجر الصائم شيء." }, r: "t807" },
    { q: { en: "How many groups of people does the Qur'an say can receive zakat?", ar: "كم صنفاً من الناس يذكر القرآن أنهم يستحقون الزكاة؟" }, o: [{ en: "Eight", ar: "ثمانية" }, { en: "Two", ar: "اثنان" }, { en: "Twenty", ar: "عشرون" }], why: { en: "The Qur'an names eight groups, such as the poor, the needy and travellers in need.", ar: "ذكر القرآن ثمانية أصناف، منهم الفقراء والمساكين وابن السبيل." }, r: "q960" },
    { q: { en: "Who will be close to the Prophet ﷺ in Paradise?", ar: "من يكون قريباً من النبي ﷺ في الجنة؟" }, o: [{ en: "The one who looks after an orphan", ar: "كافل اليتيم" }, { en: "The fastest runner", ar: "أسرع عدّاء" }, { en: "The richest person", ar: "أغنى الناس" }], why: { en: "Looking after an orphan brings a person close to the Prophet ﷺ in Paradise.", ar: "كفالة اليتيم تقرّب صاحبها من النبي ﷺ في الجنة." }, r: "b6005" },
    { q: { en: "What is a waqf?", ar: "ما الوقف؟" }, o: [{ en: "Something kept forever so its benefit keeps going to good causes", ar: "شيء يُحبس على الدوام ليستمر نفعه في وجوه الخير" }, { en: "A kind of food", ar: "نوع من الطعام" }, { en: "A holiday", ar: "عطلة" }], why: { en: "A waqf keeps the original gift and gives its benefit, like rent or harvest, again and again.", ar: "الوقف يحفظ الأصل ويُعطي منفعته، كالإيجار أو المحصول، مرة بعد مرة." }, r: null },
  ];
  // The tree is drawn as an SVG that grows with each right answer.
  const APPLES = [[-26, -14], [22, -24], [-4, -38], [30, 0], [-34, 8], [6, -6]];
  function treeSVG(c, stage, total, fruits) {
    const k = stage / total, f = (n) => n.toFixed(1);
    let body;
    if (stage === 0) body = `<ellipse cx="100" cy="150" rx="9" ry="6" fill="#8a6a45"/>`;
    else if (stage === 1) body = `<path d="M100 152 v-24" stroke="#5b8c4f" stroke-width="4" stroke-linecap="round"/><ellipse cx="90" cy="126" rx="10" ry="5" fill="#5b8c4f" transform="rotate(-25 90 126)"/><ellipse cx="110" cy="126" rx="10" ry="5" fill="#6fa663" transform="rotate(25 110 126)"/>`;
    else {
      const h = 28 + k * 44, r = 18 + k * 34, cy = 152 - h - r * 0.5;
      body = `<rect x="${f(97 - k * 5)}" y="${f(152 - h)}" width="${f(6 + k * 10)}" height="${f(h)}" rx="3" fill="#8a6a45"/>
        <circle cx="${f(100 - r * 0.55)}" cy="${f(cy + r * 0.25)}" r="${f(r * 0.72)}" fill="#4f7d44"/><circle cx="${f(100 + r * 0.55)}" cy="${f(cy + r * 0.25)}" r="${f(r * 0.72)}" fill="#5b8c4f"/><circle cx="100" cy="${f(cy - r * 0.2)}" r="${f(r * 0.85)}" fill="#6fa663"/>
        ${APPLES.slice(0, fruits).map(([x, y], i) => `<circle class="${i === fruits - 1 ? "ss-apple-new" : ""}" cx="${f(100 + x * r / 52)}" cy="${f(cy + y * r / 52 + r * 0.1)}" r="5.5" fill="#c94f4f" stroke="#fff" stroke-width="1"/>`).join("")}`;
    }
    return `<svg viewBox="0 0 200 166" class="ss-tree-svg" role="img" aria-label="${c.ar ? `الشجرة: ${stage} من ${total}` : `Tree: ${stage} of ${total}`}"><ellipse cx="100" cy="154" rx="72" ry="9" fill="#e8d5a8"/><g class="ss-tree-grow">${body}</g></svg>`;
  }
  G["giving-tree"] = {
    title: { en: "The Giving Tree", ar: "شجرة العطاء" }, icon: "🌳",
    howto: { en: "Answer six questions. Each right answer helps your tree grow and gives it a fruit. If you miss, read the hint and try again.", ar: "أجب عن ستة أسئلة. كل إجابة صحيحة تجعل شجرتك تكبر وتمنحها ثمرة. وإذا أخطأت فاقرأ التلميح وحاول مرة أخرى." },
    init(c) { Object.assign(c.s, { qs: pickN(TREE, 6).map((q) => ({ q, order: pickN([0, 1, 2], 3) })), i: 0, wrong: [], solved: false, firstTry: 0 }); return this.render(c); },
    render(c) {
      const s = c.s, ar = c.ar;
      if (s.i >= s.qs.length) {
        return `${c.head()}<div class="ss-tree-stage">${treeSVG(c, s.qs.length, s.qs.length, s.firstTry)}<div class="ss-fruits">${s.qs.map(() => "🍎").join("")}</div></div>
          <p>${ar ? `نمت شجرتك! أجبت ${s.firstTry} من ${s.qs.length} من المحاولة الأولى.` : `Your tree is fully grown! You got ${s.firstTry} of ${s.qs.length} on the first try.`}</p>
          <div class="ss-summary"><h4>${ar ? "ثمار ما تعلّمته" : "The fruit you picked"}</h4><ul>${s.qs.map(({ q }) => `<li>🍎 ${c.T(q.why)}${ref(c, R[q.r])}</li>`).join("")}</ul></div>
          ${c.btn("↻ " + c.t("nav.restart"), "restart", null, "ss-btn-ghost")} ${c.finish()}`;
      }
      const { q, order } = s.qs[s.i];
      const grown = s.i + (s.solved ? 1 : 0);
      return `${c.head()}<div class="ss-tree-stage">${treeSVG(c, grown, s.qs.length, s.firstTry)}<div class="ss-fruits">${s.qs.slice(0, grown).map(() => "🍎").join("")}</div><div class="ss-tree-stage-n">${grown}/${s.qs.length}</div></div>
        <div class="ss-tree-q">${c.T(q.q)}</div>
        <div class="ss-opts">${order.map((oi) => {
          const cls = s.solved && oi === 0 ? "right" : s.wrong.includes(oi) ? "wrong" : "";
          return `<button type="button" class="ss-opt ${cls}" data-act="g" data-g="ans" data-v="${oi}" ${s.solved || s.wrong.includes(oi) ? "disabled" : ""}>${c.T(q.o[oi])}</button>`;
        }).join("")}</div>
        ${s.wrong.length && !s.solved ? `<p class="ss-hint ss-shake">${ar ? "ليس تماماً. فكّر مرة أخرى!" : "Not quite. Think again!"}</p>` : ""}
        ${s.solved ? `<div class="ss-lesson"><span class="ss-lesson-e">🍎</span><div><p>${c.T(q.why)}${ref(c, R[q.r])}</p></div></div>${c.btn((ar ? "التالي" : "Next") + " " + c.fwd(), "next")}` : ""}`;
    },
    act(c, name, el) {
      const s = c.s;
      if (name === "restart") { this.init(c); return c.rerender(); }
      if (name === "next") { s.i++; s.wrong = []; s.solved = false; if (s.i >= s.qs.length) { c.awardBadge("grower"); FX.play("win"); FX.confetti(); } return c.rerender(); }
      if (name === "ans") {
        const oi = Number(el.getAttribute("data-v"));
        if (oi === 0) { s.solved = true; FX.play("ok"); if (!s.wrong.length) { s.firstTry++; c.addStars(1); } } else if (!s.wrong.includes(oi)) { s.wrong.push(oi); FX.play("no"); }
        c.rerender();
      }
    },
  };

  /* ======================= Build Your Community (11–14) =======================
     Three years, $10,000 a year. Lasting projects need upkeep each later year
     or they work at half strength; yearly projects must be paid again. */
  const NEEDS = [
    { k: "water", e: "💧", en: "Water", ar: "الماء" }, { k: "food", e: "🍚", en: "Food", ar: "الغذاء" }, { k: "health", e: "💚", en: "Health", ar: "الصحة" },
    { k: "learning", e: "📚", en: "Learning", ar: "التعليم" }, { k: "care", e: "🤲", en: "Care for the most vulnerable", ar: "رعاية الأشد ضعفاً" },
  ];
  const PROJ = [
    { id: "well", e: "🚰", cost: 6000, upkeep: 500, lasting: true, fx: { water: 80, health: 15 }, n: { en: "Water well", ar: "بئر ماء" } },
    { id: "school", e: "🏫", cost: 7000, upkeep: 1500, lasting: true, fx: { learning: 80 }, n: { en: "School", ar: "مدرسة" } },
    { id: "clinic", e: "🏥", cost: 8000, upkeep: 2000, lasting: true, fx: { health: 80, care: 15 }, n: { en: "Health clinic", ar: "مستوصف" } },
    { id: "farm", e: "🌾", cost: 4000, upkeep: 0, lasting: true, fx: { food: 50 }, n: { en: "Farming kits and training", ar: "أدوات زراعية وتدريب" } },
    { id: "kitchen", e: "🍲", cost: 3000, lasting: false, fx: { food: 50, care: 15 }, n: { en: "Community kitchen (one year)", ar: "مطبخ خيري (سنة واحدة)" } },
    { id: "orphan", e: "🧑‍🍼", cost: 2500, lasting: false, fx: { care: 50, learning: 10 }, n: { en: "Orphan sponsorship (one year)", ar: "كفالة أيتام (سنة واحدة)" } },
    { id: "elderly", e: "🧓", cost: 1500, lasting: false, fx: { care: 40 }, n: { en: "Visits for elderly people living alone (one year)", ar: "زيارات لكبار السن الذين يعيشون وحدهم (سنة واحدة)" } },
    { id: "lights", e: "💡", cost: 2000, upkeep: 200, lasting: true, fx: { learning: 20, care: 10 }, n: { en: "Solar street lights", ar: "إنارة شوارع بالطاقة الشمسية" } },
  ];
  const EVENTS = [
    { e: "☀️", en: "The dry season came. Families without a nearby well walked hours for water.", ar: "جاء موسم الجفاف، فمشت الأسر التي لا بئر قريبة منها ساعات طويلة لجلب الماء.", k: "water" },
    { e: "🤧", en: "A flu outbreak hit the village. A working clinic made all the difference.", ar: "أصاب الإنفلونزا أهل القرية، وكان وجود مستوصف يعمل هو الفارق الأكبر.", k: "health" },
    { e: "📝", en: "Exam season arrived. Children with a school and light to study by did best.", ar: "جاء موسم الامتحانات، وكان أفضل الأطفال أداءً من لديهم مدرسة وإضاءة للمذاكرة.", k: "learning" },
  ];
  const BUDGET = 10000;
  const rating = (c, n) => c.T(n >= 70 ? { en: "thriving", ar: "مزدهرة" } : n >= 50 ? { en: "doing well", ar: "بحال جيدة" } : n >= 30 ? { en: "getting there", ar: "تتحسّن" } : { en: "struggling", ar: "تعاني" });
  function commYear(s) {
    const met = {}; NEEDS.forEach((n) => (met[n.k] = 0));
    PROJ.forEach((p) => {
      let f = 0;
      if (p.lasting && s.built.includes(p.id)) f = (s.builtYear[p.id] === s.year || !p.upkeep || s.upkeep[p.id]) ? 1 : 0.5;
      if (!p.lasting && s.picked.includes(p.id)) f = 1;
      Object.entries(p.fx).forEach(([k, v]) => (met[k] += v * f));
    });
    NEEDS.forEach((n) => (met[n.k] = Math.min(100, Math.round(met[n.k]))));
    const ev = EVENTS[s.year - 1];
    const score = Math.round((NEEDS.reduce((a, n) => a + met[n.k], 0) + met[ev.k]) / (NEEDS.length + 1));
    return { met, score, ev };
  }
  G["build-community"] = {
    title: { en: "Build Your Community", ar: "ابنِ مجتمعك" }, icon: "🏘️",
    howto: { en: "Run a village fund for three years with $10,000 a year. Buildings last, but need upkeep every year after they are built. Some help, like meals, must be paid again each year. Try to meet every need, especially for the most vulnerable.", ar: "أدِر صندوق قرية لثلاث سنوات بميزانية 10,000 دولار في السنة. المباني تدوم، لكنها تحتاج إلى صيانة كل سنة بعد بنائها. وبعض المساعدات، كالوجبات، يجب أن تُدفع من جديد كل سنة. حاول أن تلبي كل الحاجات، ولا سيما حاجات الأشد ضعفاً." },
    init(c) { Object.assign(c.s, { year: 1, built: [], builtYear: {}, upkeep: {}, picked: [], results: [], view: "plan" }); return this.render(c); },
    spent(s) {
      return s.picked.reduce((a, id) => a + PROJ.find((p) => p.id === id).cost, 0)
        + s.built.filter((id) => s.builtYear[id] < s.year && s.upkeep[id]).reduce((a, id) => a + (PROJ.find((p) => p.id === id).upkeep || 0), 0);
    },
    // A small picture of the village: what stands there now, what is new this year.
    village(c, s, broken) {
      const tile = (p, cls) => `<span class="ss-vt ${cls}" title="${c.esc(c.T(p.n))}"><span>${p.e}</span>${cls.includes("dim") ? `<i>🔧</i>` : ""}</span>`;
      const built = s.built.map((id) => PROJ.find((p) => p.id === id));
      const fresh = s.picked.map((id) => PROJ.find((p) => p.id === id)).filter((p) => !s.built.includes(p.id) || !p.lasting);
      const tiles = built.map((p) => tile(p, (broken && broken[p.id] ? "dim" : "") + (s.builtYear[p.id] === s.year ? " new" : ""))).concat(fresh.filter((p) => !s.built.includes(p.id)).map((p) => tile(p, p.lasting ? "new" : "new year")));
      return `<div class="ss-village" role="img" aria-label="${c.ar ? "صورة القرية" : "Picture of the village"}"><span class="ss-vsun">☀️</span><div class="ss-vrow"><span class="ss-vt base"><span>🏠</span></span><span class="ss-vt base"><span>🌴</span></span>${tiles.join("")}<span class="ss-vt base"><span>🏠</span></span>${tiles.length ? "" : `<span class="ss-vempty">${c.ar ? "اختر مشروعاً ليظهر هنا" : "Pick a project to see it here"}</span>`}</div></div>`;
    },
    bars(c, met) { return `<div class="ss-needs">${NEEDS.map((n) => `<div class="ss-need"><span>${n.e} ${c.T(n)}</span><div class="ss-need-bar"><i style="width:${met[n.k]}%"></i></div><b>${met[n.k]}</b></div>`).join("")}</div>`; },
    render(c) {
      const s = c.s, ar = c.ar;
      if (s.view === "end") {
        const avg = Math.round(s.results.reduce((a, r) => a + r.score, 0) / s.results.length);
        const careOk = s.results.every((r) => r.met.care >= 30);
        const lessons = [];
        if (s.results.some((r, i) => i > 0 && Object.values(r.broken || {}).length)) lessons.push(ar ? "بعض المباني لم تُصَن فضعف أثرها. المشاريع الدائمة تحتاج إلى من يرعاها كل سنة." : "Some buildings missed their upkeep and worked at half strength. Lasting projects need someone to care for them every year.");
        if (s.results.length === 3 && s.results[2].score > s.results[0].score) lessons.push(ar ? "تحسّن حال القرية من سنة إلى أخرى، لأن ما بنيته في البداية ظل ينفع." : "The village got better year by year, because what you built early kept helping.");
        lessons.push(careOk ? (ar ? "حميت الأشد ضعفاً في كل سنة. أحسنت!" : "You looked after the most vulnerable every year. Well done!") : (ar ? "في بعض السنوات لم يحصل الأشد ضعفاً على رعاية كافية. فكّر في الأيتام وكبار السن." : "In some years the most vulnerable did not get enough care. Think about orphans and elderly people."));
        lessons.push(ar ? "المساعدة الفورية كالوجبات تنتهي بنهاية السنة، أما البئر والمدرسة فيبقى نفعهما. القرية تحتاج إلى الاثنين." : "Quick help like meals ends with the year, while a well or a school keeps working. A village needs both.");
        return `${c.head()}<h4>${ar ? "رفاه القرية على مدى ثلاث سنوات" : "Village wellbeing over three years"}: ${avg}% (${rating(c, avg)})</h4>
          ${s.results.map((r, i) => `<div class="ss-year-res"><strong>${ar ? "السنة" : "Year"} ${i + 1}: ${r.score}% (${rating(c, r.score)})</strong> ${r.ev.e} <span class="ss-muted">${c.T(r.ev)}</span>${this.bars(c, r.met)}</div>`).join("")}
          <div class="ss-summary"><h4>${ar ? "ما نتعلّمه" : "What we learn"}</h4><ul>${lessons.map((l) => `<li>${l}</li>`).join("")}</ul></div>
          ${c.btn("↻ " + c.t("nav.restart"), "restart", null, "ss-btn-ghost")} ${c.finish()}`;
      }
      if (s.view === "result") {
        const r = s.results[s.results.length - 1];
        return `${c.head()}<h4>${ar ? "السنة" : "Year"} ${s.year}: ${ar ? "رفاه القرية" : "village wellbeing"} ${r.score}% (${rating(c, r.score)})</h4>
          ${this.village(c, s, r.broken)}
          <div class="ss-lesson"><span class="ss-lesson-e">${r.ev.e}</span><div><p>${c.T(r.ev)}</p></div></div>
          ${this.bars(c, r.met)}
          ${Object.keys(r.broken || {}).length ? `<p class="ss-hint">${ar ? "لم تُدفع صيانة: " : "No upkeep paid for: "}${Object.keys(r.broken).map((id) => c.T(PROJ.find((p) => p.id === id).n)).join(ar ? "، " : ", ")}. ${ar ? "عملت بنصف قوتها." : "They worked at half strength."}</p>` : ""}
          ${c.btn((s.year < 3 ? (ar ? "السنة التالية" : "Next year") : (ar ? "النتيجة النهائية" : "Final result")) + " " + c.fwd(), "next")}`;
      }
      const spent = this.spent(s), left = BUDGET - spent;
      const old = s.built.filter((id) => s.builtYear[id] < s.year);
      return `${c.head()}<p class="ss-game-sub">${ar ? "السنة" : "Year"} ${s.year}/3 · ${c.money(spent)} / ${c.money(BUDGET)}</p>
        <div class="ss-budget-bar"><span style="width:${Math.min(100, spent / BUDGET * 100)}%"></span></div>
        ${this.village(c, s)}
        ${old.length ? `<h5>${ar ? "صيانة ما بنيته" : "Upkeep for what you built"}</h5><div class="ss-upkeep">${old.map((id) => { const p = PROJ.find((x) => x.id === id); return p.upkeep ? `<label class="ss-upk"><input type="checkbox" data-g-input="upkeep" value="${id}" ${s.upkeep[id] ? "checked" : ""}> ${p.e} ${c.T(p.n)} · ${c.money(p.upkeep)}</label>` : `<span class="ss-upk">${p.e} ${c.T(p.n)} · ${ar ? "بلا صيانة" : "no upkeep needed"}</span>`; }).join("")}</div>` : ""}
        <h5>${ar ? "اختر مشاريع هذه السنة" : "Choose this year's projects"}</h5>
        <div class="ss-comm-grid">${PROJ.filter((p) => !(p.lasting && s.built.includes(p.id) && s.builtYear[p.id] < s.year)).map((p) => {
          const sel = s.picked.includes(p.id), can = sel || p.cost <= left;
          return `<button type="button" class="ss-proj-pick ${sel ? "selected" : ""}" data-act="g" data-g="pick" data-v="${p.id}" ${can ? "" : "disabled"}>
            <div class="ss-pi">${p.e}</div><div class="ss-pc">${c.money(p.cost)}</div><div class="ss-pn">${c.T(p.n)}</div>
            <div class="ss-pfx">${Object.keys(p.fx).map((k) => NEEDS.find((n) => n.k === k).e).join(" ")} · ${p.lasting ? (ar ? `يدوم${p.upkeep ? "، صيانة " + c.money(p.upkeep) : ""}` : `lasts${p.upkeep ? ", upkeep " + c.money(p.upkeep) : ""}`) : (ar ? "سنة واحدة" : "one year")}</div></button>`;
        }).join("")}</div>
        ${c.btn((ar ? "شغّل هذه السنة" : "Run this year") + " " + c.fwd(), "run")}`;
    },
    input(c, name, el) {
      if (name === "upkeep") {
        const s = c.s, id = el.value, p = PROJ.find((x) => x.id === id);
        if (el.checked && this.spent(s) + p.upkeep > BUDGET) { el.checked = false; c.toast(c.ar ? "الميزانية لا تكفي" : "Not enough budget"); return; }
        s.upkeep[id] = el.checked; c.rerender();
      }
    },
    act(c, name, el) {
      const s = c.s;
      if (name === "restart") { this.init(c); return c.rerender(); }
      if (name === "pick") {
        const id = el.getAttribute("data-v"), p = PROJ.find((x) => x.id === id);
        if (s.picked.includes(id)) s.picked = s.picked.filter((x) => x !== id);
        else if (this.spent(s) + p.cost <= BUDGET) { s.picked.push(id); FX.play("pop"); }
        return c.rerender();
      }
      if (name === "run") {
        s.picked.forEach((id) => { const p = PROJ.find((x) => x.id === id); if (p.lasting && !s.built.includes(id)) { s.built.push(id); s.builtYear[id] = s.year; } });
        const r = commYear(s);
        r.broken = {}; s.built.forEach((id) => { const p = PROJ.find((x) => x.id === id); if (s.builtYear[id] < s.year && p.upkeep && !s.upkeep[id]) r.broken[id] = 1; });
        s.results.push(r); s.view = "result"; c.addStars(Math.max(1, Math.round(r.score / 25))); FX.play(r.score >= 50 ? "ok" : "pop");
        return c.rerender();
      }
      if (name === "next") {
        if (s.year >= 3) { s.view = "end"; FX.play("win"); if (s.results.every((r) => r.met.care >= 30)) { c.awardBadge("builder"); FX.confetti(); } return c.rerender(); }
        s.year++; s.picked = []; s.view = "plan";
        s.built.forEach((id) => { const p = PROJ.find((x) => x.id === id); if (p.upkeep && s.upkeep[id] == null) s.upkeep[id] = true; });
        // Default: keep paying upkeep while the budget allows.
        let spent = this.spent(s);
        s.built.forEach((id) => { const p = PROJ.find((x) => x.id === id); if (s.upkeep[id] && spent > BUDGET) { s.upkeep[id] = false; spent -= p.upkeep; } });
        return c.rerender();
      }
    },
  };

  /* ======================= Sort the Zakat (11–14) =======================
     Some cases have more than one acceptable answer where scholars explain
     the categories differently; the feedback says so. */
  const ZCATS = [
    { id: "fuqara", en: "The poor", ar: "الفقراء", d: { en: "People who have very little", ar: "من لا يملكون إلا القليل" } },
    { id: "masakin", en: "The needy", ar: "المساكين", d: { en: "People who cannot meet their needs", ar: "من لا يكفيهم ما عندهم" } },
    { id: "amilun", en: "Zakat workers", ar: "العاملون عليها", d: { en: "People who collect and hand out zakat", ar: "من يجمعون الزكاة ويوزعونها" } },
    { id: "muallaf", en: "Hearts brought closer", ar: "المؤلّفة قلوبهم", d: { en: "Such as people new to Islam", ar: "مثل حديثي العهد بالإسلام" } },
    { id: "riqab", en: "Freeing people", ar: "في الرقاب", d: { en: "Freeing people from bondage", ar: "تحرير من وقعوا في الرق" } },
    { id: "gharimun", en: "People in debt", ar: "الغارمون", d: { en: "Those who cannot pay their debts", ar: "العاجزون عن سداد ديونهم" } },
    { id: "sabil", en: "In Allah's cause", ar: "في سبيل الله", d: { en: "Those striving in Allah's cause", ar: "المجاهدون في سبيل الله" } },
    { id: "ibn-sabil", en: "Travellers in need", ar: "ابن السبيل", d: { en: "Travellers stranded without money", ar: "المسافر الذي انقطعت به السبل" } },
    { id: "none", en: "Not from zakat", ar: "لا يُعطى من الزكاة", d: { en: "Help in another way", ar: "يُساعَد بطريقة أخرى" } },
  ];
  const POOR_WHY = { en: "The poor and the needy are two of the eight groups. Scholars explain the difference between them in different ways, so either answer is accepted here.", ar: "الفقراء والمساكين صنفان من الأصناف الثمانية، ويختلف العلماء في بيان الفرق بينهما، لذلك تُقبل الإجابتان هنا." };
  const ZCARDS = [
    { t: { en: "Ahmad ran out of money far from home and cannot get back.", ar: "نفد مال أحمد بعيداً عن بلده ولا يستطيع العودة." }, ok: ["ibn-sabil"], why: { en: "A traveller stranded without money can receive zakat, even if he has money back home.", ar: "المسافر الذي انقطعت به السبل يُعطى من الزكاة، ولو كان له مال في بلده." } },
    { t: { en: "A man borrowed money for his family's basic needs and now cannot repay it.", ar: "رجل استدان لحاجات أسرته الأساسية ولا يستطيع السداد الآن." }, ok: ["gharimun"], why: { en: "People who cannot repay debts taken for lawful needs are one of the eight groups.", ar: "العاجزون عن سداد ديون استدانوها لحاجات مباحة صنف من الأصناف الثمانية." } },
    { t: { en: "A widow cannot buy enough food for her children.", ar: "أرملة لا تستطيع شراء ما يكفي أطفالها من الطعام." }, ok: ["fuqara", "masakin"], why: POOR_WHY },
    { t: { en: "A family lost everything in a fire and cannot meet their basic needs.", ar: "أسرة فقدت كل شيء في حريق ولا تستطيع تلبية حاجاتها الأساسية." }, ok: ["fuqara", "masakin"], why: POOR_WHY },
    { t: { en: "A new Muslim whose family stopped supporting him.", ar: "مسلم جديد توقفت أسرته عن الإنفاق عليه." }, ok: ["muallaf", "fuqara", "masakin"], why: { en: "The verse names 'those whose hearts are brought closer', which scholars apply to people new to Islam. If he is also poor, he can receive as one of the poor.", ar: "تذكر الآية «المؤلّفة قلوبهم»، ويدخل فيهم عند العلماء حديثو العهد بالإسلام. وإذا كان فقيراً أيضاً فيُعطى بوصفه فقيراً." } },
    { t: { en: "A worker employed to collect and hand out zakat.", ar: "موظف يعمل في جمع الزكاة وتوزيعها." }, ok: ["amilun"], why: { en: "Zakat workers can be paid from zakat for their work, even if they are not poor.", ar: "العاملون على الزكاة يُعطون منها أجر عملهم، ولو لم يكونوا فقراء." } },
    { t: { en: "A captive who can be freed if a ransom is paid.", ar: "أسير يمكن تحريره إذا دُفعت فديته." }, ok: ["riqab"], why: { en: "'Freeing those in bondage' is one of the eight groups, and many scholars include paying to free captives.", ar: "«في الرقاب» صنف من الأصناف الثمانية، ويُدخل فيه كثير من العلماء فداء الأسرى." } },
    { t: { en: "A volunteer defending the Muslim community who has no salary.", ar: "متطوع يدافع عن المسلمين وليس له راتب." }, ok: ["sabil"], why: { en: "Most scholars explain 'in Allah's cause' as people striving in Allah's cause, such as unpaid volunteers who defend the community.", ar: "يفسّر أكثر العلماء «في سبيل الله» بالمجاهدين في سبيل الله، كالمتطوعين الذين لا رواتب لهم." } },
    { t: { en: "Money to build a new mosque.", ar: "مال لبناء مسجد جديد." }, ok: ["none"], why: { en: "Most scholars say zakat should not pay for building mosques, because the eight groups are mainly people. Mosques can be built with other charity. A few scholars allow it.", ar: "يرى أكثر العلماء أن الزكاة لا تُصرف في بناء المساجد، لأن الأصناف الثمانية في الغالب أشخاص. وتُبنى المساجد من الصدقات الأخرى. ويجيز ذلك قليل من العلماء." } },
    { t: { en: "A rich man who wants extra money for a holiday.", ar: "رجل غني يريد مالاً إضافياً لعطلة." }, ok: ["none"], why: { en: "Zakat is for people in need, not for people who already have enough.", ar: "الزكاة للمحتاجين، لا لمن عنده ما يكفيه." } },
    { t: { en: "Your own mother, whom you are responsible for supporting.", ar: "أمك التي يجب عليك أن تنفق عليها." }, ok: ["none"], why: { en: "Scholars agree you cannot give your zakat to parents or children you must support. You help them from your own money, and that is rewarded too.", ar: "اتفق العلماء على أنك لا تعطي زكاتك لوالديك أو أولادك الذين تجب عليك نفقتهم. بل تنفق عليهم من مالك، ولك في ذلك أجر أيضاً." } },
    { t: { en: "A student whose money was stolen on the journey to her university abroad.", ar: "طالبة سُرق مالها في طريقها إلى جامعتها في الخارج." }, ok: ["ibn-sabil"], why: { en: "She is a traveller who has lost her money, so she can be helped as a traveller in need.", ar: "هي مسافرة فقدت مالها، فتُعطى بوصفها ابن سبيل." } },
    { t: { en: "A father in debt after paying for his child's urgent surgery.", ar: "أب عليه دين بعد أن دفع تكاليف عملية عاجلة لطفله." }, ok: ["gharimun"], why: { en: "He took on debt for a lawful, urgent need and cannot repay it.", ar: "استدان لحاجة مباحة عاجلة ولا يستطيع السداد." } },
    { t: { en: "A family in your neighbourhood who cannot pay this month's rent.", ar: "أسرة في حيّك لا تستطيع دفع إيجار هذا الشهر." }, ok: ["fuqara", "masakin", "gharimun"], why: { en: "They can receive as the poor or the needy. If the unpaid rent has become a debt, they also fit 'people in debt'.", ar: "يُعطون بوصفهم فقراء أو مساكين. وإذا صار الإيجار ديناً عليهم فهم من الغارمين أيضاً." } },
  ];
  // Shared with the teacher handouts (teach.js).
  window.SADAQAH_GAME_DATA = { ZCATS, ZCARDS };
  G["sort-zakat"] = {
    title: { en: "Sort the Zakat", ar: "رتّب الزكاة" }, icon: "⚖️",
    howto: { en: "Read about each person and tap the zakat group they belong to, or 'Not from zakat'. You can also drag the card onto a group. The eight groups come from Qur'an 9:60. Where scholars differ, more than one answer counts.", ar: "اقرأ عن كل شخص واضغط على صنف الزكاة الذي ينتمي إليه، أو «لا يُعطى من الزكاة». ويمكنك أيضاً سحب البطاقة إلى الصنف. الأصناف الثمانية مذكورة في سورة التوبة (9:60). وحيث يختلف العلماء تُقبل أكثر من إجابة." },
    init(c) { Object.assign(c.s, { cards: pickN(ZCARDS, 10), i: 0, pick: null, right: 0, log: [] }); return this.render(c); },
    render(c) {
      const s = c.s, ar = c.ar, nm = (id) => { const z = ZCATS.find((x) => x.id === id); return ar ? z.ar : z.en; };
      if (s.i >= s.cards.length) {
        return `${c.head()}<h4>${ar ? `أصبت في ${s.right} من ${s.cards.length}` : `You got ${s.right} of ${s.cards.length} right`}</h4>
          <div class="ss-summary"><ul>${s.log.map((l) => `<li class="${l.ok ? "ok" : "no"}">${l.ok ? "✓" : "✗"} ${c.T(l.card.t)} <em>${l.card.ok.map(nm).join(ar ? " أو " : " or ")}</em></li>`).join("")}</ul></div>
          <p class="ss-muted">${ar ? "الأصناف الثمانية:" : "The eight groups:"}${ref(c, R.q960)}</p>
          ${c.btn("↻ " + c.t("nav.restart"), "restart", null, "ss-btn-ghost")} ${c.finish()}`;
      }
      const card = s.cards[s.i];
      return `${c.head()}<p class="ss-game-sub">${s.i + 1}/${s.cards.length} · ✓ ${s.right}</p>
        <div class="ss-zchar ${s.pick == null ? "ss-pop-in" : ""}" ${s.pick == null ? `data-drag="target"` : ""}><span class="ss-zgrip" aria-hidden="true">⠿</span> ${c.T(card.t)}</div>
        <div class="ss-zakat-bins">${ZCATS.map((z) => {
          const cls = s.pick == null ? "" : card.ok.includes(z.id) ? "right" : z.id === s.pick ? "wrong" : "";
          return `<button type="button" class="ss-zbin ${cls} ${z.id === "none" ? "ss-zbin-none" : ""}" data-act="g" data-g="pick" data-v="${z.id}" data-drop ${s.pick != null ? "disabled" : ""}><h5>${ar ? z.ar : z.en}</h5><div class="ss-zd">${c.T(z.d)}</div></button>`;
        }).join("")}</div>
        ${s.pick != null ? `<div class="ss-lesson"><span class="ss-lesson-e">${card.ok.includes(s.pick) ? "✅" : "💡"}</span><div><strong>${card.ok.includes(s.pick) ? (ar ? "صحيح!" : "Correct!") : (ar ? "الإجابة: " : "Answer: ") + card.ok.map(nm).join(ar ? " أو " : " or ")}</strong><p>${c.T(card.why)}</p></div></div>${c.btn((ar ? "التالي" : "Next") + " " + c.fwd(), "next")}` : ""}`;
    },
    act(c, name, el) {
      const s = c.s;
      if (name === "restart") { this.init(c); return c.rerender(); }
      if (name === "pick" && s.pick == null) {
        s.pick = el.getAttribute("data-v"); const card = s.cards[s.i], ok = card.ok.includes(s.pick);
        if (ok) { s.right++; c.addStars(1); }
        FX.play(ok ? "ok" : "no");
        s.log.push({ card, ok }); return c.rerender();
      }
      if (name === "next") { s.i++; s.pick = null; if (s.i >= s.cards.length && s.right >= 8) { c.awardBadge("zakat"); FX.play("win"); FX.confetti(); } return c.rerender(); }
    },
  };

  /* ======================= Charity Chain Reaction (11–14) ======================= */
  const CHAINS = [
    { id: "well", e: "🚰", t: { en: "A well in a dry village", ar: "بئر في قرية جافة" }, steps: [
      { e: "🚰", x: { en: "Ibrahim's family pays for a well in a dry village.", ar: "أسرة إبراهيم تتبرع ببئر لقرية جافة." }, ok: { en: "Villagers are trained to repair it", ar: "يتدرّب أهل القرية على صيانتها" }, bad: [{ c: { en: "Nobody is put in charge of repairs", ar: "لا يتولى أحد مسؤولية الإصلاح" }, why: { en: "Without someone to repair it, a well can break within a few years.", ar: "دون من يصلحها، قد تتعطل البئر خلال سنوات قليلة." } }] },
      { e: "⏱️", x: { en: "Clean water is close by. Girls no longer walk hours to fetch it.", ar: "صار الماء النظيف قريباً، ولم تعد البنات يمشين ساعات لجلبه." }, ok: { en: "The girls start going to school", ar: "تبدأ البنات بالذهاب إلى المدرسة" }, bad: [{ c: { en: "Nothing else changes", ar: "لا يتغير شيء آخر" }, why: { en: "Look again: hours saved every day can change what children do with their lives.", ar: "انظر مرة أخرى: الساعات التي تُوفَّر كل يوم قد تغيّر ما يفعله الأطفال في حياتهم." } }] },
      { e: "🎓", x: { en: "A generation of girls finishes school.", ar: "جيل من البنات يُنهي الدراسة." }, ok: { en: "Some become teachers and nurses in the village", ar: "بعضهن يصبحن معلمات وممرضات في القرية" }, bad: [{ c: { en: "They forget what they learned", ar: "ينسين ما تعلّمنه" }, why: { en: "Education stays with people and grows when they use it to help others.", ar: "العلم يبقى مع أصحابه وينمو حين يستعملونه في نفع غيرهم." } }] },
    ], end: { en: "Twenty years on, one well has helped a village stay healthy and learn.", ar: "بعد عشرين عاماً، ساعدت بئر واحدة قرية كاملة على الصحة والتعلّم." } },
    { id: "library", e: "📚", t: { en: "A shop given as waqf", ar: "محل موقوف" }, steps: [
      { e: "🏪", x: { en: "A grandmother gives a shop as a waqf. Its rent will pay for a small library.", ar: "جدّة توقف محلاً تجارياً، ليُنفق إيجاره على مكتبة صغيرة." }, ok: { en: "The rent goes only to the library, as she asked", ar: "يُصرف الإيجار على المكتبة وحدها كما اشترطت" }, bad: [{ c: { en: "The rent is spent on a big party", ar: "يُنفق الإيجار على حفلة كبيرة" }, why: { en: "A waqf's income should go where the giver intended.", ar: "ريع الوقف يُصرف حيث أراد الواقف." } }] },
      { e: "📖", x: { en: "Children borrow books every week.", ar: "يستعير الأطفال الكتب كل أسبوع." }, ok: { en: "A boy discovers he loves science", ar: "يكتشف صبي أنه يحب العلوم" }, bad: [{ c: { en: "The books stay on the shelves", ar: "تبقى الكتب على الرفوف" }, why: { en: "Books help only when people read them, so the library runs reading clubs.", ar: "الكتب لا تنفع إلا إذا قرأها الناس، لذلك تنظّم المكتبة نوادي قراءة." } }] },
      { e: "🛠️", x: { en: "He studies hard and becomes an engineer.", ar: "يجتهد في دراسته ويصبح مهندساً." }, ok: { en: "He designs water pumps for villages", ar: "يصمّم مضخات مياه للقرى" }, bad: [{ c: { en: "He never thinks about the library again", ar: "لا يتذكر المكتبة بعد ذلك" }, why: { en: "Many people repay what helped them by helping others in turn.", ar: "كثير من الناس يردّون الجميل بأن يساعدوا غيرهم." } }] },
    ], end: { en: "One shop's rent became books, an engineer, and clean water for other villages.", ar: "صار إيجار محل واحد كتباً، ثم مهندساً، ثم ماءً نظيفاً لقرى أخرى." } },
    { id: "word", e: "💬", t: { en: "One kind word", ar: "كلمة طيبة واحدة" }, steps: [
      { e: "💬", x: { en: "A new student is laughed at in class. You say something kind to her.", ar: "يسخر بعض الطلاب من طالبة جديدة، فتقول لها كلمة طيبة." }, ok: { en: "She feels she belongs and keeps coming", ar: "تشعر بأنها مرحَّب بها وتواظب على الحضور" }, bad: [{ c: { en: "She feels even worse", ar: "تشعر بأسوأ مما كانت" }, why: { en: "A good word is charity, and kindness usually helps.", ar: "الكلمة الطيبة صدقة، واللطف يساعد في الغالب." } }] },
      { e: "📒", x: { en: "She works hard and catches up.", ar: "تجتهد وتلحق بزملائها." }, ok: { en: "She starts a homework club", ar: "تؤسس نادياً للواجبات المدرسية" }, bad: [{ c: { en: "She keeps her notes to herself", ar: "تحتفظ بملاحظاتها لنفسها" }, why: { en: "Sharing what you know passes the kindness on.", ar: "مشاركة ما تعرفه تنقل اللطف إلى غيرك." } }] },
      { e: "🤝", x: { en: "The club helps 30 students pass their exams.", ar: "يساعد النادي 30 طالباً على النجاح." }, ok: { en: "Some of them start volunteering too", ar: "يبدأ بعضهم بالتطوع أيضاً" }, bad: [{ c: { en: "The club closes after one term", ar: "يُغلق النادي بعد فصل واحد" }, why: { en: "Good things last longer when more people help carry them.", ar: "الخير يدوم أكثر حين يشارك في حمله عدد أكبر من الناس." } }] },
    ], end: { en: "One kind sentence started a chain that helped dozens of people.", ar: "جملة طيبة واحدة بدأت سلسلة ساعدت عشرات الناس." } },
  ];
  G["chain-reaction"] = {
    title: { en: "Charity Chain Reaction", ar: "سلسلة الخير" }, icon: "🔗",
    howto: { en: "Pick a starting good deed. At each step, choose what happens next. A choice that breaks the chain shows why, and you can try again.", ar: "اختر عمل خير تبدأ به. في كل خطوة اختر ما يحدث بعد ذلك. والاختيار الذي يقطع السلسلة يبيّن لك السبب، ويمكنك أن تحاول مرة أخرى." },
    init(c) { Object.assign(c.s, { ch: null, step: 0, miss: null, misses: 0, done: [] }); return this.render(c); },
    render(c) {
      const s = c.s, ar = c.ar;
      if (!s.ch) return `${c.head()}<div class="ss-path-menu">${CHAINS.map((ch) => `<button type="button" class="ss-path-card" data-act="g" data-g="start" data-v="${ch.id}"><span class="ss-path-e">${ch.e}</span><strong>${c.T(ch.t)}</strong>${s.done.includes(ch.id) ? `<span class="ss-read-badge">✓</span>` : ""}</button>`).join("")}</div>`;
      const ch = CHAINS.find((x) => x.id === s.ch), fin = s.step >= ch.steps.length;
      const links = ch.steps.slice(0, Math.min(s.step + 1, ch.steps.length)).map((st, i) => `<div class="ss-chain-link ${i === s.step && s.miss == null ? "ss-pop-in" : ""}"><span class="ss-cln">${i + 1}.</span><span style="font-size:24px">${st.e}</span><span>${c.T(st.x)}${i < s.step ? ` <em class="ss-muted">→ ${c.T(st.ok)}</em>` : ""}</span></div>`).join("");
      if (fin) return `${c.head()}<div class="ss-chain">${links}<div class="ss-chain-link ss-chain-end"><span style="font-size:24px">🌳</span><span><strong>${c.T(ch.end)}</strong></span></div></div>
        <p class="ss-game-sub">${s.misses === 0 ? (ar ? "سلسلة كاملة من المحاولة الأولى!" : "A full chain on the first try!") : ""}</p>
        ${c.btn((ar ? "سلسلة أخرى" : "Another chain"), "menu", null, "ss-btn-ghost")} ${c.finish()}`;
      const st = ch.steps[s.step];
      const opts = pickN([{ k: "ok", c: st.ok }].concat(st.bad.map((b, i) => ({ k: "b" + i, c: b.c }))), st.bad.length + 1);
      if (!s.order || s.order.step !== s.step) s.order = { step: s.step, opts };
      return `${c.head()}<div class="ss-chain">${links}</div>
        ${s.miss != null ? `<p class="ss-hint ss-shake">💡 ${c.T(st.bad[s.miss].why)}</p>` : ""}
        <div class="ss-chain-choices">${s.order.opts.map((o) => `<button type="button" class="ss-opt" data-act="g" data-g="choose" data-v="${o.k}">${c.T(o.c)}</button>`).join("")}</div>`;
    },
    act(c, name, el) {
      const s = c.s;
      if (name === "start") { s.ch = el.getAttribute("data-v"); s.step = 0; s.miss = null; s.misses = 0; s.order = null; return c.rerender(); }
      if (name === "menu") { s.ch = null; return c.rerender(); }
      if (name === "choose") {
        const v = el.getAttribute("data-v"), ch = CHAINS.find((x) => x.id === s.ch);
        if (v === "ok") { if (s.miss == null) c.addStars(1); s.step++; s.miss = null; FX.play("ok"); if (s.step >= ch.steps.length) { c.addStars(3); FX.play("win"); FX.confetti(); if (!s.done.includes(ch.id)) s.done.push(ch.id); } }
        else { s.miss = Number(v.slice(1)); s.misses++; FX.play("no"); }
        return c.rerender();
      }
    },
  };
})();
