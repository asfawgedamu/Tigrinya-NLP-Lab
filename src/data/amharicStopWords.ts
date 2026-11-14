/**
 * Amharic stop-word guard for the Tigrinya Dialect Lab.
 *
 * Amharic and Tigrinya are closely related, so a dialect classifier can wrongly
 * assign Amharic text to Variety L or D. These are high-frequency Amharic
 * function words (pronouns, conjunctions, prepositions, adverbs, copulas and
 * auxiliaries) that Tigrinya does not use. If any appears in the input, the lab
 * refuses to classify and asks for Tigrinya text.
 *
 * Source: "100 core Amharic stop words" list.
 *
 * Words from that list that ALSO occur as ordinary Tigrinya words in the 52-text
 * research corpus (all three varieties) are kept out of the active list, because
 * using them would wrongly reject genuine Tigrinya (ግን alone occurs 166 times).
 * They are listed in SHARED_WITH_TIGRINYA for reference.
 */

export const AMHARIC_STOP_WORDS: string[] = [
  "እርሱ",
  "እርሷ",
  "እሷ",
  "እነሱ",
  "እርስዎ",
  "እነዚህ",
  "እነዚያ",
  "ይህ",
  "ማን",
  "ምን",
  "የት",
  "መቼ",
  "እንዴት",
  "ለምን",
  "ስለዚህ",
  "ምክንያቱም",
  "እንዲሁም",
  "ወይም",
  "እንዲሁ",
  "እስከ",
  "በኋላ",
  "ቢሆንም",
  "ካልሆነ",
  "እንዳለ",
  "እንደምን",
  "ሲሆን",
  "ሳለ",
  "በሚል",
  "እንጂ",
  "በአጠቃላይ",
  "እንኳንስ",
  "ውስጥ",
  "ላይ",
  "አጠገብ",
  "ፊት",
  "መካከል",
  "ዙሪያ",
  "በኩል",
  "ያህል",
  "ዘንድ",
  "ያለ",
  "በስተቀር",
  "አካባቢ",
  "ውስጥ አቀፍ",
  "ውጪ",
  "ላይ ላዩን",
  "በፊት",
  "ወዲህ",
  "ወዲያ",
  "በጣም",
  "ትንሽ",
  "ብዙ",
  "ሁሉም",
  "የትም",
  "ሁልጊዜ",
  "መቼም",
  "አንዳንዴ",
  "ለማንኛውም",
  "እንኳ",
  "ብቻ",
  "በእርግጥ",
  "እርግጠኛ",
  "አልፎ አልፎ",
  "ቶሎ",
  "በዝግታ",
  "ለጊዜው",
  "በአግባቡ",
  "በቅንነት",
  "ብቻውን",
  "ሙሉ በሙሉ",
  "ነው",
  "ናት",
  "ናቸው",
  "ነኝ",
  "ነን",
  "ነህ",
  "ነሽ",
  "ናችሁ",
  "ነበር",
  "ይሆናል",
  "ነበርኩ",
  "አለ",
  "የለም",
  "ነበረው",
  "አልቻለም",
  "ይገባል",
  "ይቻላል",
  "አይቻልም",
  "ይመስላል"
];

/** On the original list, but also found in genuine Tigrinya text: NOT used for rejection. */
export const SHARED_WITH_TIGRINYA: string[] = ["ግን", "ነገር ግን", "ምንም", "ያ", "እንደገና", "ነበሩ", "ማንም", "እሱ", "ስር", "እንኳን"];

/** Discontinuous patterns on the original list (ከ...በፊት, ከ...ጋር): covered by their component words where unambiguous; not matched on their own. */
export const AMHARIC_DISCONTINUOUS_PATTERNS: string[] = ["ከ...በፊት", "ከ...ጋር"];

const SPLIT_RE = /[\s\u1361-\u1368.,;:!?"'“”‘’()\[\]{}«»\-–—/\\0-9]+/;

const SINGLE_WORDS = new Set(AMHARIC_STOP_WORDS.filter(w => !w.includes(' ')));
const PHRASES = AMHARIC_STOP_WORDS.filter(w => w.includes(' '));

/** Returns the distinct Amharic stop words (and phrases) found in the text as whole words. Empty array = none. */
export function detectAmharicStopWords(text: string): string[] {
  const tokens = text.split(SPLIT_RE).filter(Boolean);
  const found: string[] = [];
  const add = (w: string) => { if (!found.includes(w)) found.push(w); };

  tokens.forEach(t => { if (SINGLE_WORDS.has(t)) add(t); });

  if (PHRASES.length > 0) {
    const joined = ' ' + tokens.join(' ') + ' ';
    PHRASES.forEach(p => { if (joined.includes(' ' + p + ' ')) add(p); });
  }
  return found;
}
