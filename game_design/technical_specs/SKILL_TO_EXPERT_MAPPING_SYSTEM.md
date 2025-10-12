# Skill-to-Expert Mapping & Review Workflow System
## SkillBridge Educational Gaming Platform

**Document Version**: 1.0
**Last Updated**: October 12, 2025
**Purpose**: Automated clinical expert routing for game validation

---

## 1. OVERVIEW

### System Purpose
This system automatically identifies which autism clinical experts must review and approve each game based on the specific skills being taught. It ensures comprehensive clinical validation while avoiding unnecessary reviews by experts outside their domain.

### Key Principles
1. **Skill-Driven Routing**: Skills determine which experts review
2. **Mandatory Multi-Expert Review**: Most games require 3-5 expert sign-offs
3. **Domain Expertise**: Experts only review within their clinical scope
4. **Sequential + Parallel Review**: Some reviews happen in parallel, others sequentially
5. **No Launch Without Approval**: 100% expert approval required before beta/production

---

## 2. SKILL DATABASE STRUCTURE

### Skill Schema (PostgreSQL)

```sql
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_code VARCHAR(20) NOT NULL UNIQUE,  -- e.g., "ABLLS-R-B1"
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,

    -- Framework Classification
    assessment_framework VARCHAR(20) NOT NULL CHECK (
        assessment_framework IN ('ABLLS-R', 'AFLS', 'VB-MAPP', 'PEAK', 'EFL')
    ),
    skill_category_id UUID NOT NULL REFERENCES skill_categories(id),

    -- Clinical Domains (Multi-select, affects expert routing)
    primary_domain VARCHAR(50) NOT NULL,  -- Main skill category
    secondary_domains VARCHAR(50)[],      -- Additional domains addressed

    -- Difficulty & Age
    difficulty_level INT NOT NULL CHECK (difficulty_level BETWEEN 1 AND 10),
    age_range_min INT NOT NULL CHECK (age_range_min BETWEEN 1 AND 18),
    age_range_max INT NOT NULL CHECK (age_range_max BETWEEN 1 AND 18),

    -- Prerequisites
    prerequisite_skills UUID[],

    -- Expert Review Requirements (Computed from domain)
    required_expert_types VARCHAR(50)[] NOT NULL,  -- Auto-populated based on domains

    -- Metadata
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill Categories Table
CREATE TABLE skill_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    domain VARCHAR(50) NOT NULL,  -- Maps to primary_domain
    description TEXT,

    -- Expert mapping
    primary_expert_type VARCHAR(50) NOT NULL,
    secondary_expert_types VARCHAR(50)[],

    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Skill Domain Classification

| Domain | Description | Primary Expert | Secondary Experts |
|--------|-------------|----------------|-------------------|
| **Visual Perception** | Matching, sorting, visual discrimination | BCBA | OT (if motor involved) |
| **Receptive Language** | Understanding spoken/AAC language | SLP | BCBA (for reinforcement) |
| **Expressive Language** | Speaking, requesting, labeling | SLP | BCBA (for mand training) |
| **Social Communication** | Pragmatic language, conversation, perspective-taking | SLP + BCBA | Autistic Advocate, Social Worker |
| **Social Skills** | Sharing, turn-taking, friendship, play | BCBA | SLP (if language-based), Autistic Advocate |
| **Fine Motor** | Hand strength, pencil grip, manipulation | OT | BCBA (for task analysis) |
| **Gross Motor** | Balance, coordination, movement | OT (Physical Therapist if available) | BCBA |
| **Sensory Processing** | Sensory modulation, integration | OT | Autistic Advocate (lived experience) |
| **Cognitive/Academic** | Math, reading, problem-solving | BCBA + Special Ed Teacher | SLP (for language aspects) |
| **Executive Function** | Planning, organization, flexibility | BCBA | OT (if sensory-related) |
| **Daily Living Skills** | Dressing, eating, hygiene, safety | OT + BCBA | AFLS Specialist |
| **Play Skills** | Functional play, symbolic play, imaginative | BCBA | Child Psychologist |
| **Emotional Regulation** | Recognizing emotions, coping strategies | BCBA + Psychologist | OT (interoception), Autistic Advocate |
| **AAC/Communication Device** | Using AAC systems, symbol selection | SLP | AT Specialist, BCBA |
| **Vocational Skills** | Job skills, work behavior (older children) | BCBA + Vocational Specialist | AFLS Specialist |

---

## 3. SKILL-TO-EXPERT MAPPING RULES

### Rule Engine (Pseudocode)

```python
def get_required_experts(skill):
    """
    Determines which experts must review a game teaching this skill.
    Returns list of expert types with their review priority.
    """
    required_experts = []

    # BASE RULE: All games need BCBA review (ABA principles)
    required_experts.append({
        'expert_type': 'BCBA',
        'priority': 'mandatory',
        'review_focus': 'Skill acquisition strategy, reinforcement, prompting',
        'review_order': 1  # Always reviews first
    })

    # DOMAIN-SPECIFIC RULES
    primary_domain = skill.primary_domain

    if primary_domain in ['Receptive Language', 'Expressive Language', 'AAC']:
        required_experts.append({
            'expert_type': 'SLP',
            'priority': 'mandatory',
            'review_focus': 'Language targets, communication modality, AAC integration',
            'review_order': 1  # Parallel with BCBA
        })

    if primary_domain in ['Social Communication', 'Social Skills']:
        required_experts.append({
            'expert_type': 'SLP',
            'priority': 'mandatory',
            'review_focus': 'Pragmatic language, social communication',
            'review_order': 1
        })
        required_experts.append({
            'expert_type': 'Autistic Advocate',
            'priority': 'mandatory',
            'review_focus': 'Social expectations, neurodiversity perspective, avoiding ableism',
            'review_order': 2  # Reviews after SLP provides clinical context
        })

    if primary_domain in ['Fine Motor', 'Gross Motor', 'Sensory Processing', 'Daily Living Skills']:
        required_experts.append({
            'expert_type': 'OT',
            'priority': 'mandatory',
            'review_focus': 'Motor skill development, sensory accommodations, ADL alignment',
            'review_order': 1  # Parallel with BCBA
        })

    if primary_domain == 'Emotional Regulation':
        required_experts.append({
            'expert_type': 'Child Psychologist',
            'priority': 'recommended',
            'review_focus': 'Emotion identification, coping strategies, mental health',
            'review_order': 2
        })

    if skill.age_range_min <= 3:
        required_experts.append({
            'expert_type': 'Developmental Pediatrician',
            'priority': 'recommended',
            'review_focus': 'Developmental appropriateness, medical considerations',
            'review_order': 2
        })

    # UNIVERSAL REVIEWS (All games)
    required_experts.append({
        'expert_type': 'Accessibility Specialist',
        'priority': 'mandatory',
        'review_focus': 'WCAG compliance, autism-specific accommodations',
        'review_order': 3  # Reviews after gameplay finalized
    })

    required_experts.append({
        'expert_type': 'Parent Representative',
        'priority': 'mandatory',
        'review_focus': 'Usability, clarity of instructions, real-world feasibility',
        'review_order': 4  # Reviews final build
    })

    # SECONDARY DOMAIN RULES
    for secondary_domain in skill.secondary_domains:
        if secondary_domain == 'Communication' and 'SLP' not in [e['expert_type'] for e in required_experts]:
            required_experts.append({
                'expert_type': 'SLP',
                'priority': 'recommended',
                'review_focus': 'Secondary communication aspects',
                'review_order': 2
            })

    # FRAMEWORK-SPECIFIC RULES
    if skill.assessment_framework == 'AFLS':
        required_experts.append({
            'expert_type': 'AFLS Specialist',
            'priority': 'recommended',
            'review_focus': 'Alignment with AFLS assessment protocols',
            'review_order': 2
        })

    return required_experts


