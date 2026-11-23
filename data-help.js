/* =========================================================================
   Sadaqah Stories — Help page content (EN + AR)
   Each section: id (used in #/help/<id>), icon, title, body (paragraph
   strings or arrays for bullet lists), and optional go (route to open).
   ========================================================================= */
window.SADAQAH_HELP = [
  { id: "start", icon: "🚀", go: "modules",
    title: { en: "Getting started", ar: "البداية" },
    body: {
      en: [
        "Sadaqah Stories teaches Islamic charity through stories, an impact simulator, games and a project planner. It works in English and Arabic, on phones and computers. There are no accounts and nothing to install.",
        ["Press Begin on the home page.", "Choose English or العربية. You can switch language at any time with the button at the top.", "Choose your age group: 7–10, 11–14, 15–18 or Adults. The games change with the age group; the stories and the simulator are the same for everyone.", "You then reach the section page, with today's Sadaqah challenge at the top."],
        "To change your age group later, follow the back links to the age screen, or press the logo to start again.",
      ],
      ar: [
        "يعلّم موقع «حكايات الصدقة» العطاء في الإسلام عبر الحكايات ومحاكي الأثر والألعاب ومخطِّط المشاريع. ويعمل بالعربية والإنجليزية، على الهاتف والحاسوب، دون حسابات ودون تثبيت أي برنامج.",
        ["اضغط «ابدأ» في الصفحة الرئيسية.", "اختر العربية أو English. ويمكنك تغيير اللغة في أي وقت من الزر في الأعلى.", "اختر فئتك العمرية: 7–10 أو 11–14 أو 15–18 أو الكبار. تتغيّر الألعاب بحسب الفئة، أما الحكايات والمحاكي فهي واحدة للجميع.", "ستصل بعد ذلك إلى صفحة الأقسام، وفي أعلاها تحدي الصدقة اليومي."],
        "لتغيير فئتك العمرية لاحقاً، اتبع روابط الرجوع إلى شاشة العمر، أو اضغط الشعار لتبدأ من جديد.",
      ],
    } },
  { id: "navigation", icon: "🧭",
    title: { en: "Moving around", ar: "التنقّل في الموقع" },
    body: {
      en: [[
        "Every screen has a back link at the top that takes you one step up.",
        "Your browser's Back button works too. Every screen has its own address, so you can bookmark it or send it to someone.",
        "The logo at the top takes you to the home page.",
        "The ⭐ counter shows your stars. Press it to see your badges.",
        "The ? button at the top opens this help page. The '? Help' link next to the back link opens the help for the screen you are on.",
      ]],
      ar: [[
        "في أعلى كل شاشة رابط رجوع يعيدك خطوة إلى الوراء.",
        "زر الرجوع في المتصفح يعمل أيضاً. ولكل شاشة عنوانها الخاص، فيمكنك حفظها أو إرسالها لغيرك.",
        "الشعار في الأعلى يعيدك إلى الصفحة الرئيسية.",
        "عدّاد ⭐ يبيّن نجومك، واضغطه لترى أوسمتك.",
        "الزر ؟ في الأعلى يفتح صفحة المساعدة هذه. ورابط «؟ مساعدة» بجانب رابط الرجوع يفتح الشرح الخاص بالشاشة التي أنت فيها.",
      ]],
    } },
  { id: "daily", icon: "🌟", go: "modules",
    title: { en: "Today's Sadaqah challenge", ar: "تحدي الصدقة اليومي" },
    body: {
      en: [
        "Each day the section page shows one small good deed, such as smiling at someone, sharing food or moving something harmful out of the way. Each one comes with the hadith it is based on and a link to check it on sunnah.com.",
        "When you have done it, press 'I did it!' to earn a star. You can earn it once a day, and a new challenge appears the next day.",
      ],
      ar: [
        "تعرض صفحة الأقسام كل يوم عملاً طيباً صغيراً، مثل الابتسامة في وجه أحد، أو مشاركة الطعام، أو إزالة الأذى من الطريق. ومع كل تحدٍّ الحديث الذي يقوم عليه ورابط للتحقق منه على موقع sunnah.com.",
        "عندما تُنجزه اضغط «فعلتُها!» لتكسب نجمة. يمكنك كسبها مرة واحدة في اليوم، ويظهر تحدٍّ جديد في اليوم التالي.",
      ],
    } },
  { id: "stories", icon: "📖", go: "module-a",
    title: { en: "Stories of the Past", ar: "حكايات الماضي" },
    body: {
      en: [
        "41 short stories about people and institutions whose charity is still remembered, from the Well of Rumah to hospitals and libraries funded by waqf. Use the search box to find a name or topic.",
        "Each story is a four-page flipbook. Use the arrows to turn the pages. On the last page you'll find a video, the sources and a three-question quiz. Right answers earn stars, and a wrong answer tells you which page has the answer.",
        "Every story has an 'Evidence status' label, so you know how sure we can be:",
        ["Authenticated hadith cited: based on a hadith from a trusted collection.", "Documented historical or organizational source: based on history books or a charity's own published reports.", "Historical tradition; details may vary: the main story is known, but some details are not certain.", "General historical overview: describes a pattern in history, not one recorded event.", "Educational example: written to teach, not a record of a real event."],
        "The pictures are artistic illustrations, not photographs.",
      ],
      ar: [
        "41 حكاية قصيرة عن أشخاص ومؤسسات ما زال عطاؤهم يُذكر، من بئر رومة إلى المستشفيات والمكتبات الموقوفة. استعمل مربع البحث لتجد اسماً أو موضوعاً.",
        "كل حكاية كتاب مصوّر من أربع صفحات، تقلّبها بالأسهم. وفي الصفحة الأخيرة مقطع فيديو والمصادر واختبار من ثلاثة أسئلة. الإجابة الصحيحة تكسبك نجمة، والإجابة الخاطئة تدلّك على الصفحة التي فيها الجواب.",
        "لكل حكاية «حالة توثيق» تبيّن مدى اليقين بها:",
        ["حديث صحيح موثق: مبنية على حديث من مصدر موثوق.", "مصدر تاريخي أو مؤسسي موثق: مبنية على كتب التاريخ أو تقارير منشورة لجمعية خيرية.", "رواية تاريخية قد تختلف تفاصيلها: أصل الحكاية معروف، لكن بعض تفاصيلها غير مؤكدة.", "عرض تاريخي عام: يصف نمطاً في التاريخ، لا حادثة واحدة مسجّلة.", "مثال تعليمي: كُتب للتعليم، وليس سجلاً لواقعة حقيقية."],
        "الصور رسوم فنية وليست صوراً فوتوغرافية.",
      ],
    } },
  { id: "simulator", icon: "📈", go: "module-b",
    title: { en: "Impact Simulator", ar: "محاكي الأثر" },
    body: {
      en: [
        "Pick a project, such as a water well, a school or a waqf, and see what one donation could become in Years 1, 5, 10 and 20.",
        "Every number is a made-up example for learning, not real project data. Under each project, 'How these numbers are estimated' explains the assumptions and the unit, such as person-years (one person helped for one year).",
        "'Try your own assumptions' has sliders, for example how many people use a well each year or whether it gets maintenance. Move them and the figures change straight away, with the formula shown underneath. 'Back to site values' resets them.",
      ],
      ar: [
        "اختر مشروعاً، كبئر ماء أو مدرسة أو وقف، وانظر ما يمكن أن يصبح عليه تبرع واحد في السنة 1 و5 و10 و20.",
        "كل الأرقام أمثلة افتراضية للتعلّم، وليست بيانات مشاريع حقيقية. وتحت كل مشروع فقرة «كيف قدّرنا هذه الأرقام» التي تشرح الافتراضات والوحدة المستعملة، مثل الشخص-سنة (شخص واحد استفاد سنة واحدة).",
        "وفي «جرّب افتراضاتك» مؤشرات، مثل عدد من يستخدمون البئر كل سنة أو هل تحصل على صيانة. حرّكها فتتغيّر الأرقام فوراً، مع عرض المعادلة تحتها. وزر «إعادة قيم الموقع» يعيدها كما كانت.",
      ],
    } },
  { id: "games", icon: "🎮", go: "module-c",
    title: { en: "Play & Learn", ar: "العب وتعلّم" },
    body: {
      en: [
        "The games depend on your age group:",
        ["7–10: Charity Match, Fill the Donation Box, The Giving Tree, Kindness Catch, Bring the Water, Word Hunt.", "11–14: Build Your Community, Sort the Zakat, Charity Chain Reaction, Bring the Water, Word Hunt, Story Sprint.", "15–18: Waqf Architect, The Giving Dilemma, Real Impact Calculator, Choose Your Path, Check the Charity, Grant Committee, Word Hunt, Story Sprint.", "Adults: Zakat Check, Who Can Receive Zakat?, Check the Charity, A Year of Giving, Grant Committee, plus Waqf Architect, The Giving Dilemma, Real Impact Calculator, Choose Your Path, Word Hunt and Story Sprint."],
        "Games have short sounds. The speaker button beside a game's title turns them off or on. In Fill the Donation Box and Sort the Zakat you can drag as well as tap. Kindness Catch has a gentle speed, and Story Sprint can be played without the clock.",
        "Every game starts with a short 'How to play'. Most games explain each answer, so you learn even when you get it wrong, and finish with a summary of what you learned.",
        "The zakat games follow the views of most scholars and say where scholars differ. They are for learning, not fatwas. For your own zakat, ask a scholar or zakat authority you trust.",
      ],
      ar: [
        "تختلف الألعاب بحسب فئتك العمرية:",
        ["7–10: مطابقة الخير، املأ صندوق التبرع، شجرة العطاء، سلّة الخير، أوصِل الماء، صيد الكلمات.", "11–14: ابنِ مجتمعك، رتّب الزكاة، سلسلة الخير، أوصِل الماء، صيد الكلمات، سباق الحكايات.", "15–18: مهندس الوقف، مُعضلة العطاء، حاسبة الأثر الحقيقي، اختر طريقك، تحقّق من الجمعية، لجنة المنح، صيد الكلمات، سباق الحكايات.", "الكبار: احسب الزكاة، من يستحق الزكاة؟، تحقّق من الجمعية، سنة من العطاء، لجنة المنح، إضافة إلى مهندس الوقف ومُعضلة العطاء وحاسبة الأثر الحقيقي واختر طريقك وصيد الكلمات وسباق الحكايات."],
        "في الألعاب أصوات قصيرة، وزر السماعة بجانب عنوان اللعبة يوقفها أو يشغّلها. في «املأ صندوق التبرع» و«رتّب الزكاة» يمكنك السحب كما يمكنك الضغط. وفي «سلّة الخير» سرعة هادئة، ويمكن لعب «سباق الحكايات» بلا عدّاد.",
        "تبدأ كل لعبة بفقرة قصيرة عن «طريقة اللعب». وتشرح أكثر الألعاب كل إجابة، فتتعلّم حتى حين تخطئ، وتنتهي بخلاصة لما تعلّمته.",
        "تتبع ألعاب الزكاة رأي أكثر العلماء، وتذكر مواضع الخلاف بينهم. وهي للتعلّم وليست فتاوى، ولحساب زكاتك اسأل عالماً أو جهة زكاة تثق بها.",
      ],
    } },
  { id: "project", icon: "🛠️", go: "project",
    title: { en: "Design Your Charity Project", ar: "صمّم مشروعك الخيري" },
    body: {
      en: [
        "Plan your own project: choose a cause, who it will help, a budget, whether it is one-time or ongoing, who you will work with, and how you will know it worked.",
        "Press 'See my project' to get a project card with a rough estimate of what your budget could pay for, your strengths, and tips to make it stronger.",
        "You can save projects, open them again, edit or delete them, and copy a summary to share with a teacher or your family. Saved projects stay in this browser only.",
      ],
      ar: [
        "خطّط لمشروعك: اختر المجال، ومن سيستفيد، والميزانية، وهل المساعدة لمرة واحدة أو مستمرة، ومع من ستعمل، وكيف ستعرف أنها نجحت.",
        "اضغط «اعرض مشروعي» لتحصل على بطاقة مشروع فيها تقدير تقريبي لما تكفيه ميزانيتك، ونقاط القوة، ونصائح لتحسينه.",
        "يمكنك حفظ مشاريعك وفتحها من جديد وتعديلها أو حذفها، ونسخ ملخصها لمشاركته مع معلّمك أو أسرتك. وتبقى المشاريع المحفوظة في هذا المتصفح فقط.",
      ],
    } },
  { id: "wall", icon: "🧱", go: "module-d",
    title: { en: "Community Wall", ar: "جدار المجتمع" },
    body: {
      en: [
        "Start with the writing guidelines: how to tell a giving story with respect for the people in it.",
        "Read the five example stories. They are fictional writing exercises, not real testimonies.",
        "Write your own story (at least 20 words) and press Post. Your story is saved only in this browser; other visitors cannot see it.",
      ],
      ar: [
        "ابدأ بإرشادات الكتابة: كيف تروي قصة عطاء باحترام لأصحابها.",
        "اقرأ القصص الخمس النموذجية. وهي تمارين كتابة تخيلية، لا شهادات واقعية.",
        "اكتب قصتك (20 كلمة على الأقل) واضغط «انشر». تُحفظ قصتك في هذا المتصفح فقط، ولا يراها الزوار الآخرون.",
      ],
    } },
  { id: "helping-hands", icon: "🤲", go: "helping-hands",
    title: { en: "Helping Hands", ar: "الأيدي المساعدة" },
    body: {
      en: ["A short page and video for younger children about Sadaqah, kindness, and Qatari values such as Faz'ah, when everyone rushes to help someone in need."],
      ar: ["صفحة قصيرة ومقطع فيديو للأطفال الصغار عن الصدقة واللطف، وعن قيم قطرية مثل «الفزعة» حين يهبّ الجميع لمساعدة المحتاج."],
    } },
  { id: "lexicon", icon: "📚", go: "lexic",
    title: { en: "Lexicon", ar: "معجم المصطلحات" },
    body: {
      en: ["81 charity terms in Arabic and English, such as waqf, zakat and sadaqah jariyah, with short definitions. Type in the search box to filter the list."],
      ar: ["81 مصطلحاً من مصطلحات العطاء بالعربية والإنجليزية، مثل الوقف والزكاة والصدقة الجارية، مع تعريفات قصيرة. اكتب في مربع البحث لتصفية القائمة."],
    } },
  { id: "progress", icon: "🏅",
    title: { en: "Stars, badges and saving", ar: "النجوم والأوسمة والحفظ" },
    body: {
      en: [
        "You earn stars for reading, playing, answering quizzes and doing the daily challenge. Badges unlock when you finish certain activities, such as clearing all three levels of Charity Match or saving a project.",
        "Your stars, badges, stories and projects are saved in this browser on this device. They are not sent anywhere. If you clear your browser data or use another device, you start again.",
      ],
      ar: [
        "تكسب النجوم بالقراءة واللعب والإجابة عن الاختبارات وإنجاز التحدي اليومي. وتُفتح الأوسمة حين تُنهي أنشطة معيّنة، مثل إنهاء مستويات «مطابقة الخير» الثلاثة أو حفظ مشروع.",
        "تُحفظ نجومك وأوسمتك وقصصك ومشاريعك في هذا المتصفح على هذا الجهاز، ولا تُرسل إلى أي مكان. وإذا مسحت بيانات المتصفح أو استعملت جهازاً آخر فستبدأ من جديد.",
      ],
    } },
  { id: "teachers", icon: "🍎", go: "teach",
    title: { en: "For teachers and parents", ar: "للمعلمين وأولياء الأمور" },
    body: {
      en: [[
        "The Teachers & Workshops section has guidelines, six ready-made workshop kits, an activity bank, a session planner, printable handouts and notes for scholars. Open it from All sections, or from the home page.",
        "Pick the age group that fits your class; you can switch it during a lesson.",
        "Good discussion starters: the trade-off notes in The Giving Dilemma, the endings of Choose Your Path, and the 'a year later' review in Grant Committee.",
        "Ask students to check a story's evidence label and sources before retelling it.",
        "Use the simulator sliders to show how assumptions change a result. It is a good way to talk about the numbers in charity appeals.",
        "Students can copy their project summary into an assignment.",
      ]],
      ar: [[
        "في قسم «للمعلمين وورش العمل» إرشادات، وست حقائب ورش جاهزة، وبنك للأنشطة، ومخطِّط للجلسات، وأوراق عمل للطباعة، وملاحظات للعلماء. افتحه من «كل الأقسام» أو من الصفحة الرئيسية.",
        "اختر الفئة العمرية المناسبة لصفك، ويمكنك تغييرها أثناء الدرس.",
        "منطلقات جيدة للنقاش: ملاحظات الموازنة في «مُعضلة العطاء»، ونهايات «اختر طريقك»، ومراجعة «بعد سنة» في «لجنة المنح».",
        "اطلب من الطلاب التحقق من حالة التوثيق ومصادر الحكاية قبل أن يرووها.",
        "استعمل مؤشرات المحاكي لتبيّن كيف تغيّر الافتراضاتُ النتيجة، فهي مدخل جيد للحديث عن الأرقام في نداءات التبرع.",
        "يستطيع الطلاب نسخ ملخص مشاريعهم إلى واجباتهم.",
      ]],
    } },
  { id: "faq", icon: "❓",
    title: { en: "Questions", ar: "أسئلة شائعة" },
    body: {
      en: [[
        "Are the numbers real? No. Costs and results are examples for learning, and each one explains its assumptions.",
        "Where do the hadith references come from? From well-known collections such as Sahih al-Bukhari and Sahih Muslim. Each link opens the hadith on sunnah.com so you can check it.",
        "Is this a fatwa? No. For questions about your own zakat or other rulings, ask a qualified scholar.",
        "Does the site collect my data? No. There are no accounts, and your progress stays in your browser. Story videos are played from YouTube in its privacy-enhanced mode.",
        "Who made it? The AI Sadaqah Journey project, led by Northwestern University in Qatar and funded by QRDI Council and RACA. See 'About' on the home page.",
      ]],
      ar: [[
        "هل الأرقام حقيقية؟ لا. التكاليف والنتائج أمثلة للتعلّم، ولكل منها شرح لافتراضاته.",
        "من أين تأتي الأحاديث؟ من كتب مشهورة مثل صحيح البخاري وصحيح مسلم. وكل رابط يفتح الحديث على موقع sunnah.com لتتحقق منه.",
        "هل هذه فتوى؟ لا. ولأسئلتك عن زكاتك أو غيرها من الأحكام، اسأل عالماً مؤهلاً.",
        "هل يجمع الموقع بياناتي؟ لا. لا توجد حسابات، ويبقى تقدّمك في متصفحك. وتُعرض مقاطع الحكايات من يوتيوب بوضع الخصوصية المحسّنة.",
        "من صنع الموقع؟ مشروع «رحلة الصدقة بالذكاء الاصطناعي» بقيادة جامعة نورثوسترن في قطر وبتمويل من مجلس قطر للبحث والتطوير والابتكار وهيئة تنظيم الأعمال الخيرية. انظر «حول المشروع» في الصفحة الرئيسية.",
      ]],
    } },
];
