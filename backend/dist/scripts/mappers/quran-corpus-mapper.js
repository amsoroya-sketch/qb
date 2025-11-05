"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quranCorpusMapper = exports.QuranCorpusMapper = void 0;
const quran_corpus_types_1 = require("../types/quran-corpus.types");
class QuranCorpusMapper {
    mapVerse(corpusVerse) {
        this.validateVerse(corpusVerse);
        const normalizedText = this.normalizeArabicText(corpusVerse.text);
        const normalizedTextWithoutDiacritics = this.normalizeArabicText(corpusVerse.textWithoutDiacritics);
        return {
            surahNumber: corpusVerse.surah,
            verseNumber: corpusVerse.ayah,
            textArabic: normalizedText,
            textWithoutDiacritics: normalizedTextWithoutDiacritics,
            translation: corpusVerse.translation || '',
            transliteration: corpusVerse.transliteration,
            searchVectorAr: this.createSearchVector(normalizedTextWithoutDiacritics),
            searchVectorEn: this.createSearchVector(corpusVerse.translation || ''),
        };
    }
    mapVerseWords(corpusVerse) {
        return corpusVerse.words.map((word) => this.mapWord(word));
    }
    mapWord(corpusWord) {
        const features = corpusWord.morphology?.features || {};
        const arabicText = this.normalizeArabicText(corpusWord.segment);
        const textWithoutDiacritics = this.normalizeArabicText(corpusWord.segmentWithoutDiacritics);
        const posType = this.mapPOSType(corpusWord.morphology?.partOfSpeech, features.pos);
        const gender = this.mapGender(features.gender);
        const number = this.mapNumber(features.number);
        const definiteness = this.mapDefiniteness(features.definiteness, features.definitenessType);
        const irabCase = this.mapIrabCase(features.case, features.caseState, posType);
        const caseSign = this.mapCaseSign(features.caseSign, features.hasTanween);
        const structureType = this.mapStructureType(features.structureType, features.structureRole);
        return {
            position: corpusWord.position,
            arabicText,
            textWithoutDiacritics,
            translation: corpusWord.translation || `[Word ${corpusWord.position}]`,
            transliteration: corpusWord.transliteration,
            posType: posType.english,
            posArabic: posType.arabic,
            gender: gender?.english,
            genderArabic: gender?.arabic,
            number: number?.english,
            numberArabic: number?.arabic,
            definiteness: definiteness?.english,
            definitenessArabic: definiteness?.arabic,
            irabCase: irabCase?.english,
            irabCaseArabic: irabCase?.arabic,
            caseSign: caseSign?.english,
            caseSignArabic: caseSign?.arabic,
            caseSignSymbol: caseSign?.symbol,
            structureType: structureType?.english,
            structureTypeArabic: structureType?.arabic,
            root: corpusWord.morphology?.root,
            lemma: corpusWord.morphology?.lemma,
            grammarData: {
                originalFeatures: features,
                syntax: corpusWord.syntax,
                pos: corpusWord.morphology?.partOfSpeech,
            },
        };
    }
    validateVerse(verse) {
        if (!verse.surah || verse.surah < 1 || verse.surah > 114) {
            throw new quran_corpus_types_1.QuranDataValidationError('Invalid surah number', 'surah', verse.surah);
        }
        if (!verse.ayah || verse.ayah < 1) {
            throw new quran_corpus_types_1.QuranDataValidationError('Invalid ayah number', 'ayah', verse.ayah);
        }
        if (!verse.text || verse.text.trim().length === 0) {
            throw new quran_corpus_types_1.QuranDataValidationError('Empty verse text', 'text', verse.text);
        }
        if (!verse.words || verse.words.length === 0) {
            throw new quran_corpus_types_1.QuranDataValidationError('No words in verse', 'words', verse.words);
        }
    }
    normalizeArabicText(text) {
        if (!text)
            return '';
        return text.normalize('NFC').trim();
    }
    createSearchVector(text) {
        return text.toLowerCase().trim();
    }
    mapPOSType(partOfSpeech, posFeature) {
        const pos = (partOfSpeech || posFeature || 'noun').toLowerCase();
        if (pos.includes('noun') || pos.includes('اسم') || pos === 'n') {
            return { english: 'noun', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.noun };
        }
        if (pos.includes('verb') || pos.includes('فعل') || pos === 'v') {
            return { english: 'verb', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.verb };
        }
        if (pos.includes('particle') || pos.includes('حرف') || pos === 'p') {
            return { english: 'particle', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.particle };
        }
        return { english: 'noun', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.noun };
    }
    mapGender(gender) {
        if (!gender)
            return null;
        const g = gender.toLowerCase();
        if (g.includes('masc') || g === 'm' || g.includes('مذكر')) {
            return { english: 'masculine', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.masculine };
        }
        if (g.includes('fem') || g === 'f' || g.includes('مؤنث')) {
            return { english: 'feminine', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.feminine };
        }
        return null;
    }
    mapNumber(number) {
        if (!number)
            return null;
        const n = number.toLowerCase();
        if (n.includes('sing') || n === 's' || n.includes('مفرد')) {
            return { english: 'singular', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.singular };
        }
        if (n.includes('dual') || n === 'd' || n.includes('مثنى')) {
            return { english: 'dual', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.dual };
        }
        if (n.includes('plur') || n === 'p' || n.includes('جمع')) {
            return { english: 'plural', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.plural };
        }
        return null;
    }
    mapDefiniteness(definiteness, definitenessType) {
        if (!definiteness)
            return null;
        const d = definiteness.toLowerCase();
        if (d.includes('def') || d.includes('معرفة')) {
            let english = 'definite';
            if (definitenessType) {
                english += ` (${definitenessType})`;
            }
            return { english, arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.definite };
        }
        if (d.includes('indef') || d.includes('نكرة')) {
            return { english: 'indefinite', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.indefinite };
        }
        return null;
    }
    mapIrabCase(caseValue, caseState, posType) {
        if (caseState === 'indeclinable' || caseState?.includes('مبني')) {
            return { english: 'indeclinable', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.indeclinable };
        }
        if (posType?.english === 'particle') {
            return { english: 'indeclinable', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.indeclinable };
        }
        if (!caseValue)
            return null;
        const c = caseValue.toLowerCase();
        if (c.includes('nom') || c.includes('مرفوع')) {
            return { english: 'nominative', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.nominative };
        }
        if (c.includes('acc') || c.includes('منصوب')) {
            return { english: 'accusative', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.accusative };
        }
        if (c.includes('gen') || c.includes('مجرور')) {
            return { english: 'genitive', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.genitive };
        }
        if (c.includes('jus') || c.includes('مجزوم')) {
            return { english: 'jussive', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.jussive };
        }
        return null;
    }
    mapCaseSign(caseSign, hasTanween) {
        if (!caseSign)
            return null;
        const c = caseSign.toLowerCase();
        if (c.includes('damma') || c.includes('ضمة') || c === 'u') {
            const arabicName = hasTanween ? 'تنوين ضم' : quran_corpus_types_1.GRAMMAR_TRANSLATIONS.damma;
            const symbol = hasTanween ? quran_corpus_types_1.CASE_SIGN_SYMBOLS.dammatain : quran_corpus_types_1.CASE_SIGN_SYMBOLS.damma;
            return { english: 'damma', arabic: arabicName, symbol };
        }
        if (c.includes('fatha') || c.includes('فتحة') || c === 'a') {
            const arabicName = hasTanween ? 'تنوين فتح' : quran_corpus_types_1.GRAMMAR_TRANSLATIONS.fatha;
            const symbol = hasTanween ? quran_corpus_types_1.CASE_SIGN_SYMBOLS.fathatain : quran_corpus_types_1.CASE_SIGN_SYMBOLS.fatha;
            return { english: 'fatha', arabic: arabicName, symbol };
        }
        if (c.includes('kasra') || c.includes('كسرة') || c === 'i') {
            const arabicName = hasTanween ? 'تنوين كسر' : quran_corpus_types_1.GRAMMAR_TRANSLATIONS.kasra;
            const symbol = hasTanween ? quran_corpus_types_1.CASE_SIGN_SYMBOLS.kasratain : quran_corpus_types_1.CASE_SIGN_SYMBOLS.kasra;
            return { english: 'kasra', arabic: arabicName, symbol };
        }
        if (c.includes('sukun') || c.includes('سكون')) {
            return {
                english: 'sukun',
                arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.sukun,
                symbol: quran_corpus_types_1.CASE_SIGN_SYMBOLS.sukun,
            };
        }
        if (c.includes('alif') || c.includes('ألف')) {
            return { english: 'alif', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.alif, symbol: 'ا' };
        }
        if (c.includes('ya') || c.includes('ياء')) {
            return { english: 'ya', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.ya, symbol: 'ي' };
        }
        if (c.includes('waw') || c.includes('واو')) {
            return { english: 'waw', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.waw, symbol: 'و' };
        }
        return null;
    }
    mapStructureType(structureType, structureRole) {
        if (!structureType)
            return null;
        const s = structureType.toLowerCase();
        if (s.includes('simple') || s.includes('مفرد')) {
            return { english: 'simple', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.simple };
        }
        if (s.includes('idafa') || s.includes('إضافة')) {
            let english = 'idafa';
            if (structureRole?.includes('mudaf_ilayh') || structureRole?.includes('مضاف إليه')) {
                english = 'mudaf_ilayh';
            }
            else if (structureRole?.includes('mudaf') || structureRole?.includes('مضاف')) {
                english = 'mudaf';
            }
            return { english, arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.idafa };
        }
        if (s.includes('prep') || s.includes('جار')) {
            return { english: 'prep_phrase', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.prep_phrase };
        }
        if (s.includes('adj') || s.includes('نعت')) {
            return { english: 'adjective_phrase', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.adjective_phrase };
        }
        return { english: 'simple', arabic: quran_corpus_types_1.GRAMMAR_TRANSLATIONS.simple };
    }
    mapVerses(corpusVerses) {
        const verses = [];
        const words = new Map();
        for (const corpusVerse of corpusVerses) {
            const verse = this.mapVerse(corpusVerse);
            const verseWords = this.mapVerseWords(corpusVerse);
            verses.push(verse);
            words.set(`${verse.surahNumber}:${verse.verseNumber}`, verseWords);
        }
        return { verses, words };
    }
}
exports.QuranCorpusMapper = QuranCorpusMapper;
exports.quranCorpusMapper = new QuranCorpusMapper();
//# sourceMappingURL=quran-corpus-mapper.js.map