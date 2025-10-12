# Agent Coordination System
## SkillBridge Educational Gaming Platform
**Expert Agent Workflow Integration**

---

## EXECUTIVE SUMMARY

This document formalizes how the 15+ expert agents coordinate during the 12-step game development workflow. It defines:
- **Message passing protocols** between agents
- **Task delegation rules** and orchestration
- **Input/output schemas** for each interaction
- **Conflict resolution** mechanisms
- **Status tracking** and progress reporting

### Core Coordination Principle
The **Project Manager (PM-001)** agent serves as the **orchestrator** for all workflow steps, delegating tasks to specialist agents and aggregating their outputs.

---

## 1. AGENT REGISTRY

### 1.1 Technical Agents
| Agent ID | Role | Primary Responsibilities | Workflow Steps Involved |
|----------|------|-------------------------|------------------------|
| **PM-001** | Project Manager | Orchestration, delegation, status tracking | All (1-12) |
| **ARCH-001** | Solution Architect | Technical feasibility, system design | 5, 6 |
| **BACK-001** | Backend Developer | API development, database schema | 6, 10 |
| **FRONT-001** | Frontend Developer | React UI, game integration | 6, 10 |
| **DB-001** | Database Expert | Schema design, performance tuning | 6, 10 |
| **GAME-001** | Unity Game Developer | Game implementation, C# scripting | 3, 6, 10 |
| **QA-001** | QA Engineer | Testing, bug validation | 11, 12 |
| **DEVOPS-001** | DevOps Engineer | CI/CD, deployment, monitoring | 11 |
| **UX-001** | UX/UI Designer | Interface design, accessibility | 3, 7, 12 |
| **AI-RES-001** | AI Resource Coordinator | Asset generation via AI APIs | 7, 8 |

### 1.2 Clinical/Expert Agents
| Agent ID | Role | Expertise Domain | Workflow Steps Involved |
|----------|------|-----------------|------------------------|
| **BCBA-001** | Board Certified Behavior Analyst | ABA methodology, skill progression | 2, 4, 12 |
| **SLP-001** | Speech-Language Pathologist | Language, communication, AAC | 2, 4, 12 |
| **OT-001** | Occupational Therapist | Motor skills, sensory processing | 2, 4, 12 |
| **PSY-001** | Psychologist | Emotional regulation, social cognition | 2, 4, 12 |
| **ADVOCATE-001** | Autistic Self-Advocate | Lived experience, dignity review | 2, 4, 12 |
| **A11Y-001** | Accessibility Specialist | WCAG 2.1 AA, assistive technology | 4, 11, 12 |

### 1.3 AI Resource Generation Agents (10 Specialists)
| Agent ID | Role | Responsibilities | Workflow Steps Involved |
|----------|------|-----------------|------------------------|
| **FLUX-001** | FLUX Image Generation Expert | FLUX.1 prompt engineering, autism-friendly visuals | 7, 8 |
| **COMFY-001** | ComfyUI Workflow Expert | ComfyUI automation, batch processing, workflows | 8 |
| **AUDIO-001** | Stable Audio Expert | Game audio (SFX, music), commercial-safe (CC-BY-SA) | 7, 8 |
| **VOICE-001** | Bark Voice Synthesis Expert | Educational TTS, voice-overs, child-friendly voices | 7, 8 |
| **CUBE3D-001** | Cube 3D Model Expert | Text-to-3D generation, game-ready 3D assets | 7, 8 |
| **GODOT-001** | Godot Engine Expert | Godot 4 GDScript, scene architecture, asset integration | 6, 10 |
| **UNITY-EDU-001** | Unity Educational Expert | Unity C# patterns, educational game systems | 6, 10 |
| **BLENDER-001** | Blender Automation Expert | Blender Python, 3D optimization, batch processing | 8 |
| **FIGMA-001** | Figma Design Tokens Expert | Design tokens, Variables, design-to-code automation | 3, 7 |
| **REACT-001** | React Component Expert | React TypeScript, component library, accessibility | 6, 10 |

---

## 2. WORKFLOW STEP-BY-STEP COORDINATION

### STEP 1: Game Ideation (Skill Database Selection)
**Lead Agent**: PM-001
**Supporting Agents**: None (automated SQL query)

#### Agent Interaction Flow
```
[Skill Database] → PM-001
  ↓
PM-001 executes query:
  SELECT skill_id, skill_name, games_count
  FROM skills
  WHERE games_count < 3
  ORDER BY priority_score DESC
  LIMIT 10;
  ↓
PM-001 reviews results → Selects 1-3 skills for next sprint
  ↓
[Decision Document Created] → Step 2
```

#### Message Schema
```json
{
  "step": 1,
  "action": "game_ideation",
  "from_agent": "PM-001",
  "timestamp": "ISO-8601",
  "output": {
    "selected_skills": [
      {
        "skill_id": "ablls_c5_match_emotions",
        "skill_name": "Match facial expressions to emotion labels",
        "framework": "ABLLS-R",
        "priority_score": 87,
        "rationale": "Underserved (0 games), high parent demand"
      }
    ],
    "next_step": 2,
    "assigned_to": "PM-001"
  }
}
```

---

### STEP 2: Expert Identification (Auto-Routing)
**Lead Agent**: PM-001
**Supporting Agents**: Skill-to-Expert Mapping Engine (automated)

#### Agent Interaction Flow
```
PM-001: [Selected Skill] → Mapping Engine
  ↓
Engine analyzes:
  - Primary domain: Social Cognition
  - Secondary domains: Visual Perception, Language
  ↓
Engine returns required experts:
  - BCBA-001 (mandatory, all games)
  - PSY-001 (mandatory, emotion domain)
  - ADVOCATE-001 (mandatory, social skills)
  - A11Y-001 (mandatory, all games)
  ↓
PM-001: [Assign Experts] → Expert Agents
  ↓
PM-001 sends notification:
  "You are assigned to Game ID: game_005_emotion_matching"
```

#### Message Schema
```json
{
  "step": 2,
  "action": "expert_assignment",
  "from_agent": "PM-001",
  "assigned_experts": [
    {
      "agent_id": "BCBA-001",
      "priority": "mandatory",
      "review_order": 1,
      "estimated_hours": 8
    },
    {
      "agent_id": "PSY-001",
      "priority": "mandatory",
      "review_order": 1,
      "estimated_hours": 6
    },
    {
      "agent_id": "ADVOCATE-001",
      "priority": "mandatory",
      "review_order": 2,
      "veto_power": true,
      "estimated_hours": 4
    },
    {
      "agent_id": "A11Y-001",
      "priority": "mandatory",
      "review_order": 3,
      "estimated_hours": 6
    }
  ],
  "notification_sent": true,
  "next_step": 3
}
```

---

### STEP 3: Game Design Start
**Lead Agent**: GAME-001 (Expert Game Designer)
**Supporting Agents**: UX-001 (UI mockups)

#### Agent Interaction Flow
```
PM-001: [Task Assignment] → GAME-001
  ↓
GAME-001: Receives brief:
  - Skill: "Match facial expressions to emotion labels"
  - Target age: 4-7 years
  - Framework: ABLLS-R C5
  ↓
GAME-001: Creates concept document (5-10 pages):
  - 3 mechanic options:
    Option A: Drag-and-drop emotion faces to labels
    Option B: Tap matching pairs memory game
    Option C: Story-based scenarios with emotion choices
  ↓
GAME-001 → UX-001: [Request UI mockups for 3 options]
  ↓
UX-001: Creates wireframes (24 hours)
  ↓
UX-001 → GAME-001: [Mockups delivered]
  ↓
GAME-001: Finalizes concept document
  ↓
GAME-001 → PM-001: [Concept document ready for review]
```

