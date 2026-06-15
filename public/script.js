/* ============ Settings model ============ */
/* The whole ruleset lives in one object so it can change at any time — even mid-game. */
const DEFAULT_LADDER = [
  { at: 0, name: "Strangers" },
  { at: 2, name: "Acquaintances" },
  { at: 4, name: "Friends" }, // unlocks a bonus card
  { at: 6, name: "Confidants" }, // unlocks a bonus card
  { at: 8, name: "Inner Circle" },
  { at: 11, name: "Unbreakable" }, // the win
];
const TIER_NAMES = ["Warm-up", "Deepening", "Closer still"];
const SEAMS = [
  null,
  {
    kicker: "Going deeper",
    title: "You've warmed up. Now it gets honest.",
    body: "These ask about what shaped you — memory, fear, the things you're proud of. Same circle, same order rule. Don't trade depth for speed; let each person finish.",
  },
  {
    kicker: "The last stretch",
    title: "This is where it counts.",
    body: "These are tender. Some are for the whole circle, some ask you to turn to one person. Slow all the way down. The listening matters as much as the answering.",
  },
];
// Bonus connection cards — only ever reached by collective courage.
const BONUS = [
  "Each person: tell the group one thing this circle gives you that you get nowhere else.",
  "Go around: say the name of someone here and finish — 'I'm closer to you than I let on because…'",
  "As a group, decide: who here is the bravest tonight, and tell them why.",
  "Each person: name one moment from tonight you'll still remember a year from now.",
  "Go around: tell the person across from you something you hope stays true about them.",
];
const DEFAULT_PEOPLE = [];

/* The "Classic" ruleset — every other mode is a partial override of this. */
const DEFAULT_SETTINGS = {
  mode: "classic",
  // Passing & penalties
  passMode: "shared-shrinking", // shared-shrinking | shared-fixed | free | none
  passBudgetSeq: [3, 2, 1, 0],
  passBudgetFixed: 3,
  daresEnabled: true,
  shaming: true,
  positiveAward: false,
  // Deck shape & length
  tiers: { warm: true, deep: true, deepest: true },
  draw: { warm: 5, deep: 4, deepest: 3 },
  bonusEnabled: true,
  // Win & meter
  meterEnabled: true,
  winAt: 11,
  unlockLevels: { 4: true, 6: true },
  meterResetOnBudgetOut: true,
  // Format & language
  format: "round-robin", // round-robin | pairs-deepest | pairs-all | single
  showZhByDefault: false,
  listenerBeat: false,
  gentlePrompts: false,
  dualQuestion: false,
};
const PRESETS = {
  classic: {},
  gentle: {
    passMode: "free",
    daresEnabled: false,
    shaming: false,
    positiveAward: true,
    listenerBeat: true,
    meterResetOnBudgetOut: false,
    gentlePrompts: true,
  },
  party: {
    draw: { warm: 7, deep: 3, deepest: 1 },
    winAt: 7,
    unlockLevels: { 3: true, 5: true },
  },
  deepdive: {
    draw: { warm: 1, deep: 4, deepest: 5 },
    format: "pairs-deepest",
    winAt: 8,
  },
  free: {
    meterEnabled: false,
    passMode: "free",
    daresEnabled: false,
    shaming: false,
    bonusEnabled: false,
    draw: { warm: 4, deep: 4, deepest: 4 },
  },
  heroes: {
    dualQuestion: true,
  },
};
const MODE_LIST = [
  { id: "classic", name: "Classic" },
  { id: "gentle", name: "Gentle" },
  { id: "party", name: "Party" },
  { id: "deepdive", name: "Deep Dive" },
  { id: "free", name: "Free Browse" },
  { id: "heroes", name: "Heroes & Chickens" },
];
const SETTINGS_SCHEMA = [
  {
    title: "Passing & penalties",
    rows: [
      {
        key: "passMode",
        label: "Passing",
        type: "seg",
        options: [
          ["shared-shrinking", "Shrinking"],
          ["shared-fixed", "Fixed"],
          ["free", "Free"],
          ["none", "Off"],
        ],
      },
      { key: "daresEnabled", label: "Dares on pass", type: "toggle" },
      { key: "shaming", label: "Strikes & chicken crown", type: "toggle" },
      { key: "positiveAward", label: "Positive award", type: "toggle" },
    ],
  },
  {
    title: "Deck shape & length",
    rows: [
      { key: "tiers.warm", label: "Warm-up tier", type: "toggle" },
      { key: "tiers.deep", label: "Deepening tier", type: "toggle" },
      { key: "tiers.deepest", label: "Deepest tier", type: "toggle" },
      { key: "draw.warm", label: "Warm-up cards", type: "stepper", min: 0, max: 15 },
      { key: "draw.deep", label: "Deepening cards", type: "stepper", min: 0, max: 15 },
      { key: "draw.deepest", label: "Deepest cards", type: "stepper", min: 0, max: 15 },
      { key: "bonusEnabled", label: "Bonus cards", type: "toggle" },
    ],
  },
  {
    title: "Win & meter",
    rows: [
      { key: "meterEnabled", label: "Closeness meter", type: "toggle" },
      { key: "winAt", label: "Win at (cards)", type: "stepper", min: 3, max: 30 },
      {
        key: "meterResetOnBudgetOut",
        label: "Meter wipes on budget-out",
        type: "toggle",
      },
    ],
  },
  {
    title: "Format & language",
    rows: [
      {
        key: "format",
        label: "Answer format",
        type: "seg",
        options: [
          ["round-robin", "Circle"],
          ["pairs-deepest", "Pairs (deep)"],
          ["pairs-all", "Pairs"],
          ["single", "Solo"],
        ],
      },
      { key: "listenerBeat", label: "Reflect-back step", type: "toggle" },
      { key: "gentlePrompts", label: "Gentler prompts", type: "toggle" },
      { key: "showZhByDefault", label: "Show 中文 by default", type: "toggle" },
    ],
  },
];

