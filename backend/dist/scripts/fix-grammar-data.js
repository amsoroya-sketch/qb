"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixGrammarData = fixGrammarData;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
function parseMorphologyFeatures(raw) {
    const result = {};
    if (!raw)
        return result;
    if (raw.includes('|M|') || raw.endsWith('|M\r')) {
        result.gender = GENDER_MAP.M.en;
        result.genderArabic = GENDER_MAP.M.ar;
    }
    else if (raw.includes('|F|') || raw.endsWith('|F\r')) {
        result.gender = GENDER_MAP.F.en;
        result.genderArabic = GENDER_MAP.F.ar;
    }
    else if (raw.includes('|MS|')) {
        result.gender = GENDER_MAP.M.en;
        result.genderArabic = GENDER_MAP.M.ar;
        result.number = NUMBER_MAP.S.en;
        result.numberArabic = NUMBER_MAP.S.ar;
    }
    else if (raw.includes('|FS|')) {
        result.gender = GENDER_MAP.F.en;
        result.genderArabic = GENDER_MAP.F.ar;
        result.number = NUMBER_MAP.S.en;
        result.numberArabic = NUMBER_MAP.S.ar;
    }
    else if (raw.includes('|MD|')) {
        result.gender = GENDER_MAP.M.en;
        result.genderArabic = GENDER_MAP.M.ar;
        result.number = NUMBER_MAP.D.en;
        result.numberArabic = NUMBER_MAP.D.ar;
    }
    else if (raw.includes('|FD|')) {
        result.gender = GENDER_MAP.F.en;
        result.genderArabic = GENDER_MAP.F.ar;
        result.number = NUMBER_MAP.D.en;
        result.numberArabic = NUMBER_MAP.D.ar;
    }
    else if (raw.includes('|MP|')) {
        result.gender = GENDER_MAP.M.en;
        result.genderArabic = GENDER_MAP.M.ar;
        result.number = NUMBER_MAP.P.en;
        result.numberArabic = NUMBER_MAP.P.ar;
    }
    else if (raw.includes('|FP|')) {
        result.gender = GENDER_MAP.F.en;
        result.genderArabic = GENDER_MAP.F.ar;
        result.number = NUMBER_MAP.P.en;
        result.numberArabic = NUMBER_MAP.P.ar;
    }
    if (raw.includes('|NOM')) {
        result.irabCase = CASE_MAP.NOM.en;
        result.irabCaseArabic = CASE_MAP.NOM.ar;
    }
    else if (raw.includes('|ACC')) {
        result.irabCase = CASE_MAP.ACC.en;
        result.irabCaseArabic = CASE_MAP.ACC.ar;
    }
    else if (raw.includes('|GEN')) {
        result.irabCase = CASE_MAP.GEN.en;
        result.irabCaseArabic = CASE_MAP.GEN.ar;
    }
    return result;
}
async function fixGrammarData() {
    console.log('🔧 Starting grammar data fix...\n');
    const words = await prisma.verseWord.findMany({
        select: {
            id: true,
            arabicText: true,
            grammarData: true,
        },
    });
    console.log(`📊 Found ${words.length.toLocaleString()} words to process\n`);
    let updated = 0;
    let skipped = 0;
    for (const word of words) {
        const grammarData = word.grammarData;
        const rawFeatures = grammarData?.rawFeatures;
        if (!rawFeatures) {
            skipped++;
            continue;
        }
        const parsed = parseMorphologyFeatures(rawFeatures);
        await prisma.verseWord.update({
            where: { id: word.id },
            data: parsed,
        });
        updated++;
        if (updated % 1000 === 0) {
            console.log(`⏳ Progress: ${updated.toLocaleString()}/${words.length.toLocaleString()} (${((updated / words.length) * 100).toFixed(1)}%)`);
        }
    }
    console.log(`\n✅ Update complete!`);
    console.log(`   Updated: ${updated.toLocaleString()} words`);
    console.log(`   Skipped: ${skipped.toLocaleString()} words (no raw features)\n`);
    const wordsWithGender = await prisma.verseWord.count({
        where: { gender: { not: null } },
    });
    const wordsWithCase = await prisma.verseWord.count({
        where: { irabCase: { not: null } },
    });
    console.log('📈 Grammar Coverage:');
    console.log(`   Words with gender: ${wordsWithGender.toLocaleString()} (${((wordsWithGender / words.length) * 100).toFixed(1)}%)`);
    console.log(`   Words with case: ${wordsWithCase.toLocaleString()} (${((wordsWithCase / words.length) * 100).toFixed(1)}%)`);
    await prisma.$disconnect();
}
if (require.main === module) {
    fixGrammarData()
        .then(() => {
        console.log('\n✓ Grammar data fix completed successfully!');
        process.exit(0);
    })
        .catch((error) => {
        console.error('\n✗ Error:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=fix-grammar-data.js.map