#### Message Schema (GAME-001 → PM-001)
```json
{
  "step": 3,
  "action": "concept_ready",
  "from_agent": "GAME-001",
  "to_agent": "PM-001",
  "deliverable": {
    "document_url": "/docs/game_005_concept_v1.pdf",
    "mechanic_options": 3,
    "pages": 8,
    "mockups_included": true,
    "created_by_agents": ["GAME-001", "UX-001"],
    "status": "ready_for_validation"
  },
  "next_step": 4,
  "estimated_review_time": "90 minutes (meeting)"
}
```

---

### STEP 4: Design Validation (Clinical Collaboration)
**Lead Agent**: PM-001 (Meeting Facilitator)
**Participating Agents**: GAME-001, BCBA-001, PSY-001, ADVOCATE-001, A11Y-001

#### Agent Interaction Flow
```
PM-001: [Schedule Meeting] → All assigned experts
  ↓
PM-001 sends pre-meeting package (48 hours before):
  - Concept document
  - Mockups
  - Skill mapping details
  ↓
Experts review independently:
  BCBA-001 → Reviews ABA methodology alignment
  PSY-001 → Reviews emotion accuracy
  ADVOCATE-001 → Reviews dignity/autonomy concerns
  A11Y-001 → Reviews preliminary accessibility
  ↓
[90-Minute Meeting - PM-001 Facilitates]
  ↓
Agenda:
  0:00-0:15 → GAME-001 presents concept
  0:15-0:45 → Expert feedback round-robin
  0:45-1:15 → Discussion of concerns
  1:15-1:30 → Decision: Approve / Revise / Reject
  ↓
PM-001: [Aggregates Feedback] → Creates revision document
  ↓
If approved with changes:
  PM-001 → GAME-001: [Revision tasks]
  GAME-001: [Makes revisions] (2-3 days)
  GAME-001 → PM-001: [Updated concept]
  PM-001 → Experts: [Quick async review] (24 hours)
  ↓
If approved:
  PM-001: [Mark Step 4 Complete] → Proceed to Step 5
```

#### Message Schema (Expert Feedback)
```json
{
  "step": 4,
  "action": "design_validation_feedback",
  "from_agent": "BCBA-001",
  "to_agent": "PM-001",
  "game_id": "game_005_emotion_matching",
  "meeting_id": "validation_meeting_20250315",

  "feedback": {
    "overall_rating": 4,
    "approval_status": "approved_with_changes",

    "required_changes": [
      {
        "id": "BCBA-REQ-001",
        "severity": "high",
        "issue": "Mastery criteria not defined",
        "recommendation": "Add: 80% accuracy over 3 sessions",
        "estimated_fix": "1 hour"
      },
      {
        "id": "BCBA-REQ-002",
        "severity": "medium",
        "issue": "Prompting hierarchy unclear",
        "recommendation": "Define errorless teaching for Level 1",
        "estimated_fix": "2 hours"
      }
    ],

    "optional_suggestions": [
      "Consider adding 'surprised' emotion in Level 3"
    ],

    "concerns_addressed": true,
    "next_review_needed": "quick_async_review"
  }
}
```

#### Conflict Resolution Protocol
**Scenario**: Multiple experts disagree on design decision

```
Example: BCBA-001 recommends errorless teaching, but PSY-001 recommends allowing errors for emotional resilience

Resolution Process:
1. PM-001 identifies conflict in aggregated feedback
2. PM-001 schedules 30-min conflict resolution call with conflicting experts
3. Experts discuss evidence-based rationale
4. PM-001 facilitates consensus or escalates to Clinical Director

Escalation Criteria:
- Safety concern (automatic escalation)
- Fundamental methodology disagreement
- Autistic Advocate veto invoked

Autistic Advocate Veto Power:
- ADVOCATE-001 can reject game regardless of other approvals
- Veto applies to social skills, communication, emotional regulation games
- Rationale must be documented (harm prevention)
- PM-001 CANNOT override veto
```

---

### STEP 5: Technical Feasibility Review
**Lead Agent**: ARCH-001 (Solution Architect)
**Supporting Agents**: None (independent analysis)

#### Agent Interaction Flow
```
PM-001: [Approved Concept] → ARCH-001
  ↓
ARCH-001: Analyzes feasibility:
  - Unity capability (drag-and-drop: ✅ standard)
  - API requirements (emotion image library: ✅ existing)
  - Performance (20 images: ✅ low load)
  - Accessibility (drag-and-drop with keyboard alternative: ⚠️ requires custom input manager)
  ↓
ARCH-001: Creates feasibility report:
  - Viability: HIGH (8/10)
  - Risks: 1 medium (keyboard drag-and-drop)
  - Effort estimate: 25 days (1 developer)
  - Blockers: None
  ↓
ARCH-001 → PM-001: [Feasibility Report]
  ↓
PM-001: Reviews report
  ↓
If viable → Proceed to Step 6
If risks high → Schedule mitigation meeting
If blocked → Re-design with GAME-001
```

#### Message Schema
```json
{
  "step": 5,
  "action": "feasibility_assessment",
  "from_agent": "ARCH-001",
  "to_agent": "PM-001",
  "game_id": "game_005_emotion_matching",

  "assessment": {
    "viability_score": 8,
    "viability_rating": "HIGH",
    "estimated_effort_days": 25,
    "estimated_cost_usd": 15000,

    "risks": [
      {
        "id": "RISK-001",
        "severity": "medium",
        "description": "Keyboard drag-and-drop requires custom Unity input manager",
        "impact": "Accessibility feature may add 3-5 days",
        "mitigation": "Use Unity New Input System with pointer simulation",
        "estimated_additional_days": 3
      }
    ],

    "blockers": [],

    "recommendations": [
      "Proceed with development",
      "Allocate 3 days for accessibility testing"
    ],

    "decision": "APPROVED_TO_PROCEED"
  },

  "next_step": 6
}
```

---

### STEP 6: Tech Team Assembly + Technical Plan
**Lead Agent**: PM-001
**Supporting Agents**: ARCH-001, GAME-001, BACK-001, FRONT-001, DB-001, QA-001

#### Agent Interaction Flow
```
PM-001: [Analyze Scope] → Identifies needed roles:
  - Unity Developer: ✅ GAME-001 (already assigned)
  - Backend Developer: ✅ BACK-001 (session tracking API)
  - Frontend Developer: ✅ FRONT-001 (parent dashboard integration)
  - Database: ⚠️ Check if schema changes needed
  - QA: ✅ QA-001 (testing plan)
  ↓
PM-001: [Schedule Tech Planning Meeting] → All tech agents
  ↓
[60-Minute Meeting - ARCH-001 Leads]
  ↓
Agenda:
  0:00-0:15 → ARCH-001 presents feasibility report
  0:15-0:30 → GAME-001 discusses Unity implementation approach
  0:30-0:40 → BACK-001 defines API endpoints needed
  0:40-0:50 → FRONT-001 discusses dashboard integration
  0:50-1:00 → QA-001 outlines testing strategy
  ↓
ARCH-001: [Creates Technical Plan Document] → 5-10 pages:
  - Architecture diagram
  - API specifications
  - Database schema updates
  - Development timeline (3 weeks)
  - Dependencies and milestones
  ↓
ARCH-001 → PM-001: [Technical Plan]
  ↓
PM-001: [Reviews + Approves] → Proceed to Step 7
```

