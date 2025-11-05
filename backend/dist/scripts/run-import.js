"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs = require("fs");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Loading data...');
    const data = JSON.parse(fs.readFileSync('data/processed/quran-complete-merged.json', 'utf-8'));
    console.log('Clearing database...');
    await prisma.verseWord.deleteMany({});
    await prisma.quranVerse.deleteMany({});
    console.log('Importing', data.length, 'verses...');
    for (let i = 0; i < data.length; i++) {
        const verse = data[i];
        const verseText = verse.words.map((w) => w.arabicUthmani).join(' ');
        const createdVerse = await prisma.quranVerse.create({
            data: {
                surahNumber: verse.surah,
                verseNumber: verse.verseNumber,
                textArabic: verseText,
                textWithoutDiacritics: verseText.replace(/[\u064B-\u0652\u0670]/g, ''),
                translation: verse.words.map((w) => w.translation).join(' '),
                transliteration: verse.words
                    .map((w) => w.transliteration)
                    .filter(Boolean)
                    .join(' '),
            },
        });
        await prisma.verseWord.createMany({
            data: verse.words.map((w) => ({
                verseId: createdVerse.id,
                position: w.wordPosition,
                arabicText: w.arabicUthmani,
                textWithoutDiacritics: w.arabicUthmani.replace(/[\u064B-\u0652\u0670]/g, ''),
                translation: w.translation || '',
                transliteration: w.transliteration || '',
                posType: w.pos || 'UNKNOWN',
                root: w.root,
                lemma: w.lemma,
                grammarData: {},
            })),
        });
        if ((i + 1) % 100 === 0)
            console.log('Progress:', i + 1, '/', data.length);
    }
    console.log('Verifying...');
    const vCount = await prisma.quranVerse.count();
    const wCount = await prisma.verseWord.count();
    console.log('Complete:', vCount, 'verses,', wCount, 'words');
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=run-import.js.map