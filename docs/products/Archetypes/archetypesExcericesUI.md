Exercise UI — Recommended Design

### What the exercise is not

It is not a quiz. There are no right answers being checked. It is not a form submission. The user is not sending anything to you. It is not a knowledge article. Passive reading defeats the purpose — the exercise only works if the user actually does the work.

### What it is

A structured private journal session inside the dashboard. The user reads a prompt, writes their answer, and the answer is saved to their profile — not for you to read, not to generate a score, not to feed an algorithm. Saved because the next time they open it, their work is still there.

---

### The UI breakdown

**Layout:** Full-width single-column reading view. No sidebar, no navigation chrome. The exercise gets the full screen the way a document does. This signals: this is work, not browsing.

**Content rendering:** The exercise text renders above each input. One section at a time is ideal — the user reads Part 1, answers Part 1, then Part 2 appears or scrolls into view. This prevents the wall-of-text problem and keeps attention on the current prompt.

**Input type:** Plain text area. Not rich text, not markdown, not a chat box. A simple expanding textarea that grows as the user types. No character limit. No word count pressure. No formatting toolbar. The exercise is thinking-on-paper — the input should feel like paper.

**Save behavior:** Auto-save. No save button. Every keystroke saves to their profile with a quiet "Saved" indicator in the corner. The user should never feel like they might lose their work. The whole point is that they can come back to it.

**Completion state:** Once the user has typed something in every part and scrolled to the Move™ at the end, the exercise card in their dashboard flips to a completed state — a visual indicator that they did it. Not a celebration animation. Just a quiet checkmark. This feeds the progress indicator in the dashboard.

---

### What is saved and why

Their answers are saved to their profile as private notes attached to that exercise. The purpose:

* **Continuity.** The exercise is not a one-sitting experience. A user who does Part 1 on Monday should see their Part 1 answer when they return on Thursday. Without save, the exercise has no memory and the work disappears.
* **Practitioner access (ETF tier only).** If the user later connects with an ETF™ Certified Practitioner, the practitioner can request access to the user's exercise responses. The user controls this — it is not shared automatically. When access is granted, the practitioner sees the answers as context before the first session. This is a significant value driver: the practitioner arrives knowing the client's blind spots, their current scoreboard, their depth map. The exercises become intake documentation without feeling like intake documentation.
* **Reflection over time.** The user can return to their answers in six months and see what has changed. The exercise is dated when completed. A Rival who reconstructed their scoreboard in January and returns in September can see whether the scoreboard they designed actually got built.

---

### What is not saved

The Move™ at the end of each exercise is not saved as a note. It is promoted into the active Moves™ tracker on their dashboard when they confirm it. There should be a "Add this Move™ to my tracker" button at the end of each exercise. That is the handoff point — from reflection into execution.

---

### Where it lives

Inside the authenticated dashboard, under a tab or section called **Exercises** or  **Your Work** . Not in settings — settings is for account management. Not in a feed — a feed implies other people's content. This is entirely personal and entirely private.

The entry point from the results page is: *"Your [Archetype] exercise is ready →"* which takes them directly into the exercise view for their specific archetype. Users can also access all exercises they have unlocked from the Exercises section of the dashboard.

---

### The feed question — no

There is no feed, no sharing, no social layer on the exercises. The exercises work because they are private. An athlete writing honestly about their resentment signals or their relational depth gaps will not do that work if there is any possibility it is visible to anyone else. The moment the exercise has a social layer, the performance reflex activates and the honesty disappears. Keep it private, save it silently, share it only with a practitioner and only with explicit user consent.

---

### Summary decision table

| Question                    | Answer                                          |
| --------------------------- | ----------------------------------------------- |
| Text box or on-screen text? | Both — prompts as text, response as textarea   |
| Auto-save or manual save?   | Auto-save, always                               |
| Saved to profile?           | Yes, private                                    |
| Visible to anyone else?     | Only a practitioner, only with user consent     |
| Is there a feed?            | No                                              |
| Is it in settings?          | No — in the dashboard Exercises section        |
| What happens to the Move™? | Promoted to the Moves™ tracker on confirm      |
| Completion tracked?         | Yes — dashboard shows which exercises are done |
