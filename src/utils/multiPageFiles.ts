export interface PortfolioPageFile {
  name: string;
  path: string;
  description: string;
  category: 'page' | 'style' | 'script' | 'meta';
  previewPath?: string;
}

export const PORTFOLIO_FILES: PortfolioPageFile[] = [
  {
    name: 'Home Page',
    path: 'index.html',
    description: 'Introduction, hero statement, 19+ years at Ethio Telecom, and interactive Ge’ez Fidel script chart.',
    category: 'page',
    previewPath: '/portfolio-home.html'
  },
  {
    name: 'Work Page',
    path: 'work.html',
    description: 'Selected work: Tigrinya Dialect Identification (OpenReview paper, BibTeX, dataset breakdown) and API Design Fundamentals (3-level architecture SVG diagrams).',
    category: 'page',
    previewPath: '/work.html'
  },
  {
    name: 'Resume Page',
    path: 'resume.html',
    description: 'Experience timeline (Tech Horizon Center of Excellence, 500+ engineers upskilled), education (MSc/BSc/BA), and verified skills with proof links.',
    category: 'page',
    previewPath: '/resume.html'
  },
  {
    name: 'Code Page',
    path: 'code.html',
    description: 'Live GitHub repository explorer with live search, language filter, include-forks toggle, and pushed-at sorting.',
    category: 'page',
    previewPath: '/code.html'
  },
  {
    name: 'Contact Page',
    path: 'contact.html',
    description: 'Direct contact form wired to Google Apps Script webhook with honeypot spam protection and social badges.',
    category: 'page',
    previewPath: '/contact.html'
  },
  {
    name: 'Printable CV',
    path: 'cv.html',
    description: 'Clean, printable single-page CV with print-to-PDF toolbar, education degrees, and career highlights.',
    category: 'page',
    previewPath: '/cv.html'
  },
  {
    name: '404 Error Page',
    path: '404.html',
    description: 'Accessible 404 page with return-to-home and work links.',
    category: 'page',
    previewPath: '/404.html'
  },
  {
    name: 'Stylesheet',
    path: 'assets/css/style.css',
    description: 'Bespoke typographic tokens (cool bone paper, deep green-black ink, rubric red, verdigris, dark theme, reduced motion rules).',
    category: 'style'
  },
  {
    name: 'Main JavaScript',
    path: 'assets/js/main.js',
    description: 'Fidel keyboard navigation, dark/light theme persistence, scrollspy, BibTeX copy, live GitHub repo fetching, and Google Apps Script submit handler.',
    category: 'script'
  },
  {
    name: 'Web App Manifest',
    path: 'site.webmanifest',
    description: 'PWA manifest for browser installation and icon references.',
    category: 'meta'
  },
  {
    name: 'XML Sitemap',
    path: 'sitemap.xml',
    description: 'Search engine sitemap with canonical URLs for all 6 pages.',
    category: 'meta'
  },
  {
    name: 'Robots.txt',
    path: 'robots.txt',
    description: 'Search engine crawler directives.',
    category: 'meta'
  }
];

export const PORTFOLIO_CHANGELOG = [
  {
    title: 'Separated Into 5 Linked Pages + Printable CV',
    details: 'Previously organized as a single page; now split into Home, Work, Resume, Code, Contact, and CV for clearer navigation and faster loading.'
  },
  {
    title: 'Interactive Ge’ez Script Fidel Matrix',
    details: 'Custom chart with hover, tap, and keyboard arrow navigation demonstrating character-level morphology foundational to your Tigrinya research.'
  },
  {
    title: 'Deep-Dive Disclosures on Selected Work',
    details: 'Tigrinya Dialect project features paper citation, one-click BibTeX copy, and full 2,964-sentence source breakdown. API Design series features 3-level interactive architecture diagrams.'
  },
  {
    title: 'Live GitHub API Repository Explorer',
    details: 'The Code page dynamically queries the GitHub API (with 10-minute session caching), providing instant name/topic search, language filtering, and an optional forks toggle.'
  },
  {
    title: 'Configured Google Apps Script Webhook',
    details: 'The contact form is hooked to your custom Google Apps Script endpoint to email inquiries directly to your Gmail without third-party branding.'
  },
  {
    title: 'Updated Career Milestones & Credentials',
    details: '19+ years at Ethio Telecom, Tech Horizon Center of Excellence, 500+ engineers upskilled in AI/ML/Cybersecurity/FinTech, and three degrees (MSc, BSc, BA).'
  }
];
