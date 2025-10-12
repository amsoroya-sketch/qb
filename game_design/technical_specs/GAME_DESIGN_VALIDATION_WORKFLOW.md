# Game Design Validation Workflow System
## SkillBridge Educational Gaming Platform

**Document Version**: 1.0
**Last Updated**: October 12, 2025
**Critical Importance**: ⚠️ **NO GAME LAUNCHES WITHOUT 100% VALIDATION**

---

## 1. VALIDATION PHILOSOPHY

### Core Principles

1. **Clinical Safety First**: No game ships if there's any risk of harm, frustration, or inappropriate skill teaching
2. **Multi-Expert Validation**: Single-discipline approval is insufficient - games require 3-6 expert sign-offs
3. **Iterative Refinement**: Validation drives design improvements, not just approval/rejection
4. **Evidence-Based**: All validation criteria rooted in research and clinical best practices
5. **Neurodiversity-Affirming**: Autistic perspective must be integrated, not treated as "optional"
6. **Real-World Testing**: Paper validation insufficient - must test with actual children

### Why This Matters

**Historical Context**: Many "autism apps" have caused harm:
- Forced compliance training that teaches masking
- Inappropriate social expectations that ignore neurodiversity
- Overwhelming sensory stimulation causing meltdowns
- Punitive error feedback creating learned helplessness
- Data collection without clinical interpretation

**Our Commitment**: Every SkillBridge game will be **clinically validated, neurodiversity-affirming, and evidence-based**.

---

## 2. VALIDATION WORKFLOW OVERVIEW

### Complete Pipeline (20-Day Timeline per Game)

