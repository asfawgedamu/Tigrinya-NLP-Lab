export interface Project {
  id: string;
  title: string;
  repoName: string;
  repoUrl: string;
  category: 'ml-nlp' | 'backend-api' | 'data-reference';
  tagline: string;
  description: string;
  highlightMetric: string;
  metricLabel: string;
  techStack: string[];
  keyFeatures: string[];
  recruiterImpact: string;
  architectureOverview: string;
  githubStars: number;
  isOriginal: boolean;
  readmeMarkdown: string;
}

export interface Publication {
  id: string;
  title: string;
  venue: string;
  year: string;
  authors: string[];
  url?: string;
  summary: string;
  impactBadge: string;
  topics: string[];
  datasetSize?: string;
}

export interface TechItem {
  name: string;
  category: 'ai-ml' | 'backend' | 'database' | 'security' | 'leadership';
  proficiency: number;
  years: string;
  badgeSlug: string;
  featuredIn: string[];
  proofLink?: string;
  description: string;
}

export interface AuditItem {
  id: string;
  category: 'profile' | 'repos' | 'readmes' | 'portfolio-page';
  severity: 'high' | 'medium' | 'info';
  issue: string;
  currentObservation: string;
  recommendedAction: string;
  effort: '5 mins' | '10 mins' | '15 mins' | '30 mins';
  impact: string;
}

export const USER_INFO = {
  name: 'Asfaw Gedamu',
  formalName: 'Asfaw Gedamu Haileslasie',
  username: 'asfawgedamu',
  role: 'Information Systems and Information Security Training Expert | ML Practitioner | Backend Engineer',
  roleShort: 'ML for Tigrinya, Backend Engineering & Technical Training at Scale',
  company: '@ethiotelecom-et',
  companyName: 'Ethio Telecom, Tech Horizon Center of Excellence (formerly TExA)',
  email: 'asfawg@gmail.com',
  githubUrl: 'https://github.com/asfawgedamu',
  twitter: 'https://twitter.com/asfawgedamu',
  twitterHandle: '@asfawgedamu',
  linkedin: 'https://linkedin.com/in/asfawgedamu',
  topmate: 'https://topmate.io/asfawgedamu',
  portfolioUrl: 'https://asfawgedamu.github.io',
  avatarUrl: 'https://avatars.githubusercontent.com/u/23502602?v=4',
  location: 'Addis Ababa, Ethiopia',
  education: [
    'MSc, Information Science',
    'BSc, Computer Science',
    'BA, Journalism and communications'
  ],
  stats: {
    publicRepos: 29,
    yearsAtEthioTelecom: '19+',
    engineersUpskilled: '500+',
    accuracyNlp: '92.98%',
    datasetSentences: '2,964',
    paperVenue: 'OpenReview (kiG8qiUFm2u)',
    postImpressions7Days: '86,413',
    profileViews: '1,469',
    searchAppearances: '114',
    academicReach: 'Addis Ababa University (AAU) & Tech Industry'
  },
  bioShort:
    'At ethio telecom\'s Telecom Excellence Academy (Tech Horizon CoE), I\'ve trained 500+ professionals in AI, machine learning, cybersecurity, and FinTech. Not as theory. As operational capability that moves the business forward. Published benchmark research on Tigrinya Dialect Identification (92.98% accuracy, OpenReview kiG8qiUFm2u).',
  recruiterPitch:
    'Senior technical leader with rare dual mastery: production-grade backend engineering (FastAPI, layered architectures) and published AI research in low-resource NLP (OpenReview: kiG8qiUFm2u, 92.98% accuracy), upskilling 500+ engineers.'
};

