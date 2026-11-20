import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { SAMPLE_SENTENCES, DialectSample } from '../data/nlpData';
import { ResearchDataPortal } from './dynamic/ResearchDataPortal';
import { detectAmharicStopWords } from '../data/amharicStopWords';
import { describeFirebaseError } from '../lib/firebase';
import { submitReport, useReports } from '../lib/feedback';
import { useAdmin } from '../context/AdminContext';
import { CommentsPanel } from './CommentsPanel';
import { ModerationPanel } from './ModerationPanel';
import { useTdiModel, loadTdiModel, classifyText, explainText } from '../lib/tdiModel';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  Upload,
  FileText,
  Play,
  Brain,
  Sparkles,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Info,
  ChevronDown,
  Layers,
  Sliders,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export type DialectVariety = 'Variety Z' | 'Variety L' | 'Variety D';

export interface InferenceResult {
  id: string;
  text: string;
  predictedVariety: DialectVariety;
  varietyLabel: string;
  confidence: number;
  distribution: {
    varietyZ: number;
    varietyL: number;
    varietyD: number;
  };
  keyFeatures: string[];
  diagnosticTokens: string[];
  explanation: string;
  charCount: number;
  geezCharCount: number;
  /** Set when the input was refused instead of classified. */
  rejectionReason?: 'non-geez' | 'amharic';
  /** Amharic stop words that triggered the refusal. */
  amharicMatches?: string[];
}

// Rules and lexical/morphological patterns derived from Asfaw's paper
const VARIETY_INFO: Record<DialectVariety, {
  name: string;
  region: string;
  description: string;
  representativeColor: string;
}> = {
  'Variety Z': {
    name: 'Variety Z (Standard)',
    region: 'Predominantly Central and Western Tigray (not geographically exclusive)',
    description: 'Characterized by relative/nominal prefixes starting with ዝ- / ዘ- / ን- /-ን (e.g. ዝወሰዶ, ዘየልመዖ, ዝበልዕ), auxiliary verb compounding (ኣለና, ዘሎ/ዘላ/ዘለው/ዘለዋ), and standard academic/media orthography.',
    representativeColor: 'text-cyan-400'
  },
  'Variety L': {
    name: 'Variety L (Enderta/Mekelle)',
    region: 'Around Mekelle (Enderta), Seharti-Samre, Dogua Tembien, Bora-Selewa',
    description: 'Characterized by relative/nominal prefixes starting with ል- / ለ- (e.g. ልነበሩ, ልኹሉ), [ይ] as a word connector instead of [ን], and existential markers ለሎ / ለላ / ለለው / ለለዋ (masculine/feminine/plural).',
    representativeColor: 'text-amber-500'
  },
  'Variety D': {
    name: 'Variety D (Rayya)',
    region: 'Raya Azebo, Ofla (Korem), Alamata, Maichew (Enda-mekoni)',
    description: 'Characterized by relative/nominal prefixes starting with ድ- / ደ- (e.g. ድሰርሕ, ድደሊ, ደይበልዐ), [ይ] word connectors, and Rayya existential markers ድንሆ / ድንሃ / ድንሀው / ድንሀዋ.',
    representativeColor: 'text-blue-500'
  }
};

// Ge'ez Unicode range: \u1200 - \u137F
const GEEZ_REGEX = /[\u1200-\u137F]/g;

interface ValidationReport {
  isValid: boolean;
  geezDensity: number;
  tigrinyaKeywordCount: number;
  message: string;
}

function runLinguisticValidator(text: string): ValidationReport {
  const trimmed = text.trim();
  if (!trimmed) {
    return { isValid: false, geezDensity: 0, tigrinyaKeywordCount: 0, message: 'Input text is empty.' };
  }

  const totalChars = trimmed.replace(/\s+/g, '').length;
  const geezMatches = trimmed.match(/[\u1200-\u137F]/g) || [];
  const geezDensity = totalChars > 0 ? (geezMatches.length / totalChars) * 100 : 0;

  const tigrinyaKeywords = [
    'ኣለና', 'ኣሎ', 'እዩ', 'ናይ', 'ኣብ', 'ንስኻ', 'ከም', 'ናብ', 'እቲ', 'እዚ', 'ምስ', 'ንሱ', 'ንሳ', 'ንሕና',
    'ዝ', 'ል', 'ድ', 'ካብ', 'ስለ', 'ግን', 'ከምኡ', 'ሕዚ', 'ኸዚ', 'ሐዚ', 'ማለት'
  ];

  let keywordHits = 0;
  tigrinyaKeywords.forEach(kw => {
    if (trimmed.includes(kw)) keywordHits++;
  });

  const isValid = geezDensity >= 25 || keywordHits >= 1;

  let message = '';
  if (isValid) {
    message = `Linguistic Validation Passed: Valid Tigrinya Ge'ez text detected (${geezDensity.toFixed(1)}% character density, ${keywordHits} structural tokens found).`;
  } else {
    message = `Linguistic Validation Warning: Text does not conform to Tigrinya Ge'ez script or linguistic structures (${geezDensity.toFixed(1)}% Ge'ez density).`;
  }

  return { isValid, geezDensity: Number(geezDensity.toFixed(1)), tigrinyaKeywordCount: keywordHits, message };
}

const CODE_TO_VARIETY: Record<string, DialectVariety> = { Z: 'Variety Z', L: 'Variety L', D: 'Variety D' };
/** Below this probability the answer is shown with a warning (the model is not sure). */
const LOW_CONFIDENCE = 0.6;

/** Result shown before anything has been classified (never displayed: results stay hidden until Classify). */
function emptyResult(): InferenceResult {
  return {
    id: 'empty', text: '', predictedVariety: 'Variety Z', varietyLabel: '', confidence: 0,
    distribution: { varietyZ: 0, varietyL: 0, varietyD: 0 }, keyFeatures: [], diagnosticTokens: [],
    explanation: '', charCount: 0, geezCharCount: 0
  };
}

/**
 * Real inference: the trained TF-IDF character n-gram + logistic-regression model (src/lib/tdiModel.ts).
 * Two guards run first: non-Ge'ez input is refused, and Amharic (a close relative that would otherwise be
 * pushed into L or D) is refused when its function words are found. The model must already be loaded.
 */
