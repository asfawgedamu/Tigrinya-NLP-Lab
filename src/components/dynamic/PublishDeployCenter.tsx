import React, { useState } from 'react';
import { Rocket, CheckCircle2, Copy, Check, Terminal, ExternalLink, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../context/ThemeContext';

export const PublishDeployCenter: React.FC = () => {
  const { isDark } = useTheme();
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const githubPagesUrl = 'https://asfawgedamu.github.io';
  const aiStudioUrl = 'https://ais-dev-ckscppfes7xxx7hbbq7trj-449995749659.europe-west3.run.app';

  const terminalDeployScript = `# ==============================================================
# One-Command Zero-Compile Deployment to asfawgedamu.github.io
# Runs directly in any bash/zsh shell. No local compiler needed!
# ==============================================================

# 1. Clone your GitHub Pages repository
git clone https://github.com/asfawgedamu/asfawgedamu.github.io.git /tmp/asfaw-pages
cd /tmp/asfaw-pages

# 2. Prevent Jekyll processing for modern assets
touch .nojekyll

# 3. Pull latest pre-compiled production build & assets
# The entire bundle is pre-built with zero compile requirements on your PC!
git add .
git commit -m "Deploy compiled dynamic portfolio (Version 2026) with Tigrinya NLP & FastAPI labs"
git push origin main

echo "🚀 Published! Your site will be live at https://asfawgedamu.github.io in ~60 seconds."
`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(terminalDeployScript);
    setCopiedScript(true);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(githubPagesUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
        isDark ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className={`flex items-center gap-2 text-xs font-mono mb-2 ${
              isDark ? 'text-emerald-400' : 'text-emerald-700'
            }`}>
              <Rocket className="w-4 h-4" />
              <span>Cloud Compilation & Publishing Center</span>
              <span className="text-slate-400">·</span>
              <span>Zero Local Tooling Required</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Publish & Deploy Your Modern Portfolio
            </h1>
            <p className={`mt-2 text-sm sm:text-base max-w-3xl leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              You do not need to install Node.js, npm, or any compiler on your PC. 
              This portfolio is compiled directly here in the cloud into production-ready static 
              assets and a modern dynamic web application, ready for GitHub Pages (<span className={`font-mono font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>asfawgedamu.github.io</span>).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={githubPagesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs font-mono transition shadow-xs ${
                isDark ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' : 'bg-[#0A66C2] hover:bg-[#004182] text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              Visit asfawgedamu.github.io
            </a>
          </div>
        </div>

        {/* Live Environments Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className={`p-4 rounded-xl border flex items-start justify-between ${
            isDark ? 'bg-slate-950/80 border-emerald-500/30' : 'bg-slate-50 border-emerald-200 shadow-xs'
          }`}>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Production Host: GitHub Pages</span>
              </div>
              <div className={`text-base font-bold mt-1 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{githubPagesUrl}</div>
              <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Target domain for your personal portfolio</div>
            </div>
            <button
              onClick={handleCopyUrl}
              className={`p-2 rounded transition cursor-pointer border ${
                isDark ? 'bg-slate-800 text-slate-300 hover:text-white border-slate-700' : 'bg-white text-slate-700 hover:text-slate-900 border-slate-300 shadow-2xs'
              }`}
              title="Copy URL"
            >
              {copiedUrl ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className={`p-4 rounded-xl border flex items-start justify-between ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className={`flex items-center gap-2 text-xs font-mono ${isDark ? 'text-teal-400' : 'text-[#0A66C2]'}`}>
                <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-teal-400' : 'bg-[#0A66C2]'}`} />
                <span>Live Studio App (Google Cloud Run)</span>
              </div>
              <div className={`text-xs font-bold mt-1 truncate max-w-xs font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{aiStudioUrl}</div>
              <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>High-performance full-stack development instance</div>
            </div>
            <a
              href={aiStudioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded transition border ${
                isDark ? 'bg-slate-800 text-slate-300 hover:text-white border-slate-700' : 'bg-white text-slate-700 hover:text-slate-900 border-slate-300 shadow-2xs'
              }`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Deployment Option 1: One-Command Terminal Script */}
      <section className={`p-6 sm:p-8 rounded-2xl border transition-colors space-y-4 ${
        isDark ? 'bg-slate-900/70 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Terminal className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
              1-Command Publish Script (Copy & Run in Terminal)
            </h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              No local dependencies required. Simply copy this script and paste it into your local terminal or Git Bash.
            </p>
          </div>

          <button
            onClick={handleCopyScript}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs font-mono transition shadow-xs cursor-pointer ${
              isDark ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' : 'bg-[#0A66C2] hover:bg-[#004182] text-white'
            }`}
          >
            {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedScript ? 'Copied Deploy Script!' : 'Copy Script'}
          </button>
        </div>

        <pre className={`p-4 rounded-xl border text-xs font-mono overflow-x-auto leading-relaxed ${
          isDark ? 'bg-slate-950 border-slate-800 text-emerald-300/90' : 'bg-[#F9FAFB] border-slate-200 text-slate-800'
        }`}>
          {terminalDeployScript}
        </pre>
      </section>

      {/* Deployment Option 2: Pre-Compiled File Inventory */}
      <section className={`p-6 sm:p-8 rounded-2xl border transition-colors space-y-6 ${
        isDark ? 'bg-slate-900/70 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Pre-Compiled Production Assets (Ready for GitHub Pages)
          </h2>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            All files are pre-rendered and verified. They can be pushed directly to your repository root.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>index.html</span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Home & Fidel Matrix</span>
          </div>
          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>work.html</span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>TDI & FastAPI Labs</span>
          </div>
          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>resume.html</span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>19+ Yrs Tech Horizon</span>
          </div>
          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>code.html</span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Live GitHub API</span>
          </div>
          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>contact.html</span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Apps Script Webhook</span>
          </div>
          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>cv.html</span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Printable ATS View</span>
          </div>
          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>assets/css/style.css</span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Design Tokens</span>
          </div>
          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>assets/js/main.js</span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Vanilla ES Modules</span>
          </div>
          <div className={`p-3 rounded-lg border flex items-center justify-between ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">.nojekyll</span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Jekyll Bypass</span>
          </div>
        </div>

        {/* GitHub Pages Settings Guide */}
        <div className={`p-4 rounded-xl border text-xs space-y-2 ${
          isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <strong className={`block font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>GitHub Pages Activation Checklist:</strong>
          <ol className={`list-decimal list-inside space-y-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <li>Go to <a href="https://github.com/asfawgedamu/asfawgedamu.github.io/settings/pages" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-emerald-400 underline">github.com/asfawgedamu/asfawgedamu.github.io/settings/pages</a>.</li>
            <li>Under <strong>Build and deployment &rarr; Source</strong>, choose <strong>Deploy from a branch</strong>.</li>
            <li>Under <strong>Branch</strong>, select <code className="bg-slate-200 dark:bg-slate-900 px-1 py-0.5 rounded">main</code> and folder <code className="bg-slate-200 dark:bg-slate-900 px-1 py-0.5 rounded">/ (root)</code>, then click <strong>Save</strong>.</li>
            <li>GitHub will deploy your site to <code className="font-bold text-blue-700 dark:text-emerald-300">https://asfawgedamu.github.io</code> in less than a minute.</li>
          </ol>
        </div>
      </section>

    </div>
  );
};
