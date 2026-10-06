# Translating the website into Wolaytta

This guide is for whoever translates the Bushaashe Garuwa website into Wolaytta
(Wolayttatto doonaa) by hand. You do not need to know how the website is built.
You only type Wolaytta text into prepared files.

## How it works

- The website has about **880 lines of text**, split into **15 files, one per page**.
- Each file shows the English line, and under it an empty place for the Wolaytta.
- A line you have not translated yet simply shows in English on the site. Nothing breaks.
- Visitors do not see Wolaytta until you publish it. Until then, choosing **WOL** on
  the site shows a "coming soon" notice. You can preview your work on your own computer.

## Where the files are

```
frontend/src/i18n/dictionaries/wol/
```

| Order | File | What it holds | See it at | Lines |
|---|---|---|---|---|
| 1 | `shared.ts` | Header menu, footer, buttons, notices (on every page) | any page | 107 |
| 2 | `home.ts` | Home page | `/` | 203 |
| 3 | `about.ts` | About page | `/about` | 76 |
| 4 | `discover.ts` | Discover page | `/discover` | 24 |
| 5 | `heritage.ts` | Heritage page | `/heritage` | 39 |
| 6 | `experiences.ts` | Experiences page | `/experiences` | 67 |
| 7 | `events.ts` | Events page | `/events` | 61 |
| 8 | `vip.ts` | VIP Service page | `/vip` | 23 |
| 8 | `stay.ts` | Guest House page (coming soon) | `/stay` | 60 |
| 9 | `dine.ts` | Dine page | `/dine` | 49 |
| 10 | `visit.ts` | Plan Your Visit page | `/visit` | 38 |
| 11 | `contact.ts` | Contact page | `/contact` | 18 |
| 12 | `gallery.ts` | Gallery page | `/gallery` | 12 |
| 13 | `photos.ts` | Photo descriptions and captions | `/gallery` | 39 |
| 14 | `immersive.ts` | 3D pages still under review. **Translate last.** | `/preview` | 44 |

Work in this order. `shared.ts` comes first because its words (menu, buttons)
appear on every page, so it gives the biggest result for the least work.

Do **not** edit `frontend/src/i18n/dictionaries/wol.ts`. It only joins those files together.

## How to translate a line

Open a file in VS Code. You will see pairs like this:

```ts
    // EN: Plan Your Visit
    planVisit: "",
```

Type the Wolaytta **between the two quotation marks**:

```ts
    // EN: Plan Your Visit
    planVisit: "your Wolaytta text here",
```

That is all. Save the file and move to the next pair.

## The rules

1. **Change only what is between the quotation marks.**
   Leave the word before the colon (`planVisit:`), the quotation marks and the comma at the end exactly as they are.

2. **Do not edit the `// EN:` lines.** They are there for you to read. The computer rewrites them from the English text.

3. **Keep words in curly brackets exactly as written.** The website replaces them with a number or a name.

   ```ts
       // EN: {count} items
       itemCount: "{count} ...",
   ```

   You may move `{count}` to wherever it belongs in a Wolaytta sentence, but do not translate it, remove it or change its spelling.

4. **Apostrophes are fine.** Type `'` freely, as Wolaytta spelling needs: `"d'e"` works.

5. **A double quotation mark inside the text needs a backslash before it.** Write `\"` instead of `"`:

   ```ts
       desc: "He said \"welcome\" to us",
   ```

6. **Keep each text on one line.** Do not press Enter in the middle of a text, however long it is. (In VS Code, View → Word Wrap makes long lines easier to read.)

7. **Names stay as they are.** Type them again unchanged so the line counts as done:
   `Bushaashe Garuwa`, `Meeshsho Keettaa`, `Gulanttaa Keettaa`, `Gifaataa`, `WhatsApp`, `Telegram`, people's names, phone numbers, email addresses.

8. **Leave a line empty (`""`) if you are not sure.** It shows in English and is counted as "not done", so you can find it again later.

9. **Lines in square brackets** such as `[HOTSPOT TEXT NEEDED: the roof]` are notes to the site owner, not text for visitors. Leave them empty.

## Translating well

- **Translate the meaning, not word for word.** Read the whole English line, then write what a Wolaytta speaker would naturally say.
- **Keep it about the same length**, especially for buttons and menu words. A button that says "Book Now" has room for two or three short words, not a sentence.
- **Use one word for one thing everywhere.** Decide once how you say "heritage", "visit", "book", "guesthouse" and so on, write it in the word list below, and use the same word on every page.
- **Do not add or change facts.** History, names, dates and cultural meanings must say exactly what the English says. If you think the English is wrong, tell the site owner instead of correcting it in the translation.
- **Use the spelling you would teach in school** (the Latin-based Wolaytta alphabet), and be consistent with double letters and apostrophes.
- **Look at the page while you translate.** A word like "Stay" can be a noun (the guesthouse) or a verb. The page shows which.

