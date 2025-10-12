# Game Design Document Template
## SkillBridge Educational Gaming Platform

---

## 1. GAME OVERVIEW

### Game Title
**[Official Game Name]**

### One-Line Description
[Single sentence describing the core gameplay and learning goal]

### Target Audience
- **Age Range**: [X-Y years]
- **Difficulty Level**: [1-10]
- **Play Time**: [X-Y minutes per session]
- **Autism Profiles**: [All, specific sensory profiles, communication levels]

### Clinical Classification
- **Primary Framework**: [ABLLS-R / VB-MAPP / AFLS]
- **Skill Domain**: [Language, Social, Cognitive, Motor, Daily Living]
- **Skill Categories**: [List specific categories, e.g., ABLLS-R C1-C5]

---

## 2. LEARNING OBJECTIVES

### Primary Skills Taught
1. **[Skill Name]** (Framework Code: X-Y)
   - Description: [What child will learn]
   - Mastery Criteria: [80% accuracy over 3 sessions, etc.]
   - Prerequisites: [Required skills before this]

2. **[Additional Skills...]**

### Secondary Skills (Incidental Learning)
- [Skills practiced but not primary focus]
- [Cross-domain skills addressed]

### Generalization Goals
- [How skills transfer to real-world contexts]
- [Parent prompts for home practice]

---

## 3. CORE GAMEPLAY MECHANICS

### Primary Mechanic
[Describe the main interaction - drag-and-drop, tap/select, swipe, voice input, etc.]

### Game Loop (Moment-to-Moment)
1. [What player does]
2. [What game responds]
3. [What player learns/earns]
4. [Loop repeats with variation]

### Input Methods
- **Touch**: [Tap, swipe, drag, pinch]
- **Voice**: [Speech recognition, AAC device input]
- **Keyboard/Mouse**: [For desktop play]
- **Switch Access**: [For motor accessibility]
- **Eye Gaze**: [If supported]

### Feedback Systems
- **Correct Response**: [Visual/auditory celebration, points, progress indicator]
- **Incorrect Response**: [Non-punitive message, hint option, retry immediately]
- **Mastery Achievement**: [Badge unlock, level complete animation]

---

## 4. DIFFICULTY PROGRESSION

### Level Structure
| Level | Difficulty | Skills Introduced | Success Criteria |
|-------|-----------|-------------------|------------------|
| 1 | Easy | [Base skill] | 80%+ accuracy |
| 2 | Medium | [Added complexity] | 75%+ accuracy |
| 3 | Hard | [Advanced variation] | 70%+ accuracy |
| 4+ | Adaptive | [Generated challenges] | Dynamic adjustment |

