# Complete Game Development Workflow (12-Step Process)
## SkillBridge Educational Gaming Platform

**Document Version**: 1.0
**Last Updated**: October 12, 2025
**Workflow Type**: Iterative, Expert-Driven, Automated Quality Gates

---

## WORKFLOW OVERVIEW

### Philosophy
This workflow ensures **clinical validity first, technical excellence second, automation throughout**. Every game goes through expert validation at multiple stages, with automated testing enforcing hard constraints, and continuous iteration until the game reaches maturity.

### Key Principles
1. **Skill-Database-Driven**: Every game starts from validated clinical skills
2. **Multi-Expert Collaboration**: Autism experts + game designers + tech experts work together
3. **Early Validation**: Ideas validated before heavy development investment
4. **Automated Quality Gates**: Tests enforce non-negotiable criteria
5. **Iteration Loop**: Changes flow back to PM → developer → re-test until perfect
6. **AI-Assisted Resource Generation**: Open-source AI APIs create graphics/audio at scale

---

## 12-STEP WORKFLOW

```
┌─────────────────────────────────────────────────────────────┐
│                    STEP 1: GAME IDEATION                     │
│                   Pick idea from skill database              │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                STEP 2: EXPERT IDENTIFICATION                 │
│          Auto-route to autism experts based on skills        │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                 STEP 3: GAME DESIGN START                    │
│         Expert Game Designer creates concept document        │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│            STEP 4: DESIGN VALIDATION (CLINICAL)              │
│        Designer + Autism Experts iterate on concept          │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│            STEP 5: TECHNICAL FEASIBILITY REVIEW              │
│        Tech Expert/PM assesses idea for viability            │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│           STEP 6: TECH TEAM IDENTIFICATION + PLAN            │
│    Identify devs needed, get feedback, create tech plan      │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│          STEP 7: RESOURCE SPECIFICATION                      │
│    Define all graphics/audio/animation needs from tech plan  │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│          STEP 8: AI-ASSISTED RESOURCE GENERATION             │
│   Experts with AI API access create assets per specs         │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│          STEP 9: RESOURCE HANDOFF TO DEVELOPMENT             │
│         PM receives assets → gives to senior developer       │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│               STEP 10: GAME DEVELOPMENT                      │
│          Senior developer builds game in Unity               │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│            STEP 11: AUTOMATED TESTING + QA                   │
│     Automation scripts + hard constraint validation          │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│         STEP 12: EXPERT RE-ASSESSMENT + ITERATION            │
│   Autism experts test → PM gets changes → loop to Step 10    │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
              ┌───┴────┐
              │APPROVED?│
              └┬──────┬┘
             NO       YES
              │        │
         Loop back     │
         to Step 10    ↓
                  ┌─────────┐
                  │ LAUNCH! │
                  └─────────┘
```

---

## STEP 1: GAME IDEATION (Skill-Database-Driven)

### Objective
Identify high-value skill(s) from database that would benefit from gamification.

### Process

#### 1.1 Skill Database Query
**System**: Automated recommendation engine analyzes skill database

**Query Criteria**:
```sql
-- Find skills ripe for game development
SELECT
    s.id,
    s.skill_code,
    s.name,
    s.primary_domain,
    s.difficulty_level,
    s.age_range_min,
    s.age_range_max,
    COUNT(DISTINCT pg.game_id) as games_teaching_this_skill,
    AVG(pt.mastery_percentage) as avg_mastery_rate
FROM skills s
LEFT JOIN progress_tracking pt ON pt.skill_id = s.id
LEFT JOIN games_skills_mapping pg ON pg.skill_id = s.id
WHERE s.is_active = true
GROUP BY s.id
HAVING games_teaching_this_skill < 3  -- Underserved skills
ORDER BY
    avg_mastery_rate ASC,  -- Prioritize skills children struggle with
    s.priority_score DESC  -- Clinical importance rating
LIMIT 50;
```

**Output**: Top 50 skill candidates for game development

#### 1.2 PM Review + Selection
**Actor**: Senior Project Manager

**Review Process**:
1. Review top 50 candidates
2. Consider:
   - **Clinical Need**: Are children struggling with this skill?
   - **Game Potential**: Can this be taught engagingly through a game?
   - **Resource Feasibility**: Do we have experts/tech for this?
   - **Strategic Fit**: Does this fill a gap in our game portfolio?
3. Select 1-3 skills for next development sprint
4. Document rationale in project management system

**Example Selection**:
```
SELECTED SKILL: ABLLS-R C1-C5 (Identify Emotions)

Rationale:
- Clinical Need: HIGH (avg 62% mastery, below 80% target)
- Game Potential: HIGH (visual matching, clear correct/incorrect)
- Resources: AVAILABLE (BCBA, SLP, Child Psychologist on team)
- Strategic Fit: YES (fills gap - no emotion games yet)
- Target: 5-game sprint, start with this

DECISION: Proceed to Step 2 (Expert Identification)
```

---

## STEP 2: EXPERT IDENTIFICATION (Auto-Routing)

### Objective
Automatically identify which autism clinical experts must participate in this game's design and validation.

### Process

#### 2.1 Automated Expert Routing
**System**: Skill-to-Expert Mapping Engine (see SKILL_TO_EXPERT_MAPPING_SYSTEM.md)

**Input**: Selected skill(s) from Step 1

**Algorithm**:
```typescript
const skill = {
  skillCode: "ABLLS-R-C1-C5",
  name: "Identify Emotions",
  primaryDomain: "Social Communication",
  secondaryDomains: ["Emotional Regulation"],
  ageRange: [3, 7]
};

const experts = getRequiredExperts(skill);

/*
Output:
[
  { expertType: 'BCBA', priority: 'mandatory', reviewOrder: 1, hours: 5 },
  { expertType: 'SLP', priority: 'mandatory', reviewOrder: 1, hours: 4 },
  { expertType: 'Child Psychologist', priority: 'mandatory', reviewOrder: 2, hours: 3 },
  { expertType: 'Autistic Advocate', priority: 'mandatory', reviewOrder: 2, hours: 2 },
  { expertType: 'Accessibility Specialist', priority: 'mandatory', reviewOrder: 3, hours: 2 },
  { expertType: 'Parent Representative', priority: 'mandatory', reviewOrder: 4, hours: 1 }
]
*/
```

#### 2.2 Expert Assignment
**System**: PM Dashboard auto-assigns available experts

**Assignment Logic**:
1. Check expert availability (current workload <60% capacity)
2. Assign expert with lowest workload
3. Send notification email with game concept
4. Add to expert's review queue
5. Schedule kickoff meeting (all Order 1 experts + Game Designer)

**Output**: Expert team assembled, kickoff meeting scheduled

---

## STEP 3: GAME DESIGN START (Expert Game Designer)

### Objective
Expert Game Designer creates initial concept document collaboratively with autism experts.

### 3.1 Role Definition: Expert Game Designer

**Do we have this role?** → **YES, defined in agent system**

**Agent ID**: GAME-001 (Game Developer Agent)
**Real-World Role**: Senior Game Designer specializing in educational games

**Expertise Required**:
- 5+ years game design experience
- Educational game design (preferably special education)
- Understanding of ABA principles (or willingness to learn)
- Unity/game engine proficiency
- Accessibility-first design mindset
- Portfolio with 3+ published games

**Responsibilities in This Step**:
1. Review skill requirements from Step 1
2. Research existing games teaching similar skills (competitive analysis)
3. Brainstorm 3-5 game mechanic concepts
4. Draft initial concept document (5-10 pages)
5. Prepare for design validation meeting with autism experts

### 3.2 Concept Document Template

**Format**: Lightweight document (NOT full GDD yet)

```markdown
# Game Concept: [Working Title]

## Skill Target
- **Skill Code**: ABLLS-R C1-C5
- **Skill Name**: Identify Emotions (happy, sad, angry, scared, surprised)
- **Age Range**: 3-7 years
- **Difficulty**: Level 2-4

## Core Mechanic (3 Concept Options)

### Option A: Photo Matching
Child sees photo of person's face → selects matching emotion label/icon
- Pros: Simple, clear correct/incorrect, scales to real photos
- Cons: May be too easy, limited engagement

### Option B: Emotion Scenarios
Child sees situation (birthday party, broken toy) → predicts how person feels
- Pros: Teaches context, more engaging, real-world application
- Cons: More complex, subjective answers possible

### Option C: Interactive Story
Animated story where child helps character identify their emotions
- Pros: Highly engaging, narrative structure, character connection
- Cons: More dev time, requires animation/voice acting

## Preliminary Questions for Autism Experts
1. Which mechanic best teaches emotion identification?
2. Should we start with photos or drawings? (Photos more realistic, drawings less overwhelming)
3. How many emotions in first level? (Recommend 2-3, expand to 6)
4. Do we need to teach "emotion words" or just matching? (SLP input needed)
5. Cultural considerations for emotion expressions?

## Technical Feasibility
- Estimated Dev Time: 80 hours (Option A), 120 hours (Option B), 200 hours (Option C)
- Art Assets: 20-50 images/animations
- Audio: 10-20 voice lines
- Backend: Standard session tracking

## Next Steps
- Schedule design validation meeting (Step 4)
- Get expert feedback on concept options
- Refine chosen concept into full GDD
```