def get_required_experts_for_game(game):
    """
    Aggregate expert requirements across all skills in a game.
    """
    all_required_experts = {}

    for skill in game.skills_taught:
        experts = get_required_experts(skill)

        for expert in experts:
            expert_type = expert['expert_type']

            # Merge expert requirements (take highest priority)
            if expert_type not in all_required_experts:
                all_required_experts[expert_type] = expert
            else:
                # Upgrade to mandatory if any skill requires it
                if expert['priority'] == 'mandatory':
                    all_required_experts[expert_type]['priority'] = 'mandatory'

                # Combine review focuses
                existing_focus = all_required_experts[expert_type]['review_focus']
                if expert['review_focus'] not in existing_focus:
                    all_required_experts[expert_type]['review_focus'] += f"; {expert['review_focus']}"

    return list(all_required_experts.values())
```

---

## 4. EXPERT REVIEW WORKFLOW

### Workflow States

```sql
CREATE TYPE review_status AS ENUM (
    'not_started',
    'in_review',
    'revisions_requested',
    'approved',
    'rejected'
);

CREATE TABLE game_expert_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES games(id),
    expert_type VARCHAR(50) NOT NULL,
    expert_user_id UUID REFERENCES users(id),

    -- Review metadata
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('mandatory', 'recommended')),
    review_focus TEXT NOT NULL,
    review_order INT NOT NULL,  -- Determines sequence

    -- Status tracking
    status review_status NOT NULL DEFAULT 'not_started',
    assigned_date TIMESTAMPTZ,
    started_date TIMESTAMPTZ,
    completed_date TIMESTAMPTZ,

    -- Review content
    approval_rating INT CHECK (approval_rating BETWEEN 1 AND 5),
    strengths TEXT[],
    concerns TEXT[],
    required_revisions TEXT[],
    optional_enhancements TEXT[],
    comments TEXT,

    -- Attestation
    clinical_attestation_signed BOOLEAN DEFAULT FALSE,
    signature_timestamp TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(game_id, expert_type)
);

