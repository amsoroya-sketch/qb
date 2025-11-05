/**
 * Type Definitions for Quranic Corpus Morphology v0.4
 *
 * Source: http://corpus.quran.com
 * License: GNU GPL
 * Authority: University of Leeds
 */

/**
 * Raw morpheme segment from corpus file
 * Format: (surah:verse:word:segment)	form	tag	features
 */
export interface CorpusMorphemeSegment {
  location: string; // e.g., "(1:1:1:1)"
  surah: number;
  verse: number;
  word: number;
  segment: number;
  form: string; // Text form (e.g., "bi", "somi")
  tag: string; // Type tag (P, N, V, etc.)
  features: string; // Raw features string
}

/**
 * Parsed morphological features for a word
 */
export interface MorphologicalFeatures {
  // Part of Speech
  pos?: string; // N, V, P, ADJ, PRON, etc.
  posFullName?: string; // Noun, Verb, Particle, etc.

  // Root & Lemma
  root?: string; // Arabic root (3-4 letters)
  lemma?: string; // Dictionary form

  // Grammatical Properties
  gender?: 'M' | 'F'; // Masculine, Feminine
  number?: 'S' | 'D' | 'P'; // Singular, Dual, Plural
  case?: 'NOM' | 'ACC' | 'GEN'; // Nominative, Accusative, Genitive

  // Verb-specific
  aspect?: 'PERF' | 'IMPF' | 'IMPV'; // Perfect, Imperfect, Imperative
  voice?: 'ACT' | 'PASS'; // Active, Passive
  mood?: string; // Indicative, Subjunctive, Jussive
  person?: '1' | '2' | '3'; // First, Second, Third person

  // Additional features
  definiteness?: 'DEF' | 'INDEF'; // Definite, Indefinite
  state?: string; // Construct state, etc.

  // Raw data preservation
  rawFeatures: string; // Original feature string
  segments: CorpusMorphemeSegment[]; // All segments for this word
}

/**
 * Complete word with morphology
 */
export interface CorpusWord {
  // Location
  location: string; // Format: "1:1:1" (surah:verse:word)
  surah: number;
  verse: number;
  wordPosition: number;

  // Text (reconstructed from segments)
  arabicText: string; // Combined form from all segments

  // Morphology
  morphology: MorphologicalFeatures;
}

/**
 * Parsed corpus data indexed by location
 */
export interface CorpusData {
  words: Map<string, CorpusWord>; // Key: "surah:verse:word"
  metadata: {
    version: string;
    totalWords: number;
    source: string;
    license: string;
  };
}

/**
 * POS tag mappings
 */
export const POS_TAGS: Record<string, string> = {
  N: 'Noun',
  PN: 'Proper Noun',
  PRON: 'Pronoun',
  DEM: 'Demonstrative',
  REL: 'Relative Pronoun',
  ADJ: 'Adjective',
  V: 'Verb',
  P: 'Preposition',
  CONJ: 'Conjunction',
  T: 'Particle',
  LOC: 'Location Adverb',
  DET: 'Determiner',
  NEG: 'Negative Particle',
  IMPN: 'Imperative Particle',
  ACC: 'Accusative Particle',
  AMD: 'Amendment Particle',
  ANS: 'Answer Particle',
  AVR: 'Aversion Particle',
  CAUS: 'Cause Particle',
  CERT: 'Certainty Particle',
  CIRC: 'Circumstantial Particle',
  COM: 'Comitative Particle',
  COND: 'Conditional Particle',
  EQ: 'Equalization Particle',
  EXH: 'Exhortation Particle',
  EXL: 'Explanation Particle',
  EXP: 'Exceptive Particle',
  FUT: 'Future Particle',
  INC: 'Inceptive Particle',
  INT: 'Interrogative Particle',
  INTG: 'Interogative Particle',
  PRO: 'Prohibition Particle',
  REM: 'Remoteness Particle',
  RES: 'Restriction Particle',
  RET: 'Retraction Particle',
  SUP: 'Supplemental Particle',
  SUR: 'Surprise Particle',
  VOC: 'Vocative Particle',
};

/**
 * Feature parsing result
 */
export interface ParsedFeatures {
  [key: string]: string | boolean;
}
