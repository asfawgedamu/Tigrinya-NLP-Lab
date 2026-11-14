import React, { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  ExternalLink, 
  Building2, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Copy, 
  Check, 
  FileText,
  Quote,
  Sparkles
} from 'lucide-react';
import { PUBLICATIONS, WORK_EXPERIENCE, Publication } from '../data/portfolioData';

export const PublicationsExperience: React.FC = () => {
  const [copiedBibtexId, setCopiedBibtexId] = useState<string | null>(null);

  const getBibtex = (pub: Publication) => {
    return `@inproceedings{haileslasie2024tigrinya,
  title={${pub.title}},
  author={${pub.authors.join(' and ')}},
  booktitle={OpenReview},
  year={${pub.year}},
  url={${pub.url || 'https://openreview.net/pdf?id=kiG8qiUFm2u'}}
}`;
  };

  const handleCopyBibtex = (pub: Publication) => {
    navigator.clipboard.writeText(getBibtex(pub));
    setCopiedBibtexId(pub.id);
    setTimeout(() => setCopiedBibtexId(null), 2000);
  };

  return (
    <section id="research" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      
      <div className="grid lg:grid-cols-12 gap-12">
        
        {/* Left Column: Publications & Scientific Impact (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/60 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-rose-400" />
              <span>Peer-Reviewed Scientific Research</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Publications & Language AI
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Peer-reviewed research published in OpenReview (<a href="https://openreview.net/pdf?id=kiG8qiUFm2u" target="_blank" rel="noreferrer" className="text-rose-400 font-mono underline">kiG8qiUFm2u</a>) advancing computational linguistics for Ethiopian languages.
            </p>
          </div>

          <div className="space-y-4">
            {PUBLICATIONS.map((pub) => (
              <div
                key={pub.id}
                className="p-6 rounded-2xl border border-rose-900/60 bg-gradient-to-br from-slate-900 via-slate-900/90 to-rose-950/20 hover:border-rose-500/50 transition-all space-y-4 shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-900 font-bold inline-flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-rose-400" />
                      <span>{pub.impactBadge}</span>
                    </span>
                    <h3 className="text-lg font-bold text-white hover:text-rose-300 transition-colors">
                      {pub.title}
                    </h3>
                  </div>

                  <span className="text-xs font-mono text-slate-400 font-bold bg-slate-950 px-2.5 py-1 rounded border border-slate-800 shrink-0">
                    {pub.year}
                  </span>
                </div>

                <div className="text-xs font-medium text-slate-300">
                  <span className="text-slate-500">Authors: </span>
                  <strong className="text-slate-200">{pub.authors.join(', ')}</strong>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {pub.summary}
                </p>

                <div className="text-xs text-slate-400 font-mono">
                  <span className="text-slate-500">Venue: </span>
                  <span className="text-rose-300 font-semibold">{pub.venue}</span>
                  <span className="text-slate-500"> • ID: </span>
                  <code className="text-cyan-400">kiG8qiUFm2u</code>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {pub.topics.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <a
                      href="https://openreview.net/pdf?id=kiG8qiUFm2u"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Read Paper PDF</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <a
                      href="https://openreview.net/forum?id=kiG8qiUFm2u"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
                    >
                      <span>OpenReview Forum</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>

                  <button
                    onClick={() => handleCopyBibtex(pub)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition border border-slate-700"
                    title="Copy BibTeX citation"
                  >
                    {copiedBibtexId === pub.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-sans">BibTeX Copied!</span>
                      </>
                    ) : (
                      <>
                        <Quote className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-sans">Copy BibTeX</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Professional Experience Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Career & Systems Leadership</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Professional Journey
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Enterprise engineering, telecommunications, and capacity building.
            </p>
          </div>

          <div className="relative border-l-2 border-slate-800 ml-3 pl-6 space-y-8">
            {WORK_EXPERIENCE.map((exp, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-cyan-400 group-hover:scale-125 transition-transform" />

                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-cyan-400 font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{exp.period}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {exp.title}
                  </h3>

                  <div className="text-xs font-medium text-slate-300">
                    {exp.company}
                  </div>
                </div>

                <ul className="mt-3 space-y-2 text-xs text-slate-400">
                  {exp.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
