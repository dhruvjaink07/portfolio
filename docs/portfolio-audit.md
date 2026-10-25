# Portfolio Website: Code Audit and Improvement Plan

**Date:** 24 October 2026
**Scope:** The live portfolio site: its page structure, styling, scripts and site content (`index.html`, `src/`, `data.json`)

---

## Summary

The site looks finished, but several features are broken right now and nothing warns us about it. The most serious one: **the contact form rejects every message**, so anyone who tries to get in touch through the site gets an error. Some content is also hidden, colours are wrong for most visitors, and parts of the mobile navigation are misaligned.

The causes run deeper than individual bugs. Everything is built as three very large files (about 1,700 lines of script and 3,000 lines of styling), so changing one part of the page tends to break another. Roughly 15% of the code does nothing at all, and the site downloads animation libraries it never uses.

**Recommendation:** fix the visible bugs first (about one day of work), then restructure the code in stages before adding any new visual features. Each stage can be released on its own, so the site is never offline or half-finished.

---

## 1. What visitors are affected by today

| Issue | Who it affects | Business impact |
|---|---|---|
| The contact form was never connected to its email service (a placeholder setting is still in place) | Everyone who uses the form | **Enquiries are lost.** Visitors see an error message. |
| The "Top Skills" panel is hidden by a coding error | Every visitor | The key selling points on the home page never appear |
| Chrome visitors (the large majority) see a yellow accent colour on white, and a light sidebar when they use dark mode | Most visitors | Hard-to-read text and an inconsistent brand look |
| Two of the four project filters ("Web", "Design") always show an empty page, and backend work can't be filtered at all | Anyone browsing projects | The portfolio looks thinner than it is |
| The project "code" button opens a blank tab when a project has no link | Anyone clicking it | Looks broken |
| The bottom navigation bar on phones is unevenly spaced | Mobile visitors | Looks unpolished on the device most recruiters use |
| "Copy email" in the quick-command menu gives no confirmation | Power users | Minor |
| The background animation keeps the processor busy for as long as the page is open | Laptop and phone visitors | Battery drain and slower scrolling on older phones |
| Content we have already written (statistics, achievements) is never displayed | Every visitor | Strong material goes unused |

---

## 2. Why the code is hard to maintain

**Everything is coupled together.** The page is not split into self-contained sections. Styling rules meant for one section leak into others: one rule controls the corner rounding of 11 unrelated elements, and the phone navigation is defined twice, with the two versions overriding each other. About 25 forced "override" rules exist only to fight these conflicts.

**The same content is built in several places.** Work history and education use two near-identical copies of the same template. Social links, skill groups and contact cards are each duplicated. Every copy has to be updated separately, and they drift apart over time.

**There is no single record of what the page is doing.** Which theme is active, which section the visitor is viewing, and which projects are filtered are each tracked in several places that disagree. This is why the navigation highlight sometimes points at the wrong section.

**Keyboard shortcuts interfere with each other.** Five separate pieces of code listen to the keyboard. For example, pressing Escape closes two different panels at once, and playing the hidden terminal game also scrolls the page behind it.

**Dead weight.** About 300 lines of script serve features that were removed (a search bar, some extra buttons and profile images). Two animation libraries are downloaded on every visit but never used. Removing them makes the site smaller and faster at no cost.

---

## 3. Opportunity: a more distinctive design

Today every section follows the same pattern: a heading followed by a grid of identical cards. Once the code is restructured, each section can be redesigned without adding new libraries:

- **Home:** an asymmetrical "bento" layout. A large headline introduction, a tall portrait, a live "currently working on" panel, the GitHub activity chart, and the achievement statistics we already have but don't show.
- **Projects:** lead with one or two flagship projects shown large, with short case-study pop-ups explaining the problem, the approach and the outcome, instead of plain links.
- **Skills:** a compact, magazine-style index showing how many projects use each skill. Clicking a skill jumps to the related projects.
- **Contact:** a clean two-column layout with a prominent click-to-copy email address and a minimal form.
- **Background:** replace the three competing background effects with one subtle animated "topographic map" that fits the existing mountain theme. It would pause when not visible and respect visitors' reduced-motion settings.

---

## 4. Recommended plan

Estimates are rough figures for one developer. Every phase is released and checked on phone, tablet and desktop, in both light and dark mode, before the next one starts.

| Phase | What happens | Visible result | Estimate |
|---|---|---|---|
| **1. Fix what's broken** | Connect the contact form; fix the hidden panel, the colours, the filters, the buttons and the mobile navigation | All issues in Section 1 resolved | ~1 day |
| **2. Remove dead code** | Delete unused features and the two unused libraries | Faster page load, no visual change | ~1 day |
| **3. Reorganise styling** | Split styling into one file per section; remove the duplicate and conflicting rules; align colours and fonts with our design guidelines | No visual change; design changes become safe | 2–3 days |
| **4. Reorganise scripts** | Split the script into small, independent modules with one shared record of page state and one keyboard handler | No visual change; fewer regressions later | 3–4 days |
| **5. Generate content from data** | Build every section from the content file, so text updates no longer touch code | Content updates take minutes, not code changes | 1–2 days |
| **6. Design upgrades** | Redesign one section per release: Home, Projects, Skills, Contact, then the background | The new look described in Section 3 | ~1–2 weeks |

**Decisions needed**

1. **Approve Phase 1 now.** The broken contact form costs us enquiries every day it stays unfixed.
2. **Contact form account.** Someone needs to provide (or approve creating) the Web3Forms access key that the form needs.
3. **Browser-specific colours.** Today the site changes its accent colour depending on the visitor's browser. That is the root cause of the colour problem. We recommend removing it in favour of one consistent brand colour.

---

## Appendix: technical references (for the engineer)

| Item | Location |
|---|---|
| Contact form placeholder key | `index.html:296` |
| Top Skills hidden by the endorsements logic | `src/script.js:382-418` |
| Browser themes override the dark theme | `src/styles.css:1907-1948` |
| Wrapper elements break the nav layout | `src/script.js:1175-1203` |
| Filter buttons don't match the data categories | `index.html:211-216` |
| Empty `codeUrl` opens a blank tab | `src/script.js:453` |
| Toast class mismatch | `src/script.js:1331-1333` |
| Undefined CSS variables (`--color-gray`, `--color-primary`, `--color-green`, `--color-red`, `--color-black`, `--color-purple`, …) | throughout `src/styles.css` |
| Duplicate mobile navigation rules | `src/styles.css:872-930` and `2025-2060` |
| Cursor observer re-scans the page on every change | `src/script.js:1045-1062` |
| Canvas reads styles for each particle on every frame | `src/script.js:1104`, `1127` |
| Five separate keyboard listeners | `src/script.js:838`, `1375`, `1450`, `1477`, `1675` |
| Dead search code | `src/script.js:690-829` |
| Unused Rive library (its target elements don't exist) | `src/rive-manager.js` |
| Unused Lottie script | `index.html:357` |
| Build output committed although CI rebuilds it | `dist/` |