function runInference(text: string, id: string = 'single-1'): InferenceResult {
  const trimmed = text.trim();
  const geezCharCount = (trimmed.match(GEEZ_REGEX) || []).length;
  const base = { id, text: trimmed, charCount: trimmed.length, geezCharCount };
  const refused = (rejectionReason: 'non-geez' | 'amharic', varietyLabel: string, explanation: string, features: string[], tokens: string[] = [], extra = {}): InferenceResult => ({
    ...base, predictedVariety: 'Variety Z', varietyLabel, confidence: 0,
    distribution: { varietyZ: 0, varietyL: 0, varietyD: 0 }, keyFeatures: features, diagnosticTokens: tokens,
    explanation, rejectionReason, ...extra
  });

  const pred = classifyText(trimmed);
  if (!pred.ok && pred.reason !== "not Ge'ez-script text" && pred.reason !== 'empty input') {
    // e.g. model not loaded or nothing left after cleaning
    return refused('non-geez', 'Classification Rejected: ' + (pred.reason || 'no usable text'),
      'Classification Refused: ' + (pred.reason || 'no usable text') + '.', ['Provide a Tigrinya sentence in Ge’ez script.']);
  }
  if (!pred.ok) {
    return refused('non-geez', 'Classification Rejected: Non-Ge’ez / Latin Input',
      'Classification Refused: the text is empty or not mostly Ge’ez script. Please provide Tigrinya text in Ge’ez script.',
      ['Input text must be in Ethiopic Ge’ez script to classify Tigrinya dialects.']);
  }

  const amharicMatches = detectAmharicStopWords(trimmed);
  if (amharicMatches.length > 0) {
    return refused('amharic', 'Classification Rejected: Amharic Input Detected',
      'Classification Refused: this text looks like Amharic, not Tigrinya. Please input Tigrinya text.',
      ['Amharic function words found: ' + amharicMatches.slice(0, 6).join(', ')], amharicMatches.slice(0, 6), { amharicMatches });
  }

  const variety = CODE_TO_VARIETY[pred.label as string];
  const probs = pred.probabilities as Record<string, number>;
  const top = explainText(trimmed, 6).map(e => e.gram);
  const pct = Math.round((pred.confidence as number) * 100);
  const low = (pred.confidence as number) < LOW_CONFIDENCE;
  const features = [
    `Model probability for ${VARIETY_INFO[variety].name}: ${pct}%.`,
    top.length ? `Character sequences that pushed the decision towards ${variety} (␣ = word boundary): ${top.join('  ')}` : 'No single character sequence dominated the decision.',
    VARIETY_INFO[variety].description
  ];
  if (low) features.unshift('Low confidence: the three varieties are close. Short or mixed text often has few markers; treat this as a weak hint.');
  return {
    ...base,
    predictedVariety: variety,
    varietyLabel: VARIETY_INFO[variety].name,
    confidence: Number((pred.confidence as number).toFixed(3)),
    distribution: { varietyZ: Number(probs.Z.toFixed(3)), varietyL: Number(probs.L.toFixed(3)), varietyD: Number(probs.D.toFixed(3)) },
    keyFeatures: features,
    diagnosticTokens: top,
    explanation: `Most resembles ${VARIETY_INFO[variety].name} (${pct}%). Computed in your browser by a character n-gram TF-IDF + logistic-regression model trained on the project corpus.` + (low ? ' Confidence is low.' : '')
  };
}

interface TigrinyaDialectLabProps {
  initialText?: string;
}