function deepClone(o) {
  return JSON.parse(JSON.stringify(o));
}
function mergeSettings(base, over) {
  const out = deepClone(base);
  if (!over) return out;
  for (const k in over) {
    if (k === "tiers" || k === "draw")
      out[k] = Object.assign({}, out[k], over[k]);
    else out[k] = over[k];
  }
  return out;
}
function settingsForMode(name) {
  return mergeSettings(
    DEFAULT_SETTINGS,
    Object.assign({}, PRESETS[name] || {}, { mode: name }),
  );
}
function getKey(o, k) {
  return k.includes(".") ? k.split(".").reduce((a, p) => a[p], o) : o[k];
}
function setKey(o, k, v) {
  if (k.includes(".")) {
    const ps = k.split(".");
    const last = ps.pop();
    ps.reduce((a, p) => a[p], o)[last] = v;
  } else o[k] = v;
}
// The ladder reshapes to the win target; the classic 11 keeps its hand-tuned rungs.
function buildLadder(winAt) {
  const names = [
    "Strangers",
    "Acquaintances",
    "Friends",
    "Confidants",
    "Inner Circle",
    "Unbreakable",
  ];
  const n = names.length;
  return names.map((name, i) => ({
    at: i === 0 ? 0 : i === n - 1 ? winAt : Math.round((winAt * i) / (n - 1)),
    name,
  }));
}
function getLadder() {
  return settings.winAt === 11 ? DEFAULT_LADDER : buildLadder(settings.winAt);
}
function topLevelName() {
  const l = getLadder();
  return l[l.length - 1].name;
}
let settings = settingsForMode("classic");

/* ============ Dares ============ */
let darePool = { warm: [], deep: [], deepest: [] };
function dareFor(tier) {
  if (!darePool[tier] || darePool[tier].length === 0)
    darePool[tier] = shuffle(DARES[tier]);
  return darePool[tier].pop();
}

/* ============ Bonus + level lookup ============ */
let bonusPool = [];
function bonusCard() {
  if (bonusPool.length === 0) bonusPool = shuffle(BONUS);
  return bonusPool.pop();
}
function levelFor(streak) {
  const ladder = getLadder();
  let lv = ladder[0];
  for (const l of ladder) {
    if (streak >= l.at) lv = l;
  }
  return lv;
}

/* ============ Persistence ============ */
const KEY = "closer-group-v2";
const OLD_KEY = "closer-group-v1";
const blank = {
  used: { warm: [], deep: [], deepest: [] },
  sessions: 0,
  people: DEFAULT_PEOPLE.slice(),
  settings: settingsForMode("classic"),
};
/* Storage shim: use the host-provided window.storage if present, else localStorage. */
if (!window.storage) {
  window.storage = {
    async get(k) {
      const v = localStorage.getItem(k);
      return v == null ? null : { value: v };
    },
    async set(k, v) {
      localStorage.setItem(k, v);
    },
  };
}
async function loadState() {
  try {
    const r = await window.storage.get(KEY);
    if (r && r.value) return JSON.parse(r.value);
  } catch (e) {}
  // migrate from v1 (no settings) → v2
  try {
    const r = await window.storage.get(OLD_KEY);
    if (r && r.value) {
      const old = JSON.parse(r.value);
      return {
        used: old.used || deepClone(blank.used),
        sessions: old.sessions || 0,
        people: old.people || DEFAULT_PEOPLE.slice(),
        settings: settingsForMode("classic"),
      };
    }
  } catch (e) {}
  return deepClone(blank);
}
async function saveState() {
  try {
    await window.storage.set(KEY, JSON.stringify(state));
  } catch (e) {}
}
let state = deepClone(blank);

