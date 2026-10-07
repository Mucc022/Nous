# Nous UI Redesign Blueprint For Codex

This file is a working memory document for future Codex sessions on the Nous project. Read this before discussing or implementing the UI redesign.

The user asked Codex to capture the full product/UI direction before producing a formal requirements and prompt document. Do not treat this as final UI spec yet. It is a detailed source-of-truth note from the current conversation.

## 1. Core Product Positioning

Nous is not just a flashcard app.

The core positioning is:

> Turn any information source into AI-processed questions, then use structured practice and spaced review to internalize the knowledge.

The user wants a learning website where any material can be processed by a large language model into different kinds of questions. The goal is not only memorization, but deeper absorption and internalization.

Important implications:

- AI-generated questions are the main intake method.
- The app should help users transform source material into useful learning units.
- The question design should be thoughtful, not random for its own sake.
- Supported question forms should include cloze/fill-in-the-blank, multiple choice, random cloze, normal Q&A, and other future forms.
- The app should support both initial practice and a full review cycle.
- It currently serves a small class group, not the public internet.
- It should remain a website first. A true app can be considered only if the project becomes strong enough later.

## 2. Current User Frustrations

The user thinks the current UI is very ugly and disorganized.

Main complaints:

- Too many things are stacked on the left side.
- There is no proper settings page or information architecture.
- The UI has no clear product structure.
- Buttons are inconsistent in color, shape, weight, and behavior.
- The current warm palette is not the biggest problem, but the darker brown/red/brownish controls make the interface feel ugly and heavy.
- The app feels like controls were piled onto one page instead of designed as a normal product.
- The AI import area is visually noisy and should not always occupy a large visible panel.
- Settings, statistics, export, import, folder management, and card list should not all be exposed at once.

The user wants the redesign to follow normal product patterns used by good information-management tools, instead of an improvised one-page control dump.

## 3. Desired Visual Direction

High-level style:

- Clean.
- Fresh.
- Warm.
- Eye-friendly.
- Minimal but functional.
- Learning-tool first, light game-feel second.
- Apple-like simplicity is acceptable, but the user does not want something rigid, sterile, or underpowered.

Palette direction:

- Warm eye-friendly tones are preferred.
- Avoid heavy dark brown, muddy brown, deep red, and dense old-paper looks.
- The current color direction is not completely wrong, but the execution feels heavy and inconsistent.
- Use lighter, fresher colors.
- Color system should be modular/tokenized so future theme customization is possible.
- Future users may choose button/accent colors, but this does not need to be implemented immediately.

Interaction feel:

- Comfortable feedback is more important than game systems.
- The user wants satisfying, smooth, soft interactions.
- Avoid gamification like XP, levels, achievements as the current priority.
- Future data tracking is welcome.

Desired motion examples:

- Cards open with a soft elastic pop.
- Card details close smoothly back to the gallery.
- Tree items highlight with a full, comfortable filled background when selected.
- Collapsible panels expand/collapse smoothly.
- Buttons have consistent hover/click feedback.
- Revealing hidden/cloze text should feel smooth.
- Correct/fuzzy/forget feedback should be distinct but restrained.

## 4. Layout Direction

The user prefers a flexible workspace, not a fixed static page.

Preferred structure:

- A multi-column workspace.
- Left side: folder tree, deck/library navigation, collapsible navigation groups.
- Center: primary content area, usually card gallery, study card, onboarding cards, or library management.
- Right side: auxiliary panels such as study dashboard, AI import, review info, statistics summary.
- Left and right sides should be collapsible.
- Most content should be foldable/collapsible.
- Users should be able to keep the interface simple or expand deeper controls when needed.

Important phrase:

> 收放自如

The interface should let the user collapse, expand, enter details, and leave details freely.

Search:

- Search is very important.
- It should quickly find cards, decks, folders, tags, question text, answer text, and notes.
- Search should not be a minor afterthought.
- Possible placement: left-bottom fixed entry, top quick search, or global search overlay.
- Future search may need better algorithms/ranking.

Settings:

- Settings should be collapsible or in a dedicated expandable list.
- Settings should not be dumped into the main page.

AI import:

- AI import is important, but visually complex.
- It should likely be a collapsible right-side workflow panel.
- It should guide users step by step.
- It should not always be expanded.

Homepage/dashboard:

- First open should not be an empty or overloaded control surface.
- The center area can show onboarding/example cards that explain how to use the system.
- It can also show current learning status and today's review.

## 5. Library And Card Gallery

The user likes card-based design very much.

The library should feel similar to a Notion gallery/database:

- Left side has folders/decks.
- Opening a folder or deck shows all its cards in the center area.
- The center can use a card grid/gallery.
- Users should be able to adjust card preview size: small, medium, large.
- Cards should preview meaningful content, not just a cramped list row.
- Each card is an independent data object.

Card previews may include:

- Title/question.
- Tags.
- Deck/folder path.
- Review status.
- Next review indicator.
- Notes indicator.
- Star/difficult marker.
- Number of child questions, if the card contains multiple subquestions.

The user does not want the main content to fully navigate away when opening a card.

## 6. Card Detail Interaction

Opening a card should behave like opening a Notion database item:

- It should appear as an overlay, drawer, or floating detail page.
- It should not hard-navigate away from the gallery.
- It should not replace the whole page in a disorienting way.
- It should be quick to close and return to the previous gallery/list context.
- It can be semi-expanded, half-page, side modal, or large overlay.
- The goal is fast entry/exit.

The card detail is the most important surface in the app.

Each knowledge card may contain:

- Main title or prompt.
- Source material or source reference.
- One or more questions/subquestions.
- Hidden answer area.
- Hints.
- Explanation/analysis.
- User notes.
- Rich text content.
- Highlighting.
- Cloze/hidden text.
- Review controls.
- Star/difficult marker.
- Wrong-book state.
- Review schedule state.
- History/next review time.

Important: one card may contain many subquestions, possibly 20. The system should support both single-question cards and multi-question knowledge cards.

## 7. Notes Model

Notes are a core future feature.

The user wants notes attached to individual questions/subquestions:

- Each question should have its own note area.
- Notes are optional.
- Notes belong to the specific question, not only the whole deck.
- Users should be able to search notes later.
- A future global notes panel/library should list all notes and link back to the corresponding card/question.

Editing needs:

- Rich text.
- Highlight.
- Cloze/hidden text.
- Possibly headings/lists.
- The editor should allow users to refine AI-generated cards freely.

## 8. External LLM Import And User Editing

Important correction: the user does not mean that Nous should depend specifically on Google AI Studio.

The intended flow is tool-agnostic:

- Nous provides a strict prompt and required output structure.
- The user copies the prompt into any large language model tool.
- Possible external tools include ChatGPT, Gemini, Google AI Studio, or other LLMs.
- The user also gives the LLM their exam/study materials.
- The LLM processes the material and outputs a structured question-bank package.
- The user copies/pastes or uploads that package back into Nous.
- Nous recognizes the structure and converts it into cards/questions.

Therefore the real core is not Google AI Studio itself. The real core is:

- A strong prompt.
- A strict machine-readable question-bank format.
- Reliable import/validation.
- Free editing after import.

Current desired pattern:

- Use a fixed prompt to send source material to any LLM.
- The LLM outputs structured questions/cards.
- Nous imports the generated result.
- The user can then freely edit and improve imported cards.
- The output should be fully based on the supplied material and should not drift beyond the source.
- The prompt should explicitly request difficult, highly confusing questions, because LLMs often generate questions that are too easy by default.

Critical requirement:

AI import must not lock the user into rigid generated content.

After import, the user must be able to:

- Edit questions.
- Edit answers.
- Edit question type.
- Edit tags.
- Edit notes.
- Add/remove subquestions.
- Add highlights.
- Add cloze/hidden areas.
- Reorganize content.

Possible import workflow:

1. Select target folder/deck.
2. Choose generation type: Q&A, multiple choice, cloze, random cloze, mixed.
3. Copy the fixed prompt.
4. Go to an external LLM tool such as ChatGPT/Gemini/Google AI Studio and generate a structured question-bank package.
5. Return to Nous and paste/upload JSON.
6. Preview imported cards.
7. Optionally edit/delete before final import.
8. Confirm import.

AI import should probably live in a collapsible right-side panel or guided workflow, not as a permanently visible huge form.

## 9. Study And Review Flow

The user wants a natural review flow, not a cluttered set of unrelated buttons.

Preferred logic:

1. User sees the question.
2. Answer is hidden.
3. User tries to recall.
4. User may click a subtle hint.
5. User reveals/checks answer.
6. User self-rates memory with exactly three main choices:
   - 记住
   - 模糊
   - 忘记
7. The selected rating both submits the result and advances the workflow.
8. Forgetting automatically adds the item to wrong-book state.
9. Hint usage may count as fuzzy or at least mark the attempt as hinted.
10. Skip should be present but visually quiet/subtle.

Important UI requirement:

- Do not create two separate strong actions for "submit answer" and "memory rating" if avoidable.
- The three rating buttons should feel like the main forward action after answer reveal.
- "记住 / 模糊 / 忘记" are preferred labels. Avoid longer labels like "有点模糊".

Button priority:

- Main action/rating buttons should be clear and consistent.
- Hint and skip should be smaller/subtle/frosted/secondary.
- Star/difficult marker can be a small icon at the top-right of the card.
- Wrong-book should be automatic after wrong/forget, not a prominent manual button.

Possible navigation:

- Previous/next card controls can be compact.
- The user mentioned long-press interactions for next/previous as an idea, but this should be treated carefully because discoverability may be low.

## 10. Ebbinghaus Review Cycle

The user wants each card/question to have a complete Ebbinghaus-style review cycle.

Current desired schedule:

- Initial learning.
- 30 minutes later: first review.
- 1 hour later: second review.
- 1 day later: third review.
- 3 days later: fourth review.
- 7 days later.
- 1 month later.
- 3 months later.
- 1 year later.

The user briefly mentioned "half month" and then corrected direction. Treat the above list as the current working version, but confirm before final implementation.

Difficulty:

- The user currently says difficulty should not be manually adjustable.
- Memory rating still exists as 记住/模糊/忘记.

Data to track in the future:

- How many cards reviewed today.
- Historical review counts.
- How many notes written.
- Due cards.
- Wrong cards.
- Fuzzy/weak cards.
- Review history.

No XP/level/achievement system for now.

## 11. Question Types

Current and desired question types include:

- Normal Q&A.
- Multiple choice.
- Cloze/fill-in-the-blank.
- Random cloze.
- Passage/completion.
- Future mixed generated questions.

The user is interested in various forms of questions if they help knowledge internalization.

Design the UI so future question types can be added without making the interface chaotic.

## 11A. Question-Bank Structure Direction

The user now wants to think carefully about a strict structure that external LLMs can output and Nous can reliably import.

The user described two broad groups:

### Objective Questions

Objective questions have fixed answers. Nous can check these more mechanically.

Candidate objective types:

1. Single-choice question.
   - Usually A/B/C/D options.
   - Options should be highly confusing and difficult.
   - The correct answer is fixed.
   - The generated question must be strictly based on the supplied material.

2. Multiple-choice question.
   - More than one correct answer may exist.
   - Needs a fixed set of correct option ids.

3. True/false question.
   - User judges whether a statement is correct.
   - Needs fixed true/false answer and explanation.

4. Fill-in-the-blank question.
   - User enters missing word/phrase.
   - Needs accepted answers and possibly aliases.

5. Matching question.
   - User matches items from two groups.
   - Needs fixed pairs.

6. Ordering question.
   - User puts items into the correct sequence.
   - Needs fixed ordered item ids.

### Subjective Questions

Subjective questions are self-judged by the user. Nous should provide reference answer, rubric, and required points.

Candidate subjective types:

1. Short-answer question.
   - User answers in their own words.
   - AI should provide reference answer and core points.

2. Explanation question.
   - User explains cause, process, meaning, or principle.
   - Needs reference answer and key reasoning steps.

3. Analysis question.
   - User analyzes a material, scenario, concept, argument, or relationship.
   - Needs scoring/checklist dimensions.

Important subjective-question requirement:

- The AI should provide the direction for self-checking.
- Example: if the prompt asks what a table is made of, the self-check points may include legs, screws/nails, wooden board, etc.
- The user judges their own answer against these core points.

The exact data structures for each type are not finalized. Future Codex should ask targeted questions and propose a strict schema.

## 12. Component And Design System Requirements

The user wants modularity.

The UI should have:

- Consistent button system.
- Consistent icon buttons.
- Consistent cards.
- Consistent panel/drawer behavior.
- Consistent collapsible section behavior.
- Theme tokens for color.
- Warm/fresh default theme.
- Room for future user theme customization.

Avoid:

- Random button colors.
- Brown/red/cream overload.
- Overloaded one-page layout.
- Permanent visibility of advanced controls.
- Settings/statistics/import/export all stacked in one sidebar.
- Full page jumps when opening card details.
- Heavy gamification.
- Inconsistent card shapes and button sizes.

## 13. Current Product Scope And Constraints

Current project is a static website:

- Main entry: `index.html`.
- No backend.
- No login.
- No database server.
- No paid API integration in the current stage.
- Data currently uses browser `localStorage`.
- The app is intended for a small class group first.

Future directions may include:

- Better data model.
- Firebase/Supabase or sync.
- True app packaging.
- More advanced statistics.
- Theme customization.