**Deliverable**: Concept document ready for Step 4 validation

---

## STEP 4: DESIGN VALIDATION (Clinical Collaboration)

### Objective
Game Designer and Autism Experts collaborate to validate concept, refine design, ensure clinical soundness.

### Process

#### 4.1 Design Validation Meeting
**Duration**: 90 minutes
**Attendees**:
- Game Designer (presents concepts)
- BCBA (validates skill teaching methodology)
- SLP (validates language/communication aspects)
- Child Psychologist (validates emotional content, trauma sensitivity)
- Autistic Advocate (validates neurodiversity perspective)
- PM (facilitates, takes notes)

**Agenda**:
```
0:00-0:10  Intro: Skill rationale, clinical need (PM)
0:10-0:30  Concept presentation: 3 mechanic options (Game Designer)
0:30-1:00  Expert feedback & discussion
           - BCBA: Skill acquisition strategy
           - SLP: Language targets, AAC integration
           - Psychologist: Emotion accuracy, sensitivity
           - Advocate: Neurodiversity concerns
1:00-1:20  Consensus building: Select preferred concept
1:20-1:30  Action items: Required modifications, next steps
```

#### 4.2 Expert Feedback Capture
**System**: Design Validation Form (digital)

**Form Fields**:
```
Expert: Dr. Emily Foster, BCBA-D
Game: Emotion Recognition (Concept Stage)

Q1: Which mechanic option do you prefer?
[ ] Option A: Photo Matching
[X] Option B: Emotion Scenarios ← SELECTED
[ ] Option C: Interactive Story

Q2: Why? (Clinical rationale)
"Option B teaches context, which is critical for generalization.
Matching faces alone doesn't help child predict emotions in
real-world situations. Scenarios bridge the gap."

Q3: Required modifications for approval:
1. Start with 4 emotions (happy, sad, angry, scared), not 6
2. Use drawings not photos (less overwhelming for Level 1)
3. Ensure scenarios are concrete (avoid abstract emotions)
4. Add prompt system: If wrong, show "clue" (e.g., tears = sad)

Q4: Concerns to address:
- Emotion expressions must be culturally diverse
- Avoid stereotypes (angry ≠ always frowning aggressively)
- Some autistic children struggle with face-reading; consider
  body language cues too (slumped shoulders, jumping for joy)

Q5: Approval status:
[X] Approved with modifications (list above)
[ ] Needs major revision
[ ] Rejected

Estimated hours to implement modifications: 8 hours design work
```

**All experts complete form → PM aggregates feedback**

#### 4.3 Concept Refinement
**Actor**: Game Designer (incorporates feedback)

**Refinement Process**:
1. Aggregate all expert feedback
2. Resolve conflicting suggestions (if any) via follow-up with experts
3. Update concept document with:
   - Selected mechanic (Option B in example)
   - All required modifications
   - Addressed concerns
4. Circulate updated concept to experts for confirmation

**Gate**: All Order 1 experts (BCBA, SLP, Psychologist) approve refined concept

**Output**: **Validated Game Concept** → Ready for Step 5

---

## STEP 5: TECHNICAL FEASIBILITY REVIEW

### Objective
Technology Expert or Project Manager assesses concept for technical viability, estimates effort, identifies risks.

### Process

#### 5.1 Technical Assessment
**Actor**: Solution Architect or Senior Developer

**Assessment Criteria**:

| Criterion | Assessment | Risk Level |
|-----------|------------|------------|
| **Platform Support** | Unity WebGL + Mobile (iOS/Android) | ✅ Low (standard) |
| **Performance** | 60fps, <200MB RAM, <3s load time | ✅ Low |
| **3rd-Party Dependencies** | AAC API integration required | ⚠️ Medium (external dependency) |
| **Backend Complexity** | Standard session tracking, no new tables | ✅ Low |
| **Asset Volume** | 40-50 scenario images, 15 voice lines | ✅ Low (AI-generatable) |
| **Novel Technology** | No new tech, standard Unity features | ✅ Low |
| **Accessibility** | WCAG 2.1 AA (screen reader for scenarios) | ⚠️ Medium (scenario text must be semantic) |
| **Development Effort** | Estimated 120 hours (2 weeks, 1 developer) | ✅ Reasonable |

**Overall Feasibility**: ✅ **APPROVED** (Medium Risk, Manageable)

#### 5.2 Technical Concerns & Mitigations

**Identified Concerns**:
1. **AAC API Integration**: Proloquo2Go SDK may have breaking changes
   - Mitigation: Test SDK in prototype phase, have fallback (manual symbol library)

2. **Scenario Image Diversity**: Need 40+ culturally diverse scenarios
   - Mitigation: Use AI image generation (DALL-E 3 via API) with diversity prompts

3. **Screen Reader for Scenarios**: Long text descriptions may be clunky
   - Mitigation: Write concise alt-text (max 2 sentences), test with NVDA early

**Recommendation**: Proceed to Step 6 (Team Assembly)

---

## STEP 6: TECH TEAM IDENTIFICATION + TECHNICAL PLAN

### Objective
Identify which technical experts are needed, gather their feedback, create detailed technical implementation plan.

### Process

#### 6.1 Required Technical Roles

**Based on Game Design (Emotion Recognition example)**:

| Role | Needed? | Rationale | Hours |
|------|---------|-----------|-------|
| **Unity Developer** | ✅ Yes (1 senior) | Core game development | 80h |
| **Frontend Developer** | ✅ Yes (0.5 FTE) | Web integration, UI polish | 32h |
| **Backend Developer** | ✅ Yes (0.25 FTE) | Session API, data schema updates | 16h |
| **2D Artist** | ❌ No (AI-generated) | Scenario illustrations | 0h (AI) |
| **Sound Designer** | ⚠️ Partial (voice recording only) | Voice-overs (AI can't do this well yet) | 12h |
| **Animator** | ❌ No | Simple transitions, no complex animation | 0h |
| **Database Architect** | ❌ No | Standard schema, no new design needed | 0h |
| **DevOps** | ✅ Yes (0.1 FTE) | CI/CD integration, deployment | 8h |
| **QA Engineer** | ✅ Yes (0.5 FTE) | Automated + manual testing | 24h |
| **Accessibility Specialist** | ✅ Yes (0.3 FTE) | WCAG audit, screen reader testing | 12h |

**Total Team**: 5 developers (various capacities), 184 hours total

#### 6.2 Technical Planning Meeting
**Duration**: 60 minutes
**Attendees**:
- Solution Architect (leads)
- Unity Developer
- Frontend Developer
- Backend Developer
- Game Designer (provides context)
- PM (facilitates)

**Agenda**:
```
0:00-0:10  Context: Game concept, clinical requirements
0:10-0:30  Technical discussion
           - Unity Dev: Approach for scenario system, AAC integration
           - Frontend Dev: Web embedding, responsive design
           - Backend Dev: Data schema, API endpoints
0:30-0:50  Risk discussion, dependencies, timeline
0:50-1:00  Finalize technical plan, commit to timeline
```

#### 6.3 Technical Plan Document

**Format**: Markdown document in repo

```markdown
# Technical Plan: Emotion Recognition Game

## Architecture Overview

### Unity Game (WebGL + Mobile)
- **Engine**: Unity 2022.3 LTS
- **Platform**: WebGL (primary), iOS, Android
- **Size**: Target <50MB download

### Backend API
- **Endpoints**:
  - POST /api/sessions/start
  - POST /api/sessions/:id/events (emotion selection logged)
  - POST /api/sessions/:id/complete
  - GET /api/skills/ablls-c1-c5 (fetch skill details)

### Frontend Integration
- **Embedding**: iframe in React app
- **Communication**: PostMessage API (Unity ↔ React)
- **Responsive**: Adapts to mobile/tablet/desktop

## Development Timeline

| Phase | Duration | Owner | Deliverable |
|-------|----------|-------|-------------|
| **Week 1: Foundation** | 3 days | Unity Dev | Scenario system prototype, 2 scenarios playable |
| **Week 1: Backend** | 2 days | Backend Dev | API endpoints, data schema |
| **Week 2: Full Build** | 5 days | Unity Dev | All 20 scenarios, AAC integration, difficulty progression |
| **Week 2: Frontend** | 3 days | Frontend Dev | Web embedding, UI polish |
| **Week 3: Testing** | 3 days | QA | Automated tests, manual QA, accessibility audit |
| **Week 3: Fixes** | 2 days | All | Bug fixes from QA |

**Total**: 18 days (3.6 weeks)

## Technical Specifications

### Scenario Data Structure
```typescript
interface EmotionScenario {
  id: string;
  difficultyLevel: number; // 1-5
  scenarioText: string; // "Alex's birthday party"
  imageUrl: string; // S3 path to scenario illustration
  correctEmotion: 'happy' | 'sad' | 'angry' | 'scared' | 'surprised';
  distractorEmotions: string[]; // Wrong options
  aacSymbols: { [emotion: string]: string }; // Paths to AAC symbols
  altText: string; // Screen reader description
}
```

### Performance Budget
- Load time: <3 seconds
- Frame rate: 60fps minimum
- Memory: <150MB RAM usage
- Network: <5MB of images loaded per session

## Risks & Mitigations
1. **AAC SDK breaking changes**
   - Mitigation: Prototype AAC integration in Week 1, fallback ready

2. **AI-generated scenario images inconsistent**
   - Mitigation: Review all AI images before integration, regenerate if needed

3. **Screen reader performance with many scenarios**
   - Mitigation: Lazy-load scenarios, test with NVDA in Week 2

## Sign-Off
- [ ] Solution Architect: Marcus Lee
- [ ] Unity Developer: [Name]
- [ ] Frontend Developer: [Name]
- [ ] Backend Developer: [Name]
- [ ] PM: [Name]
```

**Output**: **Technical Plan Approved** → Ready for Step 7

---

## STEP 7: RESOURCE SPECIFICATION (Graphics/Audio/Animation)

### Objective
Define all visual, audio, and animation assets needed based on technical plan. Create detailed specifications for AI-assisted generation.

### Process

#### 7.1 Asset Inventory
**Actor**: Game Designer + Unity Developer

**Deliverable**: Asset Specification Spreadsheet

**Example (Emotion Recognition Game)**:

| Asset ID | Type | Description | Quantity | Specs | Generation Method | Owner | Status |
|----------|------|-------------|----------|-------|-------------------|-------|--------|
| **SCENARIOS** |
| SCEN-001 | Image | Birthday party scene | 1 | 1024x768, PNG, diverse children | AI (DALL-E 3) | AI Resource Team | Not Started |
| SCEN-002 | Image | Broken toy scene | 1 | 1024x768, PNG, child + toy | AI (DALL-E 3) | AI Resource Team | Not Started |
| SCEN-003 | Image | First day of school | 1 | 1024x768, PNG, school setting | AI (DALL-E 3) | AI Resource Team | Not Started |
| ... | ... | (20 total scenarios) | 20 | | | | |
| **EMOTION ICONS** |
| ICON-001 | Image | Happy face icon | 1 | 256x256, PNG, simple | AI (Midjourney) | AI Resource Team | Not Started |
| ICON-002 | Image | Sad face icon | 1 | 256x256, PNG, simple | AI (Midjourney) | AI Resource Team | Not Started |
| ICON-003 | Image | Angry face icon | 1 | 256x256, PNG, simple | AI (Midjourney) | AI Resource Team | Not Started |
| ICON-004 | Image | Scared face icon | 1 | 256x256, PNG, simple | AI (Midjourney) | AI Resource Team | Not Started |
| ICON-005 | Image | Surprised face icon | 1 | 256x256, PNG, simple | AI (Midjourney) | AI Resource Team | Not Started |
| **AAC SYMBOLS** |
| AAC-001 | Image | PCS-style "happy" symbol | 1 | 256x256, PNG, PCS library | Manual (licensed) | Sound Designer | Not Started |
| AAC-002 | Image | PCS-style "sad" symbol | 1 | 256x256, PNG, PCS library | Manual (licensed) | Sound Designer | Not Started |
| ... | ... | (5 emotions) | 5 | | | | |
| **AUDIO - VOICE OVERS** |
| VO-001 | Audio | "Welcome to Emotion Recognition!" | 1 | WAV 48kHz, English, female | Voice Actor Recording | Sound Designer | Not Started |
| VO-002 | Audio | "How does Alex feel?" | 1 | WAV 48kHz, English, female | Voice Actor Recording | Sound Designer | Not Started |
| VO-003 | Audio | "That's right! Alex is happy!" | 1 | WAV 48kHz, English, female | Voice Actor Recording | Sound Designer | Not Started |
| ... | ... | (15 total lines) | 15 | | | | |
| **AUDIO - SOUND EFFECTS** |
| SFX-001 | Audio | Correct selection "ding" | 1 | WAV 48kHz, 0.5s | AI (ElevenLabs) | AI Resource Team | Not Started |
| SFX-002 | Audio | Incorrect selection "boop" | 1 | WAV 48kHz, 0.3s | AI (ElevenLabs) | AI Resource Team | Not Started |
| SFX-003 | Audio | Level complete fanfare | 1 | WAV 48kHz, 2s | AI (ElevenLabs) | AI Resource Team | Not Started |
| **UI ELEMENTS** |
| UI-001 | Image | Progress bar | 1 | SVG vector | Manual (Figma) | Frontend Dev | Not Started |
| UI-002 | Image | Settings icon | 1 | SVG vector | Manual (Figma) | Frontend Dev | Not Started |
| UI-003 | Image | Help icon | 1 | SVG vector | Manual (Figma) | Frontend Dev | Not Started |
| **BACKGROUND** |
| BG-001 | Image | Game background (calm theme) | 1 | 1920x1080, PNG | AI (Stable Diffusion) | AI Resource Team | Not Started |

**Total Assets**: 50+ items (20 scenarios, 5 icons, 5 AAC, 15 voice, 5 SFX, 5 UI)

#### 7.2 Detailed Asset Specifications

**Example: Scenario Image Specification**

```yaml
asset_id: SCEN-001
type: scenario_illustration
title: "Birthday Party - Happy"
description: |
  Illustration showing a child's birthday party. The child (Alex,
  gender-neutral, age 5-6, medium skin tone) is in the center with a
  birthday cake in front of them. Balloons, streamers, and 2-3 friends
  visible in background. Alex's expression should clearly convey happiness
  (big smile, eyes crinkled, open posture).

generation_method: AI (DALL-E 3 via OpenAI API)
prompt: |
  "Cheerful children's book illustration of a diverse 6-year-old child's
  birthday party. The birthday child (gender-neutral, medium brown skin,
  curly hair) sits at a table with a cake and lit candles, smiling widely
  with eyes crinkled in joy. Colorful balloons and streamers decorate the
  room. 2-3 diverse friends in background also smiling. Warm, inviting
  atmosphere. Soft, rounded art style. High contrast colors for accessibility.
  No text in image."

style: "children's book illustration, soft edges, warm colors, high contrast"
negative_prompt: "realistic, photograph, scary, dark, text, words"
dimensions: 1024x768
format: PNG
color_space: sRGB
file_size_target: <500KB

accessibility_requirements:
  - alt_text: "A child sits at a table with a birthday cake and candles, smiling happily. Balloons and streamers decorate the room. Friends stand nearby also smiling."
  - contrast_ratio: ≥3:1 (UI elements), ≥4.5:1 (text if any)
  - colorblind_safe: Yes (no red-green only distinctions)

validation_criteria:
  - Emotion clearly recognizable (happy)
  - Culturally neutral scenario (birthday universal)
  - Diverse representation
  - Age-appropriate (not too childish, not too mature)
  - No distracting details

approval_required:
  - Game Designer: Visual style consistency
  - BCBA: Emotion clarity
  - Child Psychologist: Age-appropriateness
  - Accessibility Specialist: Contrast/clarity

estimated_generation_time: 5 minutes (AI) + 10 minutes (review)
regeneration_budget: Up to 3 attempts if initial doesn't meet criteria
```

**All 50+ assets get similar detailed specs**

**Output**: **Complete Asset Specification Document** → Ready for Step 8

---

## STEP 8: AI-ASSISTED RESOURCE GENERATION

### Objective
Expert team with access to AI APIs generates all specified assets at scale, efficiently, and cost-effectively.

### 8.1 AI Resource Generation Team

**Role Definition**: **AI Resource Specialists**

**Do we have this role?** → **SHOULD CREATE THIS ROLE**

**Team Structure**:
- **AI Asset Coordinator** (1 person, full-time)
  - Manages asset generation pipeline
  - Reviews all AI outputs for quality
  - Iterates on prompts until assets meet specs

- **AI Prompt Engineers** (2-3 people, part-time)
  - Specialized in DALL-E 3, Midjourney, Stable Diffusion prompts
  - Create optimal prompts for each asset type
  - Test and refine prompts

- **Voice Recording Specialist** (1 person, contractor)
  - Records voice-overs (AI can't match human quality yet for narration)
  - Processes audio files (normalize, compress)

**API Access Required**:
- OpenAI API (DALL-E 3 for images, Whisper for audio processing)
- ElevenLabs API (for sound effects, ambient audio)
- Midjourney API (for stylized illustrations)
- Stable Diffusion (local instance for high-volume generation)

### 8.2 Asset Generation Workflow

```
┌──────────────────────────────────────────────┐
│   INPUT: Asset Specification Spreadsheet     │
└──────────────────┬───────────────────────────┘
                   ↓
         ┌─────────────────────┐
         │ AI Prompt Engineer  │
         │ Reads spec → Creates│
         │ optimized AI prompt │
         └──────────┬──────────┘
                    ↓
         ┌─────────────────────┐
         │   AI API Call       │
         │ (DALL-E 3, etc.)    │
         │ Generates asset     │
         └──────────┬──────────┘
                    ↓
         ┌─────────────────────┐
         │ AI Asset Coordinator│
         │ Reviews output      │
         └──────────┬──────────┘
                    ↓
            ┌───────┴───────┐
            │ Meets specs?  │
            └───┬───────┬───┘
               NO      YES
                │       │
        ┌───────┘       └───────┐
        │                       │
  Refine prompt         Approve & archive
  → Regenerate          (S3 bucket)
        │                       │
        └───────┐       ┌───────┘
                ↓       ↓
         ┌──────────────────────┐
         │ Update spreadsheet:  │
         │ Status: "Generated"  │
         │ URL: s3://...        │
         └──────────┬───────────┘
                    ↓
            Repeat for all assets
                    ↓
         ┌──────────────────────┐
         │ All assets complete  │
         │ → Notify PM          │
         └──────────────────────┘
```

### 8.3 Asset Generation Scripts (Automation)

**Example: Automated DALL-E 3 Generation**

```python
# asset_generator.py
import openai
import csv
import boto3
import time

# Initialize API clients
openai.api_key = os.getenv("OPENAI_API_KEY")
s3_client = boto3.client('s3')

def generate_scenario_image(asset_spec):
    """Generate scenario illustration via DALL-E 3"""

    prompt = asset_spec['prompt']
    negative_prompt = asset_spec['negative_prompt']
    dimensions = asset_spec['dimensions']  # e.g., "1024x768"

    try:
        # Call DALL-E 3 API
        response = openai.Image.create(
            model="dall-e-3",
            prompt=prompt,
            n=1,  # Generate 1 image
            size=dimensions,
            quality="hd",  # High quality for game assets
            style="natural"  # vs "vivid" - more consistent
        )

        image_url = response['data'][0]['url']

        # Download image
        image_data = requests.get(image_url).content

        # Upload to S3
        s3_key = f"games/emotion-recognition/scenarios/{asset_spec['asset_id']}.png"
        s3_client.put_object(
            Bucket='skillbridge-game-assets',
            Key=s3_key,
            Body=image_data,
            ContentType='image/png'
        )

        s3_url = f"https://skillbridge-game-assets.s3.amazonaws.com/{s3_key}"

        return {
            'status': 'success',
            'url': s3_url,
            'generation_time': time.time()
        }

    except Exception as e:
        return {
            'status': 'error',
            'error': str(e)
        }

def process_asset_spreadsheet(csv_file):
    """Process entire asset spec spreadsheet"""

    with open(csv_file, 'r') as f:
        reader = csv.DictReader(f)
        assets = list(reader)

    results = []

    for asset in assets:
        if asset['generation_method'] == 'AI (DALL-E 3)':
            print(f"Generating {asset['asset_id']}...")

            result = generate_scenario_image(asset)
            results.append({
                'asset_id': asset['asset_id'],
                **result
            })

            # Update spreadsheet
            asset['status'] = result['status']
            asset['url'] = result.get('url', '')

            # Rate limit: DALL-E 3 has 5 images/min limit
            time.sleep(12)  # 12 seconds between images = 5/min

    # Write updated spreadsheet
    with open(csv_file, 'w') as f:
        writer = csv.DictWriter(f, fieldnames=assets[0].keys())
        writer.writeheader()
        writer.writerows(assets)

    print(f"✅ Generated {len(results)} assets")
    return results

if __name__ == "__main__":
    process_asset_spreadsheet('emotion_recognition_assets.csv')
```

**Runtime**: 20 scenarios × 12 seconds = 4 minutes (parallelizable to 1-2 minutes with multiple API keys)

### 8.4 Quality Review Process

**All AI-generated assets reviewed by**:
1. **AI Asset Coordinator**: Technical quality (resolution, format, file size)
2. **Game Designer**: Visual consistency, style matching
3. **Relevant Clinical Expert**: Content accuracy
   - BCBA reviews scenarios for emotional clarity
   - Child Psychologist reviews emotional expressions
4. **Accessibility Specialist**: Contrast ratios, colorblind safety

**Approval Threshold**: 4/4 reviewers approve, or asset regenerated

**Regeneration Budget**: Up to 3 attempts per asset (95% success rate by attempt 3)

### 8.5 Asset Delivery Package

**Output**: Organized S3 bucket structure

```
s3://skillbridge-game-assets/games/emotion-recognition/
├── scenarios/
│   ├── SCEN-001.png (1024x768, 450KB)
│   ├── SCEN-002.png
│   ├── ... (20 total)
├── icons/
│   ├── ICON-001-happy.png (256x256, 80KB)
│   ├── ICON-002-sad.png
│   ├── ... (5 total)
├── aac_symbols/
│   ├── AAC-001-happy.png (PCS licensed)
│   ├── ... (5 total)
├── audio/
│   ├── voice_overs/
│   │   ├── VO-001-welcome.wav (48kHz, 2MB)
│   │   ├── ... (15 total)
│   └── sfx/
│       ├── SFX-001-correct.wav
│       ├── ... (5 total)
└── manifest.json (metadata for all assets)
```

**Manifest Example**:
```json
{
  "game_id": "emotion_recognition",
  "asset_version": "1.0.0",
  "generated_date": "2025-10-15T10:30:00Z",
  "total_assets": 50,
  "assets": [
    {
      "asset_id": "SCEN-001",
      "type": "scenario_image",
      "url": "https://skillbridge-game-assets.s3.amazonaws.com/games/emotion-recognition/scenarios/SCEN-001.png",
      "size_bytes": 460800,
      "dimensions": "1024x768",
      "format": "PNG",
      "generated_by": "DALL-E 3",
      "approved_by": ["Game Designer", "BCBA", "Accessibility"],
      "alt_text": "A child sits at a table with a birthday cake..."
    },
    ...
  ]
}
```

**PM Notification**: Email sent when all 50 assets generated & approved (typically 1-2 days)

**Output**: **Assets Ready for Development** → Proceed to Step 9

---

## STEP 9: RESOURCE HANDOFF TO DEVELOPMENT

### Objective
Project Manager receives approved assets, organizes them, and hands off to Senior Developer with clear instructions.

### Process

#### 9.1 PM Asset Review
**Actor**: Project Manager

**Checklist**:
- ☐ All assets in spreadsheet have "Generated" status
- ☐ S3 bucket structure organized correctly
- ☐ Manifest.json present and valid
- ☐ All assets approved by required reviewers
- ☐ File sizes within budget (<500KB images, <2MB audio)
- ☐ Asset count matches specification (50 items)

**If any missing/rejected**: Loop back to AI Resource Team for completion

#### 9.2 Developer Handoff Package

**PM creates Developer Handoff Document**:

```markdown
# Developer Handoff: Emotion Recognition Game

## Assets Ready
✅ All 50 assets generated and approved
✅ S3 bucket: s3://skillbridge-game-assets/games/emotion-recognition/
✅ Manifest: https://skillbridge-game-assets.s3.amazonaws.com/games/emotion-recognition/manifest.json

## Technical Plan
📄 See: `docs/technical_plans/emotion_recognition_tech_plan.md`

## Game Design Document
📄 See: `docs/game_designs/emotion_recognition_gdd.md`

## Development Instructions
1. Clone repo: `git clone ...`
2. Create feature branch: `git checkout -b feature/emotion-recognition-game`
3. Import assets from S3 (script provided: `scripts/import_assets.sh emotion-recognition`)
4. Follow technical plan implementation steps
5. Commit frequently with clear messages
6. Create PR when prototype ready (Week 1, Day 3)
7. Create PR when full build ready (Week 2, Day 5)

## Asset Integration Guide
- **Scenarios**: Import to `Assets/Games/EmotionRecognition/Scenarios/`
- **Icons**: Import to `Assets/Games/EmotionRecognition/UI/Icons/`
- **Audio**: Import to `Assets/Games/EmotionRecognition/Audio/`
- **AAC Symbols**: Import to `Assets/Shared/AAC/Symbols/`

## Testing Requirements (Step 11)
- Automated tests must pass: `npm run test:emotion-recognition`
- Hard constraints enforced (see Step 11 details)
- Manual QA checklist (20 items)

## Timeline
- **Week 1**: Foundation + Prototype
- **Week 2**: Full build + Polish
- **Week 3**: Testing + Fixes
- **Target Launch**: Week 4 (after Step 12 expert re-assessment)

## Questions?
Slack: #game-dev-emotion-recognition
PM: marcus.lee@skillbridge.com
Tech Lead: [senior.dev@skillbridge.com]

## Ready to Start!
All assets, docs, and requirements provided. Let's build an amazing emotion recognition game! 🎮
```

#### 9.3 Developer Acknowledgment
**Senior Developer**:
1. Reviews handoff document
2. Confirms all assets accessible
3. Asks clarifying questions (if any)
4. Acknowledges readiness to start development
5. Estimated timeline confirmed

**PM Updates Project Board**: Move task from "Assets Ready" → "In Development"

**Output**: **Development Kickoff** → Proceed to Step 10

---

## STEP 10: GAME DEVELOPMENT (Unity Implementation)

### Objective
Senior Developer builds the complete game in Unity according to technical plan and GDD.

### Process

#### 10.1 Development Phases

**Week 1: Foundation (Days 1-3)**
- Set up Unity project structure
- Import all assets from S3
- Implement scenario data model
- Build scenario display system (1 scenario playable)
- Implement emotion selection UI (buttons for 4 emotions)
- Basic correct/incorrect feedback
- **Deliverable**: Prototype (2 scenarios functional)

**Week 2: Full Build (Days 4-8)**
- Implement all 20 scenarios with difficulty progression
- Add AAC symbol integration (Proloquo2Go SDK)
- Implement prompting system (4 levels)
- Add celebration animations
- Implement progress tracking (accuracy, time, prompts)
- Backend API integration (session logging)
- Sensory profile switching (Calm/Energetic/Focused)
- Screen reader support (ARIA labels, semantic HTML for WebGL)
- **Deliverable**: Alpha Build (all features, needs QA)

**Week 3: Polish & Fixes (Days 9-12)**
- QA bug fixes (from Step 11)
- Performance optimization (60fps, <3s load)
- Accessibility improvements (from audit)
- Final polish (animations, transitions, audio balancing)
- **Deliverable**: Beta Build (ready for expert re-assessment, Step 12)

#### 10.2 Development Best Practices

**Code Quality**:
- Follow C# coding standards
- Comment complex logic
- Use meaningful variable names
- No hardcoded values (use ScriptableObjects for config)

**Version Control**:
- Commit daily with clear messages: "feat: Add scenario selection UI"
- Create PRs for major milestones (prototype, alpha, beta)
- Tag releases: `v0.1.0-prototype`, `v0.2.0-alpha`, `v1.0.0-beta`

**Testing During Development**:
- Unit tests for game logic (scenario selection, scoring)
- Manual testing on multiple devices (Windows, Mac, iOS simulator, Android emulator)
- Accessibility testing with screen reader (NVDA) on day 5

#### 10.3 Daily Standup (Async Updates)

**Developer posts daily update in Slack**:

```
📅 Day 5 Update: Emotion Recognition Game

✅ Completed:
- All 20 scenarios imported and displaying correctly
- Emotion selection UI with AAC symbols functional
- Basic prompting system (levels 1-3) implemented

🚧 In Progress:
- Integrating Proloquo2Go SDK (hit API auth issue, troubleshooting)
- Backend session logging (endpoints work, testing error handling)

⏭️ Next:
- Finish AAC integration (EOD today)
- Start sensory profile switching (tomorrow)
- Aim for alpha build by end of Week 2 ✅

🚨 Blockers:
- Proloquo2Go SDK docs unclear on authentication flow
  → Solution: Contacted their support, waiting for response
  → Backup: Manual symbol library ready if SDK doesn't work by Day 7

Timeline: On track for Week 2 alpha delivery 🎯
```

#### 10.4 Code Review

**PR Review Process**:
1. Developer creates PR: "Alpha Build - All features implemented"
2. Tech Lead reviews code (architecture, quality, performance)
3. QA Engineer does smoke test (basic functionality)
4. Accessibility Specialist spot-checks (if major a11y changes)
5. Approval requires 2/3 reviewers (Tech Lead + one other)

**Merge to `develop` branch once approved**

**Output**: **Beta Build Ready** → Proceed to Step 11 (Testing)

---

## STEP 11: AUTOMATED TESTING + HARD CONSTRAINT VALIDATION

### Objective
Comprehensive automated testing enforces non-negotiable quality standards. Manual QA catches edge cases.

### Process

#### 11.1 Automated Test Suite

**Test Categories**:
1. **Unit Tests** (Jest for TypeScript, NUnit for C#)
2. **Integration Tests** (API endpoints, Unity ↔ Backend)
3. **E2E Tests** (Playwright for WebGL gameplay)
4. **Accessibility Tests** (axe-core, Pa11y)
5. **Performance Tests** (Load time, FPS, memory)
6. **Hard Constraint Validation** (Custom test suite)

#### 11.2 Hard Constraint Test Suite

**What are "Hard Constraints"?**
Non-negotiable requirements that MUST pass for game to ship. If any fail, game blocked from proceeding to Step 12.

**Constraint Definition File** (`tests/hard_constraints.yml`):

```yaml
game_id: emotion_recognition
version: 1.0.0-beta
hard_constraints:

  # CLINICAL CONSTRAINTS
  - id: HC-001
    name: Skill Mapping Accuracy
    description: "All scenarios map to correct ABLLS-R C1-C5 skills"
    test: validate_skill_mapping()
    pass_criteria: 100% of scenarios have correct skill_id
    fail_consequence: BLOCKER - cannot proceed

  - id: HC-002
    name: Emotion Labels Correct
    description: "All emotion labels clinically accurate"
    test: validate_emotion_labels()
    pass_criteria: 100% match to clinical definitions
    fail_consequence: BLOCKER

  # ACCESSIBILITY CONSTRAINTS
  - id: HC-010
    name: WCAG 2.1 AA Compliance
    description: "Zero WCAG AA violations"
    test: run_axe_audit()
    pass_criteria: 0 violations
    fail_consequence: BLOCKER

  - id: HC-011
    name: Screen Reader Compatibility
    description: "All scenarios, buttons, feedback screen-reader accessible"
    test: test_screen_reader_navigation()
    pass_criteria: 100% elements have ARIA labels, semantic HTML
    fail_consequence: BLOCKER

  - id: HC-012
    name: Keyboard Navigation
    description: "Entire game playable with keyboard only"
    test: test_keyboard_only_gameplay()
    pass_criteria: Can complete 3 scenarios without mouse
    fail_consequence: BLOCKER

  # PERFORMANCE CONSTRAINTS
  - id: HC-020
    name: Load Time
    description: "Game loads in <3 seconds on mid-tier device"
    test: measure_load_time()
    pass_criteria: p95 load time < 3000ms
    fail_consequence: BLOCKER

  - id: HC-021
    name: Frame Rate
    description: "Maintains 60fps during gameplay"
    test: measure_fps()
    pass_criteria: p95 FPS ≥ 58 (allow 2fps drop tolerance)
    fail_consequence: WARNING (not blocker, but should fix)

  - id: HC-022
    name: Memory Usage
    description: "RAM usage stays under 200MB"
    test: measure_memory()
    pass_criteria: Peak memory < 200MB
    fail_consequence: BLOCKER

  # DATA INTEGRITY CONSTRAINTS
  - id: HC-030
    name: Session Data Logging
    description: "All gameplay events logged to backend"
    test: validate_session_logging()
    pass_criteria: 100% of events (start, selection, complete) reach API
    fail_consequence: BLOCKER - broken analytics

  - id: HC-031
    name: Data Schema Compliance
    description: "Session data matches backend schema"
    test: validate_data_schema()
    pass_criteria: 100% API calls conform to schema
    fail_consequence: BLOCKER

  # SAFETY CONSTRAINTS
  - id: HC-040
    name: No Flashing Content
    description: "No seizure-inducing flashing (WCAG 2.3.1)"
    test: detect_flashing_content()
    pass_criteria: 0 instances of >3 flashes/second
    fail_consequence: BLOCKER - safety violation

  - id: HC-041
    name: Volume Limits
    description: "Audio never exceeds safe levels"
    test: measure_audio_levels()
    pass_criteria: Max volume < 85dB equivalent
    fail_consequence: BLOCKER - safety violation

  # FUNCTIONAL CONSTRAINTS
  - id: HC-050
    name: All Scenarios Playable
    description: "No broken scenarios (missing images, audio, logic errors)"
    test: test_all_scenarios()
    pass_criteria: 20/20 scenarios complete successfully
    fail_consequence: BLOCKER

  - id: HC-051
    name: Prompting System Functional
    description: "All 4 prompt levels trigger correctly"
    test: test_prompting_system()
    pass_criteria: 100% of prompt conditions trigger expected behavior
    fail_consequence: BLOCKER - affects learning effectiveness

  - id: HC-052
    name: AAC Integration Works
    description: "AAC symbols display and function correctly"
    test: test_aac_integration()
    pass_criteria: 100% of scenarios show AAC symbols, tappable
    fail_consequence: BLOCKER - affects 30% of users (non-verbal)
```

#### 11.3 Running Hard Constraint Tests

**Automated CI/CD Pipeline** (GitHub Actions):

```yaml
# .github/workflows/hard-constraints.yml
name: Hard Constraint Validation

on:
  pull_request:
    branches: [develop, main]
  push:
    branches: [develop]

jobs:
  hard-constraints:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run Hard Constraint Tests
        run: npm run test:hard-constraints

      - name: Generate Report
        run: npm run test:report

      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: hard-constraints-report
          path: test-results/hard-constraints-report.html

      - name: Check for Blockers
        run: |
          if grep -q "BLOCKER.*FAIL" test-results/summary.txt; then
            echo "❌ BLOCKER constraints failed. Cannot proceed."
            exit 1
          fi

      - name: Post Results to Slack
        if: always()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Hard Constraint Test Results",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "${{ job.status == 'success' && '✅ All hard constraints PASSED' || '❌ BLOCKER constraints FAILED' }}"
                  }
                }
              ]
            }
```

**Test Execution**:
```bash
$ npm run test:hard-constraints

Running Hard Constraint Validation Suite...
Game: Emotion Recognition (v1.0.0-beta)

✅ HC-001: Skill Mapping Accuracy - PASS (20/20 scenarios correct)
✅ HC-002: Emotion Labels Correct - PASS (5/5 emotions validated)
✅ HC-010: WCAG 2.1 AA Compliance - PASS (0 violations detected)
✅ HC-011: Screen Reader Compatibility - PASS (100% ARIA coverage)
✅ HC-012: Keyboard Navigation - PASS (completed 3/3 test scenarios)
✅ HC-020: Load Time - PASS (p95: 2.4s < 3.0s threshold)
⚠️  HC-021: Frame Rate - WARNING (p95: 56fps, below 58fps target)
✅ HC-022: Memory Usage - PASS (Peak: 187MB < 200MB)
✅ HC-030: Session Data Logging - PASS (100% events logged)
✅ HC-031: Data Schema Compliance - PASS (100% schema valid)
✅ HC-040: No Flashing Content - PASS (0 instances detected)
✅ HC-041: Volume Limits - PASS (Max: 78dB < 85dB)
✅ HC-050: All Scenarios Playable - PASS (20/20 completed)
✅ HC-051: Prompting System Functional - PASS (4/4 levels working)
❌ HC-052: AAC Integration Works - FAIL (2/20 scenarios missing AAC symbols)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY:
  Total Constraints: 15
  Passed: 13
  Warnings: 1 (non-blocking)
  FAILED (BLOCKERS): 1

⛔ CANNOT PROCEED TO STEP 12

Blocking Issues:
  1. HC-052: AAC Integration Works
     - Scenarios SCEN-015, SCEN-018 missing AAC symbols
     - Fix: Add AAC-001 through AAC-005 to these scenarios
     - Estimated Fix Time: 30 minutes

Action Required: Fix blocking issues, re-run tests until 0 blockers.
```

**Developer fixes AAC symbols → Re-runs tests → All pass → Proceed**

#### 11.4 Manual QA Checklist

**While automated tests run, QA Engineer performs manual testing**:

```markdown
# Manual QA Checklist: Emotion Recognition Game

## Functionality (20 items)
- [ ] 1. Game loads without errors
- [ ] 2. All 20 scenarios display correctly
- [ ] 3. Emotion buttons respond to touch/click
- [ ] 4. Correct selections trigger celebration
- [ ] 5. Incorrect selections give gentle feedback
- [ ] 6. Prompting system activates after errors
- [ ] 7. AAC symbols visible and tappable
- [ ] 8. Sensory profile switching works (Calm/Energetic/Focused)
- [ ] 9. Progress bar updates correctly
- [ ] 10. Level progression increases difficulty
- [ ] 11. Session data uploads to backend
- [ ] 12. Parent dashboard shows results
- [ ] 13. Audio plays correctly (voice, SFX)
- [ ] 14. Volume controls work
- [ ] 15. Pause button functional
- [ ] 16. Settings panel accessible
- [ ] 17. Help button shows instructions
- [ ] 18. Exit button returns to main menu
- [ ] 19. Game state saves on exit
- [ ] 20. Resume game restores state correctly

## Cross-Device Testing
- [ ] Windows 10 (Chrome, Firefox, Edge)
- [ ] macOS (Safari, Chrome)
- [ ] iPad (Safari)
- [ ] iPhone (Safari)
- [ ] Android tablet (Chrome)
- [ ] Android phone (Chrome)

## Edge Cases
- [ ] Rapid button tapping (no double-counting)
- [ ] Background app (does game pause?)
- [ ] Network disconnection (session saves locally?)
- [ ] Low memory device (Android 4GB RAM)
- [ ] Slow network (3G simulation)

## Accessibility
- [ ] Screen reader announces all content (NVDA on Windows)
- [ ] Keyboard-only gameplay (no mouse)
- [ ] High contrast mode functional
- [ ] Colorblind mode (test with simulator)
- [ ] Touch targets ≥44px

## Performance
- [ ] Load time <3 seconds (Lighthouse)
- [ ] Smooth animations (no stuttering)
- [ ] Memory leak check (play 30 minutes, check RAM)

---

✅ 28/30 Pass | ⚠️ 2 Minor Issues

Issues Found:
1. Minor: Scenario 12 audio slightly louder than others
   - Severity: Low (not a blocker, but should normalize)
   - Fix: Adjust audio level in Unity AudioSource
   - Estimated: 15 minutes

2. Minor: On slow 3G, loading spinner doesn't show
   - Severity: Low (functional, but UX issue)
   - Fix: Show spinner immediately while assets load
   - Estimated: 30 minutes

Recommendation: Fix 2 minor issues, then APPROVE for Step 12
```

**QA Engineer creates GitHub issues for minor bugs**
**Developer fixes, QA re-tests, approves**

**Output**: **All Tests Passed** → Ready for Step 12 (Expert Re-Assessment)

---

## STEP 12: EXPERT RE-ASSESSMENT + ITERATION LOOP

### Objective
Autism clinical experts play the fully-built game, validate it matches their original design intent, identify any needed changes. Changes loop back to PM → developer → re-test until game is mature and approved.

### Process

#### 12.1 Expert Playtest

**Who Tests**: Same experts from Step 4 (BCBA, SLP, Psychologist, Advocate)

**Testing Protocol**:
1. **Blind Playtest** (no instructions, simulates parent/child experience)
   - Expert tries to play game without manual
   - Notes any confusion, unclear instructions
2. **Functional Playtest** (with instructions)
   - Expert plays all 20 scenarios
   - Tests prompting system by intentionally making errors
   - Tries different sensory profiles
   - Tests AAC integration (if AAC user)
3. **Data Review Playtest**
   - Expert completes 1 full session
   - Reviews their own session data in parent dashboard
   - Validates data accuracy (did it track correctly?)

**Time per Expert**: 60-90 minutes

#### 12.2 Expert Re-Assessment Form

**Each expert completes digital form**:

```markdown
# Expert Re-Assessment: Emotion Recognition Game (Beta Build)

Expert: Dr. Emily Foster, BCBA-D
Date: October 25, 2025

## Section 1: Design Intent Validation

Q1: Does the implemented game match the approved design concept from Step 4?
[X] Yes, fully matches
[ ] Mostly matches, minor deviations
[ ] Significant deviations from design
[ ] No, major redesign needed

Comments:
"Excellent implementation. The emotion scenarios are clear, the prompting
system works exactly as designed, and the feedback is appropriately
non-punitive."

## Section 2: Clinical Effectiveness

Q2: Will this game effectively teach the target skills (ABLLS-R C1-C5)?
[X] Yes, high confidence
[ ] Likely, medium confidence
[ ] Uncertain, needs modifications
[ ] No, will not teach skills effectively

Q3: Is the difficulty progression appropriate?
[X] Yes, well-balanced
[ ] Too easy (needs adjustment)
[ ] Too hard (needs adjustment)
[ ] Uneven progression (some levels off)

Q4: Is the prompting system effective?
[X] Yes, errorless teaching works well
[ ] Needs adjustments (specify below)

## Section 3: Changes Needed

Q5: Required changes (game cannot launch without these):
[ ] No required changes ✅
[X] Yes, changes needed:

1. **Change ID**: REQ-001
   **Issue**: Scenario 15 (first day of school) shows child crying.
   This might be distressing for some children with school anxiety.
   **Recommendation**: Replace with less intense emotion (worried/nervous
   but not crying)
   **Severity**: High (could trigger anxiety)
   **Estimated Fix**: Regenerate 1 scenario image (30 min)

2. **Change ID**: REQ-002
   **Issue**: The "angry" emotion scenarios focus on aggressive anger
   (fists, yelling). Should also show "quiet anger" (frowning, crossed arms).
   **Recommendation**: Add 1-2 scenarios showing non-aggressive anger
   **Severity**: Medium (important for emotion diversity)
   **Estimated Fix**: Generate 2 new scenarios (1 hour)

Q6: Optional enhancements (nice-to-have, not blockers):
[X] Yes, suggestions:

1. **Enhancement ID**: OPT-001
   **Suggestion**: Add "emotion intensity" concept later (very happy vs
   a little happy)
   **Value**: Teaches nuance, more advanced skill
   **Priority**: Low (future version, not MVP)

## Section 4: Data Accuracy

Q7: Did the session data accurately reflect your gameplay?
[X] Yes, 100% accurate
[ ] Mostly accurate (minor issues)
[ ] Significant inaccuracies

Q8: Is the parent dashboard interpretable?
[X] Yes, clear and actionable
[ ] Somewhat clear (needs simplification)
[ ] Confusing (redesign needed)

## Section 5: Overall Approval

Q9: Overall rating (1-5):
Rating: [●●●●○] 4 / 5

Strengths:
- Clear emotion teaching
- Effective prompting
- Great accessibility features
- Data tracking comprehensive

Concerns:
- See REQ-001 and REQ-002 (required changes)

Q10: Approval Status:
[ ] APPROVED - Ready to launch
[X] APPROVED WITH CHANGES (required changes must be addressed)
[ ] MAJOR REVISION NEEDED (re-review required)
[ ] REJECTED

---

Estimated time to address required changes: 2 hours
After changes implemented, I request:
[X] Quick re-review (30 min playtest of changed scenarios only)
[ ] Full re-review (not necessary, trust dev team)

Digital Signature: Dr. Emily Foster, BCBA-D
Date/Time: 2025-10-25 14:30 PST
```

**All experts submit forms → PM aggregates**

#### 12.3 PM Change Aggregation

**PM creates Change Request Document**:

```markdown
# Change Requests: Emotion Recognition Game (Step 12 Re-Assessment)

## Summary
- **Total Experts**: 6 (BCBA, SLP, Psychologist, Advocate, Accessibility, Parent)
- **Approval Status**: 5/6 "Approved with Changes", 1/6 "Approved"
- **Required Changes**: 5 (from 4 experts)
- **Optional Enhancements**: 8 (tracked for future)

## Required Changes (Must Fix Before Launch)

### REQ-001: Replace Scenario 15 (Crying Child)
- **Source**: Dr. Foster (BCBA), Dr. Patel (Psychologist) ← 2 experts agree
- **Issue**: Distressing image for children with school anxiety
- **Fix**: Regenerate scenario with "worried" emotion (no tears)
- **Owner**: AI Resource Team → Senior Developer
- **Estimated Time**: 1 hour (regenerate + test)
- **Priority**: HIGH (safety concern)

### REQ-002: Add Non-Aggressive Anger Scenarios
- **Source**: Dr. Foster (BCBA), Alex K. (Autistic Advocate) ← 2 experts agree
- **Issue**: All anger scenarios show aggressive expressions
- **Fix**: Generate 2 new scenarios (quiet anger: frowning, crossed arms)
- **Owner**: AI Resource Team → Senior Developer
- **Estimated Time**: 2 hours (generate + integrate + test)
- **Priority**: MEDIUM (diversity of representation)

### REQ-003: AAC Symbol for "Surprised" Incorrect
- **Source**: Dr. Liu (SLP)
- **Issue**: AAC-005 (surprised symbol) uses old PCS version
- **Fix**: Update to current PCS library symbol
- **Owner**: AI Resource Team (manual replacement, licensed asset)
- **Estimated Time**: 30 minutes
- **Priority**: MEDIUM (affects AAC users)

### REQ-004: Screen Reader Skips Scenario 18 Description
- **Source**: Jamie Nguyen (Accessibility)
- **Issue**: ARIA label missing on scenario 18 image
- **Fix**: Add alt-text to SCEN-018 in Unity scene
- **Owner**: Senior Developer
- **Estimated Time**: 15 minutes
- **Priority**: HIGH (WCAG violation)

### REQ-005: Parent Dashboard Typo
- **Source**: Sarah M. (Parent Representative)
- **Issue**: "Accuraccy" instead of "Accuracy" in dashboard
- **Fix**: Correct typo in frontend React component
- **Owner**: Frontend Developer
- **Estimated Time**: 5 minutes
- **Priority**: LOW (cosmetic, but easy fix)

---

## Total Required Changes: 5
**Total Fix Time**: 4.5 hours (can be parallelized)

## Implementation Plan
1. PM assigns tasks to owners (GitHub issues created)
2. Developers fix issues in parallel (Day 1)
3. QA re-tests affected areas (Day 1 afternoon)
4. Hard constraint tests re-run (automated, 10 minutes)
5. Experts do quick re-review (30 min each, Day 2)
6. If all approve → LAUNCH! (Step 12 complete)

## Timeline
- **Day 1 (Today)**: Implement all 5 changes
- **Day 2 (Tomorrow)**: Expert re-review → Final approval
- **Day 3**: LAUNCH! 🚀
```

#### 12.4 Iteration Loop (Changes Back to PM)

```
┌────────────────────────────────────────┐
│ Step 12: Expert Re-Assessment Complete │
│ 5 Required Changes Identified          │
└────────────────┬───────────────────────┘
                 ↓
         ┌───────────────┐
         │ PM Creates    │
         │ Change Request│
         │ Document      │
         └───────┬───────┘
                 ↓
         ┌───────────────┐
         │ PM Assigns    │
         │ Tasks to      │
         │ Developers    │
         └───────┬───────┘
                 ↓
      ┌──────────────────────┐
      │ Developers Fix Issues │
      │ (Parallel work)       │
      └──────────┬────────────┘
                 ↓
         ┌───────────────┐
         │ QA Re-Tests   │
         │ Changed Areas │
         └───────┬───────┘
                 ↓
      ┌──────────────────────┐
      │ Hard Constraints     │
      │ Re-Run (Automated)   │
      └──────────┬───────────┘
                 ↓
           ┌─────┴─────┐
           │ All Pass? │
           └──┬──────┬─┘
             NO      YES
              │       │
      ┌───────┘       └───────┐
      │                       │
  Loop back to           Expert Quick
  Developers            Re-Review
  (Fix blockers)        (Changed areas only)
      │                       │
      └───────┐       ┌───────┘
              ↓       ↓
           ┌─────────────┐
           │ All Experts │
           │  Approve?   │
           └──┬──────┬───┘
             NO      YES
              │       │
      ┌───────┘       └───────┐
      │                       │
  Identify new           ✅ GAME APPROVED
  changes → Loop         Ready for Launch!
  back to PM                  │
                              ↓
                         PRODUCTION DEPLOY
```

#### 12.5 Expert Quick Re-Review

**After changes implemented, experts re-test only changed areas**:

**Example: BCBA Quick Re-Review**

```
Re-Review Protocol (30 minutes):
1. Play Scenario 15 (replaced image) → Verify no longer distressing
2. Play 2 new anger scenarios → Verify non-aggressive representation
3. Check session data → Verify scenarios logged correctly
4. Confirm: All my required changes (REQ-001, REQ-002) addressed

Result:
✅ REQ-001: RESOLVED (scenario 15 now shows worried child, not crying)
✅ REQ-002: RESOLVED (2 new anger scenarios show quiet anger appropriately)

Final Approval: ✅ APPROVED FOR LAUNCH

Signature: Dr. Emily Foster, BCBA-D
Date: 2025-10-26 16:45 PST
```

**All 6 experts complete quick re-review → All approve → GAME MATURE**

#### 12.6 Final Sign-Off

**PM collects all approvals**:

```markdown
# Final Approval Record: Emotion Recognition Game

Game ID: emotion_recognition
Version: 1.0.0-production
Launch Date: October 27, 2025

## Expert Approvals (6/6 Required)

✅ Dr. Emily Foster, BCBA-D (BCBA)
   - Approved: October 26, 2025 16:45 PST
   - Final Rating: 5/5
   - Clinical Attestation: Signed

✅ Dr. James Liu, CCC-SLP (SLP)
   - Approved: October 26, 2025 17:00 PST
   - Final Rating: 5/5
   - Clinical Attestation: Signed

✅ Dr. Maya Patel, PhD (Child Psychologist)
   - Approved: October 26, 2025 16:30 PST
   - Final Rating: 5/5
   - Clinical Attestation: Signed

✅ Alex Krishnan (Autistic Advocate)
   - Approved: October 26, 2025 18:00 PST
   - Final Rating: 4/5
   - Neurodiversity Review: Signed

✅ Jamie Nguyen, CPACC (Accessibility)
   - Approved: October 26, 2025 17:15 PST
   - WCAG 2.1 AA: 50/50 Pass
   - Accessibility Attestation: Signed

✅ Sarah Mitchell (Parent Representative)
   - Approved: October 26, 2025 19:00 PST
   - Usability Rating: 5/5
   - Parent Feedback: Signed

## Quality Gates (4/4 Passed)

✅ Gate 1: Design Approval (Step 4) - Passed Oct 18
✅ Gate 2: Prototype Validation (Step 4) - Passed Oct 20
✅ Gate 3: Accessibility Compliance (Step 11) - Passed Oct 25
✅ Gate 4: Expert Re-Assessment (Step 12) - Passed Oct 26

## Hard Constraints (15/15 Passed)

✅ All 15 hard constraints passed (Oct 26, 15:00 PST)
✅ Zero blockers identified
✅ Automated test suite: 100% pass rate

## PM Final Sign-Off

I, Marcus Lee (Senior Project Manager), confirm that:
- All 6 expert approvals received and verified
- All 4 quality gates passed
- All hard constraints validated
- All required changes from expert re-assessment implemented
- Game is clinically validated, accessible, and ready for production

Game Status: ✅ **APPROVED FOR PRODUCTION LAUNCH**

Signature: Marcus Lee, PM
Date: October 26, 2025 20:00 PST
```

**PM clicks "Deploy to Production" button → Game goes live!**

**Output**: **GAME LAUNCHED** 🎉

---

## ITERATION EXAMPLES

### Iteration 1: Minor Changes (1-2 hours)
**Scenario**: BCBA requests 2 scenario images replaced

**Loop**:
1. Expert identifies issue → PM (Step 12)
2. PM assigns to AI Resource Team (Step 8)
3. AI team regenerates 2 images (30 min)
4. Senior Developer integrates new images (15 min)
5. QA re-tests scenarios (15 min)
6. BCBA quick re-review (15 min) → Approves

**Timeline**: Same day (2 hours)

---

### Iteration 2: Moderate Changes (1 day)
**Scenario**: SLP identifies AAC integration broken on iPad

**Loop**:
1. Expert identifies issue → PM (Step 12)
2. PM assigns to Senior Developer (Step 10)
3. Developer debugs AAC SDK on iOS (2 hours)
4. Developer fixes Safari-specific bug (1 hour)
5. QA re-tests on iPad (30 min)
6. Hard constraint tests re-run (10 min) → Pass
7. SLP quick re-review on iPad (30 min) → Approves

**Timeline**: 1 business day (4 hours actual work)

---

### Iteration 3: Major Changes (3-5 days)
**Scenario**: Autistic Advocate rejects game due to masking concerns in social scenarios

**Loop**:
1. Advocate identifies fundamental issue → PM (Step 12)
2. PM escalates to Clinical Advisory Board (emergency meeting)
3. Board agrees: 5 scenarios must be redesigned (not just tweaked)
4. PM + Game Designer + BCBA + Advocate workshop new scenarios (4 hours)
5. AI Resource Team generates 5 new scenarios (1 day)
6. Senior Developer integrates new scenarios, updates logic (1 day)
7. QA full regression test (1 day)
8. All 6 experts full re-review (1 day) → Approves

**Timeline**: 5 business days (major rework)

**Note**: This is rare (<5% of games), but workflow supports it.

---

## SUMMARY: KEY ROLES NEEDED

| Role | Do We Have? | Critical? | Where Defined |
|------|-------------|-----------|---------------|
| **Project Manager** | ✅ Yes | ✅ Critical | PM-001 agent |
| **Solution Architect** | ✅ Yes | ✅ Critical | ARCH-001 agent |
| **Expert Game Designer** | ✅ Yes | ✅ Critical | GAME-001 agent (or hire) |
| **Unity Developer (Senior)** | ✅ Yes | ✅ Critical | GAME-001 agent |
| **Frontend Developer** | ✅ Yes | ⚠️ Important | FRONT-001 agent |
| **Backend Developer** | ✅ Yes | ⚠️ Important | BACK-001 agent |
| **AI Asset Coordinator** | ❌ **GAP** | ✅ **Critical** | **NEW ROLE NEEDED** |
| **AI Prompt Engineers** | ❌ **GAP** | ⚠️ Important | **NEW ROLE NEEDED** |
| **BCBA** | ✅ Yes | ✅ Critical | BCBA-001 agent |
| **SLP** | ✅ Yes | ⚠️ Important | SLP agent |
| **OT** | ✅ Yes | ⚠️ Important | OT agent |
| **Child Psychologist** | ✅ Yes | ⚠️ Important | Psychologist agent |
| **Autistic Advocate** | ✅ Yes | ✅ Critical | Advocate agent |
| **Accessibility Specialist** | ✅ Yes | ✅ Critical | A11Y-001 agent |
| **Parent Representative** | ✅ Yes | ⚠️ Important | Parent agent |
| **QA Engineer** | ✅ Yes | ✅ Critical | QA-001 agent |
| **DevOps** | ✅ Yes | ⚠️ Important | DEVOPS-001 agent |

**Action Items**:
1. **Hire AI Asset Coordinator** (1 FTE) - Manages AI resource generation pipeline
2. **Hire 2 AI Prompt Engineers** (0.5 FTE each) - Specialized in DALL-E, Midjourney prompts
3. Consider **Expert Game Designer** (if GAME-001 agent not senior enough) - 1 FTE with educational game experience

---

## TIMELINE SUMMARY (Per Game)

| Step | Duration | Can Parallelize? | Critical Path? |
|------|----------|------------------|----------------|
| 1. Ideation | 4 hours | No | No |
| 2. Expert ID | 1 hour (automated) | No | No |
| 3. Design Start | 2 days | No | Yes |
| 4. Design Validation | 3 days | Partially (experts review in parallel) | Yes |
| 5. Tech Feasibility | 4 hours | No | No |
| 6. Tech Team + Plan | 1 day | No | Yes |
| 7. Resource Spec | 1 day | No | Yes |
| 8. AI Generation | 1-2 days | Yes (many assets in parallel) | Yes |
| 9. Handoff | 2 hours | No | No |
| 10. Development | 10-12 days | No | Yes |
| 11. Testing | 2-3 days | Partially (automated + manual in parallel) | Yes |
| 12. Expert Re-Assessment | 2-3 days | Yes (experts test in parallel) | Yes |

**Total Timeline (No Iterations)**: 22-26 days (~1 month)

**With Iterations** (Average 1-2 rounds):
- Minor iterations: +1-2 days
- Moderate iterations: +3-5 days
- Major iterations (rare): +1 week

**Realistic Timeline**: 25-35 days per game (1-1.5 months)

**With 3 Games in Parallel** (Month 1 plan):
- Stagger starts (Week 1: Game 1, Week 2: Game 2, Week 3: Game 3)
- Overlap development, share resources
- **All 3 complete in 8-10 weeks** (aggressive but achievable)

---

**Document Status**: ✅ **COMPLETE - PRODUCTION-READY WORKFLOW**

**Next Steps**:
1. Hire AI Resource Team (2-3 people)
2. Set up AI API accounts (OpenAI, ElevenLabs, Midjourney)
3. Build hard constraint test suite (1 week dev time)
4. Train team on workflow (1-day workshop)
5. **Execute Month 1: Develop 3 games using this workflow**

---

**END OF COMPLETE GAME DEVELOPMENT WORKFLOW**
