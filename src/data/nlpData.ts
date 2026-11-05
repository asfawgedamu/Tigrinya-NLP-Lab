/**
 * Tigrinya NLP & Dialect Identification (TDI) Benchmark Data
 * Based on research paper: Tigrinya Dialect Identification (OpenReview: kiG8qiUFm2u)
 * Authors: Asfaw Gedamu Haileslasie, Asmelash Teka Hadgu, Solomon Teferra Abate
 */

export interface FidelRow {
  consonantName: string;
  translit: string;
  order: string[]; // 7 vowel forms: Ge'ez (ä), Ka'eb (u), Sales (i), Rabe'e (a), Hames (e), Sades (ə/none), Sabe'e (o)
  category: 'Guttural' | 'Labial' | 'Dental' | 'Palatal' | 'Velar' | 'Glottal';
}

export const FIDEL_ALPHABET: FidelRow[] = [
  { consonantName: 'Hoy', translit: 'h', category: 'Guttural', order: ['ሀ', 'ሁ', 'ሂ', 'ሃ', 'ሄ', 'ህ', 'ሆ'] },
  { consonantName: 'Lawe', translit: 'l', category: 'Dental', order: ['ለ', 'ሉ', 'ሊ', 'ላ', 'ሌ', 'ል', 'ሎ'] },
  { consonantName: 'Hawt', translit: 'ḥ', category: 'Guttural', order: ['ሐ', 'ሑ', 'ሒ', 'ሓ', 'ሔ', 'ሕ', 'ሖ'] },
  { consonantName: 'May', translit: 'm', category: 'Labial', order: ['መ', 'ሙ', 'ሚ', 'ማ', 'ሜ', 'ም', 'ሞ'] },
  { consonantName: 'Sawt', translit: 'ś', category: 'Dental', order: ['ሠ', 'ሡ', 'ሢ', 'ሣ', 'ሤ', 'ሥ', 'ሦ'] },
  { consonantName: 'Re’es', translit: 'r', category: 'Dental', order: ['ረ', 'ሩ', 'ሪ', 'ራ', 'ሬ', 'ር', 'ሮ'] },
  { consonantName: 'Sat', translit: 's', category: 'Dental', order: ['ሰ', 'ሱ', 'ሲ', 'ሳ', 'ሴ', 'ስ', 'ሶ'] },
  { consonantName: 'Sha', translit: 'š', category: 'Palatal', order: ['ሸ', 'ሹ', 'ሺ', 'ሻ', 'ሼ', 'ሽ', 'ሾ'] },
  { consonantName: 'Qaf', translit: 'q', category: 'Velar', order: ['ቀ', 'ቁ', 'ቂ', 'ቃ', 'ቄ', 'ቅ', 'ቆ'] },
  { consonantName: 'Qha', translit: 'q̄', category: 'Velar', order: ['ቐ', 'ቑ', 'ቒ', 'ቓ', 'ቔ', 'ቕ', 'ቖ'] },
  { consonantName: 'Bet', translit: 'b', category: 'Labial', order: ['በ', 'ቡ', 'ቢ', 'ባ', 'ቤ', 'ብ', 'ቦ'] },
  { consonantName: 'Te', translit: 't', category: 'Dental', order: ['ተ', 'ቱ', 'ቲ', 'ታ', 'ቴ', 'ት', 'ቶ'] },
  { consonantName: 'Chaw', translit: 'č', category: 'Palatal', order: ['ቸ', 'ቹ', 'ቺ', 'ቻ', 'ቼ', 'ች', 'ቾ'] },
  { consonantName: 'Harm', translit: 'ḫ', category: 'Guttural', order: ['ኀ', 'ኁ', 'ኂ', 'ኃ', 'ኄ', 'ኅ', 'ኆ'] },
  { consonantName: 'Nehas', translit: 'n', category: 'Dental', order: ['ነ', 'ኑ', 'ኒ', 'ና', 'ኔ', 'ን', 'ኖ'] },
  { consonantName: 'Gna', translit: 'ñ', category: 'Palatal', order: ['ኘ', 'ኙ', 'ኚ', 'ኛ', 'ኜ', 'ኝ', 'ኞ'] },
  { consonantName: '’Alf', translit: '’', category: 'Glottal', order: ['አ', 'ኡ', 'ኢ', 'ኣ', 'ኤ', 'እ', 'ኦ'] },
  { consonantName: 'Kaf', translit: 'k', category: 'Velar', order: ['ከ', 'ኩ', 'ኪ', 'ካ', 'ኬ', 'ክ', 'ኮ'] },
  { consonantName: 'Kha', translit: 'ḵ', category: 'Velar', order: ['ኸ', 'ኹ', 'ኺ', 'ኻ', 'ኼ', 'ኽ', 'ኾ'] },
  { consonantName: 'Waw', translit: 'w', category: 'Labial', order: ['ወ', 'ዉ', 'ዊ', 'ዋ', 'ዌ', 'ው', 'ዎ'] },
  { consonantName: '’Ayn', translit: '‘', category: 'Guttural', order: ['ዐ', 'ዑ', 'ዒ', 'ዓ', 'ዔ', 'ዕ', 'ዖ'] },
  { consonantName: 'Zay', translit: 'z', category: 'Dental', order: ['ዘ', 'ዙ', 'ዚ', 'ዛ', 'ዜ', 'ዝ', 'ዞ'] },
  { consonantName: 'Zha', translit: 'ž', category: 'Palatal', order: ['ዠ', 'ዡ', 'ዢ', 'ዣ', 'ዤ', 'ዥ', 'ዦ'] },
  { consonantName: 'Yaman', translit: 'y', category: 'Palatal', order: ['የ', 'ዩ', 'ዪ', 'ያ', 'ዬ', 'ይ', 'ዮ'] },
  { consonantName: 'Dent', translit: 'd', category: 'Dental', order: ['ደ', 'ዱ', 'ዲ', 'ዳ', 'ዴ', 'ድ', 'ዶ'] },
  { consonantName: 'Jent', translit: 'ǧ', category: 'Palatal', order: ['ጀ', 'ጁ', 'ጂ', 'ጃ', 'ጄ', 'ጅ', 'ጆ'] },
  { consonantName: 'Gaml', translit: 'g', category: 'Velar', order: ['ገ', 'ጉ', 'ጊ', 'ጋ', 'ጌ', 'ግ', 'ጎ'] },
  { consonantName: 'T’ayt', translit: 'ṭ', category: 'Dental', order: ['ጠ', 'ጡ', 'ጢ', 'ጣ', 'ጤ', 'ጥ', 'ጦ'] },
  { consonantName: 'Ch’ayt', translit: 'č’', category: 'Palatal', order: ['ጨ', 'ጩ', 'ጪ', 'ጫ', 'ጬ', 'ጭ', 'ጮ'] },
  { consonantName: 'P’ayt', translit: 'p’', category: 'Labial', order: ['ጰ', 'ጱ', 'ጲ', 'ጳ', 'ጴ', 'ጵ', 'ጶ'] },
  { consonantName: 'Ts’aday', translit: 'ṣ', category: 'Dental', order: ['ጸ', 'ጹ', 'ጺ', 'ጻ', 'ጼ', 'ጽ', 'ጾ'] },
  { consonantName: 'Ts’appa', translit: 'ṣ́', category: 'Dental', order: ['ፀ', 'ፁ', 'ፂ', 'ፃ', 'ፄ', 'ፅ', 'ፆ'] },
  { consonantName: 'Af', translit: 'f', category: 'Labial', order: ['ፈ', 'ፉ', 'ፊ', 'ፋ', 'ፌ', 'ፍ', 'ፎ'] },
  { consonantName: 'Psa', translit: 'p', category: 'Labial', order: ['ፐ', 'ፑ', 'ፒ', 'ፓ', 'ፔ', 'ፕ', 'ፖ'] }
];

