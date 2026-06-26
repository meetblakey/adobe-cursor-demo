# Decks — Cursor 101 & 201 (Adobe)

Generated from the Prep Zone slide sections (`cursor-101.ts` s6, `cursor-201.ts` s8). Each slide
is a **headline + one spoken line** — the spoken line is in the slide's **speaker notes**, never
on the slide. Dark "Cursor" aesthetic; one orange accent; a shape-based visual per slide.

- `cursor-101-adobe-kickoff.pptx` — title + 5 board-altitude slides (the board's question →
  why-now → one-system/200-teams → governed → the 30-day ask).
- `cursor-201-deep-dive.pptx` — title + 5 technical slides (the loop → three primitives → two
  gates → observe-closes-the-loop → governed at scale).

## Regenerate / edit
```
npm install pptxgenjs      # once
node build.js              # rewrites both .pptx
```
Edit the slide data/visuals in `build.js`.

## ⚠️ Visual QA still owed
These were content-QA'd (text, order, speaker notes, file integrity) but **not** rendered-QA'd
on this machine — LibreOffice wasn't installed, so no image pass. **Open both in PowerPoint /
Keynote and eyeball** for overflow/overlap before presenting. The two layout risks I pre-empted
(101 hub-spoke vs. headline; 201 inherited-controls chips) are addressed, but a real render is
the final check. Fonts are safe-list (Cambria headers / Arial body) so they travel.