/* ============ Helpers ============ */
const $ = (id) => document.getElementById(id);
const shuffle = (a) => {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
function remaining(tier) {
  return BANK[tier].filter((q) => !state.used[tier].includes(q));
}
function drawTier(tier, n) {
  let pool = remaining(tier);
  if (tier === "deepest" && settings.gentlePrompts && typeof INTENSE_DEEPEST !== "undefined")
    pool = pool.filter((q) => !INTENSE_DEEPEST.includes(q));
  if (pool.length < n) {
    // exhausted: recycle this tier, keep drawing fresh from the reset pool
    state.used[tier] = [];
    pool = BANK[tier].slice();
    if (tier === "deepest" && settings.gentlePrompts && typeof INTENSE_DEEPEST !== "undefined")
      pool = pool.filter((q) => !INTENSE_DEEPEST.includes(q));
  }
  // Note: cards are NOT marked used here — only when actually shown (see renderCard).
  return shuffle(pool).slice(0, n);
}
function totalRemaining() {
  return (
    remaining("warm").length +
    remaining("deep").length +
    remaining("deepest").length
  );
}

/* ============ Session state ============ */
let cards = []; // [{q,tier,bonus?}]
let pos = 0;
let order = []; // names in answer order for current card
let score = {}; // per name: {strikes, dares, passes} for the current session
let activePasser = null;
let streak = 0; // cards climbed (continues through passes; only a budget-out resets it)
let bestStreak = 0; // high-water mark this session
let cardPassers = []; // names who passed on the CURRENT card (for accurate cancel)
let wonThisSession = false;
let budgetTier = 0; // index into passBudgetSeq
let passBudget = 3; // passes remaining before the meter resets (shared modes)
let resets = 0; // how many times the meter has been wiped this session
let lastPassUndoable = false; // whether the most recent pass can be cancelled
let reflectPending = false; // listener-beat: a reflect step is queued before advancing
function resetScore() {
  score = {};
  state.people.forEach((n) => (score[n] = { strikes: 0, dares: 0, passes: 0 }));
}
function initBudget() {
  budgetTier = 0;
  passBudget =
    settings.passMode === "shared-shrinking"
      ? settings.passBudgetSeq[0]
      : settings.passMode === "shared-fixed"
        ? settings.passBudgetFixed
        : 0;
}
function refillBudget() {
  if (settings.passMode === "shared-shrinking") {
    budgetTier = Math.min(budgetTier + 1, settings.passBudgetSeq.length - 1);
    passBudget = settings.passBudgetSeq[budgetTier];
  } else if (settings.passMode === "shared-fixed") {
    passBudget = settings.passBudgetFixed;
  }
}

function bankNoteText() {
  const per = Math.max(
    1,
    settings.draw.warm + settings.draw.deep + settings.draw.deepest,
  );
  const sessionsLeft = Math.floor(totalRemaining() / per);
  if (state.sessions === 0)
    return `${BANK.warm.length + BANK.deep.length + BANK.deepest.length} questions in the bank — enough for about ${Math.floor((BANK.warm.length + BANK.deep.length + BANK.deepest.length) / 12)} no-repeat sessions.`;
  return `${totalRemaining()} unseen questions left — about ${sessionsLeft} more no-repeat session${sessionsLeft === 1 ? "" : "s"} before any recycle.`;
}

/* ============ Setup view (people) ============ */
function renderNames() {
  const wrap = $("names");
  wrap.innerHTML = "";
  state.people.forEach((n, i) => {
    const c = document.createElement("span");
    c.className = "chip";
    c.innerHTML = `${n} <button title="remove">×</button>`;
    c.querySelector("button").onclick = () => {
      state.people.splice(i, 1);
      saveState();
      renderNames();
      validate();
    };
    wrap.appendChild(c);
  });
  validate();
}
function validate() {
  const ok = state.people.length >= 4 && state.people.length <= 10;
  $("startBtn").disabled = !ok;
  $("startNum").textContent = state.sessions > 0 ? state.sessions + 1 : 1;
  $("bankNote").textContent =
    state.people.length > 10
      ? "That's more than 10 — round-robin gets long. Trim the circle."
      : state.people.length < 4
        ? `Add ${4 - state.people.length} more to reach a circle of 4.`
        : bankNoteText();
}
function addName() {
  const v = $("nameInput").value.trim();
  if (!v) return;
  if (state.people.length >= 10) return;
  state.people.push(v);
  $("nameInput").value = "";
  saveState();
  renderNames();
}
$("addBtn").onclick = addName;
$("nameInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addName();
});

/* ============ Play ============ */
function show(v) {
  ["setup", "play", "seam", "end"].forEach((x) =>
    $(x).classList.toggle("hidden", x !== v),
  );
}
function inPlay() {
  return !$("play").classList.contains("hidden");
}
function setTierTheme(t) {
  document.body.dataset.tier = String(t + 1);
}
const tierIndex = (t) => (t === "warm" ? 0 : t === "deep" ? 1 : 2);