export const VOWEL_ORDERS = [
  { index: 0, name: 'ግዕዝ (1st)', vowel: 'ä', description: 'Base vowel (inherent schwa/mid-central)' },
  { index: 1, name: 'ካዕብ (2nd)', vowel: 'u', description: 'High-back rounded' },
  { index: 2, name: 'ሳልስ (3rd)', vowel: 'i', description: 'High-front unrounded' },
  { index: 3, name: 'ራብዕ (4th)', vowel: 'a', description: 'Low-central open' },
  { index: 4, name: 'ኃምስ (5th)', vowel: 'e', description: 'Mid-front unrounded' },
  { index: 5, name: 'ሳድስ (6th)', vowel: 'ə / ∅', description: 'Short central vowel or consonantal coda' },
  { index: 6, name: 'ሳብዕ (7th)', vowel: 'o', description: 'Mid-back rounded' }
];

export interface DialectSample {
  id: string;
  text: string;
  translation: string;
  source: string;
  variety: 'Variety Z' | 'Variety L' | 'Variety D';
  dialectName: string;
  location: string;
  confidenceScore: number;
  distinctiveTokens: string[];
  explanation: string;
}

export const SAMPLE_SENTENCES: DialectSample[] = [
  {
    id: 's1',
    text: 'ንሕና ኣብ መቐለ ዩኒቨርሲቲ ንሰርሕ ኣለና። እቲ ናይ ምርምር ስራሕ ብጽቡቕ ይቕጽል ኣሎ።',
    translation: 'We are working at Mekelle University. The research project is progressing well.',
    source: 'Kilte Zantatat & Academic Corpus',
    variety: 'Variety Z',
    dialectName: 'Ethiopian Tigrinya (Tigray Central)',
    location: 'Tigray, Ethiopia',
    confidenceScore: 0.964,
    distinctiveTokens: ['ኣለና', 'ይቕጽል', 'ኣሎ', 'ብጽቡቕ'],
    explanation: 'Uses characteristic Ethiopian Tigrinya auxiliary verb compounding (ኣለና) and phonological root inflection.'
  },
  {
    id: 's2',
    text: 'እቲ ሰብ ድሰርሐ ሎ ስራሕ ድደሊ ሎ ዓርኪ ድገብሮ ሎ ፃዕሪ ድንሆ ብድ ...',
    translation: 'The person working is seeking work, friends doing it, Rayyan effort...',
    source: 'Rayya Corpus (ድ/ደ prefixes & ድንሆ)',
    variety: 'Variety D',
    dialectName: 'Raya Tigrinya Variety',
    location: 'Raya Azebo / Korem, Ethiopia',
    confidenceScore: 0.948,
    distinctiveTokens: ['ድሰርሐ', 'ድደሊ', 'ድገብሮ', 'ድንሆ', 'ብድ'],
    explanation: 'Demonstrates Rayyan alveolar stop prefix shift (ድሰርሐ, ድደሊ) and Rayyan existential marker (ድንሆ).'
  },
  {
    id: 's3',
    text: 'ኣብቲ ዓዲ ዝነበሩ ዓበይቲ ዓዲ ንኩሉ ብዕርቂን ብሰላምን ፈቲሖሞ።',
    translation: 'The village elders in that settlement resolved everything through reconciliation and peace.',
    source: 'Erqi Enderta Corpus',
    variety: 'Variety L',
    dialectName: 'Southern & Eastern Tigray Variety',
    location: 'Enderta & Raya, Ethiopia',
    confidenceScore: 0.932,
    distinctiveTokens: ['ዕርቂን', 'ዓበይቲ', 'ፈቲሖሞ'],
    explanation: 'Features regional nominal suffixes and phonetic preservation typical of the Enderta/Fato linguistic area.'
  },
  {
    id: 's4',
    text: 'እዚ ናይ ትግርኛ ቋንቋ ሞዴል ንኹሎም ቀዳሞት መጽናዕትታት ብ92.98% በሊጹ እዩ።',
    translation: 'This Tigrinya language model outperformed all previous studies at 92.98% accuracy.',
    source: 'TDI Research Benchmark',
    variety: 'Variety Z',
    dialectName: 'TDI Standard Benchmark',
    location: 'OpenReview (kiG8qiUFm2u)',
    confidenceScore: 0.958,
    distinctiveTokens: ['ሞዴል', 'መጽናዕትታት', 'በሊጹ'],
    explanation: 'Benchmark test sentence evaluating vocabulary preservation and character CNN receptive fields.'
  }
];

