# COMPLETE AGENT WORKFLOW SYSTEM

**Project**: SkillBridge Autism Educational Gaming Platform
**Agent System**: 12 Specialist Agents
**Status**: Fully Operational
**Date**: October 10, 2025

---

## TABLE OF CONTENTS

1. [Workflow Overview](#workflow-overview)
2. [User → PM Command Flow](#user--pm-command-flow)
3. [PM Delegation Logic](#pm-delegation-logic)
4. [Agent-to-Agent Handoff Protocols](#agent-to-agent-handoff-protocols)
5. [Color-Coded Status System](#color-coded-status-system)
6. [Common Workflow Scenarios](#common-workflow-scenarios)
7. [Escalation & Conflict Resolution](#escalation--conflict-resolution)
8. [Communication Protocols](#communication-protocols)

---

## WORKFLOW OVERVIEW

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
│              (Gives commands to PM Agent)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              PM-001: SENIOR PROJECT MANAGER                  │
│        (Orchestrates, Plans, Delegates, Tracks)              │
│                                                              │
│  Tools: GitHub Projects, Taiga, GitLab CE                    │
│  Status: Color-coded 8-state system                          │
└────────┬───────────┬───────────┬────────────┬───────────────┘
         │           │           │            │
         ▼           ▼           ▼            ▼
┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐
│  TECHNICAL  │ │ CLINICAL │ │  FAMILY  │ │   QUALITY    │
│   AGENTS    │ │  AGENTS  │ │  VOICE   │ │  ASSURANCE   │
└─────────────┘ └──────────┘ └──────────┘ └──────────────┘
       │              │            │              │
       ▼              ▼            ▼              ▼
┌──────────────────────────────────────────────────────────┐
│ • ARCH-001 (Solution Architect)                          │
│ • BACK-001 (Backend Developer)                           │
│ • FRONT-001 (Frontend Developer)                         │
│ • DB-001 (Database Architect)                            │
│ • GAME-001 (Game Developer)                              │
│ • BCBA-001 (Clinical Expert)                             │
│ • SLP-001 (Speech/Language)                              │
│ • OT-001 (Sensory/Motor)                                 │
│ • PARENT-001 (Parent Representative)                     │
│ • ADVOCATE-001 (Autistic Adult)                          │
│ • QA-001 (QA Engineer)                                   │
└──────────────────────────────────────────────────────────┘
```

### Workflow Principles

1. **User → PM Only**: Users never directly command specialist agents; all commands go through PM-001
2. **PM Orchestrates**: PM-001 breaks down commands, creates tasks, assigns agents, tracks progress
3. **Color-Coded Transparency**: All tasks tracked with 8-state color system
4. **Parallel Execution**: Independent tasks run concurrently across agents
5. **Clinical Validation Loop**: All educational content reviewed by BCBA/SLP/OT before deployment
6. **Family Input Loop**: All parent-facing features reviewed by PARENT-001 and ADVOCATE-001
7. **Quality Gate**: QA-001 tests all features before marking DONE

---

## USER → PM COMMAND FLOW

### Step-by-Step Process

```
┌────────────────────────────────────────────────────────────────┐
│ STEP 1: USER GIVES COMMAND                                     │
└────────────────────────────────────────────────────────────────┘
User: "Build a login feature with Google OAuth"
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│ STEP 2: PM RECEIVES & ANALYZES COMMAND                         │
└────────────────────────────────────────────────────────────────┘
PM-001:
  ├─ Parse intent: "User authentication system needed"
  ├─ Identify scope: Login UI, OAuth integration, user database
  ├─ Assess complexity: Medium (18 story points)
  ├─ Check dependencies: Database schema needed first
  └─ Estimate timeline: 1 sprint (2 weeks)
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│ STEP 3: PM CREATES PROJECT PLAN                                │
└────────────────────────────────────────────────────────────────┘
PM-001 creates in GitHub Projects:
  ├─ Epic: "User Authentication System"
  ├─ User Stories:
  │   ├─ "As a parent, I can log in with Google" (5 pts)
  │   ├─ "As a user, I stay logged in across sessions" (3 pts)
  │   ├─ "As a user, I can securely log out" (2 pts)
  │   └─ "As an admin, I can view user login activity" (8 pts)
  └─ Tasks (18 total, assigned to agents below)
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│ STEP 4: PM DELEGATES TO SPECIALIST AGENTS                      │
└────────────────────────────────────────────────────────────────┘
PM-001 assigns:
  ├─→ ARCH-001: "Design OAuth architecture" → 🔵 PLANNING
  ├─→ DB-001: "Create users table schema" → 🟡 READY
  ├─→ BACK-001: "Implement OAuth callback API" → 🟠 BLOCKED (needs ARCH-001)
  ├─→ FRONT-001: "Build login UI component" → 🟠 BLOCKED (needs BACK-001)
  ├─→ BCBA-001: "Review login UX for autism-friendliness" → 🟡 READY
  └─→ QA-001: "Write auth flow E2E tests" → 🟠 BLOCKED (needs implementation)
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│ STEP 5: AGENTS EXECUTE TASKS                                   │
└────────────────────────────────────────────────────────────────┘
(See detailed workflows below)
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│ STEP 6: PM TRACKS PROGRESS & UNBLOCKS                          │
└────────────────────────────────────────────────────────────────┘
PM-001 monitors daily:
  ├─ ARCH-001 completes architecture → ✅ DONE
  ├─ PM updates: BACK-001 → 🟡 READY (unblocked)
  ├─ BACK-001 starts work → 🟢 IN PROGRESS
  ├─ BACK-001 completes API → 🟣 IN REVIEW (awaiting QA)
  └─ (Continue until all tasks DONE)
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│ STEP 7: PM REPORTS TO USER                                     │
└────────────────────────────────────────────────────────────────┘
PM-001: "✅ Login feature complete!
  • Google OAuth integration: ✅ DONE
  • Login UI (WCAG AA compliant): ✅ DONE
  • Session persistence: ✅ DONE
  • E2E tests (100% pass): ✅ DONE
  • Clinical review (autism-friendly): ✅ APPROVED
  📊 Deployed to staging: https://staging.skillbridge.com/login"
```

---

## PM DELEGATION LOGIC

### Decision Tree: Which Agents to Assign?

PM-001 uses this logic to delegate tasks:

```yaml
command_analysis:
  keywords_detected: ["login", "Google OAuth", "authentication"]

  delegation_rules:
    - IF (new_architecture_needed):
        ASSIGN: ARCH-001 (Solution Architect)
        PRIORITY: HIGH
        BLOCKS: [BACK-001, FRONT-001]

    - IF (database_schema_change):
        ASSIGN: DB-001 (Database Architect)
        PRIORITY: HIGH
        BLOCKS: [BACK-001]

    - IF (backend_api_needed):
        ASSIGN: BACK-001 (Backend Developer)
        PRIORITY: MEDIUM
        DEPENDS_ON: [ARCH-001, DB-001]

    - IF (frontend_ui_needed):
        ASSIGN: FRONT-001 (Frontend Developer)
        PRIORITY: MEDIUM
        DEPENDS_ON: [BACK-001]

    - IF (game_content):
        ASSIGN: GAME-001 (Game Developer)
        PRIORITY: MEDIUM

    - IF (educational_content OR skill_validation):
        ASSIGN: BCBA-001 (Clinical Expert)
        PRIORITY: HIGH
        REVIEW_TYPE: "clinical_validation"

    - IF (communication_skills OR aac):
        ASSIGN: SLP-001 (Speech/Language)
        PRIORITY: HIGH
        REVIEW_TYPE: "clinical_validation"

    - IF (sensory_content OR motor_skills):
        ASSIGN: OT-001 (Sensory/Motor)
        PRIORITY: HIGH
        REVIEW_TYPE: "clinical_validation"

    - IF (parent_facing_feature):
        ASSIGN: PARENT-001 (Parent Representative)
        PRIORITY: MEDIUM
        REVIEW_TYPE: "usability_testing"

    - IF (autism_accommodations OR neurodiversity):
        ASSIGN: ADVOCATE-001 (Autistic Adult)
        PRIORITY: HIGH
        REVIEW_TYPE: "neurodiversity_review"

    - IF (ANY implementation):
        ASSIGN: QA-001 (QA Engineer)
        PRIORITY: CRITICAL
        WHEN: "after_implementation"
        BLOCKS: "deployment"
```

### Priority Assignment Matrix

| Agent Type | When to Assign | Priority Level | Typical Dependencies |
|------------|---------------|----------------|---------------------|
| **ARCH-001** | New features, system changes | 🔴 CRITICAL (first) | None (blocks others) |
| **DB-001** | Schema changes, data model | 🔴 CRITICAL (first) | None (blocks BACK) |
| **BACK-001** | API endpoints, business logic | 🟠 HIGH | ARCH-001, DB-001 |
| **FRONT-001** | UI components, user flows | 🟠 HIGH | BACK-001 |
| **GAME-001** | Educational games | 🟡 MEDIUM | BCBA-001 (clinical validation) |
| **BCBA-001** | Educational content, skill validation | 🔴 CRITICAL (review) | None (validates others) |
| **SLP-001** | Communication/language content | 🔴 CRITICAL (review) | None (validates others) |
| **OT-001** | Sensory/motor content | 🔴 CRITICAL (review) | None (validates others) |
| **PARENT-001** | Parent-facing features | 🟡 MEDIUM (review) | After technical implementation |
| **ADVOCATE-001** | Autism accommodations | 🟠 HIGH (review) | After clinical validation |
| **QA-001** | All implementations | 🔴 CRITICAL (final gate) | After all implementation |

---

## AGENT-TO-AGENT HANDOFF PROTOCOLS

### Handoff Format: YAML Standard

All agents communicate using structured YAML messages in GitHub Projects/Taiga:

```yaml
handoff:
  from_agent: "ARCH-001"
  to_agent: "BACK-001"
  task_id: "TASK-123"
  status: "READY_FOR_IMPLEMENTATION"

  deliverables:
    - architecture_doc: "/docs/oauth-architecture.md"
    - api_contracts: "/docs/api/auth-endpoints.yaml"
    - sequence_diagrams: "/docs/diagrams/oauth-flow.png"

  instructions:
    - "Implement OAuth callback endpoint at POST /api/v1/auth/google/callback"
    - "Use jwt library for token generation (example in architecture doc)"
    - "Store refresh tokens in users table (schema approved by DB-001)"

  acceptance_criteria:
    - "User can authenticate with Google OAuth 2.0"
    - "JWT tokens expire after 1 hour, refresh after 30 days"
    - "Failed auth returns 401 with clear error message"

  dependencies_completed:
    - ARCH-001: "OAuth architecture design" ✅
    - DB-001: "Users table with oauth_provider field" ✅

  estimated_effort: "8 hours"
  priority: "HIGH"
  deadline: "2025-10-15"
```

### Common Handoff Sequences

#### 1. **Feature Development Flow**

```
ARCH-001 (Architecture)
    │
    ├─→ Deliverable: System design, API contracts, data models
    │
    ▼
DB-001 (Database Schema)
    │
    ├─→ Deliverable: SQL migrations, schema diagrams
    │
    ▼
BACK-001 (Backend API)
    │
    ├─→ Deliverable: REST endpoints, business logic, tests
    │
    ▼
FRONT-001 (Frontend UI)
    │
    ├─→ Deliverable: React components, state management
    │
    ▼
QA-001 (Testing)
    │
    ├─→ Deliverable: E2E tests, accessibility tests, bug reports
    │
    ▼
✅ DONE (Deployed to production)
```

#### 2. **Clinical Validation Flow (Educational Content)**

```
GAME-001 (Game Development)
    │
    ├─→ Deliverable: Unity game prototype
    │
    ▼
BCBA-001 (Clinical Review)
    │
    ├─→ Deliverable: Skill mapping, educational validation
    │   ├─ APPROVE → Continue
    │   └─ REVISIONS NEEDED → Back to GAME-001
    │
    ▼
SLP-001 (Communication Review) [if communication skills]
    │
    ├─→ Deliverable: Language appropriateness, AAC compatibility
    │
    ▼
OT-001 (Sensory Review) [if sensory/motor content]
    │
    ├─→ Deliverable: Sensory accommodations, motor accessibility
    │
    ▼
PARENT-001 (Parent Usability)
    │
    ├─→ Deliverable: Real-world feasibility, parent feedback
    │
    ▼
ADVOCATE-001 (Neurodiversity Review)
    │
    ├─→ Deliverable: Autism-affirming language, autonomy respect
    │
    ▼
QA-001 (Final Testing)
    │
    ▼
✅ DONE (Deployed)
```

#### 3. **Bug Fix Flow**

```
QA-001 (Bug Discovery)
    │
    ├─→ Deliverable: Bug report, reproduction steps
    │
    ▼
PM-001 (Triage & Assignment)
    │
    ├─→ Severity: P0 (Critical), P1 (High), P2 (Medium), P3 (Low)
    ├─→ Assign to: BACK-001, FRONT-001, or GAME-001 (depending on bug location)
    │
    ▼
Developer Agent (Fix Implementation)
    │
    ├─→ Deliverable: Bug fix, regression test
    │
    ▼
QA-001 (Verification)
    │
    ├─→ Verify fix, run regression suite
    │   ├─ PASS → ✅ DONE
    │   └─ FAIL → Back to Developer
```

---

## COLOR-CODED STATUS SYSTEM

### 8-State System

PM-001 uses this color-coded system across all tasks in GitHub Projects, Taiga, GitLab:

| Icon | Status | Color | Meaning | Next Actions | Who Updates |
|------|--------|-------|---------|--------------|-------------|
| 🔵 | **PLANNING** | Blue | Requirements gathering, architecture design | Define requirements, create design docs | PM-001, ARCH-001 |
| 🟡 | **READY** | Yellow | Task defined, ready to start, no blockers | Assign to agent, agent starts work | PM-001 |
| 🟢 | **IN PROGRESS** | Green | Agent actively working on task | Agent completes work, moves to review | Agent |
| 🟣 | **IN REVIEW** | Purple | Code/content under review (QA, clinical, peer) | Reviewers approve or request changes | QA-001, Clinical Agents |
| 🟠 | **BLOCKED** | Orange | Cannot proceed due to dependency or issue | PM unblocks, resolves dependency | PM-001 |
| 🔴 | **AT RISK** | Red | Behind schedule, may miss deadline | PM escalates, reassigns, or adjusts timeline | PM-001 |
| ✅ | **DONE** | Green Check | Completed, tested, deployed | Archive, celebrate | PM-001 |
| ❌ | **CANCELED** | Red X | No longer needed, deprioritized | Document reason, archive | PM-001 |

### Status Transition Rules

```yaml
status_transitions:
  PLANNING:
    next_states: [READY, CANCELED]
    trigger: "Requirements finalized"
    updated_by: PM-001

  READY:
    next_states: [IN_PROGRESS, BLOCKED, CANCELED]
    trigger: "Agent starts work OR dependency blocks"
    updated_by: PM-001, Agent

  IN_PROGRESS:
    next_states: [IN_REVIEW, BLOCKED, AT_RISK]
    trigger: "Agent completes work OR blocker arises"
    updated_by: Agent

  IN_REVIEW:
    next_states: [DONE, IN_PROGRESS, AT_RISK]
    trigger: "Review approved OR changes requested"
    updated_by: QA-001, Clinical Agents

  BLOCKED:
    next_states: [READY, IN_PROGRESS, CANCELED]
    trigger: "PM resolves blocker"
    updated_by: PM-001

  AT_RISK:
    next_states: [IN_PROGRESS, BLOCKED, CANCELED]
    trigger: "PM escalates, reassigns, or adjusts"
    updated_by: PM-001

  DONE:
    next_states: [IN_PROGRESS] # rare: reopen if regression
    trigger: "Deployed to production"
    updated_by: PM-001

  CANCELED:
    next_states: [READY] # rare: reprioritized
    trigger: "Deprioritized or no longer needed"
    updated_by: PM-001
```

### GitHub Projects Automation

PM-001 configures GitHub Projects with automated status updates:

```yaml
# .github/workflows/project-automation.yml
name: Project Status Automation

on:
  pull_request:
    types: [opened, closed, ready_for_review]
  issues:
    types: [opened, closed, assigned]

jobs:
  update-status:
    runs-on: ubuntu-latest
    steps:
      - name: Move to IN PROGRESS when assigned
        if: github.event.action == 'assigned'
        run: gh project item-edit --status "🟢 In Progress"

      - name: Move to IN REVIEW when PR opened
        if: github.event.action == 'opened'
        run: gh project item-edit --status "🟣 In Review"

      - name: Move to DONE when PR merged
        if: github.event.pull_request.merged == true
        run: gh project item-edit --status "✅ Done"
```

---

## COMMON WORKFLOW SCENARIOS

### Scenario 1: Build Login Feature with Google OAuth

**User Command**: "Build login feature with Google OAuth"

```yaml
workflow:
  sprint: "Sprint 1 (Oct 10-24, 2025)"
  total_points: 18
  duration: 2 weeks

  day_1:
    - PM-001: Create Epic "User Authentication System"
    - PM-001: Break down into 6 user stories (18 points total)
    - PM-001: Assign tasks:
        - ARCH-001: "Design OAuth architecture" → 🔵 PLANNING
        - DB-001: "Create users table schema" → 🟡 READY
        - BACK-001: "Implement OAuth API" → 🟠 BLOCKED (needs ARCH-001)
        - FRONT-001: "Build login UI" → 🟠 BLOCKED (needs BACK-001)
        - BCBA-001: "Review login UX" → 🟡 READY
        - QA-001: "Write auth tests" → 🟠 BLOCKED (needs implementation)

  day_2-3:
    - ARCH-001: Design OAuth flow (Google OAuth 2.0, JWT tokens)
      STATUS: 🔵 PLANNING → 🟢 IN PROGRESS → 🟣 IN REVIEW
    - PM-001: Review architecture with ARCH-001
      RESULT: ✅ APPROVED
    - ARCH-001: 🟣 IN REVIEW → ✅ DONE
    - PM-001: Unblock BACK-001 → 🟠 BLOCKED → 🟡 READY

  day_3-5:
    - DB-001: Create users table with oauth_provider, oauth_id columns
      STATUS: 🟡 READY → 🟢 IN PROGRESS → 🟣 IN REVIEW
    - BACK-001: Implement POST /api/v1/auth/google/callback
      STATUS: 🟡 READY → 🟢 IN PROGRESS
      CODE:
        - Express route for OAuth callback
        - JWT token generation (1hr expiry, 30d refresh)
        - Store user in PostgreSQL users table
    - BACK-001: Complete API implementation
      STATUS: 🟢 IN PROGRESS → 🟣 IN REVIEW

  day_6-8:
    - QA-001: Test backend API (unit + integration)
      RESULT: ✅ 95% coverage, all tests pass
    - BACK-001: 🟣 IN REVIEW → ✅ DONE
    - PM-001: Unblock FRONT-001 → 🟠 BLOCKED → 🟡 READY

    - FRONT-001: Build React login component
      STATUS: 🟡 READY → 🟢 IN PROGRESS
      CODE:
        - Login button with Google logo
        - OAuth redirect flow
        - Token storage in localStorage
        - Protected route wrapper
    - FRONT-001: Complete UI implementation
      STATUS: 🟢 IN PROGRESS → 🟣 IN REVIEW

  day_9-10:
    - BCBA-001: Review login UX for autism-friendliness
      FEEDBACK:
        ✅ "Clear single button - no visual clutter"
        ✅ "Login persists across sessions - reduces frustration"
        ⚠️ "Add text label next to Google logo for clarity"
      STATUS: 🟣 IN REVIEW → 🟢 IN PROGRESS (FRONT-001 adds text)

    - FRONT-001: Add "Sign in with Google" text label
      STATUS: 🟢 IN PROGRESS → 🟣 IN REVIEW

    - BCBA-001: Re-review
      RESULT: ✅ APPROVED
    - FRONT-001: 🟣 IN REVIEW → ✅ DONE

  day_11-12:
    - QA-001: E2E testing with Playwright
      TESTS:
        ✅ User can click "Sign in with Google"
        ✅ OAuth redirect to Google
        ✅ Callback stores JWT token
        ✅ User redirected to dashboard
        ✅ User stays logged in on refresh
        ✅ Logout clears token
      ACCESSIBILITY:
        ✅ WCAG 2.1 AA compliant (axe-core 100%)
        ✅ Keyboard navigation works
        ✅ Screen reader announces "Sign in with Google button"
      STATUS: 🟣 IN REVIEW → ✅ DONE

  day_13:
    - PM-001: Deploy to staging
      URL: https://staging.skillbridge.com/login
    - PM-001: Mark Epic ✅ DONE
    - PM-001: Report to user:
        "✅ Login feature complete!
        • Google OAuth integration: ✅ DONE
        • Login UI (WCAG AA): ✅ DONE
        • Session persistence: ✅ DONE
        • E2E tests (100% pass): ✅ DONE
        • Clinical review (BCBA-approved): ✅ DONE
        📊 Deployed: https://staging.skillbridge.com/login"

  day_14:
    - PM-001: Sprint retrospective
    - PM-001: Update velocity: 18 points completed / 2 weeks = 9 pts/week
```

---

### Scenario 2: Develop Emotion Recognition Game

**User Command**: "Create emotion recognition game for communication skills"

```yaml
workflow:
  sprint: "Sprint 2 (Oct 24 - Nov 7, 2025)"
  total_points: 34
  duration: 2 weeks

  phase_1_clinical_validation: # Days 1-3
    - PM-001: Create Epic "Emotion Recognition Game (ABLLS-R C1-C5)"
    - PM-001: Assign clinical experts FIRST (validate educational value):
        - BCBA-001: "Map to ABLLS-R skills" → 🟡 READY
        - SLP-001: "Define communication targets" → 🟡 READY
        - OT-001: "Design sensory accommodations" → 🟡 READY

    - BCBA-001: Map game to ABLLS-R skills
      DELIVERABLE:
        - Skill C1: "Identifies happy, sad, angry, scared faces (photos)"
        - Skill C2: "Matches emotion face to situation (e.g., birthday = happy)"
        - Skill C3: "Labels emotions verbally or with AAC"
        - Skill C4: "Demonstrates emotion with facial expression"
        - Skill C5: "Explains why person feels emotion"
      DATA_COLLECTION:
        - Track correct identifications (mastery = 80% over 3 sessions)
        - Track generalization across different faces (diverse photos)
      STATUS: 🟡 READY → 🟢 IN PROGRESS → ✅ DONE

    - SLP-001: Define communication targets
      DELIVERABLE:
        - AAC integration: Game works with touch, switch, eye-gaze
        - Vocabulary: happy, sad, angry, scared, surprised, disgusted
        - Pragmatic language: "He feels ___ because ___"
        - Receptive language: "Show me happy face"
        - Expressive language: "Tell me how he feels"
      STATUS: 🟡 READY → 🟢 IN PROGRESS → ✅ DONE

    - OT-001: Design sensory accommodations
      DELIVERABLE:
        - Visual sensitivity: Option for muted colors, low contrast
        - Auditory sensitivity: Volume control, option to mute
        - Motor access: Large touch targets (min 44x44px)
        - Sensory breaks: Built-in 10-second breaks every 5 questions
      STATUS: 🟡 READY → 🟢 IN PROGRESS → ✅ DONE

  phase_2_design_architecture: # Days 4-5
    - PM-001: Unblock design/dev agents after clinical approval
    - PM-001: Assign:
        - ARCH-001: "Design game architecture" → 🟡 READY
        - GAME-001: "Create Unity prototype" → 🟠 BLOCKED (needs ARCH-001)
        - DB-001: "Design game_sessions table" → 🟡 READY

    - ARCH-001: Design game architecture
      DELIVERABLE:
        - Unity WebGL build (browser-based, no download)
        - SkillBridge API integration for progress tracking
        - Sensory profile settings loaded from user preferences
        - Data model: game_sessions, skill_attempts, mastery_tracking
      STATUS: 🟡 READY → 🟢 IN PROGRESS → ✅ DONE

    - DB-001: Create game_sessions table
      SQL:
        ```sql
        CREATE TABLE game_sessions (
          id UUID PRIMARY KEY,
          user_id UUID REFERENCES users(id),
          game_type VARCHAR(50) DEFAULT 'emotion_recognition',
          skill_ids UUID[] REFERENCES skills(id),
          attempts JSONB, -- {question_id, correct, time_ms}
          score INT,
          mastery_level DECIMAL(3,2), -- 0.00 to 1.00
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        ```
      STATUS: 🟡 READY → 🟢 IN PROGRESS → ✅ DONE

  phase_3_game_development: # Days 6-9
    - PM-001: Unblock GAME-001 → 🟠 BLOCKED → 🟡 READY

    - GAME-001: Implement Unity game
      FEATURES:
        - 10 questions per session (random faces from diverse photo set)
        - 4 answer choices per question (happy, sad, angry, scared)
        - Immediate feedback (correct = green checkmark + chime, incorrect = try again)
        - Progress bar (1/10, 2/10, ...)
        - Sensory accommodations (muted colors, volume control)
        - End screen: "Great job! You got 8/10 correct!" + mastery chart
      CODE: C# scripts for GameManager, QuestionController, APIClient
      STATUS: 🟡 READY → 🟢 IN PROGRESS → 🟣 IN REVIEW

    - BACK-001: Create game API endpoints
      ENDPOINTS:
        - POST /api/v1/games/sessions (start new session)
        - PUT /api/v1/games/sessions/:id/attempts (record answer)
        - POST /api/v1/games/sessions/:id/complete (end session, calculate mastery)
        - GET /api/v1/users/:id/games/emotion-recognition/progress (parent dashboard)
      STATUS: 🟡 READY → 🟢 IN PROGRESS → ✅ DONE

  phase_4_clinical_review_loop: # Days 10-11
    - BCBA-001: Test Unity prototype
      FEEDBACK:
        ✅ "Correctly maps to ABLLS-R C1-C5"
        ✅ "Data collection tracks mastery (80% = green, <80% = needs practice)"
        ⚠️ "Add option to reduce to 5 questions for children with shorter attention"
      STATUS: 🟣 IN REVIEW → 🟢 IN PROGRESS (GAME-001 adds 5-question mode)

    - GAME-001: Add 5-question mode option
      STATUS: 🟢 IN PROGRESS → 🟣 IN REVIEW

    - BCBA-001: Re-review → ✅ APPROVED

    - SLP-001: Test AAC compatibility
      FEEDBACK:
        ✅ "Works with touch, eye-gaze, switch access"
        ✅ "Large touch targets (50x50px)"
        ⚠️ "Add audio prompts: 'Show me happy face' for non-readers"
      STATUS: 🟣 IN REVIEW → 🟢 IN PROGRESS (GAME-001 adds audio)

    - GAME-001: Add audio prompts
      STATUS: 🟢 IN PROGRESS → 🟣 IN REVIEW

    - SLP-001: Re-review → ✅ APPROVED

    - OT-001: Test sensory accommodations
      FEEDBACK:
        ✅ "Muted color mode excellent for visual sensitivity"
        ✅ "Volume control and mute option present"
        ✅ "10-second breaks between questions"
        ✅ "Large touch targets appropriate for motor challenges"
      STATUS: 🟣 IN REVIEW → ✅ APPROVED

  phase_5_family_review: # Day 12
    - PARENT-001: Beta test with 3 families
      FEEDBACK:
        ✅ "My 5yo loved it! He played 3 times in a row."
        ✅ "Easy to use, no instructions needed"
        ⚠️ "Would love to see progress over time - did he improve?"
      STATUS: 🟣 IN REVIEW → 🟢 IN PROGRESS (FRONT-001 adds progress chart)

    - ADVOCATE-001: Neurodiversity review
      FEEDBACK:
        ✅ "Respects different communication styles (touch, AAC, verbal)"
        ✅ "Doesn't force eye contact or neurotypical expressions"
        ✅ "Celebrates progress without pressuring perfection"
        ✅ "Sensory accommodations respect autistic preferences"
      STATUS: 🟣 IN REVIEW → ✅ APPROVED

    - FRONT-001: Add progress chart to parent dashboard
      CHART: Line graph showing mastery % over time for emotion recognition
      STATUS: 🟡 READY → 🟢 IN PROGRESS → ✅ DONE

  phase_6_qa_deployment: # Days 13-14
    - QA-001: E2E testing
      TESTS:
        ✅ Game loads in WebGL
        ✅ 10 questions presented (or 5 in short mode)
        ✅ Correct answer → green checkmark + chime
        ✅ Incorrect answer → "Try again" message
        ✅ Progress tracked in database
        ✅ Mastery calculation correct (8/10 = 80%)
        ✅ Sensory settings persist across sessions
      ACCESSIBILITY:
        ✅ WCAG 2.1 AA compliant
        ✅ Keyboard navigation
        ✅ Screen reader compatible
        ✅ Touch targets ≥44x44px
      PERFORMANCE:
        ✅ Game loads in <3 seconds
        ✅ API response <200ms (p95)
      STATUS: 🟣 IN REVIEW → ✅ DONE

    - PM-001: Deploy to production
      URL: https://app.skillbridge.com/games/emotion-recognition

    - PM-001: Report to user:
        "✅ Emotion Recognition Game complete!
        📚 Skills: ABLLS-R C1-C5 (emotion identification)
        🎮 Game: Unity WebGL, 10 questions (or 5 short mode)
        ♿ Accessibility: WCAG AA, AAC-compatible, sensory accommodations
        📊 Progress Tracking: Mastery % over time on parent dashboard
        ✅ Clinical Approved: BCBA, SLP, OT validated
        ✅ Family Tested: Parent + Autistic Adult approved
        🚀 Deployed: https://app.skillbridge.com/games/emotion-recognition"
```

---

### Scenario 3: Fix Critical Bug (P0 Severity)

**User Command**: "The game crashes when user selects 'scared' emotion"

```yaml
workflow:
  type: "hotfix"
  severity: P0 (Critical - production down)
  duration: 4-8 hours

  hour_0:
    - User reports bug: "Game crashes on 'scared' emotion"
    - PM-001: Create P0 bug ticket
      TITLE: "[P0] Game crashes on 'scared' emotion selection"
      STATUS: 🔴 AT RISK
      ASSIGNED: GAME-001 (Unity developer)

  hour_0-2:
    - GAME-001: Reproduce bug
      REPRO_STEPS:
        1. Start emotion recognition game
        2. Question 3: "How does he feel?" (shows scared face)
        3. Select "Scared" button
        4. CRASH: "NullReferenceException: Object reference not set to instance"
      ROOT_CAUSE: "Missing audio file for 'scared' emotion feedback"
      CODE_FIX:
        ```csharp
        // BEFORE (line 87, EmotionGame.cs)
        AudioSource.PlayOneShot(feedbackSounds[emotionType]);

        // AFTER (defensive null check)
        if (feedbackSounds.ContainsKey(emotionType) && feedbackSounds[emotionType] != null) {
            AudioSource.PlayOneShot(feedbackSounds[emotionType]);
        } else {
            Debug.LogWarning($"Missing feedback sound for {emotionType}");
        }
        ```
      STATUS: 🔴 AT RISK → 🟢 IN PROGRESS → 🟣 IN REVIEW

  hour_2-3:
    - QA-001: Verify fix
      TESTS:
        ✅ Bug fixed - no crash on "scared" selection
        ✅ Regression test - all 4 emotions work (happy, sad, angry, scared)
        ✅ Audio plays for all emotions (or gracefully skips if missing)
      STATUS: 🟣 IN REVIEW → ✅ DONE

  hour_3-4:
    - PM-001: Emergency deploy to production
      DEPLOYED: v1.0.1 (hotfix)
    - PM-001: Notify user:
        "🔧 HOTFIX DEPLOYED: Game crash on 'scared' emotion
        🐛 Bug: Missing audio file caused crash
        ✅ Fix: Added null check, game now handles missing audio gracefully
        📦 Deployed: v1.0.1 (production)
        ⏱️ Resolution time: 3 hours 45 minutes"

  post_mortem:
    - PM-001: Schedule post-mortem meeting
    - GAME-001: Document root cause
    - QA-001: Add regression test to CI/CD pipeline
    - PM-001: Update checklist: "Verify all audio files uploaded before deploy"
```

---

## ESCALATION & CONFLICT RESOLUTION

### Escalation Pathways

```yaml
escalation_levels:

  level_1_agent_to_pm:
    trigger: "Agent blocked, needs guidance, scope unclear"
    process:
      - Agent: Comment on task: "@PM-001 BLOCKED: Cannot proceed because X"
      - PM-001: Respond within 4 hours (urgent) or 1 business day (normal)
      - PM-001: Unblock by clarifying, reassigning, or escalating

  level_2_clinical_disagreement:
    trigger: "Clinical experts disagree on recommendation"
    example: "BCBA-001 recommends ABA strategy, ADVOCATE-001 objects (harmful)"
    process:
      - Agent: Flag disagreement: "@PM-001 ESCALATION: Clinical conflict"
      - PM-001: Schedule 30-min sync with both agents
      - PM-001: Mediate discussion, find neurodiversity-affirming compromise
      - PM-001: If unresolved, escalate to Autism Clinical Advisory Coordinator (external)

  level_3_technical_blocking_issue:
    trigger: "Technical blocker cannot be resolved by agents"
    example: "PostgreSQL performance issue - queries taking 10+ seconds"
    process:
      - Agent: "@PM-001 ESCALATION: Technical blocker"
      - PM-001: Assess if solvable internally or need external help
      - PM-001: Options:
          - Reassign to more senior agent
          - Hire external consultant (if budget allows)
          - Pivot to alternative solution

  level_4_timeline_at_risk:
    trigger: "Sprint velocity below target, deadline at risk"
    process:
      - PM-001: Daily standup to identify blockers
      - PM-001: Options:
          - Reduce scope (MVP approach)
          - Extend timeline (negotiate with user)
          - Add resources (hire contractor)
      - PM-001: Communicate to user with options

  level_5_user_escalation:
    trigger: "User dissatisfied with progress or quality"
    process:
      - PM-001: Schedule 1-on-1 with user
      - PM-001: Identify root cause (scope creep, unclear requirements, agent performance)
      - PM-001: Create action plan with timeline
      - PM-001: Increase reporting frequency (daily updates)
```

### Conflict Resolution Framework

```yaml
conflict_types:

  clinical_vs_technical:
    example: "BCBA-001 wants data collection every 30 seconds, BACK-001 says too much database load"
    resolution:
      - PM-001: Facilitate discussion
      - BCBA-001: Explain clinical need (ABA data fidelity)
      - BACK-001: Explain technical constraint (database writes expensive)
      - COMPROMISE: "Collect data locally every 30 sec, batch upload to DB every 5 min"
      - OUTCOME: Clinical need met, technical constraint respected

  neurodiversity_vs_clinical:
    example: "BCBA-001 recommends eye contact training, ADVOCATE-001 objects (harmful to autistic people)"
    resolution:
      - PM-001: Facilitate discussion
      - BCBA-001: Explain intent (social communication skill)
      - ADVOCATE-001: Explain harm (forcing autistic people to act neurotypical causes distress)
      - COMPROMISE: "Teach 'looking near face' (forehead, nose) instead of direct eye contact, respect child's preference"
      - OUTCOME: Social communication goal met, autistic autonomy respected

  usability_vs_features:
    example: "PARENT-001 says platform too complex, FRONT-001 wants to keep all features"
    resolution:
      - PM-001: User testing with 5 parents
      - DATA: 80% struggle with navigation, 60% abandon after 2 minutes
      - COMPROMISE: "Create 'Simple Mode' (5 core features) and 'Advanced Mode' (all features)"
      - OUTCOME: Usability for new users, power features for advanced users
```

---

## COMMUNICATION PROTOCOLS

### Daily Standup (Async in GitHub Projects)

```yaml
standup_format:
  frequency: "Daily, posted by 10am local time"
  location: "GitHub Projects Discussion board"

  template:
    agent_id: "BACK-001"
    date: "2025-10-15"

    yesterday:
      - "✅ Completed OAuth callback endpoint (TASK-123)"
      - "✅ Wrote unit tests for JWT token generation"

    today:
      - "🟢 Implement refresh token rotation (TASK-124)"
      - "🟢 Review FRONT-001's login UI PR"

    blockers:
      - "🟠 BLOCKED on TASK-125: Need DB-001 to add refresh_tokens table"
      - "Action: @PM-001 please unblock TASK-125"

    fte: 0.8 # 80% capacity today (20% on other project)
```

### Sprint Planning (Biweekly)

```yaml
sprint_planning:
  frequency: "Every 2 weeks (start of sprint)"
  duration: "2 hours"
  location: "GitHub Projects Planning board"

  agenda:
    1_review_last_sprint:
      - Velocity: "Planned 25 pts, completed 23 pts (92%)"
      - Retrospective: "What went well? What to improve?"

    2_groom_backlog:
      - PM-001: Present top priorities from user
      - Clinical agents: Validate educational value
      - Technical agents: Estimate effort (story points)

    3_commit_to_sprint:
      - PM-001: "Based on velocity 23 pts, we can commit to 25 pts this sprint"
      - Agents: Volunteer for tasks
      - PM-001: Assign tasks, set sprint goal

    4_define_done:
      - Definition of Done:
          ✅ Code reviewed by peer
          ✅ Unit tests ≥80% coverage
          ✅ E2E tests pass
          ✅ Clinical validation (if educational content)
          ✅ Accessibility tested (WCAG AA)
          ✅ Deployed to staging
```

### Sprint Retrospective (Biweekly)

```yaml
retrospective:
  frequency: "Every 2 weeks (end of sprint)"
  duration: "1 hour"
  location: "GitHub Projects Discussion board"

  template:
    sprint: "Sprint 2 (Oct 24 - Nov 7)"

    what_went_well:
      - "Clinical validation loop worked smoothly (BCBA → SLP → OT)"
      - "QA-001 caught bug before production (emotion game crash)"
      - "Parent-001 beta testing very valuable"

    what_to_improve:
      - "BLOCKED tasks took too long to unblock (avg 2 days)"
      - "Need clearer handoff docs from ARCH-001 to BACK-001"

    action_items:
      - "PM-001: Check BLOCKED tasks daily, unblock within 24 hrs"
      - "ARCH-001: Use handoff template (YAML format) for all deliverables"
      - "PM-001: Add 'Handoff Quality' metric to sprint reviews"

    shoutouts:
      - "🎉 GAME-001: Emotion game exceeded expectations!"
      - "🎉 BCBA-001: Excellent ABLLS-R skill mapping"
      - "🎉 QA-001: 100% test coverage on critical features"
```

---

## WORKFLOW MONITORING & METRICS

### PM-001 Tracks These Metrics

```yaml
velocity_metrics:
  sprint_velocity:
    calculation: "Story points completed / sprint"
    target: "25-30 pts per 2-week sprint"
    current: "23 pts (Sprint 1), 34 pts (Sprint 2)"
    trend: "↑ Improving"

  cycle_time:
    definition: "Time from READY → DONE"
    target: "≤5 days for medium tasks"
    current: "Avg 4.2 days"
    trend: "✅ On target"

  blocked_time:
    definition: "Time tasks spend in BLOCKED status"
    target: "≤1 day"
    current: "Avg 2.1 days"
    trend: "⚠️ Needs improvement"

quality_metrics:
  code_coverage:
    target: "≥80%"
    current: "Backend 95%, Frontend 87%, Games 72%"
    action: "GAME-001: Increase Unity test coverage"

  bug_escape_rate:
    definition: "Bugs found in production / total bugs"
    target: "≤10%"
    current: "5% (1 production bug, 19 caught in QA)"
    trend: "✅ Excellent"

  accessibility_score:
    tool: "axe-core"
    target: "100% WCAG 2.1 AA compliance"
    current: "100%"
    trend: "✅ Perfect"

clinical_metrics:
  content_approval_rate:
    definition: "Clinical content approved first review / total"
    target: "≥70%"
    current: "60% (6/10 approved first review)"
    action: "GAME-001: Consult BCBA earlier in design phase"

  neurodiversity_compliance:
    target: "100% (all content reviewed by ADVOCATE-001)"
    current: "100%"
    trend: "✅ Perfect"

user_satisfaction:
  parent_satisfaction:
    source: "Platform surveys"
    target: "≥4.5/5"
    current: "4.7/5"
    trend: "✅ Excellent"

  agent_satisfaction:
    source: "Retrospective feedback"
    target: "≥4/5 (team morale)"
    current: "4.3/5"
    trend: "✅ Good"
```

---

## WORKFLOW STATUS DASHBOARD

PM-001 maintains a real-time dashboard in GitHub Projects:

### Current Sprint Status (Example)

```yaml
sprint: "Sprint 3 (Nov 7-21, 2025)"
commitment: 28 story points
days_remaining: 7

status_breakdown:
  planning: 2 tasks (3 pts) 🔵
  ready: 4 tasks (8 pts) 🟡
  in_progress: 6 tasks (12 pts) 🟢
  in_review: 3 tasks (5 pts) 🟣
  blocked: 0 tasks (0 pts) 🟠  ← ✅ GOOD!
  at_risk: 0 tasks (0 pts) 🔴  ← ✅ GOOD!
  done: 10 tasks (18 pts) ✅
  canceled: 1 task (2 pts) ❌

velocity_projection:
  completed_to_date: 18 pts
  days_elapsed: 7
  daily_velocity: 2.6 pts/day
  projected_completion: 26 pts
  status: "⚠️ AT RISK (2 pts below commitment)"
  action: "PM-001: Review scope, may need to descope 2 pts"

agent_utilization:
  arch_001: 0.9 FTE (90% capacity) ← High utilization
  back_001: 1.0 FTE (100% capacity) ← Fully utilized
  front_001: 0.8 FTE (80% capacity)
  db_001: 0.4 FTE (40% capacity) ← Underutilized
  game_001: 1.0 FTE (100% capacity) ← Fully utilized
  bcba_001: 0.6 FTE (60% capacity - part-time consultant)
  slp_001: 0.5 FTE (50% capacity - part-time consultant)
  ot_001: 0.5 FTE (50% capacity - part-time consultant)
  parent_001: 0.3 FTE (30% capacity - advisory role)
  advocate_001: 0.3 FTE (30% capacity - advisory role)
  qa_001: 0.9 FTE (90% capacity) ← High utilization

burndown_chart:
  day_1: 28 pts remaining
  day_2: 26 pts
  day_3: 24 pts
  day_4: 21 pts
  day_5: 19 pts
  day_6: 16 pts
  day_7: 10 pts ← Current
  ideal_line: 14 pts ← ✅ Ahead of ideal!
```

---

## AGENT WORKFLOW BEST PRACTICES

### For All Agents

1. **Update Status Immediately**: Change task status in GitHub Projects as soon as you start/finish work
2. **Use Handoff Templates**: Always use YAML handoff format for deliverables
3. **Document Blockers**: Tag @PM-001 immediately when blocked, don't wait
4. **Write Tests First**: QA-001 writes E2E tests before implementation (TDD approach)
5. **Clinical Review Early**: GAME-001 consults BCBA-001 during design, not after implementation

### For PM-001

1. **Daily Blocker Check**: Review all BLOCKED/AT RISK tasks daily, unblock within 24 hours
2. **Weekly User Updates**: Send user sprint progress report every Friday
3. **Velocity Tracking**: Calculate velocity after each sprint, adjust commitments
4. **Celebrate Wins**: Recognize agent contributions in retrospectives and user updates

---

**WORKFLOW SYSTEM STATUS**: ✅ **FULLY DOCUMENTED**
**All 12 agents integrated into coordinated workflow system**
**Color-coded tracking operational across free PM tools (GitHub Projects, Taiga, GitLab)**

---

**Next Steps**:
1. Document color-coded task management system (detailed guide)
2. Create complete agent collaboration matrix (all agent-to-agent interactions)
3. Document PM command processing and delegation logic (decision trees)
4. Create agent database integration guide