CREATE INDEX idx_game_reviews_status ON game_expert_reviews(game_id, status);
CREATE INDEX idx_expert_assignments ON game_expert_reviews(expert_user_id, status);
```

### Workflow Phases

#### Phase 1: Design Review (Day 1-3)
**Trigger**: Game Design Document (GDD) completed

**Parallel Reviews** (Review Order 1):
- BCBA: Skill progression, reinforcement strategy
- SLP: Language targets (if applicable)
- OT: Motor/sensory considerations (if applicable)

**Output**: Design approval or revision requests

**Example Routing for Color Matching Game**:
```json
{
  "game_id": "color_matching_puzzle",
  "skills_taught": [
    {
      "skill_code": "ABLLS-R-B1",
      "name": "Match Identical Colors",
      "primary_domain": "Visual Perception"
    },
    {
      "skill_code": "ABLLS-R-C12",
      "name": "Sort by Color Category",
      "primary_domain": "Cognitive/Academic"
    },
    {
      "skill_code": "ABLLS-R-G2",
      "name": "Receptive Color Identification",
      "primary_domain": "Receptive Language"
    }
  ],
  "required_experts": [
    {
      "expert_type": "BCBA",
      "priority": "mandatory",
      "review_focus": "Visual discrimination teaching, matching task analysis, reinforcement schedule",
      "review_order": 1,
      "estimated_review_hours": 4
    },
    {
      "expert_type": "SLP",
      "priority": "mandatory",
      "review_focus": "Receptive language (color naming), AAC symbol integration",
      "review_order": 1,
      "estimated_review_hours": 2
    },
    {
      "expert_type": "OT",
      "priority": "recommended",
      "review_focus": "Fine motor drag-and-drop, sensory profile customization",
      "review_order": 1,
      "estimated_review_hours": 2
    },
    {
      "expert_type": "Accessibility Specialist",
      "priority": "mandatory",
      "review_focus": "WCAG compliance, colorblind accommodations",
      "review_order": 3,
      "estimated_review_hours": 3
    },
    {
      "expert_type": "Parent Representative",
      "priority": "mandatory",
      "review_focus": "Usability, instruction clarity, real-world relevance",
      "review_order": 4,
      "estimated_review_hours": 1
    }
  ],
  "total_review_hours": 12,
  "estimated_review_duration": "5 business days"
}
```

#### Phase 2: Prototype Review (Day 10-12)
**Trigger**: Interactive prototype playable

**Sequential Reviews** (Review Order 2):
- Autistic Advocate (if social skills game)
- Child Psychologist (if emotional content)
- Developmental Pediatrician (if ages 0-3)

**Output**: Gameplay refinement recommendations

#### Phase 3: Accessibility Audit (Day 15-17)
**Trigger**: Alpha build feature-complete

**Mandatory Review** (Review Order 3):
- Accessibility Specialist: WCAG 2.1 AA compliance
- Autistic Advocate: Autism-specific accommodations

**Output**: Accessibility compliance report

#### Phase 4: Usability Testing (Day 18-20)
**Trigger**: Beta build ready

**Mandatory Review** (Review Order 4):
- Parent Representative: Real-world usability
- Beta Family Feedback: 5-10 families test

**Output**: Go/No-go launch decision

---

## 5. EXAMPLE: GAME-SPECIFIC EXPERT ROUTING

### Game 1: Color Matching Puzzle

**Skills Taught**:
1. ABLLS-R B1-B3: Match Identical Colors (Visual Perception)
2. ABLLS-R C12: Sort by Color Category (Cognitive)
3. ABLLS-R G2: Receptive Color ID (Receptive Language)

**Required Experts** (Auto-Generated):
```
✅ BCBA (Mandatory, Order 1)
   - Focus: Visual matching, cognitive categorization, reinforcement
   - Review Hours: 4 hours
   - Deliverable: Skill progression validation

✅ SLP (Mandatory, Order 1)
   - Focus: Receptive language ("Touch red"), AAC color symbols
   - Review Hours: 2 hours
   - Deliverable: Language component approval

⚠️ OT (Recommended, Order 1)
   - Focus: Drag-and-drop motor requirements, sensory settings
   - Review Hours: 2 hours
   - Deliverable: Motor accessibility sign-off

✅ Accessibility Specialist (Mandatory, Order 3)
   - Focus: Colorblind modes, WCAG compliance
   - Review Hours: 3 hours
   - Deliverable: Accessibility audit report

✅ Parent Representative (Mandatory, Order 4)
   - Focus: Instruction clarity, engagement
   - Review Hours: 1 hour
   - Deliverable: Usability feedback
```

**Total Review Time**: 12 hours across 5 experts
**Timeline**: 5 business days (with parallel reviews)

---

### Game 2: Emotion Recognition

**Skills Taught**:
1. ABLLS-R C1-C5: Identify Emotions (Social Communication)
2. VB-MAPP 6M: Label Emotions (Expressive Language)
3. PEAK-DT 4A: Match Face to Situation (Cognitive)

**Required Experts** (Auto-Generated):
```
✅ BCBA (Mandatory, Order 1)
   - Focus: Emotion discrimination, labeling, social skill teaching
   - Review Hours: 5 hours
   - Deliverable: ABA methodology validation

✅ SLP (Mandatory, Order 1)
   - Focus: Expressive language (emotion labels), pragmatic context
   - Review Hours: 4 hours
   - Deliverable: Communication component approval

✅ Child Psychologist (Mandatory, Order 2)
   - Focus: Emotion accuracy, mental health considerations, trauma sensitivity
   - Review Hours: 3 hours
   - Deliverable: Psychological safety sign-off

✅ Autistic Advocate (Mandatory, Order 2)
   - Focus: Neurodiversity perspective on emotions, masking concerns
   - Review Hours: 2 hours
   - Deliverable: Neurodiversity-affirming review

✅ Accessibility Specialist (Mandatory, Order 3)
   - Focus: Visual clarity of emotions, AAC emotion symbols
   - Review Hours: 2 hours
   - Deliverable: Accessibility report

✅ Parent Representative (Mandatory, Order 4)
   - Focus: Real-world emotion scenarios, usability
   - Review Hours: 1 hour
   - Deliverable: Parent feedback
```

**Total Review Time**: 17 hours across 6 experts
**Timeline**: 7 business days (sequential + parallel)

---

### Game 3: Requesting Skills (Virtual Store)

**Skills Taught**:
1. VB-MAPP Mands: Request Items (Expressive Language - AAC)
2. AFLS Community-1: Shopping Behavior (Daily Living)
3. ABLLS-R H5: Make Choices (Executive Function)

**Required Experts** (Auto-Generated):
```
✅ BCBA (Mandatory, Order 1)
   - Focus: Mand training, choice-making, community skills
   - Review Hours: 5 hours
   - Deliverable: ABA mand training validation

