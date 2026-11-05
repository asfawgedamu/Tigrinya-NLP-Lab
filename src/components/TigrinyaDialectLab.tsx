import React, { useState, useMemo, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { SAMPLE_SENTENCES, DialectSample } from '../data/nlpData';
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
  heuristicScore: number;
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
}

// Rules and lexical/morphological patterns derived from Asfaw's paper
const VARIETY_INFO: Record<DialectVariety, {
  name: string;
  region: string;
  description: string;
  representativeColor: string;
}> = {
  'Variety Z': {
    name: 'Variety Z (Northern/Standard)',
    region: 'Western Tigray, Central / Standard, Parts of Eastern Tigray, and Eritrea',
    description: 'Characterized by relative/nominal prefixes starting with ዝ- / ዘ- (e.g. ዝወሰዶ, ዘየልመዖ, ዝበልዕ), auxiliary verb compounding (ኣለና, ዘሎ/ዘላ/ዘለው/ዘለዋ), and standard academic/media orthography.',
    representativeColor: 'text-[#B3261E]'
  },
  'Variety L': {
    name: 'Variety L (Enderta/Mekelle)',
    region: 'Around Mekelle (Enderta), Seharti-Samre, Dogua Tembien, Bora-Selewa',
    description: 'Characterized by relative/nominal prefixes starting with ል- / ለ- (e.g. ልነበሩ, ልኹሉ), [ይ] as a word connector instead of [ን], and existential markers ለሎ / ለላ / ለለው / ለለዋ (masculine/feminine/plural).',
    representativeColor: 'text-amber-600 dark:text-amber-400'
  },
  'Variety D': {
    name: 'Variety D (Rayya)',
    region: 'Raya Azebo, Ofla (Korem), Alamata, Maichew (Enda-mekoni)',
    description: 'Characterized by relative/nominal prefixes starting with ድ- / ደ- (e.g. ድሰርሕ, ድደሊ, ደይበልዐ), [ይ] word connectors, and Rayan existential markers ድንሆ / ድንሃ / ድንሀው / ድንሀዋ.',
    representativeColor: 'text-blue-600 dark:text-blue-400'
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

/**
 * Demonstration-only linguistic rules engine. It is not a trained CNN or a connected ML model.
 * Applies illustrative heuristic weighting presets and rejects detected non-Tigrinya/Amharic input.
 */
function runMockInference(text: string, id: string = 'single-1', modelChoice: string = 'char-cnn'): InferenceResult {
  const trimmed = text.trim();
  const geezMatches = trimmed.match(GEEZ_REGEX) || [];
  const geezCharCount = geezMatches.length;

  // Strict check for Amharic or non-Tigrinya text
  const amharicKeywords = [
    'የኢትዮጵያ', 'ባለሥልጣን', 'መገናኛ', 'ብዙኃን', 'በመደዴ', 'ምዕራፍ', 'ክፍል', 'ሚኒስቴር', 'ጠቅላይ', 'አስታወቁ', 'ማስታወቂያ', 'የውጭ', 'ጉዳይ', 'መንግስቲ', 'መንግስት',
    'ነው', 'ናት', 'ናቸው', 'ነበር', 'ነኝ', 'ነህ', 'ነሽ', 'ነን', 'ናችሁ', 'የሚል', 'የተደረገው', 'በሚገኘው', 'በመሆኑም', 'ስለሆነም', 'ይችላል', 'ይገባል', 'አለው', 'አላቸው', 'አለሁ', 'አለህ', 'አለሽ', 'አለች', 'አሉ', 'እንደሚገኝ', 'እንዲሁም', 'በተጨማሪም', 'ማለትም', 'የሰጡት', 'የሰጠው', 'የገለጹት', 'የገለጸው', 'የጠየቁት',
    'በሰጡት', 'መግለጫ', 'በአዲስ', 'አበባ', 'ቢሮ', 'ኮሚቴ', 'ጽህፈት', 'ቤት', 'በዚህ', 'ይህ', 'ለማድረግ', 'የሚችሉ', 'አካላት', 'የወጣው', 'ሰጠ', 'አመለከተ'
  ];
  let amharicHits = 0;
  amharicKeywords.forEach(kw => {
    if (trimmed.includes(kw)) amharicHits++;
  });

  const isEnglishOrLatin = /^[a-zA-Z\s\.,!?;:\-_0-9]+$/.test(trimmed);

  if (amharicHits > 0 || isEnglishOrLatin) {
    return {
      id,
      text: trimmed,
      predictedVariety: 'Variety Z',
      varietyLabel: 'Classification Rejected: Amharic / Non-Tigrinya Input',
      heuristicScore: 0,
      distribution: { varietyZ: 0, varietyL: 0, varietyD: 0 },
      keyFeatures: ['Input text contains Amharic or non-Tigrinya script/words. Non-Tigrinya input cannot be classified.'],
      diagnosticTokens: [],
      explanation: 'Classification Refused: Non-Tigrinya or Amharic input detected. The Tigrinya Dialect Lab strictly classifies valid Tigrinya dialect varieties (Variety Z, L, D).',
      charCount: trimmed.length,
      geezCharCount
    };
  }

  // Primary morpho-syntactic prefix counters
  const zPrefixMatches = trimmed.match(/[ዝዘ][^\s]+/g) || [];
  const lPrefixMatches = trimmed.match(/[ልለ][^\s]+/g) || [];
  const dPrefixMatches = trimmed.match(/[ድደ][^\s]+/g) || [];

  let zScore = zPrefixMatches.length * 4.0;
  let lScore = lPrefixMatches.length * 4.0;
  let dScore = dPrefixMatches.length * 4.0;

  const detectedTokens: string[] = [];
  zPrefixMatches.slice(0, 3).forEach(m => detectedTokens.push(m));
  lPrefixMatches.slice(0, 3).forEach(m => detectedTokens.push(m));
  dPrefixMatches.slice(0, 3).forEach(m => detectedTokens.push(m));

  const rayyanExistential = ['ድንሆ', 'ድንሃ', 'ድንሀው', 'ድንሀዋ', 'ራያ', 'ኦፍላ', 'ኣላማጣ'];
  const endertaExistential = ['ለሎ', 'ለላ', 'ለለው', 'ለለዋ', 'እንደርታ', 'ተምበን', 'ሰሓርቲ'];
  const standardMarkers = ['ኣለና', 'ይቕጽል', 'መቐለ', 'ዩኒቨርሲቲ', 'ምርምር', 'መጽናዕትታት', 'በሊጹ', 'ተምሃሮ', 'ሞዴል', 'ቀረባ', 'ዘሎ', 'ዘላ', 'ዘለው', 'ዘለዋ'];

  const hasYConnector = /[\u1200-\u137F]+ይ\b/g.test(trimmed) || trimmed.includes('ይ ሰላም') || trimmed.includes('ይ ብዕርቂ');
  const hasNConnector = /[\u1200-\u137F]+ን\b/g.test(trimmed) || trimmed.includes('ንኩሉ') || trimmed.includes('ንሰርሕ');

  rayyanExistential.forEach(m => {
    if (trimmed.includes(m)) {
      dScore += 6.0;
      if (!detectedTokens.includes(m)) detectedTokens.push(m);
    }
  });

  endertaExistential.forEach(m => {
    if (trimmed.includes(m)) {
      lScore += 6.0;
      if (!detectedTokens.includes(m)) detectedTokens.push(m);
    }
  });

  standardMarkers.forEach(m => {
    if (trimmed.includes(m)) {
      zScore += 4.0;
      if (!detectedTokens.includes(m)) detectedTokens.push(m);
    }
  });

  if (hasYConnector) {
    lScore += 3.0;
    dScore += 3.0;
  }
  if (hasNConnector) {
    zScore += 2.5;
  }

  zScore += 2.0;

  // Apply illustrative rule-weighting presets; no trained model is invoked
  if (modelChoice === 'afro-xlmr-transformer') {
    zScore *= 1.08; lScore *= 1.08; dScore *= 1.08;
  } else if (modelChoice === 'naive-bayes') {
    zScore = Math.sqrt(zScore) + 2.5;
    lScore = Math.sqrt(lScore) + 2.5;
    dScore = Math.sqrt(dScore) + 2.5;
  } else if (modelChoice === 'svm') {
    if (zScore >= lScore && zScore >= dScore) zScore *= 1.25;
    else if (lScore >= zScore && lScore >= dScore) lScore *= 1.25;
    else dScore *= 1.25;
  }

  let totalRaw = zScore + lScore + dScore;
  if (totalRaw === 0) totalRaw = 1;

  let pZ = zScore / totalRaw;
  let pL = lScore / totalRaw;
  let pD = dScore / totalRaw;

  // Determine winner
  let predictedVariety: DialectVariety = 'Variety Z';
  let rawWinningProb = pZ;

  if (dScore > zScore && dScore >= lScore) {
    predictedVariety = 'Variety D';
    rawWinningProb = pD;
  } else if (lScore > zScore && lScore > dScore) {
    predictedVariety = 'Variety L';
    rawWinningProb = pL;
  } else {
    predictedVariety = 'Variety Z';
    rawWinningProb = pZ;
  }

  // Demonstration score derived from heuristic signals; it is not calibrated heuristicScore
  let presetAdjustment = 0;
  if (modelChoice === 'afro-xlmr-transformer') presetAdjustment = 0.025;
  else if (modelChoice === 'char-cnn') presetAdjustment = 0.012;
  else if (modelChoice === 'cnn-bilstm') presetAdjustment = 0.006;
  else if (modelChoice === 'bilstm') presetAdjustment = -0.008;
  else if (modelChoice === 'ann') presetAdjustment = -0.015;
  else if (modelChoice === 'svm') presetAdjustment = -0.025;
  else if (modelChoice === 'naive-bayes') presetAdjustment = -0.035;

  const featureClarityBonus = Math.min(0.06, detectedTokens.length * 0.015 + (geezCharCount > 30 ? 0.03 : 0));
  const profileOffset = ((modelChoice.charCodeAt(0) * 17) % 7) * 0.002;
  const heuristicScore = Math.min(0.95, Math.max(0.55, rawWinningProb * 0.40 + 0.45 + featureClarityBonus + presetAdjustment + profileOffset));

  // Diagnostics and explanations
  const features: string[] = [];
  let explanation = '';

  if (predictedVariety === 'Variety D') {
    features.push('Alveolar stop shift in relative/nominal prefixes (ድ-/ደ- instead of ዝ-/ል-)');
    features.push('Rayyan existential/auxiliary markers (ድንሆ / ድንሃ / ድንሀው / ድንሀዋ)');
    features.push('Use of [ይ] word connector and colloquial Rayan clitics');
    explanation = `Identified as Variety D (Rayya) using the local heuristic rules based on [d-] relative prefixes and Rayan existential markers.`;
  } else if (predictedVariety === 'Variety L') {
    features.push('Lateral liquid prefix substitution (ል-/ለ- markers typical of Enderta / Mekelle)');
    features.push('Enderta/Mekelle existential markers (ለሎ / ለላ / ለለው / ለለዋ)');
    features.push('Use of [ይ] connector instead of [ን] between words');
    explanation = `Identified as Variety L (Enderta/Mekelle) using the local heuristic rules based on [l-] relative markers and existentials.`;
  } else {
    features.push('Standard dental alveolar fricative relative prefix (ዝ-/ዘ- markers e.g. ዝወሰደ, ዘየልመዖ)');
    features.push('Standard auxiliary verb compounding (ኣለና / ዘሎ) and [ን] connectors');
    features.push('Academic and standard media orthography concordance');
    explanation = `Identified as Variety Z (Northern/Standard) using the local heuristic rules based on standard [z-] relative clauses.`;
  }

  return {
    id,
    text: trimmed,
    predictedVariety,
    varietyLabel: VARIETY_INFO[predictedVariety].name,
    heuristicScore: Number(heuristicScore.toFixed(3)),
    distribution: {
      varietyZ: Number(pZ.toFixed(3)),
      varietyL: Number(pL.toFixed(3)),
      varietyD: Number(pD.toFixed(3))
    },
    keyFeatures: features,
    diagnosticTokens: Array.from(new Set(detectedTokens)),
    explanation,
    charCount: trimmed.length,
    geezCharCount
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
    initialText || SAMPLE_SENTENCES[0]?.text || 'ንሕና ኣብ መቐለ ዩኒቨርሲቲ ንሰርሕ ኣለና። እቲ ናይ ምርምር ስራሕ ብጽቡቕ ይቕጽል ኣሎ።'
  );

  // If initialText changes from parent
  React.useEffect(() => {
    if (initialText) {
      setInputText(initialText);
      const res = runMockInference(initialText, `inf-${Date.now()}`);
      setSingleResult(res);
      setActiveTabMode('single');
    }
  }, [initialText]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [activeTabMode, setActiveTabMode] = useState<'single' | 'batch' | 'admin-moderation'>('single');
  const [modelCategory, setModelCategory] = useState<'classic' | 'deep'>('deep');
  const [modelChoice, setModelChoice] = useState<string>('char-cnn');

  // Re-run inference immediately when modelChoice changes
  React.useEffect(() => {
    if (inputText.trim()) {
      const res = runMockInference(inputText, `inf-${Date.now()}`, modelChoice);
      setSingleResult(res);
    }
  }, [modelChoice]);

  const [isLabAdminAuth, setIsLabAdminAuth] = useState<boolean>(false);
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
  const [feedbackQueue, setFeedbackQueue] = useState<Array<{
    id: string;
    text: string;
    predicted: string;
    errorType: string;
    correct: string;
    notes: string;
    timestamp: string;
    status: 'Pending Validation' | 'Approved' | 'Rejected';
    moderatorComment?: string;
  }>>([
    {
      id: 'fb-sample-1',
      text: 'ንሕና ኣብ መቐለ ዩኒቨርሲቲ ንሰርሕ ኣለና።',
      predicted: 'Variety Z (Northern/Standard)',
      errorType: 'False Positive',
      correct: 'Variety L (Enderta/Mekelle)',
      notes: 'Contains Enderta local lexical clitics and connector structure.',
      timestamp: '08:14 AM',
      status: 'Pending Validation'
    }
  ]);

  const [reviewComment, setReviewComment] = useState<{ [id: string]: string }>({});
  const [moderationFilter, setModerationFilter] = useState<'All' | 'Pending Validation' | 'Approved' | 'Rejected'>('All');

  const handleApproveReport = (id: string) => {
    const comment = reviewComment[id] || 'Approved by senior linguistic reviewer. Validated against corpus codebook.';
    setFeedbackQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'Approved', moderatorComment: comment } : item));
    setReviewComment(prev => ({ ...prev, [id]: '' }));
  };

  const handleRejectReport = (id: string) => {
    const comment = reviewComment[id] || 'Rejected: Does not meet dialect morpho-syntactic verification thresholds.';
    setFeedbackQueue(prev => prev.map(item => item.id === id ? { ...item, status: 'Rejected', moderatorComment: comment } : item));
    setReviewComment(prev => ({ ...prev, [id]: '' }));
  };

  const handleSubmitMisclassification = () => {
    const newEntry = {
      id: `fb-${Date.now()}`,
      text: singleResult.text,
      predicted: singleResult.predictedVariety,
      errorType: misclassificationType,
      correct: suggestedCorrectVariety,
      notes: feedbackNotes || 'No explanatory notes provided',
      timestamp: new Date().toLocaleTimeString(),
      status: 'Pending Validation' as const
    };
    setFeedbackQueue(prev => [newEntry, ...prev]);
    setFeedbackNotes('');
    setShowFeedbackForm(false);
    setExpertFeedback({
      given: true,
      correctVariety: suggestedCorrectVariety,
      message: `Misclassification report recorded locally in the Moderation Dashboard (${feedbackQueue.length + 1} total).`
    });
  };

  const handleExpertFeedback = (correctVar: DialectVariety) => {
    setSingleResult(prev => ({
      ...prev,
      predictedVariety: correctVar,
      varietyLabel: VARIETY_INFO[correctVar].name,
      heuristicScore: 1.0,
      distribution: {
        varietyZ: correctVar === 'Variety Z' ? 1.0 : 0.0,
        varietyL: correctVar === 'Variety L' ? 1.0 : 0.0,
        varietyD: correctVar === 'Variety D' ? 1.0 : 0.0
      },
      explanation: `Expert correction recorded locally as ${VARIETY_INFO[correctVar].name}. This browser demo does not update model training data.`
    }));
    setExpertFeedback({
      given: true,
      correctVariety: correctVar,
      message: `Feedback recorded in the local demonstration queue. No server-side storage or model retraining occurred.`
    });
  };

  // Single inference result
  const [singleResult, setSingleResult] = useState<InferenceResult>(() =>
    runMockInference(
      SAMPLE_SENTENCES[0]?.text || 'ንሕና ኣብ መቐለ ዩኒቨርሲቲ ንሰርሕ ኣለና። እቲ ናይ ምርምር ስራሕ ብጽቡቕ ይቕጽል ኣሎ።',
      'initial-1'
    )
  );

  // Batch results
  const [batchResults, setBatchResults] = useState<InferenceResult[]>([]);
  const [batchFilter, setBatchFilter] = useState<'all' | DialectVariety>('all');

  // Quick preset samples
  const quickSamples = [
    {
      title: 'Variety Z (Northern/Standard)',
      variety: 'Variety Z',
      text: 'ንሕና ኣብ መቐለ ዩኒቨርሲቲ ንሰርሕ ኣለና። እቲ ናይ ምርምር ስራሕ ዝወሰዶ ዘየልመዖ ዘሎ ብጽቡቕ ይቕጽል ኣሎ።',
      source: 'Standard Academic & Northern Corpus (ዝ/ዘ prefixes & ዘሎ/ዘላ)'
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
    setTimeout(() => {
      const result = runMockInference(inputText, `inf-${Date.now()}`, modelChoice);
      setSingleResult(result);
      setIsRunning(false);
    }, 280);
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
        setTimeout(() => {
          const results = lines.map((line, idx) => {
            // Strip CSV quotes if needed
            let cleanLine = line;
            if (line.includes(',') && line.startsWith('"')) {
              const match = line.match(/^"([^"]+)"/);
              if (match) cleanLine = match[1];
            } else if (line.includes(',')) {
              cleanLine = line.split(',')[0].trim();
            }
            return runMockInference(cleanLine, `batch-${idx + 1}`);
          });
          setBatchResults(results);
          setIsRunning(false);
        }, 400);
      } else {
        // Single line file
        setInputText(content);
        setActiveTabMode('single');
        const res = runMockInference(content, 'upload-single');
        setSingleResult(res);
      }
    };
    reader.readAsText(file);
  };

  // Export batch predictions to CSV
  const handleExportCSV = () => {
    if (batchResults.length === 0) return;
    const headers = ['ID', 'Text', 'Predicted Variety', 'Heuristic Score', 'P(Variety Z)', 'P(Variety L)', 'P(Variety D)', 'Key Tokens'];
    const rows = batchResults.map(r => [
      r.id,
      `"${r.text.replace(/"/g, '""')}"`,
      r.predictedVariety,
      r.heuristicScore,
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
    return batchResults.filter(r => r.predictedVariety === batchFilter);
  }, [batchResults, batchFilter]);

  // Batch stats summary
  const batchStats = useMemo(() => {
    if (batchResults.length === 0) return null;
    const total = batchResults.length;
    const countZ = batchResults.filter(r => r.predictedVariety === 'Variety Z').length;
    const countL = batchResults.filter(r => r.predictedVariety === 'Variety L').length;
    const countD = batchResults.filter(r => r.predictedVariety === 'Variety D').length;
    const avgHeuristicScore = batchResults.reduce((acc, r) => acc + r.heuristicScore, 0) / total;

    return {
      total,
      countZ,
      countL,
      countD,
      pctZ: ((countZ / total) * 100).toFixed(1),
      pctL: ((countL / total) * 100).toFixed(1),
      pctD: ((countD / total) * 100).toFixed(1),
      avgHeuristicScore: (avgHeuristicScore * 100).toFixed(1)
    };
  }, [batchResults]);

  const copyInferenceJson = () => {
    navigator.clipboard.writeText(JSON.stringify(singleResult, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-[8px] border transition-colors ${
        isDark 
          ? 'bg-[#16282B] border-[#27393C] text-[#E6ECE8]' 
          : 'bg-[#F2F5F0] border-[#C5CEC8] text-[#17262A]'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded-[4px] bg-[#B3261E] text-white font-bold">
                TDI Lab
              </span>
              <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>
                OpenReview: kiG8qiUFm2u
              </span>
              <span>·</span>
              <span className={isDark ? 'text-[#F46A5E]' : 'text-[#B3261E] font-medium'}>
                Rule-based prototype · not model-backed
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight">
              Tigrinya Dialect Lab
            </h2>
            <p className={`text-sm sm:text-base max-w-2xl leading-relaxed ${
              isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'
            }`}>
              Demonstration interface using the project's current heuristic rules. It is not connected to trained model weights or a model-serving API. Upload dataset files or paste Ge&apos;ez sentences to explore the prototype.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            <button
              onClick={() => setActiveTabMode('single')}
              className={`px-4 py-2 rounded-[4px] text-xs font-mono font-medium transition-colors cursor-pointer border ${
                activeTabMode === 'single'
                  ? 'bg-[#B3261E] text-white border-[#B3261E]'
                  : isDark 
                    ? 'bg-[#0F1D1F] border-[#27393C] text-[#9DB0AE] hover:text-[#E6ECE8]' 
                    : 'bg-white border-[#C5CEC8] text-[#516064] hover:text-[#17262A]'
              }`}
            >
              Direct Text Inference
            </button>
            <button
              onClick={() => setActiveTabMode('batch')}
              className={`px-4 py-2 rounded-[4px] text-xs font-mono font-medium transition-colors cursor-pointer border ${
                activeTabMode === 'batch'
                  ? 'bg-[#B3261E] text-white border-[#B3261E]'
                  : isDark 
                    ? 'bg-[#0F1D1F] border-[#27393C] text-[#9DB0AE] hover:text-[#E6ECE8]' 
                    : 'bg-white border-[#C5CEC8] text-[#516064] hover:text-[#17262A]'
              }`}
            >
              Batch File / Corpus Mode {batchResults.length > 0 && `(${batchResults.length})`}
            </button>
            <button
              onClick={() => setActiveTabMode('admin-moderation')}
              className={`px-4 py-2 rounded-[4px] text-xs font-mono font-medium transition-colors cursor-pointer border flex items-center gap-1.5 ${
                activeTabMode === 'admin-moderation'
                  ? 'bg-[#B3261E] text-white border-[#B3261E]'
                  : isDark 
                    ? 'bg-[#0F1D1F] border-[#27393C] text-[#9DB0AE] hover:text-[#E6ECE8]' 
                    : 'bg-white border-[#C5CEC8] text-[#516064] hover:text-[#17262A]'
              }`}
            >
              <span>Admin Moderation Dashboard</span>
              {feedbackQueue.filter(f => f.status === 'Pending Validation').length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                  {feedbackQueue.filter(f => f.status === 'Pending Validation').length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ADMIN MODERATION & APPROVAL DASHBOARD */}
      {activeTabMode === 'admin-moderation' && (
        isLabAdminAuth ? (
          <div className={`p-6 rounded-[8px] border space-y-6 ${
            isDark ? 'bg-[#16282B] border-[#27393C]' : 'bg-white border-[#C5CEC8] shadow-2xs'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-inherit">
              <div>
                <h3 className="font-serif text-xl font-semibold">Admin Moderation &amp; Approval Dashboard</h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                  Review demonstration submissions. Decisions are held in browser memory only and do not update a training dataset.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                {(['All', 'Pending Validation', 'Approved', 'Rejected'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setModerationFilter(filter)}
                    className={`px-3 py-1.5 rounded-[4px] border transition cursor-pointer ${
                      moderationFilter === filter
                        ? 'bg-[#B3261E] text-white border-[#B3261E]'
                        : isDark ? 'bg-[#0F1D1F] border-[#27393C] text-[#9DB0AE]' : 'bg-[#ECEFEA] border-[#C5CEC8] text-[#516064]'
                    }`}
                  >
                    {filter} ({filter === 'All' ? feedbackQueue.length : feedbackQueue.filter(f => f.status === filter).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
              {feedbackQueue.filter(item => moderationFilter === 'All' || item.status === moderationFilter).length === 0 ? (
                <div className={`p-8 text-center rounded-[6px] border font-mono text-xs ${
                  isDark ? 'bg-[#0F1D1F] border-[#27393C] text-[#9DB0AE]' : 'bg-[#F2F5F0] border-[#C5CEC8] text-[#516064]'
                }`}>
                  No submissions found for filter &ldquo;{moderationFilter}&rdquo;.
                </div>
              ) : (
                feedbackQueue
                  .filter(item => moderationFilter === 'All' || item.status === moderationFilter)
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-[6px] border space-y-3 ${
                        isDark ? 'bg-[#0F1D1F] border-[#27393C]' : 'bg-[#F2F5F0] border-[#C5CEC8]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#B3261E]">ID: {item.id}</span>
                          <span>·</span>
                          <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>{item.timestamp}</span>
                        </div>
                        <div>
                          <span className={`px-2.5 py-0.5 rounded-[4px] font-bold text-[11px] ${
                            item.status === 'Pending Validation'
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40'
                              : item.status === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                              : 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/40'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-[4px] font-serif text-sm bg-black/10 dark:bg-white/5 border border-inherit">
                        &ldquo;{item.text}&rdquo;
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                        <div>
                          <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>Error Type:</span>
                          <div className="font-semibold mt-0.5">{item.errorType}</div>
                        </div>
                        <div>
                          <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>Predicted vs Suggested:</span>
                          <div className="font-semibold mt-0.5 text-[#B3261E]">{item.predicted} → {item.correct}</div>
                        </div>
                        <div>
                          <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>Expert Notes:</span>
                          <div className="font-medium mt-0.5 italic">{item.notes}</div>
                        </div>
                      </div>

                      {item.moderatorComment && (
                        <div className={`p-2.5 rounded-[4px] text-xs font-mono ${
                          item.status === 'Approved'
                            ? isDark ? 'bg-emerald-950/40 text-emerald-300' : 'bg-emerald-50 text-emerald-800'
                            : isDark ? 'bg-red-950/40 text-red-300' : 'bg-red-50 text-red-800'
                        }`}>
                          <strong>Reviewer Comment:</strong> {item.moderatorComment}
                        </div>
                      )}

                      {item.status === 'Pending Validation' && (
                        <div className="pt-2 border-t border-inherit space-y-2">
                          <input
                            type="text"
                            value={reviewComment[item.id] || ''}
                            onChange={(e) => setReviewComment(prev => ({ ...prev, [item.id]: e.target.value }))}
                            placeholder="Add approval or rejection comments..."
                            className={`w-full p-2 rounded-[4px] border font-mono text-xs ${
                              isDark ? 'bg-[#16282B] border-[#27393C] text-white' : 'bg-white border-[#C5CEC8] text-[#17262A]'
                            }`}
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleRejectReport(item.id)}
                              className="px-3.5 py-1.5 rounded-[4px] bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-semibold transition cursor-pointer"
                            >
                              Reject Report with Comments
                            </button>
                            <button
                              onClick={() => handleApproveReport(item.id)}
                              className="px-3.5 py-1.5 rounded-[4px] bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-semibold transition cursor-pointer"
                            >
                              Approve locally
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        ) : (
          <div className={`p-8 rounded-[8px] border max-w-md mx-auto space-y-4 text-center my-12 ${
            isDark ? 'bg-[#16282B] border-[#27393C]' : 'bg-white border-[#C5CEC8] shadow-md'
          }`}>
            <ShieldCheck className="w-12 h-12 mx-auto text-[#B3261E]" />
            <h3 className="font-serif text-xl font-semibold">Open local moderation demo</h3>
            <p className={`text-xs ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
              This demonstration queue is stored only in the current browser session. It has no server-side authentication or persistent storage and must not be used for confidential submissions.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsLabAdminAuth(true)}
                className="w-full py-2.5 rounded-[4px] bg-[#B3261E] hover:bg-[#8F1E18] text-white font-mono text-xs font-semibold transition cursor-pointer"
              >
                Open local review queue
              </button>
            </div>
          </div>
        )
      )}

      {/* SINGLE TEXT INFERENCE MODE */}
      {activeTabMode === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Input Box & Sample Presets (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Quick Presets */}
            <div className={`p-4 rounded-[6px] border ${
              isDark ? 'bg-[#16282B] border-[#27393C]' : 'bg-[#E1E6E0] border-[#C5CEC8]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-mono uppercase tracking-wider ${
                  isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'
                }`}>
                  Load Project Sample Sentences:
                </span>
                <span className="text-[11px] font-mono text-[#B3261E]">
                  Click to Test
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickSamples.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(sample.text);
                      const res = runMockInference(sample.text, `quick-${idx}`);
                      setSingleResult(res);
                    }}
                    className={`p-2.5 text-left rounded-[4px] text-xs transition border cursor-pointer ${
                      inputText === sample.text
                        ? isDark 
                          ? 'bg-[#0F1D1F] border-[#F46A5E] text-[#E6ECE8]' 
                          : 'bg-white border-[#B3261E] text-[#17262A] shadow-2xs'
                        : isDark
                          ? 'bg-[#0F1D1F]/50 border-[#27393C] text-[#9DB0AE] hover:text-[#E6ECE8]'
                          : 'bg-white/80 border-[#C5CEC8] text-[#516064] hover:text-[#17262A]'
                    }`}
                  >
                    <div className="font-semibold text-[11px] flex items-center justify-between">
                      <span>{sample.title}</span>
                      <span className="font-mono text-[10px] text-[#B3261E]">{sample.variety}</span>
                    </div>
                    <div className="font-serif text-xs truncate mt-1 text-[#17262A] dark:text-[#E6ECE8]">
                      {sample.text}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Model Family & Architecture Selector */}
            <div className={`p-4 rounded-[6px] border space-y-3 ${
              isDark ? 'bg-[#16282B] border-[#27393C]' : 'bg-[#E1E6E0] border-[#C5CEC8]'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className={`text-xs font-mono uppercase tracking-wider ${
                  isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'
                }`}>
                  Select illustrative rule-weighting profile (not a trained model):
                </span>

                {/* Dropdown Menu for Model Selection */}
                <div className="relative">
                  <select
                    value={modelChoice}
                    onChange={(e) => {
                      const val = e.target.value;
                      setModelChoice(val);
                      if (['naive-bayes', 'svm', 'ann'].includes(val)) {
                        setModelCategory('classic');
                      } else {
                        setModelCategory('deep');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-[4px] border font-mono text-xs font-semibold focus:outline-none transition cursor-pointer ${
                      isDark 
                        ? 'bg-[#0F1D1F] border-[#27393C] text-[#E6ECE8] focus:border-[#F46A5E]' 
                        : 'bg-white border-[#C5CEC8] text-[#17262A] focus:border-[#B3261E]'
                    }`}
                  >
                    <optgroup label="Heuristic weighting presets">
                      <option value="naive-bayes">Conservative baseline weighting</option>
                      <option value="svm">Highest-rule weighting</option>
                      <option value="ann">Balanced rule weighting</option>
                    </optgroup>
                    <optgroup label="Additional simulated weighting presets">
                      <option value="char-cnn">Default heuristic profile</option>
                      <option value="cnn-bilstm">Alternative heuristic profile A</option>
                      <option value="bilstm">Alternative heuristic profile B</option>
                      <option value="afro-xlmr-transformer">Alternative heuristic profile C</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Category Toggles */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <button
                    onClick={() => {
                      setModelCategory('classic');
                      if (!['naive-bayes', 'svm', 'ann'].includes(modelChoice)) {
                        setModelChoice('svm');
                      }
                    }}
                    className={`px-3 py-1 rounded-[3px] border cursor-pointer font-semibold ${
                      modelCategory === 'classic'
                        ? 'bg-[#B3261E] text-white border-[#B3261E]'
                        : isDark ? 'bg-[#0F1D1F] border-[#27393C] text-[#9DB0AE]' : 'bg-white border-[#C5CEC8] text-[#516064]'
                    }`}
                  >
                    Conservative presets
                  </button>
                  <button
                    onClick={() => {
                      setModelCategory('deep');
                      if (['naive-bayes', 'svm', 'ann'].includes(modelChoice)) {
                        setModelChoice('afro-xlmr-transformer');
                      }
                    }}
                    className={`px-3 py-1 rounded-[3px] border cursor-pointer font-semibold ${
                      modelCategory === 'deep'
                        ? 'bg-[#B3261E] text-white border-[#B3261E]'
                        : isDark ? 'bg-[#0F1D1F] border-[#27393C] text-[#9DB0AE]' : 'bg-white border-[#C5CEC8] text-[#516064]'
                    }`}
                  >
                    Alternative presets
                  </button>
                </div>
                <span className="text-[11px] font-mono text-[#B3261E]">
                  Active: {modelChoice === 'afro-xlmr-transformer' ? 'PROFILE C' : modelChoice.toUpperCase()}
                </span>
              </div>

              {/* Specific Models within Category Cards */}
              <div className={`grid gap-2 ${modelCategory === 'classic' ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
                {modelCategory === 'classic' ? (
                  <>
                    {[
                      { id: 'naive-bayes', name: 'Conservative', acc: 'Rule profile' },
                      { id: 'svm', name: 'Highest rule', acc: 'Rule profile' },
                      { id: 'ann', name: 'Balanced', acc: 'Rule profile' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setModelChoice(m.id)}
                        className={`p-2.5 rounded-[4px] text-left border transition cursor-pointer ${
                          modelChoice === m.id
                            ? isDark ? 'bg-[#0F1D1F] border-[#B3261E] text-[#E6ECE8]' : 'bg-white border-[#B3261E] text-[#17262A] shadow-2xs'
                            : isDark ? 'bg-[#0F1D1F]/50 border-[#27393C] text-[#9DB0AE]' : 'bg-white/70 border-[#C5CEC8] text-[#516064]'
                        }`}
                      >
                        <div className="font-semibold text-xs">{m.name}</div>
                        <div className="font-mono text-[10px] text-[#B3261E] mt-0.5">{m.acc}</div>
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      { id: 'afro-xlmr-transformer', name: 'Profile C', acc: 'Rule profile' },
                      { id: 'char-cnn', name: 'Default profile', acc: 'Rule profile' },
                      { id: 'cnn-bilstm', name: 'Profile A', acc: 'Rule profile' },
                      { id: 'bilstm', name: 'Profile B', acc: 'Rule profile' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setModelChoice(m.id)}
                        className={`p-2.5 rounded-[4px] text-left border transition cursor-pointer ${
                          modelChoice === m.id
                            ? isDark ? 'bg-[#0F1D1F] border-[#B3261E] text-[#E6ECE8]' : 'bg-white border-[#B3261E] text-[#17262A] shadow-2xs'
                            : isDark ? 'bg-[#0F1D1F]/50 border-[#27393C] text-[#9DB0AE]' : 'bg-white/70 border-[#C5CEC8] text-[#516064]'
                        }`}
                      >
                        <div className="font-semibold text-xs truncate">{m.name}</div>
                        <div className="font-mono text-[10px] text-[#B3261E] mt-0.5">{m.acc}</div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Language Validation Banner */}
            {validationWarning && (
              <div className="p-3 rounded-[4px] bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{validationWarning}</span>
              </div>
            )}

            {/* Input Text Area */}
            <div className={`p-5 rounded-[6px] border space-y-3 ${
              isDark ? 'bg-[#16282B] border-[#27393C]' : 'bg-white border-[#C5CEC8] shadow-2xs'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className={isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}>
                  Ge&apos;ez Script Input (Ethiopic Unicode)
                </span>
                <div className="flex items-center gap-3 text-[11px] text-[#516064] dark:text-[#9DB0AE]">
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
                    ? 'bg-[#0F1D1F] border-[#27393C] text-[#E6ECE8] focus:border-[#F46A5E]'
                    : 'bg-white border-[#C5CEC8] text-[#17262A] focus:border-[#B3261E]'
                }`}
                placeholder="Type or paste Tigrinya sentences in Ge'ez script here..."
              />

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunSingleInference}
                    disabled={isRunning || !inputText.trim()}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-[4px] font-mono text-xs font-semibold uppercase tracking-wider text-white transition-colors cursor-pointer disabled:opacity-50 ${
                      isDark ? 'bg-[#B3261E] hover:bg-[#8F1E18]' : 'bg-[#B3261E] hover:bg-[#8F1E18]'
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Applying heuristic rules...</span>
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
                        ? 'border-[#27393C] text-[#9DB0AE] hover:text-[#E6ECE8]' 
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
                        ? 'border-[#27393C] text-[#9DB0AE] hover:text-[#E6ECE8] hover:bg-[#0F1D1F]' 
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
              isDark ? 'bg-[#16282B] border-[#27393C]' : 'bg-white border-[#C5CEC8] shadow-2xs'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-inherit">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#B3261E]" />
                  <h4 className="font-serif text-sm font-semibold">Morpho-Syntactic Rule Engine &amp; Thesis Notes</h4>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#B3261E]/10 text-[#B3261E] font-bold">
                  Primary Classifier Layer
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                As established in Asfaw Gedamu&apos;s master&apos;s thesis research (Addis Ababa University), dialect identification relies heavily on morpho-syntactic prefix and clitic alternations:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs font-mono">
                <div className={`p-3 rounded-[4px] border ${isDark ? 'bg-[#0F1D1F] border-[#27393C]' : 'bg-[#F2F5F0] border-[#C5CEC8]'}`}>
                  <div className="font-bold text-[#B3261E] mb-1">Variety Z (Northern/Standard)</div>
                  <div className="text-[11px] text-[#516064] dark:text-[#9DB0AE]">
                    Uses <strong className="text-[#17262A] dark:text-[#E6ECE8]">ዝ- / ዘ-</strong> and existentials <strong className="text-[#17262A] dark:text-[#E6ECE8]">ዘሎ/ዘላ/ዘለው/ዘለዋ</strong>.
                  </div>
                </div>
                <div className={`p-3 rounded-[4px] border ${isDark ? 'bg-[#0F1D1F] border-[#27393C]' : 'bg-[#F2F5F0] border-[#C5CEC8]'}`}>
                  <div className="font-bold text-amber-600 dark:text-amber-400 mb-1">Variety L (Enderta/Mekelle)</div>
                  <div className="text-[11px] text-[#516064] dark:text-[#9DB0AE]">
                    Uses <strong className="text-[#17262A] dark:text-[#E6ECE8]">ል- / ለ-</strong>, <strong className="text-[#17262A] dark:text-[#E6ECE8]">ይ</strong> connector, and existentials <strong className="text-[#17262A] dark:text-[#E6ECE8]">ለሎ/ለላ/ለለው/ለለዋ</strong>.
                  </div>
                </div>
                <div className={`p-3 rounded-[4px] border ${isDark ? 'bg-[#0F1D1F] border-[#27393C]' : 'bg-[#F2F5F0] border-[#C5CEC8]'}`}>
                  <div className="font-bold text-blue-600 dark:text-blue-400 mb-1">Variety D (Rayya)</div>
                  <div className="text-[11px] text-[#516064] dark:text-[#9DB0AE]">
                    Uses <strong className="text-[#17262A] dark:text-[#E6ECE8]">ድ- / ደ-</strong>, <strong className="text-[#17262A] dark:text-[#E6ECE8]">ይ</strong> connector, and existentials <strong className="text-[#17262A] dark:text-[#E6ECE8]">ድንሆ/ድንሃ/ድንሀው/ድንሀዋ</strong>.
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Real-Time Results Diagnostics (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Top Prediction Card */}
            <div className={`p-5 rounded-[6px] border space-y-4 ${
              isDark ? 'bg-[#16282B] border-[#27393C]' : 'bg-white border-[#C5CEC8] shadow-2xs'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-inherit">
                <span className={`text-xs font-mono uppercase tracking-wider ${
                  isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'
                }`}>
                  Inference Output
                </span>
                <span className="font-mono text-xs text-[#B3261E] font-semibold">
                  Heuristic rule engine
                </span>
              </div>

              {/* Main Classification Result or Rejection Error */}
              {singleResult.heuristicScore === 0 ? (
                <div className="p-4 rounded-[6px] bg-red-500/15 border border-red-500/40 text-red-700 dark:text-red-300 space-y-2">
                  <div className="font-mono text-xs font-bold uppercase flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span>Classification Refused</span>
                  </div>
                  <p className="font-serif text-sm">
                    {singleResult.explanation}
                  </p>
                  <p className="text-[11px] font-mono opacity-80">
                    Non-Tigrinya input (Amharic or English/Latin text) cannot be classified into Tigrinya dialects. Please provide valid Tigrinya Ge&apos;ez text.
                  </p>
                </div>
              ) : (
                <div>
                  <span className={`text-xs block mb-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                    Heuristic variety suggestion:
                  </span>
                  <div className="flex items-baseline justify-between">
                    <h3 className={`font-serif text-2xl font-bold ${
                      singleResult.predictedVariety === 'Variety Z'
                        ? 'text-[#B3261E]'
                        : singleResult.predictedVariety === 'Variety L'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {singleResult.predictedVariety}
                    </h3>
                    <div className="text-right">
                      <span className="font-mono text-xl font-bold">
                        {(singleResult.heuristicScore * 100).toFixed(1)}%
                      </span>
                      <span className={`text-[10px] block font-mono ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                        Heuristic score (not calibrated)
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs mt-1 font-medium ${isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}`}>
                    {singleResult.varietyLabel}
                  </p>
                </div>
              )}

              {/* Recharts Heuristic Score Bar Chart */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>Heuristic score distribution (illustrative)</span>
                  <span className={isDark ? 'text-[#E6ECE8]' : 'text-[#17262A]'}>Probability Score (%)</span>
                </div>
                <div className="h-44 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Var Z', fullName: 'Variety Z (Standard/Central)', score: Number((singleResult.distribution.varietyZ * 100).toFixed(1)), fill: '#B3261E' },
                        { name: 'Var L', fullName: 'Variety L (Southern/Raya)', score: Number((singleResult.distribution.varietyL * 100).toFixed(1)), fill: '#D97706' },
                        { name: 'Var D', fullName: 'Variety D (Eritrean/Rayan)', score: Number((singleResult.distribution.varietyD * 100).toFixed(1)), fill: '#2563EB' }
                      ]}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fill: isDark ? '#9DB0AE' : '#516064', fontSize: 10 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: isDark ? '#E6ECE8' : '#17262A', fontSize: 11, fontWeight: 600 }} width={48} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#0F1D1F' : '#FFFFFF',
                          borderColor: isDark ? '#27393C' : '#C5CEC8',
                          borderRadius: '6px',
                          color: isDark ? '#E6ECE8' : '#17262A',
                          fontSize: '12px',
                          fontFamily: 'monospace'
                        }}
                        formatter={(value: any) => [`${value}%`, 'Heuristic score']}
                        labelFormatter={(label: any, payload: any) => payload?.[0]?.payload?.fullName || label}
                      />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={18}>
                        {[
                          { fill: '#B3261E' },
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
                            ? 'bg-[#0F1D1F] border-[#27393C] text-[#E6ECE8]' 
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
                      <span className="text-[#B3261E] font-mono">›</span>
                      <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expert Active Learning Feedback & Misclassification Report Section */}
              <div className="pt-3 border-t border-inherit space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>
                    Expert Dialect Validation &amp; Active Learning:
                  </span>
                  <div className="flex items-center gap-2">
                    {feedbackQueue.length > 0 && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-[10px]">
                        {feedbackQueue.length} Local demo submissions
                      </span>
                    )}
                    <button
                      onClick={() => setShowFeedbackForm(prev => !prev)}
                      className="px-2.5 py-1 rounded-[3px] bg-[#B3261E] text-white text-[11px] font-semibold hover:bg-[#8F1E18] transition cursor-pointer"
                    >
                      {showFeedbackForm ? 'Close Form' : 'Report Misclassification (False Positive/Negative)'}
                    </button>
                  </div>
                </div>

                {expertFeedback.message && !showFeedbackForm && (
                  <div className={`p-2.5 rounded-[4px] text-xs font-mono ${
                    isDark ? 'bg-emerald-950/40 border border-emerald-800 text-emerald-200' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  }`}>
                    {expertFeedback.message}
                  </div>
                )}

                {/* Detailed Misclassification & Feedback Form */}
                {showFeedbackForm && (
                  <div className={`p-4 rounded-[6px] border space-y-3 animate-fadeIn ${
                    isDark ? 'bg-[#0F1D1F] border-[#27393C]' : 'bg-[#F2F5F0] border-[#C5CEC8]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#B3261E]">
                        Report False Positive / False Negative Correction
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Active Learning v2.4</span>
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
                            isDark ? 'bg-[#16282B] border-[#27393C] text-white' : 'bg-white border-[#C5CEC8] text-[#17262A]'
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
                            isDark ? 'bg-[#16282B] border-[#27393C] text-white' : 'bg-white border-[#C5CEC8] text-[#17262A]'
                          }`}
                        >
                          <option value="Variety Z">Variety Z (Northern &amp; Central Standard)</option>
                          <option value="Variety L">Variety L (Mekelle / Enderta &amp; Tembien)</option>
                          <option value="Variety D">Variety D (Colloquial Rayan Variant)</option>
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
                          isDark ? 'bg-[#16282B] border-[#27393C] text-white' : 'bg-white border-[#C5CEC8] text-[#17262A]'
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setShowFeedbackForm(false)}
                        className="px-3 py-1.5 rounded-[4px] text-xs font-mono border border-slate-600 text-slate-300 hover:bg-slate-800 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitMisclassification}
                        className="px-4 py-1.5 rounded-[4px] bg-[#B3261E] hover:bg-[#8F1E18] text-white font-mono text-xs font-semibold transition cursor-pointer"
                      >
                        Submit correction to local demo queue
                      </button>
                    </div>
                  </div>
                )}

                {!showFeedbackForm && !expertFeedback.given && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-mono text-[#516064] dark:text-[#9DB0AE]">Quick Override to:</span>
                    {(['Variety Z', 'Variety L', 'Variety D'] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => handleExpertFeedback(v)}
                        className={`px-2.5 py-1 rounded-[3px] font-mono text-xs border transition cursor-pointer ${
                          singleResult.predictedVariety === v
                            ? 'bg-[#B3261E] text-white border-[#B3261E]'
                            : isDark ? 'bg-[#0F1D1F] border-[#27393C] text-[#9DB0AE] hover:text-[#E6ECE8]' : 'bg-[#ECEFEA] border-[#C5CEC8] text-[#516064]'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Copy Result JSON */}
              <div className="pt-3 border-t border-inherit flex items-center justify-between">
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

            </div>

          </div>

        </div>
      )}

      {/* BATCH FILE / CORPUS EVALUATION MODE */}
      {activeTabMode === 'batch' && (
        <div className="space-y-6">
          
          {/* File Upload Box */}
          <div className={`p-6 rounded-[6px] border space-y-4 ${
            isDark ? 'bg-[#16282B] border-[#27393C]' : 'bg-white border-[#C5CEC8] shadow-2xs'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-semibold">
                  Batch Dialect Evaluation & File Ingestion
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] bg-[#B3261E] text-white font-mono text-xs font-medium transition cursor-pointer hover:bg-[#8F1E18]"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose File (.txt, .csv, .tsv)</span>
                </button>
              </div>
            </div>

            {fileName && (
              <div className={`p-3 rounded-[4px] border flex items-center justify-between text-xs font-mono ${
                isDark ? 'bg-[#0F1D1F] border-[#27393C]' : 'bg-[#ECEFEA] border-[#C5CEC8]'
              }`}>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#B3261E]" />
                  <span>{fileName}</span>
                  <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>({fileSize})</span>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
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
                  isDark ? 'bg-[#16282B] border-[#27393C]' : 'bg-white border-[#C5CEC8]'
                }`}>
                  <div className="font-mono text-2xl font-bold">{batchStats.total}</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>Total Evaluated</div>
                </div>

                <div className={`p-4 rounded-[6px] border ${
                  isDark ? 'bg-[#16282B] border-[#27393C]' : 'bg-white border-[#C5CEC8]'
                }`}>
                  <div className="font-mono text-2xl font-bold text-[#B3261E]">
                    {batchStats.countZ} <span className="text-xs font-normal">({batchStats.pctZ}%)</span>
                  </div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>Variety Z (Ethiopian)</div>
                </div>

                <div className={`p-4 rounded-[6px] border ${
                  isDark ? 'bg-[#16282B] border-[#27393C]' : 'bg-white border-[#C5CEC8]'
                }`}>
                  <div className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {batchStats.countL} <span className="text-xs font-normal">({batchStats.pctL}%)</span>
                  </div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>Variety L (Southern)</div>
                </div>

                <div className={`p-4 rounded-[6px] border ${
                  isDark ? 'bg-[#16282B] border-[#27393C]' : 'bg-white border-[#C5CEC8]'
                }`}>
                  <div className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {batchStats.countD} <span className="text-xs font-normal">({batchStats.pctD}%)</span>
                  </div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>Variety D (Eritrean)</div>
                </div>
              </div>

              {/* Action and Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>Filter by Class:</span>
                  {(['all', 'Variety Z', 'Variety L', 'Variety D'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setBatchFilter(v)}
                      className={`px-2.5 py-1 rounded-[3px] transition border cursor-pointer ${
                        batchFilter === v
                          ? 'bg-[#B3261E] text-white border-[#B3261E]'
                          : isDark
                            ? 'bg-[#16282B] border-[#27393C] text-[#9DB0AE]'
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
                      ? 'border-[#27393C] text-[#E6ECE8] hover:bg-[#16282B]' 
                      : 'border-[#C5CEC8] text-[#17262A] hover:bg-[#E1E6E0]'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Predictions (CSV)</span>
                </button>
              </div>

              {/* Batch Results Table */}
              <div className={`rounded-[6px] border overflow-hidden ${
                isDark ? 'border-[#27393C] bg-[#16282B]' : 'border-[#C5CEC8] bg-white'
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className={`border-b ${
                      isDark ? 'border-[#27393C] bg-[#0F1D1F] text-[#9DB0AE]' : 'border-[#C5CEC8] bg-[#F2F5F0] text-[#516064]'
                    }`}>
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">#</th>
                        <th className="py-2.5 px-3 font-semibold">Tigrinya Text Sample</th>
                        <th className="py-2.5 px-3 font-semibold">Predicted</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Heuristic score</th>
                        <th className="py-2.5 px-3 font-semibold">Markers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-inherit">
                      {filteredBatch.map((item, idx) => (
                        <tr 
                          key={item.id} 
                          className={`transition-colors ${
                            isDark ? 'hover:bg-[#0F1D1F]/50' : 'hover:bg-[#F2F5F0]'
                          }`}
                        >
                          <td className="py-2.5 px-3 font-mono text-[#516064] dark:text-[#9DB0AE]">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-serif text-sm max-w-md truncate">
                            {item.text}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-[3px] font-semibold text-[11px] ${
                              item.predictedVariety === 'Variety Z'
                                ? 'text-[#B3261E] bg-[#B3261E]/10'
                                : item.predictedVariety === 'Variety L'
                                ? 'text-amber-600 bg-amber-500/10'
                                : 'text-blue-600 bg-blue-500/10'
                            }`}>
                              {item.predictedVariety}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold whitespace-nowrap">
                            {(item.heuristicScore * 100).toFixed(1)}%
                          </td>
                          <td className="py-2.5 px-3 font-serif text-xs text-[#516064] dark:text-[#9DB0AE] whitespace-nowrap">
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

          {batchResults.length === 0 && (
            <div className={`p-8 rounded-[6px] border text-center space-y-3 ${
              isDark ? 'bg-[#16282B] border-[#27393C]' : 'bg-[#F2F5F0] border-[#C5CEC8]'
            }`}>
              <Brain className="w-8 h-8 mx-auto text-[#B3261E]" />
              <div className="font-serif text-lg font-semibold">
                No Batch Corpus Loaded Yet
              </div>
              <p className={`text-xs max-w-md mx-auto ${isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}`}>
                Upload your annotated dataset file above or switch to Direct Text Inference to test individual sentences right away.
              </p>
            </div>
          )}

        </div>
      )}

      {/* Citations and Research Attribution Card */}
      <div className={`p-4 rounded-[6px] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
        isDark ? 'bg-[#0F1D1F] border-[#27393C]' : 'bg-[#ECEFEA] border-[#C5CEC8]'
      }`}>
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#B3261E] flex-shrink-0" />
          <span className={isDark ? 'text-[#9DB0AE]' : 'text-[#516064]'}>
            Research reference: <em className="font-serif">Haileslasie, Hadgu & Abate (2024)</em>. OpenReview forum <strong className="font-mono">kiG8qiUFm2u</strong>.
          </span>
        </div>
        <a
          href="https://openreview.net/pdf?id=kiG8qiUFm2u"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[#B3261E] hover:underline"
        >
          <span>View PDF Paper</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};
