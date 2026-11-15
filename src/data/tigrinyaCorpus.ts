import corpusJson from './tigrinyaCorpusData.json';

export interface CorpusUnit {
  id: string;
  index: number;
  title: string;
  category: string;
  varietyZ: string;
  varietyL: string;
  varietyD: string;
  wordCountZ: number;
  wordCountL: number;
  wordCountD: number;
  charCountZ: number;
  charCountL: number;
  charCountD: number;
}

export const TIGRINYA_CORPUS: CorpusUnit[] = corpusJson as CorpusUnit[];

export const CORPUS_CATEGORIES = [
  'All Categories',
  'Linguistics & Dialects',
  'Governance & Reform',
  'Agriculture & Land Rights',
  'Culture & Arts',
  'Environment & Ecology',
  'Social & Humanitarian'
] as const;

export interface LinguisticMarkerRule {
  featureName: string;
  description: string;
  varietyZPattern: string;
  varietyLPattern: string;
  varietyDPattern: string;
  examples: {
    z: string;
    l: string;
    d: string;
    meaning: string;
  };
}

export const LINGUISTIC_MARKER_RULES: LinguisticMarkerRule[] = [
  {
    featureName: 'Relative Clause Prefix (Relativizer)',
    description: 'The verbal prefix indicating relative clauses undergoes systematic phonetic shift from standard dental alveolar affricate /z/ in Central Tigray to lateral liquid /l/ in Southern/Raya and voiced alveolar stop /d/ in Variety D.',
    varietyZPattern: 'ዝ- / ዘ- (e.g. ዝቕስቕሱ, ዘብሉ)',
    varietyLPattern: 'ል- / ለ- (e.g. ልቕስቕሱ, ለብሉ)',
    varietyDPattern: 'ድ- / ደ- (e.g. ድቕስቕሱ, ዳብሉ)',
    examples: {
      z: 'ዘብሉ / ዝፍለጥ / ዝነበሩ',
      l: 'ለብሉ / ልፍለጥ / ልነበሩ',
      d: 'ዳብሉ / ድፍለጥ / ድነበሩ',
      meaning: 'which makes / is known / who were'
    }
  },
  {
    featureName: 'Dative / Accusative Preposition',
    description: 'Preposition of indirect and direct object marking shifts from standard nasal /n/ to lateral /l/ and stop /d/.',
    varietyZPattern: 'ን- (e.g. ንኩልኹም, ንተወሳኺ)',
    varietyLPattern: 'ል- (e.g. ልኹልኹም, ልትወሳኺ)',
    varietyDPattern: 'ድ- (e.g. ድኹልኹም, ድትወሳኺ)',
    examples: {
      z: 'ንኩልኹም / ንተወሳኺ / ንሰሉስ',
      l: 'ልኹልኹም / ልትወሳኺ / ልሰሉስ',
      d: 'ድኹልኹም / ድትወሳኺ / ድሰሉስ',
      meaning: 'to/for all of you / additionally / for Tuesday'
    }
  },
  {
    featureName: 'Negative Verbal Prefix',
    description: 'Negative conjugation prefix preceding verbs and adjectives.',
    varietyZPattern: 'ዘይ- (e.g. ዘይተረኸበ, ዘይኮነ)',
    varietyLPattern: 'ለይ- (e.g. ለይትገነየ, ተለይኾነ)',
    varietyDPattern: 'ደይ- (e.g. ደይትገነየ, ተደይኾነ)',
    examples: {
      z: 'ዘይተረኸበ / ዘይኮነ / ዘየለ',
      l: 'ለይትገነየ / ተለይኾነ / ለይለ',
      d: 'ደይትገነየ / ተደይኾነ / ደይለ',
      meaning: 'who was not found / if it is not / that which is not'
    }
  },
  {
    featureName: 'Conjunction Suffix / Particle',
    description: 'Nominal coordinating conjunction suffix.',
    varietyZPattern: '-ን (e.g. ዕድመን ጥዕናን, ፍትሕን ልምዓትን)',
    varietyLPattern: '-ይ (e.g. ዕድመይ ጥዕናይ, ፍትሒይ ልምዓትይ)',
    varietyDPattern: '-ይ (e.g. ዕድመይ ጥዕናይ, ፍትሒይ ልምዓትይ)',
    examples: {
      z: 'ዕድመን ጥዕናን / መፅሓፍን ፊልምን',
      l: 'ዕድመይ ጥዕናይ / መፅሓፍይ ፊልምይ',
      d: 'ዕድመይ ጥዕናይ / መፅሓፍይ ፊልምይ',
      meaning: 'life and health / book and film'
    }
  },
  {
    featureName: 'Directional / Allative Preposition',
    description: 'Preposition signifying motion towards a place or entity ("to / towards").',
    varietyZPattern: 'ናብ (e.g. ናብ ከተማ, ናብ መሪሕነት)',
    varietyLPattern: 'ላብ (e.g. ላብ ከተማ, ላብ መርሕነት)',
    varietyDPattern: 'ዳብ (e.g. ዳከተማ, ዳብ መርሕነት)',
    examples: {
      z: 'ናብ ከተማ / ናብ ዓዱ',
      l: 'ላብ ከተማ / ላብ ዓዱ',
      d: 'ዳከተማ (ዳብ) / ዳብ ዓዱ',
      meaning: 'to the city / towards his village'
    }
  },
  {
    featureName: 'Temporal Adverb "Now"',
    description: 'Lexical variation for current temporal reference ("now / at this moment").',
    varietyZPattern: 'ሕዚ (e.g. ኣብዚ ሕዚ ሰዓት)',
    varietyLPattern: 'ኸዚ (e.g. ኣብዚ ኸዚ ሰዓት)',
    varietyDPattern: 'ሐዚ (e.g. ኣብዚ ሐዚ ሰዓት)',
    examples: {
      z: 'ሕዚ እውን / ክሳብ ሕዚ',
      l: 'ኸዚለለ / ክሻዕ ኸዚ',
      d: 'ሐዚለለ / እስካብ ሐዚ',
      meaning: 'even now / up to now'
    }
  },
  {
    featureName: 'Copula / Predicative Marker "Is"',
    description: 'Third person singular copula and predicative identification particle.',
    varietyZPattern: 'እዩ (e.g. ግሁድ እዩ)',
    varietyLPattern: 'እዩ (e.g. ግሁድ እዩ)',
    varietyDPattern: 'ይኡ / ይአ (e.g. ግሁድ ይኡ, ይአ)',
    examples: {
      z: 'ግሁድ እዩ / ዕዱም እዩ',
      l: 'ግሁድ እዩ / ዕዱም እዩ',
      d: 'ግሁድ ይኡ / ዕዱም ይኡ',
      meaning: 'it is evident / is invited'
    }
  }
];

