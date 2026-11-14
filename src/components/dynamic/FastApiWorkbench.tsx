import React, { useState } from 'react';
import { Layers, CheckCircle2, Play, RefreshCw, Terminal, ExternalLink } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  level: 1 | 2 | 3;
  requestBody?: object;
  responseBody: object;
  statusCode: number;
  layersHit: string[];
}

export const FastApiWorkbench: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3>(3);
  const [activeEndpointId, setActiveEndpointId] = useState<string>('l3-subscribers');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionStep, setExecutionStep] = useState<number>(-1);
  const [responseOutput, setResponseOutput] = useState<{
    status: number;
    latencyMs: number;
    headers: Record<string, string>;
    data: object;
  } | null>({
    status: 201,
    latencyMs: 14.2,
    headers: {
      'content-type': 'application/json',
      'x-process-time-ms': '14.20',
      'server': 'uvicorn-asgi'
    },
    data: {
      id: 'sub_9942a',
      msisdn: '+251911223344',
      tier: 'enterprise-fiber',
      status: 'active',
      created_at: '2026-10-29T07:22:15Z',
      verified_by: 'jwt-rsa256'
    }
  });

  const endpoints: ApiEndpoint[] = [
    {
      id: 'l1-items',
      method: 'GET',
      path: '/items',
      description: 'Single-file in-memory list retrieval',
      level: 1,
      statusCode: 200,
      layersHit: ['FastAPI Handler', 'In-Memory Dict'],
      responseBody: [
        { id: 1, name: 'Tigrinya Grammatical Lexicon', price: 45.0 },
        { id: 2, name: 'FastAPI Architecture Manual', price: 60.0 }
      ]
    },
    {
      id: 'l2-items-pydantic',
      method: 'POST',
      path: '/api/v1/items',
      description: 'Pydantic v2 schema validated insertion into SQLite with ORM',
      level: 2,
      requestBody: { name: 'Oracle 19c Tuning Handbook', price: 85.5 },
      statusCode: 201,
      layersHit: ['CORS Middleware', 'APIRouter', 'Pydantic Validator', 'SQLite Session'],
      responseBody: {
        id: 3,
        name: 'Oracle 19c Tuning Handbook',
        price: 85.5,
        created_at: '2026-10-29T07:23:01Z'
      }
    },
    {
      id: 'l3-subscribers',
      method: 'POST',
      path: '/api/v1/subscribers',
      description: 'Clean Hexagonal Architecture with JWT auth, domain entity, and repository',
      level: 3,
      requestBody: { msisdn: '+251911223344', plan: 'enterprise-fiber' },
      statusCode: 201,
      layersHit: ['Timing Middleware', 'JWT Bearer Auth', 'SubscriberRouter', 'SubscriberService (Domain)', 'SubscriberRepository', 'PostgreSQL Pool'],
      responseBody: {
        id: 'sub_9942a',
        msisdn: '+251911223344',
        tier: 'enterprise-fiber',
        status: 'active',
        created_at: '2026-10-29T07:22:15Z',
        verified_by: 'jwt-rsa256'
      }
    },
    {
      id: 'l3-metrics',
      method: 'GET',
      path: '/api/v1/metrics',
      description: 'Prometheus-compatible real-time performance telemetry',
      level: 3,
      statusCode: 200,
      layersHit: ['Timing Middleware', 'API Key Guard', 'MetricsRouter', 'TelemetryEngine'],
      responseBody: {
        uptime_seconds: 864200,
        requests_total: 1489201,
        p99_latency_ms: 12.8,
        active_db_connections: 42
      }
    }
  ];

  const currentEndpoint = endpoints.find(e => e.id === activeEndpointId) || endpoints[2];

  const handleSimulateRequest = () => {
    setIsExecuting(true);
    setExecutionStep(0);

    const layers = currentEndpoint.layersHit;
    let step = 0;

    const interval = setInterval(() => {
      step += 1;
      setExecutionStep(step);

      if (step >= layers.length) {
        clearInterval(interval);
        setIsExecuting(false);
        setResponseOutput({
          status: currentEndpoint.statusCode,
          latencyMs: +(Math.random() * 8 + 8).toFixed(2),
          headers: {
            'content-type': 'application/json',
            'x-process-time-ms': `${(Math.random() * 8 + 8).toFixed(2)}`,
            'server': 'uvicorn-asgi'
          },
          data: currentEndpoint.responseBody
        });
      }
    }, 280);
  };

  const levelInfo = {
    1: {
      title: 'Level 1: Basic (Port 8000)',
      focus: 'Single-file CRUD & In-Memory Store',
      analogy: 'Small Food Truck: Cook, cashier, and storehouse are in one single counter.',
      features: ['Single main.py entry point', 'In-memory dict storage', 'FastAPI Path & Query parameters', 'Auto-generated Swagger /docs'],
      githubPath: 'basic/'
    },
    2: {
      title: 'Level 2: Intermediate (Port 8001)',
      focus: 'Modular Routing, Pydantic v2 & SQLite Persistence',
      analogy: 'Casual Bistro: Dedicated waiter (Router), separate kitchen staff (Schemas), and walk-in pantry (SQLite DB).',
      features: ['Modular APIRouter structure', 'Strict Pydantic v2 request/response validation', 'SQLAlchemy async engine with SQLite', 'CORS & Global error handlers'],
      githubPath: 'intermediate/'
    },
    3: {
      title: 'Level 3: Enterprise (Port 8002)',
      focus: 'Hexagonal Clean Architecture, JWT & Pytest Test Automation',
      analogy: 'Enterprise Michelin Restaurant: Dedicated front desk, certified sommelier (Auth Guard), executive chef (Domain Services), and supplier contract (Repository pattern).',
      features: ['Domain-Driven Layered separation', 'JWT Bearer & API Key authentication', 'Structured logging & timing middleware', 'Repository Pattern isolating DB logic', 'Full automated Pytest suite'],
      githubPath: 'advanced/'
    }
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
              isDark ? 'text-indigo-400' : 'text-[#0A66C2]'
            }`}>
              <Layers className="w-4 h-4" />
              <span>Production Backend Engineering</span>
              <span className="text-slate-400">·</span>
              <span>api-design-fundamentals</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              API Design Fundamentals: 3-Level Architecture
            </h1>
            <p className={`mt-2 text-sm sm:text-base max-w-3xl leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              A hands-on, progressive lab series designed to transform developers from API consumers into 
              architecture-aware enterprise backend engineers. From a single-file prototype to modular 
              Clean Hexagonal Architecture with automated testing.
            </p>
          </div>

          <a
            href="https://github.com/asfawgedamu/api-design-fundamentals"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs font-mono transition shadow-xs ${
              isDark ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-[#0A66C2] hover:bg-[#004182] text-white'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            GitHub Repository
          </a>
        </div>

        {/* 3 Evolutionary Levels Switcher */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
          {[1, 2, 3].map((lvl) => {
            const isSelected = selectedLevel === lvl;
            const info = levelInfo[lvl as 1 | 2 | 3];
            return (
              <button
                key={lvl}
                onClick={() => {
                  setSelectedLevel(lvl as 1 | 2 | 3);
                  const matchingEp = endpoints.find(e => e.level === lvl);
                  if (matchingEp) setActiveEndpointId(matchingEp.id);
                }}
                className={`p-4 rounded-xl text-left transition border cursor-pointer ${
                  isSelected 
                    ? isDark
                      ? 'bg-indigo-950/50 border-indigo-500 text-white ring-1 ring-indigo-500/30' 
                      : 'bg-blue-50 border-[#0A66C2] text-[#0A66C2] ring-1 ring-blue-500/20 shadow-xs'
                    : isDark
                    ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isDark ? 'text-indigo-400' : 'text-[#0A66C2]'
                  }`}>
                    Level {lvl}
                  </span>
                  <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Port {8000 + lvl - 1}</span>
                </div>
                <div className={`text-sm font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{info.title.split(':')[1]}</div>
                <p className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{info.focus}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Level Deep Dive */}
      <section className={`p-6 sm:p-8 rounded-2xl border transition-colors space-y-6 ${
        isDark ? 'bg-slate-900/70 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Layers className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-[#0A66C2]'}`} />
              {levelInfo[selectedLevel].title}
            </h2>
            <p className={`text-xs sm:text-sm mt-1 italic ${isDark ? 'text-indigo-300' : 'text-[#0A66C2]'}`}>
              "{levelInfo[selectedLevel].analogy}"
            </p>
          </div>
          <span className={`text-xs font-mono px-3 py-1 rounded border ${
            isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-600 border-slate-200'
          }`}>
            Source: /{levelInfo[selectedLevel].githubPath}
          </span>
        </div>

        {/* Feature bullets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {levelInfo[selectedLevel].features.map((feat, idx) => (
            <div key={idx} className={`p-3 rounded-lg border flex items-start gap-2 ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-[#F9FAFB] border-slate-200 text-slate-700'
            }`}>
              <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? 'text-indigo-400' : 'text-[#0A66C2]'}`} />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Live Request Pipeline Simulator */}
      <section className={`p-6 sm:p-8 rounded-2xl border transition-colors space-y-6 ${
        isDark ? 'bg-slate-900/70 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}>
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Terminal className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-[#0A66C2]'}`} />
            Interactive Request & Architecture Pipeline Simulator
          </h2>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Dispatch an HTTP request and watch it traverse through middleware, security guards, routers, service domains, and database repositories.
          </p>
        </div>

        {/* Endpoint Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {endpoints.map((ep) => (
            <button
              key={ep.id}
              onClick={() => {
                setActiveEndpointId(ep.id);
                setSelectedLevel(ep.level);
                setExecutionStep(-1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-2 border cursor-pointer ${
                activeEndpointId === ep.id 
                  ? isDark
                    ? 'bg-indigo-600 text-white border-indigo-500 font-bold' 
                    : 'bg-[#0A66C2] text-white border-[#0A66C2] font-bold shadow-xs'
                  : isDark
                  ? 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                ep.method === 'GET' 
                  ? (isDark ? 'bg-emerald-950 text-emerald-400' : 'bg-emerald-100 text-emerald-800') 
                  : (isDark ? 'bg-amber-950 text-amber-400' : 'bg-amber-100 text-amber-800')
              }`}>
                {ep.method}
              </span>
              <span>{ep.path}</span>
              <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>L{ep.level}</span>
            </button>
          ))}
        </div>

        {/* Live Execution Pipeline Visualizer */}
        <div className={`p-5 rounded-xl border space-y-4 ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-[#F9FAFB] border-slate-200'
        }`}>
          <div className={`flex items-center justify-between text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Data Flow Across Architectural Layers:</span>
            <button
              onClick={handleSimulateRequest}
              disabled={isExecuting}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded font-bold text-xs transition disabled:opacity-50 cursor-pointer ${
                isDark ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-[#0A66C2] hover:bg-[#004182] text-white shadow-xs'
              }`}
            >
              {isExecuting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              {isExecuting ? 'Processing...' : 'Send Request'}
            </button>
          </div>

          {/* Pipeline Steps */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {currentEndpoint.layersHit.map((layer, idx) => {
              const isPast = executionStep > idx;
              const isCurrent = executionStep === idx;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    isCurrent
                      ? isDark
                        ? 'bg-indigo-950/80 border-indigo-400 text-indigo-200 ring-2 ring-indigo-500/40 scale-105 shadow-lg'
                        : 'bg-blue-100 border-[#0A66C2] text-[#0A66C2] ring-2 ring-blue-500/30 scale-105 shadow-sm'
                      : isPast
                      ? isDark
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : isDark
                      ? 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-60'
                      : 'bg-white border-slate-200 text-slate-500 opacity-80'
                  }`}
                >
                  <div className={`text-[10px] font-mono mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Layer 0{idx + 1}</div>
                  <div className="text-xs font-bold truncate">{layer}</div>
                  <div className="mt-1 text-[10px]">
                    {isCurrent ? '⚡ Active' : isPast ? '✓ OK' : 'Pending'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Response Card */}
        {responseOutput && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Headers & Diagnostics */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-[#F9FAFB] border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>HTTP Status:</span>
                <span className={`px-2 py-0.5 rounded font-bold border ${
                  isDark ? 'bg-emerald-950 border-emerald-800 text-emerald-400' : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                }`}>
                  {responseOutput.status} OK
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Response Latency:</span>
                <span className={`font-bold ${isDark ? 'text-indigo-400' : 'text-[#0A66C2]'}`}>{responseOutput.latencyMs} ms</span>
              </div>
              <div className={`border-t pt-2 text-[11px] font-mono space-y-1 ${
                isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'
              }`}>
                <div>content-type: {responseOutput.headers['content-type']}</div>
                <div>x-process-time-ms: {responseOutput.headers['x-process-time-ms']}</div>
                <div>server: {responseOutput.headers['server']}</div>
              </div>
            </div>

            {/* JSON Output Viewer */}
            <div className={`p-4 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-[#F9FAFB] border-slate-200'
            }`}>
              <div className={`text-xs font-mono mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Validated Response Payload (Pydantic v2):</div>
              <pre className={`text-xs font-mono overflow-x-auto p-3 rounded-lg border max-h-40 ${
                isDark ? 'bg-slate-900 border-slate-800 text-indigo-300' : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
              }`}>
                {JSON.stringify(responseOutput.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </section>

    </div>
  );
};
