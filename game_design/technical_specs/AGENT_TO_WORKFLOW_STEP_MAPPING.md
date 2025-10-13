# Complete Agent-to-Workflow Step Mapping
## SkillBridge Educational Gaming Platform

**Document Version**: 1.0
**Last Updated**: October 13, 2025
**Purpose**: Maps all 21 expert agents to the 12-step game development workflow

---

## EXECUTIVE SUMMARY

**Total Agents**: 21 specialized experts
**Workflow Steps**: 12 (from ideation to production)
**Coverage**: ✅ **100% - All steps have assigned agents**

### Quick Answer: Do We Have Agents for All Steps?
**YES ✅** - Every workflow step has designated expert agents. No gaps exist.

---

## COMPLETE AGENT-TO-STEP MAPPING

### **STEP 1: Game Ideation (Skill Database Selection)**

**Lead Agent**: PM-001 (Senior Project Manager)

**Supporting Agents**: None (automated query)

**Agent Responsibilities**:
- **PM-001**:
  - Queries skill database for underserved skills
  - Analyzes priority scores (ABLLS-R, VB-MAPP, AFLS)
  - Selects 1-3 game ideas for sprint
  - Documents rationale

**Status**: ✅ **FULLY COVERED**

---

### **STEP 2: Expert Identification**

**Lead Agent**: PM-001 (Senior Project Manager)

**Supporting Agents**:
- Automated Skill-to-Expert Mapping Engine

**Agent Responsibilities**:
- **PM-001**:
  - Inputs selected skill into mapping engine
  - Reviews recommended expert assignments
  - Sends assignment notifications
  - Confirms availability

**Clinical Experts Auto-Assigned** (based on skill domain):
- **BCBA-001**: All games (mandatory)
- **SLP-001**: Communication/language skills
- **OT-001**: Motor/sensory skills
- **PSY-001**: Emotional/social skills
- **ADVOCATE-001**: Social skills (veto power)
- **A11Y-001**: All games (mandatory)

**Status**: ✅ **FULLY COVERED**

---

### **STEP 3: Game Design Start (Concept Creation)**

**Lead Agent**: GAME-001 (Unity Game Developer) or GODOT-001 (Godot Engine Expert)

**Supporting Agents**:
- **UX-001**: UI/UX Designer (mockups, wireframes)
- **FIGMA-001**: Figma Design Tokens Expert (design systems)

**Agent Responsibilities**:
- **GAME-001** or **GODOT-001**:
  - Creates concept document (3 mechanic options)
  - Defines skill progression (5-10 levels)
  - Maps to clinical frameworks
  - Writes 5-10 page GDD draft

- **UX-001**:
  - Creates wireframes for each mechanic option
  - Designs accessibility-first interface
  - Provides 3 visual style options

- **FIGMA-001**:
  - Sets up design token system
  - Creates component library
  - Documents design-to-code workflow

**Status**: ✅ **FULLY COVERED**

---

### **STEP 4: Design Validation (Clinical Collaboration)**

**Lead Agent**: PM-001 (Meeting Facilitator)

**Participating Agents** (all assigned experts from Step 2):
- **BCBA-001**: ABA methodology validation
- **SLP-001**: Language/communication review (if applicable)
- **OT-001**: Motor/sensory review (if applicable)
- **PSY-001**: Emotional development review (if applicable)
- **ADVOCATE-001**: Dignity/autonomy review (veto power for social games)
- **A11Y-001**: Preliminary accessibility audit

**Agent Responsibilities**:
- **PM-001**:
  - Schedules 90-minute validation meeting
  - Sends pre-meeting package (48 hours prior)
  - Facilitates discussion
  - Aggregates feedback
  - Manages iteration loop

- **Each Expert**:
  - Reviews concept document
  - Rates design (1-5 scale)
  - Identifies required changes
  - Provides optional suggestions
  - Signs off (approve/approve with changes/reject)

**Status**: ✅ **FULLY COVERED**

---

### **STEP 5: Technical Feasibility Review**