export const RAW_DATASET_ASSETS = [
  {
    id: 'z-variety',
    variety: 'Variety Z',
    name: 'Ethiopian Tigrinya (Standard / Tigray Central)',
    fileName: 'z-variety_f75533ae.txt',
    filePath: '/research/z-variety_f75533ae.txt',
    fileSize: '79.6 KB',
    linesCount: 292,
    wordCount: 6649,
    charCount: 31352,
    description: 'Standard written Tigrinya incorporating normative orthography, dental relative prefixes (ዝ-/ዘ-), dative (ን-), and standard copular syntax.'
  },
  {
    id: 'l-variety',
    variety: 'Variety L',
    name: 'Southern & Eastern Tigray Variety (Enderta / Raya / Wejerat)',
    fileName: 'l-variety_520d584e.txt',
    filePath: '/research/l-variety_520d584e.txt',
    fileSize: '78.7 KB',
    linesCount: 276,
    wordCount: 6368,
    charCount: 30895,
    description: 'Regional Southern Tigray dialect marked by lateral relativizer (ል-/ለ-), lateral dative (ል-), allative (ላብ), and indigenous lexical preservation.'
  },
  {
    id: 'd-variety',
    variety: 'Variety D',
    name: 'Variety D (Colloquial Rayan / Regional Morphological Variant)',
    fileName: 'd-variety_b740ee45.txt',
    filePath: '/research/d-variety_b740ee45.txt',
    fileSize: '78.0 KB',
    linesCount: 270,
    wordCount: 6228,
    charCount: 30574,
    description: 'Distinctive Rayan dialectal corpus demonstrating alveolar stop shift (ድ-/ደ- for both relative and dative), allative (ዳብ), copula (ይኡ), and regional vocabulary.'
  }
];
