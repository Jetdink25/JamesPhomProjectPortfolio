# 📁 Personal Portfolio — GitHub Pages

A clean, data-driven portfolio site with **About**, **Projects**, and **Research** pages.
Built with pure HTML, CSS, and vanilla JavaScript. No frameworks, no build step.

---

## ✅ Step-by-Step: How This Was Built & How to Deploy

### Step 1 — Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in.
2. Click the **+** icon in the top-right corner → **New repository**.
3. Name it exactly: `your-username.github.io`
   - Replace `your-username` with your actual GitHub username (e.g. `jdoe.github.io`).
   - This special name is what activates GitHub Pages automatically.
4. Set it to **Public**.
5. Leave everything else at defaults and click **Create repository**.

---

### Step 2 — Upload the Portfolio Files

**Option A — via GitHub web UI (easiest):**
1. Open the repository you just created.
2. Click **Add file → Upload files**.
3. Drag in all the portfolio files, keeping the folder structure:
   ```
   index.html
   projects.html
   project.html
   research.html
   research-item.html
   css/
     style.css
   js/
     nav.js
     projects.js
     project-detail.js
     research.js
     research-detail.js
   data/
     projects.json
     research.json
   assets/
     (your photo goes here — see Step 4)
   ```
4. Scroll down and click **Commit changes**.

**Option B — via Git (recommended if you know Git):**
```bash
git clone https://github.com/your-username/your-username.github.io.git
# Copy all portfolio files into the cloned folder
git add .
git commit -m "Initial portfolio commit"
git push origin main
```

---

### Step 3 — Enable GitHub Pages

1. In your repository, click **Settings** (top menu bar).
2. In the left sidebar, click **Pages**.
3. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**.
5. Wait 1–2 minutes, then visit: `https://your-username.github.io`

Your portfolio is now live! 🎉

---

### Step 4 — Add Your Profile Photo

1. Prepare your photo:
   - Recommended size: at least **400 × 400 px**, square crop
   - Supported formats: `.jpg`, `.png`, or `.webp`
2. Rename your photo file to `profile.jpg` (or `.png` / `.webp`).
3. Place it in the `assets/` folder.
4. If you used `.png` or `.webp`, update the `src` attribute in `index.html`:
   ```html
   <!-- Find this line in index.html and update the src -->
   <img src="assets/profile.png" ...>
   ```
5. Commit and push (or re-upload) the file.

---

### Step 5 — Customize Your Personal Info

Open `index.html` and update every section marked with a comment like `<!-- EDIT: ... -->`:

| What to change | Where to find it |
|---|---|
| Your initials (logo) | `<a href="index.html" class="logo">YN</a>` |
| Your name in the hero | `<span class="name-underline">Your Name</span>` |
| Your role / title | `<p class="hero-role">Student · Your University</p>` |
| Your bio paragraphs | Inside `<div class="about-content">` |
| Location, institution, field | Inside `<ul class="info-list">` |
| Your email | `<a href="mailto:you@example.com">` |
| Social media links | Inside `<ul class="social-list">` |
| Footer copyright name | `<p>&copy; ... Your Name ...` |

> **Tip:** Search the file for `EDIT` (Ctrl+F) to jump to every placeholder.

Also update the same logo and footer in `projects.html`, `project.html`, `research.html`, and `research-item.html`.

---

### Step 6 — Add Your Projects

Open `data/projects.json`. Each project is one JSON object in the array.

**To add a new project:**
1. Copy an existing object (everything from `{` to `}`).
2. Paste it after a comma at the end of the array.
3. Fill in your details.

**Project fields explained:**

```json
{
  "id": "my-cool-project",
  // ↑ Unique slug (lowercase, hyphens only). Used in the URL: ?id=my-cool-project

  "title": "My Cool Project",
  // ↑ Displayed as the card heading and the detail page title

  "subtitle": "A one-line tagline",
  // ↑ Short description shown in blue below the title (optional)

  "tags": ["Python", "Machine Learning"],
  // ↑ Array of technology/topic labels shown as pills

  "date": "Spring 2024",
  // ↑ When you did this (any string — "2024", "Jan–Mar 2024", etc.)

  "status": "Completed",
  // ↑ "Completed", "In Progress", etc. — shown in sidebar on detail page

  "summary": "2–3 sentences shown on the Projects listing page.",
  // ↑ Short teaser — keep under 60 words

  "description": "Full text shown on the detail page.\n\nSeparate paragraphs with a blank line (\\n\\n).",
  // ↑ As long as you want. Use \\n\\n for paragraph breaks.

  "highlights": [
    "Key result or accomplishment",
    "Technology or methodology used",
    "Impact or outcome"
  ],
  // ↑ Shown in a highlighted block on the detail page. 3 is ideal, can be more.

  "links": [
    { "label": "GitHub Repository", "url": "https://github.com/..." },
    { "label": "Live Demo",         "url": "https://..." }
  ]
  // ↑ Buttons shown at the bottom of the detail page. First one is blue (primary).
}
```