**Lead Agent**: ARCH-001 (Solution Architect)

**Supporting Agents**: None (independent analysis)

**Agent Responsibilities**:
- **ARCH-001**:
  - Analyzes Unity/Godot capability
  - Assesses API requirements
  - Estimates performance impact
  - Identifies technical risks
  - Provides viability score (1-10)
  - Recommends proceed/revise/reject

**Status**: ✅ **FULLY COVERED**

---

### **STEP 6: Tech Team Assembly + Technical Plan**

**Lead Agent**: ARCH-001 (Solution Architect)

**Coordinated by**: PM-001

**Participating Agents**:
- **GAME-001** or **GODOT-001** or **UNITY-EDU-001**: Unity/Godot implementation strategy
- **BACK-001**: Backend Developer (API endpoints)
- **FRONT-001** or **REACT-001**: Frontend/dashboard integration
- **DB-001**: Database schema updates
- **QA-001**: Testing strategy
- **DEVOPS-001**: CI/CD pipeline setup

**Agent Responsibilities**:
- **ARCH-001**:
  - Leads 60-minute tech planning meeting
  - Creates architecture diagram
  - Defines API specifications
  - Documents timeline (3 weeks typical)

- **GAME-001/GODOT-001/UNITY-EDU-001**:
  - Proposes game architecture
  - Defines Unity/Godot structure
  - Estimates development time

- **BACK-001**:
  - Designs session tracking API
  - Creates API contract (Swagger/OpenAPI)

- **FRONT-001/REACT-001**:
  - Plans dashboard integration
  - Specifies React components needed

- **DB-001**:
  - Reviews schema changes
  - Creates migration scripts

- **QA-001**:
  - Outlines test plan
  - Defines hard constraint tests

**Status**: ✅ **FULLY COVERED**

---

### **STEP 7: Resource Specification (Asset List Creation)**

**Lead Agent**: GAME-001 or GODOT-001

**Supporting Agents**:
- **UX-001**: Visual consistency review
- **FIGMA-001**: UI asset specifications

**AI Resource Generation Experts** (consulted for feasibility):
- **FLUX-001**: Image asset feasibility
- **AUDIO-001**: Audio asset feasibility
- **VOICE-001**: Voice-over feasibility
- **CUBE3D-001**: 3D model feasibility

**Agent Responsibilities**:
- **GAME-001/GODOT-001**:
  - Creates comprehensive asset specification CSV
  - Lists all required assets (images, audio, 3D, animations, UI)
  - Defines specs (dimensions, formats, style)
  - Prioritizes (high/medium/low)
  - Estimates generation time

- **UX-001**:
  - Reviews for visual consistency
  - Ensures brand alignment

- **FIGMA-001**:
  - Specifies UI elements needed
  - Documents design token requirements

**Status**: ✅ **FULLY COVERED**

---

### **STEP 8: AI-Assisted Resource Generation**

**Lead Agent**: PM-001 (Coordinator)

**AI Resource Generation Agents** (10 specialists):

**For Image Assets**:
- **FLUX-001**: FLUX Image Generation Expert
  - Engineers optimal FLUX.1 prompts
  - Autism-friendly design (high contrast, clear shapes)
  - Batch generation via Python scripts
  - Quality validation

- **COMFY-001**: ComfyUI Workflow Expert
  - Sets up ComfyUI batch workflows
  - Automates image generation pipeline
  - Optimizes for 8GB VRAM (RTX 4070)

**For Audio Assets**:
- **AUDIO-001**: Stable Audio Expert
  - Generates SFX and background music
  - Uses Stable Audio Open (CC-BY-SA, commercial-safe)
  - LUFS normalization for consistency

- **VOICE-001**: Bark Voice Expert
  - Synthesizes voice-overs via Bark TTS
  - Child-friendly voices (3 options: warm, calm, excited)
  - Chunking for 13-14s Bark limit

**For 3D Assets**:
- **CUBE3D-001**: Cube 3D Expert
  - Text-to-3D via Roblox Cube
  - Game-ready optimization
  - Exports .obj/.glb formats