#### Message Schema (Multi-Agent Coordination)
```json
{
  "step": 6,
  "action": "technical_planning_meeting",
  "meeting_id": "tech_plan_20250316",
  "facilitator": "ARCH-001",
  "coordinated_by": "PM-001",

  "participants": [
    {
      "agent_id": "ARCH-001",
      "role": "Meeting lead, architecture design",
      "deliverable": "Technical plan document"
    },
    {
      "agent_id": "GAME-001",
      "role": "Unity implementation plan",
      "deliverable": "Game architecture diagram"
    },
    {
      "agent_id": "BACK-001",
      "role": "API endpoint specifications",
      "deliverable": "API contract (Swagger/OpenAPI)"
    },
    {
      "agent_id": "FRONT-001",
      "role": "Dashboard integration plan",
      "deliverable": "Component specifications"
    },
    {
      "agent_id": "DB-001",
      "role": "Schema assessment",
      "deliverable": "Migration scripts (if needed)"
    },
    {
      "agent_id": "QA-001",
      "role": "Testing strategy",
      "deliverable": "Test plan document"
    }
  ],

  "outputs": {
    "technical_plan_url": "/docs/game_005_tech_plan_v1.pdf",
    "api_contract_url": "/specs/game_005_api.yaml",
    "timeline_estimate": "21 days (3 weeks)",
    "dependencies": [
      "Emotion image library (existing asset)",
      "Session tracking API (new endpoint)"
    ]
  },

  "approval_status": "approved",
  "next_step": 7
}
```

---

### STEP 7: Resource Specification
**Lead Agent**: GAME-001 + UX-001
**Supporting Agents**: PM-001 (review)

#### Agent Interaction Flow
```
PM-001: [Task Assignment] → GAME-001, UX-001
  ↓
GAME-001 + UX-001: [Create Asset Specification Spreadsheet]
  ↓
Asset Categories Defined:
  1. Character Images (emotion faces)
  2. UI Elements (buttons, progress bars)
  3. Background Scenes (neutral classroom, home setting)
  4. Audio (success sounds, error sounds, voice-overs)
  5. Animations (face transitions, celebration effects)
  ↓
GAME-001: Populates spreadsheet with 50+ assets:

  | Asset ID | Type | Description | Specs | Generation Method | Priority |
  |----------|------|-------------|-------|-------------------|----------|
  | EMO-001 | Image | Happy face (child, neutral skin) | 512x512px, PNG, transparent bg | AI (DALL-E 3) | High |
  | EMO-002 | Image | Sad face | 512x512px, PNG | AI (DALL-E 3) | High |
  | UI-BTN-001 | Image | Play button | 200x80px, SVG | Manual (Figma) | High |
  | AUDIO-001 | Sound | Success chime | 1-2sec, MP3, <100KB | AI (ElevenLabs) | Medium |

  ↓
UX-001: Reviews visual consistency
  ↓
GAME-001 + UX-001 → PM-001: [Asset Spec Spreadsheet]
  ↓
PM-001: Reviews → Approves → Assigns to AI Resource Team
```

#### Message Schema
```json
{
  "step": 7,
  "action": "resource_specification_complete",
  "from_agents": ["GAME-001", "UX-001"],
  "to_agent": "PM-001",
  "game_id": "game_005_emotion_matching",

  "asset_summary": {
    "total_assets": 52,
    "breakdown": {
      "images": 24,
      "audio": 12,
      "animations": 8,
      "ui_elements": 8
    },

    "generation_methods": {
      "ai_generated": 36,
      "manual_creation": 16
    },

    "estimated_generation_time": {
      "ai_assets": "1-2 days",
      "manual_assets": "3-4 days"
    }
  },

  "deliverable_url": "/specs/game_005_assets.xlsx",
  "next_step": 8,
  "assigned_to": "AI-RES-001"
}
```

---

### STEP 8: AI-Assisted Resource Generation
**Lead Agent**: PM-001 (Coordinator)
**Supporting Agents**: FLUX-001, COMFY-001, AUDIO-001, VOICE-001, CUBE3D-001, BLENDER-001

#### Agent Interaction Flow
```
PM-001: [Asset Spec Spreadsheet] → Analyzes resource requirements
  ↓
PM-001 invokes specialized agents based on game needs:

  IF game needs 2D images (sprites, UI, backgrounds):
    → FLUX-001: Engineers optimal prompts for FLUX.1 generation
    → COMFY-001: Sets up ComfyUI workflows for batch processing

  IF game needs audio (SFX, music):
    → AUDIO-001: Generates audio via Stable Audio Open (commercial-safe)

  IF game needs voice-overs (instructions, narration):
    → VOICE-001: Synthesizes voice using Bark TTS

  IF game needs 3D models (props, characters):
    → CUBE3D-001: Generates models via Roblox Cube 3D
    → BLENDER-001: Post-processes and optimizes for game engine
  ↓
[Parallel Resource Generation]
  ↓
FLUX-001 + COMFY-001: Generate 24 images
  - FLUX-001 creates prompts (autism-friendly design)
  - COMFY-001 executes batch workflow via ComfyUI
  - Total time: 2-3 minutes (2-3 sec per 512x512 image)
  - Cost: $0 (local generation, Apache 2.0 license)
  ↓
AUDIO-001: Generates 8 SFX + 4 background music clips
  - Uses Stable Audio Open (CC-BY-SA 4.0, attribution required)
  - Total time: 3-4 minutes (10-15 sec per clip)
  - Cost: $0 (local generation)
  ↓
VOICE-001: Generates 12 voice-over narrations
  - Uses Bark TTS (MIT license, 100% commercial-safe)
  - Chunks text for 13-14s limit
  - Total time: 2-3 minutes (8-12 sec per sentence)
  - Cost: $0 (local generation)
  ↓
CUBE3D-001: Generates 5 3D props (optional)
  - Text-to-3D via Roblox Cube
  - Exports .obj/.glb for Unity/Godot
  - Total time: 5 minutes (30-60 sec per simple object)
  - Cost: $0 (open source)
  ↓
[Quality Review - Each Agent]
  ↓
Each agent validates their outputs:
  - FLUX-001: Checks image quality, autism-friendly compliance
  - AUDIO-001: Validates LUFS levels, commercial license attribution
  - VOICE-001: Verifies clarity, removes background noise
  - CUBE3D-001: Confirms poly counts, game-ready format
  ↓
PM-001: [Aggregates All Assets]
  ↓
PM-001: [Organizes Assets] → Folder structure:
  /game_005/
    /images/
      characters/
        EMO-001_happy.png
        EMO-002_sad.png
      ui/
        UI-BTN-001_play.png
      backgrounds/
        BG-001_classroom.png
    /audio/
      sfx/
        SFX-001_success_chime.wav
      music/
        MUS-001_background_loop.wav
      voice/
        VO-001_instructions.wav
    /3d_models/
      OBJ-001_chair.obj
      OBJ-001_chair.glb
    asset_manifest.json
  ↓
PM-001 → GAME-001 / GODOT-001 / UNITY-EDU-001: [Assets Ready]

**Total Generation Time**: ~15 minutes for full game assets
**Total Cost**: $0 (all local, 100% commercial-safe tools)
**vs Cloud APIs**: $5-10 per game, 1-2 hours
```

