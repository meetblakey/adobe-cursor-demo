const pptxgen = require("pptxgenjs");

// ---- palette (dark "Cursor" premium; orange dominant accent, indigo support) ----
const BG = "0F0F12", SURF = "1A1A20", SURF2 = "23232C", LINE = "33333D";
const INK = "F5F5F2", MUTE = "9A9AA2", FAINT = "262630";
const ORANGE = "F54E00", INDIGO = "7C6BF0", TEAL = "2DD4BF", GOLD = "E0A24E", RED = "E5484D";
const FH = "Cambria";        // header serif (safe-list, true-to-width in QA)
const FB = "Arial";          // body sans (safe-list)
const W = 13.3, H = 7.5, MX = 0.75;

const sh = () => ({ type: "outer", color: "000000", blur: 9, offset: 3, angle: 90, opacity: 0.35 });

function chrome(slide, num) {
  slide.background = { color: BG };
  // brand cube (motif) top-left
  slide.addShape("roundRect", { x: MX, y: 0.62, w: 0.30, h: 0.30, rectRadius: 0.06, fill: { color: ORANGE } });
  // big faint slide number (motif) top-right
  slide.addText(num, { x: W - 2.7, y: 0.2, w: 2.4, h: 1.7, align: "right", fontFace: FH, bold: true, fontSize: 96, color: FAINT, margin: 0 });
}
const kicker = (slide, t, c = ORANGE) =>
  slide.addText(t.toUpperCase(), { x: MX + 0.45, y: 0.66, w: 8, h: 0.3, fontFace: FB, bold: true, fontSize: 12, color: c, charSpacing: 3, margin: 0, valign: "middle" });
const headline = (slide, t, y = 1.55, size = 38, w = 11.4) =>
  slide.addText(t, { x: MX, y, w, h: 1.5, fontFace: FH, bold: true, fontSize: size, color: INK, margin: 0, lineSpacingMultiple: 1.02 });
const footer = (slide, t) =>
  slide.addText(t.toUpperCase(), { x: MX, y: H - 0.5, w: 11, h: 0.3, fontFace: FB, fontSize: 9, color: MUTE, charSpacing: 2, margin: 0 });

function card(slide, x, y, w, h, opts) {
  slide.addShape("roundRect", { x, y, w, h, rectRadius: 0.08, fill: { color: SURF }, line: { color: LINE, width: 1 }, shadow: sh() });
  if (opts.tag) slide.addText(opts.tag.toUpperCase(), { x: x + 0.28, y: y + 0.26, w: w - 0.5, h: 0.3, fontFace: FB, bold: true, fontSize: 11, color: opts.accent || ORANGE, charSpacing: 2, margin: 0 });
  if (opts.title) slide.addText(opts.title, { x: x + 0.28, y: y + (opts.tag ? 0.6 : 0.28), w: w - 0.5, h: 0.6, fontFace: FH, bold: true, fontSize: 19, color: INK, margin: 0 });
  if (opts.lines) slide.addText(opts.lines.map((l, i) => ({ text: l, options: { breakLine: i < opts.lines.length - 1 } })),
    { x: x + 0.28, y: y + (opts.title ? (opts.tag ? 1.25 : 0.95) : 0.3), w: w - 0.5, h: h - 1.4, fontFace: FB, fontSize: 13.5, color: MUTE, valign: "top", paraSpaceAfter: 5, margin: 0 });
}
function chip(slide, x, y, w, t, accent = INDIGO) {
  slide.addShape("roundRect", { x, y, w, h: 0.62, rectRadius: 0.31, fill: { color: SURF2 }, line: { color: accent, width: 1 } });
  slide.addText(t, { x: x + 0.15, y, w: w - 0.3, h: 0.62, align: "center", valign: "middle", fontFace: FB, fontSize: 13, color: INK, margin: 0 });
}
function stat(slide, x, y, w, big, label, accent = ORANGE) {
  slide.addShape("roundRect", { x, y, w, h: 2.5, rectRadius: 0.08, fill: { color: SURF }, line: { color: LINE, width: 1 }, shadow: sh() });
  slide.addText(big, { x: x + 0.2, y: y + 0.45, w: w - 0.4, h: 1.0, align: "left", fontFace: FH, bold: true, fontSize: 50, color: accent, margin: 0 });
  slide.addText(label, { x: x + 0.25, y: y + 1.5, w: w - 0.5, h: 0.85, fontFace: FB, fontSize: 14, color: MUTE, valign: "top", margin: 0 });
}
function node(slide, x, y, w, h, stage, tool, accent = ORANGE) {
  slide.addShape("roundRect", { x, y, w, h, rectRadius: 0.07, fill: { color: SURF }, line: { color: LINE, width: 1 }, shadow: sh() });
  slide.addText(stage.toUpperCase(), { x: x + 0.1, y: y + 0.14, w: w - 0.2, h: 0.3, align: "center", fontFace: FB, bold: true, fontSize: 10, color: accent, charSpacing: 1, margin: 0 });
  slide.addText(tool, { x: x + 0.1, y: y + 0.44, w: w - 0.2, h: 0.42, align: "center", valign: "middle", fontFace: FB, fontSize: 12.5, color: INK, margin: 0 });
}
const arrow = (slide, x, y) => slide.addText("→", { x, y, w: 0.34, h: 0.5, align: "center", valign: "middle", fontFace: FB, bold: true, fontSize: 20, color: ORANGE, margin: 0 });