✅ SLP (Mandatory, Order 1)
   - Focus: AAC integration, core vocabulary, requesting modalities
   - Review Hours: 6 hours (heavy AAC involvement)
   - Deliverable: AAC implementation approval

✅ AFLS Specialist (Recommended, Order 1)
   - Focus: Alignment with AFLS Community Skills assessment
   - Review Hours: 2 hours
   - Deliverable: AFLS framework validation

✅ AAC Specialist (Mandatory, Order 2)
   - Focus: Proloquo2Go/TD Snap integration, symbol layout
   - Review Hours: 4 hours
   - Deliverable: AAC device compatibility sign-off

✅ Accessibility Specialist (Mandatory, Order 3)
   - Focus: Switch access, motor accommodations for AAC
   - Review Hours: 3 hours
   - Deliverable: AAC accessibility report

✅ Parent Representative (Mandatory, Order 4)
   - Focus: Real-world shopping transfer, home practice
   - Review Hours: 2 hours
   - Deliverable: Generalization feasibility

✅ Autistic Advocate (Recommended, Order 2)
   - Focus: Respectful requesting (avoiding compliance training)
   - Review Hours: 2 hours
   - Deliverable: Autonomy and dignity review
```

**Total Review Time**: 24 hours across 7 experts
**Timeline**: 10 business days (most complex AAC game)

---

### Game 7: Social Scenarios (Multiplayer)

**Skills Taught**:
1. VB-MAPP 9L: Conversation Skills (Social Communication)
2. ABLLS-R N3: Turn-Taking (Social Skills)
3. PEAK-ER 12C: Perspective-Taking (Social-Emotional)

**Required Experts** (Auto-Generated):
```
✅ BCBA (Mandatory, Order 1)
   - Focus: Social skills teaching, peer interaction, turn-taking
   - Review Hours: 6 hours
   - Deliverable: Social skills methodology

✅ SLP (Mandatory, Order 1)
   - Focus: Pragmatic language, conversation repair, topic maintenance
   - Review Hours: 5 hours
   - Deliverable: Pragmatic language validation

✅ Autistic Advocate (Mandatory, Order 2) ⚠️ CRITICAL
   - Focus: Avoiding ableist social expectations, masking prevention
   - Review Hours: 4 hours
   - Deliverable: Neurodiversity-affirming social skills

✅ Child Psychologist (Mandatory, Order 2)
   - Focus: Perspective-taking development, Theory of Mind
   - Review Hours: 3 hours
   - Deliverable: Social-emotional appropriateness

✅ Social Worker (Recommended, Order 2)
   - Focus: Real-world social situations, cultural sensitivity
   - Review Hours: 2 hours
   - Deliverable: Social context accuracy

✅ Parent Representative (Mandatory, Order 4)
   - Focus: Sibling co-play feasibility, home practice
   - Review Hours: 2 hours
   - Deliverable: Family usability feedback

✅ Accessibility Specialist (Mandatory, Order 3)
   - Focus: Multiplayer accessibility, AAC in social contexts
   - Review Hours: 3 hours
   - Deliverable: Social accessibility report
```

**Total Review Time**: 25 hours across 7 experts
**Timeline**: 12 business days (most sensitive content)

**⚠️ SPECIAL NOTE**: Social skills games MUST have Autistic Advocate approval due to historical issues with ABA "social compliance" training that forced masking and caused trauma.

---

## 6. AUTOMATED ROUTING SYSTEM

### Backend Implementation

```typescript
// TypeScript/Node.js backend API

interface Skill {
  id: string;
  skillCode: string;
  name: string;
  primaryDomain: string;
  secondaryDomains: string[];
  assessmentFramework: string;
  ageRangeMin: number;
  ageRangeMax: number;
}

interface Game {
  id: string;
  name: string;
  skillsTaught: Skill[];
  developmentPhase: 'design' | 'prototype' | 'alpha' | 'beta' | 'production';
}

interface ExpertRequirement {
  expertType: string;
  priority: 'mandatory' | 'recommended';
  reviewFocus: string;
  reviewOrder: number;
  estimatedHours: number;
}

class ExpertRoutingEngine {

  /**
   * Main routing function - determines all experts needed for a game
   */
  public async getRequiredExpertsForGame(game: Game): Promise<ExpertRequirement[]> {
    const expertMap = new Map<string, ExpertRequirement>();

    // Always require BCBA (all games use ABA principles)
    this.addExpert(expertMap, {
      expertType: 'BCBA',
      priority: 'mandatory',
      reviewFocus: 'ABA skill acquisition methodology, reinforcement, prompting',
      reviewOrder: 1,
      estimatedHours: 4
    });

    // Analyze each skill
    for (const skill of game.skillsTaught) {
      const skillExperts = await this.getExpertsForSkill(skill);

      for (const expert of skillExperts) {
        this.addExpert(expertMap, expert);
      }
    }

    // Universal reviews
    this.addUniversalExperts(expertMap, game);

    // Sort by review order, then by priority
    return Array.from(expertMap.values()).sort((a, b) => {
      if (a.reviewOrder !== b.reviewOrder) return a.reviewOrder - b.reviewOrder;
      return a.priority === 'mandatory' ? -1 : 1;
    });
  }