```
┌────────────────────────────────────────────────────────────┐
│                   PHASE 0: CONCEPT (Day 0)                  │
│                                                             │
│ Game concept proposed based on skill database analysis     │
│ PM creates initial concept document (1-2 pages)            │
│                                                             │
│ Validation: PM + BCBA + SLP quick feasibility review (2h)  │
│ Gate: Concept Approved? → YES: Continue | NO: Revise       │
└──────────────────┬─────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────────────────────────┐
│              PHASE 1: DESIGN SPECIFICATION (Day 1-5)        │
│                                                             │
│ Game Designer writes complete GDD (40-60 pages)            │
│ Includes: Mechanics, skills, progression, accessibility    │
│                                                             │
│ Validation Round 1: Expert Design Review (Parallel)        │
│ ├─ BCBA Review (4-6 hours)                                 │
│ │  Focus: Skill mapping, prompting, reinforcement          │
│ ├─ SLP Review (3-5 hours, if language skills)              │
│ │  Focus: Communication targets, AAC integration           │
│ ├─ OT Review (2-4 hours, if motor/sensory)                 │
│ │  Focus: Motor requirements, sensory accommodations       │
│ └─ Autistic Advocate Review (2-3 hours, if social skills)  │
│    Focus: Neurodiversity perspective, avoiding ableism     │
│                                                             │
│ Gate 1: Design Approved?                                    │
│ • ALL mandatory experts ≥3/5 rating                         │
│ • Zero "Rejected" votes                                     │
│ • All "Required Revisions" documented                       │
│                                                             │
│ → YES: Proceed to Gate 2 | NO: Revise GDD (2-3 days)       │
└──────────────────┬─────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────────────────────────┐
│           PHASE 2: PROTOTYPE DEVELOPMENT (Day 6-10)         │
│                                                             │
│ Unity Developer builds interactive prototype               │
│ • Core mechanic playable                                    │
│ • Placeholder art (wireframes OK)                           │
│ • Basic prompting system functional                         │
│ • Example skill progression demonstrable                    │
│                                                             │
│ Validation Round 2: Prototype Playtest (Sequential)        │
│ ├─ BCBA Playtest (2 hours)                                  │
│ │  Test: Try prototype, verify skill teaching matches GDD  │
│ ├─ SLP Playtest (1 hour, if applicable)                     │
│ │  Test: Try language components, test AAC integration     │
│ ├─ OT Playtest (1 hour, if applicable)                      │
│ │  Test: Drag controls, sensory profile switching          │
│ └─ Child Psychologist (1 hour, if emotional content)        │
│    Test: Emotion accuracy, trauma sensitivity              │
│                                                             │
│ Gate 2: Prototype Validated?                                │
│ • Gameplay matches GDD intent                               │
│ • No new safety/ethical concerns                            │
│ • Technical feasibility confirmed                           │
│                                                             │
│ → YES: Full development | NO: Prototype fixes (1-2 days)    │
└──────────────────┬─────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────────────────────────┐
│            PHASE 3: FULL DEVELOPMENT (Day 11-15)            │
│                                                             │
│ Complete game build:                                        │
│ • Final art assets integrated                               │
│ • All audio/voice-overs recorded                            │
│ • Full difficulty progression (all levels)                  │
│ • Backend API integration (data tracking)                   │
│ • Accessibility features implemented                        │
│                                                             │
│ Validation Round 3: Alpha Testing (Parallel + Sequential)  │
│                                                             │
│ 3A. Clinical Validation (Order 2 experts, if applicable)    │
│ ├─ Developmental Pediatrician (2 hours, if ages 0-3)        │
│ │  Test: Age-appropriateness, medical contraindications    │
│ ├─ Child Psychologist (2 hours, if emotional/regulation)    │
│ │  Test: Psychological safety, mental health              │
│ └─ AFLS Specialist (2 hours, if daily living skills)        │
│    Test: AFLS framework alignment, functional applicability│
│                                                             │
│ 3B. Accessibility Audit (Mandatory, all games)              │
│ ├─ Accessibility Specialist (3-4 hours)                     │
│ │  Test: WCAG 2.1 AA (50 criteria), screen reader          │
│ ├─ Autistic Advocate (2 hours)                              │
│ │  Test: Autism-specific accommodations (32 criteria)      │
│ └─ Automated Tools                                          │
│    Run: axe DevTools, Pa11y, Lighthouse                    │
│                                                             │
│ Gate 3: Alpha Build Approved?                               │
│ • WCAG 2.1 AA: 50/50 criteria pass                          │
│ • Autism accommodations: 32/32 implemented                  │
│ • All Order 2 experts approve (if assigned)                 │
│ • Zero critical (P0) bugs                                   │
│                                                             │
│ → YES: Beta build | NO: Fixes required (1-3 days)           │
└──────────────────┬─────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────────────────────────┐
│            PHASE 4: BETA TESTING (Day 16-20)                │
│                                                             │
│ Beta deployment to controlled group:                        │
│ • 5-10 beta families (children ages match target)           │
│ • 3-5 internal team members                                 │
│ • All expert reviewers (dogfooding)                         │
│                                                             │
│ Validation Round 4: Real-World Testing                      │
│                                                             │
│ 4A. Parent Representative Testing (Mandatory)               │
│ ├─ Parent Rep #1 (2 hours over 3 days)                      │
│ │  Test: Instruction clarity, setup ease, troubleshooting  │
│ ├─ Parent Rep #2 (2 hours over 3 days)                      │
│ │  Test: Different autism profile, different tech literacy│
│ └─ Parent Survey                                            │
│    Metrics: Usability (1-5), clarity, engagement, concerns │
│                                                             │
│ 4B. Beta Family Testing (5-10 families, 5-7 days)           │
│ Collect:                                                     │
│ • Session completion rates                                  │
│ • Engagement metrics (time, retries, abandonment)           │
│ • Skill improvement data (pre/post accuracy)                │
│ • Parent satisfaction surveys (daily)                       │
│ • Video recordings (opt-in, for behavior analysis)          │
│ • Incident reports (frustration, meltdowns, technical)      │
│                                                             │
│ 4C. Expert Re-Review (All original reviewers)                │
│ ├─ BCBA analyzes aggregate data (2 hours)                   │
│ │  Review: Skill acquisition rates, prompt dependency      │
│ ├─ SLP reviews language usage (1 hour, if applicable)       │
│ │  Review: AAC usage patterns, communication attempts      │
│ ├─ OT reviews motor/sensory data (1 hour, if applicable)    │
│ │  Review: Drop-out rates by sensory profile              │
│ └─ Accessibility Specialist reviews support tickets         │
│    Review: Accessibility barriers not caught in audit      │
│                                                             │
│ Gate 4: Beta Results Meet Criteria?                         │
│ ✅ Completion rate ≥80% (not abandoned mid-game)            │
│ ✅ Skill improvement visible in ≥70% of children            │
│ ✅ Parent satisfaction ≥85% (4/5 or 5/5 rating)             │
│ ✅ Zero safety incidents (meltdowns, distress)              │
│ ✅ Technical issues <10% of sessions                         │
│ ✅ All experts re-approve after data review                  │
│                                                             │
│ → YES: PRODUCTION LAUNCH | NO: Iterate & re-beta (3-5 days) │
└──────────────────┬─────────────────────────────────────────┘
                   ↓
┌────────────────────────────────────────────────────────────┐
│             PHASE 5: PRODUCTION LAUNCH (Day 21)             │
│                                                             │
│ Final sign-offs:                                            │
│ • All experts sign clinical attestation                     │
│ • PM signs quality gate approval                            │
│ • Legal reviews disclaimers/consent                         │
│ • Executive approves business launch                        │
│                                                             │
│ Game goes live to all users!                                │
│                                                             │
│ Post-Launch Monitoring (Week 1-4):                          │
│ • Daily metrics review (crashes, completion, satisfaction)  │
│ • Weekly expert check-ins (BCBA reviews aggregate data)     │
│ • Parent support tickets triaged                            │
│ • Hotfix deployment if critical issues emerge               │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. VALIDATION CRITERIA BY EXPERT TYPE

### 3.1 BCBA Validation Checklist (All Games)

**Validation Document**: BCBA Clinical Validation Form

#### Section A: Skill Alignment (Weight: 30%)

| Criterion | Pass/Fail | Evidence Required |
|-----------|-----------|-------------------|
| 1.1 Skills accurately map to assessment framework (ABLLS-R, VB-MAPP, AFLS) | ☐ Pass ☐ Fail | Framework codes listed, descriptions match |
| 1.2 Skill progression follows developmental sequence | ☐ Pass ☐ Fail | Prerequisite skills identified, age-appropriate |
| 1.3 Target behaviors are observable and measurable | ☐ Pass ☐ Fail | Clear definition of correct vs incorrect response |
| 1.4 Mastery criteria are evidence-based (typically 80%+ over 3 sessions) | ☐ Pass ☐ Fail | Cite research supporting criteria |
| 1.5 Generalization opportunities embedded | ☐ Pass ☐ Fail | Parent prompts, varied exemplars, context variety |

**Required Score**: 5/5 Pass

#### Section B: Teaching Methodology (Weight: 35%)

| Criterion | Pass/Fail | Evidence Required |
|-----------|-----------|-------------------|
| 2.1 Prompting hierarchy follows ABA best practices | ☐ Pass ☐ Fail | Errorless → least-to-most or most-to-least |
| 2.2 Prompt fading strategy is systematic | ☐ Pass ☐ Fail | Automatic fading based on performance data |
| 2.3 Reinforcement schedule appropriate for skill type | ☐ Pass ☐ Fail | Continuous → intermittent transition plan |
| 2.4 Reinforcers age-appropriate and non-satiat ing | ☐ Pass ☐ Fail | Varied reinforcers, intrinsic motivation focus |
| 2.5 Error correction is non-punitive | ☐ Pass ☐ Fail | No harsh feedback, "try again" language |
| 2.6 Task analysis appropriate for skill complexity | ☐ Pass ☐ Fail | Multi-step skills broken into teachable components |

**Required Score**: 6/6 Pass

#### Section C: Data Collection (Weight: 20%)

| Criterion | Pass/Fail | Evidence Required |
|-----------|-----------|-------------------|
| 3.1 Accuracy data captured (correct/total trials) | ☐ Pass ☐ Fail | Percentage calculation in session data |
| 3.2 Prompt level documented for each trial | ☐ Pass ☐ Fail | Independent vs prompted responses tracked |
| 3.3 Response latency measured (if relevant) | ☐ Pass ☐ Fail | Time from stimulus to response recorded |
| 3.4 Error patterns analyzable | ☐ Pass ☐ Fail | Error type categorization (e.g., distractor selected) |
| 3.5 Data visualizations interpretable by parents | ☐ Pass ☐ Fail | Graphs clear, jargon-free explanations |

**Required Score**: 5/5 Pass

#### Section D: Safety & Ethics (Weight: 15%)

| Criterion | Pass/Fail | Evidence Required |
|-----------|-----------|-------------------|
| 4.1 No aversive or punitive consequences | ☐ Pass ☐ Fail | Review all feedback mechanisms |
| 4.2 Child autonomy respected (assent/dissent) | ☐ Pass ☐ Fail | Pause/exit available, no coercion |
| 4.3 Dignity-preserving language and imagery | ☐ Pass ☐ Fail | No infantilization, age-appropriate aesthetics |
| 4.4 Complies with BACB ethical code | ☐ Pass ☐ Fail | No violations of professional standards |

**Required Score**: 4/4 Pass

**Overall BCBA Approval Threshold**: **18/20 Pass** (90%+)

**Sign-Off Statement**:
> "I, [BCBA Name], BCBA-D, certify that this game, as designed and implemented, is clinically appropriate for teaching the identified skills using evidence-based ABA methodology, and complies with BACB ethical standards."

---

### 3.2 SLP Validation Checklist (Language/Communication Games)

**Validation Document**: SLP Communication Validation Form

#### Section A: Language Targets (Weight: 35%)

| Criterion | Pass/Fail | Evidence Required |
|-----------|-----------|-------------------|
| 1.1 Language targets appropriate for age/level | ☐ Pass ☐ Fail | Aligns with PLS, CELF, or PPVT norms |
| 1.2 Receptive vs expressive clearly differentiated | ☐ Pass ☐ Fail | Separate data tracking for each |
| 1.3 Pragmatic language context realistic | ☐ Pass ☐ Fail | Social scenarios authentic, not contrived |
| 1.4 Vocabulary selection evidence-based | ☐ Pass ☐ Fail | Core vocabulary prioritized (Fringe secondary) |

**Required Score**: 4/4 Pass

#### Section B: AAC Integration (Weight: 30%, if applicable)

| Criterion | Pass/Fail | Evidence Required |
|-----------|-----------|-------------------|
| 2.1 AAC symbols match standard libraries (PCS, SymbolStix) | ☐ Pass ☐ Fail | Visual confirmation of symbol sets |
| 2.2 Core vocabulary accessible in ≤2 touches | ☐ Pass ☐ Fail | Usability testing with AAC users |
| 2.3 AAC device compatibility tested | ☐ Pass ☐ Fail | Tested with Proloquo2Go, TD Snap, LAMP |
| 2.4 Modeling opportunities for AAC learning | ☐ Pass ☐ Fail | Adults use AAC in game demos/tutorials |
| 2.5 Wait time accommodations for AAC users | ☐ Pass ☐ Fail | No rushed responses, adjustable timing |

**Required Score**: 5/5 Pass (if AAC present), N/A (if no AAC)

#### Section C: Articulation/Phonology (Weight: 15%, if applicable)

| Criterion | Pass/Fail | Evidence Required |
|-----------|-----------|-------------------|
| 3.1 Speech sound targets developmentally appropriate | ☐ Pass ☐ Fail | Follows typical articulation acquisition order |
| 3.2 Minimal pairs contrasts accurate | ☐ Pass ☐ Fail | Ship/sip, bat/pat distinctions clear |
| 3.3 Voice recording quality sufficient for analysis | ☐ Pass ☐ Fail | Audio clarity, noise cancellation tested |

**Required Score**: 3/3 Pass (if articulation game), N/A (if not)

#### Section D: Communication Partner Training (Weight: 20%)

| Criterion | Pass/Fail | Evidence Required |
|-----------|-----------|-------------------|
| 4.1 Parent guidance clear and actionable | ☐ Pass ☐ Fail | Step-by-step instructions, video demos |
| 4.2 Generalization strategies provided | ☐ Pass ☐ Fail | Home practice activities suggested |
| 4.3 Troubleshooting common issues addressed | ☐ Pass ☐ Fail | FAQ covers "what if child doesn't respond" |

**Required Score**: 3/3 Pass

**Overall SLP Approval Threshold**: **12/15+ Pass** (80%+, N/A items excluded)

**Sign-Off Statement**:
> "I, [SLP Name], CCC-SLP, certify that this game appropriately targets the identified communication/language skills using evidence-based speech-language pathology practices."

---

### 3.3 OT Validation Checklist (Motor/Sensory Games)

**Validation Document**: OT Sensory-Motor Validation Form

#### Section A: Motor Requirements (Weight: 30%)

| Criterion | Pass/Fail | Evidence Required |
|-----------|-----------|-------------------|
| 1.1 Touch targets meet minimum size (44px iOS, 48dp Android) | ☐ Pass ☐ Fail | Measured in design specs |
| 1.2 Motor demands age-appropriate | ☐ Pass ☐ Fail | Fine motor expectations realistic for age |
| 1.3 Alternative input methods available (switch, voice, eye-gaze) | ☐ Pass ☐ Fail | Tested with assistive tech |
| 1.4 Timing adjustable for motor delays | ☐ Pass ☐ Fail | Settings for hold duration, drag sensitivity |

**Required Score**: 4/4 Pass

#### Section B: Sensory Accommodations (Weight: 40%)

| Criterion | Pass/Fail | Evidence Required |
|-----------|-----------|-------------------|
| 2.1 Four sensory profiles implemented (Calm, Energetic, Focused, Custom) | ☐ Pass ☐ Fail | All profiles tested, distinct differences |
| 2.2 Visual settings customizable (brightness, contrast, animation speed) | ☐ Pass ☐ Fail | Sliders functional, changes immediate |
| 2.3 Auditory settings customizable (volume per channel, mute options) | ☐ Pass ☐ Fail | Music, SFX, voice separately controllable |
| 2.4 Motion settings (reduced motion mode functional) | ☐ Pass ☐ Fail | No parallax, minimal animations when enabled |
| 2.5 No sudden sensory surprises (warnings before transitions) | ☐ Pass ☐ Fail | Visual countdowns, predictable patterns |
| 2.6 Calm space accessible anytime | ☐ Pass ☐ Fail | Breathing exercise or sensory break available |

**Required Score**: 6/6 Pass

#### Section C: Daily Living Skills (Weight: 20%, if AFLS game)

| Criterion | Pass/Fail | Evidence Required |
|-----------|-----------|-------------------|
| 3.1 ADL tasks realistic and functional | ☐ Pass ☐ Fail | Dressing, hygiene, eating tasks authentic |
| 3.2 Task analysis accurate (correct sequence) | ☐ Pass ☐ Fail | Steps match OT protocols |
| 3.3 Generalization to real-world supported | ☐ Pass ☐ Fail | Parent prompts for home practice included |

**Required Score**: 3/3 Pass (if ADL game), N/A (if not)

#### Section D: Sensory Safety (Weight: 10%)

| Criterion | Pass/Fail | Evidence Required |
|-----------|-----------|-------------------|
| 4.1 No flashing/strobing (seizure risk) | ☐ Pass ☐ Fail | WCAG 2.3.1 compliance (no >3 flashes/sec) |
| 4.2 No prolonged loud sounds (hearing safety) | ☐ Pass ☐ Fail | Volume limits enforced, no >85dB |

**Required Score**: 2/2 Pass

**Overall OT Approval Threshold**: **13/15+ Pass** (85%+, N/A items excluded)

**Sign-Off Statement**:
> "I, [OT Name], OTR/L, certify that this game accommodates diverse sensory-motor profiles and follows occupational therapy best practices for skill development."

---

### 3.4 Autistic Advocate Validation Checklist (Social Skills Games)

**Validation Document**: Neurodiversity-Affirming Review Form

**⚠️ CRITICAL**: This review is **mandatory** for any game teaching social skills, emotion regulation, or peer interaction due to historical harms from compliance-based training.

#### Section A: Autonomy & Dignity (Weight: 30%)

| Criterion | Pass/Fail | Evidence Required |
|-----------|-----------|-------------------|
| 1.1 No forced eye contact teaching | ☐ Pass ☐ Fail | Eye contact not required for game success |
| 1.2 Stimming not pathologized | ☐ Pass ☐ Fail | No "quiet hands" messaging, stimming portrayed neutrally |
| 1.3 Communication choice respected (AAC, gesture, speech equally valid) | ☐ Pass ☐ Fail | All modalities accepted, not hierarchy |
| 1.4 Assent/dissent honored (child can stop anytime) | ☐ Pass ☐ Fail | Pause/exit prominent, no coercion |
| 1.5 Age-appropriate presentation (not infantilizing) | ☐ Pass ☐ Fail | Visuals match chronological age, not developmental |

**Required Score**: 5/5 Pass

#### Section B: Social Expectations (Weight: 35%)

| Criterion | Pass/Fail | Evidence Required |
|-----------|-----------|-------------------|
| 2.1 Social skills taught are functionally useful (not performative) | ☐ Pass ☐ Fail | Skills serve child's needs, not just neurotypical comfort |
| 2.2 Flexibility in "correct" responses (multiple valid social approaches) | ☐ Pass ☐ Fail | Not one rigid "right way" to interact |
| 2.3 No masking encouraged (authenticity valued) | ☐ Pass ☐ Fail | "Be yourself" messaging, not "act neurotypical" |
| 2.4 Boundaries respected (teaching "no" is OK) | ☐ Pass ☐ Fail | Assertiveness encouraged, not compliance |
| 2.5 Peer differences normalized (not "everyone must be the same") | ☐ Pass ☐ Fail | Diversity celebrated, inclusion modeled |

**Required Score**: 5/5 Pass

#### Section C: Emotional Safety (Weight: 20%)

| Criterion | Pass/Fail | Evidence Required |
|-----------|-----------|-------------------|
| 3.1 Emotions validated, not suppressed | ☐ Pass ☐ Fail | "It's OK to feel upset" not "calm down" |
| 3.2 Meltdowns portrayed as communication, not "bad behavior" | ☐ Pass ☐ Fail | Empathy for overwhelm, not punishment |
| 3.3 Sensory needs acknowledged in social contexts | ☐ Pass ☐ Fail | "I need a break" taught as social skill |

**Required Score**: 3/3 Pass

#### Section D: Representation (Weight: 15%)

| Criterion | Pass/Fail | Evidence Required |
|-----------|-----------|-------------------|
| 4.1 Autistic characters portrayed positively | ☐ Pass ☐ Fail | Competent, happy autistic characters included |
| 4.2 Diverse autism spectrum represented | ☐ Pass ☐ Fail | Verbal, AAC users, different support needs shown |
| 4.3 Language is identity-first or preference-based | ☐ Pass ☐ Fail | "Autistic child" not "child with autism" (unless family prefers) |

**Required Score**: 3/3 Pass

**Overall Advocate Approval Threshold**: **16/16 Pass** (100% - non-negotiable)

**Sign-Off Statement**:
> "I, [Advocate Name], autistic self-advocate, certify that this game respects autistic autonomy, does not encourage masking, and aligns with neurodiversity-affirming principles."

**⚠️ VETO POWER**: Autistic Advocate has absolute veto authority on social skills games. If they reject, game does not proceed, regardless of other approvals.

---

### 3.5 Accessibility Specialist Validation (All Games)

**Validation Document**: WCAG 2.1 AA Accessibility Audit

#### Automated Testing (75% of criteria)

**Tools Used**:
- axe DevTools (Deque Systems)
- Pa11y (command-line)
- Lighthouse (Chrome)
- WAVE (WebAIM)

**Auto-Testable Criteria** (37/50 WCAG 2.1 AA):
- Color contrast ratios
- Alt text presence
- ARIA labels
- Keyboard navigation
- Focus indicators
- Form labels
- Language declarations
- Page titles
- Link purposes
- Heading hierarchy

**Automated Pass Threshold**: **37/37** (100%)

#### Manual Testing (25% of criteria)

**Manually Tested**:
1. Screen reader testing (NVDA, JAWS, VoiceOver)
2. Keyboard-only navigation (no mouse)
3. Switch access functionality
4. Cognitive accessibility (clear instructions)
5. Seizure safety (no flashing)
6. Focus order logical
7. Error identification clear
8. Time limits adjustable
9. Audio control available
10. Text spacing adjustable
11. Content on hover/focus accessible
12. Status messages announced
13. Motion control (pause animations)

**Manual Pass Threshold**: **13/13** (100%)

**Overall Accessibility Approval**: **50/50 WCAG 2.1 AA** (100% required)

**Plus Autism-Specific** (32 additional criteria):
- Predictable layout
- Visual schedules
- Escape to calm space
- Sensory customization
- Executive function supports
- AAC integration
- (Full list in separate document)

**Autism-Specific Pass Threshold**: **32/32** (100%)

**Sign-Off Statement**:
> "I, [Specialist Name], CPACC, certify that this game meets WCAG 2.1 Level AA standards and implements all 32 autism-specific accessibility accommodations."

---

### 3.6 Parent Representative Validation (All Games)

**Validation Document**: Parent Usability Feedback Form

**Testing Protocol**:
1. Parent receives game with minimal instructions (simulating real-world)
2. Parent attempts to:
   - Set up child's profile
   - Start game
   - Understand instructions
   - Interpret progress data
   - Troubleshoot common issues
3. Parent completes usability survey (20 questions, 15 minutes)
4. Optional: Video interview (10 minutes)

#### Usability Survey Key Questions

| Question | Response | Pass Criteria |
|----------|----------|---------------|
| 1. How easy was it to set up? (1-5) | _____ | ≥4/5 |
| 2. Were instructions clear? (1-5) | _____ | ≥4/5 |
| 3. Could you understand your child's progress? (1-5) | _____ | ≥4/5 |
| 4. Did you encounter technical problems? (Y/N) | _____ | ≤1 minor issue |
| 5. Would you recommend this to other families? (Y/N) | _____ | Yes |
| 6. Does this seem educationally valuable? (1-5) | _____ | ≥4/5 |
| 7. Is it worth $399/year? (Y/N) | _____ | Yes |

**Pass Threshold**: **6/7 criteria met**

**Sign-Off Statement**:
> "I, [Parent Name], parent of an autistic child, confirm that this game is user-friendly, educationally valuable, and appropriate for home use."

---

## 4. VALIDATION GATES (CANNOT SKIP)

### Gate 1: Design Approval (Day 5)
**Triggers**: GDD complete
**Validators**: BCBA (mandatory), SLP/OT/Advocate (if applicable)
**Criteria**:
- ✅ All mandatory experts ≥3/5 rating
- ✅ Zero "Rejected" reviews
- ✅ All "Required Revisions" have resolution plan

**If Failed**: GDD revision (2-3 days), re-submit for expedited re-review

---

### Gate 2: Prototype Validation (Day 12)
**Triggers**: Interactive prototype playable
**Validators**: Same experts as Gate 1
**Criteria**:
- ✅ Gameplay matches GDD design intent
- ✅ No new safety/ethical concerns identified
- ✅ Technical feasibility confirmed (no major blockers)

**If Failed**: Prototype fixes (1-2 days), re-playtest

---

### Gate 3: Accessibility Compliance (Day 18)
**Triggers**: Alpha build feature-complete
**Validators**: Accessibility Specialist + Autistic Advocate
**Criteria**:
- ✅ WCAG 2.1 AA: 50/50 pass
- ✅ Autism-specific: 32/32 pass
- ✅ Screen reader 100% functional
- ✅ All input methods working (keyboard, switch, voice)

**If Failed**: Accessibility fixes (1-2 days), re-audit

---

### Gate 4: Beta Testing Success (Day 20)
**Triggers**: Beta test complete (5-10 families, 5 days)
**Validators**: Parent Representative + All previous experts (data review)
**Criteria**:
- ✅ Completion rate ≥80%
- ✅ Skill improvement ≥70% of children
- ✅ Parent satisfaction ≥85% (4/5 or 5/5)
- ✅ Zero safety incidents
- ✅ Technical issues <10%
- ✅ All experts re-approve after seeing real data

**If Failed**: Iterate based on feedback (3-5 days), re-beta test (smaller group, 3 days)

---

## 5. RE-VALIDATION TRIGGERS

**A game must be re-validated if**:

### Major Changes (Full Re-Validation Required)
1. **Skill targets changed** (e.g., adding new skill domain)
   - Re-validate: All experts
   - Timeline: 10 days

2. **Core mechanic redesigned** (e.g., drag-and-drop → tap-to-select)
   - Re-validate: BCBA, relevant domain expert, Accessibility
   - Timeline: 7 days

3. **Target age range expanded** (e.g., 3-5 years → 2-7 years)
   - Re-validate: BCBA, Developmental Pediatrician
   - Timeline: 5 days

4. **AAC integration added** (new modality)
   - Re-validate: SLP, AAC Specialist, Accessibility
   - Timeline: 7 days

### Minor Changes (Expedited Re-Validation)
1. **Difficulty adjustments** (e.g., change level 5 parameters)
   - Re-validate: BCBA review only
   - Timeline: 1 day

2. **Visual/audio polish** (no mechanic changes)
   - Re-validate: Accessibility spot-check
   - Timeline: 1 day

3. **Bug fixes** (no gameplay impact)
   - Re-validate: QA testing only, no expert review needed
   - Timeline: 0 days

---

## 6. VALIDATION DOCUMENTATION ARCHIVE

**Every game must maintain**:

### Clinical Validation Record
```
/docs/games/[GAME_ID]/validation/
├── 01_concept_approval.pdf (Initial feasibility sign-off)
├── 02_design_reviews/
│   ├── bcba_review_v1.pdf (Gate 1)
│   ├── bcba_review_v2.pdf (if revisions)
│   ├── slp_review.pdf
│   ├── ot_review.pdf
│   └── advocate_review.pdf
├── 03_prototype_playtest_notes.pdf (Gate 2)
├── 04_alpha_testing/
│   ├── accessibility_audit_report.pdf (Gate 3)
│   ├── wcag_checklist.xlsx
│   └── autism_accommodations_checklist.xlsx
├── 05_beta_testing/
│   ├── beta_test_protocol.pdf
│   ├── participant_consent_forms/ (anonymized)
│   ├── session_data_aggregate.csv
│   ├── parent_surveys.pdf
│   ├── expert_data_reviews.pdf (BCBA/SLP/OT re-approval)
│   └── beta_summary_report.pdf (Gate 4)
├── 06_final_sign_offs/
│   ├── bcba_attestation.pdf (signed)
│   ├── slp_attestation.pdf (signed)
│   ├── ot_attestation.pdf (signed)
│   ├── advocate_attestation.pdf (signed)
│   ├── accessibility_attestation.pdf (signed)
│   ├── parent_rep_attestation.pdf (signed)
│   └── pm_quality_gate_approval.pdf (signed)
└── 07_post_launch_monitoring/
    ├── week_1_metrics.pdf
    ├── week_2_metrics.pdf
    ├── week_4_metrics.pdf
    └── month_3_efficacy_analysis.pdf (long-term)