export const AUDIT_METRICS = {
  overallScore: 88,
  readabilityScore: 92,
  recruiterDiscoverability: 84,
  technicalClarity: 90,
  repoOrganization: 82,
  keyFindings: [
    {
      title: 'Multi-Page Portfolio Created',
      desc: 'You have organized your portfolio into 5 clean, accessible pages: Home (with Fidel chart), Work (with deep dives), Resume, Code (with live search), and Contact.',
      urgency: 'high'
    },
    {
      title: 'Live Google Apps Script Contact Form',
      desc: 'The contact form is wired to a custom Google Apps Script webhook to deliver emails directly to asfawg@gmail.com with spam honeypot protection.',
      urgency: 'high'
    },
    {
      title: 'Pinned Repositories on GitHub',
      desc: 'Ensure your GitHub profile pins match your new Work page: Tigrinya-Dialect-Identification, api-design-fundamentals, database, and asfawgedamu.github.io.',
      urgency: 'medium'
    },
    {
      title: 'Printable CV Ready',
      desc: 'cv.html formats cleanly for browser printing or saving as PDF without headers, badges, or clutter.',
      urgency: 'medium'
    }
  ]
};

export const AUDIT_CHECKLIST: AuditItem[] = [
  {
    id: 'publish-multipage',
    category: 'portfolio-page',
    severity: 'high',
    issue: 'Publish Multi-Page Portfolio to GitHub Pages',
    currentObservation: 'You have built the complete 5-page setup (index, work, resume, code, contact, cv, 404) with CSS design tokens and JS.',
    recommendedAction: 'Copy all files from this multi-page build to asfawgedamu.github.io root branch and push to main.',
    effort: '5 mins',
    impact: 'Instantly launches a modern, high-converting portfolio with Ge’ez script interactive chart and live GitHub API integration.'
  },
  {
    id: 'pin-repos',
    category: 'profile',
    severity: 'high',
    issue: 'Align GitHub Pinned Repos with Selected Work',
    currentObservation: 'GitHub profile pins should reflect the exact 3 projects in your Work page.',
    recommendedAction: 'Pin: 1) Tigrinya-Dialect-Identification, 2) api-design-fundamentals, 3) database, 4) asfawgedamu.github.io.',
    effort: '5 mins',
    impact: 'Creates instant consistency between your GitHub landing page and your portfolio site.'
  },
  {
    id: 'test-contact-webhook',
    category: 'portfolio-page',
    severity: 'medium',
    issue: 'Verify Google Apps Script Webhook',
    currentObservation: 'Script endpoint configured for form submission.',
    recommendedAction: 'Submit a test inquiry through the Contact page to verify Gmail notification and auto-reply delivery.',
    effort: '5 mins',
    impact: 'Guarantees prospective clients, recruiters, and collaborators reach you without email bounce.'
  },
  {
    id: 'clean-forks',
    category: 'repos',
    severity: 'medium',
    issue: 'Fork Clutter in Code Page',
    currentObservation: 'The Code page intelligently filters out hideRepos and featuredRepos, with an "Include forks" toggle.',
    recommendedAction: 'Keep "Include forks" unchecked by default (already implemented) so visitors see your primary code first.',
    effort: '5 mins',
    impact: 'Protects recruiter focus on original technical competence.'
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'tigrinya-dialect-nlp',
    title: 'Tigrinya Dialect Identification',
    repoName: 'Tigrinya-Dialect-Identification',
    repoUrl: 'https://github.com/asfawgedamu/Tigrinya-Dialect-Identification',
    category: 'ml-nlp',
    tagline: 'Dataset, taxonomy and benchmark for telling three Tigrinya varieties (L, Z and D) apart',
    description:
      'A dataset and benchmark for telling three Tigrinya varieties (L, Z and D) apart from text alone. Sentences were collected per dialect from books and social-media writers, then translated into the other dialects with native-speaker experts. Evaluated classical ML models alongside character-level Convolutional Neural Networks and BiLSTMs.',
    highlightMetric: '92.98%',
    metricLabel: 'Accuracy on Ge’ez-Script Text',
    techStack: ['Python', 'PyTorch', 'Character CNN', 'BiLSTM', 'Scikit-learn', 'Pandas', 'NumPy', 'Ge’ez Script NLP', 'OpenReview'],
    keyFeatures: [
      'First systematic annotated dataset (TDI) of 2,964 sentences across three Tigrinya varieties (Z: 1,041, L: 1,169, D: 754)',
      'Shared taxonomy establishing unified linguistic categories for low-resource Tigrinya text',
      'Comparative benchmarking across Naive Bayes, SVM, Character-level CNNs, and BiLSTM architectures',
      'Peak accuracy of 92.98% achieved by Character-level Convolutional Neural Networks',
      'Published in OpenReview (kiG8qiUFm2u) with open-source data and notebooks'
    ],
    recruiterImpact:
      'Proves applied deep learning capabilities in low-resource NLP, dataset engineering, research rigor, and solving language technology barriers for African languages.',
    architectureOverview: 'Raw Ethiopic Text → Ge’ez Normalizer → Character-level Embeddings → 1D CNN / BiLSTM Feature Extractor → Softmax Dialect Classifier (L, Z, D)',
    githubStars: 0,
    isOriginal: true,
    readmeMarkdown: `# 🇪🇹 Tigrinya Dialect Identification (TDI)

[![OpenReview Paper](https://img.shields.io/badge/OpenReview-Paper%20PDF-8C1D40?style=for-the-badge&logo=openreview&logoColor=white)](https://openreview.net/pdf?id=kiG8qiUFm2u)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org)
[![NLP](https://img.shields.io/badge/NLP-Low--Resource%20African%20Languages-green?style=for-the-badge)](https://openreview.net/pdf?id=kiG8qiUFm2u)

> Empirical investigation and benchmark dataset for identifying Tigrinya text dialects using Classical Machine Learning and Deep Neural Networks. Published in OpenReview: **https://openreview.net/forum?id=kiG8qiUFm2u**

---

## 📊 Benchmark Results

| Model Architecture | Feature Representation | Accuracy | F1-Score (Macro) |
| :--- | :--- | :--- | :--- |
| **Character CNN (Proposed)** | Char-level Embeddings | **92.98%** | **0.928** |
| BiLSTM | Word + Subword | 90.45% | 0.902 |
| Support Vector Machine (SVM) | TF-IDF (Char n-grams) | 88.30% | 0.881 |
| Multinomial Naive Bayes | TF-IDF (Word n-grams) | 84.15% | 0.839 |

---

## 🗺️ Dataset Breakdown (2,964 Sentences)
- **Variety Z:** Book: *Kilte Zantatat* (1,041 sentences)
- **Variety L:** Books: *Fato* (764 sentences) & *Erqi Enderta* (405 sentences)
- **Variety D:** Two native social-media writers (754 sentences)

---

## 🔬 Citation
\`\`\`bibtex
@misc{haileslasie_tigrinya_dialect_identification,
  title        = {Tigrinya Dialect Identification},
  author       = {Haileslasie, Asfaw Gedamu and Hadgu, Asmelash Teka and Abate, Solomon Teferra},
  howpublished = {OpenReview},
  url          = {https://openreview.net/forum?id=kiG8qiUFm2u}
}
\`\`\`
`
  },
  {
    id: 'api-design-fundamentals',
    title: 'API Design Fundamentals',
    repoName: 'api-design-fundamentals',
    repoUrl: 'https://github.com/asfawgedamu/api-design-fundamentals',
    category: 'backend-api',
    tagline: 'Progressive 3-Tier FastAPI Lab Series (Basic → Intermediate → Enterprise Layers)',
    description:
      'A hands-on, progressive lab series designed to transform developers from API consumers into architecture-aware backend engineers. Uses a restaurant analogy (Customer → Client, Waiter → Endpoint, Kitchen → Service Layer, Warehouse → Database) across three standalone evolutionary apps.',
    highlightMetric: '3 Evolutionary Levels',
    metricLabel: 'From Single-File to Layered Enterprise Architecture',
    techStack: ['Python 3.11', 'FastAPI', 'Pydantic v2', 'SQLAlchemy', 'SQLite', 'JWT Auth', 'API Keys', 'Pytest', 'HTTPX', 'Swagger UI'],
    keyFeatures: [
      'Level 1 Basic (/basic, port 8000): In-memory store, FastAPI basics, HTTP methods, and auto-generated Swagger UI',
      'Level 2 Intermediate (/intermediate, port 8001): SQLite persistence, full CRUD, Pydantic validation, CORS, pagination',
      'Level 3 Enterprise (/advanced, port 8002): Layered routes/services, API-key and JWT authentication, structured logging, timing middleware, Pytest test suites',
      'Interactive architecture diagrams for each level with clear separation of concerns'
    ],
    recruiterImpact:
      'Demonstrates clean enterprise software engineering principles, modular maintainability, test automation, and the ability to author clear educational curriculum for engineering teams.',
    architectureOverview: 'Level 1: Client → Single File App → Memory | Level 2: Client → Router → Validation/ORM → SQLite | Level 3: Client (JWT) → Routes → Services → Database Engine',
    githubStars: 0,
    isOriginal: true,
    readmeMarkdown: `# 🍽️ API Design Fundamentals: Progressive FastAPI Labs Series

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Pydantic](https://img.shields.io/badge/Pydantic-v2-E92063?style=for-the-badge&logo=pydantic&logoColor=white)](https://docs.pydantic.dev/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> A progressive lab series designed to transform developers from **API Consumers** to **Architecture-Aware Backend Engineers**.

---

## 🎯 Progressive Evolutionary Levels

| Level | Directory | Port | Focus & Architecture |
| :--- | :--- | :--- | :--- |
| **01 Basic** | \`/basic\` | \`:8000\` | Single-file prototype (\`app_basic.py\`), path/query params, OpenAPI Swagger docs |
| **02 Intermediate** | \`/intermediate\` | \`:8001\` | SQLite persistence, full CRUD, SQLAlchemy ORM, Pydantic validation, CORS, pagination |
| **03 Enterprise** | \`/advanced\` | \`:8002\` | Layered modular layout (\`app/routes\`, \`app/services\`), API keys & JWT auth, structured logging, Pytest & HTTPX |

---

## 🚀 Quick Start (Level 3 Enterprise)

\`\`\`bash
git clone https://github.com/asfawgedamu/api-design-fundamentals.git
cd api-design-fundamentals/advanced
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8002
\`\`\`

Open Swagger UI at: **\`http://localhost:8002/docs\`**
`
  },
  {
    id: 'database-systems-ref',
    title: 'Database Systems Reference',
    repoName: 'database',
    repoUrl: 'https://github.com/asfawgedamu/database',
    category: 'data-reference',
    tagline: 'Curated working material for database administrators: 15 monitoring SQL scripts and SQL Server resources',
    description:
      'Curated repository of working material for database administrators: a guide to 15 monitoring SQL scripts, performance telemetry recipes, and SQL Server best practice resources.',
    highlightMetric: '15 SQL Scripts',
    metricLabel: 'DBA Monitoring & Health Diagnostics',
    techStack: ['SQL', 'SQL Server', 'Oracle', 'MySQL', 'PostgreSQL', 'SQLite', 'DBA Monitoring'],
    keyFeatures: [
      '15 production-ready SQL scripts for database health, active sessions, and lock diagnostics',
      'Best practice resources and administration playbooks for Microsoft SQL Server',
      'Comparative query optimization guides across relational database engines'
    ],
    recruiterImpact:
      'Demonstrates mission-critical relational database depth, query optimization, and infrastructure operational monitoring experience from 19+ years at Ethio Telecom.',
    architectureOverview: 'DBA Diagnostic Suite → Session Monitoring → Index Fragmentation Analysis → Query Execution Tuning',
    githubStars: 0,
    isOriginal: true,
    readmeMarkdown: `# 🗄️ Database Systems Reference

[![SQL](https://img.shields.io/badge/SQL-Expert-003B57?style=for-the-badge&logo=postgresql&logoColor=white)](https://github.com/asfawgedamu/database)
[![Database](https://img.shields.io/badge/DBA-15_Monitoring_Scripts-orange?style=for-the-badge)](https://github.com/asfawgedamu/database)

Curated working material for database administrators:
- **15 Monitoring SQL Scripts:** Active sessions, blocking queries, index usage, and buffer cache hits.
- **SQL Server Best Practices:** Index maintenance, transaction log management, and backup verification.
- **Cross-Engine Reference:** SQL patterns across SQL Server, Oracle, PostgreSQL, and SQLite.
`
  }
];

