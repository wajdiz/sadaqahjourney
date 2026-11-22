/* =========================================================================
   Sadaqah Stories — Impact Simulator assumption models (EN + AR)
   One small model per project. The default values reproduce the headline
   figures in data.js, so the sliders start where the site's numbers are.
   calc(v, y) returns the figure for year y (1, 5, 10 or 20).
   These are teaching models with made-up inputs, not forecasts.
   ========================================================================= */
window.SADAQAH_SIM_MODELS = {
  water: {
    params: [
      { k: "people", min: 100, max: 1500, step: 50, def: 500, label: { en: "People using the well each year", ar: "عدد من يستخدمون البئر كل سنة" } },
      { k: "kept", type: "toggle", def: true, label: { en: "The well gets regular maintenance", ar: "تحصل البئر على صيانة منتظمة" } },
    ],
    unit: { en: "person-years of clean water (total so far)", ar: "شخص-سنة من الماء النظيف (المجموع حتى ذلك الوقت)" },
    formula: { en: "people per year × years the well keeps working. In this model a well with no maintenance stops after Year 5.", ar: "عدد الأشخاص في السنة × عدد سنوات عمل البئر. وفي هذا النموذج تتوقف البئر التي لا تُصان بعد السنة الخامسة." },
    calc: (v, y) => v.people * (v.kept ? y : Math.min(y, 5)),
  },
  education: {
    params: [
      { k: "students", min: 50, max: 600, step: 10, def: 200, label: { en: "Students in the school each year", ar: "عدد الطلاب في المدرسة كل سنة" } },
    ],
    unit: { en: "student-years of education (total so far)", ar: "طالب-سنة من التعليم (المجموع حتى ذلك الوقت)" },
    formula: { en: "students per year × years. The site's range is 150–250 students; the slider starts in the middle.", ar: "عدد الطلاب في السنة × عدد السنوات. ونطاق الموقع 150–250 طالباً، ويبدأ المؤشر من منتصفه." },
    calc: (v, y) => v.students * y,
  },
  food: {
    params: [
      { k: "families", min: 50, max: 500, step: 10, def: 200, label: { en: "Farming families supported", ar: "عدد الأسر المزارعة المدعومة" } },
      { k: "share", min: 20, max: 100, step: 5, def: 70, fmt: "%", label: { en: "Share of their food they grow", ar: "نسبة ما تزرعه من غذائها" } },
    ],
    unit: { en: "family-years of home-grown food (total so far)", ar: "أسرة-سنة من الغذاء المزروع محلياً (المجموع حتى ذلك الوقت)" },
    formula: { en: "farming families × years × share of food they grow. The site says 60–80%; the slider starts at 70%.", ar: "عدد الأسر المزارعة × عدد السنوات × نسبة ما تزرعه من غذائها. ويذكر الموقع 60–80%، ويبدأ المؤشر من 70%." },
    calc: (v, y) => v.families * y * v.share / 100,
  },
  healthcare: {
    params: [
      { k: "first", min: 500, max: 4000, step: 100, def: 1600, label: { en: "Consultations in the first year", ar: "عدد الاستشارات في السنة الأولى" } },
      { k: "growth", min: 0, max: 15, step: 1, def: 5, fmt: "%", label: { en: "Yearly growth in visits", ar: "نمو الزيارات كل سنة" } },
    ],
    unit: { en: "consultations (total since the clinic opened)", ar: "استشارة (المجموع منذ افتتاح المستوصف)" },
    formula: { en: "first-year consultations, growing by the yearly rate, added up year by year.", ar: "استشارات السنة الأولى، تنمو بالنسبة السنوية، وتُجمع سنة بعد سنة." },
    calc: (v, y) => { let total = 0; for (let i = 0; i < y; i++) total += v.first * Math.pow(1 + v.growth / 100, i); return total; },
  },
  orphan: {
    params: [
      { k: "children", min: 10, max: 500, step: 10, def: 100, label: { en: "Children sponsored at any one time", ar: "عدد الأطفال المكفولين في كل وقت" } },
      { k: "cost", min: 20, max: 80, step: 5, def: 40, fmt: "$", label: { en: "Cost per child per month", ar: "تكلفة الطفل الواحد شهرياً" } },
    ],
    unit: { en: "child-years of sponsorship (total so far)", ar: "طفل-سنة من الكفالة (المجموع حتى ذلك الوقت)" },
    formula: { en: "children × years. The yearly cost is children × monthly cost × 12, so the cost slider shows how much funding the same result needs.", ar: "عدد الأطفال × عدد السنوات. والتكلفة السنوية = عدد الأطفال × التكلفة الشهرية × 12، لذلك يبيّن مؤشر التكلفة حجم التمويل اللازم للنتيجة نفسها." },
    calc: (v, y) => v.children * y,
    extra: (v) => ({ en: "Yearly cost: $" + (v.children * v.cost * 12).toLocaleString("en-US"), ar: "التكلفة السنوية: " + (v.children * v.cost * 12).toLocaleString("en-US") + " دولار" }),
  },
  refugee: {
    params: [
      { k: "families", min: 50, max: 1000, step: 10, def: 200, label: { en: "Families supported in Year 1", ar: "عدد الأسر المدعومة في السنة الأولى" } },
      { k: "share", min: 20, max: 100, step: 5, def: 65, fmt: "%", label: { en: "Share able to support themselves from Year 5", ar: "نسبة القادرين على إعالة أنفسهم من السنة الخامسة" } },
    ],
    unit: { en: "families supporting themselves", ar: "أسرة تعيل نفسها" },
    formula: { en: "families × share from Year 5 on; in Year 1 no family is counted yet. The site says 60–70%; the slider starts at 65%.", ar: "عدد الأسر × النسبة ابتداءً من السنة الخامسة، ولا تُحسب أي أسرة في السنة الأولى. ويذكر الموقع 60–70%، ويبدأ المؤشر من 65%." },
    calc: (v, y) => (y >= 5 ? v.families * v.share / 100 : 0),
  },
  mosque: {
    params: [
      { k: "start", min: 100, max: 1500, step: 50, def: 400, label: { en: "People at Friday prayer in Year 1", ar: "عدد المصلين في صلاة الجمعة في السنة الأولى" } },
      { k: "growth", min: 0, max: 10, step: 1, def: 3, fmt: "%", label: { en: "Yearly growth", ar: "النمو السنوي" } },
    ],
    unit: { en: "people at Friday prayer each week (not a running total)", ar: "مصلٍّ في صلاة الجمعة كل أسبوع (ليس مجموعاً تراكمياً)" },
    formula: { en: "Year 1 attendance × (1 + growth) for each year after the first.", ar: "عدد المصلين في السنة الأولى × (1 + النمو) عن كل سنة بعد الأولى." },
    calc: (v, y) => v.start * Math.pow(1 + v.growth / 100, y - 1),
  },
  emergency: {
    params: [
      { k: "families", min: 200, max: 3000, step: 100, def: 1000, label: { en: "Families helped in each response", ar: "عدد الأسر في كل استجابة" } },
      { k: "size", min: 3, max: 8, step: 1, def: 5, label: { en: "People per family", ar: "عدد أفراد الأسرة" } },
      { k: "per", min: 0.5, max: 3, step: 0.5, def: 1, label: { en: "Responses per year", ar: "عدد الاستجابات في السنة" } },
    ],
    unit: { en: "people reached (total since the fund started)", ar: "شخص وصلت إليهم المساعدة (المجموع منذ إنشاء الصندوق)" },
    formula: { en: "families × people per family × responses per year × years. This assumes donors keep refilling the fund.", ar: "عدد الأسر × عدد أفراد الأسرة × عدد الاستجابات في السنة × عدد السنوات. ويفترض ذلك أن المتبرعين يواصلون تمويل الصندوق." },
    calc: (v, y) => v.families * v.size * v.per * y,
  },
  waqf: {
    params: [
      { k: "amount", min: 10000, max: 500000, step: 10000, def: 100000, fmt: "$", label: { en: "Amount given as waqf", ar: "المبلغ الموقوف" } },
      { k: "ret", min: 2, max: 12, step: 1, def: 9, fmt: "%", label: { en: "Yearly return", ar: "العائد السنوي" } },
      { k: "give", min: 50, max: 100, step: 5, def: 100, fmt: "%", label: { en: "Share of income given out (the rest is added back to the waqf)", ar: "نسبة الريع الموزَّع (والباقي يُضاف إلى أصل الوقف)" } },
    ],
    unit: { en: "dollars given out (total so far)", ar: "دولار وُزِّع (المجموع حتى ذلك الوقت)" },
    formula: { en: "each year: waqf value × return. The share given out goes to the cause; the rest is added to the waqf, so later income grows. The site uses 8–10%; the slider starts at 9%.", ar: "كل سنة: قيمة الوقف × العائد. يذهب الجزء الموزَّع إلى المستفيدين، ويُضاف الباقي إلى أصل الوقف فيزيد الريع لاحقاً. ويستخدم الموقع 8–10%، ويبدأ المؤشر من 9%." },
    calc: (v, y) => { let value = v.amount, given = 0; for (let i = 0; i < y; i++) { const inc = value * v.ret / 100; given += inc * v.give / 100; value += inc * (1 - v.give / 100); } return given; },
  },
};