```

**Retention**: Permanent (regulatory compliance, research publication, future audits)

---

## 7. ESCALATION & DISPUTE RESOLUTION

### Scenario 1: Expert Disagrees with Design

**Example**: BCBA approves reinforcement schedule, but Child Psychologist concerned about extrinsic motivation dependency.

**Resolution Protocol**:
1. PM schedules joint meeting (BCBA + Psychologist + Game Designer)
2. Experts discuss concerns, present evidence
3. Game Designer proposes compromise solution
4. Both experts must approve compromise, or escalate to Clinical Advisory Board
5. Advisory Board (3-5 senior experts) makes binding decision (majority vote)

**Timeline**: 3-5 days

---

### Scenario 2: Autistic Advocate Rejects Social Skills Game

**Example**: Advocate identifies masking-promotion in conversation game ("Look at person when they talk to you").

**Resolution Protocol**:
1. **Game development STOPS immediately** (Advocate veto power)
2. PM convenes emergency review (Advocate + BCBA + SLP + Game Designer)
3. Problematic content removed/redesigned
4. Advocate must re-approve revised design before development resumes
5. If Advocate still rejects, game is shelved indefinitely (non-negotiable)

**Timeline**: Issue resolved in 1-3 days, or game canceled

**Rationale**: Historical harm from compliance-based social skills training is too severe to risk. Autistic community veto protects against repeating mistakes.

---

### Scenario 3: Accessibility Audit Fails

**Example**: Color contrast fails on 3/50 criteria, keyboard navigation broken.

**Resolution Protocol**:
1. Development team fixes issues (typically <1 day)
2. Accessibility Specialist re-audits (2 hours)
3. Must achieve 50/50 pass before proceeding
4. No workarounds or exceptions (accessibility is non-negotiable)

**Timeline**: 1-2 days

---

### Scenario 4: Beta Test Results Below Threshold

**Example**: Only 65% completion rate (target 80%), 3 parent satisfaction ratings of 3/5 (target 4+/5).

**Resolution Protocol**:
1. PM analyzes failure modes:
   - Why did 35% abandon? (Technical issues? Too hard? Boring?)
   - Why low satisfaction? (Confusing? Not helpful? Frustrating?)
2. Expert review of beta data (BCBA analyzes drop-off points, UX Designer reviews friction)
3. Prioritized fixes implemented (1-3 days)
4. Mini re-beta with 3-5 families (3 days)
5. Must hit thresholds or iterate again
6. After 3 failed attempts, escalate to executive for go/no-go decision

**Timeline**: 5-10 days (per iteration)

---

## 8. CONTINUOUS VALIDATION (POST-LAUNCH)

### Ongoing Monitoring

**Week 1-2**: Daily Metrics Review
- Crash rate, completion rate, satisfaction ratings
- Hotfix deployment if critical issues

**Week 3-4**: Weekly Expert Check-In
- BCBA reviews aggregate skill acquisition data
- SLP reviews AAC usage patterns (if applicable)
- OT reviews sensory profile distribution
- Accessibility reviews support tickets for a11y barriers

**Month 2-3**: Monthly Efficacy Analysis
- Pre/post skill assessments
- Parent long-term satisfaction
- Real-world generalization reports

**Month 6**: Formal Efficacy Study
- 50-100 children, pre/post ABLLS-R/VB-MAPP testing
- Publish results, iterate game based on findings

---

### Re-Validation Triggers (Post-Launch)

**Mandatory re-validation if**:
- Adverse event reported (meltdown, distress attributed to game)
- <70% completion rate sustained for 2+ weeks
- Parent satisfaction drops below 80%
- Expert identifies clinical concern from aggregate data

**Process**: Same as initial validation (10-15 days), game may be temporarily pulled from platform during review.

---

## 9. SUMMARY CHECKLIST

### Before ANY Game Launches, Confirm:

**Design Validation**:
- ☐ BCBA approved (≥3/5 rating, signed attestation)
- ☐ SLP approved (if language/communication game)
- ☐ OT approved (if motor/sensory game)
- ☐ Autistic Advocate approved (if social skills game)
- ☐ All "Required Revisions" addressed

**Prototype Validation**:
- ☐ All Gate 1 experts playtested prototype
- ☐ Gameplay matches GDD intent
- ☐ No new safety concerns

**Alpha Validation**:
- ☐ WCAG 2.1 AA: 50/50 pass
- ☐ Autism accommodations: 32/32 pass
- ☐ Screen reader 100% functional
- ☐ All input methods working

**Beta Validation**:
- ☐ Completion rate ≥80%
- ☐ Skill improvement ≥70%
- ☐ Parent satisfaction ≥85%
- ☐ Zero safety incidents
- ☐ Technical issues <10%
- ☐ Parent Representative approved

**Final Sign-Offs**:
- ☐ All expert attestations signed & archived
- ☐ PM quality gate approved
- ☐ Legal reviewed disclaimers
- ☐ Executive approved launch

**✅ ALL BOXES CHECKED = APPROVED FOR PRODUCTION LAUNCH**

---

## 10. VALIDATION WORKFLOW DIAGRAM

```
                    ┌─────────────────┐
                    │ Game Concept    │
                    │ (Skill-based)   │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ PM + BCBA       │
                    │ Feasibility     │
                    │ (2 hours)       │
                    └────────┬────────┘
                             ↓
                      ┌──────┴──────┐
                      │ Approved?   │
                      └──┬───────┬──┘
                         NO      YES
                         │       │
                    ┌────┘       └────┐
                    │                 │
              Revise Concept    Write GDD
              or Cancel         (40-60 pages)
                                      │
                    ┌─────────────────┘
                    ↓
          ┌──────────────────┐
          │ GATE 1: Design   │
          │ Expert Reviews   │
          │ (BCBA/SLP/OT)    │
          │ 3-5 days         │
          └────────┬─────────┘
                   ↓
            ┌──────┴──────┐
            │ All Approve?│
            └──┬───────┬──┘
               NO      YES
               │       │
         ┌─────┘       └─────┐
         │                   │
    Revise GDD          Build Prototype
    (2-3 days)          (5 days)
    → Re-Review              │
                 ┌───────────┘
                 ↓
       ┌──────────────────┐
       │ GATE 2: Prototype│
       │ Playtests        │
       │ (Experts try it) │
       │ 2 days           │
       └────────┬─────────┘
                ↓
         ┌──────┴──────┐
         │ Validated?  │
         └──┬───────┬──┘
            NO      YES
            │       │
      ┌─────┘       └─────┐
      │                   │
 Fix Prototype       Full Development
 (1-2 days)          (5 days)
 → Re-Test                │
              ┌───────────┘
              ↓
    ┌──────────────────┐
    │ GATE 3: Alpha    │
    │ Accessibility    │
    │ Audit            │
    │ 2 days           │
    └────────┬─────────┘
             ↓
      ┌──────┴──────┐
      │ 50/50 Pass? │
      └──┬───────┬──┘
         NO      YES
         │       │
    ┌────┘       └────┐
    │                 │
Fix A11y Issues  Beta Testing
(1-2 days)       (5-10 families)
→ Re-Audit       (5 days)
                      │
    ┌─────────────────┘
    ↓
┌──────────────────┐
│ GATE 4: Beta     │
│ Results Analysis │
│ 80%+ completion? │
│ 70%+ improvement?│
│ 85%+ satisfaction│
│ 0 safety issues? │
└────────┬─────────┘
         ↓
  ┌──────┴──────┐
  │ All Pass?   │
  └──┬───────┬──┘
     NO      YES
     │       │
┌────┘       └────┐
│                 │
Iterate        Final Sign-Offs
(3-5 days)     (All experts attest)
→ Re-Beta           │
              ┌─────┘
              ↓
        ┌──────────────┐
        │ 🚀 LAUNCH!   │
        └──────────────┘
              ↓
     Post-Launch Monitoring
     (Continuous validation)
```

---

**Document Status**: ✅ **COMPLETE - READY FOR IMPLEMENTATION**

**Critical Takeaway**: **Validation is not a checklist exercise - it's our ethical responsibility to ensure every game we create is clinically sound, safe, and respectful of autistic children's dignity and autonomy.**

---

**END OF GAME DESIGN VALIDATION WORKFLOW**
