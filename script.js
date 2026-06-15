let darePool = { warm: [], deep: [], deepest: [] };
function dareFor(tier) {
  if (!darePool[tier] || darePool[tier].length === 0)
    darePool[tier] = shuffle(DARES[tier]);
  return darePool[tier].pop();
}

/* ============ Shared goal: the Closeness ladder ============ */
/* Streak = consecutive cards answered by the WHOLE circle with zero passes. Any pass resets it to 0. */
const LADDER = [
  { at: 0, name: "Strangers" },
  { at: 2, name: "Acquaintances" },
  { at: 4, name: "Friends" }, // unlocks a bonus card
  { at: 6, name: "Confidants" }, // unlocks a bonus card
  { at: 8, name: "Inner Circle" },
  { at: 11, name: "Unbreakable" }, // the win
];
const WIN_AT = 11;
const UNLOCK_LEVELS = { 4: true, 6: true }; // streak thresholds that inject a bonus card
// Bonus connection cards — only ever reached by collective courage.
const BONUS = [
  "Each person: tell the group one thing this circle gives you that you get nowhere else.",
  "Go around: say the name of someone here and finish — 'I'm closer to you than I let on because…'",
  "As a group, decide: who here is the bravest tonight, and tell them why.",
  "Each person: name one moment from tonight you'll still remember a year from now.",
  "Go around: tell the person across from you something you hope stays true about them.",
];
let bonusPool = [];
function bonusCard() {
  if (bonusPool.length === 0) bonusPool = shuffle(BONUS);
  return bonusPool.pop();
}
function levelFor(streak) {
  let lv = LADDER[0];
  for (const l of LADDER) {
    if (streak >= l.at) lv = l;
  }
  return lv;
}

/* ============ Per-session draw: keep totals near the original 12-card arc, all answered round-robin. */
const DRAW = { warm: 5, deep: 4, deepest: 3 }; // 12 cards/session
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

/* ============ Persistence ============ */
const KEY = "closer-group-v1";
const DEFAULT_PEOPLE = [];
const blank = {
  used: { warm: [], deep: [], deepest: [] },
  sessions: 0,
  people: DEFAULT_PEOPLE.slice(),
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
  return JSON.parse(JSON.stringify(blank));
}
async function saveState() {
  try {
    await window.storage.set(KEY, JSON.stringify(state));
  } catch (e) {}
}
let state = JSON.parse(JSON.stringify(blank));

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
  if (pool.length < n) {
    // exhausted: recycle this tier, keep drawing fresh from the reset pool
    state.used[tier] = [];
    pool = BANK[tier].slice();
  }
  // Note: cards are NOT marked used here — only when actually shown (see renderCard).
  // This way, stopping a session early returns the unseen cards to the pool.
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
let cards = []; // [{q,tier}]
let pos = 0;
let order = []; // names in answer order for current card
let score = {}; // per name: {strikes, dares, passes} for the current session
let activePasser = null;
let streak = 0; // cards climbed (continues through passes; only a budget-out resets it)
let bestStreak = 0; // high-water mark this session
let curLevel = 0; // index into LADDER reached
let cardPassers = []; // names who passed on the CURRENT card (for accurate cancel)
let wonThisSession = false;
// Shared pass budget: the whole circle shares it. Refills smaller after each reset: 3 → 2 → 1 → 0.
const BUDGET_SEQ = [3, 2, 1, 0];
let budgetTier = 0; // index into BUDGET_SEQ
let passBudget = BUDGET_SEQ[0]; // passes remaining before the meter resets
let resets = 0; // how many times the meter has been wiped this session
let lastPassUndoable = false; // whether the most recent pass can be cancelled (didn't trigger a reset)
function resetScore() {
  score = {};
  state.people.forEach((n) => (score[n] = { strikes: 0, dares: 0, passes: 0 }));
}