function newOrder() {
  order = shuffle(state.people);
  renderOrder();
}
function effFormat() {
  if (settings.format === "pairs-all") return "pairs";
  if (settings.format === "pairs-deepest")
    return cards[pos] && cards[pos].tier === "deepest"
      ? "pairs"
      : "round-robin";
  return settings.format; // round-robin | single
}
function makePairs(arr) {
  const a = arr.slice();
  const out = [];
  while (a.length) {
    if (a.length === 3) out.push(a.splice(0, 3));
    else if (a.length === 1) out[out.length - 1].push(a.shift());
    else out.push(a.splice(0, 2));
  }
  return out;
}
function whoEl(n, num) {
  const el = document.createElement("span");
  el.className = "who" + (cardPassers.includes(n) ? " passed" : "");
  const v = score[n] || { strikes: 0 };
  const strikes =
    settings.shaming && v.strikes
      ? ` <span class="strike">${"✗".repeat(v.strikes)}</span>`
      : "";
  const badge = num != null ? `<span class="i">${num}</span>` : "";
  el.innerHTML = `${badge}${n}${strikes}`;
  if (settings.passMode !== "none") {
    el.onclick = () => openDare(n);
    el.title = `${n}: tap to pass`;
  }
  return el;
}
function renderOrder() {
  const seq = $("seq");
  seq.innerHTML = "";
  const fmt = effFormat();
  if (fmt === "pairs") {
    $("orderCap").textContent = "Pair up — answer one-on-one, then share back";
    makePairs(order).forEach((p) => {
      const wrap = document.createElement("div");
      wrap.className = "pair";
      p.forEach((n) => wrap.appendChild(whoEl(n, null)));
      seq.appendChild(wrap);
    });
  } else if (fmt === "single") {
    $("orderCap").textContent = "This card's answerer";
    seq.appendChild(whoEl(order[0], null));
  } else {
    $("orderCap").textContent = "Answer in this order";
    order.forEach((n, i) => seq.appendChild(whoEl(n, i + 1)));
  }
  $("orderHint").textContent =
    settings.passMode === "none"
      ? "Everyone answers this round — no passing."
      : !settings.daresEnabled
        ? "Don't want to answer? Tap your name to pass — no penalty."
        : "Chickening out? Tap your name — you'll draw a dare instead.";
}
function fuseText() {
  if (settings.passMode === "free") return "🕊️ passing is free — no penalty";
  if (settings.passMode === "none") return "passing is off this round";
  if (settings.passMode === "shared-shrinking" || settings.passMode === "shared-fixed")
    return passBudget > 0
      ? `🔥 ${passBudget} shared pass${passBudget === 1 ? "" : "es"} left${settings.meterResetOnBudgetOut ? " before reset" : ""}`
      : `⚠️ no passes left${settings.meterResetOnBudgetOut ? " — the next pass wipes the meter" : ""}`;
  return "";
}
function renderMeter(broke) {
  if (!settings.meterEnabled) return;
  const ladder = getLadder();
  $("meterLevel").textContent = levelFor(streak).name;
  const climb =
    streak > 0
      ? `${streak} climbed · ${Math.max(0, settings.winAt - streak)} to ${topLevelName()} · `
      : "";
  $("meterStreak").textContent = climb + fuseText();
  const fillPct = Math.min(100, (streak / settings.winAt) * 100);
  $("meterFill").style.clipPath = `inset(0 ${100 - fillPct}% 0 0)`;
  const rungs = $("meterRungs");
  rungs.innerHTML = "";
  ladder.forEach((l) => {
    const s = document.createElement("span");
    s.textContent = l.name;
    if (streak >= l.at && l.at > 0) s.className = "hit";
    rungs.appendChild(s);
  });
  const m = $("meter");
  if (broke) {
    m.classList.remove("broke");
    void m.offsetWidth;
    m.classList.add("broke");
  }
}
let toastTimer = null;
function toast(big, sub, kind) {
  const t = $("toast");
  $("toastBig").textContent = big;
  $("toastSub").textContent = sub || "";
  t.className = "toast show" + (kind ? " " + kind : "");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(
    () => t.classList.remove("show"),
    kind === "win" ? 4200 : 2600,
  );
}
function renderScorebar() {
  const sb = $("scorebar");
  const entries = Object.entries(score);
  if (!settings.shaming) {
    const totalDares = entries.reduce((a, [, v]) => a + v.dares, 0);
    const totalPasses = entries.reduce((a, [, v]) => a + v.passes, 0);
    if (totalPasses === 0 && totalDares === 0) {
      sb.innerHTML = `<span class="pill">Everyone's in — no passes yet 🌱</span>`;
      return;
    }
    let html = "";
    if (totalPasses)
      html += `<span class="pill">🕊️ passes: <b>${totalPasses}</b></span>`;
    if (totalDares)
      html += `<span class="pill">🎲 dares: <b>${totalDares}</b></span>`;
    sb.innerHTML = html;
    return;
  }
  const totalStrikes = entries.reduce((a, [, v]) => a + v.strikes, 0);
  const totalDares = entries.reduce((a, [, v]) => a + v.dares, 0);
  if (totalStrikes === 0 && totalDares === 0) {
    sb.innerHTML = `<span class="pill">No passes yet — everyone's all in 🔥</span>`;
    return;
  }
  const max = Math.max(...entries.map(([, v]) => v.strikes));
  const leaders = entries
    .filter(([, v]) => v.strikes === max && max > 0)
    .map(([n]) => n);
  let html = `<span class="pill">😼 dares done: <b>${totalDares}</b></span>`;
  html += `<span class="pill">✗ strikes: <b>${totalStrikes}</b></span>`;
  if (leaders.length)
    html += `<span class="pill crown">👑 biggest chicken: <b>${leaders.join(" & ")}</b> (${max})</span>`;
  sb.innerHTML = html;
}
function syncUIVisibility() {
  $("meter").classList.toggle("hidden", !settings.meterEnabled);
  $("scorebar").classList.toggle("hidden", !settings.shaming);
}

