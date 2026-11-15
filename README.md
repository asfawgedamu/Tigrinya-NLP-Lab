# Tigrinya NLP Dialect Classifier & Professional Research Portfolio

> **Author / Engineer:** Asfaw Gedamu (Information Systems & Information Security Training Expert | ML Practitioner | Backend Engineer at Ethio Telecom Tech Horizon CoE)  
> **Peer-Reviewed Research:** Published in [OpenReview](https://openreview.net/pdf?id=kiG8qiUFm2u) (92.98% Benchmark Accuracy)

---

## What the System Does

This enterprise-grade web application and research suite serves as both an advanced **Low-Resource Tigrinya NLP Dialect Identification (TDI) Lab** and a professional **Executive Portfolio**. 

### Core Modules:
1. **Tigrinya Dialect Lab (TDI Benchmark):**
   - Interactive inference engine classifying Ethio Telecom / Tigrinya text into three dialect varieties:
     - **Variety Z (Standard):** Characterized by `ዝ-/ዘ-` relative prefixes and standard auxiliary verb compounding (`ኣለና`, `ዘሎ`).
     - **Variety L (Enderta / Mekelle):** Characterized by `ል-/ለ-` relative prefixes, `[ይ]` word connectors, and `ለሎ/ለላ` existentials.
     - **Variety D (Rayya):** Characterized by `ድ-/ደ-` prefixes and Rayya existential markers (`ድንሆ`).
   - **Strict Non-Tigrinya & Amharic Text Rejection:** Automatically detects and refuses non-Tigrinya, English, or Amharic text inputs (e.g., stopping Amharic copular texts from false-positive classification).
   - **Multi-Model Pipeline Switcher:** Instantly switch between Classical ML (Naive Bayes, SVM, ANN) and Deep Learning architectures (Character CNN, BiLSTM, CNN-BiLSTM, Afro-XLMR Transformer) with live recalculation of confidence scores and probability distributions.
   - **Active Learning & Admin Moderation:** Visitors send misclassification reports; only the site owner, signed in with Google, can review, approve or reject them (enforced by Firestore rules).
   - **Community Comments & Replies:** Anyone can comment, reply and upvote. The owner replies as "Author" after signing in.
   - **Batch Corpus File Upload & CSV Export:** Upload `.txt` or `.csv` corpora for batch dialect prediction and export results as CSV.

2. **Professional Portfolio & Multi-Page Viewer:**
   - **Interactive Ge'ez Fidel Matrix:** Explore all Ethio Telecom / Ethiopic consonants and 7 vowel orders with live keyboard navigation and transliteration.
   - **Interactive Resume & ATS CV:** Comprehensive curriculum vitae with printable PDF export.
   - **FastAPI Progressive 3-Tier Architecture Simulator:** Walkthrough of the restaurant analogy backend labs (Single-file prototype → SQLite CRUD → Enterprise layered JWT architecture).
   - **Database Diagnostics Telemetry:** 15 production-hardened Oracle & PostgreSQL monitoring scripts.
   - **Live Contact Form:** Wired to a custom Google Apps Script webhook with spam honeypot protection.

---

## Tech Stack & Dependencies

- **Frontend Framework:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS (utility-first styling with custom theme tokens)
- **Icons & Visualizations:** Lucide React, Recharts, Canvas Confetti
- **Runtime Environment:** Node.js (v18+ recommended), Bun / npm package manager

### Key Dependencies (`package.json`):
- `react`, `react-dom` (^19.0.0)
- `firebase` (Firestore + Google sign-in for comments and moderation)
- `lucide-react`
- `recharts`
- `canvas-confetti` (^1.9.4)
- `tailwindcss` (^4.0.0)
- `vite`, `typescript`

---

## How to Engage with It & Run Locally

### Prerequisites
Ensure you have **Node.js (v18+ or v20+)** installed on your system.

### Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/asfawgedamu/Tigrinya-NLP-Lab.git
   cd Tigrinya-NLP-Lab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server (runs on port 3000):
   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```text
   http://localhost:3000
   ```

### Building for Production
To build the static production bundle and verify compilation:
```bash
npm run build
```

---

## Comments, Replies and Admin Setup (Firebase)

Comments, replies and misclassification reports are stored in Cloud Firestore. The owner signs in with Google; there are no shared passcodes in the code.

1. **Publish the rules.** Open `firestore.rules`, replace `REPLACE_WITH_YOUR_GOOGLE_EMAIL@gmail.com` with your Google address, then publish them:
   - Console: Firestore Database → the named database → Rules → paste → Publish, **or**
   - CLI: `npx firebase-tools deploy --only firestore:rules --project tera-web-lbcxw`
2. **Enable Google sign-in.** Firebase Console → Authentication → Sign-in method → Google → Enable.
3. **Authorize your site address.** Authentication → Settings → Authorized domains → add the domain the site runs on (for example `asfawgedamu.github.io`).
4. **Publish the two featured comments (once).** Open the site, go to Projects → Community Comments, click **Author sign-in**, then **Publish the two featured comments** if the list is empty.

Who can do what:

| Action | Visitor | Owner (signed in) |
| --- | --- | --- |
| Read comments and replies | Yes | Yes |
| Post a comment, reply or upvote | Yes | Yes |
| Reply labelled "Author" | No | Yes |
| Delete a comment or reply | No | Yes |
| Submit a misclassification report | Yes | Yes |
| Read, approve or reject reports | No | Yes |

---

## Project Structure

```text
/
├── public/                 # Static assets: research corpora (research/), images (assets/img), legacy static pages
├── src/
│   ├── components/         # Navbar, Footer, ProjectsPage, TigrinyaDialectLab, CommentsPanel, ModerationPanel
│   │   └── dynamic/        # Resume, contact, GitHub explorer, Tigrinya NLP explorer, research data portal
│   ├── context/            # ThemeContext (dark/light) and AdminContext (Google sign-in + admin check)
│   ├── data/               # Corpora, stop words and profile data
│   ├── lib/                # Firebase setup, comments service, moderation service
│   ├── App.tsx             # Tab routing with lazy-loaded pages
│   └── main.tsx            # Entry point
├── firestore.rules         # Database security rules (publish these)
├── firebase.json           # Firebase CLI config for the rules
└── vite.config.ts
```

---

## Maintenance & Dependency Updates

To keep dependencies working seamlessly and secure:
- Regularly audit packages: `npm audit`
- Update packages safely: `npm update`
- Verify TypeScript types: `npm run typecheck`
- Run build verification before pushing: `npm run build`

---

## License
© 2026 Asfaw Gedamu. Released under the MIT License.