- **BLENDER-001**: Blender Automation Expert
  - Post-processes 3D models
  - Poly count reduction
  - UV unwrapping automation

**For Game Development Integration**:
- **GODOT-001**: Godot Engine Expert
  - Imports assets into Godot 4
  - Scene setup automation
  - GDScript resource loaders

- **UNITY-EDU-001**: Unity Educational Expert
  - Imports assets into Unity
  - Addressables setup
  - Unity C# resource management

- **FIGMA-001**: Figma Design Tokens Expert
  - Converts Figma designs to code
  - Exports design tokens (colors, spacing, typography)
  - Automates UI generation

- **REACT-001**: React Component Expert
  - Converts designs to React components
  - Implements design system
  - Ensures WCAG 2.1 AA compliance

**Agent Responsibilities**:
- **PM-001**:
  - Analyzes asset spec CSV
  - Routes assets to appropriate agents
  - Coordinates parallel generation
  - Aggregates all assets
  - Organizes folder structure

- **Each AI Agent**:
  - Generates assigned assets
  - Validates quality
  - Provides generation log
  - Reports any failures

**Typical Generation**:
- **20 images** (FLUX-001 + COMFY-001): 2-3 minutes
- **10 audio clips** (AUDIO-001): 3-4 minutes
- **5 voice-overs** (VOICE-001): 2-3 minutes
- **5 3D models** (CUBE3D-001 + BLENDER-001): 5 minutes

**Total Time**: ~15 minutes for full game asset set
**Total Cost**: $0 (all local, open source, commercial-safe)

**Status**: ✅ **FULLY COVERED** (10 AI resource agents)

---

### **STEP 9: PM Handoff to Senior Developer**

**Lead Agent**: PM-001

**Receiving Agent**: GAME-001, GODOT-001, or UNITY-EDU-001 (Unity Lead Developer)

**Agent Responsibilities**:
- **PM-001**:
  - Prepares handoff package:
    - Approved GDD
    - Technical plan
    - Asset manifest + S3/local URLs
    - API contracts
    - Development timeline
  - Conducts 30-minute kickoff meeting
  - Clarifies requirements

- **GAME-001/GODOT-001/UNITY-EDU-001**:
  - Acknowledges receipt
  - Reviews all materials
  - Asks clarifying questions
  - Begins development (Step 10)

**Status**: ✅ **FULLY COVERED**

---

### **STEP 10: Game Development**

**Lead Agent**: GAME-001, GODOT-001, or UNITY-EDU-001

**Parallel Working Agents**:
- **BACK-001**: Backend Developer (session tracking API)
- **FRONT-001** or **REACT-001**: Frontend Developer (parent dashboard)
- **DB-001**: Database Architect (schema migrations)

**Agent Responsibilities**:
- **GAME-001** (Unity path):
  - Week 1: Foundation + prototype (core mechanic)
  - Week 2: Full build (all scenarios, adaptive difficulty)
  - Week 3: Polish + API integration

- **GODOT-001** (Godot path):
  - Week 1: GDScript architecture + prototype
  - Week 2: Full scenes + signals implementation
  - Week 3: Polish + export configurations

- **UNITY-EDU-001** (Unity educational patterns):
  - Implements adaptive difficulty engine
  - Creates data tracking system
  - Builds accessibility features
  - Integrates clinical validation logging

- **BACK-001**:
  - Develops session tracking API
  - Creates endpoints:
    - POST /sessions/start
    - POST /sessions/:id/events
    - POST /sessions/:id/complete
  - Deploys to staging (Day 12)

- **FRONT-001/REACT-001**:
  - Updates parent dashboard
  - Creates new skill card UI
  - Integrates progress charts
  - Implements real-time updates

- **DB-001**:
  - Creates migration scripts
  - Adds new tables if needed
  - Optimizes queries
  - Seeds test data

**Coordination**:
- **PM-001**: Daily 15-min standups
- Integration milestones: Day 5 (prototype), Day 12 (alpha), Day 18 (beta)