  /**
   * Determine experts for individual skill
   */
  private async getExpertsForSkill(skill: Skill): Promise<ExpertRequirement[]> {
    const experts: ExpertRequirement[] = [];

    // Domain-based routing
    switch (skill.primaryDomain) {
      case 'Receptive Language':
      case 'Expressive Language':
      case 'AAC':
        experts.push({
          expertType: 'SLP',
          priority: 'mandatory',
          reviewFocus: `${skill.primaryDomain}: ${skill.name}`,
          reviewOrder: 1,
          estimatedHours: 3
        });
        break;

      case 'Social Communication':
      case 'Social Skills':
        experts.push({
          expertType: 'SLP',
          priority: 'mandatory',
          reviewFocus: 'Pragmatic language and social communication',
          reviewOrder: 1,
          estimatedHours: 4
        });
        experts.push({
          expertType: 'Autistic Advocate',
          priority: 'mandatory',
          reviewFocus: 'Neurodiversity-affirming social expectations',
          reviewOrder: 2,
          estimatedHours: 3
        });
        break;

      case 'Fine Motor':
      case 'Gross Motor':
      case 'Sensory Processing':
      case 'Daily Living Skills':
        experts.push({
          expertType: 'OT',
          priority: 'mandatory',
          reviewFocus: `${skill.primaryDomain}: ${skill.name}`,
          reviewOrder: 1,
          estimatedHours: 3
        });
        break;

      case 'Emotional Regulation':
        experts.push({
          expertType: 'Child Psychologist',
          priority: 'mandatory',
          reviewFocus: 'Emotion identification and regulation strategies',
          reviewOrder: 2,
          estimatedHours: 3
        });
        break;
    }

    // Age-based routing
    if (skill.ageRangeMin <= 3) {
      experts.push({
        expertType: 'Developmental Pediatrician',
        priority: 'recommended',
        reviewFocus: 'Developmental appropriateness for ages 0-3',
        reviewOrder: 2,
        estimatedHours: 2
      });
    }

    // Framework-based routing
    if (skill.assessmentFramework === 'AFLS') {
      experts.push({
        expertType: 'AFLS Specialist',
        priority: 'recommended',
        reviewFocus: 'AFLS assessment alignment',
        reviewOrder: 2,
        estimatedHours: 2
      });
    }

    return experts;
  }

  /**
   * Add universal experts that review all games
   */
  private addUniversalExperts(expertMap: Map<string, ExpertRequirement>, game: Game): void {
    this.addExpert(expertMap, {
      expertType: 'Accessibility Specialist',
      priority: 'mandatory',
      reviewFocus: 'WCAG 2.1 AA compliance, autism-specific accommodations',
      reviewOrder: 3,
      estimatedHours: 3
    });

    this.addExpert(expertMap, {
      expertType: 'Parent Representative',
      priority: 'mandatory',
      reviewFocus: 'Usability, real-world feasibility, clarity',
      reviewOrder: 4,
      estimatedHours: 1
    });
  }

  /**
   * Merge expert requirements (upgrade priority, combine focuses)
   */
  private addExpert(map: Map<string, ExpertRequirement>, expert: ExpertRequirement): void {
    const existing = map.get(expert.expertType);

    if (!existing) {
      map.set(expert.expertType, expert);
      return;
    }

    // Upgrade to mandatory if any skill requires it
    if (expert.priority === 'mandatory') {
      existing.priority = 'mandatory';
    }

    // Combine review focuses
    if (!existing.reviewFocus.includes(expert.reviewFocus)) {
      existing.reviewFocus += `; ${expert.reviewFocus}`;
    }

    // Sum estimated hours
    existing.estimatedHours += expert.estimatedHours;

    // Take earliest review order
    existing.reviewOrder = Math.min(existing.reviewOrder, expert.reviewOrder);
  }

  /**
   * Assign specific expert users to review this game
   */
  public async assignExperts(gameId: string, requirements: ExpertRequirement[]): Promise<void> {
    for (const req of requirements) {
      // Find available expert of this type
      const expertUser = await this.findAvailableExpert(req.expertType);

      if (!expertUser) {
        throw new Error(`No available ${req.expertType} expert found`);
      }

      // Create review assignment in database
      await db.gameExpertReviews.create({
        gameId: gameId,
        expertType: req.expertType,
        expertUserId: expertUser.id,
        priority: req.priority,
        reviewFocus: req.reviewFocus,
        reviewOrder: req.reviewOrder,
        status: 'not_started',
        assignedDate: new Date()
      });

      // Send notification to expert
      await this.notifyExpert(expertUser, gameId, req);
    }
  }

  /**
   * Find expert with capacity for review
   */
  private async findAvailableExpert(expertType: string): Promise<User | null> {
    // Get all experts of this type
    const experts = await db.users.findMany({
      where: {
        role: expertType,
        isActive: true
      }
    });

    // Find expert with lowest current workload
    let bestExpert = null;
    let lowestWorkload = Infinity;

    for (const expert of experts) {
      const currentReviews = await db.gameExpertReviews.count({
        where: {
          expertUserId: expert.id,
          status: { in: ['not_started', 'in_review'] }
        }
      });

      if (currentReviews < lowestWorkload) {
        lowestWorkload = currentReviews;
        bestExpert = expert;
      }
    }

    return bestExpert;
  }

  /**
   * Send email/notification to expert about new review
   */
  private async notifyExpert(expert: User, gameId: string, req: ExpertRequirement): Promise<void> {
    const game = await db.games.findUnique({ where: { id: gameId } });

    await emailService.send({
      to: expert.email,
      subject: `New Game Review Assignment: ${game.name}`,
      template: 'expert_review_assignment',
      data: {
        expertName: expert.name,
        gameName: game.name,
        priority: req.priority,
        reviewFocus: req.reviewFocus,
        estimatedHours: req.estimatedHours,
        deadline: this.calculateDeadline(req.priority),
        reviewUrl: `${process.env.APP_URL}/expert/reviews/${gameId}`
      }
    });
  }