function titleSlide(pres, big, sub, tag) {
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addShape("roundRect", { x: MX, y: 1.9, w: 0.5, h: 0.5, rectRadius: 0.1, fill: { color: ORANGE } });
  s.addText(tag.toUpperCase(), { x: MX + 0.72, y: 1.96, w: 10, h: 0.4, fontFace: FB, bold: true, fontSize: 14, color: MUTE, charSpacing: 3, valign: "middle", margin: 0 });
  s.addText(big, { x: MX, y: 2.7, w: 12, h: 1.7, fontFace: FH, bold: true, fontSize: 72, color: INK, margin: 0 });
  s.addText(sub, { x: MX, y: 4.45, w: 12, h: 0.9, fontFace: FB, fontSize: 22, color: ORANGE, margin: 0 });
  footer(s, "Cursor · Field Engineer demo · Adobe");
  return s;
}

// ============================ DECK 101 ============================
function build101() {
  const p = new pptxgen();
  p.layout = "LAYOUT_WIDE"; p.author = "Field Engineer"; p.title = "Cursor 101 — Adobe Kickoff";

  titleSlide(p, "Cursor 101", "Adobe kickoff — the 30-day trial, at board altitude.", "Field Engineer demo");

  // S1 — the board's question
  let s = p.addSlide(); chrome(s, "01"); kicker(s, "The board's question");
  headline(s, "Can you out-ship your AI rivals — before inference eats the margin?", 1.6, 40, 11.6);
  // declining "moat" — descending bars, lower-right (render-robust: plain rects + baseline)
  const bx0 = 7.7, bbottom = 6.0, bw = 0.62, bgap = 0.18, bh = [1.7, 1.42, 1.5, 1.05, 1.12, 0.66];
  bh.forEach((h, i) => s.addShape("rect", { x: bx0 + i * (bw + bgap), y: bbottom - h, w: bw, h, fill: { color: RED, transparency: 22 } }));
  s.addShape("line", { x: bx0 - 0.1, y: bbottom, w: bh.length * (bw + bgap), h: 0, line: { color: LINE, width: 1 } });
  s.addText("Sora · Midjourney · Figma · Canva", { x: 7.5, y: 6.12, w: 5.05, h: 0.3, align: "right", fontFace: FB, italic: true, fontSize: 12, color: MUTE, margin: 0 });
  s.addText("Your stock chart already tells this story.", { x: MX, y: 3.5, w: 6.2, h: 0.6, fontFace: FB, fontSize: 16, color: MUTE, margin: 0 });
  footer(s, "Cursor 101 — Adobe kickoff");
  s.addNotes("You're not valued on whether your software works — it's the best in the world. You're valued on whether you can out-ship Sora, Midjourney, Figma and Canva.");

  // S2 — velocity is the moat (why now)
  s = p.addSlide(); chrome(s, "02"); kicker(s, "Why now");
  headline(s, "Velocity is the moat — and the margin defense.", 1.55, 38);
  stat(s, MX, 3.45, 3.7, "−50%", "off the 52-week high — the market has priced in the AI threat", ORANGE);
  stat(s, MX + 4.05, 3.45, 3.7, "$1B", "Figma break-fee paid, deal dead — organic throughput is the only lever left", INDIGO);
  stat(s, MX + 8.1, 3.45, 3.7, "$5B+", "AI-influenced ARR — the growth story rides on shipping AI features first", TEAL);
  footer(s, "Cursor 101 — Adobe kickoff  ·  re-verify the live quote day-of");
  s.addNotes("After Figma, organic engineering throughput is the only lever left. Velocity is the moat AND the margin defense.");

  // S3 — one system, 200 teams (hub & spoke)
  s = p.addSlide(); chrome(s, "03"); kicker(s, "Scale");
  headline(s, "One platform team. 200+ product surfaces.", 1.55, 38);
  const cx = 6.65, cy = 4.9, rx = 4.2, ry = 1.35;
  const spokes = ["Creative Cloud", "Document Cloud", "Experience Cloud", "Express", "Firefly", "Acrobat", "", ""];
  const pos = spokes.map((_, i) => { const a = (Math.PI * 2 * i) / spokes.length - Math.PI / 2; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });
  // faint ring connecting the surfaces to the hub (render-robust: one ellipse outline, drawn behind)
  s.addShape("oval", { x: cx - rx, y: cy - ry, w: rx * 2, h: ry * 2, fill: { type: "none" }, line: { color: LINE, width: 1 } });
  spokes.forEach((label, i) => {
    const [x, y] = pos[i];
    if (label) { s.addShape("roundRect", { x: x - 0.95, y: y - 0.27, w: 1.9, h: 0.54, rectRadius: 0.27, fill: { color: SURF2 }, line: { color: INDIGO, width: 1 } });
      s.addText(label, { x: x - 0.95, y: y - 0.27, w: 1.9, h: 0.54, align: "center", valign: "middle", fontFace: FB, fontSize: 11.5, color: INK, margin: 0 }); }
    else s.addShape("oval", { x: x - 0.1, y: y - 0.1, w: 0.2, h: 0.2, fill: { color: MUTE } });
  });
  s.addShape("oval", { x: cx - 1.15, y: cy - 0.72, w: 2.3, h: 1.44, fill: { color: ORANGE }, shadow: sh() });
  s.addText([{ text: "Pigment", options: { breakLine: true, fontSize: 18, bold: true } }, { text: "one design system", options: { fontSize: 11 } }],
    { x: cx - 1.15, y: cy - 0.72, w: 2.3, h: 1.44, align: "center", valign: "middle", fontFace: FH, color: "1A1208", margin: 0 });
  footer(s, "Cursor 101 — Adobe kickoff  ·  this is Spectrum; this is AEM");
  s.addNotes("Keeping 200-plus surfaces consistent, on-brand and accessible at this scale is the hidden tax. Watch it break — and watch Cursor hold the line.");

  // S4 — governed, not ungoverned (chips)
  s = p.addSlide(); chrome(s, "04"); kicker(s, "Governance");
  headline(s, "Replace ungoverned shadow-AI with one governed surface.", 1.55, 34);
  const ctrls = ["Privacy Mode", "Zero data retention", "Embeddings-only indexing", "Per-commit AI Code Tracking", "Model / MCP / repo allow-lists", "Self-hosted agents in-VPC"];
  const cw = 3.6, cg = (11.8 - 3 * cw) / 2;
  ctrls.forEach((t, i) => chip(s, MX + (i % 3) * (cw + cg), 3.45 + Math.floor(i / 3) * 1.05, cw, t, INDIGO));
  s.addText("The provenance discipline Firefly already gives your customers — now for your engineers.", { x: MX, y: 5.85, w: 11.8, h: 0.4, fontFace: FB, italic: true, fontSize: 14, color: MUTE, margin: 0 });
  footer(s, "Cursor 101 — Adobe kickoff");
  s.addNotes("The real decision isn't 'add a tool.' It's replacing uncontrolled shadow-AI with one governed surface — the provenance discipline Firefly already gives your customers.");

  // S5 — the 30-day ask (chips + close)
  s = p.addSlide(); chrome(s, "05"); kicker(s, "The 30-day ask");
  headline(s, "An India-seated pilot, scored on your metrics.", 1.55, 38);
  const asks = ["India R&D seated", "20–30 engineers", "Non-sensitive repo", "Baselined on your DORA"];
  const aw = 2.78, ag = (11.8 - 4 * aw) / 3;
  asks.forEach((t, i) => chip(s, MX + i * (aw + ag), 3.6, aw, t, ORANGE));
  s.addText("Then expand on the evidence — not on faith.", { x: MX, y: 4.85, w: 11.8, h: 0.7, fontFace: FH, bold: true, fontSize: 22, color: INK, margin: 0 });
  footer(s, "Cursor 101 — Adobe kickoff");
  s.addNotes("Score it on the two or three metrics your board judges new leadership on. Then expand on the evidence, not on faith.");

  return p.writeFile({ fileName: "cursor-101-adobe-kickoff.pptx" });
}

