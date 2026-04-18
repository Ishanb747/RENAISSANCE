export const comedyCurriculum = [
  {
    id: "1",
    title: "The Anatomy of a Laugh (Samay's Playbook)",
    slug: "anatomy-of-a-laugh",
    description: "Samay Raina's masterclass: Deconstruct the hidden architecture, mathematical precision, and strategic character work required in stand-up comedy.",
    duration: "4.5 hours",
    lessons: [
      {
        id: "c1-l1",
        title: "The Stand-Up Glossary",
        slug: "standup-glossary",
        type: "concept",
        duration: "25 min",
        content: [
          { type: 'intro', text: "Just like chess has its openings, forks, and endgames, stand-up comedy has its own highly precise terminology. You cannot break down a joke until you know the language of the craft." },
          { type: 'heading', text: "Essential Terminology" },
          { type: 'list', items: [
            "**Act-out:** Physically performing a scene—using your body, voices, or impressions rather than just narrating. It elevates a joke from text to theater.",
            "**Beat:** The deliberate, calculated pause between a setup and a punchline. Too long, and the joke dies; too short, and you run over the audience's laugh. Every joke has a unique beat you find through rigorous open mic testing.",
            "**Callback:** Bringing back a punchline or premise from earlier in the set. It rewards the audience for paying attention. Rule of thumb: call it back a maximum of three times, otherwise it loses its charm.",
            "**Point of View (POV):** What brings freshness to a joke. An overdone topic (like expensive iPhones) can still kill if you bring a completely fresh POV.",
            "**Tight Set:** A set with almost no 'white space'. Every line is either a setup, a punchline, or a tag. The fewer words between jokes, the tighter the set."
          ] },
          { type: 'callout', variant: 'important', text: "Samay's Output Metric: LPM (Laughs Per Minute). Every performance is recorded on stage. Afterwards, you literally count the laughs per minute to see if a joke needs to be tightened or expanded." }
        ],
        keyTakeaways: [
          "The first laugh is the most important—start strong and address the obvious.",
          "Every comedian bombs before they kill. The goal is to bomb less over time, not to never bomb.",
          "Callbacks must feel natural, never forced."
        ]
      },
      {
        id: "c1-l2",
        title: "The Core Structure of a Joke",
        slug: "core-joke-structure",
        type: "framework",
        duration: "30 min",
        content: [
          { type: 'intro', text: "All comedy operates on the element of surprise. The architecture of a joke is designed to meticulously build an expectation, only to abruptly shatter it." },
          { type: 'heading', text: "The Four Layers of Funny" },
          { type: 'list', items: [
            "**Premise:** The world or situation you establish. (e.g. 'My nana ji was kidnapped in Kashmir.') A good bit has one strong premise.",
            "**Setup:** A statement within that premise that creates a specific, logical assumption in the audience's head.",
            "**Punchline:** The line that shatters that assumption by going in a completely unexpected direction. The further the gap from the assumption, the bigger the laugh.",
            "**Tag:** A follow-up punchline on the exact same premise. It rides the wave of the initial laugh like a bouncing ball."
          ] },
          { type: 'image', url: '/joke_structure_diagram_1776523376982.png', caption: 'The physics of a joke: The bounce represents the impact of the punchline shattering the established trajectory.', alt: 'Abstract diagram of a bouncing ball showing trajectory and unexpected angle for a punchline.' },
          { type: 'heading', text: "Setup vs. Punchline Mechanics" },
          { type: 'quote', text: "Before I met my wife, I used to feel incomplete. Now I am finished.", author: "Mitch Hedberg" },
          { type: 'paragraph', text: "Notice why the quote above works: The setup plants the assumption that marriage completed him. The punchline uses a word ('finished') that shares a family with 'complete', but carries the exact opposite emotional weight." },
          { type: 'callout', variant: 'info', text: "Samay's Writing Method: Write everything in an Excel sheet. Color code it: Blue for Premise, Green for Setup, Yellow for Punchline, Orange for Tag. Keep the White (filler text) to an absolute minimum." }
        ]
      },
      {
        id: "c1-l3",
        title: "The Secret Sauce: Character",
        slug: "standup-character",
        type: "psychology",
        duration: "20 min",
        content: [
          { type: 'intro', text: "Joke writing is a learnable skill, but Character is the soul of a great comedian. You can have weaker jokes, but if your character is undeniable, the audience will love you." },
          { type: 'image', url: '/comedy_character_mask_1776523423376.png', caption: 'Your Character is your distinctive voice, persona, and emotional energy on stage.', alt: 'Stylized glass mask representing comedy character.' },
          { type: 'heading', text: "Likability + Emotion + Joke Writing" },
          { type: 'paragraph', text: "The magic formula of stand-up. It is said that 60% of a comedian's success is pure likability. Character is the feeling the audience gets just by watching you." },
          { type: 'list', items: [
            "**Zakir Khan:** The calm, earnest 'sakth launda'. He touches you emotionally before he drops the punchline.",
            "**Upmanyu Acharya:** A highly exaggerated, unique cadence that he has deliberately refined over years.",
            "**Sumit Anand:** Raw, lazy, unbothered energy. His entire persona revolves around the joke that he simply doesn't care."
          ] },
          { type: 'callout', variant: 'important', text: "Character isn't static. It can change from bit to bit. You can be angry in one story and completely apathetic in the next, as long as it feels authentic to your overarching stage persona." }
        ]
      },
      {
        id: "c1-l4",
        title: "The 7 Genres of Comedy",
        slug: "genres-of-comedy",
        type: "exploration",
        duration: "35 min",
        content: [
          { type: 'intro', text: "Comedy isn't just one flavor. It's a vast spectrum ranging from pure observation to the utterly absurd. Knowing the genres allows you to find your own specific voice." },
          { type: 'heading', text: "Mapping the Spectrum" },
          { type: 'list', items: [
            "**Observational:** Taking something everyone knows but hasn't articulated, and giving it a new frame (e.g. Jerry Seinfeld).",
            "**Anecdotal:** Building humor out of personal storytelling. Most of Samay's material is anecdotal.",
            "**One-liners:** The most compact, difficult form. One sentence that both sets up and pays off. ('Dogs are forever in the push-up position.')",
            "**Dark Comedy:** Jokes on taboo or painful subjects. The goal isn't shock value; it is liberation. When you laugh at something that scared you, you diffuse its power.",
            "**Alt (Alternative) Comedy:** Deliberately subverting the expected mainstream format. E.g., bringing a harmonium on stage or treating silence as the joke.",
            "**Anti-humor:** Giving an elaborate setup but intentionally failing to deliver a satisfying punchline. The humor is found in the audience's frustration.",
            "**Topical:** Jokes about current, trending events. Highly effective immediately, but age very poorly."
          ] },
          { type: 'quote', text: "Any good joke offends 50% of the room and makes the other 50% laugh.", author: "Varun Grover" }
        ]
      },
      {
        id: "c1-l5",
        title: "The Grind: Comedy as Calculation",
        slug: "comedy-as-math",
        type: "execution",
        duration: "15 min",
        content: [
          { type: 'intro', text: "Is comedy a natural-born talent? Definitively, no. Just like chess, it is a craft that requires calculated execution, iteration, and sheer grit." },
          { type: 'heading', text: "The Open Mic Loop" },
          { type: 'paragraph', text: "Every joke must go through the open mic grinder. You try it with a long pause. If it bombs, you try it with a shorter pause. A single joke can go through dozens of revisions across several months before it is 'tight'. There are no shortcuts to a killer 4-minute set." },
          { type: 'heading', text: "Practical Rules of Thumb" },
          { type: 'list', items: [
            "**Start with what they know:** If you are known as a chess player, open with a chess joke to instantly establish community and trust.",
            "**The 'Say it Twice' Rule (Chris Rock):** When establishing a complex premise, repeat it twice. If the audience misunderstands the world, the punchlines will die on arrival.",
            "**Separate Art from Artist:** You can condemn a creator's personal actions while still dissecting and learning from their undeniable technical mastery of the craft."
          ] },
          { type: 'callout', variant: 'important', text: "Stand-up is not just entertainment. It is math. It is science. There is precise calculation in timing, in choosing assumptions, and in identifying the exact angle to deviate from an expectation." }
        ],
        keyTakeaways: [
          "Comedy is an iterative science, not a spontaneous accident.",
          "Clarity is king. If they don't understand the setup, the punchline doesn't exist."
        ]
      }
    ],
    exercises: [
      {
        id: "c1-e1",
        title: "The Assumption Game",
        type: "challenge",
        description: "Write down 3 mundane setups (e.g., 'I got into an Uber today.'). For each, list 5 logical assumptions an audience might make. Then, write a punchline that shatters the strongest assumption."
      }
    ],
    project: {
      title: "Write a Tight 2-Minute Set",
      description: "Using Samay's Excel method, draft a 2-minute set. Color code your Premise (Blue), Setups (Green), Punchlines (Yellow), and Tags (Orange). Ensure there is exactly 0% 'white' filler."
    }
  },
  {
    id: "2",
    title: "The Science & Mechanics of Humor",
    slug: "science-of-humor",
    description: "Deconstruct the theories of laughter and the technical engineering behind every great punchline from the Comedy Bible.",
    duration: "4.5 hours",
    lessons: [
      {
        id: "c2-l1",
        title: "Why Things Are Funny",
        slug: "why-things-are-funny",
        type: "theory",
        duration: "30 min",
        content: [
          { type: 'intro', text: "Laughter isn't magic. It's a physiological response to cognitive surprise. To write comedy, you must first understand the fundamental theories of why the human brain laughs." },
          { type: 'heading', text: "The Core Theories of Humor" },
          { type: 'list', items: [
            "**The Incongruity Theory:** The most important theory. A joke programs a prediction in the brain, and the punchline logically but unexpectedly breaks it.",
            "**The Benign Violation Theory:** Humor occurs when something is simultaneously a violation (threatening/taboo) and benign (harmless/acceptable). The laugh exists exactly on the boundary line.",
            "**Superiority Theory:** Laughing at vs. laughing with. Used correctly (punching up), it targets the powerful. Used poorly (punching down), it is cruel.",
            "**Relief Theory (Freud):** Laughter is the release of psychological tension. This is why comedians can make you laugh about death or failure."
          ] },
          { type: 'callout', variant: 'important', text: "Example of Benign Violation: Neville Shah's material about his mother's death works because the incredible craft and clear affection he displays makes the taboo subject feel safe (benign) to laugh at." }
        ],
        keyTakeaways: [
          "A random non-sequitur isn't funny. The surprise must make logical sense in retrospect.",
          "Dark comedy isn't just transgression; it's a therapeutic release valve."
        ]
      },
      {
        id: "c2-l2",
        title: "Advanced Joke Architecture",
        slug: "advanced-architecture",
        type: "framework",
        duration: "35 min",
        content: [
          { type: 'intro', text: "Beyond the basic setup and punchline, you need specific architectural tools to force the audience down the wrong path." },
          { type: 'heading', text: "Structural Principles" },
          { type: 'list', items: [
            "**The Rule of Three:** The human brain naturally anticipates completing a pattern. The first two items establish the pattern, the third shatters it.",
            "**The Specificity Principle:** 'My uncle brought his hip flask to refill at the open bar' is funnier than 'My uncle drinks a lot'. Specify instead of generalizing.",
            "**The 'K' Rule:** Words with hard consonant sounds (K, G, P) are inherently funnier than soft sounds.",
            "**Misdirection:** Different from a simple punchline. A misdirection actively guides the audience to a specific false conclusion."
          ] }
        ]
      },
      {
        id: "c2-l3",
        title: "The Punchline's Engineering",
        slug: "punchline-engineering",
        type: "technique",
        duration: "25 min",
        content: [
          { type: 'intro', text: "Writing comedy is 10% creation and 90% deletion. The economy of words is what turns a mild chuckle into an explosive laugh." },
          { type: 'heading', text: "The Editing Principle" },
          { type: 'paragraph', text: "Every single word in a joke must earn its place. If a joke can be told in 20 words, telling it in 30 words injects 10 words of dead space that deflates the punchline." },
          { type: 'callout', variant: 'warning', text: "The First Word Rule: In a well-written joke, the very first word of the punchline should be the reveal. Don't hide the funny word at the end of a long sentence. Frontload the surprise." },
          { type: 'heading', text: "Case Study: The Jeselnik Edit" },
          { type: 'paragraph', text: "**Amateur Version:** 'My dad was the kind of person who never really believed in reading from instruction manuals at all. He always used to say to me that you learn by doing things and going wrong. So because of that I never actually got the chance to take any proper swimming classes when I was young. He would just pick me up and throw me into the water.'" },
          { type: 'paragraph', text: "**Professional Version (Anthony Jeselnik):** 'My father never believed in reading instruction manuals. He said you do things, you go wrong, that's how you learn. So I never got to take swimming classes. He'd just throw me in the water.'" }
        ]
      },
      {
        id: "c2-l4",
        title: "Status Dynamics in Comedy",
        slug: "status-dynamics",
        type: "psychology",
        duration: "20 min",
        content: [
          { type: 'intro', text: "Every joke contains a status dynamic. The comedian is either playing high status or low status." },
          { type: 'heading', text: "Choosing Your Status" },
          { type: 'list', items: [
            "**High Status:** Confident, bold, aggressive. The comedian acts superior to the world. Works brilliantly for dark comedy.",
            "**Low Status:** Vulnerable, hapless, relatable loser energy. The comedian makes themselves the butt of the joke."
          ] },
          { type: 'callout', variant: 'info', text: "The Danger Zone: If you attempt a high-status joke while emanating low-status nervous energy, the joke will fundamentally fail. Align your material with your stage persona." }
        ]
      }
    ],
    exercises: [
      {
        id: "c2-e1",
        title: "The Jeselnik Reduction",
        type: "challenge",
        description: "Take a funny 5-minute story you tell your friends. Write it out fully. Now, ruthlessly delete 40% of the words without losing a single laugh point. Force the funny words to the front of the punchline sentences."
      }
    ]
  },
  {
    id: "3",
    title: "The Writing Process (Deep Dive)",
    slug: "writing-process",
    description: "Learn the obsessive, meticulous systems used by Jerry Seinfeld, George Carlin, and Chris Rock to generate legendary material.",
    duration: "5 hours",
    lessons: [
      {
        id: "c3-l1",
        title: "Finding the Premise",
        slug: "finding-the-premise",
        type: "methodology",
        duration: "30 min",
        content: [
          { type: 'intro', text: "Great writing doesn't start with a joke. It starts with an honest premise." },
          { type: 'heading', text: "Methods of Discovery" },
          { type: 'list', items: [
            "**Carlin's Private Truths:** Pick any topic. Ignore what you're 'supposed' to think. Ask yourself: 'What do I genuinely, privately think about this?'",
            "**Subverting the Cliché:** The audience expects the cliché, giving you a built-in setup to subvert.",
            "**Mining Personal Pain:** Richard Pryor proved that the most reliable source of great material is pain, embarrassment, and trauma."
          ] },
          { type: 'quote', text: "I don't have pet peeves — I have major, psychotic hatreds. And I think that's important to acknowledge.", author: "George Carlin" }
        ]
      },
      {
        id: "c3-l2",
        title: "The 'Don't Break the Chain' Habit",
        slug: "seinfeld-method",
        type: "system",
        duration: "25 min",
        content: [
          { type: 'intro', text: "Amateurs wait for inspiration. Professionals build systems. Jerry Seinfeld treats comedy as a daily, blue-collar job." },
          { type: 'heading', text: "Seinfeld's Core Philosophy" },
          { type: 'paragraph', text: "Jerry Seinfeld famously uses a large wall calendar. For every day he writes new material, he draws a big red 'X' over that day. After a few days, a chain forms. His only rule: **Don't break the chain.**" },
          { type: 'list', items: [
            "**Volume over Perfection:** Bad writing days are just as important as good ones. Form the habit.",
            "**The Two Selves:** When writing, you are the free-flowing creative. When editing, you must become a 'harsh prick' who ruthlessly deletes."
          ] },
          { type: 'callout', variant: 'important', text: "90% of notes lead nowhere. The notebook habit is about capturing everything immediately, because you never know which 10% will survive the grinder." }
        ]
      },
      {
        id: "c3-l3",
        title: "The Carlin Zettelkasten",
        slug: "carlin-archive",
        type: "system",
        duration: "25 min",
        content: [
          { type: 'intro', text: "George Carlin was an archivist. His comedy was built through rigorous, academic-level categorization." },
          { type: 'heading', text: "The Filing System of a Genius" },
          { type: 'list', items: [
            "**Categorization:** He sorted notes into files with tags like 'Death', 'Euphemisms', 'Airline lies', 'Hypocrisy'.",
            "**Cross-referencing:** A joke about an airplane might merge with a joke about corporate language three years later.",
            "**Discovery through Expansion:** Carlin viewed writing as a journey. He would take a simple note and write endlessly on it."
          ] }
        ]
      },
      {
        id: "c3-l4",
        title: "The Chris Rock Lab",
        slug: "rock-method",
        type: "execution",
        duration: "30 min",
        content: [
          { type: 'intro', text: "Chris Rock's process revolves around 'little bets', pushing boundaries, and rigorous real-world testing." },
          { type: 'heading', text: "Going to Jerusalem" },
          { type: 'paragraph', text: "Rock's 'Jerusalem Principle': Once you find a premise, push it to its most extreme possible version. Don't stop at the comfortable middle." },
          { type: 'list', items: [
            "**Unannounced Sets:** Rock performs raw, unpolished notes at small clubs unannounced.",
            "**The Slip Method:** Rock writes jokes on modular slips of paper, moving them around on tables to find the perfect structural flow.",
            "**The Naked Test:** Can you write the joke on paper, hand it to someone, and still get a laugh?"
          ] }
        ]
      }
    ],
    project: {
      title: "Establish Your Chain",
      description: "Buy a physical wall calendar. For the next 14 days, write at least 3 unique premises and 5 supporting punchlines per day. Mark every successful day with a Red X. Do not break the chain."
    }
  },
  {
    id: "4",
    title: "Performance Craft & Stage Survival",
    slug: "performance-craft",
    description: "Master the real-time skills required when you are alone under the lights with an unpredictable audience.",
    duration: "3.5 hours",
    lessons: [
      {
        id: "c4-l1",
        title: "Timing is Music",
        slug: "timing-is-music",
        type: "technique",
        duration: "25 min",
        content: [
          { type: 'intro', text: "Stand-up delivery is fundamentally musical. If your timing is off, the laugh never resolves, much like a chord left hanging." },
          { type: 'heading', text: "The Rhythm of Delivery" },
          { type: 'paragraph', text: "The setup has a specific rhythm. The pause (the beat) is the rest between phrases. The punchline is the resolution." }
        ]
      },
      {
        id: "c4-l2",
        title: "Reading the Room",
        slug: "reading-the-room",
        type: "psychology",
        duration: "30 min",
        content: [
          { type: 'intro', text: "Every audience is a different organism. A Friday night festival crowd differs entirely from a quiet Tuesday club." },
          { type: 'list', items: [
            "**Warm Room:** Forgiving, generous. You can take your time and do slower, longer material.",
            "**Cold Room:** Skeptical, quiet. You must hit them with rapid-fire punchlines to build trust.",
            "**Dead Room:** Absolute silence. Acknowledge the tension and change your strategy immediately."
          ] },
          { type: 'paragraph', text: "Never maintain a flat energy line. Open strong -> Build to a minor dip -> Escalate -> Killer Close." }
        ]
      },
      {
        id: "c4-l3",
        title: "Crowd Work",
        slug: "crowd-work",
        type: "technique",
        duration: "35 min",
        content: [
          { type: 'intro', text: "Crowd work is high-wire improvisation. True crowd work is not just insulting people. It is rapid pattern recognition. You ask a question, isolate the absurdity, and build a premise." }
        ]
      },
      {
        id: "c4-l4",
        title: "Bombing & Hecklers",
        slug: "survival-skills",
        type: "survival",
        duration: "35 min",
        content: [
          { type: 'intro', text: "Bombing is inevitable. What you do after a joke dies is a greater display of skill than the joke itself." },
          { type: 'list', items: [
            "**Never Panic:** Visible apology destroys the room's energy.",
            "**The Recovery Line:** A prepared, meta-commentary on your own failure. '...Yeah, I workshopped that one for weeks.'"
          ] },
          { type: 'heading', text: "Handling the 3 Hecklers" },
          { type: 'list', items: [
            "**The Drunk:** Shut them down quickly with no mercy.",
            "**The Trying-to-be-Funny:** Acknowledge them once with a sharp comeback, then cut them off.",
            "**The Hostile:** Deliver a short, decisive, overwhelming response."
          ] }
        ]
      }
    ],
    exercises: [
      {
        id: "c4-e1",
        title: "The Disaster Scenario",
        type: "challenge",
        description: "Write down 5 absolute 'bomb recovery' lines that match your specific character. Something you can automatically trigger the moment a punchline is met with dead silence."
      }
    ]
  },
  {
    id: "5",
    title: "Philosophy & Career Trajectory",
    slug: "philosophy-career",
    description: "The ethics of comedy and the harsh reality of building a 10-year career.",
    duration: "4 hours",
    lessons: [
      {
        id: "c5-l1",
        title: "The Ethics of Comedy",
        slug: "ethics-of-comedy",
        type: "ethics",
        duration: "30 min",
        content: [
          { type: 'intro', text: "The comedian is the modern court jester—the only person permitted to speak the unsayable truth. With that privilege comes critical responsibility." },
          { type: 'heading', text: "Punching Up vs. Punching Down" },
          { type: 'list', items: [
            "**Punching Up:** Targeting those with more power, privilege, or immunity. This produces catharsis.",
            "**Punching Down:** Targeting the vulnerable, marginalized, or disadvantaged. This produces discomfort, and relies on lazy writing."
          ] },
          { type: 'quote', text: "The duty of comedy is to find what's true and funny. Not just what's funny.", author: "George Carlin" }
        ],
        keyTakeaways: [
          "Comedy = Tragedy + Time + Emotional Distance.",
          "Jokes without any truth feel like noise."
        ]
      },
      {
        id: "c5-l2",
        title: "Authenticity: The Unfakable Trait",
        slug: "authenticity",
        type: "philosophy",
        duration: "25 min",
        content: [
          { type: 'intro', text: "An audience can smell inauthenticity instantly. Trust is the invisible contract of live performance." },
          { type: 'paragraph', text: "You can play an exaggerated character on stage, provided that character is deeply rooted in your true self. The comedians who survive are those whose material feels impossible to steal, because it is inherently theirs." },
          { type: 'quote', text: "The audience doesn't know what they want. They just know when they're getting something real.", author: "Dave Chappelle" },
          { type: 'callout', variant: 'important', text: "Originality vs. Influence: You should steal George Carlin's structural techniques, but you must never steal their premise. The content must be 100% yours." }
        ]
      },
      {
        id: "c5-l3",
        title: "The Long Game (Building a Career)",
        slug: "the-long-game",
        type: "execution",
        duration: "40 min",
        content: [
          { type: 'intro', text: "There are no shortcuts. A great comedy career takes a decade of invisible suffering before the visible success." },
          { type: 'heading', text: "The 10,000 Hour Reality" },
          { type: 'paragraph', text: "It takes 7-10 years of consistent performance to become genuinely distinct. A 4-minute tight set can take 8 months of open mic iteration." },
          { type: 'list', items: [
            "**The Progression Stack:** Open Mics (5 min) -> Club Spots (15 min) -> Feature Act (30 min) -> Headliner (60 min). Skipping levels due to viral fame often leads to stage exposure.",
            "**The Iceberg Principle:** The audience sees a 5-minute effortless bit. They do not see the dozens of bomb sessions, notebook rewrites, and 2 AM panics required to engineer it.",
            "**Social Media vs Stage:** A comedian who is huge online but weak on stage will eventually be found out. Live comedy has no editing."
          ] }
        ],
        keyTakeaways: [
          "The most natural-sounding comedian has rehearsed the hardest.",
          "Consistency beats raw talent over a 10-year timeline."
        ]
      }
    ]
  },
  {
    id: "6",
    title: "The Writing Gymnasium (12 Processes)",
    slug: "writing-gymnasium",
    description: "12 distinct writing processes with step-by-step breakdowns and examples. The goal isn't to produce finished jokes immediately — it's to train your brain to find angles.",
    duration: "6 hours",
    lessons: [
      {
        id: "c6-l1",
        title: "Insight & Exaggeration (Processes 1-3)",
        slug: "insight-exaggeration",
        type: "technique",
        duration: "40 min",
        content: [
          { type: 'intro', text: "The foundation of joke writing is taking a raw observation and giving it an angle." },
          { type: 'heading', text: "Process 1: Assumption Mapping" },
          { type: 'paragraph', text: "Take any setup. Write down every assumption a listener forms. Then write punchlines that go as far from those assumptions as possible. The further, the better — as long as it still makes retroactive sense." },
          { type: 'list', items: [
            "**Setup:** 'My parents always told me I could be anything I wanted when I grew up.'",
            "**Assumptions:** They were supportive, he became something impressive, they wanted him to be a doctor/engineer.",
            "**Punchline:** 'So I became a chess player. They\\'ve never fully recovered.'"
          ] },
          { type: 'heading', text: "Process 2: The Observation -> Insight -> Joke Chain" },
          { type: 'paragraph', text: "Raw observation is not a joke. It needs an insight: 'Why is this strange?'" },
          { type: 'list', items: [
            "**Observation:** Pilots always explain what they're flying over, as if passengers care.",
            "**Insight:** Nobody is looking out the window. The monologue exists to remind you that a human being is driving this thing.",
            "**Joke (Seinfeld):** 'The pilot says \"folks, if you look to your right you\\'ll see the Grand Canyon.\" Who is looking? We\\'re on our third movie and a bag of pretzels. The Grand Canyon is not the in-flight entertainment.'"
          ] },
          { type: 'heading', text: "Process 3: The Exaggeration Engine" },
          { type: 'paragraph', text: "Take a truth. Exaggerate it until it's absurd. The exaggeration should feel like the logical conclusion of the truth." },
          { type: 'list', items: [
            "**Truth:** Chess players take a long time to make moves.",
            "**10x Exaggeration:** The time taken is so long it creates existential situations.",
            "**Joke:** 'My opponent thought for 40 minutes on move 12. I aged. I watched a cloud form and dissolve outside the window. I\\'d started the game single. I was ready for a relationship by the time he moved his knight.'"
          ] }
        ]
      },
      {
        id: "c6-l2",
        title: "Volume & The Personal Map (Processes 4-6)",
        slug: "volume-personal-map",
        type: "technique",
        duration: "45 min",
        content: [
          { type: 'intro', text: "Break conventions, generate sheer volume, and mine your own personal history." },
          { type: 'heading', text: "Process 4: The Reversal" },
          { type: 'paragraph', text: "Take any conventional wisdom and ask: 'What if it's actually the opposite?'" },
          { type: 'callout', variant: 'info', text: "Expected Narrative: Stand-up comedy is about making people feel good.\n\nReversal Joke: 'Stand-up comedy is not about making you feel good. It\\'s about making you feel understood. Good is a spa. Comedy is someone saying out loud the thing you\\'ve been ashamed of privately, and everyone going \"oh thank god, me too.\"'" },
          { type: 'heading', text: "Process 5: The 10 Punchline Method" },
          { type: 'paragraph', text: "Chris Rock's method: Write one setup. Force yourself to write 10 different punchlines without stopping. The first 3 are obvious. The last 4 will be genuinely surprising because you've depleted the obvious angles." },
          { type: 'heading', text: "Process 6: Personal Map" },
          { type: 'paragraph', text: "Draw a map of your life. Ask 7 questions about embarrassed moments, failures, and beliefs. The material from your life will always be more specific than anything invented." }
        ]
      },
      {
        id: "c6-l3",
        title: "Engineering Constraints (Processes 7-9)",
        slug: "engineering-constraints",
        type: "technique",
        duration: "40 min",
        content: [
          { type: 'intro', text: "Structure and constraints are where the precision of comedy emerges." },
          { type: 'heading', text: "Process 7: The Comparison Engine" },
          { type: 'paragraph', text: "Find two completely unrelated things that share a hidden structural similarity." },
          { type: 'list', items: [
            "**Thing A:** LinkedIn. (People perform success, treat job changes as spiritual journeys)",
            "**Thing B:** A parent at a school sports day.",
            "**Joke:** 'LinkedIn is just school sports day for adults. Same energy... \"Excited to announce I\\'ve taken on a new challenge.\" Okay. Same as \"Arjun did a really good drawing today.\"'"
          ] },
          { type: 'heading', text: "Process 8: 'And then what?'" },
          { type: 'paragraph', text: "Start with a scenario. Ask 'and then what?' repeatedly to build a routine rather than just a single joke. Each \"and then what?\" step is a potential punchline or tag." },
          { type: 'heading', text: "Process 9: The Editing Pass System" },
          { type: 'paragraph', text: "Don't edit once. Edit four times." },
          { type: 'list', items: [
            "**Pass 1:** Cut Pass (Remove 30% of words).",
            "**Pass 2:** Specificity Pass ('A car' -> 'A 2006 Maruti Swift').",
            "**Pass 3:** Punchline-first Pass (Move the surprise forward).",
            "**Pass 4:** Read-aloud Pass (Fix rhythm stumbles)."
          ] }
        ]
      },
      {
        id: "c6-l4",
        title: "Advanced Structures & Routine (Processes 10-12)",
        slug: "advanced-structures-routine",
        type: "technique",
        duration: "45 min",
        content: [
          { type: 'intro', text: "Handling dangerous material, engineering long-term payoffs, and maintaining the daily grind." },
          { type: 'heading', text: "Process 10: Taboo Approach" },
          { type: 'paragraph', text: "Make a list of topics you would never joke about. Force yourself to find the joke. The fear is a signal, not a stop sign." },
          { type: 'callout', variant: 'warning', text: "The Test before publishing: Is there a real human truth? Who is the target? Does the joke illuminate something or just poke at pain?" },
          { type: 'heading', text: "Process 11: The Callback Architecture" },
          { type: 'paragraph', text: "Callbacks are engineered. Plant the seed early as a throwaway detail. The callback punchline must work on two levels: the new meaning AND the memory of the original." },
          { type: 'heading', text: "Process 12: The Daily Exercise Routine" },
          { type: 'paragraph', text: "20 minutes maximum per day. Keep the muscle active." },
          { type: 'list', items: [
            "**Drill 1:** One observation (3 min).",
            "**Drill 2:** Two punchlines for yesterday's observation (5 min).",
            "**Drill 3:** Cut a joke by 20% (5 min).",
            "**Drill 4:** Write the opposite statement of a phrase heard today (3 min).",
            "**Drill 5:** One comparison sentence (4 min)."
          ] }
        ]
      }
    ],
    project: {
      title: "The 20 Starter Setups Challenge",
      description: "Use any of the 12 processes to turn these raw premises into jokes: 1) I've been trying to wake up earlier. 2) My phone battery is always at 7% when I need it. 3) My relatives all have the same three questions for me. 4) I watched a whole series I didn't like just to finish it. 5) I rehearsed an argument in my head and won..."
    }
  }
];