export const BENCHMARK_MODELS = [
  {
    name: 'Character-level CNN (Proposed)',
    architecture: 'Char Embeddings (d=128) -> Conv1D (k=3,5,7) -> MaxPool -> Dense (256) -> Softmax',
    accuracy: 92.98,
    f1Score: 0.928,
    macroPrecision: 0.931,
    macroRecall: 0.926,
    isWinner: true,
    strength: 'Captures subtle morphological variations and consonant gemination without relying on incomplete Ge’ez word segmenters.'
  },
  {
    name: 'Bidirectional LSTM (BiLSTM)',
    architecture: 'Word + Subword Embeddings -> 2-layer BiLSTM (h=256) -> Attention -> Softmax',
    accuracy: 90.45,
    f1Score: 0.902,
    macroPrecision: 0.905,
    macroRecall: 0.900,
    isWinner: false,
    strength: 'Strong sequential context modeling, but occasionally smoothed out hyper-local dialectal character differences.'
  },
  {
    name: 'Support Vector Machine (SVM)',
    architecture: 'TF-IDF Character n-grams (n=2..5) with linear kernel and L2 regularization',
    accuracy: 88.30,
    f1Score: 0.881,
    macroPrecision: 0.884,
    macroRecall: 0.879,
    isWinner: false,
    strength: 'High interpretability and fast inference, benchmark baseline for classical ML.'
  },
  {
    name: 'Multinomial Naive Bayes',
    architecture: 'Word & sub-word unigram + bigram counts with Laplace smoothing (alpha=1.0)',
    accuracy: 84.15,
    f1Score: 0.839,
    macroPrecision: 0.842,
    macroRecall: 0.836,
    isWinner: false,
    strength: 'Ultra-lightweight baseline, vulnerable to out-of-vocabulary terms in low-resource dialect texts.'
  }
];