/* ============ Dare / pass flow ============ */
function openDare(name) {
  if (settings.passMode === "none") return;
  activePasser = name;
  const v = score[name];
  if (v) v.passes++;
  if (!cardPassers.includes(name)) cardPassers.push(name);

  if (settings.passMode === "free") {
    lastPassUndoable = true; // nothing to refund, but cancel can still un-record
    renderMeter(false);
  } else if (passBudget > 0) {
    passBudget--;
    lastPassUndoable = true;
    if (passBudget === 0 && settings.meterResetOnBudgetOut)
      toast(`⚠️ Last shared pass spent`, `One more pass and the climb resets.`, "bad");
    renderMeter(false);
  } else if (settings.meterResetOnBudgetOut) {
    // budget empty → this pass wipes the meter and refills a smaller budget
    lastPassUndoable = false;
    const lost = levelFor(streak).name;
    resets++;
    streak = 0;
    refillBudget();
    renderMeter(true);
    const refillMsg =
      passBudget > 0
        ? `Budget refills to ${passBudget}.`
        : `No cushion left — every pass now resets instantly.`;
    toast(
      `💔 ${name} wiped the meter`,
      `The circle falls from ${lost} back to ${getLadder()[0].name}. ${refillMsg}`,
      "bad",
    );
  } else {
    // shared budget spent but resets are off — passing stays free
    lastPassUndoable = true;
    renderMeter(false);
  }

  if (settings.daresEnabled) {
    $("dareWho").textContent = cardPassers.join(" & ");
    $("dareChoice").classList.remove("hidden");
    $("dareDo").classList.add("hidden");
    $("dareFail").classList.toggle("hidden", !settings.shaming);
    $("dareText").textContent = "";
    $("darePanel").classList.remove("hidden");
    $("darePanel").scrollIntoView({ behavior: "smooth", block: "nearest" });
  } else {
    closeDare();
    toast(`🕊️ ${name} passed`, `No pressure — onto the next.`, null);
  }
  renderOrder();
  renderScorebar();
}
function showDarePhase(text) {
  $("dareText").textContent = text;
  $("dareChoice").classList.add("hidden");
  $("dareDo").classList.remove("hidden");
  $("dareFail").classList.toggle("hidden", !settings.shaming);
}
function chooseGroupDare() {
  const who = $("dareWho").textContent;
  showDarePhase(
    `Group: invent a dare for ${who} — make it fit the moment. When they've done it, mark it below.`,
  );
}
function chooseAppDare() {
  showDarePhase(dareFor(cards[pos].tier));
}
function closeDare() {
  $("darePanel").classList.add("hidden");
  activePasser = null;
}
function dareDid() {
  if (activePasser && score[activePasser]) score[activePasser].dares++;
  closeDare();
  renderScorebar();
  renderOrder();
}
function dareFail() {
  if (activePasser && score[activePasser]) score[activePasser].strikes++;
  closeDare();
  renderScorebar();
  renderOrder();
}

function renderChoicePanel() {
  const c = cards[pos];
  const ti = tierIndex(c.tier);
  setTierTheme(ti);
  $("tierName").textContent = TIER_NAMES[ti];
  document.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("on", i <= ti));
  $("counter").textContent = `${pos + 1} / ${cards.length}`;
  $("barFill").style.transform = `scaleX(${(pos + 1) / cards.length})`;

  const showZh = settings.showZhByDefault;
  const lb = $("choiceLangBtn");
  lb.classList.toggle("on", showZh);
  lb.textContent = showZh ? "隱藏中文" : "中文翻譯";
  lb.setAttribute("aria-expanded", showZh ? "true" : "false");

  const cardsEl = $("choiceCards");
  cardsEl.innerHTML = "";
  [c.q, c.altQ].forEach((q, idx) => {
    const div = document.createElement("div");
    div.className = "choice-card";
    div.innerHTML = `<div class="choice-q-text">${q}</div><div class="choice-q-zh${showZh ? " show" : ""}"><div class="choice-q-zh-inner">${ZH[q] || "（暫無翻譯）"}</div></div>`;
    div.onclick = () => {
      if (idx === 1) c.q = c.altQ;
      c._picked = true;
      $("choicePanel").classList.add("hidden");
      $("playMain").classList.remove("hidden");
      renderCard();
    };
    cardsEl.appendChild(div);
    if (idx === 0) {
      const sep = document.createElement("div");
      sep.className = "choice-or";
      sep.textContent = "or";
      cardsEl.appendChild(sep);
    }
  });

  $("choicePanel").classList.remove("hidden");
  $("playMain").classList.add("hidden");
  show("play");
}

function renderCard() {
  const c = cards[pos];
  if (settings.dualQuestion && c.altQ && !c._picked) {
    renderChoicePanel();
    return;
  }
  $("choicePanel").classList.add("hidden");
  $("playMain").classList.remove("hidden");
  const ti = tierIndex(c.tier);
  if (!c.bonus && !state.used[c.tier].includes(c.q)) {
    state.used[c.tier].push(c.q);
    saveState();
  }
  setTierTheme(ti);
  $("tierName").textContent = c.bonus ? "Bonus · unlocked" : TIER_NAMES[ti];
  document
    .querySelectorAll(".dot")
    .forEach((d, i) => d.classList.toggle("on", i <= ti));
  $("counter").textContent = `${pos + 1} / ${cards.length}`;
  $("qnum").textContent = c.bonus
    ? "🎁 Bonus connection card"
    : `Card ${pos + 1} · ${state.people.length} answering`;
  const q = $("qtext");
  q.textContent = c.q;
  q.style.animation = "none";
  void q.offsetWidth;
  q.style.animation = "";
  // translation (English stays primary; optionally pre-opened)
  const zh = $("qzh"),
    lb = $("langBtn");
  $("qzhText").textContent = ZH[c.q] || "（暫無翻譯）";
  const showZh = settings.showZhByDefault;
  zh.classList.toggle("show", showZh);
  lb.classList.toggle("on", showZh);
  lb.textContent = showZh ? "隱藏中文" : "中文翻譯";
  lb.setAttribute("aria-expanded", showZh ? "true" : "false");
  cardPassers = [];
  lastPassUndoable = false;
  newOrder();
  renderScorebar();
  renderMeter(false);
  syncUIVisibility();
  reflectPending = settings.listenerBeat && !c.bonus;
  $("nextBtn").textContent = "Everyone's answered — next card";
  $("listenerNote").classList.add("hidden");
  $("darePanel").classList.add("hidden");
  activePasser = null;
  $("dareChoice").classList.remove("hidden");
  $("dareDo").classList.add("hidden");
  $("barFill").style.transform = `scaleX(${(pos + 1) / cards.length})`;
  show("play");
}