#### Message Schema (Multi-Agent Coordination)
```json
{
  "step": 8,
  "action": "ai_resource_generation_complete",
  "from_agent": "AI-RES-001",
  "to_agent": "PM-001",
  "game_id": "game_005_emotion_matching",

  "generation_summary": {
    "total_assets_generated": 36,
    "generation_time_hours": 8,
    "cost_breakdown": {
      "dalle3_images": 240,
      "elevenlabs_audio": 60,
      "midjourney_backgrounds": 100,
      "total_usd": 400
    },

    "quality_metrics": {
      "spec_compliance": "100%",
      "regenerations_needed": 3,
      "manual_edits_needed": 2
    },

    "asset_manifest_url": "/game_005/asset_manifest.json"
  },

  "agent_breakdown": [
    {
      "agent_id": "PROMPT-001",
      "assets_generated": 24,
      "time_hours": 5
    },
    {
      "agent_id": "PROMPT-002",
      "assets_generated": 12,
      "time_hours": 3
    }
  ],

  "next_step": 9,
  "ready_for_handoff": true
}
```

---

### STEP 9: PM Handoff to Senior Developer
**Lead Agent**: PM-001
**Receiving Agent**: GAME-001 (Unity Lead Developer)

#### Agent Interaction Flow
```
PM-001: [Prepares Handoff Package]
  ↓
Package Contents:
  1. Approved GDD (from Step 4)
  2. Technical Plan (from Step 6)
  3. Asset Manifest + S3 URLs (from Step 8)
  4. API Contracts (from Step 6)
  5. Development Timeline (3 weeks)
  ↓
PM-001 → GAME-001: [Handoff Package Delivered]
  ↓
PM-001: [Kickoff Meeting] (30 minutes)
  - Reviews requirements
  - Clarifies any questions
  - Confirms timeline
  ↓
GAME-001: [Acknowledges Receipt] → Development begins (Step 10)
```

#### Message Schema
```json
{
  "step": 9,
  "action": "development_handoff",
  "from_agent": "PM-001",
  "to_agent": "GAME-001",
  "game_id": "game_005_emotion_matching",

  "handoff_package": {
    "gdd_url": "/docs/game_005_gdd_v2_approved.pdf",
    "technical_plan_url": "/docs/game_005_tech_plan_v1.pdf",
    "asset_manifest_url": "/game_005/asset_manifest.json",
    "api_contract_url": "/specs/game_005_api.yaml",
    "timeline_url": "/schedules/game_005_timeline.pdf"
  },

  "development_requirements": {
    "estimated_duration_days": 21,
    "milestones": [
      {
        "day": 5,
        "deliverable": "Prototype (core mechanic playable)"
      },
      {
        "day": 12,
        "deliverable": "Alpha build (all features, placeholder polish)"
      },
      {
        "day": 18,
        "deliverable": "Beta build (ready for QA)"
      },
      {
        "day": 21,
        "deliverable": "Release candidate"
      }
    ]
  },

  "kickoff_meeting_scheduled": "2025-03-18T10:00:00Z",
  "next_step": 10
}
```

---

### STEP 10: Game Development
**Lead Agent**: GAME-001
**Supporting Agents**: BACK-001, FRONT-001, DB-001 (parallel work)

#### Agent Interaction Flow
```
GAME-001: [Week 1: Foundation + Prototype]
  - Sets up Unity project
  - Imports assets from S3
  - Implements core drag-and-drop mechanic
  - Creates prototype scene
  ↓
GAME-001 → PM-001: [Day 5 Prototype Demo]
  ↓
PM-001: Reviews prototype → Provides feedback
  ↓
[Parallel Work - Week 1-2]
  ↓
BACK-001: Develops session tracking API
  - POST /api/sessions/start
  - POST /api/sessions/:id/events
  - POST /api/sessions/:id/complete
  ↓
FRONT-001: Updates parent dashboard
  - Emotion recognition skill card
  - Progress chart integration
  ↓
DB-001: Creates migration script (if needed)
  - Adds emotion_recognition_data table
  ↓
GAME-001: [Week 2: Full Build]
  - Integrates all 20 emotion scenarios
  - Implements adaptive difficulty
  - Adds audio and animations
  - Connects to BACK-001's API
  ↓
GAME-001 → PM-001: [Day 12 Alpha Build]
  ↓
PM-001: Internal testing (2 days)
  ↓
GAME-001: [Week 3: Polish + Fixes]
  - Bug fixes from PM testing
  - Performance optimization
  - Accessibility enhancements (keyboard navigation)
  - Final QA prep
  ↓
GAME-001 → PM-001: [Day 18 Beta Build]
  ↓
PM-001 → QA-001: [Hand off to QA] → Step 11
```

#### Message Schema (Status Updates)
```json
{
  "step": 10,
  "action": "development_progress_update",
  "from_agent": "GAME-001",
  "to_agent": "PM-001",
  "game_id": "game_005_emotion_matching",
  "milestone": "prototype",
  "day": 5,

  "progress": {
    "completed_tasks": [
      "Unity project initialized",
      "Asset import complete (52/52 assets)",
      "Drag-and-drop mechanic implemented",
      "Prototype scene created (5 scenarios)"
    ],

    "in_progress_tasks": [
      "Adaptive difficulty algorithm (50% done)"
    ],

    "blocked_tasks": [],

    "next_milestone": "alpha_build",
    "next_milestone_eta": "Day 12 (2025-03-25)"
  },

  "demo_build_url": "/builds/game_005_prototype_v1.zip",
  "demo_playable": true,
  "feedback_requested": true
}
```

#### Parallel Agent Coordination
```json
{
  "step": 10,
  "action": "parallel_development_status",
  "coordinated_by": "PM-001",
  "game_id": "game_005_emotion_matching",
  "day": 10,

  "agent_statuses": [
    {
      "agent_id": "GAME-001",
      "status": "on_track",
      "progress": "75% (alpha build 80% complete)"
    },
    {
      "agent_id": "BACK-001",
      "status": "on_track",
      "progress": "90% (API endpoints deployed to staging)"
    },
    {
      "agent_id": "FRONT-001",
      "status": "on_track",
      "progress": "70% (dashboard UI complete, integration pending)"
    },
    {
      "agent_id": "DB-001",
      "status": "complete",
      "progress": "100% (migration script deployed)"
    }
  ],

  "integration_points": [
    {
      "description": "Unity game calls session API",
      "agents_involved": ["GAME-001", "BACK-001"],
      "status": "pending_integration",
      "eta": "Day 12"
    }
  ]
}
```

---

### STEP 11: Automated Testing + Hard Constraints
**Lead Agent**: QA-001
**Supporting Agents**: DEVOPS-001 (CI/CD), A11Y-001 (accessibility testing)

