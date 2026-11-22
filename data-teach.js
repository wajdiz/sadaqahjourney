/* =========================================================================
   Sadaqah Stories: Teachers & Workshops content (EN + AR)
   Guidelines, six workshop kits, the activity bank, handout texts and notes
   for scholars. Rendered by teach.js. Kit agendas list activity ids from the
   bank, so a kit can be loaded into the planner and edited.
   Every hadith and verse cited here is already cited elsewhere on the site.
   ========================================================================= */
(function () {
  const REF = {
    b6021: { en: "Sahih al-Bukhari 6021", ar: "صحيح البخاري 6021", url: "https://sunnah.com/bukhari:6021" },
    m2626: { en: "Sahih Muslim 2626", ar: "صحيح مسلم 2626", url: "https://sunnah.com/muslim:2626" },
    m1631: { en: "Sahih Muslim 1631", ar: "صحيح مسلم 1631", url: "https://sunnah.com/muslim:1631" },
    b2778: { en: "Sahih al-Bukhari 2778", ar: "صحيح البخاري 2778", url: "https://sunnah.com/bukhari:2778" },
    m1017: { en: "Sahih Muslim 1017a", ar: "صحيح مسلم 1017", url: "https://sunnah.com/muslim:1017a" },
    m2984: { en: "Sahih Muslim 2984a", ar: "صحيح مسلم 2984", url: "https://sunnah.com/muslim:2984a" },
    q960: { en: "Qur'an 9:60", ar: "التوبة: 60", url: "https://quran.com/9/60" },
  };

  const THEMES = {
    general: { en: "Openers & closers", ar: "افتتاح وختام" },
    sadaqah: { en: "Sadaqah", ar: "الصدقة" },
    zakat: { en: "Zakat", ar: "الزكاة" },
    waqf: { en: "Waqf", ar: "الوقف" },
    ethics: { en: "Choices & ethics", ar: "الاختيار والأخلاق" },
    media: { en: "Evidence & media", ar: "الدليل والإعلام" },
  };

  const ALL = ["7-10", "11-14", "15-18", "adults"];

  /* ----------------------------- Activity bank ---------------------------
     open: "route:id" (play:<game>, story:<id>, module-b:<sim>, or a route).
     handout: id of a printable sheet on the Handouts tab. */
  const ACTIVITIES = [
    { id: "warmup", icon: "💬", ages: ALL, theme: "general", min: 10, refs: ["b6021", "m2626"],
      title: { en: "What counts as charity?", ar: "ما الذي يُعدّ صدقة؟" },
      how: {
        en: "Ask the group to call out things that count as charity. Write them in three columns: money, time and effort, words and manners. Then share that the Prophet ﷺ said every good deed is charity, and that meeting someone with a cheerful face is a good deed. Ask which column surprised them.",
        ar: "اطلب من المجموعة أن تذكر أعمالاً تُعدّ صدقة، واكتبها في ثلاثة أعمدة: المال، والوقت والجهد، والكلام والأخلاق. ثم اذكر قول النبي ﷺ: «كل معروف صدقة»، وأن لقاء الناس بوجه طلق من المعروف. واسألهم: أي عمود فاجأكم؟" } },
    { id: "exit", icon: "🎟️", ages: ALL, theme: "general", min: 5, handout: "exit",
      title: { en: "Exit ticket", ar: "بطاقة الخروج" },
      how: {
        en: "Each learner writes one thing they learned, one question they still have, and one small act they will do this week. Read the questions before the next session and start with two of them.",
        ar: "يكتب كل متعلم شيئاً تعلّمه، وسؤالاً ما زال عنده، وعملاً صغيراً سيقوم به هذا الأسبوع. اقرأ الأسئلة قبل الجلسة التالية وابدأها باثنين منها." } },
    { id: "pledge", icon: "✍️", ages: ["7-10", "11-14"], theme: "sadaqah", min: 10, handout: "pledge",
      title: { en: "Kindness pledge", ar: "عهد اللطف" },
      how: {
        en: "Children tick two or three small deeds on the pledge sheet and sign it. The deeds come from the site's daily challenges, and each one comes from a hadith. Collect the sheets and give them back a week later to talk about what happened.",
        ar: "يختار الأطفال عملين أو ثلاثة من الأعمال الصغيرة في ورقة العهد ويوقّعونها. هذه الأعمال مأخوذة من تحديات الموقع اليومية، ولكل منها حديث. اجمع الأوراق وأعدها إليهم بعد أسبوع ليتحدثوا عمّا حدث." } },
    { id: "daily", icon: "📅", ages: ALL, theme: "sadaqah", min: 5, open: "modules",
      title: { en: "Daily challenge as homework", ar: "تحدي اليوم واجباً منزلياً" },
      how: {
        en: "Show the daily challenge card at the top of All sections. Learners do the act at home and report back next session. Everyone sees the same challenge on the same day.",
        ar: "اعرض بطاقة تحدي اليوم في أعلى صفحة «كل الأقسام». ينفّذ المتعلمون العمل في البيت ويتحدثون عنه في الجلسة التالية. يرى الجميع التحدي نفسه في اليوم نفسه." } },
    { id: "story-read", icon: "📖", ages: ["7-10", "11-14"], theme: "sadaqah", min: 15, open: "module-a",
      title: { en: "Read a story together", ar: "قراءة حكاية معاً" },
      how: {
        en: "Open a story on the projector and ask a different learner to read each page aloud. Before the quiz at the end, ask: who helped, who was helped, and what lasted afterwards? Then answer the quiz together.",
        ar: "افتح حكاية على الشاشة واطلب من متعلم مختلف أن يقرأ كل صفحة بصوت عالٍ. وقبل الاختبار في آخرها اسأل: من الذي ساعد؟ ومن الذي ساعده؟ وما الذي بقي أثره بعد ذلك؟ ثم أجيبوا عن الاختبار معاً." } },
    { id: "evidence-hunt", icon: "🔎", ages: ["15-18", "adults"], theme: "media", min: 20, open: "module-a", handout: "evidence",
      title: { en: "Evidence hunt", ar: "البحث عن الدليل" },
      how: {
        en: "Give each group a story with a different evidence label, for example 02 The Well of Rumah, 03 Al-Qarawiyyin, 22 Libraries and Learning in Medieval Baghdad and 12 Qatar Charity's education projects in Gaza. Groups fill in the evidence sheet: the label, the sources, what we can say for sure and what is uncertain. Then compare: why does each story carry the label it has?",
        ar: "أعطِ كل مجموعة حكاية بحالة توثيق مختلفة، مثل: 02 بئر رومة، و03 القرويين، و22 المكتبات والتعلم في بغداد الوسيطة، و12 مشاريع قطر الخيرية التعليمية في غزة. تملأ كل مجموعة ورقة البحث عن الدليل: حالة التوثيق، والمصادر، وما يمكن قوله بيقين، وما هو غير مؤكد. ثم قارنوا: لماذا حملت كل حكاية حالة التوثيق التي حملتها؟" } },
    { id: "retell", icon: "🗣️", ages: ["11-14", "15-18", "adults"], theme: "media", min: 15,
      title: { en: "Retell it truthfully", ar: "أعد روايتها بأمانة" },
      how: {
        en: "After reading a story, each learner retells it in three sentences, using only what the story and its sources support. Partners check each other: did anyone add a detail, a number or a quote that the story says is uncertain? Stories 02 and 05 work well, because both explain which details were added later.",
        ar: "بعد قراءة الحكاية، يعيد كل متعلم روايتها في ثلاث جمل، لا يذكر فيها إلا ما تؤيده الحكاية ومصادرها. ويراجع كل شريك شريكه: هل أضاف أحدهما تفصيلاً أو رقماً أو قولاً تذكر الحكاية أنه غير مؤكد؟ تصلح لذلك الحكايتان 02 و05، لأن كلاً منهما تبيّن التفاصيل التي أضيفت لاحقاً." } },
    { id: "g-match", icon: "🧰", ages: ["7-10"], theme: "sadaqah", min: 15, open: "play:charity-match",
      title: { en: "Charity Match in pairs", ar: "«مطابقة الخير» في أزواج" },
      how: {
        en: "Pairs take turns flipping cards on one device. After each match, the pair reads the short note aloud. Start on the first level, then try the next one. Ask: which pair was new to you?",
        ar: "يتناوب كل زوج على قلب البطاقات على جهاز واحد. وبعد كل تطابق يقرأ الزوج الملاحظة القصيرة بصوت عالٍ. ابدؤوا بالمستوى الأول ثم انتقلوا إلى الذي يليه. واسأل: أي زوج من البطاقات كان جديداً عليكم؟" } },
    { id: "g-box", icon: "📦", ages: ["7-10"], theme: "sadaqah", min: 15, open: "play:fill-box",
      title: { en: "Fill the Donation Box", ar: "«املأ صندوق التبرع»" },
      how: {
        en: "Play one scene together on the projector, then let groups play the rest. After each scene, ask: what did this person need most, and why would the other items not help?",
        ar: "العبوا مشهداً واحداً معاً على الشاشة، ثم دع المجموعات تلعب بقية المشاهد. وبعد كل مشهد اسأل: ما أكثر ما احتاج إليه هذا الشخص؟ ولماذا لا تنفعه الأشياء الأخرى؟" } },
    { id: "g-tree", icon: "🌳", ages: ["7-10"], theme: "sadaqah", min: 10, open: "play:giving-tree",
      title: { en: "The Giving Tree", ar: "«شجرة العطاء»" },
      how: {
        en: "Children answer six questions, and each right answer helps the tree grow. Read the questions aloud for children who are still learning to read. When the tree is full, ask which of the good deeds in the questions cost no money at all.",
        ar: "يجيب الأطفال عن ستة أسئلة، وكل إجابة صحيحة تجعل الشجرة تكبر. اقرأ الأسئلة بصوت عالٍ لمن لا يزال يتعلم القراءة. وحين تكتمل الشجرة اسأل: أي الأعمال الطيبة في الأسئلة لا يكلّف مالاً أبداً؟" } },
    { id: "g-chain", icon: "🔗", ages: ["11-14"], theme: "sadaqah", min: 15, open: "play:chain-reaction",
      title: { en: "Charity Chain Reaction", ar: "«سلسلة الخير»" },
      how: {
        en: "Groups pick a starting deed and agree on each next step before they tap. At the end, each group draws one more step of its own that could follow.",
        ar: "تختار كل مجموعة عمل خير تبدأ به، وتتفق على كل خطوة تالية قبل أن تضغط. وفي النهاية ترسم كل مجموعة خطوة إضافية من عندها يمكن أن تأتي بعدها." } },
    { id: "g-community", icon: "🏘️", ages: ["11-14"], theme: "ethics", min: 25, open: "play:build-community",
      title: { en: "Build Your Community with roles", ar: "«ابنِ مجتمعك» بأدوار" },
      how: {
        en: "Groups of four share one device. Give each learner a role: treasurer (watches the budget), planner (proposes projects), community voice (asks who is left out) and recorder (writes down each decision and why). Play the three years. At the end, each group explains one decision it would change.",
        ar: "تشترك كل مجموعة من أربعة في جهاز واحد، ولكل متعلم دور: أمين الصندوق (يراقب الميزانية)، والمخطِّط (يقترح المشاريع)، وصوت المجتمع (يسأل: من الذي لم نصل إليه؟)، والمقرِّر (يكتب كل قرار وسببه). العبوا السنوات الثلاث، ثم تشرح كل مجموعة قراراً واحداً كانت ستغيّره." } },
    { id: "g-sortzakat", icon: "⚖️", ages: ["11-14"], theme: "zakat", min: 15, open: "play:sort-zakat", handout: "zakat-sort", refs: ["q960"],
      title: { en: "Sort the Zakat", ar: "«رتّب الزكاة»" },
      how: {
        en: "Read the eight groups in Qur'an 9:60 together first. Then groups sort the cards. Where the game accepts more than one answer, ask why scholars might explain a group in different ways. The paper version on the Handouts tab works without devices.",
        ar: "اقرؤوا الأصناف الثمانية في آية التوبة 60 معاً أولاً، ثم تصنّف المجموعات البطاقات. وحين تقبل اللعبة أكثر من إجابة، اسأل: لماذا قد يفسّر العلماء الصنف بطرق مختلفة؟ وفي تبويب «أوراق العمل» نسخة ورقية لا تحتاج إلى أجهزة." } },
    { id: "g-dilemma", icon: "🤔", ages: ["15-18", "adults"], theme: "ethics", min: 20, open: "play:giving-dilemma",
      title: { en: "Giving Dilemma: take a side", ar: "«مُعضلة العطاء»: اختر جانبك" },
      how: {
        en: "Read a dilemma aloud. Each dilemma has two options. Learners move to one side of the room for option A or the other side for option B, talk with their side, and one person from each side explains the choice. Then show the trade-off note in the game and ask whether anyone changed their mind.",
        ar: "اقرأ المعضلة بصوت عالٍ، ولكل معضلة خياران. يذهب كل متعلم إلى جانب من الغرفة للخيار الأول أو إلى الجانب الآخر للخيار الثاني، ويتناقش أهل كل جانب، ثم يشرح واحد من كل جانب سبب الاختيار. بعدها اعرض ملاحظة الموازنة في اللعبة، واسأل: هل غيّر أحد رأيه؟" } },
    { id: "g-path", icon: "🧭", ages: ["15-18", "adults"], theme: "ethics", min: 20, open: "play:choose-path",
      title: { en: "Choose Your Path", ar: "«اختر طريقك»" },
      how: {
        en: "Play one path together on the projector and vote at each choice. Then groups play a different path. Compare the endings: what led to the better outcome?",
        ar: "العبوا مساراً واحداً معاً على الشاشة وصوّتوا عند كل اختيار، ثم تلعب المجموعات مساراً آخر. قارنوا النهايات: ما الذي أدى إلى النتيجة الأفضل؟" } },
    { id: "g-waqf", icon: "🏛️", ages: ["15-18", "adults"], theme: "waqf", min: 20, open: "play:waqf-architect",
      title: { en: "Waqf Architect", ar: "«مهندس الوقف»" },
      how: {
        en: "Groups design a waqf: they choose the asset, the cause and who will manage it, then see how it does over time. Ask each group to explain its choice of manager, and compare groups that chose different assets.",
        ar: "تصمّم كل مجموعة وقفاً: تختار الأصل والغاية ومن يديره، ثم ترى كيف يسير مع الزمن. اطلب من كل مجموعة أن تشرح اختيارها لمن يدير الوقف، وقارن بين المجموعات التي اختارت أصولاً مختلفة." } },
    { id: "g-calc", icon: "🧮", ages: ["15-18", "adults"], theme: "media", min: 10, open: "play:impact-calc",
      title: { en: "Impact Calculator", ar: "«حاسبة الأثر»" },
      how: {
        en: "Learners enter an amount and compare what it could pay for in each area. Remind them the rates are examples. Ask: what can a calculator like this not show?",
        ar: "يُدخل المتعلمون مبلغاً ويقارنون ما يمكن أن يغطيه في كل مجال. ذكّرهم بأن الأسعار أمثلة. واسأل: ما الذي لا تستطيع حاسبة كهذه أن تُظهره؟" } },
    { id: "sim", icon: "🎚️", ages: ["11-14", "15-18", "adults"], theme: "media", min: 15, open: "module-b",
      title: { en: "Change one assumption", ar: "غيّر افتراضاً واحداً" },
      how: {
        en: "Pick one simulator, such as water or waqf, and open its assumption sliders. Each group changes one number, such as a cost or the number of people served, and records how the result changes. Discuss: which number matters most, and how would you check it in a real charity appeal?",
        ar: "اختر محاكياً واحداً، كالماء أو الوقف، وافتح مؤشرات الافتراضات. تغيّر كل مجموعة رقماً واحداً، كالتكلفة أو عدد المستفيدين، وتسجّل كيف تتغير النتيجة. ثم ناقشوا: أي رقم أهم؟ وكيف تتحقق منه في نداء تبرع حقيقي؟" } },
    { id: "g-check", icon: "🔍", ages: ["15-18", "adults"], theme: "media", min: 15, open: "play:charity-check", handout: "checklist",
      title: { en: "Check the Charity", ar: "«تحقّق من الجمعية»" },
      how: {
        en: "Groups read each appeal and decide: give, ask questions first, or don't give. Before the answer is shown, each group names the sign that decided it. Hand out the check-up checklist for learners to keep.",
        ar: "تقرأ المجموعات كل نداء وتقرّر: تتبرع، أو تسأل أولاً، أو لا تتبرع. وقبل ظهور الإجابة تذكر كل مجموعة العلامة التي حسمت قرارها. ثم وزّع قائمة التحقق ليحتفظ بها المتعلمون." } },
    { id: "g-grant", icon: "🏆", ages: ["15-18", "adults"], theme: "ethics", min: 25, open: "play:grant-committee",
      title: { en: "Grant Committee role-play", ar: "«لجنة المنح» لعب أدوار" },
      how: {
        en: "Groups act as a grant committee with one budget. Each member speaks for one proposal before the group decides. After the 'a year later' review, ask what they would fund differently and why.",
        ar: "تقوم كل مجموعة بدور لجنة منح لها ميزانية واحدة. يتحدث كل عضو باسم مقترح واحد قبل أن تقرر المجموعة. وبعد مراجعة «بعد سنة» اسأل: ما الذي كنتم ستموّلونه بشكل مختلف؟ ولماذا؟" } },
    { id: "g-zakatcheck", icon: "🧾", ages: ["adults"], theme: "zakat", min: 25, open: "play:zakat-check",
      title: { en: "Zakat Check worked example", ar: "مثال تطبيقي في «احسب الزكاة»" },
      how: {
        en: "Do the first household together on the projector. Choose the nisab basis and say which view your community follows. Then groups do the other two households. Stop at each 'scholars differ' note and let the scholar or teacher explain.",
        ar: "احسبوا زكاة الأسرة الأولى معاً على الشاشة. اختر أساس النصاب، واذكر الرأي الذي يتبعه مجتمعكم. ثم تحسب المجموعات زكاة الأسرتين الأخريين. وتوقّف عند كل ملاحظة «يختلف العلماء» ليشرحها العالِم أو المعلم." } },
    { id: "g-zakatcases", icon: "🧭", ages: ["adults"], theme: "zakat", min: 20, open: "play:zakat-cases",
      title: { en: "Who Can Receive Zakat?", ar: "«من يستحق الزكاة؟»" },
      how: {
        en: "Read each case aloud and let the room vote by raising hands: can receive, cannot, or scholars differ. Then show the explanation. The cases on a mosque, a poor non-Muslim neighbour and a wife's zakat to her husband are good to discuss with a scholar.",
        ar: "اقرأ كل حالة بصوت عالٍ ودع الحاضرين يصوّتون برفع الأيدي: يُعطى، أو لا يُعطى، أو اختلف العلماء. ثم اعرض الشرح. وحالات المسجد، والجار الفقير غير المسلم، وزكاة الزوجة لزوجها مناسبة للنقاش مع عالِم." } },
    { id: "g-budget", icon: "📊", ages: ["adults"], theme: "ethics", min: 15, open: "play:giving-budget",
      title: { en: "A Year of Giving", ar: "«سنة من العطاء»" },
      how: {
        en: "Each person plans a year of giving on the game's made-up income. Compare plans in pairs: what did each person put first, and why? Do not ask about anyone's real income or giving.",
        ar: "يخطط كل شخص لسنة من العطاء بالدخل الافتراضي في اللعبة. ثم يقارن كل اثنين خطتيهما: ماذا قدّم كل منهما أولاً؟ ولماذا؟ ولا تسأل أحداً عن دخله أو عطائه الحقيقي." } },
    { id: "project", icon: "🛠️", ages: ["11-14", "15-18", "adults"], theme: "ethics", min: 30, open: "project", handout: "project",
      title: { en: "Design a charity project", ar: "تصميم مشروع خيري" },
      how: {
        en: "Teams plan a project with the project builder or on the paper planning sheet. Push them on two questions: did they ask the people they want to help, and who will look after the project later? Teams can copy the summary into their report.",
        ar: "تخطط الفرق لمشروع باستعمال أداة تصميم المشروع أو ورقة التخطيط. ركّز على سؤالين: هل سألوا من يريدون مساعدتهم؟ ومن سيرعى المشروع بعد ذلك؟ ويمكن للفرق نسخ ملخص المشروع إلى تقاريرها." } },
    { id: "pitch", icon: "🎤", ages: ["15-18", "adults"], theme: "ethics", min: 20, handout: "rubric",
      title: { en: "Project pitch and peer review", ar: "عرض المشروع وتقييم الزملاء" },
      how: {
        en: "Each team pitches its project in two minutes. The other teams score it with the rubric and give one strength and one question. The team answers the question before the next pitch.",
        ar: "يعرض كل فريق مشروعه في دقيقتين، وتقيّمه الفرق الأخرى بسلّم التقييم، وتذكر نقطة قوة واحدة وسؤالاً واحداً. ويجيب الفريق عن السؤال قبل العرض التالي." } },
    { id: "wall", icon: "🧱", ages: ["7-10", "11-14"], theme: "sadaqah", min: 15, open: "module-d",
      title: { en: "Write for the Community Wall", ar: "الكتابة لجدار المجتمع" },
      how: {
        en: "Read the story writing guidelines on the Community Wall together. Learners write a short story about a kind act they saw or did, without names or private details. Stories are saved only in the browser they were written in.",
        ar: "اقرؤوا إرشادات كتابة الحكاية في «جدار المجتمع» معاً. يكتب المتعلمون حكاية قصيرة عن عمل لطيف رأوه أو قاموا به، بلا أسماء ولا تفاصيل خاصة. تُحفظ الحكايات في المتصفح الذي كُتبت فيه فقط." } },
    { id: "lexicon", icon: "🔤", ages: ["11-14", "15-18", "adults"], theme: "general", min: 10, open: "lexic",
      title: { en: "Word detectives", ar: "محققو الكلمات" },
      how: {
        en: "Give each pair three terms, such as waqf, zakat al-fitr and sadaqah jariyah. Pairs find each term in the lexicon, read how it is used, and explain it to the class in their own words.",
        ar: "أعطِ كل اثنين ثلاثة مصطلحات، مثل: الوقف، وزكاة الفطر، والصدقة الجارية. يبحثان عن كل مصطلح في المعجم، ويقرآن استعماله، ثم يشرحانه للصف بكلماتهما." } },
    { id: "videos", icon: "🎬", ages: ["7-10", "11-14"], theme: "sadaqah", min: 10, open: "helping-hands",
      title: { en: "Helping Hands video", ar: "فيديو «الأيدي المساعدة»" },
      how: {
        en: "Watch the Helping Hands video together. Pause halfway and ask children to guess what happens next, then talk about one way they could help at home or at school.",
        ar: "شاهدوا فيديو «الأيدي المساعدة» معاً. أوقفه في منتصفه واطلب من الأطفال أن يتوقعوا ما سيحدث، ثم تحدثوا عن طريقة واحدة يساعدون بها في البيت أو المدرسة." } },
    { id: "ai-talk", icon: "🤖", ages: ["15-18", "adults"], theme: "media", min: 15,
      title: { en: "AI and charity stories", ar: "الذكاء الاصطناعي وحكايات الخير" },
      how: {
        en: "Ask: if you used an AI tool to write a story about early Islamic charity, what could go wrong? Collect answers, such as invented details, wrong numbers, made-up quotes, or a hadith reference that does not exist. Then look at how this site labels each story and links its sources. Finish by writing three rules for using AI to write about religion or charity.",
        ar: "اسأل: لو استعملت أداة ذكاء اصطناعي لكتابة حكاية عن العطاء في صدر الإسلام، فما الذي قد يقع من أخطاء؟ اجمع الإجابات، مثل: تفاصيل مختلَقة، وأرقام خاطئة، وأقوال لم تُقل، وإحالة إلى حديث غير موجود. ثم انظروا كيف يذكر هذا الموقع حالة توثيق كل حكاية ويربط مصادرها. واختموا بكتابة ثلاث قواعد لاستعمال الذكاء الاصطناعي في الكتابة عن الدين أو العمل الخيري." } },
    { id: "scholar-qa", icon: "🕌", ages: ["15-18", "adults"], theme: "zakat", min: 15,
      title: { en: "Questions for the scholar", ar: "أسئلة للعالِم" },
      how: {
        en: "Collect questions on paper during the session, without names. The scholar answers a few, explains where the schools differ, and says which view the local community follows. The 'For scholars' tab lists every point the games mark as 'scholars differ'.",
        ar: "اجمع الأسئلة على أوراق خلال الجلسة دون أسماء. يجيب العالِم عن بعضها، ويبيّن مواضع اختلاف المذاهب، ويذكر الرأي الذي يتبعه المجتمع المحلي. وفي تبويب «للعلماء» قائمة بكل المسائل التي تقول عنها الألعاب: «يختلف العلماء»." } },
  ];

  /* ----------------------------- Workshop kits -------------------------- */
  const KITS = [
    { id: "k1", icon: "🌱", ages: ["7-10"], theme: "sadaqah",
      title: { en: "Small Deeds, Big Rewards", ar: "أعمال صغيرة وأجر كبير" },
      group: { en: "Whole class, then pairs", ar: "الصف كله، ثم أزواج" },
      summary: { en: "Children learn that charity is more than money, through a story, two short games and a pledge.", ar: "يتعلم الأطفال أن الصدقة أوسع من المال، من خلال حكاية ولعبتين قصيرتين وعهد." },
      goals: {
        en: ["Name three kinds of charity that need no money.", "Retell the story of the generous farmer in their own words.", "Choose one small act to do this week."],
        ar: ["أن يذكر الطفل ثلاثة أنواع من الصدقة لا تحتاج إلى مال.", "أن يعيد رواية حكاية المزارع الكريم بكلماته.", "أن يختار عملاً صغيراً يقوم به هذا الأسبوع."] },
      prepare: {
        en: ["A projector or large screen, and one device for every two children.", "On each device, choose the language and the 7–10 age group before class.", "Print the kindness pledge, one per child.", "Read Story 17, The Generous Farmer and the Divine Rain, once yourself."],
        ar: ["جهاز عرض أو شاشة كبيرة، وجهاز لكل طفلين.", "اختر اللغة والفئة العمرية 7–10 على كل جهاز قبل الحصة.", "اطبع ورقة عهد اللطف، واحدة لكل طفل.", "اقرأ بنفسك الحكاية 17: المزارع الكريم والمطر الإلهي."] },
      agenda: [
        { a: "warmup", min: 7, note: { en: "Keep to examples from the children's own day: sharing, helping at home, smiling.", ar: "اقتصر على أمثلة من يوم الأطفال: المشاركة، والمساعدة في البيت، والابتسامة." } },
        { a: "story-read", min: 12, open: "story:17", note: { en: "Read Story 17. Ask: into how many parts did the gardener divide his harvest, and who got each part?", ar: "اقرأ الحكاية 17، واسأل: إلى كم قسم قسّم صاحب الحديقة محصوله؟ ولمن كان كل قسم؟" } },
        { a: "g-match", min: 10 },
        { a: "g-tree", min: 8 },
        { a: "pledge", min: 6 },
        { a: "exit", min: 2, note: { en: "At this age, ask for a drawing of the act they chose instead of writing.", ar: "في هذه السن اطلب رسماً للعمل الذي اختاروه بدل الكتابة." } },
      ],
      questions: {
        en: ["Why do you think the cloud watered that garden?", "What can you give if you have no money?", "Which card in Charity Match surprised you?", "How do you feel after you help someone?"],
        ar: ["لماذا سقت السحابة تلك الحديقة في رأيك؟", "ماذا يمكنك أن تعطي إن لم يكن معك مال؟", "أي بطاقة في «مطابقة الخير» فاجأتك؟", "بماذا تشعر بعد أن تساعد أحداً؟"] },
      extend: {
        en: ["Use the daily challenge as homework for a week.", "Children draw their act for the Community Wall, or an adult types a short version for them."],
        ar: ["استعمل تحدي اليوم واجباً منزلياً لمدة أسبوع.", "يرسم الأطفال العمل الذي قاموا به لجدار المجتمع، أو يكتب أحد الكبار نسخة قصيرة عنهم."] },
      care: {
        en: ["Do not ask children what their families give or earn.", "Some children may be the ones receiving help. Talk about giving and receiving with the same respect.", "Keep to small, safe acts that children can do themselves."],
        ar: ["لا تسأل الأطفال عمّا تعطيه أسرهم أو تكسبه.", "قد يكون بعض الأطفال ممن يتلقّون المساعدة، فتحدث عن العطاء والأخذ بالاحترام نفسه.", "اقتصر على أعمال صغيرة آمنة يستطيع الأطفال القيام بها بأنفسهم."] },
      handouts: ["pledge", "exit", "certificate"] },

    { id: "k2", icon: "🏗️", ages: ["11-14"], theme: "ethics",
      title: { en: "Building a Fair Community", ar: "نبني مجتمعاً عادلاً" },
      group: { en: "Groups of four, one device each", ar: "مجموعات من أربعة، لكل مجموعة جهاز" },
      summary: { en: "Students run a community budget for three years, then sort zakat cases into the eight groups in Qur'an 9:60.", ar: "يدير الطلاب ميزانية مجتمع ثلاث سنوات، ثم يصنّفون حالات الزكاة في الأصناف الثمانية في آية التوبة 60." },
      goals: {
        en: ["Explain why a project needs upkeep after it is built.", "Name the eight groups who can receive zakat.", "Give a reason for a group decision and listen to the reasons of others."],
        ar: ["أن يشرح الطالب لماذا يحتاج المشروع إلى رعاية بعد إنشائه.", "أن يذكر الأصناف الثمانية الذين يستحقون الزكاة.", "أن يعلّل قرار مجموعته ويستمع إلى تعليلات غيره."] },
      prepare: {
        en: ["One device per group of four, set to 11–14.", "Write the four roles on the board: treasurer, planner, community voice, recorder.", "Print the zakat sorting sheet if some groups will work on paper.", "Read Story 28, the tribe of Mudar, once yourself."],
        ar: ["جهاز لكل مجموعة من أربعة، على الفئة 11–14.", "اكتب الأدوار الأربعة على اللوح: أمين الصندوق، والمخطِّط، وصوت المجتمع، والمقرِّر.", "اطبع ورقة تصنيف الزكاة إن كانت بعض المجموعات ستعمل على الورق.", "اقرأ بنفسك الحكاية 28 عن قبيلة مضر."] },
      agenda: [
        { a: "warmup", min: 5, note: { en: "Variation: ask 'What does a fair community look like?'", ar: "صيغة أخرى: اسأل «كيف يبدو المجتمع العادل؟»" } },
        { a: "g-community", min: 25 },
        { a: "g-sortzakat", min: 15 },
        { a: "story-read", min: 10, open: "story:28", note: { en: "Read Story 28. Ask: what did the Prophet ﷺ do when he saw people in need, and how did the community answer?", ar: "اقرأ الحكاية 28، واسأل: ماذا فعل النبي ﷺ حين رأى المحتاجين؟ وكيف استجاب الناس؟" } },
        { a: "exit", min: 5 },
      ],
      questions: {
        en: ["Which project did your group drop, and why?", "What happened when there was no money left for upkeep?", "Why might the Qur'an name the groups who receive zakat?", "Who in your community could be left out of a plan like yours?"],
        ar: ["أي مشروع تخلّت عنه مجموعتك؟ ولماذا؟", "ماذا حدث حين لم يبقَ مال للصيانة؟", "لماذا قد يحدد القرآن الأصناف الذين يستحقون الزكاة؟", "من في مجتمعك قد لا تصل إليه خطة كخطتكم؟"] },
      extend: {
        en: ["Groups design one project for their own neighbourhood in the project builder.", "Invite someone from a licensed charity to explain how they choose projects."],
        ar: ["تصمّم كل مجموعة مشروعاً لحيّها في أداة تصميم المشروع.", "ادعُ شخصاً من جمعية خيرية مرخّصة ليشرح كيف تختار مشاريعها."] },
      care: {
        en: ["Keep zakat cases fictional. Do not use real families from the school or neighbourhood.", "Where the game accepts two answers, say that scholars explain the groups in different ways."],
        ar: ["اجعل حالات الزكاة متخيَّلة، ولا تستعمل أسراً حقيقية من المدرسة أو الحي.", "حين تقبل اللعبة إجابتين، اذكر أن العلماء يفسّرون الأصناف بطرق مختلفة."] },
      handouts: ["zakat-sort", "zakat-key", "exit"] },

    { id: "k3", icon: "⚖️", ages: ["15-18"], theme: "ethics",
      title: { en: "Hard Choices in Giving", ar: "خيارات صعبة في العطاء" },
      group: { en: "Whole class with movement, then groups of three", ar: "الصف كله مع الحركة، ثم مجموعات من ثلاثة" },
      summary: { en: "Students debate giving dilemmas, play a fundraising path to its end, check charity appeals and start a project of their own.", ar: "يتناقش الطلاب في معضلات العطاء، ويلعبون مساراً لجمع التبرعات حتى نهايته، ويتحققون من نداءات التبرع، ويبدؤون مشروعاً خاصاً بهم." },
      goals: {
        en: ["Weigh two good options and explain the trade-off.", "Spot warning signs in a charity appeal.", "Start a realistic project plan with a partner and a way to measure results."],
        ar: ["أن يوازن الطالب بين خيارين حسنين ويشرح ما يكسبه وما يخسره.", "أن يكتشف علامات التحذير في نداء التبرع.", "أن يبدأ خطة مشروع واقعية لها شريك وطريقة لقياس النتائج."] },
      prepare: {
        en: ["Mark one side of the room A and the other side B for the dilemma activity.", "One device per group of three, set to 15–18.", "Print the charity check-up checklist and the project planning sheet."],
        ar: ["ضع على أحد جانبي الغرفة الحرف (أ) وعلى الآخر الحرف (ب) لنشاط المعضلة.", "جهاز لكل مجموعة من ثلاثة، على الفئة 15–18.", "اطبع قائمة التحقق قبل التبرع وورقة تخطيط المشروع."] },
      agenda: [
        { a: "warmup", min: 5, note: { en: "Variation: ask 'Is all giving equally good?' and take a quick show of hands.", ar: "صيغة أخرى: اسأل «هل كل عطاء حسن بالقدر نفسه؟» واطلب رفع الأيدي سريعاً." } },
        { a: "g-dilemma", min: 20 },
        { a: "g-path", min: 15 },
        { a: "g-check", min: 15 },
        { a: "project", min: 15, note: { en: "Start the plan in class. Teams finish it as homework and pitch it next session.", ar: "ابدؤوا الخطة في الحصة، ويكملها كل فريق في البيت ويعرضها في الجلسة التالية." } },
        { a: "exit", min: 5 },
      ],
      questions: {
        en: ["When two good causes compete, what should come first?", "Is it better to give a little to many or a lot to one?", "Which warning sign in Check the Charity is easiest to miss?", "How would you know if your project worked?"],
        ar: ["حين يتزاحم عملان حسنان، أيهما يُقدَّم؟", "أيهما أفضل: أن تعطي قليلاً لكثيرين أم كثيراً لواحد؟", "أي علامة تحذير في «تحقّق من الجمعية» يسهل أن تفوتك؟", "كيف ستعرف أن مشروعك نجح؟"] },
      extend: {
        en: ["Next session: project pitches with the rubric.", "Students compare two real charities' annual reports, using the checklist."],
        ar: ["في الجلسة التالية: عروض المشاريع مع سلّم التقييم.", "يقارن الطلاب التقريرين السنويين لجمعيتين حقيقيتين مستعينين بقائمة التحقق."] },
      care: {
        en: ["Do not ask students to give money or bring donations.", "If the class decides to raise funds, work through a licensed charity and get the school's approval."],
        ar: ["لا تطلب من الطلاب أن يتبرعوا بمال أو يحضروا تبرعات.", "إن قرر الصف جمع تبرعات، فليكن ذلك عن طريق جمعية مرخّصة وبموافقة المدرسة."] },
      handouts: ["checklist", "project", "rubric", "exit"] },

    { id: "k4", icon: "🏛️", ages: ["15-18", "adults"], theme: "waqf",
      title: { en: "Waqf: Giving That Lasts", ar: "الوقف: عطاء يدوم" },
      group: { en: "Groups of three or four", ar: "مجموعات من ثلاثة أو أربعة" },
      summary: { en: "Learners meet a famous waqf story, design their own waqf, test its numbers in the simulator and fund proposals as a committee.", ar: "يتعرّف المتعلمون على حكاية وقف مشهورة، ويصمّمون وقفهم، ويختبرون أرقامه في المحاكي، ويموّلون مقترحات بصفتهم لجنة." },
      goals: {
        en: ["Explain what a waqf is and why it can keep giving.", "Separate what an authenticated report says from details added later.", "Judge proposals on need, upkeep and evidence."],
        ar: ["أن يشرح المتعلم معنى الوقف ولماذا يستمر عطاؤه.", "أن يميّز ما يذكره الحديث الصحيح من التفاصيل التي أضيفت لاحقاً.", "أن يحكم على المقترحات بحسب الحاجة والرعاية والدليل."] },
      prepare: {
        en: ["Read Story 02, The Well of Rumah, and its sources.", "One device per group of three or four.", "Try the waqf simulator and its sliders once before class."],
        ar: ["اقرأ الحكاية 02: بئر رومة، ومصادرها.", "جهاز لكل مجموعة من ثلاثة أو أربعة.", "جرّب محاكي الوقف ومؤشراته مرة قبل الحصة."] },
      agenda: [
        { a: "story-read", min: 10, open: "story:02", note: { en: "Read Story 02. Point out what Sahih al-Bukhari 2778 reports, and which details the story says come from later history books.", ar: "اقرأ الحكاية 02، وبيّن ما يرويه صحيح البخاري 2778، وما التفاصيل التي تذكر الحكاية أنها من كتب التاريخ المتأخرة." } },
        { a: "g-waqf", min: 20 },
        { a: "sim", min: 15, open: "module-b:waqf", note: { en: "Use the waqf simulator. Ask groups to change the yearly return and the share of income given out, then compare the years.", ar: "استعمل محاكي الوقف، واطلب من المجموعات تغيير العائد السنوي ونسبة الريع الموزَّع، ثم المقارنة بين السنوات." } },
        { a: "g-grant", min: 25 },
        { a: "exit", min: 5 },
      ],
      questions: {
        en: ["Why are a well, a school and a hospital common examples of sadaqah jariyah?", "Who should manage a waqf, and what can go wrong?", "What does the simulator leave out?", "Which proposal in Grant Committee would you fund with your own money?"],
        ar: ["لماذا تُضرب البئر والمدرسة والمستشفى أمثلةً للصدقة الجارية؟", "من ينبغي أن يدير الوقف؟ وما الذي قد يسوء؟", "ما الذي يُغفله المحاكي؟", "أي مقترح في «لجنة المنح» كنت ستموّله من مالك؟"] },
      extend: {
        en: ["Read Story 41 (Qalawun's hospital) or Story 24 (caravanserais) and compare it with the waqf you designed.", "Invite someone who manages a waqf or an endowment to speak."],
        ar: ["اقرأ الحكاية 41 (بيمارستان قلاوون) أو الحكاية 24 (الخانات) وقارنها بالوقف الذي صمّمته.", "ادعُ شخصاً يدير وقفاً ليتحدث إلى المتعلمين."] },
      care: {
        en: ["Present the details of old waqf stories with their evidence labels.", "Simulator returns are examples, not advice about real investments."],
        ar: ["اعرض تفاصيل حكايات الأوقاف القديمة مع حالة توثيقها.", "العوائد في المحاكي أمثلة، وليست نصيحة في استثمار حقيقي."] },
      handouts: ["project", "exit", "certificate"] },

    { id: "k5", icon: "🧾", ages: ["adults"], theme: "zakat",
      title: { en: "Zakat in Practice", ar: "الزكاة في التطبيق" },
      group: { en: "Adults in groups of three, best co-led with a scholar", ar: "الكبار في مجموعات من ثلاثة، ويُستحسن أن يشارك في قيادتها عالِم" },
      summary: { en: "Adults work out zakat for three made-up households, decide who can receive it, and bring their questions to a scholar.", ar: "يحسب الكبار زكاة ثلاث أسر افتراضية، ويحددون من يستحقها، ويعرضون أسئلتهم على عالِم." },
      goals: {
        en: ["Work out zakat on cash, savings, gold and business stock for a simple case.", "Know which assets usually do not count.", "Know where the schools differ, and which view the local community follows."],
        ar: ["أن يحسب المتعلم الزكاة في النقد والمدخرات والذهب وعروض التجارة في حالة بسيطة.", "أن يعرف الأموال التي لا تدخل عادة في الحساب.", "أن يعرف مواضع اختلاف المذاهب، والرأي الذي يتبعه المجتمع المحلي."] },
      prepare: {
        en: ["Invite a scholar, or someone from a zakat authority you trust, to co-lead.", "Agree with the scholar beforehand which nisab and which views on jewellery and debts you will present.", "Set the example gold and silver prices in Zakat Check to today's prices.", "Paper slips and a box for questions without names."],
        ar: ["ادعُ عالماً أو شخصاً من جهة زكاة تثق بها ليشارك في القيادة.", "اتفق مع العالِم مسبقاً على النصاب الذي ستعتمدونه وعلى الرأي في الحلي والديون.", "اجعل أسعار الذهب والفضة في «احسب الزكاة» مطابقة لأسعار اليوم.", "أوراق صغيرة وصندوق للأسئلة دون أسماء."] },
      agenda: [
        { a: "warmup", min: 5, note: { en: "Variation: ask what people already know about zakat, and collect questions on slips for later.", ar: "صيغة أخرى: اسأل عمّا يعرفه الحاضرون عن الزكاة، واجمع الأسئلة على أوراق لما بعد." } },
        { a: "g-zakatcheck", min: 25 },
        { a: "g-zakatcases", min: 25 },
        { a: "scholar-qa", min: 15 },
        { a: "g-budget", min: 15 },
        { a: "exit", min: 5 },
      ],
      questions: {
        en: ["Why does zakat have a nisab and a waiting year?", "Why might scholars differ on worn jewellery?", "Why can't zakat go to your own parents or children?", "What would you ask a charity before giving it your zakat?"],
        ar: ["لماذا جُعل للزكاة نصاب وحَوْل؟", "لماذا قد يختلف العلماء في زكاة الحلي الملبوسة؟", "لماذا لا تُعطى الزكاة للوالدين والأولاد؟", "ماذا ستسأل الجمعية قبل أن تعطيها زكاتك؟"] },
      extend: {
        en: ["Learners check their own zakat in private with a zakat authority or a scholar.", "Use Check the Charity to talk about choosing where to pay zakat."],
        ar: ["يراجع كل متعلم زكاته على انفراد مع جهة زكاة أو عالِم.", "استعمل «تحقّق من الجمعية» للحديث عن اختيار الجهة التي تُدفع إليها الزكاة."] },
      care: {
        en: ["Never ask anyone about their own wealth or zakat. Use the made-up households only.", "Say clearly that the games are not a fatwa.", "Give the local view, and say where other views exist."],
        ar: ["لا تسأل أحداً عن ماله أو زكاته أبداً، واقتصر على الأسر الافتراضية.", "قل بوضوح إن الألعاب ليست فتوى.", "اذكر الرأي المعتمد محلياً، وبيّن أن هناك آراء أخرى."] },
      handouts: ["zakat-sort", "zakat-key", "checklist", "exit"] },

    { id: "k6", icon: "🤖", ages: ["15-18", "adults"], theme: "media",
      title: { en: "Evidence, Numbers and AI", ar: "الدليل والأرقام والذكاء الاصطناعي" },
      group: { en: "Groups of three; suits university media and AI courses", ar: "مجموعات من ثلاثة، ويناسب مقررات الإعلام والذكاء الاصطناعي في الجامعة" },
      summary: { en: "Learners check the evidence behind charity stories, test the numbers behind appeals, and set rules for using AI to write about religion and giving.", ar: "يتحقق المتعلمون من الأدلة وراء حكايات الخير، ويختبرون الأرقام في نداءات التبرع، ويضعون قواعد لاستعمال الذكاء الاصطناعي في الكتابة عن الدين والعطاء." },
      goals: {
        en: ["Read an evidence label and follow a source.", "Explain how one assumption can change an impact claim.", "Write rules for checking AI-written text before sharing it."],
        ar: ["أن يقرأ المتعلم حالة التوثيق ويتتبع المصدر.", "أن يشرح كيف يغيّر افتراض واحد ادعاءً عن الأثر.", "أن يكتب قواعد لمراجعة النصوص المكتوبة بالذكاء الاصطناعي قبل نشرها."] },
      prepare: {
        en: ["Print the evidence hunt sheet, one per group.", "Choose four stories with different evidence labels (suggested: 02, 03, 22 and 12).", "One device per group of three."],
        ar: ["اطبع ورقة البحث عن الدليل، واحدة لكل مجموعة.", "اختر أربع حكايات بحالات توثيق مختلفة (مقترح: 02، 03، 22، 12).", "جهاز لكل مجموعة من ثلاثة."] },
      agenda: [
        { a: "evidence-hunt", min: 20 },
        { a: "retell", min: 10 },
        { a: "sim", min: 15 },
        { a: "g-check", min: 15 },
        { a: "ai-talk", min: 10 },
        { a: "exit", min: 5 },
      ],
      questions: {
        en: ["What is the difference between 'Authenticated hadith cited' and 'Historical tradition; details may vary'?", "Why do impressive numbers spread faster than careful ones?", "Which slider changed the result the most?", "Who is responsible when an AI tool invents a source: the tool or the person who shares it?"],
        ar: ["ما الفرق بين «حديث صحيح موثق» و«رواية تاريخية؛ قد تختلف تفاصيلها»؟", "لماذا تنتشر الأرقام المبهرة أسرع من الأرقام الحذرة؟", "أي مؤشر غيّر النتيجة أكثر من غيره؟", "من المسؤول حين تختلق أداة ذكاء اصطناعي مصدراً: الأداة أم الشخص الذي ينشره؟"] },
      extend: {
        en: ["Learners pick a real charity post from social media and check its claims with the checklist.", "Learners write a short story for the Community Wall, with sources and an evidence label of their own."],
        ar: ["يختار المتعلمون منشوراً خيرياً حقيقياً من وسائل التواصل ويتحققون من ادعاءاته بقائمة التحقق.", "يكتب المتعلمون حكاية قصيرة لجدار المجتمع، ومعها مصادرها وحالة توثيق من وضعهم."] },
      care: {
        en: ["Keep the focus on checking claims, not on judging any real charity or person.", "When you discuss hadith grading, let a scholar or the cited collection be the authority."],
        ar: ["اجعل التركيز على التحقق من الادعاءات، لا على الحكم على جمعية أو شخص حقيقي.", "عند الحديث عن درجة الحديث، اجعل المرجع عالِماً أو كتاب الحديث المذكور."] },
      handouts: ["evidence", "checklist", "exit"] },
  ];

  /* ----------------------------- Guidelines ----------------------------- */
  const GUIDE = [
    { id: "before", icon: "🧰", title: { en: "Before you start", ar: "قبل أن تبدأ" }, items: {
      en: ["Try each activity yourself first, in the language you will teach in.",
        "On each device, choose the language and the age group before class. The age group decides which games appear.",
        "Use the language button at the top to switch between Arabic and English at any point. Handouts print in the language on screen.",
        "Stars, badges and saved projects are kept in each browser. On shared computers, earlier classes' progress may still show.",
        "Videos play from YouTube. Check that YouTube is not blocked on the school network."],
      ar: ["جرّب كل نشاط بنفسك أولاً، باللغة التي ستدرّس بها.",
        "اختر اللغة والفئة العمرية على كل جهاز قبل الحصة، فالفئة العمرية تحدد الألعاب التي تظهر.",
        "استعمل زر اللغة في الأعلى للتبديل بين العربية والإنجليزية في أي وقت. وتُطبع أوراق العمل باللغة الظاهرة على الشاشة.",
        "تُحفظ النجوم والأوسمة والمشاريع في كل متصفح على حدة، فقد يظهر على الأجهزة المشتركة تقدّم صفوف سابقة.",
        "تُعرض مقاطع الفيديو من يوتيوب، فتأكد أن يوتيوب غير محجوب في شبكة المدرسة."] } },
    { id: "care", icon: "🤲", title: { en: "Teaching with care", ar: "التعليم بعناية" }, items: {
      en: ["Each story has an evidence label. Teach a 'historical tradition' as a tradition, and tell learners so.",
        "The site is not a fatwa. Where scholars differ, the games say so. Tell learners which view your community follows, or ask a scholar to.",
        "Costs, results and prices on the site are examples for learning. They are not figures from real projects.",
        "Never ask learners about their family's income, wealth, zakat or donations. The games use made-up people for this reason.",
        "Do not pressure anyone to give. If a class wants to raise money, work through a licensed charity and follow your school's rules. In Qatar, charitable activity is regulated by the Regulatory Authority for Charitable Activities (RACA).",
        "Speak about people who receive help with respect. Some learners may be among them.",
        "Your class may include learners of other faiths. Present the material as learning about Islamic giving, and invite everyone to share what kindness looks like in their own life."],
      ar: ["لكل حكاية حالة توثيق. فعلّم «الرواية التاريخية» على أنها رواية، وأخبر المتعلمين بذلك.",
        "الموقع ليس فتوى، والألعاب تذكر مواضع اختلاف العلماء. أخبر المتعلمين بالرأي الذي يتبعه مجتمعكم، أو اطلب ذلك من عالِم.",
        "التكاليف والنتائج والأسعار في الموقع أمثلة للتعلم، وليست أرقاماً من مشاريع حقيقية.",
        "لا تسأل المتعلمين أبداً عن دخل أسرهم أو أموالها أو زكاتها أو تبرعاتها، ولهذا تستعمل الألعاب أشخاصاً افتراضيين.",
        "لا تضغط على أحد ليتبرع. وإن أراد الصف جمع تبرعات، فليكن ذلك عن طريق جمعية مرخّصة ووفق أنظمة المدرسة. وفي قطر تنظّم العملَ الخيري هيئةُ تنظيم الأعمال الخيرية.",
        "تحدث عمّن يتلقّون المساعدة باحترام، فقد يكون بعض المتعلمين منهم.",
        "قد يكون في صفك متعلمون من أديان أخرى. فاعرض المادة على أنها تعرّف بالعطاء في الإسلام، وادعُ الجميع إلى الحديث عن صور اللطف في حياتهم."] } },
    { id: "run", icon: "🧑‍🏫", title: { en: "Running the session", ar: "إدارة الجلسة" }, items: {
      en: ["Groups of three or four per device work well. Give roles: one taps, one reads aloud, one records, one reports back. Swap roles each round.",
        "Show the first round of a game on the projector before groups play.",
        "Every game opens with a 'How to play' line, and the ? Help button explains each section of the site.",
        "Pause a game at a good moment and ask a question from the kit. Use think, pair, share: a moment alone, then a partner, then a few answers to the class.",
        "When you open a game from a kit, a 'Back to the kit' button brings you back here."],
      ar: ["تنجح المجموعات من ثلاثة أو أربعة لكل جهاز. وزّع الأدوار: واحد يضغط، وواحد يقرأ بصوت عالٍ، وواحد يسجّل، وواحد يعرض على الصف. وبدّلوا الأدوار في كل جولة.",
        "اعرض الجولة الأولى من اللعبة على الشاشة قبل أن تلعب المجموعات.",
        "تبدأ كل لعبة بسطر «طريقة اللعب»، ويشرح زر «؟ مساعدة» كل قسم من أقسام الموقع.",
        "أوقف اللعبة في لحظة مناسبة واطرح سؤالاً من الحقيبة، بطريقة فكّر، ثم ناقش زميلك، ثم شارك الصف.",
        "حين تفتح لعبة من حقيبة، يعيدك زر «العودة إلى الحقيبة» إلى هنا."] } },
    { id: "ages", icon: "🎯", title: { en: "Adapting by age", ar: "التكييف حسب العمر" }, items: {
      en: ["7–10: short rounds, reading aloud and movement. Ask for drawings rather than writing.",
        "11–14: roles and team decisions. Ask groups to give a reason for each choice.",
        "15–18: debate, evidence and trade-offs. Let students disagree, then ask what would change their mind.",
        "Adults and university: zakat in practice with a scholar, media and AI literacy, and project design with real partners."],
      ar: ["7–10: جولات قصيرة، وقراءة بصوت عالٍ، وحركة. واطلب رسومات بدل الكتابة.",
        "11–14: أدوار وقرارات جماعية. واطلب من كل مجموعة أن تعلّل كل اختيار.",
        "15–18: نقاش وأدلة وموازنات. دع الطلاب يختلفون، ثم اسأل: ما الذي قد يغيّر رأيك؟",
        "الكبار والجامعة: الزكاة في التطبيق مع عالِم، والتربية الإعلامية وفهم الذكاء الاصطناعي، وتصميم مشاريع مع شركاء حقيقيين."] } },
    { id: "after", icon: "📝", title: { en: "After the session", ar: "بعد الجلسة" }, items: {
      en: ["Read the exit tickets and start the next session with two of the questions.",
        "Use the daily challenge as homework.",
        "Learners can copy their project summary into an assignment, or fill in the paper planning sheet.",
        "Print certificates of participation from the Handouts tab.",
        "If you find a mistake in a story or a game, please tell the project team at Northwestern University in Qatar."],
      ar: ["اقرأ بطاقات الخروج وابدأ الجلسة التالية بسؤالين منها.",
        "استعمل تحدي اليوم واجباً منزلياً.",
        "يمكن للمتعلمين نسخ ملخص مشاريعهم إلى واجباتهم، أو ملء ورقة التخطيط.",
        "اطبع شهادات المشاركة من تبويب «أوراق العمل».",
        "إن وجدت خطأً في حكاية أو لعبة، فأخبر فريق المشروع في جامعة نورثوسترن في قطر."] } },
  ];

  /* ----------------------------- Handouts ------------------------------- */
  const HANDOUTS = [
    { id: "pledge", icon: "✍️", ages: ["7-10", "11-14"], title: { en: "Kindness pledge", ar: "عهد اللطف" },
      desc: { en: "Small deeds from the daily challenges to tick and sign.", ar: "أعمال صغيرة من التحديات اليومية يختارها الطفل ويوقّع." } },
    { id: "exit", icon: "🎟️", ages: ALL, title: { en: "Exit ticket", ar: "بطاقة الخروج" },
      desc: { en: "Two tickets per page: learned, still wondering, will do.", ar: "بطاقتان في كل صفحة: تعلّمت، وما زلت أتساءل، وسأفعل." } },
    { id: "zakat-sort", icon: "⚖️", ages: ["11-14", "15-18", "adults"], title: { en: "Zakat sorting sheet", ar: "ورقة تصنيف الزكاة" },
      desc: { en: "The fourteen cases from Sort the Zakat, with the eight groups of Qur'an 9:60.", ar: "الحالات الأربع عشرة من «رتّب الزكاة» مع الأصناف الثمانية في آية التوبة 60." } },
    { id: "zakat-key", icon: "🔑", ages: ["11-14", "15-18", "adults"], title: { en: "Zakat sorting answer key (teacher)", ar: "مفتاح إجابات تصنيف الزكاة (للمعلم)" },
      desc: { en: "Accepted answers and short explanations from the game.", ar: "الإجابات المقبولة وشرحها المختصر من اللعبة." } },
    { id: "evidence", icon: "🔎", ages: ["11-14", "15-18", "adults"], title: { en: "Evidence hunt sheet", ar: "ورقة البحث عن الدليل" },
      desc: { en: "Label, sources, what is sure and what is uncertain, for four stories.", ar: "حالة التوثيق والمصادر والمؤكد وغير المؤكد، لأربع حكايات." } },
    { id: "checklist", icon: "✅", ages: ["15-18", "adults"], title: { en: "Charity check-up checklist", ar: "قائمة التحقق قبل التبرع" },
      desc: { en: "Good signs and warning signs to check before giving.", ar: "علامات الثقة وعلامات التحذير قبل التبرع." } },
    { id: "project", icon: "🛠️", ages: ["11-14", "15-18", "adults"], title: { en: "Project planning sheet", ar: "ورقة تخطيط المشروع" },
      desc: { en: "The project builder's questions on paper.", ar: "أسئلة أداة تصميم المشروع على الورق." } },
    { id: "rubric", icon: "📋", ages: ["15-18", "adults"], title: { en: "Project pitch rubric", ar: "سلّم تقييم عرض المشروع" },
      desc: { en: "Seven criteria scored 1 to 4, plus a strength and a question.", ar: "سبعة معايير تُقيَّم من 1 إلى 4، مع نقطة قوة وسؤال." } },
    { id: "certificate", icon: "🏅", ages: ALL, title: { en: "Certificate of participation", ar: "شهادة مشاركة" },
      desc: { en: "Add the workshop title and date below, then print.", ar: "أضف عنوان الورشة وتاريخها أدناه، ثم اطبع." } },
  ];

  const SHEETS = {
    exit: {
      en: ["One thing I learned today", "One question I still have", "One small act I will do this week"],
      ar: ["شيء تعلّمته اليوم", "سؤال ما زال عندي", "عمل صغير سأقوم به هذا الأسبوع"] },
    evidenceCols: {
      en: ["Story (number and title)", "Evidence label", "Sources: what kind?", "What we can say for sure", "What is uncertain or added later"],
      ar: ["الحكاية (رقمها وعنوانها)", "حالة التوثيق", "المصادر: ما نوعها؟", "ما يمكن قوله بيقين", "ما هو غير مؤكد أو أضيف لاحقاً"] },
    evidenceQ: {
      en: "Why do you think each story has the label it has? Which story would you be most careful about retelling, and why?",
      ar: "لماذا حملت كل حكاية حالة التوثيق التي حملتها في رأيكم؟ وأي حكاية ستكونون أشد حذراً في روايتها؟ ولماذا؟" },
    checkGood: {
      en: ["It is licensed, and you can look up its licence number with the regulator.", "It publishes yearly reports and audited accounts.", "It can tell you what your money pays for, and where.", "It explains its running costs.", "It has an address and a phone number you can check.", "It posts updates after a project is done."],
      ar: ["مرخّصة، ويمكنك التحقق من رقم ترخيصها لدى الجهة المنظِّمة.", "تنشر تقارير سنوية وحسابات مدقّقة.", "تستطيع أن تخبرك بما يغطيه مالك وأين.", "تشرح تكاليف تشغيلها.", "لها عنوان ورقم هاتف يمكنك التحقق منهما.", "تنشر ما تمّ بعد انتهاء المشروع."] },
    checkBad: {
      en: ["It wants cash, gift cards or crypto only.", "It rushes you: 'today only', 'last chance'.", "The message was forwarded from a number you don't know.", "It can't say which hospital, school or family the money is for.", "There is no name, website or licence you can find."],
      ar: ["تطلب نقداً أو بطاقات هدايا أو عملات رقمية فقط.", "تستعجلك: «اليوم فقط»، «الفرصة الأخيرة».", "وصلتك الرسالة محوَّلة من رقم لا تعرفه.", "لا تستطيع أن تحدد المستشفى أو المدرسة أو الأسرة التي يذهب إليها المال.", "لا تجد لها اسماً ولا موقعاً ولا ترخيصاً."] },
    checkZakat: {
      en: "Giving zakat through a charity? Ask how it makes sure the money reaches people in the eight groups.",
      ar: "تدفع زكاتك عن طريق جمعية؟ اسألها كيف تضمن وصول المال إلى الأصناف الثمانية." },
    projectQ: {
      en: ["Project name", "Cause (water, food, education, health ...)", "Who will it help, and where?", "One-time help or ongoing (sadaqah jariyah)?", "Budget, and what the money will pay for", "Who will you work with? Is the partner licensed?", "Did you ask the people you want to help what they need? What did they say?", "Who will look after it once it is set up?", "Photos and sharing: how will you protect people's dignity and privacy?", "How will you know it worked?", "Team members"],
      ar: ["اسم المشروع", "المجال (ماء، غذاء، تعليم، صحة ...)", "من سيفيد، وأين؟", "مساعدة لمرة واحدة أم مستمرة (صدقة جارية)؟", "الميزانية، وما الذي سيغطيه المال", "مع من ستعملون؟ وهل الشريك مرخّص؟", "هل سألتم من تريدون مساعدتهم عمّا يحتاجونه؟ وماذا قالوا؟", "من سيرعى المشروع بعد إنشائه؟", "الصور والنشر: كيف ستحفظون كرامة الناس وخصوصيتهم؟", "كيف ستعرفون أنه نجح؟", "أعضاء الفريق"] },
    rubric: {
      en: ["The need is clear, and the team asked the people it wants to help.", "The plan is realistic for the budget.", "Someone will look after the project once it is set up.", "There is a way to know whether it worked.", "It protects people's dignity and privacy.", "It works with a licensed partner.", "Any verse or hadith quoted has a correct source."],
      ar: ["الحاجة واضحة، وسأل الفريقُ من يريد مساعدتهم.", "الخطة واقعية بالنسبة إلى الميزانية.", "هناك من سيرعى المشروع بعد إنشائه.", "هناك طريقة لمعرفة نجاحه.", "يحفظ كرامة الناس وخصوصيتهم.", "يعمل مع شريك مرخّص.", "كل آية أو حديث مذكور له مصدر صحيح."] },
    scale: { en: ["Not yet", "Partly", "Good", "Excellent"], ar: ["ليس بعد", "جزئياً", "جيد", "ممتاز"] },
  };

  /* ----------------------------- For scholars --------------------------- */
  const SCHOLARS = {
    intro: {
      en: "This tab is for scholars, imams and teachers of Islamic studies who use the site with learners. It shows what the site simplifies, the points where it says scholars differ, and every source it cites, so you can check them and give your own guidance.",
      ar: "هذا التبويب للعلماء والأئمة ومعلمي التربية الإسلامية الذين يستعملون الموقع مع المتعلمين. يبيّن ما بسّطه الموقع، والمسائل التي يذكر فيها اختلاف العلماء، وكل المصادر التي يحيل إليها، لتتحققوا منها وتقدموا توجيهكم." },
    simplify: {
      en: ["Sadaqah jariyah is taught through wells, trees, schools and hospitals, based on Sahih Muslim 1631.",
        "Zakat is shown as 2.5% of wealth that reaches the nisab and is held for a lunar year.",
        "Zakat Check covers cash, savings, gold, goods for sale, business cash and saved rent. It leaves out crops, livestock, shares, pensions and long-term debts.",
        "The games for children avoid detailed rulings. Where scholars differ, Sort the Zakat accepts more than one answer.",
        "Stories for children use simple words, and each story keeps its evidence label and its sources."],
      ar: ["تُعلَّم الصدقة الجارية بأمثلة الآبار والأشجار والمدارس والمستشفيات، استناداً إلى صحيح مسلم 1631.",
        "تُعرض الزكاة على أنها 2.5% من المال الذي بلغ النصاب وحال عليه الحول.",
        "تشمل «احسب الزكاة» النقد والمدخرات والذهب وعروض التجارة ونقد التجارة والإيجار المدّخر، ولا تشمل الزروع والأنعام والأسهم ومعاشات التقاعد والديون طويلة الأجل.",
        "تتجنب ألعاب الأطفال تفاصيل الأحكام، وحيث يختلف العلماء تقبل «رتّب الزكاة» أكثر من إجابة.",
        "تُكتب حكايات الأطفال بكلمات بسيطة، وتحتفظ كل حكاية بحالة توثيقها ومصادرها."] },
    differ: [
      { topic: { en: "Nisab: gold or silver", ar: "النصاب: بالذهب أم بالفضة" },
        site: { en: "The learner chooses gold (85 g) or silver (595 g). The game says scholars differ on which to use today.", ar: "يختار المتعلم الذهب (85 غراماً) أو الفضة (595 غراماً)، وتذكر اللعبة أن العلماء يختلفون في أيهما يُعتمد اليوم." },
        where: { en: "Zakat Check", ar: "احسب الزكاة" } },
      { topic: { en: "Gold jewellery that is worn", ar: "الحلي الذهبية الملبوسة" },
        site: { en: "Names the Hanafi view (it counts) and the Maliki, Shafi'i and Hanbali view (it does not), then follows the view the learner picks.", ar: "يذكر رأي الحنفية (تجب فيها الزكاة) ورأي المالكية والشافعية والحنابلة (لا تجب)، ثم يتبع الرأي الذي يختاره المتعلم." },
        where: { en: "Zakat Check", ar: "احسب الزكاة" } },
      { topic: { en: "Subtracting debts", ar: "خصم الديون" },
        site: { en: "Subtracts debts due now, such as this month's bills. Says many zakat bodies allow this and that scholars differ on debts.", ar: "يخصم الديون الحالّة، كفواتير الشهر، ويذكر أن كثيراً من جهات الزكاة تسمح بذلك وأن العلماء يختلفون في الديون." },
        where: { en: "Zakat Check", ar: "احسب الزكاة" } },
      { topic: { en: "A property rented out", ar: "العقار المؤجَّر" },
        site: { en: "Follows the common view: the property itself does not count; rent that has been saved does.", ar: "يتبع الرأي الشائع: لا يدخل العقار نفسه في الحساب، ويدخل الإيجار المدّخر." },
        where: { en: "Zakat Check", ar: "احسب الزكاة" } },
      { topic: { en: "Zakat for building a mosque", ar: "صرف الزكاة في بناء المساجد" },
        site: { en: "Most scholars say no; a few allow it. 'Cannot' and 'Scholars differ' are both accepted. Suggests funding mosques from other charity.", ar: "يرى أكثر العلماء المنع، ويجيزه قليل منهم. وتُقبل الإجابتان «لا يُعطى» و«اختلف العلماء»، مع التنبيه إلى تمويل المساجد من الصدقات الأخرى." },
        where: { en: "Who Can Receive Zakat?, Sort the Zakat", ar: "من يستحق الزكاة؟، رتّب الزكاة" } },
      { topic: { en: "A wife's zakat to her poor husband", ar: "زكاة الزوجة لزوجها الفقير" },
        site: { en: "Scholars differ: some allow it because a wife is not obliged to support her husband; others do not. 'Scholars differ' and 'Can receive' are accepted.", ar: "اختلف العلماء: أجازه بعضهم لأن نفقة الزوج لا تجب على زوجته، ومنعه آخرون. وتُقبل الإجابتان «اختلف العلماء» و«يُعطى»." },
        where: { en: "Who Can Receive Zakat?", ar: "من يستحق الزكاة؟" } },
      { topic: { en: "A poor neighbour who is not Muslim", ar: "الجار الفقير غير المسلم" },
        site: { en: "Most scholars say zakat on wealth goes to Muslims, except the group 'whose hearts are brought closer'. Suggests helping with sadaqah instead. 'Cannot' and 'Scholars differ' are accepted.", ar: "يرى أكثر العلماء أن زكاة المال للمسلمين، إلا صنف المؤلفة قلوبهم، ويقترح مساعدته من الصدقة. وتُقبل الإجابتان «لا يُعطى» و«اختلف العلماء»." },
        where: { en: "Who Can Receive Zakat?", ar: "من يستحق الزكاة؟" } },
      { topic: { en: "The poor and the needy", ar: "الفقراء والمساكين" },
        site: { en: "Scholars explain the difference in different ways, so either group is accepted.", ar: "يفسّر العلماء الفرق بينهما بطرق مختلفة، فيُقبل أي الصنفين." },
        where: { en: "Sort the Zakat", ar: "رتّب الزكاة" } },
      { topic: { en: "'In Allah's cause' and 'freeing people'", ar: "«في سبيل الله» و«في الرقاب»" },
        site: { en: "Gives the explanation of most scholars for 'in Allah's cause', and says many scholars include paying to free captives under 'freeing people'.", ar: "يذكر تفسير أكثر العلماء لـ«في سبيل الله»، ويذكر أن كثيراً من العلماء يُدخلون فداء الأسرى في «الرقاب»." },
        where: { en: "Sort the Zakat", ar: "رتّب الزكاة" } },
      { topic: { en: "Zakat al-fitr paid in money", ar: "إخراج زكاة الفطر نقداً" },
        site: { en: "Says scholars disagree about paying it in money instead of food, and advises following trusted local scholars.", ar: "يذكر أن العلماء اختلفوا في إخراجها نقداً بدل الطعام، وينصح باتباع العلماء الموثوقين محلياً." },
        where: { en: "Story 18", ar: "الحكاية 18" } },
    ],
    guidance: {
      en: ["Before a session, look through the games you will use and note where your view differs from the one shown. Tell the learners.",
        "In Zakat Check, set the prices to today's gold and silver prices and choose the nisab your community uses.",
        "Use the 'scholars differ' cases to teach the etiquette of disagreement: why scholars differ and how to respect other views.",
        "Point learners to a zakat authority or a scholar for their own zakat.",
        "If a reference or a ruling needs correcting, please tell the project team."],
      ar: ["قبل الجلسة، راجع الألعاب التي ستستعملها ولاحظ المواضع التي يخالف فيها رأيك الرأيَ المعروض، وأخبر المتعلمين بذلك.",
        "في «احسب الزكاة»، اجعل أسعار الذهب والفضة مطابقة لأسعار اليوم، واختر النصاب الذي يعتمده مجتمعك.",
        "استعمل حالات «اختلف العلماء» لتعليم أدب الخلاف: لماذا يختلف العلماء، وكيف نحترم الآراء الأخرى.",
        "وجّه المتعلمين إلى جهة زكاة أو عالِم لحساب زكاتهم.",
        "إن احتاجت إحالة أو مسألة إلى تصحيح، فأخبر فريق المشروع."] },
  };

  window.SADAQAH_TEACH = { REF, THEMES, ACTIVITIES, KITS, GUIDE, HANDOUTS, SHEETS, SCHOLARS };
})();