function showListenerBeat() {
  $("listenerNote").classList.remove("hidden");
  $("nextBtn").textContent = "Reflected — next card";
  toast(
    "🪞 Reflect back",
    "Each person: say one thing you heard from someone tonight.",
    null,
  );
}

function advance() {
  if (reflectPending) {
    reflectPending = false;
    showListenerBeat();
    return;
  }
  if (settings.meterEnabled) {
    const before = levelFor(streak);
    streak++;
    if (streak > bestStreak) bestStreak = streak;
    const after = levelFor(streak);
    if (settings.bonusEnabled && settings.unlockLevels[streak] && streak < settings.winAt) {
      const b = bonusCard();
      cards.splice(pos + 1, 0, {
        q: b,
        tier: cards[pos] ? cards[pos].tier : "deep",
        bonus: true,
      });
      toast(
        `🎁 Bonus unlocked`,
        `Reaching ${after.name} earns the circle a bonus connection card — up next.`,
        null,
      );
    } else if (after.name !== before.name && streak < settings.winAt) {
      toast(`✨ ${after.name}`, `The circle keeps climbing — ${streak} cards in.`, null);
    }
    if (streak === settings.winAt && !wonThisSession) {
      wonThisSession = true;
      toast(
        `👑 ${topLevelName().toUpperCase()}`,
        `You reached the top of the ladder together. The circle wins.`,
        "win",
      );
    }
  }
  const cur = cards[pos].tier;
  pos++;
  if (pos >= cards.length) {
    finishSession();
    return;
  }
  if (cards[pos].tier !== cur && !cards[pos].bonus && SEAMS[tierIndex(cards[pos].tier)]) {
    const ti = tierIndex(cards[pos].tier);
    const s = SEAMS[ti];
    setTierTheme(ti);
    $("seamKicker").textContent = s.kicker;
    $("seamTitle").textContent = s.title;
    $("seamBody").textContent = s.body;
    show("seam");
  } else renderCard();
}

function buildDeck() {
  const d = [];
  if (settings.tiers.warm && settings.draw.warm > 0)
    d.push(...drawTier("warm", settings.draw.warm).map((q) => ({ q, tier: "warm" })));
  if (settings.tiers.deep && settings.draw.deep > 0)
    d.push(...drawTier("deep", settings.draw.deep).map((q) => ({ q, tier: "deep" })));
  if (settings.tiers.deepest && settings.draw.deepest > 0)
    d.push(...drawTier("deepest", settings.draw.deepest).map((q) => ({ q, tier: "deepest" })));
  if (d.length === 0)
    d.push(...drawTier("warm", 3).map((q) => ({ q, tier: "warm" })));
  if (settings.dualQuestion) {
    d.forEach((card) => {
      let pool = BANK[card.tier].filter((q) => q !== card.q && !state.used[card.tier].includes(q));
      if (pool.length === 0) pool = BANK[card.tier].filter((q) => q !== card.q);
      card.altQ = pool.length > 0 ? shuffle(pool)[0] : null;
    });
  }
  return d;
}

function startSession() {
  cards = buildDeck();
  state.sessions++;
  saveState();
  pos = 0;
  resetScore();
  streak = 0;
  bestStreak = 0;
  wonThisSession = false;
  cardPassers = [];
  lastPassUndoable = false;
  initBudget();
  resets = 0;
  darePool = { warm: [], deep: [], deepest: [] };
  bonusPool = [];
  $("redrawBtn").classList.add("hidden");
  $("sesstag").textContent = `Session ${state.sessions}`;
  renderCard();
}

function renderBoard() {
  const board = $("board");
  const entries = Object.entries(score);
  const anyAction = entries.some(
    ([, v]) => v.strikes > 0 || v.dares > 0 || v.passes > 0,
  );
  if (!anyAction) {
    board.classList.add("hidden");
    board.innerHTML = "";
    return;
  }
  board.innerHTML = "";
  if (!settings.shaming) {
    // gentle board — celebrate engagement, no crown
    const ranked = entries
      .slice()
      .sort((a, b) => a[1].passes - b[1].passes || b[1].dares - a[1].dares);
    ranked.forEach(([n, v], i) => {
      const li = document.createElement("li");
      const clean = v.passes === 0;
      if (clean) li.className = "clean";
      li.style.animationDelay = i * 50 + "ms";
      const tag = clean ? "🛡️ " : "";
      const detail = clean
        ? "answered everything"
        : `${v.passes} pass${v.passes === 1 ? "" : "es"}${v.dares ? ` · ${v.dares} dare${v.dares === 1 ? "" : "s"}` : ""}`;
      li.innerHTML = `<span class="nm">${tag}${n}</span><span class="sc">${detail}</span>`;
      board.appendChild(li);
    });
    board.classList.remove("hidden");
    return;
  }
  // rank by strikes desc, then by fewest dares (more dares done = braver)
  const ranked = entries
    .slice()
    .sort((a, b) => b[1].strikes - a[1].strikes || a[1].dares - b[1].dares);
  const maxStrikes = Math.max(...entries.map(([, v]) => v.strikes));
  ranked.forEach(([n, v], i) => {
    const li = document.createElement("li");
    li.style.animationDelay = i * 50 + "ms";
    const clean = v.passes === 0;
    const king = v.strikes === maxStrikes && maxStrikes > 0;
    if (king) li.className = "king";
    else if (clean) li.className = "clean";
    const tag = king ? "👑 " : clean ? "🛡️ " : "";
    const detail = clean
      ? "never passed"
      : `${v.dares} dare${v.dares === 1 ? "" : "s"} · ${v.strikes} strike${v.strikes === 1 ? "" : "s"}`;
    li.innerHTML = `<span class="nm">${tag}${n}</span><span class="sc">${detail}</span>`;
    board.appendChild(li);
  });
  board.classList.remove("hidden");
}

