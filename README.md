# Tigrinya NLP Dialect Classifier & Professional Research Portfolio

> **Author / Engineer:** Asfaw Gedamu (Information Systems & Information Security Training Expert | ML Practitioner | Backend Engineer at Ethio Telecom Tech Horizon CoE)  
> **Peer-Reviewed Research:** Published in [OpenReview](https://openreview.net/pdf?id=kiG8qiUFm2u) (92.98% Benchmark Accuracy)

---

## What the System Does

This enterprise-grade web application and research suite serves as both an advanced **Low-Resource Tigrinya NLP Dialect Identification (TDI) Lab** and a professional **Executive Portfolio**. 

### Core Modules:
1. **Tigrinya Dialect Lab (TDI Benchmark):**
   - Interactive inference engine classifying Ethio Telecom / Tigrinya text into three dialect varieties:
     - **Variety Z (Northern / Standard):** Characterized by `ዝ-/ዘ-` relative prefixes and standard auxiliary verb compounding (`ኣለና`, `ዘሎ`).
     - **Variety L (Enderta / Mekelle):** Characterized by `ል-/ለ-` relative prefixes, `[ይ]` word connectors, and `ለሎ/ለላ` existentials.
     - **Variety D (Rayya):** Characterized by `ድ-/ደ-` alveolar stop prefix shifts and Rayyan existential markers (`ድንሆ`).
   - **Strict Non-Tigrinya & Amharic Text Rejection:** Automatically detects and refuses non-Tigrinya, English, or Amharic text inputs (e.g., stopping Amharic copular texts from false-positive classification).
   - **Multi-Model Pipeline Switcher:** Instantly switch between Classical ML (Naive Bayes, SVM, ANN) and Deep Learning architectures (Character CNN, BiLSTM, CNN-BiLSTM, Afro-XLMR Transformer) with live recalculation of confidence scores and probability distributions.
   - **Active Learning & Secure Admin Moderation:** Expert misclassification reporting queue with secure password-protected admin dashboard (`asfaw-admin`) to review, comment on, and approve or reject submissions before retraining buffer ingestion.
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
- `lucide-react` (^1.16.0)
- `recharts` (^2.15.0)
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
   git clone https://github.com/asfawgedamu/asfawgedamu.github.io.git
   cd asfawgedamu.github.io
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

## Project Structure & Code Comments

All scripts (`.ts`, `.tsx`, `.html`, `.css`) contain comprehensive JSDoc and inline comments detailing function logic, morpho-syntactic rules, and component architecture:

```text
/
├── public/                 # Static multi-page portfolio assets (cv.html, resume.html, work.html, code.html, contact.html)
├── src/
│   ├── components/         # Modular React components (Navbar, Footer, HeroSection, AdminDashboard, TigrinyaDialectLab...)
│   │   └── dynamic/        # Interactive portfolio tabs (InteractiveResume, InteractiveContact, DatabaseConsole...)
│   ├── context/            # Theme context (Dark / Light mode toggle with text contrast preservation)
│   ├── data/               # Benchmark datasets, Fidel alphabet matrix, and user profile data (nlpData.ts, portfolioData.ts)
│   ├── utils/              # Markdown and multi-page file generators
│   ├── App.tsx             # Root application orchestrator with tab routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global Tailwind CSS import and theme styling
├── package.json            # Available dependencies and npm scripts
├── tsconfig.json           # TypeScript compilation configuration
└── vite.config.ts          # Vite dev server configuration (port 3000)
```

---

## Maintenance & Dependency Updates

To keep dependencies working seamlessly and secure:
- Regularly audit packages: `npm audit`
- Update packages safely: `npm update`
- Verify TypeScript types: `npx tsc --noEmit`
- Run build verification before pushing: `npm run build`

---

## License
© 2026 Asfaw Gedamu. Released under the MIT License.
