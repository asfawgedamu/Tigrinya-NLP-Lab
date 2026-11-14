import React, { useState } from 'react';
import JSZip from 'jszip';
import { 
  Globe2, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Code2,
  FileText,
  FolderArchive,
  Layers,
  ChevronRight
} from 'lucide-react';
import { PORTFOLIO_FILES, PortfolioPageFile } from '../utils/multiPageFiles';
import { USER_INFO } from '../data/portfolioData';

export const PagesExporter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<PortfolioPageFile>(PORTFOLIO_FILES[0]);
  const [fileContent, setFileContent] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedAllCli, setCopiedAllCli] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const loadContent = async (file: PortfolioPageFile) => {
    setLoading(true);
    try {
      const fetchUrl = file.path === 'index.html' 
        ? '/portfolio-home.html' 
        : (file.previewPath || `/${file.path}`);
      const res = await fetch(fetchUrl);
      if (res.ok) {
        const text = await res.text();
        setFileContent(text);
      } else {
        setFileContent(`<!-- Content for ${file.path} ready to download -->`);
      }
    } catch {
      setFileContent(`<!-- Error reading ${file.path} -->`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadContent(selectedFile);
  }, [selectedFile]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const filename = selectedFile.path.split('/').pop() || selectedFile.path;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      for (const file of PORTFOLIO_FILES) {
        try {
          const fetchUrl = file.path === 'index.html' 
            ? '/portfolio-home.html' 
            : (file.previewPath || `/${file.path}`);
          const res = await fetch(fetchUrl);
          if (res.ok) {
            const text = await res.text();
            zip.file(file.path, text);
          }
        } catch (e) {
          console.error(`Could not fetch ${file.path}`, e);
        }
      }
      try {
        const homeRes = await fetch('/portfolio-home.html');
        if (homeRes.ok) {
          const homeText = await homeRes.text();
          zip.file('portfolio-home.html', homeText);
          zip.file('index.html', homeText);
        }
      } catch (e) {}

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'asfawgedamu-github-io-portfolio.zip';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const gitDeployScript = `# Step 1: Clone your portfolio repository
git clone https://github.com/asfawgedamu/asfawgedamu.github.io.git
cd asfawgedamu.github.io

# Step 2: Ensure branch is main
git checkout main

# Step 3: All 5 pages + assets are organized in the root directory:
# index.html, work.html, resume.html, code.html, contact.html, cv.html, 404.html
# assets/css/style.css, assets/js/main.js, assets/img/*

# Step 4: Commit and push
git add .
git commit -m "feat: deploy modern multi-page portfolio with Ge'ez Fidel & OpenReview research"
git push origin main

# Your site will be live at https://asfawgedamu.github.io/ within 60 seconds!`;

  const handleCopyCli = () => {
    navigator.clipboard.writeText(gitDeployScript);
    setCopiedAllCli(true);
    setTimeout(() => setCopiedAllCli(false), 2000);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 mb-2">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Multi-Page GitHub Pages Publishing Suite</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Deploy asfawgedamu.github.io
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Your portfolio is reorganized into separate but linked pages (Home, Work, Resume, Code, Contact, CV). Export any file or follow the 2-minute push steps below.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition hover:scale-105 disabled:opacity-50 cursor-pointer"
          >
            <FolderArchive className="w-4 h-4" />
            <span>{isZipping ? 'Generating ZIP...' : 'Download Entire Project ZIP'}</span>
          </button>

          <button
            onClick={handleDownloadSingle}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download {selectedFile.path.split('/').pop()}</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 flex items-center gap-1.5 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* File Selector Pills */}
      <div className="space-y-2">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
          Select File to Inspect & Download:
        </div>
        <div className="flex flex-wrap gap-1.5 bg-slate-900/90 p-2 rounded-2xl border border-slate-800">
          {PORTFOLIO_FILES.map((file) => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{file.path}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Instructions & Code Viewer */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: 2-Minute Deployment Instructions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card: Push Instructions */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Step-by-Step GitHub Pages Deployment</span>
            </h3>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div className="text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-white">Repository Name</div>
                  <div className="text-slate-400">
                    The repository must be named exactly <code className="text-cyan-400 font-mono">asfawgedamu.github.io</code>.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div className="text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-white">Root Directory Placement</div>
                  <div className="text-slate-400">
                    Place <code className="text-cyan-400 font-mono">index.html</code>, <code className="text-cyan-400 font-mono">work.html</code>, <code className="text-cyan-400 font-mono">resume.html</code>, <code className="text-cyan-400 font-mono">code.html</code>, <code className="text-cyan-400 font-mono">contact.html</code>, and <code className="text-cyan-400 font-mono">cv.html</code> in the repository root.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div className="text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-white">Assets Folder</div>
                  <div className="text-slate-400">
                    Keep <code className="text-cyan-400 font-mono">assets/css/style.css</code>, <code className="text-cyan-400 font-mono">assets/js/main.js</code>, and <code className="text-cyan-400 font-mono">assets/img/*</code> in their respective folders. Include <code className="text-cyan-400 font-mono">.nojekyll</code> so GitHub Pages serves raw files without Jekyll processing.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
                <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <div className="text-xs text-emerald-200 space-y-1">
                  <div className="font-semibold text-emerald-300">Live in 60 seconds</div>
                  <div>In GitHub repository Settings → Pages, set Source to <strong>"Deploy from a branch"</strong>, branch <strong>main</strong>, folder <strong>/ (root)</strong>.</div>
                </div>
              </div>
            </div>

            {/* Quick terminal script */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                  Git Terminal Command:
                </span>
                <button
                  onClick={handleCopyCli}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-semibold"
                >
                  {copiedAllCli ? 'Copied script!' : 'Copy commands'}
                </button>
              </div>

              <pre className="font-mono text-[11px] text-cyan-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80 overflow-x-auto leading-relaxed max-h-48">
                {gitDeployScript}
              </pre>
            </div>
          </div>

          {/* Direct link */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Production URL:</span>
            <a
              href="https://asfawgedamu.github.io"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 font-semibold flex items-center gap-1 hover:underline"
            >
              <span>asfawgedamu.github.io</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Right Column: Code & File Content Viewer (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
          <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs text-slate-300">
                asfawgedamu.github.io / {selectedFile.path}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadSingle}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 transition"
                title="Download this file"
              >
                <Download className="w-3 h-3 text-slate-400" />
                <span>Download</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 transition"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="p-6 max-h-[640px] overflow-y-auto">
            {loading ? (
              <div className="py-20 text-center font-mono text-xs text-slate-500">
                Loading {selectedFile.path}...
              </div>
            ) : (
              <pre className="font-mono text-xs text-slate-200 bg-slate-950 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap leading-relaxed select-all">
                {fileContent}
              </pre>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