  private calculateDeadline(priority: string): Date {
    const now = new Date();
    // Mandatory: 3 business days, Recommended: 5 business days
    const days = priority === 'mandatory' ? 3 : 5;
    return addBusinessDays(now, days);
  }
}

export default ExpertRoutingEngine;
```

---

## 7. EXPERT REVIEW DASHBOARD

### Expert Portal UI

**URL**: `https://skillbridge.com/expert/reviews`

#### Expert Landing Page

```
┌─────────────────────────────────────────────────────────┐
│ SkillBridge Expert Portal - Dr. Emily Foster, BCBA-D   │
│ [My Reviews] [All Games] [Profile] [Help] [Logout]     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ PENDING REVIEWS (3)                                     │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ 🔴 URGENT - Color Matching Puzzle                 │   │
│ │ Priority: Mandatory | Due: Oct 15 (2 days)       │   │
│ │ Focus: Visual discrimination, reinforcement       │   │
│ │ Est. Time: 4 hours                                │   │
│ │ Status: Not Started                               │   │
│ │ [START REVIEW] [View GDD]                        │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ 🟡 Emotion Recognition Game                       │   │
│ │ Priority: Mandatory | Due: Oct 18 (5 days)       │   │
│ │ Focus: Emotion discrimination, social skills     │   │
│ │ Est. Time: 5 hours                                │   │
│ │ Status: Not Started                               │   │
│ │ [START REVIEW] [View GDD]                        │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ ┌──────────────────────────────────────────────────┐   │
│ │ ⚪ Counting Adventure (Recommended)               │   │
│ │ Priority: Recommended | Due: Oct 20 (7 days)     │   │
│ │ Focus: Number concept teaching                   │   │
│ │ Est. Time: 3 hours                                │   │
│ │ Status: Not Started                               │   │
│ │ [START REVIEW] [View GDD]                        │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ IN REVIEW (1)                                           │
│ ┌──────────────────────────────────────────────────┐   │
│ │ ⏳ Pattern Builder                                 │   │
│ │ Started: Oct 11 | Time Spent: 2.5 / 4 hours      │   │
│ │ [CONTINUE REVIEW]                                │   │
│ └──────────────────────────────────────────────────┘   │
│                                                          │
│ COMPLETED (12)                                          │
│ [View Archive]                                          │
└─────────────────────────────────────────────────────────┘
```

#### Review Form (BCBA Example)