But the current redesign conversation is primarily about UI and information architecture.

## 14. Important Unresolved Questions

Do not write the final external-LLM requirements/prompt document until these are clarified:

1. Should AI import primarily create one large knowledge card with many subquestions, many small single-question cards, or both?
2. What exact fields must exist on a knowledge card?
3. How much editing should be available in the pre-import preview?
4. What kind of rich text editor is preferred: Notion-like block editor, simple toolbar editor, or structured per-question editor?
5. Should the UI redesign be implemented against the current `index.html`, or should the user first use an external AI tool to produce a separate prototype?
6. Should the external AI tool be allowed to change the data model, or only create UI markup/design?
7. What exact JSON/package schema should represent each objective and subjective question type?
8. Should paste-import and file-import use the same structure?
7. Should the formal spec require backward compatibility with current `studyking.flashcards.v3` localStorage?

## 15. Working Guidance For Future Codex

When continuing this conversation:

- Do not jump directly into code.
- Keep asking clarifying questions until the user says the requirements are complete.
- The user's goal is to produce a detailed requirements/prompt document for use with an external AI tool and later UI implementation.
- Keep the user's exact product intent intact: AI -> questionization -> practice -> review -> internalization.
- Preserve the distinction between clean UI and underpowered UI. The user wants simple visuals but rich functionality.
- The user strongly values collapsibility, flexible entry/exit, card-based UI, and comfortable motion.
- Ask about AI import and data structure next if the conversation resumes from here.

## 16. Confirmed Interaction Decisions From 2026-06-22

These decisions should guide future UI requirements.

- The preferred primary card model is "one knowledge point = one card, with many subquestions inside."
- The card detail should contain all relevant content, but almost everything should be collapsible.
- A left-side list/table inside the card detail can show subquestions or sections and should be collapsible/hidden.
- The card/detail surface should include a compact bottom-right study/review bar.
- The outer layer of the bar should expose the three main review choices:
  - 记住
  - 模糊
  - 忘记
- The bar should be expandable/pull-up to show details such as review count and current review stage.
- Objective questions should behave as follows:
  - Correct answer: user can choose `记住` or `模糊`.
  - Wrong answer: automatically treated as `忘记`.
  - Wrong questions enter redo/wrong flow automatically.
- A subtle `跳过` action is needed.
- Wrong and skipped questions should be reviewed again after the regular session, similar to Duolingo's end-of-session repair loop.
- If the user uses a hint, the result should count as `模糊`.
- Notes should appear after answer reveal/checking, when the user can reflect based on the answer.
- AI explanation/reference and user notes must remain separate by default.

## 17. Confirmed Product Decisions From 2026-08-12

- A card must have a knowledge-point title, a concise summary, and core concepts for post-answer reinforcement.
- A subquestion list is required for fast navigation and may be collapsed.
- Source references are required for trust, but should be visually small and collapsed by default in a dropdown.
- One import should create one complete deck from all supplied material; the external LLM chooses meaningful card boundaries while covering the material fully.
- AI explanation is a future optional feature; reserve room for it but do not make it a first-stage dependency.
- A fill-in-the-blank question may contain several blanks; each blank is judged independently.
- Wrong and skipped questions enter a repair pool after normal study and repeat until resolved or the user explicitly ends the session.

## 18. Implementation Status From 2026-08-12

- The user authorized direct implementation rather than further requirements interviews.
- A VNext Sites app now exists in `nous-vnext/`; do not overwrite legacy `index.html` until the new version has been accepted.
- The implemented first screen is a functional prototype of the intended workspace:
  - Collapsible knowledge-library tree.
  - Search across demonstration card data.
  - Adjustable card-gallery size.
  - Collapsible AI import workflow for external LLM output.
  - Card-detail overlay with internal subquestion navigation.
  - Answer reveal, hint, skip, user note, and `记住 / 模糊 / 忘记` review interactions.
  - In-session wrong/skip repair-pool feedback.
- It currently uses demonstration data and in-memory interaction state. Strict import schema parsing, persistent migration, and full Ebbinghaus scheduling remain later work.

## 19. Feedback Workflow Decision From 2026-08-12

- Continue refinement module by module after the user tries the VNext site.
- Codex should ask concrete acceptance questions for one module at a time, rather than asking vague questions about the whole product.
- Example modules: review scheduling, repair pool, card detail, library management, import package, notes, statistics, and backend administration.
- For each module, collect desired behavior, what feels confusing, what should be hidden, and what data the user needs to see; then implement the agreed changes before moving to the next module.