function closenessLine() {
  if (!settings.meterEnabled)
    return "No meter tonight — just the conversation. Hope it landed somewhere good.";
  if (wonThisSession)
    return `🏆 You reached ${topLevelName().toUpperCase()} — the circle climbed all the way to the top together. That's the perfect run.`;
  const lv = levelFor(bestStreak).name;
  if (bestStreak === 0)
    return "The meter never got going this time. Something to chase next round.";
  const resetNote =
    resets > 0
      ? ` Meter wiped ${resets} time${resets === 1 ? "" : "s"}.`
      : settings.meterResetOnBudgetOut
        ? " And you never burned through the budget — clean climb."
        : "";
  return (
    `Your circle reached ${lv} (best climb: ${bestStreak} card${bestStreak === 1 ? "" : "s"}${bestStreak < settings.winAt ? `, ${settings.winAt - bestStreak} short of ${topLevelName()}` : ""}).` +
    resetNote
  );
}
function endTail() {
  if (settings.shaming) return chickenLine(biggestChicken());
  if (settings.positiveAward)
    return "As a group, name tonight's bravest share and best listener — say it out loud. 🌟";
  return "";
}

function finishSession() {
  setTierTheme(2);
  $("endKicker").textContent = `Session ${state.sessions} complete`;
  $("endTitle").textContent =
    settings.meterEnabled && wonThisSession ? "Unbreakable." : "That's the climb.";
  $("endBody").textContent = (closenessLine() + " " + endTail()).trim();
  $("endBank").textContent = bankNoteText();
  renderBoard();
  show("end");
}

function endEarly() {
  const seen = pos + 1;
  $("endKicker").textContent = `Session ${state.sessions} · ended early`;
  $("endTitle").textContent = "You stopped where you needed to.";
  $("endBody").textContent =
    `You went through ${seen} card${seen === 1 ? "" : "s"} before stopping; the rest stay unseen for next time. ` +
    (closenessLine() + " " + endTail()).trim();
  $("endBank").textContent = bankNoteText();
  renderBoard();
  show("end");
}

function biggestChicken() {
  const e = Object.entries(score).filter(([, v]) => v.strikes > 0);
  if (!e.length) return null;
  const max = Math.max(...e.map(([, v]) => v.strikes));
  return {
    names: e.filter(([, v]) => v.strikes === max).map(([n]) => n),
    count: max,
  };
}
function chickenLine(c) {
  if (!c) return "Nobody chickened out — a fearless circle tonight.";
  return `${c.names.join(" & ")} wore the crown with ${c.count} strike${c.count === 1 ? "" : "s"}. 🐔`;
}

/* ============ Settings drawer ============ */
function openSettings() {
  renderSettings();
  $("settingsBackdrop").classList.add("open");
  $("settingsDrawer").classList.add("open");
  $("settingsDrawer").setAttribute("aria-hidden", "false");
}
function closeSettings() {
  $("settingsBackdrop").classList.remove("open");
  $("settingsDrawer").classList.remove("open");
  $("settingsDrawer").setAttribute("aria-hidden", "true");
}
function buildControl(row) {
  const val = getKey(settings, row.key);
  if (row.type === "toggle") {
    const b = document.createElement("button");
    b.className = "toggle" + (val ? " on" : "");
    b.textContent = val ? "On" : "Off";
    b.onclick = () => onSettingChange(row.key, !getKey(settings, row.key));
    return b;
  }
  if (row.type === "seg") {
    const w = document.createElement("div");
    w.className = "seg";
    row.options.forEach(([v, lab]) => {
      const b = document.createElement("button");
      if (val === v) b.className = "on";
      b.textContent = lab;
      b.onclick = () => onSettingChange(row.key, v);
      w.appendChild(b);
    });
    return w;
  }
  // stepper
  const w = document.createElement("div");
  w.className = "stepper";
  const minus = document.createElement("button");
  minus.textContent = "−";
  minus.onclick = () =>
    onSettingChange(row.key, Math.max(row.min, getKey(settings, row.key) - 1));
  const cur = document.createElement("span");
  cur.className = "val";
  cur.textContent = val;
  const plus = document.createElement("button");
  plus.textContent = "+";
  plus.onclick = () =>
    onSettingChange(row.key, Math.min(row.max, getKey(settings, row.key) + 1));
  w.append(minus, cur, plus);
  return w;
}
function renderSettings() {
  const modes = $("settingsModes");
  modes.innerHTML = "";
  MODE_LIST.forEach((m) => {
    const b = document.createElement("button");
    b.className = "mode-btn" + (settings.mode === m.id ? " on" : "");
    b.textContent = m.name;
    b.onclick = () => applyMode(m.id);
    modes.appendChild(b);
  });
  if (settings.mode === "custom") {
    const b = document.createElement("button");
    b.className = "mode-btn on";
    b.textContent = "Custom";
    b.disabled = true;
    modes.appendChild(b);
  }
  const body = $("settingsBody");
  body.innerHTML = "";
  SETTINGS_SCHEMA.forEach((group) => {
    const g = document.createElement("div");
    g.className = "setting-group";
    const h = document.createElement("h4");
    h.textContent = group.title;
    g.appendChild(h);
    group.rows.forEach((row) => {
      const r = document.createElement("div");
      r.className = "setting-row";
      const lab = document.createElement("div");
      lab.className = "label";
      lab.textContent = row.label;
      r.appendChild(lab);
      r.appendChild(buildControl(row));
      g.appendChild(r);
    });
    body.appendChild(g);
  });
}
function applyMode(name) {
  settings = settingsForMode(name);
  state.settings = settings;
  if (inPlay()) $("redrawBtn").classList.remove("hidden");
  applySettings();
}
function onSettingChange(key, val) {
  setKey(settings, key, val);
  settings.mode = "custom";
  state.settings = settings;
  if (inPlay() && /^draw\.|^tiers\.|^gentlePrompts$/.test(key))
    $("redrawBtn").classList.remove("hidden");
  applySettings();
}
function applySettings() {
  saveState();
  syncUIVisibility();
  renderMeter(false);
  if (inPlay()) renderOrder();
  renderScorebar();
  validate();
  renderSettings();
}
function redrawRemaining() {
  const seen = cards.slice(0, pos + 1);
  cards = seen.concat(buildDeck());
  $("redrawBtn").classList.add("hidden");
  $("counter").textContent = `${pos + 1} / ${cards.length}`;
  $("barFill").style.transform = `scaleX(${(pos + 1) / cards.length})`;
  toast("🔄 Deck redrawn", "Upcoming cards now match your settings.", null);
}