#### Agent Interaction Flow
```
PM-001: [Beta Build] → QA-001
  ↓
QA-001: [Triggers Automated Test Suite]
  ↓
[CI/CD Pipeline - DEVOPS-001]
  ↓
GitHub Actions Workflow:
  1. Build Unity WebGL
  2. Deploy to staging environment
  3. Run hard constraint tests (15 gates)
  4. Generate test report
  ↓
Hard Constraint Test Execution:

  HC-001: Skill Mapping Accuracy → ✅ PASS (100% scenarios mapped)
  HC-010: WCAG 2.1 AA Compliance → ❌ FAIL (2 violations: color contrast, missing alt text)
  HC-020: Load Time → ✅ PASS (p95 = 2.1s)
  HC-030: Frame Rate → ✅ PASS (avg 58fps)
  HC-040: No Flashing Content → ✅ PASS
  HC-050: AAC Integration → ✅ PASS
  ...
  ↓
QA-001: [Detects BLOCKER Failures]
  ↓
QA-001 → PM-001: [Test Report with 2 blockers]
  ↓
PM-001 → GAME-001: [Bug Fix Assignment]
  ↓
GAME-001: [Fixes Bugs] (2-4 hours)
  - Fixes color contrast on 3 buttons
  - Adds alt text to emotion images
  ↓
GAME-001 → QA-001: [Fixed Build]
  ↓
QA-001: [Re-runs Hard Constraints]
  ↓
All 15 constraints → ✅ PASS
  ↓
[Manual QA Testing - QA-001]
  ↓
QA-001 executes 20-item checklist:
  - Happy path test
  - Error handling test
  - Edge case test (rapid tapping, timeout)
  - Cross-browser test (Chrome, Firefox, Safari)
  - Mobile responsiveness test
  ↓
[Accessibility Testing - A11Y-001]
  ↓
A11Y-001: Tests with assistive technology:
  - Screen reader (NVDA, JAWS, VoiceOver)
  - Keyboard-only navigation
  - Switch access simulation
  ↓
A11Y-001 → QA-001: [Accessibility Report]
  ↓
QA-001: [Aggregates All Test Results]
  ↓
QA-001 → PM-001: [Final QA Report]

  Summary:
  - Hard Constraints: 15/15 PASS ✅
  - Manual QA: 20/20 PASS ✅
  - Accessibility: 32/32 PASS ✅
  - READY FOR EXPERT RE-ASSESSMENT
  ↓
PM-001 → Assigned Experts: [Request Final Review] → Step 12
```

#### Message Schema (Hard Constraint Results)
```json
{
  "step": 11,
  "action": "hard_constraint_testing_complete",
  "from_agent": "QA-001",
  "to_agent": "PM-001",
  "game_id": "game_005_emotion_matching",
  "build_version": "v1.0.0-rc1",

  "hard_constraint_results": {
    "total_constraints": 15,
    "passed": 15,
    "failed": 0,
    "blockers": 0,
    "status": "ALL_PASS"
  },

  "detailed_results": [
    {
      "id": "HC-001",
      "name": "Skill Mapping Accuracy",
      "result": "PASS",
      "details": "20/20 scenarios correctly mapped to skill_id"
    },
    {
      "id": "HC-010",
      "name": "WCAG 2.1 AA Compliance",
      "result": "PASS",
      "details": "0 violations (previously 2, fixed)"
    }
  ],

  "manual_qa_results": {
    "total_test_cases": 20,
    "passed": 20,
    "failed": 0,
    "status": "ALL_PASS"
  },

  "accessibility_results": {
    "screen_reader_compatible": true,
    "keyboard_navigable": true,
    "switch_access_compatible": true,
    "wcag_violations": 0,
    "status": "FULL_COMPLIANCE"
  },

  "performance_metrics": {
    "load_time_p95_ms": 2100,
    "frame_rate_avg_fps": 58,
    "memory_usage_mb": 180
  },

  "recommendation": "APPROVED_FOR_EXPERT_REVIEW",
  "next_step": 12
}
```

---

### STEP 12: Expert Re-Assessment + Iteration Loop
**Lead Agent**: PM-001
**Reviewing Agents**: BCBA-001, PSY-001, ADVOCATE-001, A11Y-001

#### Agent Interaction Flow
```
PM-001: [QA-Approved Build] → All Assigned Experts
  ↓
PM-001 sends re-assessment package:
  - Playable build link (staging environment)
  - Final GDD (updated with any changes)
  - QA report
  - Re-assessment form (standardized)
  ↓
[Experts Review Independently - 3 days]
  ↓
BCBA-001: Plays 10 scenarios
  - Checks skill alignment ✅
  - Verifies mastery criteria ✅
  - Tests prompting hierarchy ✅
  - Identifies 2 required changes:
    1. Scenario 7: Change "angry" face to less intense expression
    2. Add voice-over for all emotion labels (AAC support)
  ↓
PSY-001: Plays all 20 scenarios
  - Validates emotion accuracy ✅
  - Reviews facial expressions ✅
  - Identifies 1 required change:
    1. Scenario 15: Crying child too distressing for school anxiety
  ↓
ADVOCATE-001: Plays 15 scenarios
  - Checks autonomy/dignity ✅
  - No forced behaviors ✅
  - No masking encouraged ✅
  - No required changes ✅ (APPROVED)
  ↓
A11Y-001: Tests with assistive tech
  - Screen reader announces all elements ✅
  - Keyboard navigation works ✅
  - Identifies 1 optional suggestion:
    1. Add haptic feedback for correct matches (mobile enhancement)
  ↓
[PM-001 Aggregates Feedback]
  ↓
PM-001: Creates Change Request Document:

  Required Changes (3 total):
  1. REQ-001 (BCBA): Soften "angry" expression in Scenario 7 [HIGH]
  2. REQ-002 (BCBA): Add voice-overs for emotion labels [HIGH]
  3. REQ-003 (PSY): Replace crying child in Scenario 15 [HIGH - Safety]

  Optional Suggestions (1 total):
  1. OPT-001 (A11Y): Haptic feedback on mobile [LOW]
  ↓
PM-001 → GAME-001: [Change Request Assignment]
  ↓
GAME-001: [Implements Changes]
  - REQ-001: Replaces angry face asset (AI-RES-001 generates new) [2 hours]
  - REQ-002: Adds voice-overs (PROMPT-002 generates audio) [4 hours]
  - REQ-003: Replaces scenario image (AI-RES-001) [1 hour]
  Total time: 7 hours (1 day)
  ↓
GAME-001 → QA-001: [Updated Build v1.0.0-rc2]
  ↓
QA-001: [Regression Testing]
  - Re-runs hard constraints → ✅ PASS
  - Tests 3 changed scenarios → ✅ PASS
  ↓
QA-001 → PM-001: [Updated Build Approved]
  ↓
PM-001 → Experts: [Quick Re-Review Request]

  Only review changed scenarios:
  - Scenario 7 (new angry face)
  - Scenario 15 (new image)
  - All scenarios (voice-over test)

  Estimated time: 30 minutes per expert
  ↓
[Experts Quick Re-Review - 1 day]
  ↓
BCBA-001 → PM-001: ✅ APPROVED
PSY-001 → PM-001: ✅ APPROVED
ADVOCATE-001 → PM-001: ✅ APPROVED (maintained)
A11Y-001 → PM-001: ✅ APPROVED
  ↓
PM-001: [All Experts Approved]
  ↓
PM-001 → DEVOPS-001: [Deploy to Production]
  ↓
DEVOPS-001: Deploys game to production
  ↓
PM-001: [Marks Game as LAUNCHED] 🎉
```

#### Message Schema (Expert Re-Assessment)
```json
{
  "step": 12,
  "action": "expert_reassessment_feedback",
  "from_agent": "BCBA-001",
  "to_agent": "PM-001",
  "game_id": "game_005_emotion_matching",
  "build_version": "v1.0.0-rc1",
  "review_round": 1,

  "assessment": {
    "overall_rating": 4,
    "approval_status": "approved_with_required_changes",

    "clinical_validation": {
      "skill_alignment": "PASS",
      "mastery_criteria": "PASS",
      "prompting_hierarchy": "PASS",
      "reinforcement_schedule": "PASS",
      "error_correction": "PASS"
    },

    "required_changes": [
      {
        "id": "REQ-001",
        "severity": "high",
        "category": "Clinical Safety",
        "issue": "Scenario 7 'angry' face too intense for young learners",
        "recommendation": "Replace with milder 'frustrated' expression",
        "scenarios_affected": [7],
        "estimated_fix": "2 hours"
      },
      {
        "id": "REQ-002",
        "severity": "high",
        "category": "AAC Support",
        "issue": "Voice-overs missing for emotion labels",
        "recommendation": "Add voice-over narration for all 6 emotions",
        "scenarios_affected": "all",
        "estimated_fix": "4 hours"
      }
    ],

    "optional_suggestions": [],

    "next_review_type": "quick_re_review",
    "next_review_estimated_time": "30 minutes"
  },

  "clinical_attestation": {
    "signed": false,
    "will_sign_after_changes": true
  }
}
```

