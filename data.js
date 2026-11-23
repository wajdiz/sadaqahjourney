/* Editorially reviewed content. See CONTENT_AUDIT.md.
   The stories themselves are in data-stories.js (the old 10-story set was removed). */
const MODULE_B = [
  {
    "id": "water",
    "name": "Water",
    "title": "Clean Water Well Project",
    "icon": "🚰",
    "art": "water_a.jpeg",
    "years_art": [
      "water_y1.jpeg",
      "water_y5.jpeg",
      "water_y10.jpeg",
      "water_y20.jpeg"
    ],
    "cost": "$5,000–$10,000 per well",
    "overview": "Funds the drilling and construction of a deep freshwater well in a rural village with no clean water, including a pump, storage tank, concrete base, and maintenance training for 2–3 local members. In this example, one well serves a village of about 500 people.",
    "years": [
      {
        "label": "Year 1",
        "metric": "500 person-years of clean water",
        "points": [
          "500 people (approx. 80–100 families) gain daily access to clean water",
          "Women and girls can spend less time each day fetching water",
          "Illnesses spread by unsafe water, such as diarrhoea, can become less common if the water stays clean",
          "Children, especially girls, may miss less school when they spend less time fetching water",
          "1 well constructed, 2 trained local maintenance volunteers"
        ]
      },
      {
        "label": "Year 5",
        "metric": "2,500 person-years of clean water",
        "points": [
          "Cumulative 2,500 person-years of clean water access delivered",
          "Fewer children fall ill from unsafe water",
          "Time saved can be used for work, study or family",
          "Word spreads: neighboring villages request similar projects",
          "First major maintenance performed; well still fully functional"
        ]
      },
      {
        "label": "Year 10",
        "metric": "5,000+ person-years of clean water",
        "points": [
          "About 5,000 person-years of clean water over a decade (around 500 people each year)",
          "A generation of children grows up without experiencing water scarcity",
          "Girls may be more likely to finish school than before",
          "The local maintenance team keeps the pump working with occasional repairs",
          "Wells are a common example of sadaqah jariyah, ongoing charity whose reward continues (Sahih Muslim 1631)"
        ]
      },
      {
        "label": "Year 20",
        "metric": "10,000+ person-years of clean water",
        "points": [
          "About 10,000 person-years of clean water over 20 years, and more if the village grows",
          "Children born after the well have always had water nearby",
          "The well becomes a community landmark; used in hygiene education and school visits",
          "A second major repair may be needed; a maintenance fund or a waqf can pay for it",
          "In this example, one gift of $5,000–$10,000 gives about 20 years of clean water, as long as the well is maintained"
        ]
      }
    ],
    "how": "Assumes about 500 people use the well every year and that it keeps working with regular maintenance. A person-year is one person having clean water for one year: 500 people × 5 years = 2,500 person-years. The same people are counted again each year, so 10,000 person-years does not mean 10,000 different people."
  },
  {
    "id": "education",
    "name": "Education",
    "title": "Community School Construction & Support",
    "icon": "📚",
    "art": "education.jpeg",
    "years_art": [
      "education_y1.jpeg",
      "education_y5.jpeg",
      "education_y10.jpeg",
      "education_y20.jpeg"
    ],
    "cost": "$20,000–$40,000 to build",
    "overview": "Funds construction of a school in a rural or underserved community, plus teacher salaries, supplies, and student sponsorships. It can be set up as a waqf so that endowment income helps cover running costs.",
    "years": [
      {
        "label": "Year 1",
        "metric": "150–250 student-years of education",
        "points": [
          "1 school built with 2–4 classrooms, serving 150–250 students",
          "Up to 50 previously out-of-school children enrolled for the first time",
          "2–4 local teachers hired and paid regular salaries",
          "School supplies (books, pens, uniforms) provided for 100 low-income students",
          "The community gains a dedicated place to learn"
        ]
      },
      {
        "label": "Year 5",
        "metric": "750–1,250 student-years of education",
        "points": [
          "750–1,250 student-years of education delivered",
          "First cohort of students completes primary education cycle",
          "More children in the village can read and write",
          "Girls' enrollment increases as parents feel safer sending daughters to a local school",
          "School may be expanded with an additional classroom if demand exceeds capacity"
        ]
      },
      {
        "label": "Year 10",
        "metric": "1,500–2,500 student-years of education",
        "points": [
          "1,500–2,500 student-years of education over the decade",
          "First generation of graduates entering secondary education or vocational training",
          "Some graduates may come back as teachers",
          "Children from nearby villages may also attend",
          "If the waqf earns enough, its income keeps paying teachers' salaries"
        ]
      },
      {
        "label": "Year 20",
        "metric": "3,000–5,000 student-years of education",
        "points": [
          "3,000–5,000 student-years of education: a whole generation of the village's children has passed through the school",
          "Second generation now in the school, whose parents were among the first graduates",
          "Better education can help families earn more over time",
          "Some graduates may go on to become teachers, nurses, engineers or business owners",
          "Beneficial knowledge is one of the deeds whose reward continues (Sahih Muslim 1631)"
        ]
      }
    ],
    "how": "Assumes 150–250 students attend each year. A student-year is one student in school for one year: 150–250 students × 20 years = 3,000–5,000 student-years. Each child stays for several years, so the number of different children is smaller."
  },
  {
    "id": "food",
    "name": "Food Security",
    "title": "Sustainable Food Security Program",
    "icon": "🍚",
    "art": "food_a.jpeg",
    "years_art": [
      "food_y1.jpeg",
      "food_y5.jpeg",
      "food_y10.jpeg",
      "food_y20.jpeg"
    ],
    "cost": "$30–$50 / family food parcel",
    "overview": "Two complementary approaches: immediate food relief (parcels and community kitchens during crises/Ramadan) and long-term agricultural development (seeds, tools, and training so families grow their own food).",
    "years": [
      {
        "label": "Year 1",
        "metric": "500 families fed; 200 start farming",
        "points": [
          "500 families (approx. 2,500 people) receive monthly food parcels for 6–12 months",
          "200 farming families receive agricultural starter kits and 2-day training",
          "Community kitchen feeds 100 people per day during Ramadan (3,000 meals total)",
          "Fewer children in the area go hungry",
          "Participating farmers harvest their first crops"
        ]
      },
      {
        "label": "Year 5",
        "metric": "200 farming families grow 60–80% of their food",
        "points": [
          "200 trained farming families now produce 60–80% of their own food needs",
          "Surplus farmers begin selling at local markets — food security becomes economic opportunity",
          "Food parcel program transitions to focus on the most vulnerable (elderly, disabled, widows)",
          "Children eat more regular meals in families that grow their own food",
          "Knowledge shared: trained farmers teach techniques to neighbors, spreading impact"
        ]
      },
      {
        "label": "Year 10",
        "metric": "Families need less food aid",
        "points": [
          "If harvests hold up, families need emergency food aid less often",
          "Local food markets thriving — farmers earning regular income from surplus production",
          "Second generation of farmers trained using accumulated community knowledge",
          "Children who eat regularly are better able to learn and stay healthy",
          "Program shifts to supporting adjacent vulnerable villages using lessons learned"
        ]
      },
      {
        "label": "Year 20",
        "metric": "Much less need for food aid",
        "points": [
          "The 200 farming families have grown a large amount of food over 20 years",
          "Food aid is needed less often, though drought or conflict can still cause shortages",
          "Farming knowledge passed to a new generation; agricultural techniques improved over time",
          "Economic impact extends beyond food: families invest in children's education and healthcare",
          "In this example, a $200 farming kit and training help a family grow food for many years"
        ]
      }
    ],
    "how": "Year 1 counts two groups: 500 families who receive monthly food parcels ($30–$50 each) and 200 farming families who get starter kits and training. Later years follow the 200 farming families. Years 10 and 20 describe likely outcomes, not counts, and assume the program keeps running."
  },
  {
    "id": "healthcare",
    "name": "Healthcare",
    "title": "Community Health Clinic",
    "icon": "💚",
    "art": "food_parcel_b.jpeg",
    "years_art": [
      "healthcare_y1.jpeg",
      "healthcare_y5.jpeg",
      "healthcare_y10.jpeg",
      "healthcare_y20.jpeg"
    ],
    "cost": "$30,000–$60,000 to build",
    "overview": "Builds and runs a primary healthcare clinic for a community with the nearest hospital 50–100 km away. Offers consultations, maternal and child health, vaccinations, common-illness treatment, and referrals. Operating costs covered by a waqf.",
    "years": [
      {
        "label": "Year 1",
        "metric": "1,200–2,000 consultations",
        "points": [
          "1 clinic serving a catchment population of 2,000–5,000 people",
          "1,200–2,000 patient consultations in the first year",
          "More young children get their vaccines",
          "Mothers can get care during pregnancy and birth closer to home",
          "Patients no longer travel 50–100 km for basic care; families save money and time"
        ]
      },
      {
        "label": "Year 5",
        "metric": "8,000–12,000 consultations",
        "points": [
          "8,000–12,000 consultations delivered over 5 years",
          "Early treatment of common illnesses can save young children's lives",
          "Vaccination reaches more children each year",
          "Chronic diseases (diabetes, hypertension) identified and managed before becoming life-threatening",
          "Staff trained and experienced; clinic runs efficiently with strong community trust"
        ]
      },
      {
        "label": "Year 10",
        "metric": "20,000–30,000 consultations",
        "points": [
          "20,000–30,000 consultations over the decade",
          "Most children in the area have had their vaccines",
          "Care for mothers keeps improving",
          "Clinic expands services based on community needs — possibly dental or mental health support",
          "Local community health workers trained by clinic staff extend reach to remote households"
        ]
      },
      {
        "label": "Year 20",
        "metric": "50,000–70,000 consultations",
        "points": [
          "50,000–70,000 consultations over 20 years",
          "Better access to care can help people live longer, healthier lives",
          "Children who received vaccines and nutrition support as infants are now healthy adults",
          "The clinic has become a training ground for the next generation of local health workers",
          "Tens of thousands of visits in 20 years, kept going by a waqf"
        ]
      }
    ],
    "how": "Counts all consultations since the clinic opened. Assumes 1,200–2,000 in the first year, rising to about 3,000–4,000 a year in the second decade as more people use the clinic. One person can visit many times, so these are visits, not people. The clinic serves an area of 2,000–5,000 people."
  },
  {
    "id": "orphan",
    "name": "Orphan Care",
    "title": "Orphan Sponsorship & Support Program",
    "icon": "🧑‍🍼",
    "art": "food_parcel_a.jpeg",
    "years_art": [
      "orphan_y1.jpeg",
      "orphan_y5.jpeg",
      "orphan_y10.jpeg",
      "orphan_y20.jpeg"
    ],
    "cost": "$30–$50 / month per child",
    "overview": "Comprehensive sponsorship for orphaned children living in poverty with widowed mothers or extended family. A monthly sponsorship covers school fees, uniforms, books, meals, healthcare, and psychosocial support, so children can stay with their families.",
    "years": [
      {
        "label": "Year 1",
        "metric": "100 child-years of support",
        "points": [
          "100 orphaned children enrolled in the sponsorship program",
          "All 100 children enrolled in school — many for the first time",
          "100 caregiver families (typically widowed mothers) receive monthly support",
          "Healthcare visits for each child: vaccinations, growth monitoring, dental checks",
          "Psychosocial sessions help children process grief and build resilience"
        ]
      },
      {
        "label": "Year 5",
        "metric": "500 child-years of support",
        "points": [
          "500 child-years of support delivered across the cohort",
          "Sponsored children are more likely to stay in school",
          "Children get help with schoolwork and with their wellbeing",
          "Caregiver mothers can join job training, which helps some earn their own income",
          "First cohort of older children completing primary school and enrolling in secondary"
        ]
      },
      {
        "label": "Year 10",
        "metric": "1,000 child-years of support",
        "points": [
          "First sponsored children reaching adulthood — some completing secondary school, entering university or work",
          "Children who entered at age 5–6 are now 15–16 with education and prospects",
          "Some sponsored children may go on to train as teachers, nurses or technicians",
          "Families that received support are more stable",
          "More sponsors may join so the program can grow (the totals here assume 100 places)"
        ]
      },
      {
        "label": "Year 20",
        "metric": "2,000 child-years of support",
        "points": [
          "Multiple cohorts of children have grown into educated, self-sufficient adults",
          "Some former sponsored children now sponsor orphans themselves — generosity multiplied",
          "Educated adults can help their own children get an education",
          "Caring for orphans is highly praised in Islam (Sahih al-Bukhari 6005)",
          "A sponsorship of $30–$50 a month supports one child, one month at a time"
        ]
      }
    ],
    "how": "Assumes 100 children are sponsored at any one time, each for the whole year. A child-year is one child supported for one year: 100 children × 10 years = 1,000 child-years. When older children leave the program, new children take their places. The totals do not count any growth beyond 100 places."
  },
  {
    "id": "refugee",
    "name": "Refugee Support",
    "title": "Refugee Resettlement & Integration Program",
    "icon": "🏡",
    "art": "child_donate.jpeg",
    "years_art": [
      "refugee_y1.jpeg",
      "refugee_y5.jpeg",
      "refugee_y10.jpeg",
      "refugee_y20.jpeg"
    ],
    "cost": "$800–$1,500 / family (year 1)",
    "overview": "Comprehensive support for displaced families: emergency shelter, food, healthcare, children's education, legal documentation, language classes, and vocational training. Families are treated as rights-holders, not helpless recipients.",
    "years": [
      {
        "label": "Year 1",
        "metric": "200 families (1,000 people) supported",
        "points": [
          "200 displaced families (1,000 people) receive emergency shelter, food, and basic services",
          "School-age children are helped to enrol in local or camp schools",
          "Healthcare access provided — vaccinations, maternal care, treatment of injuries",
          "Legal documentation (ID cards, birth certificates) processed for 150 families",
          "Adults begin language classes and skills assessment for vocational training"
        ]
      },
      {
        "label": "Year 5",
        "metric": "120–140 of the 200 families self-sufficient",
        "points": [
          "60–70% of originally supported families now partially or fully economically self-sufficient",
          "Children who arrived as refugees have completed 4–5 years of education in the host country",
          "Adults who completed vocational training employed in local businesses or self-employed",
          "Community integration improving — refugee families building social ties with host community",
          "Emergency support needs reduced; program shifts focus to integration and long-term stability"
        ]
      },
      {
        "label": "Year 10",
        "metric": "Stable, contributing families",
        "points": [
          "First cohort of refugee children completing secondary education — some entering university",
          "Families who arrived with nothing now living in stable housing, paying rent or owning small businesses",
          "Children born to refugee parents in the host country grow up in stable homes and go to school",
          "Former refugees contributing to local economy as workers, business owners, taxpayers",
          "Some families may give to the charity that once helped them"
        ]
      },
      {
        "label": "Year 20",
        "metric": "Generational integration",
        "points": [
          "A generation of children who arrived as refugees are now educated, employed adults",
          "Many families have settled into their new community",
          "Early support can help refugees find work and contribute to their new home",
          "Children born later grow up in a stable home",
          "Help given to 200 families in Year 1 can still benefit their children and grandchildren"
        ]
      }
    ],
    "how": "Follows the same 200 families (about 1,000 people) supported in Year 1. Year 5 assumes 60–70% of them can support themselves, which is 120–140 families. Years 10 and 20 describe likely outcomes, not counts. Real results depend a lot on the host country's laws, including the right to work."
  },
  {
    "id": "mosque",
    "name": "Mosque Construction",
    "title": "Mosque Construction & Community Center",
    "icon": "🏛️",
    "art": "mosque.jpeg",
    "years_art": [
      "mosque_y1.jpeg",
      "mosque_y5.jpeg",
      "mosque_y10.jpeg",
      "mosque_y20.jpeg"
    ],
    "cost": "$50,000–$100,000 to build",
    "overview": "Builds a mosque as a full community center for a community with no dedicated place of worship: prayer hall, ablution facilities, library, maktab classroom, and a multi-purpose room. Set up as a waqf, so it stays dedicated to its purpose.",
    "years": [
      {
        "label": "Year 1",
        "metric": "300–500 at Friday prayer",
        "points": [
          "1 mosque built, accommodating 300–500 worshippers for Friday prayers",
          "Community has a dedicated, dignified space for the 5 daily prayers",
          "Islamic education classes begin: 50–80 children enrolled in Quran and Arabic instruction",
          "Community gatherings (Eid prayers, funerals, weddings, charity distributions) held with dignity",
          "Neighbours who rarely met now see each other at the mosque"
        ]
      },
      {
        "label": "Year 5",
        "metric": "400–600 at Friday prayer",
        "points": [
          "Friday congregation grows to 400–600 regular worshippers as community expands",
          "Maktab graduates first cohort: 50+ children complete basic Quran memorization",
          "Mosque library used regularly by students and community members",
          "Social services operating: food distribution, charity collection, welfare referrals",
          "The imam and elders may help settle disputes"
        ]
      },
      {
        "label": "Year 10",
        "metric": "Permanent community institution",
        "points": [
          "A generation of children has grown up with Islamic education at the mosque",
          "Mosque becomes community institution: used for funerals, Eid celebrations, charity drives, and education",
          "The mosque helps neighbours know and help one another",
          "Zakat and Sadaqah collection organized through mosque supports 50–100 local needy families annually",
          "Mosque may need expansion as congregation grows — original waqf structure facilitates future investment"
        ]
      },
      {
        "label": "Year 20",
        "metric": "Two generations educated",
        "points": [
          "Two generations of children educated in Islamic values at the mosque's maktab",
          "The mosque has hosted thousands of prayers, hundreds of funerals, Eid celebrations, weddings, and events",
          "Young adults who attended maktab as children now bringing their own children — tradition passed on",
          "The mosque's zakat and sadaqah work has helped many local families",
          "The Prophet ﷺ said that whoever builds a mosque for Allah's sake, Allah builds for him a house like it in Paradise (Sahih al-Bukhari 450)"
        ]
      }
    ],
    "how": "Years 1 and 5 count people at Friday prayer each week, not totals over time. Year 10 assumes the mosque's Zakat and Sadaqah collection helps 50–100 local families a year. Years 10 and 20 describe the mosque's role, not counts."
  },
  {
    "id": "emergency",
    "name": "Emergency Relief",
    "title": "Emergency Humanitarian Relief Fund",
    "icon": "⚡",
    "art": "year_ashes.jpeg",
    "years_art": [
      "emergency_y1.jpeg",
      "emergency_y5.jpeg",
      "emergency_y10.jpeg",
      "emergency_y20.jpeg"
    ],
    "cost": "$60–$100 / family emergency kit",
    "overview": "Immediate response when disaster strikes (earthquakes, floods, famine, displacement), delivering life-saving supplies within 24–72 hours. An emergency kit includes 2 weeks of food, water purification, shelter tarpaulin, hygiene kit, and blankets.",
    "years": [
      {
        "label": "Year 1",
        "metric": "5,000 people (1,000 families) reached",
        "points": [
          "1,000 families (5,000 people) receive emergency kits within 72 hours of a disaster",
          "Field medical team treats 500+ injured or sick survivors",
          "Emergency water trucking delivers clean water to 3,000 people for 2 weeks",
          "Mass feeding operation serves 2,000 meals per day for 30 days",
          "Fast medical care, food and water can save lives in the first days"
        ]
      },
      {
        "label": "Year 5",
        "metric": "15,000–25,000 people reached",
        "points": [
          "Fund has responded to 3–5 separate disaster events over 5 years",
          "Cumulative 15,000–25,000 people reached across multiple crises",
          "Pre-positioned emergency supplies mean response time improves with each operation",
          "Lessons from each response can make the next one faster",
          "Relationships with local partners established, enabling faster, better-targeted responses"
        ]
      },
      {
        "label": "Year 10",
        "metric": "50,000+ people reached",
        "points": [
          "Fund has responded to 7–12 disaster events; a trusted, experienced relief actor",
          "Cumulative 50,000+ people reached in emergencies",
          "Transition support: fund now links emergency response to longer-term recovery programs",
          "Community resilience training added — helping communities prepare for future disasters",
          "Survivors from early responses now trained as community first responders"
        ]
      },
      {
        "label": "Year 20",
        "metric": "100,000+ people reached",
        "points": [
          "100,000+ people reached across two decades of humanitarian response",
          "Rapid help across many disasters can save many lives",
          "The fund has become a trusted, experienced humanitarian actor with regional knowledge and networks",
          "Former disaster survivors supported by the fund now contributing as volunteers and donors",
          "Money kept ready in a fund means help can start as soon as a disaster strikes"
        ]
      }
    ],
    "how": "Counts everyone reached since the fund started, across all the disasters it responds to (3–5 by Year 5, 7–12 by Year 10). Year 1 is one response: 1,000 families of about 5 people each. Later years assume donors keep refilling the fund, because one gift on its own would be used up in the first response."
  },
  {
    "id": "waqf",
    "name": "Waqf Endowment",
    "title": "Productive Waqf",
    "icon": "🌳",
    "art": "trees_a.jpeg",
    "years_art": [
      "waqf_y1.jpeg",
      "waqf_y5.jpeg",
      "waqf_y10.jpeg",
      "waqf_y20.jpeg"
    ],
    "cost": "$100,000 example investment",
    "overview": "An endowment where a capital asset (building, land, or fund) generates ongoing income permanently dedicated to charity. The principal is never spent — only the returns. Waqf has paid for mosques, schools, hospitals and water fountains across Muslim history, and many waqfs still operate today.",
    "years": [
      {
        "label": "Year 1",
        "metric": "$8,000–$10,000 distributed",
        "points": [
          "$100,000 invested in a waqf property generating 8–10% annual return",
          "Year 1 income: $8,000–$10,000 distributed to charitable programs",
          "Equivalent to: 200 monthly food parcels, OR 1 water well, OR school supplies for 80 students",
          "The $100,000 itself is kept, not spent",
          "The waqf deed is registered, which protects its purpose"
        ]
      },
      {
        "label": "Year 5",
        "metric": "$40,000–$50,000 distributed",
        "points": [
          "Cumulative income distributed: $40,000–$50,000 over 5 years",
          "Equivalent to: about 5 water wells, OR about 1,000 months of orphan sponsorship, OR school supplies for about 400 students",
          "Capital still fully intact — still worth $100,000+",
          "Rent may rise with inflation, but it can also fall",
          "Donor has given $100,000 once but delivered $40,000–$50,000 in social benefit already"
        ]
      },
      {
        "label": "Year 10",
        "metric": "$80,000–$100,000 distributed",
        "points": [
          "Cumulative income distributed: $80,000–$100,000, close to the size of the original gift",
          "Capital still intact: the original $100,000 is still working",
          "Each further year adds more help, while the $100,000 stays in place",
          "A $100,000 cash gift would have helped more people at once; the waqf spreads its help over many years",
          "People helped by the waqf may never know the donor's name"
        ]
      },
      {
        "label": "Year 20",
        "metric": "$160,000–$200,000 distributed",
        "points": [
          "Cumulative income distributed: $160,000–$200,000 from a single $100,000 investment",
          "The $100,000 is still there, if the property has kept its value",
          "In this example, $160,000–$200,000 has been given out, and the waqf can keep going",
          "A waqf can keep giving after its founder has died",
          "A waqf is a classic form of sadaqah jariyah, charity whose reward continues (Sahih Muslim 1631)"
        ]
      }
    ],
    "how": "Assumes $100,000 is invested in property that earns 8–10% a year, all income is given away, and the $100,000 itself is kept. $8,000–$10,000 × 20 years = $160,000–$200,000. Real returns change from year to year and can be lower, and buildings need repairs."
  }
];
const MODULE_C = [
  {
    "age": "7-10",
    "games": [
      {
        "id": "charity-match",
        "title": "Charity Match",
        "icon": "🧰",
        "concept": "A memory-style card matching game where children flip cards to find pairs. Each pair connects a charity concept (e.g., 'building a well') with an image (a village child drinking clean water).",
        "how": [
          "A 4×4 grid of face-down cards appears on screen.",
          "The player flips two cards at a time.",
          "If the cards match (concept + image), they stay face up and earn a star.",
          "If they don't match, they flip back over.",
          "Game ends when all pairs are matched, with an animated explanation for each pair."
        ],
        "outcome": "Children learn the names and visual associations of core Islamic charity concepts without memorization pressure.",
        "difficulty": "Easy"
      },
      {
        "id": "fill-box",
        "title": "Fill the Donation Box",
        "icon": "📦",
        "concept": "A drag-and-drop game where a person in need appears on screen and the player drags the correct items into a donation box. Correct items transform the scene.",
        "how": [
          "A scene appears: a character in a specific situation of need (cold, hungry, sick, uneducated).",
          "A shelf of items appears on the side — some helpful, some irrelevant.",
          "The player drags the right items into the donation box.",
          "Correct items trigger a happy animation; wrong items bounce back with a gentle hint.",
          "After filling the box correctly, the scene transforms — the character is now warm, fed, healthy, or in school."
        ],
        "outcome": "Children connect specific forms of charity to real human needs, developing empathy alongside Islamic knowledge.",
        "difficulty": "Easy"
      },
      {
        "id": "giving-tree",
        "title": "The Giving Tree",
        "icon": "🌲",
        "concept": "A nurturing game where the player grows a tree by correctly answering simple charity questions. Each correct answer waters the tree. The fully grown tree represents a lifetime of Sadaqah Jariyah.",
        "how": [
          "A small seedling appears on screen.",
          "A simple question appears with three image options.",
          "A correct answer waters the tree — it grows visibly with an animation.",
          "A wrong answer gives a gentle clue and asks again.",
          "After several questions, the tree is fully grown and glowing."
        ],
        "outcome": "Children understand the concept of Sadaqah Jariyah through a living visual metaphor that grows with their correct answers.",
        "difficulty": "Easy-Medium"
      }
    ]
  },
  {
    "age": "11-14",
    "games": [
      {
        "id": "build-community",
        "title": "Build Your Community",
        "icon": "🏘️",
        "concept": "A strategy-lite simulation: players receive a fictional village and a $10,000 charity budget, choose which projects to fund, and see the immediate impact play out. Different combinations produce different outcomes.",
        "how": [
          "Meet the village: shown the population and their main problems (no water, no school, sick children).",
          "Receive a budget of $10,000 and a menu of projects with costs and descriptions.",
          "Select projects within budget — you cannot fund everything, so you must prioritize.",
          "After confirming, an animated sequence shows the village 1 year later.",
          "A 'community happiness score' shows the outcome; replay with different combinations."
        ],
        "outcome": "Players develop prioritization thinking and connect decision-making to Islamic values of justice and care for the vulnerable.",
        "difficulty": "Medium"
      },
      {
        "id": "sort-zakat",
        "title": "Sort the Zakat",
        "icon": "⚖️",
        "concept": "A categorization game based on the 8 categories of Zakat recipients. Players read short character descriptions and drag each person to the correct Zakat category.",
        "how": [
          "8 labeled category boxes appear, each with a short description and icon.",
          "A character card appears (e.g., 'Ahmad is traveling and has run out of money far from home').",
          "Player drags the character to the correct category.",
          "Correct: animated confirmation + explanation of the ruling.",
          "Wrong: gentle correction with a hint about which category fits better."
        ],
        "outcome": "Players memorize and understand the 8 Zakat categories through contextual examples rather than rote memorization.",
        "difficulty": "Medium"
      },
      {
        "id": "chain-reaction",
        "title": "Charity Chain Reaction",
        "icon": "🔗",
        "concept": "A chain-reaction puzzle where players trace the ripple effects of a single charitable act, predicting what happens next. The longest chain reveals the power of Sadaqah Jariyah.",
        "how": [
          "A starting charity action is shown (e.g., 'Ibrahim digs a water well in his village').",
          "Player clicks 'What happens next?' and chooses from 3 possible outcomes.",
          "Correct choice unlocks the next scene and keeps the chain going.",
          "Wrong choices branch into a shorter chain, showing a less impactful outcome.",
          "At the end, a comparison shows: one-time gift chain vs. Sadaqah Jariyah chain."
        ],
        "outcome": "Players viscerally understand why ongoing charity (wells, schools, waqf) generates far more impact than one-time giving.",
        "difficulty": "Medium-Hard"
      }
    ]
  },
  {
    "age": "15-18",
    "games": [
      {
        "id": "waqf-architect",
        "title": "Waqf Architect",
        "icon": "🏗️",
        "concept": "A financial design simulation: players receive a fictional inheritance ($50,000) and design a productive waqf endowment — choosing the asset, the cause, and the governance — then simulate 20 years of impact.",
        "how": [
          "Receive a scenario: 'Your grandfather has left you $50,000. You decide to make it a waqf.'",
          "Step 1 — Choose asset: commercial property (8% return), farmland (5% return + food), or a waqf fund (7% return).",
          "Step 2 — Choose cause: education, healthcare, water, orphan care, or emergency relief.",
          "Step 3 — Set governance: family trustee, charity organization, or independent board.",
          "The simulation runs: Year 1 → 5 → 10 → 20 shown in animated infographics."
        ],
        "outcome": "Players develop financial literacy around Islamic endowments and practice ethical decision-making about wealth.",
        "difficulty": "Hard"
      },
      {
        "id": "giving-dilemma",
        "title": "The Giving Dilemma",
        "icon": "🦭",
        "concept": "An ethical scenario game presenting real-world charity dilemmas that have no obvious right answer. Players choose, articulate their reasoning using Islamic principles, then see how others responded.",
        "how": [
          "A dilemma is presented (e.g., '$500: feed 100 families for one day OR dig one well serving 50 families for 20 years?').",
          "Player reads both options carefully and selects one.",
          "Player chooses which Islamic principle guided the decision (Sadaqah Jariyah, urgency, numbers helped, most vulnerable).",
          "The game reveals how 1,000 other players responded, and a scholarly note on the trade-off.",
          "5 dilemmas total; final reflection: 'What matters is that you give thoughtfully, with a pure intention.'"
        ],
        "outcome": "Players develop sophisticated thinking about charity ethics — urgency vs. sustainability, quantity vs. depth, immediate need vs. long-term impact.",
        "difficulty": "Hard"
      },
      {
        "id": "impact-calc",
        "title": "Real Impact Calculator",
        "icon": "💡",
        "concept": "An interactive calculator that shows what actual money could achieve. Players input an amount and a project area, and the calculator shows exactly what that funds — with real numbers and animated infographics.",
        "how": [
          "Player selects a giving amount using a slider ($1 to $1,000).",
          "Player selects a project area (water, food, education, healthcare, orphan care).",
          "The calculator instantly shows specific impact with real numbers.",
          "An animated infographic shows the impact visually.",
          "Player can switch between project areas to compare."
        ],
        "outcome": "Players connect abstract money amounts to concrete human impact and understand that small amounts genuinely matter.",
        "difficulty": "Medium"
      },
      {
        "id": "choose-path",
        "title": "Choose Your Path",
        "icon": "🧭",
        "concept": "A branching story game. Players face everyday situations about helping others and choose what to do; each choice changes what happens next.",
        "how": [
          "Pick one of three situations.",
          "Read what is happening and choose what you would do.",
          "Your choice leads to a new situation or to an ending.",
          "Each ending shows what happened and a lesson with its Qur'an or hadith source.",
          "Play again to try a different path."
        ],
        "outcome": "Players practise giving decisions that involve dignity, privacy, trust and timing, not only money.",
        "difficulty": "Medium"
      }
    ]
  }
];
const MODULE_D = {
  "guidelines": [
    {
      "title": "Your story must be true",
      "do": [
        "Write about something that actually happened — your own act of charity, or one you witnessed firsthand.",
        "Use real details: a real place, a real situation, a real person (use a first name or 'my neighbor' for privacy)."
      ],
      "dont": [
        "Don't invent or exaggerate details to sound impressive. A small, honest story is more powerful than a large made-up one.",
        "Don't copy stories from the internet or books. This platform is for your voice."
      ]
    },
    {
      "title": "Tell it like a story, not a report",
      "do": [
        "Start with a scene: Where were you? What did you see? What made you decide to act?",
        "Include a moment of decision: What made you give?",
        "Show what happened after: How did the person react? What changed? How did you feel?"
      ],
      "dont": [
        "Don't write a list of facts. Tell us the human story."
      ]
    },
    {
      "title": "Connect it to Islamic values — but naturally",
      "do": [
        "If you include a Qur’an verse or hadith, cite the exact reference and verify the wording and reliability.",
        "Reflect on what the experience taught you about Sadaqah, Waqf, Zakat, or another concept."
      ],
      "dont": [
        "Don't force Quranic quotes into every paragraph. The story itself should carry the Islamic spirit.",
        "Don't moralize or lecture the reader. Trust your story to speak for itself."
      ]
    },
    {
      "title": "Be specific",
      "do": [
        "Specific: 'I bought a bag of rice, three tins of tomatoes, and a box of sugar.'",
        "Specific: 'She looked up at me without saying anything and held the box against her chest.'"
      ],
      "dont": [
        "Vague: 'I gave food to people who needed it.'",
        "Specific details are what make a reader feel they were there with you."
      ]
    },
    {
      "title": "Respect people's dignity and privacy",
      "do": [
        "Ask permission before sharing details about another person's situation.",
        "Use first names or descriptions only ('a woman in my neighborhood') to protect privacy.",
        "Write about people with dignity — describe their strength and resilience, not just their need."
      ],
      "dont": [
        "Don't share photos or identifying details of beneficiaries without explicit consent."
      ]
    },
    {
      "title": "Length and format",
      "do": [
        "Length: 300–700 words is ideal.",
        "Structure: A beginning (the situation), a middle (the act of giving), and an end (the impact or reflection).",
        "Tone: Warm, honest, personal. Write the way you would tell a story to a friend."
      ],
      "dont": [
        "Don't use formal academic language."
      ]
    }
  ],
  "samples": [
    {
      "title": "The Date at the Bus Stop",
      "teaser": "Two dates, five seconds, a stranger's smile — and a hadith I finally understood.",
      "body": [
        "It was a Tuesday in Ramadan, about twenty minutes before Maghrib. I was at the bus stop near our apartment, waiting with my younger brother. I had a small bag of dates in my school bag — my mother had packed them so we wouldn't arrive home too hungry before Iftar.",
        "An older man sat down on the bench beside us. He had a worn jacket and a plastic bag at his feet. He was not speaking to anyone. He was just sitting there very quietly, and I noticed he kept looking at his watch.",
        "I don't know exactly what made me do it. Maybe it was the way he looked at his watch — like someone counting down the minutes until he could finally eat. I reached into my bag and took out two dates and held them out to him. He looked at me for a moment, surprised. Then he smiled and took them. ‘Jazak Allahu khayran,' he said. May Allah reward you with good.",
        "My brother looked at me after the man got on his bus. ‘Why did you give him your dates?' he asked. ‘You'll be hungry.'",
        "I thought about it. ‘I still have some left,' I said. ‘And he needed them more before I did.'",
        "It was two dates. It took five seconds. But I think about that man's smile more than I think about most things. The Prophet (peace be upon him) taught us not to belittle a good deed, even greeting someone with a cheerful face (Sahih Muslim 2626). I understood that differently after that Tuesday."
      ]
    },
    {
      "title": "My Grandfather's Bookshelf",
      "teaser": "147 books, a mosque library, and a teenage boy who had no idea whose book he was reading.",
      "body": [
        "When my grandfather passed away three years ago, he left behind a large wooden bookshelf in his study — filled with Islamic books, history books, science books, and Qurans in different sizes. My father asked us what we should do with them.",
        "My first instinct was to keep them. They were his. They smelled like his house. But my younger cousin said something I have not forgotten: ‘Grandfather always said a book sitting on a shelf is asleep. It only wakes up when someone reads it.'",
        "We decided to donate the entire shelf to the mosque library in our neighborhood. A carpenter from the community came and helped us move it. We packed 147 books in total.",
        "A few months later, I went to the mosque for Friday prayer and saw a teenage boy, maybe 13 or 14, sitting in the corner after prayer, reading one of my grandfather's history books. The one about the early caliphs. He had no idea whose book it had been. He was just reading, completely absorbed.",
        "I sat there watching him for a moment before I went home. I did not say anything.",
        "My grandfather used to say: ‘Ilm la yanqus bil-i'taa — knowledge does not decrease when you give it away.' I think what he meant was that when you share knowledge, it does not leave you, it multiplies."
      ]
    },
    {
      "title": "Hundred Riyals",
      "teaser": "A new school bag I didn't need, a mother's quiet lesson, and giving 'without the right hand knowing.'",
      "body": [
        "My mother gave me hundred riyals to spend on a new school bag. The one I had was perfectly fine, honestly, she just thought it was time for a new one.",
        "On the way to the mall, we passed a woman sitting outside a supermarket. She had two small children with her, both younger than my little sister. One of the children was wearing a sandal on one foot and a torn shoe on the other. I do not know why I noticed that specifically. I just did.",
        "I told my mother I did not need a new bag. She looked at me for a moment and then looked at the woman and the children. She did not say anything. She just opened her purse and took out another hundred riyals and handed it to me along with mine.",
        "I went back to the woman and crouched down so I was at eye level with her. ‘This is for your family,' I said. ‘Allah ybarek feek,' she said.",
        "In the car home, my mother said: ‘You know, the best charity is given when the left hand does not know what the right hand gives.' This reflects Sahih al-Bukhari 660. I asked her what that meant. She said it means giving without wanting credit for it, not expecting thanks, not even quite expecting anything from yourself."
      ]
    },
    {
      "title": "The Meal We Cooked Together",
      "teaser": "A Syrian family two floors below, a winter of lentil soup, and what neighbors are supposed to do.",
      "body": [
        "There is a family that lives two floors below us. A Syrian family — a mother, a grandmother, and three children. The father is not with them. I do not know the details and it is not my place to ask.",
        "Last winter was very cold. One evening my mother mentioned that she had not seen the mother in several days and was worried. She knocked on their door and came back looking quiet.",
        "That evening, my mother, my aunt who was visiting, and I spent two hours in the kitchen. We made a large pot of lentil soup, a dish of rice with vegetables, a pan of bread, and a small plate of sweets left over from Eid. We put it all in containers and carried it downstairs.",
        "The grandmother opened the door. When she saw the food, she did not say anything at first. She put her hand on my mother's arm and then on my cheek and said something in a dialect I did not fully understand. But I understood enough.",
        "We did this every Friday for the rest of winter. Sometimes we cooked specifically for them. Sometimes we just made extra of whatever we were already making.",
        "I do not think of it as charity in the formal sense. I think of it as what neighbors do — what they are supposed to do. Qur’an 4:36 encourages goodness to neighbours. We were just trying to be believers."
      ]
    },
    {
      "title": "What My Pocket Money Built",
      "teaser": "A twelfth birthday with no presents, four months of saving, and an imagined well in Somalia I will never see.",
      "body": [
        "For my twelfth birthday, I asked my parents not to give me presents. I know that sounds strange. But I had been thinking about it for a while. I already had more things than I needed, and I had read that a water well in parts of Africa costs about the same as a year of birthday presents.",
        "My parents agreed. Instead of presents, they let me collect contributions from family and add my own pocket money that I had been saving. After four months, I had raised enough.",
        "We donated through a verified charity that builds wells in Somalia. They sent us a photo of the completed well three months later, and a note saying it would serve a village of about 400 people.",
        "I printed the photo and taped it next to my desk. I have not told many people about it. I look at it because it helps me understand something I find hard to hold in my head: that the people in that village are real, and they are drinking clean water, and some part of that is connected to me even though I will never meet them.",
        "I am thirteen now. I have started saving again for next year.",
        "Providing safe water is a valuable charitable act. I used to imagine charity only as a cup of water given directly to someone. Now I think of it more broadly: spare change, birthday savings or other resources can help improve access to clean water, even for people I never meet."
      ]
    }
  ]
};
window.SADAQAH_DATA = { MODULE_B, MODULE_C, MODULE_D };
