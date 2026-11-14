import React, { useState } from 'react';
import { DATABASE_SCRIPTS, TELEMETRY_HEALTH_METRICS, DatabaseScript } from '../../data/databaseScripts';
import { useTheme } from '../../context/ThemeContext';
import { Database, Activity, Cpu, HardDrive, ShieldCheck, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

export const DatabaseConsole: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedScript, setSelectedScript] = useState<DatabaseScript>(DATABASE_SCRIPTS[0]);
  const [engineFilter, setEngineFilter] = useState<'All' | 'Oracle 19c' | 'PostgreSQL 15+'>('All');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  const filteredScripts = DATABASE_SCRIPTS.filter((script) => {
    if (engineFilter === 'All') return true;
    return script.engine === engineFilter;
  });

  const handleCopySql = () => {
    navigator.clipboard.writeText(selectedScript.sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
        isDark ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className={`flex items-center gap-2 text-xs font-mono mb-2 ${
              isDark ? 'text-amber-400' : 'text-amber-700'
            }`}>
              <Database className="w-4 h-4" />
              <span>Enterprise Systems & Reliability</span>
              <span className="text-slate-400">·</span>
              <span>19+ Years Telecom DBA Engineering</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Enterprise Database Diagnostics & Performance Console
            </h1>
            <p className={`mt-2 text-sm sm:text-base max-w-3xl leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Production-hardened SQL and PL-SQL diagnostic scripts for Oracle 19c and PostgreSQL 15+. 
              Designed for root-cause bottleneck isolation, buffer cache optimization, lock tree resolution, 
              and automated replication health checks across high-throughput telecom subscriber databases.
            </p>
          </div>

          <a
            href="https://github.com/asfawgedamu/database"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs font-mono transition shadow-xs ${
              isDark ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            GitHub Repository
          </a>
        </div>

        {/* Live Telemetry Health Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-8">
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`flex items-center gap-2 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Cpu className="w-3.5 h-3.5 text-emerald-500" />
              <span>Buffer Cache Hit</span>
            </div>
            <div className={`text-2xl font-extrabold font-mono mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              {TELEMETRY_HEALTH_METRICS.cacheHitRatio}%
            </div>
            <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>SGA In-Memory Target</div>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`flex items-center gap-2 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Activity className={`w-3.5 h-3.5 ${isDark ? 'text-teal-400' : 'text-[#0A66C2]'}`} />
              <span>P99 Query Latency</span>
            </div>
            <div className={`text-2xl font-extrabold font-mono mt-1 ${isDark ? 'text-teal-300' : 'text-[#0A66C2]'}`}>
              {TELEMETRY_HEALTH_METRICS.p99QueryLatencyMs} ms
            </div>
            <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Normalized Latency</div>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`flex items-center gap-2 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <Database className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
              <span>Active Sessions</span>
            </div>
            <div className={`text-2xl font-extrabold font-mono mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {TELEMETRY_HEALTH_METRICS.activeSessions} <span className="text-xs text-slate-400 font-normal">/ {TELEMETRY_HEALTH_METRICS.maxConnections}</span>
            </div>
            <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Zero Blocking Locks</div>
          </div>

          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`flex items-center gap-2 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Replication Lag</span>
            </div>
            <div className={`text-2xl font-extrabold font-mono mt-1 ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
              {TELEMETRY_HEALTH_METRICS.replicationLagSec} s
            </div>
            <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Streaming WAL Sync</div>
          </div>

          <div className={`p-4 rounded-xl border col-span-2 sm:col-span-1 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`flex items-center gap-2 text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <HardDrive className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`} />
              <span>MVCC Bloat</span>
            </div>
            <div className={`text-2xl font-extrabold font-mono mt-1 ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
              {TELEMETRY_HEALTH_METRICS.tableBloatRatioPct}%
            </div>
            <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Autovacuum Tuned</div>
          </div>
        </div>
      </div>

      {/* Interactive Script Catalog & Live Inspection */}
      <section className={`p-6 sm:p-8 rounded-2xl border transition-colors space-y-6 ${
        isDark ? 'bg-slate-900/70 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Terminal className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
              Diagnostic Scripts & Performance Query Catalog
            </h2>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Inspect SQL execution patterns, problem root causes, and sample execution outputs.
            </p>
          </div>

          {/* Engine Filter Segmented Tabs */}
          <div className={`flex items-center gap-1 p-1 rounded-lg border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            {(['All', 'Oracle 19c', 'PostgreSQL 15+'] as const).map((eng) => (
              <button
                key={eng}
                onClick={() => setEngineFilter(eng)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                  engineFilter === eng 
                    ? isDark
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-white text-slate-900 font-bold shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {eng}
              </button>
            ))}
          </div>
        </div>

        {/* Script Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredScripts.map((script) => {
            const isSelected = selectedScript.id === script.id;
            return (
              <button
                key={script.id}
                onClick={() => setSelectedScript(script)}
                className={`p-4 rounded-xl text-left transition border cursor-pointer ${
                  isSelected 
                    ? isDark
                      ? 'bg-amber-950/40 border-amber-500 text-amber-100 ring-1 ring-amber-500/30 shadow-md' 
                      : 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-500/20 shadow-xs'
                    : isDark
                    ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className={`flex items-center justify-between text-xs font-mono mb-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <span>{script.engine}</span>
                  <span className={`text-[11px] ${isDark ? 'text-amber-400/80' : 'text-amber-700'}`}>{script.category}</span>
                </div>
                <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{script.title}</div>
                <p className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{script.description}</p>
                <div className={`mt-3 flex items-center justify-between text-[11px] font-mono pt-2 border-t ${
                  isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
                }`}>
                  <span>Run: {script.frequency}</span>
                  <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Inspect SQL &rarr;</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Script Code & Output Inspector */}
        <div className={`space-y-4 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className={`text-xs font-mono uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                {selectedScript.category}
              </span>
              <h3 className={`text-base font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedScript.title}</h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Problem solved: <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{selectedScript.problemSolved}</span>
              </p>
            </div>

            <button
              onClick={handleCopySql}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
              }`}
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSql ? 'Copied' : 'Copy SQL'}
            </button>
          </div>

          {/* SQL Syntax Window */}
          <pre className={`p-4 rounded-xl border text-xs font-mono overflow-x-auto leading-relaxed ${
            isDark ? 'bg-slate-950 border-slate-800 text-amber-200/90' : 'bg-[#F9FAFB] border-slate-200 text-amber-900'
          }`}>
            {selectedScript.sql}
          </pre>

          {/* Diagnostic Execution Output Table */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`text-xs font-mono flex items-center justify-between ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <span>Expected Diagnostic Output:</span>
              <span className="text-emerald-600 dark:text-emerald-400">Execution time: ~0.04s</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className={`border-b uppercase ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                    {Object.keys(selectedScript.expectedOutput[0] || {}).map((col) => (
                      <th key={col} className="py-2 px-3">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-200/60'}`}>
                  {selectedScript.expectedOutput.map((row, idx) => (
                    <tr key={idx} className={isDark ? 'text-slate-300 hover:bg-slate-900/50' : 'text-slate-700 hover:bg-white'}>
                      {Object.values(row).map((val, cidx) => (
                        <td key={cidx} className="py-2.5 px-3 whitespace-nowrap">
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={`pt-2 border-t text-xs ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
              <strong className={`font-mono ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>DBA Tuning Advice: </strong>
              {selectedScript.optimizationAdvice}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