export const PUBLICATIONS: Publication[] = [
  {
    id: 'openreview-kiG8qiUFm2u',
    title: 'Tigrinya Dialect Identification',
    venue: 'OpenReview',
    year: '2024',
    authors: ['Asfaw Gedamu Haileslasie', 'Asmelash Teka Hadgu', 'Solomon Teferra Abate'],
    url: 'https://openreview.net/forum?id=kiG8qiUFm2u',
    summary:
      'Proposed a shared taxonomy of three Tigrinya varieties (Z, L, D) and built the first annotated benchmark dataset for classifying them from text (2,964 sentences). Compared classical machine learning and deep learning; character-level CNNs reached 92.98% on Ge’ez-script text.',
    impactBadge: 'OpenReview • 92.98% Accuracy',
    topics: ['Dialect Identification', 'Character CNN', 'Tigrinya NLP', 'Annotated Dataset (2,964 Sentences)', 'Ge’ez Script'],
    datasetSize: '2,964 sentences across Z (1,041), L (1,169), and D (754)'
  }
];

export const TECH_SKILLS: TechItem[] = [
  {
    name: 'Machine learning and NLP',
    category: 'ai-ml',
    proficiency: 95,
    years: '5+ yrs',
    badgeSlug: 'PyTorch-EE4C2C',
    featuredIn: ['Tigrinya-Dialect-Identification'],
    proofLink: 'work.html#tigrinya',
    description: 'Python, PyTorch, Pandas, NumPy. Character-level CNNs, dataset construction, low-resource languages.'
  },
  {
    name: 'Backend and APIs',
    category: 'backend',
    proficiency: 95,
    years: '6+ yrs',
    badgeSlug: 'FastAPI-009688',
    featuredIn: ['api-design-fundamentals'],
    proofLink: 'work.html#api-series',
    description: 'Python 3.11, FastAPI, SQLAlchemy, Pydantic v2, JWT and API keys, API versioning, CORS, pagination, Pytest with HTTPX.'
  },
  {
    name: 'Databases',
    category: 'database',
    proficiency: 95,
    years: '19+ yrs',
    badgeSlug: 'SQL-003B57',
    featuredIn: ['database'],
    proofLink: 'work.html#database-ref',
    description: 'SQL across SQL Server, Oracle, MySQL, PostgreSQL and SQLite, including DBA monitoring.'
  },
  {
    name: 'Security and systems',
    category: 'security',
    proficiency: 90,
    years: '10+ yrs',
    badgeSlug: 'Security-Red_Hat-EE0000',
    featuredIn: ['Tech Horizon Training Role'],
    proofLink: 'resume.html#experience',
    description: 'Information security training, cybersecurity upskilling, Linux administration (RHEL and Ubuntu).'
  },
  {
    name: 'Teaching and enablement',
    category: 'leadership',
    proficiency: 98,
    years: '6+ yrs',
    badgeSlug: 'Tech_Strategy-4B0082',
    featuredIn: ['Tech Horizon Center of Excellence', 'api-design-fundamentals'],
    proofLink: 'resume.html#experience',
    description: 'Curriculum design, hands-on lab facilitation, technical writing, enterprise capability building (500+ engineers upskilled).'
  },
  {
    name: 'Everyday tools',
    category: 'backend',
    proficiency: 90,
    years: '10+ yrs',
    badgeSlug: 'Tools-Git_Docker-2496ED',
    featuredIn: ['Development Workflow'],
    proofLink: 'code.html',
    description: 'Git and GitHub, Docker, VS Code.'
  }
];

export const WORK_EXPERIENCE = [
  {
    title: 'Information Systems and Information Security training expert',
    company: 'Ethio Telecom, Tech Horizon Center of Excellence (formerly TExA)',
    period: '2021 to present',
    bullets: [
      'Upskilled 500+ professionals in AI, ML, cybersecurity and FinTech.',
      'Design hands-on lab frameworks for engineering teams, such as the 3-level progressive FastAPI series.',
      'Developing a full-stack software development curriculum.'
    ]
  },
  {
    title: 'Research in Low-Resource African Language Technology',
    company: 'OpenReview / Academic Research',
    period: '2022 to present',
    bullets: [
      'Published landmark paper on Tigrinya Dialect Identification with 92.98% peak accuracy using character CNNs.',
      'Created the first annotated benchmark dataset (2,964 sentences) across three varieties (Z, L, D).'
    ]
  }
];