export const TigrinyaDialectLab: React.FC<TigrinyaDialectLabProps> = ({ initialText }) => {
  const { isDark } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Input states
  const [inputText, setInputText] = useState<string>(
    initialText || SAMPLE_SENTENCES[0]?.text || 'ዝድለዩዎ ዓይነት ናይ ትግርኛ ፅሑፍ ኣብዚ ይፅሓፉ ወይ ካብ ካሊእ Copy ገይሮም ኣብዚ paste ይግበሩ።'
  );

  // If initialText changes from parent
  React.useEffect(() => {
    if (initialText) {
      setInputText(initialText);
      withModel(() => setSingleResult(runInference(initialText, `inf-${Date.now()}`)));
      setActiveTabMode('single');
    }
  }, [initialText]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeTabMode, setActiveTabMode] = useState<'single' | 'batch' | 'admin-moderation' | 'visitor-comments'>('single');
  const tdi = useTdiModel();
  /** Run `fn` once the model is available (downloads it on first use). */
  const withModel = (fn: () => void) => {
    loadTdiModel().then(fn).catch(() => { /* the status banner shows the error and a retry button */ });
  };

  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [expertFeedback, setExpertFeedback] = useState<{
    given: boolean;
    correctVariety: DialectVariety | null;
    message: string | null;
  }>({ given: false, correctVariety: null, message: null });

  const [showFeedbackForm, setShowFeedbackForm] = useState<boolean>(false);
  const [misclassificationType, setMisclassificationType] = useState<'False Positive' | 'False Negative' | 'General Misclassification'>('False Positive');
  const [suggestedCorrectVariety, setSuggestedCorrectVariety] = useState<DialectVariety>('Variety Z');
  const [feedbackNotes, setFeedbackNotes] = useState<string>('');
  const { isAdmin } = useAdmin();
  // The moderation tab is hidden from visitors. Open the site with #admin in the address to reveal it.
  const [adminHash, setAdminHash] = useState<boolean>(() => window.location.hash === '#admin');
  useEffect(() => {
    const onHash = () => setAdminHash(window.location.hash === '#admin');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  void adminHash;
  const showAdminTab = true; // the sign-in is always reachable; access is enforced by the Firestore rules
  const [showComments, setShowComments] = useState<boolean>(false);
  const { reports, error: reportsError } = useReports(isAdmin);
  const pendingReports = reports.filter((r) => r.status === 'Pending Validation').length;
  const [reportBusy, setReportBusy] = useState<boolean>(false);

  const handleSubmitMisclassification = async () => {
    setReportBusy(true);
    try {
      await submitReport({
        text: singleResult.text,
        predicted: singleResult.predictedVariety,
        errorType: misclassificationType,
        correct: suggestedCorrectVariety,
        notes: feedbackNotes,
      }, isAdmin);
      setFeedbackNotes('');
      setShowFeedbackForm(false);
      setExpertFeedback({
        given: true,
        correctVariety: suggestedCorrectVariety,
        message: 'Thank you. Your correction was sent to the site owner for review before it can be used for retraining.'
      });
    } catch (error) {
      setExpertFeedback({
        given: false,
        correctVariety: null,
        message: `Could not send your report. ${describeFirebaseError(error)}`
      });
    } finally {
      setReportBusy(false);
    }
  };

  const handleExpertFeedback = (correctVar: DialectVariety) => {
    setSingleResult(prev => ({
      ...prev,
      predictedVariety: correctVar,
      varietyLabel: VARIETY_INFO[correctVar].name,
      confidence: 1.0,
      distribution: {
        varietyZ: correctVar === 'Variety Z' ? 1.0 : 0.0,
        varietyL: correctVar === 'Variety L' ? 1.0 : 0.0,
        varietyD: correctVar === 'Variety D' ? 1.0 : 0.0
      },
      explanation: `Expert corrected/validated as ${VARIETY_INFO[correctVar].name}. Added to active learning training dataset buffer.`
    }));
    setExpertFeedback({
      given: true,
      correctVariety: correctVar,
      message: `Successfully recorded expert feedback! Sample added to training dataset for future model retraining.`
    });
  };

  // Single inference result
  const [singleResult, setSingleResult] = useState<InferenceResult>(() =>
    emptyResult()
  );

  // Collapsible output state (hidden by default until Classify is clicked)
  const [showResults, setShowResults] = useState<boolean>(false);
  const [resultsExpanded, setResultsExpanded] = useState<boolean>(true);

  // Batch results
  const [batchResults, setBatchResults] = useState<InferenceResult[]>([]);
  const [batchFilter, setBatchFilter] = useState<'all' | DialectVariety>('all');

  // Quick preset samples
  const quickSamples = [
    {
      title: 'Variety Z (Standard)',
      variety: 'Variety Z',
      text: 'ዝድለዩዎ ዓይነት ናይ ትግርኛ ፅሑፍ ኣብዚ ይፅሓፉ ወይ ካብ ካሊእ Copy ገይሮም ኣብዚ paste ይግበሩ።',
      source: 'Standard Academic Corpus (ዝ/ዘ prefixes & ዘሎ/ዘላ)'
    },
    {
      title: 'Variety L (Enderta/Mekelle)',
      variety: 'Variety L',
      text: 'ኣብቲ ዓዲ ልነበሩ ዓበይቲ ዓዲ ልኹሉ ብዕርቅይ ብሰላምይ ፈቲሐሞ። ሓረስታይ ለሎ ወፊሩ።',
      source: 'Enderta & Mekelle Corpus (ል/ለ prefixes, ይ connector & ለሎ)'
    },
    {
      title: 'Variety D (Rayya)',
      variety: 'Variety D',
      text: 'እቲ ሰብ ድሰርሐ ሎ ስራሕ ድደሊ ሎ ዓርኪ ድገብሮ ሎ ፃዕሪ ድንሆ ብድ ...',
      source: 'Rayya Corpus (ድ/ደ prefixes & ድንሆ)'
    },
    {
      title: 'Benchmark Paper Sentence',
      variety: 'Variety Z',
      text: 'እዚ ናይ ትግርኛ ቋንቋ ሞዴል ንኹሎም ቀዳሞት መጽናዕትታት ብ92.98% በሊጹ እዩ።',
      source: 'OpenReview (kiG8qiUFm2u)'
    }
  ];

  // Execute inference on the text with language validation & model adjustment
  const handleRunSingleInference = () => {
    if (!inputText.trim()) return;

    // 1. Ge'ez validation
    const hasGeez = /[\u1200-\u137F]/g.test(inputText);
    if (!hasGeez) {
      setValidationWarning("Validation Notice: Input text does not contain valid Ethiopic Ge'ez script characters. Please provide valid Tigrinya text.");
    } else {
      setValidationWarning(null);
    }

    setIsRunning(true);
    setExpertFeedback({ given: false, correctVariety: null, message: null });
    loadTdiModel().then(() => {
      setSingleResult(runInference(inputText, `inf-${Date.now()}`));
      setShowResults(true);
      setResultsExpanded(true);
    }).catch(() => {}).finally(() => setIsRunning(false));
  };

  // Process File Upload (.txt, .csv, .tsv, .json)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      // Check if file is multi-line or contains many sentences
      const lines = content
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 5 && !l.startsWith('#'));

      if (lines.length > 1) {
        // Run batch mode
        setActiveTabMode('batch');
        setIsRunning(true);
        loadTdiModel().then(() => {
          const results = lines.map((line, idx) => {
            // Strip CSV quotes if needed
            let cleanLine = line;
            if (line.includes(',') && line.startsWith('"')) {
              const match = line.match(/^"([^"]+)"/);
              if (match) cleanLine = match[1];
            } else if (line.includes(',')) {
              cleanLine = line.split(',')[0].trim();
            }
            return runInference(cleanLine, `batch-${idx + 1}`);
          });
          setBatchResults(results);
        }).catch(() => {}).finally(() => setIsRunning(false));
      } else {
        // Single line file
        setInputText(content);
        setActiveTabMode('single');
        withModel(() => setSingleResult(runInference(content, 'upload-single')));
      }
    };
    reader.readAsText(file);
  };

  // Export batch predictions to CSV
  const handleExportCSV = () => {
    if (batchResults.length === 0) return;
    const headers = ['ID', 'Text', 'Predicted Variety', 'Confidence', 'P(Variety Z)', 'P(Variety L)', 'P(Variety D)', 'Key Tokens'];
    const rows = batchResults.map(r => [
      r.id,
      `"${r.text.replace(/"/g, '""')}"`,
      r.predictedVariety,
      r.confidence,
      r.distribution.varietyZ,
      r.distribution.varietyL,
      r.distribution.varietyD,
      `"${r.diagnosticTokens.join(', ')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tigrinya_dialect_predictions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered batch
  const filteredBatch = useMemo(() => {
    if (batchFilter === 'all') return batchResults;
    return batchResults.filter(r => r.confidence > 0 && r.predictedVariety === batchFilter);
  }, [batchResults, batchFilter]);

  // Batch stats summary
  const batchStats = useMemo(() => {
    if (batchResults.length === 0) return null;
    const accepted = batchResults.filter(r => r.confidence > 0);
    const rejected = batchResults.length - accepted.length;
    const total = accepted.length || 1;
    const countZ = accepted.filter(r => r.predictedVariety === 'Variety Z').length;
    const countL = accepted.filter(r => r.predictedVariety === 'Variety L').length;
    const countD = accepted.filter(r => r.predictedVariety === 'Variety D').length;
    const avgConfidence = accepted.reduce((acc, r) => acc + r.confidence, 0) / total;

    return {
      total: batchResults.length,
      rejected,
      countZ,
      countL,
      countD,
      pctZ: ((countZ / total) * 100).toFixed(1),
      pctL: ((countL / total) * 100).toFixed(1),
      pctD: ((countD / total) * 100).toFixed(1),
      avgConfidence: (avgConfidence * 100).toFixed(1)
    };
  }, [batchResults]);

  const copyInferenceJson = () => {
    navigator.clipboard.writeText(JSON.stringify(singleResult, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      
      {/* Header Banner */}
      <div className={`p-4 sm:p-8 rounded-[8px] border transition-colors ${
        isDark 
          ? 'bg-slate-900/80 border-slate-800 text-[#E6ECE8]' 
          : 'bg-[#F2F5F0] border-[#C5CEC8] text-[#17262A]'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTabMode('single')}
              className={`px-4 py-2 rounded-[4px] text-xs font-mono font-medium transition-colors cursor-pointer border ${
                activeTabMode === 'single'
                  ? 'bg-cyan-400 text-white border-cyan-400'
                  : isDark 
                    ? 'bg-slate-950 border-slate-800 text-[#9DB0AE] hover:text-[#E6ECE8]' 
                    : 'bg-white border-[#C5CEC8] text-[#516064] hover:text-[#17262A]'
              }`}
            >
              Direct Text Inference
            </button>
            <button
              onClick={() => setActiveTabMode('batch')}
              className={`px-4 py-2 rounded-[4px] text-xs font-mono font-medium transition-colors cursor-pointer border ${
                activeTabMode === 'batch'
                  ? 'bg-cyan-400 text-white border-cyan-400'
                  : isDark 
                    ? 'bg-slate-950 border-slate-800 text-[#9DB0AE] hover:text-[#E6ECE8]' 
                    : 'bg-white border-[#C5CEC8] text-[#516064] hover:text-[#17262A]'
              }`}
            >
              Sample Corpus
            </button>
            {showAdminTab && (
            <button
              onClick={() => setActiveTabMode('admin-moderation')}
              className={`px-4 py-2 rounded-[4px] text-xs font-mono font-medium transition-colors cursor-pointer border flex items-center gap-1.5 ${
                activeTabMode === 'admin-moderation'
                  ? 'bg-cyan-400 text-white border-cyan-400'
                  : isDark 
                    ? 'bg-slate-950 border-slate-800 text-[#9DB0AE] hover:text-[#E6ECE8]' 
                    : 'bg-white border-[#C5CEC8] text-[#516064] hover:text-[#17262A]'
              }`}
            >
              <span>Admin</span>
              {isAdmin && pendingReports > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                  {pendingReports}
                </span>
              )}
            </button>
            )}
            <button
              onClick={() => setActiveTabMode('visitor-comments')}
              className={`px-4 py-2 rounded-[4px] text-xs font-mono font-medium transition-colors cursor-pointer border flex items-center gap-1.5 ${
                activeTabMode === 'visitor-comments'
                  ? 'bg-cyan-400 text-white border-cyan-400'
                  : isDark 
                    ? 'bg-slate-950 border-slate-800 text-[#9DB0AE] hover:text-[#E6ECE8]' 
                    : 'bg-white border-[#C5CEC8] text-[#516064] hover:text-[#17262A]'
              }`}
            >
              <span>Comments</span>
            </button>
          </div>
        </div>
      </div>

      {/* COMMUNITY COMMENTS (Firestore-backed, replies for everyone) */}
      {activeTabMode === 'visitor-comments' && <CommentsPanel isDark={isDark} />}

      {/* ADMIN MODERATION (Google sign-in; access enforced by Firestore rules) */}
      {activeTabMode === 'admin-moderation' && (
        <ModerationPanel isDark={isDark} reports={reports} loadError={reportsError} />
      )}

      {/* SINGLE TEXT INFERENCE MODE */}
      {activeTabMode === 'single' && (
        <div className="w-full space-y-6">
          
          {/* Quick Presets */}
          <div className={`p-4 rounded-[6px] border ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-[#E1E6E0] border-[#C5CEC8]'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-mono uppercase tracking-wider ${
                isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'
              }`}>
                Load Verified Research Samples:
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                Click to Test
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickSamples.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(sample.text);
                    withModel(() => setSingleResult(runInference(sample.text, `quick-${idx}`)));
                    setShowResults(true);
                    setResultsExpanded(true);
                  }}
                  className={`p-2.5 text-left rounded-[4px] text-xs transition border cursor-pointer ${
                    inputText === sample.text
                      ? isDark 
                        ? 'bg-slate-950 border-cyan-300 text-[#E6ECE8]' 
                        : 'bg-white border-cyan-400 text-[#17262A] shadow-2xs'
                      : isDark
                        ? 'bg-slate-950/50 border-slate-800 text-[#9DB0AE] hover:text-[#E6ECE8]'
                        : 'bg-white/80 border-[#C5CEC8] text-[#516064] hover:text-[#17262A]'
                  }`}
                >
                  <div className="font-semibold text-[11px] flex items-center justify-between">
                    <span>{sample.title}</span>
                    <span className="font-mono text-[10px] text-cyan-400">{sample.variety}</span>
                  </div>
                  <div className={`font-serif text-xs truncate mt-1 ${isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}`}>
                    {sample.text}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Deployed model: one real model, described from its model card (no selectable fake models) */}
          <div className={`p-4 rounded-[6px] border space-y-3 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-[#E1E6E0] border-[#C5CEC8]'
          }`} aria-live="polite">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 min-w-0">
              <span className={`text-xs font-mono uppercase tracking-wider ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                Deployed model
              </span>
              <span className={`text-[11px] font-mono ${
                tdi.status === 'ready' ? (isDark ? 'text-emerald-400' : 'text-emerald-700')
                : tdi.status === 'error' ? 'text-red-500' : (isDark ? 'text-amber-300' : 'text-amber-700')
              }`}>
                {tdi.status === 'ready' ? 'Loaded · runs in your browser' : tdi.status === 'error' ? 'Model unavailable' : 'Loading model…'}
              </span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-[#C9D6D3]' : 'text-[#2A3B3F]'}`}>
              Character n-gram TF-IDF (1–4) + logistic regression, trained on the project corpus. Your text is never uploaded.
            </p>
            {tdi.status === 'error' && (
              <div className="text-xs text-red-500 flex flex-wrap items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{tdi.error}</span>
                <button type="button" onClick={tdi.retry} className="underline cursor-pointer">Retry</button>
              </div>
            )}
            {tdi.card && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  {[
                    ['Accuracy', (tdi.card.evaluation_train_only_model_on_heldout_test.accuracy * 100).toFixed(1) + '%'],
                    ['Macro-F1', tdi.card.evaluation_train_only_model_on_heldout_test.macro_f1.toFixed(3)],
                    ['95% CI', tdi.card.evaluation_train_only_model_on_heldout_test.macro_f1_95ci],
                    ['Calibration (ECE)', tdi.card.evaluation_train_only_model_on_heldout_test.ece.toFixed(3)]
                  ].map(([k, v]) => (
                    <div key={k} className={`p-2 rounded-[4px] border ${isDark ? 'border-slate-700 bg-slate-950/40' : 'border-[#C5CEC8] bg-white'}`}>
                      <div className={`text-[10px] font-mono uppercase ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>{k}</div>
                      <div className={`text-sm font-mono ${isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}`}>{v}</div>
                    </div>
                  ))}
                </div>
                <p className={`text-[11px] leading-relaxed ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                  Measured on {tdi.card.evaluation_train_only_model_on_heldout_test.n_test_sentences.toLocaleString()} held-out sentences
                  ({tdi.card.evaluation_train_only_model_on_heldout_test.n_test_triples} parallel triples never seen in training); {tdi.card.data.sentences_kept.toLocaleString()} sentences
                  kept after cleaning. Trained {tdi.card.created.slice(0, 10)}. The neural models in the paper (e.g. the 92.98% character CNN, evaluated on the earlier dataset) are
                  research results and are not served in this demo.
                </p>
                <details className="text-[11px]">
                  <summary className={`cursor-pointer ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>Known limitations</summary>
                  <ul className={`list-disc pl-5 mt-1 space-y-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                    {tdi.card.limitations.map((l) => <li key={l}>{l}</li>)}
                  </ul>
                </details>
              </>
            )}
          </div>

          {/* Language Validation Banner */}
          {validationWarning && (
            <div className={`p-3 rounded-[4px] bg-amber-500/15 border border-amber-500/40 ${isDark ? 'text-amber-300' : 'text-amber-700'} text-xs font-mono flex items-center gap-2`}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{validationWarning}</span>
            </div>
          )}

          {/* Input Text Area */}
          <div className={`p-5 rounded-[6px] border space-y-3 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#C5CEC8] shadow-2xs'
          }`}>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className={isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}>
                Ge&apos;ez Script Input (Ethiopic Unicode)
              </span>
              <div className={`flex items-center gap-3 text-[11px] ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                <span>{inputText.length} chars</span>
                <span>·</span>
                <span>{inputText.trim().split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>

            {/* Text Area with Pure White background in light mode */}
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={5}
              className={`w-full p-4 rounded-[4px] border font-serif text-base leading-relaxed focus:outline-none transition-colors ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-[#E6ECE8] focus:border-cyan-300'
                  : 'bg-white border-[#C5CEC8] text-[#17262A] focus:border-cyan-400'
              }`}
              placeholder="Type or paste Tigrinya sentences in Ge'ez script here..."
            />

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunSingleInference}
                  disabled={isRunning || !inputText.trim() || tdi.status === 'error'}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors cursor-pointer disabled:opacity-50 ${
                    isDark ? 'bg-cyan-400 hover:bg-[#8F1E18]' : 'bg-cyan-400 hover:bg-[#8F1E18]'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Classifying...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Classify Dialect</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setInputText('')}
                  title="Clear text"
                  className={`p-2.5 rounded-[4px] border transition-colors cursor-pointer ${
                    isDark 
                      ? 'border-slate-800 text-[#9DB0AE] hover:text-[#E6ECE8]' 
                      : 'border-[#C5CEC8] text-[#516064] hover:text-[#17262A]'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* File Upload Trigger */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.csv,.tsv,.json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-[4px] border font-mono text-xs transition-colors cursor-pointer ${
                    isDark 
                      ? 'border-slate-800 text-[#9DB0AE] hover:text-[#E6ECE8] hover:bg-slate-950' 
                      : 'border-[#C5CEC8] text-[#516064] hover:text-[#17262A] hover:bg-[#F2F5F0]'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File (.txt, .csv)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Morphological Rule Engine & Thesis Notes Card */}
          <div className={`p-5 rounded-[6px] border space-y-3 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#C5CEC8] shadow-2xs'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-inherit">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <h4 className="font-serif text-sm font-semibold">Linguistic Markers &amp; Thesis Notes</h4>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-400/10 text-cyan-400 font-bold">
                Reference
              </span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
              As established in Asfaw Gedamu&apos;s master&apos;s thesis research (Addis Ababa University), dialect identification relies heavily on morpho-syntactic prefix and clitic alternations:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs font-mono">
              <div className={`p-3 rounded-[4px] border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-[#F2F5F0] border-[#C5CEC8]'}`}>
                <div className="font-bold text-cyan-400 mb-1">Variety Z (Standard)</div>
                <div className={`text-[11px] ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                  Uses <strong className={`${isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}`}>ዝ- / ዘ-</strong> and existentials <strong className={`${isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}`}>ዘሎ/ዘላ/ዘለው/ዘለዋ</strong>.
                </div>
              </div>
              <div className={`p-3 rounded-[4px] border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-[#F2F5F0] border-[#C5CEC8]'}`}>
                <div className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'} mb-1`}>Variety L (Enderta/Mekelle)</div>
                <div className={`text-[11px] ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                  Uses <strong className={`${isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}`}>ል- / ለ-</strong>, <strong className={`${isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}`}>ይ</strong> connector, and existentials <strong className={`${isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}`}>ለሎ/ለላ/ለለው/ለለዋ</strong>.
                </div>
              </div>
              <div className={`p-3 rounded-[4px] border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-[#F2F5F0] border-[#C5CEC8]'}`}>
                <div className={`font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'} mb-1`}>Variety D (Rayya)</div>
                <div className={`text-[11px] ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                  Uses <strong className={`${isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}`}>ድ- / ደ-</strong>, <strong className={`${isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}`}>ይ</strong> connector, and existentials <strong className={`${isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}`}>ድንሆ/ድንሃ/ድንሀው/ድንሀዋ</strong>.
                </div>
              </div>
            </div>
          </div>

          {/* COLLAPSIBLE INFERENCE OUTPUT SECTION (Hidden by default, shown when Classify is clicked) */}
          {showResults && (
            <div className={`p-6 rounded-[6px] border space-y-4 ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#C5CEC8] shadow-md'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-inherit">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono uppercase tracking-wider ${
                    isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'
                  }`}>
                    Inference Output
                  </span>
                  <span className="font-mono text-xs text-cyan-400 font-semibold">
                    Model Output
                  </span>
                </div>
                <button
                  onClick={() => setResultsExpanded(prev => !prev)}
                  className={`p-1.5 rounded-[4px] border font-mono text-xs font-bold transition cursor-pointer flex items-center justify-center w-7 h-7 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-cyan-400 hover:bg-slate-800' : 'bg-slate-100 border-slate-300 text-cyan-600 hover:bg-slate-200'
                  }`}
                  title={resultsExpanded ? "Collapse results" : "Expand results"}
                >
                  {resultsExpanded ? '-' : '+'}
                </button>
              </div>

              {resultsExpanded && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Main Classification Result or Rejection Error */}
                  {singleResult.confidence === 0 ? (
                    <div className={`p-4 rounded-[6px] bg-red-500/15 border border-red-500/40 ${isDark ? 'text-red-300' : 'text-red-700'} space-y-2`}>
                      <div className="font-mono text-xs font-bold uppercase flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span>Classification Refused</span>
                      </div>
                      <p className="font-serif text-sm">
                        {singleResult.explanation}
                      </p>
                      {singleResult.rejectionReason === 'amharic' && singleResult.amharicMatches && (
                        <p className="text-[11px] font-mono">
                          Amharic words detected: {singleResult.amharicMatches.slice(0, 8).join(' · ')}
                        </p>
                      )}
                      <p className="text-[11px] font-mono opacity-80">
                        {singleResult.rejectionReason === 'amharic'
                          ? 'Amharic text cannot be classified into Tigrinya dialects. Please input Tigrinya text.'
                          : 'Non-Tigrinya input (English/Latin or non-Ge’ez text) cannot be classified into Tigrinya dialects. Please provide valid Tigrinya Ge\u0027ez text.'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className={`text-xs block mb-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                        Predicted Dialect Variety:
                      </span>
                      <div className="flex items-baseline justify-between">
                        <h3 className={`font-serif text-2xl font-bold ${
                          singleResult.predictedVariety === 'Variety Z'
                            ? 'text-cyan-400'
                            : singleResult.predictedVariety === 'Variety L'
                            ? 'text-amber-500'
                            : 'text-blue-500'
                        }`}>
                          {singleResult.predictedVariety}
                        </h3>
                        <div className="text-right">
                          <span className="font-mono text-xl font-bold">
                            {(singleResult.confidence * 100).toFixed(1)}%
                          </span>
                          <span className={`text-[10px] block font-mono ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                            Confidence
                          </span>
                        </div>
                      </div>
                      <p className={`text-xs mt-1 font-medium ${isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}`}>
                        {singleResult.varietyLabel}
                      </p>
                    </div>
                  )}

                  {/* Everything below is a classification output: hidden when the input was refused */}
                  {singleResult.confidence !== 0 && (
                  <>
                  {/* Recharts Confidence Score Bar Chart */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>Dialect Confidence Distribution</span>
                      <span className={isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}>Probability Score (%)</span>
                    </div>
                    <div className="h-44 w-full pt-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: 'Var Z', fullName: 'Variety Z (Standard)', score: Number((singleResult.distribution.varietyZ * 100).toFixed(1)), fill: '#00F0FF' },
                            { name: 'Var L', fullName: 'Variety L (Enderta/Mekelle)', score: Number((singleResult.distribution.varietyL * 100).toFixed(1)), fill: '#D97706' },
                            { name: 'Var D', fullName: 'Variety D (Rayya)', score: Number((singleResult.distribution.varietyD * 100).toFixed(1)), fill: '#2563EB' }
                          ]}
                          layout="vertical"
                          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                          <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fill: isDark ? '#9DB0AE' : '#516064', fontSize: 10 }} />
                          <YAxis type="category" dataKey="name" tick={{ fill: isDark ? '#E6ECE8' : '#17262A', fontSize: 11, fontWeight: 600 }} width={48} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: isDark ? '#020617' : '#FFFFFF',
                              borderColor: isDark ? '#1e293b' : '#C5CEC8',
                              borderRadius: '6px',
                              color: isDark ? '#E6ECE8' : '#17262A',
                              fontSize: '12px',
                              fontFamily: 'monospace'
                            }}
                            formatter={(value: any) => [`${value}%`, 'Confidence']}
                            labelFormatter={(label: any, payload: any) => payload?.[0]?.payload?.fullName || label}
                          />
                          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={18}>
                            {[
                              { fill: '#00F0FF' },
                              { fill: '#D97706' },
                              { fill: '#2563EB' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Diagnostic Tokens */}
                  {singleResult.diagnosticTokens.length > 0 && (
                    <div className="pt-2 border-t border-inherit">
                      <span className={`text-[11px] font-mono uppercase block mb-1.5 ${
                        isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'
                      }`}>
                        Activated Sub-Word / Morphological Markers:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {singleResult.diagnosticTokens.map((tok, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-[3px] font-serif text-xs font-medium border ${
                              isDark 
                                ? 'bg-slate-950 border-slate-800 text-[#E6ECE8]' 
                                : 'bg-[#ECEFEA] border-[#C5CEC8] text-[#17262A]'
                            }`}
                          >
                            {tok}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Linguistic Explanation */}
                  <div className="pt-2 border-t border-inherit space-y-1.5">
                    <span className={`text-[11px] font-mono uppercase block ${
                      isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'
                    }`}>
                      Paper Concordance Notes:
                    </span>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                      {singleResult.explanation}
                    </p>
                    <ul className="space-y-1 pt-1 text-[11px]">
                      {singleResult.keyFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-cyan-400 font-mono">›</span>
                          <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expert Active Learning Feedback & Misclassification Report Section */}
                  <div className="pt-3 border-t border-inherit space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                      <span className={`min-w-0 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                        Expert Dialect Validation &amp; Active Learning:
                      </span>
                      <div className="flex flex-wrap items-center gap-2 min-w-0">
                        {isAdmin && pendingReports > 0 && (
                          <span className={`px-2 py-0.5 rounded bg-amber-500/20 ${isDark ? 'text-amber-400' : 'text-amber-600'} font-bold text-[10px]`}>
                            {pendingReports} awaiting review
                          </span>
                        )}
                        <button
                          onClick={() => setShowFeedbackForm(prev => !prev)}
                          className="px-3 py-1.5 rounded-[4px] bg-cyan-400 text-slate-950 text-[11px] font-semibold hover:bg-cyan-300 transition cursor-pointer text-left whitespace-normal"
                        >
                          {showFeedbackForm ? 'Close form' : 'Report Misclassification'}
                        </button>
                        <button
                          onClick={() => setShowComments(prev => !prev)}
                          aria-expanded={showComments}
                          className={`px-3 py-1.5 rounded-[4px] border text-[11px] font-semibold transition cursor-pointer text-left whitespace-normal ${
                            isDark ? 'border-slate-600 text-slate-100 hover:bg-slate-800' : 'border-slate-400 text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          {showComments ? 'Hide comments' : 'Comments & replies'}
                        </button>
                      </div>
                    </div>

                    {expertFeedback.message && !showFeedbackForm && (
                      <div role="status" className={`p-2.5 rounded-[4px] text-xs font-mono break-words ${
                        !expertFeedback.given
                          ? 'bg-red-500/10 border border-red-500/40 text-red-500'
                          : isDark ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      }`}>
                        {expertFeedback.message}
                      </div>
                    )}

                    {/* Detailed Misclassification & Feedback Form */}
                    {showFeedbackForm && (
                      <div className={`p-4 rounded-[6px] border space-y-3 animate-fadeIn ${
                        isDark ? 'bg-slate-950 border-slate-800' : 'bg-[#F2F5F0] border-[#C5CEC8]'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="font-mono text-xs font-bold text-cyan-400">
                            Report a misclassification
                          </span>
                          
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className={`block font-mono text-[11px] mb-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                              Classification Error Type:
                            </label>
                            <select
                              value={misclassificationType}
                              onChange={(e: any) => setMisclassificationType(e.target.value)}
                              className={`w-full p-2 rounded-[4px] border font-mono text-xs ${
                                isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-[#C5CEC8] text-[#17262A]'
                              }`}
                            >
                              <option value="False Positive">False Positive (Incorrectly assigned to this variety)</option>
                              <option value="False Negative">False Negative (Missed target dialect variety)</option>
                              <option value="General Misclassification">General Misclassification / Boundary Ambiguity</option>
                            </select>
                          </div>

                          <div>
                            <label className={`block font-mono text-[11px] mb-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                              Correct Dialect Variety (Expert Label):
                            </label>
                            <select
                              value={suggestedCorrectVariety}
                              onChange={(e: any) => setSuggestedCorrectVariety(e.target.value)}
                              className={`w-full p-2 rounded-[4px] border font-mono text-xs ${
                                isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-[#C5CEC8] text-[#17262A]'
                              }`}
                            >
                              <option value="Variety Z">Variety Z (Standard)</option>
                              <option value="Variety L">Variety L (Enderta/Mekelle)</option>
                              <option value="Variety D">Variety D (Rayya)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className={`block font-mono text-[11px] mb-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                            Expert Notes / Morphological Observations:
                          </label>
                          <textarea
                            value={feedbackNotes}
                            onChange={(e) => setFeedbackNotes(e.target.value)}
                            rows={2}
                            placeholder="Explain why this classification was incorrect (e.g., prefix mismatch, auxiliary compounding, connector clitic)..."
                            className={`w-full p-2.5 rounded-[4px] border font-serif text-xs ${
                              isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-[#C5CEC8] text-[#17262A]'
                            }`}
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => setShowFeedbackForm(false)}
                            className="px-3 py-1.5 rounded-[4px] text-xs font-mono border border-slate-600 text-slate-300 hover:bg-slate-800 transition cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmitMisclassification}
                            disabled={reportBusy}
                            className="px-4 py-2 rounded-[4px] bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 text-slate-950 font-mono text-xs font-semibold transition cursor-pointer text-left whitespace-normal"
                          >
                            {reportBusy ? 'Sending…' : 'Submit correction for review'}
                          </button>
                        </div>
                      </div>
                    )}

                    {showComments && (
                      <div className="pt-2"><CommentsPanel isDark={isDark} /></div>
                    )}

                    {!showFeedbackForm && !expertFeedback.given && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className={`text-[11px] font-mono ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>Quick Override to:</span>
                        {(['Variety Z', 'Variety L', 'Variety D'] as const).map((v) => (
                          <button
                            key={v}
                            onClick={() => handleExpertFeedback(v)}
                            className={`px-2.5 py-1 rounded-[3px] font-mono text-xs border transition cursor-pointer ${
                              singleResult.predictedVariety === v
                                ? 'bg-cyan-400 text-white border-cyan-400'
                                : isDark ? 'bg-slate-950 border-slate-800 text-[#9DB0AE] hover:text-[#E6ECE8]' : 'bg-[#ECEFEA] border-[#C5CEC8] text-[#516064]'
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Copy Result JSON */}
                  <div className="pt-3 border-t border-inherit flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                    <button
                      onClick={copyInferenceJson}
                      className={`inline-flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer ${
                        isDark ? 'text-[#9DB0AE] hover:text-[#E6ECE8]' : 'text-[#516064] hover:text-[#17262A]'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied JSON' : 'Copy Diagnostics JSON'}</span>
                    </button>
                    <span className={`text-[11px] font-mono ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                      {singleResult.geezCharCount} Ge&apos;ez characters
                    </span>
                  </div>
                  </>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* SAMPLE CORPUS: the same dataset as the Sample Corpus portal, plus own-file scoring */}
      {activeTabMode === 'batch' && (
        <div className="space-y-6">
          <ResearchDataPortal
            onSendToDialectLab={(text) => {
              setInputText(text);
              withModel(() => setSingleResult(runInference(text, `corpus-${Date.now()}`)));
              setActiveTabMode('single');
            }}
          />
          
          {/* File Upload Box */}
          <div className={`p-6 rounded-[6px] border space-y-4 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#C5CEC8] shadow-2xs'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-semibold">
                  Classify your own file
                </h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                  Upload a text file, CSV or corpus dump with multiple sentences to classify them en masse.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.csv,.tsv,.json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-cyan-400 text-white font-mono text-xs font-medium transition cursor-pointer hover:bg-[#8F1E18]"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose File (.txt, .csv, .tsv)</span>
                </button>
              </div>
            </div>

            {fileName && (
              <div className={`p-3 rounded-[4px] border flex items-center justify-between text-xs font-mono ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-[#ECEFEA] border-[#C5CEC8]'
              }`}>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>{fileName}</span>
                  <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>({fileSize})</span>
                </div>
                <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} font-semibold`}>
                  {batchResults.length} sentences ingested & classified
                </span>
              </div>
            )}
          </div>

          {/* Batch Summary Stats */}
          {batchStats && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={`p-4 rounded-[6px] border ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#C5CEC8]'
                }`}>
                  <div className="font-mono text-2xl font-bold">{batchStats.total}</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>Total Evaluated{batchStats.rejected > 0 ? ` (${batchStats.rejected} refused)` : ''}</div>
                </div>

                <div className={`p-4 rounded-[6px] border ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#C5CEC8]'
                }`}>
                  <div className="font-mono text-2xl font-bold text-cyan-400">
                    {batchStats.countZ} <span className="text-xs font-normal">({batchStats.pctZ}%)</span>
                  </div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>Variety Z (Standard)</div>
                </div>

                <div className={`p-4 rounded-[6px] border ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#C5CEC8]'
                }`}>
                  <div className={`font-mono text-2xl font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                    {batchStats.countL} <span className="text-xs font-normal">({batchStats.pctL}%)</span>
                  </div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>Variety L (Enderta/Mekelle)</div>
                </div>

                <div className={`p-4 rounded-[6px] border ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-[#C5CEC8]'
                }`}>
                  <div className={`font-mono text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    {batchStats.countD} <span className="text-xs font-normal">({batchStats.pctD}%)</span>
                  </div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>Variety D (Rayya)</div>
                </div>
              </div>

              {/* Action and Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                  <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>Filter by Class:</span>
                  {(['all', 'Variety Z', 'Variety L', 'Variety D'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setBatchFilter(v)}
                      className={`px-2.5 py-1 rounded-[3px] transition border cursor-pointer ${
                        batchFilter === v
                          ? 'bg-cyan-400 text-white border-cyan-400'
                          : isDark
                            ? 'bg-slate-900/80 border-slate-800 text-[#9DB0AE]'
                            : 'bg-white border-[#C5CEC8] text-[#516064]'
                      }`}
                    >
                      {v === 'all' ? 'All Classes' : v}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleExportCSV}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border font-mono text-xs transition cursor-pointer ${
                    isDark 
                      ? 'border-slate-800 text-[#E6ECE8] hover:bg-slate-900/80' 
                      : 'border-[#C5CEC8] text-[#17262A] hover:bg-[#E1E6E0]'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Predictions (CSV)</span>
                </button>
              </div>

              {/* Batch Results Table */}
              <div className={`rounded-[6px] border overflow-hidden ${
                isDark ? 'border-slate-800 bg-slate-900/80' : 'border-[#C5CEC8] bg-white'
              }`}>
                <div className="overflow-x-auto">
                  <table className="data-table text-xs">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Tigrinya Text Sample</th>
                        <th>Predicted</th>
                        <th className="text-right">Confidence</th>
                        <th>Markers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBatch.map((item, idx) => (
                        <tr 
                          key={item.id} 
                          className={`transition-colors ${
                            isDark ? 'hover:bg-slate-950/50' : 'hover:bg-[#F2F5F0]'
                          }`}
                        >
                          <td className={`py-2.5 px-3 font-mono ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                            {idx + 1}
                          </td>
                          <td className="font-serif text-sm max-w-md truncate">
                            {item.text}
                          </td>
                          <td className="whitespace-nowrap">
                            {item.confidence === 0 ? (
                              <span className="px-2 py-0.5 rounded-[3px] font-semibold text-[11px] text-red-500 bg-red-500/10">
                                {item.rejectionReason === 'amharic' ? 'Refused: Amharic, input Tigrinya' : 'Refused: not Tigrinya'}
                              </span>
                            ) : (
                            <span className={`px-2 py-0.5 rounded-[3px] font-semibold text-[11px] ${
                              item.predictedVariety === 'Variety Z'
                                ? 'text-cyan-400 bg-cyan-400/10'
                                : item.predictedVariety === 'Variety L'
                                ? 'text-amber-600 bg-amber-500/10'
                                : 'text-blue-600 bg-blue-500/10'
                            }`}>
                              {item.predictedVariety}
                            </span>
                            )}
                          </td>
                          <td className="text-right font-mono font-semibold whitespace-nowrap">
                            {item.confidence === 0 ? '—' : `${(item.confidence * 100).toFixed(1)}%`}
                          </td>
                          <td className={`py-2.5 px-3 font-serif text-xs ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'} whitespace-nowrap`}>
                            {item.diagnosticTokens.slice(0, 3).join(', ') || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}


        </div>
      )}

      {/* Citations and Research Attribution Card */}
      <div className={`p-4 rounded-[6px] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-[#ECEFEA] border-[#C5CEC8]'
      }`}>
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>
            Ground truth models & corpora: <em className="font-serif">Haileslasie, Hadgu & Abate (2024)</em>. OpenReview forum <strong className="font-mono">kiG8qiUFm2u</strong>.
          </span>
        </div>
        <a
          href="https://openreview.net/pdf?id=kiG8qiUFm2u"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-cyan-400 hover:underline"
        >
          <span>View PDF Paper</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};
