## 🚀 AI Resume Builder

A premium, deterministic, ATS-aware resume builder built with React + TypeScript + Vite + Tailwind CSS. It features live preview, multi-template layouts, accent color themes, structured editing with persistence, export options, inline guidance, ATS scoring, and a final Proof/Submission workflow.


## ✨ Key Features

- 🖊️ Live Builder with real-time Preview
- 🧩 Three visual templates with thumbnails: Classic, Modern (sidebar), Minimal
- 🎨 Accent Color themes (Teal, Navy, Burgundy, Forest, Charcoal), persisted
- 🧱 Structured sections: Personal, Summary, Education, Experience, Projects, Skills
- 🔖 Tag-style inputs for grouped Skills and Project Tech Stack
- 🧭 Inline guidance for Experience/Project bullets (action verb and impact hints)
- 📈 Deterministic ATS Scoring (0–100) with circular indicator and improvement suggestions
- 📤 Export options: Download PDF (print) and Copy Resume as Text
- 🖨️ Clean Print styling (white background, spacing, page-break handling)
- 💾 LocalStorage persistence for all inputs and settings
- ✅ Proof + Submission page with URL validation and shipped logic


## 🧰 Tech Stack

- ⚛️ React 18 + TypeScript
- ⚡ Vite
- 🎯 Tailwind CSS


## 🏁 Getting Started

1. 📦 Install dependencies

   npm install

2. ▶️ Run the development server

   npm run dev

