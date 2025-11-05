/**
 * Type Definitions for quran.com API v4
 *
 * Source: https://api-docs.quran.com
 * All types match official API responses
 */

/**
 * Chapter (Surah) metadata from /chapters endpoint
 */
export interface Chapter {
  id: number;
  revelation_place: 'makkah' | 'madinah';
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: [number, number]; // [start_page, end_page]
  translated_name: {
    language_name: string;
    name: string;
  };
}

/**
 * Word object from verses endpoint (word-by-word data)
 */
export interface Word {
  id: number;
  position: number;
  audio_url: string | null;
  char_type_name: 'word' | 'end'; // 'word' or 'end' (verse marker)
  text_uthmani: string; // Uthmani script with diacritics
  text_indopak?: string; // Indo-Pak script
  text_imlaei?: string; // Imlaei (simple) script
  location: string; // Format: "surah:verse:word" (e.g., "1:1:1")
  page_number: number;
  line_number: number;
  text: string; // Same as text_uthmani
  translation?: {
    text: string;
    language_name: string;
  };
  transliteration?: {
    text: string | null;
    language_name: string;
  };
  code_v1?: string; // Font rendering code (not morphology)
  code_v2?: string; // Font rendering code (not morphology)
  v1_page?: number;
  v2_page?: number;
}

/**
 * Verse object from /verses/by_chapter endpoint
 */
export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string; // Format: "surah:verse" (e.g., "1:1")
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number: number | null;
  page_number: number;
  juz_number: number;
  words: Word[];
}

/**
 * Pagination metadata
 */
export interface Pagination {
  per_page: number;
  current_page: number;
  next_page: number | null;
  total_pages: number;
  total_records: number;
}

/**
 * API Response for /verses/by_chapter endpoint
 */
export interface VersesResponse {
  verses: Verse[];
  pagination: Pagination;
}

/**
 * API Response for /chapters endpoint
 */
export interface ChaptersResponse {
  chapters: Chapter[];
}

/**
 * Fetch options for verses endpoint
 */
export interface FetchVersesOptions {
  chapter: number; // 1-114
  page?: number; // Default: 1
  perPage?: number; // Default: 10, Max: 50
  language?: string; // Default: 'en'
  words?: boolean; // Default: true
  translations?: string; // Comma-separated translation IDs
  wordFields?: string[]; // Word fields to include
}

/**
 * Simplified surah metadata (for our database)
 */
export interface SurahMetadata {
  number: number;
  name: string;
  nameArabic: string;
  englishName: string;
  revelationType: 'meccan' | 'medinan';
  totalVerses: number;
  revelationOrder: number;
}