```
┌─────────────────────────────────────────────────────────┐
│ BCBA Clinical Review: Color Matching Puzzle            │
│ Game ID: GAME-001 | Review Due: Oct 15, 2025           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ SECTION 1: SKILL ALIGNMENT                             │
│                                                          │
│ Skills Taught:                                          │
│ • ABLLS-R B1-B3: Match Identical Colors                │
│ • ABLLS-R C12: Sort by Color Category                  │
│ • ABLLS-R G2: Receptive Color Identification           │
│                                                          │
│ Q1: Do the game mechanics accurately teach these       │
│     skills? (Required)                                  │
│ [X] Yes, fully aligned                                  │
│ [ ] Mostly aligned, minor adjustments needed            │
│ [ ] Partially aligned, significant revisions required   │
│ [ ] No, fundamental redesign needed                     │
│                                                          │
│ Comments:                                               │
│ ┌────────────────────────────────────────────────┐     │
│ │ Excellent skill mapping. Drag-and-drop mechanic│     │
│ │ perfectly suits matching/sorting tasks. Clear  │     │
│ │ progression from 2 → 12 colors aligns with     │     │
│ │ ABLLS-R developmental sequence.                │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ Q2: Are prerequisite skills appropriately identified?  │
│ [X] Yes [ ] No [ ] N/A                                  │
│                                                          │
│ ───────────────────────────────────────────────────     │
│                                                          │
│ SECTION 2: PROMPTING & SCAFFOLDING                     │
│                                                          │
│ Q3: Does the prompting hierarchy follow ABA best       │
│     practices? (Required)                               │
│ [X] Yes, errorless teaching appropriate                │
│ [ ] Needs adjustment                                    │
│                                                          │
│ Prompting Levels Reviewed:                             │
│ ✓ Level 0: Independent                                 │
│ ✓ Level 1: Observational                               │
│ ✓ Level 2: Gestural                                    │
│ ✓ Level 3: Partial Physical                            │
│ ✓ Level 4: Full Physical (errorless)                   │
│                                                          │
│ Q4: Is prompt fading strategy evidence-based?          │
│ [X] Yes [ ] No                                          │
│                                                          │
│ Comments:                                               │
│ ┌────────────────────────────────────────────────┐     │
│ │ Prompting system excellent. Love the automatic │     │
│ │ fading based on success rate. Errorless mode   │     │
│ │ prevents frustration while maintaining         │     │
│ │ learning. Suggest adding option for BCBAs to   │     │
│ │ manually adjust prompt level per child.        │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ ───────────────────────────────────────────────────     │
│                                                          │
│ SECTION 3: REINFORCEMENT                               │
│                                                          │
│ Q5: Is the reinforcement schedule appropriate?         │
│ [X] Yes, continuous initially then intermittent        │
│ [ ] Too frequent (risk of satiation)                   │
│ [ ] Too infrequent (insufficient motivation)           │
│                                                          │
│ Q6: Are reinforcers appropriate for target age?        │
│ [X] Yes [ ] No                                          │
│                                                          │
│ Comments:                                               │
│ ┌────────────────────────────────────────────────┐     │
│ │ Reinforcement well-balanced. Points + stars +  │     │
│ │ visual celebration is age-appropriate. Concern:│     │
│ │ Badge unlocks might create dependency - ensure │     │
│ │ intrinsic motivation (mastery) also emphasized.│     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ ───────────────────────────────────────────────────     │
│                                                          │
│ SECTION 4: DATA COLLECTION                             │
│                                                          │
│ Q7: Does data collection capture meaningful metrics?  │
│ [X] Yes [ ] Partially [ ] No                            │
│                                                          │
│ Metrics Reviewed:                                       │
│ ✓ Accuracy (correct/total)                             │
│ ✓ Prompt level dependency                              │
│ ✓ Response time (latency)                              │
│ ✓ Error patterns                                        │
│ ✓ Mastery tracking                                     │
│                                                          │
│ Q8: Is mastery criterion scientifically sound?         │
│ [X] Yes (80%+ over 3 sessions)                         │
│ [ ] Too lenient [ ] Too stringent                      │
│                                                          │
│ ───────────────────────────────────────────────────     │
│                                                          │
│ SECTION 5: SAFETY & ETHICS                             │
│                                                          │
│ Q9: Are there any ethical concerns? (BACB Code)        │
│ [ ] Yes [X] No                                          │
│                                                          │
│ Q10: Is the game developmentally appropriate?          │
│ [X] Yes [ ] No                                          │
│                                                          │
│ Q11: Are there dignity or autonomy concerns?           │
│ [ ] Yes [X] No                                          │
│                                                          │
│ ───────────────────────────────────────────────────     │
│                                                          │
│ OVERALL ASSESSMENT                                      │
│                                                          │
│ Rating (1-5): [●●●●●] 5 - Excellent                    │
│                                                          │
│ Strengths (Auto-populated from comments):              │
│ • Skill mapping aligns perfectly with ABLLS-R          │
│ • Prompting hierarchy evidence-based                   │
│ • Errorless teaching prevents frustration              │
│ • Data collection comprehensive                        │
│                                                          │
│ Required Revisions:                                     │
│ [ ] Add item: _______________________________          │
│ (Empty - no required changes)                          │
│                                                          │
│ Optional Enhancements:                                  │
│ [X] Add item                                            │
│ ┌────────────────────────────────────────────────┐     │
│ │ 1. Add BCBA-controlled prompt level override   │     │
│ │    Priority: Low | Est. 8 hours dev time       │     │
│ │                                                │     │
│ │ 2. Reduce badge frequency to prevent           │     │
│ │    extrinsic motivation dependency             │     │
│ │    Priority: Medium | Est. 2 hours design      │     │
│ └────────────────────────────────────────────────┘     │
│                                                          │
│ RECOMMENDATION:                                         │
│ [X] APPROVED - Ready for next phase                    │
│ [ ] APPROVED WITH MINOR REVISIONS (optional)           │
│ [ ] MAJOR REVISIONS REQUIRED (re-review needed)        │
│ [ ] REJECTED (fundamental issues)                      │
│                                                          │
│ ───────────────────────────────────────────────────     │
│                                                          │
│ CLINICAL ATTESTATION                                    │
│                                                          │
│ I attest that this game, as designed, is clinically    │
│ appropriate for teaching the identified skills to      │
│ autistic children ages 2-5, follows evidence-based     │
│ ABA practices, and complies with BACB ethical          │
│ standards.                                              │
│                                                          │
│ [X] I agree to the above attestation                   │
│                                                          │
│ Digital Signature: Dr. Emily Foster, BCBA-D            │
│ Date: October 13, 2025                                 │
│ Certification #: 1-234567                              │
│                                                          │
│ [SUBMIT REVIEW] [Save Draft] [Cancel]                 │
└─────────────────────────────────────────────────────────┘
```

---

## 8. DASHBOARD FOR PROJECT MANAGER

### PM Game Review Tracker

