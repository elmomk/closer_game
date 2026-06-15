# Closer — Evidence-Based Improvement Research

> **Date:** 2026-06-15
> **Scope:** How to improve *Closer* (the group conversation card game in `index.html`) as a **personal tool for a close friend group** (4–10 people). Axes: **deeper connection**, **game feel & replayability**, **questions & UX**. Market/monetization deliberately out of scope.
> **Method:** Multi-agent deep-research run — 24 sources fetched, 115 claims extracted, top 25 put through 3-vote adversarial verification (need 2/3 to refute → kill). **23 confirmed, 2 killed.**

---

## Bottom line

The evidence **strongly validates Closer's core** (escalating, reciprocal, round-robin self-disclosure) — but it **cautions hard against the signature "twist"**: the shrinking shared pass-budget that wipes the meter, the pass-as-dare, and the "biggest chicken" crown. Those three are almost exactly the conditions the literature shows make disclosure *backfire*. The fix is surgical, not a rewrite.

All measured effects are **modest and temporary** (in-session warmth, not durable bonds), so the product framing should be a **recurring ritual**, not a one-shot "closeness machine."

---

## What the evidence says KEEP ✅

| Mechanic in the code | Why it's supported |
|---|---|
| **3 escalating tiers** (`BANK.warm/deep/deepest`) + **reciprocal round-robin** | Aron 1997 beat small-talk by a *large* margin (closeness 4.06 vs 3.25, **d = .88**); Sprecher 2021 independently replicated; turn-taking reciprocity specifically boosts liking/closeness/perceived similarity (Sprecher et al. 2013). The single best-supported design choice. |
| **Everyone answers every card** (`order = shuffle(state.people)`) | The *act* of disclosing raises the **discloser's own** felt closeness (Collins & Miller 1994, causal experimental subset, d ≈ .32). A spectator format would lose this. |
| **Reshuffled order each card** (`newOrder()`) | Directly counters two documented group failure modes — unequal **airtime** and intractable **turn-taking** (Cooney et al. 2020, *The Many Minds Problem*). |
| **Cooperative shared goal** (the Closeness meter / `LADDER`) | Cooperative framing increased prosocial sharing (Zhang 2025, d = .44); competitive framing *lowered* friendship quality (Verheijen 2019). The meter is the right instinct. |
| **"No advice, no fixing"** (Rule 2) + **recurring sessions** (no-repeat bank, session counter) | Perceived **responsiveness**/validation is the *mediator* of intimacy (Laurenceau 1998); effects are temporary, so a *ritual* beats a one-shot. The repeat-play scaffolding is already built. |

---

## What the evidence says RETHINK ⚠️

**The pass → budget-wipe → dare → strike → chicken-crown chain.** What it does psychologically:

1. Passing is framed as *"ducked the question" / "chickening out"* — shame-loaded language.
2. A pass spends a **shared** budget, so protecting yourself **punishes everyone** (`openDare()` else-branch sets `streak = 0` and wipes the meter).
3. The penalty for passing is a **dare** — and at the Deepest tier the dares (`DARES.deepest`) are *themselves harder forced disclosures* ("tell them the thing you've never said," "let the group ask you anything"). Opting out of a hard question is penalized with an *even more intense* public disclosure.
4. Refusing the dare → a **strike** → public **"biggest chicken" crown** (`biggestChicken()`, `chickenLine()`).

This is a near-perfect recipe for the documented **backfire** case. Collins & Miller (1994): *"Unusually high disclosure can elicit **reactance** when a recipient feels social pressure to reciprocate at an equally intimate level… more of a burden than a social reward."* In field/public settings — and group play **is** the public condition — intimate disclosure was the one case to produce a **significant *negative* association with liking**.

> **Honesty flag:** a stronger version of this — Cozby's "inverted-U / oversharing curve" — was **one of the 2 claims the verifiers killed (0-3)**. So this is *not* a claim that "depth reduces closeness." The supported claim is narrower: **pressure/coercion to disclose** backfires. Gradual escalation is fine; *penalizing the exit from it* is the problem.

**Key distinction for a close-friends context:** the research does **not** say "competition is bad" — low-stakes playful competition can energize *established* friendships. It says competition/shame attached to *whether you're willing to be vulnerable* is what triggers reactance. **Decouple the two** and most of the risk disappears.

---

## Concrete changes, prioritized

### P0 — Make the exit safe; stop punishing vulnerability
- **Remove the meter-wipe-on-pass.** A collective punishment where one person's self-protection tanks the group's progress is the single most-cautioned-against mechanic. Drive the meter on *participation quality*, not *compliance*.
- **Decouple dares from passing.** Keep dares if desired — but as their own opt-in *spice card*, not the penalty for declining to share. "Pass" should simply mean "I'll sit this one out."
- **Reframe the language.** "ducked the question" / "Chickening out?" / "biggest chicken" → neutral or warm ("taking a pass," "your call"). ~10-minute copy edit, outsized effect on safety.
- **Replace the chicken crown with a *positive* award.** Reward *prosocial in-play behavior* (Verheijen 2019). Swap `biggestChicken()` for a group-voted "bravest share" or "best listener" — same end-of-session ritual, opposite psychological sign.

### P1 — Engineer responsiveness (the biggest missing lever)
Disclosure **alone is insufficient** — feeling *understood/validated* is what converts it to closeness, and it's exactly the signal groups dilute (Laurenceau 1998; Cooney 2020). The meter currently advances on "got through the card" (`advance()` → `streak++`) and rewards *answering* only.
- Add a lightweight **listener beat**: after each share, the next person reflects back *one* thing they heard before the meter ticks. Cheap to build, targets the actual mediator of intimacy.
- Or make the **bonus cards** responsiveness-focused (several already are) and lean into that.