---

### Step 7 — Add Your Research

Open `data/research.json`. The format is the same as `projects.json` with a few extra optional fields:

```json
{
  "id": "my-research-topic",
  "title": "Research Paper / Study Title",
  "subtitle": "Conference · Journal · or Advisor",
  "tags": ["Topic", "Method"],
  "date": "Fall 2023",
  "status": "Published",
  "venue": "Journal of XYZ",        // ← name of publication or venue
  "advisor": "Prof. Jane Smith",    // ← research advisor
  "summary": "Short summary for the listing page.",
  "description": "Full description.\n\nUse \\n\\n for paragraphs.",
  "highlights": [
    "Primary finding",
    "Methodology",
    "Impact / citation / award"
  ],
  "links": [
    { "label": "Read Paper",    "url": "https://..." },
    { "label": "GitHub / Data", "url": "https://..." }
  ]
}
```

---

### Step 8 — Push Updates and See Changes

After editing any file, commit and push (or re-upload to GitHub):

```bash
git add .
git commit -m "Add new project / update bio"
git push origin main
```

GitHub Pages redeploys automatically. Changes are live within **~60 seconds**.

---

## 🗂 File Structure Explained

```
your-username.github.io/
│
├── index.html          ← About Me page (edit bio, photo, links here)
├── projects.html       ← Projects listing (automatically rendered from JSON)
├── project.html        ← Individual project detail (shared template)
├── research.html       ← Research listing (automatically rendered from JSON)
├── research-item.html  ← Individual research detail (shared template)
│
├── css/
│   └── style.css       ← All visual styling — colors, fonts, layout
│
├── js/
│   ├── nav.js              ← Navigation (hamburger menu, active state)
│   ├── projects.js         ← Reads projects.json, renders listing cards
│   ├── project-detail.js   ← Reads projects.json, renders single project
│   ├── research.js         ← Reads research.json, renders listing cards
│   └── research-detail.js  ← Reads research.json, renders single research
│
├── data/
│   ├── projects.json   ← ✏️  ADD / EDIT PROJECTS HERE
│   └── research.json   ← ✏️  ADD / EDIT RESEARCH HERE
│
└── assets/
    └── profile.jpg     ← ✏️  ADD YOUR PHOTO HERE
```

---

## 🛠 Previewing Locally

Opening `index.html` directly in a browser **will not** load your projects or research
(browsers block `fetch()` requests from `file://` URLs). You need a local server:

**Option 1 — Node.js:**
```bash
npx serve .
# Then open http://localhost:3000
```

**Option 2 — Python:**
```bash
python3 -m http.server 8000
# Then open http://localhost:8000
```

**Option 3 — VS Code:**
Install the **Live Server** extension, right-click `index.html`, and select **Open with Live Server**.

---

## 🎨 Customizing the Design

All colors, fonts, and spacing are CSS variables at the top of `css/style.css`:

```css
:root {
  --color-blue:  #2563EB;  /* Accent color — change to match your brand */
  --color-navy:  #0F172A;  /* Header/hero background */
  --font-display: 'Playfair Display', ...;  /* Heading font */
  --font-body:    'Inter', ...;             /* Body text font */
}
```

Changing `--color-blue` to a different hex code will update all links, highlights,
and buttons at once.

---

## ❓ Troubleshooting

| Problem | Fix |
|---|---|
| Projects / Research not loading | Run a local server (see above) or deploy to GitHub Pages first |
| Photo not showing | Ensure the file is named `profile.jpg` and is inside the `assets/` folder |
| Changes not appearing live | Wait 1–2 minutes; GitHub Pages deployment takes a moment |
| 404 on the live site | Make sure the repo name is exactly `your-username.github.io` |
| JSON parse error in console | Validate your JSON at [jsonlint.com](https://jsonlint.com) — check for missing commas |
