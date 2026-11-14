import { USER_INFO, PROJECTS, PUBLICATIONS } from '../data/portfolioData';

export interface ReadmeOptions {
  includeStatsCards: boolean;
  includeTechBadges: boolean;
  includeFeaturedProjects: boolean;
  includePublications: boolean;
  includeSocialBadges: boolean;
  includeVisitorCounter: boolean;
  badgeStyle: 'for-the-badge' | 'flat' | 'flat-square';
  recruiterCallout: boolean;
}

export function generateProfileReadme(options: ReadmeOptions): string {
  const style = options.badgeStyle;

  let md = '';

  // Header Banner & Intro
  md += `<div align="center">\n\n`;
  md += `# 👨‍💻 ${USER_INFO.name}\n\n`;
  md += `**${USER_INFO.role}**\n\n`;
  md += `*Bridging Enterprise Systems, Applied Machine Learning, and Scalable Technical Learning*\n\n`;
  md += `📍 **${USER_INFO.location}** &nbsp;•&nbsp; 🏢 **[Ethio Telecom](https://github.com/ethiotelecom-et)** &nbsp;•&nbsp; 🎓 **NLP & AI Researcher**\n\n`;

  // Social Badges
  if (options.includeSocialBadges) {
    md += `[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=${style}&logo=linkedin&logoColor=white)](${USER_INFO.linkedin}) `;
    md += `[![Portfolio](https://img.shields.io/badge/Live_Portfolio-0F172A?style=${style}&logo=googlechrome&logoColor=white)](${USER_INFO.portfolioUrl}) `;
    md += `[![Topmate](https://img.shields.io/badge/Topmate_Mentorship-FF5722?style=${style}&logo=topmate&logoColor=white)](${USER_INFO.topmate}) `;
    md += `[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=${style}&logo=x&logoColor=white)](${USER_INFO.twitter}) `;
    md += `[![Email](https://img.shields.io/badge/Email-D14836?style=${style}&logo=gmail&logoColor=white)](mailto:${USER_INFO.email})\n\n`;
  }

  if (options.includeVisitorCounter) {
    md += `![Visitor Count](https://komarev.com/ghpvc/?username=asfawgedamu&color=0078D4&style=flat-square&label=PROFILE+VIEWS)\n\n`;
  }

  md += `</div>\n\n---\n\n`;

  // Recruiter Callout
  if (options.recruiterCallout) {
    md += `> 💡 **For Recruiters & Collaborators:** Senior technologist combining **19+ years at Ethio Telecom** with **peer-reviewed deep learning research in low-resource NLP published in [OpenReview](https://openreview.net/pdf?id=kiG8qiUFm2u) (92.98% benchmark accuracy)** and **proven engineering enablement (500+ professionals upskilled in AI, ML, cybersecurity & FinTech)**. Open to Senior/Staff ML Engineering, Backend Architecture, and Technical Training leadership roles.\n\n`;
  }

  // Quick summary table
  md += `### ⚡ At a Glance\n\n`;
  md += `| Domain | Key Focus | Primary Impact |\n`;
  md += `| :--- | :--- | :--- |\n`;
  md += `| 🧠 **Applied AI & NLP** | Low-Resource African NLP, Character CNNs, Dialect Taxonomies | Published in **[OpenReview (kiG8qiUFm2u)](https://openreview.net/pdf?id=kiG8qiUFm2u)**; **92.98% dialect accuracy** |\n`;
  md += `| ⚙️ **Backend & APIs** | FastAPI, Layered Architecture, SQLAlchemy, Pydantic v2, JWT | Author of the 3-level progressive FastAPI enterprise series |\n`;
  md += `| 🗄️ **Databases & Systems** | SQL Server, Oracle, MySQL, PostgreSQL, SQLite, DBA Diagnostics | Curated DBA reference with 15 monitoring SQL scripts |\n`;
  md += `| 👥 **Learning & Leadership** | Enterprise Lab Design, Technical Roadmapping, Mentorship | Upskilled 500+ professionals at Ethio Telecom (Tech Horizon CoE) |\n\n`;

  // Dynamic GitHub stats cards
  if (options.includeStatsCards) {
    md += `### 📊 GitHub Activity & Metrics\n\n`;
    md += `<div align="center">\n\n`;
    md += `<img src="https://github-readme-stats.vercel.app/api?username=asfawgedamu&show_icons=true&theme=tokyonight&hide_border=true&count_private=true" alt="Asfaw's GitHub Stats" height="165" />\n`;
    md += `<img src="https://github-readme-stats.vercel.app/api/top-langs/?username=asfawgedamu&layout=compact&theme=tokyonight&hide_border=true" alt="Top Languages" height="165" />\n\n`;
    md += `</div>\n\n`;
  }

  // Tech Stack Badges
  if (options.includeTechBadges) {
    md += `### 🛠️ Core Technologies & Stack\n\n`;
    md += `- **Languages:** ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) ![SQL](https://img.shields.io/badge/SQL-003B57?style=flat&logo=postgresql&logoColor=white) ![Bash](https://img.shields.io/badge/Shell_Bash-4EAA25?style=flat&logo=gnubash&logoColor=white)\n`;
    md += `- **Machine Learning & NLP:** ![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat&logo=pytorch&logoColor=white) ![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=flat&logo=scikitlearn&logoColor=white) ![OpenReview](https://img.shields.io/badge/OpenReview-Paper-8C1D40?style=flat&logo=openreview&logoColor=white)\n`;
    md += `- **Backend & API Design:** ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white) ![Pydantic](https://img.shields.io/badge/Pydantic-E92063?style=flat&logo=pydantic&logoColor=white) ![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=flat&logo=sqlalchemy&logoColor=white) ![Pytest](https://img.shields.io/badge/Pytest-0A9EDC?style=flat&logo=pytest&logoColor=white)\n`;
    md += `- **DevOps & Infrastructure:** ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) ![Red Hat Linux](https://img.shields.io/badge/RHEL_9-EE0000?style=flat&logo=redhat&logoColor=white) ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)\n\n`;
  }

  // Featured Projects
  if (options.includeFeaturedProjects) {
    md += `### 🚀 Flagship Projects (Pinned Repositories)\n\n`;
    PROJECTS.forEach((proj) => {
      md += `#### 🔹 [${proj.title}](${proj.repoUrl})\n`;
      md += `> **${proj.tagline}** — *Key Result: ${proj.highlightMetric} (${proj.metricLabel})*\n\n`;
      md += `${proj.description}\n\n`;
      md += `**Tech Stack:** \`${proj.techStack.join('` • `')}\`\n\n`;
    });
  }

  // Publications
  if (options.includePublications) {
    md += `### 🔬 Scientific Research & Publications\n\n`;
    PUBLICATIONS.forEach((pub) => {
      md += `- **[${pub.title}](${pub.url || '#'})**  \n`;
      md += `  *${pub.venue} (${pub.year})* • \`${pub.impactBadge}\` • [Read Paper PDF](${pub.url})  \n`;
      md += `  *Authors: ${pub.authors.join(', ')}*  \n`;
      md += `  ${pub.summary}\n\n`;
    });
  }

  // Footer
  md += `---\n\n`;
  md += `<div align="center">\n\n`;
  md += `💬 **Let's talk about Machine Learning, Enterprise Architecture, or Developer Enablement!**  \n`;
  md += `Reach out via [LinkedIn](${USER_INFO.linkedin}) or book a 1:1 call on [Topmate](${USER_INFO.topmate}).\n\n`;
  md += `</div>\n`;

  return md;
}

