export interface Chapter {
    id: number;
    revelation_place: 'makkah' | 'madinah';
    revelation_order: number;
    bismillah_pre: boolean;
    name_simple: string;
    name_complex: string;
    name_arabic: string;
    verses_count: number;
    pages: [number, number];
    translated_name: {
        language_name: string;
        name: string;
    };
}
export interface Word {
    id: number;
    position: number;
    audio_url: string | null;
    char_type_name: 'word' | 'end';
    text_uthmani: string;
    text_indopak?: string;
    text_imlaei?: string;
    location: string;
    page_number: number;
    line_number: number;
    text: string;
    translation?: {
        text: string;
        language_name: string;
    };
    transliteration?: {
        text: string | null;
        language_name: string;
    };
    code_v1?: string;
    code_v2?: string;
    v1_page?: number;
    v2_page?: number;
}
export interface Verse {
    id: number;
    verse_number: number;
    verse_key: string;
    hizb_number: number;
    rub_el_hizb_number: number;
    ruku_number: number;
    manzil_number: number;
    sajdah_number: number | null;
    page_number: number;
    juz_number: number;
    words: Word[];
}
export interface Pagination {
    per_page: number;
    current_page: number;
    next_page: number | null;
    total_pages: number;
    total_records: number;
}
export interface VersesResponse {
    verses: Verse[];
    pagination: Pagination;
}
export interface ChaptersResponse {
    chapters: Chapter[];
}
export interface FetchVersesOptions {
    chapter: number;
    page?: number;
    perPage?: number;
    language?: string;
    words?: boolean;
    translations?: string;
    wordFields?: string[];
}
export interface SurahMetadata {
    number: number;
    name: string;
    nameArabic: string;
    englishName: string;
    revelationType: 'meccan' | 'medinan';
    totalVerses: number;
    revelationOrder: number;
}