function bankNoteText() {
  const sessionsLeft = Math.floor(
    totalRemaining() / (DRAW.warm + DRAW.deep + DRAW.deepest),
  );
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
  if (state.people.length >= 10) {
    return;
  }
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
function setTierTheme(t) {
  document.body.dataset.tier = String(t + 1);
}
const tierIndex = (t) => (t === "warm" ? 0 : t === "deep" ? 1 : 2);

function newOrder() {
  order = shuffle(state.people);
  renderOrder();
}
function renderOrder() {
  const seq = $("seq");
  seq.innerHTML = "";
  order.forEach((n, i) => {
    const el = document.createElement("span");
    let classes = "who";
    if (cardPassers.includes(n)) {
      classes += " passed";
    }
    el.className = classes;
    const v = score[n] || { strikes: 0 };
    const strikes = v.strikes
      ? ` <span class="strike">${"✗".repeat(v.strikes)}</span>`
      : "";
    el.innerHTML = `<span class="i">${i + 1}</span>${n}${strikes}`;
    el.title = `${n}: tap to pass (draw a dare). The circle shares ${passBudget} pass${passBudget === 1 ? "" : "es"} before the meter resets.`;
    el.onclick = () => openDare(n);
    seq.appendChild(el);
  });
}
function renderMeter(broke) {
  const lv = levelFor(streak);
  $("meterLevel").textContent = lv.name;
  // fuse: how many shared passes remain before the next reset
  const fuse =
    passBudget > 0
      ? `🔥 ${passBudget} shared pass${passBudget === 1 ? "" : "es"} left before reset`
      : `⚠️ no passes left — the next pass wipes the meter`;
  const climb =
    streak > 0
      ? `${streak} climbed · ${Math.max(0, WIN_AT - streak)} to Unbreakable · `
      : "";
  $("meterStreak").textContent = climb + fuse;
  const fillPct = Math.min(100, (streak / WIN_AT) * 100);
  $("meterFill").style.clipPath = `inset(0 ${100 - fillPct}% 0 0)`;
  const rungs = $("meterRungs");
  rungs.innerHTML = "";
  LADDER.forEach((l) => {
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
  const totalStrikes = entries.reduce((a, [, v]) => a + v.strikes, 0);
  const totalDares = entries.reduce((a, [, v]) => a + v.dares, 0);
  if (totalStrikes === 0 && totalDares === 0) {
    sb.innerHTML = `<span class="pill">No passes yet — everyone's all in 🔥</span>`;
    return;
  }
  // current chicken leader
  let max = Math.max(...entries.map(([, v]) => v.strikes));
  const leaders = entries
    .filter(([, v]) => v.strikes === max && max > 0)
    .map(([n]) => n);
  let html = `<span class="pill">😼 dares done: <b>${totalDares}</b></span>`;
  html += `<span class="pill">✗ strikes: <b>${totalStrikes}</b></span>`;
  if (leaders.length)
    html += `<span class="pill crown">👑 biggest chicken: <b>${leaders.join(" & ")}</b> (${max})</span>`;
  sb.innerHTML = html;
}

/* ============ Dare flow ============ */
function openDare(name) {
  activePasser = name;
  const v = score[name];
  if (v) v.passes++;
  if (!cardPassers.includes(name)) cardPassers.push(name);

  // Shared budget: spend one. The meter keeps climbing UNTIL the budget hits zero — then it wipes.
  if (passBudget > 0) {
    passBudget--;
    lastPassUndoable = true; // didn't trigger a reset, so it can be cancelled cleanly
    if (passBudget === 0) {
      toast(
        `⚠️ Last shared pass spent`,
        `One more pass and the climb resets.`,
        "bad",
      );
    }
    renderMeter(false);
  } else {
    // budget already empty → THIS pass wipes the meter and refills a smaller budget
    lastPassUndoable = false;
    const lost = levelFor(streak).name;
    resets++;
    streak = 0;
    budgetTier = Math.min(budgetTier + 1, BUDGET_SEQ.length - 1);
    passBudget = BUDGET_SEQ[budgetTier];
    renderMeter(true);
    const refillMsg =
      passBudget > 0
        ? `Budget refills to just ${passBudget}.`
        : `No cushion left — every pass now resets instantly.`;
    toast(
      `💔 ${name} wiped the meter`,
      `The circle falls from ${lost} back to Strangers. ${refillMsg}`,
      "bad",
    );
  }

  $("dareWho").textContent = cardPassers.join(" & ");
  // open in the CHOICE phase — group authors first, app is the fallback
  $("dareChoice").classList.remove("hidden");
  $("dareDo").classList.add("hidden");
  $("dareText").textContent = "";
  $("darePanel").classList.remove("hidden");
  $("darePanel").scrollIntoView({ behavior: "smooth", block: "nearest" });
  renderOrder();
  renderScorebar();
}
function showDarePhase(text) {
  $("dareText").textContent = text;
  $("dareChoice").classList.add("hidden");
  $("dareDo").classList.remove("hidden");
}
function chooseGroupDare() {
  // group invents it aloud — nothing for the app to show but a prompt
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

function renderCard() {
  const c = cards[pos];
  const ti = tierIndex(c.tier);
  // a card counts as "used" only once it's actually shown — so stopping early spares the rest
  // (bonus cards aren't from the bank, so they never touch the used list)
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
  // reset + load Mandarin translation for this card (English stays primary)
  const zh = $("qzh"),
    lb = $("langBtn");
  $("qzhText").textContent = ZH[c.q] || "（暫無翻譯）";
  zh.classList.remove("show");
  lb.classList.remove("on");
  lb.textContent = "中文翻譯";
  lb.setAttribute("aria-expanded", "false");
  newOrder();
  renderScorebar();
  renderMeter(false);
  cardPassers = [];
  lastPassUndoable = false;
  $("darePanel").classList.add("hidden");
  activePasser = null;
  $("dareChoice").classList.remove("hidden");
  $("dareDo").classList.add("hidden");
  $("barFill").style.transform = `scaleX(${(pos + 1) / cards.length})`;
  show("play");
}

function advance() {
  // every card the circle gets through grows the climb; the meter only wipes when the shared budget runs out (handled on pass)
  const before = levelFor(streak);
  streak++;
  if (streak > bestStreak) bestStreak = streak;
  const after = levelFor(streak);
  if (UNLOCK_LEVELS[streak]) {
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
  } else if (after.name !== before.name && streak < WIN_AT) {
    toast(
      `✨ ${after.name}`,
      `The circle keeps climbing — ${streak} cards in.`,
      null,
    );
  }
  if (streak === WIN_AT && !wonThisSession) {
    wonThisSession = true;
    toast(
      `👑 UNBREAKABLE`,
      `You reached the top of the ladder together. The circle wins.`,
      "win",
    );
  }
  const cur = cards[pos].tier;
  pos++;
  if (pos >= cards.length) {
    finishSession();
    return;
  }
  if (cards[pos].tier !== cur && !cards[pos].bonus) {
    const ti = tierIndex(cards[pos].tier);
    const s = SEAMS[ti];
    setTierTheme(ti);
    $("seamKicker").textContent = s.kicker;
    $("seamTitle").textContent = s.title;
    $("seamBody").textContent = s.body;
    show("seam");
  } else renderCard();
}

function startSession() {
  cards = [
    ...drawTier("warm", DRAW.warm).map((q) => ({ q, tier: "warm" })),
    ...drawTier("deep", DRAW.deep).map((q) => ({ q, tier: "deep" })),
    ...drawTier("deepest", DRAW.deepest).map((q) => ({ q, tier: "deepest" })),
  ];
  state.sessions++;
  saveState();
  pos = 0;
  resetScore();
  streak = 0;
  bestStreak = 0;
  curLevel = 0;
  wonThisSession = false;
  cardPassers = [];
  lastPassUndoable = false;
  budgetTier = 0;
  passBudget = BUDGET_SEQ[0];
  resets = 0;
  darePool = { warm: [], deep: [], deepest: [] };
  bonusPool = [];
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
  // rank by strikes desc, then by fewest dares (more dares done = braver)
  const ranked = entries
    .slice()
    .sort((a, b) => b[1].strikes - a[1].strikes || a[1].dares - b[1].dares);
  const maxStrikes = Math.max(...entries.map(([, v]) => v.strikes));
  board.innerHTML = "";
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
  if (wonThisSession)
    return "🏆 You reached UNBREAKABLE — the circle climbed all the way to the top together. That's the perfect run.";
  const lv = levelFor(bestStreak).name;
  if (bestStreak === 0)
    return "The meter never got going this time. Something to chase next round.";
  const resetNote =
    resets > 0
      ? ` Meter wiped ${resets} time${resets === 1 ? "" : "s"}.`
      : " And you never burned through the budget — clean climb.";
  return (
    `Your circle reached ${lv} (best climb: ${bestStreak} card${bestStreak === 1 ? "" : "s"}${bestStreak < WIN_AT ? `, ${WIN_AT - bestStreak} short of Unbreakable` : ""}).` +
    resetNote
  );
}

function finishSession() {
  setTierTheme(2);
  $("endKicker").textContent = `Session ${state.sessions} complete`;
  $("endTitle").textContent = wonThisSession
    ? "Unbreakable."
    : "That's the climb.";
  $("endBody").textContent =
    closenessLine() + " " + chickenLine(biggestChicken());
  $("endBank").textContent = bankNoteText();
  renderBoard();
  show("end");
}

function endEarly() {
  const seen = pos + 1;
  const left = cards.length - seen;
  $("endKicker").textContent = `Session ${state.sessions} · ended early`;
  $("endTitle").textContent = "You stopped where you needed to.";
  $("endBody").textContent =
    `You went through ${seen} card${seen === 1 ? "" : "s"} before stopping; the rest stay unseen for next time. ` +
    closenessLine() +
    " " +
    chickenLine(biggestChicken());
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

/* ============ Buttons ============ */
$("startBtn").onclick = startSession;
$("dareGroup").onclick = chooseGroupDare;
$("dareApp").onclick = chooseAppDare;
$("dareDeck").onclick = () => showDarePhase(dareFor(cards[pos].tier)); // fallback from the group prompt
$("dareDid").onclick = dareDid;
$("dareFail").onclick = dareFail;
$("dareCancel").onclick = () => {
  const n = activePasser;
  if (n && score[n]) {
    if (score[n].passes > 0) score[n].passes--;
    const i = cardPassers.indexOf(n);
    if (i >= 0) cardPassers.splice(i, 1);
    if (lastPassUndoable) {
      // this pass only spent budget (no reset) — give the shared pass back
      passBudget = Math.min(BUDGET_SEQ[budgetTier], passBudget + 1);
      renderMeter(false);
    }
    // if the pass had triggered a wipe, that stays — the climb was already lost. (lastPassUndoable=false)
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
  // on a seam the next card hasn't been shown yet, so back pos up by one for an accurate "seen" count
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
  state = JSON.parse(JSON.stringify(blank));
  await saveState();
  $("sesstag").textContent = "";
  renderNames();
  show("setup");
};

/* ============ Boot ============ */
(async () => {
  state = await loadState();
  if (!state.used) state.used = JSON.parse(JSON.stringify(blank.used));
  renderNames();
  if (state.sessions > 0) {
    $("setupTitle").textContent = "Welcome back.";
    $("setupLead").textContent =
      `You've played ${state.sessions} session${state.sessions > 1 ? "s" : ""}. Session ${state.sessions + 1} starts light again — with questions you haven't seen yet — and climbs to honest.`;
  }
  show("setup");
})();
