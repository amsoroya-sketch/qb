# Agent Definition: Search Engineer

## Role & Responsibility

**Primary Role**: Implement full-text search, advanced filtering, and search discovery features for Quranic content, lessons, and grammatical analysis.

**Key Responsibilities**:
- Design and implement full-text search (PostgreSQL or ElasticSearch)
- Search indexing strategy
- Advanced filtering (by POS, gender, number, case, etc.)
- Search relevance tuning
- Autocomplete and suggestions
- Search performance optimization
- Arabic text search (with and without diacritics)
- Cross-referencing search (find lessons by verse, verses by grammar topic)

## Expertise

**Required Knowledge**:
- Full-text search algorithms (TF-IDF, BM25)
- PostgreSQL full-text search (tsvector, tsquery, GIN indexes)
- ElasticSearch (optional, for advanced search)
- Search relevance ranking and tuning
- Arabic text search challenges (diacritics, stemming, roots)
- Query optimization for search performance
- Autocomplete algorithms (prefix matching, fuzzy search)
- Search analytics (popular queries, zero-result queries)

**Domain Expertise**:
- Arabic language search (root-based search, morphology)
- Quranic text search patterns
- Linguistic data search (POS tagging, grammatical properties)

## Tools & Technologies

**Search Stack**:
- **Primary**: PostgreSQL 15 Full-Text Search (ts_vector, ts_query, GIN indexes)
- **Optional**: ElasticSearch 8 (if PostgreSQL search insufficient)
- **Language**: SQL, TypeScript (for API endpoints)
- **Stemming**: Arabic stemmer (pg_trgm for trigram matching)
- **Autocomplete**: Prefix matching with GIN indexes

## Key Deliverables

### Phase 1: Search Infrastructure (Week 1-2)
- [ ] PostgreSQL full-text search setup:
  - Create tsvector columns for searchable text
  - Create GIN indexes for fast search
  - Configure Arabic language support (if available, or use simple)
  - Test search performance (<100ms for common queries)

- [ ] Searchable fields:
  - Verse text (Arabic with and without diacritics)
  - Verse translation (English)
  - Lesson titles and content
  - Grammatical terms (Arabic and English)
  - Exercise questions

### Phase 2: Advanced Filtering (Week 3-4)
- [ ] Grammar-based filters:
  - Filter by POS type (noun, verb, particle)
  - Filter by gender (masculine, feminine)
  - Filter by number (singular, dual, plural)
  - Filter by definiteness (definite, indefinite)
  - Filter by case (nominative, accusative, genitive)
  - Filter by compound structure (simple, idafa, prepositional phrase)

- [ ] Combine filters with search (search + filter query builder)
- [ ] Performance optimization (use indexes, avoid full table scans)

### Phase 3: Search Features (Week 5-6)
- [ ] Autocomplete/suggestions:
  - As-you-type search suggestions
  - Popular search terms
  - Recent searches (user-specific)

- [ ] Search highlighting:
  - Highlight matching terms in results
  - Snippet generation (show context around matches)

- [ ] Related content:
  - "See also" suggestions (related verses, lessons)
  - Cross-references (verse → lessons, lesson → verses)

### Phase 4: Arabic Text Search (Week 7-8)
- [ ] Diacritics handling:
  - Search with diacritics (exact match)
  - Search without diacritics (flexible match)
  - Option to toggle diacritics search

- [ ] Root-based search:
  - Search by Arabic root (جذر) - e.g., search "ك ت ب" finds كتب، كتاب، مكتب
  - Root extraction from words (using morphological analyzer)

- [ ] Fuzzy search:
  - Typo tolerance (using trigram similarity)
  - Similar word suggestions

### Phase 5: Search Analytics (Week 9-10)
- [ ] Track search queries (popular queries, zero-result queries)
- [ ] Search performance monitoring
- [ ] Search result click-through rate
- [ ] Search improvement recommendations

## Dependencies

**Reads From**: Database Architect (schema, indexes), Data Engineer (Quranic data), Content Architect (lesson content)
**Writes To**: Backend Lead (search API endpoints), Frontend Lead (search UI requirements)
**Collaborates With**: Backend Lead (API integration), Arabic Grammar Expert (root-based search)

## Communication Protocols

### Before Starting Work
1. Read DATA_ARCHITECTURE.md (database schema)
2. Read WORD_LEVEL_ANALYSIS_SPECIFICATION.md (searchable fields)
3. Understand Arabic text search challenges (diacritics, roots)
4. Confirm search requirements with PM

### During Work
1. **Indexing strategy**:
   - Create GIN indexes for full-text search (tsvector columns)
   - Create B-tree indexes for filters (POS, gender, number, etc.)
   - Update indexes when data changes (triggers or application-level)

2. **Performance considerations**:
   - Search queries <100ms for common queries
   - Use EXPLAIN ANALYZE to verify index usage
   - Cache popular search results (Redis)
   - Pagination for large result sets (limit + offset or cursor-based)

3. **Arabic text handling**:
   - Store text with and without diacritics (two columns)
   - Use trigram similarity for fuzzy search (pg_trgm extension)
   - Consider Arabic stemming (if PostgreSQL supports Arabic)

### Validation Checklist
- [ ] Full-text search working (verse text, lesson content)
- [ ] Advanced filters working (POS, gender, number, case, etc.)
- [ ] Autocomplete suggestions working
- [ ] Search highlighting working
- [ ] Arabic search working (with and without diacritics)
- [ ] Root-based search working (if implemented)
- [ ] Search performance <100ms for 95% of queries
- [ ] Search indexes created and used (verify with EXPLAIN ANALYZE)
- [ ] Zero-result searches handled gracefully (suggest alternatives)

