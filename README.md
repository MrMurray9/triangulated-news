# Jaryd's News

Phone-friendly daily news digest. Stories are confirmed by multiple independent outlets, each with a **Community Note** and, where available, a verified YouTube news clip. A final **Viral on social** section checks Canada and global claims circulating on social platforms. The homepage also carries a compact **Markets** ticker row (BTC, TSLA, SPCX), **Next Oilers game**, and Edmonton’s daily high.

**Update schedule:** two editions a day at **6:01 a.m.** (ready by 7 a.m.) and **4:01 p.m.**, Edmonton time, every day. Nothing is posted in chat unless a run fails. Previous editions are kept in `archive/` (e.g. `2026-10-07-evening.html`).

Source links on each article sit behind a small hamburger button (tap to expand).

## Read the site

- **Latest digest:** [https://mrmurray9.github.io/triangulated-news/](https://mrmurray9.github.io/triangulated-news/)
- **Today’s archive:** [https://mrmurray9.github.io/triangulated-news/archive/2026-10-12.html](https://mrmurray9.github.io/triangulated-news/archive/2026-10-12.html)

## Subscribe via RSS

Feed URL: [https://mrmurray9.github.io/triangulated-news/feed.xml](https://mrmurray9.github.io/triangulated-news/feed.xml)

Add that URL in any RSS reader (Feedly, NetNewsWire, FreshRSS, etc.).

## Source

Maintained by Jaryd Murray ([@MrMurray9](https://github.com/MrMurray9)). Static HTML on GitHub Pages — no build step. Canadian English (en-CA).

## Morning routine notes

**Video headline badges:** If a story body includes a `.video-embed` block (YouTube `youtube-nocookie` iframe), `script.js` automatically adds a small screen/play icon in the collapsed headline. No per-story badge markup is required — keep publishing embeds as usual.


## Joke and quote of the day — no repeats (required every run)

Before choosing the joke and quote of the day, read `used-jokes-quotes.json`; never reuse any joke or quote (or near-duplicate) listed there; after publishing, append the new joke and quote to the ledger and commit it with the edition.

- **Near-duplicate** means the same joke/quote reworded, trimmed, or re-punctuated, or the same premise/punchline (e.g. any "outstanding in his field" scarecrow joke). Compare against each entry's `normalized` text and any `variants` (normalize: lowercase, drop quote marks, punctuation → space, collapse spaces, drop a leading "and/but/so"); treat a `difflib` ratio ≥ 0.85 or one text containing the other as a repeat.
- New ledger entries: jokes `{text, normalized, first_used, editions}`; quotes `{text, attribution, normalized, first_used, editions}`. `first_used` is the edition date (YYYY-MM-DD); `editions` lists edition ids (e.g. `2026-10-11-morning`).
- Quotes must be real and accurately attributed (author, work, and translator for translated texts), verified against a reliable source — not BBC, CNN, CBC or Radio-Canada. Jokes must be clean and family-friendly.

## Page layout — required every run (6:01 a.m. and 4:01 p.m.)

- **Edmonton** (`section#yeg-events`, blue collapsible region title) sits right after the joke/quote cards (there is no top meta bar). Refresh it every run: about 5–10 compact items covering fun things in Edmonton today plus the next 1–2 weeks (music — concerts at Rogers Place, Winspear/ESO, Jubilee, Midway, Starlite Room, Pawn Shop Live/Union Hall, folk and jazz series — plus festivals, community, family, arts, markets and attraction special events). **No sporting events** in this section; the Next Oilers game stays in its own section after Markets. Confirm each music item on the official venue or ticket page. Each item needs date, time (Edmonton time), venue and a link to the official/event page. Only real events verified against official or reputable sources (Explore Edmonton, venue/team sites, City of Edmonton, ticketing pages, local outlets — never BBC, CNN, CBC or Radio-Canada). Never invent events; drop past ones; note holiday closures when relevant.
- **Archive** is a slim `<details class="archive-bar">` ("📚 Archive ▸"), collapsed by default, placed at the very bottom just above the footer, newest edition first. No "Latest" badge and no top meta bar. The archive `<details>` and a small `a.rss-link` ("📡 RSS") sit together in one `div.bottom-bar` row above the footer, on index and archive pages alike (archive pages link `../feed.xml`).
- **Archive pages** copy this same layout. Because they live in `archive/`, all shared assets must use `../`: `../styles.css`, `../script.js`, `../feed.xml`; links to other editions are siblings (`2026-10-11.html`), and the home page is `../`.
- Cache-bust `styles.css`/`script.js` with a new `?v=` on each edition.
- **No Top story banner.** Do not add a "Top story:" line above the sections; the lead story simply runs in its normal section.
- **Viral on social is split by platform:** `h3.viral-platform` sub-heads in the order **X**, **Facebook**, **Other** (TikTok, Instagram, YouTube, Reddit, etc.). Place each item under the platform where its sources say it mainly went viral; omit any sub-head with no verified items (no padding). Existing rules still apply: mostly confirmed-true items with video, few debunks, each with a Community Note.
- **Platform targets and badges:** each edition aims for **2 X items and 2 Facebook items** in Viral on social (verified only, never padded), plus Other as available. Every viral headline starts with a small square badge `span.pf-badge` — `pf-x` **X** (black), `pf-f` **F** (Facebook blue), `pf-o` **O** (grey) — and each body has a `p.seen-on` "Seen on: …" line citing where an outlet/fact-checker says it spread, linking the original post when it can be verified.
- **Viral on social tone:** prioritize funny, beautiful or uplifting TRUE stories (feel-good, wholesome, funny animals, stunning nature/sky, kind gestures) that mainstream outlets report went viral on that platform (that coverage counts as platform evidence; light items may rest on 2 independent reputable outlets if the Community Note says so). Debunks are rare: **max 1** per edition, only for a major story. If nothing qualifies for a platform, show fewer items instead of filling with debunks.

## Section order and Teen (required every run)

**Order:** Edmonton → Alberta → Canada → World → Business → Science corner → AI → **Viral on social** → **Teen** → Markets → Next Oilers game → collapsed Archive bar → footer.

**Teen** (`section#teen`, blue collapsible): 4–6 short, school-appropriate items on what teens are into right now: slang (meaning plus an example), trending apps, games, music and artists, memes, fashion and products, TikTok trends. Each item needs a verified, current source behind the burger menu (reputable media, Pew, Piper Sandler, Know Your Meme, Dictionary.com, Merriam-Webster, Spotify or Billboard charts; never BBC, CNN, CBC or Radio-Canada) and a note of its date or recency. Never invent slang or trends. Check `used-teen-items.json` first, and don't repeat an item unless it's still notably current; append new items after publishing.

## Fresh stories every edition (required every run, added Oct 18, 2026)
Jaryd wants every story updated each edition. Before choosing stories, read the headlines and topics in the current index.html (the previous edition) and the archive page of the edition before it. In every news section (Alberta, Canada, World, Business, Science corner, AI, Viral on social, Teen), no story may cover the same event or topic as either of those two editions. Replace them with different stories that meet the sourcing rules.
- The exception is a returning story that has a real, verified update since the last edition, for example a confirmed death toll or a vote result. There's no limit on how many, but each one needs a new headline that leads with the update and a body rewritten around What changed. Don't carry over the old text. A story with no real update must be dropped.
- Edmonton events can repeat only if the event is still running, and each edition must add at least half new events.
- If a section can't be filled with fresh stories, leave it short rather than repeating one.
- Before pushing, check headline by headline against the previous two editions and list any overlap in the run report.

## Freshness gate and rotation rules (required every run, added Oct 19, 2026)

- **Run the checker before every push.** Run `python3 /workspace/news-review/freshness_check.py --repo /workspace/triangulated-news [candidate.html]` on the finished build. It exits 1 on failure: fix the build and rerun until it passes. Never push a failing build, and keep its output for the run report.
- **Never publish a stale build.** A build more than 90 minutes old must not be published. Rebuild it, or skip the slot if the next scheduled run is close.
- **Returning stories go below new ones.** Within each section, new stories come first. A returning story (a real, verified update, with a new headline leading with the update and a "What changed since the last edition" paragraph) sits below every new story in that section.
- **No lead topic more than 2 editions in a row.** The same topic may not lead a section for more than two consecutive editions. Pick a different lead even if the topic is still running.
- **Keep the topic ledger and compare the last 4 editions.** `used-stories.json` records date, edition, section, topic and headline for every story. Check candidates against the last 4 editions in it (not just the last one), and append this edition's entries in the same commit. Recurring topics (for example Wainwright, Anthropic, France, Ukraine) run only with a genuine update, marked as returning.
- **Edmonton events: half new by name, honest "New" labels.** At least half the listed events must be different events, by name, from the previous edition. Label an event "New" only if it appeared in neither of the two previous editions, and state the real new count in the section footer.
- **Rotate the Markets and Science wording.** Write the Markets note and the Science corner text fresh each edition. Never lightly edit the previous edition's paragraph, which the checker flags as near-identical.