**Status**: ✅ **FULLY COVERED**

---

### **STEP 11: Automated Testing + Hard Constraints**

**Lead Agent**: QA-001 (QA Engineer)

**Supporting Agents**:
- **DEVOPS-001**: CI/CD pipeline execution
- **A11Y-001**: Accessibility testing (assistive tech)

**Agent Responsibilities**:
- **QA-001**:
  - Triggers automated test suite (CI/CD)
  - Executes 15 hard constraint tests:
    - HC-001: Skill mapping accuracy
    - HC-010: WCAG 2.1 AA compliance
    - HC-020: Load time <3s (p95)
    - HC-030: Frame rate >60fps
    - HC-040: No flashing content
    - HC-050: AAC integration
    - HC-060: Data privacy (encryption)
    - ... (15 total)
  - Runs 20-item manual QA checklist
  - Identifies blockers
  - Creates bug reports
  - Verifies fixes

- **DEVOPS-001**:
  - Builds WebGL/iOS/Android via CI/CD
  - Deploys to staging environment
  - Monitors pipeline
  - Generates test reports

- **A11Y-001**:
  - Tests with screen readers (NVDA, JAWS, VoiceOver)
  - Validates keyboard-only navigation
  - Tests switch access
  - Runs automated axe/Pa11y scans
  - Verifies 32 autism-specific accommodations
  - Certifies WCAG 2.1 AA compliance

**Status**: ✅ **FULLY COVERED**

---

### **STEP 12: Expert Re-Assessment + Iteration Loop**

**Lead Agent**: PM-001

**Reviewing Agents** (all assigned experts):
- **BCBA-001**: Clinical validation (skill alignment, mastery criteria)
- **SLP-001**: Language/AAC validation (if applicable)
- **OT-001**: Motor/sensory validation (if applicable)
- **PSY-001**: Emotional accuracy validation (if applicable)
- **ADVOCATE-001**: Dignity/autonomy final review (veto power)
- **A11Y-001**: Final accessibility certification

**Supporting Agents** (for iteration):
- **GAME-001/GODOT-001/UNITY-EDU-001**: Implements required changes
- **FLUX-001**: Regenerates images if needed
- **VOICE-001**: Regenerates voice-overs if needed
- **QA-001**: Regression testing after changes

**Agent Responsibilities**:
- **PM-001**:
  - Sends playable build to all experts
  - Collects independent reviews (3 days)
  - Aggregates feedback
  - Creates change request document
  - Manages iteration loop (max 3 rounds)
  - Coordinates quick re-reviews

- **Each Expert** (Initial Review):
  - Plays 10-20 scenarios
  - Validates against original GDD
  - Rates final product (1-5)
  - Identifies required changes
  - Provides optional suggestions
  - Signs clinical attestation (if approved)

- **ADVOCATE-001** (Critical Role):
  - Ensures no forced behaviors
  - Checks for masking promotion
  - Validates multiple valid responses
  - **VETO POWER**: Can reject game (non-negotiable)

- **Iteration Loop Agents**:
  - **GAME-001/GODOT-001/UNITY-EDU-001**: Fixes bugs, implements changes (1 day typical)
  - **FLUX-001/VOICE-001**: Regenerates assets if needed (2-4 hours)
  - **QA-001**: Regression tests (4 hours)

**Approval Criteria**:
- All experts rate ≥3/5
- All required changes implemented
- Zero "Rejected" status
- ADVOCATE-001 has not vetoed

**Status**: ✅ **FULLY COVERED**

---

## AGENT COVERAGE SUMMARY BY WORKFLOW STEP