3. 🌐 Open the app

   - The dev server will print the local URL (typically http://localhost:5173)


## 📟 Scripts

- ▶️ npm run dev — start Vite dev server
- 🏗️ npm run build — production build
- 🔍 npm run preview — preview production build locally


## 🗂️ Project Structure

Below is a simplified structure of the repository:

```
AI_Resume_Builder/
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig.json
├─ vercel.json
├─ vite.config.ts
├─ README.md
├─ .gitignore
├─ src/
│  ├─ index.tsx
│  ├─ index.css
│  ├─ App.tsx
│  ├─ pages/
│  │  ├─ Home.tsx            # 🏠 Landing/Home
│  │  ├─ Builder.tsx         # 🧱 Main builder with forms, tag inputs, and inline guidance
│  │  ├─ Preview.tsx         # 👀 Live preview with templates, color themes, ATS score, export
│  │  └─ Proof.tsx           # 🧾 (If used) general proof page wrapper
│  └─ projects/
│     └─ ai-resume-builder/
│        ├─ config.ts        # ⚙️ Step list and storage prefix for RB workflow
│        ├─ layout/
│        │  └─ RBLayout.tsx  # 🧭 Project layout (if used by routed pages)
│        └─ pages/
│           ├─ RBStepPage.tsx  # 🧑‍💻 Per-step content/pages
│           └─ RBProofPage.tsx # ✅ Final Proof + Submission system with URL validation
```

Note: Some routes/pages may be wired through App.tsx routing setup. The builder/preview/proof pages live under src/pages and projects/ai-resume-builder/pages as shown.


## 🧪 Core Flows

### 1) 🛠️ Resume Building
- ✍️ Enter Personal Information, Summary, Education, Experience, Projects, and Links.
- 🗂️ Skills are grouped into three categories with tag-style inputs: Technical, Soft, Tools & Technologies.
- 💡 For Experience and Projects, inline guidance encourages:
  - 🚀 Starting bullets with strong action verbs (Built, Led, Designed, Implemented, Improved, Created, Optimized, Automated)
  - 📊 Adding measurable impact/metrics (numbers, %, k/m/x)
- 💾 All data persists automatically to localStorage (key: resumeBuilderData).


### 2) 🧱 Templates and 🎨 Color Themes
- 🖼️ Choose among three templates with 120px thumbnails:
  - 📜 Classic: single-column with serif headings and rules
  - 🧭 Modern: two-column layout with a colored left sidebar for contact + skills
  - 🧼 Minimal: single-column with generous whitespace and sans-serif
- 🎯 Pick an accent color: Teal (default), Navy, Burgundy, Forest, Charcoal.
- 📌 Selections persist to localStorage: resumeTemplate and resumeAccent.


### 3) 📊 Live Preview and ATS Score
- 🔄 Preview updates as you type (the preview polls localStorage for changes every ~800ms).
- 🧮 ATS Score (0–100) is deterministic (no AI) and calculates:
  - +10 ✅ name provided
  - +10 ✅ email provided
  - +10 ✅ summary > 50 chars
  - +15 ✅ at least 1 experience entry with bullets
  - +10 ✅ at least 1 education entry
  - +10 ✅ at least 5 skills
  - +10 ✅ at least 1 project
  - +5  ✅ phone provided
  - +5  ✅ LinkedIn provided
  - +5  ✅ GitHub provided
  - +10 ✅ summary contains action verbs (Built, Developed, Designed, Implemented, Led, Improved, Created, Optimized, Automated)
- 🟠 Indicator with label:
  - �� 0–40: Needs Work
  - 🟡 41–70: Getting There
  - 🟢 71–100: Strong Resume
- 📋 Improvement suggestions list items that would increase the score.


### 4) 📤 Export Options
- 🖨️ Download PDF (via window.print()) — prints only the resume; UI/navigation hidden in print.
- 📋 Copy Resume as Text — produces a clean text version with sections:
  - Name, Contact, Summary, Education, Experience, Projects, Skills, Links


### 5) 🧾 Print Styling
- ⬜ White background only; clean margins; consistent spacing.
- 📄 Page-break hints applied to avoid splitting sections awkwardly.


### 6) 🧾 Proof + Submission (/rb/proof)
- 🧭 Step Completion Overview — displays 8 steps with PASS/MISSING using RB_STEPS and STORAGE_PREFIX.
- 🔗 Final Submission Links — three fields with URL validation (http/https):
  - 💜 Lovable Project Link
  - 🐙 GitHub Repository
  - 🌍 Live Deployment URL
- 💾 Stored under localStorage key: rb_final_submission.
- 🧷 Final Submission export copies:

  ------------------------------------------
  AI Resume Builder — Final Submission

  Lovable Project: {link}
  GitHub Repository: {link}
  Live Deployment: {link}

  Core Capabilities:
  - Structured resume builder
  - Deterministic ATS scoring
  - Template switching
  - PDF export with clean formatting
  - Persistence + validation checklist
  ------------------------------------------

- 🚢 Shipped Status Rule (badge shows Shipped only if):
  - ✅ All 8 steps marked completed
  - ✅ All 10 checklist tests passed (localStorage key rb_checklist_results: { total: 10, passed: 10 })
  - ✅ All 3 proof links are valid URLs
- 🧘 When shipped: “Project 3 Shipped Successfully.” (calm, no animations)


## 💽 Data Persistence (localStorage Keys)

- 🔑 resumeBuilderData — Main resume content (personal info, summary, education, experience, projects, skills, links)
- 🖼️ resumeTemplate — Selected template (Classic | Modern | Minimal)
- 🎨 resumeAccent — Selected color accent (HSL string)
- 📦 rb_final_submission — Proof links object { lovable, github, deploy }
- 📊 rb_checklist_results — Checklist results { total: number, passed: number } (expected { total:10, passed:10 } to ship)
- 📁 rb_step_{id}_artifact — Step artifact strings used to mark steps as PASS


## ✅ Verification Checklist

- 💾 All form sections save to localStorage
- 🔄 Live preview updates in real-time
- 🧩 Template switching preserves data
- 🎨 Color theme persists after refresh
- 🧮 ATS score calculates correctly and updates live
- ���� Export buttons work (copy/download)
- 🧼 Empty states handled gracefully
- 📱 Mobile-responsive layout works
- 🧯 No console errors on any page
- 🚢 /rb/proof shipped status requires: 8 steps + 10 checks + 3 valid links


## 🤝 Contributing

- 🧘 Keep the premium, minimal aesthetic.
- 🚫 Do not change routes or remove existing features.
- 🪶 Avoid heavy libraries for new features.
- 📏 Ensure new additions are deterministic and maintain score stability.


## 📄 License

This project is provided for educational and demonstration purposes. Consult repository terms for usage specifics.
