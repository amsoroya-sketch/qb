# Backend API Requirements for Sentence-Level Grammar Features

**Project**: arQ - Quranic Arabic Learning Platform
**Date**: 2025-11-05
**Status**: Requirements Defined - Ready for Backend Implementation
**Frontend Features**: 8/13 Complete (Features 1-8 ✅, Features 9-13 ⏳)

---

## Overview

The frontend has successfully implemented **8 grammatical features** using existing API data. We now need backend API enhancements to support **5 additional sentence-level features** (Features 9-13).

### Completed Features (No Backend Changes Needed)
✅ **Feature 1**: Aspect (IMPF/PERF/IMPV)
✅ **Feature 2**: Person (1st/2nd/3rd)
✅ **Feature 3**: Morpheme Breakdown (PREFIX|STEM|SUFFIX)
✅ **Feature 4**: Definiteness Type (Article/Proper Noun/Pronoun)
✅ **Feature 5**: Gender & Number (3MP, 2FS, etc.)
✅ **Feature 6**: Case State (Mu'rab vs Mabni)
✅ **Feature 7**: Voice (Active/Passive)
✅ **Feature 8**: Mood (Indicative/Subjunctive/Jussive)

### Required Backend Enhancements
⏳ **Feature 9**: Syntactic Role (فاعل, مفعول به, خبر, etc.)
⏳ **Feature 10**: Dependency Tree Relationships
⏳ **Feature 11**: Sentence Type Detection (Nominal vs Verbal)
⏳ **Feature 12**: Phrase Groupings (Idafa, Prepositional)
⏳ **Feature 13**: Agreement Patterns Highlighting

---

## Feature 9: Syntactic Role

### Description
Display the grammatical function of each word in the sentence (e.g., Subject, Object, Predicate).

### Data Source
Quranic Arabic Corpus provides syntactic role information in the morphology data.

### Backend Implementation Required

#### 1. Update VerseWord Schema
Add `syntacticRole` field to store the grammatical function.

**File**: `/home/dev/Development/arQ/backend/prisma/schema.prisma`

```prisma
model VerseWord {
  // ... existing fields ...

  // NEW: Syntactic role in sentence
  syntacticRole      String?  // "subject", "object", "predicate", etc.
  syntacticRoleAr    String?  // "فاعل", "مفعول به", "خبر", etc.

  // ... rest of fields ...
}
```

#### 2. Extract Syntactic Role from Corpus
Update the corpus mapper to extract syntactic role data.

**File**: `/home/dev/Development/arQ/backend/src/scripts/mappers/quran-corpus-mapper.ts`

```typescript
// Add to mapWord() function:

// Extract syntactic role if available
let syntacticRole: string | null = null;
let syntacticRoleAr: string | null = null;

if (corpusWord.syntax?.role) {
  const roleMapping = this.mapSyntacticRole(corpusWord.syntax.role);
  syntacticRole = roleMapping.en;
  syntacticRoleAr = roleMapping.ar;
}

return {
  // ... existing fields ...
  syntacticRole,
  syntacticRoleAr,
  // ...
};
```

#### 3. Add Syntactic Role Mapper

```typescript
private mapSyntacticRole(role: string): { en: string; ar: string } {
  const roleMap: Record<string, { en: string; ar: string }> = {
    'subject': { en: 'Subject (Agent)', ar: 'فاعل' },
    'object': { en: 'Direct Object', ar: 'مفعول به' },
    'predicate': { en: 'Predicate', ar: 'خبر' },
    'subject_nominal': { en: 'Subject of Nominal Sentence', ar: 'مبتدأ' },
    'circumstantial': { en: 'Circumstantial (Adverb)', ar: 'حال' },
    'possessive': { en: 'Possessive (Mudaf Ilayh)', ar: 'مضاف إليه' },
    'prepositional_phrase': { en: 'Prepositional Phrase', ar: 'شبه جملة' },
  };

  return roleMap[role] || { en: role, ar: role };
}
```

### API Response Example

```json
{
  "id": "word-123",
  "arabicText": "اللَّهُ",
  "translation": "Allah",
  "posType": "PN",
  "syntacticRole": "subject",
  "syntacticRoleAr": "فاعل",
  "grammarData": {
    "syntax": {
      "role": "subject",
      "parent": 1
    }
  }
}
```

### Frontend Integration
The frontend already has the UI component ready. Once the API returns `syntacticRole` and `syntacticRoleAr`, it will automatically display.

**No frontend changes needed** - just populate the fields.

---

## Feature 10: Dependency Tree Relationships

### Description
Show which words govern which other words in the sentence (parent-child relationships).

### Data Source
Quranic Arabic Corpus provides dependency relationships via `syntax.parent` field.

### Backend Implementation Required

#### 1. Update VerseWord Schema
Add `parentWordId` field to track dependency relationships.

**File**: `/home/dev/Development/arQ/backend/prisma/schema.prisma`

```prisma
model VerseWord {
  // ... existing fields ...

  // NEW: Dependency relationships
  parentWordId       String?  // ID of parent word in dependency tree
  parentWord         VerseWord? @relation("Dependencies", fields: [parentWordId], references: [id])
  childWords         VerseWord[] @relation("Dependencies")
  dependencyRelation String?  // Type of relationship: "verb_subject", "noun_adjective", etc.

  // ... rest of fields ...
}
```

#### 2. Extract Dependency Data from Corpus

**File**: `/home/dev/Development/arQ/backend/src/scripts/mappers/quran-corpus-mapper.ts`

```typescript
// After creating all words, establish dependency relationships

async mapVerseWithDependencies(corpusVerse: CorpusVerseData): Promise<{
  verse: VerseInput;
  words: VerseWordInput[];
  dependencies: Array<{ childPosition: number; parentPosition: number; relation: string }>;
}> {
  const verse = this.mapVerse(corpusVerse);
  const words = this.mapVerseWords(corpusVerse);

  // Extract dependency relationships
  const dependencies = corpusVerse.words
    .filter(w => w.syntax?.parent !== undefined)
    .map(w => ({
      childPosition: w.position,
      parentPosition: w.syntax!.parent!,
      relation: this.inferDependencyRelation(w, corpusVerse.words[w.syntax!.parent!])
    }));

  return { verse, words, dependencies };
}

private inferDependencyRelation(child: CorpusWordData, parent: CorpusWordData): string {
  // Infer relationship type based on POS and syntactic roles
  if (parent.morphology?.partOfSpeech === 'V' && child.syntax?.role === 'subject') {
    return 'verb_subject';
  }
  if (parent.morphology?.partOfSpeech === 'V' && child.syntax?.role === 'object') {
    return 'verb_object';
  }
  if (parent.morphology?.partOfSpeech === 'N' && child.morphology?.partOfSpeech === 'ADJ') {
    return 'noun_adjective';
  }
  // ... more relationship types
  return 'unknown';
}
```

#### 3. Update Import Script
After creating words, establish relationships using Prisma's relation updates.

**File**: `/home/dev/Development/arQ/backend/src/scripts/import-quran-complete.ts`

```typescript
// After creating verse and words:
for (const dep of dependencies) {
  const childWord = createdWords[dep.childPosition - 1];
  const parentWord = createdWords[dep.parentPosition - 1];

  if (childWord && parentWord) {
    await prisma.verseWord.update({
      where: { id: childWord.id },
      data: {
        parentWordId: parentWord.id,
        dependencyRelation: dep.relation
      }
    });
  }
}
```

### API Response Example

```json
{
  "id": "word-456",
  "arabicText": "يُؤْمِنُونَ",
  "translation": "believe",
  "posType": "V",
  "syntacticRole": "predicate",
  "parentWordId": "word-123",
  "dependencyRelation": "verb_subject",
  "grammarData": {
    "syntax": {
      "role": "predicate",
      "parent": 1
    },
    "dependencies": {
      "parent": {
        "word": "قَالَ",
        "wordId": "word-123",
        "relation": "verb_subject"
      },
      "children": [
        {
          "word": "الْحَقَّ",
          "wordId": "word-789",
          "relation": "verb_object"
        }
      ]
    }
  }
}
```

### API Endpoint Enhancement

**Endpoint**: `GET /api/v1/verses/:surahNumber/:verseNumber`

**Response Enhancement**:
```typescript
// Include related words in response for dependency visualization
{
  "id": "verse-123",
  "words": [
    {
      "id": "word-1",
      // ... word fields ...
      "parentWord": {  // Include parent word details
        "id": "word-0",
        "arabicText": "قَالَ",
        "translation": "said"
      },
      "childWords": [  // Include child words
        {
          "id": "word-2",
          "arabicText": "الْحَقَّ",
          "translation": "the truth"
        }
      ]
    }
  ]
}
```

---

## Feature 11: Sentence Type Detection

### Description
Identify whether the verse is a Nominal Sentence (جملة اسمية) or Verbal Sentence (جملة فعلية).

### Data Source
Can be algorithmically determined from word data.

### Backend Implementation Required

#### 1. Add Sentence Analysis Endpoint

**New Endpoint**: `GET /api/v1/verses/:surahNumber/:verseNumber/analysis`

**Response**:
```json
{
  "sentenceType": "verbal",  // or "nominal"
  "sentenceTypeAr": "جملة فعلية",
  "structure": "Verb + Subject (+ Object)",
  "structureAr": "فعل + فاعل (+ مفعول)",
  "description": "Begins with a verb, emphasizes the action",
  "verseExample": {
    "verb": {
      "word": "قَالَ",
      "position": 1
    },
    "subject": {
      "word": "اللَّهُ",
      "position": 2
    }
  }
}
```

#### 2. Implement Detection Logic

**File**: `/home/dev/Development/arQ/backend/src/modules/verses/verses.service.ts`

```typescript
async getVerseAnalysis(surahNumber: number, verseNumber: number) {
  const verse = await this.findOne(surahNumber, verseNumber);

  // Determine sentence type from first word
  const firstWord = verse.words[0];
  const sentenceType = this.detectSentenceType(firstWord);

  // Find key components
  const components = this.findSentenceComponents(verse.words, sentenceType);

  return {
    sentenceType: sentenceType.type,
    sentenceTypeAr: sentenceType.typeAr,
    structure: sentenceType.structure,
    structureAr: sentenceType.structureAr,
    description: sentenceType.description,
    verseExample: components
  };
}

private detectSentenceType(firstWord: VerseWord) {
  if (firstWord.posType === 'V') {
    return {
      type: 'verbal',
      typeAr: 'جملة فعلية',
      structure: 'Verb + Subject (+ Object)',
      structureAr: 'فعل + فاعل (+ مفعول)',
      description: 'Begins with a verb, emphasizes the action'
    };
  } else {
    return {
      type: 'nominal',
      typeAr: 'جملة اسمية',
      structure: 'Subject + Predicate',
      structureAr: 'مبتدأ + خبر',
      description: 'Begins with a noun, emphasizes the state/description'
    };
  }
}
```

### Frontend Integration
Frontend will call the new `/analysis` endpoint and display the sentence type card above the verse.

---

## Feature 12: Phrase Groupings

### Description
Identify and group related words into phrases (Idafa constructions, prepositional phrases, etc.).

### Data Source
Can be derived from POS types, case markings, and structure type fields.

### Backend Implementation Required

#### 1. Add Phrase Detection Endpoint

**New Endpoint**: `GET /api/v1/verses/:surahNumber/:verseNumber/phrases`

**Response**:
```json
{
  "phrases": [
    {
      "type": "idafa",
      "typeAr": "إضافة",
      "startPosition": 1,
      "endPosition": 2,
      "words": [
        {
          "word": "ٱسْمِ",
          "position": 1,
          "role": "mudaf",
          "roleAr": "مضاف"
        },
        {
          "word": "اللَّهِ",
          "position": 2,
          "role": "mudaf_ilayh",
          "roleAr": "مضاف إليه"
        }
      ]
    },
    {
      "type": "prepositional",
      "typeAr": "شبه جملة جار ومجرور",
      "startPosition": 0,
      "endPosition": 2,
      "words": [
        {
          "word": "بِ",
          "position": 0,
          "role": "preposition",
          "roleAr": "حرف جر"
        },
        {
          "word": "ٱسْمِ اللَّهِ",
          "positions": [1, 2],
          "role": "object",
          "roleAr": "اسم مجرور"
        }
      ]
    }
  ]
}
```

#### 2. Implement Phrase Detection Logic

**File**: `/home/dev/Development/arQ/backend/src/modules/verses/verses.service.ts`

```typescript
async getPhraseGroupings(surahNumber: number, verseNumber: number) {
  const verse = await this.findOne(surahNumber, verseNumber);
  const phrases: any[] = [];

  // Detect Idafa constructions (genitive case sequence)
  for (let i = 0; i < verse.words.length - 1; i++) {
    const current = verse.words[i];
    const next = verse.words[i + 1];

    if (current.posType === 'N' && next.irabCase === 'Genitive') {
      phrases.push({
        type: 'idafa',
        typeAr: 'إضافة',
        startPosition: current.position,
        endPosition: next.position,
        words: [
          { word: current.arabicText, position: current.position, role: 'mudaf' },
          { word: next.arabicText, position: next.position, role: 'mudaf_ilayh' }
        ]
      });
    }
  }

  // Detect prepositional phrases (P + N in genitive)
  for (let i = 0; i < verse.words.length - 1; i++) {
    const current = verse.words[i];
    const next = verse.words[i + 1];

    if (current.posType === 'P' && next.irabCase === 'Genitive') {
      phrases.push({
        type: 'prepositional',
        typeAr: 'شبه جملة',
        startPosition: current.position,
        endPosition: next.position,
        words: [
          { word: current.arabicText, position: current.position, role: 'preposition' },
          { word: next.arabicText, position: next.position, role: 'object' }
        ]
      });
    }
  }

  return { phrases };
}
```

---

## Feature 13: Agreement Patterns

### Description
Highlight grammatical agreement between related words (gender, number, case, definiteness).

### Data Source
Can be computed from existing word properties by comparing related words.

### Backend Implementation Required

#### 1. Add Agreement Analysis Endpoint

**New Endpoint**: `GET /api/v1/verses/:surahNumber/:verseNumber/words/:position/agreements`

**Response**:
```json
{
  "word": {
    "arabicText": "الرَّحْمَٰنِ",
    "position": 3
  },
  "agreementsWith": {
    "word": "اللَّهِ",
    "wordId": "word-2",
    "position": 2,
    "role": "adjective_of_noun"
  },
  "agreements": [
    {
      "type": "gender",
      "agreesWith": "اللَّهِ",
      "agreementValue": "masculine",
      "agreementValueAr": "مذكر",
      "isCorrect": true
    },
    {
      "type": "number",
      "agreesWith": "اللَّهِ",
      "agreementValue": "singular",
      "agreementValueAr": "مفرد",
      "isCorrect": true
    },
    {
      "type": "case",
      "agreesWith": "اللَّهِ",
      "agreementValue": "genitive",
      "agreementValueAr": "مجرور",
      "isCorrect": true
    },
    {
      "type": "definiteness",
      "agreesWith": "اللَّهِ",
      "agreementValue": "definite",
      "agreementValueAr": "معرفة",
      "isCorrect": true
    }
  ]
}
```

#### 2. Implement Agreement Detection

**File**: `/home/dev/Development/arQ/backend/src/modules/verses/verses.service.ts`

```typescript
async getWordAgreements(surahNumber: number, verseNumber: number, position: number) {
  const verse = await this.findOne(surahNumber, verseNumber);
  const word = verse.words.find(w => w.position === position);

  if (!word) throw new NotFoundException('Word not found');

  // Find related word (e.g., adjective agrees with noun)
  const relatedWord = this.findRelatedWord(word, verse.words);

  if (!relatedWord) {
    return { word, agreements: [] };
  }

  // Check agreements
  const agreements = [];

  // Gender agreement
  if (word.gender && relatedWord.gender) {
    agreements.push({
      type: 'gender',
      agreesWith: relatedWord.arabicText,
      agreementValue: word.gender.toLowerCase(),
      agreementValueAr: word.genderArabic,
      isCorrect: word.gender === relatedWord.gender
    });
  }

  // Number agreement
  if (word.number && relatedWord.number) {
    agreements.push({
      type: 'number',
      agreesWith: relatedWord.arabicText,
      agreementValue: word.number.toLowerCase(),
      agreementValueAr: word.numberArabic,
      isCorrect: word.number === relatedWord.number
    });
  }

  // Case agreement
  if (word.irabCase && relatedWord.irabCase) {
    agreements.push({
      type: 'case',
      agreesWith: relatedWord.arabicText,
      agreementValue: word.irabCase.toLowerCase(),
      agreementValueAr: word.irabCaseArabic,
      isCorrect: word.irabCase === relatedWord.irabCase
    });
  }

  // Definiteness agreement
  if (word.definiteness && relatedWord.definiteness) {
    agreements.push({
      type: 'definiteness',
      agreesWith: relatedWord.arabicText,
      agreementValue: word.definiteness.toLowerCase(),
      agreementValueAr: word.definitenessArabic,
      isCorrect: word.definiteness === relatedWord.definiteness
    });
  }

  return {
    word,
    agreementsWith: {
      word: relatedWord.arabicText,
      wordId: relatedWord.id,
      position: relatedWord.position,
      role: this.inferAgreementRole(word, relatedWord)
    },
    agreements
  };
}

private findRelatedWord(word: VerseWord, allWords: VerseWord[]): VerseWord | null {
  // Adjectives agree with preceding noun
  if (word.posType === 'ADJ') {
    return allWords.find(w => w.position === word.position - 1 && w.posType === 'N') || null;
  }

  // Look for dependency relationships
  if (word.parentWordId) {
    return allWords.find(w => w.id === word.parentWordId) || null;
  }

  return null;
}
```

---

## Implementation Priority

### Phase 1: Critical Data (2-3 days)
1. **Feature 9**: Syntactic Role - Essential for understanding sentence structure
2. **Feature 10**: Dependency Relationships - Required for tree visualization

### Phase 2: Sentence Analysis (2 days)
3. **Feature 11**: Sentence Type - Educational foundation
4. **Feature 12**: Phrase Groupings - Visual grouping enhances learning

### Phase 3: Advanced Features (1-2 days)
5. **Feature 13**: Agreement Patterns - Advanced grammatical analysis

---

## Database Migration

**File**: `/home/dev/Development/arQ/backend/prisma/migrations/YYYYMMDDHHMMSS_add_sentence_features/migration.sql`

```sql
-- AlterTable: Add syntactic role fields
ALTER TABLE "VerseWord" ADD COLUMN "syntacticRole" TEXT;
ALTER TABLE "VerseWord" ADD COLUMN "syntacticRoleAr" TEXT;

-- AlterTable: Add dependency relationship fields
ALTER TABLE "VerseWord" ADD COLUMN "parentWordId" TEXT;
ALTER TABLE "VerseWord" ADD COLUMN "dependencyRelation" TEXT;

-- AddForeignKey: Dependency self-reference
ALTER TABLE "VerseWord"
  ADD CONSTRAINT "VerseWord_parentWordId_fkey"
  FOREIGN KEY ("parentWordId")
  REFERENCES "VerseWord"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- CreateIndex: Improve query performance
CREATE INDEX "VerseWord_parentWordId_idx" ON "VerseWord"("parentWordId");
CREATE INDEX "VerseWord_syntacticRole_idx" ON "VerseWord"("syntacticRole");
```

---

## Testing Requirements

### Unit Tests
- Test syntactic role mapping from corpus data
- Test dependency relationship extraction
- Test sentence type detection algorithm
- Test phrase grouping detection
- Test agreement pattern checking

### Integration Tests
- Test complete verse with all features
- Test edge cases (missing data, incomplete features)
- Test performance with large verses

### Sample Test Data
Use these verses for comprehensive testing:

1. **Verse 1:1** (Al-Fatiha) - Simple nominal sentence, Idafa construction
2. **Verse 2:2** - Verbal sentence with subject and object
3. **Verse 2:255** (Ayat al-Kursi) - Complex dependencies, multiple phrases

---

## API Documentation Updates

Update OpenAPI/Swagger documentation with new endpoints and response schemas.

**File**: `/home/dev/Development/arQ/backend/src/swagger.json`

Add:
- `GET /verses/{surahNumber}/{verseNumber}/analysis`
- `GET /verses/{surahNumber}/{verseNumber}/phrases`
- `GET /verses/{surahNumber}/{verseNumber}/words/{position}/agreements`

---

## Frontend Ready State

The frontend implementation is **READY** and waiting for backend API updates:

✅ UI components built
✅ Visual designs complete
✅ TypeScript types defined
✅ State management prepared
✅ 0 TypeScript errors

**All we need**: Backend to populate the new fields and endpoints!

---

## Timeline Estimate

- **Database Schema Updates**: 0.5 days
- **Corpus Mapper Enhancements**: 1-2 days
- **New Service Methods**: 2-3 days
- **API Endpoints**: 1 day
- **Testing**: 1-2 days
- **Documentation**: 0.5 days

**Total**: 6-9 days for complete backend implementation

---

## Questions for Backend Team

1. Do we have access to syntactic role data in the corpus files?
2. Can we modify the import script to run again for existing verses?
3. Should we create a separate table for phrase groupings or compute on-demand?
4. Performance concerns with dependency tree queries?
5. Caching strategy for sentence analysis results?

---

**Next Steps**: Backend team reviews this document and begins implementation starting with Phase 1 (Features 9-10).