```
┌──────────────────────────────────────────────────────────┐
│ Game Development Dashboard - Marcus Lee, Senior PM       │
│ [All Games] [Pending Reviews] [Analytics] [Team]        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│ MONTH 1 GAMES - Review Status                           │
│                                                           │
│ ┌───────────────────────────────────────────────────┐   │
│ │ Game 1: Color Matching Puzzle                      │   │
│ │ Phase: Design Review (Day 12/20)                   │   │
│ │                                                     │   │
│ │ Expert Reviews (5 total):                          │   │
│ │ ✅ BCBA           [Approved] Dr. Foster     Oct 13 │   │
│ │ ✅ SLP            [Approved] Dr. Liu        Oct 13 │   │
│ │ ⏳ OT             [In Review] Dr. Rodriguez (1d)   │   │
│ │ ⬜ Accessibility  [Not Started] J. Nguyen          │   │
│ │ ⬜ Parent Rep     [Pending] Sarah M.               │   │
│ │                                                     │   │
│ │ Overall: 40% Complete | On Track ✓                │   │
│ │ [View Details] [Send Reminder] [Reassign]         │   │
│ └───────────────────────────────────────────────────┘   │
│                                                           │
│ ┌───────────────────────────────────────────────────┐   │
│ │ Game 2: Emotion Recognition                        │   │
│ │ Phase: GDD Draft (Day 5/20)                       │   │
│ │                                                     │   │
│ │ Expert Reviews (6 total):                          │   │
│ │ ⬜ BCBA           [Scheduled] Dr. Foster    Oct 18 │   │
│ │ ⬜ SLP            [Scheduled] Dr. Liu       Oct 18 │   │
│ │ ⬜ Psychologist   [Scheduled] Dr. Patel    Oct 19 │   │
│ │ ⬜ Aut. Advocate  [Scheduled] Alex K.      Oct 19 │   │
│ │ ⬜ Accessibility  [Scheduled] J. Nguyen    Oct 22 │   │
│ │ ⬜ Parent Rep     [Scheduled] Sarah M.     Oct 23 │   │
│ │                                                     │   │
│ │ Overall: Not Started | Pre-Scheduled ✓            │   │
│ │ [View GDD Draft] [Adjust Schedule]                │   │
│ └───────────────────────────────────────────────────┘   │
│                                                           │
│ ┌───────────────────────────────────────────────────┐   │
│ │ Game 3: Counting Adventure                         │   │
│ │ Phase: Early Design (Day 2/20)                    │   │
│ │                                                     │   │
│ │ Expert Reviews: Not yet assigned                  │   │
│ │ [Analyze Skills] → [Auto-Route Experts]           │   │
│ └───────────────────────────────────────────────────┘   │
│                                                           │
│ ───────────────────────────────────────────────────────  │
│                                                           │
│ TEAM WORKLOAD                                            │
│                                                           │
│ Dr. Emily Foster (BCBA)                                  │
│ ██████████░░░░░░░░░░░░ 45% capacity (2 active reviews)  │
│                                                           │
│ Dr. James Liu (SLP)                                      │
│ ████████████░░░░░░░░░░ 60% capacity (3 active reviews)  │
│                                                           │
│ Dr. Sofia Rodriguez (OT)                                 │
│ ████░░░░░░░░░░░░░░░░░░ 20% capacity (1 active review)   │
│                                                           │
│ Jamie Nguyen (A11y)                                      │
│ ██████░░░░░░░░░░░░░░░░ 30% capacity (1 active review)   │
│                                                           │
│ ⚠️ Warning: Dr. Liu approaching capacity limit          │
│ [Rebalance Workload] [Hire Additional SLP]              │
│                                                           │
│ ───────────────────────────────────────────────────────  │
│                                                           │
│ ALERTS                                                    │
│ • Color Matching: OT review 1 day overdue                │
│ • Emotion Recognition: GDD draft ready for routing       │
│ • System: 3 games awaiting expert assignment             │
└──────────────────────────────────────────────────────────┘
```

---

## 9. QUALITY GATES & LAUNCH CRITERIA

### Gate 1: Design Approval (Day 3-5)
**Required**: 100% approval from Order 1 experts (BCBA, SLP, OT)
**Criteria**:
- All mandatory experts rated ≥3/5
- Zero "Rejected" reviews
- All "Required Revisions" addressed

**If Failed**: Game returns to design phase, re-review required

---

### Gate 2: Prototype Validation (Day 12-14)
**Required**: Order 2 experts approve (Psychologist, Advocate, Pediatrician if applicable)
**Criteria**:
- Playable prototype demonstrates design intent
- Clinical concerns from Gate 1 resolved
- No new safety/ethical issues identified

**If Failed**: Prototype iterations, expedited re-review (2 days)

---

### Gate 3: Accessibility Compliance (Day 17-18)
**Required**: Accessibility Specialist approval + zero WCAG violations
**Criteria**:
- WCAG 2.1 AA: 50/50 criteria met
- Autism-specific: 32/32 accommodations
- Screen reader functional
- All input methods working

**If Failed**: Accessibility fixes, re-audit (1 day)

---

### Gate 4: Beta Launch Approval (Day 20)
**Required**: Parent Representative approval + PM sign-off
**Criteria**:
- All previous gates passed
- Zero critical (P0) bugs
- <5 minor (P2/P3) bugs
- Load time <3 seconds
- Parent usability rating ≥4/5

**If Passed**: ✅ **APPROVED FOR BETA TESTING**

---

## 10. SUMMARY

### Workflow Overview

```
Game Design Document Created
           ↓
    [Skill Analysis]
           ↓
  Auto-Route to Experts
    (Based on Domains)
           ↓
┌──────────┴──────────┐
│   Order 1 Reviews    │
│ BCBA, SLP, OT (parallel)
│   (3-5 days)         │
└──────────┬──────────┘
           ↓
     [Gate 1: Design Approval]
           ↓
┌──────────┴──────────┐
│   Order 2 Reviews    │
│ Psychologist, Advocate
│   (2-3 days)         │
└──────────┬──────────┘
           ↓
     [Gate 2: Prototype Approval]
           ↓
  Prototype Development
           ↓
┌──────────┴──────────┐
│   Order 3 Reviews    │
│ Accessibility Specialist
│   (2 days)           │
└──────────┬──────────┘
           ↓
     [Gate 3: Accessibility Compliance]
           ↓
   Beta Build Complete
           ↓
┌──────────┴──────────┐
│   Order 4 Reviews    │
│ Parent Representative
│   (1-2 days)         │
└──────────┬──────────┘
           ↓
     [Gate 4: Beta Launch Approval]
           ↓
    ✅ LAUNCH TO BETA
```

**Total Timeline**: 12-15 business days per game (with parallel reviews)
**Total Expert Hours**: 12-25 hours per game (varies by complexity)

---

**Document Status**: ✅ **COMPLETE - READY FOR IMPLEMENTATION**

**Next Steps**:
1. Implement ExpertRoutingEngine in backend API
2. Create expert review portal UI
3. Build PM dashboard for workflow tracking
4. Train experts on review process
5. Test workflow with Game 1 (Color Matching)

---

**END OF SKILL-TO-EXPERT MAPPING SYSTEM**