### Adaptive Difficulty Algorithm
- **Increase Difficulty**: [Triggers - e.g., 3 consecutive correct responses]
- **Decrease Difficulty**: [Triggers - e.g., 3 consecutive errors]
- **Difficulty Parameters**: [What changes - speed, # of items, distractors, time limits]

### Scaffolding & Prompting
- **Full Prompt** (Level 0): [Errorless teaching, highlight correct answer]
- **Partial Prompt** (Level 1): [Visual cue, arrow pointing]
- **Minimal Prompt** (Level 2): [Brief hint, color highlighting]
- **Independent** (Level 3): [No prompts, child performs independently]

---

## 5. USER EXPERIENCE DESIGN

### Visual Design
- **Art Style**: [Realistic, cartoon, abstract, minimalist]
- **Color Palette**: [Sensory-friendly, high contrast options, colorblind modes]
- **UI Layout**: [Clean, uncluttered, consistent positioning]
- **Animation Style**: [Smooth, reduced motion options, no flashing]

### Audio Design
- **Background Music**: [Calming, upbeat, optional/off]
- **Sound Effects**: [Reward sounds, error sounds, ambient sounds]
- **Voice-Overs**: [Instructions, encouragement, feedback]
- **Volume Controls**: [Separate for music, SFX, voice]

### Sensory Accommodations
- **Calm Profile**: [Soft colors, minimal animations, quiet sounds]
- **Energetic Profile**: [Bright colors, dynamic animations, upbeat sounds]
- **Focused Profile**: [Neutral palette, no distractions, ambient only]
- **Custom Profile**: [User-adjustable all parameters]

### Accessibility Features
- **WCAG 2.1 AA Compliance**: [Text contrast 4.5:1, touch targets 44px+, keyboard navigation]
- **Screen Reader**: [All elements labeled, semantic HTML, ARIA tags]
- **AAC Integration**: [Symbol support, core vocabulary, device compatibility]
- **Motor Accessibility**: [Large targets, adjustable timing, switch access]
- **Cognitive Support**: [Clear instructions, visual schedules, undo option]

---

## 6. CONTENT STRUCTURE

### Game Assets Required

#### Characters
- [Character 1: Description, purpose, animations needed]
- [Character 2: ...]

#### Environments
- [Scene 1: Description, interactive elements]
- [Scene 2: ...]

#### Objects/Items
- [Item category: Count needed, variations]
- [Item category: ...]

#### UI Elements
- [Buttons: Start, Pause, Settings, Help, Exit]
- [Progress indicators: Health bar, mastery meter, level counter]
- [Feedback overlays: Correct, incorrect, celebration]

#### Audio Assets
- [Background tracks: # needed, duration, mood]
- [Sound effects: Event-triggered sounds, count needed]
- [Voice-overs: Script lines, language variations]

---

## 7. DATA TRACKING & ANALYTICS

### Session Data Collected
```json
{
  "session_id": "uuid",
  "user_id": "uuid",
  "game_id": "game_001_color_matching",
  "start_time": "ISO timestamp",
  "end_time": "ISO timestamp",
  "duration_seconds": 420,
  "completed": true,

  "performance": {
    "total_trials": 20,
    "correct_responses": 17,
    "incorrect_responses": 3,
    "accuracy_percentage": 85,
    "prompting_level": "minimal",
    "difficulty_level": 3
  },

  "skills_practiced": [
    {
      "skill_id": "ablls_visual_001",
      "skill_name": "Match identical colors",
      "trials": 10,
      "correct": 9,
      "mastery_progress": 90
    }
  ],

  "behavioral_data": {
    "response_times_ms": [1200, 980, 1500, ...],
    "error_types": ["distractor_selected", "timeout"],
    "prompts_used": 2,
    "help_requests": 1,
    "breaks_taken": 0
  },

  "engagement_metrics": {
    "touches_per_minute": 12,
    "pause_count": 1,
    "session_abandoned": false,
    "enjoyment_rating": 5
  }
}
```

### Parent Dashboard Metrics
- **Skill Mastery Chart**: [Graph showing progress over time]
- **Session Summary**: [Total time played, games completed, skills mastered]
- **Strengths & Challenges**: [Auto-generated insights from data]
- **Next Steps**: [Recommended games/skills based on performance]

### Clinical Analytics (for BCBAs/therapists)
- **Acquisition Curve**: [Learning rate compared to norms]
- **Generalization Probes**: [Cross-context performance]
- **Prompt Dependency**: [Tracking prompt fading progress]
- **Error Analysis**: [Patterns in incorrect responses]

---

## 8. TECHNICAL SPECIFICATIONS

### Platform Support
- **Web**: Unity WebGL (desktop browsers: Chrome, Firefox, Safari, Edge)
- **Mobile**: iOS 13+, Android 8+
- **Tablet**: iPad, Android tablets (optimized layouts)

### Performance Requirements
- **Load Time**: <3 seconds initial, <1 second subsequent
- **Frame Rate**: 60fps minimum, 30fps acceptable on older devices
- **Memory**: <200MB RAM usage
- **Storage**: <50MB download size per game

### Backend Integration
- **API Endpoints Used**:
  - `POST /api/sessions/start` - Initialize game session
  - `POST /api/sessions/:id/events` - Log gameplay events
  - `POST /api/sessions/:id/complete` - Submit final score
  - `GET /api/skills/:id` - Fetch skill details
  - `GET /api/users/:id/progress` - Fetch user progress

### Third-Party Integrations
- **AAC APIs**: [Proloquo2Go SDK, TD Snap API if applicable]
- **Analytics**: [Mixpanel events tracked]
- **Voice Recognition**: [Google Speech API / Web Speech API]

---

## 9. DEVELOPMENT PLAN

### Team Allocation
| Role | Team Member(s) | Hours Estimated |
|------|----------------|-----------------|
| Game Designer | [Name] | 20 hours |
| Unity Developer | [Name] | 80 hours |
| 2D/3D Artist | [Name] | 40 hours |
| Animator | [Name] | 24 hours |
| Sound Designer | [Name] | 16 hours |
| Frontend Developer | [Name] | 32 hours |
| Backend Developer | [Name] | 16 hours |
| BCBA Validation | [Name] | 8 hours |
| SLP/OT Review | [Name] | 4 hours |
| QA Testing | [Name] | 24 hours |
| Accessibility Audit | [Name] | 8 hours |

**Total Estimated Hours**: [Sum]

### Development Timeline
| Phase | Duration | Deliverables |
|-------|----------|-------------|
| **Week 1: Design** | 5 days | Finalized GDD, mockups, asset list |
| **Week 2: Prototype** | 5 days | Core mechanic playable, placeholder art |
| **Week 3: Development** | 5 days | Full game build, real assets, polish |
| **Week 4: Testing & QA** | 5 days | Bug fixes, clinical validation, launch |

### Milestones & Reviews
- **Day 5**: Design review (PM, BCBA, UX Designer)
- **Day 10**: Prototype playtest (internal team)
- **Day 15**: Alpha build ready (clinical team testing)
- **Day 18**: Beta build (accessibility audit)
- **Day 20**: Final approval (all stakeholders)

---

## 10. TESTING & VALIDATION

### Playtest Plan
- **Internal Testing**: [5 team members, 3 playthroughs each]
- **Clinical Testing**: [BCBA, SLP, OT validate skill alignment]
- **Accessibility Testing**: [Screen reader, keyboard-only, switch access]
- **Beta Family Testing**: [10 families, 1 week, feedback surveys]

### Test Cases
1. **Happy Path**: [Child completes game successfully, earns rewards]
2. **Error Handling**: [Child makes mistakes, receives helpful feedback]
3. **Edge Cases**: [Time out, rapid tapping, background interruptions]
4. **Accessibility**: [Screen reader announces all elements, keyboard navigable]
5. **Performance**: [Loads quickly, runs smoothly on low-end devices]

### Success Criteria
- ✅ **Clinical Validation**: 100% BCBA/SLP/OT approval
- ✅ **Accessibility**: Zero WCAG 2.1 AA violations
- ✅ **Performance**: <3sec load, 60fps gameplay
- ✅ **Engagement**: 80%+ children complete session
- ✅ **Learning**: 70%+ show skill improvement after 3 sessions

---

## 11. POST-LAUNCH SUPPORT

### Iteration Plan
- **Week 1-2**: Monitor crash reports, fix critical bugs
- **Week 3-4**: Analyze engagement data, adjust difficulty if needed
- **Month 2**: Add content variations based on feedback
- **Month 3**: Accessibility improvements, language localization

### Metrics to Monitor
- **Completion Rate**: % of players who finish vs abandon
- **Retry Rate**: % of players who replay game
- **Skill Mastery Rate**: % achieving 80%+ accuracy
- **Engagement Time**: Average session duration
- **Error Patterns**: Common mistakes indicating unclear instructions

---

## 12. APPENDICES

### Appendix A: Skill Mappings
[Detailed table mapping each game element to specific clinical skills]

### Appendix B: Asset List
[Complete spreadsheet of all art, audio, animation assets needed]

### Appendix C: Script/Dialogue
[All voice-over lines, on-screen text, AAC symbols]

### Appendix D: Wireframes & Mockups
[Visual references for all screens and interactions]

---

**Document Version**: 1.0
**Last Updated**: [Date]
**Status**: [Draft / In Review / Approved]
**Approved By**: [PM, BCBA, Lead Developer]
