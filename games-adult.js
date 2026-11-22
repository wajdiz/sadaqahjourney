/* =========================================================================
   Sadaqah Stories — adult games and the project builder (EN + AR)
   Zakat Check, Who Can Receive Zakat?, Check the Charity, A Year of Giving,
   Grant Committee, and the "Design Your Charity Project" module.
   Fiqh points follow the majority positions with differences named where
   scholars differ; these are learning games, not fatwas.
   ========================================================================= */
(function () {
  const G = window.SADAQAH_GAMES, M = window.SADAQAH_MODULES;
  const pickN = (arr, n) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, n); };
  const link = (c, r) => r && r.url ? ` <a class="ss-ref" href="${r.url}" target="_blank" rel="noopener noreferrer">${c.T(r)} ↗</a>` : "";
  const REF = {
    b1426: { en: "Sahih al-Bukhari 1426", ar: "صحيح البخاري 1426", url: "https://sunnah.com/bukhari:1426" },
    b55: { en: "Sahih al-Bukhari 55", ar: "صحيح البخاري 55", url: "https://sunnah.com/bukhari:55" },
    b6464: { en: "Sahih al-Bukhari 6464", ar: "صحيح البخاري 6464", url: "https://sunnah.com/bukhari:6464" },
    q2215: { en: "Qur'an 2:215", ar: "البقرة: 215", url: "https://quran.com/2/215" },
    q2264: { en: "Qur'an 2:264", ar: "البقرة: 264", url: "https://quran.com/2/264" },
    q2567: { en: "Qur'an 25:67", ar: "الفرقان: 67", url: "https://quran.com/25/67" },
    q960: { en: "Qur'an 9:60", ar: "التوبة: 60", url: "https://quran.com/9/60" },
  };
  window.SADAQAH_REFS_ADULT = REF;
  const NOT_FATWA = { en: "This is a learning game, not a fatwa. For your own zakat, ask a scholar or zakat authority you trust.", ar: "هذه لعبة تعليمية وليست فتوى. ولحساب زكاتك اسأل عالماً أو جهة زكاة تثق بها." };

  /* ======================= Zakat Check (adults) ======================= */
  const WHY = {
    cash: { en: "Cash counts toward zakat.", ar: "النقد يدخل في حساب الزكاة." },
    savings: { en: "Savings held for a full lunar year count.", ar: "المدخرات التي حال عليها الحول تدخل في الحساب." },
    home: { en: "The home you live in is for personal use, so it does not count.", ar: "البيت الذي تسكنه للاستعمال الشخصي، فلا يدخل في الحساب." },
    car: { en: "A car you use yourself does not count.", ar: "السيارة التي تستعملها بنفسك لا تدخل في الحساب." },
    debt: { en: "Many zakat bodies let you subtract debts that are due now, such as this month's bills. Scholars differ on debts, so check with a scholar you trust.", ar: "تسمح كثير من جهات الزكاة بخصم الديون الحالّة الآن، كفواتير هذا الشهر. ويختلف العلماء في الديون، فاسأل عالماً تثق به." },
    stock: { en: "Goods held for sale count, at their market value on your zakat date.", ar: "البضائع المعدّة للبيع تدخل في الحساب بقيمتها السوقية يوم وجوب الزكاة." },
    biz: { en: "Money in the business counts like any other cash.", ar: "مال التجارة في الحساب يدخل كسائر النقد." },
    fixed: { en: "Buildings and equipment used to run the business do not count; the goods for sale do.", ar: "المباني والمعدات المستعملة في تشغيل التجارة لا تدخل في الحساب، أما البضائع المعدّة للبيع فتدخل." },
    jewel: { en: "Scholars differ. The Hanafi school counts gold jewellery that is worn; the Maliki, Shafi'i and Hanbali schools do not count jewellery worn for personal use. This round follows the view you chose.", ar: "يختلف العلماء: يرى المذهب الحنفي وجوب الزكاة في الحلي الذهبي الملبوس، ولا يراها المالكية والشافعية والحنابلة في الحلي المعدّ للاستعمال الشخصي. وتتبع هذه الجولة الرأي الذي اخترته." },
    coins: { en: "Gold kept as savings counts in every school.", ar: "الذهب المدّخر يدخل في الحساب عند جميع المذاهب." },
    rental: { en: "In the common view, a property you rent out does not count itself; the rent you save does.", ar: "في الرأي الشائع لا يدخل العقار المؤجَّر نفسه في الحساب، وإنما يدخل الإيجار المدّخر." },
    rent: { en: "Rent you have saved counts like other savings.", ar: "الإيجار المدّخر يدخل كسائر المدخرات." },
  };
  const HOUSES = [
    { e: "👩", n: { en: "Mariam, a teacher", ar: "مريم، معلّمة" }, items: [
      { t: { en: "Cash at home", ar: "نقد في البيت" }, amt: 1500, k: "count", w: "cash" },
      { t: { en: "Savings account, held all year", ar: "حساب توفير حال عليه الحول" }, amt: 14000, k: "count", w: "savings" },
      { t: { en: "The flat she lives in", ar: "الشقة التي تسكنها" }, amt: 180000, k: "no", w: "home" },
      { t: { en: "Her car", ar: "سيارتها" }, amt: 12000, k: "no", w: "car" },
      { t: { en: "Bills due this month", ar: "فواتير مستحقة هذا الشهر" }, amt: 1000, k: "debt", w: "debt" },
    ] },
    { e: "🧔", n: { en: "Yusuf, a shop owner", ar: "يوسف، صاحب متجر" }, items: [
      { t: { en: "Goods in his shop, for sale", ar: "البضائع المعروضة للبيع في متجره" }, amt: 30000, k: "count", w: "stock" },
      { t: { en: "Money in the business account", ar: "مال في حساب التجارة" }, amt: 6500, k: "count", w: "biz" },
      { t: { en: "The shop building he owns and works in", ar: "مبنى المتجر الذي يملكه ويعمل فيه" }, amt: 150000, k: "no", w: "fixed" },
      { t: { en: "Shelves, tills and fridges", ar: "الرفوف وآلات الدفع والثلاجات" }, amt: 4000, k: "no", w: "fixed" },
      { t: { en: "Supplier bill due this month", ar: "فاتورة مورّد مستحقة هذا الشهر" }, amt: 2500, k: "debt", w: "debt" },
    ] },
    { e: "👵", n: { en: "Huda, a retired nurse", ar: "هدى، ممرضة متقاعدة" }, items: [
      { t: { en: "Gold jewellery she wears", ar: "حلي ذهبية تلبسها" }, g: 100, k: "jewel", w: "jewel" },
      { t: { en: "Gold coins kept as savings", ar: "عملات ذهبية مدّخرة" }, g: 40, k: "count", w: "coins" },
      { t: { en: "Savings account", ar: "حساب توفير" }, amt: 5000, k: "count", w: "savings" },
      { t: { en: "A flat she rents out", ar: "شقة تؤجّرها" }, amt: 250000, k: "no", w: "rental" },
      { t: { en: "Rent she has saved this year", ar: "إيجار ادّخرته هذه السنة" }, amt: 9000, k: "count", w: "rent" },
    ] },
  ];
  function zm(c, n) { const v = Math.round(n * 100) / 100, str = v % 1 ? v.toFixed(2) : v.toLocaleString("en-US"); return c.ar ? str + " دولار" : "$" + str; }
  function zkValue(s, it) { return it.g ? it.g * s.gp : it.amt; }
  function zkRight(s, it) { if (it.k === "jewel") return s.jview === "hanafi" ? "yes" : "no"; return it.k === "count" ? "yes" : it.k === "debt" ? "sub" : "no"; }
  function zkCalc(s, h) {
    let total = 0, all = 0;
    h.items.forEach((it) => { const v = zkValue(s, it), r = zkRight(s, it); all += it.k === "debt" ? 0 : v; if (r === "yes") total += v; if (r === "sub") total -= v; });
    const nisab = s.basis === "gold" ? 85 * s.gp : 595 * s.sp;
    return { total, all, nisab, due: total >= nisab ? total * 0.025 : 0 };
  }
  G["zakat-check"] = {
    title: { en: "Zakat Check", ar: "احسب الزكاة" }, icon: "🧮",
    howto: { en: "Choose your nisab and example prices, then for each household decide what counts toward zakat. Then pick the amount of zakat due.", ar: "اختر النصاب والأسعار التقريبية، ثم حدّد لكل أسرة ما يدخل في حساب الزكاة، ثم اختر مقدار الزكاة الواجبة." },
    sketch: `<rect x="10" y="8" width="30" height="44" rx="4" fill="#2f8f87"/><rect x="14" y="12" width="22" height="9" rx="1" fill="#fff"/><text x="25" y="19" text-anchor="middle" font-size="7" fill="#1f6b64">2.5%</text><circle cx="18" cy="30" r="3" fill="#fff"/><circle cx="25" cy="30" r="3" fill="#fff"/><circle cx="32" cy="30" r="3" fill="#e8a23a"/><circle cx="18" cy="40" r="3" fill="#fff"/><circle cx="25" cy="40" r="3" fill="#fff"/><circle cx="32" cy="40" r="3" fill="#fff"/><circle cx="78" cy="34" r="16" fill="#c79a3a" class="ss-anim-float"/><circle cx="78" cy="34" r="11" fill="none" stroke="#fff" stroke-width="1.5"/><text x="78" y="38" text-anchor="middle" font-size="10" fill="#fff">85g</text>`,
    init(c) { Object.assign(c.s, { view: "setup", basis: "gold", gp: 200, sp: 4, jview: "majority", h: 0, marks: {}, ans: null, opts: null, right: 0, total: 0 }); return this.render(c); },
    render(c) {
      const s = c.s, ar = c.ar;
      if (s.view === "setup") {
        const seg = (g, v, cur, label) => `<button type="button" class="ss-seg ${cur === v ? "selected" : ""}" data-act="g" data-g="${g}" data-v="${v}">${label}</button>`;
        return `${c.head()}
          <div class="ss-zk-setup">
            <h5>${ar ? "1. النصاب" : "1. Nisab"}</h5>
            <p class="ss-muted">${ar ? "النصاب هو أقل مقدار تجب فيه الزكاة: قيمة 85 غراماً من الذهب أو 595 غراماً من الفضة. ويختلف العلماء في أيهما يُعتمد اليوم، لأن قيمتيهما صارتا متباعدتين جداً." : "The nisab is the minimum before zakat is due: the value of 85 g of gold or 595 g of silver. Scholars differ on which to use today, because the two are now very different in value."}</p>
            <div class="ss-segments">${seg("basis", "gold", s.basis, ar ? "الذهب (85 غ)" : "Gold (85 g)")}${seg("basis", "silver", s.basis, ar ? "الفضة (595 غ)" : "Silver (595 g)")}</div>
            <h5>${ar ? "2. الأسعار" : "2. Prices"}</h5>
            <label class="ss-sa-row"><span class="ss-sa-l">${ar ? "سعر غرام الذهب" : "Gold, per gram"}: <strong id="zk-gp">${c.money(s.gp)}</strong></span><input type="range" min="50" max="400" step="5" value="${s.gp}" data-g-input="gp"></label>
            <label class="ss-sa-row"><span class="ss-sa-l">${ar ? "سعر غرام الفضة" : "Silver, per gram"}: <strong id="zk-sp">${ar ? s.sp + " دولار" : "$" + s.sp}</strong></span><input type="range" min="1" max="10" step="0.5" value="${s.sp}" data-g-input="sp"></label>
            <p class="ss-muted">${ar ? "أسعار تقريبية للتعلّم. غيّرها إلى أسعار اليوم." : "Example prices for learning. Change them to today's prices."} ${ar ? "النصاب الآن" : "Nisab now"}: <strong id="zk-nisab">${c.money(s.basis === "gold" ? 85 * s.gp : 595 * s.sp)}</strong></p>
            <h5>${ar ? "3. الحلي الذهبية الملبوسة" : "3. Gold jewellery that is worn"}</h5>
            <div class="ss-segments">${seg("jview", "majority", s.jview, ar ? "لا تُحسب (المالكية والشافعية والحنابلة)" : "Don't count it (Maliki, Shafi'i, Hanbali)")}${seg("jview", "hanafi", s.jview, ar ? "تُحسب (الحنفية)" : "Count it (Hanafi)")}</div>
            <p class="ss-rate-note">${ar ? "افترض أن كل مبلغ حال عليه حول قمري كامل (نحو 354 يوماً)." : "Assume every amount has been held for a full lunar year (about 354 days)."} ${c.T(NOT_FATWA)}</p>
            ${c.btn((ar ? "ابدأ" : "Start") + " " + c.fwd(), "start")}
          </div>`;
      }
      if (s.view === "done") {
        const pct = Math.round(100 * s.right / s.total);
        return `${c.head()}<h4>${ar ? `أصبت في ${s.right} من ${s.total} (${pct}%)` : `You got ${s.right} of ${s.total} right (${pct}%)`}</h4>
          <div class="ss-summary"><h4>${ar ? "خلاصة" : "In short"}</h4><ul>
            <li>${ar ? "تدخل في الحساب: النقد، والمدخرات، وبضائع التجارة، والذهب المدّخر، والإيجار المدّخر." : "Counts: cash, savings, goods for sale, gold kept as savings, saved rent."}</li>
            <li>${ar ? "لا تدخل: البيت الذي تسكنه، والسيارة، ومباني التجارة ومعداتها، والعقار المؤجَّر نفسه." : "Does not count: your home, your car, business buildings and equipment, a rented-out property itself."}</li>
            <li>${ar ? "يختلف العلماء في: الحلي الملبوسة، وخصم الديون، واختيار نصاب الذهب أو الفضة." : "Scholars differ on: worn jewellery, subtracting debts, and whether to use the gold or silver nisab."}</li>
            <li>${ar ? "إذا بلغ المال النصاب وحال عليه الحول، فالزكاة 2.5%." : "If wealth reaches the nisab and is held for a lunar year, zakat is 2.5%."}</li></ul></div>
          <p class="ss-rate-note">${c.T(NOT_FATWA)}</p>
          ${c.btn("↻ " + c.t("nav.restart"), "restart", null, "ss-btn-ghost")} ${c.finish()}`;
      }
      const h = HOUSES[s.h], checked = s.view !== "sort";
      const rows = h.items.map((it, i) => {
        const v = zkValue(s, it), mk = s.marks[i], right = zkRight(s, it);
        const opts = it.k === "debt" ? [["sub", ar ? "اخصمه" : "Subtract it"], ["no", ar ? "تجاهله" : "Ignore it"]] : [["yes", ar ? "يُحسب" : "Counts"], ["no", ar ? "لا يُحسب" : "Doesn't count"]];
        return `<div class="ss-zk-item ${checked ? (mk === right ? "ok" : "no") : ""}">
          <div class="ss-zk-t"><strong>${c.T(it.t)}</strong> <span class="ss-muted">${it.g ? `${it.g} ${ar ? "غ" : "g"} ≈ ${c.money(v)}` : c.money(v)}</span></div>
          <div class="ss-segments">${opts.map(([val, lab]) => `<button type="button" class="ss-seg ${mk === val ? "selected" : ""}" data-act="g" data-g="mark" data-v="${i}:${val}" ${checked ? "disabled" : ""}>${lab}</button>`).join("")}</div>
          ${checked ? `<p class="ss-zk-why">${mk === right ? "✓" : "✗"} ${c.T(WHY[it.w])}</p>` : ""}
        </div>`;
      }).join("");
      let below = "";
      if (s.view === "sort") below = c.btn((ar ? "تحقّق" : "Check") + " " + c.fwd(), "check");
      else {
        const z = zkCalc(s, h);
        below = `<div class="ss-zk-calc">
          <div>${ar ? "المال الذي تجب فيه الزكاة بعد الخصم" : "Zakatable wealth after subtracting"}: <strong>${c.money(z.total)}</strong></div>
          <div>${ar ? "النصاب" : "Nisab"} (${s.basis === "gold" ? (ar ? "ذهب" : "gold") : (ar ? "فضة" : "silver")}): <strong>${c.money(z.nisab)}</strong> → ${z.total >= z.nisab ? (ar ? "بلغ النصاب" : "above the nisab") : (ar ? "لم يبلغ النصاب" : "below the nisab")}</div>
          <h5>${ar ? `كم زكاة ${h.n.ar.split("،")[0]}؟` : `How much zakat does ${h.n.en.split(",")[0]} owe?`}</h5>
          <div class="ss-segments">${s.opts.map((o) => `<button type="button" class="ss-seg ${s.ans === o ? (Math.abs(o - z.due) < 0.01 ? "right" : "wrong") : (s.ans != null && Math.abs(o - z.due) < 0.01 ? "right" : "")}" data-act="g" data-g="ans" data-v="${o}" ${s.ans != null ? "disabled" : ""}>${zm(c, o)}</button>`).join("")}</div>
          ${s.ans != null ? `<p class="ss-zk-why">${Math.abs(s.ans - z.due) < 0.01 ? "✓ " : "✗ "}${z.due ? (ar ? `2.5% من ${c.money(z.total)} = ${zm(c, z.due)}.` : `2.5% of ${c.money(z.total)} = ${zm(c, z.due)}.`) : (ar ? "المال دون النصاب، فلا زكاة هذه السنة." : "The wealth is below the nisab, so no zakat is due this year.")}${h.items.some((x) => x.k === "jewel") ? " " + (ar ? "جرّب الجولة مرة أخرى برأي آخر في الحلي لترى الفرق." : "Try the other jewellery view to see the difference.") : ""}${s.h === 0 ? " " + (ar ? "لاحظ كيف يغيّر اختيار نصاب الذهب أو الفضة النتيجة هنا." : "Notice how the gold or silver nisab changes the answer here.") : ""}</p>${c.btn((s.h < HOUSES.length - 1 ? (ar ? "الأسرة التالية" : "Next household") : (ar ? "النتيجة" : "See result")) + " " + c.fwd(), "next")}` : ""}
        </div>`;
      }
      return `${c.head()}<p class="ss-game-sub">${h.e} ${c.T(h.n)} · ${s.h + 1}/${HOUSES.length}</p><div class="ss-zk-list">${rows}</div>${below}`;
    },
    input(c, name, el) {
      const s = c.s; s[name] = Number(el.value);
      const g = document.getElementById("zk-gp"), sp = document.getElementById("zk-sp"), n = document.getElementById("zk-nisab");
      if (g) g.textContent = c.money(s.gp); if (sp) sp.textContent = c.ar ? s.sp + " دولار" : "$" + s.sp;
      if (n) n.textContent = c.money(s.basis === "gold" ? 85 * s.gp : 595 * s.sp);
    },
    act(c, name, el) {
      const s = c.s, v = el.getAttribute("data-v");
      if (name === "restart") { this.init(c); return c.rerender(); }
      if (name === "basis" || name === "jview") { s[name] = v; return c.rerender(); }
      if (name === "start") { s.view = "sort"; s.h = 0; s.marks = {}; s.right = 0; s.total = 0; return c.rerender(); }
      if (name === "mark") { const [i, val] = v.split(":"); s.marks[i] = val; return c.rerender(); }
      if (name === "check") {
        const h = HOUSES[s.h];
        if (Object.keys(s.marks).length < h.items.length) { c.toast(c.ar ? "اختر لكل بند أولاً" : "Choose for every item first"); return; }
        h.items.forEach((it, i) => { s.total++; if (s.marks[i] === zkRight(s, it)) { s.right++; c.addStars(1); } });
        // Options: the right amount, 2.5% of everything listed (home and car included),
        // and either 2.5% ignoring the nisab or 2.5% without subtracting debts; 10% as a fallback.
        const z = zkCalc(s, h), debts = h.items.filter((x) => x.k === "debt").reduce((a, x) => a + x.amt, 0);
        const cand = [z.due, z.all * 0.025, z.due === 0 ? z.total * 0.025 : (z.total + debts) * 0.025, z.total * 0.1];
        const set = cand.filter((x, i, a) => a.findIndex((y) => Math.abs(y - x) < 0.01) === i).slice(0, 3);
        s.opts = pickN(set, set.length); s.ans = null; s.view = "check";
        return c.rerender();
      }
      if (name === "ans") { s.ans = Number(v); s.total++; const z = zkCalc(s, HOUSES[s.h]); if (Math.abs(s.ans - z.due) < 0.01) { s.right++; c.addStars(2); } return c.rerender(); }
      if (name === "next") {
        if (s.h >= HOUSES.length - 1) { s.view = "done"; if (s.right / s.total >= 0.8) c.awardBadge("zakatpro"); }
        else { s.h++; s.marks = {}; s.view = "sort"; }
        return c.rerender();
      }
    },
  };

  /* ======================= Who Can Receive Zakat? (adults) ======================= */
  const CASES = [
    { t: { en: "Your mother, who has no income and whom you support.", ar: "أمك التي لا دخل لها وتنفق عليها." }, ok: ["no"], why: { en: "Scholars agree you cannot give your zakat to parents or children you are obliged to support. Support them from your own money, which is itself rewarded.", ar: "اتفق العلماء على أنك لا تعطي زكاتك لوالديك أو أولادك الذين تجب عليك نفقتهم. بل تنفق عليهم من مالك، وفي ذلك أجر أيضاً." } },
    { t: { en: "Your brother, who is poor and whom you are not obliged to support.", ar: "أخوك الفقير الذي لا تجب عليك نفقته." }, ok: ["yes"], why: { en: "Relatives other than parents, children and spouse can receive your zakat if they are eligible, and many scholars say they should come first.", ar: "يجوز إعطاء الزكاة للأقارب غير الوالدين والأولاد والزوج إذا كانوا من المستحقين، ويرى كثير من العلماء أنهم أولى من غيرهم." } },
    { t: { en: "A wealthy businessman whose wallet was stolen abroad and who cannot get home.", ar: "رجل أعمال غني سُرقت محفظته في الخارج ولا يستطيع العودة." }, ok: ["yes"], why: { en: "A traveller stranded without money is one of the eight groups, even if he is rich back home.", ar: "ابن السبيل الذي انقطع به الطريق صنف من الأصناف الثمانية، ولو كان غنياً في بلده." } },
    { t: { en: "A committee building a new mosque.", ar: "لجنة تبني مسجداً جديداً." }, ok: ["no", "differ"], why: { en: "Most scholars say no, because the eight groups are mainly people in need; a few scholars allow it. Mosques can be funded from other charity.", ar: "يرى أكثر العلماء أن ذلك لا يجوز، لأن الأصناف الثمانية في الغالب أشخاص محتاجون، ويجيزه قليل من العلماء. ويمكن تمويل المساجد من الصدقات الأخرى." } },
    { t: { en: "A worker paid to collect and hand out zakat.", ar: "موظف يُدفع له أجر لجمع الزكاة وتوزيعها." }, ok: ["yes"], why: { en: "People who collect and distribute zakat can be paid from it for their work, even if they are not poor.", ar: "العاملون على الزكاة يُعطون منها أجر عملهم، ولو لم يكونوا فقراء." } },
    { t: { en: "A woman who wants to give her zakat to her husband, who is poor.", ar: "امرأة تريد أن تعطي زكاتها لزوجها الفقير." }, ok: ["differ", "yes"], why: { en: "Scholars differ. Some allow it because a wife is not obliged to support her husband; others do not. Follow the scholars you trust.", ar: "يختلف العلماء: بعضهم يجيزه لأن الزوجة لا تجب عليها نفقة زوجها، وبعضهم لا يجيزه. اتّبع العلماء الذين تثق بهم." } },
    { t: { en: "A man who wants to give his zakat to his wife.", ar: "رجل يريد أن يعطي زكاته لزوجته." }, ok: ["no"], why: { en: "A husband must support his wife, so he cannot pay her from his zakat.", ar: "نفقة الزوجة واجبة على زوجها، فلا يعطيها من زكاته." } },
    { t: { en: "A father in debt after paying for his child's urgent surgery.", ar: "أب عليه دين بعد أن دفع تكاليف عملية عاجلة لطفله." }, ok: ["yes"], why: { en: "People who cannot repay debts taken for lawful needs are one of the eight groups.", ar: "العاجزون عن سداد ديون استدانوها لحاجات مباحة صنف من الأصناف الثمانية." } },
    { t: { en: "A licensed charity that collects zakat to buy food parcels for poor families.", ar: "جمعية خيرية مرخّصة تجمع الزكاة لشراء طرود غذائية للأسر الفقيرة." }, ok: ["yes"], why: { en: "A trusted charity can collect your zakat and pass it to eligible people on your behalf. Check that it is licensed to collect zakat.", ar: "يمكن للجمعية الموثوقة أن تجمع زكاتك وتوصلها إلى مستحقيها نيابة عنك. تأكّد من أنها مرخّصة لجمع الزكاة." } },
    { t: { en: "A healthy man who earns enough for his family but asks for zakat anyway.", ar: "رجل صحيح يكسب ما يكفي أسرته لكنه يطلب الزكاة." }, ok: ["no"], why: { en: "Zakat is for people in need. Scholars say someone who earns enough for his needs should not take it.", ar: "الزكاة للمحتاجين، ويقرر العلماء أن من يكسب ما يكفي حاجته لا يأخذ منها." } },
    { t: { en: "Your poor neighbour, who is not Muslim.", ar: "جارك الفقير غير المسلم." }, ok: ["no", "differ"], why: { en: "Most scholars say zakat on wealth goes to Muslims, except the group 'whose hearts are brought closer'. Your neighbour can always be helped with sadaqah, which has no such limit.", ar: "يرى أكثر العلماء أن زكاة المال تُعطى للمسلمين، إلا صنف «المؤلّفة قلوبهم». ويمكنك دائماً مساعدة جارك من الصدقة التي لا يُشترط فيها ذلك." } },
    { t: { en: "A poor student who cannot pay for food and books.", ar: "طالب فقير لا يستطيع دفع ثمن طعامه وكتبه." }, ok: ["yes"], why: { en: "A poor student can receive zakat as one of the poor or needy.", ar: "الطالب الفقير يُعطى من الزكاة بوصفه فقيراً أو مسكيناً." } },
  ];
  const VERD = { yes: { en: "Can receive zakat", ar: "يُعطى من الزكاة" }, no: { en: "Cannot", ar: "لا يُعطى" }, differ: { en: "Scholars differ", ar: "اختلف العلماء" } };
  G["zakat-cases"] = {
    title: { en: "Who Can Receive Zakat?", ar: "من يستحق الزكاة؟" }, icon: "🧭",
    howto: { en: "Ten real-life cases. Decide whether the person or cause can receive your zakat, cannot, or whether scholars differ. Each answer explains the ruling.", ar: "عشر حالات من الواقع. قرّر هل يُعطى صاحب الحالة من زكاتك، أو لا يُعطى، أو أن العلماء اختلفوا فيها. وكل إجابة تشرح الحكم." },
    sketch: `<circle cx="30" cy="30" r="20" fill="#e8d5a8" stroke="#c79a3a" stroke-width="2"/><path d="M30 14 l4 16 -4 16 -4 -16z" fill="#c66b6b" class="ss-anim-tilt"/><circle cx="30" cy="30" r="3" fill="#6b5a48"/><rect x="62" y="12" width="48" height="10" rx="3" fill="#5b8c4f"/><rect x="62" y="26" width="48" height="10" rx="3" fill="#c66b6b"/><rect x="62" y="40" width="48" height="10" rx="3" fill="#c79a3a"/>`,
    init(c) { Object.assign(c.s, { cases: pickN(CASES, 10), i: 0, pick: null, right: 0, log: [] }); return this.render(c); },
    render(c) {
      const s = c.s, ar = c.ar;
      if (s.i >= s.cases.length) {
        return `${c.head()}<h4>${ar ? `أصبت في ${s.right} من ${s.cases.length}` : `You got ${s.right} of ${s.cases.length} right`}</h4>
          <div class="ss-summary"><ul>${s.log.map((l) => `<li class="${l.ok ? "ok" : "no"}">${l.ok ? "✓" : "✗"} ${c.T(l.cs.t)} <em>${l.cs.ok.map((k) => c.T(VERD[k])).join(ar ? " / " : " / ")}</em></li>`).join("")}</ul></div>
          <p class="ss-muted">${ar ? "الأصناف الثمانية في" : "The eight groups are listed in"}${link(c, REF.q960)}</p>
          <p class="ss-rate-note">${c.T(NOT_FATWA)}</p>
          ${c.btn("↻ " + c.t("nav.restart"), "restart", null, "ss-btn-ghost")} ${c.finish()}`;
      }
      const cs = s.cases[s.i];
      return `${c.head()}<p class="ss-game-sub">${s.i + 1}/${s.cases.length} · ✓ ${s.right}</p>
        <div class="ss-zchar">${c.T(cs.t)}</div>
        <div class="ss-verdicts">${Object.keys(VERD).map((k) => `<button type="button" class="ss-choice ${s.pick == null ? "" : cs.ok.includes(k) ? "right" : k === s.pick ? "wrong" : ""}" data-act="g" data-g="pick" data-v="${k}" ${s.pick != null ? "disabled" : ""}>${c.T(VERD[k])}</button>`).join("")}</div>
        ${s.pick != null ? `<div class="ss-lesson"><span class="ss-lesson-e">${cs.ok.includes(s.pick) ? "✅" : "💡"}</span><div><strong>${cs.ok.includes(s.pick) ? (ar ? "صحيح" : "Correct") : (ar ? "الإجابة: " : "Answer: ") + cs.ok.map((k) => c.T(VERD[k])).join(" / ")}</strong><p>${c.T(cs.why)}</p></div></div>${c.btn((ar ? "التالي" : "Next") + " " + c.fwd(), "next")}` : ""}`;
    },
    act(c, name, el) {
      const s = c.s;
      if (name === "restart") { this.init(c); return c.rerender(); }
      if (name === "pick" && s.pick == null) { s.pick = el.getAttribute("data-v"); const cs = s.cases[s.i], ok = cs.ok.includes(s.pick); if (ok) { s.right++; c.addStars(1); } s.log.push({ cs, ok }); return c.rerender(); }
      if (name === "next") { s.i++; s.pick = null; if (s.i >= s.cases.length && s.right >= 8) c.awardBadge("zakat"); return c.rerender(); }
    },
  };

  /* ======================= Check the Charity (15–18, adults) ======================= */
  const APPEALS = [
    { e: "🚰", n: { en: "Bright Wells Foundation (fictional)", ar: "مؤسسة الآبار المشرقة (اسم خيالي)" }, sig: [
      [1, { en: "A licence number you can look up", ar: "رقم ترخيص يمكنك التحقق منه" }], [1, { en: "Publishes yearly reports and audited accounts", ar: "تنشر تقارير سنوية وحسابات مدققة" }],
      [1, { en: "Shows what each well costs and where it is", ar: "تبيّن تكلفة كل بئر ومكانها" }], [1, { en: "Office address and phone number", ar: "عنوان مكتب ورقم هاتف" }] ],
      ok: ["give"], why: { en: "Every sign is good. A licence you can check, reports and clear costs are what you want to see.", ar: "كل العلامات جيدة. الترخيص الذي يمكن التحقق منه والتقارير والتكاليف الواضحة هي ما تبحث عنه." } },
    { e: "📱", n: { en: "\"URGENT!! Children will die tonight\" (a forwarded message)", ar: "«عاجل!! أطفال سيموتون الليلة» (رسالة معاد توجيهها)" }, sig: [
      [0, { en: "Forwarded from a number you don't know", ar: "مرسلة من رقم لا تعرفه" }], [0, { en: "\"Donate in the next 10 minutes\"", ar: "«تبرّع خلال 10 دقائق»" }],
      [0, { en: "Asks for gift cards or crypto only", ar: "تطلب بطاقات هدايا أو عملات رقمية فقط" }], [0, { en: "No name, website or licence", ar: "لا اسم ولا موقع ولا ترخيص" }] ],
      ok: ["no"], why: { en: "Pressure, no identity and payments that can't be traced are classic signs of a scam. Give to a licensed charity responding to the same crisis instead.", ar: "الضغط وغياب الهوية وطرق الدفع التي لا يمكن تتبعها علامات معروفة للاحتيال. تبرّع بدلاً من ذلك لجمعية مرخّصة تستجيب للأزمة نفسها." } },
    { e: "🌐", n: { en: "Hope Hands International (fictional)", ar: "أيادي الأمل الدولية (اسم خيالي)" }, sig: [
      [1, { en: "A polished website with moving photos", ar: "موقع أنيق بصور مؤثرة" }], [0, { en: "No licence number, and you can't find one", ar: "لا رقم ترخيص، ولا تستطيع العثور عليه" }],
      [0, { en: "\"100% of every donation reaches the field\", but no reports", ar: "«100% من كل تبرع يصل إلى الميدان»، لكن بلا تقارير" }], [0, { en: "No address", ar: "لا عنوان" }] ],
      ok: ["ask", "no"], why: { en: "A nice website is not proof. Ask for the licence and latest report before giving; if they can't show them, give elsewhere.", ar: "الموقع الجميل ليس دليلاً. اطلب الترخيص وأحدث تقرير قبل أن تتبرع، فإن لم يُظهروهما فتبرّع لجهة أخرى." } },
    { e: "🕌", n: { en: "Iftar volunteers at your local mosque", ar: "متطوعو الإفطار في مسجد حيّك" }, sig: [
      [1, { en: "Run through a mosque you know", ar: "يعملون عبر مسجد تعرفه" }], [1, { en: "Collect food, not cash", ar: "يجمعون الطعام لا النقود" }],
      [1, { en: "The imam can tell you who is in charge", ar: "يستطيع الإمام أن يخبرك بالمسؤول" }], [0, { en: "Not a registered charity", ar: "ليسوا جمعية مسجلة" }] ],
      ok: ["give", "ask"], why: { en: "Giving food through a mosque you know is low risk. For cash, ask who is responsible and whether the collection is approved.", ar: "التبرع بالطعام عبر مسجد تعرفه قليل المخاطر. أما النقد فاسأل عن المسؤول وهل الجمع معتمد." } },
    { e: "🚪", n: { en: "A man at your door collecting for a sick child", ar: "رجل عند بابك يجمع لطفل مريض" }, sig: [
      [0, { en: "No papers or contact details", ar: "لا أوراق ولا وسيلة تواصل" }], [0, { en: "Wants cash only", ar: "يريد نقداً فقط" }], [0, { en: "Can't say which hospital", ar: "لا يستطيع أن يذكر اسم المستشفى" }] ],
      ok: ["ask", "no"], why: { en: "You can't check where the money goes. If you want to help, offer to pay a bill directly or point him to a licensed charity.", ar: "لا تستطيع التحقق من وجهة المال. إن أردت المساعدة فاعرض أن تدفع فاتورة مباشرة، أو دلّه على جمعية مرخّصة." } },
    { e: "🏫", n: { en: "Green Valley School Waqf (fictional)", ar: "وقف مدرسة الوادي الأخضر (اسم خيالي)" }, sig: [
      [1, { en: "Licensed", ar: "مرخّص" }], [1, { en: "Audited accounts every year", ar: "حسابات مدققة كل سنة" }],
      [1, { en: "Explains that 8% goes on running costs", ar: "يوضّح أن 8% تذهب إلى تكاليف التشغيل" }], [1, { en: "Shows how the waqf income is spent", ar: "يبيّن كيف يُنفق ريع الوقف" }] ],
      ok: ["give"], why: { en: "Being open about running costs is a good sign. Every charity has some costs; what matters is whether they are reasonable and explained.", ar: "الوضوح في تكاليف التشغيل علامة جيدة. فكل جمعية لها تكاليف، والمهم أن تكون معقولة ومشروحة." } },
    { e: "🔥", n: { en: "An online fundraiser for a family after a house fire", ar: "حملة تبرع إلكترونية لأسرة بعد حريق منزلها" }, sig: [
      [1, { en: "Started by a named friend of the family", ar: "أطلقها صديق للأسرة باسمه الصريح" }], [1, { en: "Posts updates with receipts", ar: "تنشر تحديثات مع الإيصالات" }],
      [0, { en: "Not a charity, so no licence or audit", ar: "ليست جمعية، فلا ترخيص ولا تدقيق" }] ],
      ok: ["ask", "give"], why: { en: "Personal fundraisers can be genuine, but no one checks them. Ask the organiser how the money will be used, or check that the platform verifies fundraisers.", ar: "الحملات الشخصية قد تكون صادقة، لكن لا أحد يراقبها. اسأل المنظّم كيف سيُستخدم المال، أو تأكّد من أن المنصة تتحقق من الحملات." } },
  ];
  const CV = { give: { en: "Give", ar: "تبرّع" }, ask: { en: "Ask questions first", ar: "اسأل أولاً" }, no: { en: "Don't give", ar: "لا تتبرّع" } };
  G["charity-check"] = {
    title: { en: "Check the Charity", ar: "تحقّق من الجمعية" }, icon: "🔍",
    howto: { en: "Seven appeals ask for your money. Read the signs and decide: give, ask questions first, or don't give. All names are made up.", ar: "سبعة نداءات تطلب مالك. اقرأ العلامات وقرّر: تبرّع، أو اسأل أولاً، أو لا تتبرّع. كل الأسماء خيالية." },
    sketch: `<circle cx="44" cy="28" r="16" fill="none" stroke="#2f8f87" stroke-width="5"/><line x1="56" y1="40" x2="72" y2="54" stroke="#2f8f87" stroke-width="6" stroke-linecap="round"/><path d="M36 28 l6 6 10-12" fill="none" stroke="#5b8c4f" stroke-width="3" class="ss-anim-glow"/><rect x="82" y="12" width="30" height="40" rx="3" fill="#e8d5a8" stroke="#c79a3a"/><line x1="87" y1="22" x2="107" y2="22" stroke="#c79a3a"/><line x1="87" y1="30" x2="107" y2="30" stroke="#c79a3a"/><line x1="87" y1="38" x2="100" y2="38" stroke="#c79a3a"/>`,
    init(c) { Object.assign(c.s, { list: pickN(APPEALS, APPEALS.length), i: 0, pick: null, right: 0 }); return this.render(c); },
    render(c) {
      const s = c.s, ar = c.ar;
      if (s.i >= s.list.length) {
        return `${c.head()}<h4>${ar ? `أصبت في ${s.right} من ${s.list.length}` : `You got ${s.right} of ${s.list.length} right`}</h4>
          <div class="ss-summary"><h4>${ar ? "قبل أن تتبرّع، تحقّق من" : "Before you give, check for"}</h4><ul>
            <li>✓ ${ar ? "ترخيص يمكنك التحقق منه. وفي قطر تتولى هيئة تنظيم الأعمال الخيرية ترخيص الجمعيات والإشراف عليها." : "A licence you can check. In Qatar, charities are licensed and supervised by the Regulatory Authority for Charitable Activities (RACA)."}</li>
            <li>✓ ${ar ? "تقارير سنوية وتكاليف واضحة" : "Yearly reports and clear costs"}</li><li>✓ ${ar ? "عنوان ووسيلة تواصل حقيقية" : "A real address and contact details"}</li>
            <li>✗ ${ar ? "الضغط والاستعجال" : "Pressure and rushing"}</li><li>✗ ${ar ? "الدفع ببطاقات هدايا أو عملات رقمية فقط، أو إلى حساب شخصي" : "Payment by gift cards or crypto only, or into a personal account"}</li>
            <li>✗ ${ar ? "صور المحتاجين دون احترام لكرامتهم" : "Photos of people in need that don't respect their dignity"}</li></ul></div>
          ${c.btn("↻ " + c.t("nav.restart"), "restart", null, "ss-btn-ghost")} ${c.finish()}`;
      }
      const a = s.list[s.i];
      return `${c.head()}<p class="ss-game-sub">${s.i + 1}/${s.list.length} · ✓ ${s.right}</p>
        <div class="ss-appeal"><h4>${a.e} ${c.T(a.n)}</h4><ul class="ss-signals">${a.sig.map(([good, t]) => `<li class="${s.pick != null ? (good ? "good" : "bad") : ""}">${s.pick != null ? (good ? "✓ " : "✗ ") : "• "}${c.T(t)}</li>`).join("")}</ul></div>
        <div class="ss-verdicts">${Object.keys(CV).map((k) => `<button type="button" class="ss-choice ${s.pick == null ? "" : a.ok.includes(k) ? "right" : k === s.pick ? "wrong" : ""}" data-act="g" data-g="pick" data-v="${k}" ${s.pick != null ? "disabled" : ""}>${c.T(CV[k])}</button>`).join("")}</div>
        ${s.pick != null ? `<div class="ss-lesson"><span class="ss-lesson-e">${a.ok.includes(s.pick) ? "✅" : "💡"}</span><div><p>${c.T(a.why)}</p></div></div>${c.btn((ar ? "التالي" : "Next") + " " + c.fwd(), "next")}` : ""}`;
    },
    act(c, name, el) {
      const s = c.s;
      if (name === "restart") { this.init(c); return c.rerender(); }
      if (name === "pick" && s.pick == null) { s.pick = el.getAttribute("data-v"); if (s.list[s.i].ok.includes(s.pick)) { s.right++; c.addStars(1); } return c.rerender(); }
      if (name === "next") { s.i++; s.pick = null; if (s.i >= s.list.length && s.right >= 6) c.awardBadge("careful"); return c.rerender(); }
    },
  };

  /* ======================= A Year of Giving (adults) ======================= */
  const INCOME = 4000, NEEDS_COST = 2600;
  function budgetRun(s) {
    let savings = 0, debt = 0, given = 0, short = 0, loan = 0;
    const log = [];
    const pay = (amt) => { if (savings >= amt) savings -= amt; else { debt += amt - savings; savings = 0; } };
    for (let m = 1; m <= 12; m++) {
      const needs = INCOME * s.needs / 100, give = INCOME * s.give / 100, save = INCOME - needs - give;
      savings += save; given += give; if (needs < NEEDS_COST) short++;
      if (m === 4 && s.cousin === "gift") { pay(800); given += 800; log.push("cousin-gift"); }
      if (m === 4 && s.cousin === "loan") { pay(800); loan = 800; log.push("cousin-loan"); }
      if (m === 8 && s.ramadan === "500") { pay(500); given += 500; }
      if (m === 8 && s.ramadan === "all") { given += savings; log.push("all"); savings = 0; }
      if (m === 10) { if (loan) { savings += loan; loan = 0; } pay(1500); }
    }
    return { savings, debt, given, short };
  }
  G["giving-budget"] = {
    title: { en: "A Year of Giving", ar: "سنة من العطاء" }, icon: "📅",
    howto: { en: "Plan a household budget of $4,000 a month: family needs, regular giving and savings. Then live through a year of surprises and see how your plan holds up.", ar: "خطّط لميزانية أسرة دخلها 4,000 دولار في الشهر: حاجات الأسرة والعطاء المنتظم والادخار. ثم عِش سنة من المفاجآت وانظر كيف تصمد خطتك." },
    sketch: `<rect x="10" y="10" width="44" height="42" rx="4" fill="#fff" stroke="#c79a3a" stroke-width="2"/><rect x="10" y="10" width="44" height="10" rx="4" fill="#c79a3a"/>${[0,1,2,3].map((r) => [0,1,2,3].map((k) => `<rect x="${14 + k * 10}" y="${24 + r * 7}" width="6" height="4" fill="${(r * 4 + k) % 5 === 0 ? "#2f8f87" : "#e8d5a8"}"/>`).join("")).join("")}<circle cx="86" cy="32" r="18" fill="#e8d5a8"/><path d="M86 32 L86 14 A18 18 0 0 1 103 38 z" fill="#2f8f87"/><path d="M86 32 L103 38 A18 18 0 0 1 94 48 z" fill="#c79a3a" class="ss-anim-glow"/>`,
    init(c) { Object.assign(c.s, { view: "plan", needs: 70, give: 5, cousin: null, ramadan: null }); return this.render(c); },
    render(c) {
      const s = c.s, ar = c.ar, sav = 100 - s.needs - s.give;
      if (s.view === "plan") {
        return `${c.head()}
          <p>${ar ? "دخل الأسرة 4,000 دولار في الشهر، وحاجاتها الأساسية (السكن والطعام والفواتير والمدرسة) تكلّف نحو 2,600 دولار." : "The household earns $4,000 a month. Its basic needs (housing, food, bills, school) cost about $2,600."}</p>
          <label class="ss-sa-row"><span class="ss-sa-l">${ar ? "حاجات الأسرة" : "Family needs"}: <strong id="gb-needs">${s.needs}% · ${c.money(INCOME * s.needs / 100)}</strong></span><input type="range" min="40" max="90" step="1" value="${s.needs}" data-g-input="needs"></label>
          <label class="ss-sa-row"><span class="ss-sa-l">${ar ? "العطاء المنتظم كل شهر" : "Regular giving each month"}: <strong id="gb-give">${s.give}% · ${c.money(INCOME * s.give / 100)}</strong></span><input type="range" min="0" max="20" step="1" value="${s.give}" data-g-input="give"></label>
          <p>${ar ? "الادخار" : "Savings"}: <strong id="gb-save">${sav}% · ${c.money(INCOME * sav / 100)}</strong></p>
          <p class="ss-hint" id="gb-warn" ${sav < 0 ? "" : "hidden"}>${ar ? "المجموع أكثر من 100%. قلّل أحد البندين." : "That adds up to more than 100%. Lower one of them."}</p>
          ${c.btn((ar ? "ابدأ السنة" : "Start the year") + " " + c.fwd(), "start")}`;
      }
      if (s.view === "cousin") return `${c.head()}<div class="ss-lesson"><span class="ss-lesson-e">🏠</span><div><strong>${ar ? "الشهر 4" : "Month 4"}</strong><p>${ar ? "أسرة ابن عمك لا تستطيع دفع إيجار هذا الشهر (800 دولار)، وتستحيي أن تطلب." : "Your cousin's family can't pay this month's rent ($800) and is too embarrassed to ask."}</p></div></div>
        <div class="ss-verdicts">${c.btn(ar ? "أساعدهم بهدوء بـ 800 دولار" : "Help them quietly with $800", "cousin", "gift", "ss-btn-ghost")}${c.btn(ar ? "أقرضهم 800 دولار دون فائدة، يردّونها بعد 6 أشهر" : "Lend $800 interest-free, repaid in 6 months", "cousin", "loan", "ss-btn-ghost")}${c.btn(ar ? "أعتذر هذه المرة" : "Say you can't help this time", "cousin", "none", "ss-btn-ghost")}</div>`;
      if (s.view === "ramadan") return `${c.head()}<div class="ss-lesson"><span class="ss-lesson-e">🌙</span><div><strong>${ar ? "الشهر 8: رمضان" : "Month 8: Ramadan"}</strong><p>${ar ? "مسجدك يجمع لمشروع مياه. ماذا ستفعل فوق عطائك المنتظم؟" : "Your mosque is collecting for a water project. What will you do on top of your regular giving?"}</p></div></div>
        <div class="ss-verdicts">${c.btn(ar ? "أعطي 500 دولار إضافية" : "Give an extra $500", "ramadan", "500", "ss-btn-ghost")}${c.btn(ar ? "أعطي كل مدخراتي" : "Give all my savings", "ramadan", "all", "ss-btn-ghost")}${c.btn(ar ? "أكتفي بعطائي الشهري المنتظم" : "Keep to my regular monthly giving", "ramadan", "none", "ss-btn-ghost")}</div>`;
      const r = budgetRun(s), L = [];
      if (s.needs * INCOME / 100 < NEEDS_COST) L.push(`${ar ? `لم تُغطَّ حاجات أسرتك (2,600 دولار شهرياً) في ${r.short} شهراً. قال النبي ﷺ: «وابدأ بمن تعول»، وأخبر أن نفقة الرجل على أهله يحتسبها صدقة.` : `Your family's basic needs ($2,600 a month) were not covered in ${r.short} months. The Prophet ﷺ said to start with those you support, and that spending on your family for Allah's sake is charity.`}${link(c, REF.b1426)}${link(c, REF.b55)}`);
      if (r.debt > 0) L.push(`${ar ? `اضطررت إلى الاقتراض (${c.money(r.debt)}) لإصلاح السيارة. وخير الصدقة ما كان عن ظهر غنى، أي بعد سدّ الحاجة. والادخار القليل يحمي أسرتك.` : `You had to borrow ${c.money(r.debt)} for the car repair in month 10. The best charity is given from what is left after your needs, and a small emergency fund protects your family.`}${link(c, REF.b1426)}`);
      if (s.ramadan === "all") L.push(`${ar ? "إعطاء كل المدخرات لم يُبقِ شيئاً للطوارئ. ويصف القرآن عباد الرحمن بأنهم إذا أنفقوا لم يسرفوا ولم يقتروا، وكان إنفاقهم بين ذلك قواماً." : "Giving all your savings left nothing for emergencies. The Qur'an describes good servants of Allah as those who, when they spend, are neither wasteful nor stingy, but in between."}${link(c, REF.q2567)}`);
      if (s.give > 0) L.push(`${ar ? `أعطيت بانتظام كل شهر. وأحب الأعمال إلى الله أدومها وإن قلّ.` : `You gave every month. The deeds Allah loves most are the regular ones, even if small.`}${link(c, REF.b6464)}`);
      else L.push(`${ar ? "لم تخصّص عطاءً منتظماً. والقليل كل شهر يتراكم، وأحب الأعمال إلى الله أدومها وإن قلّ." : "You set no regular giving. A little every month adds up, and the deeds Allah loves most are the regular ones, even if small."}${link(c, REF.b6464)}`);
      if (s.cousin !== "none") L.push(`${ar ? "ساعدت قريباً محتاجاً. وحين يذكر القرآن من يُنفَق عليهم يبدأ بالوالدين والأقربين." : "You helped a relative in need. When the Qur'an lists who to spend on, it starts with parents and relatives."}${link(c, REF.q2215)}`);
      else L.push(ar ? "أحياناً يكون الاعتذار هو القرار الصحيح، ويمكنك أن تدلّهم على جمعية مرخّصة أو تساعدهم بطرق أخرى." : "Sometimes saying no is the right call. You could still point them to a licensed charity or help in other ways.");
      return `${c.head()}<h4>${ar ? "نهاية السنة" : "End of the year"}</h4>
        <div class="ss-infogrid">
          <div class="ss-info"><div class="ss-iy">${ar ? "مجموع ما أعطيت" : "Total given"}</div><div class="ss-iv">${c.money(r.given)}</div></div>
          <div class="ss-info"><div class="ss-iy">${ar ? "المدخرات" : "Savings left"}</div><div class="ss-iv">${c.money(r.savings)}</div></div>
          <div class="ss-info"><div class="ss-iy">${ar ? "الدَّين" : "Debt"}</div><div class="ss-iv">${c.money(r.debt)}</div></div>
          <div class="ss-info"><div class="ss-iy">${ar ? "أشهر لم تكفِ فيها الحاجات" : "Months family was short"}</div><div class="ss-iv">${r.short}</div></div></div>
        <div class="ss-summary"><h4>${ar ? "ما نتعلّمه" : "What we learn"}</h4><ul>${L.map((l) => `<li>${l}</li>`).join("")}</ul></div>
        <p class="ss-rate-note">${ar ? "في الشهر 10 احتاجت السيارة إلى إصلاح بـ 1,500 دولار، وإن كنت أقرضت ابن عمك فقد ردّ القرض في الشهر نفسه. الأرقام افتراضية للتعلّم." : "In month 10 the car needed a $1,500 repair; if you lent your cousin money, it was repaid that month. All figures are made up for learning."}</p>
        ${c.btn("↻ " + (ar ? "خطّط من جديد" : "Plan again"), "restart", null, "ss-btn-ghost")} ${c.finish()}`;
    },
    input(c, name, el) {
      const s = c.s; s[name] = Number(el.value);
      const sav = 100 - s.needs - s.give, set = (id, txt) => { const e = document.getElementById(id); if (e) e.textContent = txt; };
      set("gb-needs", `${s.needs}% · ${c.money(INCOME * s.needs / 100)}`); set("gb-give", `${s.give}% · ${c.money(INCOME * s.give / 100)}`);
      set("gb-save", `${sav}% · ${c.money(INCOME * sav / 100)}`); const w = document.getElementById("gb-warn"); if (w) w.hidden = sav >= 0;
    },
    act(c, name, el) {
      const s = c.s, v = el.getAttribute("data-v");
      if (name === "restart") { this.init(c); return c.rerender(); }
      if (name === "start") { if (100 - s.needs - s.give < 0) { c.toast(c.ar ? "المجموع أكثر من 100%" : "More than 100%"); return; } s.view = "cousin"; return c.rerender(); }
      if (name === "cousin") { s.cousin = v; s.view = "ramadan"; return c.rerender(); }
      if (name === "ramadan") {
        s.ramadan = v; s.view = "end"; const r = budgetRun(s);
        c.addStars(1 + (r.debt === 0 ? 2 : 0) + (r.short === 0 ? 2 : 0) + (s.give > 0 ? 1 : 0));
        return c.rerender();
      }
    },
  };

  /* ======================= Grant Committee (15–18, adults) ======================= */
  const GRANT = 20000;
  const PROPS = [
    { id: "pump", e: "☀️", q: 9, cost: 9000, n: { en: "Solar water pump for a farming village", ar: "مضخة مياه شمسية لقرية زراعية" }, f: { en: "600 people · 15 years · tested in a nearby village · a local committee trained to repair it · villagers asked for it · licensed partner", ar: "600 شخص · 15 سنة · جُرّبت في قرية مجاورة · لجنة محلية مدرّبة على صيانتها · طلبها أهل القرية · شريك مرخّص" }, out: { en: "A year later the pump works, and the committee has already fixed it twice.", ar: "بعد سنة ما زالت المضخة تعمل، وأصلحتها اللجنة مرتين." } },
    { id: "laptops", e: "💻", q: 3, cost: 8000, n: { en: "Laptops for a village school", ar: "حواسيب محمولة لمدرسة قرية" }, f: { en: "200 students · about 4 years · no repair plan · the donor chose it, the school was not asked · licensed partner", ar: "200 طالب · نحو 4 سنوات · لا خطة للصيانة · اختارها المتبرع ولم تُسأل المدرسة · شريك مرخّص" }, out: { en: "By the second year half the laptops were broken, and there was no money to fix them. The teachers say they needed textbooks more.", ar: "في السنة الثانية تعطّل نصف الحواسيب، ولم يكن هناك مال لإصلاحها. ويقول المعلمون إنهم كانوا أحوج إلى الكتب المدرسية." } },
    { id: "parcels", e: "🍚", q: 7, cost: 12000, n: { en: "Monthly food parcels for 25 families for a year", ar: "طرود غذائية شهرية لـ 25 أسرة لمدة سنة" }, f: { en: "125 people · 1 year · families checked by a social worker · needs funding again next year · licensed partner", ar: "125 شخصاً · سنة واحدة · تحقّق منها أخصائي اجتماعي · تحتاج إلى تمويل جديد في السنة القادمة · شريك مرخّص" }, out: { en: "25 families had food all year. Next year they will need help again unless their incomes improve.", ar: "حصلت 25 أسرة على الطعام طوال السنة. وستحتاج إلى المساعدة مرة أخرى في السنة القادمة ما لم يتحسن دخلها." } },
    { id: "literacy", e: "📖", q: 9, cost: 5000, n: { en: "Reading classes for mothers", ar: "دروس قراءة للأمهات" }, f: { en: "60 women and their children · years of benefit · last year 45 of 50 passed · teachers paid by a local association · mothers asked for it", ar: "60 امرأة وأطفالهن · نفع يمتد سنوات · نجحت 45 من 50 في العام الماضي · تدفع جمعية محلية أجور المعلمات · طلبتها الأمهات" }, out: { en: "Most of the mothers can now read, and many help their children with homework.", ar: "صارت معظم الأمهات يقرأن، وكثيرات منهن يساعدن أطفالهن في الواجبات." } },
    { id: "gala", e: "🎤", q: 1, cost: 10000, n: { en: "A launch event with celebrities to raise awareness", ar: "حفل إطلاق مع مشاهير لنشر الوعي" }, f: { en: "Number helped unknown · no evidence it works · no clear partner", ar: "عدد المستفيدين غير معروف · لا دليل على الأثر · لا شريك واضح" }, out: { en: "The event got many photos online, but nobody can say who was helped.", ar: "حصد الحفل صوراً كثيرة على الإنترنت، لكن لا أحد يستطيع أن يقول من استفاد." } },
    { id: "health", e: "🩺", q: 9, cost: 7000, n: { en: "Training 10 community health workers", ar: "تدريب 10 عاملين في الصحة المجتمعية" }, f: { en: "3,000 people · 10 years · a government programme uses the same training · the clinic pays their small salaries · licensed partner", ar: "3,000 شخص · 10 سنوات · برنامج حكومي يستخدم التدريب نفسه · يدفع المستوصف رواتبهم الصغيرة · شريك مرخّص" }, out: { en: "Ten health workers now visit homes, and more children are vaccinated.", ar: "يزور عشرة عاملين صحيين البيوت الآن، وارتفع عدد الأطفال الذين تلقّوا التطعيم." } },
  ];
  const gScore = (ids) => ids.reduce((a, id) => a + (PROPS.find((p) => p.id === id).q - 4), 0);
  const BEST = (() => { let best = 0; for (let m = 0; m < 1 << PROPS.length; m++) { const ids = PROPS.filter((p, i) => m & (1 << i)).map((p) => p.id); if (ids.reduce((a, id) => a + PROPS.find((p) => p.id === id).cost, 0) <= GRANT) best = Math.max(best, gScore(ids)); } return best; })();
  G["grant-committee"] = {
    title: { en: "Grant Committee", ar: "لجنة المنح" }, icon: "🗂️",
    howto: { en: "You sit on a committee with $20,000 to give. Read six proposals and fund the ones you trust most. You don't have to spend everything. Then see what happened a year later.", ar: "أنت عضو في لجنة لديها 20,000 دولار. اقرأ ستة مقترحات وموّل ما تثق به أكثر. ولا يلزمك أن تنفق كل المبلغ. ثم انظر ماذا حدث بعد سنة." },
    sketch: `<rect x="8" y="14" width="30" height="38" rx="3" fill="#fff" stroke="#6b5a48"/><rect x="44" y="10" width="30" height="42" rx="3" fill="#e8d5a8" stroke="#c79a3a" class="ss-anim-float"/><rect x="80" y="14" width="30" height="38" rx="3" fill="#fff" stroke="#6b5a48"/><path d="M50 30 l6 6 12-14" fill="none" stroke="#5b8c4f" stroke-width="3"/><line x1="14" y1="24" x2="32" y2="24" stroke="#6b5a48"/><line x1="14" y1="32" x2="32" y2="32" stroke="#6b5a48"/><line x1="86" y1="24" x2="104" y2="24" stroke="#6b5a48"/><line x1="86" y1="32" x2="104" y2="32" stroke="#6b5a48"/>`,
    init(c) { Object.assign(c.s, { picked: [], view: "pick" }); return this.render(c); },
    render(c) {
      const s = c.s, ar = c.ar, spent = s.picked.reduce((a, id) => a + PROPS.find((p) => p.id === id).cost, 0);
      if (s.view === "review") {
        const sc = gScore(s.picked), pct = Math.max(0, Math.round(100 * sc / BEST));
        return `${c.head()}<h4>${ar ? `تقييم اللجنة: ${pct} من 100` : `Committee score: ${pct} out of 100`}</h4>
          <p>${ar ? `أنفقت ${c.money(spent)}، وبقي ${c.money(GRANT - spent)} للجولة القادمة.` : `You spent ${c.money(spent)} and kept ${c.money(GRANT - spent)} for the next round.`}</p>
          ${PROPS.map((p) => `<div class="ss-appeal ${s.picked.includes(p.id) ? "picked" : "skipped"}"><h4>${p.e} ${c.T(p.n)} · ${c.money(p.cost)} ${s.picked.includes(p.id) ? (ar ? "· موّلته" : "· funded") : (ar ? "· لم تموّله" : "· not funded")}</h4>${s.picked.includes(p.id) ? `<p>${c.T(p.out)}</p>` : ""}</div>`).join("")}
          <div class="ss-summary"><h4>${ar ? "ما الذي يجعل المقترح قوياً؟" : "What makes a strong proposal?"}</h4><ul>
            <li>${ar ? "سأل الناسَ عما يحتاجونه قبل أن يقرر عنهم." : "It asked people what they need before deciding for them."}</li>
            <li>${ar ? "فيه خطة لمن يصلحه ويرعاه بعد انتهاء التمويل." : "It has a plan for who repairs and runs it after the money is spent."}</li>
            <li>${ar ? "عنده دليل على أن الفكرة نجحت من قبل." : "There is evidence the idea has worked before."}</li>
            <li>${ar ? "شريك مرخّص يمكن محاسبته." : "A licensed partner who can be held to account."}</li>
            <li>${ar ? "إبقاء المال لمقترح أفضل خير من إنفاقه على مقترح ضعيف." : "Keeping money for a better proposal beats spending it on a weak one."}</li></ul></div>
          <p class="ss-rate-note">${ar ? "المقترحات والأرقام خيالية للتعلّم." : "Proposals and figures are made up for learning."}</p>
          ${c.btn("↻ " + c.t("nav.restart"), "restart", null, "ss-btn-ghost")} ${c.finish()}`;
      }
      return `${c.head()}<p class="ss-game-sub">${c.money(spent)} / ${c.money(GRANT)}</p><div class="ss-budget-bar"><span style="width:${spent / GRANT * 100}%"></span></div>
        <div class="ss-props">${PROPS.map((p) => { const sel = s.picked.includes(p.id), can = sel || spent + p.cost <= GRANT;
          return `<button type="button" class="ss-prop ${sel ? "selected" : ""}" data-act="g" data-g="pick" data-v="${p.id}" ${can ? "" : "disabled"}><div class="ss-prop-h"><span>${p.e}</span><strong>${c.T(p.n)}</strong><b>${c.money(p.cost)}</b></div><p>${c.T(p.f)}</p></button>`; }).join("")}</div>
        ${c.btn((ar ? "قدّم القرار للجنة" : "Send to the committee") + " " + c.fwd(), "submit")}`;
    },
    act(c, name, el) {
      const s = c.s;
      if (name === "restart") { this.init(c); return c.rerender(); }
      if (name === "pick") { const id = el.getAttribute("data-v"), p = PROPS.find((x) => x.id === id), spent = s.picked.reduce((a, k) => a + PROPS.find((x) => x.id === k).cost, 0);
        if (s.picked.includes(id)) s.picked = s.picked.filter((x) => x !== id); else if (spent + p.cost <= GRANT) s.picked.push(id); return c.rerender(); }
      if (name === "submit") { if (!s.picked.length) { c.toast(c.ar ? "اختر مقترحاً واحداً على الأقل" : "Pick at least one proposal"); return; } s.view = "review"; c.addStars(Math.max(1, Math.round(5 * gScore(s.picked) / BEST))); return c.rerender(); }
    },
  };

  /* ======================= Design Your Charity Project (all ages) ======================= */
  const CAUSES = [
    { k: "water", e: "🚰", n: { en: "Clean water", ar: "الماء النظيف" }, per: 10, u: { en: "people given clean water", ar: "عدد من يحصلون على ماء نظيف" } },
    { k: "food", e: "🍚", n: { en: "Food", ar: "الطعام" }, per: 40, u: { en: "family food parcels (one month each)", ar: "عدد الطرود الغذائية العائلية (يكفي كل منها شهراً)" } },
    { k: "education", e: "📚", n: { en: "Education", ar: "التعليم" }, per: 40, u: { en: "child-months of school", ar: "عدد أشهر الدراسة للأطفال" } },
    { k: "health", e: "💚", n: { en: "Health", ar: "الصحة" }, per: 25, u: { en: "clinic consultations", ar: "عدد الاستشارات الطبية" } },
    { k: "orphans", e: "🧑‍🍼", n: { en: "Orphans", ar: "الأيتام" }, per: 40, u: { en: "months of orphan sponsorship", ar: "عدد أشهر كفالة الأيتام" } },
    { k: "trees", e: "🌳", n: { en: "Trees and nature", ar: "الأشجار والطبيعة" }, per: 5, u: { en: "young trees planted", ar: "عدد الشتلات المزروعة" } },
    { k: "elderly", e: "🧓", n: { en: "Elderly people", ar: "كبار السن" }, per: 25, u: { en: "home visits with essentials", ar: "عدد الزيارات المنزلية مع المستلزمات" } },
    { k: "other", e: "✨", n: { en: "Something else", ar: "شيء آخر" } },
  ];
  const Q = {
    where: [["near", { en: "My neighbourhood", ar: "حيّي" }], ["city", { en: "My city", ar: "مدينتي" }], ["abroad", { en: "Another country", ar: "بلد آخر" }]],
    type: [["once", { en: "One-time help", ar: "مساعدة لمرة واحدة" }], ["ongoing", { en: "Ongoing (Sadaqah Jariyah)", ar: "مستمرة (صدقة جارية)" }]],
    upkeep: [["committee", { en: "A local committee", ar: "لجنة محلية" }], ["partner", { en: "A partner charity", ar: "جمعية شريكة" }], ["family", { en: "My family or friends", ar: "أسرتي أو أصدقائي" }], ["nobody", { en: "Nobody yet", ar: "لا أحد بعد" }]],
    partner: [["licensed", { en: "A licensed charity", ar: "جمعية مرخّصة" }], ["school", { en: "My school or mosque", ar: "مدرستي أو مسجدي" }], ["me", { en: "Just me and my friends", ar: "أنا وأصدقائي فقط" }]],
    asked: [["yes", { en: "Yes, I asked them", ar: "نعم، سألتهم" }], ["no", { en: "Not yet", ar: "ليس بعد" }]],
    privacy: [["dignity", { en: "No faces or names without permission", ar: "لا وجوه ولا أسماء دون إذن" }], ["post", { en: "Post photos of everyone", ar: "أنشر صور الجميع" }]],
    measure: [["count", { en: "Count the people helped", ar: "أعدّ المستفيدين" }], ["visit", { en: "Visit later and ask", ar: "أزورهم لاحقاً وأسألهم" }], ["report", { en: "Get a report from the partner", ar: "أطلب تقريراً من الشريك" }], ["unsure", { en: "Not sure yet", ar: "لست متأكداً بعد" }]],
  };
  const QL = {
    where: { en: "Where will it happen?", ar: "أين سيكون المشروع؟" }, type: { en: "What kind of help is it?", ar: "ما نوع المساعدة؟" },
    upkeep: { en: "Who will look after it once it is set up?", ar: "من سيرعاه بعد إنشائه؟" }, partner: { en: "Who will you work with?", ar: "مع من ستعمل؟" },
    asked: { en: "Did you ask the people you want to help what they need?", ar: "هل سألت من تريد مساعدتهم عمّا يحتاجونه؟" },
    privacy: { en: "Photos and sharing", ar: "الصور والنشر" }, measure: { en: "How will you know it worked?", ar: "كيف ستعرف أنه نجح؟" },
  };
  const blank = () => ({ name: "", cause: null, where: null, who: "", people: 50, type: null, budget: 500, upkeep: null, partner: null, asked: null, privacy: null, measure: null });
  function loadSaved() { try { return JSON.parse(localStorage.getItem("ss_projects") || "[]"); } catch (e) { return []; } }
  function storeSaved(list) { try { localStorage.setItem("ss_projects", JSON.stringify(list)); } catch (e) {} }
  function review(c, f) {
    const ar = c.ar, good = [], tips = [];
    if (f.asked === "yes") good.push(ar ? "سألت الناس عمّا يحتاجونه، فمشروعك مبني على حاجة حقيقية." : "You asked people what they need, so your project fits a real need.");
    else tips.push(ar ? "اسأل من تريد مساعدتهم عمّا يحتاجونه أولاً. المساعدة التي تناسب الحاجة الحقيقية تنجح أكثر." : "Ask the people you want to help what they need first. Help that fits a real need works better.");
    if (f.type === "ongoing" && f.upkeep === "nobody") tips.push(ar ? "المشاريع المستمرة تحتاج إلى من يرعاها. بئر بلا صيانة قد تتعطل خلال سنوات قليلة." : "Ongoing projects need someone to look after them. A well with no upkeep can break within a few years.");
    else if (f.type) good.push(f.type === "ongoing" ? (ar ? "عندك خطة لمن يرعى المشروع، وهذا ما يجعل الصدقة جارية فعلاً." : "You have a plan for who looks after it, which is what keeps ongoing charity going.") : (ar ? "المساعدة لمرة واحدة مناسبة للحاجات العاجلة." : "One-time help suits urgent needs."));
    if (f.partner === "me" && f.budget > 500) tips.push(ar ? "إذا كنت ستجمع مالاً من الآخرين فاعمل مع جمعية مرخّصة. وفي قطر تتولى هيئة تنظيم الأعمال الخيرية ترخيص الجمعيات." : "If you will collect money from other people, work with a licensed charity. In Qatar, charities are licensed by the Regulatory Authority for Charitable Activities (RACA).");
    else if (f.partner) good.push(ar ? "شريكك مناسب لحجم المشروع." : "Your partner suits the size of the project.");
    if (f.privacy === "post") tips.push(`${ar ? "احفظ كرامة من تساعدهم: لا وجوه ولا أسماء دون إذن. والقرآن ينهى عن إبطال الصدقات بالمنّ والأذى." : "Protect people's dignity: no faces or names without permission. The Qur'an warns against spoiling charity with reminders or hurt."}${link(c, REF.q2264)}`);
    else if (f.privacy) good.push(ar ? "تحترم خصوصية الناس وكرامتهم." : "You respect people's privacy and dignity.");
    if (f.measure === "unsure") tips.push(ar ? "قرّر من الآن كيف ستعرف أن المشروع نجح: عدّ المستفيدين، أو زُرهم لاحقاً، أو اطلب تقريراً." : "Decide now how you will know it worked: count the people helped, visit later, or ask for a report.");
    else if (f.measure) good.push(ar ? "عندك طريقة لمعرفة أثر مشروعك." : "You have a way to check the result.");
    return { good, tips, stars: good.length };
  }
  function summary(c, f) {
    const ca = CAUSES.find((x) => x.k === f.cause), ar = c.ar, T = (o) => c.T(o);
    const lab = (k, v) => { const o = (Q[k] || []).find((x) => x[0] === v); return o ? T(o[1]) : ""; };
    const est = ca && ca.per ? Math.floor(f.budget / ca.per) : null;
    return { ca, est, text: [
      (f.name || (ar ? "مشروعي" : "My project")) + (ca ? ` (${T(ca.n)})` : ""),
      `${ar ? "أين" : "Where"}: ${lab("where", f.where)}`, `${ar ? "لمن" : "For"}: ${f.who || "-"} (${f.people})`,
      `${ar ? "النوع" : "Type"}: ${lab("type", f.type)}${f.type === "ongoing" ? ` · ${ar ? "الرعاية" : "Upkeep"}: ${lab("upkeep", f.upkeep)}` : ""}`,
      `${ar ? "الميزانية" : "Budget"}: ${c.money(f.budget)}${est != null ? (ar ? ` · ${T(ca.u)}: نحو ${est.toLocaleString("en-US")}` : ` ≈ ${est.toLocaleString("en-US")} ${T(ca.u)}`) : ""}`,
      `${ar ? "الشريك" : "Partner"}: ${lab("partner", f.partner)}`, `${ar ? "القياس" : "Measuring"}: ${lab("measure", f.measure)}`,
    ].join("\n") };
  }
  M.project = {
    render(c) {
      const s = c.s, ar = c.ar;
      if (!s.f) Object.assign(s, { f: blank(), view: "form", savedIdx: null });
      const f = s.f, saved = loadSaved();
      const seg = (k, list) => `<div class="ss-segments">${list.map(([v, lab]) => `<button type="button" class="ss-seg ${f[k] === v ? "selected" : ""}" data-act="g" data-g="set" data-v="${k}:${v}">${c.T(lab)}</button>`).join("")}</div>`;
      const savedList = saved.length ? `<div class="ss-saved"><h4>${ar ? "مشاريعي المحفوظة" : "My saved projects"}</h4>${saved.map((p, i) => `<div class="ss-saved-row"><span>${(CAUSES.find((x) => x.k === p.f.cause) || {}).e || "✨"} ${c.esc(p.f.name || (ar ? "مشروع بلا اسم" : "Untitled project"))}</span><span>${c.btn(ar ? "افتح" : "Open", "open", i, "ss-btn-ghost ss-btn-sm")} ${c.btn(ar ? "احذف" : "Delete", "del", i, "ss-btn-ghost ss-btn-sm")}</span></div>`).join("")}</div>` : "";
      const head = `<div class="ss-section-head"><h2>${c.t("mod.project")}</h2><p>${ar ? "خطّط لمشروع خيري خطوة بخطوة. ستحصل على بطاقة مشروع وتقدير تقريبي لما يمكن أن يحققه، ونصائح لتحسينه." : "Plan a charity project step by step. You'll get a project card, a rough estimate of what it could do, and tips to make it stronger."}</p></div>`;
      if (s.view === "result") {
        const r = review(c, f), sm = summary(c, f);
        return `${head}<div class="ss-project-card">
          <div class="ss-pc-head"><span class="ss-pc-e">${sm.ca ? sm.ca.e : "✨"}</span><div><h3>${c.esc(f.name || (ar ? "مشروعي" : "My project"))}</h3><p class="ss-muted">${[sm.ca ? c.T(sm.ca.n) : "", c.esc(f.who || "")].filter(Boolean).join(" · ")}</p></div><div class="ss-pc-stars" aria-label="${r.stars}/5">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div></div>
          <p>${ar ? "الميزانية" : "Budget"}: <strong>${c.money(f.budget)}</strong>${sm.est != null ? (ar ? ` · ${c.T(sm.ca.u)}: نحو <strong>${sm.est.toLocaleString("en-US")}</strong>` : ` · could pay for about <strong>${sm.est.toLocaleString("en-US")}</strong> ${c.T(sm.ca.u)}`) : ""}</p>
          ${sm.est != null ? `<p class="ss-rate-note">${ar ? `على افتراض ${c.money(sm.ca.per)} لكل وحدة. أسعار تقريبية للتعلّم، والتكلفة الحقيقية تختلف بحسب البلد والجمعية.` : `Assumes ${c.money(sm.ca.per)} for each one. Example prices for learning; real costs vary by country and charity.`}</p>` : ""}
          ${r.good.length ? `<h5>✓ ${ar ? "نقاط القوة" : "Strengths"}</h5><ul class="ss-good">${r.good.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""}
          ${r.tips.length ? `<h5>💡 ${ar ? "لتحسين المشروع" : "To make it stronger"}</h5><ul class="ss-tips">${r.tips.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""}
        </div>
        ${c.btn(ar ? "عدّل" : "Edit", "edit", null, "ss-btn-ghost")} ${c.btn(ar ? "انسخ الملخص" : "Copy summary", "copy", null, "ss-btn-ghost")} ${c.btn(s.savedIdx != null ? (ar ? "احفظ التعديلات" : "Save changes") : (ar ? "احفظ المشروع" : "Save project"), "save")} ${c.btn(ar ? "مشروع جديد" : "New project", "new", null, "ss-btn-ghost")}
        ${savedList}`;
      }
      return `${head}${savedList}
        <div class="ss-pform">
          <label class="ss-field"><span>${ar ? "اسم المشروع" : "Project name"}</span><input type="text" maxlength="60" value="${c.esc(f.name)}" data-g-input="name" placeholder="${ar ? "مثال: ماء لمدرسة القرية" : "e.g. Water for the village school"}"></label>
          <h5>${ar ? "ما المجال؟" : "What cause?"}</h5>
          <div class="ss-segments">${CAUSES.map((x) => `<button type="button" class="ss-seg ${f.cause === x.k ? "selected" : ""}" data-act="g" data-g="set" data-v="cause:${x.k}">${x.e} ${c.T(x.n)}</button>`).join("")}</div>
          <h5>${c.T(QL.where)}</h5>${seg("where", Q.where)}
          <label class="ss-field"><span>${ar ? "من سيستفيد؟" : "Who will it help?"}</span><input type="text" maxlength="80" value="${c.esc(f.who)}" data-g-input="who" placeholder="${ar ? "مثال: طلاب مدرسة القرية" : "e.g. students at the village school"}"></label>
          <label class="ss-sa-row"><span class="ss-sa-l">${ar ? "كم شخصاً تقريباً؟" : "About how many people?"} <strong id="pj-people">${f.people.toLocaleString("en-US")}</strong></span><input type="range" min="1" max="5000" step="1" value="${f.people}" data-g-input="people"></label>
          <h5>${c.T(QL.type)}</h5>${seg("type", Q.type)}
          ${f.type === "ongoing" ? `<h5>${c.T(QL.upkeep)}</h5>${seg("upkeep", Q.upkeep)}` : ""}
          <label class="ss-sa-row"><span class="ss-sa-l">${ar ? "الميزانية" : "Budget"}: <strong id="pj-budget">${c.money(f.budget)}</strong></span><input type="range" min="50" max="50000" step="50" value="${f.budget}" data-g-input="budget"></label>
          <h5>${c.T(QL.partner)}</h5>${seg("partner", Q.partner)}
          <h5>${c.T(QL.asked)}</h5>${seg("asked", Q.asked)}
          <h5>${c.T(QL.privacy)}</h5>${seg("privacy", Q.privacy)}
          <h5>${c.T(QL.measure)}</h5>${seg("measure", Q.measure)}
        </div>
        ${c.btn((ar ? "اعرض مشروعي" : "See my project") + " " + c.fwd(), "show")}`;
    },
    input(c, name, el) {
      const f = c.s.f; if (!f) return;
      if (name === "name" || name === "who") f[name] = el.value;
      if (name === "people") { f.people = Number(el.value); const e = document.getElementById("pj-people"); if (e) e.textContent = f.people.toLocaleString("en-US"); }
      if (name === "budget") { f.budget = Number(el.value); const e = document.getElementById("pj-budget"); if (e) e.textContent = c.money(f.budget); }
    },
    act(c, name, el) {
      const s = c.s, v = el.getAttribute("data-v"), ar = c.ar;
      if (name === "set") { const [k, val] = v.split(":"); s.f[k] = val; if (k === "type" && val === "once") s.f.upkeep = null; return c.rerender(); }
      if (name === "show") {
        const f = s.f, miss = !f.cause || !f.type || !f.partner || !f.asked || !f.privacy || !f.measure || (f.type === "ongoing" && !f.upkeep);
        if (miss) { c.toast(ar ? "أجب عن كل الأسئلة أولاً" : "Answer every question first"); return; }
        s.view = "result"; window.scrollTo({ top: 0, behavior: "smooth" }); return c.rerender();
      }
      if (name === "edit") { s.view = "form"; return c.rerender(); }
      if (name === "new") { s.f = blank(); s.view = "form"; s.savedIdx = null; return c.rerender(); }
      if (name === "save") {
        const list = loadSaved(), item = { f: Object.assign({}, s.f), date: new Date().toISOString().slice(0, 10) };
        if (s.savedIdx != null && list[s.savedIdx]) list[s.savedIdx] = item; else { list.push(item); s.savedIdx = list.length - 1; }
        storeSaved(list);
        if (c.awardBadge("designer")) c.addStars(5, ar ? "مشروع محفوظ" : "project saved"); else c.toast(ar ? "حُفظ" : "Saved");
        return c.rerender();
      }
      if (name === "copy") {
        const txt = summary(c, s.f).text;
        try { navigator.clipboard.writeText(txt).then(() => c.toast(ar ? "نُسخ" : "Copied"), () => c.toast(ar ? "تعذّر النسخ" : "Could not copy")); } catch (e) { c.toast(ar ? "تعذّر النسخ" : "Could not copy"); }
        return;
      }
      if (name === "open") { const p = loadSaved()[Number(v)]; if (p) { s.f = Object.assign(blank(), p.f); s.savedIdx = Number(v); s.view = "result"; } return c.rerender(); }
      if (name === "del") { const list = loadSaved(); list.splice(Number(v), 1); storeSaved(list); if (s.savedIdx === Number(v)) s.savedIdx = null; return c.rerender(); }
    },
  };
})();