### P1 — Fix the dyad→group gap for the Deepest tier
The **central scientific risk**: essentially *all* the strong evidence is **dyadic**, and disclosure measurably drops as groups grow toward 10 (Cooney 2020).
- For the **Deepest tier with larger circles (≥ 6–7)**, **split into pairs or triads**, then optionally share back. This literally restores **Aron's original dyadic condition** (where d = .88 lives) and sidesteps the "less intimate in big groups" problem.
- At minimum, set expectations in setup copy: 4–6 will go deeper than 8–10.

### P2 — Prompt tuning (emotion > facts)
The cleanest prompt finding: **emotional disclosure predicts intimacy (β = .37); factual disclosure ≈ 0** (Laurenceau 1998). The deep/deepest tiers already nail this. A few **warm-ups lean "trivia"** ("most-used app," "strangest job you'd be good at," "most overrated sense") — fine as a safety ramp, but give each an emotional turn so even the warm-up trends toward feeling, not fact.

### P2 — UX / accessibility
⚠️ **Honesty flag:** the verifiers found **no research evidence** on bilingual/mobile/WCAG for pass-the-phone games — these rest on *standards + code review*, not on the studies above.
- **`lang="en"` on `<html>` but Chinese is served.** Add `lang="zh-Hant"` to the `.qzh` block (`#qzh`) — correct screen-reader pronunciation and font selection (WCAG 3.1.2).
- **Persist the language preference.** `renderCard()` resets the 中文 toggle to hidden every card, so a bilingual user must re-tap on *every* card. Remember the choice across cards.
- **Touch targets:** the chip "×" remove button and `.btn.sm` ghost buttons look under the ~44 px minimum (WCAG 2.5.5). Worth measuring.
- **Contrast:** low-opacity text (`footer` .7, `.meter-rungs` .55, muted `#9aa9b4`) may fail AA — quick check warranted.
- **Soften over-promising copy.** Effects are modest and temporary (Aron: "not an actual ongoing relationship"). "Climb to **Unbreakable** to win" oversells one session — frame the *ritual* (repeat play) as where lasting value accrues.

---

## Confidence & limits

- **High confidence:** core mechanic works; pressure-to-disclose backfires; responsiveness is the mediator; emotion > facts; effects are temporary.
- **Medium / analogical:** "competition harms, cooperation helps" comes from *adolescents (racing video game)* and *preschoolers* — directionally solid, not a direct test on adult conversation.
- **Genuinely open:**
  - No study validates the exact 4–10 round-robin format; the effect-size decay from 4→10 people is unquantified.
  - Whether a shaming layer suppresses disclosure among *already-close adults* (vs. strangers/kids) is untested.
  - Optimal design for *engineering* listener responsiveness in a group is unspecified.
  - UX/accessibility recommendations are standards-based, not research-based.

### Claims that were REFUTED (do not assert)
- *"In groups, complex turn-taking makes listeners resort to silence rather than reciprocal disclosure."* — **0-3.**
- *"Cozby 1972 found a proven curvilinear (inverted-U) disclosure–liking curve."* — **0-3.** The backfire risk holds only as a **conditional** effect under pressure / high-intimacy / public settings.

---

## Sources (verified, primarily peer-reviewed)

1. Aron, Melinat, Aron, Vallone & Bator (1997), *The Experimental Generation of Interpersonal Closeness*, PSPB — https://www.stafforini.com/docs/Aron%20et%20al%20-%20The%20experimental%20generation%20of%20interpersonal%20closeness.pdf
2. Sprecher (2021), replication of the Fast Friends / closeness task, *J. Social and Personal Relationships* — https://journals.sagepub.com/doi/abs/10.1177/0265407521996055
3. Sprecher, Treger & Wondra (2013), reciprocal vs non-reciprocal disclosure, *JESP* — https://www.sciencedirect.com/science/article/abs/pii/S002210311300070X
4. Collins & Miller (1994), *Self-disclosure and Liking: A Meta-Analytic Review*, Psych. Bulletin — https://labs.psych.ucsb.edu/collins/nancy/UCSB_Close_Relationships_Lab/Publications_files/Collins%20and%20Miller,%201994.pdf
5. Laurenceau, Feldman Barrett & Pietromonaco (1998), *Intimacy as an Interpersonal Process*, JPSP — https://www.affective-science.org/wp-content/uploads/2024/04/LaurenFBPl1998.pdf
6. Cooney, Mastroianni, Abi-Esber & Brooks (2020), *The Many Minds Problem*, Current Opinion in Psychology — https://www.hbs.edu/ris/Publication%20Files/The%20Many%20Minds%20Problem_59e29914-d283-403e-989d-4f3a62961984.pdf
7. Verheijen, Stoltz, van den Berg & Cillessen (2019), competitive vs cooperative play and friendship quality, *Computers in Human Behavior* — https://www.sciencedirect.com/science/article/abs/pii/S0747563218305132
8. Zhang, Ruan & Xiong (2025), cooperative games and sharing in children (RCT) — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12268353/
9. Cozby (1972), *Self-disclosure, reciprocity and liking* (cost–reward framing; curvilinear claim refuted here) — https://www.semanticscholar.org/paper/Self-disclosure,-reciprocity-and-liking.-Cozby/b80d621797f7514da5f885dd82889014b87de177