### Word list (fill this in as you go)

Decide these once and keep them the same everywhere.

| English | Wolaytta |
|---|---|
| Heritage | |
| Culture | |
| Visit / visitor | |
| Book / reserve | |
| Guesthouse / stay | |
| Restaurant / dine | |
| Events | |
| Experiences | |
| Gallery | |
| Contact | |
| Home (menu) | |
| About | |
| Learn more | |
| Explore | |
| Traditional house | |
| Forefathers | |
| Generation | |

## Checking your work

Open a terminal in the project folder and run:

```bash
pnpm wolaytta
```

It prints how far each page is and lists anything that needs fixing:

```
Wolaytta translation

  ✓ wol/shared.ts        ██████████ 107 of 107  On every page: header menu, footer, buttons, notices
    wol/home.ts          ████······  81 of 203  Home page
    wol/about.ts         ··········   0 of 76   About page
    ...

  188 of 835 lines translated (23%).
```

Run it whenever you finish a sitting. It catches the usual mistakes:

| Message | What happened | Fix |
|---|---|---|
| `cannot be read. There is a typing mistake in it` | A quotation mark or comma was deleted, or a `"` was typed inside a text | Go to that file, find the line you last changed, restore the `"` and the `,` (or write `\"`) |
| `must keep {count} exactly as in the English` | A curly-bracket word was removed or changed | Put it back exactly as in the `// EN:` line |
| `this line is not in the English text` | A word before a colon was changed by accident | Undo that change |
| `The English text has changed since the files were made` | New text was added to the site | Run `pnpm wolaytta:sync` (see below) |

## Seeing it on the site

1. In the project folder, start the site on your computer:

   ```bash
   pnpm dev
   ```

2. Open `http://localhost:8443` in your browser.
3. Choose **WOL** in the language menu at the top.
4. In the notice that opens, click **Preview the Wolaytta draft (development only)**.

The site is now in Wolaytta. Translated lines show your text; the rest show English.
When you save a file, the page updates by itself. Check every page on a phone-sized
window too (press F12, then the phone icon), because long words can overflow buttons.

Things to look for on each page:

- Does the text fit inside buttons and menu items, on a phone and on a computer?
- Does any heading break in an ugly place or run off the screen?
- Is the same thing called by the same word as on other pages?

## When the English text changes

Sometimes new text is added to the website or an English line is reworded. Then run:

```bash
pnpm wolaytta:sync
```

This rewrites the files from the current English text. **Everything you have
already translated is kept.** New lines appear as empty `""` for you to fill in, and
removed lines disappear. Afterwards, run `pnpm wolaytta` to see what is new.

If an English line was reworded, its `// EN:` comment changes but your Wolaytta stays
as it was. After a sync, look through the changes (in VS Code: the Source Control
panel) and update any Wolaytta line whose English changed.

## Saving your work

Save to GitHub after each sitting, so nothing is lost:

```bash
pnpm wolaytta
```

```bash
git add frontend/src/i18n/dictionaries/wol
```

```bash
git commit -m "Wolaytta translation: home page"
```

```bash
git push
```

This is safe to do at any time. A half-finished translation does not show to
visitors, because Wolaytta is not published yet.

## Publishing

When `pnpm wolaytta` shows every page complete (the 3D file `immersive.ts` may wait):

1. Read every page once more in the preview, on a phone-sized window and a computer.
2. Ask a second Wolaytta speaker to read it. A fresh reader finds what the translator no longer sees.
3. Open `frontend/src/i18n/config.ts` and change

   ```ts
   export const WOLAYTTA_READY = false;
   ```

   to

   ```ts
   export const WOLAYTTA_READY = true;
   ```

4. Save, commit and push. Once the site has redeployed, visitors who choose **WOL** see the site in Wolaytta.

You may publish before everything is translated: untranslated lines show in English.
But a page that is half Wolaytta and half English looks unfinished, so finish at
least `shared.ts` and the main pages first.

## Text the staff edit in the admin area

Staff can change some texts from the admin area (Content). Those edits are stored
per language. An edit made there for Wolaytta takes the place of the line in these
files, so if a line on the site does not match what you typed here, check the admin
area's Content page for that language.

## Quick reference

| I want to… | Do this |
|---|---|
| Translate | Open a file in `frontend/src/i18n/dictionaries/wol/`, type between the `""` |
| See progress and mistakes | `pnpm wolaytta` |
| See it on the site | `pnpm dev`, choose WOL, click "Preview the Wolaytta draft" |
| Pick up new English text | `pnpm wolaytta:sync` |
| Publish | Set `WOLAYTTA_READY = true` in `frontend/src/i18n/config.ts`, commit, push |