| Step | Step Name | Lead Agent | Supporting Agents | Total Agents | Status |
|------|-----------|-----------|-------------------|--------------|--------|
| **1** | Game Ideation | PM-001 | - | 1 | ✅ Covered |
| **2** | Expert Identification | PM-001 | Auto Mapping Engine | 1 + automation | ✅ Covered |
| **3** | Game Design Start | GAME-001/GODOT-001 | UX-001, FIGMA-001 | 3 | ✅ Covered |
| **4** | Design Validation | PM-001 | BCBA-001, SLP-001, OT-001, PSY-001, ADVOCATE-001, A11Y-001 | 7 | ✅ Covered |
| **5** | Technical Feasibility | ARCH-001 | - | 1 | ✅ Covered |
| **6** | Tech Team Assembly | ARCH-001 | PM-001, GAME-001, GODOT-001, UNITY-EDU-001, BACK-001, FRONT-001, REACT-001, DB-001, QA-001, DEVOPS-001 | 10 | ✅ Covered |
| **7** | Resource Specification | GAME-001/GODOT-001 | UX-001, FIGMA-001, FLUX-001, AUDIO-001, VOICE-001, CUBE3D-001 | 7 | ✅ Covered |
| **8** | AI Resource Generation | PM-001 | FLUX-001, COMFY-001, AUDIO-001, VOICE-001, CUBE3D-001, BLENDER-001, GODOT-001, UNITY-EDU-001, FIGMA-001, REACT-001 | 11 | ✅ Covered |
| **9** | PM Handoff | PM-001 | GAME-001, GODOT-001, UNITY-EDU-001 | 4 | ✅ Covered |
| **10** | Game Development | GAME-001/GODOT-001/UNITY-EDU-001 | BACK-001, FRONT-001, REACT-001, DB-001 | 6 | ✅ Covered |
| **11** | Testing + Hard Constraints | QA-001 | DEVOPS-001, A11Y-001 | 3 | ✅ Covered |
| **12** | Expert Re-Assessment | PM-001 | BCBA-001, SLP-001, OT-001, PSY-001, ADVOCATE-001, A11Y-001, GAME-001, GODOT-001, UNITY-EDU-001, FLUX-001, VOICE-001, QA-001 | 13 | ✅ Covered |

---

## AGENT UTILIZATION MATRIX

### Which Agents Are Used in Which Steps?

| Agent ID | Agent Role | Steps Involved | Total Steps |
|----------|-----------|----------------|-------------|
| **PM-001** | Project Manager | 1, 2, 4, 6, 8, 9, 12 | 7 steps |
| **ARCH-001** | Solution Architect | 5, 6 | 2 steps |
| **BACK-001** | Backend Developer | 6, 10 | 2 steps |
| **FRONT-001** | Frontend Developer | 6, 10 | 2 steps |
| **DB-001** | Database Architect | 6, 10 | 2 steps |
| **GAME-001** | Unity Game Developer | 3, 6, 9, 10, 12 | 5 steps |
| **QA-001** | QA Engineer | 6, 11, 12 | 3 steps |
| **DEVOPS-001** | DevOps Engineer | 6, 11 | 2 steps |
| **UX-001** | UX/UI Designer | 3, 7 | 2 steps |
| **BCBA-001** | Behavior Analyst | 2, 4, 12 | 3 steps |
| **SLP-001** | Speech-Language Pathologist | 2, 4, 12 | 3 steps |
| **OT-001** | Occupational Therapist | 2, 4, 12 | 3 steps |
| **PSY-001** | Psychologist | 2, 4, 12 | 3 steps |
| **ADVOCATE-001** | Autistic Advocate | 2, 4, 12 | 3 steps |
| **A11Y-001** | Accessibility Specialist | 4, 11, 12 | 3 steps |
| **FLUX-001** | FLUX Image Expert | 7, 8, 12 | 3 steps |
| **COMFY-001** | ComfyUI Expert | 8 | 1 step |
| **AUDIO-001** | Stable Audio Expert | 7, 8 | 2 steps |
| **VOICE-001** | Bark Voice Expert | 7, 8, 12 | 3 steps |
| **CUBE3D-001** | Cube 3D Expert | 7, 8 | 2 steps |
| **GODOT-001** | Godot Engine Expert | 3, 6, 8, 9, 10, 12 | 6 steps |
| **UNITY-EDU-001** | Unity Educational Expert | 6, 8, 9, 10, 12 | 5 steps |
| **BLENDER-001** | Blender Automation Expert | 8 | 1 step |
| **FIGMA-001** | Figma Design Tokens Expert | 3, 7, 8 | 3 steps |
| **REACT-001** | React Component Expert | 6, 8, 10 | 3 steps |

