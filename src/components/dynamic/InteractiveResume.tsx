import React from 'react';
import { USER_INFO } from '../../data/portfolioData';
import { useTheme } from '../../context/ThemeContext';
import { Briefcase, GraduationCap, Award, Printer, CheckCircle, ChevronRight, TrendingUp } from 'lucide-react';

export const InteractiveResume: React.FC = () => {
  const { isDark } = useTheme();

  const competencies = [
    { name: 'Low-Resource NLP & Deep Learning', category: 'AI/ML', highlight: 'Character-level CNNs, BiLSTM, 92.98% benchmark' },
    { name: 'FastAPI Clean & Layered Architecture', category: 'Backend', highlight: 'Pydantic v2, JWT/OAuth2, dependency injection, Pytest' },
    { name: 'Database Administration (Oracle & PostgreSQL)', category: 'Database', highlight: 'AWR/ASH, query tuning, lock tree triage, MVCC bloat' },
    { name: 'Information Systems Security & Governance', category: 'Security', highlight: 'Role-based access, threat modeling, telecom security policies' },
    { name: 'Technical Leadership & Enterprise Upskilling', category: 'Leadership', highlight: '500+ professionals trained at Tech Horizon CoE' },
    { name: 'High-Throughput Distributed Microservices', category: 'Backend', highlight: 'Asynchronous event loops, RESTful contract design, Docker' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={isDark ? "max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10 text-slate-100" : "max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10 text-slate-900"}>
      
      {/* Header & Print Bar */}
      <div className={isDark ? "p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 shadow-xl" : "p-6 sm:p-8 rounded-2xl border border-slate-300 bg-white backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 shadow-xl"}>
        <div>
          <div className={isDark ? "text-xs font-mono mb-1 text-cyan-400 tracking-wider uppercase" : "text-xs font-mono mb-1 text-cyan-700 tracking-wider uppercase"}>
            Curriculum Vitae & Technical Experience
          </div>
          <h1 className={isDark ? "text-3xl sm:text-4xl font-extrabold tracking-tight text-white" : "text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900"}>
            {USER_INFO.name}
          </h1>
          <p className={isDark ? "text-sm sm:text-base mt-1 max-w-2xl font-medium text-slate-300" : "text-sm sm:text-base mt-1 max-w-2xl font-medium text-slate-700"}>
            {USER_INFO.role}
          </p>
        </div>

        <button
          onClick={handlePrint}
          className={isDark ? "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-xs font-mono transition border bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 cursor-pointer shadow-md" : "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-xs font-mono transition border bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 cursor-pointer shadow-md"}
        >
          <Printer className={isDark ? "w-4 h-4 text-cyan-400" : "w-4 h-4 text-cyan-700"} />
          Print / Save as PDF
        </button>
      </div>

      {/* Recruiter Executive Summary Card */}
      <section className={isDark ? "p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl space-y-3 shadow-xl" : "p-6 rounded-2xl border border-slate-300 bg-white backdrop-blur-xl space-y-3 shadow-xl"}>
        <div className={isDark ? "flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-semibold text-cyan-400" : "flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-semibold text-cyan-700"}>
          <Award className={isDark ? "w-4 h-4 text-cyan-400" : "w-4 h-4 text-cyan-700"} />
          <span>Executive Summary & Impact</span>
        </div>
        <p className={isDark ? "text-sm leading-relaxed text-slate-200" : "text-sm leading-relaxed text-slate-800"}>
          {USER_INFO.recruiterPitch}
        </p>
        <div className={isDark ? "grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs font-mono" : "grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-300 text-xs font-mono"}>
          <div>
            <span className={isDark ? "text-slate-400 block" : "text-slate-600 block"}>Engineers Upskilled:</span>
            <span className={isDark ? "font-bold text-sm text-emerald-400" : "font-bold text-sm text-emerald-700"}>500+ Devs</span>
          </div>
          <div>
            <span className={isDark ? "text-slate-400 block" : "text-slate-600 block"}>NLP Benchmark:</span>
            <span className={isDark ? "font-bold text-sm text-cyan-400" : "font-bold text-sm text-cyan-700"}>92.98% Acc</span>
          </div>
          <div>
            <span className={isDark ? "text-slate-400 block" : "text-slate-600 block"}>Primary Institution:</span>
            <span className={isDark ? "font-bold text-sm text-white" : "font-bold text-sm text-slate-900"}>Ethio Telecom CoE</span>
          </div>
        </div>
      </section>

      {/* Professional Experience Timeline */}
      <section className={isDark ? "p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl space-y-6 shadow-xl" : "p-6 sm:p-8 rounded-2xl border border-slate-300 bg-white backdrop-blur-xl space-y-6 shadow-xl"}>
        <h2 className={isDark ? "text-lg font-bold flex items-center gap-2 text-white" : "text-lg font-bold flex items-center gap-2 text-slate-900"}>
          <Briefcase className={isDark ? "w-5 h-5 text-cyan-400" : "w-5 h-5 text-cyan-700"} />
          Professional Experience
        </h2>

        <div className={isDark ? "space-y-6 border-l-2 border-slate-800 pl-4 sm:pl-6 ml-2" : "space-y-6 border-l-2 border-slate-300 pl-4 sm:pl-6 ml-2"}>
          {/* Role 1 */}
          <div className="relative group">
            <div className={isDark ? "absolute -left-[25px] sm:-left-[33px] top-1.5 w-3.5 h-3.5 rounded-full ring-4 bg-cyan-400 ring-slate-950" : "absolute -left-[25px] sm:-left-[33px] top-1.5 w-3.5 h-3.5 rounded-full ring-4 bg-cyan-400 ring-white"} />
            
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className={isDark ? "text-base font-bold text-white" : "text-base font-bold text-slate-900"}>
                Information Systems &amp; Security Training Expert / Technical Lead
              </h3>
              <span className={isDark ? "text-xs font-mono text-cyan-400" : "text-xs font-mono text-cyan-700"}>2021 — Present</span>
            </div>

            <div className={isDark ? "text-xs font-medium mt-0.5 text-slate-400" : "text-xs font-medium mt-0.5 text-slate-600"}>
              Ethio Telecom, Tech Horizon Center of Excellence (formerly TExA) · Addis Ababa, Ethiopia
            </div>

            <ul className={isDark ? "mt-3 space-y-2 text-xs leading-relaxed text-slate-300" : "mt-3 space-y-2 text-xs leading-relaxed text-slate-700"}>
              <li className="flex items-start gap-2">
                <ChevronRight className={isDark ? "w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" : "w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-700"} />
                <span>
                  Spearhead the technical curriculum and hands-on laboratory upskilling for <strong className={isDark ? "text-white" : "text-slate-900"}>500+ engineers, architects, and developers</strong> across enterprise AI/ML, deep neural networks, cybersecurity protocols, and FinTech backend infrastructure.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className={isDark ? "w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" : "w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-700"} />
                <span>
                  Designed and authored the <strong className={isDark ? "text-white" : "text-slate-900"}>API Design Fundamentals</strong> 3-tier evolutionary lab series, transforming development teams from single-file endpoint builders into clean hexagonal architecture specialists.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className={isDark ? "w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" : "w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-700"} />
                <span>
                  Conducted research on Ethiopic natural language processing, publishing the <strong className={isDark ? "text-white" : "text-slate-900"}>Tigrinya Dialect Identification benchmark (OpenReview: kiG8qiUFm2u)</strong> achieving 92.98% accuracy.
                </span>
              </li>
            </ul>
          </div>

          {/* Role 2 */}
          <div className="relative group">
            <div className={isDark ? "absolute -left-[25px] sm:-left-[33px] top-1.5 w-3.5 h-3.5 rounded-full ring-4 bg-slate-600 ring-slate-950" : "absolute -left-[25px] sm:-left-[33px] top-1.5 w-3.5 h-3.5 rounded-full ring-4 bg-slate-400 ring-white"} />
            
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className={isDark ? "text-base font-bold text-white" : "text-base font-bold text-slate-900"}>
                Senior Database Administrator &amp; Systems Engineer
              </h3>
              <span className={isDark ? "text-xs font-mono text-slate-400" : "text-xs font-mono text-slate-600"}>2007 — 2021</span>
            </div>

            <div className={isDark ? "text-xs font-medium mt-0.5 text-slate-400" : "text-xs font-medium mt-0.5 text-slate-600"}>
              Ethio Telecom · Enterprise Operations &amp; Infrastructure
            </div>

            <ul className={isDark ? "mt-3 space-y-2 text-xs leading-relaxed text-slate-300" : "mt-3 space-y-2 text-xs leading-relaxed text-slate-700"}>
              <li className="flex items-start gap-2">
                <ChevronRight className={isDark ? "w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" : "w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-700"} />
                <span>
                  Managed, optimized, and automated high-throughput mission-critical Oracle 19c and PostgreSQL database clusters supporting millions of subscriber transactions.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className={isDark ? "w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" : "w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-700"} />
                <span>
                  Authored 15 automated SQL/PL-SQL diagnostic suites for real-time buffer cache hit monitoring (&gt;99%), blocking lock tree resolution, and index bloat mitigation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className={isDark ? "w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-400" : "w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-cyan-700"} />
                <span>
                  Maintained strict 99.99% system availability SLAs across core telecommunication business systems.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Education Credentials */}
      <section className={isDark ? "p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl space-y-4 shadow-xl" : "p-6 sm:p-8 rounded-2xl border border-slate-300 bg-white backdrop-blur-xl space-y-4 shadow-xl"}>
        <h2 className={isDark ? "text-lg font-bold flex items-center gap-2 text-white" : "text-lg font-bold flex items-center gap-2 text-slate-900"}>
          <GraduationCap className={isDark ? "w-5 h-5 text-cyan-400" : "w-5 h-5 text-cyan-700"} />
          Education &amp; Academic Background
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={isDark ? "p-4 rounded-xl border border-slate-800 bg-slate-950" : "p-4 rounded-xl border border-slate-300 bg-slate-50"}>
            <div className={isDark ? "text-sm font-bold text-white" : "text-sm font-bold text-slate-900"}>MSc, Information Science</div>
            <div className={isDark ? "text-xs mt-1 font-mono text-cyan-400" : "text-xs mt-1 font-mono text-cyan-700"}>Graduate Degree</div>
            <div className={isDark ? "text-xs mt-2 text-slate-300" : "text-xs mt-2 text-slate-700"}>
              Focus on Information Retrieval, Computational Linguistics, and Data Architecture.
            </div>
          </div>

          <div className={isDark ? "p-4 rounded-xl border border-slate-800 bg-slate-950" : "p-4 rounded-xl border border-slate-300 bg-slate-50"}>
            <div className={isDark ? "text-sm font-bold text-white" : "text-sm font-bold text-slate-900"}>BSc, Computer Science</div>
            <div className={isDark ? "text-xs mt-1 font-mono text-cyan-400" : "text-xs mt-1 font-mono text-cyan-700"}>Undergraduate Degree</div>
            <div className={isDark ? "text-xs mt-2 text-slate-300" : "text-xs mt-2 text-slate-700"}>
              Algorithms, Data Structures, Relational Database Management &amp; Distributed Systems.
            </div>
          </div>

          <div className={isDark ? "p-4 rounded-xl border border-slate-800 bg-slate-950" : "p-4 rounded-xl border border-slate-300 bg-slate-50"}>
            <div className={isDark ? "text-sm font-bold text-white" : "text-sm font-bold text-slate-900"}>BA, Journalism &amp; Communications</div>
            <div className={isDark ? "text-xs mt-1 font-mono text-amber-400" : "text-xs mt-1 font-mono text-amber-700"}>Undergraduate Degree</div>
            <div className={isDark ? "text-xs mt-2 text-slate-300" : "text-xs mt-2 text-slate-700"}>
              Linguistic Analysis, Technical Communication, Media Strategy &amp; Professional Training.
            </div>
          </div>
        </div>
      </section>

      {/* Core Competencies Matrix */}
      <section className={isDark ? "p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl space-y-4 shadow-xl" : "p-6 sm:p-8 rounded-2xl border border-slate-300 bg-white backdrop-blur-xl space-y-4 shadow-xl"}>
        <h2 className={isDark ? "text-lg font-bold flex items-center gap-2 text-white" : "text-lg font-bold flex items-center gap-2 text-slate-900"}>
          <Award className={isDark ? "w-5 h-5 text-cyan-400" : "w-5 h-5 text-cyan-700"} />
          Core Technical Competencies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {competencies.map((comp, idx) => (
            <div key={idx} className={isDark ? "p-3.5 rounded-xl border border-slate-800 bg-slate-950 flex items-start gap-3" : "p-3.5 rounded-xl border border-slate-300 bg-slate-50 flex items-start gap-3"}>
              <CheckCircle className={isDark ? "w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-400" : "w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-700"} />
              <div>
                <div className={isDark ? "text-sm font-semibold text-white" : "text-sm font-semibold text-slate-900"}>{comp.name}</div>
                <div className={isDark ? "text-xs mt-0.5 text-slate-300" : "text-xs mt-0.5 text-slate-700"}>{comp.highlight}</div>
                <span className={isDark ? "text-[10px] font-mono mt-1 block text-cyan-400" : "text-[10px] font-mono mt-1 block text-cyan-700"}>
                  Category: {comp.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