#### Iteration Loop Protocol
```
Iteration Decision Tree:

IF all experts approve without changes:
  → PM-001: Mark APPROVED → Deploy to production

ELIF required changes ≤ 5 AND estimated_fix ≤ 8 hours:
  → PM-001: Assign changes to developers
  → Developers fix (1 day)
  → QA regression test
  → Experts quick re-review (30 min each)
  → IF approved → Deploy
  → ELIF more changes → Repeat loop (max 3 iterations)

ELIF required changes > 5 OR estimated_fix > 8 hours:
  → PM-001: Schedule full re-design meeting
  → Major changes may require returning to Step 4

ELIF any expert REJECTS game:
  → PM-001: Schedule resolution meeting
  → IF consensus can't be reached → Escalate to Clinical Director
  → IF Autistic Advocate vetoes → Game canceled (non-negotiable)
```

#### Message Schema (Final Approval)
```json
{
  "step": 12,
  "action": "final_approval_achieved",
  "from_agent": "PM-001",
  "game_id": "game_005_emotion_matching",
  "build_version": "v1.0.0",

  "approval_summary": {
    "total_review_rounds": 2,
    "total_changes_implemented": 3,
    "total_development_time_days": 22,

    "expert_approvals": [
      {
        "agent_id": "BCBA-001",
        "approval_status": "APPROVED",
        "clinical_attestation_signed": true,
        "final_rating": 5
      },
      {
        "agent_id": "PSY-001",
        "approval_status": "APPROVED",
        "clinical_attestation_signed": true,
        "final_rating": 5
      },
      {
        "agent_id": "ADVOCATE-001",
        "approval_status": "APPROVED",
        "veto_status": "not_invoked",
        "final_rating": 5
      },
      {
        "agent_id": "A11Y-001",
        "approval_status": "APPROVED",
        "wcag_compliance_certified": true,
        "final_rating": 5
      }
    ],

    "qa_certification": {
      "hard_constraints": "15/15 PASS",
      "manual_qa": "20/20 PASS",
      "accessibility": "32/32 PASS"
    },

    "launch_ready": true
  },

  "next_action": "deploy_to_production",
  "assigned_to": "DEVOPS-001"
}
```

---

## 3. CROSS-CUTTING COORDINATION MECHANISMS

### 3.1 Status Tracking System

**Central Status Dashboard** (managed by PM-001)

```json
{
  "game_id": "game_005_emotion_matching",
  "current_step": 12,
  "overall_status": "in_review",
  "started_date": "2025-03-10",
  "current_date": "2025-04-01",
  "elapsed_days": 22,

  "step_statuses": [
    {"step": 1, "status": "complete", "completed_date": "2025-03-10"},
    {"step": 2, "status": "complete", "completed_date": "2025-03-10"},
    {"step": 3, "status": "complete", "completed_date": "2025-03-12"},
    {"step": 4, "status": "complete", "completed_date": "2025-03-15"},
    {"step": 5, "status": "complete", "completed_date": "2025-03-16"},
    {"step": 6, "status": "complete", "completed_date": "2025-03-17"},
    {"step": 7, "status": "complete", "completed_date": "2025-03-18"},
    {"step": 8, "status": "complete", "completed_date": "2025-03-19"},
    {"step": 9, "status": "complete", "completed_date": "2025-03-19"},
    {"step": 10, "status": "complete", "completed_date": "2025-03-30"},
    {"step": 11, "status": "complete", "completed_date": "2025-03-31"},
    {"step": 12, "status": "in_progress", "review_round": 2}
  ],

  "active_agents": ["BCBA-001", "PSY-001", "ADVOCATE-001", "A11Y-001"],
  "blocked": false,
  "estimated_completion": "2025-04-02"
}
```

### 3.2 Notification Protocol

**Agent Notification Types**

1. **Task Assignment**: PM-001 assigns new work
2. **Review Request**: PM-001 requests expert review
3. **Blocker Alert**: Agent encounters issue requiring escalation
4. **Status Update Request**: PM-001 requests progress update
5. **Approval Notification**: Decision made, agent can proceed

**Message Priority Levels**
- **CRITICAL**: Safety issue, production outage, expert veto
- **HIGH**: Blocker, missed deadline, required change
- **MEDIUM**: Status update, review request
- **LOW**: Optional suggestion, informational

### 3.3 Escalation Protocol

**Escalation Triggers**
1. **Timeline Risk**: Step exceeds estimated duration by 50%
2. **Quality Concern**: Hard constraint failure after 2 attempts
3. **Expert Disagreement**: Conflicting feedback from 2+ experts
4. **Safety Issue**: Accessibility violation, clinical harm risk
5. **Autistic Advocate Veto**: Game rejected on dignity/autonomy grounds

**Escalation Path**
```
Agent identifies issue
  ↓
Agent → PM-001 (with CRITICAL or HIGH priority)
  ↓
PM-001 assesses severity
  ↓
IF resolvable by PM:
  → PM-001 coordinates resolution
ELIF requires expert input:
  → PM-001 schedules resolution meeting
ELIF safety/veto issue:
  → Escalate to Clinical Director (human oversight)
```

### 3.4 Conflict Resolution

**Common Conflict Scenarios**

**Scenario 1: BCBA-001 vs PSY-001 Disagreement**
- **Example**: BCBA wants errorless teaching, PSY wants productive struggle
- **Resolution**:
  1. PM-001 schedules 30-min call with both experts
  2. Each expert presents evidence-based rationale
  3. PM-001 facilitates compromise (e.g., errorless for Level 1, struggle for Level 3)
  4. If no consensus → Escalate to Clinical Director

**Scenario 2: Technical Feasibility vs Clinical Ideal**
- **Example**: ARCH-001 says feature takes 10 days, BCBA-001 says it's critical
- **Resolution**:
  1. PM-001 assesses priority (is feature mandatory or nice-to-have?)
  2. If mandatory → Approve extended timeline
  3. If nice-to-have → Defer to future iteration

**Scenario 3: Autistic Advocate Veto**
- **Example**: ADVOCATE-001 rejects social skills game for promoting masking
- **Resolution**:
  1. PM-001 documents veto rationale
  2. Game development STOPS (non-negotiable)
  3. Options:
     - Re-design game with ADVOCATE-001 involvement from Step 3
     - Cancel game, select different skill
  4. No override possible (veto power absolute for social/communication games)

---

## 4. INTER-AGENT COMMUNICATION API

### 4.1 Message Standard

**All agent messages follow this schema:**

```json
{
  "message_id": "uuid",
  "timestamp": "ISO-8601",
  "from_agent": "agent_id",
  "to_agent": "agent_id or 'PM-001' or 'ALL'",
  "game_id": "game_XXX",
  "step": 1-12,
  "action": "task_assignment | feedback | approval | blocker | status_update",
  "priority": "CRITICAL | HIGH | MEDIUM | LOW",

  "payload": {
    // Action-specific data
  },

  "requires_response": true/false,
  "response_deadline": "ISO-8601 or null"
}
```

