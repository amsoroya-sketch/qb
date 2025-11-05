"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuranDataValidationError = exports.QuranTextMismatchError = exports.QuranDataError = exports.CASE_SIGN_SYMBOLS = exports.GRAMMAR_TRANSLATIONS = exports.MVP_SURAHS = void 0;
exports.MVP_SURAHS = [
    {
        number: 1,
        name: 'Al-Fatiha',
        nameArabic: 'الفاتحة',
        englishName: 'The Opening',
        revelationType: 'meccan',
        totalVerses: 7,
    },
    {
        number: 108,
        name: 'Al-Kawthar',
        nameArabic: 'الكوثر',
        englishName: 'Abundance',
        revelationType: 'meccan',
        totalVerses: 3,
    },
    {
        number: 112,
        name: 'Al-Ikhlas',
        nameArabic: 'الإخلاص',
        englishName: 'Sincerity',
        revelationType: 'meccan',
        totalVerses: 4,
    },
    {
        number: 113,
        name: 'Al-Falaq',
        nameArabic: 'الفلق',
        englishName: 'The Daybreak',
        revelationType: 'meccan',
        totalVerses: 5,
    },
    {
        number: 114,
        name: 'An-Nas',
        nameArabic: 'الناس',
        englishName: 'Mankind',
        revelationType: 'meccan',
        totalVerses: 6,
    },
];
exports.GRAMMAR_TRANSLATIONS = {
    noun: 'اسم',
    verb: 'فعل',
    particle: 'حرف',
    masculine: 'مذكر',
    feminine: 'مؤنث',
    singular: 'مفرد',
    dual: 'مثنى',
    plural: 'جمع',
    definite: 'معرفة',
    indefinite: 'نكرة',
    nominative: 'مرفوع',
    accusative: 'منصوب',
    genitive: 'مجرور',
    jussive: 'مجزوم',
    indeclinable: 'مبني',
    damma: 'ضمة',
    fatha: 'فتحة',
    kasra: 'كسرة',
    sukun: 'سكون',
    alif: 'ألف',
    ya: 'ياء',
    waw: 'واو',
    simple: 'مفرد',
    idafa: 'إضافة',
    prep_phrase: 'جار ومجرور',
    adjective_phrase: 'نعت ومنعوت',
};
exports.CASE_SIGN_SYMBOLS = {
    damma: 'ُ',
    fatha: 'َ',
    kasra: 'ِ',
    sukun: 'ْ',
    dammatain: 'ٌ',
    fathatain: 'ً',
    kasratain: 'ٍ',
};
class QuranDataError extends Error {
    constructor(message) {
        super(message);
        this.name = 'QuranDataError';
    }
}
exports.QuranDataError = QuranDataError;
class QuranTextMismatchError extends QuranDataError {
    constructor(surah, ayah, expected, received) {
        super(`Text mismatch for ${surah}:${ayah}. Expected: ${expected}, Received: ${received}`);
        this.name = 'QuranTextMismatchError';
    }
}
exports.QuranTextMismatchError = QuranTextMismatchError;
class QuranDataValidationError extends QuranDataError {
    constructor(message, field, value) {
        super(`Validation failed for ${field}: ${message} (value: ${value})`);
        this.field = field;
        this.value = value;
        this.name = 'QuranDataValidationError';
    }
}
exports.QuranDataValidationError = QuranDataValidationError;
//# sourceMappingURL=quran-corpus.types.js.map