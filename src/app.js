const STORE_KEY = "pulpitos:web:v1";
const PF_BUILD = document.querySelector('meta[name="pf-build"]')?.content || "dev";
const OPENAI_KEY_STORE = "preach-flow:openai-api-key:v1";
const THEME_STORE = "preach-flow:theme:v1";
const SUPABASE_SCRIPT = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/documents",
  // Read-only Drive access powers the Library's "browse your Google Docs"
  // import. PreachFlow only reads the documents the user checks.
  "https://www.googleapis.com/auth/drive.readonly",
].join(" ");

const BLOCKS = [
  { label: "Exegesis", when: "4 weeks out" },
  { label: "Study", when: "3 weeks out" },
  { label: "Outline & Application", when: "2 weeks out" },
  { label: "Polish & Delivery", when: "preaching week" },
];

const PHASES = [
  {
    id: "plan",
    name: "Plan & Pray",
    block: 0,
    devotional: true,
    focus:
      "Begin on your knees. Plan the work, then ask the Spirit to illuminate the text before you study a single word. A sermon is born from worship before it becomes a message.",
    doItems: [
      "Spend unhurried time with the Father before prep",
      "Confirm the passage, date, and series",
      "Ask the Spirit to open the text and your heart",
    ],
    enc: "You started on your knees. That is the only place a sermon should begin.",
  },
  {
    id: "immersion",
    name: "Immersion",
    block: 0,
    focus:
      "Get familiar with the passage itself - not commentary about it. Read it until you know it, then nail down the facts that frame its original meaning.",
    doItems: [
      "Read the passage roughly 20 times in your preferred Bible",
      "Read it in multiple versions",
      "Record every question - confusing, surprising, hard",
      "Identify the facts: author, original audience, date, purpose",
    ],
    actions: [
      {
        label: "React to my questions & facts",
        placeholder: "Paste your questions and the facts you found...",
        seed:
          "I have read the passage repeatedly and noted my questions plus the facts (author, audience, date, purpose). React - what facts am I missing, and what questions does the text raise that I have not asked? Do not do it for me. Here is what I have:\n\n",
      },
    ],
    enc:
      "You know the text now - not about it, but it itself. That familiarity will preach.",
  },
  {
    id: "passagemap",
    name: "Passage Map",
    block: 0,
    focus:
      "Map the passage before you shape the sermon. Mark repeated words, commands, contrasts, and logical connectors; divide the text into movements - so the outline emerges from the structure and burden of the passage itself, not from a template.",
    doItems: [
      "Load or paste the passage into the Passage Map",
      "Mark repeated words, commands, contrasts, and connectors",
      "Divide the passage into sections with titles and functions",
      "Summarize what the passage is doing and the response it calls for",
    ],
    actions: [
      {
        label: "React to my passage map",
        placeholder: "Describe your marks, sections, and flow so far…",
        seed:
          "I've been mapping the passage - marking repeated words, connectors, and movements, and dividing it into sections. React to my map: what patterns might I be missing, which section divisions feel imposed rather than observed, and what does the structure itself suggest the passage is doing? Don't map it for me. Here's where I am:\n\n",
      },
    ],
    enc: "You've seen the shape of the text itself. Now the outline can come from the passage, not from a template.",
  },
  {
    id: "exegesis",
    name: "First-Pass Exegesis",
    block: 0,
    focus:
      "Trace what the text actually says - still no commentaries. Observe, study the key words, and build an exegetical outline that follows the thought-flow of the passage.",
    doItems: [
      "List raw observations: repeated words, commands, tensions, connectors",
      "Mark the structure and where paragraphs break",
      "Word study on the key terms, verbs first",
      "Build an exegetical outline tracing the thought-flow",
      "Note the early gospel thread or Christ connection",
    ],
    actions: [
      {
        label: "React to my exegesis",
        placeholder: "Paste your observations and exegetical outline...",
        seed:
          "Here is my first-pass exegesis with no commentaries yet - observations, structure, key words, and my exegetical outline. React: what did I miss, where is my structural read fuzzy, which repeated word or connector did I overlook, what question am I not asking? Do not redo it. Here it is:\n\n",
      },
    ],
    enc:
      "You let the text speak before anyone told you what it says. That is faithful work.",
  },
  {
    id: "meditation",
    name: "Personal Meditation",
    block: 0,
    devotional: true,
    focus:
      "Before this is a message for them, let it be worship in you. Sit with the text personally - this is where the sermon gets its weight.",
    doItems: [
      "What does this show me about God to praise him for?",
      "What sin does it expose that I should confess?",
      "What idol comes alive when I forget this truth?",
      "What need does it reveal, and what must I become?",
      "How is Christ's grace crucial to meeting that need?",
      "How would my life change if this were fully alive in me?",
      "Why is God showing me this now?",
    ],
    enc:
      "Before it is a message for them, it became worship in you. Keep that order.",
  },
  {
    id: "commentary",
    name: "Commentary & Research",
    block: 1,
    focus:
      "Now - and only now - consult the faithful. Compare your work with the commentators, gather theology and cross-references, and bring in cultural or statistical research that builds the tension the text addresses. Do not let research become the sermon.",
    doItems: [
      "Consult commentaries (Sailhamer, Stott, Carson, Atkinson) - compare, do not copy",
      "Note theological themes and OT/NT cross-references",
      "Name the points of tension in the text",
      "Gather cultural or statistical insight that exposes the problem",
    ],
    actions: [
      {
        label: "Interrogate my research",
        placeholder: "Paste your commentary and research notes...",
        seed:
          "Help me interrogate my research - where do sources disagree, what should I weigh, what is interesting but does not belong in this sermon. Do not synthesize it into a sermon for me; help me think. Guard against research becoming the sermon. Here is what I gathered:\n\n",
      },
    ],
    enc: "You checked your work against the faithful without handing them the pen.",
  },
  {
    id: "aim",
    name: "The Aim",
    block: 1,
    focus:
      "Settle the target before you build. Name the Fallen Condition the text addresses, the author's intended meaning, and land one governing proposition. Rifle, not shotgun.",
    doItems: [
      "Name the main burden of the text in the worksheet",
      "Identify the Fallen Condition the text confronts",
      "Name how the gospel meets that condition",
      "Write the present-tense purpose: my goal is for you to ___ so that ___",
    ],
    actions: [
      {
        label: "Pressure-test my aim",
        placeholder: "Paste your FCF, big idea, and purpose statement...",
        seed:
          "Pressure-test my aim. Is there one governing big idea or several competing? Does it come from the text or a clever angle? Does the FCF genuinely arise from the passage? Does the purpose name what the sermon should do? Challenge me where it is unclear; do not rewrite it. Here is what I have:\n\n",
      },
    ],
    enc: "One clear shot. Now everything in the sermon serves that single target.",
  },
  {
    id: "gospel",
    name: "Gospel Center",
    block: 1,
    focus:
      "Make sure Christ is the hero. Show how the text necessitates, foreshadows, or elucidates Jesus - and how his grace empowers the obedience you will call for. The gospel is woven, not bolted on.",
    doItems: [
      "How does this text necessitate, foreshadow, or elucidate Christ?",
      "How does the grace of Jesus empower us to live out this text?",
      "Where does the gospel thread run through the whole message, not just the end?",
    ],
    actions: [
      {
        label: "Test my gospel connection",
        placeholder: "Paste your Christ connection or gospel thread...",
        seed:
          "Test my gospel connection. Is Christ genuinely the hero here, or have I drifted into moralism? Does the connection arise from the text or get forced? Is the gospel woven throughout or only tacked on at the end? Push only where it is weak or unclear. Here is my thinking:\n\n",
      },
    ],
    enc: "Christ is the hero, not a footnote. Keep him at the center all the way through.",
  },
  {
    id: "structure",
    name: "Structure & Outline",
    block: 2,
    focus:
      "Build the homiletical outline - 2 to 4 talking points that serve the proposition. Each point carries explanation, illustration, and application. Write your transitions explicitly.",
    doItems: [
      "Draft 2 to 4 points that support the proposition",
      "Under each: explanation, illustration, application",
      "Write each transition out word-for-word",
      "Confirm the structure flows from the text, not onto it",
    ],
    actions: [
      {
        label: "Check my outline",
        placeholder: "Paste your outline and transitions...",
        seed:
          "Check my outline. Does the structure flow from the text or get imposed on it? Does each point have explanation, illustration, and application? Is any point carrying too much? Are the transitions real moves or just labels? Do not rebuild it. Here it is:\n\n",
      },
    ],
    enc: "The bones are set, and they came from the text. Now we put flesh on them.",
  },
  {
    id: "application",
    name: "Application & Walk-Away",
    block: 2,
    focus:
      "Make it land in real life. Application must be specific, not general, religious, or vague - concrete changes for Monday. Then distill the one thing they will remember: the walk-away point.",
    doItems: [
      "Sharpen each application - concrete, real-life, specific",
      "Answer: So what? Why does this matter?",
      "Answer: Now what? What do they do with it?",
      "Write the walk-away in one clear, compelling sentence",
    ],
    actions: [
      {
        label: "Sharpen my application",
        placeholder: "Paste your applications and walk-away point...",
        seed:
          "Sharpen my application and walk-away. Is any application too general, religious, or vague? Does it deal with real life and give concrete next steps? Is the walk-away point clear, compelling, and connected to most of the room? Push only where it is soft. Here is what I have:\n\n",
      },
    ],
    enc: "You did not settle for vague and religious. Real people will know what to do Monday.",
  },
  {
    id: "invitation",
    name: "Invitation",
    block: 2,
    focus:
      "Leave the door open for someone to meet Jesus. Plan how you will call the unbeliever to respond - the transition into it, the call itself, and the simple action they will take.",
    doItems: [
      "Decide the type of invitation",
      "Write the transitional sentence that moves you into it",
      "Define the simple action to respond",
    ],
    actions: [
      {
        label: "Check my invitation",
        placeholder: "Paste your invitation and transition...",
        seed:
          "Check my invitation. Is the unbeliever clearly called to a decision? Is the transition into it natural, not abrupt? Is the response simple and clear? Push only where it is missing or muddy. Here is my plan:\n\n",
      },
    ],
    enc: "You left the door open for someone to meet Jesus. Never preach without it.",
  },
  {
    id: "introtitle",
    name: "Introduction & Title",
    block: 3,
    focus:
      "Now write the front door - last, on purpose. Grab attention in the first minutes, raise the fallen-condition tension, and move into your proposition. Then give the sermon a title that advertises its content.",
    doItems: [
      "Write an intro that grabs attention and raises the tension",
      "Land the transitional statement into your proposition",
      "Choose a title that reflects and advertises the message",
    ],
    actions: [
      {
        label: "React to my intro",
        placeholder: "Paste your introduction and title...",
        seed:
          "React to my introduction and title. Does the intro grab attention and raise the real tension or FCF? Does it move cleanly into the proposition? Does the title advertise the actual content? Push only where it drags or misses. Here it is:\n\n",
      },
    ],
    enc: "The front door is built. Now they will want to walk in.",
  },
  {
    id: "manuscript",
    name: "Manuscript",
    block: 3,
    focus:
      "Write it out, word for word, in your voice - clear, direct, pastoral, convictional, Scripture-saturated. You may not take the full manuscript to the pulpit, but writing it forces clarity. Pare it to preaching notes after.",
    doItems: [
      "Write the full manuscript in your voice (500+ words) - the head start below is assembled from your own work",
    ],
    actions: [
      {
        label: "Pressure-test my draft",
        placeholder: "Paste your manuscript...",
        seed:
          "Pressure-test my manuscript for clarity over cleverness, gospel centrality, pastoral force, and clutter. Tell me where it is vague, padded, or trying too hard, and whether it preaches to real people. Do not rewrite it. Here it is:\n\n",
      },
    ],
    enc: "The hard build is done. From here it is sharpening and surrender.",
  },
  {
    id: "readiness",
    name: "Readiness Check",
    block: 3,
    focus:
      "Before you call it ready, run the full check. This is where Preach Flow makes sure nothing is missing - the gospel, Christ as hero, illustrations, specific application, the invitation, and a clear landing.",
    doItems: [
      "Answer every readiness question below (or run the Sermon Guide check)",
      "Fix what is genuinely missing, then confirm it is ready to preach",
    ],
    actions: [
      {
        label: "Run completeness check",
        placeholder: "Paste your full sermon or manuscript...",
        seed:
          "Run a full completeness and clarity check on my sermon. For each element below tell me: PRESENT and clear, WEAK, or MISSING - and push only where something is genuinely missing or unclear. Affirm what is solid.\n- One clear big idea\n- Clear purpose (what it should do)\n- Structure flows from the text\n- Christ is the hero (Christ-centered, not moralistic)\n- Gospel woven throughout, not only at the end\n- Strong gospel landing\n- Explanation + illustration + application under each point\n- Concrete imagery in the illustrations\n- Specific application (not vague or merely religious)\n- Invitation that calls the unbeliever to a decision\n- Intro grabs attention and raises the tension\n- Conclusion presses the burden and calls for response\n- Clear walk-away point\nThen list exactly what to fix before Sunday. Here is the sermon:\n\n",
      },
    ],
    enc: "It is ready to preach. Now it is no longer a project - it is a trust.",
  },
  {
    id: "delivery",
    name: "Delivery Prep",
    block: 3,
    focus:
      "Get it into your body. Mark the sentences to emphasize, plan your delivery, time it, and rehearse aloud - with notes and without. Confidence in the pulpit is built here.",
    doItems: [
      "Step 1 - Read the manuscript aloud once, and underline the sentences that must land word for word",
      "Step 2 - Mark your delivery notes in the text: where to slow down, pause, drop the volume, or lift the energy",
      "Step 3 - Open Preach It and time a full run-through against your target length",
      "Step 4 - Run it once more without looking at your notes; keep only what you actually need",
    ],
    actions: [
      {
        label: "Guide my delivery plan",
        placeholder: "Paste your key sentences and delivery notes...",
        seed:
          "React to my delivery plan - key sentences to emphasize, tone/pacing notes, and timing. Where should I slow down, pause, or lift energy that I have not marked? Is anything too long for my target time? Here is my plan:\n\n",
      },
    ],
    enc: "You have put in the reps. Confidence in the pulpit is built in the study.",
  },
  {
    id: "heart",
    name: "Heart Prep",
    block: 3,
    devotional: true,
    focus:
      "The sermon is finished. Now prepare the preacher. Pray it in, invite honest feedback, and step into Sunday emptied of yourself and full of Christ.",
    doItems: [
      "Pray the sermon in: for boldness and freedom in the pulpit, for faithfulness to the text, for the specific people who will hear it, that the Word will not return void, and to be yourself while forgetting yourself",
    ],
    enc:
      "The sermon is finished. Now prepare the preacher. Forget yourself, and lift up Christ.",
  },
];

// ---- per-phase guide resources ----
// Curated starting points per phase (trusted, free where possible). Entries
// with `url` open externally; entries with `view` jump inside the app. The
// preacher's own links live in state.resources[phaseId] and render alongside.
const PHASE_RESOURCES = {
  plan: [
    { view: "debrief", label: "Debrief", note: "Learn from last Sunday before you begin the next one." },
    { view: "series", label: "Series Architect", note: "Confirm where this passage sits in the series arc." },
  ],
  immersion: [
    { url: "https://www.biblegateway.com", label: "BibleGateway", note: "Read the passage in many translations, back to back." },
    { url: "https://www.stepbible.org", label: "STEP Bible", note: "Compare versions side by side, with the original languages." },
    { url: "https://www.esv.org", label: "ESV.org", note: "Listen to the passage read aloud - hear what you've been missing." },
  ],
  exegesis: [
    { url: "https://www.blueletterbible.org", label: "Blue Letter Bible", note: "Word studies with Strong's numbers and lexicons." },
    { url: "https://biblehub.com", label: "Bible Hub", note: "Interlinear text, parsing, and cross-references." },
    { url: "https://netbible.org", label: "NET Bible", note: "Translators' notes on the hard calls in the text." },
  ],
  meditation: [
    { view: "journal", label: "Notes", note: "Journal what the text is doing in you this week." },
  ],
  commentary: [
    { url: "https://www.bestcommentaries.com", label: "Best Commentaries", note: "Which commentaries deserve your hours on this book." },
    { url: "https://bibleproject.com/explore", label: "BibleProject", note: "Book overviews for canonical and literary context." },
    { url: "https://www.logos.com", label: "Logos", note: "Passage guides, word studies, and your commentary library." },
  ],
  aim: [
    { url: "https://simeontrust.org", label: "Simeon Trust", note: "Workshop instruction on landing a text-driven big idea." },
    { url: "https://www.9marks.org", label: "9Marks", note: "Articles on expositional aim and purpose." },
  ],
  gospel: [
    { url: "https://www.thegospelcoalition.org", label: "The Gospel Coalition", note: "Christ-centered preaching resources - hero, not moralism." },
  ],
  structure: [],
  application: [
    { view: "lens", label: "Congregational Lens", note: "Aim the application at your actual church, not a generic one." },
  ],
  invitation: [],
  introtitle: [],
  manuscript: [
    { view: "editor", label: "Sermon Editor", note: "Write the manuscript full-page, with formatting, sizes, and export." },
  ],
  readiness: [
  ],
  delivery: [
    { view: "pulpit", label: "Preach It", note: "Your manuscript, the clock, and nothing else - for the run-through and for Sunday." },
  ],
  heart: [
    { view: "impact", label: "Impact Plan", note: "Pray through this week's prayer focus with your team." },
  ],
};

// Speaking paces offered in Preach It (used by state normalization,
// so it must be initialized before loadState() runs below).
const PRACTICE_WPM_CHOICES = [110, 130, 150];

// ---- Passage Map ----
// Text-mapping study data per sermon. Verses are stored as sanitized HTML
// carrying <mark> elements for the pastor's own category marks.
const PM_SUMMARY_KEYS = ["doing", "movement", "tension", "god", "humanity", "response", "movements"];

// The work under each outline movement: explain the text, illustrate it,
// apply it, and write the transition word for word.
const OUTLINE_PART_KINDS = [
  ["explanation", "Explanation"],
  ["illustration", "Illustration"],
  ["application", "Application"],
  ["transition", "Transition"],
];

function normalizePassageMap(map) {
  const source = map && typeof map === "object" ? map : {};
  const str = (value) => (typeof value === "string" ? value : "");
  const summarySource = source.summary && typeof source.summary === "object" ? source.summary : {};
  const summary = {};
  PM_SUMMARY_KEYS.forEach((key) => {
    summary[key] = str(summarySource[key]);
  });
  return {
    translation: str(source.translation),
    attribution: str(source.attribution),
    verses: Array.isArray(source.verses)
      ? source.verses.map((verse) => ({ ref: str(verse?.ref), html: str(verse?.html) }))
      : [],
    highlights: Array.isArray(source.highlights)
      ? source.highlights
          .filter((item) => item && item.id)
          .map((item) => ({
            id: str(item.id),
            category: str(item.category),
            text: str(item.text),
            verseRef: str(item.verseRef),
            note: str(item.note),
            relation: str(item.relation),
          }))
      : [],
    hiddenCategories: Array.isArray(source.hiddenCategories) ? source.hiddenCategories.filter(Boolean).map(String) : [],
    sections: Array.isArray(source.sections)
      ? source.sections
          .filter(Boolean)
          .map((section) => ({
            id: section.id || genId(),
            title: str(section.title),
            verseRange: str(section.verseRange),
            startRef: str(section.startRef),
            summary: str(section.summary),
            mainIdea: str(section.mainIdea),
            functionInPassage: str(section.functionInPassage),
          }))
      : [],
    observations: Array.isArray(source.observations)
      ? source.observations
          .filter(Boolean)
          .map((observation) => ({
            id: observation.id || genId(),
            type: str(observation.type) || "Observation",
            anchor: str(observation.anchor),
            content: str(observation.content),
            createdAt: observation.createdAt || new Date().toISOString(),
          }))
      : [],
    flow: {
      template: str(source.flow?.template),
      steps: Array.isArray(source.flow?.steps)
        ? source.flow.steps
            .filter(Boolean)
            .map((step) => ({
              id: step.id || genId(),
              label: str(step.label),
              description: str(step.description),
              verseRange: str(step.verseRange),
            }))
        : [],
    },
    summary,
    includeInExports: Boolean(source.includeInExports),
  };
}

// ---- Preaching Profile ----
// The preacher's workflow layer: defaults, homiletical preferences,
// convictions, review standards, and Sermon Guide posture. Distinct from
// Account (identity/security), Congregational Lens (the church), and the
// Workspace (the sermon).
function normalizePreachingProfile(profile) {
  const source = profile && typeof profile === "object" ? profile : {};
  const str = (value) => (typeof value === "string" ? value : "");
  const list = (value) => (Array.isArray(value) ? value.filter(Boolean).map(String) : []);
  const flag = (value, fallback) => (typeof value === "boolean" ? value : fallback);
  return {
    // 1. Preaching role
    role: str(source.role),
    context: str(source.context),
    cadence: str(source.cadence),
    day: str(source.day),
    // 2. Sermon defaults
    translation: str(source.translation),
    length: str(source.length) || str(source.targetTime),
    format: str(source.format),
    deliverable: str(source.deliverable),
    seriesBehavior: str(source.seriesBehavior),
    // 3. Homiletical preferences
    style: str(source.style),
    outlinePref: str(source.outlinePref),
    bigIdeaStyle: str(source.bigIdeaStyle),
    applicationEmphasis: list(source.applicationEmphasis),
    christConnection: str(source.christConnection),
    // 4. Convictions
    tradition: str(source.tradition),
    confession: str(source.confession),
    values: list(source.values),
    guardrails: str(source.guardrails),
    // 5. Sermon Guide preferences
    posture: list(source.posture),
    useProfile: flag(source.useProfile, true),
    useLens: flag(source.useLens, true),
    questionsFirst: flag(source.questionsFirst, false),
    // 6. Review rubric (defaults render as checked when unset)
    rubric: source.rubric && typeof source.rubric === "object" ? source.rubric : {},
    rubricCustom: list(source.rubricCustom),
    // 7. Preparation rhythm
    prepRhythm: str(source.prepRhythm),
    prepDays: list(source.prepDays),
    pressurePoints: list(source.pressurePoints),
    weeklyTarget: str(source.weeklyTarget),
    // 8. Output defaults
    exportFormat: str(source.exportFormat),
    productionOutputs: list(source.productionOutputs),
    audienceOutputs: list(source.audienceOutputs),
    onboarded: flag(source.onboarded, false),
  };
}

const DEFAULT_DRAFT = {
  passage: "",
  title: "",
  date: "",
  series: "",
  length: "40",
  format: "Full manuscript",
};

const app = document.getElementById("app");
let bannerTimer = null;
let googleTokenClient = null;
let cloudSyncTimer = null;
let cloudSyncPaused = false;

const ui = {
  showNew: false,
  showAuth: false,
  showCoach: false,
  showSwitcher: false,
  showDetails: false,
  showSlides: false,
  showImport: false,
  signinMode: "signin",
  switcherQuery: "",
  notesQuery: "",
  notesSermonId: "",
  impactTab: "home",
  profileTab: "profile",
  libraryQuery: "",
  librarySort: "date",
  libraryFilter: { book: "", series: "", topic: "" },
  debriefSermonId: "",
  debriefQuery: "",
  confirmDeleteId: "",
  practice: { running: false, seconds: 0 },
  pulpit: { mode: "live", section: 0, showSettings: false, startedAt: "", coachCollapsed: null },
  scripture: { show: false, ref: "", text: "", attribution: "", error: "", loading: false, slide: true, pulpit: true, production: true },
  refine: null,
  refineMenu: false,
  encourage: null,
  calImport: { show: false, text: "", rows: [], busy: false, gdocs: { open: false, loading: false, files: [], query: "", picked: {} } },
  reader: { show: false, reference: "", translation: "", verses: [], attribution: "", loading: false, error: "", translations: [], target: "" },
  newPassage: "",
  pm: { pen: "", selected: "", tool: "mark", paste: false, pasteText: "", pasteTranslation: "", bridge: false, selectedSection: "" },
  libImport: { show: false, queue: [], gdocs: { open: false, loading: false, files: [], query: "", picked: {} } },
  ministryWizard: null,
  ministryEdit: null,
  ministryOpen: null,
  activeSeriesId: "",
  drafting: "",
  dietRange: "12",
  audience: "Believer",
  showAudienceAdd: false,
  importText: "",
  importHtml: "",
  importStatusNote: "",
  journalEditingId: "",
  journalDraft: {
    sermonId: "",
    phaseId: "",
    title: "",
    body: "",
  },
  banner: "",
  loading: false,
  composer: "",
  composerPlaceholder: "Bring your work, or ask Sermon Guide a question...",
  serverStatus: { available: false, configured: false, checked: false },
  showOpenAIKey: false,
  openAIKeyInput: "",
  openai: {
    hasKey: Boolean(localStorage.getItem(OPENAI_KEY_STORE)),
  },
  auth: {
    configured: false,
    client: null,
    user: null,
    recovery: false,
    confirmInput: "",
    accessToken: "",
    emailInput: "",
    passwordInput: "",
    loading: false,
    status: "Saved on this device",
    statusKey: "neutral",
  },
  google: {
    clientId: "",
    configured: false,
    connected: false,
    loading: false,
    status: "Google Docs not connected",
    statusKey: "neutral",
    accessToken: "",
  },
};

const state = loadState();
if (!state.theme) state.theme = loadTheme();
if (!state.view) state.view = "workspace";
if (state.view === "slides") state.view = "editor";
if (state.view === "review") state.view = "home";
if (!state.query) state.query = "";
if (!state.filter || state.filter === "done") state.filter = "all";
if (!state.reviewMeta) state.reviewMeta = { passage: "", title: "" };
if (!state.reviewText) state.reviewText = "";
if (!state.reviewChecks || typeof state.reviewChecks !== "object") state.reviewChecks = {};
if (!state.google) state.google = { autoSync: true };
if (!Array.isArray(state.journalEntries)) state.journalEntries = [];
if (!Array.isArray(state.series)) state.series = [];
if (!state.lens || typeof state.lens !== "object") state.lens = normalizeLens(null);
if (!state.dietReview || typeof state.dietReview !== "object") state.dietReview = { text: "", at: "" };
if (!state.resources || typeof state.resources !== "object") state.resources = {};
state.practiceWpm = normalizeWpm(state.practiceWpm);
state.practiceFont = normalizeFontStep(state.practiceFont);
state.preachingProfile = normalizePreachingProfile(state.preachingProfile);
state.pulpitPrefs = normalizePulpitPrefs(state.pulpitPrefs);
state.bibleProvider = normalizeBibleProvider(state.bibleProvider);

function loadTheme() {
  const stored = localStorage.getItem(THEME_STORE);
  if (stored === "light" || stored === "dark") return stored;
  return "light";
}

function setTheme(theme) {
  state.theme = theme === "dark" ? "dark" : "light";
  localStorage.setItem(THEME_STORE, state.theme);
  render();
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
    return {
      sermons: Array.isArray(parsed.sermons) ? parsed.sermons.map(normalizeSermon) : [],
      activeId: parsed.activeId || null,
      view: parsed.view || "workspace",
      query: parsed.query || "",
      filter: parsed.filter || "all",
      reviewMeta: parsed.reviewMeta || { passage: "", title: "" },
      reviewText: parsed.reviewText || "",
      reviewChecks: parsed.reviewChecks && typeof parsed.reviewChecks === "object" ? parsed.reviewChecks : {},
      google: parsed.google || { autoSync: true },
      journalEntries: Array.isArray(parsed.journalEntries) ? parsed.journalEntries.map(normalizeJournalEntry) : [],
      series: Array.isArray(parsed.series) ? parsed.series.map(normalizeSeries) : [],
      lens: normalizeLens(parsed.lens),
      dietReview: parsed.dietReview && typeof parsed.dietReview === "object" ? parsed.dietReview : { text: "", at: "" },
      resources: normalizeResources(parsed.resources),
      practiceWpm: normalizeWpm(parsed.practiceWpm),
      practiceFont: normalizeFontStep(parsed.practiceFont),
      preachingProfile: normalizePreachingProfile(parsed.preachingProfile),
      pulpitPrefs: normalizePulpitPrefs(parsed.pulpitPrefs),
      bibleProvider: normalizeBibleProvider(parsed.bibleProvider),
    };
  } catch {
    return {
      sermons: [],
      activeId: null,
      view: "workspace",
      query: "",
      filter: "all",
      reviewMeta: { passage: "", title: "" },
      reviewText: "",
      google: { autoSync: true },
      journalEntries: [],
    };
  }
}

let localWipeInProgress = false;

function saveState() {
  if (localWipeInProgress) return;
  const snapshot = stateSnapshot();
  localStorage.setItem(
    STORE_KEY,
    JSON.stringify(snapshot),
  );
  if (!cloudSyncPaused) scheduleCloudSync();
}

// Persist to this device only - used by the work timer's periodic flush so a
// ticking clock doesn't trigger Google Docs / cloud syncs every minute. The
// accumulated time rides along on the next regular saveState().
function saveStateQuiet() {
  if (localWipeInProgress) return;
  localStorage.setItem(STORE_KEY, JSON.stringify(stateSnapshot()));
}

function stateSnapshot() {
  return {
    sermons: state.sermons,
    activeId: state.activeId,
    view: state.view,
    query: state.query,
    filter: state.filter,
    reviewMeta: state.reviewMeta,
    reviewText: state.reviewText,
    reviewChecks: state.reviewChecks,
    google: state.google,
    journalEntries: state.journalEntries,
    series: state.series,
    lens: state.lens,
    dietReview: state.dietReview,
    resources: state.resources,
    practiceWpm: state.practiceWpm,
    practiceFont: state.practiceFont,
    preachingProfile: state.preachingProfile,
    pulpitPrefs: state.pulpitPrefs,
    bibleProvider: state.bibleProvider,
  };
}

function applyStateSnapshot(snapshot) {
  state.sermons = Array.isArray(snapshot?.sermons) ? snapshot.sermons.map(normalizeSermon) : [];
  state.activeId = snapshot?.activeId || state.sermons[0]?.id || null;
  if (state.activeId && !state.sermons.some((sermon) => sermon.id === state.activeId)) {
    state.activeId = state.sermons[0]?.id || null;
  }
  state.view = snapshot?.view || "workspace";
  state.query = snapshot?.query || "";
  state.filter = snapshot?.filter || "all";
  state.reviewMeta = snapshot?.reviewMeta || { passage: "", title: "" };
  state.reviewText = snapshot?.reviewText || "";
  state.reviewChecks = snapshot?.reviewChecks && typeof snapshot.reviewChecks === "object" ? snapshot.reviewChecks : {};
  state.google = snapshot?.google || { autoSync: true };
  state.journalEntries = Array.isArray(snapshot?.journalEntries) ? snapshot.journalEntries.map(normalizeJournalEntry) : [];
  state.series = Array.isArray(snapshot?.series) ? snapshot.series.map(normalizeSeries) : [];
  state.lens = normalizeLens(snapshot?.lens);
  state.dietReview = snapshot?.dietReview && typeof snapshot.dietReview === "object" ? snapshot.dietReview : { text: "", at: "" };
  state.resources = normalizeResources(snapshot?.resources);
  state.practiceWpm = normalizeWpm(snapshot?.practiceWpm);
  state.practiceFont = normalizeFontStep(snapshot?.practiceFont);
  state.preachingProfile = normalizePreachingProfile(snapshot?.preachingProfile);
  state.pulpitPrefs = normalizePulpitPrefs(snapshot?.pulpitPrefs);
  state.bibleProvider = normalizeBibleProvider(snapshot?.bibleProvider);
}

function normalizeSermon(sermon) {
  return {
    id: sermon.id || genId(),
    passage: sermon.passage || "",
    title: sermon.title || "",
    date: sermon.date || "",
    series: sermon.series || "",
    length: sermon.length || "40",
    format: sermon.format || "Full manuscript",
    completed: migrateCompletedPhases(Array.isArray(sermon.completed) ? sermon.completed : []),
    preached: Boolean(sermon.preached),
    imported: Boolean(sermon.imported),
    activePhase: sermon.activePhase || "plan",
    thread: Array.isArray(sermon.thread) ? sermon.thread : [],
    notes: migrateWorkIntoOneDoc(migratePhaseNotes(sermon.notes && typeof sermon.notes === "object" ? sermon.notes : {})),
    // How much was written while each phase was open. The work itself is one
    // document; this is only so a phase's checklist can tell it was worked in.
    workLog: sermon.workLog && typeof sermon.workLog === "object" ? sermon.workLog : {},
    checklist: sermon.checklist && typeof sermon.checklist === "object" ? sermon.checklist : {},
    worksheet: sermon.worksheet && typeof sermon.worksheet === "object" ? sermon.worksheet : {},
    outline: Array.isArray(sermon.outline)
      ? sermon.outline.map((movement) => ({
          title: movement?.title || "",
          sub: movement?.sub || "",
          parts: Array.isArray(movement?.parts)
            ? movement.parts
                .filter(Boolean)
                .map((part) => ({
                  id: part.id || genId(),
                  kind: OUTLINE_PART_KINDS.some(([key]) => key === part.kind) ? part.kind : "explanation",
                  text: typeof part.text === "string" ? part.text : "",
                }))
            : [],
        }))
      : [],
    customAudiences: Array.isArray(sermon.customAudiences) ? sermon.customAudiences.filter(Boolean).map(String).slice(0, 12) : [],
    debriefStatus: ["done", "skipped"].includes(sermon.debriefStatus) ? sermon.debriefStatus : "",
    tags: Array.isArray(sermon.tags) ? sermon.tags.filter(Boolean).map(String) : [],
    slidesDoc: typeof sermon.slidesDoc === "string" ? sermon.slidesDoc : "",
    slideDeck:
      sermon.slideDeck && typeof sermon.slideDeck === "object"
        ? {
            theme: ["dark", "light", "brand"].includes(sermon.slideDeck.theme) ? sermon.slideDeck.theme : "dark",
            fontScale: [0, 1, 2].includes(sermon.slideDeck.fontScale) ? sermon.slideDeck.fontScale : 1,
            builtAt: sermon.slideDeck.builtAt || "",
            slides: Array.isArray(sermon.slideDeck.slides)
              ? sermon.slideDeck.slides.map((slide) => ({
                  id: slide.id || genId(),
                  type: slide.type || "custom",
                  title: typeof slide.title === "string" ? slide.title : "",
                  text: typeof slide.text === "string" ? slide.text : "",
                  notes: typeof slide.notes === "string" ? slide.notes : "",
                }))
              : [],
          }
        : { theme: "dark", fontScale: 1, builtAt: "", slides: [] },
    timeSpent: Number.isFinite(sermon.timeSpent) && sermon.timeSpent > 0 ? Math.round(sermon.timeSpent) : 0,
    practice:
      sermon.practice && typeof sermon.practice === "object"
        ? {
            runs: Number(sermon.practice.runs) || 0,
            lastSeconds: Number(sermon.practice.lastSeconds) || 0,
            lastAt: sermon.practice.lastAt || "",
            notes: typeof sermon.practice.notes === "string" ? sermon.practice.notes : "",
            marks: sermon.practice.marks && typeof sermon.practice.marks === "object" ? sermon.practice.marks : {},
            history: Array.isArray(sermon.practice.history)
              ? sermon.practice.history
                  .filter((run) => run && Number(run.seconds) > 0)
                  .map((run) => ({ seconds: Number(run.seconds), at: run.at || "" }))
                  .slice(-10)
              : [],
          }
        : { runs: 0, lastSeconds: 0, lastAt: "", notes: "", marks: {}, history: [] },
    impact: sermon.impact && typeof sermon.impact === "object" ? sermon.impact : {},
    shepherd:
      sermon.shepherd && typeof sermon.shepherd === "object"
        ? { ...sermon.shepherd, responses: Array.isArray(sermon.shepherd.responses) ? sermon.shepherd.responses : [] }
        : { responses: [] },
    pack: sermon.pack && typeof sermon.pack === "object" ? sermon.pack : {},
    debrief:
      sermon.debrief && typeof sermon.debrief === "object"
        ? { ...sermon.debrief, responses: Array.isArray(sermon.debrief.responses) ? sermon.debrief.responses : [] }
        : { responses: [] },
    passageMap: normalizePassageMap(sermon.passageMap),
    shareLinks: sermon.shareLinks && typeof sermon.shareLinks === "object" ? sermon.shareLinks : {},
    delivery: sermon.delivery && typeof sermon.delivery === "object" ? sermon.delivery : {},
    googleDoc:
      sermon.googleDoc && typeof sermon.googleDoc === "object"
        ? {
            id: sermon.googleDoc.id || "",
            url: sermon.googleDoc.url || "",
            title: sermon.googleDoc.title || "",
            syncedAt: sermon.googleDoc.syncedAt || "",
          }
        : null,
    createdAt: sermon.createdAt || new Date().toISOString(),
    updatedAt: sermon.updatedAt || new Date().toISOString(),
  };
}

// The redesign uses one rich-text writing canvas per phase, stored at
// notes[phaseId]. Earlier builds stored a note per focus item at
// notes[`${phaseId}::${index}`]. Fold any legacy per-item notes into the
// single per-phase note so existing work is preserved.
// Sermons finished before the Passage Map phase existed stay fully
// complete instead of dropping to 15/16 phases.
function migrateCompletedPhases(completed) {
  if (completed.length >= 15 && !completed.includes("passagemap")) {
    return [...completed, "passagemap"];
  }
  return completed;
}

function migratePhaseNotes(notes) {
  const next = { ...notes };
  for (const phase of PHASES) {
    const itemKeys = Object.keys(next).filter((key) => key.startsWith(`${phase.id}::`));
    if (!itemKeys.length) continue;
    const existing = typeof next[phase.id] === "string" ? next[phase.id] : "";
    const pieces = [];
    if (existing.trim()) pieces.push(existing);
    itemKeys
      .sort((a, b) => Number(a.split("::")[1]) - Number(b.split("::")[1]))
      .forEach((key) => {
        const html = typeof next[key] === "string" ? next[key] : "";
        if (html.trim()) pieces.push(html);
        delete next[key];
      });
    if (pieces.length) next[phase.id] = pieces.join("<br>");
  }
  return next;
}

// The writing used to be a separate box per phase, which fragmented one
// sermon into sixteen documents. It is one document now: fold whatever was
// written per phase into it, each piece under a heading naming the phase it
// came from, and keep the Manuscript work at the end where it belongs.
function migrateWorkIntoOneDoc(notes) {
  const next = { ...notes };
  const pieces = [];
  for (const phase of PHASES) {
    if (phase.id === "manuscript") continue;
    const html = typeof next[phase.id] === "string" ? next[phase.id] : "";
    if (!html.trim()) continue;
    pieces.push(`<h3>${escapeHtml(phase.name)}</h3>${html}`);
    delete next[phase.id];
  }
  if (!pieces.length) return next;
  const existing = typeof next.manuscript === "string" ? next.manuscript : "";
  next.manuscript = existing.trim() ? `${pieces.join("")}<h3>Manuscript</h3>${existing}` : pieces.join("");
  return next;
}

function normalizeJournalEntry(entry) {
  const now = new Date().toISOString();
  return {
    id: entry.id || genId(),
    sermonId: entry.sermonId || "",
    phaseId: entry.phaseId || "",
    title: entry.title || "",
    body: entry.body || "",
    createdAt: entry.createdAt || now,
    updatedAt: entry.updatedAt || entry.createdAt || now,
  };
}

function normalizeSeries(series) {
  return {
    id: series.id || genId(),
    title: series.title || "",
    subtitle: series.subtitle || "",
    passages: series.passages || "",
    startDate: series.startDate || "",
    endDate: series.endDate || "",
    count: series.count || "",
    description: series.description || "",
    formation: series.formation && typeof series.formation === "object" ? series.formation : {},
    anchors: Array.isArray(series.anchors) ? series.anchors.filter(Boolean).map(String) : [],
    burdens: Array.isArray(series.burdens) ? series.burdens.filter(Boolean).map(String) : [],
    map: Array.isArray(series.map)
      ? series.map.map((row) => ({
          when: row?.when || "",
          passage: row?.passage || "",
          title: row?.title || "",
          idea: row?.idea || "",
          emphasis: row?.emphasis || "",
        }))
      : [],
    outputs: series.outputs && typeof series.outputs === "object" ? series.outputs : {},
    arcReview: typeof series.arcReview === "string" ? series.arcReview : "",
    arcReviewAt: series.arcReviewAt || "",
    createdAt: series.createdAt || new Date().toISOString(),
    updatedAt: series.updatedAt || new Date().toISOString(),
  };
}

// User-added links per phase: { [phaseId]: [{ id, label, url }] }
function normalizeResources(resources) {
  if (!resources || typeof resources !== "object") return {};
  const next = {};
  for (const [phaseId, list] of Object.entries(resources)) {
    if (!Array.isArray(list)) continue;
    const clean = list
      .filter((item) => item && typeof item === "object" && String(item.url || "").trim())
      .map((item) => ({
        id: item.id || genId(),
        label: String(item.label || item.url).trim(),
        url: String(item.url).trim(),
      }));
    if (clean.length) next[phaseId] = clean;
  }
  return next;
}

function normalizeWpm(value) {
  const wpm = Number(value);
  return PRACTICE_WPM_CHOICES.includes(wpm) ? wpm : 130;
}

// Reading font: 2 steps down, 3 steps up from the base size.
function normalizeFontStep(value) {
  const step = Number(value);
  return Number.isInteger(step) && step >= -2 && step <= 3 ? step : 0;
}

// Bible provider settings. PreachFlow never scrapes Bible sites and never
// bundles copyrighted translations: the built-in provider serves public-
// domain texts (WEB, KJV) via bible-api.com, and manual paste with
// attribution covers everything else.
function normalizeBibleProvider(settings) {
  const source = settings && typeof settings === "object" ? settings : {};
  const provider = ["public-domain", "manual"].includes(source.provider) ? source.provider : "public-domain";
  return {
    provider,
    translation: ["WEB", "KJV"].includes(source.translation) ? source.translation : "WEB",
    apiKey: typeof source.apiKey === "string" ? source.apiKey : "",
    attribution: typeof source.attribution === "boolean" ? source.attribution : true,
  };
}

// Pulpit View display preferences (user-level; persisted and synced).
function normalizePulpitPrefs(prefs) {
  const source = prefs && typeof prefs === "object" ? prefs : {};
  const pick = (value, options, fallback) => (options.includes(value) ? value : fallback);
  const flag = (value, fallback) => (typeof value === "boolean" ? value : fallback);
  return {
    fontStep: normalizeFontStep(source.fontStep),
    lineHeight: pick(source.lineHeight, ["compact", "comfortable", "spacious"], "comfortable"),
    theme: pick(source.theme, ["light", "dark", "contrast"], "dark"),
    width: pick(source.width, ["narrow", "wide"], "narrow"),
    focusMode: flag(source.focusMode, true),
    showNotes: flag(source.showNotes, true),
    showCues: flag(source.showCues, true),
    showRefs: flag(source.showRefs, true),
    showTimer: flag(source.showTimer, true),
    showProgress: flag(source.showProgress, true),
  };
}

function normalizeLens(lens) {
  const source = lens && typeof lens === "object" ? lens : {};
  return {
    ...source,
    enabled: Boolean(source.enabled),
    needs: Array.isArray(source.needs) ? source.needs.filter(Boolean).map(String) : [],
  };
}

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function attr(value) {
  return escapeHtml(value);
}

// Structured sermon-block classes that survive sanitization. Everything
// else is stripped to plain rich text.
const BLOCK_CLASSES = new Set([
  "pf-b",
  "pf-b-scripture",
  "pf-b-point",
  "pf-b-sub",
  "pf-b-illustration",
  "pf-b-application",
  "pf-b-transition",
  "pf-b-prayer",
  "pf-b-quote",
  "pf-b-cue",
  "pf-b-slide",
  "pf-b-note",
  "pf-b-public",
  "pf-b-respond",
  "pf-scripture-ref",
  "pf-scripture-text",
  "pf-scripture-attr",
  "pf-slide-title",
]);
const BLOCK_DATA_ATTRS = new Set(["data-ref", "data-translation", "data-slide", "data-pulpit", "data-production"]);

function sanitizeRichHtml(value) {
  const template = document.createElement("template");
  template.innerHTML = String(value || "");
  const allowed = new Set(["B", "STRONG", "I", "EM", "U", "UL", "OL", "LI", "DIV", "P", "BR", "H2", "H3", "H4", "BLOCKQUOTE", "SPAN", "FONT"]);
  for (const node of [...template.content.querySelectorAll("*")]) {
    if (!allowed.has(node.tagName)) {
      node.replaceWith(...node.childNodes);
      continue;
    }
    // execCommand("fontSize") emits <font size="1..7">; fold it into the
    // fixed pf-size-N class set so only known sizes survive.
    if (node.tagName === "FONT") {
      const size = Number(node.getAttribute("size"));
      if (size >= 1 && size <= 7) {
        const span = document.createElement("span");
        span.className = `pf-size-${size}`;
        span.append(...node.childNodes);
        node.replaceWith(span);
      } else {
        node.replaceWith(...node.childNodes);
      }
      continue;
    }
    const keptClasses = String(node.className || "")
      .split(/\s+/)
      .filter((token) => BLOCK_CLASSES.has(token) || /^pf-size-[1-7]$/.test(token))
      .join(" ");
    const keptData = [...node.attributes]
      .filter((attrNode) => BLOCK_DATA_ATTRS.has(attrNode.name))
      .map((attrNode) => [attrNode.name, attrNode.value.slice(0, 120)]);
    for (const attrNode of [...node.attributes]) {
      node.removeAttribute(attrNode.name);
    }
    if (keptClasses) node.className = keptClasses;
    for (const [name, dataValue] of keptData) node.setAttribute(name, dataValue);
    if (node.tagName === "SPAN" && !keptClasses) {
      node.replaceWith(...node.childNodes);
    }
  }
  return template.innerHTML;
}

function richHtmlToText(value) {
  const template = document.createElement("template");
  template.innerHTML = sanitizeRichHtml(value);
  for (const li of template.content.querySelectorAll("li")) {
    li.prepend("- ");
    li.append("\n");
  }
  for (const block of template.content.querySelectorAll("div,p,br,h2,h3,h4,blockquote")) {
    block.append("\n");
  }
  return template.content.textContent.replace(/\n{3,}/g, "\n\n").trim();
}

function getActive() {
  return state.sermons.find((sermon) => sermon.id === state.activeId) || null;
}

function getPhase(sermon) {
  return PHASES.find((phase) => phase.id === sermon?.activePhase) || PHASES[0];
}

function updateActive(patch) {
  state.sermons = state.sermons.map((sermon) =>
    sermon.id === state.activeId
      ? { ...sermon, ...patch, updatedAt: new Date().toISOString() }
      : sermon,
  );
  saveState();
}

function fmtDate(date) {
  if (!date) return "";
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function fmtDuration(totalSeconds, withSeconds = false) {
  const seconds = Math.max(0, Math.round(totalSeconds || 0));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (withSeconds) {
    if (h) return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
    if (m) return `${m}m ${String(s).padStart(2, "0")}s`;
    return `${s}s`;
  }
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m`;
  return seconds ? "under a minute" : "0m";
}

function isPreachedSermon(sermon) {
  return sermon.completed.length >= PHASES.length;
}

function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function daysUntil(date) {
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(`${date}T00:00:00`) - today) / 86400000);
}

function expectedDone(daysOut) {
  if (daysOut === null) return null;
  if (daysOut >= 28) return 0;
  if (daysOut >= 22) return 4;
  if (daysOut >= 15) return 7;
  if (daysOut >= 8) return 10;
  if (daysOut >= 4) return 12;
  if (daysOut >= 3) return 14;
  return PHASES.length;
}

function expectedBlock(daysOut) {
  if (daysOut === null) return null;
  if (daysOut >= 22) return 0;
  if (daysOut >= 15) return 1;
  if (daysOut >= 8) return 2;
  return 3;
}

function progressPct(sermon) {
  return Math.round((sermon.completed.length / PHASES.length) * 100);
}

function sermonStatus(sermon) {
  const days = daysUntil(sermon.date);
  const expected = expectedDone(days);
  if (expected === null) {
    return { label: "No date", key: "neutral", days, expected };
  }
  if (sermon.completed.length > expected) {
    return { label: "Ahead", key: "ahead", days, expected };
  }
  if (sermon.completed.length === expected) {
    return { label: "On track", key: "on-track", days, expected };
  }
  return {
    label: `Behind ${expected - sermon.completed.length}`,
    key: "behind",
    days,
    expected,
  };
}

function loadingDots() {
  return '<span class="pf-dots"><i></i><i></i><i></i></span>';
}

function render() {
  const active = getActive();
  // The theme lives on the root element too, so the page behind the app
  // (overscroll, scrollbars, the space under short pages) matches it.
  document.documentElement.dataset.theme = state.theme;
  document.body.dataset.theme = state.theme;
  syncHistory();
  const focus = captureFocus();
  const keptScrolls = [...document.querySelectorAll("[data-scroll-keep]")].map((el) => [el.getAttribute("data-scroll-keep"), el.scrollTop]);
  const restoreScrolls = () => {
    for (const [key, top] of keptScrolls) {
      const el = document.querySelector(`[data-scroll-keep="${key}"]`);
      if (el && top) el.scrollTop = top;
    }
  };
  const overlays = `
    ${ui.showAuth ? renderAuthPanel() : ""}
    ${ui.showOpenAIKey ? renderOpenAIKeyPanel() : ""}
    ${ui.showSwitcher ? renderSwitcherModal(active) : ""}
    ${ui.showDetails && active ? renderDetailsModal(active) : ""}
    ${ui.showSlides && active ? renderSlidesModal(active) : ""}
    ${ui.showImport ? renderImportModal() : ""}
    ${ui.libImport.show ? renderLibImportModal() : ""}
    ${ui.calImport.show ? renderCalImportModal() : ""}
    ${ui.reader.show ? renderReaderPanel() : ""}
    ${ui.confirmDeleteId ? renderConfirmDeleteModal() : ""}
    ${ui.scripture.show ? renderScriptureModal() : ""}
    ${renderOnboarding()}
  `;

  if (state.view === "signin") {
    app.innerHTML = `
      <div class="pf-root pf-fade" data-theme="${attr(state.theme)}">
        ${renderSignin(active)}
        ${overlays}
      </div>
    `;
    restoreFocus(focus);
  restoreScrolls();
    return;
  }

  if (state.view === "pulpit" || state.view === "practice") {
    app.innerHTML = `
      <div class="pf-root" data-theme="${attr(state.theme)}">
        ${renderPulpitView(active)}
        ${overlays}
      </div>
    `;
    restoreFocus(focus);
  restoreScrolls();
    return;
  }

  app.innerHTML = `
    <div class="pf-root" data-theme="${attr(state.theme)}">
      ${renderTopbar(active)}
      ${active && SERMON_VIEWS.has(state.view) && !ui.showNew ? renderSermonStrip(active) : ""}
      ${ui.banner ? `<div class="pf-banner">${escapeHtml(ui.banner)}</div>` : ""}
      ${renderEncourageCard()}
      ${renderMain(active)}
      ${overlays}
    </div>
  `;
  restoreFocus(focus);
  restoreScrolls();
  applyPendingCaret();
  requestAnimationFrame(() => {
    const thread = document.querySelector("[data-thread]");
    if (thread) thread.scrollTop = thread.scrollHeight;
  });
}

// A modal insert redraws the page, which throws the cursor away. Remember
// which block the cursor belongs in and put it back once the editor exists
// again, so the next thing typed continues where the insert left off.
let pendingCaretBlock = -1;

function applyPendingCaret() {
  if (pendingCaretBlock < 0) return;
  const index = pendingCaretBlock;
  pendingCaretBlock = -1;
  requestAnimationFrame(() => {
    const editor = document.querySelector('[data-action="phase-editor"]');
    const block = editor?.children[index];
    if (!block) return;
    editor.focus({ preventScroll: true });
    const caret = document.createRange();
    caret.setStart(block, 0);
    caret.collapse(true);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(caret);
  });
}

function captureFocus() {
  const element = document.activeElement;
  if (!element || !element.dataset?.action) return null;
  return {
    action: element.dataset.action,
    phase: element.dataset.phase || "",
    noteKey: element.dataset.noteKey || "",
    start: typeof element.selectionStart === "number" ? element.selectionStart : null,
    end: typeof element.selectionEnd === "number" ? element.selectionEnd : null,
  };
}

function restoreFocus(focus) {
  if (!focus) return;
  requestAnimationFrame(() => {
    let element = null;
    if (focus.noteKey) {
      element = [...document.querySelectorAll(`[data-action="${focus.action}"]`)].find(
        (item) => item.dataset.noteKey === focus.noteKey,
      );
    } else {
      const selector = `[data-action="${focus.action}"]${focus.phase ? `[data-phase="${focus.phase}"]` : ""}`;
      element = document.querySelector(selector);
    }
    if (!element) return;
    element.focus({ preventScroll: true });
    if (focus.start !== null && typeof element.setSelectionRange === "function") {
      element.setSelectionRange(focus.start, focus.end ?? focus.start);
    }
  });
}

// The Word Ablaze - flat orange flame with a dark knockout core rising from
// the open book (the "shirt print" rendering). Sits on the dark brand chips.
const PF_MARK_PATHS = `<path d="M67 8C66 18 74 24 80 32C87 41 90 49 90 58C90 74 79 84 64 84C49 84 38 74 38 58C38 45 47 37 51 24C53 32 58 36 59 30C60 25 58 18 62 12C63 10 65 9 67 8Z" fill="#FF953E"/><path d="M64 42C65 49 72 52 74 60C76 68 71 76 64 76C57 76 52 68 54 60C55 54 60 51 61 46C62 49 63 48 64 42Z" fill="#23272e"/><path d="M16 78C35 72 52 76 64 88C76 76 93 72 112 78L112 92C93 86 76 90 64 101C52 90 35 86 16 92Z" fill="#FFF4EA"/><path d="M64 88L64 101" stroke="#23272e" stroke-width="3.6" stroke-linecap="round"/>`;

// On the solid orange square in the header and the auth panel the mark is
// drawn in ink, with the flame's core knocked out in the square's colour.
const PF_MARK_INK_PATHS = `<path d="M67 8C66 18 74 24 80 32C87 41 90 49 90 58C90 74 79 84 64 84C49 84 38 74 38 58C38 45 47 37 51 24C53 32 58 36 59 30C60 25 58 18 62 12C63 10 65 9 67 8Z" fill="#14171b"/><path d="M64 42C65 49 72 52 74 60C76 68 71 76 64 76C57 76 52 68 54 60C55 54 60 51 61 46C62 49 63 48 64 42Z" fill="#ff953e"/><path d="M16 78C35 72 52 76 64 88C76 76 93 72 112 78L112 92C93 86 76 90 64 101C52 90 35 86 16 92Z" fill="#14171b"/><path d="M64 88L64 101" stroke="#ff953e" stroke-width="3.6" stroke-linecap="round"/>`;

const pfMarkInkSvg = (size) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 128 128" fill="none" aria-hidden="true">${PF_MARK_INK_PATHS}</svg>`;

const pfMarkSvg = (size) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 128 128" fill="none" aria-hidden="true">${PF_MARK_PATHS}</svg>`;

const BRAND_MARK_SVG = pfMarkInkSvg(22);

// Browser history mirrors the current view, so Back moves between app
// pages instead of ejecting to the marketing homepage.
let lastHistoryView = null;

function syncHistory() {
  if (state.view === lastHistoryView) return;
  try {
    const method = lastHistoryView === null ? "replaceState" : "pushState";
    window.history[method]({ view: state.view }, "", `#${state.view}`);
  } catch {
    /* history unavailable (sandboxed iframe etc.) */
  }
  lastHistoryView = state.view;
}

window.addEventListener("popstate", (event) => {
  const view = event.state?.view || (window.location.hash || "#home").slice(1) || "home";
  lastHistoryView = view;
  state.view = view === "practice" ? "pulpit" : view;
  closeOverlays();
  render();
});

// The weekly essentials stay visible; everything else lives in small
// dropdown groups so the bar survives on a phone or iPad.
// Top bar carries only app-wide destinations. Everything scoped to one
// sermon lives in the sermon strip below it.
const NAV_ITEMS = [
  ["home", "Home"],
  ["library", "Library"],
];

const NAV_GROUPS = [
  ["Planning", [
    ["pipeline", "Pipeline"],
    ["series", "Series Architect"],
    ["diet", "Diet Review"],
    ["ahead", "Stay Ahead"],
  ]],
  ["Tools", [
    ["journal", "Notes"],
    ["debrief", "Debrief"],
    ["lens", "Congregational Lens"],
  ]],
];

// Views that operate on the currently selected sermon; they render under
// the sermon strip so it's always clear whose sermon you're in.
const SERMON_TABS = [
  ["workspace", "Workspace"],
  ["map", "Map"],
  ["editor", "Editor"],
  ["pulpit", "Pulpit"],
  ["impact", "Impact"],
  ["sharing", "Share"],
];
const SERMON_VIEWS = new Set(["workspace", "map", "editor", "impact", "sharing"]);

// The sermon's facts as a row of rule-divided cells, then the section tabs
// as a second row. Nothing is centered and nothing floats: the strip is part
// of the page grid.
function renderSermonStrip(active) {
  const status = sermonStatus(active);
  const days = status.days;
  const daysValue = days === null ? "No date" : days < 0 ? `${Math.abs(days)} days` : `${days} days`;
  const daysLabel = days === null ? "not scheduled" : days < 0 ? "days ago" : "until Sunday";
  const cell = (label, value, extra = "") =>
    `<div class="pf-meta-cell">
      <span class="pf-meta-label">${escapeHtml(label)}</span>
      <span class="pf-meta-value">${value}</span>
      ${extra}
    </div>`;
  return `
    <div class="pf-sermon-strip">
      <div class="pf-meta">
        <button class="pf-meta-cell pf-meta-switch" data-action="open-switcher" title="Switch sermon" aria-label="Switch sermon">
          <span class="pf-meta-label">Passage</span>
          <span class="pf-meta-value">${escapeHtml(active.passage || "Untitled sermon")} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></span>
        </button>
        ${cell("Sermon", escapeHtml(active.title || "Untitled") + (active.series ? `<span class="pf-meta-note">${escapeHtml(active.series)}</span>` : ""))}
        ${cell(daysLabel, escapeHtml(daysValue))}
        ${cell("Target length", `${escapeHtml(active.length || "-")} min`)}
        ${
          isPreachedSermon(active)
            ? cell("Total time spent", escapeHtml(fmtDuration(active.timeSpent)))
            : cell(
                "On this sermon",
                `<span class="pf-timer-dot"></span><span data-work-timer>${escapeHtml(fmtDuration(active.timeSpent, true))}</span>`,
              )
        }
      </div>
      <div class="pf-strip-tabrow">
        <nav class="pf-strip-tabs" aria-label="Sermon sections">
          ${SERMON_TABS.filter(([view]) => !(active.imported && (view === "workspace" || view === "map")))
            .map(
              ([view, label]) =>
                `<button class="pf-strip-tab ${state.view === view ? "active" : ""}" data-view="${view}">${label}</button>`,
            )
            .join("")}
        </nav>
        <span class="pf-strip-meta">${progressPct(active)}% ready</span>
      </div>
    </div>
  `;
}

const NAV_CHEVRON = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

function renderNavGroup([label, items]) {
  const groupActive = items.some(([view]) => view === state.view);
  return `
    <span class="pf-nav-group" data-nav-group>
      <button class="pf-nav-btn pf-nav-group-btn ${groupActive ? "active" : ""}" data-action="nav-menu" aria-haspopup="true">${label}${NAV_CHEVRON}</button>
      <span class="pf-nav-menu" data-nav-menu>
        ${items
          .map(
            ([view, item]) =>
              `<button class="pf-nav-menu-item ${state.view === view ? "active" : ""}" data-view="${view}">${item}</button>`,
          )
          .join("")}
      </span>
    </span>
  `;
}

function accountInitial() {
  const email = ui.auth.user?.email || "";
  // Signed out shows a neutral person glyph, never a letter that could be
  // mistaken for a signed-in initial.
  return email ? email.trim().charAt(0).toUpperCase() : "";
}

function renderTopbar(active) {
  const avatarKey = ui.auth.user ? "ready" : ui.auth.configured ? "neutral" : "missing";
  return `
    <header class="pf-topbar">
      <button class="pf-brand" type="button" data-view="home" aria-label="PreachFlow home">
        <span class="pf-brand-mark">${BRAND_MARK_SVG}</span>
        <span class="pf-brand-text">Preach <span>Flow</span></span>
      </button>
      <nav class="pf-nav">
        ${NAV_ITEMS.map(
          ([view, label]) =>
            `<button class="pf-nav-btn ${state.view === view ? "active" : ""}" data-view="${view}">${label}</button>`,
        ).join("")}
        ${NAV_GROUPS.map(renderNavGroup).join("")}
      </nav>
      <div class="pf-top-right">
        ${ui.auth.status ? `<span class="pf-top-status"><i class="pf-top-dot"></i>${escapeHtml(ui.auth.status)}</span>` : ""}
        <button class="pf-icon-btn pf-top-cell" data-action="toggle-theme" aria-label="Toggle theme" title="Toggle light / dark">
          ${
            state.theme === "dark"
              ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`
              : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`
          }
        </button>
        <button class="pf-avatar" data-action="open-account" aria-label="Your account" title="${ui.auth.user ? `Signed in: ${attr(ui.auth.user.email || "account")}` : "Not signed in on this device"}">${accountInitial() ? escapeHtml(accountInitial()) : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></svg>`}<i class="pf-avatar-dot ${avatarKey}"></i></button>
      </div>
    </header>
  `;
}

function renderAuthPanel() {
  return `
    <div class="pf-overlay" data-action="close-auth-panel" data-overlay>
      <div class="pf-modal" data-stop>
        <div class="pf-modal-head">
          <span class="pf-eyebrow">Account</span>
          <h2 class="pf-modal-title">Account &amp; sync</h2>
        </div>
        ${
          ui.auth.user
            ? `<p class="pf-modal-text">Signed in as <strong>${escapeHtml(ui.auth.user.email || "your account")}</strong>. ${escapeHtml(ui.auth.status)}</p>
               <div class="pf-modal-actions">
                 <button class="pf-btn pf-btn-primary" data-action="cloud-sync-now" ${ui.auth.loading ? "disabled" : ""}>Sync now</button>
                 <button class="pf-btn" data-action="sign-out" ${ui.auth.loading ? "disabled" : ""}>Sign out</button>
                 <button class="pf-btn pf-btn-ghost" data-action="close-auth-panel">Close</button>
               </div>`
            : `<p class="pf-modal-text">Open the sign-in screen to log in with email, password, or Google.</p>
               <div class="pf-modal-actions">
                 <button class="pf-btn pf-btn-primary" data-action="go-signin">Open sign-in</button>
                 <button class="pf-btn pf-btn-ghost" data-action="close-auth-panel">Close</button>
               </div>`
        }
      </div>
    </div>
  `;
}

function renderOpenAIKeyPanel() {
  return `
    <div class="pf-overlay" data-action="close-openai-key" data-overlay>
      <div class="pf-modal" data-stop>
        <div class="pf-modal-head">
          <span class="pf-eyebrow">Sermon Guide engine</span>
          <h2 class="pf-modal-title">Use your own OpenAI key</h2>
        </div>
        <p class="pf-modal-text">Preach Flow does not use a shared server key. Each user adds their own OpenAI API key, stored only in this browser and sent over HTTPS for Sermon Guide and review requests.</p>
        <div class="pf-field">
          <label class="pf-label" for="openai-key">OpenAI API key</label>
          <input id="openai-key" class="pf-input" type="password" data-action="openai-key-input" value="${attr(ui.openAIKeyInput)}" placeholder="sk-proj-..." autocomplete="off" />
        </div>
        <div class="pf-modal-actions">
          <button class="pf-btn pf-btn-primary" data-action="save-openai-key">Save key</button>
          <button class="pf-btn" data-action="clear-openai-key">Remove key</button>
          <button class="pf-btn pf-btn-ghost" data-action="close-openai-key">Close</button>
        </div>
        <p class="pf-helper">For a public app, visitors should use keys from their own OpenAI Platform accounts so usage bills to them, not to you.</p>
      </div>
    </div>
  `;
}

const GOOGLE_G_SVG = `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"/></svg>`;

// The dark half of the auth split screen. Everything on it is drawn from
// what the app already knows: the mark, the phrase this app has always used
// for its work, and the shape of the process itself.
function renderSigninSide() {
  return `
    <div class="pf-signin-side">
      <div class="pf-signin-side-top">
        <span class="pf-brand-mark">${BRAND_MARK_SVG}</span>
        <span class="pf-brand-text">Preach <span>Flow</span></span>
      </div>
      <h2 class="pf-signin-hero">From the text<br>to the <span>pulpit</span>.</h2>
      <div class="pf-signin-stats">
        <div><span class="pf-signin-stat-num">${PHASES.length}</span><span class="pf-signin-stat-label">Phases</span></div>
        <div><span class="pf-signin-stat-num">${BLOCKS.length}</span><span class="pf-signin-stat-label">Movements</span></div>
        <div><span class="pf-signin-stat-num">1</span><span class="pf-signin-stat-label">Big idea</span></div>
      </div>
    </div>
  `;
}

function renderPasswordResetScreen() {
  return `
    <div class="pf-signin">
      ${renderSigninSide()}
      <div class="pf-signin-inner">
        <div class="pf-signin-head">
          <h1 class="pf-signin-title">Set a new password</h1>
          <p class="pf-signin-subtitle">You're verified. Choose a new password for ${escapeHtml(ui.auth.user?.email || "your account")} and you're back in.</p>
        </div>
        <div class="pf-signin-card">
          <div class="pf-field">
            <label class="pf-label" for="reset-password">New password</label>
            <input id="reset-password" class="pf-input" type="password" data-action="auth-password-input" value="${attr(ui.auth.passwordInput)}" placeholder="At least 6 characters" autocomplete="new-password" />
          </div>
          <div class="pf-field">
            <label class="pf-label" for="reset-confirm">Confirm new password</label>
            <input id="reset-confirm" class="pf-input" type="password" data-action="auth-confirm-input" value="${attr(ui.auth.confirmInput)}" placeholder="Type it again" autocomplete="new-password" />
          </div>
          <button class="pf-signin-submit" data-action="password-reset-save" ${ui.auth.loading ? "disabled" : ""}>${ui.auth.loading ? "Saving…" : "Save new password"}</button>
        </div>
      </div>
    </div>
  `;
}

function renderSignin(active) {
  if (ui.auth.recovery) return renderPasswordResetScreen();
  if (ui.auth.user) return renderProfile(active);
  const creating = ui.signinMode === "signup";
  const disabled = ui.auth.loading || !ui.auth.configured;
  return `
    <div class="pf-signin">
      ${renderSigninSide()}
      <div class="pf-signin-inner">
        <div class="pf-signin-top">
          ${active || state.sermons.length ? `<button class="pf-btn pf-btn-ghost" data-action="close-signin">&larr; Back to app</button>` : ""}
          <a class="pf-btn pf-btn-ghost" href="./" style="text-decoration:none;">Home</a>
        </div>
        <div class="pf-signin-head">
          <span class="pf-eyebrow pf-eyebrow-brand">${creating ? "Create account" : "Sign in"}</span>
          <h1 class="pf-signin-title">${creating ? "Create your account" : "Welcome back"}</h1>
          <p class="pf-signin-subtitle">${creating ? "Start moving from the text to the pulpit." : "Pick up your prep right where you left it."}</p>
        </div>
        <div class="pf-signin-card">
          <button class="pf-google-btn" data-action="google-signin" ${disabled ? "disabled" : ""}>
            ${GOOGLE_G_SVG}
            Continue with Google
          </button>
          <div class="pf-divider"><i></i><span>or</span><i></i></div>
          <div class="pf-field">
            <label class="pf-label" for="signin-email">Email</label>
            <input id="signin-email" class="pf-input" type="email" data-action="auth-email-input" value="${attr(ui.auth.emailInput)}" placeholder="you@example.com" autocomplete="email" />
          </div>
          <div class="pf-field">
            <div class="pf-label-row">
              <label class="pf-label" for="signin-password">Password</label>
              ${creating ? "" : `<button class="pf-forgot" data-action="forgot-password">Forgot?</button>`}
            </div>
            <input id="signin-password" class="pf-input" type="password" data-action="auth-password-input" value="${attr(ui.auth.passwordInput)}" placeholder="••••••••" autocomplete="${creating ? "new-password" : "current-password"}" />
          </div>
          <button class="pf-signin-submit" data-action="${creating ? "password-signup" : "password-signin"}" ${disabled ? "disabled" : ""}>
            ${ui.auth.loading ? "Working…" : creating ? "Create account" : "Sign in"}
          </button>
          <div class="pf-signin-magic">
            <button data-action="send-magic-link" ${disabled ? "disabled" : ""}>Prefer a one-time email link? <span>Send me a link</span></button>
          </div>
          ${
            ui.auth.configured
              ? `<p class="pf-signin-status ${attr(ui.auth.statusKey)}" data-auth-panel-status>${escapeHtml(ui.auth.status)}</p>`
              : `<p class="pf-signin-status missing">Accounts need setup - add <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code> in Vercel. Your work is saved on this device meanwhile.</p>`
          }
        </div>
        <p class="pf-signin-footer">
          ${
            creating
              ? `Already have an account? <button data-action="signin-mode-signin">Sign in</button>`
              : `New to Preach Flow? <button data-action="signin-mode-signup">Create an account</button>`
          }
        </p>
      </div>
    </div>
  `;
}

// ---- Preaching Profile page ----
const PROFILE_TABS = [
  ["profile", "Preaching Profile"],
  ["guide", "Sermon Guide"],
  ["defaults", "Defaults"],
  ["account", "Account"],
  ["privacy", "Privacy"],
];

const PROFILE_OPTIONS = {
  role: ["Lead pastor", "Teaching pastor", "Church planter", "Associate pastor", "Elder", "Student pastor", "Guest preacher", "Other"],
  context: ["Sunday gathering", "Midweek service", "Students", "Groups", "Church plant", "Conference", "Devotional", "Other"],
  cadence: ["Weekly", "Most weeks", "Monthly", "Occasional", "Seasonal"],
  day: ["Sunday", "Wednesday", "Other"],
  format: ["Full manuscript", "Detailed outline", "Hybrid notes", "Bullet notes"],
  deliverable: ["Sermon manuscript", "Preaching notes", "Teaching guide", "Devotional", "Group guide"],
  seriesBehavior: ["Standalone sermon", "Series-based", "Book-by-book", "Topical series", "Church calendar"],
  style: ["Expositional", "Textual", "Narrative", "Doctrinal", "Topical", "Mixed"],
  outlinePref: ["Text-driven movements", "Proposition-based points", "Narrative movement", "Problem-solution", "Theological argument", "Pastoral burden"],
  bigIdeaStyle: ["Concise statement", "Doctrinal claim", "Pastoral burden", "Memorable sentence", "Question-answer"],
  christConnection: ["Responsible biblical theology", "Direct fulfillment", "Gospel pattern", "Canonical context", "Avoid forced allegory"],
  prepRhythm: ["Same-week preparation", "Two weeks ahead", "Four-week rotation", "Custom rhythm"],
  exportFormat: ["PDF", "Word", "Markdown", "Google Docs"],
};

const PROFILE_APPLICATION_EMPHASES = ["Heart", "Habits", "Church body", "Mission", "Repentance", "Comfort", "Evangelism", "Family", "Suffering", "Leadership"];
const PROFILE_VALUES = ["Gospel centrality", "Biblical authority", "Spirit dependence", "Church as family", "Mission", "Discipleship", "Prayer", "Leadership development", "Church planting", "Mercy", "Holiness", "Evangelism", "Generosity", "Justice", "Unity"];
const PROFILE_POSTURES = ["Ask me questions first", "Give direct suggestions", "Challenge weak assumptions", "Help me tighten structure", "Focus on application", "Focus on exegesis", "Focus on clarity and brevity"];
const PROFILE_RUBRIC = [
  ["faithful", "Faithfulness to the text"],
  ["bigidea", "Clear big idea"],
  ["gospel", "Gospel clarity"],
  ["christ", "Responsible Christ connection"],
  ["application", "Specific application"],
  ["evangelistic", "Evangelistic clarity"],
  ["tone", "Pastoral tone"],
  ["transitions", "Transitions"],
  ["length", "Length"],
  ["complexity", "Unnecessary complexity"],
  ["respond", "Call to respond"],
  ["nextsteps", "Church-wide next steps"],
];
const PROFILE_PREP_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const PROFILE_PRESSURES = ["Getting started", "Big idea", "Outline", "Application", "Manuscript", "Conclusion", "Review", "Slides", "Group guide"];
const PROFILE_PRODUCTION_OUTPUTS = ["Slides document", "Family group guide", "Discipleship pack", "Impact plan", "Social summary", "Weekly email", "Devotional"];
const PROFILE_AUDIENCES = ["Staff", "Prayer team", "Groups", "Parents", "Members", "Unbelievers", "Leaders", "Production team"];

const PROFILE_GUARDRAIL_HINT = `e.g.
Do not force Christ connections where the text does not support them.
Do not overuse therapeutic language.
Do not make application generic.
Do not flatten Old Testament texts.
Do not write as if the app is the preacher.`;

// A review-rubric item is on unless the pastor turned it off.
function rubricChecked(key) {
  const value = state.preachingProfile.rubric[key];
  return value !== false;
}

// The rubric the pastor wants applied before preaching (defaults + custom).
function activeRubricItems() {
  const items = PROFILE_RUBRIC.filter(([key]) => rubricChecked(key)).map(([, label]) => label);
  return [...items, ...state.preachingProfile.rubricCustom];
}

function profileSelect(key, label, options, allowFree = false) {
  const value = state.preachingProfile[key] || "";
  const custom = value && !options.includes(value);
  return `
    <div class="pf-field" style="margin-bottom:0;">
      <label class="pf-label">${escapeHtml(label)}</label>
      <select class="pf-select" data-action="profile-field" data-key="${attr(key)}">
        <option value="">Choose…</option>
        ${options.map((option) => `<option ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
        ${custom ? `<option selected>${escapeHtml(value)}</option>` : ""}
      </select>
    </div>
  `;
}

function profileInput(key, label, placeholder = "") {
  return `
    <div class="pf-field" style="margin-bottom:0;">
      <label class="pf-label">${escapeHtml(label)}</label>
      <input class="pf-input" data-action="profile-field" data-key="${attr(key)}" value="${attr(state.preachingProfile[key] || "")}" placeholder="${attr(placeholder)}" />
    </div>
  `;
}

function profileToggle(key, label, desc) {
  return `
    <label class="pf-toggle-row">
      <input type="checkbox" data-action="profile-toggle" data-key="${attr(key)}" ${state.preachingProfile[key] ? "checked" : ""} />
      <span><strong>${escapeHtml(label)}</strong>${desc ? ` - ${escapeHtml(desc)}` : ""}</span>
    </label>
  `;
}

function profileSection(title, hint, body) {
  return `
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head"><span class="pf-eyebrow">${escapeHtml(title)}</span></div>
      ${hint ? `<p class="pf-section-hint">${escapeHtml(hint)}</p>` : ""}
      ${body}
    </section>
  `;
}

// Optional post-signup setup. Never blocks the app; everything stays
// editable later from the avatar.
function renderOnboarding() {
  if (!ui.auth.user || state.preachingProfile.onboarded) return "";
  if (state.view === "signin") return "";
  return `
    <div class="pf-overlay" data-action="onboard-skip" data-overlay>
      <div class="pf-modal" data-stop style="max-width:560px;">
        <div class="pf-modal-head"><span class="pf-eyebrow pf-eyebrow-brand">Welcome</span></div>
        <h2 style="font-family:var(--font-display);font-weight:800;font-size:21px;margin:2px 0 8px;">Make PreachFlow fit your preaching workflow.</h2>
        <p class="pf-page-sub" style="margin-bottom:16px;">Set a few defaults so PreachFlow can better support your sermon preparation, review, and ministry outputs. Nothing here is required.</p>
        <div class="pf-onboard-cards">
          <button class="pf-tool-card" data-action="onboard-start" data-tab="defaults">
            <span class="pf-tool-card-title">Set preaching defaults</span>
            <span class="pf-tool-card-desc">Translation, sermon length, format, and the outputs you produce most weeks.</span>
          </button>
          <button class="pf-tool-card" data-action="onboard-start" data-tab="guide">
            <span class="pf-tool-card-title">Shape Sermon Guide</span>
            <span class="pf-tool-card-desc">Posture, push-back, and guardrails - how you want help without handing over the pen.</span>
          </button>
          <button class="pf-tool-card" data-action="onboard-lens">
            <span class="pf-tool-card-title">Add Congregational Lens</span>
            <span class="pf-tool-card-desc">Tell PreachFlow who your church is, so application lands on real people.</span>
          </button>
        </div>
        <div class="pf-modal-actions">
          <button class="pf-btn pf-btn-primary" data-action="onboard-start" data-tab="profile">Start setup</button>
          <button class="pf-btn" data-action="onboard-skip">Skip for now</button>
          <button class="pf-btn pf-btn-ghost" data-action="onboard-skip">Use basic defaults</button>
        </div>
      </div>
    </div>
  `;
}

function renderProfile(active) {
  const tab = PROFILE_TABS.some(([key]) => key === ui.profileTab) ? ui.profileTab : "profile";
  const headings = {
    profile: ["Preaching Profile", "Shape PreachFlow around the way you prepare, preach, and lead through the Word."],
    guide: ["Sermon Guide", "Set the posture and boundaries for how Sermon Guide supports your preparation."],
    defaults: ["Defaults", "Sermon and output defaults, so every sermon starts closer to your real workflow."],
    account: ["Your account", "Identity, sign-in, sync, and settings."],
    privacy: ["Privacy", "What PreachFlow stores, what it never shares, and what belongs elsewhere."],
  };
  const [heading, sub] = headings[tab];
  return `
    <div class="pf-page pf-page-read pf-fade">
      <div class="pf-page-head" style="display:block;margin-bottom:18px;">
        <div style="margin-bottom:12px;"><button class="pf-btn pf-btn-ghost" data-action="close-signin">&larr; Back to app</button></div>
        <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">${escapeHtml(ui.auth.user?.email || "Your account and settings")}</span>
        <h1 class="pf-h1">${escapeHtml(heading)}</h1>
        <p class="pf-page-sub">${escapeHtml(sub)}</p>
      </div>
      <div class="pf-subtabs" style="margin-bottom:22px;">
        ${PROFILE_TABS.map(([key, label]) => `<button class="pf-chip ${tab === key ? "active" : ""}" data-action="profile-tab" data-tab="${key}">${label}</button>`).join("")}
        <button class="pf-chip pf-chip-danger" data-action="sign-out" ${ui.auth.loading ? "disabled" : ""}>Sign out</button>
      </div>
      ${tab === "profile" ? renderProfileTab() : ""}
      ${tab === "guide" ? renderProfileGuideTab() : ""}
      ${tab === "defaults" ? renderProfileDefaultsTab() : ""}
      ${tab === "account" ? renderProfileAccountTab(active) : ""}
      ${tab === "privacy" ? renderProfilePrivacyTab() : ""}
    </div>
  `;
}

function renderProfileTab() {
  const profile = state.preachingProfile;
  return `
    <p class="pf-page-sub" style="margin-bottom:18px;">Your Preaching Profile helps PreachFlow remember your sermon defaults, preparation rhythm, review standards, and preferred ministry outputs - so every sermon starts closer to your real workflow. Everything here is optional and editable anytime.</p>

    ${profileSection("Preaching role", "Who is preaching, where, and how often.", `
      <div class="pf-form-grid">
        ${profileSelect("role", "Role or title", PROFILE_OPTIONS.role)}
        ${profileSelect("context", "Primary preaching context", PROFILE_OPTIONS.context)}
        ${profileSelect("cadence", "Preaching cadence", PROFILE_OPTIONS.cadence)}
        ${profileSelect("day", "Default preaching day", PROFILE_OPTIONS.day)}
      </div>
    `)}

    ${profileSection("Homiletical preferences", "How you naturally build a sermon. Sermon Guide respects these instead of pushing a generic method.", `
      <div class="pf-form-grid" style="margin-bottom:14px;">
        ${profileSelect("style", "Primary preaching style", PROFILE_OPTIONS.style)}
        ${profileSelect("outlinePref", "Outline preference", PROFILE_OPTIONS.outlinePref)}
        ${profileSelect("bigIdeaStyle", "Big idea style", PROFILE_OPTIONS.bigIdeaStyle)}
        ${profileSelect("christConnection", "Christ connection preference", PROFILE_OPTIONS.christConnection)}
      </div>
      <label class="pf-label" style="display:block;margin-bottom:6px;">Application emphasis</label>
      ${renderChipGroup("profile", "applicationEmphasis", PROFILE_APPLICATION_EMPHASES, profile.applicationEmphasis)}
    `)}

    ${profileSection("Theological and ministry convictions", "The stream you preach from and the values your ministry carries.", `
      <div class="pf-form-grid" style="margin-bottom:14px;">
        ${profileInput("tradition", "Theological tradition or stream", "e.g. Reformed Baptist, Wesleyan, non-denominational…")}
        ${profileInput("confession", "Confessional alignment", "e.g. 1689, Westminster, statement of faith…")}
      </div>
      <label class="pf-label" style="display:block;margin-bottom:6px;">Ministry values</label>
      ${renderChipGroup("profile", "values", PROFILE_VALUES, profile.values)}
      <div class="pf-ws-field" style="margin-top:14px;">
        <label class="pf-label">Guardrails - lines Sermon Guide must not cross</label>
        <textarea class="pf-ws-input" rows="5" data-action="profile-field" data-key="guardrails" placeholder="${attr(PROFILE_GUARDRAIL_HINT)}">${escapeHtml(profile.guardrails)}</textarea>
      </div>
    `)}

    ${profileSection("Review rubric", "Before you preach, PreachFlow checks the sermon against this list - your standards, not generic ones.", `
      <div class="pf-rubric-grid">
        ${PROFILE_RUBRIC.map(
          ([key, label]) => `
            <label class="pf-toggle-row" style="margin-top:0;">
              <input type="checkbox" data-action="rubric-toggle" data-key="${attr(key)}" ${rubricChecked(key) ? "checked" : ""} />
              <span>${escapeHtml(label)}</span>
            </label>
          `,
        ).join("")}
      </div>
      ${profile.rubricCustom.length ? `<div class="pf-filter-chips" style="margin:12px 0 0;">${profile.rubricCustom.map((item, index) => `<span class="pf-chip active">${escapeHtml(item)} <button class="pf-chip-x" data-action="rubric-remove" data-index="${index}" aria-label="Remove ${attr(item)}">✕</button></span>`).join("")}</div>` : ""}
      <div class="pf-chip-add" style="margin-top:12px;">
        <input class="pf-input" data-rubric-input placeholder="Add your own review standard…" />
        <button type="button" class="pf-btn pf-btn-ghost" data-action="rubric-add">Add</button>
      </div>
    `)}

    ${profileSection("Preparation rhythm", "How your week actually works - so nudges and defaults fit real life.", `
      <div class="pf-form-grid" style="margin-bottom:14px;">
        ${profileSelect("prepRhythm", "Preferred prep rhythm", PROFILE_OPTIONS.prepRhythm)}
        ${profileInput("weeklyTarget", "Ideal weekly target", "e.g. manuscript done by Thursday")}
      </div>
      <label class="pf-label" style="display:block;margin-bottom:6px;">Typical sermon-prep days</label>
      ${renderChipGroup("profile", "prepDays", PROFILE_PREP_DAYS, profile.prepDays)}
      <label class="pf-label" style="display:block;margin:14px 0 6px;">Common pressure points</label>
      ${renderChipGroup("profile", "pressurePoints", PROFILE_PRESSURES, profile.pressurePoints)}
    `)}

    <p class="pf-helper">Your Preaching Profile is for sermon-prep preferences and ministry workflow defaults. Do not store confidential counseling details, private member information, or sensitive pastoral care notes here.</p>
  `;
}

function renderProfileGuideTab() {
  const profile = state.preachingProfile;
  return `
    ${profileSection("Sermon Guide posture", "How you want Sermon Guide to engage your work. It supports the process - the Word leads, and you preach.", `
      ${renderChipGroup("profile", "posture", PROFILE_POSTURES, profile.posture)}
    `)}
    ${profileSection("Personalization", "", `
      ${profileToggle("useProfile", "Use Preaching Profile in Sermon Guide responses", "your preferences shape how it helps")}
      ${profileToggle("useLens", "Use Congregational Lens in Sermon Guide responses", "application aimed at your actual church")}
      ${profileToggle("questionsFirst", "Prefer questions before drafting", "Sermon Guide asks before it suggests")}
    `)}
    ${profileSection("Commitments", "These aren't settings. They're how PreachFlow works - no toggle, no API key, and no phrasing changes them.", `
      <ul class="pf-commit-list">
        <li>The text stays in charge. Claims the passage doesn't support get challenged, not accommodated.</li>
        <li>Sermon Guide never writes your sermon - no sections, outlines, big ideas, applications, illustrations, or manuscripts. Asking again doesn't change the answer.</li>
        <li>Honest push-back, never flattery. When avoiding the work runs against Scripture's own charge, expect the text itself brought to bear (2 Tim. 2:15).</li>
        <li>Real encouragement: what's genuinely strong gets named plainly, and the aim is always to get your own study moving.</li>
      </ul>
    `)}
    ${profileSection("Engine", "", `
      <div class="pf-account-row" style="border:0;padding:0;">
        <div style="flex:1;">
          <div class="pf-account-label">Sermon Guide engine</div>
          <div class="pf-account-meta">${
            ui.serverStatus.engineConfigured
              ? `Included with your account${ui.openai.hasKey ? " - using your own key instead" : " - signed-in and ready"}`
              : ui.openai.hasKey
                ? "Using the OpenAI key on this device"
                : "Not configured - add your own OpenAI key, or the site owner sets AI_API_KEY"
          }</div>
        </div>
        <button class="pf-btn" data-action="openai-key">${ui.openai.hasKey ? "Manage key" : "Use my own key"}</button>
      </div>
    `)}
  `;
}

function renderProfileDefaultsTab() {
  return `
    ${profileSection("Sermon defaults", "Prefilled when you start a sermon - always editable per sermon.", `
      <div class="pf-form-grid">
        ${profileInput("translation", "Preferred Bible translation", "e.g. ESV, CSB, NIV, KJV")}
        ${profileInput("length", "Default sermon length (minutes)", "40")}
        ${profileSelect("format", "Default sermon format", PROFILE_OPTIONS.format)}
        ${profileSelect("deliverable", "Default deliverable", PROFILE_OPTIONS.deliverable)}
        ${profileSelect("seriesBehavior", "Default series behavior", PROFILE_OPTIONS.seriesBehavior)}
      </div>
    `)}
    ${profileSection("Bible text", "Which translation the reader and Insert Scripture open with.", `
      <div class="pf-account-row" style="border:0;padding:0 0 10px;">
        <div style="flex:1;">
          <div class="pf-account-label">Provider</div>
          <div class="pf-account-meta">${state.bibleProvider.provider === "manual" ? "Manual paste with attribution" : `Public-domain API (${state.bibleProvider.translation})`}</div>
        </div>
      </div>
      <label class="pf-toggle-row" style="margin-top:0;">
        <input type="checkbox" data-action="bible-attribution" ${state.bibleProvider.attribution ? "checked" : ""} />
        <span><strong>Show attribution on Scripture blocks</strong> - translation credit stays with the text</span>
      </label>
      <div class="pf-account-row">
        <div style="flex:1;">
          <div class="pf-account-label">Read Scripture in the app</div>
          <div class="pf-account-meta">Open any passage in any available translation, then copy it or drop it straight into your work.</div>
        </div>
        <button class="pf-btn pf-btn-primary" data-action="reader-open" data-target="work">Open the reader</button>
      </div>
    `)}
    ${profileSection("Output defaults", "What you usually produce from a sermon and who it's for.", `
      <div class="pf-form-grid" style="margin-bottom:14px;">
        ${profileSelect("exportFormat", "Default export format", PROFILE_OPTIONS.exportFormat)}
      </div>
      <label class="pf-label" style="display:block;margin-bottom:6px;">Default production outputs</label>
      ${renderChipGroup("profile", "productionOutputs", PROFILE_PRODUCTION_OUTPUTS, state.preachingProfile.productionOutputs)}
      <label class="pf-label" style="display:block;margin:14px 0 6px;">Default audience outputs</label>
      ${renderChipGroup("profile", "audienceOutputs", PROFILE_AUDIENCES, state.preachingProfile.audienceOutputs)}
      <p class="pf-helper" style="margin-top:12px;"><strong>How this works:</strong> tap a chip to select it. “Add your own…” creates a custom chip - type it, press Add, and it joins the list already selected (tap a custom chip again to unselect it, and it disappears). Sermon Guide reads your selections when drafting ministry resources, so the outputs and audiences you actually use come first.</p>
    `)}
  `;
}

function renderProfileAccountTab(active) {
  return `
    ${profileSection("Account", "Identity, sign-in, security, integrations, and settings live here - your Preaching Profile is about your workflow.", `
      <div class="pf-account-row">
        <div style="flex:1;">
          <div class="pf-account-label">${ui.auth.user ? "Signed in" : "Working on this device"}</div>
          <div class="pf-account-meta">${ui.auth.user ? escapeHtml(ui.auth.user.email || "") : "Everything saves here automatically. Sign in to sync across devices, keep backups, and use Sermon Guide with zero setup. Signed in before on this device? The session expired or was cleared - one sign-in brings it back and it sticks."}</div>
        </div>
        ${ui.auth.user ? "" : `<button class="pf-btn pf-btn-primary" data-action="go-signin">Sign in / create account</button>`}
      </div>
      <div class="pf-account-row">
        <div style="flex:1;">
          <div class="pf-account-label">Cloud sync</div>
          <div class="pf-account-meta" data-auth-panel-status>${escapeHtml(ui.auth.user ? ui.auth.status : "Sign in to turn on cloud sync.")}</div>
        </div>
        ${
          !ui.auth.user
            ? ""
            : ui.auth.statusKey === "ready"
              ? `<button class="pf-btn" disabled>Synced ✓</button>`
              : ui.auth.statusKey === "syncing" || ui.auth.loading
                ? `<button class="pf-btn" disabled>Syncing…</button>`
                : `<button class="pf-btn pf-btn-primary" data-action="cloud-sync-now">Sync now</button>`
        }
      </div>
      <div class="pf-account-row">
        <div style="flex:1;">
          <div class="pf-account-label">Congregational Lens</div>
          <div class="pf-account-meta">${state.lens?.enabled ? "On - shaping application to your church" : "Off"}</div>
        </div>
        <button class="pf-btn" data-action="open-lens">Open</button>
      </div>
      <div class="pf-account-row">
        <div style="flex:1;">
          <div class="pf-account-label">Appearance</div>
          <div class="pf-account-meta">${state.theme === "dark" ? "Dark theme" : "Light theme"}</div>
        </div>
        <button class="pf-btn" data-action="toggle-theme">Toggle</button>
      </div>
      <div class="pf-account-actions">
        <button class="pf-btn pf-btn-danger" data-action="sign-out" ${ui.auth.loading ? "disabled" : ""}>Sign out</button>
        <span class="pf-helper" style="margin-left:auto;align-self:center;">App build ${escapeHtml(PF_BUILD)}</span>
      </div>
    `)}
  `;
}

function renderProfilePrivacyTab() {
  return `
    ${profileSection("Where your data lives", "", `
      <p class="pf-ministry-desc" style="margin-bottom:10px;">Your sermons, profile, and lens are saved on this device, and - when you're signed in - synced to your own account's cloud storage. Sermon Guide requests send only the sermon context needed for the request, using the API key you added on this device.</p>
    `)}
    ${profileSection("What is never shared", "", `
      <p class="pf-ministry-desc" style="margin-bottom:10px;">Share links never include your Preaching Profile, your account details, your Congregational Lens (unless you intentionally include a broad ministry field), your private notes, or your Post-Sermon Debrief - unless you explicitly turn a section on.</p>
    `)}
    ${profileSection("What belongs elsewhere", "", `
      <p class="pf-ministry-desc">PreachFlow is for sermon preparation and ministry workflow. Do not store confidential counseling details, private member information, or sensitive pastoral care notes anywhere in the app - the Preaching Profile, Congregational Lens, and Debrief all carry this same rule.</p>
    `)}
  `;
}

// ---- Home: the directional landing page ----
// Every session starts here; the logo always returns here. You choose the
// work - the app never drops you into a workspace uninvited.
function renderHome(active) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const pending = pendingDebriefSermon();
  const status = active ? sermonStatus(active) : null;
  const phase = active ? getPhase(active) : null;
  const days = status?.days;
  const daysLine =
    days === null || days === undefined ? "" : days < 0 ? `preached ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago` : days === 0 ? "preaching today" : `${days} day${days === 1 ? "" : "s"} to Sunday`;
  const directions = [
    ["new-sermon", "action", "Start a new sermon", "Begin at Plan & Pray with a fresh text."],
    ["library", "view", "Sermon Library", "Everything you've preached - searchable and editable."],
    ["pipeline", "view", "Pipeline", "Every sermon in motion, and where each one stands."],
    ["impact", "view", "Ministry response", "Impact Plan, shepherding, and the Discipleship Pack."],
    ["sharing", "view", "Sharing & Delivery", "Resources and read-only links for your teams."],
    ["journal", "view", "Notes", "Every note you've captured, organized by sermon and phase."],
  ];
  return `
    <div class="pf-page pf-page-wide pf-fade">
      <div class="pf-page-head" style="display:block;margin-bottom:24px;">
        <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">${escapeHtml(greeting)}</span>
        <h1 class="pf-h1">What are we working on?</h1>
        <p class="pf-page-sub">Pick a direction - nothing is selected until you choose it.</p>
      </div>

      ${
        active
          ? `
        <section class="pf-card-box pf-home-continue">
          <div class="pf-home-continue-info">
            <span class="pf-eyebrow">Continue where you left off</span>
            <h2 class="pf-home-passage">${escapeHtml(active.passage || "Untitled sermon")}${active.title ? ` - ${escapeHtml(active.title)}` : ""}</h2>
            <p class="pf-helper" style="margin-top:4px;">${escapeHtml([phase ? `In ${phase.name}` : "", daysLine, `${progressPct(active)}% ready`].filter(Boolean).join(" · "))}</p>
          </div>
          <div class="pf-home-continue-actions">
            ${active.imported ? `<button class="pf-btn pf-btn-primary" data-view="editor">Open Editor</button>` : `<button class="pf-btn pf-btn-primary" data-view="workspace">Open Workspace</button>
            <button class="pf-btn" data-view="editor">Editor</button>`}
            <button class="pf-btn" data-view="pulpit">Pulpit</button>
            <button class="pf-btn pf-btn-ghost" data-action="open-switcher">Switch sermon</button>
          </div>
        </section>`
          : `
        <section class="pf-card-box pf-home-continue">
          <div class="pf-home-continue-info">
            <span class="pf-eyebrow">First things first</span>
            <h2 class="pf-home-passage">Start your first sermon</h2>
            <p class="pf-helper" style="margin-top:4px;">Pick the passage, set the date, and begin at Plan & Pray.</p>
          </div>
          <div class="pf-home-continue-actions">
            <button class="pf-btn pf-btn-primary" data-action="new-sermon">Start a sermon</button>
            <button class="pf-btn pf-btn-ghost" data-action="open-import">Import one</button>
          </div>
        </section>`
      }

      ${
        pending && pending.id !== state.activeId
          ? `
        <section class="pf-card-box pf-checklist-card pf-debrief-nudge" style="margin-top:14px;">
          <div class="pf-checklist-head" style="align-items:center;">
            <div style="min-width:0;">
              <span class="pf-eyebrow">Before new work: debrief last Sunday</span>
              <p class="pf-ministry-desc" style="margin-top:2px;">You haven't debriefed <strong>${escapeHtml(pending.passage || "your last sermon")}</strong> yet - five minutes now shapes everything next.</p>
            </div>
            <button class="pf-btn pf-btn-primary" data-action="open-debrief" data-sermon="${attr(pending.id)}">Debrief it</button>
          </div>
        </section>`
          : ""
      }

      <div class="pf-tool-cards" style="margin-top:22px;">
        ${directions
          .map(
            ([key, kind, title, desc]) => `
              <button class="pf-tool-card" ${kind === "view" ? `data-view="${key}"` : `data-action="${key}"`}>
                <span class="pf-tool-card-title">${escapeHtml(title)}</span>
                <span class="pf-tool-card-desc">${escapeHtml(desc)}</span>
                <span class="pf-tool-card-meta"><span class="pf-tool-card-go">Open →</span></span>
              </button>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderMain(active) {
  if (ui.showNew) return renderNewSermon();
  if (state.view === "profile") return renderProfile(active);
  if (state.view === "home") return renderHome(active);
  if (state.view === "pipeline") return renderPipeline();
  if (state.view === "journal") return renderJournal(active);
  if (state.view === "ahead") return renderAhead();
  if (state.view === "impact") return renderImpact(active);
  if (state.view === "lens") return renderLens();
  if (state.view === "series") return renderSeriesPage();
  if (state.view === "diet") return renderDietPage();
  if (state.view === "editor") return renderEditorPage(active);
  if ((state.view === "workspace" || state.view === "map") && active?.imported) {
    // Imported sermons weren't prepared here: the prep workspace and map
    // don't apply. They live in the Editor, Pulpit, and Library.
    state.view = "editor";
  }
  if (state.view === "map") return renderPassageMap(active);
  if (state.view === "sharing") return renderSharingCenter(active);
  if (state.view === "library") return renderLibrary();
  if (state.view === "debrief") return renderDebriefPage();
  if (active) return renderWorkspace(active);
  return renderHome(null);
}

// The Stay Ahead teaching page - Preach Flow's multi-week preparation
// rhythm, built around the four movements.
function renderAhead() {
  const rotation = [
    ["This Sunday", "Polish & Delivery", "The sermon you preach this week gets its final pass: readiness check, delivery prep, heart prep. No new construction - sharpening and surrender."],
    ["1 week out", "Outline & Application", "Next week's sermon gets its skeleton: structure, specific application, invitation. The heavy thinking happens while there's still margin."],
    ["2 weeks out", "Study", "Two weeks ahead, you're in commentaries and cross-references - testing your own exegesis against the faithful, settling the aim and the gospel center."],
    ["3 weeks out", "Exegesis", "The newest sermon starts on your knees: plan and pray, immersion, first-pass exegesis, personal meditation. Just you, the text, and the Spirit."],
  ];
  const habits = [
    "Block one working session per sermon per week - four focused sessions beats one crushed Saturday.",
    "Always finish the current movement before touching the next sermon. The phases keep each session honest.",
    "Let texts simmer. Ideas, illustrations, and applications surface all week once a passage is living in you.",
    "Use the Pipeline clock. \"Behind\" on a sermon three weeks out is a nudge; behind on Saturday is a crisis.",
    "When you get a free week - vacation swap, guest preacher - don't rest the system. Bank a week of margin.",
  ];
  return `
    <div class="pf-page pf-page-read pf-fade">
      <div class="pf-page-head" style="display:block;margin-bottom:26px;">
        <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">Stay ahead</span>
        <h1 class="pf-h1">Four sermons. Four weeks. Ready every Sunday.</h1>
        <p class="pf-page-sub">The Preach Flow rhythm: keep four sermons alive at once, each a week further along - so no sermon is ever built in a panic.</p>
      </div>

      <section class="pf-note-group" style="padding:24px 26px;margin-bottom:18px;">
        <h2 style="font-family:var(--font-display);font-weight:800;font-size:18px;margin-bottom:10px;">Why work weeks ahead?</h2>
        <p style="font-size:15.5px;line-height:1.65;color:var(--text-secondary);margin-bottom:12px;">A sermon written in one desperate push tends to preach like one: thin illustrations, borrowed applications, a conclusion that arrives before the burden does. The way out for a weary preacher is to stop writing one sermon at a time and instead keep several simmering at once - each at a different stage - so that no sermon is ever rushed from first reading to pulpit in a single week.</p>
        <p style="font-size:15.5px;line-height:1.65;color:var(--text-secondary);margin-bottom:12px;">The gain isn't only time management. A text you've lived with for a month has been prayed over, meditated on, and tested against real pastoral moments. Illustrations find you. Applications sharpen. The sermon stops being a product you assemble and becomes a burden you carry - and your church can hear the difference between a word you're carrying and one you finished on Saturday night.</p>
        <p style="font-size:15.5px;line-height:1.65;color:var(--text-secondary);">Preach Flow's four movements are built for exactly this rotation: every week, each active sermon advances one movement.</p>
      </section>

      <section class="pf-note-group" style="padding:24px 26px;margin-bottom:18px;">
        <h2 style="font-family:var(--font-display);font-weight:800;font-size:18px;margin-bottom:14px;">The weekly rotation</h2>
        ${rotation
          .map(
            ([when, movement, body], index) => `
              <div style="display:flex;gap:14px;padding:13px 0;${index ? "border-top:1px solid var(--border-subtle);" : ""}">
                <span class="wf-num" style="flex-shrink:0;width:34px;height:34px;background:var(--pf-acc);color:#14171b;display:inline-flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:800;font-size:13px;">${index + 1}</span>
                <div>
                  <div style="font-family:var(--font-display);font-weight:800;font-size:14.5px;">${escapeHtml(when)} - <span style="color:var(--pf-acc-text);">${escapeHtml(movement)}</span></div>
                  <p style="font-size:14px;line-height:1.6;color:var(--text-secondary);margin-top:3px;">${escapeHtml(body)}</p>
                </div>
              </div>
            `,
          )
          .join("")}
      </section>

      <section class="pf-note-group" style="padding:24px 26px;margin-bottom:18px;">
        <h2 style="font-family:var(--font-display);font-weight:800;font-size:18px;margin-bottom:10px;">Getting four weeks ahead (without a sabbatical)</h2>
        <p style="font-size:15.5px;line-height:1.65;color:var(--text-secondary);margin-bottom:12px;">You don't need a month off - you need a running start. Pick your next four passages today and create all four sermons in the Pipeline with their dates. This week, do this Sunday's prep as normal, but give next week's sermon one extra session: plan, pray, and read the passage until it's familiar. Next week it will already be a week old, and the sermon after it becomes your new "3 weeks out." Within about a month the rotation is fully loaded, and from then on every sermon gets four weeks of simmering for one week's rhythm of work.</p>
        <p style="font-size:15.5px;line-height:1.65;color:var(--text-secondary);">Planning a series helps enormously: when the next four texts are already chosen, "what do I preach next?" never steals prep hours again.</p>
      </section>

      <section class="pf-note-group" style="padding:24px 26px;margin-bottom:22px;">
        <h2 style="font-family:var(--font-display);font-weight:800;font-size:18px;margin-bottom:12px;">Staying consistent</h2>
        ${habits
          .map(
            (habit, index) => `
              <div style="display:flex;gap:12px;padding:9px 0;${index ? "border-top:1px solid var(--border-subtle);" : ""}">
                <span style="flex-shrink:0;margin-top:2px;width:19px;height:19px;border-radius:999px;background:var(--brand);display:inline-flex;align-items:center;justify-content:center;">${SVG_CHECK(11, 3.5)}</span>
                <p style="font-size:14.5px;line-height:1.55;color:var(--text-secondary);">${escapeHtml(habit)}</p>
              </div>
            `,
          )
          .join("")}
      </section>

      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="pf-btn pf-btn-primary" data-view="pipeline">Open the Pipeline</button>
        <button class="pf-btn" data-action="new-sermon">Start the next sermon</button>
      </div>
    </div>
  `;
}

function renderEmpty() {
  return `
    <section class="empty-state">
      <div class="panel empty-hero">
        <img src="./assets/preach-flow-mark.svg" alt="" />
        <div>
          <span class="eyebrow">Sermon workspace</span>
          <h1 class="title">Preach Flow</h1>
        </div>
        <p>A focused sermon-prep workspace for exegesis, research, outline, application, manuscript review, and delivery.</p>
        <div class="action-row">
          <button class="btn btn-primary" data-action="new-sermon">+ Sermon</button>
        </div>
      </div>
      <div class="quick-actions">
        <div class="panel quick-card">
          <h3>Build from the text</h3>
          <p>Move through the full prep path with phase notes and guided prompts.</p>
          <button class="btn btn-primary" data-action="new-sermon">Start</button>
        </div>
        <div class="panel quick-card">
          <h3>Bring a finished sermon</h3>
          <p>Import it into your Sermon Library and keep every message findable.</p>
          <button class="btn" data-view="library">Open the Library</button>
        </div>
      </div>
    </section>
  `;
}

// Suggest the next occurrence of the profile's default preaching day.
function nextPreachingDate() {
  const day = state.preachingProfile.day;
  const target = day === "Sunday" ? 0 : day === "Wednesday" ? 3 : null;
  if (target === null) return "";
  const now = new Date();
  const delta = (target - now.getDay() + 7) % 7 || 7;
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + delta);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(next.getDate()).padStart(2, "0")}`;
}

// The sermon form's deliverable is manuscript-or-notes; map the profile's
// richer format preference onto it.
function profileDefaultFormat() {
  return state.preachingProfile.format === "Full manuscript" || !state.preachingProfile.format
    ? "Full manuscript"
    : "Preaching notes";
}

function renderNewSermon() {
  return `
    <div class="pf-page pf-page-narrow pf-fade">
      <div class="pf-page-head" style="margin-bottom:22px;">
        <div>
          <span class="pf-eyebrow pf-eyebrow-brand">New sermon</span>
          <h1 class="pf-h1">Start a sermon</h1>
        </div>
      </div>
      <form class="pf-form" data-form="new-sermon">
        <div class="pf-form-grid">
          <div class="pf-field full">
            <label class="pf-label" for="new-passage">Passage</label>
            <input id="new-passage" class="pf-input" name="passage" data-action="new-passage" value="${attr(ui.newPassage || "")}" placeholder="Ephesians 3:1-13" required />
            ${bibleBooks.length ? `<p class="pf-helper" style="margin:10px 0 6px;">Type it, or choose it here.</p>${renderPassagePicker("new", ui.newPassage || "")}` : ""}
          </div>
          <div class="pf-field full">
            <label class="pf-label" for="new-title">Working title</label>
            <input id="new-title" class="pf-input" name="title" placeholder="The Church on Display" />
          </div>
          <div class="pf-field">
            <label class="pf-label" for="new-date">Preaching date</label>
            <input id="new-date" class="pf-input" type="date" name="date" value="${attr(nextPreachingDate())}" />
          </div>
          <div class="pf-field">
            <label class="pf-label" for="new-length">Length (min)</label>
            <input id="new-length" class="pf-input" name="length" inputmode="numeric" value="${attr(state.preachingProfile.length || DEFAULT_DRAFT.length)}" />
          </div>
          <div class="pf-field">
            <label class="pf-label" for="new-series">Series</label>
            <input id="new-series" class="pf-input" name="series" placeholder="Family Matters" />
          </div>
          <div class="pf-field">
            <label class="pf-label" for="new-format">Deliverable</label>
            <select id="new-format" class="pf-select" name="format">
              <option ${profileDefaultFormat() === "Full manuscript" ? "selected" : ""}>Full manuscript</option>
              <option ${profileDefaultFormat() === "Preaching notes" ? "selected" : ""}>Preaching notes</option>
            </select>
          </div>
        </div>
        <div class="pf-form-actions">
          <button class="pf-btn pf-btn-primary" type="submit">Begin prep</button>
          ${state.sermons.length ? `<button class="pf-btn pf-btn-ghost" type="button" data-action="cancel-new">Cancel</button>` : ""}
        </div>
      </form>
    </div>
  `;
}

const PIPELINE_FILTERS = [
  ["all", "All"],
  ["behind", "Behind"],
  ["on-track", "On track"],
  ["ahead", "Ahead"],
];

function cardStatus(sermon) {
  if (sermon.completed.length >= PHASES.length) {
    return { key: "done", label: "Preached", days: daysUntil(sermon.date) };
  }
  const status = sermonStatus(sermon);
  const labels = { "on-track": "On track", ahead: "Ahead", behind: "Behind", neutral: "No date" };
  return { key: status.key, label: labels[status.key] || status.label, days: status.days };
}

function sermonMovementLabel(sermon) {
  if (sermon.completed.length >= PHASES.length) return "Delivered";
  if (!sermon.completed.length && sermon.activePhase === "plan") return "Not started";
  const phase = PHASES.find((item) => item.id === sermon.activePhase) || PHASES[0];
  return BLOCKS[phase.block].label;
}

function renderSeriesPage() {
  return `<div class="pf-page pf-page-wide pf-fade">${renderSeriesArchitect()}</div>`;
}

function renderDietPage() {
  return `<div class="pf-page pf-page-wide pf-fade">${renderDietReview()}</div>`;
}

function renderNeedSermon(message) {
  return `
    <div class="pf-page pf-page-read pf-fade">
      <div class="pf-empty">${message}
        <div style="margin-top:14px;"><button class="pf-btn pf-btn-primary" data-action="new-sermon">Start a sermon</button></div>
      </div>
    </div>
  `;
}

// ---- Sermon Editor (full-page manuscript writing) ----
// One manuscript, two doors: this edits the exact same document as the
// Manuscript phase in the Workspace (sermon.notes.manuscript).
function manuscriptPhaseDef() {
  return PHASES.find((phase) => phase.id === "manuscript");
}

function manuscriptWordCount(sermon) {
  const text = phaseNoteText(sermon, manuscriptPhaseDef());
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

function estPreachMinutes(words) {
  return words ? Math.max(1, Math.round(words / state.practiceWpm)) : 0;
}

// ---- Sermon Guide refinement tools ----
// Selection- and section-based helps. Every result is a suggestion card the
// preacher can copy, insert as a note, or dismiss - the manuscript is never
// overwritten.
const REFINE_ACTIONS = [
  ["clarify", "Clarify this section", "Suggest how to make this clearer without changing the preacher's voice. Point at what is unclear and offer a clarified rendering as a suggestion - do not expand it."],
  ["tighten", "Tighten wording", "Suggest a tighter version: remove filler, repetition, and unnecessary length while keeping the preacher's voice and conviction. Show the tightened text as a suggestion."],
  ["transition", "Strengthen transition", "Evaluate the transition into and out of this section and suggest one or two stronger ways to connect the movements. Do not rewrite the sections themselves."],
  ["check-text", "Check against the text", "Ask whether each claim here is clearly supported by the passage being preached. Flag anything the text does not say, and note what would need to change to stay faithful."],
  ["big-idea", "Pressure-test the big idea", "Evaluate the sermon's big idea: faithful to the passage, clear, memorable, text-driven? Push where it is weak. Affirm what is genuinely strong."],
  ["application", "Strengthen application", "Evaluate the application: specific and pastoral, or generic and religious? Suggest how to make it concrete for real people this week - name the kinds of people it should reach."],
  ["gospel", "Check gospel clarity", "Evaluate whether grace, repentance, faith, and Christ come through clearly here - without forcing the text. Note what is missing or muddy."],
  ["weak-spots", "Identify weak spots", "Find unclear logic, unsupported claims, thin application, overexplaining, missing transitions, or a vague call to respond. List them plainly with a pointer for each."],
  ["preach-ready", "Make this more preach-ready", "Suggest how to improve this for oral delivery: shorter sentences, spoken cadence, concrete words - in the preacher's own voice, offered as a suggestion."],
  ["questions", "Create discussion questions", "Draft four to six group discussion questions from this section: observation, meaning, application, and heart. Questions only - no commentary."],
];

async function runRefine(kind) {
  if (!requireOpenAIKey()) return;
  const active = getActive();
  if (!active) return;
  const def = REFINE_ACTIONS.find(([key]) => key === kind);
  if (!def) return;
  const selection = window.getSelection();
  const raw = selection ? selection.toString().trim() : "";
  const inEditor = raw && selection.anchorNode?.parentElement?.closest('[data-action="phase-editor"]');
  const source = inEditor ? raw : phaseNoteText(active, manuscriptPhaseDef()).slice(0, 4500);
  const scope = inEditor ? "selected section" : "whole sermon";
  if (!source.trim()) {
    showBanner("Write something first - refinement works on your words.");
    return;
  }
  ui.refine = { loading: true, label: def[1], text: "", scope };
  render();
  try {
    const response = await fetch("./api/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...openAIHeaders() },
      body: JSON.stringify({
        context: `${sermonDraftContext(active)}\n\nTHE PREACHER'S TEXT (${scope}):\n${source}`,
        prompt: `${def[2]} Respond as a brief, concrete suggestion for the preacher to weigh - clearly theirs to accept or reject. Never present your words as the sermon itself.`,
      }),
    });
    const data = await response.json();
    ui.refine = { loading: false, label: def[1], text: data.text || "No suggestion came back - try again.", scope };
  } catch {
    ui.refine = null;
    showBanner("Could not reach Sermon Guide.");
  }
  render();
}

// A visible "Sermon Guide is working" state: a little book flipping pages
// over a moving progress bar, so drafting never looks frozen.
function renderDraftingIndicator(note) {
  return `
    <div class="pf-drafting" role="status" aria-live="polite">
      <span class="pf-draftbook" aria-hidden="true"><b></b><i></i><i></i><i></i></span>
      <span class="pf-drafting-info">
        <strong>Sermon Guide is drafting…</strong>
        <em>${escapeHtml(note || "Working from your sermon - suggestions only, your words stay yours.")}</em>
        <span class="pf-drafting-bar"><i></i></span>
      </span>
    </div>
  `;
}

function renderRefineCard() {
  const refine = ui.refine;
  if (!refine) return "";
  return `
    <section class="pf-card-box pf-refine-card" aria-live="polite">
      <div class="pf-checklist-head" style="align-items:flex-start;">
        <div style="min-width:0;">
          <span class="pf-eyebrow pf-eyebrow-brand">Sermon Guide · ${escapeHtml(refine.label)}</span>
          <p class="pf-helper" style="margin-top:2px;">Reviewing the ${escapeHtml(refine.scope)} - a suggestion, never an overwrite.</p>
        </div>
        <button class="pf-btn pf-btn-ghost" data-action="refine-dismiss">Dismiss</button>
      </div>
      ${
        refine.loading
          ? renderDraftingIndicator("Reading your manuscript and weighing the suggestion…")
          : `
        <div class="pf-review-result pf-review-rich" style="margin-top:6px;">${formatGuideHtml(refine.text)}</div>
        <div class="pf-modal-actions" style="margin-top:12px;">
          <button class="pf-btn" data-action="refine-copy">Copy suggestion</button>
          <button class="pf-btn pf-btn-ghost" data-action="refine-insert-note">Insert as personal note</button>
        </div>`
      }
    </section>
  `;
}

// ---- Insert Scripture + structured blocks ----
// Reference parser: "John 3:16", "John 3:16-18", "Psalm 23", "Romans 8:1-4",
// "1 Corinthians 13:1-7". Validated against the canonical book list.
function parseBibleRef(input) {
  const clean = String(input || "").trim().replace(/\s+/g, " ");
  const match = clean.match(/^((?:[1-3]\s)?[A-Za-z][A-Za-z .]+?)\s+(\d{1,3})(?::(\d{1,3})(?:\s*[--]\s*(\d{1,3}))?)?$/);
  if (!match) return null;
  const book = passageBook(match[1]);
  if (!book) return null;
  return {
    book: book.name,
    chapter: Number(match[2]),
    verseStart: match[3] ? Number(match[3]) : null,
    verseEnd: match[4] ? Number(match[4]) : null,
    reference: `${book.name} ${match[2]}${match[3] ? `:${match[3]}${match[4] ? `-${match[4]}` : ""}` : ""}`,
  };
}

// Public-domain provider (bible-api.com - WEB and KJV only).
async function fetchScripturePassage(reference, translation) {
  const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=${translation === "KJV" ? "kjv" : "web"}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Provider returned ${response.status}`);
  const data = await response.json();
  if (!data.text) throw new Error("Passage not found");
  return {
    reference: data.reference || reference,
    text: String(data.text).replace(/\s*\n\s*/g, " ").trim(),
    attribution: translation === "KJV" ? "KJV · Public domain" : "World English Bible · Public domain",
  };
}

// ---- In-app Bible reader ----
// Read Scripture inside PreachFlow instead of leaving for a browser tab.
// Translations come from /api/bible: the public-domain texts always work,
// and licensed ones (ESV, NASB, CSB and friends) light up when the
// deployment has the publisher key.

const READER_STORE_KEY = "preach-flow:reader-translation:v1";

// The canonical book list (with chapter counts) comes from the API so the
// picker and chapter navigation always agree with what can be fetched.
let bibleBooks = [];
async function loadBibleBooks() {
  if (bibleBooks.length) return bibleBooks;
  try {
    const response = await fetch("./api/bible?books=1");
    const data = await response.json();
    if (Array.isArray(data.books) && data.books.length) bibleBooks = data.books;
  } catch {
    /* picker stays hidden; typing a reference still works */
  }
  return bibleBooks;
}

function bookByName(name) {
  const wanted = String(name || "").trim().toLowerCase();
  const aliases = { psalm: "psalms", "song of songs": "song of solomon" };
  const target = aliases[wanted] || wanted;
  return bibleBooks.find((book) => book.name.toLowerCase() === target) || null;
}

// How many verses a chapter holds. Asked once per chapter, then remembered,
// so the verse dropdowns only ever offer verses that exist.
const verseCounts = new Map();

function verseCountFor(bookName, chapter) {
  return verseCounts.get(`${bookName} ${chapter}`) || 0;
}

async function loadVerseCount(bookName, chapter) {
  const key = `${bookName} ${chapter}`;
  if (!bookName || !chapter || verseCounts.has(key)) return verseCountFor(bookName, chapter);
  try {
    const response = await fetch(`./api/bible?verses=1&reference=${encodeURIComponent(key)}`);
    const data = await response.json();
    if (data.verses) verseCounts.set(key, data.verses);
  } catch {
    /* the dropdown stays closed; typing a reference still works */
  }
  return verseCountFor(bookName, chapter);
}

// Split a reference into picker values without guessing.
function readerParts() {
  const parsed = parseBibleRef(ui.reader.reference || "");
  const book = parsed ? bookByName(parsed.book) : null;
  return {
    book,
    chapter: parsed?.chapter || 1,
    verseStart: parsed?.verseStart || null,
    verseEnd: parsed?.verseEnd || null,
  };
}

function readerSetReference(reference) {
  ui.reader.reference = reference;
  loadReaderPassage();
}

function readerTranslation() {
  return localStorage.getItem(READER_STORE_KEY) || state.preachingProfile?.translation?.toUpperCase?.() || "KJV";
}

async function openReader(reference, target = "") {
  ui.reader.show = true;
  ui.reader.target = target;
  ui.reader.reference = (reference || ui.reader.reference || getActive()?.passage || "").trim();
  ui.reader.translation = ui.reader.translation || readerTranslation();
  render();
  await loadBibleBooks();
  if (ui.reader.reference) await loadReaderPassage();
  else {
    await loadReaderTranslations();
    render();
  }
}

async function loadReaderTranslations() {
  if (ui.reader.translations.length) return;
  try {
    const response = await fetch("./api/bible?list=1");
    const data = await response.json();
    ui.reader.translations = data.translations || [];
  } catch {
    ui.reader.translations = [{ code: "KJV", label: "King James Version", ready: true }];
  }
}

async function loadReaderPassage() {
  const reference = ui.reader.reference.trim();
  if (!reference) return;
  ui.reader.loading = true;
  ui.reader.error = "";
  render();
  try {
    const params = new URLSearchParams({ reference, translation: ui.reader.translation });
    const response = await fetch(`./api/bible?${params.toString()}`);
    const data = await response.json();
    if (data.translations?.length) ui.reader.translations = data.translations;
    if (data.error) {
      ui.reader.error = data.error;
      ui.reader.verses = [];
    } else {
      ui.reader.reference = data.reference || reference;
      ui.reader.verses = data.verses || [];
      if (Array.isArray(data.books) && data.books.length) bibleBooks = data.books;
      // Remember the chapter's length so the verse picker can offer it.
      const asked = parseBibleRef(reference);
      if (asked && data.verseCount) verseCounts.set(`${asked.book} ${asked.chapter}`, data.verseCount);
      ui.reader.attribution = data.attribution || "";
      ui.reader.error = "";
    }
  } catch {
    ui.reader.error = "Could not reach the Scripture service. Check the connection and try again.";
    ui.reader.verses = [];
  }
  ui.reader.loading = false;
  render();
  // Fill in the chapter's length in the background if we still do not know it,
  // so the verse dropdowns wake up without holding the text hostage.
  const parts = readerParts();
  if (parts.book && !verseCountFor(parts.book.name, parts.chapter)) {
    loadVerseCount(parts.book.name, parts.chapter).then((count) => {
      if (count && ui.reader.show) render();
    });
  }
}

function readerVerseText() {
  return ui.reader.verses
    .map((verse) => (verse.verse ? `${verse.verse} ${verse.text}` : verse.text))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function readerPlainText() {
  return `${ui.reader.reference} (${ui.reader.translation})\n\n${readerVerseText()}`;
}

// Step a chapter at a time. At the end of a book this rolls into the next
// one the way a printed Bible does, and it simply stops at Genesis 1 and
// Revelation 22 instead of asking for chapters that do not exist.
function readerStepChapter(delta) {
  const parsed = parseBibleRef(ui.reader.reference);
  if (!parsed) return;
  const index = bibleBooks.findIndex((book) => book.name.toLowerCase() === parsed.book.toLowerCase());
  if (index < 0) return;
  const book = bibleBooks[index];
  let chapter = parsed.chapter + delta;
  let target = book;

  if (chapter > book.chapters) {
    const next = bibleBooks[index + 1];
    if (!next) {
      showBanner("That is the end of Revelation.");
      return;
    }
    target = next;
    chapter = 1;
  } else if (chapter < 1) {
    const previous = bibleBooks[index - 1];
    if (!previous) {
      showBanner("That is the beginning of Genesis.");
      return;
    }
    target = previous;
    chapter = previous.chapters;
  }

  readerSetReference(`${target.name} ${chapter}`);
}

function readerAtStart() {
  const { book, chapter } = readerParts();
  return Boolean(book) && bibleBooks[0]?.name === book.name && chapter <= 1;
}

function readerAtEnd() {
  const { book, chapter } = readerParts();
  return Boolean(book) && bibleBooks[bibleBooks.length - 1]?.name === book.name && chapter >= book.chapters;
}

// Book / chapter / verse selects, so a passage can be chosen as well as typed.
// The same picker serves the reader and the new-sermon form; the scope tells
// the change handler where the chosen reference should land.
function renderPassagePicker(scope, reference) {
  if (!bibleBooks.length) return "";
  const parsed = parseBibleRef(reference || "");
  const book = parsed ? bookByName(parsed.book) : null;
  const chapter = parsed?.chapter || 0;
  const verseStart = parsed?.verseStart || null;
  const verseEnd = parsed?.verseEnd || null;
  const chapters = book ? book.chapters : 0;
  const verseCount = book && chapter ? verseCountFor(book.name, chapter) : 0;
  const verseOptions = (selected, prefix, min = 1) => {
    const items = [];
    for (let verse = min; verse <= verseCount; verse++) {
      items.push(`<option value="${verse}" ${selected === verse ? "selected" : ""}>${prefix} ${verse}</option>`);
    }
    return items.join("");
  };
  return `
    <div class="pf-picker" data-scope="${attr(scope)}">
      <select class="pf-select" data-action="pick-book" aria-label="Book">
        <option value="">Choose a book</option>
        ${bibleBooks
          .map((item) => `<option value="${attr(item.name)}" ${book?.name === item.name ? "selected" : ""}>${escapeHtml(item.name)}</option>`)
          .join("")}
      </select>
      <select class="pf-select" data-action="pick-chapter" aria-label="Chapter" ${chapters ? "" : "disabled"}>
        ${chapter ? "" : `<option value="">Ch</option>`}
        ${Array.from({ length: chapters }, (_, index) => index + 1)
          .map((number) => `<option value="${number}" ${chapter === number ? "selected" : ""}>Ch ${number}</option>`)
          .join("")}
      </select>
      <select class="pf-select" data-action="pick-verse-start" aria-label="First verse" ${verseCount ? "" : "disabled"}>
        <option value="">Whole chapter</option>
        ${verseOptions(verseStart, "v")}
      </select>
      <select class="pf-select" data-action="pick-verse-end" aria-label="Last verse" ${verseCount && verseStart ? "" : "disabled"}>
        <option value="">${verseStart ? "that verse only" : "to verse"}</option>
        ${verseStart ? verseOptions(verseEnd, "to", verseStart + 1) : ""}
      </select>
    </div>
  `;
}

// Read the four selects back out as one reference string.
function pickerReference(container) {
  const value = (name) => container?.querySelector(`[data-action="pick-${name}"]`)?.value || "";
  const book = value("book");
  if (!book) return "";
  const chapter = value("chapter") || "1";
  const start = value("verse-start");
  if (!start) return `${book} ${chapter}`;
  const end = value("verse-end");
  return `${book} ${chapter}:${start}${end && Number(end) > Number(start) ? `-${end}` : ""}`;
}

// A picker change becomes a reference, then that reference is put to work:
// the reader loads it, the new-sermon form fills its Passage field.
async function applyPickedPassage(scope, reference) {
  if (!reference) return;
  const parsed = parseBibleRef(reference);
  if (parsed) await loadVerseCount(parsed.book, parsed.chapter);
  if (scope === "new") {
    ui.newPassage = reference;
    render();
    return;
  }
  readerSetReference(reference);
}

function renderReaderPanel() {
  const reader = ui.reader;
  const ready = reader.translations.filter((item) => item.ready);
  const pending = reader.translations.filter((item) => !item.ready);
  return `
    <div class="pf-overlay pf-reader-overlay" data-scroll-keep="reader-overlay">
      <div class="pf-modal wide pf-reader" data-stop data-scroll-keep="reader-modal">
        <div class="pf-reader-bar">
          <input class="pf-input pf-reader-ref" data-action="reader-ref" value="${attr(reader.reference)}" placeholder="John 15:1-11" aria-label="Passage" />
          <select class="pf-select pf-reader-select" data-action="reader-translation" aria-label="Translation">
            ${ready.map((item) => `<option value="${attr(item.code)}" ${reader.translation === item.code ? "selected" : ""}>${escapeHtml(item.code)}</option>`).join("")}
            ${pending.length ? `<optgroup label="Needs a publisher key">${pending.map((item) => `<option value="${attr(item.code)}" ${reader.translation === item.code ? "selected" : ""}>${escapeHtml(item.code)}</option>`).join("")}</optgroup>` : ""}
          </select>
          <button class="pf-icon-btn" data-action="reader-close" aria-label="Close the reader">✕</button>
        </div>

        ${renderPassagePicker("reader", reader.reference)}

        <div class="pf-reader-nav">
          <button class="pf-btn pf-btn-ghost" data-action="reader-prev" ${parseBibleRef(reader.reference) && !readerAtStart() ? "" : "disabled"}>‹ Chapter</button>
          <span class="pf-reader-where">${escapeHtml(reader.reference || "Choose or type a passage")}${reader.translation ? ` · ${escapeHtml(reader.translation)}` : ""}</span>
          <button class="pf-btn pf-btn-ghost" data-action="reader-next" ${parseBibleRef(reader.reference) && !readerAtEnd() ? "" : "disabled"}>Chapter ›</button>
        </div>

        <div class="pf-reader-body pf-scroll" data-scroll-keep="reader-body">
          ${
            reader.loading
              ? `<p class="pf-helper">Loading ${escapeHtml(reader.reference)}…</p>`
              : reader.error
                ? `<div class="pf-reader-note"><strong>${escapeHtml(reader.error)}</strong>${
                    /key/i.test(reader.error)
                      ? `<p class="pf-helper" style="margin:6px 0 0;">Pick another translation above to keep reading now.</p>`
                      : ""
                  }</div>`
                : reader.verses.length
                  ? reader.verses
                      .map(
                        (verse) =>
                          `<p class="pf-reader-verse">${verse.verse ? `<sup>${escapeHtml(String(verse.verse))}</sup>` : ""}${escapeHtml(verse.text)}</p>`,
                      )
                      .join("")
                  : `<p class="pf-helper">Pick a book and chapter above, or type a passage. It loads on its own.</p>`
          }
        </div>

        <div class="pf-modal-actions">
          <button class="pf-btn pf-btn-primary" data-action="reader-copy" ${reader.verses.length ? "" : "disabled"}>Copy passage</button>
          ${reader.target === "pm" ? `<button class="pf-btn" data-action="reader-to-map" ${reader.verses.length ? "" : "disabled"}>Load into the Passage Map</button>` : ""}
          ${reader.target === "work" ? `<button class="pf-btn" data-action="reader-insert" ${reader.verses.length ? "" : "disabled"}>Insert into my work</button>` : ""}
          <button class="pf-btn pf-btn-ghost" data-action="reader-close">Close</button>
        </div>
      </div>
    </div>
  `;
}

function scriptureBlockHtml({ reference, translation, text, attribution, slide, pulpit, production }) {
  return (
    `<div class="pf-b pf-b-scripture" data-ref="${attr(reference)}" data-translation="${attr(translation)}"` +
    ` data-slide="${slide ? "1" : "0"}" data-pulpit="${pulpit ? "1" : "0"}" data-production="${production ? "1" : "0"}">` +
    `<p class="pf-scripture-ref">${escapeHtml(reference)} · ${escapeHtml(translation)}</p>` +
    `<p class="pf-scripture-text">${escapeHtml(text)}</p>` +
    (state.bibleProvider.attribution && attribution ? `<p class="pf-scripture-attr">${escapeHtml(attribution)}</p>` : "") +
    `</div><p><br></p>`
  );
}

// Scripture from the reader lands as ordinary paragraphs: a reference line,
// the text, and an empty line waiting for the next sentence. No quote box to
// get stuck inside, and every word stays editable like anything else typed.
function scripturePlainHtml(reference, translation, text) {
  const heading = [reference, translation].filter(Boolean).join(" · ");
  return (
    (heading ? `<p>${escapeHtml(heading)}</p>` : "") +
    `<p>${escapeHtml(text)}</p>` +
    `<p><br></p>`
  );
}

// Block palette: structured, styled blocks inserted into the manuscript.
// Points/subpoints are real headings so Pulpit View and slides see them.

// Remember where the cursor was in the manuscript editor so modal-driven
// inserts land in the right place.
let savedEditorRange = null;

function saveEditorRange() {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return;
  const range = selection.getRangeAt(0);
  const editor = range.startContainer.parentElement?.closest('[data-action="phase-editor"]');
  savedEditorRange = editor ? range.cloneRange() : null;
}

function insertIntoEditor(html) {
  const editor = document.querySelector('[data-action="phase-editor"]');
  if (!editor) {
    showBanner("Open the Sermon Editor first.");
    return;
  }
  editor.focus({ preventScroll: true });
  // execCommand("insertHTML") flattens block markup into styled spans, so
  // insert real nodes at the nearest top-level block boundary instead.
  const template = document.createElement("template");
  template.innerHTML = html;
  const fragment = template.content;
  const lastNode = fragment.lastChild;
  let anchor = savedEditorRange && editor.contains(savedEditorRange.startContainer) ? savedEditorRange.startContainer : null;
  while (anchor && anchor.parentNode && anchor.parentNode !== editor) anchor = anchor.parentNode;
  if (anchor && anchor.parentNode === editor) {
    anchor.after(fragment);
  } else {
    editor.appendChild(fragment);
  }
  if (lastNode) {
    const selection = window.getSelection();
    const caret = document.createRange();
    // Inserted markup ends in an empty paragraph. Put the cursor inside it, so
    // typing carries on as plain prose instead of continuing the block above.
    const landing = lastNode.nodeName === "P" && !lastNode.textContent.trim() ? lastNode : null;
    if (landing) caret.setStart(landing, 0);
    else caret.setStartAfter(lastNode);
    caret.collapse(true);
    selection.removeAllRanges();
    selection.addRange(caret);
    // Survive the re-render that closes the modal behind this insert.
    pendingCaretBlock = [...editor.children].indexOf(landing || lastNode);
  }
  savedEditorRange = null;
  persistPhaseEditor(editor);
  updateEditorStats();
}

function renderScriptureModal() {
  const modal = ui.scripture;
  const provider = state.bibleProvider;
  const manualOnly = provider.provider === "manual";
  return `
    <div class="pf-overlay" data-action="scripture-close" data-overlay>
      <div class="pf-modal" data-stop style="max-width:560px;">
        <div class="pf-modal-head">
          <span class="pf-eyebrow pf-eyebrow-brand">Insert Scripture</span>
        </div>
        <div class="pf-form-grid" style="margin-bottom:12px;">
          <div class="pf-field full" style="margin-bottom:0;">
            <label class="pf-label" for="scripture-ref">Reference</label>
            <input id="scripture-ref" class="pf-input" data-action="scripture-ref" value="${attr(modal.ref)}" placeholder="John 3:16 · Psalm 23 · Romans 8:1-4" />
          </div>
          <div class="pf-field" style="margin-bottom:0;">
            <label class="pf-label">Translation</label>
            <select class="pf-select" data-action="scripture-translation">
              ${["WEB", "KJV"].map((code) => `<option ${provider.translation === code ? "selected" : ""}>${code}</option>`).join("")}
              <option ${manualOnly ? "selected" : ""} value="manual">Other (paste below)</option>
            </select>
          </div>
          <div class="pf-field" style="margin-bottom:0;display:flex;align-items:flex-end;">
            <button class="pf-btn pf-btn-primary" data-action="scripture-fetch" ${modal.loading ? "disabled" : ""} style="width:100%;">${modal.loading ? "Fetching…" : "Fetch passage"}</button>
          </div>
        </div>
        ${modal.error ? `<p class="pf-helper" style="color:var(--ofc-danger);margin-bottom:10px;">${escapeHtml(modal.error)} You can paste the passage below with attribution instead.</p>` : ""}
        <div class="pf-ws-field">
          <label class="pf-label">Passage text ${manualOnly ? "(paste from your licensed copy)" : ""}</label>
          <textarea class="pf-ws-input" rows="5" data-action="scripture-text" placeholder="Fetched text appears here - or paste the passage from a translation you have rights to use.">${escapeHtml(modal.text)}</textarea>
        </div>
        <div class="pf-scripture-flags">
          <label class="pf-toggle-row" style="margin-top:0;"><input type="checkbox" data-action="scripture-flag" data-key="slide" ${modal.slide ? "checked" : ""} /> <span>Include in slides</span></label>
          <label class="pf-toggle-row" style="margin-top:0;"><input type="checkbox" data-action="scripture-flag" data-key="pulpit" ${modal.pulpit ? "checked" : ""} /> <span>Show in Pulpit View</span></label>
          <label class="pf-toggle-row" style="margin-top:0;"><input type="checkbox" data-action="scripture-flag" data-key="production" ${modal.production ? "checked" : ""} /> <span>Include in Production Link</span></label>
        </div>

        <div class="pf-modal-actions">
          <button class="pf-btn" data-action="scripture-close">Cancel</button>
          <button class="pf-btn pf-btn-primary" data-action="scripture-insert" ${modal.text.trim() ? "" : "disabled"}>Insert Scripture block</button>
        </div>
      </div>
    </div>
  `;
}

async function fetchScriptureIntoModal() {
  const parsed = parseBibleRef(ui.scripture.ref);
  if (!parsed) {
    ui.scripture.error = "That reference didn't parse - try the form “John 3:16-18”.";
    render();
    return;
  }
  ui.scripture.ref = parsed.reference;
  ui.scripture.loading = true;
  ui.scripture.error = "";
  render();
  try {
    const passage = await fetchScripturePassage(parsed.reference, state.bibleProvider.translation);
    ui.scripture.text = passage.text;
    ui.scripture.attribution = passage.attribution;
    ui.scripture.ref = passage.reference;
  } catch (error) {
    ui.scripture.error = `Could not fetch the passage (${error.message || "network error"}).`;
  } finally {
    ui.scripture.loading = false;
    render();
  }
}

function renderEditorPage(active) {
  if (!active) return renderNeedSermon("The Sermon Editor writes the manuscript of your current sermon - start one first.");
  const words = manuscriptWordCount(active);
  const est = estPreachMinutes(words);
  const target = Number(active.length) || 0;
  return `
    <div class="pf-page pf-page-wide pf-fade">
      <div class="pf-editor-topline">
        <div style="min-width:0;">
          <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:6px;">Sermon Editor</span>
          <p class="pf-helper" style="margin-top:4px;">Same manuscript as the Workspace's Manuscript phase - write here or there, it's one document.</p>
        </div>
        <div class="pf-editor-actions">
          <button class="pf-btn pf-btn-ghost" data-action="editor-gdoc-export" ${ui.google.loading ? "disabled" : ""}>${ui.google.loading ? "Sending…" : "Send to Google Docs"}</button>
          <button class="pf-btn" data-action="reader-open" data-target="work" data-reference="${attr(active.passage || "")}">📖 Bible</button>
          <button class="pf-btn" data-view="pulpit">Preach It ▸</button>
          <button class="pf-btn pf-btn-ghost" data-action="open-slides">Send to production</button>
          <button class="pf-btn pf-btn-ghost" data-action="editor-export-pdf">PDF</button>
          <button class="pf-btn pf-btn-ghost" data-action="editor-export-doc">Word</button>
        </div>
      </div>
      <div class="pf-editor-statbar">
        <span><b data-editor-words>${words.toLocaleString()}</b> words</span>
        <span>≈ <b data-editor-est>${est}</b> min preached</span>
        ${target ? `<span>target ${target} min</span>` : ""}
        <button class="pf-inline-link" data-view="workspace">back to the Workspace</button>
      </div>
      ${renderFormatToolbar({ full: true })}
      <div
        class="pf-editor pf-doc-canvas"
        contenteditable="true"
        spellcheck="true"
        data-action="phase-editor"
        data-phase="manuscript"
        data-placeholder="Write the sermon here - introduction, points, gospel, conclusion, call."
      >${sanitizeRichHtml(phaseNoteHtml(active, manuscriptPhaseDef()))}</div>
      <div class="pf-refine-launch">
        <button class="pf-btn pf-btn-primary pf-refine-big" data-action="refine-menu">✦ Refine with Sermon Guide${ui.refineMenu ? "" : " ▾"}</button>
        ${
          ui.refineMenu
            ? `<div class="pf-refine-options">
                <p class="pf-helper" style="width:100%;margin:0 0 4px;">Select text in the manuscript to refine just that section, or run it on the whole sermon. Suggestions only - your words stay yours.</p>
                ${REFINE_ACTIONS.map(([kind, label]) => `<button class="pf-refine-opt" data-action="refine" data-kind="${kind}">${label}</button>`).join("")}
              </div>`
            : ""
        }
      </div>
      ${renderRefineCard()}
    </div>
  `;
}

// Live word count / estimate in the editor's stat bar without re-rendering.
function updateEditorStats() {
  const wordsEl = document.querySelector("[data-editor-words]");
  if (!wordsEl) return;
  const active = getActive();
  if (!active) return;
  const words = manuscriptWordCount(active);
  wordsEl.textContent = words.toLocaleString();
  const estEl = document.querySelector("[data-editor-est]");
  if (estEl) estEl.textContent = String(estPreachMinutes(words));
}

function manuscriptDocHtml(sermon) {
  const html = sanitizeRichHtml(phaseNoteHtml(sermon, manuscriptPhaseDef()));
  return `
    <section class="sermon">
      <p class="eyebrow">${escapeHtml(sermon.series || "Sermon manuscript")}</p>
      <h1>${escapeHtml(sermon.title || sermon.passage || "Sermon")}</h1>
      <p class="meta">${escapeHtml(sermon.passage || "")}${sermon.date ? ` · ${escapeHtml(fmtDate(sermon.date))}` : ""}</p>
      <div class="note">${html}</div>
    </section>
  `;
}

// ---- Preach It timer (run-throughs and Sunday) ----
const PRACTICE_FONT_SIZES = [15, 17, 19, 22, 26, 31];

function practiceFontPx() {
  return PRACTICE_FONT_SIZES[state.practiceFont + 2] || 19;
}

function fmtClock(totalSeconds) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = h ? String(m).padStart(2, "0") : String(m);
  return `${h ? `${h}:` : ""}${mm}:${String(s).padStart(2, "0")}`;
}

// ---- Pulpit View ----
// A focused preaching interface for the run-through and for Sunday: the
// clock, Live mode to take to the pulpit. Read-only by design - Sermon
// Guide never interrupts live preaching.
const PULPIT_FONT_SIZES = [18, 20, 23, 27, 32, 38];
const PULPIT_LINE_HEIGHTS = { compact: 1.55, comfortable: 1.75, spacious: 2.0 };

// Split the manuscript into preachable sections at headings; fall back to
// the outline, then to a single section.
function pulpitSections(sermon) {
  const html = sanitizeRichHtml(phaseNoteHtml(sermon, manuscriptPhaseDef()));
  const template = document.createElement("template");
  template.innerHTML = html;
  const raw = [];
  let current = { title: "", nodes: [] };
  for (const node of [...template.content.childNodes]) {
    const tag = node.nodeType === 1 ? node.tagName : "";
    if (tag === "H2" || tag === "H3") {
      if (current.title || current.nodes.length) raw.push(current);
      current = { title: node.textContent.trim(), nodes: [] };
    } else {
      current.nodes.push(node);
    }
  }
  if (current.title || current.nodes.length) raw.push(current);
  const sections = raw
    .map((section, index) => {
      const wrap = document.createElement("div");
      section.nodes.forEach((node) => wrap.appendChild(node));
      return {
        title: section.title || (index === 0 ? "Opening" : `Section ${index + 1}`),
        html: wrap.innerHTML,
      };
    })
    .filter((section) => section.title.trim() || richHtmlToText(section.html));
  if (sections.length) return sections;
  const movements = (sermon.outline || []).filter((movement) => movement.title.trim());
  if (movements.length) {
    return movements.map((movement) => ({
      title: movement.title,
      html: [
        movement.sub ? `<p>${escapeHtml(movement.sub)}</p>` : "",
        ...(movement.parts || [])
          .filter((part) => part.text.trim())
          .map((part) => `<p><strong>${escapeHtml(OUTLINE_PART_KINDS.find(([key]) => key === part.kind)?.[1] || part.kind)}:</strong> ${escapeHtml(part.text)}</p>`),
      ].join(""),
    }));
  }
  return [];
}

function pulpitReady(sermon) {
  return Boolean(sermon && sermon.passage.trim() && pulpitSections(sermon).length);
}

function pulpitFontPx() {
  return PULPIT_FONT_SIZES[state.pulpitPrefs.fontStep + 2] || 23;
}

function fmtWallClock(date) {
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function pulpitTargetEnd(sermon) {
  const target = Number(sermon.length) || 0;
  if (!target || !ui.practice.running || !ui.pulpit.startedAt) return "";
  const end = new Date(new Date(ui.pulpit.startedAt).getTime() + target * 60000);
  return fmtWallClock(end);
}

function renderPulpitView(active) {
  if (!active) {
    return `<div class="pf-page pf-page-read pf-fade" style="padding-top:60px;">${renderNeedSermon("Pulpit View opens your current sermon - start one first.")}</div>`;
  }
  const sections = pulpitSections(active);
  if (!sections.length) {
    return `
      <div class="pf-page pf-page-read pf-fade" style="padding-top:60px;">
        <div class="pf-empty">Pulpit View opens once this sermon has content - a manuscript with headings, or an outline.
          <div style="margin-top:14px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
            <button class="pf-btn pf-btn-primary" data-view="editor">Write the manuscript</button>
            <button class="pf-btn" data-view="workspace">Back to the Workspace</button>
          </div>
        </div>
      </div>
    `;
  }

  const prefs = state.pulpitPrefs;
  const index = Math.min(Math.max(0, ui.pulpit.section), sections.length - 1);
  const section = sections[index];
  const next = sections[index + 1] || null;
  const target = Number(active.length) || 0;
  const words = manuscriptWordCount(active);
  const over = target && ui.practice.seconds > target * 60;
  const bodyStyle = `font-size:${pulpitFontPx()}px;line-height:${PULPIT_LINE_HEIGHTS[prefs.lineHeight]};`;

  return `
    <div class="pf-pulpit theme-${attr(prefs.theme)} ${prefs.width === "narrow" ? "narrow" : "wide"} ${prefs.showNotes ? "" : "hide-notes"} ${prefs.showCues ? "" : "hide-cues"} ${prefs.showRefs ? "" : "hide-refs"} controls-on" data-pulpit>
      <header class="pf-pulpit-bar pf-pulpit-controls">
        <button class="pf-pulpit-btn" data-action="pulpit-exit" aria-label="Leave Pulpit View">&larr; Exit</button>
        <span class="pf-pulpit-modes pf-pulpit-brandtag">Preach It</span>
        <span class="pf-pulpit-id">${escapeHtml(active.passage)}${active.title ? ` - ${escapeHtml(active.title)}` : ""}</span>
        <div class="pf-pulpit-tools">
          <button class="pf-pulpit-btn" data-action="pulpit-font" data-delta="-1" ${prefs.fontStep <= -2 ? "disabled" : ""} aria-label="Smaller text">A−</button>
          <button class="pf-pulpit-btn" data-action="pulpit-font" data-delta="1" ${prefs.fontStep >= 3 ? "disabled" : ""} aria-label="Larger text">A+</button>
          <button class="pf-pulpit-btn" data-action="pulpit-theme" aria-label="Switch theme" title="Theme: ${attr(prefs.theme)}">◐</button>
          <button class="pf-pulpit-btn" data-action="pulpit-focus" aria-label="Toggle reading mode" title="${prefs.focusMode ? "Switch to continuous scroll (whole manuscript, scroll freely)" : "Switch to one section at a time"}">${prefs.focusMode ? "☰" : "▭"}</button>
          <button class="pf-pulpit-btn" data-action="pulpit-fullscreen" aria-label="Fullscreen">⛶</button>
          <button class="pf-pulpit-btn" data-action="pulpit-settings" aria-label="Display settings" aria-haspopup="true">⚙</button>
        </div>
      </header>

      ${ui.pulpit.showSettings ? renderPulpitSettings(prefs) : ""}
      ${prefs.showProgress ? `<div class="pf-pulpit-progress" aria-hidden="true"><i style="width:${Math.round(((index + 1) / sections.length) * 100)}%"></i></div>` : ""}

      <main class="pf-pulpit-body" style="${bodyStyle}" data-pulpit-body>
        <div class="pf-pulpit-head">
          <span class="pf-pulpit-passage">${escapeHtml(active.passage)}</span>
          ${worksheetValue(active, "aim", "burden").trim() ? `<span class="pf-pulpit-idea">${escapeHtml(worksheetValue(active, "aim", "burden"))}</span>` : ""}
        </div>
        ${
          prefs.focusMode
            ? `
              <section class="pf-pulpit-section" aria-label="${attr(section.title)}">
                <h2 class="pf-pulpit-title">${escapeHtml(section.title)}</h2>
                ${section.html}
              </section>
              ${next ? `<footer class="pf-pulpit-next">Next: ${escapeHtml(next.title)}</footer>` : `<footer class="pf-pulpit-next">Last section - land it.</footer>`}
            `
            : sections
                .map(
                  (item, itemIndex) => `
                    <section class="pf-pulpit-section ${itemIndex === index ? "current" : ""}" id="pulpit-section-${itemIndex}">
                      <h2 class="pf-pulpit-title">${escapeHtml(item.title)}</h2>
                      ${item.html}
                    </section>
                  `,
                )
                .join("")
        }
      </main>

      <button class="pf-pulpit-zone left" data-action="pulpit-prev" aria-label="Previous section"></button>
      <button class="pf-pulpit-zone right" data-action="pulpit-next" aria-label="Next section"></button>

      <footer class="pf-pulpit-bar bottom pf-pulpit-controls">
        <div class="pf-pulpit-nav">
          <button class="pf-pulpit-btn" data-action="pulpit-prev" ${index === 0 ? "disabled" : ""}>‹ Prev</button>
          <span class="pf-pulpit-count">${index + 1} / ${sections.length}</span>
          <button class="pf-pulpit-btn" data-action="pulpit-next" ${index >= sections.length - 1 ? "disabled" : ""}>Next ›</button>
          <div class="pf-pulpit-seg" role="group" aria-label="Reading mode">
            <button class="pf-pulpit-seg-btn ${prefs.focusMode ? "active" : ""}" data-action="pulpit-read-mode" data-mode="sections" title="One section on screen at a time">Sections</button>
            <button class="pf-pulpit-seg-btn ${prefs.focusMode ? "" : "active"}" data-action="pulpit-read-mode" data-mode="scroll" title="Scroll continuously through the whole manuscript">Scroll</button>
          </div>
        </div>
        ${
          prefs.showTimer
            ? `
          <div class="pf-pulpit-timing">
            <button class="pf-pulpit-btn pf-pulpit-start ${ui.practice.running ? "" : "go"}" data-action="practice-toggle" title="Shortcut: T">${ui.practice.running ? "Pause" : "▶ Preach"}</button>
            <button class="pf-pulpit-timer ${over ? "over" : ""}" data-action="practice-toggle" data-practice-timer title="${ui.practice.running ? "Pause" : "Start"} (T)">${fmtClock(ui.practice.seconds)}</button>
            <span class="pf-pulpit-meta"><span data-pulpit-clock>${fmtWallClock(new Date())}</span>${target ? ` · target ${target} min${pulpitTargetEnd(active) ? ` · ends ${pulpitTargetEnd(active)}` : ""}` : ""}</span>
            <button class="pf-pulpit-btn" data-action="practice-reset" ${ui.practice.seconds ? "" : "disabled"} aria-label="Reset timer">↺</button>
          </div>`
            : ""
        }
        <span class="pf-pulpit-meta">${words.toLocaleString()} words · ≈ ${estPreachMinutes(words) || "-"} min</span>
      </footer>


    </div>
  `;
}

function renderPulpitSettings(prefs) {
  const toggles = [
    ["showNotes", "Show personal notes"],
    ["showCues", "Show slide cues"],
    ["showRefs", "Show Scripture references"],
    ["showTimer", "Show timer"],
    ["showProgress", "Show progress"],
  ];
  return `
    <div class="pf-pulpit-settings" data-stop>
      <div class="pf-pulpit-settings-row">
        <span>Line height</span>
        <button class="pf-pulpit-chip" data-action="pulpit-lineheight">${escapeHtml(prefs.lineHeight)}</button>
      </div>
      <div class="pf-pulpit-settings-row">
        <span>Reading mode</span>
        <div class="pf-pulpit-seg" role="group" aria-label="Reading mode">
            <button class="pf-pulpit-seg-btn ${prefs.focusMode ? "active" : ""}" data-action="pulpit-read-mode" data-mode="sections" title="One section on screen at a time">Sections</button>
            <button class="pf-pulpit-seg-btn ${prefs.focusMode ? "" : "active"}" data-action="pulpit-read-mode" data-mode="scroll" title="Scroll continuously through the whole manuscript">Scroll</button>
          </div>
      </div>
      <div class="pf-pulpit-settings-row">
        <span>Reading column</span>
        <button class="pf-pulpit-chip" data-action="pulpit-width">${prefs.width === "narrow" ? "narrow" : "wide"}</button>
      </div>
      <div class="pf-pulpit-settings-row">
        <span>Pace</span>
        <select class="pf-select pf-practice-pace" data-action="practice-pace">
          ${PRACTICE_WPM_CHOICES.map((wpm) => `<option value="${wpm}" ${wpm === state.practiceWpm ? "selected" : ""}>${wpm} wpm</option>`).join("")}
        </select>
      </div>
      ${toggles
        .map(
          ([key, label]) => `
            <label class="pf-pulpit-settings-row">
              <span>${label}</span>
              <input type="checkbox" data-action="pulpit-pref-toggle" data-key="${key}" ${prefs[key] ? "checked" : ""} />
            </label>
          `,
        )
        .join("")}
      <div class="pf-pulpit-settings-row">
        <span>Emergency change?</span>
        <button class="pf-pulpit-chip" data-action="pulpit-unlock-edit">Unlock quick edit</button>
      </div>
    </div>
  `;
}

// ---- Sermon Library (every preached sermon, searchable and sortable) ----
const LIBRARY_SORTS = [
  ["date", "Newest first"],
  ["book", "By Book"],
  ["topic", "By Topic"],
  ["series", "By Series"],
  ["year", "By Year"],
];

const BOOK_ORDER = {};

// Library membership is explicit: every phase complete, marked preached,
// or imported. In-progress sermons never appear here.
function librarySermons() {
  return state.sermons.filter((sermon) => isPreachedSermon(sermon) || sermon.preached || sermon.imported);
}

function librarySearchText(sermon) {
  return [
    sermon.passage,
    sermon.title,
    sermon.series,
    (sermon.tags || []).join(" "),
    worksheetValue(sermon, "aim", "burden"),
    debriefSearchText(sermon),
  ]
    .join(" ")
    .toLowerCase();
}

function bookIndex(name) {
  if (!Object.keys(BOOK_ORDER).length) {
    BIBLE_BOOKS.forEach(([book], index) => {
      BOOK_ORDER[book] = index;
    });
  }
  return name in BOOK_ORDER ? BOOK_ORDER[name] : 999;
}

// Group the filtered sermons per the chosen sort. Returns [label, sermons][].
function libraryGroups(sermons) {
  const byDate = (a, b) => (b.date || "").localeCompare(a.date || "") || b.createdAt.localeCompare(a.createdAt);
  const sorted = [...sermons].sort(byDate);
  if (ui.librarySort === "book") {
    const groups = new Map();
    for (const sermon of sorted) {
      const book = passageBook(sermon.passage)?.name || "Other passages";
      if (!groups.has(book)) groups.set(book, []);
      groups.get(book).push(sermon);
    }
    return [...groups.entries()].sort((a, b) => bookIndex(a[0]) - bookIndex(b[0]));
  }
  if (ui.librarySort === "series") {
    const groups = new Map();
    for (const sermon of sorted) {
      const series = sermon.series.trim() || "No series";
      if (!groups.has(series)) groups.set(series, []);
      groups.get(series).push(sermon);
    }
    return [...groups.entries()].sort((a, b) =>
      a[0] === "No series" ? 1 : b[0] === "No series" ? -1 : a[0].localeCompare(b[0]),
    );
  }
  if (ui.librarySort === "topic") {
    // A sermon appears under each of its topic tags - that's the point of
    // browsing by topic. Untagged sermons gather at the end.
    const groups = new Map();
    for (const sermon of sorted) {
      const tags = (sermon.tags || []).filter(Boolean);
      if (!tags.length) {
        if (!groups.has("No topic tags")) groups.set("No topic tags", []);
        groups.get("No topic tags").push(sermon);
        continue;
      }
      for (const tag of tags) {
        if (!groups.has(tag)) groups.set(tag, []);
        groups.get(tag).push(sermon);
      }
    }
    return [...groups.entries()].sort((a, b) =>
      a[0] === "No topic tags" ? 1 : b[0] === "No topic tags" ? -1 : a[0].localeCompare(b[0]),
    );
  }
  if (ui.librarySort === "year") {
    const groups = new Map();
    for (const sermon of sorted) {
      const year = sermon.date ? sermon.date.slice(0, 4) : "No date";
      if (!groups.has(year)) groups.set(year, []);
      groups.get(year).push(sermon);
    }
    return [...groups.entries()].sort((a, b) =>
      a[0] === "No date" ? 1 : b[0] === "No date" ? -1 : b[0].localeCompare(a[0]),
    );
  }
  return [["", sorted]];
}

function renderLibraryCard(sermon) {
  const words = manuscriptWordCount(sermon);
  return `
    <div class="pf-lib-card" data-sermon-card="${attr(sermon.id)}" tabindex="0" role="button" aria-label="Open ${attr(sermon.passage || "sermon")}">
      <div class="pf-lib-passage">${escapeHtml(sermon.passage || "Untitled")}</div>
      <div class="pf-lib-title">${escapeHtml(sermon.title || "Untitled")}</div>
      <div class="pf-lib-meta">${sermon.date ? escapeHtml(fmtDate(sermon.date)) : "No date"}${sermon.series ? ` · ${escapeHtml(sermon.series)}` : ""}</div>
      ${(sermon.tags || []).length ? `<div class="pf-lib-tags">${sermon.tags.map((tag) => `<span>#${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      <div class="pf-lib-badges">
        <span class="pf-lib-badge ${sermon.debriefStatus === "done" ? "done" : ""}">${sermon.debriefStatus === "done" ? "Debriefed ✓" : sermon.debriefStatus === "skipped" ? "No debrief" : debriefFilled(sermon) ? "Debrief in progress" : "No debrief yet"}</span>
        ${sermon.timeSpent ? `<span class="pf-lib-badge" title="Total time spent preparing this sermon">Prep ${escapeHtml(fmtDuration(sermon.timeSpent))}</span>` : ""}
        ${words ? `<span class="pf-lib-badge">${words.toLocaleString()} words</span>` : ""}
      </div>
      <div class="pf-lib-actions">
        ${sermon.imported ? "" : `<button class="pf-btn pf-btn-ghost" data-action="lib-open" data-mode="workspace" data-sermon="${attr(sermon.id)}">Open</button>`}
        <button class="pf-btn pf-btn-ghost" data-action="lib-open" data-mode="editor" data-sermon="${attr(sermon.id)}">Editor</button>
        <button class="pf-btn pf-btn-ghost" data-action="lib-open" data-mode="pulpit" data-sermon="${attr(sermon.id)}">Pulpit</button>
        <button class="pf-btn pf-btn-ghost" data-action="open-debrief" data-sermon="${attr(sermon.id)}">Debrief</button>
        <button class="pf-btn pf-btn-ghost pf-lib-delete" data-action="delete-sermon" data-sermon="${attr(sermon.id)}" title="Delete this sermon">Delete</button>
      </div>
    </div>
  `;
}

// Distinct browse options with counts, drawn from the library itself.
function libraryBrowseOptions(sermons) {
  const books = new Map();
  const series = new Map();
  const topics = new Map();
  for (const sermon of sermons) {
    const book = passageBook(sermon.passage)?.name;
    if (book) books.set(book, (books.get(book) || 0) + 1);
    const name = sermon.series.trim();
    if (name) series.set(name, (series.get(name) || 0) + 1);
    for (const tag of sermon.tags || []) {
      if (tag) topics.set(tag, (topics.get(tag) || 0) + 1);
    }
  }
  return {
    books: [...books.entries()].sort((a, b) => bookIndex(a[0]) - bookIndex(b[0])),
    series: [...series.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    topics: [...topics.entries()].sort((a, b) => a[0].localeCompare(b[0])),
  };
}

function libraryFilterActive() {
  const filter = ui.libraryFilter;
  return Boolean(filter.book || filter.series || filter.topic);
}

function renderLibrary() {
  const all = librarySermons();
  const query = ui.libraryQuery.trim().toLowerCase();
  const filter = ui.libraryFilter;
  const filtered = all
    .filter((sermon) => !query || librarySearchText(sermon).includes(query))
    .filter((sermon) => !filter.book || passageBook(sermon.passage)?.name === filter.book)
    .filter((sermon) => !filter.series || sermon.series.trim() === filter.series)
    .filter((sermon) => !filter.topic || (sermon.tags || []).includes(filter.topic));
  const options = libraryBrowseOptions(all);
  const groups = libraryGroups(filtered);
  return `
    <div class="pf-page pf-page-wide pf-fade">
      <div class="pf-page-head" style="display:block;margin-bottom:20px;">
        <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">Sermon Library</span>
        <h1 class="pf-h1">Everything you've preached, at hand</h1>
        <p class="pf-page-sub">Every completed sermon lands here - searchable, sortable by book, topic, series, or year, and still fully editable. Bring in the sermons you preached before PreachFlow too: import Word, PDF, or text files and your whole preaching history lives in one place.</p>
      </div>

      <div class="pf-lib-controls">
        <button class="pf-btn pf-btn-primary" data-action="lib-import-open">Import sermons</button>
        <div class="pf-lib-search">
          <input class="pf-input" data-action="library-query" placeholder="Search passage, title, topic, series, or debrief notes…" value="${attr(ui.libraryQuery)}" />
          ${query ? `<button class="pf-btn pf-btn-ghost" data-action="library-clear">Clear</button>` : ""}
        </div>
        <select class="pf-select pf-lib-sort" data-action="library-sort" title="Sort the library">
          ${LIBRARY_SORTS.map(([key, label]) => `<option value="${key}" ${ui.librarySort === key ? "selected" : ""}>${label}</option>`).join("")}
        </select>
      </div>

      ${
        all.length
          ? `<div class="pf-lib-browse">
              <select class="pf-select" data-action="library-browse" data-kind="book" title="Browse by passage">
                <option value="">- Browse Passages -</option>
                ${options.books.map(([name, count]) => `<option value="${attr(name)}" ${filter.book === name ? "selected" : ""}>${escapeHtml(name)} (${count})</option>`).join("")}
              </select>
              <select class="pf-select" data-action="library-browse" data-kind="series" title="Browse by series">
                <option value="">- Browse Series -</option>
                ${options.series.map(([name, count]) => `<option value="${attr(name)}" ${filter.series === name ? "selected" : ""}>${escapeHtml(name)} (${count})</option>`).join("")}
              </select>
              <select class="pf-select" data-action="library-browse" data-kind="topic" title="Browse by topic">
                <option value="">- Browse Topics -</option>
                ${options.topics.map(([name, count]) => `<option value="${attr(name)}" ${filter.topic === name ? "selected" : ""}>${escapeHtml(name)} (${count})</option>`).join("")}
              </select>
              ${libraryFilterActive() ? `<button class="pf-btn pf-btn-ghost" data-action="library-browse-clear">Clear filters</button>` : ""}
            </div>`
          : ""
      }

      ${
        !all.length
          ? `<div class="pf-empty">Your library fills as you preach, and it can hold everything you preached before PreachFlow too.
              <div style="margin-top:14px;"><button class="pf-btn pf-btn-primary" data-action="lib-import-open">Import your past sermons</button></div>
              <p class="pf-helper" style="margin-top:10px;">Word, PDF, and text files all work. Bring several at once from Google Docs, Word, or Notes exports.</p>
            </div>`
          : !filtered.length
            ? `<div class="pf-empty">Nothing matches${query ? ` “${escapeHtml(ui.libraryQuery)}”` : " those filters"}. <button class="pf-inline-link" data-action="library-clear">${libraryFilterActive() ? "Clear the search and filters" : "Clear the search"}</button> to see all ${all.length} sermon${all.length === 1 ? "" : "s"}.</div>`
            : groups
                .map(
                  ([label, sermons]) => `
                    ${label ? `<h2 class="pf-lib-group-head">${escapeHtml(label)} <span>${sermons.length}</span></h2>` : ""}
                    <div class="pf-lib-grid">${sermons.map(renderLibraryCard).join("")}</div>
                  `,
                )
                .join("")
      }
    </div>
  `;
}

function renderPipeline() {
  return `
    <div class="pf-page pf-page-wide pf-fade">
      ${renderPipelineSermons()}
    </div>
  `;
}

function renderPipelineSermons() {
  const query = state.query.trim().toLowerCase();
  const libraryCount = state.sermons.filter((sermon) => sermon.preached || sermon.imported).length;
  const sermons = state.sermons
    // The pipeline is about what's late, on track, and ahead. Preached and
    // imported sermons live in the Library, not here.
    .filter((sermon) => !sermon.preached && !sermon.imported)
    .filter((sermon) => {
      const haystack = [sermon.passage, sermon.title, sermon.series].join(" ").toLowerCase();
      return !query || haystack.includes(query);
    })
    .filter((sermon) => {
      if (state.filter === "all") return true;
      return cardStatus(sermon).key === state.filter;
    })
    .sort((a, b) => {
      if (!a.date && !b.date) return a.createdAt.localeCompare(b.createdAt);
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });

  return `
    <div>
      <div class="pf-page-head">
        <div>
          <span class="pf-eyebrow pf-eyebrow-brand">Pipeline</span>
          <h1 class="pf-h1">Sermons in motion</h1>
        </div>
        <div style="margin-left:auto;display:flex;gap:10px;flex-wrap:wrap;">
          <button class="pf-btn" data-action="cal-import-open">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Import preaching calendar
          </button>
          <button class="pf-btn pf-btn-primary" data-action="new-sermon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            New sermon
          </button>
        </div>
      </div>
      ${libraryCount ? `<p class="pf-helper" style="margin:-6px 0 14px;">Preached and imported sermons are filed in the <button class="pf-inline-link" data-view="library">Sermon Library</button> (${libraryCount}).</p>` : ""}
      <div class="pf-tools">
        <div class="pf-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--pf-faint)" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input data-action="pipeline-query" value="${attr(state.query)}" placeholder="Search passage, title, or series" />
        </div>
        <div class="pf-filter-chips">
          ${PIPELINE_FILTERS.map(
            ([value, label]) =>
              `<button class="pf-chip ${state.filter === value ? "active" : ""}" data-action="pipeline-filter" data-filter="${value}">${label}</button>`,
          ).join("")}
          <button class="pf-chip" data-action="open-import">Import</button>
        </div>
      </div>
      ${
        sermons.length
          ? `<div class="pf-table">
              <div class="pf-row pf-row-head">
                <span>Passage / Series</span>
                <span class="pf-row-hide">Sunday</span>
                <span class="pf-row-hide">Movement</span>
                <span class="pf-row-hide">Progress</span>
                <span class="pf-row-status">Status</span>
              </div>
              ${sermons.map(renderSermonCard).join("")}
            </div>`
          : `<div class="pf-empty">No sermons match this view.</div>`
      }
    </div>
  `;
}

// One sermon as a table row: passage, Sunday, movement, progress, status.
function renderSermonCard(sermon) {
  const status = cardStatus(sermon);
  const pct = progressPct(sermon);
  const fillClass = status.key === "behind" ? "behind" : status.key === "done" ? "done" : "";
  const daysLabel =
    status.key === "done"
      ? "Preached"
      : status.days === null
        ? "-"
        : status.days < 0
          ? `${Math.abs(status.days)} days ago`
          : `${status.days} days out`;
  return `
    <div class="pf-row" data-sermon-card="${attr(sermon.id)}" tabindex="0">
      <div class="pf-row-main">
        <span class="pf-row-passage">${escapeHtml(sermon.passage || "Untitled sermon")}</span>
        <span class="pf-row-sub">${escapeHtml(sermon.title || "Untitled")} · ${escapeHtml(sermon.series || "No series")}</span>
      </div>
      <div class="pf-row-hide pf-row-date">
        ${sermon.date ? escapeHtml(fmtDate(sermon.date)) : "No date set"}
        <span>${escapeHtml(daysLabel)}</span>
      </div>
      <div class="pf-row-hide pf-row-move">${escapeHtml(sermonMovementLabel(sermon))}</div>
      <div class="pf-row-hide pf-row-progress">
        <span class="pf-progress-track"><span class="pf-progress-fill ${fillClass}" style="width:${pct}%;"></span></span>
        <span class="pf-row-pct">${pct}%</span>
      </div>
      <div class="pf-row-status">
        <span class="pf-tag ${status.key}">${escapeHtml(status.label)}</span>
        ${status.key === "done" ? `<button class="pf-chip pf-card-debrief" data-action="open-debrief" data-sermon="${attr(sermon.id)}">Debrief</button>` : ""}
      </div>
    </div>
  `;
}

// ---- per-phase note + checklist storage ----
function noteItemKey(phaseId, index) {
  return `${phaseId}::${index}`;
}

function phaseNoteHtml(sermon, phase) {
  const value = sermon?.notes?.[phase.id];
  return typeof value === "string" ? value : "";
}

function phaseNoteText(sermon, phase) {
  return richHtmlToText(phaseNoteHtml(sermon, phase));
}

// ---- checklist auto-checks ----
// Items that can prove themselves from real workspace output check off on
// their own as the work happens; everything else stays a manual tap.
// Keyed "phaseId:index" against that phase's doItems.
const AUTO_CHECKS = {
  "plan:1": { test: (s) => Boolean(s.passage.trim() && s.date), why: "the passage and date are set" },
  "immersion:2": { test: (s) => phaseTextLength(s, "immersion") >= 120, why: "your questions are recorded in this phase's writing" },
  "passagemap:0": { test: (s) => s.passageMap.verses.length > 0, why: "the passage is loaded in the Passage Map" },
  "passagemap:1": { test: (s) => s.passageMap.highlights.length >= 3, why: "three or more marks are on the text" },
  "passagemap:2": { test: (s) => s.passageMap.sections.length >= 2, why: "the passage is divided into sections" },
  "passagemap:3": { test: (s) => PM_SUMMARY_KEYS.some((key) => s.passageMap.summary[key].trim()), why: "the flow summary has begun" },
  "exegesis:0": { test: (s) => phaseTextLength(s, "exegesis") >= 120, why: "observations are written in this phase" },
  "commentary:1": { test: (s) => phaseTextLength(s, "commentary") >= 120, why: "research notes are written in this phase" },
  "aim:0": { test: (s) => Boolean(worksheetValue(s, "aim", "burden").trim()), why: "the main burden is filled in the worksheet" },
  "aim:1": { test: (s) => Boolean(worksheetValue(s, "aim", "fallen").trim()), why: "the Fallen condition is filled in the worksheet" },
  "aim:2": { test: (s) => Boolean(worksheetValue(s, "aim", "gospelResponse").trim()), why: "the gospel response is filled in the worksheet" },
  "aim:3": { test: (s) => Boolean(worksheetValue(s, "aim", "purpose").trim()), why: "the sermon purpose is filled in the worksheet" },
  "gospel:0": { test: (s) => Boolean(worksheetValue(s, "gospel", "christ").trim()), why: "the Christ connection is filled in the worksheet" },
  "gospel:1": { test: (s) => Boolean(worksheetValue(s, "gospel", "grace").trim()), why: "the grace-empowered response is filled in the worksheet" },
  "structure:0": { test: (s) => (s.outline || []).filter((m) => m.title.trim()).length >= 2, why: "the outline has two or more movements" },
  "application:0": {
    test: (s) => sermonAudiences(s).filter((a) => worksheetValue(s, "application", a).trim()).length >= 2,
    why: "counsel is written for two or more audiences",
  },
  "invitation:1": { test: (s) => phaseTextLength(s, "invitation") >= 60, why: "the invitation is written in this phase" },
  "introtitle:0": { test: (s) => worksheetValue(s, "introtitle", "intro").trim().length >= 100, why: "the introduction is written in the worksheet" },
  "introtitle:1": { test: (s) => Boolean(worksheetValue(s, "introtitle", "transition").trim()), why: "the transitional statement is written" },
  "introtitle:2": { test: (s) => Boolean(s.title.trim()), why: "the sermon has a title" },
  "manuscript:0": { test: (s) => manuscriptWordCount(s) >= 500, why: "the manuscript has real length (500+ words)" },
  "readiness:0": {
    test: (s) => readinessAnswered(s) === READINESS_QUESTIONS.length || (s.thread || []).some((m) => m.phaseId === "readiness"),
    why: "every readiness question is marked Ready (or the Sermon Guide check ran)",
  },
  "delivery:2": { test: (s) => (s.practice?.runs || 0) > 0, why: "you timed a run-through in Preach It" },
};

// Some phases are pure worksheet work: when every checklist item passes
// automatically, the phase marks itself complete.
const AUTO_COMPLETE_PHASES = new Set(["aim", "introtitle", "manuscript"]);
function maybeAutoCompletePhase(sermon, phaseId) {
  if (!AUTO_COMPLETE_PHASES.has(phaseId) || sermon.completed.includes(phaseId)) return;
  const phase = PHASES.find((item) => item.id === phaseId);
  if (!phase) return;
  const allDone = phase.doItems.every((item, index) => autoChecked(sermon, phaseId, index));
  if (!allDone) return;
  sermon.completed = [...sermon.completed, phaseId];
  sermon.updatedAt = new Date().toISOString();
  saveState();
  showEncouragement(phase, sermon);
  // Re-rendering mid-keystroke would drop the caret in a contenteditable;
  // the progress UI catches up on the next natural render.
  if (!document.activeElement?.isContentEditable) render();
}

function phaseTextLength(sermon, phaseId) {
  const phase = PHASES.find((item) => item.id === phaseId);
  const legacy = phase ? phaseNoteText(sermon, phase).length : 0;
  return Math.max(Number(sermon?.workLog?.[phaseId]) || 0, legacy);
}

function autoCheckFor(phaseId, index) {
  return AUTO_CHECKS[`${phaseId}:${index}`] || null;
}

function autoChecked(sermon, phaseId, index) {
  const check = autoCheckFor(phaseId, index);
  return Boolean(check && check.test(sermon));
}

function isChecked(sermon, phaseId, index) {
  return Boolean(sermon?.checklist?.[noteItemKey(phaseId, index)]) || autoChecked(sermon, phaseId, index);
}

function phaseCheckCount(sermon, phase) {
  return phase.doItems.reduce((count, _item, index) => count + (isChecked(sermon, phase.id, index) ? 1 : 0), 0);
}

// kept for export + Google Docs sync (now reads the single per-phase note)
function getPhaseFocusNotesText(sermon, phase) {
  return phaseNoteText(sermon, phase);
}

const SVG_CHECK = (size, stroke) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#20242A" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

function renderWorkspace(active) {
  const phase = getPhase(active);
  return `
    <div class="pf-fade">
      ${renderContextStrip(active, phase)}
      <div class="pf-ws-grid">
        ${renderRail(active, phase)}
        ${renderCanvas(active, phase)}
      </div>
      ${renderCoachComposer(active, phase)}
    </div>
  `;
}

// The four movements as tabs: a numbered cell each, the active one an
// inverted block, and the ready percentage in its own cell on the right.
function renderContextStrip(active, phase) {
  const movements = BLOCKS.map((block, bi) => {
    const phasesInBlock = PHASES.filter((p) => p.block === bi);
    const done = phasesInBlock.every((p) => active.completed.includes(p.id));
    const isActive = bi === phase.block;
    return { block, bi, state: isActive ? "active" : done ? "done" : "upcoming" };
  });

  return `
    <div class="pf-journey">
      ${movements
        .map(
          (m) => `
            <button class="pf-move-tab ${m.state}" data-action="journey-jump" data-block="${m.bi}">
              <span class="pf-move-num">${String(m.bi + 1).padStart(2, "0")}</span>
              <span class="pf-move-label">${escapeHtml(m.block.label)}</span>
              <span class="pf-move-when">${escapeHtml(m.block.when)}</span>
            </button>
          `,
        )
        .join("")}
      <span class="pf-journey-ready"><span>${progressPct(active)}%</span> Ready<br>to preach</span>
    </div>
  `;
}

function renderRail(active, phase) {
  const phasesInMovement = PHASES.filter((p) => p.block === phase.block);
  const curIdx = PHASES.findIndex((p) => p.id === phase.id);
  return `
    <aside class="pf-rail">
      <div class="pf-rail-head">
        <span class="pf-rail-eyebrow">Movement ${phase.block + 1}</span>
        <span class="pf-rail-title">${escapeHtml(BLOCKS[phase.block].label)}</span>
      </div>
      <div class="pf-rail-list">
        ${phasesInMovement
          .map((p) => {
            const done = active.completed.includes(p.id);
            const current = p.id === phase.id;
            const globalIndex = PHASES.findIndex((x) => x.id === p.id) + 1;
            return `
              <button class="pf-phase-row ${current ? "active" : ""} ${done ? "done" : ""}" data-action="set-phase" data-phase="${attr(p.id)}">
                <span class="pf-phase-num">${String(globalIndex).padStart(2, "0")}</span>
                <span class="pf-phase-name">${escapeHtml(p.name)}</span>
                ${p.devotional ? `<span class="pf-phase-star" title="Devotional">✦</span>` : ""}
              </button>
            `;
          })
          .join("")}
      </div>
      <button class="pf-rail-bible" data-action="reader-open" data-target="work" data-reference="${attr(active.passage || "")}">📖 Open the Bible</button>
      ${renderRailGuide(active, phase)}
      <div class="pf-rail-nav">
        <button class="pf-rail-nav-btn" data-action="prev-phase" ${curIdx <= 0 ? "disabled" : ""}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>Prev</button>
        <button class="pf-rail-nav-btn" data-action="next-phase" ${curIdx >= PHASES.length - 1 ? "disabled" : ""}>Next<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
      </div>
    </aside>
  `;
}

// ---- structured worksheets (Big Idea Guide / Christ Connection / Application Engine) ----
const WORKSHEETS = {
  aim: {
    eyebrow: "Big idea worksheet",
    fields: [
      ["burden", "Main burden of the text", "What is the one thing this text is pressing on the hearer?"],
      ["fallen", "Fallen condition", "What brokenness or unbelief does this text confront?"],
      ["gospelResponse", "Gospel response", "How does the grace of Christ meet that condition?"],
      ["purpose", "Sermon purpose", "My goal is for you to ___ so that ___."],
    ],
  },
  introtitle: {
    eyebrow: "Introduction & title worksheet",
    fields: [
      ["intro", "Introduction (write it in full)", "Grab attention, raise the tension the text answers, and make them need to hear this passage."],
      ["transition", "Transitional statement into the proposition", "The exact sentence that moves from the intro into your big idea."],
    ],
  },
  gospel: {
    eyebrow: "Christ connection check",
    fields: [
      ["christ", "How this text points to Christ", "Does it necessitate, foreshadow, or elucidate Jesus - without forcing allegory?"],
      ["grace", "How grace empowers the response", "How does Christ's grace power the obedience you will call for?"],
    ],
  },
};

const APPLICATION_AUDIENCES = ["Believer", "Unbeliever", "Weary Christian", "Proud Christian", "Nominal Christian", "Church Body"];

function sermonAudiences(sermon) {
  return [...APPLICATION_AUDIENCES, ...(sermon.customAudiences || [])];
}

function worksheetValue(sermon, phaseId, key) {
  return sermon?.worksheet?.[`${phaseId}.${key}`] || "";
}

function renderWorksheetCard(active, phase) {
  const config = WORKSHEETS[phase.id];
  if (!config) return "";
  return `
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head">
        <span class="pf-eyebrow">${escapeHtml(config.eyebrow)}</span>
      </div>
      ${config.fields
        .map(
          ([key, label, hint]) => `
            <div class="pf-ws-field">
              <label class="pf-label">${escapeHtml(label)}</label>
              <textarea class="pf-ws-input" data-action="worksheet-field" data-note-key="${attr(`${phase.id}.${key}`)}" data-phase="${attr(phase.id)}" data-key="${attr(key)}" rows="2" placeholder="${attr(hint)}">${escapeHtml(worksheetValue(active, phase.id, key))}</textarea>
            </div>
          `,
        )
        .join("")}
      ${
        phase.id === "introtitle"
          ? `<div class="pf-ws-field">
              <label class="pf-label">Sermon title (change it here if the message outgrew it)</label>
              <input class="pf-input" data-action="sermon-title-inline" data-note-key="it-title" value="${attr(active.title)}" placeholder="A title that advertises the actual content" />
            </div>`
          : ""
      }
    </section>
  `;
}

function renderApplicationCard(active, phase) {
  if (phase.id !== "application") return "";
  const audiences = sermonAudiences(active);
  const audience = audiences.includes(ui.audience) ? ui.audience : audiences[0];
  const filled = audiences.filter((a) => worksheetValue(active, "application", a).trim()).length;
  const isCustom = (active.customAudiences || []).includes(audience);
  return `
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head">
        <span class="pf-eyebrow">Application engine</span>
        <span class="pf-checklist-count">${filled} of ${audiences.length} audiences</span>
      </div>
      <p class="pf-section-hint">Write specific counsel for the people who will actually hear this. Two audiences make the phase complete; every extra one sharpens the sermon. Add your own audience for a person or group only you know is in the room.</p>
      <div class="pf-filter-chips" style="margin-bottom:14px;">
        ${audiences
          .map(
            (a) => `<button class="pf-chip ${a === audience ? "active" : ""}" data-action="set-audience" data-audience="${attr(a)}">${escapeHtml(a)}${worksheetValue(active, "application", a).trim() ? " ·" : ""}</button>`,
          )
          .join("")}
        <button class="pf-chip" data-action="audience-add">+ Add audience</button>
      </div>
      ${
        ui.showAudienceAdd
          ? `<div class="pf-resource-add" style="margin-bottom:12px;">
              <input class="pf-input" data-audience-name placeholder="Who is this for? (New parents, First responders, Doubting teens…)" />
              <button class="pf-btn pf-btn-ghost" data-action="audience-save">Add</button>
              <button class="pf-btn pf-btn-ghost" data-action="audience-cancel">Cancel</button>
            </div>`
          : ""
      }
      <div class="pf-ws-field">
        <label class="pf-label" style="display:flex;gap:10px;align-items:baseline;">For ${escapeHtml(audience.toLowerCase().startsWith("the ") ? audience.toLowerCase() : `the ${audience.toLowerCase()}`)}
          ${isCustom ? `<button class="pf-inline-link" data-action="audience-remove" data-audience="${attr(audience)}" style="font-size:12px;">remove this audience</button>` : ""}
        </label>
        <textarea class="pf-ws-input" data-action="worksheet-field" data-note-key="${attr(`application.${audience}`)}" data-phase="application" data-key="${attr(audience)}" rows="3" placeholder="Specific, concrete counsel - something for Monday.">${escapeHtml(worksheetValue(active, "application", audience))}</textarea>
      </div>
    </section>
  `;
}

function renderOutlineCard(active, phase) {
  if (phase.id !== "structure") return "";
  const outline = active.outline || [];
  return `
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head">
        <span class="pf-eyebrow">Outline lab</span>
        <span class="pf-checklist-count">${outline.length} point${outline.length === 1 ? "" : "s"}</span>
      </div>
      ${outline
        .map(
          (movement, index) => `
            <div class="pf-outline-row">
              <div class="pf-outline-tools">
                <button class="pf-outline-btn" data-action="outline-up" data-index="${index}" title="Move up" ${index === 0 ? "disabled" : ""}>▲</button>
                <button class="pf-outline-btn" data-action="outline-down" data-index="${index}" title="Move down" ${index === outline.length - 1 ? "disabled" : ""}>▼</button>
              </div>
              <div style="flex:1;min-width:0;">
                <input class="pf-ws-input pf-outline-title" data-action="outline-title" data-note-key="ol-t-${index}" data-index="${index}" value="${attr(movement.title)}" placeholder="Point ${index + 1} - title and verses (e.g. Praise is commanded, vv. 1-2)" />
                ${movement.sub ? `<input class="pf-ws-input pf-outline-sub" data-action="outline-sub" data-note-key="ol-s-${index}" data-index="${index}" value="${attr(movement.sub)}" placeholder="Verse range" />` : ""}
                ${(movement.parts || [])
                  .map(
                    (part) => `
                      <div class="pf-outline-part kind-${attr(part.kind)}" data-part-row data-index="${index}" data-part="${attr(part.id)}">
                        <div class="pf-outline-part-head">
                          <span class="pf-part-drag" draggable="true" data-drag-part data-index="${index}" data-part="${attr(part.id)}" title="Drag to reorder">⋮⋮</span>
                          <span class="pf-outline-part-label">${escapeHtml(OUTLINE_PART_KINDS.find(([key]) => key === part.kind)?.[1] || part.kind)}</span>
                          <button class="pf-chip-x" data-action="outline-part-remove" data-index="${index}" data-part="${attr(part.id)}" aria-label="Remove this ${attr(part.kind)}">✕</button>
                        </div>
                        <textarea class="pf-ws-input" rows="3" data-action="outline-part-text" data-note-key="olp-${attr(part.id)}" data-index="${index}" data-part="${attr(part.id)}" placeholder="${part.kind === "transition" ? "Write the transition word for word - exactly what you'll say to move here." : `Write the ${attr(part.kind)} in full - this is the work, not a note about it.`}">${escapeHtml(part.text)}</textarea>
                      </div>
                    `,
                  )
                  .join("")}
                <div class="pf-outline-part-adds">
                  ${OUTLINE_PART_KINDS.map(([key, label]) => `<button class="pf-chip" data-action="outline-part-add" data-index="${index}" data-kind="${key}">+ ${label}</button>`).join("")}
                </div>
              </div>
              <button class="pf-outline-btn" data-action="outline-remove" data-index="${index}" title="Remove">✕</button>
            </div>
          `,
        )
        .join("")}
      <button class="pf-ghost-add" data-action="outline-add">+ Add a point</button>
      <p class="pf-helper" style="margin-top:10px;">Under each point, write the explanation, illustration, and application in full, and the transition word for word. Drag the ⋮⋮ handle to reorder them. The outline IS the work here.</p>
    </section>
  `;
}

// A head start, not a ghostwriter: when the manuscript is still empty,
// assemble everything the preacher already wrote (title, intro, points
// with their parts, gospel work, applications, invitation) into an
// organized draft skeleton ready to be written into.
function assembleManuscriptDraft(sermon) {
  const parts = [];
  const intro = worksheetValue(sermon, "introtitle", "intro").trim();
  const transition = worksheetValue(sermon, "introtitle", "transition").trim();
  const bigIdea = worksheetValue(sermon, "aim", "burden").trim();
  const purpose = worksheetValue(sermon, "aim", "purpose").trim();
  if (bigIdea) parts.push(`<p><b>Big idea:</b> ${escapeHtml(bigIdea)}</p>`);
  if (purpose) parts.push(`<p><b>Purpose:</b> ${escapeHtml(purpose)}</p>`);
  parts.push("<h2>Introduction</h2>");
  parts.push(intro ? textToRichHtml(intro) : "<p><br></p>");
  if (transition) parts.push(`<p><em>${escapeHtml(transition)}</em></p>`);
  (sermon.outline || [])
    .filter((point) => point.title.trim())
    .forEach((point, index) => {
      parts.push(`<h2>Point ${index + 1}: ${escapeHtml(point.title)}</h2>`);
      if (point.sub?.trim()) parts.push(`<p>${escapeHtml(point.sub)}</p>`);
      (point.parts || [])
        .filter((part) => part.text.trim())
        .forEach((part) => {
          const label = OUTLINE_PART_KINDS.find(([key]) => key === part.kind)?.[1] || part.kind;
          parts.push(`<p><b>${escapeHtml(label)}:</b> ${escapeHtml(part.text)}</p>`);
        });
      if (!(point.parts || []).some((part) => part.text.trim())) parts.push("<p><br></p>");
    });
  const christ = worksheetValue(sermon, "gospel", "christ").trim();
  const grace = worksheetValue(sermon, "gospel", "grace").trim();
  if (christ || grace) {
    parts.push("<h2>Gospel</h2>");
    if (christ) parts.push(`<p>${escapeHtml(christ)}</p>`);
    if (grace) parts.push(`<p>${escapeHtml(grace)}</p>`);
  }
  const applications = sermonAudiences(sermon)
    .map((audience) => [audience, worksheetValue(sermon, "application", audience).trim()])
    .filter(([, text]) => text);
  if (applications.length) {
    parts.push("<h2>Application</h2>");
    applications.forEach(([audience, text]) => parts.push(`<p><b>${escapeHtml(audience)}:</b> ${escapeHtml(text)}</p>`));
  }
  const invitation = phaseNoteHtml(sermon, PHASES.find((phase) => phase.id === "invitation"));
  if (richHtmlToText(invitation).trim()) {
    parts.push("<h2>Invitation</h2>");
    parts.push(sanitizeRichHtml(invitation));
  }
  parts.push("<h2>Conclusion</h2><p><br></p>");
  return sanitizeRichHtml(parts.join(""));
}

function ensureManuscriptSeed(sermon) {
  const manuscriptPhase = manuscriptPhaseDef();
  if (phaseNoteText(sermon, manuscriptPhase).trim()) return;
  const hasSource =
    (sermon.outline || []).some((point) => point.title.trim()) ||
    worksheetValue(sermon, "aim", "burden").trim() ||
    worksheetValue(sermon, "introtitle", "intro").trim();
  if (!hasSource) return;
  sermon.notes = { ...sermon.notes, manuscript: assembleManuscriptDraft(sermon) };
  sermon.updatedAt = new Date().toISOString();
  saveState();
  showBanner("Your work so far is assembled below - a head start, organized and ready to write into.");
}

// The readiness check the app itself walks you through - no AI required.
// Each question is marked Ready when the preacher can answer it honestly.
const READINESS_QUESTIONS = [
  ["bigidea", "Is there ONE clear big idea - and could a listener repeat it after hearing the sermon once?"],
  ["textdriven", "Does the structure flow from the text, or is it imposed on it?"],
  ["christ", "Is Christ the hero - gospel woven through, not moralism with a Jesus ending?"],
  ["eia", "Does every point carry explanation, illustration, and application?"],
  ["application", "Is the application specific enough to act on Monday - not vague religious advice?"],
  ["transitions", "Are the transitions written word for word, so no seam gets lost in the moment?"],
  ["invitation", "Is there a clear invitation - what should people actually do in response?"],
  ["length", "Does it fit your target length without rushing the landing?"],
];

function readinessAnswered(sermon) {
  return READINESS_QUESTIONS.filter(([key]) => worksheetValue(sermon, "readiness", key) === "ready").length;
}

function renderReadinessCard(active, phase) {
  if (phase.id !== "readiness") return "";
  const answered = readinessAnswered(active);
  const pct = Math.round((answered / READINESS_QUESTIONS.length) * 100);
  return `
    <section class="pf-card-box pf-checklist-card pf-ready-block">
      <div class="pf-score-row">
        <span class="pf-score-num">${answered}/${READINESS_QUESTIONS.length}</span>
        <span class="pf-score-label">Non-negotiables<br>ready</span>
        <span class="pf-score-bar"><span style="width:${pct}%;"></span></span>
      </div>
      ${READINESS_QUESTIONS.map(
        ([key, question]) => {
          const done = worksheetValue(active, "readiness", key) === "ready";
          return `
          <label class="pf-ready-row ${done ? "done" : ""}">
            <input type="checkbox" data-action="readiness-toggle" data-key="${key}" ${done ? "checked" : ""} />
            <span class="pf-check-box ${done ? "done" : ""}">${done ? SVG_CHECK(13, 3.6) : ""}</span>
            <span class="pf-ready-text">${escapeHtml(question)}</span>
          </label>
        `;
        },
      ).join("")}
      <div class="pf-ready-foot">
        <button class="pf-btn pf-btn-ink pf-btn-block" data-action="coach-cta">Run the Readiness Check with Sermon Guide</button>
        <p class="pf-section-hint">No Sermon Guide? The check still works: walk each question against your manuscript and mark it Ready only when it is honestly true.</p>
      </div>
    </section>
  `;
}

function renderDeliveryCard(active, phase) {
  if (phase.id !== "delivery") return "";
  return `
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head"><span class="pf-eyebrow">Get it into your body</span></div>
      <div class="pf-modal-actions" style="margin-top:0;justify-content:flex-start;">
        <button class="pf-btn pf-btn-primary pf-btn-big" data-action="coach-cta">Guide my delivery plan</button>
        <button class="pf-btn pf-btn-big" data-view="pulpit">▶ Preach It - practice a run-through</button>
      </div>
      <p class="pf-section-hint" style="margin-top:12px;margin-bottom:0;">Work the steps below in order; the timer in Preach It handles the run-through.</p>
    </section>
  `;
}

// First-Pass Exegesis works FROM the Passage Map: what you marked is the
// raw material for this phase's questions.
function renderPmEchoCard(active, phase) {
  if (phase.id !== "exegesis") return "";
  const map = active.passageMap;
  if (!map.verses.length) {
    return `
      <section class="pf-card-box pf-checklist-card">
        <div class="pf-checklist-head"><span class="pf-eyebrow">Start with the Passage Map</span></div>
        <p class="pf-section-hint">Exegesis goes faster when you've already seen the text's shape. Map the passage first - mark repeated words, commands, and connectors, and divide it into sections - then answer this phase's questions from what you found.</p>
        <div class="pf-modal-actions" style="margin-top:0;">
          <button class="pf-btn pf-btn-primary" data-view="map">Open the Passage Map</button>
        </div>
      </section>
    `;
  }
  const counts = {};
  map.highlights.forEach((item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
  });
  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([key, count]) => `${PM_CATEGORIES.find(([k]) => k === key)?.[1] || key} (${count})`);
  const ordered = pmOrderedSections(active.passageMap);
  return `
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head"><span class="pf-eyebrow">From your Passage Map</span><span class="pf-checklist-count">${map.highlights.length} marks</span></div>
      <p class="pf-section-hint">Everything you marked is raw material for this phase. Answer the exegesis questions from what YOU saw in the text.</p>
      ${top.length ? `<p class="pf-ministry-desc" style="margin-bottom:8px;"><strong>Most marked:</strong> ${escapeHtml(top.join(" · "))}</p>` : ""}
      ${
        ordered.length
          ? `<p class="pf-ministry-desc" style="margin-bottom:8px;"><strong>Your sections:</strong> ${ordered.map((section, index) => `§${index + 1} ${escapeHtml(section.title || section.verseRange || "untitled")}`).join(" · ")}</p>`
          : ""
      }
      ${map.summary.doing.trim() ? `<p class="pf-ministry-desc" style="margin-bottom:8px;"><strong>What the passage is doing:</strong> ${escapeHtml(map.summary.doing)}</p>` : ""}
      <div class="pf-modal-actions" style="margin-top:8px;">
        <button class="pf-btn pf-btn-ghost" data-view="map">Back to the map</button>
      </div>
    </section>
  `;
}

function renderCanvas(active, phase) {
  if (phase.id === "manuscript") ensureManuscriptSeed(active);
  const curIdx = PHASES.findIndex((p) => p.id === phase.id);
  const complete = active.completed.includes(phase.id);
  const checkedCount = phaseCheckCount(active, phase);
  const checklistReady = checkedCount >= phase.doItems.length;
  return `
    <main class="pf-canvas">
      <div class="pf-canvas-head">
        <div class="pf-canvas-eyebrow">
          <span class="pf-kicker">Phase ${String(curIdx + 1).padStart(2, "0")} / ${PHASES.length}</span>
          <span class="pf-canvas-where">${escapeHtml(BLOCKS[phase.block].label)} · ${escapeHtml(BLOCKS[phase.block].when)}</span>
        </div>
        <h1 class="pf-phase-title">${escapeHtml(phase.name)}</h1>
        <p class="pf-phase-focus">${escapeHtml(phase.focus)}</p>
      </div>
      ${renderDebriefNudge(active, phase)}
      ${renderLibraryEcho(active, phase)}
      ${phase.id === "passagemap" ? renderPassageMapLaunchCard(active) : ""}
      ${renderPmEchoCard(active, phase)}
      ${phase.id === "readiness" ? renderReadinessCard(active, phase) : ""}
      ${phase.id === "delivery" ? renderDeliveryCard(active, phase) : ""}
      ${["manuscript", "readiness"].includes(phase.id) ? "" : renderChecklistCard(active, phase)}
      ${renderWorksheetCard(active, phase)}
      ${renderOutlineCard(active, phase)}
      ${renderApplicationCard(active, phase)}
      ${renderWriterCard(active, phase)}
      ${["meditation", "gospel", "readiness", "delivery", "heart"].includes(phase.id) ? "" : renderResourcesCard(active, phase)}
      <div class="pf-complete-row">
        <button class="pf-btn ${complete ? "" : checklistReady ? "pf-btn-primary" : "pf-btn-locked"}" data-action="toggle-complete" data-phase="${attr(phase.id)}" ${complete || checklistReady ? "" : `title="Every item in this phase's checklist must be checked first"`}>
          ${complete ? "Phase complete · undo" : checklistReady ? "Mark phase complete" : `Checklist ${checkedCount}/${phase.doItems.length} - finish to complete`}
        </button>
        ${daysUntil(active.date) !== null && daysUntil(active.date) < 0 && !active.preached && !isPreachedSermon(active) ? `<button class="pf-btn pf-btn-ghost" data-action="mark-preached" title="Move this sermon to the Library and open the debrief">Mark as preached ✓</button>` : ""}
        <button class="pf-btn pf-btn-ghost" data-view="pulpit">Open Pulpit View</button>
        <button class="pf-btn pf-btn-ghost" data-action="open-impact">Impact Plan</button>
        ${debriefAvailable(active) ? `<button class="pf-btn pf-btn-ghost" data-action="open-debrief">Debrief</button>` : ""}
        <button class="pf-btn pf-btn-ghost" data-action="open-slides">Send slides to production</button>
        <button class="pf-btn pf-btn-ghost" data-action="export-active">Export PDF</button>
        <button class="pf-btn pf-btn-ghost" data-action="export-active-doc">Word</button>
        <button class="pf-btn pf-btn-ghost" data-action="copy-active">Copy</button>
      </div>
    </main>
  `;
}

// A guide points at helps: curated links per phase plus the preacher's own.
function renderResourcesCard(active, phase) {
  const curated = PHASE_RESOURCES[phase.id] || [];
  const custom = state.resources[phase.id] || [];
  return `
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head"><span class="pf-eyebrow">Your study shelf for this phase</span></div>
      <p class="pf-section-hint">Save the sites you personally reach for during ${escapeHtml(phase.name)} (online commentaries, lexicons, articles, tools). Links you add stay attached to this phase for every future sermon, so next week they are one click away right where you use them.</p>
      ${!curated.length && !custom.length ? `<p class="pf-helper" style="margin-bottom:10px;">Nothing saved yet. Add your first link below.</p>` : ""}
      <div class="pf-resource-list">
        ${curated
          .map((resource) =>
            resource.url
              ? `<a class="pf-resource-row" href="${attr(resource.url)}" target="_blank" rel="noopener noreferrer">
                  <span class="pf-resource-label">${escapeHtml(resource.label)} <span class="pf-resource-arrow">↗</span></span>
                  <span class="pf-resource-note">${escapeHtml(resource.note)}</span>
                </a>`
              : `<button class="pf-resource-row" data-view="${attr(resource.view)}">
                  <span class="pf-resource-label">${escapeHtml(resource.label)} <span class="pf-resource-arrow">→</span></span>
                  <span class="pf-resource-note">${escapeHtml(resource.note)}</span>
                </button>`,
          )
          .join("")}
        ${custom
          .map(
            (resource) => `
              <span class="pf-resource-row custom">
                <a class="pf-resource-label" href="${attr(resource.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(resource.label)} <span class="pf-resource-arrow">↗</span></a>
                <button class="pf-outline-btn" data-action="resource-remove" data-phase="${attr(phase.id)}" data-id="${attr(resource.id)}" title="Remove this link">✕</button>
              </span>
            `,
          )
          .join("")}
      </div>
      <div class="pf-resource-add">
        <input class="pf-input" data-resource-label placeholder="Name (e.g. Blue Letter Bible)" />
        <input class="pf-input" data-resource-url placeholder="https://…" />
        <button class="pf-btn pf-btn-ghost" data-action="resource-add" data-phase="${attr(phase.id)}">Save to this phase</button>
      </div>
    </section>
  `;
}

// The Library talks back: starting a text you've preached from before
// surfaces those sermons right in the Plan phase.
function renderLibraryEcho(active, phase) {
  if (phase.id !== "plan") return "";
  const book = passageBook(active.passage)?.name;
  if (!book) return "";
  const related = librarySermons().filter(
    (sermon) => sermon.id !== active.id && passageBook(sermon.passage)?.name === book,
  );
  if (!related.length) return "";
  const shown = related.slice(0, 3);
  return `
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head"><span class="pf-eyebrow">From your Library</span><span class="pf-checklist-count">${related.length}</span></div>
      <p class="pf-section-hint">You've preached from ${escapeHtml(book)} before. A quick look back keeps this sermon fresh and builds on what your church has already heard.</p>
      ${shown
        .map(
          (sermon) => `
            <button class="pf-lib-echo-row" data-sermon-card="${attr(sermon.id)}" title="Open this sermon">
              <strong>${escapeHtml(sermon.passage)}</strong>
              <span>${escapeHtml(sermon.title || "")}</span>
              <em>${sermon.date ? escapeHtml(fmtDate(sermon.date)) : ""}</em>
            </button>
          `,
        )
        .join("")}
      ${related.length > shown.length ? `<button class="pf-inline-link" data-view="library" style="margin-top:6px;">See all ${related.length} in the Library</button>` : ""}
    </section>
  `;
}

// Debrief-first: before new prep starts, point at last week's un-debriefed
// sermon. Shown only on the opening phase of a sermon that hasn't begun.
function renderDebriefNudge(active, phase) {
  if (phase.id !== "plan" || active.completed.length) return "";
  const pending = pendingDebriefSermon();
  if (!pending || pending.id === active.id) return "";
  return `
    <section class="pf-card-box pf-checklist-card pf-debrief-nudge">
      <div class="pf-checklist-head" style="align-items:flex-start;">
        <div style="min-width:0;">
          <span class="pf-eyebrow">First: debrief last Sunday</span>
          <p class="pf-ministry-desc">You haven't debriefed <strong>${escapeHtml(pending.passage || "your last sermon")}</strong>${pending.date ? ` (${escapeHtml(fmtDate(pending.date))})` : ""} yet. There's always a sermon to learn from before you start the next one - five minutes now shapes everything below.</p>
        </div>
        <button class="pf-btn pf-btn-primary" data-action="open-debrief" data-sermon="${attr(pending.id)}">Debrief it</button>
      </div>
    </section>
  `;
}

function renderChecklistCard(active, phase) {
  return `
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head">
        <span class="pf-eyebrow">This phase</span>
        <span class="pf-checklist-count">${phaseCheckCount(active, phase)} / ${phase.doItems.length}</span>
      </div>
      <div class="pf-checklist-items">
        ${phase.doItems
          .map((item, index) => {
            const auto = autoCheckFor(phase.id, index);
            const autoOn = auto ? auto.test(active) : false;
            const done = isChecked(active, phase.id, index);
            const autoTitle = auto ? (autoOn ? `Checked automatically - ${auto.why}` : `Checks itself once ${auto.why}`) : "";
            return `
              <button class="pf-check-item" data-action="toggle-check" data-phase="${attr(phase.id)}" data-index="${index}" ${autoTitle ? `title="${attr(autoTitle)}"` : ""}>
                <span class="pf-check-box ${done ? "done" : ""}">${done ? SVG_CHECK(12, 3.5) : ""}</span>
                <span class="pf-check-text ${done ? "done" : ""}">${escapeHtml(item)}${auto ? `<span class="pf-check-auto ${autoOn ? "on" : ""}">auto</span>` : ""}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

// The rich-text toolbar, shared by the phase writer card and the full-page
// Sermon Editor. `full` adds more heading levels and a font-size menu.
function renderFormatToolbar(options = {}) {
  const full = Boolean(options.full);
  const headingItems = full
    ? [
        ["h2", "Title"],
        ["h3", "Heading"],
        ["h4", "Subheading"],
        ["p", "Normal text"],
      ]
    : [
        ["h3", "Heading"],
        ["p", "Normal text"],
      ];
  const menuChevron = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>`;
  return `
    <div class="pf-toolbar" aria-label="Text formatting">
      <span class="pf-tool-menu-wrap">
        <button class="pf-tool-pill" data-action="heading-menu" title="Text style" aria-haspopup="true">Heading ${menuChevron}</button>
        <span class="pf-tool-menu" data-tool-menu>
          ${headingItems
            .map(([format, label]) => `<button class="pf-tool-menu-item" data-action="format-doc" data-format="${format}">${label}</button>`)
            .join("")}
        </span>
      </span>
      ${
        full
          ? `
        <button class="pf-tool-pill" data-action="open-scripture" title="Insert a Bible passage">Scripture ＋</button>
        <span class="pf-tool-menu-wrap">
          <button class="pf-tool-pill" data-action="heading-menu" title="Font size" aria-haspopup="true">Size ${menuChevron}</button>
          <span class="pf-tool-menu" data-tool-menu>
            <button class="pf-tool-menu-item" data-action="format-doc" data-format="size-2">Small</button>
            <button class="pf-tool-menu-item" data-action="format-doc" data-format="size-3">Normal</button>
            <button class="pf-tool-menu-item" data-action="format-doc" data-format="size-4">Large</button>
            <button class="pf-tool-menu-item" data-action="format-doc" data-format="size-5">Extra large</button>
          </span>
        </span>`
          : ""
      }
      <span class="pf-tool-div"></span>
      <button class="pf-tool-btn serif b" data-action="format-doc" data-format="bold" title="Bold">B</button>
      <button class="pf-tool-btn serif i" data-action="format-doc" data-format="italic" title="Italic">I</button>
      <button class="pf-tool-btn serif u" data-action="format-doc" data-format="underline" title="Underline">U</button>
      <span class="pf-tool-div"></span>
      <button class="pf-tool-btn" data-action="format-doc" data-format="ul" title="Bulleted list"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg></button>
      <button class="pf-tool-btn" data-action="format-doc" data-format="ol" title="Numbered list"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg></button>
      <span class="pf-tool-div"></span>
      <button class="pf-tool-quote" data-action="format-doc" data-format="quote" title="Quote block"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>Quote</button>
    </div>
  `;
}

function renderWriterCard(active, phase) {
  // One document for the whole sermon. Every phase opens the same page, so
  // the work carries instead of restarting sixteen times.
  noteWorkBaseline(active, phase.id);
  return `
    <section class="pf-card-box pf-writer-card">
      <div class="pf-writer-head">
        <span class="pf-writer-eyebrow">Your work</span>
        <span class="pf-writer-note">One document, every phase</span>
        <button class="pf-btn pf-btn-ghost" data-view="editor">Open full editor →</button>
      </div>
      ${renderFormatToolbar()}
      <div
        class="pf-editor pf-scroll"
        contenteditable="true"
        spellcheck="false"
        data-action="phase-editor"
        data-phase="manuscript"
        data-work-phase="${attr(phase.id)}"
        data-placeholder="Start writing. This page stays with you through every phase."
      >${sanitizeRichHtml(phaseNoteHtml(active, manuscriptPhaseDef()))}</div>
    </section>
  `;
}

// Writing is attributed to the phase it happened in, so a checklist item like
// "observations are written in this phase" can still tell honestly. The
// baseline is the document's length when the phase was opened.
let workBaseline = { sermonId: "", phaseId: "", length: 0 };

function noteWorkBaseline(sermon, phaseId) {
  if (!sermon) return;
  if (workBaseline.sermonId === sermon.id && workBaseline.phaseId === phaseId) return;
  workBaseline = {
    sermonId: sermon.id,
    phaseId,
    length: phaseNoteText(sermon, manuscriptPhaseDef()).length,
  };
}

function logWorkForPhase(sermon, phaseId, text) {
  if (!sermon || !phaseId) return;
  if (workBaseline.sermonId !== sermon.id || workBaseline.phaseId !== phaseId) {
    workBaseline = { sermonId: sermon.id, phaseId, length: text.length };
    return;
  }
  const added = Math.max(0, text.length - workBaseline.length);
  const logged = Number(sermon.workLog?.[phaseId]) || 0;
  if (added <= logged) return;
  sermon.workLog = { ...(sermon.workLog || {}), [phaseId]: added };
}

const COACH_SPARK = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="m12 3 1.9 4.6L19 9.5l-4.1 2.4L12 17l-2.9-5.1L5 9.5l5.1-1.9z"/></svg>`;

// The one door into Sermon Guide sits in the phase rail, under the last
// step of the movement and above Prev/Next. Devotional phases get a quiet
// line instead of a button.
function renderRailGuide(active, phase) {
  if (phase.devotional) {
    const text =
      phase.id === "heart"
        ? "The work is done. Walk into Sunday emptied of yourself and full of Christ."
        : "This phase is between you and the Lord. Keep it in your writing canvas.";
    return `
      <div class="pf-rail-devotional">
        ${COACH_SPARK}
        <span>${escapeHtml(text)}</span>
      </div>
    `;
  }
  if (ui.showCoach) {
    return `
      <button class="pf-coach-cta pf-rail-cta open" data-action="close-coach">
        ${COACH_SPARK}
        <span>Hide Sermon Guide</span>
      </button>
    `;
  }
  const label = phase.actions?.[0]?.label || `Ask Sermon Guide about your ${phase.name.toLowerCase()}`;
  return `
    <button class="pf-coach-cta pf-rail-cta" data-action="coach-cta">
      ${COACH_SPARK}
      <span>${escapeHtml(label)}</span>
      <em>Sermon Guide reacts to your work - it never writes for you</em>
    </button>
  `;
}

function renderCoachComposer(active, phase) {
  // The static rail button is the way in; nothing floats until the
  // conversation is actually open.
  if (phase.devotional || !ui.showCoach) return "";

  return `
    <div class="pf-coach-wrap">
      <div class="pf-coach-inner">
        ${renderCoachPanel(active)}
        <div class="pf-coach">
          ${COACH_SPARK}
          <input class="pf-coach-input" data-action="coach-input" value="${attr(ui.composer)}" placeholder="Ask Sermon Guide to react to your ${attr(phase.name.toLowerCase())}…" />
          <button class="pf-coach-toggle" data-action="close-coach" title="Hide thread" aria-label="Hide coach thread">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <button class="pf-coach-send" data-action="send" ${ui.loading || !ui.composer.trim() ? "disabled" : ""}>${ui.loading ? "…" : "Send"} <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#20242A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg></button>
        </div>
      </div>
    </div>
  `;
}

function renderCoachPanel(active) {
  return `
    <div class="pf-coach-panel">
      <div class="pf-coach-panel-head">
        <span class="pf-eyebrow">Sermon Guide</span>
        <button class="pf-btn pf-btn-ghost" style="margin-left:auto;padding:6px 12px;" data-action="close-coach">Close</button>
      </div>
      <div class="pf-coach-thread pf-scroll" data-thread>
        ${
          active.thread.length
            ? active.thread.map(renderMessage).join("")
            : `<div class="pf-msg-divider">Ask Sermon Guide for help with observation, structure, big idea, application, transitions, or sermon review.</div>`
        }
        ${ui.loading ? `<div class="pf-msg coach"><div class="pf-msg-who">Sermon Guide</div><div class="pf-bubble">${loadingDots()}</div></div>` : ""}
      </div>
      <div class="pf-guide-disclaimer">Sermon Guide supports your preparation. It does not replace prayer, study, pastoral discernment, or the preacher's responsibility to rightly handle the Word.</div>
    </div>
  `;
}

// Sermon Guide replies arrive as markdown-ish plain text. Render them as a
// clean, readable document: headings, bold, lists, and real paragraphs.
function formatGuideHtml(text) {
  const inline = (line) =>
    escapeHtml(line)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
  const lines = String(text || "").replace(/\r/g, "").split("\n");
  const out = [];
  let list = null; // "ul" | "ol"
  let para = [];
  const closeList = () => {
    if (list) {
      out.push(`</${list}>`);
      list = null;
    }
  };
  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${para.map(inline).join("<br>")}</p>`);
      para = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      closeList();
      continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      flushPara();
      closeList();
      const level = Math.min(heading[1].length + 2, 5);
      out.push(`<h${level}>${inline(heading[2].replace(/\*\*/g, ""))}</h${level}>`);
      continue;
    }
    const bullet = line.match(/^[-•*]\s+(.*)$/);
    if (bullet) {
      flushPara();
      if (list !== "ul") {
        closeList();
        out.push("<ul>");
        list = "ul";
      }
      out.push(`<li>${inline(bullet[1])}</li>`);
      continue;
    }
    const numbered = line.match(/^(\d+)[.)]\s+(.*)$/);
    if (numbered) {
      flushPara();
      if (list !== "ol") {
        closeList();
        out.push("<ol>");
        list = "ol";
      }
      out.push(`<li>${inline(numbered[2])}</li>`);
      continue;
    }
    // "Label: detail" lead-ins read better with the label bolded.
    const lead = line.match(/^([A-Z][A-Za-z''\s]{2,40}):\s+(.+)$/);
    if (lead && !line.includes("**")) {
      flushPara();
      closeList();
      out.push(`<p><strong>${inline(lead[1])}:</strong> ${inline(lead[2])}</p>`);
      continue;
    }
    if (list) {
      // continuation of the previous list item
      out[out.length - 1] = out[out.length - 1].replace(/<\/li>$/, `<br>${inline(line)}</li>`);
      continue;
    }
    para.push(line);
  }
  flushPara();
  closeList();
  return `<div class="pf-guide-doc">${out.join("")}</div>`;
}

function renderMessage(message) {
  if (message.role === "meta") {
    return `<div class="pf-msg-divider">${escapeHtml(message.content)}</div>`;
  }
  const kind = message.role === "user" ? "user" : "coach";
  return `
    <div class="pf-msg ${kind}">
      ${message.role === "assistant" ? `<div class="pf-msg-who">Sermon Guide</div>` : ""}
      <div class="pf-bubble">${message.role === "assistant" ? formatGuideHtml(message.content) : escapeHtml(message.content)}</div>
    </div>
  `;
}

function renderSwitcherModal(active) {
  const query = (ui.switcherQuery || "").trim().toLowerCase();
  const sermons = state.sermons.filter((sermon) => {
    if (!query) return true;
    return [sermon.passage, sermon.title, sermon.series, (sermon.tags || []).join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
  return `
    <div class="pf-overlay" data-action="close-switcher" data-overlay>
      <div class="pf-modal" data-stop>
        <div class="pf-modal-head">
          <span class="pf-eyebrow">Sermons</span>
          <h2 class="pf-modal-title">Switch sermon</h2>
        </div>
        <div class="pf-search" style="max-width:none;margin-bottom:10px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input data-action="switcher-query" value="${attr(ui.switcherQuery || "")}" placeholder="Search passage, title, series, or tag" />
        </div>
        <div class="pf-switcher-list" style="max-height:320px;overflow:auto;">
          ${
            sermons.length
              ? sermons
                  .map(
                    (sermon) => `
                      <button class="pf-switcher-item ${sermon.id === active?.id ? "active" : ""}" data-action="select-sermon" data-sermon="${attr(sermon.id)}">
                        <div style="flex:1;min-width:0;">
                          <div class="label">${escapeHtml(sermon.passage || "Untitled sermon")}</div>
                          <div class="meta">${escapeHtml(sermon.title || "Untitled")} · ${escapeHtml(sermon.series || "No series")}</div>
                        </div>
                        <span class="pf-badge ${cardStatus(sermon).key}">${escapeHtml(cardStatus(sermon).label)}</span>
                      </button>
                    `,
                  )
                  .join("")
              : `<p class="pf-modal-text">${state.sermons.length ? "No sermons match that search." : "No sermons yet."}</p>`
          }
        </div>
        <div class="pf-modal-actions">
          <button class="pf-btn pf-btn-primary" data-action="new-sermon">New sermon</button>
          ${active ? `<button class="pf-btn" data-action="open-details">Edit details</button>` : ""}
          <button class="pf-btn pf-btn-ghost" data-action="close-switcher">Close</button>
        </div>
      </div>
    </div>
  `;
}

function renderDetailsModal(active) {
  return `
    <div class="pf-overlay" data-action="close-details" data-overlay>
      <div class="pf-modal wide" data-stop>
        <div class="pf-modal-head">
          <span class="pf-eyebrow">Details</span>
          <h2 class="pf-modal-title">Sermon file</h2>
        </div>
        <form data-form="sermon-details">
          <div class="pf-form-grid">
            <div class="pf-field full">
              <label class="pf-label" for="detail-passage">Passage</label>
              <input id="detail-passage" class="pf-input" name="passage" value="${attr(active.passage)}" required />
            </div>
            <div class="pf-field full">
              <label class="pf-label" for="detail-title">Title</label>
              <input id="detail-title" class="pf-input" name="title" value="${attr(active.title)}" />
            </div>
            <div class="pf-field full">
              <label class="pf-label" for="detail-series">Series</label>
              <input id="detail-series" class="pf-input" name="series" value="${attr(active.series)}" />
            </div>
            <div class="pf-field">
              <label class="pf-label" for="detail-date">Date</label>
              <input id="detail-date" class="pf-input" type="date" name="date" value="${attr(active.date)}" />
            </div>
            <div class="pf-field">
              <label class="pf-label" for="detail-length">Length (min)</label>
              <input id="detail-length" class="pf-input" name="length" inputmode="numeric" value="${attr(active.length)}" />
            </div>
            <div class="pf-field full">
              <label class="pf-label" for="detail-format">Deliverable</label>
              <select id="detail-format" class="pf-select" name="format">
                <option ${active.format === "Full manuscript" ? "selected" : ""}>Full manuscript</option>
                <option ${active.format === "Preaching notes" ? "selected" : ""}>Preaching notes</option>
              </select>
            </div>
            <div class="pf-field full">
              <label class="pf-label" for="detail-tags">Tags (comma-separated)</label>
              <input id="detail-tags" class="pf-input" name="tags" value="${attr((active.tags || []).join(", "))}" placeholder="atonement, repentance, psalms" />
            </div>
            <div class="pf-field full">
              <label class="pf-toggle-row" style="margin-top:2px;">
                <input type="checkbox" name="preached" ${active.preached ? "checked" : ""} />
                <span><strong>Preached</strong> - this sermon has been delivered; show it in the Sermon Library</span>
              </label>
            </div>
          </div>
          <div class="pf-modal-actions">
            <button class="pf-btn pf-btn-primary" type="submit">Save</button>
            <button class="pf-btn pf-btn-danger" type="button" data-action="delete-sermon">Remove sermon</button>
            <button class="pf-btn pf-btn-ghost" type="button" data-action="close-details">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// ---- production slides doc (matches the doc sent to the production team) ----
function generateSlidesDoc(sermon) {
  const bigIdea = worksheetValue(sermon, "aim", "burden").trim();
  const movements = (sermon.outline || []).filter((m) => m.title.trim() || m.sub.trim());
  const pieces = [
    `<p><strong>Title:</strong> ${escapeHtml(sermon.title || "")}</p>`,
    `<p><strong>Passage:</strong> ${escapeHtml(sermon.passage || "")}</p>`,
    `<p><strong>Date:</strong> ${sermon.date ? escapeHtml(fmtDate(sermon.date)) : ""} &nbsp;·&nbsp; <strong>Series:</strong> ${escapeHtml(sermon.series || "")}</p>`,
    `<p><strong>Theme:</strong> </p>`,
    `<p><strong>Big Idea:</strong> ${escapeHtml(bigIdea)}</p>`,
    `<p><strong>Series refrain (on screen):</strong> ""</p>`,
    `<p><strong>Points (all cross-references on the screen read)</strong></p>`,
    `<ol>${
      movements.length
        ? movements
            .map(
              (m) =>
                `<li><strong>${escapeHtml(m.title)}</strong>${m.sub ? ` (${escapeHtml(m.sub)})` : ""}<br>Cross-ref: <br>On screen: ""</li>`,
            )
            .join("")
        : `<li><strong>Point title</strong> (verses)<br>Cross-ref: <br>On screen: ""</li>`
    }</ol>`,
    `<p><strong>Walk-away line (on screen):</strong> ""</p>`,
    `<p><strong>Notes for production:</strong> </p>`,
  ];
  return pieces.join("");
}


// ---- Passage Map workspace ----
// Map the passage before you shape the sermon: the pastor's own marks,
// sections, observations, and flow - the outline emerges from the text.
const PM_CATEGORIES = [
  ["repeated", "Repeated Words", "Words or phrases the author repeats on purpose"],
  ["command", "Commands", "Imperatives - what the text calls people to do"],
  ["promise", "Promises", "What God commits to do"],
  ["warning", "Warnings", "What the text warns against"],
  ["contrast", "Contrasts", "Two ways, two outcomes, but/yet turns"],
  ["cause", "Cause & Effect", "This happens because of that"],
  ["question", "Questions", "Questions the text raises or asks"],
  ["god", "God's Actions", "What God does in the passage"],
  ["human", "Human Response", "What people do or are called to do"],
  ["sin", "Sin / Problem", "The brokenness the text exposes"],
  ["grace", "Gospel / Grace", "Grace, rescue, and gospel notes"],
  ["application", "Application Cues", "Places that press toward life today"],
  ["connector", "Logical Connectors", "therefore, because, so that, but…"],
  ["claim", "Main Claim", "The passage's central assertion"],
  ["support", "Supporting Thought", "Reasons and support for the claim"],
  ["shift", "Transition / Shift", "Where the passage turns"],
];
// Auto-scan skips "and" on purpose - marking every "and" is noise; the
// connector pen can still mark one by hand.
const PM_SCAN_CONNECTORS = ["in order that", "so that", "therefore", "nevertheless", "although", "because", "since", "then", "but", "yet", "for", "if"];
const PM_RELATIONS = ["Cause", "Result", "Contrast", "Purpose", "Explanation", "Condition", "Progression", "Summary"];
const PM_SUMMARY_FIELDS = [
  ["doing", "What is the passage doing?", "Rebuking? Comforting? Arguing? Telling a story that…?"],
  ["movement", "What is the main movement?", "Where does it start, and where does it land?"],
  ["tension", "What problem or tension is present?", ""],
  ["god", "What does the passage reveal about God?", ""],
  ["humanity", "What does the passage reveal about humanity?", ""],
  ["response", "What response does the passage call for?", ""],
  ["movements", "What sermon movements seem to arise naturally?", "Sketch them - they'll feed the outline."],
];
const PM_STOPWORDS = new Set(["the", "and", "that", "for", "his", "her", "with", "they", "them", "shall", "will", "not", "but", "who", "you", "your", "him", "have", "has", "was", "were", "are", "this", "from", "all", "their", "which", "when", "then", "there", "unto", "upon", "into", "our", "out", "she", "did", "does", "been", "what", "who", "whom", "also", "may", "one", "than", "more", "very", "had", "its", "any", "each"]);

function pmActiveMap() {
  return getActive()?.passageMap || null;
}

function pmSave() {
  const active = getActive();
  if (!active) return;
  active.updatedAt = new Date().toISOString();
  saveState();
}

// Only the pastor's category marks survive in stored verse HTML.
function sanitizePmHtml(value) {
  const template = document.createElement("template");
  template.innerHTML = String(value || "");
  for (const node of [...template.content.querySelectorAll("*")]) {
    if (node.tagName !== "MARK") {
      node.replaceWith(...node.childNodes);
      continue;
    }
    const category = [...node.classList].find((token) => token.startsWith("pm-c-"));
    const id = node.getAttribute("data-id") || "";
    const relation = node.getAttribute("data-rel") || "";
    const valid = category && PM_CATEGORIES.some(([key]) => `pm-c-${key}` === category);
    for (const attrNode of [...node.attributes]) node.removeAttribute(attrNode.name);
    if (!valid || !id) {
      node.replaceWith(...node.childNodes);
      continue;
    }
    node.className = `pm-m ${category}`;
    node.setAttribute("data-id", id);
    if (relation) node.setAttribute("data-rel", relation);
  }
  return template.innerHTML;
}

// Read the live passage DOM back into state after a mark operation.
function pmSerializeVerses() {
  const map = pmActiveMap();
  if (!map) return;
  document.querySelectorAll("[data-pm-verse]").forEach((el) => {
    const index = Number(el.dataset.idx);
    if (map.verses[index]) map.verses[index].html = sanitizePmHtml(el.innerHTML);
  });
  // Prune highlight records whose marks no longer exist in the text.
  const html = map.verses.map((verse) => verse.html).join(" ");
  map.highlights = map.highlights.filter((item) => html.includes(`data-id="${item.id}"`));
  if (ui.pm.selected && !map.highlights.some((item) => item.id === ui.pm.selected)) ui.pm.selected = "";
  pmSave();
}

function pmPlainText(map) {
  const template = document.createElement("template");
  return map.verses
    .map((verse) => {
      template.innerHTML = verse.html;
      return template.content.textContent;
    })
    .join(" ");
}

// Split pasted text into verses on leading verse numbers; fall back to one block.
// Put fetched verses into the Passage Map, keeping the pastor's own marks
// out of the way (a fresh passage starts with a clean slate).
function loadPassageIntoMap(verses, reference, translation, attribution) {
  const map = pmActiveMap();
  if (!map || !verses?.length) return false;
  map.verses = verses.map((verse) => ({ ref: verse.verse ? String(verse.verse) : "", html: escapeHtml(verse.text) }));
  map.highlights = [];
  map.hiddenCategories = [];
  map.translation = translation || "";
  map.attribution = attribution || "";
  ui.pm.selected = "";
  pmSave();
  return true;
}

// Opening the Map for a sermon should already show the passage being
// worked on, with no loading step for the pastor to remember.
let pmAutoLoadTried = "";
async function pmAutoLoadPassage(active) {
  const map = active?.passageMap;
  if (!map || map.verses.length) return;
  const reference = (active.passage || "").trim();
  if (!reference || !parseBibleRef(reference)) return;
  const key = `${active.id}:${reference}`;
  if (pmAutoLoadTried === key) return;
  pmAutoLoadTried = key;
  try {
    const params = new URLSearchParams({ reference, translation: readerTranslation() });
    const response = await fetch(`./api/bible?${params.toString()}`);
    const data = await response.json();
    if (data.error || !data.verses?.length) return;
    if (loadPassageIntoMap(data.verses, data.reference, data.translation, data.attribution)) render();
  } catch {
    /* offline or unavailable: the reader and paste both still work */
  }
}

function parsePastedPassage(text) {
  const clean = String(text || "").replace(/\r/g, "").trim();
  if (!clean) return [];
  const matches = [...clean.matchAll(/(?:^|[\s ])[\[\(]?(\d{1,3})[\]\)\.]?(?=[\s ]+\S)/g)];
  if (matches.length >= 2) {
    const verses = [];
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index + matches[i][0].length;
      const end = i + 1 < matches.length ? matches[i + 1].index : clean.length;
      const body = clean.slice(start, end).replace(/\s+/g, " ").trim();
      if (body) verses.push({ ref: matches[i][1], html: escapeHtml(body) });
    }
    if (verses.length >= 2) return verses;
  }
  return clean
    .split(/\n{2,}/)
    .map((block) => block.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map((block) => ({ ref: "", html: escapeHtml(block) }));
}

// Public-domain fetch, verse by verse (same provider as Insert Scripture).
async function pmFetchPassage() {
  const active = getActive();
  const parsed = parseBibleRef(active?.passage || "");
  if (!parsed) {
    showBanner("That reference didn't parse - open the reader and type the passage.");
    return;
  }
  showBanner("Loading the passage…");
  try {
    const params = new URLSearchParams({ reference: parsed.reference, translation: readerTranslation() });
    const response = await fetch(`./api/bible?${params.toString()}`);
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!data.verses?.length) throw new Error("No verses came back");
    loadPassageIntoMap(data.verses, data.reference, data.translation, data.attribution);
    showBanner("Passage loaded - pick a pen and start marking.");
  } catch (error) {
    showBanner(error.message || "Could not load that passage.");
  }
  render();
}

// Wrap whole-word matches in unmarked text with a category mark.
function pmMarkWord(word, category) {
  const map = pmActiveMap();
  if (!map) return 0;
  const safe = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${safe}\\b`, "gi");
  let count = 0;
  document.querySelectorAll("[data-pm-verse]").forEach((verseEl) => {
    const ref = verseEl.closest(".pm-verse")?.dataset.ref || "";
    const walker = document.createTreeWalker(verseEl, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      if (!walker.currentNode.parentElement.closest(".pm-m")) nodes.push(walker.currentNode);
    }
    for (const node of nodes) {
      const text = node.textContent;
      const found = [...text.matchAll(regex)];
      if (!found.length) continue;
      const fragment = document.createDocumentFragment();
      let cursor = 0;
      for (const match of found) {
        if (match.index > cursor) fragment.appendChild(document.createTextNode(text.slice(cursor, match.index)));
        const id = genId();
        const mark = document.createElement("mark");
        mark.className = `pm-m pm-c-${category}`;
        mark.setAttribute("data-id", id);
        mark.textContent = match[0];
        fragment.appendChild(mark);
        map.highlights.push({ id, category, text: match[0], verseRef: ref, note: "", relation: "" });
        count += 1;
        cursor = match.index + match[0].length;
      }
      if (cursor < text.length) fragment.appendChild(document.createTextNode(text.slice(cursor)));
      node.replaceWith(fragment);
    }
  });
  if (count) pmSerializeVerses();
  return count;
}

function pmRepeatedWords(map) {
  const counts = {};
  pmPlainText(map)
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !PM_STOPWORDS.has(word))
    .forEach((word) => {
      counts[word] = (counts[word] || 0) + 1;
    });
  return Object.entries(counts)
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);
}

function pmRemoveHighlight(id) {
  const map = pmActiveMap();
  if (!map) return;
  document.querySelectorAll(`.pm-m[data-id="${CSS.escape(id)}"]`).forEach((mark) => mark.replaceWith(...mark.childNodes));
  map.highlights = map.highlights.filter((item) => item.id !== id);
  if (ui.pm.selected === id) ui.pm.selected = "";
  pmSerializeVerses();
}

// A plain-language walkthrough of what the map is for and how to work it.
function renderPmHowTo(open) {
  return `
    <details class="pm-howto" ${open ? "open" : ""}>
      <summary>How to use the Passage Map - exact steps</summary>
      <div class="pm-howto-body">
        <p>You study the shape of the passage first, and the outline comes out of what you find. Nothing here is automated. Every mark is yours. Here is exactly how it works:</p>
        <ol>
          <li><strong>Load the passage.</strong> Use the Load button to fetch it verse by verse, or paste your preferred translation.</li>
          <li><strong>Mark the text with the Marker tool.</strong> Click a pen on the right (say, Repeated Words). Then press and hold at the first word in the passage, drag across the words you want, and let go - the highlight appears the moment you release. Single-click any highlight to open it on the right, where you can note it or remove it; a small ✕ also appears on the word itself for quick removal.</li>
          <li><strong>Use the quick scans.</strong> One click marks every logical connector (therefore, because, but); the repeated-words list marks every occurrence of a word with one click. Then click each connector once and label what it joins.</li>
          <li><strong>Divide into sections with the Sections tool.</strong> Open Sections and a <strong>⊕</strong> appears at the start of every verse. Click the ⊕ where the passage turns - a numbered marker (§1, §2...) appears in the text. Click any marker to open that section's box on the right and give it a title and a job (rebuking, comforting, arguing, resolving). Each section runs until the next marker.</li>
          <li><strong>Answer the Summary questions.</strong> Seven questions turn what you saw into words: what the passage is doing, what it reveals, and what response it calls for.</li>
          <li><strong>Send your sections to the Outline Lab.</strong> One button - your sections become the sermon's points, shaped by where the text itself turns.</li>
        </ol>
      </div>
    </details>
  `;
}

// Ring the currently selected mark in the passage text.
function pmDecorateSelected(html) {
  if (!ui.pm.selected) return html;
  return html.split(`data-id="${ui.pm.selected}"`).join(`data-id="${ui.pm.selected}" data-sel="1"`);
}

// A small floating x that appears on the clicked mark for one-tap removal.
let pmChipEl = null;
function pmHideRemoveChip() {
  if (pmChipEl) pmChipEl.style.display = "none";
}
function pmShowRemoveChip() {
  const mark = document.querySelector('.pm-m[data-sel]');
  if (!mark) return;
  if (!pmChipEl) {
    pmChipEl = document.createElement("button");
    pmChipEl.id = "pf-pm-chip";
    pmChipEl.type = "button";
    pmChipEl.textContent = "\u2715";
    pmChipEl.title = "Remove this mark";
    pmChipEl.setAttribute("aria-label", "Remove this mark");
    pmChipEl.addEventListener("click", (event) => {
      event.stopPropagation();
      const id = pmChipEl.dataset.id;
      pmHideRemoveChip();
      if (id) {
        pmRemoveHighlight(id);
        render();
      }
    });
    document.body.appendChild(pmChipEl);
  }
  const rect = mark.getBoundingClientRect();
  pmChipEl.dataset.id = mark.getAttribute("data-id") || "";
  pmChipEl.style.display = "flex";
  pmChipEl.style.left = `${Math.min(window.innerWidth - 26, Math.max(4, rect.right - 9))}px`;
  pmChipEl.style.top = `${Math.max(4, rect.top - 19)}px`;
}

// Sections sorted by where they start in the text; ranges recomputed so
// each section runs until the next marker.
function pmVerseIndexOf(map, ref) {
  return map.verses.findIndex((verse) => verse.ref === ref);
}

function pmOrderedSections(map) {
  return [...map.sections].sort((a, b) => {
    const ai = a.startRef ? pmVerseIndexOf(map, a.startRef) : Number.MAX_SAFE_INTEGER;
    const bi = b.startRef ? pmVerseIndexOf(map, b.startRef) : Number.MAX_SAFE_INTEGER;
    return ai - bi;
  });
}

function pmRecomputeSectionRanges(map) {
  const ordered = pmOrderedSections(map).filter((section) => section.startRef);
  ordered.forEach((section, index) => {
    const startIdx = pmVerseIndexOf(map, section.startRef);
    if (startIdx === -1) return;
    const next = ordered[index + 1];
    const endIdx = next ? pmVerseIndexOf(map, next.startRef) - 1 : map.verses.length - 1;
    const startRef = map.verses[startIdx]?.ref || "";
    const endRef = map.verses[Math.max(startIdx, endIdx)]?.ref || "";
    section.verseRange = startRef === endRef ? `v. ${startRef}` : `vv. ${startRef}-${endRef}`;
  });
}

function renderPassageMap(active) {
  if (!active) return renderNeedSermon("The Passage Map works on your current sermon - start one first.");
  const map = active.passageMap;
  // The sermon's own passage should already be here, ready to mark.
  if (!map.verses.length) pmAutoLoadPassage(active);
  if (!map.verses.length) return renderPassageMapSetup(active);
  const hiddenClasses = map.hiddenCategories.map((key) => `hide-${key}`).join(" ");
  const pen = PM_CATEGORIES.find(([key]) => key === ui.pm.pen);
  return `
    <div class="pf-page pf-page-wide pf-fade">
      <div class="pf-page-head" style="display:block;margin-bottom:14px;">
        <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">Passage Map</span>
        <h1 class="pf-h1">Map the passage before you shape the sermon</h1>
        <p class="pf-page-sub">Mark repeated words, commands, contrasts, movements, and logical connections - so your sermon outline emerges from the structure of the text.</p>
      </div>
      ${renderPmHowTo(false)}
      <div class="pm-grid">
        <section class="pm-passage-col">
          <div class="pm-penbar" aria-live="polite">
            ${
              pen
                ? `Marking as <strong class="pm-pen-chip pm-c-${attr(pen[0])}">${escapeHtml(pen[1])}</strong> - select text in the passage. <button class="pf-inline-link" data-action="pm-pen" data-cat="">Done marking</button>`
                : `Pick a pen on the right, then select words or phrases to mark. Click any mark to note or remove it.`
            }
          </div>
          <div class="pm-passage ${hiddenClasses} ${ui.pm.tool === "sections" ? "pm-sections-mode" : ""}" data-pm-passage>
            ${map.verses
              .map((verse, index) => {
                const section = verse.ref ? map.sections.find((item) => item.startRef === verse.ref) : null;
                const sectionNumber = section ? pmOrderedSections(map).findIndex((item) => item.id === section.id) + 1 : 0;
                return `
                  ${
                    section
                      ? `<button class="pm-sec-pill ${ui.pm.selectedSection === section.id ? "active" : ""}" data-action="pm-section-open" data-id="${attr(section.id)}" title="Open this section">§${sectionNumber}${section.title ? ` ${escapeHtml(section.title)}` : ""}</button>`
                      : ""
                  }
                  <p class="pm-verse" data-ref="${attr(verse.ref)}">
                    ${
                      ui.pm.tool === "sections" && verse.ref && !section
                        ? `<button class="pm-sec-add" data-action="pm-section-here" data-ref="${attr(verse.ref)}" title="Start a section at verse ${attr(verse.ref)}">⊕</button>`
                        : ""
                    }
                    ${verse.ref ? `<sup class="pm-vnum">${escapeHtml(verse.ref)}</sup>` : ""}
                    <span class="pm-text" data-pm-verse data-idx="${index}">${pmDecorateSelected(sanitizePmHtml(verse.html))}</span>
                  </p>
                `;
              })
              .join("")}
          </div>
          <p class="pf-helper" style="margin-top:10px;">
            ${map.attribution ? `${escapeHtml(map.attribution)} · ` : map.translation ? `${escapeHtml(map.translation)} · ` : ""}
            <button class="pf-inline-link" data-action="reader-open" data-target="pm" data-reference="${attr(active.passage || "")}">Open the Bible reader</button>
            · <button class="pf-inline-link" data-action="pm-paste-open">Replace passage text</button>
            · <label style="cursor:pointer;"><input type="checkbox" data-action="pm-include-exports" ${map.includeInExports ? "checked" : ""} style="vertical-align:-2px;" /> Include this map in sermon exports</label>
          </p>
        </section>
        <aside class="pm-tools">
          <div class="pf-subtabs" style="margin-bottom:14px;">
            ${[["mark", "Marker"], ["sections", "Sections"], ["summary", "Summary"]]
              .map(([key, label]) => `<button class="pf-chip ${ui.pm.tool === key ? "active" : ""}" data-action="pm-tool" data-tool="${key}">${label}</button>`)
              .join("")}
          </div>
          ${ui.pm.tool === "mark" ? renderPmMarkPanel(map) : ""}
          ${ui.pm.tool === "sections" ? renderPmSectionsPanel(active, map) : ""}
          ${ui.pm.tool === "summary" ? renderPmSummaryPanel(map) : ""}
        </aside>
      </div>
      ${ui.pm.paste ? renderPmPasteModal() : ""}
      ${ui.pm.bridge ? renderPmBridgeModal(active, map) : ""}
    </div>
  `;
}

function renderPassageMapSetup(active) {
  const canFetch = Boolean(parseBibleRef(active.passage || ""));
  return `
    <div class="pf-page pf-page-read pf-fade">
      <div class="pf-page-head" style="display:block;margin-bottom:20px;">
        <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">Passage Map</span>
        <h1 class="pf-h1">Map the passage before you shape the sermon</h1>
        <p class="pf-page-sub">Load <strong>${escapeHtml(active.passage || "your passage")}</strong> verse by verse, then mark repeated words, commands, contrasts, and connections - the outline will come from what you see.</p>
      </div>
      ${renderPmHowTo(true)}
      <section class="pf-card-box pf-checklist-card">
        <div class="pf-modal-actions" style="margin-top:0;">
          ${canFetch ? `<button class="pf-btn pf-btn-primary" data-action="pm-fetch">Load ${escapeHtml(active.passage)}</button>` : ""}
          <button class="pf-btn" data-action="reader-open" data-target="pm" data-reference="${attr(active.passage || "")}">Open the Bible reader</button>
          <button class="pf-btn pf-btn-ghost" data-action="pm-paste-open">Paste it instead</button>
        </div>
      </section>
      ${ui.pm.paste ? renderPmPasteModal() : ""}
    </div>
  `;
}

function renderPmPasteModal() {
  return `
    <div class="pf-overlay" data-action="pm-paste-close" data-overlay>
      <div class="pf-modal" data-stop style="max-width:560px;">
        <div class="pf-modal-head"><span class="pf-eyebrow pf-eyebrow-brand">Paste Passage Text</span></div>
        <div class="pf-ws-field">
          <label class="pf-label">Passage (verse numbers are detected automatically)</label>
          <textarea class="pf-ws-input" rows="9" data-action="pm-paste-text" placeholder="1 Blessed is the man who walks not in the counsel of the wicked… 2 but his delight is in the law of the LORD…">${escapeHtml(ui.pm.pasteText)}</textarea>
        </div>
        <div class="pf-form-grid">
          <div class="pf-field" style="margin-bottom:0;">
            <label class="pf-label">Translation label</label>
            <input class="pf-input" data-action="pm-paste-translation" value="${attr(ui.pm.pasteTranslation)}" placeholder="ESV, CSB, NIV…" />
          </div>
        </div>
        <p class="pf-helper" style="margin-top:8px;">Paste only from a translation you have the right to use. The translation label is kept as attribution.</p>
        <div class="pf-modal-actions">
          <button class="pf-btn" data-action="pm-paste-close">Cancel</button>
          <button class="pf-btn pf-btn-primary" data-action="pm-paste-apply">Load passage</button>
        </div>
      </div>
    </div>
  `;
}

function renderPmMarkPanel(map) {
  const selected = map.highlights.find((item) => item.id === ui.pm.selected);
  const repeated = pmRepeatedWords(map);
  const counts = {};
  map.highlights.forEach((item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
  });
  return `
    ${
      selected
        ? `
      <section class="pf-card-box pf-checklist-card pm-selected">
        <div class="pf-checklist-head" style="align-items:center;">
          <span class="pf-eyebrow">Selected mark</span>
          <button class="pf-btn pf-btn-ghost pf-lib-delete" data-action="pm-remove-mark" data-id="${attr(selected.id)}" style="padding:5px 12px;">Remove</button>
        </div>
        <p class="pm-selected-text"><i class="pm-dot pm-c-${attr(selected.category)}"></i>“${escapeHtml(selected.text)}”${selected.verseRef ? ` · v.${escapeHtml(selected.verseRef)}` : ""}</p>
        ${
          selected.category === "connector"
            ? `
          <label class="pf-label" style="display:block;margin:8px 0 4px;">Relationship</label>
          <select class="pf-select" data-action="pm-relation" data-id="${attr(selected.id)}">
            <option value="">Label the relationship…</option>
            ${PM_RELATIONS.map((relation) => `<option ${selected.relation === relation ? "selected" : ""}>${relation}</option>`).join("")}
          </select>`
            : ""
        }
        <div class="pf-ws-field" style="margin-top:8px;">
          <label class="pf-label">Note on this mark</label>
          <textarea class="pf-ws-input" rows="2" data-action="pm-mark-note" data-id="${attr(selected.id)}" placeholder="Why does this matter in the passage?">${escapeHtml(selected.note)}</textarea>
        </div>
      </section>`
        : ""
    }
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head"><span class="pf-eyebrow">Pens</span><span class="pf-checklist-count">${map.highlights.length} mark${map.highlights.length === 1 ? "" : "s"}</span></div>
      <div class="pm-pens">
        ${PM_CATEGORIES.map(
          ([key, label, desc]) => `
            <span class="pm-pen-row">
              <button class="pm-pen ${ui.pm.pen === key ? "active" : ""}" data-action="pm-pen" data-cat="${key}" title="${attr(desc)}">
                <i class="pm-dot pm-c-${key}"></i>${escapeHtml(label)}${counts[key] ? ` <em>${counts[key]}</em>` : ""}
              </button>
              <button class="pm-eye ${map.hiddenCategories.includes(key) ? "off" : ""}" data-action="pm-cat-vis" data-cat="${key}" title="${map.hiddenCategories.includes(key) ? "Show" : "Hide"} ${attr(label)} marks" aria-label="Toggle ${attr(label)} visibility">${map.hiddenCategories.includes(key) ? "◌" : "●"}</button>
            </span>
          `,
        ).join("")}
      </div>
    </section>
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head"><span class="pf-eyebrow">Quick scans (no AI - just the text)</span></div>
      <button class="pf-btn pf-btn-ghost" data-action="pm-scan-connectors" style="margin-bottom:10px;">Mark logical connectors</button>
      ${
        repeated.length
          ? `<p class="pf-helper" style="margin-bottom:6px;">Words used 3+ times:</p>
             <div class="pm-repeat-list">${repeated
               .map(([word, count]) => `<button class="pf-chip" data-action="pm-mark-word" data-word="${attr(word)}" title="Mark every occurrence">${escapeHtml(word)} ×${count}</button>`)
               .join("")}</div>`
          : `<p class="pf-helper">No word appears 3+ times yet (common words are ignored).</p>`
      }
    </section>
  `;
}

function renderPmSectionsPanel(active, map) {
  const ordered = pmOrderedSections(map);
  const selected = map.sections.find((section) => section.id === ui.pm.selectedSection);
  const selectedNumber = selected ? ordered.findIndex((section) => section.id === selected.id) + 1 : 0;
  return `
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head">
        <span class="pf-eyebrow">Sections</span>
        <span class="pf-checklist-count">${map.sections.length}</span>
      </div>
      <p class="pf-section-hint">Divide the passage where IT turns. Click the <strong>⊕</strong> at the start of a verse in the text to begin a section there; a numbered marker appears. Click any marker to name that section - it runs until the next marker.</p>
      ${
        ordered.length && !selected
          ? `<p class="pf-helper" style="margin-bottom:10px;">${ordered
              .map((section, index) => `<button class="pf-chip" data-action="pm-section-open" data-id="${attr(section.id)}">§${index + 1} ${escapeHtml(section.title || section.verseRange || "untitled")}</button>`)
              .join(" ")}</p>`
          : ""
      }
      ${
        selected
          ? `
        <div class="pm-section">
          <div class="pf-checklist-head" style="align-items:center;">
            <span class="pf-eyebrow">Section ${selectedNumber}${selected.verseRange ? ` · ${escapeHtml(selected.verseRange)}` : ""}</span>
            <span style="display:inline-flex;gap:6px;">
              <button class="pf-outline-btn" data-action="pm-section-remove-id" data-id="${attr(selected.id)}" title="Remove this section">✕</button>
              <button class="pf-outline-btn" data-action="pm-section-close" title="Close">−</button>
            </span>
          </div>
          <input class="pf-input" data-action="pm-section-field" data-note-key="pmsec-t" data-id="${attr(selected.id)}" data-field="title" value="${attr(selected.title)}" placeholder="Section title" />
          <input class="pf-input" style="margin-top:6px;" data-action="pm-section-field" data-note-key="pmsec-m" data-id="${attr(selected.id)}" data-field="mainIdea" value="${attr(selected.mainIdea)}" placeholder="Main idea of this section" />
          <textarea class="pf-ws-input" style="margin-top:6px;" rows="2" data-action="pm-section-field" data-note-key="pmsec-f" data-id="${attr(selected.id)}" data-field="functionInPassage" placeholder="What is this section doing? (rebuking, comforting, arguing, resolving...)">${escapeHtml(selected.functionInPassage)}</textarea>
        </div>`
          : ""
      }
      ${
        map.sections.length
          ? `<div class="pf-modal-actions" style="margin-top:12px;">
              <button class="pf-btn pf-btn-primary" data-action="pm-outline-bridge">Send to Outline Lab</button>
            </div>`
          : `<p class="pf-helper">No sections yet. Click a ⊕ in the text to start the first one.</p>`
      }
    </section>
  `;
}

function renderPmSummaryPanel(map) {
  return `
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head"><span class="pf-eyebrow">Passage flow summary</span></div>
      ${PM_SUMMARY_FIELDS.map(
        ([key, label, hint]) => `
          <div class="pf-ws-field">
            <label class="pf-label">${escapeHtml(label)}</label>
            <textarea class="pf-ws-input" rows="2" data-action="pm-summary-field" data-key="${key}" placeholder="${attr(hint)}">${escapeHtml(map.summary[key])}</textarea>
          </div>
        `,
      ).join("")}
    </section>
  `;
}

// Sections (or flow steps, if no sections) become outline movements.
function pmOutlineMovements(map) {
  const fromSections = pmOrderedSections(map)
    .filter((section) => section.title.trim() || section.mainIdea.trim())
    .map((section) => ({
      title: section.title.trim() || section.mainIdea.trim(),
      sub: [section.verseRange.trim(), section.title.trim() ? section.mainIdea.trim() : ""].filter(Boolean).join(" · "),
    }));
  return fromSections;
}

function renderPmBridgeModal(active, map) {
  const movements = pmOutlineMovements(map);
  const existing = active.outline.filter((movement) => movement.title.trim() || movement.sub.trim()).length;
  return `
    <div class="pf-overlay" data-action="pm-bridge-cancel" data-overlay>
      <div class="pf-modal" data-stop style="max-width:520px;">
        <div class="pf-modal-head"><span class="pf-eyebrow pf-eyebrow-brand">Send to Outline Lab</span></div>
        <p class="pf-ministry-desc" style="margin-top:0;">These movements come from your section divisions - the outline starts where the text turns, and it stays yours to reshape.</p>
        <ol class="pm-bridge-list">
          ${movements.map((movement) => `<li><strong>${escapeHtml(movement.title)}</strong>${movement.sub ? ` <span class="pf-helper">${escapeHtml(movement.sub)}</span>` : ""}</li>`).join("")}
        </ol>
        ${existing ? `<p class="pf-helper">Your Outline Lab already has ${existing} movement${existing === 1 ? "" : "s"}. Add these after them, or replace the outline.</p>` : ""}
        <div class="pf-modal-actions">
          <button class="pf-btn" data-action="pm-bridge-cancel">Cancel</button>
          ${existing ? `<button class="pf-btn" data-action="pm-bridge-add">Add to existing outline</button>` : ""}
          <button class="pf-btn pf-btn-primary" data-action="pm-bridge-replace">${existing ? "Replace outline" : "Start the outline with these"}</button>
        </div>
      </div>
    </div>
  `;
}

// The phase launch card: progress at a glance, one door into the workspace.
function renderPassageMapLaunchCard(active) {
  const map = active.passageMap;
  const summaryDone = PM_SUMMARY_KEYS.filter((key) => map.summary[key].trim()).length;
  const stats = [
    [map.verses.length, map.verses.length === 1 ? "verse loaded" : "verses loaded"],
    [map.highlights.length, map.highlights.length === 1 ? "mark on the text" : "marks on the text"],
    [map.sections.length, map.sections.length === 1 ? "section" : "sections"],
    [summaryDone, `of ${PM_SUMMARY_KEYS.length} summary answers`],
  ];
  return `
    <section class="pf-card-box pf-checklist-card pm-launch">
      <div class="pf-checklist-head"><span class="pf-eyebrow">Your map so far</span></div>
      <div class="pm-launch-stats">
        ${stats.map(([count, label]) => `<div class="pm-launch-stat"><strong>${count}</strong><span>${escapeHtml(label)}</span></div>`).join("")}
      </div>
      <p class="pf-section-hint" style="margin-bottom:0;">
        ${
          map.verses.length
            ? "The map is a full-screen workspace - the passage on one side, your pens, sections, notes, flow, and summary on the other."
            : `Load ${escapeHtml(active.passage || "your passage")} verse by verse, then mark what the text itself is doing - before any outline exists.`
        }
      </p>
      <div class="pf-modal-actions" style="margin-top:12px;">
        <button class="pf-btn pf-btn-primary" data-view="map">${map.verses.length ? "Open the Passage Map" : "Start mapping the passage"}</button>
        ${map.sections.length ? `<button class="pf-btn pf-btn-ghost" data-action="pm-outline-bridge-from-phase">Send sections to Outline Lab</button>` : ""}
      </div>
    </section>
  `;
}

// Wrap the current text selection in the active pen's mark. Selections must
// stay inside a single verse and outside existing marks.
function pmApplySelection() {
  const map = pmActiveMap();
  if (!map || !ui.pm.pen) return;
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || !selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const container =
    range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentElement;
  if (!container) return;
  const verseEl = container.closest("[data-pm-verse]");
  if (!verseEl) {
    if (container.closest("[data-pm-passage]")) showBanner("Select within a single verse - marks don't cross verse lines.");
    return;
  }
  const text = range.toString().replace(/\s+/g, " ").trim();
  if (!text) return;
  if (container.closest(".pm-m")) {
    showBanner("That text is already marked - click the mark to note or remove it.");
    selection.removeAllRanges();
    return;
  }
  const id = genId();
  const mark = document.createElement("mark");
  mark.className = `pm-m pm-c-${ui.pm.pen}`;
  mark.setAttribute("data-id", id);
  try {
    range.surroundContents(mark);
  } catch {
    // The selection crosses an existing mark boundary: flatten what it
    // covers into one new mark (the serializer prunes the absorbed ones).
    const contents = range.extractContents();
    contents.querySelectorAll(".pm-m").forEach((el) => el.replaceWith(...el.childNodes));
    mark.appendChild(contents);
    range.insertNode(mark);
  }
  const ref = verseEl.closest(".pm-verse")?.dataset.ref || "";
  map.highlights.push({ id, category: ui.pm.pen, text, verseRef: ref, note: "", relation: "" });
  selection.removeAllRanges();
  ui.pm.selected = id;
  pmSerializeVerses();
  render();
}

function renderSlidesModal(active) {
  const html = active.slidesDoc && active.slidesDoc.trim() ? active.slidesDoc : generateSlidesDoc(active);
  return `
    <div class="pf-overlay" data-action="close-slides" data-overlay>
      <div class="pf-modal wide" data-stop>
        <div class="pf-modal-head">
          <span class="pf-eyebrow">Production</span>
          <h2 class="pf-modal-title">Slides doc for the production team</h2>
        </div>
        <p class="pf-modal-text">Pre-filled from this sermon - edit anything, then export and send. Quotes in the "On screen" lines are what the congregation reads.</p>
        <div class="pf-editor pf-scroll" contenteditable="true" spellcheck="false" data-action="slides-editor" style="min-height:260px;max-height:380px;font-size:14.5px;line-height:1.6;border:1px solid var(--border-default);border-radius:12px;background:var(--surface-page);">${sanitizeRichHtml(html)}</div>
        <div class="pf-modal-actions">
          <button class="pf-btn pf-btn-primary" data-action="slides-export-pdf">Download PDF</button>
          <button class="pf-btn" data-action="slides-export-doc">Download Word</button>
          <button class="pf-btn" data-action="slides-refresh" title="Rebuild from the sermon's current worksheets and outline">Refresh from sermon</button>
          <button class="pf-btn pf-btn-ghost" data-action="close-slides">Close</button>
        </div>
      </div>
    </div>
  `;
}

// ---- import an existing sermon (.docx/.txt/.md/.pdf) ----
function renderImportModal() {
  return `
    <div class="pf-overlay" data-action="close-import" data-overlay>
      <div class="pf-modal wide" data-stop>
        <div class="pf-modal-head">
          <span class="pf-eyebrow">Import</span>
          <h2 class="pf-modal-title">Bring in an existing sermon</h2>
        </div>
        <form data-form="import-sermon">
          <div class="pf-field">
            <label class="pf-label" for="import-file">Sermon file (.docx, .pdf, .txt, .md)</label>
            <input id="import-file" class="pf-input" type="file" data-action="import-file" accept=".docx,.txt,.md,.markdown,.pdf" />
            ${ui.importStatusNote ? `<p class="pf-helper">${escapeHtml(ui.importStatusNote)}</p>` : ""}
          </div>
          <div class="pf-form-grid">
            <div class="pf-field">
              <label class="pf-label" for="import-passage">Passage</label>
              <input id="import-passage" class="pf-input" name="passage" placeholder="Psalm 32" required />
            </div>
            <div class="pf-field">
              <label class="pf-label" for="import-title">Title</label>
              <input id="import-title" class="pf-input" name="title" placeholder="The Blessings of Coming Clean" />
            </div>
            <div class="pf-field">
              <label class="pf-label" for="import-series">Series</label>
              <input id="import-series" class="pf-input" name="series" />
            </div>
            <div class="pf-field">
              <label class="pf-label" for="import-date">Preaching date</label>
              <input id="import-date" class="pf-input" type="date" name="date" />
            </div>
          </div>
          <div class="pf-field">
            <label class="pf-label">Where does it land?</label>
            <label class="pf-toggle-row" style="margin-top:6px;"><input type="radio" name="importStatus" value="progress" checked /> <span>In progress - drops into the pipeline at the Manuscript phase</span></label>
            <label class="pf-toggle-row"><input type="radio" name="importStatus" value="preached" /> <span>Already preached - filed as a completed sermon</span></label>
          </div>
          <div class="pf-modal-actions">
            <button class="pf-btn pf-btn-primary" type="submit" ${ui.importText ? "" : "disabled"}>Import sermon</button>
            <button class="pf-btn pf-btn-ghost" type="button" data-action="close-import">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function loadScriptOnce(src, marker) {
  if (window[marker]) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.addEventListener("load", () => resolve(true), { once: true });
    script.addEventListener("error", () => resolve(false), { once: true });
    document.head.append(script);
  });
}

async function extractPdfFileText(file) {
  const CDN = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/legacy/build/pdf.min.js";
  const loaded = await loadScriptOnce(CDN, "pdfjsLib");
  const pdfjsLib = window.pdfjsLib || window["pdfjs-dist/build/pdf"];
  if (!loaded || !pdfjsLib) throw new Error("Could not load the PDF reader.");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/legacy/build/pdf.worker.min.js";
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(" "));
  }
  return pages.join("\n\n");
}

async function extractSermonFileContent(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".docx")) {
    const response = await fetch("./api/extract-docx", {
      method: "POST",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: await file.arrayBuffer(),
    });
    const data = await response.json();
    if (!data.text) throw new Error(data.error || "No text found in that document.");
    return { text: data.text, html: data.html ? importedHtmlToRich(data.html) : "" };
  }
  if (name.endsWith(".pdf")) return { text: await extractPdfFileText(file), html: "" };
  if (name.endsWith(".md") || name.endsWith(".markdown")) {
    const raw = await file.text();
    return { text: raw, html: markdownToRich(raw) };
  }
  return { text: await file.text(), html: "" };
}

async function handleImportFile(input) {
  const file = input.files?.[0];
  if (!file) return;
  ui.importText = "";
  ui.importHtml = "";
  ui.importStatusNote = "Reading file…";
  render();
  try {
    const content = await extractSermonFileContent(file);
    ui.importText = content.text;
    ui.importHtml = content.html;
    const words = ui.importText.trim().split(/\s+/).filter(Boolean).length;
    ui.importStatusNote = `Ready - ${words.toLocaleString()} words extracted from ${file.name}.`;
  } catch (error) {
    ui.importText = "";
    ui.importStatusNote = error.message || "Could not read that file.";
  }
  render();
}

// Guess passage, title, and date from a sermon file's name, so bulk imports
// arrive mostly pre-filled. "2023-06-11 Psalm 32 - Coming Clean.docx" fills
// all three; anything unrecognized just lands in the title.
function guessImportMeta(fileName) {
  let base = fileName.replace(/\.[a-z0-9]+$/i, "").replace(/_+/g, " ").replace(/\s+/g, " ").trim();
  let date = "";
  const dateMatch = base.match(/(\d{4})[-. ](\d{1,2})[-. ](\d{1,2})/);
  if (dateMatch && Number(dateMatch[2]) >= 1 && Number(dateMatch[2]) <= 12 && Number(dateMatch[3]) >= 1 && Number(dateMatch[3]) <= 31) {
    date = `${dateMatch[1]}-${dateMatch[2].padStart(2, "0")}-${dateMatch[3].padStart(2, "0")}`;
    base = base.replace(dateMatch[0], " ").replace(/\s+/g, " ").trim();
  }
  let passage = "";
  const segments = base.split(/\s*[-|·]\s*/).map((segment) => segment.trim()).filter(Boolean);
  for (const segment of segments) {
    const parsed = parseBibleRef(segment);
    if (parsed) {
      passage = parsed.reference;
      break;
    }
  }
  if (!passage) {
    const inline = base.match(/((?:[1-3]\s)?[A-Z][a-z]+(?:\s[A-Za-z]+)?)\s\d{1,3}(?::\d{1,3}(?:\s*-\s*\d{1,3})?)?/);
    if (inline && parseBibleRef(inline[0])) passage = parseBibleRef(inline[0]).reference;
  }
  // Working-file noise ("sermon-final-v3", "message draft 2") is not a
  // title; dropping it lets the document's first page supply the real one.
  const junk = /^(sermon|final|draft|copy|notes?|manuscript|message|msg|doc|document|version|rev|edit(ed)?|v?\d+)$/i;
  const title = segments
    .filter((segment) => !parseBibleRef(segment))
    .filter((segment) => !segment.split(/\s+/).every((word) => junk.test(word)))
    .join(" - ")
    .trim();
  return { passage, title, date };
}

// When the file name gives nothing, the document itself usually does: the
// first lines carry the title, and the passage appears near the top.
function guessMetaFromText(text) {
  const head = String(text || "").slice(0, 800);
  const lines = head.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  let passage = "";
  let title = "";
  for (const line of lines.slice(0, 6)) {
    const clean = line.replace(/^#+\s*/, "").replace(/[""\u201c\u201d]/g, "").trim();
    const parsed = parseBibleRef(clean);
    if (!passage && parsed) {
      passage = parsed.reference;
      continue;
    }
    if (!title && clean.length >= 4 && clean.length <= 90 && !/^page\s\d/i.test(clean)) title = clean;
  }
  if (!passage) {
    for (const match of head.matchAll(/((?:[1-3]\s?)?[A-Z][a-z]+(?:\s[A-Za-z]+)?\s\d{1,3}(?::\d{1,3}(?:\s*-\s*\d{1,3})?)?)/g)) {
      const parsed = parseBibleRef(match[1]);
      if (parsed) {
        passage = parsed.reference;
        break;
      }
    }
  }
  return { passage, title };
}

function fillGuessFromContent(item) {
  if (item.passage && item.title) return;
  const guessed = guessMetaFromText(item.text);
  if (!item.passage && guessed.passage) item.passage = guessed.passage;
  if (!item.title && guessed.title) item.title = guessed.title;
}

// ---- Preaching Calendar import ----
// A calendar doc only carries sermon identity (date, passage, title,
// series). Parse it, let the preacher correct anything, then load the
// pipeline so every upcoming sermon is already waiting with its date.

const CAL_MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

function parseCalDate(input) {
  const text = String(input || "").trim();
  if (!text) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const valid = (y, m, d) => m >= 1 && m <= 12 && d >= 1 && d <= 31 ? `${y}-${pad(m)}-${pad(d)}` : "";
  let match = text.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) return valid(Number(match[1]), Number(match[2]), Number(match[3]));
  match = text.match(/(\d{1,2})[\/.](\d{1,2})[\/.](\d{2,4})/);
  if (match) {
    let year = Number(match[3]);
    if (year < 100) year += 2000;
    return valid(year, Number(match[1]), Number(match[2]));
  }
  // "June 7, 2026" / "Jun 7" / "7 June 2026"
  const monthPattern = "(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?";
  match = text.match(new RegExp(`${monthPattern}\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s*(\\d{4}))?`, "i"))
    || text.match(new RegExp(`(?:^|\\s)(\\d{1,2})(?:st|nd|rd|th)?\\s+${monthPattern}(?:,?\\s*(\\d{4}))?`, "i"));
  if (match) {
    const monthToken = (match[1].length <= 2 ? match[2] : match[1]).toLowerCase();
    const day = Number(match[1].length <= 2 ? match[1] : match[2]);
    const month = CAL_MONTHS.findIndex((name) => name.startsWith(monthToken.slice(0, 3))) + 1;
    let year = Number(match[3]) || 0;
    if (!year) {
      // No year on the calendar row: assume the next time that date occurs.
      const today = new Date();
      year = today.getFullYear();
      const candidate = new Date(year, month - 1, day);
      if (candidate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) year += 1;
    }
    return valid(year, month, day);
  }
  return "";
}

// One calendar line -> cells. Tabs (Sheets paste) and pipes are explicit;
// commas are CSV only when they aren't just the comma inside "June 7, 2026".
function calSplitCells(line) {
  if (line.includes("\t")) return line.split("\t").map((cell) => cell.trim());
  if (line.includes("|")) return line.split("|").map((cell) => cell.trim());
  if ((line.match(/,/g) || []).length >= 2) {
    const cells = line.split(",").map((cell) => cell.trim());
    // Re-join "June 7" + "2026" style splits.
    const merged = [];
    for (let i = 0; i < cells.length; i++) {
      const next = cells[i + 1] || "";
      if (/^\d{4}$/.test(next) && new RegExp("(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?\\s+\\d{1,2}", "i").test(cells[i])) {
        merged.push(`${cells[i]}, ${next}`);
        i += 1;
      } else {
        merged.push(cells[i]);
      }
    }
    if (merged.length >= 2) return merged;
  }
  return null;
}

function parseCalendarRows(text) {
  const lines = String(text || "").replace(/\r/g, "").split("\n").map((line) => line.trim()).filter(Boolean);
  const rows = [];
  let columns = null; // header-driven column map
  for (const line of lines) {
    const cells = calSplitCells(line);
    // Header row ("Date, Passage, Title, Series") sets the column map.
    if (cells && !columns && cells.some((cell) => /^date/i.test(cell)) && cells.some((cell) => /^(passage|text|scripture)/i.test(cell))) {
      columns = cells.map((cell) =>
        /^date/i.test(cell) ? "date"
        : /^(passage|text|scripture)/i.test(cell) ? "passage"
        : /^(title|sermon)/i.test(cell) ? "title"
        : /^series/i.test(cell) ? "series"
        : "");
      continue;
    }
    const row = { id: genId(), date: "", passage: "", title: "", series: "", skip: false, note: "" };
    const leftovers = [];
    const segments = cells || line.split(/\s+[-\u2013\u00b7]\s+|\s{3,}/).map((segment) => segment.trim()).filter(Boolean);
    segments.forEach((segment, index) => {
      const clean = segment.replace(/^[""]|[""]$/g, "").trim();
      if (!clean) return;
      const mapped = cells && columns ? columns[index] : "";
      if (mapped === "date") { row.date = parseCalDate(clean) || row.date; return; }
      if (mapped === "passage") { row.passage = parseBibleRef(clean)?.reference || clean; return; }
      if (mapped === "title") { row.title = row.title || clean; return; }
      if (mapped === "series") { row.series = row.series || clean; return; }
      const seriesTag = clean.match(/^series\s*:\s*(.+)$/i);
      if (seriesTag) { row.series = seriesTag[1].trim(); return; }
      if (!row.date) {
        const date = parseCalDate(clean);
        if (date && (!parseBibleRef(clean) || /\d{4}|\//.test(clean))) { row.date = date; return; }
      }
      if (!row.passage && parseBibleRef(clean)) { row.passage = parseBibleRef(clean).reference; return; }
      leftovers.push(clean);
    });
    if (!row.title && leftovers.length) row.title = leftovers.shift();
    if (!row.series && leftovers.length) row.series = leftovers.shift();
    // A calendar row must at least identify itself by date or passage.
    if (!row.date && !row.passage) continue;
    if (!row.date) row.note = "Add the preaching date";
    if (!row.passage) row.note = row.note ? `${row.note} + passage` : "Add the passage";
    rows.push(row);
  }
  return rows;
}

function calMarkDuplicates(rows) {
  for (const row of rows) {
    const dup = state.sermons.some((sermon) =>
      (row.date && sermon.date === row.date && !sermon.imported) ||
      (row.date && row.passage && sermon.date === row.date && (sermon.passage || "").toLowerCase() === row.passage.toLowerCase()));
    if (dup) {
      row.skip = true;
      row.note = "Already in the app - skipped (Include if it's a different sermon)";
    }
  }
}

function calReadText(text, sourceNote, sourceLabel) {
  const rows = parseCalendarRows(text);
  if (!rows.length) {
    if (sourceNote !== null) showBanner(`No sermon rows found${sourceNote ? ` in ${sourceNote}` : ""} - each line needs a date or a passage.`);
    return 0;
  }
  for (const row of rows) row.source = sourceLabel || sourceNote || "Pasted rows";
  calMarkDuplicates(rows);
  ui.calImport.rows = [...ui.calImport.rows, ...rows];
  render();
  return rows.length;
}

async function handleCalImportFiles(input) {
  const files = [...(input.files || [])];
  if (!files.length) return;
  ui.calImport.busy = true;
  render();
  for (const file of files) {
    try {
      const text = file.name.toLowerCase().endsWith(".docx")
        ? (await extractSermonFileContent(file)).text
        : await file.text();
      calReadText(text, file.name);
    } catch (error) {
      showBanner(`Could not read ${file.name} (${error.message || "unreadable"}).`);
    }
  }
  ui.calImport.busy = false;
  render();
}

async function loadCalGDocsList() {
  const gdocs = ui.calImport.gdocs;
  gdocs.open = true;
  gdocs.loading = true;
  render();
  const connected = await ensureGoogleToken();
  if (!connected) {
    gdocs.open = false;
    gdocs.loading = false;
    render();
    return;
  }
  try {
    const nameFilter = gdocs.query.trim() ? ` and name contains '${gdocs.query.trim().replace(/'/g, "\\'")}'` : "";
    const params = new URLSearchParams({
      q: `(mimeType='application/vnd.google-apps.document' or mimeType='application/vnd.google-apps.spreadsheet') and trashed=false${nameFilter}`,
      orderBy: "modifiedTime desc",
      pageSize: "50",
      fields: "files(id,name,mimeType,modifiedTime)",
    });
    const data = await googleFetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`);
    gdocs.files = data.files || [];
  } catch (error) {
    gdocs.files = [];
    showBanner(`Could not list your Google files (${error.message || "connection failed"}).`);
  }
  gdocs.loading = false;
  render();
}

// One click on a Drive file reads it in. Google Sheets are read tab by
// tab through the Sheets API (a calendar per year in tabs is common), so
// every tab's rows arrive labeled with the tab they came from. If the
// Sheets API isn't enabled for the deployment, the first tab still comes
// through Drive's CSV export.
async function readCalGDocFile(fileId, fileName, mimeType) {
  ui.calImport.busy = true;
  render();
  try {
    if (mimeType === "application/vnd.google-apps.spreadsheet") {
      let total = 0;
      let tabsRead = [];
      try {
        const metaResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(fileId)}?fields=sheets(properties(title))`,
          { headers: { Authorization: `Bearer ${ui.google.accessToken}` } },
        );
        if (!metaResponse.ok) throw new Error(`Sheets API returned ${metaResponse.status}`);
        const meta = await metaResponse.json();
        const tabs = (meta.sheets || []).map((sheet) => sheet.properties?.title).filter(Boolean);
        if (!tabs.length) throw new Error("No tabs found.");
        for (const tab of tabs) {
          const range = encodeURIComponent(`'${tab.replace(/'/g, "''")}'`);
          const valuesResponse = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(fileId)}/values/${range}`,
            { headers: { Authorization: `Bearer ${ui.google.accessToken}` } },
          );
          if (!valuesResponse.ok) continue;
          const values = await valuesResponse.json();
          const text = (values.values || []).map((row) => row.join("\t")).join("\n");
          const count = calReadText(text, null, `${fileName} · ${tab}`);
          if (count) tabsRead.push(`${tab} (${count})`);
          total += count;
        }
        showBanner(total ? `Read ${total} row${total === 1 ? "" : "s"} from ${fileName} - tabs: ${tabsRead.join(", ")}.` : `No sermon rows found in ${fileName} - each row needs a date or a passage.`);
      } catch {
        // Sheets API unavailable: Drive's CSV export covers the first tab.
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}/export?mimeType=text/csv`,
          { headers: { Authorization: `Bearer ${ui.google.accessToken}` } },
        );
        if (!response.ok) throw new Error(`Google returned ${response.status}`);
        const count = calReadText(await response.text(), fileName, fileName);
        if (count) showBanner(`Read ${count} row${count === 1 ? "" : "s"} from the first tab of ${fileName}. To read every tab, enable the Google Sheets API for this deployment.`);
      }
    } else {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}/export?mimeType=text/plain`,
        { headers: { Authorization: `Bearer ${ui.google.accessToken}` } },
      );
      if (!response.ok) throw new Error(`Google returned ${response.status}`);
      calReadText(await response.text(), fileName, fileName);
    }
  } catch (error) {
    showBanner(`Could not read ${fileName} (${error.message || "fetch failed"}).`);
  }
  ui.calImport.busy = false;
  render();
}

function applyCalImport() {
  const ready = ui.calImport.rows.filter((row) => !row.skip && (row.date || row.passage));
  if (!ready.length) {
    showBanner("Nothing to add - read your calendar in first.");
    return;
  }
  for (const row of ready) {
    state.sermons.push(normalizeSermon({
      id: genId(),
      passage: row.passage.trim(),
      title: row.title.trim(),
      series: row.series.trim(),
      date: row.date || "",
      activePhase: "plan",
    }));
  }
  ui.calImport = { show: false, text: "", rows: [], busy: false, gdocs: { open: false, loading: false, files: [], query: "", picked: {} } };
  state.view = "pipeline";
  state.filter = "all";
  saveState();
  showBanner(`${ready.length} upcoming sermon${ready.length === 1 ? "" : "s"} added to your pipeline, each with its preaching date set.`);
  render();
}

// After a surgical row removal, bring the apply buttons back in step
// without re-rendering (which would reset the dialog's scroll).
function syncCalApplyButton() {
  const includable = ui.calImport.rows.filter((row) => !row.skip && (row.date || row.passage)).length;
  const button = document.querySelector('[data-action="cal-apply"]');
  if (!button) return;
  button.disabled = !includable;
  button.textContent = `Add ${includable || ""} sermon${includable === 1 ? "" : "s"} to the pipeline`;
}

function syncLibApplyButton() {
  const ready = ui.libImport.queue.filter((item) => item.status === "ready").length;
  const reading = ui.libImport.queue.some((item) => item.status === "reading");
  const button = document.querySelector('[data-action="lib-import-apply"]');
  if (!button) return;
  button.disabled = !ready || reading;
  button.textContent = ready ? `Add ${ready} to the Library` : "Add to the Library";
}

function renderCalImportModal() {
  const cal = ui.calImport;
  const includable = cal.rows.filter((row) => !row.skip && (row.date || row.passage)).length;
  return `
    <div class="pf-overlay" data-scroll-keep="cal-overlay">
      <div class="pf-modal wide" data-stop data-scroll-keep="cal-modal">
        <div class="pf-modal-head">
          <span class="pf-eyebrow">Preaching calendar</span>
          <h2 class="pf-modal-title">Load your calendar into the pipeline</h2>
        </div>
        <p class="pf-modal-text">Bring the plan, not the sermons: each row needs a <strong>date</strong> and a <strong>passage</strong>, plus an optional title and series. Every row becomes an upcoming sermon in the Pipeline with its preaching date already set.</p>

        <div class="pf-cal-sources">
          <textarea class="pf-textarea" rows="4" data-action="cal-paste-text" placeholder="Paste calendar rows here - straight from Google Sheets, Docs, or anywhere. One sermon per line, for example:&#10;June 7, 2026 - Psalm 100 - Joyful Noise - Summer Psalms">${escapeHtml(cal.text)}</textarea>
          <div class="pf-cal-source-row">
            <button class="pf-btn pf-btn-primary" data-action="cal-parse" ${cal.text.trim() ? "" : "disabled"}>Read the pasted rows</button>
            <label class="pf-btn pf-btn-ghost" style="cursor:pointer;">
              Upload a file (.csv, .txt, .docx)
              <input type="file" data-action="cal-import-files" accept=".csv,.tsv,.txt,.md,.markdown,.docx" multiple style="display:none;" />
            </label>
            <button class="pf-gdocs-cta" style="width:auto;flex:1;min-width:220px;" data-action="cal-gdocs-open">${GOOGLE_G_SVG}<span><strong>Browse Google Docs &amp; Sheets</strong><em>Read your calendar straight from Drive</em></span></button>
          </div>
          ${
            cal.gdocs.open
              ? `
                <div class="pf-cal-gdocs">
                  <div style="display:flex;gap:8px;">
                    <input class="pf-input" data-action="cal-gdocs-query" value="${attr(cal.gdocs.query)}" placeholder="Search by name (e.g. preaching calendar)" />
                    <button class="pf-btn pf-btn-ghost" data-action="cal-gdocs-search">Search</button>
                  </div>
                  ${
                    cal.gdocs.loading
                      ? `<p class="pf-helper" style="margin-top:8px;">Loading your Drive files…</p>`
                      : cal.gdocs.files.length
                        ? `<p class="pf-helper" style="margin:8px 0 4px;">Click a file and PreachFlow reads it right in - Sheets are read tab by tab.</p>
                          <div class="pf-cal-gdocs-list pf-scroll" data-scroll-keep="cal-gdocs">${cal.gdocs.files
                            .map(
                              (file) => `
                                <button class="pf-cal-gdocs-row" data-action="cal-gdocs-add" data-id="${attr(file.id)}" data-name="${attr(file.name)}" data-mime="${attr(file.mimeType)}" ${cal.busy ? "disabled" : ""}>
                                  <span>${escapeHtml(file.name)}</span>
                                  <em>${file.mimeType.includes("spreadsheet") ? "Sheet" : "Doc"}</em>
                                  <b>+ Read</b>
                                </button>`,
                            )
                            .join("")}</div>`
                        : `<p class="pf-helper" style="margin-top:8px;">No Docs or Sheets found${cal.gdocs.query ? " for that search" : ""}.</p>`
                  }
                </div>`
              : ""
          }
        </div>

        ${
          cal.rows.length
            ? `
              <div class="pf-cal-rows pf-scroll" data-scroll-keep="cal-rows">
                <div class="pf-cal-row pf-cal-head-row">
                  <span>Preaching date</span><span>Passage</span><span>Title</span><span>Series</span><span></span>
                </div>
                ${cal.rows
                  .map(
                    (row, rowIndex) => `${row.source && row.source !== cal.rows[rowIndex - 1]?.source ? `<div class="pf-cal-src">From ${escapeHtml(row.source)}</div>` : ""}
                      <div class="pf-cal-row ${row.skip ? "skipped" : ""}" data-cal-row="${attr(row.id)}">
                        <input class="pf-input" type="date" data-action="cal-row-field" data-id="${attr(row.id)}" data-field="date" value="${attr(row.date)}" />
                        <input class="pf-input" data-action="cal-row-field" data-id="${attr(row.id)}" data-field="passage" value="${attr(row.passage)}" placeholder="Psalm 100" />
                        <input class="pf-input" data-action="cal-row-field" data-id="${attr(row.id)}" data-field="title" value="${attr(row.title)}" placeholder="Title (optional)" />
                        <input class="pf-input" data-action="cal-row-field" data-id="${attr(row.id)}" data-field="series" value="${attr(row.series)}" placeholder="Series (optional)" />
                        <span class="pf-cal-row-tools">
                          ${row.skip ? `<button class="pf-inline-link" data-action="cal-row-include" data-id="${attr(row.id)}">Include</button>` : `<button class="pf-outline-btn" data-action="cal-row-remove" data-id="${attr(row.id)}" aria-label="Remove row">✕</button>`}
                        </span>
                        ${row.note ? `<em class="pf-cal-row-note">${escapeHtml(row.note)}</em>` : ""}
                      </div>`,
                  )
                  .join("")}
              </div>`
            : `<p class="pf-helper" style="margin-top:14px;">Nothing read yet. Paste rows, upload a file, or browse Drive above.</p>`
        }

        <div class="pf-modal-actions">
          <button class="pf-btn pf-btn-primary" data-action="cal-apply" ${includable ? "" : "disabled"}>Add ${includable || ""} sermon${includable === 1 ? "" : "s"} to the pipeline</button>
          <button class="pf-btn pf-btn-ghost" data-action="cal-close">Close</button>
        </div>
      </div>
    </div>
  `;
}

// Read each chosen file into the Library import queue.
async function handleLibImportFiles(input) {
  const files = [...(input.files || [])];
  if (!files.length) return;
  for (const file of files) {
    const item = { id: genId(), fileName: file.name, text: "", html: "", status: "reading", note: "Reading…", series: "", tags: "", ...guessImportMeta(file.name) };
    ui.libImport.queue.push(item);
    render();
    try {
      const content = await extractSermonFileContent(file);
      item.text = content.text;
      item.html = content.html;
      const words = item.text.trim().split(/\s+/).filter(Boolean).length;
      if (!words) throw new Error("No text found in this file.");
      fillGuessFromContent(item);
      item.status = "ready";
      item.note = `${words.toLocaleString()} words`;
    } catch (error) {
      item.status = "error";
      item.note = error.message || "Could not read this file.";
    }
    render();
  }
}

// Browse the user's Google Docs and queue the checked ones for import.
async function googleExportContent(fileId) {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}/export?mimeType=text/html`,
    { headers: { Authorization: `Bearer ${ui.google.accessToken}` } },
  );
  if (!response.ok) throw new Error(`Google returned ${response.status}`);
  const raw = await response.text();
  const html = importedHtmlToRich(raw);
  const template = document.createElement("template");
  template.innerHTML = html;
  return { html, text: template.content.textContent || "" };
}

async function loadGDocsList() {
  const gdocs = ui.libImport.gdocs;
  gdocs.open = true;
  gdocs.loading = true;
  render();
  const connected = await ensureGoogleToken();
  if (!connected) {
    gdocs.open = false;
    gdocs.loading = false;
    render();
    return;
  }
  try {
    const nameFilter = gdocs.query.trim() ? ` and name contains '${gdocs.query.trim().replace(/'/g, "\\'")}'` : "";
    const params = new URLSearchParams({
      q: `mimeType='application/vnd.google-apps.document' and trashed=false${nameFilter}`,
      orderBy: "modifiedTime desc",
      pageSize: "50",
      fields: "files(id,name,modifiedTime)",
    });
    const data = await googleFetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`);
    gdocs.files = data.files || [];
  } catch (error) {
    gdocs.files = [];
    showBanner(`Could not list your Google Docs (${error.message || "connection failed"}).`);
  }
  gdocs.loading = false;
  render();
}

async function importGDocById(fileId, fileName) {
  const item = { id: genId(), fileName, text: "", html: "", status: "reading", note: "Fetching from Google…", series: "", tags: "", ...guessImportMeta(fileName) };
  ui.libImport.queue.push(item);
  render();
  try {
    const content = await googleExportContent(fileId);
    item.text = content.text;
    item.html = content.html;
    const words = item.text.trim().split(/\s+/).filter(Boolean).length;
    if (!words) throw new Error("No text found in this doc.");
    fillGuessFromContent(item);
    item.status = "ready";
    item.note = `${words.toLocaleString()} words from Google Docs`;
  } catch (error) {
    item.status = "error";
    item.note = error.message || "Could not fetch this doc.";
  }
  render();
}

function applyLibImport() {
  const ready = ui.libImport.queue.filter((item) => item.status === "ready");
  if (!ready.length) {
    showBanner("Add at least one readable file first.");
    return;
  }
  for (const item of ready) {
    const sermon = normalizeSermon({
      id: genId(),
      imported: true,
      preached: true,
      passage: item.passage.trim(),
      title: item.title.trim(),
      series: item.series.trim(),
      date: item.date || "",
      tags: item.tags.split(",").map((tag) => tag.trim().replace(/^#/, "")).filter(Boolean),
      activePhase: "heart",
      completed: PHASES.map((phase) => phase.id),
      notes: { manuscript: item.html || textToRichHtml(item.text) },
    });
    state.sermons.push(sermon);
  }
  ui.libImport = { show: false, queue: [], gdocs: { open: false, loading: false, files: [], query: "", picked: {} } };
  state.view = "library";
  saveState();
  showBanner(`${ready.length} sermon${ready.length === 1 ? "" : "s"} filed in your Library - searchable, sortable, and ready to revisit.`);
  render();
}

function renderGDocsBrowser() {
  const gdocs = ui.libImport.gdocs;
  if (!gdocs.open) {
    return `
      <button class="pf-gdocs-cta" data-action="lib-gdocs-open">
        ${GOOGLE_G_SVG}
        <span><strong>Browse your Google Docs</strong><em>Check the sermons you want - PreachFlow reads only what you check.</em></span>
      </button>
    `;
  }
  return `
    <div class="pf-gdocs open">
      <div class="pf-checklist-head" style="margin-bottom:8px;">
        <span class="pf-eyebrow">Your Google Docs</span>
        ${gdocs.loading ? `<span class="pf-helper">Loading…</span>` : `<span class="pf-checklist-count">${gdocs.files.length} shown</span>`}
      </div>
      <div class="pf-lib-search" style="margin-bottom:8px;">
        <input class="pf-input" data-action="lib-gdocs-query" placeholder="Search your Docs by name" value="${attr(gdocs.query)}" />
        <button class="pf-btn pf-btn-ghost" data-action="lib-gdocs-search">Search</button>
      </div>
      <p class="pf-helper" style="margin:0 0 8px;">Click a doc and it's added - PreachFlow reads it straight into the queue below.</p>
      <div class="pf-gdoc-list" data-scroll-keep="lib-gdocs">
        ${gdocs.files
          .map(
            (file) => `
              <button class="pf-gdoc-row" data-action="lib-gdocs-add" data-id="${attr(file.id)}" data-name="${attr(file.name)}">
                <strong>${escapeHtml(file.name)}</strong>
                <span>${file.modifiedTime ? escapeHtml(fmtDate(file.modifiedTime.slice(0, 10))) : ""}</span>
                <em>+ Add</em>
              </button>
            `,
          )
          .join("") || (gdocs.loading ? "" : `<p class="pf-helper">No Google Docs found${gdocs.query ? " for that search" : ""}.</p>`)}
      </div>
    </div>
  `;
}

function renderLibImportModal() {
  const queue = ui.libImport.queue;
  const ready = queue.filter((item) => item.status === "ready").length;
  const reading = queue.some((item) => item.status === "reading");
  return `
    <div class="pf-overlay" data-scroll-keep="lib-overlay">
      <div class="pf-modal wide" data-stop data-scroll-keep="lib-modal">
        <div class="pf-modal-head">
          <span class="pf-eyebrow pf-eyebrow-brand">Sermon Library</span>
          <h2 class="pf-modal-title">Bring in the sermons you've already preached</h2>
        </div>
        <p class="pf-helper" style="margin-top:0;">Select as many files as you like (.docx, .pdf, .txt, .md). Exports from Google Docs, Word, Pages, and Notes all work. Each file becomes a complete Library sermon: searchable by every word, sortable by book, series, topic, or year, and openable in the Editor and Pulpit View like anything you prepared here.</p>
        <label class="pf-lib-drop">
          <input type="file" multiple accept=".docx,.txt,.md,.markdown,.pdf" data-action="lib-import-files" />
          <strong>Choose sermon files</strong>
          <span>Dates and passages in file names (like "2023-06-11 Psalm 32 - Coming Clean.docx") fill in automatically; when the name gives nothing, the first page usually does.</span>
        </label>
        ${renderGDocsBrowser()}
        ${queue
          .map(
            (item) => `
              <div class="pf-lib-qrow ${item.status}" data-lib-row="${attr(item.id)}">
                <div class="pf-lib-qhead">
                  <strong>${escapeHtml(item.fileName)}</strong>
                  <span class="pf-helper">${escapeHtml(item.note)}</span>
                  <button class="pf-chip-x" data-action="lib-import-remove" data-id="${attr(item.id)}" aria-label="Remove ${attr(item.fileName)}">✕</button>
                </div>
                ${
                  item.status === "ready"
                    ? `<div class="pf-lib-qfields">
                        <input class="pf-input" data-action="lib-import-field" data-id="${attr(item.id)}" data-field="passage" value="${attr(item.passage)}" placeholder="Passage (Psalm 32)" />
                        <input class="pf-input" data-action="lib-import-field" data-id="${attr(item.id)}" data-field="title" value="${attr(item.title)}" placeholder="Title" />
                        <input class="pf-input" type="date" data-action="lib-import-field" data-id="${attr(item.id)}" data-field="date" value="${attr(item.date)}" />
                        <input class="pf-input" data-action="lib-import-field" data-id="${attr(item.id)}" data-field="series" value="${attr(item.series)}" placeholder="Series" />
                        <input class="pf-input" data-action="lib-import-field" data-id="${attr(item.id)}" data-field="tags" value="${attr(item.tags)}" placeholder="Topics: grace, repentance" />
                      </div>`
                    : ""
                }
              </div>
            `,
          )
          .join("")}
        <div class="pf-modal-actions">
          <button class="pf-btn pf-btn-primary" data-action="lib-import-apply" ${ready && !reading ? "" : "disabled"}>${ready ? `Add ${ready} to the Library` : "Add to the Library"}</button>
          <button class="pf-btn pf-btn-ghost" data-action="lib-import-close">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

// Fold imported HTML (Google Docs export, DOCX conversion) into the
// editor's own vocabulary: headings, bold/italic/underline, lists,
// paragraphs. Inline styles become real tags; everything else unwraps.
function importedHtmlToRich(rawHtml) {
  const template = document.createElement("template");
  template.innerHTML = String(rawHtml || "");
  template.content.querySelectorAll("style, script, meta, title, link, img").forEach((node) => node.remove());
  for (const node of [...template.content.querySelectorAll("*")]) {
    const tag = node.tagName;
    const style = node.getAttribute("style") || "";
    const bold = /font-weight\s*:\s*(bold|[6-9]00)/i.test(style);
    const italic = /font-style\s*:\s*italic/i.test(style);
    const underline = /text-decoration[^;]*underline/i.test(style);
    let next = null;
    if (tag === "H1" || tag === "H2") next = "h2";
    else if (tag === "H3") next = "h3";
    else if (/^H[4-6]$/.test(tag)) next = "h4";
    else if (tag === "P") next = "p";
    else if (["UL", "OL", "LI", "BR", "BLOCKQUOTE", "STRONG", "B", "EM", "I", "U"].includes(tag)) next = tag.toLowerCase();
    else if (tag === "DIV") next = "p";
    else if (tag === "SPAN") next = bold ? "strong" : italic ? "em" : underline ? "u" : "";
    if (next === null || next === "") {
      if (next === "") node.replaceWith(...node.childNodes);
      else node.replaceWith(...node.childNodes);
      continue;
    }
    if (node.tagName.toLowerCase() !== next) {
      const replacement = document.createElement(next);
      replacement.append(...node.childNodes);
      node.replaceWith(replacement);
    } else {
      for (const attrNode of [...node.attributes]) node.removeAttribute(attrNode.name);
    }
  }
  return sanitizeRichHtml(template.innerHTML);
}

// A small markdown reader for .md sermon files: headings, bold, italics,
// bullet and numbered lists, paragraphs.
function markdownToRich(markdown) {
  const inline = (text) =>
    escapeHtml(text)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/__([^_]+)__/g, "<strong>$1</strong>")
      .replace(/_([^_]+)_/g, "<em>$1</em>");
  const out = [];
  let list = "";
  const closeList = () => {
    if (list) {
      out.push(`</${list}>`);
      list = "";
    }
  };
  for (const line of String(markdown || "").replace(/\r/g, "").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      continue;
    }
    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = heading[1].length;
      out.push(`<h${level === 1 ? 2 : level === 2 ? 3 : 4}>${inline(heading[2])}</h${level === 1 ? 2 : level === 2 ? 3 : 4}>`);
      continue;
    }
    const bullet = trimmed.match(/^[-*]\s+(.*)$/);
    const numbered = trimmed.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      const kind = bullet ? "ul" : "ol";
      if (list !== kind) {
        closeList();
        out.push(`<${kind}>`);
        list = kind;
      }
      out.push(`<li>${inline((bullet || numbered)[1])}</li>`);
      continue;
    }
    closeList();
    out.push(`<p>${inline(trimmed)}</p>`);
  }
  closeList();
  return sanitizeRichHtml(out.join(""));
}

function textToRichHtml(text) {
  return String(text || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`)
    .join("");
}

function importSermon(form) {
  const data = Object.fromEntries(new FormData(form));
  if (!ui.importText.trim()) {
    showBanner("Choose a sermon file first.");
    return;
  }
  const preached = data.importStatus === "preached";
  const sermon = normalizeSermon({
    id: genId(),
    imported: true,
    preached,
    passage: (data.passage || "").trim(),
    title: (data.title || "").trim(),
    series: (data.series || "").trim(),
    date: data.date || "",
    activePhase: preached ? "heart" : "manuscript",
    completed: preached ? PHASES.map((phase) => phase.id) : [],
    notes: { manuscript: ui.importHtml || textToRichHtml(ui.importText) },
  });
  state.sermons.push(sermon);
  state.activeId = sermon.id;
  state.view = preached ? "library" : "workspace";
  ui.showImport = false;
  ui.importText = "";
  ui.importHtml = "";
  ui.importStatusNote = "";
  saveState();
  showBanner(preached ? "Imported as a preached sermon." : "Imported - picked up at the Manuscript phase.");
  render();
}

// ============================================================
// MINISTRY WORKFLOW - Impact Plan, Shepherding Follow-Up,
// Discipleship Pack, Post-Sermon Debrief, Series Architect,
// Congregational Lens, Preaching Diet Review
// ============================================================

// Impact Plan = church-wide ministry action. People-facing resources live in
// the Discipleship Pack; pastoral-care planning lives in Shepherding - the
// Impact tab points to both so each feature keeps one clear purpose.
const IMPACT_CARDS = [
  {
    key: "staff",
    title: "Staff Alignment",
    desc: "What should staff know, reinforce, pray for, and follow up on this week?",
    fields: ["Staff focus", "Key reminder", "Prayer burden", "Follow-up needs", "Ministry emphasis"],
  },
  {
    key: "prayer",
    title: "Prayer Team Prompts",
    desc: "Specific prayer burdens connected to the passage, the big idea, and expected responses.",
    fields: ["Prayer burdens", "Repentance prayers", "Encouragement prayers", "Evangelistic prayers", "Church-wide prayer focus"],
  },
  {
    key: "worship",
    title: "Worship & Service Planning",
    desc: "Scripture readings, confession, assurance, and thematic direction for the service.",
    fields: ["Service theme", "Scripture reading", "Confession prompt", "Assurance of pardon", "Communion reflection", "Song / theme direction"],
  },
];

const SHEPHERD_CARDS = [
  {
    key: "care",
    title: "Pastoral Care Plan",
    desc: "The conversations this sermon may open, Scriptures for follow-up, and shepherding questions.",
    fields: ["Conversations this sermon may open", "Pastoral care concerns", "Follow-up Scriptures", "Shepherding questions"],
  },
  {
    key: "pathways",
    title: "Next-Step Pathways",
    desc: "Clear, simple next steps for people the sermon stirs.",
    fields: ["Invite to prayer", "Recommend a resource", "Encourage confession", "Connect to a group", "Meet with pastor / elder", "Encourage baptism / membership / service", "Follow-up email"],
  },
  {
    key: "sevenday",
    title: "Seven-Day Follow-Up",
    desc: "For someone this sermon stirred - short daily encouragements a pastor can text or email during the week.",
    fields: [
      "Day 1 - Remember the big idea",
      "Day 2 - Return to the passage",
      "Day 3 - Confess and repent",
      "Day 4 - Believe the gospel promise",
      "Day 5 - Practice obedience",
      "Day 6 - Pray with others",
      "Day 7 - Prepare for the next gathering",
    ],
  },
];

const PACK_CARDS = [
  {
    key: "group",
    title: "Family Group Guide",
    desc: "Discussion questions, leader notes, and prayer prompts for groups.",
    fields: ["Opening question", "Read the passage", "Observation questions", "Interpretation questions", "Application questions", "Prayer prompts", "Leader notes"],
  },
  {
    key: "personal",
    title: "Personal Reflection Guide",
    desc: "A simple pathway for personal response to the message.",
    fields: ["Main idea", "Key Scripture", "Reflection questions", "Confession prompt", "Prayer prompt", "One obedience step"],
  },
  {
    key: "family",
    title: "Parent Conversation Guide",
    desc: "The big idea for kids and simple family conversations.",
    fields: ["Big idea for kids", "Dinner table question", "Car ride question", "Prayer with children", "Family practice this week", "Memory verse suggestion"],
  },
  {
    key: "devotional",
    title: "Seven-Day Devotional",
    desc: "For the whole church - a daily Scripture, reflection, prayer, and practice that extends the sermon through the week.",
    fields: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
  },
  {
    key: "memory",
    title: "Memory Verse Card",
    desc: "One verse the church carries out of this sermon.",
    fields: ["Verse reference", "Verse text", "Why this verse matters", "Simple memorization prompt"],
  },
  {
    key: "nextsteps",
    title: "Weekly Next Steps",
    desc: "Concrete responses for the week.",
    fields: ["Repent", "Believe", "Practice", "Discuss", "Pray", "Serve", "Share"],
  },
];

const SERIES_OUTPUT_CARD = {
  key: "outputs",
  title: "Series Outputs",
  desc: "Ready-to-adapt pieces for launching and supporting the series.",
  fields: ["Series description (website)", "Series launch announcement", "Family group overview", "Prayer points for the series", "Staff alignment notes", "Social media description"],
};

const SHEPHERD_RESPONSES = ["Repentance", "Assurance", "Grief", "Anxiety", "Anger", "Shame", "Guilt", "Unbelief", "Marriage conflict", "Family tension", "Spiritual dryness", "Confusion", "Conviction", "Encouragement", "Mission urgency"];
const DEBRIEF_RESPONSES = ["Repentance", "Encouragement", "Questions", "Tears / grief", "Confession", "Pushback", "Assurance", "Evangelistic interest", "Counseling need", "Follow-up conversations", "Serving response", "Giving response", "Baptism / membership interest"];
const SERIES_ANCHORS = ["God", "Scripture", "Sin", "Christ", "Gospel", "Spirit", "Church", "Mission", "Prayer", "Suffering", "Holiness", "Wisdom", "Justice", "Generosity", "Family", "Eschatology"];
const SERIES_BURDENS = ["Anxiety", "Shame", "Guilt", "Spiritual dryness", "Conflict", "Pride", "Apathy", "Fear", "Suffering", "Grief", "Marriage", "Parenting", "Mission", "Unity", "Repentance", "Assurance"];
const LENS_NEEDS = ["Bible intake", "Prayer", "Evangelism", "Generosity", "Serving", "Community", "Marriage", "Parenting", "Unity", "Repentance", "Assurance", "Emotional maturity", "Leadership development", "Mission"];

const MINISTRY_DISCLAIMER =
  "This supports ministry planning. It does not replace prayer, pastoral discernment, staff leadership, or shepherding responsibility.";

function ministryTemplate(fields) {
  return fields.map((field) => `${field}:\n`).join("\n");
}

function ministryValue(store, key, fields) {
  const value = store?.[key];
  return typeof value === "string" && value.trim() ? value : ministryTemplate(fields);
}

function ministryFilled(store, key, fields) {
  const value = store?.[key];
  return Boolean(typeof value === "string" && value.trim() && value.trim() !== ministryTemplate(fields).trim());
}

function getSeries(id = ui.activeSeriesId) {
  return state.series.find((series) => series.id === id) || null;
}

// Resolve a data-store attribute to the live object edits should land on.
// Sermon-scoped stores default to the active sermon; pass a sermonId (the
// debrief page edits past sermons) to target another one.
function ministryStore(name, sermonId) {
  const sermon = sermonId ? state.sermons.find((item) => item.id === sermonId) : getActive();
  if (name === "impact" || name === "shepherd" || name === "pack" || name === "debrief") return sermon ? sermon[name] : null;
  if (name === "lens") return state.lens;
  if (name === "profile") return state.preachingProfile;
  if (name === "series") return getSeries();
  if (name === "series-formation") return getSeries()?.formation || null;
  if (name === "series-outputs") return getSeries()?.outputs || null;
  return null;
}

function touchMinistryStore(name, sermonId) {
  const sermon = sermonId ? state.sermons.find((item) => item.id === sermonId) : getActive();
  if ((name === "impact" || name === "shepherd" || name === "pack" || name === "debrief") && sermon) {
    sermon.updatedAt = new Date().toISOString();
  }
  if (name.startsWith("series")) {
    const series = getSeries();
    if (series) series.updatedAt = new Date().toISOString();
  }
  saveState();
}

// ---- Sermon Guide drafting (uses /api/draft, never the coach) ----
const DRAFT_SPECS = {};
IMPACT_CARDS.forEach((card) => {
  DRAFT_SPECS[`impact.${card.key}`] = { store: "impact", ...card };
});
SHEPHERD_CARDS.forEach((card) => {
  DRAFT_SPECS[`shepherd.${card.key}`] = { store: "shepherd", ...card };
});
PACK_CARDS.forEach((card) => {
  DRAFT_SPECS[`pack.${card.key}`] = { store: "pack", ...card };
});
DRAFT_SPECS["series-outputs.outputs"] = { store: "series-outputs", ...SERIES_OUTPUT_CARD };
DRAFT_SPECS["pack.devotional"].instructions =
  "For each day include: a Scripture reference, a two-to-three sentence reflection, a one-line prayer, and one concrete practice.";
DRAFT_SPECS["shepherd.sevenday"].instructions =
  "Keep each day to two or three lines the pastor could text or email to someone the sermon stirred.";

// How the preacher wants help - fed to Sermon Guide behind the profile's
// own toggles. Never included in exports or share links.
function profileSummaryLines() {
  const profile = state.preachingProfile || {};
  if (profile.useProfile === false) return [];
  const fields = [
    ["Role / context / cadence", [profile.role, profile.context, profile.cadence].filter(Boolean).join(" · ")],
    ["Preaching style", profile.style],
    ["Outline preference", profile.outlinePref],
    ["Big idea style", profile.bigIdeaStyle],
    ["Application emphasis", (profile.applicationEmphasis || []).join(", ")],
    ["Christ connection preference", profile.christConnection],
    ["Tradition", [profile.tradition, profile.confession].filter(Boolean).join(" · ")],
    ["Ministry values", (profile.values || []).join(", ")],
    ["Preferred translation", profile.translation],
    ["Usual weekly outputs", (profile.productionOutputs || []).join(", ")],
    ["Usual audiences", (profile.audienceOutputs || []).join(", ")],
  ].filter(([, value]) => value && String(value).trim());
  const lines = [];
  if (fields.length) {
    lines.push(
      "PREACHING PROFILE (how this pastor prepares and wants help - fit your help to it):",
      ...fields.map(([label, value]) => `${label}: ${value}`),
    );
  }
  const posture = (profile.posture || []).join("; ");
  if (posture) lines.push(`SERMON GUIDE POSTURE: ${posture}.`);
  if (profile.questionsFirst) lines.push("BEHAVIOR: prefer asking questions before suggesting.");
  if ((profile.guardrails || "").trim()) {
    lines.push("GUARDRAILS (hard constraints from the preacher - never cross these):", profile.guardrails.trim());
  }
  const rubric = activeRubricItems();
  if (lines.length && rubric.length) lines.push(`REVIEW RUBRIC (when asked to review, check against these): ${rubric.join("; ")}.`);
  if (!lines.length) return [];
  return [...lines, ""];
}

function lensSummaryLines() {
  const lens = state.lens || {};
  if (!lens.enabled) return [];
  if (state.preachingProfile?.useLens === false) return [];
  const fields = [
    ["Church", [lens["profile.name"], lens["profile.city"], lens["profile.size"]].filter(Boolean).join(", ")],
    ["Ministry context", [lens["profile.style"], lens["profile.context"], lens["profile.demographics"]].filter(Boolean).join(" · ")],
    ["Current season", lens["season.now"]],
    ["The Lord is emphasizing", lens["season.emphasis"]],
    ["Pressures / opportunities", lens["season.pressures"]],
    ["Discipleship needs", (lens.needs || []).join(", ")],
    ["Recurring pastoral burdens", lens["burdens.recurring"]],
    ["Mission priorities", [lens["mission.local"], lens["mission.outreach"], lens["mission.planting"], lens["mission.partnerships"], lens["mission.evangelism"]].filter(Boolean).join(" · ")],
    ["Leadership language", lens["leadership.language"]],
    ["Initiatives to reinforce", lens["leadership.initiatives"]],
    ["Leadership themes to repeat", lens["leadership.themes"]],
  ].filter(([, value]) => value && String(value).trim());
  if (!fields.length) return [];
  return [
    "CONGREGATIONAL CONTEXT (broad, non-confidential - shape application and language to this real church):",
    ...fields.map(([label, value]) => `${label}: ${value}`),
    "",
  ];
}

function sermonDraftContext(sermon) {
  const lines = [activeContext(sermon)];
  const extras = [];
  const manuscript = phaseNoteText(sermon, PHASES.find((phase) => phase.id === "manuscript"));
  const invitation = phaseNoteText(sermon, PHASES.find((phase) => phase.id === "invitation"));
  const applicationNote = phaseNoteText(sermon, PHASES.find((phase) => phase.id === "application"));
  if (applicationNote.trim()) extras.push(`APPLICATION NOTES:\n${applicationNote.slice(0, 900)}`);
  if (invitation.trim()) extras.push(`INVITATION PLAN:\n${invitation.slice(0, 500)}`);
  if (manuscript.trim()) extras.push(`MANUSCRIPT EXCERPT:\n${manuscript.slice(0, 1400)}`);
  return [...lines, "", ...extras, "", ...profileSummaryLines(), ...lensSummaryLines()].join("\n");
}

async function draftWithGuide(specKey) {
  const spec = DRAFT_SPECS[specKey];
  if (!spec || ui.drafting) return;
  const store = ministryStore(spec.store);
  if (!store) return;
  if (!requireOpenAIKey()) return;
  if (ministryFilled(store, spec.key, spec.fields)) {
    const ok = confirm(`Replace your current "${spec.title}" draft with a fresh Sermon Guide draft?`);
    if (!ok) return;
  }

  const active = getActive();
  const series = getSeries();
  const context = spec.store.startsWith("series")
    ? seriesDraftContext(series)
    : active
      ? sermonDraftContext(active)
      : "";
  // A finished sermon is the source of truth; an in-progress one may need
  // starting points. Tell the Guide which situation it is in.
  const sermonComplete = active && (isPreachedSermon(active) || active.preached || progressPct(active) >= 100);
  const grounding = spec.store.startsWith("series")
    ? ""
    : sermonComplete
      ? "\nThis sermon is COMPLETE. Build every field strictly from the sermon material provided: summarize, excerpt, and adapt the preacher's own words, points, and applications. Do not invent new ideas, illustrations, or applications that are not in the material."
      : "\nThis sermon is still in progress. Ground everything in the passage and the material provided; where material is thin you may draft modest starting points that follow the preacher's direction, clearly marked as suggestions to refine.";

  ui.drafting = specKey;
  render();
  try {
    const response = await fetch("./api/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...openAIHeaders() },
      body: JSON.stringify({
        context,
        prompt: `Draft the "${spec.title}" resource. ${spec.instructions || ""}${grounding}\nUse exactly these labeled fields, in this order, filling each with concrete, pastorally useful content drawn from the sermon material provided:\n${spec.fields.map((field) => `${field}:`).join("\n")}\nFormatting rules: write complete, polished sentences ready to hand to someone. Under a field, put each distinct item on its own line starting with "- " (a hyphen and a space); use plain paragraphs for single thoughts. Never use markdown headers, asterisks, or bold markers. Return only the labeled fields.`,
      }),
    });
    const data = await response.json();
    if (data.text) {
      store[spec.key] = data.text;
      touchMinistryStore(spec.store);
      showBanner(`Draft ready - review and adapt it before you use it.`);
    } else {
      showBanner("No draft came back. Try again.");
    }
  } catch {
    showBanner("Could not reach Sermon Guide. Check your connection and key.");
  } finally {
    ui.drafting = "";
    render();
  }
}

function seriesDraftContext(series) {
  if (!series) return "";
  const lines = [
    `SERIES: ${series.title || "Untitled series"}${series.subtitle ? ` - ${series.subtitle}` : ""}`,
    `Passages: ${series.passages || "-"}`,
    `Window: ${series.startDate || "?"} to ${series.endDate || "?"} (${series.count || "?"} sermons)`,
    `Description: ${series.description || "-"}`,
    `Formation goal: ${series.formation?.goal || "-"}`,
    `Desired church response: ${series.formation?.response || "-"}`,
    `Practices to cultivate: ${series.formation?.practices || "-"}`,
    `Sins to confront: ${series.formation?.sins || "-"}`,
    `Comforts to apply: ${series.formation?.comforts || "-"}`,
    `Doctrinal anchors: ${(series.anchors || []).join(", ") || "-"}`,
    `Pastoral burdens: ${(series.burdens || []).join(", ") || "-"}`,
    "Series map:",
    ...(series.map || []).map(
      (row, index) =>
        `${index + 1}. ${row.when || ""} ${row.passage || "(passage tbd)"} - ${row.title || ""}${row.idea ? ` | Big idea: ${row.idea}` : ""}${row.emphasis ? ` | Formation: ${row.emphasis}` : ""}`,
    ),
    "",
    ...profileSummaryLines(),
    ...lensSummaryLines(),
  ];
  return lines.join("\n");
}

async function reviewSeriesArc(seriesId) {
  const series = getSeries(seriesId);
  if (!series || ui.drafting) return;
  if (!requireOpenAIKey()) return;
  ui.drafting = "series-arc";
  render();
  try {
    const response = await fetch("./api/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...openAIHeaders() },
      body: JSON.stringify({
        context: seriesDraftContext(series),
        prompt:
          "Review this sermon series arc pastorally. Consider: Does the series have a clear progression? Are the sermons connected without being repetitive? Is the church being formed doctrinally and pastorally? Are we confronting sin and applying grace? Is there evangelistic clarity? Is there a clear landing point? Name what is strong first, then genuine gaps, then two or three practical suggestions. Observe and consider - no scores or grades.",
      }),
    });
    const data = await response.json();
    series.arcReview = data.text || "";
    series.arcReviewAt = new Date().toISOString();
    series.updatedAt = new Date().toISOString();
    saveState();
  } catch {
    showBanner("Could not reach Sermon Guide.");
  } finally {
    ui.drafting = "";
    render();
  }
}

// ---- shared ministry UI pieces ----
function renderChipGroup(store, field, options, selected, sermonId = "") {
  const chosen = Array.isArray(selected) ? selected : [];
  const custom = chosen.filter((value) => !options.includes(value));
  const sermonAttr = sermonId ? ` data-sermon="${attr(sermonId)}"` : "";
  return `
    <div class="pf-filter-chips" style="margin-bottom:10px;">
      ${[...options, ...custom]
        .map(
          (option) =>
            `<button type="button" class="pf-chip ${chosen.includes(option) ? "active" : ""}" data-action="min-chip" data-store="${attr(store)}" data-field="${attr(field)}" data-value="${attr(option)}"${sermonAttr}>${escapeHtml(option)}</button>`,
        )
        .join("")}
    </div>
    <div class="pf-chip-add">
      <input class="pf-input" data-action="min-chip-input" placeholder="Add your own…" />
      <button type="button" class="pf-btn pf-btn-ghost" data-action="min-chip-add" data-store="${attr(store)}" data-field="${attr(field)}"${sermonAttr}>Add</button>
    </div>
  `;
}

// ---- Ministry guidance: real questions and sermon-drawn starters ----
// Every guide field is a real question, and each question offers starter
// content assembled from the sermon itself (passage, big idea, purpose,
// outline, applications) - no AI involved. The leader taps a starter to
// insert it, then makes it their own.
const MINISTRY_QUESTIONS = {
  "impact.staff": {
    "Staff focus": "What is the one thing every staff member should keep in front of them this week?",
    "Key reminder": "What must the staff not forget while serving people this week?",
    "Prayer burden": "What should the staff be praying for together this week?",
    "Follow-up needs": "Who or what will need follow-up after this sermon (categories, not names)?",
    "Ministry emphasis": "Which ministries does this sermon touch, and what should each emphasize?",
  },
  "impact.prayer": {
    "Prayer burdens": "What is this sermon asking God to do in people? Ask Him for exactly that.",
    "Repentance prayers": "What will people need to confess and turn from after this text?",
    "Encouragement prayers": "Who will need comfort or courage because of this message?",
    "Evangelistic prayers": "How should we pray for people far from God who will hear this?",
    "Church-wide prayer focus": "If the whole church prayed one prayer this week, what should it be?",
  },
  "impact.worship": {
    "Service theme": "In one line, what should the whole service say?",
    "Scripture reading": "Which passage should be read aloud, and why this one?",
    "Confession prompt": "What should we lead the church to confess before this message?",
    "Assurance of pardon": "What gospel assurance answers that confession?",
    "Communion reflection": "How does this passage point to the table?",
    "Song / theme direction": "What should the songs help people feel and declare?",
  },
  "shepherd.care": {
    "Conversations this sermon may open": "What conversations is this sermon likely to open up in the lobby, in texts, in offices?",
    "Pastoral care concerns": "Who might this message land hard on, and what care will they need (categories, not names)?",
    "Follow-up Scriptures": "Which passages should we have ready for people this stirs?",
    "Shepherding questions": "What questions will help a shepherd draw out what God is doing in someone?",
  },
  "shepherd.pathways": {
    "Invite to prayer": "How will we invite a stirred person to be prayed for this week?",
    "Recommend a resource": "What one resource fits someone this sermon moved?",
    "Encourage confession": "How will we make confession a safe, clear next step?",
    "Connect to a group": "How do we move a responder into real community?",
    "Meet with pastor / elder": "How does someone get a conversation with a pastor or elder?",
    "Encourage baptism / membership / service": "What is the on-ramp for a bigger step of obedience?",
    "Follow-up email": "What would a short follow-up note to a responder say?",
  },
  "shepherd.sevenday": {
    "Day 1 - Remember the big idea": "What one-line reminder of the big idea could you text someone on Monday?",
    "Day 2 - Return to the passage": "How would you invite them back into the passage on Tuesday?",
    "Day 3 - Confess and repent": "What gentle nudge toward confession fits midweek?",
    "Day 4 - Believe the gospel promise": "Which promise from this text should they cling to on Thursday?",
    "Day 5 - Practice obedience": "What single act of obedience could they attempt on Friday?",
    "Day 6 - Pray with others": "How could they pray this passage with someone on Saturday?",
    "Day 7 - Prepare for worship": "What would ready their heart for Sunday?",
  },
  "pack.group": {
    "Opening question": "What question gets the group talking before anyone opens a Bible?",
    "Read the passage": "How should the group read the passage together (whole, in parts, twice)?",
    "Observation questions": "What questions make the group look closely at what the text says?",
    "Interpretation questions": "What questions push the group to what the text means?",
    "Application questions": "What questions turn the meaning into Monday-morning obedience?",
    "Prayer prompts": "How should the group pray in response to this passage?",
    "Leader notes": "What does a leader need to know before walking into this discussion?",
  },
  "pack.personal": {
    "Main idea": "In one sentence, what should a reader carry from this sermon?",
    "Key Scripture": "Which verse anchors this reflection?",
    "Reflection questions": "What questions help someone sit honestly with this text alone?",
    "Confession prompt": "What does this passage invite a person to confess?",
    "Prayer prompt": "How should someone pray this passage back to God?",
    "One obedience step": "What is one concrete step of obedience before next Sunday?",
  },
  "pack.family": {
    "Big idea for kids": "How would you say the big idea so a seven-year-old gets it?",
    "Dinner table question": "What question could a parent ask over dinner?",
    "Car ride question": "What question fits a five-minute car ride?",
    "Prayer with children": "How could a parent pray this passage with their kids?",
    "Family practice this week": "What could the family do together this week to live this text?",
    "Memory verse suggestion": "Which short verse could the family memorize together?",
  },
  "pack.devotional": {
    "Day 1": "Day 1: how do we re-enter the passage the day after hearing it?",
    "Day 2": "Day 2: what does this text show us about God to dwell on?",
    "Day 3": "Day 3: where does this text confront us, and how do we respond?",
    "Day 4": "Day 4: what gospel promise here should we believe today?",
    "Day 5": "Day 5: what does obedience to this text look like today?",
    "Day 6": "Day 6: how do we carry this text toward others?",
    "Day 7": "Day 7: how does this week of dwelling prepare us for worship?",
  },
  "pack.memory": {
    "Verse reference": "Which single verse should the church carry out of this sermon?",
    "Verse text": "Write the verse out in your preaching translation.",
    "Why this verse matters": "In a sentence or two, why this verse from this sermon?",
    "Simple memorization prompt": "How would you coach someone to memorize it this week?",
  },
  "pack.nextsteps": {
    "Repent": "What should we turn from in response to this sermon?",
    "Believe": "What should we believe and preach to ourselves this week?",
    "Practice": "What should we do - concretely - before next Sunday?",
    "Discuss": "What should we talk about with someone this week?",
    "Pray": "What should we pray, alone or together?",
    "Serve": "How does this sermon send us to serve someone?",
    "Share": "Who needs to hear what we heard, and what would we say?",
  },
};

function ministryQuestion(store, cardKey, field) {
  return MINISTRY_QUESTIONS[`${store}.${cardKey}`]?.[field] || "";
}

// Everything the starters draw from - all of it the preacher's own work.
function ministryStarterContext(active) {
  const str = (value) => (typeof value === "string" ? value.trim() : "");
  const passage = str(active.passage) || "this passage";
  const bigIdea = str(worksheetValue(active, "aim", "burden"));
  return {
    passage,
    title: str(active.title),
    bigIdea,
    idea: bigIdea || `the message of ${passage}`,
    fallen: str(worksheetValue(active, "aim", "fallen")),
    purpose: str(worksheetValue(active, "aim", "purpose")),
    christ: str(worksheetValue(active, "gospel", "christ")),
    grace: str(worksheetValue(active, "gospel", "grace")),
    movements: (active.outline || []).map((movement) => movement.title.trim()).filter(Boolean),
    applications: sermonAudiences(active)
      .map((audience) => [audience, str(worksheetValue(active, "application", audience))])
      .filter(([, text]) => text),
  };
}

// Sermon-drawn starter suggestions for a question. Deterministic templates,
// keyed on what the field is doing; every starter leans on the sermon's own
// passage, big idea, and work so nothing arrives out of thin air.
function ministryStarters(field, ctx) {
  const label = field.toLowerCase();
  const idea = ctx.idea;
  const starters = [];
  const respond = ctx.purpose || `respond to ${ctx.passage} with real obedience`;
  if (/prayer|pray/.test(label)) {
    starters.push(`That our people would take ${ctx.passage} seriously this week: ${idea}`);
    if (/repent|confess/.test(label)) starters.push(ctx.fallen ? `Lord, we confess that ${lowerFirst(ctx.fallen)} Forgive us and turn our hearts.` : `Lord, show us where ${ctx.passage} confronts us, and give us honest repentance.`);
    if (/encourag|comfort/.test(label)) starters.push(`For the weary and hurting among us: that ${ctx.passage} would be comfort, not condemnation.`);
    if (/evangel|far from god/.test(label)) starters.push(`For friends and family far from God: that ${idea} would sound like good news, not religion.`);
    if (/church-wide|one prayer/.test(label)) starters.push(`Father, make us a people who ${lowerFirst(respond)}`);
  } else if (/focus|emphasis|theme/.test(label)) {
    starters.push(`Keep ${ctx.passage} in front of people this week: ${idea}`);
    if (ctx.movements.length) starters.push(`The sermon moves through: ${ctx.movements.join(" / ")}. Every ministry can reinforce one of these.`);
  } else if (/reminder/.test(label)) {
    starters.push(`As we serve this week, remember what we preached: ${idea}`);
  } else if (/follow-up|meetings|people \/ categories/.test(label)) {
    starters.push(`People this sermon may stir: anyone wrestling with ${ctx.fallen ? lowerFirst(ctx.fallen).replace(/\.$/, "") : `what ${ctx.passage} confronts`}. Plan gentle follow-up.`);
  } else if (/scripture reading|key scripture|verse reference/.test(label)) {
    starters.push(`${ctx.passage}${ctx.title ? ` (preached as "${ctx.title}")` : ""}`);
  } else if (/observation/.test(label)) {
    starters.push(`What words or ideas repeat in ${ctx.passage}? What did you notice on a second read that you missed on the first?`);
  } else if (/interpretation/.test(label)) {
    starters.push(`What is ${ctx.passage} actually claiming? Put the main point in your own words: is it "${idea}"?`);
  } else if (/application question/.test(label)) {
    starters.push(`If we believed ${ctx.passage} all week, what would change by Friday? What is one specific step for you?`);
  } else if (/opening question/.test(label)) {
    starters.push(`Before we read: when have you experienced something like what ${ctx.passage} describes?`);
  } else if (/big idea for kids/.test(label)) {
    starters.push(ctx.bigIdea ? `Kid version: ${ctx.bigIdea}` : `Say ${ctx.passage} in ten words a child can repeat.`);
  } else if (/dinner|car ride/.test(label)) {
    starters.push(`What did you hear on Sunday about ${ctx.passage}? What do you think God wants our family to do about it?`);
  } else if (/confession/.test(label)) {
    starters.push(ctx.fallen ? `Where ${ctx.passage} confronts us: ${lowerFirst(ctx.fallen)}` : `Name where ${ctx.passage} confronts you, plainly, before God.`);
  } else if (/assurance|promise|believe/.test(label)) {
    starters.push(ctx.grace || ctx.christ || `The good news under ${ctx.passage}: God gives what He commands.`);
  } else if (/obedience|practice|next step/.test(label)) {
    const application = ctx.applications[0];
    starters.push(application ? `${application[1]}` : `One concrete step from ${ctx.passage} before next Sunday - specific enough to actually do.`);
  } else if (/communion|table/.test(label)) {
    starters.push(ctx.christ ? `At the table, remember: ${lowerFirst(ctx.christ)}` : `Trace ${ctx.passage} to the cross, and let the table preach it again.`);
  } else if (/song/.test(label)) {
    starters.push(`Songs that declare ${idea} - and give space to respond, not just perform.`);
  } else if (/day \d/.test(label)) {
    starters.push(`${ctx.passage}: ${idea}`);
  } else if (/memoriz/.test(label)) {
    starters.push(`Read it aloud each morning, write it once each evening, and say it from memory by Saturday.`);
  } else if (/leader notes/.test(label)) {
    starters.push(`The sermon's aim: ${idea}${ctx.movements.length ? ` It moved through: ${ctx.movements.join(", ")}.` : ""} Keep the group in the text, not in opinions.`);
  } else if (/resource/.test(label)) {
    starters.push(`A book, sermon, or passage plan that continues what ${ctx.passage} started.`);
  } else {
    starters.push(`From ${ctx.passage}: ${idea}`);
  }
  return starters.filter(Boolean).slice(0, 3);
}

function lowerFirst(value) {
  const text = String(value || "").trim();
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

// Pull per-question answers back out of a card's labeled text blob, so the
// wizard can revisit a section that already has writing in it.
function parseMinistryAnswers(value, fields) {
  const text = typeof value === "string" ? value : "";
  const answers = {};
  fields.forEach((field) => {
    const start = text.indexOf(`${field}:`);
    if (start === -1) {
      answers[field] = "";
      return;
    }
    let end = text.length;
    for (const other of fields) {
      if (other === field) continue;
      const position = text.indexOf(`${other}:`, start + field.length + 1);
      if (position !== -1 && position < end) end = position;
    }
    answers[field] = text.slice(start + field.length + 1, end).trim();
  });
  return answers;
}

function composeMinistryAnswers(fields, answers) {
  return fields.map((field) => `${field}:\n${(answers[field] || "").trim()}`).join("\n\n");
}

// Turn a card's labeled text into a clean, professional document: a
// handout header, each question as a bold heading, answers as paragraphs
// and real lists. Used for the on-screen view, rich copy, and exports.
function formatAnswerHtml(text) {
  const lines = String(text || "").replace(/\r/g, "").split("\n").map((line) => line.trim());
  const out = [];
  let list = "";
  const closeList = () => {
    if (list) {
      out.push(`</${list}>`);
      list = "";
    }
  };
  for (const line of lines) {
    if (!line) {
      closeList();
      continue;
    }
    const bullet = line.match(/^[-•*]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      const kind = bullet ? "ul" : "ol";
      if (list !== kind) {
        closeList();
        out.push(`<${kind}>`);
        list = kind;
      }
      out.push(`<li>${escapeHtml((bullet || numbered)[1])}</li>`);
      continue;
    }
    closeList();
    out.push(`<p>${escapeHtml(line)}</p>`);
  }
  closeList();
  return out.join("");
}

function ministryDocHtml(active, store, card) {
  const value = ministryStore(store)?.[card.key] || active?.[store]?.[card.key] || "";
  const answers = parseMinistryAnswers(value, card.fields);
  const churchName = typeof state.lens?.["profile.name"] === "string" ? state.lens["profile.name"].trim() : "";
  const metaBits = [
    active?.title ? `"${active.title}"` : "",
    active?.passage || "",
    active?.date ? fmtDate(active.date) : "",
    churchName,
  ].filter(Boolean);
  const sections = card.fields
    .filter((field) => (answers[field] || "").trim())
    .map((field) => `<h4>${escapeHtml(ministryQuestion(store, card.key, field) ? field : field)}</h4>${formatAnswerHtml(answers[field])}`)
    .join("");
  return `
    <div class="pf-mdoc">
      <div class="pf-mdoc-head">
        <h3>${escapeHtml(card.title)}</h3>
        ${metaBits.length ? `<p>${escapeHtml(metaBits.join(" · "))}</p>` : ""}
      </div>
      ${sections || `<p class="pf-helper">Nothing written yet.</p>`}
    </div>
  `;
}

function ministryDocPlainText(active, store, card) {
  const value = ministryStore(store)?.[card.key] || "";
  const answers = parseMinistryAnswers(value, card.fields);
  const churchName = typeof state.lens?.["profile.name"] === "string" ? state.lens["profile.name"].trim() : "";
  const lines = [card.title.toUpperCase()];
  const metaBits = [active?.title ? `"${active.title}"` : "", active?.passage || "", active?.date ? fmtDate(active.date) : "", churchName].filter(Boolean);
  if (metaBits.length) lines.push(metaBits.join(" · "));
  lines.push("");
  card.fields.forEach((field) => {
    const answer = (answers[field] || "").trim();
    if (!answer) return;
    lines.push(field.toUpperCase(), answer, "");
  });
  return lines.join("\n").trim();
}

// Copy that pastes formatted into Word, Docs, and email - with a plain
// fallback for anything that can't take HTML.
async function copyRichText(html, plain) {
  try {
    if (navigator.clipboard?.write && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        }),
      ]);
      showBanner("Copied with formatting - paste into Docs, Word, or email.");
      return;
    }
  } catch {
    // fall through to plain copy
  }
  copyText(plain);
}

function ministryWizardFor(store, key) {
  const wizard = ui.ministryWizard;
  return wizard && wizard.store === store && wizard.key === key ? wizard : null;
}

function finishMinistryWizard() {
  const wizard = ui.ministryWizard;
  if (!wizard) return;
  const storeObj = ministryStore(wizard.store);
  const hasContent = wizard.fields.some((field) => (wizard.answers[field] || "").trim());
  if (storeObj) {
    storeObj[wizard.key] = hasContent ? composeMinistryAnswers(wizard.fields, wizard.answers) : "";
    touchMinistryStore(wizard.store);
  }
  ui.ministryWizard = null;
  ui.ministryEdit = null;
  // Keep this section expanded so the finished, formatted result is the
  // first thing the leader sees.
  ui.ministryOpen = `${wizard.store}.${wizard.key}`;
  if (hasContent) showBanner("Section complete - formatted and ready to copy or edit.");
  render();
}

// One question at a time: a real question, sermon-drawn starters to tap,
// one answer box, Back / Next.
function renderMinistryWizard(card, wizard) {
  const field = wizard.fields[wizard.step];
  const last = wizard.step === wizard.fields.length - 1;
  const question = ministryQuestion(wizard.store, wizard.key, field);
  const active = getActive();
  const starters = active ? ministryStarters(field, ministryStarterContext(active)) : [];
  return `
    <section class="pf-card-box pf-checklist-card pf-wizard-card">
      <div class="pf-checklist-head">
        <span class="pf-eyebrow">${escapeHtml(card.title)}</span>
        <span class="pf-checklist-count">Question ${wizard.step + 1} of ${wizard.fields.length}</span>
      </div>
      <div class="pf-wizard-progress" aria-hidden="true"><i style="width:${Math.round(((wizard.step + 1) / wizard.fields.length) * 100)}%"></i></div>
      <label class="pf-wizard-question">${escapeHtml(question || field)}</label>
      ${question ? `<p class="pf-wizard-fieldname">Goes in the "${escapeHtml(field)}" line of the finished resource.</p>` : ""}
      <textarea class="pf-ws-input" rows="4" data-action="ministry-wizard-answer" data-note-key="mw-${attr(wizard.store)}-${attr(wizard.key)}-${wizard.step}" placeholder="Write it plainly - or tap a starter below and make it yours.">${escapeHtml(wizard.answers[field] || "")}</textarea>
      ${
        starters.length
          ? `<div class="pf-wizard-starters">
              <span class="pf-wizard-starters-label">From your sermon - tap to insert, then edit:</span>
              ${starters.map((starter) => `<button class="pf-starter" data-action="ministry-wizard-suggest" data-text="${attr(starter)}">${escapeHtml(starter)}</button>`).join("")}
            </div>`
          : ""
      }
      <div class="pf-modal-actions" style="margin-top:12px;">
        <button class="pf-btn pf-btn-ghost" data-action="ministry-wizard-cancel">Save and exit</button>
        <span style="flex:1;"></span>
        <button class="pf-btn" data-action="ministry-wizard-back" ${wizard.step === 0 ? "disabled" : ""}>Back</button>
        <button class="pf-btn pf-btn-primary" data-action="ministry-wizard-next">${last ? "Finish" : "Next"}</button>
      </div>
    </section>
  `;
}

// Each guide is a big, bold expandable section: scan the titles, open the
// one you're working on, and everything else stays out of the way.
function renderMinistryCard(store, card, storeObj) {
  const wizard = ministryWizardFor(store, card.key);
  const filled = ministryFilled(storeObj, card.key, card.fields);
  const body = wizard
    ? renderMinistryWizard(card, wizard)
    : filled
      ? renderMinistryCardFilled(store, card, storeObj)
      : `
      <section class="pf-card-box pf-checklist-card" style="margin-top:10px;">
        <p class="pf-helper" style="margin-bottom:10px;">${card.fields.length} real questions, one at a time - starting with: "${escapeHtml(ministryQuestion(store, card.key, card.fields[0]) || card.fields[0])}" Each question comes with starters drawn from your sermon, so you never begin from a blank box. Or let Sermon Guide draft the whole section from your sermon.</p>
        <div class="pf-modal-actions" style="margin-top:0;justify-content:flex-start;">
          <button class="pf-btn pf-btn-primary" data-action="ministry-wizard-start" data-store="${attr(store)}" data-key="${attr(card.key)}">Start the questions</button>
          ${ui.drafting === `${store}.${card.key}` ? renderDraftingIndicator("Drafting from your sermon…") : `<button class="pf-btn" data-action="guide-draft" data-spec="${attr(`${store}.${card.key}`)}" ${ui.drafting ? "disabled" : ""}>Draft with Sermon Guide</button>`}
        </div>
      </section>
    `;
  const specKey = `${store}.${card.key}`;
  const stayOpen = wizard || ui.ministryEdit === specKey || ui.ministryOpen === specKey;
  return `
    <details class="pf-ministry-acc" ${stayOpen ? "open" : ""}>
      <summary>
        <span class="pf-ministry-acc-title">${escapeHtml(card.title)}</span>
        <span class="pf-ministry-acc-desc">${escapeHtml(card.desc)}</span>
        <span class="pf-lib-badge ${filled ? "done" : ""}">${filled ? "Drafted ✓" : "Not started"}</span>
      </summary>
      ${body}
    </details>
  `;
}

function renderMinistryCardFilled(store, card, storeObj) {
  const specKey = `${store}.${card.key}`;
  const drafting = ui.drafting === specKey;
  const editing = ui.ministryEdit === specKey;
  const active = getActive();
  return `
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-ministry-actions" style="justify-content:flex-end;flex-wrap:wrap;margin-bottom:12px;">
        ${
          editing
            ? `<button class="pf-btn pf-btn-primary" data-action="ministry-edit-done" data-store="${attr(store)}" data-key="${attr(card.key)}">Done editing</button>`
            : `<button class="pf-btn" data-action="ministry-edit" data-store="${attr(store)}" data-key="${attr(card.key)}">Edit</button>
               <button class="pf-btn" data-action="ministry-copy-formatted" data-store="${attr(store)}" data-key="${attr(card.key)}" title="Copies with formatting - paste into Docs, Word, or email">Copy formatted</button>
               <button class="pf-btn pf-btn-ghost" data-action="ministry-wizard-start" data-store="${attr(store)}" data-key="${attr(card.key)}" title="Walk the questions again, one at a time">Revisit questions</button>
               ${drafting ? renderDraftingIndicator("Drafting from your sermon…") : `<button class="pf-btn pf-btn-ghost" data-action="guide-draft" data-spec="${attr(specKey)}" ${ui.drafting ? "disabled" : ""}>Draft with Sermon Guide</button>`}`
        }
      </div>
      ${
        editing
          ? `<textarea class="pf-ws-input pf-ministry-area" rows="${Math.max(6, card.fields.length + 2)}" data-action="ministry-field" data-store="${attr(store)}" data-key="${attr(card.key)}">${escapeHtml(ministryValue(ministryStore(store), card.key, card.fields))}</textarea>`
          : ministryDocHtml(active, store, card)
      }
    </section>
  `;
}

function renderLensNotice() {
  return state.lens?.enabled
    ? `<span class="pf-lens-notice on" data-action="open-lens" role="button">Using Congregational Lens</span>`
    : `<span class="pf-lens-notice" data-action="open-lens" role="button">Congregational Lens off - set your church context</span>`;
}

function debriefAvailable(sermon) {
  if (isPreachedSermon(sermon) || sermon.preached) return true;
  const days = daysUntil(sermon.date);
  return days !== null && days < 0;
}

// ---- Impact view (per-sermon ministry response) ----
// Chooser-first: the landing view shows the sermon summary and one card per
// tool; opening a tool shows only that tool. No more one long scroll.
const IMPACT_TOOLS = [
  {
    key: "plan",
    title: "Impact Plan",
    desc: "Church-wide alignment: what staff, the prayer team, communications, and worship planning need from this sermon.",
  },
  {
    key: "shepherd",
    title: "Shepherding",
    desc: "Pastoral care pathways for the responses this message may surface - conviction, grief, questions, decisions.",
  },
  {
    key: "pack",
    title: "Discipleship Pack",
    desc: "Group guides, family worship, personal devotion, and next steps - so the sermon doesn't die on Sunday.",
  },
];

const IMPACT_TOOL_TITLES = { plan: "Impact Plan", shepherd: "Shepherding", pack: "Discipleship Pack" };

// How many sections of a ministry store have real writing in them.
function ministryFilledCount(store) {
  return Object.entries(store || {}).filter(
    ([key, value]) => typeof value === "string" && value.trim() && key !== "summary.emphasis",
  ).length;
}

function renderImpact(active) {
  if (!active) {
    return `
      <div class="pf-page pf-page-read pf-fade">
        <div class="pf-empty">Start a sermon first - the ministry response is built from your actual sermon work.
          <div style="margin-top:14px;"><button class="pf-btn pf-btn-primary" data-action="new-sermon">Start a sermon</button></div>
        </div>
      </div>
    `;
  }
  const tab = IMPACT_TOOL_TITLES[ui.impactTab] ? ui.impactTab : "home";
  if (tab !== "home") return renderImpactTool(active, tab);

  const bigIdea = worksheetValue(active, "aim", "burden").trim();
  const burden = worksheetValue(active, "aim", "fallen").trim();
  const purpose = worksheetValue(active, "aim", "purpose").trim();
  const thin = !bigIdea && !(active.outline || []).some((m) => m.title.trim());
  const debriefOpen = debriefAvailable(active);
  const stores = { plan: active.impact, shepherd: active.shepherd, pack: active.pack };

  return `
    <div class="pf-page pf-page-read pf-fade">
      <div class="pf-page-head" style="display:block;margin-bottom:20px;">
        <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">Ministry response</span>
        <h1 class="pf-h1">Turn Sunday's sermon into a week of ministry</h1>
        <p class="pf-page-sub">All drawn from <strong>${escapeHtml(active.passage || "this sermon")}</strong>. Pick the tool you need right now - each opens on its own, so you only see what you're working on. ${renderLensNotice()}</p>
      </div>

      <section class="pf-card-box pf-checklist-card" style="margin-bottom:18px;">
        <div class="pf-impact-summary">
          <div><span class="pf-label">Passage</span><p>${escapeHtml(active.passage || "-")}</p></div>
          <div><span class="pf-label">Title</span><p>${escapeHtml(active.title || "-")}</p></div>
          <div><span class="pf-label">Big idea</span><p>${bigIdea ? escapeHtml(bigIdea) : '<em>Not yet - set it in The Aim phase.</em>'}</p></div>
          <div><span class="pf-label">Pastoral burden</span><p>${burden ? escapeHtml(burden) : "-"}</p></div>
          <div><span class="pf-label">Primary response</span><p>${purpose ? escapeHtml(purpose) : "-"}</p></div>
        </div>
        <div class="pf-ws-field" style="margin-top:12px;">
          <label class="pf-label">This week's ministry emphasis</label>
          <textarea class="pf-ws-input" rows="2" data-action="ministry-field" data-store="impact" data-key="summary.emphasis" placeholder="The one thing every ministry should reinforce this week.">${escapeHtml(active.impact["summary.emphasis"] || "")}</textarea>
        </div>
      </section>

      ${thin ? `<div class="pf-empty" style="margin-bottom:18px;">This sermon's big idea and outline are still thin - the more sermon work you bring, the more faithful these drafts will be. <button class="pf-btn pf-btn-ghost" data-view="workspace">Back to the Workspace</button></div>` : ""}

      <div class="pf-tool-cards">
        ${IMPACT_TOOLS.map((tool) => {
          const filled = ministryFilledCount(stores[tool.key]);
          return `
            <button class="pf-tool-card" data-action="impact-tab" data-tab="${tool.key}">
              <span class="pf-tool-card-title">${escapeHtml(tool.title)}</span>
              <span class="pf-tool-card-desc">${escapeHtml(tool.desc)}</span>
              <span class="pf-tool-card-meta">${filled ? `${filled} section${filled === 1 ? "" : "s"} drafted` : "Not started"} <span class="pf-tool-card-go">Open →</span></span>
            </button>
          `;
        }).join("")}
        <button class="pf-tool-card" data-view="sharing">
          <span class="pf-tool-card-title">Sharing &amp; Delivery</span>
          <span class="pf-tool-card-desc">Get every resource ready and share read-only links with production, groups, staff, and the church.</span>
          <span class="pf-tool-card-meta">Resource delivery & share links <span class="pf-tool-card-go">Open →</span></span>
        </button>
        <button class="pf-tool-card ${debriefOpen ? "" : "locked"}" data-action="${debriefOpen ? "open-debrief" : "impact-tab-locked"}" data-sermon="${attr(active.id)}">
          <span class="pf-tool-card-title">Debrief</span>
          <span class="pf-tool-card-desc">After Sunday: what landed, what was unclear, what should shape future preaching. Attached to this sermon and searchable later.</span>
          <span class="pf-tool-card-meta">${debriefOpen ? (debriefFilled(active) ? "In progress" : "Ready - the sermon has been preached") : "Opens after the sermon is preached"} <span class="pf-tool-card-go">${debriefOpen ? "Open →" : "🔒"}</span></span>
        </button>
      </div>

      <p class="pf-helper" style="margin-top:20px;">${MINISTRY_DISCLAIMER}</p>
    </div>
  `;
}

function renderImpactTool(active, tab) {
  return `
    <div class="pf-page pf-page-read pf-fade">
      <div class="pf-page-head" style="display:block;margin-bottom:18px;">
        <button class="pf-btn pf-btn-ghost" data-action="impact-home" style="margin-bottom:12px;">&larr; Ministry response</button>
        <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">${escapeHtml(active.passage || "This sermon")}</span>
        <h1 class="pf-h1">${escapeHtml(IMPACT_TOOL_TITLES[tab])}</h1>
        ${renderLensNotice() ? `<p class="pf-page-sub">${renderLensNotice()}</p>` : ""}
      </div>
      ${tab === "plan" ? renderImpactPlanTab(active) : ""}
      ${tab === "shepherd" ? renderShepherdTab(active) : ""}
      ${tab === "pack" ? renderPackTab(active) : ""}
      <p class="pf-helper" style="margin-top:20px;">${MINISTRY_DISCLAIMER}</p>
    </div>
  `;
}

function renderImpactPlanTab(active) {
  return `
    <p class="pf-page-sub" style="margin-bottom:18px;">Church-wide ministry action: what staff, the prayer team, communications, and worship planning need from this sermon. Group and family resources live in the <button class="pf-inline-link" data-action="impact-tab" data-tab="pack">Discipleship Pack</button>; pastoral-care planning lives in <button class="pf-inline-link" data-action="impact-tab" data-tab="shepherd">Shepherding</button>.</p>
    ${IMPACT_CARDS.map((card) => renderMinistryCard("impact", card, active.impact)).join("")}
  `;
}

function renderShepherdTab(active) {
  return `
    <p class="pf-page-sub" style="margin-bottom:14px;">Turn sermon conviction into pastoral care - the responses this message may surface and the follow-up pathways for them.</p>
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head"><span class="pf-eyebrow">Likely responses</span></div>
      ${renderChipGroup("shepherd", "responses", SHEPHERD_RESPONSES, active.shepherd.responses)}
    </section>
    ${SHEPHERD_CARDS.map((card) => renderMinistryCard("shepherd", card, active.shepherd)).join("")}
  `;
}

function renderPackTab(active) {
  return `
    <p class="pf-page-sub" style="margin-bottom:18px;">Don't let the sermon die on Sunday - resources for groups, families, personal reflection, prayer, and next steps.</p>
    ${PACK_CARDS.map((card) => renderMinistryCard("pack", card, active.pack)).join("")}
  `;
}

const DEBRIEF_FIELDS = [
  ["landed", "What landed?", "What seemed clear, weighty, or helpful to the church?"],
  ["unclear", "What felt unclear?", "Where did the sermon feel muddy, rushed, over-explained, or underdeveloped?"],
  ["sharpen", "What would I cut or strengthen?", "What should have been shorter, sharper, clearer, or more direct?"],
];

const DEBRIEF_CARDS = [
  {
    key: "followup",
    title: "Pastoral follow-up needed",
    desc: "Broad categories only - no names or confidential details.",
    fields: ["People / categories to follow up with", "Issues to address", "Resources to send", "Meetings to schedule", "Staff / elder notes"],
  },
  {
    key: "future",
    title: "What should shape future preaching?",
    desc: "Carry Sunday's lessons forward into the calendar.",
    fields: ["Revisit this doctrine", "Clarify this issue", "Series idea", "One-off sermon idea", "Address in family groups", "Address with staff / elders"],
  },
  {
    key: "growth",
    title: "Preacher growth reflection",
    desc: "Notice, don't grade. What did you learn about your own preaching?",
    fields: ["Delivery", "Clarity", "Tone", "Structure", "Application", "Gospel clarity", "Time management"],
  },
];

// Has any debrief writing been recorded on this sermon?
function debriefFilled(sermon) {
  const debrief = sermon?.debrief || {};
  if (Array.isArray(debrief.responses) && debrief.responses.length) return true;
  return Object.values(debrief).some((value) => typeof value === "string" && value.trim());
}

// Preached (or past-date) sermons, most recent first - the debrief candidates.
function debriefCandidates() {
  return state.sermons
    .filter((sermon) => debriefAvailable(sermon))
    .sort((a, b) => (b.date || "").localeCompare(a.date || "") || b.createdAt.localeCompare(a.createdAt));
}

// Only sermons still needing review appear in the picker; completed and
// skipped debriefs live with their sermon in the Notes section.
function debriefTargets() {
  return debriefCandidates().filter((sermon) => !sermon.debriefStatus);
}

function debriefSearchText(sermon) {
  const debrief = sermon?.debrief || {};
  const pieces = Object.values(debrief).flatMap((value) =>
    typeof value === "string" ? [value] : Array.isArray(value) ? value : [],
  );
  return [sermon.passage, sermon.title, sermon.series, ...pieces].join(" ").toLowerCase();
}

// The most recent preached sermon that hasn't been debriefed yet - the
// "first thing to do this week" before new prep starts.
function pendingDebriefSermon() {
  return debriefTargets().find((sermon) => !debriefFilled(sermon)) || null;
}

function closeDebrief(sermon, status) {
  sermon.debriefStatus = status;
  sermon.updatedAt = new Date().toISOString();
  saveState();
  ui.debriefSermonId = "";
  showBanner(
    status === "done"
      ? `Debrief complete - it's filed with ${sermon.passage || "the sermon"} in Notes.`
      : `Marked as no debrief needed - noted with ${sermon.passage || "the sermon"} in Notes.`,
  );
  render();
}

// ---- Resource Delivery + Sharing and Delivery Center ----
// Finished ministry resources with a status, plus secure read-only share
// links. Share links never carry the Preaching Profile, Congregational
// Lens, private notes, or the Post-Sermon Debrief unless a section is
// explicitly turned on - and those four are never even offered by default.
const DELIVERY_RESOURCES = [
  { key: "staff", label: "Staff Alignment", store: "impact", field: "staff" },
  { key: "group", label: "Family Group Guide", store: "pack", field: "group" },
  { key: "prayer", label: "Prayer Team Prompts", store: "impact", field: "prayer" },
  { key: "shepherd", label: "Shepherding Follow-Up", store: "shepherd", field: "care" },
  { key: "family", label: "Parent & Family Discipleship", store: "pack", field: "family" },
  { key: "worship", label: "Worship & Service Planning", store: "impact", field: "worship" },
  { key: "personal", label: "Personal Reflection Guide", store: "pack", field: "personal" },
  { key: "devotional", label: "Seven-Day Devotional", store: "pack", field: "devotional" },
  { key: "memory", label: "Memory Verse Card", store: "pack", field: "memory" },
  { key: "nextsteps", label: "Weekly Next Steps", store: "pack", field: "nextsteps" },
];

const DELIVERY_STATUSES = [
  ["drafted", "Drafted"],
  ["reviewed", "Reviewed"],
  ["ready", "Ready"],
  ["shared", "Shared"],
];

function deliveryText(sermon, resource) {
  const value = sermon?.[resource.store]?.[resource.field];
  return typeof value === "string" ? value : "";
}

function deliveryStatus(sermon, resource) {
  const text = deliveryText(sermon, resource).trim();
  if (!text) return "none";
  const manual = sermon.delivery?.[resource.key];
  return ["reviewed", "ready", "shared"].includes(manual) ? manual : "drafted";
}

function deliveryStatusLabel(status) {
  return { none: "Not started", drafted: "Drafted", reviewed: "Reviewed", ready: "Ready", shared: "Shared" }[status] || "Not started";
}


// ---- share links ----
const SHARE_KINDS = [
  {
    key: "preacher",
    label: "Preacher Link",
    desc: "A read-only Pulpit View for your own device or a backup - notes, Scripture, points, and timing.",
    sections: [
      ["notes", "Preaching notes (sections)", true],
      ["personal", "Personal preaching notes", true],
      ["timer", "Timer settings", true],
    ],
  },
  {
    key: "production",
    label: "Production Team Link",
    desc: "What the media team needs: outline, slide cues, on-screen text, Scripture references.",
    sections: [
      ["bigidea", "Big idea", true],
      ["outline", "Sermon outline", true],
      ["slides", "Slide cues & on-screen text", true],
      ["scripture", "Scripture references", true],
      ["live", "Follow live section", false],
    ],
  },
  {
    key: "group",
    label: "Family Group Link",
    desc: "A ready-to-use guide for group leaders.",
    sections: [
      ["bigidea", "Big idea", true],
      ["guide", "Group guide & questions", true],
      ["prayer", "Prayer prompts", false],
    ],
  },
  {
    key: "pack",
    label: "Discipleship Pack Link",
    desc: "The weekly discipleship resource for members and families.",
    sections: [
      ["personal", "Personal reflection guide", true],
      ["family", "Parent conversation guide", true],
      ["devotional", "Seven-day devotional", true],
      ["memory", "Memory verse", true],
      ["nextsteps", "Weekly next steps", true],
    ],
  },
  {
    key: "staff",
    label: "Staff Alignment Link",
    desc: "A read-only ministry alignment page for staff and key leaders.",
    sections: [
      ["summary", "Sermon summary & burden", true],
      ["emphasis", "Ministry emphasis", true],
      ["followup", "Follow-up needs", true],
      ["prayer", "Prayer burden", true],
      ["nextsteps", "Church-wide next steps", true],
    ],
  },
];

function shareToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function shareLink(sermon, kind) {
  const def = SHARE_KINDS.find((item) => item.key === kind);
  const existing = sermon.shareLinks[kind];
  if (existing && existing.sections) return existing;
  const sections = {};
  def.sections.forEach(([key, , fallback]) => {
    sections[key] = fallback;
  });
  sermon.shareLinks[kind] = { token: "", createdAt: "", updatedAt: "", expiresAt: "", revoked: false, dirty: false, sections, ...(existing || {}) };
  return sermon.shareLinks[kind];
}

function shareUrl(link) {
  return `${window.location.origin}${window.location.pathname.replace(/app$/, "").replace(/\/$/, "")}/share.html?t=${link.token}`;
}

function sharePlain(value) {
  return typeof value === "string" ? value.trim() : "";
}

// Build exactly what a link is allowed to carry - and nothing else.
function buildSharePayload(sermon, kind) {
  const link = shareLink(sermon, kind);
  const on = (key) => link.sections[key] !== false;
  const def = SHARE_KINDS.find((item) => item.key === kind);
  const bigIdea = worksheetValue(sermon, "aim", "burden").trim();
  const header = {
    title: sermon.title || "",
    passage: sermon.passage || "",
    series: sermon.series || "",
    date: sermon.date || "",
    bigIdea: kind === "preacher" || on("bigidea") ? bigIdea : "",
  };
  const blocks = [];
  const add = (label, text) => {
    if (sharePlain(text)) blocks.push({ label, text: sharePlain(text) });
  };

  if (kind === "preacher") {
    if (on("timer") && sermon.length) add("Timing", `Target length: ${sermon.length} minutes`);
    if (on("notes")) {
      pulpitSections(sermon).forEach((section) => {
        const template = document.createElement("template");
        template.innerHTML = section.html;
        if (!on("personal")) template.content.querySelectorAll(".pf-b-note").forEach((node) => node.remove());
        add(section.title, template.content.textContent.replace(/\n{3,}/g, "\n\n"));
      });
    }
  }
  if (kind === "production") {
    if (on("outline")) {
      add("Outline", (sermon.outline || []).filter((m) => m.title.trim()).map((m, i) => `${i + 1}. ${m.title}${m.sub ? ` - ${m.sub}` : ""}`).join("\n"));
    }
    if (on("slides")) {
      const template = document.createElement("template");
      template.innerHTML = sanitizeRichHtml(sermon.slidesDoc || generateSlidesDoc(sermon));
      const text = [...template.content.querySelectorAll("p, li")].map((node) => node.textContent.trim()).filter(Boolean).join("\n");
      if (text) add("Slides", text);
    }
    if (on("scripture")) {
      const template = document.createElement("template");
      template.innerHTML = sanitizeRichHtml(phaseNoteHtml(sermon, manuscriptPhaseDef()));
      const refs = [...template.content.querySelectorAll('.pf-b-scripture[data-production="1"]')]
        .map((node) => node.getAttribute("data-ref"))
        .filter(Boolean);
      add("Scripture references", refs.join("\n"));
    }
  }
  if (kind === "group") {
    if (on("guide")) add("Group guide", deliveryText(sermon, DELIVERY_RESOURCES.find((r) => r.key === "group")));
    if (on("prayer")) add("Prayer prompts", sermon.impact?.prayer);
  }
  if (kind === "pack") {
    ["personal", "family", "devotional", "memory", "nextsteps"].forEach((key) => {
      if (!on(key)) return;
      const resource = DELIVERY_RESOURCES.find((r) => r.key === key);
      add(resource.label, deliveryText(sermon, resource));
    });
  }
  if (kind === "staff") {
    if (on("summary")) add("Summary & burden", [bigIdea, worksheetValue(sermon, "aim", "fallen").trim()].filter(Boolean).join("\n"));
    if (on("emphasis")) add("Ministry emphasis", sermon.impact?.["summary.emphasis"]);
    if (on("followup")) add("Follow-up needs", sermon.shepherd?.care);
    if (on("prayer")) add("Prayer burden", sermon.impact?.prayer);
    if (on("nextsteps")) add("Church-wide next steps", sermon.pack?.nextsteps);
  }

  return {
    v: 1,
    kind,
    label: def.label,
    header,
    blocks,
    follow: kind === "production" && on("live"),
    currentSection: "",
  };
}

function shareReady() {
  return Boolean(ui.auth.client && ui.auth.user);
}

async function pushSharedView(sermon, kind, options = {}) {
  const link = shareLink(sermon, kind);
  if (!link.token) return false;
  if (!shareReady()) {
    showBanner("Sign in and sync this sermon to create live share links.");
    return false;
  }
  const payload = buildSharePayload(sermon, kind);
  if (options.currentSection) payload.currentSection = options.currentSection;
  const { error } = await ui.auth.client.from("preach_flow_shared_views").upsert(
    {
      token: link.token,
      user_id: ui.auth.user.id,
      sermon_id: sermon.id,
      kind,
      payload,
      revoked: false,
      expires_at: link.expiresAt || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "token" },
  );
  if (error) {
    showBanner(`Share update failed: ${error.message}`);
    return false;
  }
  link.updatedAt = new Date().toISOString();
  link.dirty = false;
  link.revoked = false;
  saveState();
  return true;
}

async function revokeSharedView(sermon, kind) {
  const link = shareLink(sermon, kind);
  if (link.token && shareReady()) {
    await ui.auth.client
      .from("preach_flow_shared_views")
      .update({ revoked: true, updated_at: new Date().toISOString() })
      .eq("token", link.token);
  }
  link.revoked = true;
  saveState();
}

// Local read-only preview of exactly what a link would show - works
// offline and without an account.
function openSharePreview(sermon, kind) {
  const payload = buildSharePayload(sermon, kind);
  const win = window.open("", "_blank");
  if (!win) return;
  const metaLine = [payload.header.passage, payload.header.series, payload.header.date].filter(Boolean).join(" · ");
  // Match share.html exactly, so the preview shows what the link will show.
  win.document.write(`
    <title>${escapeHtml(payload.label)} - preview</title>
    <style>
      :root { color-scheme: light dark; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: "Mulish", -apple-system, "Segoe UI", sans-serif; background: #f4fbfe; color: #20242a; line-height: 1.75; }
      .topbar { display: flex; align-items: center; gap: 10px; max-width: 860px; margin: 0 auto; padding: 22px 22px 0; font-weight: 800; font-size: 17px; }
      .topbar img { width: 34px; height: 34px; }
      .topbar b { color: #dc6a12; }
      .wrap { max-width: 860px; margin: 0 auto; padding: 20px 22px 70px; }
      .paper { background: #ffffff; border: 1px solid #e0e5eb; border-radius: 18px; box-shadow: 0 14px 40px rgba(32,36,42,0.07); padding: 48px 54px 56px; }
      .kind { font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; font-size: 11px; color: #dc6a12; margin: 0 0 10px; }
      h1 { margin: 0 0 6px; font-size: 30px; line-height: 1.2; }
      .meta { color: #5e6c7a; margin: 0; font-size: 15px; }
      .bigidea { font-weight: 700; margin: 18px 0 0; font-size: 17.5px; line-height: 1.55; padding: 14px 18px; border-left: 3px solid #ff953e; background: rgba(255,149,62,0.08); border-radius: 0 10px 10px 0; }
      .section { margin-top: 34px; }
      .section + .section { border-top: 1px dashed #e0e5eb; padding-top: 30px; }
      h2 { font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; margin: 0 0 12px; color: #dc6a12; }
      .pf-guide-doc { font-size: 16.5px; }
      .pf-guide-doc p { margin: 0 0 12px; }
      .pf-guide-doc p:last-child { margin-bottom: 0; }
      .pf-guide-doc ul, .pf-guide-doc ol { margin: 4px 0 14px; padding-left: 24px; }
      .pf-guide-doc li { margin: 5px 0; }
      .pf-guide-doc strong { font-weight: 800; }
      .pf-guide-doc h3, .pf-guide-doc h4, .pf-guide-doc h5 { margin: 14px 0 6px; font-size: 15px; }
      .note { margin-top: 40px; font-size: 12.5px; color: #5e6c7a; }
      @media (prefers-color-scheme: dark) {
        body { background: #16181c; color: #ece9e2; }
        .paper { background: #1e2228; border-color: #343b44; }
        .meta, .note { color: #9aa2ad; }
        .section + .section { border-top-color: #343b44; }
      }
      @media (max-width: 640px) { .paper { padding: 28px 22px 36px; border-radius: 14px; } }
    </style>
    <body>
      <div class="topbar"><img src="./assets/preach-flow-mark.svg?v=ofc-4" alt="" /><span>Preach<b>Flow</b></span></div>
      <div class="wrap">
        <div class="paper">
          <p class="kind">${escapeHtml(payload.label)} · preview</p>
          <h1>${escapeHtml(payload.header.title || payload.header.passage || "Sermon")}</h1>
          ${metaLine ? `<p class="meta">${escapeHtml(metaLine)}</p>` : ""}
          ${payload.header.bigIdea ? `<p class="bigidea">${escapeHtml(payload.header.bigIdea)}</p>` : ""}
          ${payload.blocks.map((block) => `<div class="section"><h2>${escapeHtml(block.label)}</h2>${formatGuideHtml(block.text)}</div>`).join("") || `<p class="note" style="margin-top:26px;">Nothing to show yet - draft the underlying resources first.</p>`}
          <p class="note">Read-only preview. The live link shows the same content.</p>
        </div>
      </div>
    </body>`);
  win.document.close();
}

function renderSharingCenter(active) {
  if (!active) return renderNeedSermon("The Sharing and Delivery Center works from your current sermon - start one first.");
  const bigIdea = worksheetValue(active, "aim", "burden").trim();
  const purpose = worksheetValue(active, "aim", "purpose").trim();
  const statuses = DELIVERY_RESOURCES.map((resource) => deliveryStatus(active, resource));
  const readyCount = statuses.filter((status) => status === "ready" || status === "shared").length;
  const sharedCount = statuses.filter((status) => status === "shared").length;
  const draftedCount = statuses.filter((status) => status !== "none").length;
  const nextStep = !draftedCount
    ? "Draft your first resource - start with the Family Group Guide."
    : readyCount < draftedCount
      ? "Review drafted resources and mark them ready."
      : !sharedCount
        ? "Create a share link and send the first resource out."
        : "Carry the message into the week - everything is moving.";

  return `
    <div class="pf-page pf-page-wide pf-fade">
      <div class="pf-page-head" style="display:block;margin-bottom:18px;">
        <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">Sharing and Delivery Center</span>
        <h1 class="pf-h1">When you need to hand something to someone, it's here</h1>
        <p class="pf-page-sub">Two things live on this page, and neither is required. <strong>Resource delivery</strong> turns the work you've already done into hand-off documents (a group guide, a staff brief, a devotional) you can copy or export. <strong>Share links</strong> are secure, read-only web links for your team. Come here when you want one; skip it when you don't.</p>
      </div>

      <h2 class="pf-lib-group-head">Resource delivery <span>${DELIVERY_RESOURCES.length}</span></h2>
      <p class="pf-helper" style="margin:2px 0 14px;">Each resource is built from your Impact Plan, Shepherding, and Discipleship Pack work. Pick the one you actually need this week; "Draft with Sermon Guide" gives it a starting point from your sermon.</p>
      <div class="pf-delivery-grid">
        ${DELIVERY_RESOURCES.map((resource) => {
          const status = deliveryStatus(active, resource);
          const specKey = `${resource.store}.${resource.field}`;
          return `
            <div class="pf-delivery-card">
              <div class="pf-delivery-head">
                <strong>${escapeHtml(resource.label)}</strong>
                <span class="pf-lib-badge ${status === "ready" || status === "shared" ? "done" : ""}">${deliveryStatusLabel(status)}</span>
              </div>
              <div class="pf-delivery-actions">
                ${status === "none" && DRAFT_SPECS[specKey] ? (ui.drafting === specKey ? renderDraftingIndicator(`Drafting the ${resource.label.toLowerCase()} from your sermon…`) : `<button class="pf-btn pf-btn-primary" data-action="guide-draft" data-spec="${attr(specKey)}" ${ui.drafting ? "disabled" : ""}>Draft with Sermon Guide</button>`) : ""}
                <button class="pf-btn pf-btn-ghost" data-action="delivery-edit" data-store="${attr(resource.store)}">Edit</button>
                ${status !== "none" ? `
                  <button class="pf-btn pf-btn-ghost" data-action="delivery-copy" data-key="${attr(resource.key)}">Copy</button>
                  <button class="pf-btn pf-btn-ghost" data-action="delivery-export" data-key="${attr(resource.key)}" data-format="pdf">PDF</button>
                  <button class="pf-btn pf-btn-ghost" data-action="delivery-export" data-key="${attr(resource.key)}" data-format="doc">Word</button>` : ""}
              </div>
            </div>
          `;
        }).join("")}
      </div>

      <h2 class="pf-lib-group-head" style="margin-top:34px;">Share links <span>${SHARE_KINDS.length}</span></h2>
      <p class="pf-helper" style="margin:2px 0 14px;">Read-only web pages for specific people: your own backup device, the production team, group leaders, or staff. Create a link only when someone needs one; each is unguessable, revocable, and controlled below.</p>
      ${
        shareReady()
          ? ""
          : `<div class="pf-empty" style="margin-bottom:16px;">Live share links need an account so they can be served from the cloud. ${ui.auth.user ? "Reconnecting to your account…" : `<button class="pf-inline-link" data-action="go-signin">Sign in</button> to enable them.`}</div>`
      }
      <div class="pf-share-grid">
        ${SHARE_KINDS.map((def) => renderShareCard(active, def)).join("")}
      </div>
      <p class="pf-helper" style="margin-top:18px;">Share links are unguessable, revocable, and read-only. They never include your account, Preaching Profile, Congregational Lens, private notes, or Post-Sermon Debrief.</p>
    </div>
  `;
}

function renderShareCard(active, def) {
  const link = shareLink(active, def.key);
  const status = link.revoked ? "Revoked" : link.token ? "Public - anyone with the link" : "Unshared";
  return `
    <div class="pf-share-card">
      <div class="pf-delivery-head">
        <strong>${escapeHtml(def.label)}</strong>
        <span class="pf-lib-badge ${link.token && !link.revoked ? "done" : ""}">${status}</span>
      </div>
      <p class="pf-tool-card-desc" style="margin:4px 0 10px;">${escapeHtml(def.desc)}</p>
      <details class="pf-share-fold">
        <summary>What this link includes</summary>
        <div class="pf-share-sections">
          ${def.sections
            .map(
              ([key, label]) => `
                <label class="pf-toggle-row" style="margin-top:0;">
                  <input type="checkbox" data-action="share-section" data-kind="${attr(def.key)}" data-key="${attr(key)}" ${link.sections[key] !== false ? "checked" : ""} />
                  <span>${escapeHtml(label)}</span>
                </label>
              `,
            )
            .join("")}
        </div>
      </details>
      <div class="pf-share-meta">
        <label class="pf-label" style="display:flex;align-items:center;gap:8px;">Expires
          <input class="pf-input" type="date" style="width:auto;padding:6px 10px;" data-action="share-expires" data-kind="${attr(def.key)}" value="${attr((link.expiresAt || "").slice(0, 10))}" />
        </label>
        ${link.updatedAt ? `<span class="pf-helper">Updated ${escapeHtml(formatTime(link.updatedAt))}${link.dirty ? " · changes not pushed yet" : ""}</span>` : ""}
      </div>
      <div class="pf-delivery-actions">
        ${
          link.token && !link.revoked
            ? `
          <button class="pf-btn pf-btn-ghost" data-action="share-copy" data-kind="${attr(def.key)}">Copy link</button>
          <button class="pf-btn pf-btn-ghost" data-action="share-update" data-kind="${attr(def.key)}">Update now</button>
          <button class="pf-btn pf-btn-ghost" data-action="share-regenerate" data-kind="${attr(def.key)}">Regenerate</button>
          <button class="pf-btn pf-btn-ghost pf-lib-delete" data-action="share-revoke" data-kind="${attr(def.key)}">Revoke</button>`
            : `<button class="pf-btn pf-btn-primary" data-action="share-create" data-kind="${attr(def.key)}">Create link</button>`
        }
        <button class="pf-btn pf-btn-ghost" data-action="share-preview" data-kind="${attr(def.key)}">Preview</button>
      </div>
    </div>
  `;
}

function renderDebriefPage() {
  const targets = debriefTargets();
  if (!targets.length && debriefCandidates().length) {
    return `
      <div class="pf-page pf-page-read pf-fade">
        <div class="pf-page-head" style="display:block;margin-bottom:20px;">
          <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">Debrief</span>
          <h1 class="pf-h1">All caught up</h1>
          <p class="pf-page-sub">Every preached sermon has been debriefed (or marked as not needing one). Completed debriefs are filed with their sermons in <button class="pf-inline-link" data-view="journal">Notes</button>.</p>
        </div>
        <div class="pf-empty">The next sermon you preach will show up here for review.</div>
      </div>
    `;
  }
  if (!targets.length) {
    return `
      <div class="pf-page pf-page-read pf-fade">
        <div class="pf-page-head" style="display:block;margin-bottom:20px;">
          <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">Debrief</span>
          <h1 class="pf-h1">Learn from last Sunday before you build the next one</h1>
          <p class="pf-page-sub">Once a sermon is preached (or its date passes), it shows up here to debrief: what landed, what was unclear, what should shape future preaching. Each debrief stays attached to its sermon so you can look it up later.</p>
        </div>
        <div class="pf-empty">No preached sermons yet. After your first Sunday with Preach Flow, the debrief becomes the first step of every new week.</div>
      </div>
    `;
  }

  const query = ui.debriefQuery.trim().toLowerCase();
  const everything = debriefCandidates();
  const matches = query ? everything.filter((sermon) => debriefSearchText(sermon).includes(query)) : [];
  let selected = everything.find((sermon) => sermon.id === ui.debriefSermonId);
  if (!selected || (selected.debriefStatus && !ui.debriefSermonId)) selected = pendingDebriefSermon() || targets[0];

  return `
    <div class="pf-page pf-page-read pf-fade">
      <div class="pf-page-head" style="display:block;margin-bottom:20px;">
        <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">Debrief</span>
        <h1 class="pf-h1">Learn from last Sunday before you build the next one</h1>
        <p class="pf-page-sub">There's always a sermon to debrief. Each debrief stays attached to its sermon - search below to recall the feedback on anything you've preached.</p>
      </div>

      <section class="pf-card-box pf-checklist-card">
        <div class="pf-form-grid">
          <div class="pf-field" style="margin-bottom:0;">
            <label class="pf-label" style="display:flex;gap:12px;align-items:baseline;">Sermon to debrief
              ${selected && !selected.debriefStatus ? `<button class="pf-inline-link" data-action="debrief-skip" data-sermon="${attr(selected.id)}" style="font-size:12px;" title="Missed the window? Close this one out without a review.">No debrief necessary</button>` : ""}
            </label>
            <select class="pf-select" data-action="debrief-pick">
              ${targets
                .map(
                  (sermon) =>
                    `<option value="${attr(sermon.id)}" ${sermon.id === selected.id ? "selected" : ""}>${escapeHtml(sermon.passage || "Untitled")}${sermon.date ? ` - ${escapeHtml(fmtDate(sermon.date))}` : ""}${debriefFilled(sermon) ? " · debriefed" : ""}</option>`,
                )
                .join("")}
            </select>
          </div>
          <div class="pf-field" style="margin-bottom:0;">
            <label class="pf-label">Search past debriefs</label>
            <input class="pf-input" data-action="debrief-query" placeholder="Passage, series, or anything you wrote…" value="${attr(ui.debriefQuery)}" />
          </div>
        </div>
        ${
          query
            ? `
          <div class="pf-switcher-list" style="margin-top:12px;">
            ${
              matches.length
                ? matches
                    .map(
                      (sermon) => `
                        <button class="pf-switcher-item" data-action="debrief-pick-btn" data-sermon="${attr(sermon.id)}">
                          <div style="flex:1;min-width:0;">
                            <div class="label">${escapeHtml(sermon.passage || "Untitled")}${sermon.title ? ` - ${escapeHtml(sermon.title)}` : ""}</div>
                            <div class="meta">${sermon.date ? escapeHtml(fmtDate(sermon.date)) : "No date"}${sermon.series ? ` · ${escapeHtml(sermon.series)}` : ""}</div>
                          </div>
                          <span class="pf-badge">${debriefFilled(sermon) ? "Debriefed" : "Not debriefed"}</span>
                        </button>
                      `,
                    )
                    .join("")
                : `<div class="pf-empty" style="margin-top:0;">Nothing matches “${escapeHtml(ui.debriefQuery)}”.</div>`
            }
          </div>
          <button class="pf-btn pf-btn-ghost" data-action="debrief-clear" style="margin-top:10px;">Clear search</button>
        `
            : ""
        }
      </section>

      <div class="pf-page-head" style="display:block;margin:6px 0 14px;">
        <h2 style="font-family:var(--font-display);font-weight:800;font-size:18px;">${escapeHtml(selected.passage || "Untitled")}${selected.title ? ` - ${escapeHtml(selected.title)}` : ""}</h2>
        <p class="pf-helper">${selected.date ? `Preached ${escapeHtml(fmtDate(selected.date))}` : "No date recorded"}${selected.series ? ` · ${escapeHtml(selected.series)}` : ""}</p>
      </div>

      ${renderDebriefForm(selected)}
    </div>
  `;
}

function renderDebriefForm(sermon) {
  const sid = sermon.id;
  return `
    <p class="pf-page-sub" style="margin-bottom:14px;">Learn from Sunday. Reflect on what landed, what was unclear, what surfaced, and what should shape future preaching. <em>Do not store confidential counseling details or sensitive member information here.</em></p>
    ${DEBRIEF_FIELDS.map(
      ([key, label, hint]) => `
        <div class="pf-ws-field">
          <label class="pf-label">${escapeHtml(label)}</label>
          <textarea class="pf-ws-input" rows="3" data-action="ministry-field" data-store="debrief" data-sermon="${attr(sid)}" data-key="${attr(key)}" placeholder="${attr(hint)}">${escapeHtml(sermon.debrief[key] || "")}</textarea>
        </div>
      `,
    ).join("")}
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head"><span class="pf-eyebrow">What responses surfaced?</span></div>
      ${renderChipGroup("debrief", "responses", DEBRIEF_RESPONSES, sermon.debrief.responses, sid)}
    </section>
    ${DEBRIEF_CARDS.map((card) => `
      <section class="pf-card-box pf-checklist-card">
        <div class="pf-checklist-head" style="align-items:flex-start;">
          <div style="min-width:0;">
            <span class="pf-eyebrow">${escapeHtml(card.title)}</span>
            <p class="pf-ministry-desc">${escapeHtml(card.desc)}</p>
          </div>
          <div class="pf-ministry-actions">
            <button class="pf-btn pf-btn-ghost" data-action="ministry-copy" data-store="debrief" data-sermon="${attr(sid)}" data-key="${attr(card.key)}">Copy</button>
          </div>
        </div>
        <textarea class="pf-ws-input pf-ministry-area" rows="${card.fields.length + 2}" data-action="ministry-field" data-store="debrief" data-sermon="${attr(sid)}" data-key="${attr(card.key)}">${escapeHtml(ministryValue(sermon.debrief, card.key, card.fields))}</textarea>
      </section>
    `).join("")}
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head"><span class="pf-eyebrow">${sermon.debriefStatus === "done" ? "Debrief completed ✓" : "Finish the debrief"}</span></div>
      ${
        sermon.debriefStatus === "done"
          ? `<p class="pf-ministry-desc" style="margin-bottom:12px;">This debrief is filed with the sermon in Notes. You can still edit it here.</p>
             <div class="pf-modal-actions" style="margin-top:0;">
               <button class="pf-btn" data-action="debrief-reopen" data-sermon="${attr(sid)}">Reopen for review</button>
             </div>`
          : `<p class="pf-ministry-desc" style="margin-bottom:12px;">When you're done reflecting, complete the debrief. It closes out here and files with the sermon as a debrief note.</p>
             <div class="pf-modal-actions" style="margin-top:0;">
               <button class="pf-btn pf-btn-primary" data-action="debrief-complete" data-sermon="${attr(sid)}">Complete debrief</button>
             </div>`
      }
    </section>
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head"><span class="pf-eyebrow">Carry forward</span></div>
      <p class="pf-ministry-desc" style="margin-bottom:12px;">This debrief stays attached to the sermon and searchable above. Carry the insights into what comes next:</p>
      <div class="pf-modal-actions" style="margin-top:0;">
        <button class="pf-btn" data-action="cf-new-sermon">Start a sermon from an idea</button>
        <button class="pf-btn" data-action="cf-series">Open Series Architect</button>
        <button class="pf-btn" data-action="cf-lens">Note a broad pattern in Congregational Lens</button>
      </div>
    </section>
  `;
}

// ---- Congregational Lens ----
const LENS_FIELDS = [
  ["Church profile", [
    ["profile.name", "Church name", ""],
    ["profile.city", "City / community", ""],
    ["profile.size", "Church size", "e.g. ~120 adults on Sundays"],
    ["profile.style", "Service style", ""],
    ["profile.context", "Primary ministry context", "e.g. church plant, replant, established church"],
    ["profile.demographics", "Demographic notes", "Broad strokes only."],
  ]],
  ["Current ministry season", [
    ["season.now", "What season is the church in right now?", ""],
    ["season.emphasis", "What is the Lord currently emphasizing in the church?", ""],
    ["season.pressures", "What pressures or opportunities is the church facing?", ""],
  ]],
  ["Mission priorities", [
    ["mission.local", "Local mission focus", ""],
    ["mission.outreach", "Outreach priorities", ""],
    ["mission.planting", "Church planting emphasis", ""],
    ["mission.partnerships", "Community partnerships", ""],
    ["mission.evangelism", "Evangelistic burden", ""],
  ]],
  ["Leadership emphases", [
    ["leadership.language", "What language is the church using right now?", ""],
    ["leadership.initiatives", "What initiatives need reinforcement?", ""],
    ["leadership.themes", "What leadership themes need to be repeated?", ""],
  ]],
];

const LENS_EXPLAINER = [
  [
    "What it is",
    "A short profile of your actual church - who they are, what season they're in, what the leadership is emphasizing. You fill it in once and nudge it as seasons change. It belongs to your whole ministry, not to any one sermon.",
  ],
  [
    "What it does",
    "When the lens is on, Sermon Guide reads this profile every time it helps you with application, the Impact Plan, Shepherding drafts, the Discipleship Pack, or series planning. Suggestions start fitting your church - the young families, the new believers, the season you're actually in - instead of a generic congregation.",
  ],
  [
    "How to use it",
    "Fill in what you know below (every field is optional), turn the toggle on, and prepare sermons as normal. Wherever the lens shapes a draft you'll see a small “Using Congregational Lens” notice. Revisit it when the season changes - a few minutes each quarter is plenty.",
  ],
  [
    "What it never does",
    "It never writes your sermon, and it is not a member database. Keep names, counseling situations, and private details out - broad patterns only.",
  ],
];

function renderLens() {
  const lens = state.lens;
  return `
    <div class="pf-page pf-page-read pf-fade">
      <div class="pf-page-head" style="display:block;margin-bottom:20px;">
        <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">Congregational Lens</span>
        <h1 class="pf-h1">Apply sermons with your actual church in view</h1>
        <p class="pf-page-sub">You prepare every sermon for real people, not an audience in the abstract. The Congregational Lens tells Preach Flow who those people are - once - so application and ministry planning land on your church. Entirely optional; the app works without it.</p>
      </div>

      <section class="pf-card-box pf-checklist-card">
        <div class="pf-lens-explain">
          ${LENS_EXPLAINER.map(
            ([title, body]) => `
              <div class="pf-lens-explain-item">
                <span class="pf-eyebrow">${escapeHtml(title)}</span>
                <p>${escapeHtml(body)}</p>
              </div>
            `,
          ).join("")}
        </div>
      </section>

      <div class="pf-lens-privacy">Congregational Lens is for broad church context, not confidential counseling notes or private member details. Do not store names, counseling situations, or sensitive personal data here.</div>

      <section class="pf-card-box pf-checklist-card">
        <label class="pf-toggle-row" style="margin-top:0;">
          <input type="checkbox" data-action="lens-toggle" ${lens.enabled ? "checked" : ""} />
          <span><strong>Use Congregational Lens</strong> when Sermon Guide helps with application, ministry drafts, and series planning. A small "Using Congregational Lens" notice appears wherever it's applied.</span>
        </label>
      </section>

      ${LENS_FIELDS.map(
        ([groupTitle, fields]) => `
          <section class="pf-card-box pf-checklist-card">
            <div class="pf-checklist-head"><span class="pf-eyebrow">${escapeHtml(groupTitle)}</span></div>
            ${fields
              .map(
                ([key, label, hint]) => `
                  <div class="pf-ws-field">
                    <label class="pf-label">${escapeHtml(label)}</label>
                    <textarea class="pf-ws-input" rows="2" data-action="ministry-field" data-store="lens" data-key="${attr(key)}" placeholder="${attr(hint)}">${escapeHtml(lens[key] || "")}</textarea>
                  </div>
                `,
              )
              .join("")}
          </section>
        `,
      ).join("")}

      <section class="pf-card-box pf-checklist-card">
        <div class="pf-checklist-head"><span class="pf-eyebrow">Discipleship needs</span></div>
        ${renderChipGroup("lens", "needs", LENS_NEEDS, lens.needs)}
        <div class="pf-ws-field" style="margin-top:12px;">
          <label class="pf-label">Recurring pastoral burdens</label>
          <textarea class="pf-ws-input" rows="2" data-action="ministry-field" data-store="lens" data-key="burdens.recurring" placeholder="What issues regularly show up in shepherding, preaching, or leadership?">${escapeHtml(lens["burdens.recurring"] || "")}</textarea>
        </div>
      </section>
    </div>
  `;
}

// ---- Series Architect ----
const SERIES_OVERVIEW_FIELDS = [
  ["title", "Series title", "Don't Follow Your Heart"],
  ["subtitle", "Series subtitle", ""],
  ["passages", "Primary book / passages", "Psalms of the heart"],
  ["startDate", "Start date", ""],
  ["endDate", "End date", ""],
  ["count", "Number of sermons", ""],
];

const SERIES_FORMATION_FIELDS = [
  ["goal", "Primary formation goal", "What kind of people should this series help form?"],
  ["response", "Desired church response", ""],
  ["practices", "Key practices to cultivate", ""],
  ["sins", "Key sins to confront", ""],
  ["comforts", "Key comforts to apply", ""],
];

function renderSeriesArchitect() {
  const series = getSeries();
  if (series) return renderSeriesEditor(series);
  return `
    <div class="pf-page-head" style="display:block;margin-bottom:22px;">
      <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">Series Architect</span>
      <h1 class="pf-h1">Plan series that form the church</h1>
      <p class="pf-page-sub">Clarify the theological, pastoral, and discipleship goals of a series before you preach it - formation over time, not just passages on dates.</p>
    </div>
    ${
      state.series.length
        ? `<div class="pf-switcher-list" style="margin-bottom:16px;">${state.series
            .map(
              (item) => `
                <button class="pf-switcher-item" data-action="series-open" data-series="${attr(item.id)}">
                  <div style="flex:1;min-width:0;">
                    <div class="label">${escapeHtml(item.title || "Untitled series")}</div>
                    <div class="meta">${escapeHtml(item.passages || "")}${item.startDate ? ` · ${escapeHtml(item.startDate)}` : ""} · ${(item.map || []).length} sermon${(item.map || []).length === 1 ? "" : "s"} mapped</div>
                  </div>
                  <span class="pf-badge">${escapeHtml(item.formation?.goal ? "Formation set" : "Draft")}</span>
                </button>
              `,
            )
            .join("")}</div>`
        : `<div class="pf-empty" style="margin-bottom:16px;">No series yet. A series plan starts with a formation question, not a schedule: <em>what kind of people should these sermons help form?</em></div>`
    }
    <button class="pf-btn pf-btn-primary" data-action="series-new">New series</button>
  `;
}

function renderSeriesEditor(series) {
  return `
    <div class="pf-page-head" style="display:block;margin-bottom:18px;">
      <button class="pf-btn pf-btn-ghost" data-action="series-back" style="margin-bottom:12px;">&larr; All series</button>
      <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">Series Architect</span>
      <h1 class="pf-h1">${escapeHtml(series.title || "New series")}</h1>
      <p class="pf-page-sub">Plan the formation arc - then prepare each sermon in the Workspace as its week comes. ${renderLensNotice()}</p>
    </div>

    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head"><span class="pf-eyebrow">Series overview</span></div>
      <p class="pf-section-hint">The frame: what you're preaching, where it lives in Scripture, and when. Writing it down keeps every sermon in the series answering to one stated intent instead of drifting week to week.</p>
      <div class="pf-form-grid">
        ${SERIES_OVERVIEW_FIELDS.map(
          ([key, label, hint]) => `
            <div class="pf-field ${key === "title" || key === "passages" ? "full" : ""}" style="margin-bottom:0;">
              <label class="pf-label">${escapeHtml(label)}</label>
              <input class="pf-input" ${key.endsWith("Date") ? 'type="date"' : ""} data-action="ministry-field" data-store="series" data-key="${attr(key)}" value="${attr(series[key] || "")}" placeholder="${attr(hint)}" />
            </div>
          `,
        ).join("")}
        <div class="pf-field full" style="margin-bottom:0;">
          <label class="pf-label">Series description</label>
          <textarea class="pf-ws-input" rows="2" data-action="ministry-field" data-store="series" data-key="description">${escapeHtml(series.description || "")}</textarea>
        </div>
      </div>
    </section>

    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head"><span class="pf-eyebrow">Formation goal</span></div>
      <p class="pf-section-hint">A series should form people, not just fill weeks. Name who these sermons should help your church become; once that's written, every big idea and application below has a target to serve.</p>
      ${SERIES_FORMATION_FIELDS.map(
        ([key, label, hint]) => `
          <div class="pf-ws-field">
            <label class="pf-label">${escapeHtml(label)}</label>
            <textarea class="pf-ws-input" rows="2" data-action="ministry-field" data-store="series-formation" data-key="${attr(key)}" placeholder="${attr(hint)}">${escapeHtml(series.formation[key] || "")}</textarea>
          </div>
        `,
      ).join("")}
    </section>

    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head"><span class="pf-eyebrow">Doctrinal anchors</span></div>
      <p class="pf-section-hint">The two or three truths this series must teach clearly by the time it ends. Anchors keep a long series from wandering - when a week's text tempts you sideways, they pull the message back on course.</p>
      ${renderChipGroup("series", "anchors", SERIES_ANCHORS, series.anchors)}
    </section>

    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head"><span class="pf-eyebrow">Pastoral burdens</span></div>
      <p class="pf-section-hint">What you're actually seeing in the flock that this series should address. Naming the burdens now means the applications later land on real people instead of hypothetical ones.</p>
      ${renderChipGroup("series", "burdens", SERIES_BURDENS, series.burdens)}
    </section>

    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head">
        <span class="pf-eyebrow">Series map</span>
        <span class="pf-checklist-count">${series.map.length} sermon${series.map.length === 1 ? "" : "s"}</span>
      </div>
      <p class="pf-section-hint">One row per sermon: when, the passage, the big idea, and the formation emphasis. Mapping the arc up front exposes gaps and repetition while they're still cheap to fix - months before you'd discover them from the pulpit.</p>
      ${series.map
        .map(
          (row, index) => `
            <div class="pf-outline-row">
              <div class="pf-outline-tools">
                <button class="pf-outline-btn" data-action="series-map-up" data-index="${index}" ${index === 0 ? "disabled" : ""}>▲</button>
                <button class="pf-outline-btn" data-action="series-map-down" data-index="${index}" ${index === series.map.length - 1 ? "disabled" : ""}>▼</button>
              </div>
              <div style="flex:1;min-width:0;">
                <div class="pf-series-row-grid">
                  <input class="pf-ws-input" data-action="series-map-field" data-index="${index}" data-field="when" value="${attr(row.when)}" placeholder="Week ${index + 1} / date" />
                  <input class="pf-ws-input" data-action="series-map-field" data-index="${index}" data-field="passage" value="${attr(row.passage)}" placeholder="Passage" />
                </div>
                <input class="pf-ws-input" style="margin-top:6px;" data-action="series-map-field" data-index="${index}" data-field="title" value="${attr(row.title)}" placeholder="Sermon title" />
                <div class="pf-series-row-grid" style="margin-top:6px;">
                  <input class="pf-ws-input" data-action="series-map-field" data-index="${index}" data-field="idea" value="${attr(row.idea)}" placeholder="Big idea" />
                  <input class="pf-ws-input" data-action="series-map-field" data-index="${index}" data-field="emphasis" value="${attr(row.emphasis)}" placeholder="Formation emphasis / primary application" />
                </div>
              </div>
              <button class="pf-outline-btn" data-action="series-map-remove" data-index="${index}">✕</button>
            </div>
          `,
        )
        .join("")}
      <button class="pf-ghost-add" data-action="series-map-add">+ Add sermon to the map</button>
    </section>

    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head" style="align-items:flex-start;">
        <div style="min-width:0;">
          <span class="pf-eyebrow">Series arc review</span>
          <p class="pf-ministry-desc">Once a few sermons are mapped, ask Sermon Guide to read the whole arc the way your church will experience it over the weeks: Does it progress instead of repeating? Are the doctrinal anchors actually taught? Are the pastoral burdens shepherded - sin confronted, grace applied? Would an unbeliever attending the whole series hear the gospel clearly and know how to respond? Does it land somewhere? It reviews the plan and flags gaps - it never writes the series for you.</p>
        </div>
        <button class="pf-btn" data-action="series-arc-review" ${ui.drafting ? "disabled" : ""}>${ui.drafting === "series-arc" ? "Reviewing…" : "Review with Sermon Guide"}</button>
      </div>
      ${series.arcReview ? `<div class="pf-review-result" style="margin-top:8px;">${escapeHtml(series.arcReview)}</div>` : `<p class="pf-helper" style="margin-top:4px;">Map at least a few sermons first, then ask Sermon Guide to consider the arc.</p>`}
    </section>

    ${renderMinistryCard("series-outputs", SERIES_OUTPUT_CARD, series.outputs)}

    <div class="pf-modal-actions">
      <button class="pf-btn" data-action="series-export-pdf">Export series plan (PDF)</button>
      <button class="pf-btn" data-action="series-export-doc">Export series plan (Word)</button>
      <button class="pf-btn pf-btn-danger" data-action="series-delete">Delete series</button>
    </div>
    <p class="pf-helper" style="margin-top:16px;">Series Architect plans the formation arc of the calendar. Each sermon is still prepared, phase by phase, in the Workspace.</p>
  `;
}

function seriesDocHtml(series) {
  const section = (title, body) => (body ? `<h2>${escapeHtml(title)}</h2><div class="note">${body}</div>` : "");
  const para = (value) => (value && value.trim() ? `<p>${escapeHtml(value)}</p>` : "");
  return `
    <section class="sermon">
      <p class="eyebrow">Series plan</p>
      <h1>${escapeHtml(series.title || "Untitled series")}</h1>
      ${series.subtitle ? `<p class="subtitle">${escapeHtml(series.subtitle)}</p>` : ""}
      <p class="meta">${escapeHtml(series.passages || "")}${series.startDate ? ` · ${escapeHtml(series.startDate)} → ${escapeHtml(series.endDate || "?")}` : ""}${series.count ? ` · ${escapeHtml(series.count)} sermons` : ""}</p>
      ${para(series.description)}
      ${section("Formation goal", SERIES_FORMATION_FIELDS.map(([key, label]) => (series.formation[key] ? `<h3>${escapeHtml(label)}</h3><p>${escapeHtml(series.formation[key])}</p>` : "")).join(""))}
      ${series.anchors.length ? section("Doctrinal anchors", `<p>${escapeHtml(series.anchors.join(", "))}</p>`) : ""}
      ${series.burdens.length ? section("Pastoral burdens", `<p>${escapeHtml(series.burdens.join(", "))}</p>`) : ""}
      ${
        series.map.length
          ? section(
              "Series map",
              `<ol>${series.map.map((row) => `<li><strong>${escapeHtml(row.title || row.passage || "TBD")}</strong> - ${escapeHtml([row.when, row.passage].filter(Boolean).join(" · "))}${row.idea ? `<br>Big idea: ${escapeHtml(row.idea)}` : ""}${row.emphasis ? `<br>Formation: ${escapeHtml(row.emphasis)}` : ""}</li>`).join("")}</ol>`,
            )
          : ""
      }
      ${ministryFilled(series.outputs, "outputs", SERIES_OUTPUT_CARD.fields) ? section("Series outputs", `<p>${escapeHtml(series.outputs.outputs).replaceAll("\n", "<br>")}</p>`) : ""}
      ${series.arcReview ? section("Arc review (Sermon Guide)", `<p>${escapeHtml(series.arcReview).replaceAll("\n", "<br>")}</p>`) : ""}
    </section>
  `;
}

// ---- Preaching Diet Review ----
const BIBLE_BOOKS = [
  ["Genesis", "OT", "Law"], ["Exodus", "OT", "Law"], ["Leviticus", "OT", "Law"], ["Numbers", "OT", "Law"], ["Deuteronomy", "OT", "Law"],
  ["Joshua", "OT", "OT History"], ["Judges", "OT", "OT History"], ["Ruth", "OT", "OT History"],
  ["1 Samuel", "OT", "OT History"], ["2 Samuel", "OT", "OT History"], ["1 Kings", "OT", "OT History"], ["2 Kings", "OT", "OT History"],
  ["1 Chronicles", "OT", "OT History"], ["2 Chronicles", "OT", "OT History"], ["Ezra", "OT", "OT History"], ["Nehemiah", "OT", "OT History"], ["Esther", "OT", "OT History"],
  ["Job", "OT", "Wisdom & Poetry"], ["Psalms", "OT", "Wisdom & Poetry", ["Psalm"]], ["Proverbs", "OT", "Wisdom & Poetry"], ["Ecclesiastes", "OT", "Wisdom & Poetry"], ["Song of Solomon", "OT", "Wisdom & Poetry", ["Song of Songs"]],
  ["Isaiah", "OT", "Prophets"], ["Jeremiah", "OT", "Prophets"], ["Lamentations", "OT", "Prophets"], ["Ezekiel", "OT", "Prophets"], ["Daniel", "OT", "Prophets"],
  ["Hosea", "OT", "Prophets"], ["Joel", "OT", "Prophets"], ["Amos", "OT", "Prophets"], ["Obadiah", "OT", "Prophets"], ["Jonah", "OT", "Prophets"], ["Micah", "OT", "Prophets"],
  ["Nahum", "OT", "Prophets"], ["Habakkuk", "OT", "Prophets"], ["Zephaniah", "OT", "Prophets"], ["Haggai", "OT", "Prophets"], ["Zechariah", "OT", "Prophets"], ["Malachi", "OT", "Prophets"],
  ["Matthew", "NT", "Gospels & Acts"], ["Mark", "NT", "Gospels & Acts"], ["Luke", "NT", "Gospels & Acts"], ["John", "NT", "Gospels & Acts"], ["Acts", "NT", "Gospels & Acts"],
  ["Romans", "NT", "Epistles"], ["1 Corinthians", "NT", "Epistles"], ["2 Corinthians", "NT", "Epistles"], ["Galatians", "NT", "Epistles"], ["Ephesians", "NT", "Epistles"],
  ["Philippians", "NT", "Epistles"], ["Colossians", "NT", "Epistles"], ["1 Thessalonians", "NT", "Epistles"], ["2 Thessalonians", "NT", "Epistles"],
  ["1 Timothy", "NT", "Epistles"], ["2 Timothy", "NT", "Epistles"], ["Titus", "NT", "Epistles"], ["Philemon", "NT", "Epistles"],
  ["Hebrews", "NT", "Epistles"], ["James", "NT", "Epistles"], ["1 Peter", "NT", "Epistles"], ["2 Peter", "NT", "Epistles"],
  ["1 John", "NT", "Epistles"], ["2 John", "NT", "Epistles"], ["3 John", "NT", "Epistles"], ["Jude", "NT", "Epistles"],
  ["Revelation", "NT", "Apocalyptic"],
];

const BOOK_MATCHES = BIBLE_BOOKS.flatMap(([name, testament, genre, aliases]) =>
  [name, ...(aliases || [])].map((alias) => ({ alias: alias.toLowerCase(), name, testament, genre })),
).sort((a, b) => b.alias.length - a.alias.length);

function passageBook(passage) {
  const clean = String(passage || "").trim().toLowerCase();
  if (!clean) return null;
  return BOOK_MATCHES.find((book) => clean.startsWith(book.alias)) || null;
}

function dietSermons() {
  const months = ui.dietRange === "all" ? null : Number(ui.dietRange);
  const cutoff = months ? new Date(Date.now() - months * 30.4 * 86400000) : null;
  return state.sermons.filter((sermon) => {
    if (!sermon.date) return false;
    const date = new Date(`${sermon.date}T00:00:00`);
    if (date > new Date()) return false;
    return !cutoff || date >= cutoff;
  });
}

function dietBar(label, count, total, extra = "") {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return `
    <div class="pf-diet-row">
      <span class="pf-diet-label">${escapeHtml(label)}</span>
      <div class="pf-diet-track"><i style="width:${pct}%"></i></div>
      <span class="pf-diet-count">${count}${extra}</span>
    </div>
  `;
}

function dietDigest(sermons) {
  const byTestament = { OT: 0, NT: 0, Unknown: 0 };
  const byGenre = {};
  const books = new Set();
  sermons.forEach((sermon) => {
    const book = passageBook(sermon.passage);
    if (!book) { byTestament.Unknown += 1; return; }
    byTestament[book.testament] += 1;
    byGenre[book.genre] = (byGenre[book.genre] || 0) + 1;
    books.add(book.name);
  });
  const audiences = APPLICATION_AUDIENCES.map((audience) => [
    audience,
    sermons.filter((sermon) => worksheetValue(sermon, "application", audience).trim()).length,
  ]);
  const christ = sermons.filter((sermon) => worksheetValue(sermon, "gospel", "christ").trim()).length;
  const invitation = sermons.filter((sermon) => phaseNoteText(sermon, PHASES.find((phase) => phase.id === "invitation")).trim()).length;
  const bigIdea = sermons.filter((sermon) => worksheetValue(sermon, "aim", "burden").trim()).length;
  const tagCounts = {};
  sermons.forEach((sermon) => (sermon.tags || []).forEach((tag) => { tagCounts[tag] = (tagCounts[tag] || 0) + 1; }));
  const anchors = new Set();
  state.series.forEach((series) => series.anchors.forEach((anchor) => anchors.add(anchor)));
  return { byTestament, byGenre, books, audiences, christ, invitation, bigIdea, tagCounts, anchors };
}

function renderDietReview() {
  const sermons = dietSermons();
  const digest = dietDigest(sermons);
  const total = sermons.length;
  const ranges = [["3", "Last 3 months"], ["6", "Last 6 months"], ["12", "Last 12 months"], ["all", "All time"]];
  const topTags = Object.entries(digest.tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 12);
  return `
    <div class="pf-page-head" style="display:block;margin-bottom:18px;">
      <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">Preaching Diet Review</span>
      <h1 class="pf-h1">See what your church is being fed</h1>
      <p class="pf-page-sub">Observe your preaching calendar over time - textual coverage, application patterns, and emphases. This is a mirror for a shepherd, not a report card.</p>
    </div>
    <div class="pf-filter-chips" style="margin-bottom:20px;">
      ${ranges.map(([value, label]) => `<button class="pf-chip ${ui.dietRange === value ? "active" : ""}" data-action="diet-range" data-range="${value}">${label}</button>`).join("")}
    </div>
    ${
      !total
        ? `<div class="pf-empty">No dated, preached sermons in this window yet. As your pipeline fills and Sundays pass, this page starts telling the story of your pulpit.</div>`
        : `
      <section class="pf-card-box pf-checklist-card">
        <div class="pf-checklist-head"><span class="pf-eyebrow">Textual balance</span><span class="pf-checklist-count">${total} sermon${total === 1 ? "" : "s"}</span></div>
        ${dietBar("Old Testament", digest.byTestament.OT, total)}
        ${dietBar("New Testament", digest.byTestament.NT, total)}
        ${digest.byTestament.Unknown ? dietBar("Unrecognized passage", digest.byTestament.Unknown, total) : ""}
        <div style="height:10px;"></div>
        ${Object.entries(digest.byGenre).sort((a, b) => b[1] - a[1]).map(([genre, count]) => dietBar(genre, count, total)).join("")}
        <p class="pf-helper" style="margin-top:10px;">Books preached: ${digest.books.size ? escapeHtml([...digest.books].sort().join(", ")) : "-"} · ${66 - digest.books.size} of 66 books not yet in this window.</p>
      </section>

      <section class="pf-card-box pf-checklist-card">
        <div class="pf-checklist-head"><span class="pf-eyebrow">Application balance</span></div>
        ${digest.audiences.map(([audience, count]) => dietBar(audience, count, total)).join("")}
        <p class="pf-helper" style="margin-top:10px;">Counted from the Application Engine - sermons with counsel written for each audience.</p>
      </section>

      <section class="pf-card-box pf-checklist-card">
        <div class="pf-checklist-head"><span class="pf-eyebrow">Emphases</span></div>
        ${dietBar("Christ connection recorded", digest.christ, total)}
        ${dietBar("Invitation prepared", digest.invitation, total)}
        ${dietBar("Big idea recorded", digest.bigIdea, total)}
        ${topTags.length ? `<p class="pf-helper" style="margin-top:10px;">Recurring themes from your tags: ${topTags.map(([tag, count]) => `#${escapeHtml(tag)} (${count})`).join(" · ")}</p>` : ""}
        ${digest.anchors.size ? `<p class="pf-helper">Doctrinal anchors from your series plans: ${escapeHtml([...digest.anchors].join(", "))}</p>` : ""}
      </section>

      <section class="pf-card-box pf-checklist-card">
        <div class="pf-checklist-head" style="align-items:flex-start;">
          <div style="min-width:0;">
            <span class="pf-eyebrow">Pastoral review</span>
            <p class="pf-ministry-desc">Ask Sermon Guide to consider this diet: strengths, potential imbalances, missing emphases, series and one-off suggestions, cautions, and encouragement.</p>
          </div>
          <button class="pf-btn" data-action="diet-review" ${ui.drafting ? "disabled" : ""}>${ui.drafting === "diet" ? "Reviewing…" : "Review Preaching Diet"}</button>
        </div>
        ${state.dietReview.text ? `<div class="pf-review-result" style="margin-top:8px;">${escapeHtml(state.dietReview.text)}</div><p class="pf-helper" style="margin-top:8px;">Reviewed ${state.dietReview.at ? escapeHtml(fmtDate(state.dietReview.at.slice(0, 10))) : ""}.</p>` : ""}
      </section>
    `
    }
  `;
}

async function reviewPreachingDiet() {
  if (ui.drafting) return;
  if (!requireOpenAIKey()) return;
  const sermons = dietSermons();
  if (!sermons.length) { showBanner("No dated sermons in this window yet."); return; }
  const digest = dietDigest(sermons);
  const lines = [
    `PREACHING DIET (${ui.dietRange === "all" ? "all time" : `last ${ui.dietRange} months`}): ${sermons.length} sermons.`,
    `Old Testament: ${digest.byTestament.OT}. New Testament: ${digest.byTestament.NT}.`,
    `Genres: ${Object.entries(digest.byGenre).map(([genre, count]) => `${genre} ${count}`).join(", ") || "-"}.`,
    `Books preached: ${[...digest.books].join(", ") || "-"}.`,
    `Application audiences covered (sermons with written counsel): ${digest.audiences.map(([audience, count]) => `${audience} ${count}`).join(", ")}.`,
    `Christ connection recorded: ${digest.christ}/${sermons.length}. Invitation prepared: ${digest.invitation}/${sermons.length}. Big idea recorded: ${digest.bigIdea}/${sermons.length}.`,
    `Recurring tags: ${Object.entries(digest.tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([tag, count]) => `${tag}(${count})`).join(", ") || "-"}.`,
    `Series doctrinal anchors: ${[...digest.anchors].join(", ") || "-"}.`,
    "Recent sermons:",
    ...sermons
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 15)
      .map((sermon) => `- ${sermon.date} · ${sermon.passage}${sermon.title ? ` - ${sermon.title}` : ""}${worksheetValue(sermon, "aim", "burden").trim() ? ` | Big idea: ${worksheetValue(sermon, "aim", "burden").trim()}` : ""}`),
    "",
    ...profileSummaryLines(),
    ...lensSummaryLines(),
  ];
  ui.drafting = "diet";
  render();
  try {
    const response = await fetch("./api/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...openAIHeaders() },
      body: JSON.stringify({
        context: lines.join("\n"),
        prompt:
          "Review this preaching diet as a wise pastoral mentor. Cover: strengths to keep; potential imbalances to notice; emphases that may be missing; two or three future series worth considering; one or two one-off sermon ideas; pastoral cautions; and genuine encouragement. Observe and consider - never score, rank, or grade. Be concise and concrete.",
      }),
    });
    const data = await response.json();
    state.dietReview = { text: data.text || "", at: new Date().toISOString() };
    saveState();
  } catch {
    showBanner("Could not reach Sermon Guide.");
  } finally {
    ui.drafting = "";
    render();
  }
}

function phaseNoteKind(phase) {
  if (phase.devotional) return "prayer";
  if (phase.id === "immersion") return "question";
  return "note";
}

function kindLabel(kind) {
  return { coach: "Sermon Guide", question: "Question", prayer: "Prayer", note: "Note", debrief: "Debrief" }[kind] || "Note";
}

function collectActiveNoteGroups(active) {
  if (!active) return [];
  const groups = [];
  // The writing is one document now, so it appears here once, at the top,
  // rather than repeating under every phase. Edit it in the Workspace or the
  // Sermon Editor; this is the reading copy.
  const work = phaseNoteHtml(active, manuscriptPhaseDef());
  if (richHtmlToText(work).trim()) {
    groups.push({
      phase: "Your work",
      when: "one document",
      entries: [{ kind: "note", html: work, phaseId: "manuscript", editable: true }],
    });
  }
  for (const phase of PHASES) {
    // Already shown above as the sermon's one working document.
    if (phase.id === "manuscript") continue;
    const entries = [];
    if (phaseNoteText(active, phase).trim()) {
      entries.push({ kind: phaseNoteKind(phase), html: phaseNoteHtml(active, phase), phaseId: phase.id, editable: true });
    }
    active.thread
      .filter((message) => message.role === "assistant" && message.phaseId === phase.id)
      .forEach((message) => entries.push({ kind: "coach", text: message.content }));
    if (entries.length) {
      entries.reverse();
      groups.push({ phase: phase.name, when: BLOCKS[phase.block].when, entries });
    }
  }
  // Completed (or skipped) debriefs file with the sermon here.
  if (active.debriefStatus === "skipped") {
    groups.push({ phase: "Debrief", when: "after preaching", entries: [{ kind: "debrief", text: "No debrief was needed for this sermon." }] });
  } else if (active.debriefStatus === "done" || debriefFilled(active)) {
    const entries = [];
    DEBRIEF_FIELDS.forEach(([key, label]) => {
      const value = active.debrief?.[key];
      if (typeof value === "string" && value.trim()) entries.push({ kind: "debrief", text: `${label}\n${value.trim()}` });
    });
    if (Array.isArray(active.debrief?.responses) && active.debrief.responses.length) {
      entries.push({ kind: "debrief", text: `Responses that surfaced: ${active.debrief.responses.join(", ")}` });
    }
    DEBRIEF_CARDS.forEach((card) => {
      const value = active.debrief?.[card.key];
      if (typeof value === "string" && value.trim() && ministryFilled(active.debrief, card.key, card.fields)) {
        entries.push({ kind: "debrief", text: `${card.title}\n${value.trim()}` });
      }
    });
    if (entries.length) groups.push({ phase: `Debrief${active.debriefStatus === "done" ? " ✓" : " (in progress)"}`, when: "after preaching", entries });
  }
  const orphanCoach = active.thread.filter((message) => message.role === "assistant" && !message.phaseId);
  if (orphanCoach.length) {
    groups.push({
      phase: "Sermon Guide feedback",
      when: "",
      entries: orphanCoach.map((message) => ({ kind: "coach", text: message.content })).reverse(),
    });
  }
  return groups;
}

function allTags() {
  const tags = new Set();
  state.sermons.forEach((sermon) => (sermon.tags || []).forEach((tag) => tags.add(tag)));
  return [...tags].sort();
}

function makeSnippet(text, query) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return escapeHtml(text.slice(0, 140));
  const start = Math.max(0, idx - 60);
  const end = Math.min(text.length, idx + query.length + 80);
  return (
    (start > 0 ? "…" : "") +
    escapeHtml(text.slice(start, idx)) +
    "<mark>" + escapeHtml(text.slice(idx, idx + query.length)) + "</mark>" +
    escapeHtml(text.slice(idx + query.length, end)) +
    (end < text.length ? "…" : "")
  );
}

// The notes bank: search every sermon's notes, worksheets, Guide thread, and
// tags for a word or phrase.
function searchAllNotes(query) {
  const q = query.toLowerCase();
  const results = [];
  for (const sermon of state.sermons) {
    const label = `${sermon.passage || "Untitled sermon"}${sermon.title ? ` · ${sermon.title}` : ""}`;
    if ([sermon.passage, sermon.title, sermon.series, (sermon.tags || []).join(" ")].join(" ").toLowerCase().includes(q)) {
      results.push({ sermonId: sermon.id, phaseId: sermon.activePhase, label, where: "Sermon", snippet: escapeHtml([sermon.series, (sermon.tags || []).map((t) => `#${t}`).join(" ")].filter(Boolean).join(" · ")) });
    }
    for (const phase of PHASES) {
      const text = phaseNoteText(sermon, phase);
      if (text.toLowerCase().includes(q)) {
        results.push({ sermonId: sermon.id, phaseId: phase.id, label, where: phase.name, snippet: makeSnippet(text, query) });
      }
    }
    for (const [key, value] of Object.entries(sermon.worksheet || {})) {
      if (String(value).toLowerCase().includes(q)) {
        const phaseId = key.split(".")[0];
        const phase = PHASES.find((p) => p.id === phaseId);
        results.push({ sermonId: sermon.id, phaseId: phaseId, label, where: `${phase ? phase.name : "Worksheet"}`, snippet: makeSnippet(String(value), query) });
      }
    }
    (sermon.outline || []).forEach((movement) => {
      const text = `${movement.title} ${movement.sub}`.trim();
      if (text.toLowerCase().includes(q)) {
        results.push({ sermonId: sermon.id, phaseId: "structure", label, where: "Outline", snippet: makeSnippet(text, query) });
      }
    });
    for (const [storeName, whereLabel, cards] of MINISTRY_EXPORT_SECTIONS) {
      const store = sermon[storeName] || {};
      for (const [key, value] of Object.entries(store)) {
        if (typeof value !== "string" || !value.trim()) continue;
        const card = cards.find((item) => item.key === key);
        if (card && !ministryFilled(store, key, card.fields)) continue;
        if (value.toLowerCase().includes(q)) {
          results.push({
            sermonId: sermon.id,
            phaseId: sermon.activePhase,
            ministry: storeName,
            label,
            where: whereLabel,
            snippet: makeSnippet(value, query),
          });
        }
      }
    }
    sermon.thread.forEach((message) => {
      if (message.role !== "meta" && message.content.toLowerCase().includes(q)) {
        results.push({
          sermonId: sermon.id,
          phaseId: message.phaseId || sermon.activePhase,
          label,
          where: message.role === "assistant" ? "Sermon Guide" : "You asked",
          snippet: makeSnippet(message.content, query),
        });
      }
    });
  }
  return results;
}

function renderSearchResults(query) {
  const results = searchAllNotes(query);
  return `
    <div class="pf-notes-list">
      <p class="pf-page-sub" style="margin:0 0 6px;">${results.length} match${results.length === 1 ? "" : "es"} for <strong>“${escapeHtml(query)}”</strong> across all sermons. <button class="pf-btn pf-btn-ghost" style="padding:4px 10px;" data-action="notes-clear-query">Clear</button></p>
      ${
        results.length
          ? results
              .map(
                (result) => `
                  <button class="pf-note-group pf-search-hit" data-action="open-note-focus" data-sermon="${attr(result.sermonId)}" data-phase="${attr(result.phaseId)}" ${result.ministry ? `data-ministry="${attr(result.ministry)}"` : ""}>
                    <div class="pf-note-group-head" style="border-bottom:0;">
                      <span class="pf-note-phase">${escapeHtml(result.label)}</span>
                      <span class="pf-kind" style="margin-left:auto;">${escapeHtml(result.where)}</span>
                    </div>
                    <div class="pf-note-entry" style="border-top:1px solid var(--border-subtle);"><div class="pf-note-body">${result.snippet}</div></div>
                  </button>
                `,
              )
              .join("")
          : `<div class="pf-empty">Nothing found for “${escapeHtml(query)}” yet.</div>`
      }
    </div>
  `;
}

function renderJournal(active) {
  const query = (ui.notesQuery || "").trim();
  const tags = allTags();
  const withNotes = state.sermons.filter((sermon) => collectActiveNoteGroups(sermon).length);
  const fallbackId = active?.id || withNotes[0]?.id || "";
  const selectedId = ui.notesSermonId && state.sermons.some((sermon) => sermon.id === ui.notesSermonId) ? ui.notesSermonId : fallbackId;
  const selected = state.sermons.find((sermon) => sermon.id === selectedId) || null;
  const groups = collectActiveNoteGroups(selected);
  const totalNotes = groups.reduce((sum, group) => sum + group.entries.length, 0);
  return `
    <div class="pf-page pf-page-read pf-fade">
      <div class="pf-page-head" style="display:block;margin-bottom:22px;">
        <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">Notes</span>
        <h1 class="pf-h1">Everything you've captured</h1>
        <p class="pf-page-sub">Pick a sermon, then open just the phase you're after - no more scrolling the whole bank. Search still reaches every note in every sermon.</p>
      </div>
      <div class="pf-tools">
        <div class="pf-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--pf-faint)" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input data-action="notes-query" value="${attr(ui.notesQuery || "")}" placeholder="Search every note, worksheet, and sermon - try “atonement”" />
        </div>
        <select class="pf-select pf-tools-select" data-action="notes-sermon" aria-label="Choose a sermon">
          ${state.sermons
            .map((sermon) => {
              const count = collectActiveNoteGroups(sermon).reduce((sum, group) => sum + group.entries.length, 0);
              return `<option value="${attr(sermon.id)}" ${sermon.id === selectedId ? "selected" : ""}>${escapeHtml(sermon.passage || "Untitled")}${sermon.title ? ` - ${escapeHtml(sermon.title)}` : ""}${count ? ` (${count})` : ""}</option>`;
            })
            .join("")}
        </select>
      </div>
      ${
        tags.length && !query
          ? `<div class="pf-filter-chips" style="margin-bottom:18px;">
              ${tags.map((tag) => `<button class="pf-chip" data-action="notes-tag" data-tag="${attr(tag)}">#${escapeHtml(tag)}</button>`).join("")}
            </div>`
          : ""
      }
      ${
        query
          ? renderSearchResults(query)
          : !selected
            ? `<div class="pf-empty">No sermons yet. Start one and your phase notes will be filed here automatically.</div>`
            : groups.length
              ? `
                <p class="pf-helper" style="margin-bottom:12px;">${totalNotes} note${totalNotes === 1 ? "" : "s"} across ${groups.length} phase${groups.length === 1 ? "" : "s"} for <strong>${escapeHtml(selected.passage || "this sermon")}</strong> - tap a phase to open it.</p>
                <div class="pf-notes-list">${groups.map((group) => renderNoteGroup(group, selected)).join("")}</div>`
              : `<div class="pf-empty">No notes on <strong>${escapeHtml(selected.passage || "this sermon")}</strong> yet. Write in any phase of its Workspace and it lands here.</div>`
      }
    </div>
  `;
}

function renderNoteGroup(group, sermon, openByDefault = false) {
  return `
    <details class="pf-note-group pf-note-details" ${openByDefault ? "open" : ""}>
      <summary class="pf-note-group-head">
        <span class="pf-note-phase">${escapeHtml(group.phase)}</span>
        <span class="pf-note-count">${group.entries.length} note${group.entries.length === 1 ? "" : "s"}</span>
        ${group.when ? `<span class="pf-note-when">${escapeHtml(group.when)}</span>` : ""}
        <svg class="pf-note-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </summary>
      <div>
        ${group.entries
          .map((entry) =>
            entry.editable
              ? `
              <div class="pf-note-entry">
                <span class="pf-kind ${entry.kind}">${kindLabel(entry.kind)}</span>
                <div
                  class="pf-note-body pf-note-editable"
                  contenteditable="true"
                  spellcheck="true"
                  data-action="notes-editor"
                  data-phase="${attr(entry.phaseId)}"
                  data-sermon="${attr(sermon?.id || "")}"
                  data-placeholder="Write a note for this phase…"
                  title="Click to edit - saves automatically"
                >${sanitizeRichHtml(entry.html)}</div>
              </div>
            `
              : `
              <div class="pf-note-entry">
                <span class="pf-kind ${entry.kind}">${kindLabel(entry.kind)}</span>
                <div class="pf-note-body">${escapeHtml(entry.text || "")}</div>
              </div>
            `,
          )
          .join("")}
      </div>
    </details>
  `;
}

function journalSermonLabel(sermon) {
  return `${sermon.passage || "Untitled sermon"}${sermon.title ? ` - ${sermon.title}` : ""}`;
}

function journalCourseLabel(sermonId) {
  const sermon = state.sermons.find((item) => item.id === sermonId);
  return sermon ? journalSermonLabel(sermon) : "General journal";
}

function journalSectionLabel(phaseId) {
  return PHASES.find((phase) => phase.id === phaseId)?.name || "General";
}

function groupJournalEntries() {
  const sorted = [...state.journalEntries].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const courseMap = new Map();
  for (const entry of sorted) {
    const courseKey = entry.sermonId || "general";
    if (!courseMap.has(courseKey)) {
      courseMap.set(courseKey, {
        key: courseKey,
        label: journalCourseLabel(entry.sermonId),
        entries: [],
        sectionMap: new Map(),
      });
    }
    const course = courseMap.get(courseKey);
    course.entries.push(entry);
    const sectionKey = entry.phaseId || "general";
    if (!course.sectionMap.has(sectionKey)) {
      course.sectionMap.set(sectionKey, {
        key: sectionKey,
        label: journalSectionLabel(entry.phaseId),
        entries: [],
      });
    }
    course.sectionMap.get(sectionKey).entries.push(entry);
  }

  return [...courseMap.values()].map((course) => ({
    ...course,
    sections: [...course.sectionMap.values()],
  }));
}

function resetJournalDraft() {
  ui.journalEditingId = "";
  ui.journalDraft = {
    sermonId: "",
    phaseId: "",
    title: "",
    body: "",
  };
}

function saveJournalEntry(overrides = {}) {
  const now = new Date().toISOString();
  const selectedSermon = document.querySelector('[data-action="journal-draft-sermon"]')?.value || "";
  const selectedPhase = document.querySelector('[data-action="journal-draft-phase"]')?.value || "";
  const draft = {
    ...ui.journalDraft,
    sermonId: ui.journalDraft.sermonId || selectedSermon,
    phaseId: ui.journalDraft.phaseId || selectedPhase,
    ...overrides,
  };
  const body = (draft.body || "").trim();
  if (!body) {
    showBanner("Write a journal note first.");
    return;
  }
  const title = (draft.title || firstLine(body) || "Untitled note").trim();

  if (ui.journalEditingId) {
    state.journalEntries = state.journalEntries.map((entry) =>
      entry.id === ui.journalEditingId
        ? normalizeJournalEntry({
            ...entry,
            sermonId: draft.sermonId || "",
            phaseId: draft.phaseId || "general",
            title,
            body,
            updatedAt: now,
          })
        : entry,
    );
    showBanner("Journal note updated.");
  } else {
    state.journalEntries.unshift(
      normalizeJournalEntry({
        id: genId(),
        sermonId: draft.sermonId || "",
        phaseId: draft.phaseId || "general",
        title,
        body,
        createdAt: now,
        updatedAt: now,
      }),
    );
    showBanner("Journal note saved.");
  }

  resetJournalDraft();
  saveState();
  render();
}

function firstLine(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.replace(/^#+\s*/, "").replace(/^\-\s*/, "").trim())
    .find(Boolean);
}

function editJournalEntry(entryId) {
  const entry = state.journalEntries.find((item) => item.id === entryId);
  if (!entry) return;
  ui.journalEditingId = entry.id;
  ui.journalDraft = {
    sermonId: entry.sermonId || "",
    phaseId: entry.phaseId || "general",
    title: entry.title || "",
    body: entry.body || "",
  };
  state.view = "journal";
  render();
}

function deleteJournalEntry(entryId) {
  const entry = state.journalEntries.find((item) => item.id === entryId);
  if (!entry) return;
  const ok = confirm(`Delete "${entry.title || "this journal note"}"?`);
  if (!ok) return;
  state.journalEntries = state.journalEntries.filter((item) => item.id !== entryId);
  if (ui.journalEditingId === entryId) resetJournalDraft();
  saveState();
  showBanner("Journal note deleted.");
  render();
}

function renderJournalGroup(group) {
  return `
    <section class="panel panel-pad journal-group">
      <div class="section-head">
        <div>
          <span class="eyebrow">Course</span>
          <h2 class="mini-title">${escapeHtml(group.label)}</h2>
        </div>
        <span class="badge neutral">${group.entries.length}</span>
      </div>
      ${group.sections
        .map(
          (section) => `
            <div class="journal-section">
              <div class="block-label">${escapeHtml(section.label)}<span>${section.entries.length} notes</span></div>
              <div class="journal-entry-list">
                ${section.entries.map(renderJournalEntryCard).join("")}
              </div>
            </div>
          `,
        )
        .join("")}
    </section>
  `;
}

function renderJournalEntryCard(entry) {
  return `
    <article class="journal-entry-card">
      <div>
        <h3>${escapeHtml(entry.title || "Untitled note")}</h3>
        <p>${escapeHtml(entry.body.slice(0, 220))}${entry.body.length > 220 ? "..." : ""}</p>
        <div class="meta-line">Updated ${formatTime(entry.updatedAt)}</div>
      </div>
      <div class="entry-actions">
        <button class="btn" data-action="edit-journal-entry" data-entry="${attr(entry.id)}">Edit</button>
        <button class="btn btn-danger" data-action="delete-journal-entry" data-entry="${attr(entry.id)}">Delete</button>
      </div>
    </article>
  `;
}

function renderEmptyJournal() {
  return `
    <section class="panel panel-pad stack journal-empty">
      <span class="eyebrow">No notes yet</span>
      <h2 class="title">Start in a focus box.</h2>
      <p class="subtle">Workspace notes will appear here grouped by sermon, workflow section, and focus point.</p>
    </section>
  `;
}

function addSermon(form) {
  const data = Object.fromEntries(new FormData(form));
  const sermon = normalizeSermon({
    id: genId(),
    passage: data.passage.trim(),
    title: data.title.trim(),
    date: data.date,
    series: data.series.trim(),
    length: data.length.trim() || "40",
    format: data.format || "Full manuscript",
    activePhase: "plan",
  });
  state.sermons.push(sermon);
  state.activeId = sermon.id;
  state.view = "workspace";
  ui.showNew = false;
  saveState();
  render();
}

function saveDetails(form) {
  const data = Object.fromEntries(new FormData(form));
  updateActive({
    passage: data.passage.trim(),
    title: data.title.trim(),
    date: data.date,
    series: data.series.trim(),
    length: data.length.trim() || "40",
    format: data.format,
    preached: data.preached === "on",
    tags: String(data.tags || "")
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean),
  });
  ui.showDetails = false;
  showBanner("Sermon details saved.");
  render();
}

// The app coaches the preacher along the path. Every completed phase earns a
// word about why this work matters - the weight and joy of preaching itself.
const ENCOURAGEMENTS = [
  { text: "How will they hear without someone preaching? Your study this week is how God plans to reach someone.", ref: "Romans 10:14" },
  { text: "Preach the word; be ready in season and out of season. Faithfulness in this desk work IS readiness.", ref: "2 Timothy 4:2" },
  { text: "God's word does not return empty. Every hour in the text is an hour God intends to use.", ref: "Isaiah 55:11" },
  { text: "It pleased God through the folly of what we preach to save those who believe. Heaven moves through sermons.", ref: "1 Corinthians 1:21" },
  { text: "They read from the book, clearly, and gave the sense. That is the whole job: make God's meaning plain.", ref: "Nehemiah 8:8" },
  { text: "What we proclaim is not ourselves, but Jesus Christ as Lord. That is why your own ideas can wait.", ref: "2 Corinthians 4:5" },
  { text: "Whoever speaks, let it be as one who speaks the oracles of God. No other work in the world carries this weight.", ref: "1 Peter 4:11" },
  { text: "The word of God is living and active. You are not preparing a talk; you are handling something alive.", ref: "Hebrews 4:12" },
  { text: "Do not shrink from declaring the whole counsel of God. Slow, honest study is how a preacher earns that claim.", ref: "Acts 20:27" },
  { text: "Faith comes from hearing, and hearing through the word of Christ. Sunday's hearing starts with this week's studying." , ref: "Romans 10:17" },
  { text: "A sermon is not a lecture about the Bible. It is God's word, opened and applied, to real people you love." },
  { text: "The pulpit has outlasted empires. You are stepping into the oldest ongoing work in the church - keep going." },
  { text: "Nobody drifts into a text-driven sermon. Every deliberate step you just took is what faithfulness looks like." },
  { text: "Your people will never know most of this work. God sees all of it, and none of it is wasted." },
  { text: "The best preachers are not the most gifted; they are the most prepared and the most prayed-up. You are doing both." },
  { text: "Before it is a message for them, it must be bread for you. Study like a man who plans to eat first." },
];

function showEncouragement(phase, sermon) {
  const movementDone = PHASES.filter((p) => p.block === phase.block).every((p) => sermon.completed.includes(p.id));
  const pick = ENCOURAGEMENTS[(sermon.completed.length + phase.block * 3) % ENCOURAGEMENTS.length];
  ui.encourage = {
    eyebrow: movementDone
      ? `Movement ${phase.block + 1} complete · ${BLOCKS[phase.block].label}`
      : `Phase complete · ${phase.name}`,
    enc: phase.enc || "",
    quote: pick.text,
    ref: pick.ref || "",
    big: movementDone,
  };
  clearTimeout(encourageTimer);
  encourageTimer = setTimeout(() => {
    ui.encourage = null;
    render();
  }, 16000);
}

let encourageTimer;

function renderEncourageCard() {
  const card = ui.encourage;
  if (!card) return "";
  return `
    <div class="pf-encourage ${card.big ? "big" : ""}" role="status">
      <button class="pf-encourage-x" data-action="encourage-dismiss" aria-label="Dismiss">✕</button>
      <div class="pf-encourage-head">${COACH_SPARK}<span class="pf-eyebrow pf-eyebrow-brand">${escapeHtml(card.eyebrow)}</span></div>
      ${card.enc ? `<p class="pf-encourage-enc">${escapeHtml(card.enc)}</p>` : ""}
      <p class="pf-encourage-quote">${escapeHtml(card.quote)}</p>
      ${card.ref ? `<p class="pf-encourage-ref">${escapeHtml(card.ref)}</p>` : ""}
    </div>
  `;
}

function showBanner(message) {
  ui.banner = message;
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => {
    ui.banner = "";
    render();
  }, 4200);
}

function toggleComplete(phaseId) {
  const active = getActive();
  if (!active) return;
  const done = active.completed.includes(phaseId);
  const phase = PHASES.find((item) => item.id === phaseId);
  // A phase can't be called complete while its checklist still has open items.
  if (!done && phase) {
    const checked = phaseCheckCount(active, phase);
    if (checked < phase.doItems.length) {
      showBanner(`Finish the checklist first - ${checked} of ${phase.doItems.length} done.`);
      return;
    }
  }
  const completed = done
    ? active.completed.filter((id) => id !== phaseId)
    : [...active.completed, phaseId];
  const patch = { completed };
  if (!done && phase) {
    const index = PHASES.findIndex((item) => item.id === phaseId);
    patch.activePhase = PHASES[Math.min(index + 1, PHASES.length - 1)].id;
    showEncouragement(phase, { ...active, completed });
  }
  updateActive(patch);
  render();
}

// Plain-text summary of the structured worksheets + outline, shared by
// exports, Google Docs sync, and the Sermon Guide context.
function worksheetSummaryLines(sermon) {
  const lines = [];
  for (const [phaseId, config] of Object.entries(WORKSHEETS)) {
    const filled = config.fields
      .map(([key, label]) => [label, worksheetValue(sermon, phaseId, key).trim()])
      .filter(([, value]) => value);
    if (filled.length) {
      lines.push(config.eyebrow.toUpperCase());
      filled.forEach(([label, value]) => lines.push(`${label}: ${value}`));
      lines.push("");
    }
  }
  const movements = (sermon.outline || []).filter((m) => m.title.trim() || m.sub.trim());
  if (movements.length) {
    lines.push("OUTLINE");
    movements.forEach((m, i) => lines.push(`${i + 1}. ${m.title}${m.sub ? ` - ${m.sub}` : ""}`));
    lines.push("");
  }
  const applications = sermonAudiences(sermon).map((a) => [a, worksheetValue(sermon, "application", a).trim()]).filter(
    ([, value]) => value,
  );
  if (applications.length) {
    lines.push("APPLICATION");
    applications.forEach(([audience, value]) => lines.push(`${audience}: ${value}`));
    lines.push("");
  }
  return lines;
}

const MINISTRY_EXPORT_SECTIONS = [
  ["impact", "Sermon Impact Plan", IMPACT_CARDS],
  ["shepherd", "Shepherding Follow-Up", SHEPHERD_CARDS],
  ["pack", "Discipleship Pack", PACK_CARDS],
  ["debrief", "Post-Sermon Debrief", DEBRIEF_CARDS],
];

function ministrySummaryLines(sermon) {
  const lines = [];
  for (const [storeName, title, cards] of MINISTRY_EXPORT_SECTIONS) {
    const store = sermon[storeName] || {};
    const filledCards = cards.filter((card) => ministryFilled(store, card.key, card.fields));
    const responses = Array.isArray(store.responses) ? store.responses : [];
    const plainFields =
      storeName === "debrief"
        ? DEBRIEF_FIELDS.filter(([key]) => typeof store[key] === "string" && store[key].trim())
        : [];
    const emphasis = storeName === "impact" && typeof store["summary.emphasis"] === "string" ? store["summary.emphasis"].trim() : "";
    if (!filledCards.length && !responses.length && !plainFields.length && !emphasis) continue;
    lines.push(title.toUpperCase());
    if (emphasis) lines.push(`This week's ministry emphasis: ${emphasis}`);
    if (responses.length) lines.push(`Responses: ${responses.join(", ")}`);
    plainFields.forEach(([key, label]) => {
      lines.push(`${label} ${store[key].trim()}`);
    });
    filledCards.forEach((card) => {
      lines.push(`-- ${card.title} --`);
      lines.push(store[card.key].trim());
    });
    lines.push("");
  }
  return lines;
}

function ministrySectionsHtml(sermon) {
  let html = "";
  for (const [storeName, title, cards] of MINISTRY_EXPORT_SECTIONS) {
    const store = sermon[storeName] || {};
    const filledCards = cards.filter((card) => ministryFilled(store, card.key, card.fields));
    const responses = Array.isArray(store.responses) ? store.responses : [];
    const plainFields =
      storeName === "debrief"
        ? DEBRIEF_FIELDS.filter(([key]) => typeof store[key] === "string" && store[key].trim())
        : [];
    const emphasis = storeName === "impact" && typeof store["summary.emphasis"] === "string" ? store["summary.emphasis"].trim() : "";
    if (!filledCards.length && !responses.length && !plainFields.length && !emphasis) continue;
    html += `<h2>${escapeHtml(title)}</h2>`;
    if (emphasis) html += `<div class="note"><p><strong>This week's ministry emphasis:</strong> ${escapeHtml(emphasis)}</p></div>`;
    if (responses.length) html += `<div class="note"><p><strong>Responses:</strong> ${escapeHtml(responses.join(", "))}</p></div>`;
    plainFields.forEach(([key, label]) => {
      html += `<h3>${escapeHtml(label)}</h3><div class="note"><p>${escapeHtml(store[key].trim()).replaceAll("\n", "<br>")}</p></div>`;
    });
    filledCards.forEach((card) => {
      html += `<h3>${escapeHtml(card.title)}</h3><div class="note"><p>${escapeHtml(store[card.key].trim()).replaceAll("\n", "<br>")}</p></div>`;
    });
  }
  return html;
}

function activeContext(active) {
  const phase = getPhase(active);
  const status = sermonStatus(active);
  return [
    `CURRENT SERMON: ${active.passage}${active.title ? ` - "${active.title}"` : ""}`,
    `Preaching date: ${active.date ? fmtDate(active.date) : "(no date)"}`,
    `Series: ${active.series || "-"}`,
    `Target length: ${active.length || "-"} minutes`,
    `Deliverable: ${active.format}`,
    `Working phase: ${phase.name}`,
    status.days === null
      ? ""
      : `${status.days} days out; ${active.completed.length}/${PHASES.length} phases complete; verdict ${status.label}.`,
    ...worksheetSummaryLines(active),
  ]
    .filter(Boolean)
    .join("\n");
}

async function send(textArg, metaLabel) {
  const active = getActive();
  const text = (textArg ?? ui.composer).trim();
  if (!text || ui.loading || !active) return;
  if (!requireOpenAIKey()) return;

  const phaseId = active.activePhase;
  const base = [...active.thread];
  if (metaLabel) base.push({ role: "meta", content: metaLabel, phaseId });
  const next = [...base, { role: "user", content: text, phaseId }];
  updateActive({ thread: next });
  ui.composer = "";
  ui.showCoach = true;
  ui.loading = true;
  render();

  try {
    const response = await fetch("./api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...openAIHeaders() },
      body: JSON.stringify({
        context: [activeContext(getActive()), "", ...profileSummaryLines(), ...lensSummaryLines()].join("\n"),
        messages: next
          .filter((message) => message.role === "user" || message.role === "assistant")
          .map((message) => ({ role: message.role, content: message.content })),
      }),
    });
    const data = await response.json();
    updateActive({
      thread: [
        ...next,
        {
          role: "assistant",
          content: data.text || "No response came back. Try again.",
          phaseId,
        },
      ],
    });
  } catch {
    updateActive({
      thread: [
        ...next,
        {
          role: "assistant",
          content:
            "I could not reach Sermon Guide. Check the deployment, then make sure your OpenAI API key is saved in this browser.",
          phaseId,
        },
      ],
    });
  } finally {
    ui.loading = false;
    render();
  }
}

function tapPhaseAction(index) {
  const active = getActive();
  const phase = getPhase(active);
  const action = phase.actions?.[index];
  if (!action) return;
  if (action.direct) {
    send(action.seed, phase.name);
    return;
  }
  ui.composer = action.seed;
  render();
  requestAnimationFrame(() => {
    const composer = document.querySelector("[data-action='coach-input']");
    if (composer) {
      composer.focus();
      composer.setSelectionRange(composer.value.length, composer.value.length);
    }
  });
}

// Passage Map export sections - only when the preacher opted in.
function pmVersePlain(verse) {
  const template = document.createElement("template");
  template.innerHTML = verse.html;
  return template.content.textContent.trim();
}

function pmMarkdownLines(sermon) {
  const map = sermon.passageMap;
  if (!map?.includeInExports || !map.verses.length) return [];
  const lines = ["## Passage Map", ""];
  lines.push(map.verses.map((verse) => `${verse.ref ? `[${verse.ref}] ` : ""}${pmVersePlain(verse)}`).join(" "));
  if (map.attribution) lines.push("", `_${map.attribution}_`);
  if (map.highlights.length) {
    lines.push("", "### Marks", "");
    PM_CATEGORIES.forEach(([key, label]) => {
      const items = map.highlights.filter((item) => item.category === key);
      if (!items.length) return;
      lines.push(`- **${label}:** ${items.map((item) => `"${item.text}"${item.verseRef ? ` (v.${item.verseRef})` : ""}${item.relation ? ` [${item.relation}]` : ""}${item.note ? ` - ${item.note}` : ""}`).join("; ")}`);
    });
  }
  if (map.sections.length) {
    lines.push("", "### Sections", "");
    map.sections.forEach((section, index) => {
      lines.push(`${index + 1}. **${section.title || "Untitled"}**${section.verseRange ? ` (${section.verseRange})` : ""}${section.mainIdea ? ` - ${section.mainIdea}` : ""}${section.functionInPassage ? ` - _${section.functionInPassage}_` : ""}`);
    });
  }
  const summary = PM_SUMMARY_FIELDS.filter(([key]) => map.summary[key].trim());
  if (summary.length) {
    lines.push("", "### Flow summary", "");
    summary.forEach(([key, label]) => lines.push(`- **${label}** ${map.summary[key].trim()}`));
  }
  lines.push("");
  return lines;
}

function pmSectionsHtml(sermon) {
  const map = sermon.passageMap;
  if (!map?.includeInExports || !map.verses.length) return "";
  let html = `<h2>Passage Map</h2>`;
  html += `<div class="note"><p>${map.verses.map((verse) => `${verse.ref ? `<sup>${escapeHtml(verse.ref)}</sup> ` : ""}${escapeHtml(pmVersePlain(verse))}`).join(" ")}</p>${map.attribution ? `<p class="muted">${escapeHtml(map.attribution)}</p>` : ""}</div>`;
  if (map.highlights.length) {
    const rows = PM_CATEGORIES.map(([key, label]) => {
      const items = map.highlights.filter((item) => item.category === key);
      if (!items.length) return "";
      return `<li><strong>${escapeHtml(label)}:</strong> ${items.map((item) => `“${escapeHtml(item.text)}”${item.verseRef ? ` (v.${escapeHtml(item.verseRef)})` : ""}${item.relation ? ` [${escapeHtml(item.relation)}]` : ""}${item.note ? ` - ${escapeHtml(item.note)}` : ""}`).join("; ")}</li>`;
    }).join("");
    html += `<h3>Marks</h3><div class="note"><ul>${rows}</ul></div>`;
  }
  if (map.sections.length) {
    html += `<h3>Sections</h3><div class="note"><ol>${map.sections.map((section) => `<li><strong>${escapeHtml(section.title || "Untitled")}</strong>${section.verseRange ? ` (${escapeHtml(section.verseRange)})` : ""}${section.mainIdea ? ` - ${escapeHtml(section.mainIdea)}` : ""}${section.functionInPassage ? ` - <em>${escapeHtml(section.functionInPassage)}</em>` : ""}</li>`).join("")}</ol></div>`;
  }
  const summary = PM_SUMMARY_FIELDS.filter(([key]) => map.summary[key].trim());
  if (summary.length) {
    html += `<h3>Flow summary</h3><div class="note"><ul>${summary.map(([key, label]) => `<li><strong>${escapeHtml(label)}</strong> ${escapeHtml(map.summary[key].trim())}</li>`).join("")}</ul></div>`;
  }
  return html;
}

function exportMarkdown(sermon) {
  const status = sermonStatus(sermon);
  const lines = [
    `# ${sermon.passage || "Untitled sermon"}${sermon.title ? ` - ${sermon.title}` : ""}`,
    "",
    `Series: ${sermon.series || "-"}`,
    `Date: ${sermon.date ? fmtDate(sermon.date) : "-"}`,
    `Length: ${sermon.length || "-"} minutes`,
    `Deliverable: ${sermon.format}`,
    `Status: ${status.label}`,
    `Progress: ${sermon.completed.length}/${PHASES.length}`,
    ...(sermon.timeSpent ? [`Time in preparation: ${fmtDuration(sermon.timeSpent)}`] : []),
    ...(sermon.tags?.length ? [`Tags: ${sermon.tags.join(", ")}`] : []),
    "",
    ...worksheetSummaryLines(sermon),
    ...pmMarkdownLines(sermon),
    "## Workflow",
    "",
  ];

  for (const block of BLOCKS) {
    lines.push(`### ${block.label}`);
	    for (const phase of PHASES.filter((item) => item.block === BLOCKS.indexOf(block))) {
	      const done = sermon.completed.includes(phase.id) ? "done" : "open";
	      lines.push(`- [${done === "done" ? "x" : " "}] ${phase.name}`);
	      const note = getPhaseFocusNotesText(sermon, phase).trim();
	      if (note) {
	        lines.push("");
	        lines.push(note);
	        lines.push("");
	      }
    }
    lines.push("");
  }

  lines.push(...ministrySummaryLines(sermon));

  if (sermon.thread.length) {
    lines.push("## Sermon Guide Thread", "");
    for (const message of sermon.thread) {
      if (message.role === "meta") lines.push(`### ${message.content}`, "");
      if (message.role === "user") lines.push("**You**", "", message.content, "");
      if (message.role === "assistant") lines.push("**Sermon Guide**", "", message.content, "");
    }
  }

  return lines.join("\n").replace(/\n{4,}/g, "\n\n\n");
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// ---- sermon → export document HTML ----
function worksheetSectionsHtml(sermon) {
  let html = "";
  for (const [phaseId, config] of Object.entries(WORKSHEETS)) {
    const filled = config.fields
      .map(([key, label]) => [label, worksheetValue(sermon, phaseId, key).trim()])
      .filter(([, value]) => value);
    if (!filled.length) continue;
    html += `<h2>${escapeHtml(config.eyebrow)}</h2>`;
    filled.forEach(([label, value]) => {
      html += `<h3>${escapeHtml(label)}</h3><div class="note"><p>${escapeHtml(value)}</p></div>`;
    });
  }
  const movements = (sermon.outline || []).filter((m) => m.title.trim() || m.sub.trim() || (m.parts || []).some((part) => part.text.trim()));
  if (movements.length) {
    html += `<h2>Outline</h2><div class="note"><ol>${movements
      .map(
        (m) =>
          `<li>${escapeHtml(m.title)}${m.sub ? ` - ${escapeHtml(m.sub)}` : ""}${(m.parts || [])
            .filter((part) => part.text.trim())
            .map((part) => `<p><strong>${escapeHtml(OUTLINE_PART_KINDS.find(([key]) => key === part.kind)?.[1] || part.kind)}:</strong> ${escapeHtml(part.text)}</p>`)
            .join("")}</li>`,
      )
      .join("")}</ol></div>`;
  }
  const applications = sermonAudiences(sermon).map((a) => [a, worksheetValue(sermon, "application", a).trim()]).filter(
    ([, value]) => value,
  );
  if (applications.length) {
    html += `<h2>Application</h2>${applications
      .map(([audience, value]) => `<h3>${escapeHtml(audience)}</h3><div class="note"><p>${escapeHtml(value)}</p></div>`)
      .join("")}`;
  }
  return html;
}

function sermonSectionsHtml(sermon) {
  let html = worksheetSectionsHtml(sermon);
  html += pmSectionsHtml(sermon);
  for (const [blockIndex, block] of BLOCKS.entries()) {
    const phases = PHASES.filter((phase) => phase.block === blockIndex);
    const withNotes = phases.filter((phase) => phaseNoteText(sermon, phase).trim());
    if (!withNotes.length) continue;
    html += `<h2>${escapeHtml(block.label)}</h2>`;
    for (const phase of withNotes) {
      const done = sermon.completed.includes(phase.id);
      html += `<h3>${done ? "✓ " : ""}${escapeHtml(phase.name)}</h3>`;
      html += `<div class="note">${sanitizeRichHtml(phaseNoteHtml(sermon, phase))}</div>`;
    }
  }
  html += ministrySectionsHtml(sermon);
  if (!html) html = `<p class="muted">No notes captured yet.</p>`;
  return html;
}

function sermonDocHtml(sermon) {
  const status = sermonStatus(sermon);
  return `
    <section class="sermon">
      <p class="eyebrow">${escapeHtml(sermon.series || "Sermon")}</p>
      <h1>${escapeHtml(sermon.passage || "Untitled sermon")}</h1>
      ${sermon.title ? `<p class="subtitle">${escapeHtml(sermon.title)}</p>` : ""}
      <p class="meta">
        ${sermon.date ? escapeHtml(fmtDate(sermon.date)) : "No date"} ·
        ${escapeHtml(sermon.length || "-")} min ·
        ${escapeHtml(sermon.format || "")} ·
        ${sermon.completed.length}/${PHASES.length} phases (${progressPct(sermon)}%) · ${escapeHtml(status.label)}
      </p>
      ${sermonSectionsHtml(sermon)}
    </section>
  `;
}

function buildPrintDoc(title, bodyHtml) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>
  @page { margin: 18mm; }
  * { box-sizing: border-box; }
  body { font-family: "Mulish", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #20242a; line-height: 1.6; margin: 0; padding: 28px; }
  .sermon { max-width: 720px; margin: 0 auto 40px; }
  .sermon + .sermon { border-top: 2px solid #e0e5eb; padding-top: 28px; }
  .eyebrow { text-transform: uppercase; letter-spacing: .16em; font-size: 11px; font-weight: 700; color: #dc6a12; margin: 0 0 6px; }
  h1 { font-family: "Montserrat", sans-serif; font-weight: 800; letter-spacing: -.02em; font-size: 30px; margin: 0 0 4px; }
  .subtitle { font-size: 17px; color: #39424c; margin: 0 0 8px; }
  .meta { font-size: 12.5px; color: #5e6c7a; margin: 0 0 22px; }
  h2 { font-family: "Montserrat", sans-serif; font-weight: 800; font-size: 13px; letter-spacing: .12em; text-transform: uppercase; color: #5e6c7a; margin: 26px 0 10px; border-bottom: 1px solid #e0e5eb; padding-bottom: 6px; }
  h3 { font-family: "Montserrat", sans-serif; font-weight: 700; font-size: 17px; margin: 16px 0 6px; color: #20242a; page-break-after: avoid; }
  .note { font-size: 14.5px; color: #39424c; }
  .note ul, .note ol { margin: 6px 0; padding-left: 22px; }
  .note blockquote { margin: 10px 0; padding-left: 14px; border-left: 3px solid #ffd2a8; font-style: italic; color: #39424c; }
  .muted { color: #8c97a3; }
  h2, h3 { page-break-inside: avoid; }
</style></head><body>${bodyHtml}
<script>window.onload=function(){setTimeout(function(){window.print();},250);};window.onafterprint=function(){window.close();};</script>
</body></html>`;
}

// Flatten export HTML into typed text blocks jsPDF can lay out.
function pdfBlocksFrom(root, blocks) {
  const blockish = /^(P|DIV|UL|OL|H1|H2|H3|BLOCKQUOTE|SECTION|LI)$/;
  for (const node of root.childNodes) {
    if (node.nodeType === 3) {
      const text = node.textContent.replace(/\s+/g, " ").trim();
      if (text) blocks.push({ type: "p", text });
      continue;
    }
    if (node.nodeType !== 1) continue;
    const tag = node.tagName;
    const cls = node.classList;
    const text = node.textContent.replace(/\s+/g, " ").trim();
    if (!text) continue;
    const hasBlockKids = [...node.children].some((child) => blockish.test(child.tagName));
    if (tag === "H1") blocks.push({ type: "h1", text });
    else if (tag === "H2") blocks.push({ type: "h2", text });
    else if (tag === "H3") blocks.push({ type: "h3", text });
    else if (cls.contains("eyebrow")) blocks.push({ type: "eyebrow", text });
    else if (cls.contains("meta") || cls.contains("subtitle") || cls.contains("muted")) blocks.push({ type: "meta", text });
    else if (tag === "LI") blocks.push({ type: "li", text });
    else if (tag === "BLOCKQUOTE") blocks.push({ type: "quote", text });
    else if (tag === "UL" || tag === "OL" || tag === "SECTION" || hasBlockKids) pdfBlocksFrom(node, blocks);
    else blocks.push({ type: "p", text });
  }
}

const PDF_STYLES = {
  h1: { size: 20, style: "bold", color: [32, 36, 42], before: 6, after: 8 },
  h2: { size: 10.5, style: "bold", color: [94, 108, 122], before: 16, after: 6, upper: true, rule: true },
  h3: { size: 12.5, style: "bold", color: [32, 36, 42], before: 10, after: 4 },
  eyebrow: { size: 8.5, style: "bold", color: [220, 106, 18], before: 0, after: 3, upper: true },
  meta: { size: 9.5, style: "normal", color: [94, 108, 122], before: 0, after: 5 },
  p: { size: 10.5, style: "normal", color: [57, 66, 76], before: 0, after: 5 },
  li: { size: 10.5, style: "normal", color: [57, 66, 76], before: 0, after: 3, indent: 14, bullet: true },
  quote: { size: 10.5, style: "italic", color: [57, 66, 76], before: 2, after: 6, indent: 14 },
};

// Direct PDF download (no print dialog). Falls back to print-to-PDF only if
// the jsPDF library failed to load.
function exportPdf(title, bodyHtml) {
  const JsPDF = window.jspdf && window.jspdf.jsPDF;
  if (!JsPDF) {
    const win = window.open("", "_blank");
    if (!win) {
      showBanner("Allow pop-ups for this site to export a PDF.");
      return;
    }
    win.document.open();
    win.document.write(buildPrintDoc(title, bodyHtml));
    win.document.close();
    win.focus();
    return;
  }

  const template = document.createElement("template");
  template.innerHTML = bodyHtml;
  const blocks = [];
  const roots = [...template.content.children];
  if (roots.length > 1 && roots.every((root) => root.tagName === "SECTION")) {
    roots.forEach((root, index) => {
      if (index) blocks.push({ type: "pagebreak" });
      pdfBlocksFrom(root, blocks);
    });
  } else {
    pdfBlocksFrom(template.content, blocks);
  }

  const doc = new JsPDF({ unit: "pt", format: "letter" });
  const margin = 56;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const bottom = doc.internal.pageSize.getHeight() - margin;
  let y = margin;

  for (const block of blocks) {
    if (block.type === "pagebreak") {
      doc.addPage();
      y = margin;
      continue;
    }
    const style = PDF_STYLES[block.type] || PDF_STYLES.p;
    const indent = style.indent || 0;
    doc.setFont("helvetica", style.style === "bold" ? "bold" : style.style === "italic" ? "italic" : "normal");
    doc.setFontSize(style.size);
    doc.setTextColor(...style.color);
    const text = style.upper ? block.text.toUpperCase() : block.text;
    const prefix = style.bullet ? "•  " : "";
    const lines = doc.splitTextToSize(prefix + text, width - indent);
    const lineHeight = style.size * 1.45;
    y += style.before || 0;
    for (const line of lines) {
      if (y + lineHeight > bottom) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin + indent, y + style.size);
      y += lineHeight;
    }
    if (style.rule) {
      doc.setDrawColor(224, 229, 235);
      doc.setLineWidth(0.75);
      doc.line(margin, y + 2, margin + width, y + 2);
      y += 4;
    }
    y += style.after || 0;
  }

  doc.save(`${slug(title)}.pdf`);
  showBanner("PDF downloaded.");
}

function downloadBlob(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Word-compatible .doc (HTML-based) - opens in Word and Google Docs.
function exportDoc(filename, bodyHtml) {
  const doc = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>${escapeHtml(filename)}</title>
<style>
  body { font-family: "Calibri", "Segoe UI", sans-serif; color: #20242a; line-height: 1.5; }
  .eyebrow { text-transform: uppercase; letter-spacing: 2px; font-size: 10pt; font-weight: bold; color: #c2640f; margin: 0 0 2pt; }
  h1 { font-size: 22pt; margin: 0 0 2pt; }
  .subtitle { font-size: 13pt; color: #39424c; margin: 0 0 4pt; }
  .meta { font-size: 9pt; color: #5e6c7a; margin: 0 0 14pt; }
  h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: 1px; color: #5e6c7a; border-bottom: 1px solid #e0e5eb; margin: 16pt 0 6pt; }
  h3 { font-size: 13pt; margin: 10pt 0 4pt; }
  .note { font-size: 11pt; color: #39424c; }
  .note ul, .note ol { margin: 4pt 0; padding-left: 22pt; }
  .note blockquote { margin: 6pt 0; padding-left: 10pt; border-left: 3px solid #ffd2a8; font-style: italic; }
  .muted { color: #8c97a3; }
</style></head><body>${bodyHtml}</body></html>`;
  downloadBlob(`${slug(filename)}.doc`, "﻿" + doc, "application/msword");
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showBanner("Copied.");
  } catch {
    showBanner("Copy failed. Export instead.");
  }
}

function getUserOpenAIKey() {
  return localStorage.getItem(OPENAI_KEY_STORE) || "";
}

function openAIHeaders() {
  const headers = {};
  const key = getUserOpenAIKey();
  if (key) headers["x-openai-api-key"] = key;
  if (ui.auth.accessToken) headers["x-preachflow-auth"] = ui.auth.accessToken;
  return headers;
}

function refreshOpenAIKeyState() {
  ui.openai.hasKey = Boolean(getUserOpenAIKey());
}

function saveOpenAIKey() {
  const key = ui.openAIKeyInput.trim();
  if (!key) {
    showBanner("Paste an OpenAI API key first.");
    return;
  }
  localStorage.setItem(OPENAI_KEY_STORE, key);
  ui.openAIKeyInput = "";
  refreshOpenAIKeyState();
  ui.showOpenAIKey = false;
  showBanner("OpenAI key saved in this browser.");
  render();
}

function clearOpenAIKey() {
  localStorage.removeItem(OPENAI_KEY_STORE);
  ui.openAIKeyInput = "";
  refreshOpenAIKeyState();
  showBanner("OpenAI key removed from this browser.");
  render();
}

function requireOpenAIKey() {
  refreshOpenAIKeyState();
  if (ui.openai.hasKey) return true;
  // App-provided engine: included with the account - just needs sign-in.
  if (ui.serverStatus.engineConfigured) {
    if (!ui.auth.configured || ui.auth.user) return true;
    ui.lastView = state.view !== "signin" ? state.view : "home";
    state.view = "signin";
    showBanner("Sign in to use Sermon Guide - it's included with your account.");
    render();
    return false;
  }
  ui.showOpenAIKey = true;
  showBanner("Add your own OpenAI API key to power Sermon Guide.");
  render();
  return false;
}

async function loadGoogleConfig() {
  try {
    const response = await fetch("./api/config");
    const data = await response.json();
    ui.google.clientId = data.googleClientId || "";
    ui.google.configured = Boolean(ui.google.clientId);
    ui.google.status = ui.google.configured
      ? "Google Docs ready to connect"
      : "Add GOOGLE_CLIENT_ID in Vercel";
    ui.google.statusKey = ui.google.configured ? "neutral" : "missing";
    await initSupabase(data);
  } catch {
    ui.google.configured = false;
    ui.google.status = "Google Docs config unavailable";
    ui.google.statusKey = "missing";
    ui.auth.configured = false;
    ui.auth.status = "Login config unavailable";
    ui.auth.statusKey = "missing";
  }
  render();
}

function loadSupabaseScript() {
  if (window.supabase?.createClient) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector("script[data-supabase]");
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = SUPABASE_SCRIPT;
    script.async = true;
    script.defer = true;
    script.dataset.supabase = "true";
    script.addEventListener("load", () => resolve(true), { once: true });
    script.addEventListener("error", () => resolve(false), { once: true });
    document.head.append(script);
  });
}

async function initSupabase(config) {
  ui.auth.configured = Boolean(config.supabaseUrl && config.supabaseAnonKey);
  if (!ui.auth.configured) {
    ui.auth.status = "Saved on this device";
    ui.auth.statusKey = "missing";
    return;
  }

  const loaded = await loadSupabaseScript();
  if (!loaded || !window.supabase?.createClient) {
    ui.auth.configured = false;
    ui.auth.status = "Could not load login service";
    ui.auth.statusKey = "missing";
    return;
  }

  ui.auth.client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  const { data } = await ui.auth.client.auth.getSession();
  ui.auth.accessToken = data?.session?.access_token || "";
  ui.auth.user = data.session?.user || null;
  ui.auth.status = ui.auth.user ? "Loading cloud progress..." : "Sign in to sync across devices";
  ui.auth.statusKey = ui.auth.user ? "syncing" : "neutral";
  // Show the restored session right away - the signed-in state must never
  // depend on a later event to become visible.
  render();

  ui.auth.client.auth.onAuthStateChange((event, session) => {
    ui.auth.user = session?.user || null;
    ui.auth.accessToken = session?.access_token || "";
    ui.auth.status = ui.auth.user ? "Loading cloud progress..." : "Signed out. Saving on this device.";
    ui.auth.statusKey = ui.auth.user ? "syncing" : "neutral";
    if (event === "PASSWORD_RECOVERY") {
      // The user arrived from a password-reset email: take them straight
      // to the set-a-new-password screen.
      ui.auth.recovery = true;
      ui.auth.passwordInput = "";
      ui.auth.confirmInput = "";
      state.view = "signin";
    }
    if (event === "SIGNED_IN" && state.view === "signin" && !ui.auth.recovery) state.view = "home";
    render();
    if (ui.auth.user && event !== "PASSWORD_RECOVERY") loadCloudState();
  });

  if (ui.auth.user) await loadCloudState();
}

async function sendMagicLink() {
  const email = ui.auth.emailInput.trim();
  if (!email || !ui.auth.client) {
    showBanner("Enter your email first.");
    return;
  }

  ui.auth.loading = true;
  ui.auth.status = "Sending magic link...";
  render();

  const { error } = await ui.auth.client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/app`,
    },
  });

  ui.auth.loading = false;
  if (error) {
    ui.auth.status = error.message || "Could not send magic link.";
    ui.auth.statusKey = "missing";
    showBanner("Could not send magic link.");
  } else {
    ui.auth.status = "Check your email for the sign-in link.";
    ui.auth.statusKey = "ready";
    showBanner("Magic link sent.");
  }
  render();
}

function requireAuthConfigured() {
  if (ui.auth.configured && ui.auth.client) return true;
  ui.auth.status = "Accounts need Supabase setup in Vercel. Your work is still saved on this device.";
  ui.auth.statusKey = "missing";
  showBanner("Sign-in needs Supabase setup (SUPABASE_URL, SUPABASE_ANON_KEY).");
  render();
  return false;
}

function afterSignedIn() {
  ui.auth.passwordInput = "";
  state.view = ui.lastView && ui.lastView !== "signin" ? ui.lastView : "workspace";
}

async function sendPasswordReset() {
  if (!requireAuthConfigured()) return;
  const email = ui.auth.emailInput.trim();
  if (!email) {
    showBanner("Enter your email above first, then tap Forgot.");
    return;
  }
  ui.auth.loading = true;
  ui.auth.status = "Sending a password reset link...";
  ui.auth.statusKey = "syncing";
  render();
  const { error } = await ui.auth.client.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/app`,
  });
  ui.auth.loading = false;
  if (error) {
    ui.auth.status = error.message || "Could not send the reset link.";
    ui.auth.statusKey = "missing";
    showBanner("Could not send the reset link.");
  } else {
    ui.auth.status = "Check your email for a password reset link. Opening it brings you back here to set a new password.";
    ui.auth.statusKey = "ready";
    showBanner("Password reset link sent - check your email.");
  }
  render();
}

async function savePasswordReset() {
  const password = ui.auth.passwordInput;
  const confirm = ui.auth.confirmInput;
  if (password.length < 6) {
    showBanner("Use a password of at least 6 characters.");
    return;
  }
  if (password !== confirm) {
    showBanner("The two passwords don't match.");
    return;
  }
  ui.auth.loading = true;
  render();
  const { error } = await ui.auth.client.auth.updateUser({ password });
  ui.auth.loading = false;
  if (error) {
    showBanner(error.message || "Could not update the password.");
  } else {
    ui.auth.recovery = false;
    ui.auth.passwordInput = "";
    ui.auth.confirmInput = "";
    state.view = "home";
    showBanner("Password updated - you're signed in.");
  }
  render();
}

async function signInWithPassword() {
  if (!requireAuthConfigured()) return;
  const email = ui.auth.emailInput.trim();
  const password = ui.auth.passwordInput;
  if (!email || !password) {
    showBanner("Enter your email and password.");
    return;
  }
  ui.auth.loading = true;
  ui.auth.status = "Signing in...";
  ui.auth.statusKey = "syncing";
  render();

  const { error } = await ui.auth.client.auth.signInWithPassword({ email, password });
  ui.auth.loading = false;
  if (error) {
    ui.auth.status = /invalid login credentials/i.test(error.message || "")
      ? "That email and password don't match an account here. If you usually sign in with Google or an email link, use that instead - or tap Forgot to set a password for this email."
      : error.message || "Could not sign in.";
    ui.auth.statusKey = "missing";
    showBanner("Sign-in failed - see the note below the form.");
  } else {
    afterSignedIn();
    showBanner("Signed in.");
  }
  render();
}

async function signUpWithPassword() {
  if (!requireAuthConfigured()) return;
  const email = ui.auth.emailInput.trim();
  const password = ui.auth.passwordInput;
  if (!email || !password) {
    showBanner("Enter your email and a password.");
    return;
  }
  if (password.length < 6) {
    showBanner("Use a password of at least 6 characters.");
    return;
  }
  ui.auth.loading = true;
  ui.auth.status = "Creating your account...";
  ui.auth.statusKey = "syncing";
  render();

  const { data, error } = await ui.auth.client.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: window.location.origin + window.location.pathname },
  });
  ui.auth.loading = false;
  if (error) {
    ui.auth.status = error.message || "Could not create account.";
    ui.auth.statusKey = "missing";
    showBanner("Sign-up failed.");
  } else if (data.session) {
    afterSignedIn();
    showBanner("Account created.");
  } else {
    ui.signinMode = "signin";
    ui.auth.status = "Account created - check your email to confirm, then sign in.";
    ui.auth.statusKey = "ready";
    showBanner("Check your email to confirm your account.");
  }
  render();
}

async function signInWithGoogle() {
  if (!requireAuthConfigured()) return;
  ui.auth.loading = true;
  ui.auth.status = "Redirecting to Google...";
  ui.auth.statusKey = "syncing";
  render();
  const { error } = await ui.auth.client.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/app` },
  });
  if (error) {
    ui.auth.loading = false;
    ui.auth.status = error.message || "Could not start Google sign-in.";
    ui.auth.statusKey = "missing";
    showBanner("Google sign-in failed.");
    render();
  }
}

async function signOut() {
  const signedIn = Boolean(ui.auth.client && ui.auth.user);
  // Signing out clears this device. That is safe when the work is already
  // synced to an account; when it is not, say so plainly before wiping.
  if (!signedIn) {
    const message = state.sermons.length
      ? "You are not signed in on this device, so this work is not backed up to an account. Clear PreachFlow from this device anyway?"
      : "Clear PreachFlow from this device and return to the sign-in screen?";
    if (!confirm(message)) return;
  }
  ui.auth.loading = true;
  render();
  // Push the latest work to the account first, then clear this device so
  // an open laptop can't hand a signed-out session to the next person.
  if (signedIn) {
    try {
      await saveCloudState({ background: true });
    } catch {
      /* the cloud copy is already current or unreachable; sign out anyway */
    }
  }
  try {
    await ui.auth.client?.auth.signOut();
  } catch {
    /* already signed out locally */
  }
  localWipeInProgress = true;
  localStorage.removeItem(STORE_KEY);
  window.location.hash = "#signin";
  window.location.reload();
}

async function loadCloudState() {
  if (!ui.auth.client || !ui.auth.user) return;

  ui.auth.loading = true;
  ui.auth.status = "Loading cloud progress...";
  ui.auth.statusKey = "syncing";
  render();

  const { data, error } = await ui.auth.client
    .from("preach_flow_user_state")
    .select("app_state, updated_at")
    .eq("user_id", ui.auth.user.id)
    .maybeSingle();

  if (error) {
    ui.auth.loading = false;
    ui.auth.status = error.message || "Could not load cloud progress.";
    ui.auth.statusKey = "missing";
    render();
    return;
  }

  if (data?.app_state && hasCloudContent(data.app_state)) {
    cloudSyncPaused = true;
    applyStateSnapshot(data.app_state);
    saveState();
    cloudSyncPaused = false;
    ui.auth.status = `Cloud progress loaded${data.updated_at ? ` ${formatTime(data.updated_at)}` : ""}.`;
    ui.auth.statusKey = "ready";
  } else {
    await saveCloudState({ announce: false });
    ui.auth.status = "Local progress copied to cloud.";
    ui.auth.statusKey = "ready";
  }

  ui.auth.loading = false;
  render();
}

function hasCloudContent(snapshot) {
  return Boolean(
    snapshot?.sermons?.length ||
      snapshot?.series?.length ||
      snapshot?.journalEntries?.length ||
      snapshot?.reviewText ||
      snapshot?.reviewMeta?.passage ||
      snapshot?.reviewMeta?.title ||
      (snapshot?.lens && Object.keys(snapshot.lens).length > 2),
  );
}

function scheduleCloudSync() {
  clearTimeout(cloudSyncTimer);
  if (!ui.auth.client || !ui.auth.user) return;

  cloudSyncTimer = setTimeout(() => {
    saveCloudState({ background: true });
  }, 1400);
}

async function saveCloudState(options = {}) {
  if (!ui.auth.client || !ui.auth.user) return;

  setAuthStatus("Saving to cloud...", "syncing");
  if (!options.background) render();

  const updatedAt = new Date().toISOString();
  const { error } = await ui.auth.client.from("preach_flow_user_state").upsert(
    {
      user_id: ui.auth.user.id,
      app_state: stateSnapshot(),
      updated_at: updatedAt,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    setAuthStatus(error.message || "Cloud save failed.", "missing");
    if (!options.background) showBanner("Cloud save failed.");
  } else {
    setAuthStatus(`Saved to cloud ${formatTime(updatedAt)}.`, "ready");
    if (options.announce) showBanner("Saved to cloud.");
  }
  if (!options.background || options.announce) render();
}

function setAuthStatus(message, key = "neutral") {
  ui.auth.status = message;
  ui.auth.statusKey = key;
  const button = document.querySelector("[data-auth-status]");
  if (!button) return;
  const label = ui.auth.user
    ? `Signed in: ${ui.auth.user.email || "Account"}`
    : ui.auth.configured
      ? "Sign in"
      : "Local save only";
  const dotKey = ui.auth.user ? "ready" : ui.auth.configured ? "neutral" : "missing";
  button.title = label;
  button.innerHTML = `<i class="status-dot ${dotKey}"></i>${escapeHtml(label)}`;
  const panelStatus = document.querySelector("[data-auth-panel-status]");
  if (panelStatus) panelStatus.textContent = message;
}

function loadGoogleScript() {
  if (window.google?.accounts?.oauth2) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector("script[data-google-identity]");
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = "true";
    script.addEventListener("load", () => resolve(true), { once: true });
    script.addEventListener("error", () => resolve(false), { once: true });
    document.head.append(script);
  });
}

async function ensureGoogleToken() {
  if (ui.google.accessToken) return true;
  if (!ui.google.clientId) {
    setGoogleStatus("Add GOOGLE_CLIENT_ID in Vercel", "missing");
    showBanner("Google Docs needs GOOGLE_CLIENT_ID in Vercel first.");
    return false;
  }

  const loaded = await loadGoogleScript();
  if (!loaded || !window.google?.accounts?.oauth2) {
    setGoogleStatus("Could not load Google sign-in", "missing");
    return false;
  }

  if (!googleTokenClient) {
    googleTokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: ui.google.clientId,
      scope: GOOGLE_SCOPES,
      callback: () => {},
    });
  }

  setGoogleStatus("Waiting for Google permission", "syncing");
  return new Promise((resolve) => {
    googleTokenClient.callback = (response) => {
      if (response.error || !response.access_token) {
        ui.google.accessToken = "";
        ui.google.connected = false;
        setGoogleStatus("Google connection cancelled", "missing");
        render();
        resolve(false);
        return;
      }
      ui.google.accessToken = response.access_token;
      ui.google.connected = true;
      setGoogleStatus("Google connected", "ready");
      render();
      resolve(true);
    };
    googleTokenClient.requestAccessToken({ prompt: "consent" });
  });
}

async function googleFetch(url, options = {}) {
  const headers = {
    Authorization: `Bearer ${ui.google.accessToken}`,
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };
  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      ui.google.accessToken = "";
      ui.google.connected = false;
      setGoogleStatus("Reconnect Google to sync", "missing");
    }
    throw new Error(data.error?.message || `Google returned ${response.status}`);
  }

  return data;
}

function googleDocTitle(sermon) {
  const passage = sermon?.passage || "Untitled sermon";
  const title = sermon?.title ? ` - ${sermon.title}` : "";
  return `Preach Flow | ${passage}${title}`;
}

// One-time export: the manuscript becomes a new Google Doc (headings,
// bold, and lists preserved) and opens in a new tab. No ongoing sync -
// after export, the Doc is its own copy.
async function exportManuscriptToGoogleDocs() {
  const active = getActive();
  if (!active || ui.google.loading) return;
  if (!ui.google.configured) {
    showBanner("Google Docs needs GOOGLE_CLIENT_ID configured on this deployment (see DEPLOY.md).");
    return;
  }
  const manuscript = sanitizeRichHtml(phaseNoteHtml(active, manuscriptPhaseDef()));
  if (!richHtmlToText(manuscript).trim()) {
    showBanner("Write the manuscript first - there's nothing to send yet.");
    return;
  }
  const connected = await ensureGoogleToken();
  if (!connected) return;
  ui.google.loading = true;
  render();
  try {
    const boundary = `pf${Date.now()}`;
    const metadata = { name: googleDocTitle(active), mimeType: "application/vnd.google-apps.document" };
    const html = `<html><head><meta charset="utf-8"></head><body><h1>${escapeHtml(active.passage || "Sermon")}${active.title ? ` - ${escapeHtml(active.title)}` : ""}</h1>${manuscript}</body></html>`;
    const body = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n${html}\r\n--${boundary}--`;
    const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ui.google.accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error?.message || `Google returned ${response.status}`);
    const url = data.webViewLink || `https://docs.google.com/document/d/${data.id}/edit`;
    showBanner("Manuscript sent to Google Docs - opening it now.");
    window.open(url, "_blank", "noopener");
  } catch (error) {
    showBanner(`Could not send to Google Docs (${error.message || "connection failed"}).`);
  }
  ui.google.loading = false;
  render();
}

function setGoogleStatus(message, key = "neutral") {
  ui.google.status = message;
  ui.google.statusKey = key;
  const label = document.querySelector("[data-google-status]");
  if (label) label.textContent = message;
  const dot = document.querySelector("[data-google-dot]");
  if (dot) dot.className = `google-status-dot ${key}`;
}

const EXEC_COMMANDS = {
  bold: ["bold"],
  italic: ["italic"],
  underline: ["underline"],
  ul: ["insertUnorderedList"],
  ol: ["insertOrderedList"],
  h2: ["formatBlock", "h2"],
  h3: ["formatBlock", "h3"],
  h4: ["formatBlock", "h4"],
  quote: ["formatBlock", "blockquote"],
  "size-2": ["fontSize", "2"],
  "size-3": ["fontSize", "3"],
  "size-4": ["fontSize", "4"],
  "size-5": ["fontSize", "5"],
};

// The heading/blockquote element the selection currently sits inside, if any.
function currentBlockEl(editor) {
  const selection = window.getSelection();
  let node = selection?.anchorNode || null;
  while (node && node !== editor) {
    if (node.nodeType === 1) {
      const tag = node.tagName.toLowerCase();
      if (tag === "h2" || tag === "h3" || tag === "h4" || tag === "blockquote") return node;
    }
    node = node.parentNode;
  }
  return null;
}

// Replace an h3/blockquote with plain paragraph(s). execCommand cannot do
// this: formatBlock("p") inside a blockquote nests a <p> INSIDE it instead of
// removing it. Moving childNodes keeps the live selection ranges valid.
function unwrapBlock(block) {
  const blockish = /^(P|DIV|UL|OL|H2|H3|H4|BLOCKQUOTE)$/;
  if ([...block.children].some((child) => blockish.test(child.tagName))) {
    block.replaceWith(...block.childNodes);
  } else {
    const p = document.createElement("p");
    while (block.firstChild) p.appendChild(block.firstChild);
    block.replaceWith(p);
  }
}

function formatDoc(format) {
  const editor = document.querySelector('[data-action="phase-editor"]');
  if (!editor) return;
  editor.focus({ preventScroll: true });
  try {
    if (format === "h2" || format === "h3" || format === "h4" || format === "quote" || format === "p") {
      const tag = format === "quote" ? "blockquote" : format;
      const block = currentBlockEl(editor);
      if (block && (tag === "p" || block.tagName.toLowerCase() === tag)) {
        unwrapBlock(block);
      } else {
        document.execCommand("formatBlock", false, tag);
      }
    } else {
      const command = EXEC_COMMANDS[format];
      if (!command) return;
      document.execCommand(command[0], false, command[1] || null);
    }
  } catch (_) {
    /* execCommand is deprecated but still works for this rich-text editor */
  }
  persistPhaseEditor(editor);
}

function persistPhaseEditor(editor) {
  const active = editor.dataset.sermon
    ? state.sermons.find((sermon) => sermon.id === editor.dataset.sermon)
    : getActive();
  if (!active || !editor.dataset.phase) return;
  const clean = sanitizeRichHtml(editor.innerHTML);
  const text = richHtmlToText(clean);
  active.notes[editor.dataset.phase] = text ? clean : "";
  if (editor.dataset.workPhase) logWorkForPhase(active, editor.dataset.workPhase, text);
  active.updatedAt = new Date().toISOString();
  saveState();
}

function formatEditor(targetKey, format) {
  const editor = getFormattingEditor(targetKey);
  if (!editor) return;

  const start = editor.selectionStart ?? editor.value.length;
  const end = editor.selectionEnd ?? start;
  const selected = editor.value.slice(start, end);
  let replacement = selected;
  let cursorStart = start;
  let cursorEnd = end;

  if (format === "bold") {
    replacement = `**${selected || "important thought"}**`;
    cursorStart = start + 2;
    cursorEnd = start + replacement.length - 2;
  }
  if (format === "italic") {
    replacement = `_${selected || "emphasis"}_`;
    cursorStart = start + 1;
    cursorEnd = start + replacement.length - 1;
  }
  if (format === "bullet") {
    const text = selected || "First point\nSecond point";
    replacement = text
      .split("\n")
      .map((line) => (line.trim().startsWith("- ") ? line : `- ${line}`))
      .join("\n");
    cursorStart = start + replacement.length;
    cursorEnd = cursorStart;
  }
  if (format === "heading") {
    replacement = `## ${selected || "Section heading"}`;
    cursorStart = start + 3;
    cursorEnd = start + replacement.length;
  }

  editor.value = `${editor.value.slice(0, start)}${replacement}${editor.value.slice(end)}`;
  persistFormattedEditorValue(targetKey, editor);
  editor.focus();
  if (typeof editor.setSelectionRange === "function") {
    editor.setSelectionRange(cursorStart, cursorEnd);
  }
}

function getFormattingEditor(targetKey) {
  if (targetKey === "phase-note") return document.querySelector('[data-action="phase-note"]');
  if (targetKey === "journal-quick") return document.querySelector('[data-action="journal-quick-body"]');
  if (targetKey === "journal-main") return document.querySelector('[data-action="journal-draft-body"]');
  return null;
}

function persistFormattedEditorValue(targetKey, editor) {
  if (targetKey === "phase-note") {
    const active = getActive();
    if (!active) return;
    active.notes[editor.dataset.phase] = editor.value;
    active.updatedAt = new Date().toISOString();
    saveState();
    return;
  }
  ui.journalDraft.body = editor.value;
  const submit = document.querySelector('form[data-form="journal-entry"] button[type="submit"]');
  if (submit) submit.disabled = !ui.journalDraft.body.trim();
  const quickSubmit = document.querySelector('[data-action="save-quick-journal"]');
  if (quickSubmit) quickSubmit.disabled = !ui.journalDraft.body.trim();
}

function slug(value) {
  return (value || "sermon")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

// Deleting a sermon always flows through the confirmation modal
// (ui.confirmDeleteId) - never a bare click, never a browser confirm().
function renderConfirmDeleteModal() {
  const sermon = state.sermons.find((item) => item.id === ui.confirmDeleteId);
  if (!sermon) return "";
  const hasDoc = Boolean(sermon.googleDoc?.id);
  return `
    <div class="pf-overlay" data-action="close-confirm-delete" data-overlay>
      <div class="pf-modal" data-stop style="max-width:440px;">
        <div class="pf-modal-head">
          <span class="pf-eyebrow" style="color:var(--ofc-danger);">Delete sermon</span>
        </div>
        <p style="font-size:15.5px;line-height:1.55;margin:6px 0 10px;">Delete <strong>${escapeHtml(sermon.passage || "this sermon")}</strong>${sermon.title ? ` - “${escapeHtml(sermon.title)}”` : ""}${sermon.date ? ` (${escapeHtml(fmtDate(sermon.date))})` : ""}?</p>
        <p class="pf-helper" style="margin-bottom:4px;">This permanently removes the sermon with all of its phase notes, worksheets, outline, and debrief from Preach Flow. <strong>This cannot be undone.</strong>${hasDoc ? " The synced Google Doc itself stays safe in your Google Drive." : ""}</p>
        <div class="pf-modal-actions">
          <button class="pf-btn" data-action="close-confirm-delete">Cancel</button>
          <button class="pf-btn pf-btn-danger" data-action="confirm-delete-sermon">Yes, delete it</button>
        </div>
      </div>
    </div>
  `;
}

function deleteSermonById(id) {
  const sermon = state.sermons.find((item) => item.id === id);
  ui.confirmDeleteId = "";
  if (!sermon) {
    render();
    return;
  }
  state.sermons = state.sermons.filter((item) => item.id !== id);
  if (state.activeId === id) state.activeId = state.sermons[0]?.id || null;
  if (ui.debriefSermonId === id) ui.debriefSermonId = "";
  saveState();
  showBanner(`Deleted "${sermon.passage || "sermon"}".`);
  render();
}

async function checkServerStatus() {
  try {
    const response = await fetch("./api/status");
    ui.serverStatus = { ...(await response.json()), checked: true };
  } catch {
    ui.serverStatus = { available: false, configured: false, checked: true };
  }
  render();
}

function closeToolMenus() {
  document.querySelectorAll("[data-tool-menu].open").forEach((menu) => menu.classList.remove("open"));
}

function closeNavMenus() {
  document.querySelectorAll("[data-nav-menu].open").forEach((menu) => menu.classList.remove("open"));
}

function closeOverlays() {
  ui.confirmDeleteId = "";
  ui.showAuth = false;
  ui.showOpenAIKey = false;
  ui.showSwitcher = false;
  ui.showDetails = false;
  ui.showSlides = false;
  ui.showImport = false;
  ui.pm.paste = false;
  ui.pm.bridge = false;
  ui.libImport.show = false;
}

document.addEventListener("click", (event) => {
  // Any click outside the heading dropdown closes it.
  if (!event.target.closest(".pf-tool-menu-wrap")) closeToolMenus();
  if (!event.target.closest("[data-nav-group]")) closeNavMenus();

  // Backdrop click on a modal overlay closes it.
  const overlay = event.target.closest("[data-overlay]");
  if (overlay && !event.target.closest("[data-stop]")) {
    closeOverlays();
    render();
    return;
  }

  // Clicking a Passage Map mark selects it: ring it, float a remove x on
  // the word, and bring the Selected Mark card into view.
  const pmMark = event.target.closest("[data-pm-passage] .pm-m");
  if (pmMark) {
    ui.pm.selected = pmMark.getAttribute("data-id") || "";
    ui.pm.tool = "mark";
    render();
    requestAnimationFrame(() => {
      pmShowRemoveChip();
      document.querySelector(".pm-selected")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
    return;
  }
  if (!event.target.closest("#pf-pm-chip")) pmHideRemoveChip();

  const target = event.target.closest("[data-action], [data-view], [data-sermon-card]");
  if (!target) return;

  if (target.dataset.view) {
    state.view = target.dataset.view;
    if (state.view === "practice") {
      state.view = "pulpit";
      ui.pulpit.section = 0;
      requestPracticeWakeLock();
    } else if (state.view === "pulpit") {
      ui.pulpit.section = 0;
      ui.pulpit.showSettings = false;
      requestPracticeWakeLock();
    }
    ui.showNew = false;
    closeOverlays();
    saveState();
    render();
    return;
  }

  if (target.dataset.sermonCard) {
    state.activeId = target.dataset.sermonCard;
    const opened = state.sermons.find((sermon) => sermon.id === target.dataset.sermonCard);
    state.view = opened?.imported ? "editor" : "workspace";
    saveState();
    render();
    return;
  }

  const action = target.dataset.action;
  if (action === "toggle-theme") setTheme(state.theme === "dark" ? "light" : "dark");
  if (action === "open-account") {
    if (state.view !== "profile" && state.view !== "signin") ui.lastView = state.view;
    ui.profileTab = "account";
    state.view = "profile";
    closeOverlays();
    render();
  }
  if (action === "go-signin") {
    if (state.view !== "signin") ui.lastView = state.view;
    state.view = "signin";
    closeOverlays();
    render();
  }
  if (action === "close-signin") {
    state.view = ui.lastView && ui.lastView !== "signin" && ui.lastView !== "profile" ? ui.lastView : "home";
    render();
  }
  if (action === "new-sermon") {
    ui.showNew = true;
    ui.showSwitcher = false;
    ui.newPassage = "";
    state.view = "workspace";
    render();
    // The book list feeds the form's passage picker.
    loadBibleBooks().then((books) => {
      if (books.length && ui.showNew) render();
    });
  }
  if (action === "cancel-new") {
    ui.showNew = false;
    ui.newPassage = "";
    render();
  }
  if (action === "set-phase") {
    updateActive({ activePhase: target.dataset.phase });
    render();
  }
  if (action === "journey-jump") {
    const bi = Number(target.dataset.block);
    const phase = PHASES.find((p) => p.block === bi) || PHASES[0];
    updateActive({ activePhase: phase.id });
    render();
  }
  if (action === "prev-phase" || action === "next-phase") {
    const active = getActive();
    if (!active) return;
    const curIdx = PHASES.findIndex((p) => p.id === active.activePhase);
    const nextIdx = Math.min(PHASES.length - 1, Math.max(0, curIdx + (action === "next-phase" ? 1 : -1)));
    updateActive({ activePhase: PHASES[nextIdx].id });
    render();
  }
  if (action === "mark-preached") {
    updateActive({ preached: true });
    showBanner("Marked as preached - it's in your Library. Debrief when you're ready.");
    render();
  }
  if (action === "toggle-complete") {
    toggleComplete(target.dataset.phase);
  }
  if (action === "set-audience") {
    ui.audience = target.dataset.audience;
    render();
  }
  if (action === "debrief-complete" || action === "debrief-skip") {
    const sermon = state.sermons.find((item) => item.id === target.dataset.sermon);
    if (sermon) closeDebrief(sermon, action === "debrief-complete" ? "done" : "skipped");
  }
  if (action === "debrief-reopen") {
    const sermon = state.sermons.find((item) => item.id === target.dataset.sermon);
    if (!sermon) return;
    sermon.debriefStatus = "";
    ui.debriefSermonId = sermon.id;
    saveState();
    render();
  }
  if (action === "audience-add") {
    ui.showAudienceAdd = true;
    render();
    requestAnimationFrame(() => document.querySelector("[data-audience-name]")?.focus());
  }
  if (action === "audience-cancel") {
    ui.showAudienceAdd = false;
    render();
  }
  if (action === "audience-save") {
    const active = getActive();
    const name = document.querySelector("[data-audience-name]")?.value.trim() || "";
    if (!active) return;
    if (!name) {
      showBanner("Name the audience first.");
      return;
    }
    if (sermonAudiences(active).includes(name)) {
      showBanner("That audience already exists.");
      return;
    }
    active.customAudiences = [...(active.customAudiences || []), name];
    ui.audience = name;
    ui.showAudienceAdd = false;
    active.updatedAt = new Date().toISOString();
    saveState();
    render();
  }
  if (action === "audience-remove") {
    const active = getActive();
    if (!active) return;
    const name = target.dataset.audience;
    active.customAudiences = (active.customAudiences || []).filter((entry) => entry !== name);
    delete active.worksheet[`application.${name}`];
    if (ui.audience === name) ui.audience = APPLICATION_AUDIENCES[0];
    active.updatedAt = new Date().toISOString();
    saveState();
    render();
  }
  if (action === "outline-add") {
    const active = getActive();
    if (!active) return;
    active.outline.push({ title: "", sub: "", parts: [] });
    active.updatedAt = new Date().toISOString();
    saveState();
    render();
  }
  if (action === "outline-part-add") {
    const active = getActive();
    const movement = active?.outline[Number(target.dataset.index)];
    if (!movement) return;
    movement.parts = [...(movement.parts || []), { id: genId(), kind: target.dataset.kind, text: "" }];
    active.updatedAt = new Date().toISOString();
    saveState();
    render();
    requestAnimationFrame(() => {
      const rows = document.querySelectorAll(`[data-action="outline-part-text"][data-index="${target.dataset.index}"]`);
      rows[rows.length - 1]?.focus();
    });
  }
  if (action === "outline-part-remove") {
    const active = getActive();
    const movement = active?.outline[Number(target.dataset.index)];
    if (!movement) return;
    movement.parts = (movement.parts || []).filter((part) => part.id !== target.dataset.part);
    active.updatedAt = new Date().toISOString();
    saveState();
    render();
  }
  if (action === "outline-remove") {
    const active = getActive();
    if (!active) return;
    active.outline.splice(Number(target.dataset.index), 1);
    active.updatedAt = new Date().toISOString();
    saveState();
    render();
  }
  if (action === "outline-up" || action === "outline-down") {
    const active = getActive();
    if (!active) return;
    const index = Number(target.dataset.index);
    const swap = action === "outline-up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= active.outline.length) return;
    const tmp = active.outline[index];
    active.outline[index] = active.outline[swap];
    active.outline[swap] = tmp;
    active.updatedAt = new Date().toISOString();
    saveState();
    render();
  }
  // ---- Passage Map ----
  if (action === "pm-tool") {
    ui.pm.tool = target.dataset.tool;
    render();
  }
  if (action === "pm-pen") {
    ui.pm.pen = ui.pm.pen === target.dataset.cat ? "" : target.dataset.cat || "";
    render();
  }
  if (action === "pm-fetch") {
    pmFetchPassage();
  }
  if (action === "pm-paste-open") {
    ui.pm.paste = true;
    ui.pm.pasteTranslation = pmActiveMap()?.translation || state.preachingProfile.translation || "";
    render();
  }
  if (action === "pm-paste-close") {
    ui.pm.paste = false;
    render();
  }
  if (action === "pm-paste-apply") {
    const map = pmActiveMap();
    if (!map) return;
    const verses = parsePastedPassage(ui.pm.pasteText);
    if (!verses.length) {
      showBanner("Paste the passage text first.");
      return;
    }
    map.verses = verses;
    map.highlights = [];
    map.hiddenCategories = [];
    map.translation = ui.pm.pasteTranslation.trim();
    map.attribution = map.translation ? `${map.translation} · pasted by the preacher` : "Pasted by the preacher";
    ui.pm.paste = false;
    ui.pm.pasteText = "";
    ui.pm.selected = "";
    pmSave();
    showBanner("Passage loaded - pick a pen and start marking.");
    render();
  }
  if (action === "pm-scan-connectors") {
    let count = 0;
    PM_SCAN_CONNECTORS.forEach((word) => {
      count += pmMarkWord(word, "connector");
    });
    showBanner(count ? `Marked ${count} connector${count === 1 ? "" : "s"} - click each one to label the relationship.` : "No unmarked connectors found.");
    render();
  }
  if (action === "pm-mark-word") {
    const count = pmMarkWord(target.dataset.word, "repeated");
    showBanner(count ? `Marked “${target.dataset.word}” ${count} time${count === 1 ? "" : "s"}.` : "Every occurrence is already inside a mark.");
    render();
  }
  if (action === "pm-remove-mark") {
    pmRemoveHighlight(target.dataset.id);
    render();
  }
  if (action === "pm-cat-vis") {
    const map = pmActiveMap();
    if (!map) return;
    const cat = target.dataset.cat;
    map.hiddenCategories = map.hiddenCategories.includes(cat)
      ? map.hiddenCategories.filter((key) => key !== cat)
      : [...map.hiddenCategories, cat];
    pmSave();
    render();
  }
  if (action === "pm-section-here") {
    const map = pmActiveMap();
    if (!map) return;
    const section = { id: genId(), title: "", verseRange: "", startRef: target.dataset.ref, summary: "", mainIdea: "", functionInPassage: "" };
    map.sections.push(section);
    pmRecomputeSectionRanges(map);
    ui.pm.selectedSection = section.id;
    pmSave();
    render();
    requestAnimationFrame(() => document.querySelector('[data-action="pm-section-field"][data-field="title"]')?.focus());
  }
  if (action === "pm-section-open") {
    ui.pm.selectedSection = target.dataset.id;
    ui.pm.tool = "sections";
    render();
  }
  if (action === "pm-section-close") {
    ui.pm.selectedSection = "";
    render();
  }
  if (action === "pm-section-remove-id") {
    const map = pmActiveMap();
    if (!map) return;
    map.sections = map.sections.filter((section) => section.id !== target.dataset.id);
    pmRecomputeSectionRanges(map);
    if (ui.pm.selectedSection === target.dataset.id) ui.pm.selectedSection = "";
    pmSave();
    render();
  }
  if (action === "pm-outline-bridge" || action === "pm-outline-bridge-from-phase") {
    const map = pmActiveMap();
    if (!map || !pmOutlineMovements(map).length) {
      showBanner("Give your sections titles first - the outline comes from them.");
      return;
    }
    if (action === "pm-outline-bridge-from-phase") state.view = "map";
    ui.pm.bridge = true;
    render();
  }
  if (action === "pm-bridge-cancel") {
    ui.pm.bridge = false;
    render();
  }
  if (action === "pm-bridge-add" || action === "pm-bridge-replace") {
    const active = getActive();
    const map = pmActiveMap();
    if (!active || !map) return;
    const movements = pmOutlineMovements(map);
    active.outline =
      action === "pm-bridge-replace"
        ? movements
        : [...active.outline.filter((movement) => movement.title.trim() || movement.sub.trim()), ...movements];
    ui.pm.bridge = false;
    updateActive({ activePhase: "structure" });
    state.view = "workspace";
    saveState();
    showBanner("Your passage movements are in the Outline Lab - shape the sermon from what the text is doing.");
    render();
  }
  if (action === "ministry-wizard-start") {
    const cards = { impact: IMPACT_CARDS, shepherd: SHEPHERD_CARDS, pack: PACK_CARDS }[target.dataset.store] || [];
    const card = cards.find((entry) => entry.key === target.dataset.key);
    const storeObj = ministryStore(target.dataset.store);
    if (!card || !storeObj) return;
    const existing = ministryFilled(storeObj, card.key, card.fields) ? storeObj[card.key] : "";
    ui.ministryWizard = {
      store: target.dataset.store,
      key: card.key,
      fields: card.fields,
      step: 0,
      answers: parseMinistryAnswers(existing, card.fields),
    };
    render();
  }
  if (action === "ministry-wizard-back") {
    if (ui.ministryWizard && ui.ministryWizard.step > 0) {
      ui.ministryWizard.step -= 1;
      render();
    }
  }
  if (action === "ministry-wizard-next") {
    const wizard = ui.ministryWizard;
    if (!wizard) return;
    if (wizard.step >= wizard.fields.length - 1) {
      finishMinistryWizard();
    } else {
      wizard.step += 1;
      render();
    }
  }
  if (action === "ministry-wizard-cancel") {
    finishMinistryWizard();
  }
  if (action === "ministry-edit") {
    ui.ministryEdit = `${target.dataset.store}.${target.dataset.key}`;
    render();
  }
  if (action === "ministry-edit-done") {
    ui.ministryEdit = null;
    render();
  }
  if (action === "ministry-copy-formatted") {
    const active = getActive();
    const cards = { impact: IMPACT_CARDS, shepherd: SHEPHERD_CARDS, pack: PACK_CARDS }[target.dataset.store] || [];
    const card = cards.find((entry) => entry.key === target.dataset.key);
    if (!active || !card) return;
    copyRichText(ministryDocHtml(active, target.dataset.store, card), ministryDocPlainText(active, target.dataset.store, card));
  }
  if (action === "ministry-wizard-suggest") {
    const wizard = ui.ministryWizard;
    if (!wizard) return;
    const field = wizard.fields[wizard.step];
    const existing = (wizard.answers[field] || "").trim();
    wizard.answers[field] = existing ? `${existing}\n${target.dataset.text}` : target.dataset.text;
    render();
    requestAnimationFrame(() => {
      const area = document.querySelector('[data-action="ministry-wizard-answer"]');
      if (area) {
        area.focus();
        area.setSelectionRange(area.value.length, area.value.length);
      }
    });
  }
  if (action === "reader-open") {
    openReader(target.dataset.reference || "", target.dataset.target || "");
  }
  if (action === "reader-close") {
    ui.reader.show = false;
    render();
  }
  if (action === "reader-prev") {
    readerStepChapter(-1);
  }
  if (action === "reader-next") {
    readerStepChapter(1);
  }
  if (action === "reader-copy") {
    copyText(readerPlainText());
  }
  if (action === "reader-insert") {
    insertIntoEditor(scripturePlainHtml(ui.reader.reference, ui.reader.translation, readerVerseText()));
    ui.reader.show = false;
    showBanner("Passage placed in your work.");
    render();
  }
  if (action === "reader-to-map") {
    loadPassageIntoMap(ui.reader.verses, ui.reader.reference, ui.reader.translation, ui.reader.attribution);
    ui.reader.show = false;
    showBanner("Passage loaded - pick a pen and start marking.");
    render();
  }
  if (action === "cal-import-open") {
    ui.calImport = { show: true, text: "", rows: [], busy: false, gdocs: { open: false, loading: false, files: [], query: "", picked: {} } };
    render();
  }
  if (action === "cal-close") {
    ui.calImport = { show: false, text: "", rows: [], busy: false, gdocs: { open: false, loading: false, files: [], query: "", picked: {} } };
    render();
  }
  if (action === "cal-parse") {
    calReadText(ui.calImport.text, "the pasted rows");
    ui.calImport.text = "";
  }
  if (action === "cal-gdocs-open" || action === "cal-gdocs-search") {
    loadCalGDocsList();
  }
  if (action === "cal-gdocs-add") {
    readCalGDocFile(target.dataset.id, target.dataset.name || "Drive file", target.dataset.mime || "");
  }
  if (action === "cal-row-remove") {
    ui.calImport.rows = ui.calImport.rows.filter((row) => row.id !== target.dataset.id);
    // Removing a row is a surgical DOM edit, never a re-render: the dialog
    // cannot scroll, and the X stays under the cursor for the next click.
    const node = target.closest("[data-cal-row]");
    if (!ui.calImport.rows.length || !node) {
      render();
      return;
    }
    const divider = node.previousElementSibling?.classList.contains("pf-cal-src") ? node.previousElementSibling : null;
    const nextRow = node.nextElementSibling;
    node.remove();
    // A source heading with nothing left under it should go too.
    if (divider && (!nextRow || nextRow.classList.contains("pf-cal-src"))) divider.remove();
    syncCalApplyButton();
  }
  if (action === "cal-row-include") {
    const row = ui.calImport.rows.find((entry) => entry.id === target.dataset.id);
    if (row) {
      row.skip = false;
      row.note = "";
      render();
    }
  }
  if (action === "cal-apply") {
    applyCalImport();
  }
  if (action === "lib-import-open") {
    ui.libImport = { show: true, queue: [], gdocs: { open: false, loading: false, files: [], query: "", picked: {} } };
    render();
  }
  if (action === "lib-import-close") {
    ui.libImport = { show: false, queue: [], gdocs: { open: false, loading: false, files: [], query: "", picked: {} } };
    render();
  }
  if (action === "lib-import-remove") {
    ui.libImport.queue = ui.libImport.queue.filter((item) => item.id !== target.dataset.id);
    const node = target.closest("[data-lib-row]");
    if (!ui.libImport.queue.length || !node) {
      render();
      return;
    }
    node.remove();
    syncLibApplyButton();
  }
  if (action === "lib-import-apply") {
    applyLibImport();
  }
  if (action === "lib-gdocs-open" || action === "lib-gdocs-search") {
    loadGDocsList();
  }
  if (action === "lib-gdocs-add") {
    importGDocById(target.dataset.id, target.dataset.name || "Google Doc");
  }
  if (action === "toggle-check") {
    const active = getActive();
    if (!active) return;
    const phaseId = target.dataset.phase;
    const index = Number(target.dataset.index);
    if (autoChecked(active, phaseId, index)) {
      showBanner(`Checked automatically - ${autoCheckFor(phaseId, index).why}.`);
      return;
    }
    const key = noteItemKey(phaseId, index);
    const checklist = { ...active.checklist, [key]: !active.checklist?.[key] };
    updateActive({ checklist });
    render();
  }
  if (action === "phase-action") {
    tapPhaseAction(Number(target.dataset.actionIndex));
  }
  if (action === "encourage-dismiss") {
    ui.encourage = null;
    clearTimeout(encourageTimer);
    render();
  }
  if (action === "coach-cta") {
    ui.showCoach = true;
    tapPhaseAction(0);
  }
  if (action === "send") {
    send();
  }
  if (action === "open-coach") {
    ui.showCoach = true;
    render();
  }
  if (action === "close-coach") {
    ui.showCoach = false;
    render();
  }
  if (action === "heading-menu") {
    // Toggle the dropdown in place - no render(), so the editor selection survives.
    const menu = target.parentElement?.querySelector("[data-tool-menu]");
    if (menu) menu.classList.toggle("open");
    return;
  }
  if (action === "nav-menu") {
    const menu = target.closest("[data-nav-group]")?.querySelector("[data-nav-menu]");
    const wasOpen = menu?.classList.contains("open");
    closeNavMenus();
    if (menu && !wasOpen) menu.classList.add("open");
    return;
  }
  if (action === "format-doc") {
    formatDoc(target.dataset.format);
    closeToolMenus();
  }
  if (action === "open-switcher") {
    ui.showSwitcher = true;
    ui.switcherQuery = "";
    render();
  }
  if (action === "close-switcher") {
    ui.showSwitcher = false;
    render();
  }
  if (action === "select-sermon") {
    state.activeId = target.dataset.sermon;
    state.view = "workspace";
    ui.showSwitcher = false;
    ui.showNew = false;
    saveState();
    render();
  }
  if (action === "open-details") {
    ui.showSwitcher = false;
    ui.showDetails = true;
    render();
  }
  if (action === "close-details") {
    ui.showDetails = false;
    render();
  }
  if (action === "open-slides") {
    ui.showSlides = true;
    render();
  }
  if (action === "close-slides") {
    ui.showSlides = false;
    render();
  }
  if (action === "slides-refresh") {
    const active = getActive();
    if (!active) return;
    updateActive({ slidesDoc: generateSlidesDoc(active) });
    render();
  }
  if (action === "slides-export-pdf" || action === "slides-export-doc") {
    const active = getActive();
    if (!active) return;
    const editor = document.querySelector('[data-action="slides-editor"]');
    const html = sanitizeRichHtml(editor ? editor.innerHTML : active.slidesDoc || generateSlidesDoc(active));
    const name = `${active.passage || "Sermon"} slides`;
    if (action === "slides-export-pdf") exportPdf(name, `<h1>Slides - ${escapeHtml(active.passage || "Sermon")}</h1>${html}`);
    else exportDoc(name, `<h1>Slides - ${escapeHtml(active.passage || "Sermon")}</h1>${html}`);
  }
  if (action === "open-import") {
    ui.showImport = true;
    ui.importText = "";
    ui.importStatusNote = "";
    render();
  }
  if (action === "close-import") {
    ui.showImport = false;
    render();
  }
  if (action === "delete-sermon") {
    ui.showDetails = false;
    ui.confirmDeleteId = target.dataset.sermon || state.activeId || "";
    render();
  }
  if (action === "confirm-delete-sermon") {
    deleteSermonById(ui.confirmDeleteId);
  }
  if (action === "close-confirm-delete") {
    ui.confirmDeleteId = "";
    render();
  }
  if (action === "editor-export-pdf" || action === "editor-export-doc") {
    const active = getActive();
    if (!active) return;
    if (!manuscriptWordCount(active)) {
      showBanner("No manuscript to export yet.");
      return;
    }
    const name = `${active.passage || "Sermon"} manuscript`;
    if (action === "editor-export-pdf") exportPdf(name, manuscriptDocHtml(active));
    else exportDoc(name, manuscriptDocHtml(active));
  }
  if (action === "practice-toggle") {
    togglePracticeTimer();
  }
  if (action === "pulpit-exit") {
    releasePracticeWakeLock();
    state.view = "workspace";
    saveState();
    render();
  }
  if (action === "pulpit-next") {
    pulpitStep(1);
  }
  if (action === "pulpit-prev") {
    pulpitStep(-1);
  }
  if (action === "pulpit-font") {
    state.pulpitPrefs.fontStep = normalizeFontStep(state.pulpitPrefs.fontStep + Number(target.dataset.delta));
    saveState();
    render();
  }
  if (action === "pulpit-theme") {
    const order = ["dark", "light", "contrast"];
    state.pulpitPrefs.theme = order[(order.indexOf(state.pulpitPrefs.theme) + 1) % order.length];
    saveState();
    render();
  }
  if (action === "pulpit-lineheight") {
    const order = ["compact", "comfortable", "spacious"];
    state.pulpitPrefs.lineHeight = order[(order.indexOf(state.pulpitPrefs.lineHeight) + 1) % order.length];
    saveState();
    render();
  }
  if (action === "pulpit-width") {
    state.pulpitPrefs.width = state.pulpitPrefs.width === "narrow" ? "wide" : "narrow";
    saveState();
    render();
  }
  if (action === "pulpit-focus") {
    state.pulpitPrefs.focusMode = !state.pulpitPrefs.focusMode;
    saveState();
    render();
  }
  if (action === "pulpit-read-mode") {
    const wantSections = target.dataset.mode === "sections";
    if (state.pulpitPrefs.focusMode !== wantSections) {
      state.pulpitPrefs.focusMode = wantSections;
      saveState();
      render();
    }
  }
  if (action === "pulpit-fullscreen") {
    pulpitFullscreen();
  }
  if (action === "pulpit-settings") {
    ui.pulpit.showSettings = !ui.pulpit.showSettings;
    render();
  }
  if (action === "pulpit-unlock-edit") {
    ui.pulpit.showSettings = false;
    state.view = "editor";
    saveState();
    render();
  }
  if (action === "open-scripture") {
    saveEditorRange();
    ui.scripture = { ...ui.scripture, show: true, error: "", loading: false };
    render();
  }
  if (action === "scripture-close") {
    ui.scripture.show = false;
    render();
  }
  if (action === "scripture-fetch") {
    fetchScriptureIntoModal();
  }
  if (action === "scripture-insert") {
    const modal = ui.scripture;
    if (!modal.text.trim()) return;
    const translation = state.bibleProvider.provider === "manual" ? (state.preachingProfile.translation || "-") : state.bibleProvider.translation;
    ui.scripture.show = false;
    insertIntoEditor(
      scriptureBlockHtml({
        reference: modal.ref.trim() || "Passage",
        translation,
        text: modal.text.trim(),
        attribution: modal.attribution || (state.bibleProvider.provider === "manual" ? `${translation} - used with permission` : ""),
        slide: modal.slide,
        pulpit: modal.pulpit,
        production: modal.production,
      }),
    );
    ui.scripture.text = "";
    ui.scripture.attribution = "";
    render();
  }
  if (action === "refine-menu") {
    ui.refineMenu = !ui.refineMenu;
    render();
  }
  if (action === "refine") {
    ui.refineMenu = false;
    closeToolMenus();
    runRefine(target.dataset.kind);
  }
  if (action === "refine-dismiss") {
    ui.refine = null;
    render();
  }
  if (action === "refine-copy") {
    if (ui.refine?.text) copyText(ui.refine.text);
  }
  if (action === "refine-insert-note") {
    if (!ui.refine?.text) return;
    insertIntoEditor(`<div class="pf-b pf-b-note"><p>${escapeHtml(ui.refine.text)}</p></div><p><br></p>`);
    ui.refine = null;
    render();
  }
  if (action === "practice-reset") {
    if (ui.practice.running) recordPracticeRun();
    ui.practice = { running: false, seconds: 0 };
    releasePracticeWakeLock();
    render();
  }
  if (action === "practice-font") {
    state.practiceFont = normalizeFontStep(state.practiceFont + Number(target.dataset.delta));
    saveState();
    render();
  }
  if (action === "lib-open") {
    state.activeId = target.dataset.sermon;
    const opened = state.sermons.find((sermon) => sermon.id === target.dataset.sermon);
    state.view = target.dataset.mode === "editor" ? "editor" : target.dataset.mode === "pulpit" ? "pulpit" : opened?.imported ? "editor" : "workspace";
    if (state.view === "pulpit") {
      ui.pulpit.section = 0;
      requestPracticeWakeLock();
    }
    saveState();
    render();
  }
  if (action === "library-clear") {
    ui.libraryQuery = "";
    ui.libraryFilter = { book: "", series: "", topic: "" };
    render();
  }
  if (action === "library-browse-clear") {
    ui.libraryFilter = { book: "", series: "", topic: "" };
    render();
  }
  if (action === "resource-add") {
    const wrap = target.parentElement;
    const label = wrap?.querySelector("[data-resource-label]")?.value.trim() || "";
    let url = wrap?.querySelector("[data-resource-url]")?.value.trim() || "";
    if (!url) {
      showBanner("Add the link's web address first.");
      return;
    }
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    const phaseId = target.dataset.phase;
    const list = state.resources[phaseId] || (state.resources[phaseId] = []);
    list.push({ id: genId(), label: label || url.replace(/^https?:\/\//i, ""), url });
    saveState();
    render();
  }
  if (action === "resource-remove") {
    const phaseId = target.dataset.phase;
    state.resources[phaseId] = (state.resources[phaseId] || []).filter((item) => item.id !== target.dataset.id);
    if (!state.resources[phaseId].length) delete state.resources[phaseId];
    saveState();
    render();
  }
  if (action === "export-active") {
    const active = getActive();
    if (active) exportPdf(active.passage || "Sermon", sermonDocHtml(active));
  }
  if (action === "export-active-md") {
    const active = getActive();
    if (active) downloadText(`${slug(active.passage)}.md`, exportMarkdown(active));
  }
  if (action === "export-active-doc") {
    const active = getActive();
    if (active) exportDoc(active.passage || "Sermon", sermonDocHtml(active));
  }
  if (action === "copy-active") {
    const active = getActive();
    if (active) copyText(exportMarkdown(active));
  }
  if (action === "openai-key") {
    ui.showOpenAIKey = true;
    render();
  }
  if (action === "save-openai-key") {
    saveOpenAIKey();
  }
  if (action === "clear-openai-key") {
    clearOpenAIKey();
  }
  if (action === "close-openai-key") {
    ui.openAIKeyInput = "";
    ui.showOpenAIKey = false;
    render();
  }
  if (action === "auth-panel") {
    ui.showAuth = true;
    render();
  }
  if (action === "close-auth-panel") {
    ui.showAuth = false;
    render();
  }
  if (action === "google-signin") {
    signInWithGoogle();
  }
  if (action === "password-signin") {
    signInWithPassword();
  }
  if (action === "password-signup") {
    signUpWithPassword();
  }
  if (action === "signin-mode-signup") {
    ui.signinMode = "signup";
    render();
  }
  if (action === "signin-mode-signin") {
    ui.signinMode = "signin";
    render();
  }
  if (action === "forgot-password") {
    sendPasswordReset();
  }
  if (action === "password-reset-save") {
    savePasswordReset();
  }
  if (action === "send-magic-link") {
    sendMagicLink();
  }
  if (action === "sign-out") {
    signOut();
  }
  if (action === "cloud-sync-now") {
    saveCloudState({ announce: true });
  }
  if (action === "editor-gdoc-export") {
    exportManuscriptToGoogleDocs();
  }
  if (action === "pipeline-filter") {
    state.filter = target.dataset.filter;
    saveState();
    render();
  }
  if (action === "impact-tab") {
    ui.impactTab = target.dataset.tab;
    render();
  }
  if (action === "impact-home") {
    ui.impactTab = "home";
    render();
  }
  if (action === "profile-tab") {
    ui.profileTab = target.dataset.tab;
    render();
  }
  if (action === "rubric-add") {
    const input = target.parentElement?.querySelector("[data-rubric-input]");
    const value = (input?.value || "").trim();
    if (!value) return;
    if (!state.preachingProfile.rubricCustom.includes(value)) state.preachingProfile.rubricCustom.push(value);
    saveState();
    render();
  }
  if (action === "rubric-remove") {
    state.preachingProfile.rubricCustom.splice(Number(target.dataset.index), 1);
    saveState();
    render();
  }
  if (action === "onboard-start") {
    state.preachingProfile.onboarded = true;
    ui.profileTab = target.dataset.tab || "profile";
    state.view = "signin";
    saveState();
    render();
  }
  if (action === "onboard-lens") {
    state.preachingProfile.onboarded = true;
    state.view = "lens";
    saveState();
    render();
  }
  if (action === "onboard-skip") {
    state.preachingProfile.onboarded = true;
    saveState();
    showBanner("You can shape your Preaching Profile anytime from your avatar.");
    render();
  }
  if (action === "impact-tab-locked") {
    showBanner("The debrief opens once the sermon is preached (or its date passes).");
  }
  if (action === "debrief-pick-btn") {
    ui.debriefSermonId = target.dataset.sermon;
    ui.debriefQuery = "";
    render();
  }
  if (action === "debrief-clear") {
    ui.debriefQuery = "";
    render();
  }
  if (action === "open-impact") {
    state.view = "impact";
    ui.impactTab = "home";
    saveState();
    render();
  }
  if (action === "open-debrief") {
    if (target.dataset.sermon) ui.debriefSermonId = target.dataset.sermon;
    state.view = "debrief";
    saveState();
    render();
  }
  if (action === "open-lens") {
    state.view = "lens";
    render();
  }
  if (action === "cf-new-sermon") {
    ui.showNew = true;
    state.view = "workspace";
    render();
  }
  if (action === "cf-series") {
    state.view = "series";
    saveState();
    render();
  }
  if (action === "cf-lens") {
    state.view = "lens";
    render();
  }
  if (action === "cf-diet") {
    state.view = "diet";
    saveState();
    render();
  }
  if (action === "min-chip") {
    const store = ministryStore(target.dataset.store, target.dataset.sermon);
    if (!store) return;
    const field = target.dataset.field;
    const value = target.dataset.value;
    const arr = Array.isArray(store[field]) ? store[field] : (store[field] = []);
    const idx = arr.indexOf(value);
    if (idx === -1) arr.push(value);
    else arr.splice(idx, 1);
    touchMinistryStore(target.dataset.store, target.dataset.sermon);
    render();
  }
  if (action === "min-chip-add") {
    const input = target.parentElement?.querySelector('[data-action="min-chip-input"]');
    const value = (input?.value || "").trim();
    if (!value) return;
    const store = ministryStore(target.dataset.store, target.dataset.sermon);
    if (!store) return;
    const field = target.dataset.field;
    const arr = Array.isArray(store[field]) ? store[field] : (store[field] = []);
    if (!arr.includes(value)) arr.push(value);
    touchMinistryStore(target.dataset.store, target.dataset.sermon);
    render();
  }
  if (action === "guide-draft") {
    draftWithGuide(target.dataset.spec);
  }
  if (action === "delivery-edit") {
    const store = target.dataset.store;
    state.view = "impact";
    ui.impactTab = store === "impact" ? "plan" : store === "shepherd" ? "shepherd" : "pack";
    saveState();
    render();
  }
  if (action === "delivery-copy" || action === "delivery-export") {
    const active = getActive();
    const resource = DELIVERY_RESOURCES.find((item) => item.key === target.dataset.key);
    if (!active || !resource) return;
    const text = deliveryText(active, resource);
    if (!text.trim()) {
      showBanner("Nothing to export yet.");
      return;
    }
    const cards = { impact: IMPACT_CARDS, shepherd: SHEPHERD_CARDS, pack: PACK_CARDS }[resource.store] || [];
    const card = cards.find((entry) => entry.key === resource.field);
    const heading = `${resource.label} - ${active.passage || "Sermon"}`;
    const docHtml = card
      ? ministryDocHtml(active, resource.store, card)
      : `<h1>${escapeHtml(heading)}</h1><p>${escapeHtml(text).replaceAll("\n", "<br>")}</p>`;
    if (action === "delivery-copy") {
      if (card) copyRichText(docHtml, ministryDocPlainText(active, resource.store, card));
      else copyText(text);
    } else if (target.dataset.format === "pdf") {
      exportPdf(heading, `<section class="sermon">${docHtml}</section>`);
    } else if (target.dataset.format === "doc") {
      exportDoc(heading, docHtml);
    } else {
      downloadText(`${slug(active.passage)}-${resource.key}.md`, `# ${heading}\n\n${text}\n`);
    }
  }
  if (action === "share-create" || action === "share-update" || action === "share-regenerate") {
    const active = getActive();
    if (!active) return;
    if (!shareReady()) {
      showBanner("Sign in and sync this sermon to create live share links.");
      return;
    }
    const link = shareLink(active, target.dataset.kind);
    if (action === "share-regenerate" && link.token) {
      revokeSharedView(active, target.dataset.kind);
      link.token = "";
    }
    if (!link.token) {
      link.token = shareToken();
      link.createdAt = new Date().toISOString();
      link.revoked = false;
    }
    pushSharedView(active, target.dataset.kind).then((ok) => {
      if (ok) {
        copyText(shareUrl(link));
        showBanner("Link is live and copied to your clipboard.");
      }
      render();
    });
  }
  if (action === "share-copy") {
    const active = getActive();
    if (!active) return;
    const link = shareLink(active, target.dataset.kind);
    if (link.token) copyText(shareUrl(link));
  }
  if (action === "share-revoke") {
    const active = getActive();
    if (!active) return;
    revokeSharedView(active, target.dataset.kind).then(() => {
      showBanner("Link revoked - it no longer resolves.");
      render();
    });
  }
  if (action === "share-preview") {
    const active = getActive();
    if (active) openSharePreview(active, target.dataset.kind);
  }
  if (action === "ministry-copy") {
    const store = ministryStore(target.dataset.store, target.dataset.sermon);
    const value = store?.[target.dataset.key];
    if (typeof value === "string" && value.trim()) copyText(value);
    else showBanner("Nothing to copy yet.");
  }
  if (action === "series-new") {
    const series = normalizeSeries({ id: genId() });
    state.series.push(series);
    ui.activeSeriesId = series.id;
    saveState();
    render();
  }
  if (action === "series-open") {
    ui.activeSeriesId = target.dataset.series;
    render();
  }
  if (action === "series-back") {
    ui.activeSeriesId = "";
    render();
  }
  if (action === "series-delete") {
    const series = getSeries();
    if (!series) return;
    const ok = confirm(`Delete the series "${series.title || "Untitled series"}"? Sermons themselves are not deleted.`);
    if (!ok) return;
    state.series = state.series.filter((item) => item.id !== series.id);
    ui.activeSeriesId = "";
    saveState();
    render();
  }
  if (action === "series-map-add") {
    const series = getSeries();
    if (!series) return;
    series.map.push({ when: "", passage: "", title: "", idea: "", emphasis: "" });
    touchMinistryStore("series");
    render();
  }
  if (action === "series-map-remove") {
    const series = getSeries();
    if (!series) return;
    series.map.splice(Number(target.dataset.index), 1);
    touchMinistryStore("series");
    render();
  }
  if (action === "series-map-up" || action === "series-map-down") {
    const series = getSeries();
    if (!series) return;
    const index = Number(target.dataset.index);
    const swap = action === "series-map-up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= series.map.length) return;
    const tmp = series.map[index];
    series.map[index] = series.map[swap];
    series.map[swap] = tmp;
    touchMinistryStore("series");
    render();
  }
  if (action === "series-arc-review") {
    reviewSeriesArc(ui.activeSeriesId);
  }
  if (action === "series-export-pdf" || action === "series-export-doc") {
    const series = getSeries();
    if (!series) return;
    const name = `${series.title || "Series"} plan`;
    if (action === "series-export-pdf") exportPdf(name, seriesDocHtml(series));
    else exportDoc(name, seriesDocHtml(series));
  }
  if (action === "diet-range") {
    ui.dietRange = target.dataset.range;
    render();
  }
  if (action === "diet-review") {
    reviewPreachingDiet();
  }
  if (action === "notes-tag") {
    ui.notesQuery = ui.notesQuery === target.dataset.tag ? "" : target.dataset.tag;
    render();
  }
  if (action === "notes-clear-query") {
    ui.notesQuery = "";
    render();
  }
  if (action === "open-note-focus") {
    const sermonId = target.dataset.sermon;
    const phaseId = target.dataset.phase;
    state.sermons = state.sermons.map((sermon) =>
      sermon.id === sermonId ? { ...sermon, activePhase: phaseId, updatedAt: new Date().toISOString() } : sermon,
    );
    state.activeId = sermonId;
    if (target.dataset.ministry === "debrief") {
      ui.debriefSermonId = target.dataset.sermon || state.activeId || "";
      state.view = "debrief";
    } else if (target.dataset.ministry) {
      state.view = "impact";
      ui.impactTab = { impact: "plan", shepherd: "shepherd", pack: "pack" }[target.dataset.ministry] || "home";
    } else {
      state.view = "workspace";
    }
    saveState();
    render();
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("form[data-form]");
  if (!form) return;
  event.preventDefault();
  if (form.dataset.form === "new-sermon") addSermon(form);
  if (form.dataset.form === "sermon-details") saveDetails(form);
  if (form.dataset.form === "import-sermon") importSermon(form);
  if (form.dataset.form === "journal-entry") saveJournalEntry();
});

document.addEventListener("input", (event) => {
  const target = event.target;
  const action = target.dataset.action;
  if (action === "coach-input") {
    ui.composer = target.value;
    const sendButton = document.querySelector("[data-action='send']");
    if (sendButton) sendButton.disabled = ui.loading || !ui.composer.trim();
  }
  if (action === "openai-key-input") {
    ui.openAIKeyInput = target.value;
  }
  if (action === "auth-email-input") {
    ui.auth.emailInput = target.value;
  }
  if (action === "auth-password-input") {
    ui.auth.passwordInput = target.value;
  }
  if (action === "auth-confirm-input") {
    ui.auth.confirmInput = target.value;
  }
  if (action === "switcher-query") {
    ui.switcherQuery = target.value;
    render();
  }
  if (action === "notes-query") {
    ui.notesQuery = target.value;
    render();
  }
  if (action === "debrief-query") {
    ui.debriefQuery = target.value;
    render();
  }
  if (action === "library-query") {
    ui.libraryQuery = target.value;
    render();
  }
  if (action === "phase-editor" || action === "notes-editor") {
    persistPhaseEditor(target);
    updateEditorStats();
    if (target.dataset.phase === "manuscript") {
      const active = getActive();
      if (active) maybeAutoCompletePhase(active, "manuscript");
    }
  }
  if (action === "ministry-wizard-answer") {
    const wizard = ui.ministryWizard;
    if (wizard) wizard.answers[wizard.fields[wizard.step]] = target.value;
  }
  if (action === "ministry-field") {
    const store = ministryStore(target.dataset.store, target.dataset.sermon);
    if (!store) return;
    store[target.dataset.key] = target.value;
    touchMinistryStore(target.dataset.store, target.dataset.sermon);
  }
  if (action === "profile-field") {
    state.preachingProfile[target.dataset.key] = target.value;
    saveState();
  }
  if (action === "scripture-ref") {
    ui.scripture.ref = target.value;
  }
  if (action === "scripture-text") {
    ui.scripture.text = target.value;
    const insertBtn = document.querySelector('[data-action="scripture-insert"]');
    if (insertBtn) insertBtn.disabled = !target.value.trim();
  }
  if (action === "pulpit-notes") {
    const active = getActive();
    if (!active) return;
    active.practice.notes = target.value;
    active.updatedAt = new Date().toISOString();
    saveState();
  }
  if (action === "series-map-field") {
    const series = getSeries();
    const row = series?.map[Number(target.dataset.index)];
    if (!row) return;
    row[target.dataset.field] = target.value;
    touchMinistryStore("series");
  }
  if (action === "sermon-title-inline") {
    const active = getActive();
    if (!active) return;
    active.title = target.value;
    active.updatedAt = new Date().toISOString();
    saveState();
    maybeAutoCompletePhase(active, "introtitle");
  }
  if (action === "worksheet-field") {
    const active = getActive();
    if (!active) return;
    active.worksheet[`${target.dataset.phase}.${target.dataset.key}`] = target.value;
    active.updatedAt = new Date().toISOString();
    saveState();
    maybeAutoCompletePhase(active, target.dataset.phase);
  }
  if (action === "outline-part-text") {
    const active = getActive();
    const movement = active?.outline[Number(target.dataset.index)];
    const part = movement?.parts?.find((entry) => entry.id === target.dataset.part);
    if (!part) return;
    part.text = target.value;
    active.updatedAt = new Date().toISOString();
    saveState();
  }
  if (action === "outline-title" || action === "outline-sub") {
    const active = getActive();
    if (!active) return;
    const movement = active.outline[Number(target.dataset.index)];
    if (!movement) return;
    movement[action === "outline-title" ? "title" : "sub"] = target.value;
    active.updatedAt = new Date().toISOString();
    saveState();
  }
  if (action === "slides-editor") {
    const active = getActive();
    if (!active) return;
    active.slidesDoc = sanitizeRichHtml(target.innerHTML);
    active.updatedAt = new Date().toISOString();
    saveState();
  }
  if (action === "pipeline-query") {
    state.query = target.value;
    saveState();
    render();
  }
  if (action === "reader-ref") {
    ui.reader.reference = target.value;
  }
  if (action === "new-passage") {
    ui.newPassage = target.value;
  }
  if (action === "cal-paste-text") {
    ui.calImport.text = target.value;
    const parse = document.querySelector('[data-action="cal-parse"]');
    if (parse) parse.disabled = !target.value.trim();
  }
  if (action === "cal-gdocs-query") {
    ui.calImport.gdocs.query = target.value;
  }
  if (action === "cal-row-field") {
    const row = ui.calImport.rows.find((entry) => entry.id === target.dataset.id);
    if (row) {
      row[target.dataset.field] = target.dataset.field === "passage" && parseBibleRef(target.value) ? target.value : target.value;
      row.note = "";
    }
  }
  if (action === "lib-gdocs-query") {
    ui.libImport.gdocs.query = target.value;
  }
  if (action === "lib-import-field") {
    const item = ui.libImport.queue.find((entry) => entry.id === target.dataset.id);
    if (item) item[target.dataset.field] = target.value;
  }
  if (action === "pm-paste-text") {
    ui.pm.pasteText = target.value;
  }
  if (action === "pm-paste-translation") {
    ui.pm.pasteTranslation = target.value;
  }
  if (action === "pm-mark-note") {
    const highlight = pmActiveMap()?.highlights.find((item) => item.id === target.dataset.id);
    if (!highlight) return;
    highlight.note = target.value;
    pmSave();
  }
  if (action === "pm-section-field") {
    const section = pmActiveMap()?.sections.find((item) => item.id === target.dataset.id);
    if (!section) return;
    section[target.dataset.field] = target.value;
    pmSave();
  }
  if (action === "pm-summary-field") {
    const map = pmActiveMap();
    if (!map) return;
    map.summary[target.dataset.key] = target.value;
    pmSave();
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  const action = target.dataset.action;
  if (action === "import-file") {
    handleImportFile(target);
  }
  if (action === "reader-translation") {
    ui.reader.translation = target.value;
    localStorage.setItem(READER_STORE_KEY, target.value);
    loadReaderPassage();
  }
  // Leaving the reference field with something new in it reads it. No Read
  // button to hunt for.
  if (action === "reader-ref") {
    ui.reader.reference = target.value;
    if (target.value.trim()) loadReaderPassage();
  }
  if (action && action.startsWith("pick-")) {
    const container = target.closest(".pf-picker");
    const scope = container?.dataset.scope || "reader";
    // Choosing a book starts it at chapter 1; choosing a chapter drops any
    // verse range, since verse 9 of one chapter is not verse 9 of the next.
    let reference = "";
    if (action === "pick-book") reference = target.value ? `${target.value} 1` : "";
    else if (action === "pick-chapter") {
      const book = container?.querySelector('[data-action="pick-book"]')?.value || "";
      reference = book && target.value ? `${book} ${target.value}` : "";
    } else reference = pickerReference(container);
    applyPickedPassage(scope, reference);
  }
  if (action === "cal-import-files") {
    handleCalImportFiles(target);
  }
  if (action === "lib-import-files") {
    handleLibImportFiles(target);
  }
  if (action === "readiness-toggle") {
    const active = getActive();
    if (!active) return;
    active.worksheet[`readiness.${target.dataset.key}`] = target.checked ? "ready" : "";
    active.updatedAt = new Date().toISOString();
    saveState();
    render();
  }
  if (action === "lens-toggle") {
    state.lens.enabled = target.checked;
    saveState();
    render();
  }
  if (action === "debrief-pick") {
    ui.debriefSermonId = target.value;
    render();
  }
  if (action === "notes-sermon") {
    ui.notesSermonId = target.value;
    render();
  }
  if (action === "library-browse") {
    ui.libraryFilter[target.dataset.kind] = target.value;
    render();
  }
  if (action === "profile-field") {
    state.preachingProfile[target.dataset.key] = target.value;
    saveState();
  }
  if (action === "profile-toggle") {
    state.preachingProfile[target.dataset.key] = target.checked;
    saveState();
    render();
  }
  if (action === "rubric-toggle") {
    state.preachingProfile.rubric = { ...state.preachingProfile.rubric, [target.dataset.key]: target.checked };
    saveState();
  }
  if (action === "share-section") {
    const active = getActive();
    if (!active) return;
    const link = shareLink(active, target.dataset.kind);
    link.sections[target.dataset.key] = target.checked;
    link.dirty = Boolean(link.token);
    saveState();
    render();
  }
  if (action === "share-expires") {
    const active = getActive();
    if (!active) return;
    const link = shareLink(active, target.dataset.kind);
    link.expiresAt = target.value ? `${target.value}T23:59:59Z` : "";
    link.dirty = Boolean(link.token);
    saveState();
  }
  if (action === "scripture-translation") {
    if (target.value === "manual") {
      state.bibleProvider.provider = "manual";
    } else {
      state.bibleProvider.provider = "public-domain";
      state.bibleProvider.translation = target.value;
    }
    saveState();
    render();
  }
  if (action === "scripture-flag") {
    ui.scripture[target.dataset.key] = target.checked;
  }
  if (action === "bible-attribution") {
    state.bibleProvider.attribution = target.checked;
    saveState();
  }
  if (action === "pm-relation") {
    const highlight = pmActiveMap()?.highlights.find((item) => item.id === target.dataset.id);
    if (!highlight) return;
    highlight.relation = target.value;
    document.querySelectorAll(`.pm-m[data-id="${CSS.escape(highlight.id)}"]`).forEach((el) => {
      if (target.value) el.setAttribute("data-rel", target.value);
      else el.removeAttribute("data-rel");
    });
    pmSerializeVerses();
    render();
  }
  if (action === "pm-include-exports") {
    const map = pmActiveMap();
    if (!map) return;
    map.includeInExports = target.checked;
    pmSave();
    showBanner(target.checked ? "Your passage map will be included in exports." : "Your passage map stays out of exports.");
  }
  if (action === "pulpit-pref-toggle") {
    state.pulpitPrefs[target.dataset.key] = target.checked;
    saveState();
    render();
  }
  if (action === "practice-pace") {
    state.practiceWpm = normalizeWpm(target.value);
    saveState();
    render();
  }
  if (action === "library-sort") {
    ui.librarySort = target.value;
    render();
  }
});

// Keep the contenteditable's selection when a toolbar button is pressed.
document.addEventListener("mousedown", (event) => {
  if (event.target.closest('[data-action="format-doc"], [data-action="heading-menu"], [data-action="refine"], [data-action="open-scripture"]')) {
    event.preventDefault();
  }
});

// ---- "find this word everywhere" chip ----
// Select a word (or short phrase) inside any note in the Notes view and a
// small chip appears; clicking it searches the whole notes bank for it.
let findChip = null;

function hideFindChip() {
  if (findChip) findChip.style.display = "none";
}

function getFindChip() {
  if (findChip) return findChip;
  findChip = document.createElement("button");
  findChip.id = "pf-find-chip";
  findChip.type = "button";
  findChip.addEventListener("mousedown", (event) => event.preventDefault());
  findChip.addEventListener("click", () => {
    ui.notesQuery = findChip.dataset.term || "";
    hideFindChip();
    state.view = "journal";
    render();
  });
  document.body.appendChild(findChip);
  return findChip;
}

document.addEventListener("mouseup", (event) => {
  if (event.target.closest("#pf-find-chip")) return;
  const inNotes = event.target.closest(".pf-note-body, .pf-editor, .pf-ws-input");
  let text = "";
  const field = event.target.closest("textarea, input");
  if (field && typeof field.selectionStart === "number") {
    text = field.value.substring(field.selectionStart, field.selectionEnd).trim();
  } else {
    const selection = window.getSelection();
    text = selection ? selection.toString().trim() : "";
  }
  const viable = inNotes && text && text.length >= 3 && text.length <= 40 && text.split(/\s+/).length <= 3;
  if (!viable) {
    hideFindChip();
    return;
  }
  const chip = getFindChip();
  chip.dataset.term = text;
  chip.textContent = `Find “${text}” everywhere`;
  chip.style.display = "block";
  chip.style.left = `${Math.max(8, event.clientX - 60)}px`;
  chip.style.top = `${Math.max(8, event.clientY - 44)}px`;
});

// Passage Map: releasing a text selection over the passage applies the
// active pen. The pastor marks; nothing marks for them.
document.addEventListener("mouseup", (event) => {
  if (state.view !== "map" || !ui.pm.pen) return;
  if (!event.target.closest("[data-pm-passage]")) return;
  pmApplySelection();
});

document.addEventListener("scroll", hideFindChip, true);
document.addEventListener("scroll", () => { if (typeof pmHideRemoveChip === "function") pmHideRemoveChip(); }, true);

document.addEventListener("keydown", (event) => {
  if (
    (state.view === "pulpit" || state.view === "practice") &&
    !event.target.closest("input, textarea, select, [contenteditable=true]")
  ) {
    const key = event.key;
    if (key === "ArrowRight" || key === " ") {
      event.preventDefault();
      pulpitStep(1);
      return;
    }
    if (key === "ArrowLeft") {
      event.preventDefault();
      pulpitStep(-1);
      return;
    }
    if (key === "t" || key === "T") {
      togglePracticeTimer();
      return;
    }
    if (key === "f" || key === "F") {
      pulpitFullscreen();
      return;
    }
    if (key === "+" || key === "=") {
      state.pulpitPrefs.fontStep = normalizeFontStep(state.pulpitPrefs.fontStep + 1);
      saveState();
      render();
      return;
    }
    if (key === "-") {
      state.pulpitPrefs.fontStep = normalizeFontStep(state.pulpitPrefs.fontStep - 1);
      saveState();
      render();
      return;
    }
    if (key === "d" || key === "D") {
      state.pulpitPrefs.theme = state.pulpitPrefs.theme === "dark" ? "light" : "dark";
      saveState();
      render();
      return;
    }
  }
  if (event.target.dataset?.action === "coach-input" && event.key === "Enter") {
    event.preventDefault();
    send();
    return;
  }
  if (event.target.dataset?.action === "reader-ref" && event.key === "Enter") {
    event.preventDefault();
    ui.reader.reference = event.target.value;
    if (ui.reader.reference.trim()) loadReaderPassage();
    return;
  }
  const card = event.target.closest("[data-sermon-card]");
  if (card && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    state.activeId = card.dataset.sermonCard;
    state.view = "workspace";
    saveState();
    render();
  }
});

// Deep links from the marketing homepage: /app#signin opens sign-in,
// Test/debug handle: lets browser drives inspect and nudge app state.
window.__pf = { ui, state, render, build: PF_BUILD };

// /app#ahead opens the Stay Ahead page. Without a hash, never boot into a
// stale persisted sign-in view.
if (window.location.hash === "#signin" && !ui.auth.user) {
  ui.lastView = "home";
  state.view = "signin";
} else if (window.location.hash === "#ahead") {
  state.view = "ahead";
} else {
  // Every visit starts at Home - you choose where to go, the app doesn't
  // drop you into a workspace.
  state.view = "home";
}

// ---- sermon work timer ----
// Counts up while the workspace is open on an unpreached sermon. Pauses when
// the tab is hidden or after 5 idle minutes; freezes for good once every
// phase is complete. The display ticks via direct DOM updates (no re-render);
// accumulated seconds persist quietly each minute and on pause/close.
const WORK_IDLE_LIMIT = 5 * 60 * 1000;
let workTrackedId = null;
let workSeconds = 0;
let workLastActivity = Date.now();

function flushWorkSeconds() {
  if (workTrackedId && workSeconds > 0) {
    const sermon = state.sermons.find((item) => item.id === workTrackedId);
    if (sermon) {
      sermon.timeSpent = (sermon.timeSpent || 0) + workSeconds;
      saveStateQuiet();
    }
  }
  workSeconds = 0;
}

setInterval(() => {
  const active = getActive();
  const working =
    state.view === "workspace" &&
    !ui.showNew &&
    active &&
    !isPreachedSermon(active) &&
    document.visibilityState === "visible" &&
    Date.now() - workLastActivity < WORK_IDLE_LIMIT;

  if (!working) {
    flushWorkSeconds();
    workTrackedId = null;
    return;
  }
  if (workTrackedId !== active.id) {
    flushWorkSeconds();
    workTrackedId = active.id;
  }
  workSeconds += 1;
  if (workSeconds >= 60) flushWorkSeconds();
  const display = document.querySelector("[data-work-timer]");
  if (display) display.textContent = fmtDuration((active.timeSpent || 0) + workSeconds, true);
}, 1000);

// ---- practice run-through timer ----
// Ticks via direct DOM updates like the work timer. Runs of a minute or more
// are recorded on the sermon (feeds the Delivery Prep auto-check), and a
// screen wake lock keeps a phone/iPad awake mid-rehearsal where supported.
let practiceWakeLock = null;

function requestPracticeWakeLock() {
  try {
    navigator.wakeLock
      ?.request("screen")
      .then((lock) => {
        practiceWakeLock = lock;
      })
      .catch(() => {});
  } catch {
    practiceWakeLock = null;
  }
}

function releasePracticeWakeLock() {
  try {
    practiceWakeLock?.release();
  } catch {
    /* already released */
  }
  practiceWakeLock = null;
}

function togglePracticeTimer() {
  ui.practice.running = !ui.practice.running;
  if (ui.practice.running) {
    ui.pulpit.startedAt = new Date(Date.now() - ui.practice.seconds * 1000).toISOString();
    requestPracticeWakeLock();
  } else {
    releasePracticeWakeLock();
    recordPracticeRun();
  }
  render();
}

let followLiveTimer = null;

function pulpitStep(delta) {
  const active = getActive();
  if (!active) return;
  const sections = pulpitSections(active);
  const next = Math.min(sections.length - 1, Math.max(0, ui.pulpit.section + delta));
  if (next === ui.pulpit.section) return;
  ui.pulpit.section = next;
  // Follow-live: if the production link opted in, quietly push the section.
  const production = active.shareLinks?.production;
  if (ui.pulpit.mode === "live" && production?.token && !production.revoked && production.sections?.live && shareReady()) {
    clearTimeout(followLiveTimer);
    followLiveTimer = setTimeout(() => {
      pushSharedView(active, "production", { currentSection: sections[next]?.title || `Section ${next + 1}` });
    }, 1500);
  }
  render();
  requestAnimationFrame(() => {
    if (state.pulpitPrefs.focusMode) {
      document.querySelector("[data-pulpit-body]")?.scrollTo(0, 0);
    } else {
      document.getElementById(`pulpit-section-${next}`)?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  });
}

function pulpitFullscreen() {
  try {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  } catch {
    /* fullscreen unavailable */
  }
}

function recordPracticeRun() {
  const active = getActive();
  if (!active || ui.practice.seconds < 60) return;
  const practice = active.practice || {};
  active.practice = {
    ...practice,
    runs: (practice.runs || 0) + 1,
    lastSeconds: ui.practice.seconds,
    lastAt: new Date().toISOString(),
    history: [...(practice.history || []), { seconds: ui.practice.seconds, at: new Date().toISOString() }].slice(-10),
  };
  active.updatedAt = new Date().toISOString();
  saveState();
}

setInterval(() => {
  const clock = document.querySelector("[data-pulpit-clock]");
  if (clock) clock.textContent = fmtWallClock(new Date());
  if (!ui.practice.running) return;
  ui.practice.seconds += 1;
  const display = document.querySelector("[data-practice-timer]");
  if (!display) return;
  display.textContent = fmtClock(ui.practice.seconds);
  const target = Number(getActive()?.length) || 0;
  display.classList.toggle("over", Boolean(target && ui.practice.seconds > target * 60));
  // Practice pace coach: compare elapsed time with where the target pace
  // says you should be, given how far into the manuscript you are.
  const pace = document.querySelector("[data-practice-pace]");
  if (pace) {
    const paceTarget = Number(pace.dataset.target) || 0;
    const fraction = Number(pace.dataset.fraction) || 0;
    if (paceTarget && fraction) {
      const delta = ui.practice.seconds - paceTarget * fraction;
      pace.textContent =
        Math.abs(delta) < 25
          ? "On pace for your target."
          : delta > 0
            ? `Running long: about ${fmtClock(Math.round(Math.abs(delta)))} behind target pace here.`
            : `Moving quick: about ${fmtClock(Math.round(Math.abs(delta)))} ahead of target pace here.`;
      pace.classList.toggle("over", delta >= 25);
    }
  }
}, 1000);

// Continuous-scroll mode: as the preacher scrolls, track which section is
// on screen and keep the counter, progress bar, and pace fraction current
// with direct DOM updates (no re-render, so scrolling stays smooth).
document.addEventListener(
  "scroll",
  (event) => {
    if (state.view !== "pulpit" || state.pulpitPrefs.focusMode) return;
    const body = event.target instanceof Element && event.target.hasAttribute("data-pulpit-body") ? event.target : null;
    if (!body) return;
    const sections = [...body.querySelectorAll(".pf-pulpit-section")];
    if (!sections.length) return;
    const probe = body.getBoundingClientRect().top + 140;
    let current = 0;
    sections.forEach((el, index) => {
      if (el.getBoundingClientRect().top <= probe) current = index;
    });
    if (current === ui.pulpit.section) return;
    ui.pulpit.section = current;
    sections.forEach((el, index) => el.classList.toggle("current", index === current));
    const count = document.querySelector(".pf-pulpit-count");
    if (count) count.textContent = `${current + 1} / ${sections.length}`;
    const bar = document.querySelector(".pf-pulpit-progress i");
    if (bar) bar.style.width = `${Math.round(((current + 1) / sections.length) * 100)}%`;
    const prevBtn = document.querySelector('.pf-pulpit-nav [data-action="pulpit-prev"]');
    if (prevBtn) prevBtn.disabled = current === 0;
    const nextBtn = document.querySelector('.pf-pulpit-nav [data-action="pulpit-next"]');
    if (nextBtn) nextBtn.disabled = current >= sections.length - 1;
    const pace = document.querySelector("[data-practice-pace]");
    if (pace) pace.dataset.fraction = Math.min(1, (current + 0.5) / sections.length).toFixed(3);
  },
  true,
);

// Outline Lab: drag a part's handle onto another part in the same point
// to reorder without deleting and re-adding.
let outlinePartDrag = null;
document.addEventListener("dragstart", (event) => {
  const handle = event.target.closest?.("[data-drag-part]");
  if (!handle) return;
  outlinePartDrag = { index: Number(handle.dataset.index), part: handle.dataset.part };
  event.dataTransfer.effectAllowed = "move";
  handle.closest("[data-part-row]")?.classList.add("dragging");
});
document.addEventListener("dragover", (event) => {
  if (!outlinePartDrag) return;
  const over = event.target.closest?.("[data-part-row]");
  if (over && Number(over.dataset.index) === outlinePartDrag.index) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    over.classList.add("drop-target");
  }
});
document.addEventListener("dragleave", (event) => {
  event.target.closest?.("[data-part-row]")?.classList.remove("drop-target");
});
document.addEventListener("drop", (event) => {
  if (!outlinePartDrag) return;
  const over = event.target.closest?.("[data-part-row]");
  const drag = outlinePartDrag;
  outlinePartDrag = null;
  if (!over || Number(over.dataset.index) !== drag.index || over.dataset.part === drag.part) return;
  event.preventDefault();
  const active = getActive();
  const movement = active?.outline[drag.index];
  if (!movement) return;
  const parts = movement.parts || [];
  const from = parts.findIndex((part) => part.id === drag.part);
  let to = parts.findIndex((part) => part.id === over.dataset.part);
  if (from === -1 || to === -1) return;
  const rect = over.getBoundingClientRect();
  if (event.clientY > rect.top + rect.height / 2) to += 1;
  const [moved] = parts.splice(from, 1);
  parts.splice(from < to ? to - 1 : to, 0, moved);
  active.updatedAt = new Date().toISOString();
  saveState();
  render();
});
document.addEventListener("dragend", () => {
  outlinePartDrag = null;
  document.querySelectorAll(".dragging, .drop-target").forEach((el) => el.classList.remove("dragging", "drop-target"));
});

// Pulpit View quiet controls: chrome fades after a few idle seconds and
// returns on any pointer or key activity.
let pulpitIdleTimer = null;
["pointermove", "pointerdown", "touchstart", "keydown"].forEach((eventName) =>
  document.addEventListener(
    eventName,
    () => {
      if (state.view !== "pulpit" && state.view !== "practice") return;
      const root = document.querySelector("[data-pulpit]");
      if (!root) return;
      root.classList.add("controls-on");
      clearTimeout(pulpitIdleTimer);
      pulpitIdleTimer = setTimeout(() => root.classList.remove("controls-on"), 3500);
    },
    { passive: true },
  ),
);

["mousedown", "keydown", "mousemove", "wheel", "touchstart"].forEach((eventName) =>
  document.addEventListener(eventName, () => {
    workLastActivity = Date.now();
  }, { passive: true }),
);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible") flushWorkSeconds();
});
window.addEventListener("beforeunload", () => flushWorkSeconds());

render();
checkServerStatus();
loadGoogleConfig();
// The 66 books (with chapter counts) power every passage picker.
loadBibleBooks().then((books) => {
  if (books.length) render();
});