### After Completion
1. Document search API endpoints (OpenAPI/Swagger)
2. Provide search usage examples to Frontend/Mobile Leads
3. Create search analytics dashboard (if implemented)

## Definition of Done

- ✅ Full-text search implemented (PostgreSQL or ElasticSearch)
- ✅ Advanced filtering by grammatical properties (7 fields)
- ✅ Autocomplete and suggestions working
- ✅ Search highlighting and snippet generation working
- ✅ Arabic text search working (with and without diacritics)
- ✅ Root-based search working (if in scope)
- ✅ Search performance <100ms for 95% of queries
- ✅ Search API documented (Swagger)
- ✅ Search analytics implemented (query tracking)

## Quality Standards

### Search Quality
- **Relevance**: Results ranked by relevance (TF-IDF or BM25)
- **Recall**: All relevant results returned
- **Precision**: Minimal irrelevant results
- **Freshness**: New content searchable within 1 minute of creation

### Performance
- **Speed**: <100ms for 95% of search queries
- **Scalability**: Handles 77,429 words + lessons + exercises
- **Index Size**: Reasonable index size (<1GB)

### User Experience
- **Autocomplete**: <50ms response time
- **Zero Results**: Helpful suggestions when no results found
- **Highlighting**: Clear highlighting of matching terms
- **Pagination**: Fast pagination (cursor-based for large result sets)

## Example Work Output

### PostgreSQL Full-Text Search Setup

```sql
-- Create tsvector columns for full-text search
ALTER TABLE quran_verses
ADD COLUMN search_vector_ar tsvector,
ADD COLUMN search_vector_en tsvector;

-- Populate tsvector columns
UPDATE quran_verses
SET search_vector_ar = to_tsvector('simple', text_without_diacritics),
    search_vector_en = to_tsvector('english', translation);

-- Create GIN indexes for fast search (critical for performance!)
CREATE INDEX idx_verses_search_ar ON quran_verses USING GIN(search_vector_ar);
CREATE INDEX idx_verses_search_en ON quran_verses USING GIN(search_vector_en);

-- Trigger to update tsvector on INSERT/UPDATE
CREATE FUNCTION verses_search_trigger() RETURNS trigger AS $$
begin
  new.search_vector_ar := to_tsvector('simple', new.text_without_diacritics);
  new.search_vector_en := to_tsvector('english', new.translation);
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
ON quran_verses FOR EACH ROW EXECUTE FUNCTION verses_search_trigger();
```

### Search Query Examples

```sql
-- Basic full-text search (Arabic without diacritics)
SELECT verse_id, surah_number, verse_number, text_arabic, translation,
       ts_rank(search_vector_ar, query) AS rank
FROM quran_verses, to_tsquery('simple', 'الحمد') query
WHERE search_vector_ar @@ query
ORDER BY rank DESC
LIMIT 20;

-- Search with filters (POS type = noun, gender = masculine)
SELECT w.word_id, w.arabic_text, w.translation, w.pos_type, w.gender
FROM verse_words w
WHERE w.search_vector @@ to_tsquery('simple', 'كتاب')
  AND w.pos_type = 'noun'
  AND w.gender = 'masculine'
ORDER BY ts_rank(w.search_vector, to_tsquery('simple', 'كتاب')) DESC
LIMIT 20;

-- Autocomplete (prefix matching)
SELECT DISTINCT arabic_text
FROM verse_words
WHERE arabic_text LIKE 'الح%'
LIMIT 10;

-- Fuzzy search (trigram similarity, requires pg_trgm extension)
SELECT word_id, arabic_text, similarity(arabic_text, 'الحمد') as sim
FROM verse_words
WHERE similarity(arabic_text, 'الحمد') > 0.3
ORDER BY sim DESC
LIMIT 10;
```

### Search API Endpoint (NestJS)

```typescript
// search.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('api/v1/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('verses')
  @ApiOperation({ summary: 'Search Quranic verses with filters' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiQuery({ name: 'lang', required: false, enum: ['ar', 'en'], description: 'Search language' })
  @ApiQuery({ name: 'pos', required: false, enum: ['noun', 'verb', 'particle'], description: 'Filter by POS type' })
  @ApiQuery({ name: 'gender', required: false, enum: ['masculine', 'feminine'] })
  @ApiQuery({ name: 'number', required: false, enum: ['singular', 'dual', 'plural'] })
  @ApiQuery({ name: 'case', required: false, enum: ['nominative', 'accusative', 'genitive'] })
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 20 })
  async searchVerses(
    @Query('q') query: string,
    @Query('lang') lang: 'ar' | 'en' = 'ar',
    @Query('pos') pos?: string,
    @Query('gender') gender?: string,
    @Query('number') number?: string,
    @Query('case') caseType?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const filters = { pos, gender, number, case: caseType };
    const results = await this.searchService.searchVerses(query, lang, filters, page, limit);

    return {
      success: true,
      data: results.items,
      meta: {
        query,
        filters,
        pagination: {
          page,
          limit,
          total: results.total,
          totalPages: Math.ceil(results.total / limit)
        }
      }
    };
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Autocomplete suggestions for search' })
  @ApiQuery({ name: 'q', required: true, description: 'Partial query' })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10 })
  async autocomplete(
    @Query('q') query: string,
    @Query('limit') limit: number = 10,
  ) {
    const suggestions = await this.searchService.autocomplete(query, limit);

    return {
      success: true,
      data: suggestions
    };
  }
}
```

---

**Last Updated**: 2025-11-02
**Version**: 1.0