// ============================ DECK 201 ============================
function build201() {
  const p = new pptxgen();
  p.layout = "LAYOUT_WIDE"; p.author = "Field Engineer"; p.title = "Cursor 201 — Deep Dive";

  titleSlide(p, "Cursor 201", "The deep dive — the SDLC as a loop, not a line.", "Field Engineer demo");

  // S1 — the loop, not a line
  let s = p.addSlide(); chrome(s, "01"); kicker(s, "The SDLC, re-imagined");
  headline(s, "A loop, not a line.", 1.55, 40);
  const stages = [["Plan", "Jira"], ["Code", "Cursor"], ["Review", "Bugbot"], ["CI", "cursor-agent"], ["Deploy", "Vercel"], ["Observe", "Sentry"]];
  const nw = 1.72, ng = (11.8 - 6 * nw) / 5, ny = 3.55, nh = 1.0;
  stages.forEach(([st, tl], i) => { const x = MX + i * (nw + ng); node(s, x, ny, nw, nh, st, tl); if (i < 5) arrow(s, x + nw + (ng - 0.34) / 2, ny + nh / 2 - 0.25); });
  s.addText("↺   a production signal files the next Jira ticket — back to Plan", { x: MX, y: 5.1, w: 11.8, h: 0.5, align: "center", fontFace: FB, bold: true, fontSize: 15, color: ORANGE, margin: 0 });
  s.addText("Cursor is the agent at every stage; a human owns every gate.", { x: MX, y: 5.7, w: 11.8, h: 0.4, align: "center", fontFace: FB, italic: true, fontSize: 13, color: MUTE, margin: 0 });
  footer(s, "Cursor 201 — deep dive");
  s.addNotes("Work enters as a ticket and never leaves the loop. Cursor is the agent at every stage; a human owns every gate.");

  // S2 — three primitives
  s = p.addSlide(); chrome(s, "02"); kicker(s, "The mechanism");
  headline(s, "Three primitives carry the whole loop.", 1.55, 38);
  const prim = [["Rules", "durable memory", ["Conventions in .cursor/rules — auto-attached on the files they govern."], INDIGO],
    ["Command / Skill", "a saved senior workflow", ["The exact multi-step path a senior would take — one trigger, or auto-reached."], ORANGE],
    ["MCP", "live grounding", ["Jira, Supabase, Sentry — the agent reads your systems, not its guesses."], TEAL]];
  const pw = 3.7, pg = (11.8 - 3 * pw) / 2;
  prim.forEach(([t, sub, lines, ac], i) => card(s, MX + i * (pw + pg), 3.4, pw, 2.7, { tag: sub, title: t, lines, accent: ac }));
  footer(s, "Cursor 201 — deep dive");
  s.addNotes("Compose these three and a junior ships like your best engineer — on-spec, every time.");

  // S3 — two gates, one standard
  s = p.addSlide(); chrome(s, "03"); kicker(s, "Enforcement");
  headline(s, "Two gates. One standard.", 1.55, 40);
  card(s, MX, 3.4, 5.5, 2.4, { tag: "On the PR — Bugbot", title: "The off-brand button, caught", lines: ["A hardcoded bg-pink-500 in campaign-card.tsx — flagged against .cursor/rules before it ships."], accent: ORANGE });
  card(s, MX + 6.3, 3.4, 5.5, 2.4, { tag: "In CI — cursor-agent", title: "The red a11y build, fixed", lines: ["The 'In review' chip fails WCAG AA in dark mode — the headless agent restores the token and reopens green."], accent: INDIGO });
  s.addText("One standard, enforced in three places:  the hook in the editor  ·  Bugbot on the PR  ·  the agent in CI.", { x: MX, y: 6.05, w: 11.8, h: 0.4, align: "center", fontFace: FB, bold: true, fontSize: 14, color: MUTE, margin: 0 });
  footer(s, "Cursor 201 — deep dive");
  s.addNotes("The platform team's standard, enforced in three places — the hook in the editor, Bugbot on the PR, the agent in CI.");

  // S4 — observe closes the loop
  s = p.addSlide(); chrome(s, "04"); kicker(s, "Observe");
  headline(s, "A production signal becomes the next spec.", 1.55, 38);
  const fl = [["Sentry", "prod error + Seer"], ["Cursor", "MCP pulls it in → fix"], ["Jira", "files the next ticket"]];
  const fw = 3.3, fg = 1.0, fy = 3.55, fx0 = (W - (3 * fw + 2 * fg)) / 2;
  fl.forEach(([st, tl], i) => { const x = fx0 + i * (fw + fg); node(s, x, fy, fw, 1.05, st, tl, ORANGE); if (i < 2) arrow(s, x + fw + (fg - 0.34) / 2, fy + 0.28); });
  s.addText("Datadog — the same pattern at backend-SLO scale.", { x: MX, y: 5.15, w: 11.8, h: 0.5, align: "center", fontFace: FB, italic: true, fontSize: 15, color: MUTE, margin: 0 });
  footer(s, "Cursor 201 — deep dive  ·  Sentry leads observe; Datadog is the complement");
  s.addNotes("A production signal becomes the next spec. Sentry leads on the front end; Datadog is the same pattern at backend scale.");

  // S5 — governed at scale
  s = p.addSlide(); chrome(s, "05"); kicker(s, "At scale");
  headline(s, "Governance centralized. Velocity distributed.", 1.55, 36);
  card(s, MX, 3.45, 4.6, 1.95, { title: "The platform team owns it once", lines: ["Rules · Bugbot config · hooks · the CI agent — authored a single time."], accent: ORANGE });
  arrow(s, MX + 4.85, 4.25);
  card(s, MX + 5.6, 3.45, 6.2, 1.95, { title: "200 product teams inherit it", lines: ["Every surface gets the same standard, by default."], accent: INDIGO });
  ["SSO / SCIM", "Allow-lists", "Audit log", "Privacy Mode"].forEach((t, i) => chip(s, MX + 5.6 + i * 1.5, 5.7, 1.4, t, INDIGO));
  footer(s, "Cursor 201 — deep dive");
  s.addNotes("Governance centralized, velocity distributed. Baseline on your DORA dashboard, expand on evidence.");

  return p.writeFile({ fileName: "cursor-201-deep-dive.pptx" });
}

Promise.all([build101(), build201()]).then(() => console.log("decks written")).catch((e) => { console.error(e); process.exit(1); });