### 4.2 Message Queue System

**Proposed Technical Implementation** (for future automation):

```javascript
// message_queue.js
class AgentMessageQueue {
  async sendMessage(message) {
    // Validate message schema
    validateMessageSchema(message);

    // Store in database
    await db.messages.create(message);

    // Notify receiving agent (email, Slack, webhook)
    await notifyAgent(message.to_agent, message);

    // If requires response, set reminder
    if (message.requires_response) {
      scheduleReminder(message.to_agent, message.response_deadline);
    }
  }

  async getAgentInbox(agent_id) {
    return await db.messages.find({
      to_agent: agent_id,
      status: 'unread'
    }).sort({priority: -1, timestamp: 1});
  }

  async markAsRead(message_id, agent_id) {
    await db.messages.update(message_id, {
      status: 'read',
      read_by: agent_id,
      read_at: new Date()
    });
  }
}
```

### 4.3 Agent Response Templates

**Example: BCBA-001 Feedback Response**

```json
{
  "message_id": "uuid",
  "timestamp": "2025-03-15T14:30:00Z",
  "from_agent": "BCBA-001",
  "to_agent": "PM-001",
  "game_id": "game_005_emotion_matching",
  "step": 4,
  "action": "design_validation_feedback",
  "priority": "MEDIUM",

  "payload": {
    "overall_rating": 4,
    "approval_status": "approved_with_changes",
    "required_changes": [...],
    "optional_suggestions": [...],
    "estimated_revision_time": "3 hours"
  },

  "requires_response": false
}
```

---

## 5. WORKFLOW STATE MACHINE

### 5.1 State Transitions

```
State Machine: Game Development Workflow

STATES:
- NOT_STARTED
- STEP_1_IDEATION
- STEP_2_EXPERT_ASSIGNMENT
- STEP_3_DESIGN
- STEP_4_VALIDATION (sub-states: in_meeting, awaiting_revisions, re_review)
- STEP_5_FEASIBILITY
- STEP_6_TECH_PLANNING
- STEP_7_ASSET_SPEC
- STEP_8_ASSET_GENERATION
- STEP_9_HANDOFF
- STEP_10_DEVELOPMENT (sub-states: prototype, alpha, beta)
- STEP_11_QA (sub-states: hard_constraints, manual_testing, accessibility)
- STEP_12_EXPERT_REVIEW (sub-states: initial_review, iteration, approved)
- DEPLOYED
- CANCELED

TRANSITIONS:
NOT_STARTED → STEP_1_IDEATION (trigger: PM-001 selects skill)
STEP_1_IDEATION → STEP_2_EXPERT_ASSIGNMENT (trigger: PM-001 approves idea)
...
STEP_12_EXPERT_REVIEW → DEPLOYED (trigger: All experts approve)
STEP_12_EXPERT_REVIEW → STEP_10_DEVELOPMENT (trigger: Changes required, return to dev)
ANY_STEP → CANCELED (trigger: Autistic Advocate veto, critical blocker)
```

### 5.2 State Tracking Database

```sql
CREATE TABLE game_workflow_states (
  id UUID PRIMARY KEY,
  game_id UUID NOT NULL,
  current_step INT NOT NULL CHECK (current_step BETWEEN 1 AND 12),
  current_state VARCHAR(50) NOT NULL,
  previous_state VARCHAR(50),
  state_entered_at TIMESTAMP NOT NULL DEFAULT NOW(),
  estimated_completion_date DATE,

  -- Agent assignments
  assigned_agents JSONB NOT NULL DEFAULT '[]',
  active_agents JSONB NOT NULL DEFAULT '[]',

  -- Workflow metadata
  iteration_count INT DEFAULT 0,
  blocker_count INT DEFAULT 0,
  is_blocked BOOLEAN DEFAULT FALSE,
  blocker_reason TEXT,

  -- Timestamps
  started_at TIMESTAMP,
  completed_at TIMESTAMP,

  FOREIGN KEY (game_id) REFERENCES games(id)
);

CREATE INDEX idx_workflow_active ON game_workflow_states (game_id, current_step);
```

---

## 6. PARALLEL AGENT COORDINATION

### 6.1 Parallel Work Scenarios

**Scenario 1: Step 10 Development (Multiple Agents Working Simultaneously)**

```
Week 1-3: Parallel Development

GAME-001 (Unity):
  - Week 1: Prototype
  - Week 2: Alpha build
  - Week 3: Beta build

BACK-001 (Backend):
  - Week 1: API development
  - Week 2: Testing + deployment
  - Week 3: Integration with Unity

FRONT-001 (Frontend):
  - Week 1: Dashboard UI
  - Week 2: Integration with backend
  - Week 3: Testing + polish

Coordination Points:
  - Day 5: GAME-001 demos prototype to PM-001
  - Day 12: BACK-001 deploys API to staging, shares docs with GAME-001
  - Day 15: GAME-001 + BACK-001 integration testing
  - Day 18: FRONT-001 integrates with BACK-001's API
```

**Coordination Protocol:**
- PM-001 schedules daily standups (15 min)
- Agents report: "What I did yesterday, what I'm doing today, any blockers"
- PM-001 identifies integration dependencies and schedules sync meetings

### 6.2 Dependency Management

**Dependency Tracking**

```json
{
  "game_id": "game_005_emotion_matching",
  "dependencies": [
    {
      "dependent_agent": "GAME-001",
      "depends_on_agent": "BACK-001",
      "dependency_type": "API integration",
      "required_deliverable": "Session tracking API deployed to staging",
      "required_by_date": "2025-03-25",
      "status": "on_track"
    },
    {
      "dependent_agent": "FRONT-001",
      "depends_on_agent": "BACK-001",
      "dependency_type": "Data schema",
      "required_deliverable": "Emotion recognition data schema",
      "required_by_date": "2025-03-22",
      "status": "complete"
    }
  ]
}
```

**Dependency Blocker Protocol:**
- If BACK-001 misses deadline → PM-001 notified (HIGH priority)
- PM-001 assesses impact on GAME-001 timeline
- Options:
  1. Extend GAME-001 deadline
  2. GAME-001 works with mock data temporarily
  3. Escalate to Solution Architect for faster solution

---

## 7. QUALITY GATES & AGENT SIGN-OFFS

### 7.1 Quality Gate Definitions

**Gate 1: Design Approval (Step 4)**
- **Required Sign-Offs**: BCBA-001, SLP-001 (if language), PSY-001 (if applicable), ADVOCATE-001 (if social)
- **Criteria**: All experts rate ≥3/5, zero "Rejected" status
- **Blocker**: Any expert rejects → Re-design required

**Gate 2: Technical Feasibility (Step 5)**
- **Required Sign-Off**: ARCH-001
- **Criteria**: Viability score ≥6/10, zero blockers
- **Blocker**: Viability <6 or major blockers → Re-design or scope reduction

**Gate 3: QA Approval (Step 11)**
- **Required Sign-Offs**: QA-001, DEVOPS-001, A11Y-001
- **Criteria**: 15/15 hard constraints pass, 20/20 manual QA pass, 32/32 accessibility pass
- **Blocker**: Any hard constraint fails → Development continues until pass

**Gate 4: Expert Re-Approval (Step 12)**
- **Required Sign-Offs**: All assigned clinical experts (BCBA, SLP, OT, PSY, ADVOCATE, A11Y)
- **Criteria**: All experts approve (with or without minor changes)
- **Blocker**: Any expert rejects OR Autistic Advocate vetoes → Iteration or cancellation

