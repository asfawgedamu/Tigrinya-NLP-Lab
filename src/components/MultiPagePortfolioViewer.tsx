import React, { useState } from 'react';
import { 
  Globe2, 
  ExternalLink, 
  Code2, 
  Eye, 
  Smartphone, 
  Tablet, 
  Monitor, 
  RefreshCw, 
  Sparkles, 
  FileText, 
  Check, 
  Copy, 
  ArrowRight,
  BookOpen,
  Briefcase,
  Layers,
  Terminal,
  Send,
  Printer
} from 'lucide-react';
import { PORTFOLIO_FILES, PortfolioPageFile, PORTFOLIO_CHANGELOG } from '../utils/multiPageFiles';
import { USER_INFO } from '../data/portfolioData';

interface MultiPagePortfolioViewerProps {
  onOpenDeploy: () => void;
  onOpenAudit: () => void;
}

export const MultiPagePortfolioViewer: React.FC<MultiPagePortfolioViewerProps> = ({
  onOpenDeploy,
  onOpenAudit
}) => {
  const [selectedFile, setSelectedFile] = useState<PortfolioPageFile>(PORTFOLIO_FILES[0]);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [codeContent, setCodeContent] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);

  const fetchCode = async (file: PortfolioPageFile) => {
    try {
      const url = file.previewPath || (file.path.startsWith('assets/') ? `/${file.path}` : `/${file.path}`);
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        setCodeContent(text);
      } else {
        setCodeContent(`<!-- File path: ${file.path} -->\n<!-- Select "Live Interactive Preview" to inspect -->`);
      }
    } catch {
      setCodeContent(`<!-- Could not fetch source for ${file.path} -->`);
    }
  };

  const handleSelectFile = (file: PortfolioPageFile) => {
    setSelectedFile(file);
    if (viewMode === 'code') {
      fetchCode(file);
    }
  };

  const handleSwitchToCode = () => {
    setViewMode('code');
    fetchCode(selectedFile);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeContent);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const refreshIframe = () => {
    setIframeKey(k => k + 1);
  };

  const viewportWidths = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[390px]'
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner: Acknowledging User's Update */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Updated Multi-Page Portfolio Active
            </span>
            <span className="text-xs text-slate-400 font-mono">v2026 • 5 Linked Pages + CV</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Explore & Verify Your Reorganized Portfolio Before Publishing
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            You can test all interactive elements right here: the Ge'ez Fidel script matrix, Work tabs & SVGs, live GitHub repository search, and contact form webhook.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenAudit}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pre-Publish Audit</span>
          </button>

          <button
            onClick={onOpenDeploy}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition hover:scale-105"
          >
            <span>Publish to GitHub Pages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Page Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-2 rounded-2xl border border-slate-800">
        
        {/* Linked Pages Picker */}
        <div className="flex items-center overflow-x-auto gap-1 scrollbar-none">
          {PORTFOLIO_FILES.filter(f => f.category === 'page').map((file) => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => handleSelectFile(file)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {file.path === 'index.html' && <Globe2 className="w-3.5 h-3.5" />}
                {file.path === 'work.html' && <Briefcase className="w-3.5 h-3.5" />}
                {file.path === 'resume.html' && <FileText className="w-3.5 h-3.5" />}
                {file.path === 'code.html' && <Terminal className="w-3.5 h-3.5" />}
                {file.path === 'contact.html' && <Send className="w-3.5 h-3.5" />}
                {file.path === 'cv.html' && <Printer className="w-3.5 h-3.5" />}
                <span>{file.name}</span>
              </button>
            );
          })}
        </div>

        {/* View Controls: Preview vs Code + Viewport Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Viewport switchers */}
          {viewMode === 'preview' && (
            <div className="hidden md:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewport === 'desktop' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewport === 'tablet' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  viewport === 'mobile' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Mobile View (390px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Toggle View Mode */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === 'preview' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={handleSwitchToCode}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                viewMode === 'code' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Source</span>
            </button>
          </div>

          {/* Open full page in new window */}
          {selectedFile.previewPath && (
            <a
              href={selectedFile.previewPath}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
              title="Open full page in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* Refresh iframe */}
          {viewMode === 'preview' && (
            <button
              onClick={refreshIframe}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
              title="Reload preview"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Main Interactive Screen */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Browser Mockup Header */}
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
            <span className="font-mono text-slate-500 ml-1">asfawgedamu.github.io/{selectedFile.path}</span>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            {selectedFile.description}
          </div>

          {viewMode === 'code' && (
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 transition"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Viewport Frame */}
        <div className="p-3 bg-slate-950/70 flex justify-center min-h-[640px]">
          {viewMode === 'preview' ? (
            <div className={`transition-all duration-300 ${viewportWidths[viewport]} bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-800/80`}>
              <iframe
                key={iframeKey}
                src={selectedFile.previewPath || '/portfolio-home.html'}
                title={selectedFile.name}
                className="w-full h-[760px] border-0"
              />
            </div>
          ) : (
            <div className="w-full h-[760px] overflow-auto rounded-xl bg-slate-950 p-4 border border-slate-800/80">
              <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
                {codeContent}
              </pre>
            </div>
          )}
        </div>

      </div>

      {/* Summary of What Changed In This Update */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-white text-base">
            What Changed in Your Multi-Page Portfolio Update
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {PORTFOLIO_CHANGELOG.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1"
            >
              <div className="text-xs font-bold text-cyan-300">
                {item.title}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {item.details}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