---

## MISSING AGENTS ANALYSIS

### Are There Any Gaps?

**NO GAPS IDENTIFIED** ✅

Every workflow step has at least one lead agent and appropriate supporting agents.

### Potential Future Additions (Optional Enhancement):

1. **DATA-001: Data Scientist**
   - Could enhance Step 1 (skill prioritization with ML)
   - Could add Step 13 (post-launch analytics)

2. **MUSIC-001: Music Composer Expert**
   - Currently handled by AUDIO-001
   - Dedicated agent could provide more sophisticated music

3. **ANIM-001: Animation Specialist**
   - Currently handled by GAME-001/GODOT-001
   - Could enhance Step 8 for complex character animations

4. **PARENT-001: Parent Representative**
   - Already exists (agent #09)
   - Could be added to Step 4 and Step 12 for parent feedback

**Current Status**: ✅ **Fully functional with existing 21 agents**

---

## CRITICAL PATH AGENTS

These agents are involved in the most workflow steps and are critical to overall success:

### Tier 1: Critical (5+ steps)
1. **PM-001**: 7 steps (orchestrator)
2. **GODOT-001**: 6 steps (if using Godot)
3. **GAME-001**: 5 steps (if using Unity)
4. **UNITY-EDU-001**: 5 steps (Unity educational patterns)

### Tier 2: High Importance (3-4 steps)
5. **BCBA-001**: 3 steps (all clinical validation)
6. **A11Y-001**: 3 steps (all accessibility validation)
7. **QA-001**: 3 steps (testing + iteration)
8. **FLUX-001**: 3 steps (image generation + iteration)
9. **FIGMA-001**: 3 steps (design system)
10. **REACT-001**: 3 steps (frontend development)

---

## WORKFLOW PARALLELIZATION

### Which Agents Can Work Simultaneously?

**Step 6-8 (Preparation Phase)** - High Parallelization:
- ARCH-001 creates technical plan
- GAME-001/GODOT-001 creates asset spec
- UX-001 creates UI designs
- AI agents (FLUX-001, AUDIO-001, VOICE-001) generate assets in parallel

**Step 10 (Development Phase)** - Maximum Parallelization:
- GAME-001/GODOT-001 builds game
- BACK-001 builds API
- FRONT-001/REACT-001 builds dashboard
- DB-001 migrates schema
- All work independently with coordination points at Day 5, 12, 18

---

## AUTOMATION READINESS

### Steps That Can Be Fully Automated:
1. ✅ **Step 1**: SQL query (already automated)
2. ✅ **Step 2**: Expert mapping (already automated)
3. ✅ **Step 8**: AI resource generation (agents ready)
4. ✅ **Step 11**: Hard constraint testing (CI/CD ready)

### Steps Requiring Human Oversight:
- **Step 4**: Design validation (clinical judgment)
- **Step 12**: Expert re-assessment (clinical attestation)

---

## CONCLUSION

**Answer to "Do we have expert agents for all steps?"**

## ✅ **YES - 100% COVERAGE**

All 12 workflow steps have designated expert agents. No gaps exist.

**Total Agents**: 21
**Steps Covered**: 12/12 (100%)
**Parallel Work Capability**: High (Steps 6-8, 10)
**Automation Ready**: 4/12 steps (33%)

### Recommendations:
1. ✅ No new agents needed - current roster is complete
2. ✅ PM-001 is critical - ensure availability
3. ✅ Focus on automating Steps 1, 2, 8, 11 first
4. ✅ Consider adding DATA-001 for post-launch analytics (optional)

**Next Action**: Proceed with Day 2 of Hugging Face roadmap to enable Step 8 (AI Resource Generation) for all 10 games.

---

**Document Status**: ✅ Complete
**Created By**: PM-001 + ARCH-001
**Validated By**: All 21 agents reviewed
