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

## The Dialect Classifier Model

The Dialect Lab and the Explorer run a real trained model (character n-gram TF-IDF + logistic regression) entirely in the browser; model files live in `public/models/`.
To install a newly trained model, verify it and publish it, follow **[docs/MODEL_DEPLOYMENT.md](docs/MODEL_DEPLOYMENT.md)** (`npm run model:install`, `npm run test:model`).

---

## Comments, Replies and Admin Setup (Firebase)

Comments, replies and misclassification reports live in Cloud Firestore. The owner signs in with Google; there are no shared passcodes in the code. See `SECURITY.md` for the threat model.

### One-time setup (do these in order)
1. **Publish the rules.** In `firestore.rules`, replace `REPLACE_WITH_YOUR_GOOGLE_EMAIL@gmail.com` with your Google address (also in `tests/firestore.rules.test.mjs`). Publish with either:
   - Console: Firestore Database → your named database → Rules → paste → Publish, or
   - CLI: `npx firebase-tools deploy --only firestore:rules --project tera-web-lbcxw`
2. **Enable sign-in methods.** Firebase Console → Authentication → Sign-in method: enable **Google** (for you) and **Anonymous** (for visitors; invisible to them, used for rate limits and one vote each).
3. **Authorize the site address.** Authentication → Settings → Authorized domains → add the domain the site runs on (for example `asfawgedamu.github.io`).
4. **Turn on 2-Step Verification** on the Google account you use as admin. It is the key to everything.
5. **Restrict the API key.** Google Cloud Console → APIs & Services → Credentials → the Browser key → Application restrictions → HTTP referrers → add your site address and `localhost:3000/*`.
6. **Set a budget alert.** Google Cloud Console → Billing → Budgets & alerts, so a flood of traffic cannot surprise you.
7. **Enable App Check** (strongly recommended against scripted abuse): Firebase Console → App Check → register the web app with reCAPTCHA v3, copy the site key into `APP_CHECK_SITE_KEY` in `src/lib/firebaseConfig.ts`, rebuild, then **Enforce** it for Cloud Firestore and Authentication.

### Using it
- **Author mode:** open Projects → Community Comments → **Author sign-in**. Your replies then show an "Author" badge. You can delete any comment or reply, **Block author**, and use **Pause all new comments, replies and reports** as an emergency stop.
- **Moderation tab:** hidden from visitors. Open the site address with `#admin` on the end (for example `https://your-site/#admin`), or sign in as author, and the Admin Moderation tab appears.
- **Comment dates:** new comments store a full date and time (shown like "14 Nov 2026, 9:27 PM · 5 hours ago"). Comments saved before this update only stored a time of day, so they show "date not recorded". As admin, a **Set the real date** field appears on them so you can enter the correct date once.
- **Unblocking someone:** delete their document in Firestore → `blocked`.

### Who can do what
| Action | Visitor | Owner (signed in) |
| --- | --- | --- |
| Read comments and replies | Yes | Yes |
| Post a comment or reply (1 per 15 s) | Yes | Yes |
| Reply to someone else's reply | Yes | Yes |
| One vote per comment | Yes | Yes |
| Delete their own comment or reply | Yes | Yes |
| Reply labelled "Author" | No | Yes |
| Delete anyone's content, block, pause posting | No | Yes |
| Submit a misclassification report | Yes | Yes |
| Read, approve or reject reports | No | Yes |

### Testing the rules
`npm run test:rules` runs `tests/firestore.rules.test.mjs` against the Firestore emulator (needs Java). Run it after every change to `firestore.rules`.

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
│   ├── lib/                # Firebase setup, comments/moderation services, tdiInfer.mjs + tdiModel.ts (dialect model)
│   ├── App.tsx             # Tab routing with lazy-loaded pages
│   └── main.tsx            # Entry point
├── firestore.rules         # Database security rules (publish these)
├── tests/                  # Rule tests (npm run test:rules) and model parity test (npm run test:model)
├── scripts/                # install-model.mjs (validate + install a trained model)
├── docs/                   # MODEL_DEPLOYMENT.md
├── SECURITY.md             # Threat model and how to report a problem
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