export function generateStaticHtmlPortfolio(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Asfaw Gedamu | Portfolio & Technical Showcase</title>
  <meta name="description" content="Portfolio of Asfaw Gedamu - Enterprise Tech Learning Strategist, Systems Expert, and Machine Learning Practitioner. Author of Tigrinya Dialect Identification in OpenReview.">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    code, pre { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
  <!-- Navigation -->
  <nav class="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex justify-between items-center max-w-6xl mx-auto">
    <div class="font-bold text-xl tracking-tight text-cyan-400">Asfaw Gedamu</div>
    <div class="flex gap-6 text-sm font-medium text-slate-300">
      <a href="#about" class="hover:text-cyan-400 transition">About</a>
      <a href="#projects" class="hover:text-cyan-400 transition">Projects</a>
      <a href="#research" class="hover:text-cyan-400 transition">Research</a>
      <a href="#skills" class="hover:text-cyan-400 transition">Skills</a>
      <a href="#contact" class="hover:text-cyan-400 transition">Contact</a>
    </div>
  </nav>

  <!-- Hero -->
  <header id="about" class="max-w-4xl mx-auto px-6 py-20 text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 mb-6">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Open for Senior ML & Backend Architecture Roles
    </div>
    <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
      Enterprise Tech Strategist & ML Practitioner
    </h1>
    <p class="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
      Author of published research in OpenReview (<a href="https://openreview.net/pdf?id=kiG8qiUFm2u" target="_blank" class="text-cyan-400 underline">kiG8qiUFm2u</a>) reaching a 92.98% benchmark for Tigrinya dialect identification, and architect of progressive enterprise FastAPI lab frameworks.
    </p>
    <div class="flex flex-wrap justify-center gap-4">
      <a href="https://github.com/asfawgedamu" target="_blank" class="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition flex items-center gap-2">
        <i class="fab fa-github"></i> GitHub Profile
      </a>
      <a href="https://openreview.net/pdf?id=kiG8qiUFm2u" target="_blank" class="px-6 py-3 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-200 font-semibold transition border border-rose-800 flex items-center gap-2">
        <i class="fas fa-file-pdf"></i> OpenReview Paper PDF
      </a>
      <a href="https://linkedin.com/in/asfawgedamu" target="_blank" class="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition border border-slate-700 flex items-center gap-2">
        <i class="fab fa-linkedin"></i> LinkedIn
      </a>
    </div>
  </header>

  <!-- Flagship Projects -->
  <section id="projects" class="max-w-5xl mx-auto px-6 py-16">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-white">Flagship Technical Projects</h2>
    <p class="text-slate-400 mb-10 text-sm">Engineered for architectural elegance, production rigor, and scientific impact.</p>
    
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Project 1 -->
      <div class="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start mb-4">
            <span class="text-xs font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-900">Backend Architecture</span>
            <span class="text-xs font-semibold text-emerald-400">3-Tier Clean Arch</span>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">FastAPI Enterprise API Series</h3>
          <p class="text-slate-400 text-sm mb-4 leading-relaxed">
            Progressive lab series evolving from prototype to layered production architecture with SQLAlchemy, Pydantic v2, JWT authentication, and Pytest coverage.
          </p>
          <div class="flex flex-wrap gap-1.5 mb-6">
            <span class="px-2 py-0.5 text-xs rounded bg-slate-800 text-slate-300">FastAPI</span>
            <span class="px-2 py-0.5 text-xs rounded bg-slate-800 text-slate-300">Python 3.11</span>
            <span class="px-2 py-0.5 text-xs rounded bg-slate-800 text-slate-300">SQLAlchemy</span>
            <span class="px-2 py-0.5 text-xs rounded bg-slate-800 text-slate-300">Pytest</span>
          </div>
        </div>
        <a href="https://github.com/asfawgedamu/api-design-fundamentals" target="_blank" class="text-sm font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
          Explore Repository <i class="fas fa-arrow-right text-xs"></i>
        </a>
      </div>

      <!-- Project 2 -->
      <div class="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start mb-4">
            <span class="text-xs font-mono uppercase tracking-wider text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded border border-rose-900">OpenReview Paper</span>
            <span class="text-xs font-semibold text-emerald-400">92.98% Accuracy</span>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Tigrinya Dialect Identification</h3>
          <p class="text-slate-400 text-sm mb-4 leading-relaxed">
            First systematic dataset and character-level CNN / BiLSTM benchmark for 3 regional Tigrinya text varieties (L, Z, D). Published in OpenReview (<a href="https://openreview.net/pdf?id=kiG8qiUFm2u" target="_blank" class="text-rose-400 underline">kiG8qiUFm2u</a>).
          </p>
          <div class="flex flex-wrap gap-1.5 mb-6">
            <span class="px-2 py-0.5 text-xs rounded bg-slate-800 text-slate-300">PyTorch</span>
            <span class="px-2 py-0.5 text-xs rounded bg-slate-800 text-slate-300">Character CNN</span>
            <span class="px-2 py-0.5 text-xs rounded bg-slate-800 text-slate-300">Low-Resource NLP</span>
          </div>
        </div>
        <div class="flex gap-4">
          <a href="https://github.com/asfawgedamu/Tigrinya-Dialect-Identification" target="_blank" class="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            Explore Code <i class="fas fa-arrow-right text-xs"></i>
          </a>
          <a href="https://openreview.net/pdf?id=kiG8qiUFm2u" target="_blank" class="text-sm font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1">
            Paper PDF <i class="fas fa-external-link-alt text-xs"></i>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Research Section -->
  <section id="research" class="max-w-5xl mx-auto px-6 py-16 border-t border-slate-800">
    <h2 class="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-white">Peer-Reviewed Research</h2>
    <p class="text-slate-400 mb-8 text-sm">Scientific contributions advancing African language technologies.</p>
    
    <div class="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
      <div class="flex justify-between items-start">
        <div>
          <span class="text-xs font-mono uppercase bg-rose-950 text-rose-300 border border-rose-900 px-2 py-0.5 rounded font-semibold">
            OpenReview Publication (kiG8qiUFm2u)
          </span>
          <h3 class="text-xl font-bold text-white mt-2">Tigrinya Dialect Identification</h3>
          <div class="text-xs text-slate-400 mt-1">Authors: Asfaw Gedamu Haileslasie, Asmelash Teka Hadgu, Solomon Teferra Abate</div>
        </div>
        <span class="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-900">92.98% Accuracy</span>
      </div>
      <p class="text-sm text-slate-300 leading-relaxed">
        Pioneering work establishing unified dialect taxonomies (Z, L, and D varieties) and the first annotated benchmark dataset for Tigrinya text dialect classification. Character-level Convolutional Neural Networks yielded peak performance of 92.98% on native Ge’ez script text.
      </p>
      <div class="pt-2 flex gap-4">
        <a href="https://openreview.net/pdf?id=kiG8qiUFm2u" target="_blank" class="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 transition">
          <i class="fas fa-file-pdf"></i> Read Paper PDF (OpenReview)
        </a>
        <a href="https://openreview.net/forum?id=kiG8qiUFm2u" target="_blank" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition">
          <i class="fas fa-comments"></i> OpenReview Forum
        </a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer id="contact" class="border-t border-slate-800 py-12 text-center text-slate-500 text-sm">
    <p class="mb-4">© 2026 Asfaw Gedamu • Version 2026</p>
    <div class="flex justify-center gap-6 text-slate-400">
      <a href="https://github.com/asfawgedamu" class="hover:text-white"><i class="fab fa-github"></i></a>
      <a href="https://linkedin.com/in/asfawgedamu" class="hover:text-white"><i class="fab fa-linkedin"></i></a>
      <a href="mailto:${USER_INFO.email}" class="hover:text-white"><i class="fas fa-envelope"></i></a>
    </div>
  </footer>
</body>
</html>`;
}