/* ============ Buttons ============ */
$("startBtn").onclick = startSession;
$("dareGroup").onclick = chooseGroupDare;
$("dareApp").onclick = chooseAppDare;
$("dareDeck").onclick = () => showDarePhase(dareFor(cards[pos].tier));
$("dareDid").onclick = dareDid;
$("dareFail").onclick = dareFail;
$("dareCancel").onclick = () => {
  const n = activePasser;
  if (n && score[n]) {
    if (score[n].passes > 0) score[n].passes--;
    const i = cardPassers.indexOf(n);
    if (i >= 0) cardPassers.splice(i, 1);
    if (lastPassUndoable && (settings.passMode === "shared-shrinking" || settings.passMode === "shared-fixed")) {
      const cap =
        settings.passMode === "shared-shrinking"
          ? settings.passBudgetSeq[budgetTier]
          : settings.passBudgetFixed;
      passBudget = Math.min(cap, passBudget + 1);
    }
    renderMeter(false);
  }
  lastPassUndoable = false;
  closeDare();
  renderOrder();
  renderScorebar();
};
$("nextBtn").onclick = advance;
$("reshuffleBtn").onclick = newOrder;
$("endBtn").onclick = () => {
  if (
    confirm(
      "End this session here? The questions you haven't reached will stay unseen for next time.",
    )
  )
    endEarly();
};
$("seamEndBtn").onclick = () => {
  if (
    !confirm(
      "End this session here? The questions you haven't reached will stay unseen for next time.",
    )
  )
    return;
  pos = Math.max(0, pos - 1);
  endEarly();
};
$("langBtn").onclick = () => {
  const zh = $("qzh"),
    lb = $("langBtn");
  const open = zh.classList.toggle("show");
  lb.classList.toggle("on", open);
  lb.textContent = open ? "隱藏中文" : "中文翻譯";
  lb.setAttribute("aria-expanded", open ? "true" : "false");
};
$("choiceLangBtn").onclick = () => {
  const lb = $("choiceLangBtn");
  const open = lb.getAttribute("aria-expanded") !== "true";
  lb.classList.toggle("on", open);
  lb.textContent = open ? "隱藏中文" : "中文翻譯";
  lb.setAttribute("aria-expanded", open ? "true" : "false");
  document.querySelectorAll(".choice-q-zh").forEach((el) => el.classList.toggle("show", open));
};
$("seamBtn").onclick = renderCard;
$("newSessionBtn").onclick = startSession;
$("editPeopleBtn").onclick = () => {
  $("sesstag").textContent = "";
  validate();
  renderNames();
  show("setup");
};
$("resetBtn").onclick = async () => {
  if (
    !confirm(
      "Reset everyone and all session history? This clears which questions have been used.",
    )
  )
    return;
  state = deepClone(blank);
  settings = settingsForMode("classic");
  state.settings = settings;
  await saveState();
  $("sesstag").textContent = "";
  syncUIVisibility();
  renderNames();
  show("setup");
};
$("gearBtn").onclick = openSettings;
$("settingsClose").onclick = closeSettings;
$("settingsBackdrop").onclick = closeSettings;
$("redrawBtn").onclick = redrawRemaining;
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSettings();
});

/* ============ Boot ============ */
(async () => {
  state = await loadState();
  if (!state.used) state.used = deepClone(blank.used);
  settings = mergeSettings(DEFAULT_SETTINGS, state.settings);
  state.settings = settings;
  renderNames();
  syncUIVisibility();
  if (state.sessions > 0) {
    $("setupTitle").textContent = "Welcome back.";
    $("setupLead").textContent = `You've played ${state.sessions} session${state.sessions > 1 ? "s" : ""}. Session ${state.sessions + 1} starts light again — with questions you haven't seen yet — and climbs to honest.`;
  }
  show("setup");
})();