### 7.2 Sign-Off Tracking

```json
{
  "game_id": "game_005_emotion_matching",
  "quality_gates": [
    {
      "gate": 1,
      "name": "Design Approval",
      "required_sign_offs": ["BCBA-001", "PSY-001", "ADVOCATE-001"],
      "sign_offs_received": [
        {
          "agent_id": "BCBA-001",
          "approved": true,
          "rating": 4,
          "signed_at": "2025-03-15T16:00:00Z"
        },
        {
          "agent_id": "PSY-001",
          "approved": true,
          "rating": 5,
          "signed_at": "2025-03-15T16:15:00Z"
        },
        {
          "agent_id": "ADVOCATE-001",
          "approved": true,
          "rating": 4,
          "signed_at": "2025-03-15T17:00:00Z"
        }
      ],
      "gate_status": "PASSED",
      "passed_at": "2025-03-15T17:00:00Z"
    }
  ]
}
```

---

## 8. AUTOMATION OPPORTUNITIES

### 8.1 Automated Agent Coordination

**Automation Candidates:**

1. **Step 1: Game Ideation**
   - Automation: SQL query runs weekly, generates report of underserved skills
   - Human Decision: PM-001 selects 1-3 skills from report

2. **Step 2: Expert Assignment**
   - Automation: Skill-to-Expert Mapping Engine auto-assigns experts
   - Human Decision: PM-001 confirms assignments, handles edge cases

3. **Step 8: AI Resource Generation**
   - Automation: Script processes asset spreadsheet, calls AI APIs, uploads to S3
   - Human Decision: AI-RES-001 reviews quality, approves final assets

4. **Step 11: Hard Constraint Testing**
   - Automation: CI/CD pipeline runs 15 automated tests on every commit
   - Human Decision: QA-001 reviews failures, decides if blocker or not

5. **Notification System**
   - Automation: Agents receive email/Slack notifications for task assignments
   - Human Decision: Agents respond to messages, complete tasks

### 8.2 Proposed Automation Architecture

```
┌─────────────────────────────────────────────────┐
│         Workflow Orchestrator (PM-001)          │
│  - State machine management                     │
│  - Agent task assignment                        │
│  - Dependency tracking                          │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│            Message Queue System                 │
│  - Agent inbox/outbox                           │
│  - Priority routing                             │
│  - Notification triggers                        │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         Agent Coordination API                  │
│  - POST /agents/:id/tasks (assign work)         │
│  - GET /agents/:id/inbox (fetch messages)       │
│  - POST /agents/:id/responses (submit work)     │
│  - GET /games/:id/status (workflow state)       │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│      Individual Agent Systems (15+ agents)      │
│  - BCBA-001, SLP-001, GAME-001, QA-001, etc.    │
│  - Each agent has API interface for automation  │
└─────────────────────────────────────────────────┘
```

---

## 9. EXAMPLE: FULL WORKFLOW COORDINATION

**Game: Emotion Matching Puzzle**
**Duration: 22 days**
**Agents Involved: 12**

### Timeline with Agent Interactions

| Day | Step | Lead Agent | Supporting Agents | Deliverable | Messages Sent |
|-----|------|-----------|------------------|-------------|---------------|
| 1 | 1 | PM-001 | - | Selected skill: Emotion Recognition | PM-001 → All (game kickoff) |
| 1 | 2 | PM-001 | Mapping Engine | Expert assignments | PM-001 → BCBA, PSY, ADVOCATE, A11Y |
| 1-3 | 3 | GAME-001 | UX-001 | Concept document + mockups | GAME-001 → UX-001 → GAME-001 → PM-001 |
| 4-5 | 4 | PM-001 | BCBA, PSY, ADVOCATE, A11Y | Design approval with revisions | PM-001 → Experts → PM-001 (feedback) → GAME-001 (revisions) → Experts (re-review) → PM-001 (approval) |
| 6 | 5 | ARCH-001 | - | Feasibility report | PM-001 → ARCH-001 → PM-001 |
| 7 | 6 | ARCH-001 | GAME, BACK, FRONT, DB, QA | Technical plan | PM-001 → All (meeting invite) → ARCH-001 (plan) → PM-001 |
| 8 | 7 | GAME-001 | UX-001 | Asset spec (52 assets) | GAME-001 + UX-001 → PM-001 |
| 9 | 8 | AI-RES-001 | PROMPT-001, PROMPT-002 | Generated assets (36 via AI) | PM-001 → AI-RES-001 → PROMPT agents → AI-RES-001 → PM-001 |
| 9 | 9 | PM-001 | - | Handoff package | PM-001 → GAME-001 |
| 10-30 | 10 | GAME-001 | BACK-001, FRONT-001, DB-001 | Prototype (Day 14), Alpha (Day 21), Beta (Day 28) | Daily standups, integration messages |
| 31 | 11 | QA-001 | DEVOPS-001, A11Y-001 | QA report (15/15 pass) | QA-001 → PM-001, A11Y-001 → QA-001 |
| 32-34 | 12 | PM-001 | BCBA, PSY, ADVOCATE, A11Y | Initial reviews (3 required changes) | PM-001 → Experts → PM-001 (feedback) |
| 35 | 12 | GAME-001 | AI-RES-001, PROMPT-002 | Implemented changes | PM-001 → GAME-001 → AI-RES agents → GAME-001 → QA-001 → PM-001 |
| 36 | 12 | PM-001 | BCBA, PSY, ADVOCATE, A11Y | Quick re-reviews (all approved) | PM-001 → Experts → PM-001 (approvals) |
| 36 | Deploy | DEVOPS-001 | - | Production deployment | PM-001 → DEVOPS-001 → PM-001 (launch confirmation) |

**Total Messages Exchanged**: ~85
**Critical Path Agents**: PM-001 (coordinator), GAME-001 (developer), BCBA-001 (clinical validator)

---

## 10. IMPLEMENTATION ROADMAP

### Phase 1: Manual Coordination (Current State)
- PM-001 (human PM) manually assigns tasks via email/Slack
- Experts submit feedback via Google Forms
- Status tracked in spreadsheets

### Phase 2: Message Queue System (Month 1-2)
- Build agent message API
- Create central status dashboard
- Automate notifications

### Phase 3: Workflow Automation (Month 3-4)
- Implement state machine
- Automate Step 1, 2, 11
- Auto-generate agent task assignments

### Phase 4: Full Agent Orchestration (Month 5-6)
- AI-powered PM-001 (autonomous orchestrator)
- Agents interact via API without human intervention
- Human oversight only for escalations and approvals

---

## 11. CONCLUSION

This coordination system enables the 15+ expert agents to work together seamlessly through the 12-step game development workflow. Key features:

1. **PM-001 as Orchestrator**: Central coordinator delegates tasks and aggregates outputs
2. **Standardized Messaging**: JSON schemas ensure consistent communication
3. **Quality Gates**: 4 mandatory approval points prevent quality issues
4. **Conflict Resolution**: Clear protocols for expert disagreements
5. **Parallel Coordination**: Multiple agents work simultaneously with dependency tracking
6. **Automation-Ready**: Design supports future API-based automation

**Next Steps**:
- Implement message queue system (Technical Infrastructure)
- Create agent coordination API (Backend Development)
- Build status dashboard (Frontend Development)
- Train team on coordination protocols (1-day workshop)

---

**Document Version**: 1.0
**Last Updated**: 2025-10-12
**Status**: Complete
**Created By**: PM-001 Agent
**Approved By**: Pending stakeholder review
