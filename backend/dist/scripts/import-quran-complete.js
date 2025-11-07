"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importQuranData = importQuranData;
const client_1 = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new client_1.PrismaClient();
const CONFIG = {
    MERGED_DATA_FILE: path.join(__dirname, '../../data/processed/quran-complete-merged.json'),
};
class Logger {
    constructor() {
        this.startTime = Date.now();
    }
    info(message) {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
        console.log(`[${elapsed}s] ℹ ${message}`);
    }
    success(message) {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
        console.log(`[${elapsed}s] ✓ ${message}`);
    }
    error(message, error) {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
        console.error(`[${elapsed}s] ✗ ${message}`);
        if (error) {
            console.error(`  Error: ${error.message}`);
        }
    }
    progress(current, total, item) {
        if (current % 100 === 0 || current === total) {
            const percentage = ((current / total) * 100).toFixed(1);
            const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
            console.log(`[${elapsed}s] ⏳ Progress: ${current}/${total} (${percentage}%) - ${item}`);
        }
    }
}
const logger = new Logger();
function removeDiacritics(text) {
    return text.replace(/[\u064B-\u0652\u0670]/g, '');
}
const POS_MAP = {
    N: { en: 'Noun', ar: 'اسم' },
    V: { en: 'Verb', ar: 'فعل' },
    P: { en: 'Preposition', ar: 'حرف جر' },
    PN: { en: 'Proper Noun', ar: 'اسم علم' },
    PRON: { en: 'Pronoun', ar: 'ضمير' },
    REL: { en: 'Relative Pronoun', ar: 'اسم موصول' },
    ADJ: { en: 'Adjective', ar: 'صفة' },
};
const GENDER_MAP = {
    M: { en: 'Masculine', ar: 'مذكر' },
    F: { en: 'Feminine', ar: 'مؤنث' },
};
const NUMBER_MAP = {
    S: { en: 'Singular', ar: 'مفرد' },
    D: { en: 'Dual', ar: 'مثنى' },
    P: { en: 'Plural', ar: 'جمع' },
};
const CASE_MAP = {
    NOM: { en: 'Nominative', ar: 'مرفوع' },
    ACC: { en: 'Accusative', ar: 'منصوب' },
    GEN: { en: 'Genitive', ar: 'مجرور' },
};
async function importQuranData() {
    try {
        logger.info('Starting Quran data import...\n');
        logger.info(`Loading data from: ${CONFIG.MERGED_DATA_FILE}`);
        const content = fs.readFileSync(CONFIG.MERGED_DATA_FILE, 'utf-8');
        const verses = JSON.parse(content);
        logger.success(`Loaded ${verses.length.toLocaleString()} verses`);
        logger.info('\n⚠️  Clearing existing Quran data...');
        await prisma.verseWord.deleteMany({});
        await prisma.quranVerse.deleteMany({});
        logger.success('Cleared existing data');
        logger.info('\nImporting verses and words...');
        let totalVerses = 0;
        for (const verse of verses) {
            const verseText = verse.words.map((w) => w.arabicUthmani).join(' ');
            const createdVerse = await prisma.quranVerse.create({
                data: {
                    surahNumber: verse.surah,
                    verseNumber: verse.verseNumber,
                    textArabic: verseText,
                    textWithoutDiacritics: removeDiacritics(verseText),
                    translation: verse.words.map((w) => w.translation).join(' '),
                    transliteration: verse.words
                        .map((w) => w.transliteration)
                        .filter(Boolean)
                        .join(' '),
                },
            });
            const wordData = verse.words.map((word) => ({
                verseId: createdVerse.id,
                position: word.wordPosition,
                arabicText: word.arabicUthmani,
                textWithoutDiacritics: removeDiacritics(word.arabicUthmani),
                translation: word.translation || '',
                transliteration: word.transliteration || '',
                posType: word.pos || 'UNKNOWN',
                posArabic: word.pos && POS_MAP[word.pos]
                    ? POS_MAP[word.pos].ar
                    : null,
                gender: word.gender && GENDER_MAP[word.gender]
                    ? GENDER_MAP[word.gender].en
                    : null,
                genderArabic: word.gender && GENDER_MAP[word.gender]
                    ? GENDER_MAP[word.gender].ar
                    : null,
                number: word.number && NUMBER_MAP[word.number]
                    ? NUMBER_MAP[word.number].en
                    : null,
                numberArabic: word.number && NUMBER_MAP[word.number]
                    ? NUMBER_MAP[word.number].ar
                    : null,
                irabCase: word.case && CASE_MAP[word.case]
                    ? CASE_MAP[word.case].en
                    : null,
                irabCaseArabic: word.case && CASE_MAP[word.case]
                    ? CASE_MAP[word.case].ar
                    : null,
                root: word.root || null,
                lemma: word.lemma || null,
                grammarData: {
                    aspect: word.aspect,
                    voice: word.voice,
                    person: word.person,
                    rawFeatures: word.rawMorphologyFeatures,
                    sources: word.sources,
                },
            }));
            await prisma.verseWord.createMany({ data: wordData });
            totalVerses++;
            logger.progress(totalVerses, verses.length, `Verse ${verse.verseKey}`);
        }
        logger.info('\n=== IMPORT COMPLETE ===');
        const dbVerses = await prisma.quranVerse.count();
        const dbWords = await prisma.verseWord.count();
        logger.success(`Database verses: ${dbVerses.toLocaleString()}`);
        logger.success(`Database words: ${dbWords.toLocaleString()}`);
        if (dbVerses === 6236 && dbWords === 77429) {
            logger.success('\n✅ Data integrity check PASSED!');
        }
        else {
            logger.error('\n❌ Data integrity check FAILED!');
            logger.error(`Expected: 6,236 verses, 77,429 words`);
            logger.error(`Got: ${dbVerses} verses, ${dbWords} words`);
        }
        logger.success('\n✓ Import completed successfully!');
    }
    catch (error) {
        logger.error('Import failed', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
if (require.main === module) {
    importQuranData()
        .then(() => process.exit(0))
        .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
//# sourceMappingURL=import-quran-complete.js.map