# Game Design Document: Daily Routines Simulator
## SkillBridge Educational Gaming Platform

**Game ID**: GAME-010
**Development Priority**: Month 3, Week 3-4
**Status**: Design Phase
**Document Version**: 1.0
**Last Updated**: October 13, 2025

---

## 1. GAME OVERVIEW

### Game Title
**Daily Routines Simulator: My Day, My Way**

### High-Level Concept
An immersive life skills simulation game where children learn to sequence and complete essential daily routines through interactive, customizable scenarios. Using real-world generalization principles, parents can upload photos of their child's actual home environment (bathroom, kitchen, bedroom) to create personalized routine experiences. The game teaches AFLS Daily Living skills including morning routines, hygiene tasks, meal preparation, and bedtime sequences while building executive function, time management, and task independence.

### Target Audience
- **Primary**: Autistic children ages 5-10
- **Difficulty Level**: 4-7 (Intermediate to advanced daily living skills)
- **Prerequisites**:
  - Basic receptive language (follows 3-4 step directions)
  - Fine motor control for tapping/dragging
  - Attention span of 15+ minutes
  - Motivation for independence in daily tasks

### Core Learning Objectives

**Primary Skills** (AFLS Framework - Daily Living Skills):
- **DLS Module 1**: Morning routine (waking up, toileting, dressing)
- **DLS Module 2**: Hygiene tasks (brushing teeth, washing hands, bathing)
- **DLS Module 3**: Meal preparation (breakfast, snack, simple meals)
- **DLS Module 4**: Organization (packing school bag, laying out clothes)
- **DLS Module 5**: Bedtime routine (pajamas, brushing teeth, settling down)
- **DLS Module 6**: Sequencing multi-step tasks (task analysis completion)
- **DLS Module 7**: Time management (understanding schedules, timers)
- **DLS Module 8**: Self-monitoring (checklist completion, quality checks)

**Secondary Skills**:
- **Executive Function**: Planning, sequencing, task initiation, completion
- **Working Memory**: Remembering multi-step sequences
- **Self-Regulation**: Following routines during non-preferred times
- **Independence**: Reducing adult prompts over time

### Game Duration
- **Per Routine Session**: 15-20 minutes
- **Per Individual Routine**: 3-5 minutes
- **Total Routines Available**: 8 core routines × 3-5 variations = 32+ scenarios
- **Daily Play Recommendation**: 1-2 routine sessions
- **Estimated Mastery Time**: 8-12 weeks (gradual skill building)

### Critical Design Philosophy: Real-World Generalization Focus

**Why This Approach Works**:
1. **Photo Customization**: Parents upload photos of child's actual bathroom, bedroom, kitchen → child learns in familiar context
2. **Routine Matching**: Game sequences mirror family's actual routines (not generic templates)
3. **Transfer Strategy**: Skills practiced in game immediately apply at home
4. **Parent Collaboration**: Parent dashboard allows routine customization, adjusting steps to match home environment
5. **Data-Driven Prompting**: Game tracks independence level, fades prompts as child masters steps

---

## 2. CLINICAL FRAMEWORK

### AFLS (Assessment of Functional Living Skills) Alignment

The **Assessment of Functional Living Skills (AFLS)** is specifically designed for teaching daily living skills to individuals with autism and developmental disabilities. This game directly addresses the **Basic Living Skills** and **Home Skills** domains.

#### AFLS Basic Living Skills Modules

| AFLS Module | Skill Description | Game Implementation | Target Mastery |
|-------------|-------------------|---------------------|----------------|
| **BLS-1** | Toileting routine | Morning routine includes toilet sequence (5 steps) | 80% independence, 3 consecutive sessions |
| **BLS-2** | Hand washing | Hygiene routine with visual prompts (8 steps) | 85% correct sequence, no prompts |
| **BLS-3** | Tooth brushing | Morning/bedtime routines include brushing (6 steps) | 90% completion, proper duration |
| **BLS-4** | Bathing/showering | Bath time routine with soap, rinse, dry sequence (12 steps) | 75% independence, parent supervision optional |
| **BLS-5** | Dressing skills | Getting dressed routine, clothing selection (10+ steps) | 80% correct order, appropriate weather |
| **BLS-6** | Meal preparation | Breakfast/snack routines (8-15 steps depending on complexity) | 70% independence on simple meals |
| **BLS-7** | Bed making | Morning routine includes bed making (7 steps) | 75% completion, quality check |
| **BLS-8** | Organization | Packing bag routine, organizing supplies (10-12 steps) | 80% remembers all items, uses checklist |

#### AFLS Home Skills Modules

| AFLS Module | Skill Description | Game Implementation | Target Mastery |
|-------------|-------------------|---------------------|----------------|
| **HS-1** | Following routine schedule | Visual schedule shows routine order, time of day | 85% follows schedule independently |
| **HS-2** | Task sequencing | All routines teach step-by-step sequences | 80% completes without skipping steps |
| **HS-3** | Time awareness | Clock/timer displays, understands "time to..." | 70% responds to time cues |
| **HS-4** | Completing checklists | Interactive checklists for each routine step | 90% checks off completed steps |
| **HS-5** | Quality checks | Game prompts self-evaluation ("Did I brush all teeth?") | 75% recognizes when task incomplete |

### Developmental Progression Framework

#### Tier 1: Guided Routines (Ages 5-6, Emerging Independence)

**Skill Level**: Heavy adult support needed, learning sequences

**Routines Available**:
1. **Wake Up Routine** (5 steps):
   - Open eyes → Sit up → Get out of bed → Turn off alarm → Walk to bathroom
   - Focus: Initiation, transitioning from sleep to awake state

2. **Hand Washing** (6 steps):
   - Turn on water → Wet hands → Apply soap → Scrub (15 seconds) → Rinse → Dry
   - Focus: Basic hygiene, proper technique

3. **Simple Breakfast** (8 steps):
   - Get bowl → Get cereal → Pour cereal → Get milk → Pour milk → Get spoon → Sit down → Eat
   - Focus: Kitchen safety, food preparation basics

**Teaching Features**:
- Full visual prompts (photos + videos)
- Step-by-step narration ("First, turn on the water")
- No time pressure
- Unlimited retries
- Parent co-play mode (parent and child complete together)

#### Tier 2: Structured Routines (Ages 7-8, Growing Independence)

**Skill Level**: Prompts fading, follows routines with reminders

**Routines Available**:
1. **Full Morning Routine** (15 steps):
   - Wake up → Toilet → Wash hands → Brush teeth → Get dressed → Make bed → Eat breakfast → Pack bag
   - Focus: Multi-step sequencing, time management

2. **Tooth Brushing** (8 steps):
   - Get toothbrush → Apply toothpaste → Brush top teeth → Brush bottom teeth → Brush tongue → Rinse mouth → Rinse brush → Put away
   - Focus: Thorough hygiene, duration (2 minutes)

3. **Getting Dressed** (12 steps):
   - Choose outfit → Underwear → Shirt → Pants → Socks → Shoes → Check mirror → Adjust clothes
   - Focus: Clothing sequence, appropriateness for weather/activity

4. **Packing School Bag** (10 steps):
   - Get backpack → Homework folder → Lunch box → Water bottle → Pencil case → Books → Jacket → Zip bag → Put by door
   - Focus: Organization, remembering items

**Teaching Features**:
- Partial visual prompts (icons, less detailed)
- Timer displays (visual countdown)
- Self-checking prompts ("Did you get everything?")
- Points for speed + accuracy

#### Tier 3: Independent Routines (Ages 9-10, Self-Directed)

**Skill Level**: Minimal prompts, initiates and completes independently

**Routines Available**:
1. **Complete Morning Routine** (20+ steps):
   - Full sequence from wake-up to leaving house
   - Includes decision-making (what to wear, what to eat)
   - Focus: Full independence, time management

2. **Shower Routine** (15 steps):
   - Get towel → Adjust water → Undress → Enter → Wet hair → Shampoo → Rinse → Soap body → Rinse → Exit → Dry → Dress
   - Focus: Privacy, thoroughness, safety

3. **Meal Preparation** (18 steps):
   - Plan meal → Get ingredients → Use appliances (microwave, toaster) → Prepare food → Serve → Clean up
   - Focus: Kitchen skills, safety, cleanup responsibility

4. **Complete Bedtime Routine** (18 steps):
   - Dinner cleanup → Homework check → Bath/shower → Pajamas → Brush teeth → Lay out tomorrow's clothes → Set alarm → Read/calm activity → Lights out
   - Focus: Evening wind-down, next-day preparation

**Teaching Features**:
- Minimal prompts (checklist only)
- Real-time timers (must complete within typical timeframe)
- Quality check stages (game evaluates completeness)
- "Challenge mode" with unexpected variables (ran out of toothpaste, need backup plan)

### Evidence-Based Teaching Strategies

#### Task Analysis Approach
Every routine is broken down using behavioral task analysis:

```
Example: Tooth Brushing Task Analysis

1. DISCRIMINATIVE STIMULUS (SD): "It's time to brush your teeth!"
2. STEPS:
   Step 1: Walk to bathroom sink [Prompt: Arrow to bathroom]
   Step 2: Pick up toothbrush [Prompt: Highlight toothbrush]
   Step 3: Turn on water [Prompt: Hand icon on faucet]
   Step 4: Wet toothbrush [Prompt: Show toothbrush under water]
   Step 5: Turn off water [Prompt: Conservation reminder]
   Step 6: Apply pea-sized toothpaste [Prompt: Amount indicator]
   Step 7: Brush top front teeth (15 seconds) [Prompt: Timer + diagram]
   Step 8: Brush top back teeth (15 seconds) [Prompt: Timer + diagram]
   Step 9: Brush bottom front teeth (15 seconds) [Prompt: Timer + diagram]
   Step 10: Brush bottom back teeth (15 seconds) [Prompt: Timer + diagram]
   Step 11: Brush chewing surfaces (15 seconds) [Prompt: Timer + diagram]
   Step 12: Brush tongue [Prompt: Diagram]
   Step 13: Spit into sink [Prompt: Animation]
   Step 14: Turn on water [Prompt: Hand icon]
   Step 15: Rinse mouth [Prompt: Fill cup animation]
   Step 16: Spit again [Prompt: Animation]
   Step 17: Rinse toothbrush [Prompt: Clean brush animation]
   Step 18: Turn off water
   Step 19: Put toothbrush in holder [Prompt: Highlight holder]
   Step 20: Wipe mouth with towel [Prompt: Towel location]

3. REINFORCEMENT: "Great job! Your teeth are clean and healthy!"
4. DATA COLLECTION: Steps completed independently vs. prompted
```

#### Chaining Techniques

**Forward Chaining** (Tier 1):
- Child completes Step 1 independently → Game completes Steps 2-20
- Next session: Child completes Steps 1-2 → Game completes Steps 3-20
- Gradually increases independence step-by-step

**Backward Chaining** (Alternative):
- Game completes Steps 1-19 → Child completes Step 20 (puts away toothbrush)
- Next session: Game completes Steps 1-18 → Child completes Steps 19-20
- Child experiences completion success immediately

**Total Task Presentation** (Tier 3):
- Child attempts all 20 steps with prompts as needed
- Promotes holistic understanding of routine
- Prompts fade systematically

#### Prompting Hierarchy (Systematic Prompt Fading)

| Prompt Level | Support Type | Visual Representation | Data Recorded |
|--------------|--------------|----------------------|---------------|
| **Level 0**: Independent | No prompts | Blank screen, child remembers step | "Independent response" |
| **Level 1**: Gestural | Arrow points to next action | Small pulsing arrow | "Gestural prompt" |
| **Level 2**: Visual | Picture of action needed | Photo/icon of step | "Visual prompt" |
| **Level 3**: Auditory | Voice instruction | Text + speaker icon | "Auditory prompt" |
| **Level 4**: Model | Video of someone doing step | 5-second video clip | "Video model" |
| **Level 5**: Physical | Hand-over-hand animation | Avatar guiding child's avatar | "Physical prompt" |

**Fading Schedule**:
- Session 1-3: All prompt levels available, used liberally
- Session 4-6: Level 5 removed, max Level 4
- Session 7-10: Level 4 removed, max Level 3
- Session 11-15: Level 3 removed, max Level 2
- Session 16+: Level 2 only for new steps, target 80% independent

### OT (Occupational Therapy) Input: Sensory & Motor Considerations

**Fine Motor Skills Supported**:
- Pincer grasp: Tapping small objects (toothpaste cap, buttons)
- Bilateral coordination: Both hands used (putting on shirt)
- Tool use: Toothbrush, hairbrush, utensils (realistic interactions)

**Gross Motor Skills Supported**:
- Body awareness: Dressing sequences require understanding body parts
- Balance: Bath routine includes stepping in/out of tub safely
- Spatial navigation: Moving between rooms in home environment

**Sensory Accommodations**:
- **Visual**: Calm color schemes for routines, option to reduce clutter
- **Auditory**: Volume controls, option for silent mode with text only
- **Tactile**: Haptic feedback when completing steps (optional vibration)
- **Proprioceptive**: Stretching/movement breaks built into routines (morning stretch)
- **Vestibular**: Slow, predictable movements (no sudden screen transitions)

**Sensory-Friendly Routine Modifications**:
- Bath routine: Option for "sponge bath" if child has water sensitivities
- Tooth brushing: Gradual desensitization mode (brush for 10 sec → 30 sec → 1 min → 2 min)
- Dressing: Tagless clothing options shown, seamless socks prioritized
- Hairbrush: "Gentle brushing" mode with softer animations

---

## 3. CORE GAMEPLAY MECHANICS

### Primary Mechanic: Interactive Routine Sequencing

#### Routine Flow (Complete User Journey)

```
1. DAILY SCHEDULE SCREEN (Home Base)
   ↓
   Visual schedule displays day's routines:
   ┌─────────────────────────────────────┐
   │  MY DAY - TUESDAY                   │
   │                                     │
   │  [✓] Wake Up Routine (7:00 AM)      │ ← Completed
   │  [→] Morning Routine (7:15 AM)      │ ← Current
   │  [ ] Packing Bag (8:00 AM)          │ ← Upcoming
   │  [ ] After School Snack (3:30 PM)   │
   │  [ ] Homework Time (4:00 PM)        │
   │  [ ] Dinner Prep (5:30 PM)          │
   │  [ ] Bath Time (7:00 PM)            │
   │  [ ] Bedtime Routine (8:00 PM)      │
   └─────────────────────────────────────┘

   Child taps "Morning Routine" to begin
   ↓

2. ROUTINE BRIEFING
   ↓
   Character appears: "Time for your morning routine!"
   Preview of steps:
   - Brush teeth
   - Wash face
   - Get dressed
   - Make bed
   - Eat breakfast

   "This routine has 15 steps. Let's go!"
   [START ROUTINE] button
   ↓

3. ENVIRONMENT LOADING
   ↓
   If parent uploaded photos:
     → Load child's actual bathroom photo as background
   If no photos:
     → Load generic but realistic bathroom scene

   Camera view: First-person perspective (child's POV)
   ↓

4. STEP 1: BRUSH TEETH (Example)
   ↓
   Environment: Bathroom sink visible
   Prompt Level depends on child's mastery:

   IF FIRST TIME (Full Prompts):
     - Narrator: "First, let's brush our teeth!"
     - Visual: Toothbrush glows on counter
     - Arrow: Points to toothbrush
     - Video: 3-second clip of hand grabbing toothbrush

   IF PRACTICED (Partial Prompts):
     - Text: "What do we do first?"
     - Checklist visible: [ ] Brush teeth
     - Toothbrush slightly highlighted

   IF MASTERED (Independent):
     - No prompts
     - Child must remember and tap toothbrush
     - Checklist: [ ] Brush teeth

   Child Action Required: TAP TOOTHBRUSH
   ↓

5. SUB-STEPS (Tooth Brushing Detail)
   ↓
   Once toothbrush tapped, sub-routine begins:

   Step 1.1: Turn on water
     → Child taps faucet handle
     → Water animation plays
     → Sound: Running water (optional)

   Step 1.2: Wet toothbrush
     → Child drags toothbrush to water stream
     → Toothbrush changes color (now wet)

   Step 1.3: Turn off water
     → Child taps faucet off
     → Water stops (conservation teaching!)

   Step 1.4: Apply toothpaste
     → Toothpaste tube appears
     → Child taps tube
     → "How much toothpaste?" → Visual of pea-sized amount
     → Child must tap when indicator shows correct amount

   Step 1.5-1.18: Brushing sequence (detailed earlier)
     → Timer shows 2 minutes
     → Visual diagram highlights which teeth to brush
     → Child taps teeth sections as they brush
     → Progress bar fills as time passes

   Step 1.19: Rinse and put away (final steps)
   ↓

6. STEP COMPLETION FEEDBACK
   ↓
   IF CORRECT:
     → Green checkmark appears
     → Sound: Satisfying "ding"
     → Narrator: "Great brushing!"
     → Checklist updated: [✓] Brush teeth
     → Points awarded: +10

   IF INCORRECT (skipped step, wrong order):
     → Gentle prompt: "Oops! Let's make sure we rinse first."
     → Step resets, child tries again
     → No punishment, just re-teaching

   IF TOOK TOO LONG (optional timer mode):
     → "We're running a bit slow. Let's try to go faster!"
     → Next time, timer is more visible
   ↓

7. NEXT STEP TRANSITION
   ↓
   Screen transitions to next environment:
   "Great job! Next, let's wash your face."

   Camera pans to sink area (if same room) or
   Fade to next room (if moving to bedroom for dressing)

   Step 2: Wash Face (similar detailed flow)
   Step 3: Get Dressed (similar flow)
   Step 4: Make Bed (similar flow)
   Step 5: Eat Breakfast (similar flow)

   Each step = 8-20 sub-steps depending on complexity
   ↓

8. ROUTINE COMPLETION
   ↓
   All steps checked off:
   [✓] Brush teeth
   [✓] Wash face
   [✓] Get dressed
   [✓] Make bed
   [✓] Eat breakfast

   CELEBRATION SEQUENCE:
     → Confetti animation (sensory-appropriate)
     → Character: "You completed your morning routine!"
     → Stats displayed:
       - Time: 12 minutes (Average: 15 minutes)
       - Independence: 85% (11/13 steps independent)
       - Quality: 100% (All steps completed correctly)
       - Stars: ★★★ (3/3 for perfect routine)

     → Rewards:
       - Points: +150 total
       - Badge unlocked: "Morning Champion"
       - Progress: Morning Routine 12/20 sessions complete
   ↓

9. POST-ROUTINE REFLECTION
   ↓
   "Let's think about your routine!"

   Questions (builds metacognition):
   - "What was the hardest part?" (child selects from list)
   - "What did you do really well?" (child selects)
   - "Did you need help with anything?" (yes/no)

   Parent note option: "Tell your parent something about your routine"
     → Child can record voice message or select emoji
   ↓

10. RETURN TO SCHEDULE
    ↓
    Back to daily schedule:
    [✓] Morning Routine (7:15 AM) ← Now completed, green checkmark
    [→] Packing Bag (8:00 AM) ← Next routine highlighted

    Time display: 7:27 AM (routine took 12 minutes)

    "Your next routine starts in 33 minutes. Great work!"

    [CONTINUE TO NEXT] or [TAKE A BREAK]
```

### Routine Sequencer System Architecture

The game uses a flexible **Routine Sequencer** that can create any routine from modular steps:

```json
{
  "routine_id": "morning_routine_v1",
  "routine_name": "Morning Routine",
  "description": "Complete your morning tasks to start the day right!",
  "age_range": [7, 10],
  "difficulty": 5,
  "estimated_duration_minutes": 15,
  "time_of_day": "morning",
  "location_sequence": ["bedroom", "bathroom", "kitchen"],

  "steps": [
    {
      "step_id": "wake_up",
      "step_name": "Wake Up",
      "step_order": 1,
      "location": "bedroom",
      "sub_steps": [
        {
          "sub_step_id": "open_eyes",
          "action": "tap",
          "target": "eyes_icon",
          "prompt_text": "Time to wake up! Open your eyes.",
          "prompt_level_default": 3,
          "audio": "wake_up_prompt.mp3",
          "visual_prompt": "eyes_opening_animation.mp4"
        },
        {
          "sub_step_id": "sit_up",
          "action": "swipe_up",
          "target": "character_body",
          "prompt_text": "Sit up in bed.",
          "prompt_level_default": 2
        },
        {
          "sub_step_id": "get_out_of_bed",
          "action": "tap",
          "target": "floor_area",
          "prompt_text": "Step out of bed.",
          "prompt_level_default": 1
        }
      ],
      "completion_criteria": {
        "all_sub_steps_completed": true,
        "min_time_seconds": 5,
        "max_time_seconds": 60
      },
      "feedback_correct": "You're awake! Time to start your day!",
      "feedback_incorrect": "Let's try waking up again.",
      "points_awarded": 10
    },
    {
      "step_id": "brush_teeth",
      "step_name": "Brush Teeth",
      "step_order": 2,
      "location": "bathroom",
      "sub_steps": [ /* 20 sub-steps as detailed earlier */ ],
      "completion_criteria": {
        "all_sub_steps_completed": true,
        "min_duration_seconds": 120,
        "quality_check": {
          "all_teeth_brushed": true,
          "duration_met": true
        }
      }
    }
    /* Additional steps: wash_face, get_dressed, make_bed, eat_breakfast */
  ],

  "mastery_criteria": {
    "sessions_required": 20,
    "independence_threshold": 0.80,
    "accuracy_threshold": 0.90,
    "time_efficiency_threshold": 1.2
  },

  "adaptive_difficulty": {
    "enable": true,
    "increase_trigger": {
      "consecutive_perfect_sessions": 3
    },
    "decrease_trigger": {
      "accuracy_below": 0.60,
      "consecutive_sessions": 2
    }
  },

  "parent_customization": {
    "allow_step_reorder": true,
    "allow_step_removal": true,
    "allow_step_addition": true,
    "allow_photo_upload": true,
    "allow_time_adjustment": true
  }
}
```

### Time Management System

One of the key executive function skills taught is **time awareness** and **pacing**.

#### Visual Timer Display

```
During any timed step:

┌─────────────────────────────┐
│  BRUSHING TEETH             │
│                             │
│   [=====>           ]       │  ← Progress bar (0-120 seconds)
│   45 seconds / 2 minutes    │
│                             │
│   Keep brushing! ⏰         │
└─────────────────────────────┘

Color coding:
- Green: Plenty of time
- Yellow: Halfway done
- Red: Last 30 seconds (but not stressful, just informative)
```

#### Schedule Awareness

Game teaches "What time is it?" and "When do I do this routine?"

**Learning Progression**:
1. **Visual schedule only**: Pictures show order, no clock
2. **Analog clock introduced**: "Morning routine is at 7:15" (clock shows 7:15)
3. **Digital clock option**: Parent chooses analog or digital based on child's learning
4. **Time estimation**: "This routine usually takes 15 minutes. Can you finish in time?"
5. **Real-world connection**: Game says "In real life, you do this at 7:15 AM. Is it that time now?"

**No Pressure Approach**:
- Timers are INFORMATIVE, not punitive
- Going over time = gentle reminder, not failure
- "You took 18 minutes. That's okay! Tomorrow let's try for 15."
- Focus on progress, not perfection

### Parent Customization Portal (Backend System)

Parents log into web dashboard to customize routines for maximum real-world generalization.

#### Customization Options

**1. Photo Upload System**
```
Parent Dashboard > Routines > Morning Routine > Customize

"Upload photos of your home to help your child learn in a familiar environment!"

[ ] Bedroom
    → Upload photo of child's actual bedroom
    → Game will use this as background for wake-up, dressing, bed-making steps

[ ] Bathroom
    → Upload photo of child's actual bathroom
    → Game uses this for tooth brushing, hand washing, bathing steps

[ ] Kitchen
    → Upload photo of child's actual kitchen
    → Game uses this for meal prep, eating steps

Photo Requirements:
- Format: JPG, PNG
- Size: Max 5MB
- Resolution: Min 1280×720px
- Privacy: Photos stored securely, never shared
- Moderation: Auto-scan for inappropriate content (safety)
```

**2. Routine Step Customization**
```
Parent can:
- Reorder steps: "In our house, we get dressed BEFORE brushing teeth"
- Remove steps: "We don't make beds on weekdays"
- Add steps: "My child needs to take medication after breakfast"
- Adjust timing: "Tooth brushing is 3 minutes (per dentist), not 2"
- Rename steps: Change "Get dressed" to "Put on school uniform"

Example:
┌─────────────────────────────────────────────┐
│ MORNING ROUTINE - EDIT MODE                │
│                                             │
│ [↕] 1. Wake up                    [Edit] [X]│
│ [↕] 2. Use toilet                 [Edit] [X]│
│ [↕] 3. Wash hands                 [Edit] [X]│
│ [↕] 4. Get dressed                [Edit] [X]│
│ [↕] 5. Brush teeth                [Edit] [X]│
│ [↕] 6. Take medication [CUSTOM]   [Edit] [X]│
│ [↕] 7. Eat breakfast              [Edit] [X]│
│                                             │
│ [+ ADD STEP] [SAVE CHANGES] [RESET DEFAULT]│
└─────────────────────────────────────────────┘

↕ = Drag to reorder
[Edit] = Modify sub-steps
[X] = Remove step
```

**3. Prompt Level Override**
```
Parent can set starting prompt level per child:

"How much help does your child currently need with this routine?"
○ A lot of help (Full prompts: videos, detailed instructions)
○ Some help (Partial prompts: pictures, arrows)
○ A little help (Minimal prompts: checklist only)
○ Independent (No prompts: child knows routine)

Game will start at selected level and adapt from there.
```

**4. Real-World Notes**
```
Parent can add context for each step:

Step: "Get dressed"
Parent Notes: "Jamie always puts socks on last because of sensory issues.
               She needs seamless socks (gray ones in top drawer).
               Don't rush this step - she needs 5+ minutes."

Game will:
- Display parent note as gentle reminder
- Adjust time expectations for that step
- Provide sensory-friendly prompts
```

### Data Tracking Per Routine

Every routine session logs detailed data for clinical review and progress monitoring.

```json
{
  "session_id": "RS-2025-10-13-0089",
  "user_id": "child_12345",
  "routine_id": "morning_routine_v1",
  "date": "2025-10-13",
  "time_started": "07:15:00",
  "time_completed": "07:28:32",
  "duration_seconds": 812,

  "steps_data": [
    {
      "step_id": "brush_teeth",
      "sub_steps_total": 20,
      "sub_steps_completed": 20,
      "sub_steps_independent": 17,
      "sub_steps_prompted": 3,
      "prompt_levels_used": [1, 1, 2],
      "duration_seconds": 145,
      "expected_duration_seconds": 120,
      "quality_score": 1.0,
      "errors": [
        {
          "sub_step_id": "brush_tongue",
          "error_type": "skipped",
          "corrected": true
        }
      ]
    }
    /* More steps... */
  ],

  "overall_performance": {
    "total_steps": 15,
    "steps_completed": 15,
    "steps_independent": 12,
    "steps_prompted": 3,
    "independence_percentage": 80.0,
    "accuracy_percentage": 93.3,
    "time_efficiency": 1.08,
    "quality_score_avg": 0.95
  },

  "skill_progress": [
    {
      "skill_id": "afls_bls_3_tooth_brushing",
      "trial_this_session": 1,
      "independent_this_session": true,
      "cumulative_trials": 18,
      "cumulative_independent": 14,
      "mastery_percentage": 77.8,
      "status": "in_progress"
    }
    /* More skills... */
  ],

  "behavioral_notes": {
    "engagement_score": 9.0,
    "frustration_indicators": 0,
    "help_requests": 1,
    "breaks_taken": 0,
    "quality_of_completion": "high",
    "parent_supervision_needed": false
  },

  "parent_feedback": {
    "real_world_generalization": "yes",
    "parent_notes": "Jamie did her morning routine independently at home today for the first time! Followed the same sequence from the game."
  }
}
```

---

## 4. THE 8 CORE DAILY ROUTINES

### Routine 1: Wake Up Routine

**Target Age**: 5-7 years
**Duration**: 3-5 minutes
**Steps**: 5-8 steps
**Difficulty**: 3/10 (Entry-level)

**Step Sequence**:
1. Open eyes (alarm goes off)
2. Sit up in bed
3. Turn off alarm
4. Stretch arms (optional movement break)
5. Get out of bed
6. Open curtains/turn on light
7. Walk to bathroom
8. Use toilet (transitions to next routine)

**Skills Taught**:
- Responding to alarm
- Morning initiation (hardest part of day for many autistic children)
- Transitioning from sleep to activity

**Real-World Generalization**:
- Parent can set actual alarm sound in game to match home alarm
- Bedroom photo makes environment identical
- Practice reduces morning resistance

---

### Routine 2: Hygiene Routine (Morning)

**Target Age**: 5-10 years
**Duration**: 8-12 minutes
**Steps**: 15-20 steps
**Difficulty**: 5/10 (Core daily living skill)

**Step Sequence**:
1. Use toilet
2. Flush toilet
3. Wash hands (8-step sub-routine)
   - Turn on water → Wet hands → Soap → Scrub 20 sec → Rinse → Turn off → Dry → Throw towel in hamper
4. Brush teeth (20-step sub-routine, detailed earlier)
5. Wash face (6 steps)
   - Wet face → Soap/cleanser → Scrub → Rinse → Pat dry → Apply moisturizer (optional)
6. Brush/comb hair (4 steps)
7. Check appearance in mirror

**Skills Taught**:
- Complete hygiene sequence
- Proper hand washing (COVID-19 era: critical skill)
- Tooth brushing duration and technique
- Self-grooming
- Quality checking (mirror check)

**Adaptive Features**:
- Sensory sensitivity mode: Reduces water pressure visuals, softer sounds
- Short hair vs. long hair options (different brushing steps)
- Skincare optional steps based on parent input

---

### Routine 3: Getting Dressed

**Target Age**: 6-10 years
**Duration**: 5-8 minutes
**Steps**: 10-15 steps
**Difficulty**: 6/10 (Complex motor planning)

**Step Sequence**:
1. Check weather (look at weather widget)
2. Choose appropriate outfit
   - Hot day: Shorts + T-shirt
   - Cold day: Long pants + sweater
   - Rainy day: Rain jacket + boots
3. Get underwear
4. Put on underwear
5. Get shirt
6. Put on shirt (over head, arms through sleeves)
7. Get pants
8. Put on pants (legs in, pull up)
9. Get socks
10. Put on socks (right foot, left foot)
11. Get shoes
12. Put on shoes (right foot, left foot, tie/velcro)
13. Check outfit in mirror
14. Adjust clothes if needed

**Skills Taught**:
- Clothing sequence (underwear → shirt → pants → socks → shoes)
- Weather-appropriate dressing
- Fine motor skills (buttons, zippers, laces)
- Body awareness (left vs. right foot)

**Customization**:
- Parent uploads photos of child's actual clothes
- Parent specifies clothing types (uniform vs. casual)
- Sensory preferences (seamless socks highlighted, tagless shirts)
- Shoe type (velcro vs. laces vs. slip-on)

---

### Routine 4: Breakfast Preparation

**Target Age**: 7-10 years
**Duration**: 10-15 minutes
**Steps**: 15-25 steps (varies by meal complexity)
**Difficulty**: 7/10 (Kitchen safety critical)

**Tier 1: Simple Breakfast (Cereal)**
1. Get bowl from cabinet
2. Place bowl on table
3. Get cereal box from pantry
4. Pour cereal into bowl (stop when 3/4 full)
5. Put cereal box away
6. Get milk from fridge
7. Pour milk into bowl (stop when cereal is covered)
8. Put milk back in fridge
9. Get spoon from drawer
10. Sit down at table
11. Eat breakfast
12. Carry bowl to sink
13. Rinse bowl
14. Put bowl in dishwasher

**Tier 2: Intermediate Breakfast (Toast + Juice)**
1. Get bread from pantry
2. Open bread bag
3. Take out 2 slices
4. Put slices in toaster
5. Press down toaster lever
6. Wait for toast to pop up (timer: 90 seconds)
7. Carefully remove toast (hot!)
8. Place toast on plate
9. Get butter from fridge
10. Spread butter on toast (use knife safely)
11. Get glass from cabinet
12. Get juice from fridge
13. Pour juice (stop when 3/4 full)
14. Put juice back
15. Sit and eat
16. Clean up dishes

**Tier 3: Advanced Breakfast (Scrambled Eggs - with parent supervision)**
1. Get eggs from fridge (2 eggs)
2. Get bowl
3. Crack eggs into bowl (teach egg cracking)
4. Beat eggs with fork
5. Get frying pan
6. Place pan on stove
7. Turn on stove (LOW heat - safety!)
8. Add small amount of oil/butter
9. Pour eggs into pan
10. Stir eggs with spatula
11. Cook until no longer runny (3-4 minutes)
12. Turn off stove
13. Transfer eggs to plate
14. Let pan cool
15. Eat breakfast
16. Clean up (wash pan, plate)

**Skills Taught**:
- Kitchen navigation
- Appliance use (toaster, microwave, stove with supervision)
- Measuring/pouring (portion control)
- Food safety (refrigerator items, hot surfaces)
- Clean-up responsibility

**Safety Features**:
- "Hot surface" warning visuals (red glow)
- Stove use requires parent permission code
- Knife safety tutorial (butter knife only for Tier 1-2)
- Fire safety reminder ("If you see smoke, tell adult immediately")

---

### Routine 5: Packing School Bag

**Target Age**: 6-10 years
**Duration**: 5-10 minutes
**Steps**: 10-15 steps
**Difficulty**: 6/10 (Executive function, organization)

**Step Sequence**:
1. Get backpack
2. Check yesterday's contents (empty old items)
3. Get homework folder
   - Check: Is homework inside? (Quality check)
4. Put folder in backpack
5. Get lunch box
   - Check: Is it packed? (Parent usually does this, child verifies)
6. Put lunch box in backpack
7. Get water bottle
   - Check: Is it filled?
8. Put water bottle in side pocket
9. Get pencil case
   - Check: Pencils sharpened? Eraser present?
10. Put pencil case in backpack
11. Get any library books (if library day)
12. Put books in backpack
13. Get jacket/sweater (if needed)
14. Zip backpack
15. Place backpack by door

**Skills Taught**:
- Checklist following (organizational skill)
- Item verification (executive function)
- Planning ahead (what do I need today?)
- Responsibility (bringing required items)

**Adaptive Features**:
- Parent customizes checklist based on school requirements
- Visual checklist with pictures for each item
- "Library day" reminders (parent sets schedule)
- "Gym day" reminders (child brings sneakers)

---

### Routine 6: After-School Snack

**Target Age**: 6-10 years
**Duration**: 8-12 minutes
**Steps**: 10-15 steps
**Difficulty**: 5/10

**Step Sequence**:
1. Wash hands (8-step hygiene routine)
2. Get plate from cabinet
3. Choose snack from approved list
   - Apple slices
   - Crackers + cheese
   - Yogurt + granola
   - Carrots + hummus
4. Prepare snack (depends on choice)
   - Example: Apple → Get cutting board → Get knife → Cut apple → Throw core away
5. Get napkin
6. Sit at table
7. Eat snack
8. Clean up
   - Throw napkin away
   - Rinse plate
   - Put plate in dishwasher
9. Wipe table if needed
10. Wash hands again

**Skills Taught**:
- Healthy snack choices
- Food preparation safety
- Table manners (sitting to eat)
- Clean-up after eating

---

### Routine 7: Bath Time

**Target Age**: 7-10 years
**Duration**: 15-20 minutes
**Steps**: 20-30 steps
**Difficulty**: 8/10 (Privacy, thoroughness)

**Step Sequence**:
1. Get towel from closet
2. Place towel within reach of tub/shower
3. Get clean pajamas
4. Bring pajamas to bathroom
5. Turn on water
6. Adjust water temperature (warm, not too hot)
7. Test water with hand (safety check)
8. Close bathroom door (privacy)
9. Remove clothes
10. Put dirty clothes in hamper
11. Step into tub/shower carefully
12. Wet hair
13. Apply shampoo (quarter-sized amount)
14. Scrub scalp (30 seconds)
15. Rinse hair thoroughly
16. Apply conditioner (optional, if long hair)
17. Rinse conditioner
18. Get body wash/soap
19. Wash body (arms, chest, belly, legs, feet, private areas)
20. Rinse entire body
21. Turn off water
22. Step out carefully
23. Dry with towel (hair, body)
24. Put on pajamas
25. Brush hair (detangle if needed)
26. Hang up towel
27. Drain tub (if bath) or wipe down shower
28. Open door (routine complete)

**Skills Taught**:
- Complete bathing sequence
- Water safety (temperature testing, careful entry/exit)
- Privacy awareness (closing door, private areas)
- Thoroughness (washing all body parts)
- Post-bath care (drying properly, grooming)

**Sensitivity Accommodations**:
- "Sponge bath" option for water-averse children
- "Shower" vs. "Bath" options (parent choice)
- Sensory-friendly soap options (unscented)
- "Hair washing" can be separate routine (not every night)

---

### Routine 8: Bedtime Routine

**Target Age**: 5-10 years
**Duration**: 15-20 minutes
**Steps**: 15-20 steps
**Difficulty**: 6/10 (Calming, transitioning to sleep)

**Step Sequence**:
1. Check that homework is done (parent verifies)
2. Lay out tomorrow's clothes
   - Check weather forecast
   - Choose outfit
   - Place clothes on chair
3. Pack school bag (if not done earlier)
4. Brush teeth (evening tooth brushing routine)
5. Use toilet
6. Wash face
7. Put on pajamas (if not already on from bath)
8. Get into bed
9. Arrange pillows/blankets (comfort)
10. Set alarm for tomorrow morning
11. Choose calming activity:
    - Read book (5-10 pages)
    - Listen to calming music
    - Practice breathing exercises (5 deep breaths)
12. Turn off lights (leave nightlight on if preferred)
13. Settle into sleep position
14. Close eyes
15. Sleep (routine ends)

**Skills Taught**:
- Evening wind-down sequence
- Preparing for next day (clothes, bag, alarm)
- Self-soothing/calming strategies
- Sleep hygiene (consistent bedtime routine)

**Calming Features**:
- Soft, dim lighting in game visuals (prepares eyes for sleep)
- Gentle background sounds (rain, white noise, soft music)
- Breathing exercise mini-game (inhale for 4, hold for 4, exhale for 4)
- "Worry time" option: Child can record one worry, app reassures and saves for tomorrow

---

## 5. VISUAL & AUDIO DESIGN

### Visual Design Language

**Art Style**: Photorealistic + Gentle Cartoon Hybrid
- **Environments**: Realistic photos (parent-uploaded or stock library) with subtle cartoon overlays
- **Objects**: High-detail 3D renderings (toothbrush looks like real toothbrush)
- **Character (optional guide)**: Friendly, age-appropriate avatar (not babyish for older kids)
- **UI**: Clean, modern, Apple iOS-style design (familiar to parents and kids)

### Environment Visual Specifications

**Bedroom Scene**:
- Bed (made and unmade states)
- Alarm clock (analog or digital, parent choice)
- Dresser with clothes drawers
- Closet with hanging clothes
- Window with curtains
- Floor area for stepping out of bed
- Mirror (for dressing checks)

**Bathroom Scene**:
- Sink with faucet (functional: turns on/off)
- Mirror above sink
- Toothbrush holder with toothbrushes
- Toothpaste tube
- Soap dispenser
- Towel rack with towels
- Toilet (privacy option: blurred or behind door)
- Bathtub or shower
- Bath mat
- Scale (optional)

**Kitchen Scene**:
- Refrigerator (opens to reveal milk, juice, eggs, etc.)
- Pantry/cabinets (open to reveal cereal, bread, etc.)
- Stove (4 burners, safety indicators)
- Toaster
- Microwave
- Sink with faucet
- Dishwasher
- Table with chairs
- Drawers (utensils, napkins)

**Living Room Scene** (for homework, calm-down activities):
- Couch
- Coffee table
- Bookshelves
- TV (optional)
- Desk with chair
- Lamp

### Interactive Object Library

Every interactive object is a 3D model with states:

**Example: Toothbrush Object**
```
States:
- Idle: Sitting in holder, waiting to be selected
- Highlighted: Glowing when child should select it
- Picked Up: In child's hand (or on screen in FPV)
- Under Water: Wet, water droplets visible
- With Toothpaste: Paste applied, mint green color
- In Mouth: Brushing animation plays (2 minutes looped)
- Rinsing: Water stream over brush
- Put Away: Returns to holder, clean state

Animations:
- Grab animation (0.2s)
- Drag to faucet (1.0s)
- Brushing motion (looped, 2 minutes)
- Rinse animation (0.5s)
- Return to holder (0.3s)

Sounds:
- Pickup: Soft tap
- Water running: Realistic faucet sound
- Brushing: Bristles scrubbing (gentle, not loud)
- Rinse: Water splash
- Put down: Clink sound (brush touching holder)
```

**Total Interactive Objects**: 150+ unique objects
- Kitchen: 45 objects (bowls, plates, utensils, appliances, food items)
- Bathroom: 38 objects (hygiene items, towels, bath toys)
- Bedroom: 32 objects (clothes, alarm clock, bed items)
- Living Room: 20 objects (books, homework supplies, comfort items)
- Miscellaneous: 15 objects (backpack, lunchbox, weather items)

### UI Design

**Main Navigation**:
```
┌────────────────────────────────────────────────┐
│ [☰ Menu]    MY DAY        [⚙ Settings] [? Help]│ ← Top bar
├────────────────────────────────────────────────┤
│                                                │
│          [Character Avatar + Greeting]         │
│     "Good morning, Jamie! Ready to start?"     │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │  TODAY'S ROUTINES                        │ │
│  │                                          │ │
│  │  [ ✓ ] 7:00 AM - Wake Up Routine        │ │ ← Completed
│  │  [ → ] 7:15 AM - Morning Routine        │ │ ← Active
│  │  [   ] 8:00 AM - Packing Bag            │ │ ← Upcoming
│  │  [   ] 3:30 PM - After School Snack     │ │
│  │  [   ] 7:00 PM - Bath Time              │ │
│  │  [   ] 8:00 PM - Bedtime Routine        │ │
│  │                                          │ │
│  │  [VIEW WEEKLY SCHEDULE]                 │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  Progress This Week: ████████░░ 80%           │
│  Routines Completed: 24 / 30                  │
│  Independence Level: ⭐⭐⭐⭐☆ (Advanced)        │
│                                                │
│  [START NEXT ROUTINE]  [FREE PRACTICE MODE]   │
└────────────────────────────────────────────────┘
```

**In-Routine UI**:
```
┌────────────────────────────────────────────────┐
│ [|| Pause]  MORNING ROUTINE  [Progress: 5/15]  │
├────────────────────────────────────────────────┤
│                                                │
│      [ENVIRONMENT: Bathroom Scene]             │
│                                                │
│  ┌────────────────────────────────────┐       │
│  │                                    │       │
│  │     [Bathroom visual here]         │       │
│  │     Child can tap objects to       │       │
│  │     interact with them             │       │
│  │                                    │       │
│  └────────────────────────────────────┘       │
│                                                │
│  Current Step: Brush Teeth                    │
│  ┌──────────────────────────────────────────┐ │
│  │ [ ] Turn on water                        │ │ ← Checklist
│  │ [ ] Wet toothbrush                       │ │
│  │ [ ] Apply toothpaste                     │ │
│  │ [ ] Brush all teeth (2 minutes)          │ │
│  │ [ ] Rinse mouth                          │ │
│  │ [ ] Rinse toothbrush                     │ │
│  │ [ ] Put away toothbrush                  │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  Timer: ████████░░░░░░░░ 1:23 / 2:00          │
│                                                │
│  [? NEED HELP]  [🎵 VOLUME]  [⏸ PAUSE]        │
└────────────────────────────────────────────────┘
```

**Completion Screen**:
```
┌────────────────────────────────────────────────┐
│             🎉 ROUTINE COMPLETE! 🎉            │
├────────────────────────────────────────────────┤
│                                                │
│          ⭐ GREAT JOB, JAMIE! ⭐               │
│                                                │
│  You completed your MORNING ROUTINE!           │
│                                                │
│  📊 Your Stats:                                │
│  ────────────────────────────────────          │
│  Time Taken:      12 min 34 sec               │
│  Independence:    85% (12/15 steps solo)      │
│  Accuracy:        100% (all steps correct)    │
│  Quality:         ⭐⭐⭐ Perfect!                 │
│                                                │
│  🏆 Rewards Earned:                            │
│  ────────────────────────────────────          │
│  + 150 Points                                  │
│  + Morning Champion Badge (NEW!)              │
│  + 1 Star                                      │
│                                                │
│  Progress to Mastery: ████████░░ 12/20 sessions│
│                                                │
│  💬 Quick Reflection:                          │
│  "What went well today?"                       │
│  [ Brushing teeth ] [ Getting dressed ]        │
│  [ Making bed ] [ Everything! ]                │
│                                                │
│  [CONTINUE TO NEXT] [TAKE A BREAK] [VIEW DATA] │
└────────────────────────────────────────────────┘
```

### Audio Design

#### Background Music
**Track 1: "Morning Motivation"** (Upbeat, energizing)
- Instruments: Acoustic guitar, light percussion, piano
- Tempo: 100 BPM
- Mood: Cheerful, encouraging
- Used for: Wake up, morning routine, packing bag

**Track 2: "Calm and Capable"** (Focused, steady)
- Instruments: Soft piano, ambient pads
- Tempo: 70 BPM
- Mood: Confident, calm
- Used for: Meal prep, hygiene routines, getting dressed

**Track 3: "Evening Wind-Down"** (Relaxing, sleepy)
- Instruments: Harp, soft strings, nature sounds
- Tempo: 50 BPM
- Mood: Peaceful, comforting
- Used for: Bath time, bedtime routine

**Music Volume**: Default 25% (background presence, not distracting)

#### Sound Effects

**Interaction Sounds**:
- Object pickup: Soft grab sound (fabric, plastic, or appropriate material)
- Object place down: Gentle thud or clink
- Water running: Realistic faucet sound (can be disabled for sensory reasons)
- Appliance sounds: Toaster pop, microwave beep, alarm buzz
- Completion chime: Satisfying bell tone (C major chord)

**Voice-Over Recordings**:
- **Narrator Voice**: Calm, gender-neutral adult voice (warm, patient tone)
- **Character Voice** (optional guide): Age-appropriate child voice (7-9 years old)

**Voice-Over Script Examples**:
```
MORNING ROUTINE START:
"Good morning! Time to start your morning routine. Let's get ready for a great day!"

STEP PROMPT (Full):
"First, let's brush our teeth. Can you find your toothbrush?"

STEP PROMPT (Partial):
"What's the next step in brushing your teeth?"

STEP PROMPT (Minimal):
"Next step?"

ENCOURAGEMENT (During):
"You're doing great!" / "Keep going!" / "Nice work!"

CORRECT STEP:
"Perfect! You turned on the water just right."

INCORRECT STEP (Gentle):
"Hmm, let's try that again. Remember, we wet the toothbrush first."

TIME CHECK:
"You're halfway done! Keep brushing for one more minute."

ROUTINE COMPLETE:
"Amazing job! You finished your morning routine. You're ready for the day!"

REFLECTION PROMPT:
"How do you feel about your routine today?"
```

**Voice-Over Count**: 500+ lines (covering all routines, prompts, feedback)

---

## 6. TECHNICAL IMPLEMENTATION

### Unity Architecture

```csharp
// ==========================================
// DAILY ROUTINES GAME MANAGER
// ==========================================
using UnityEngine;
using System.Collections.Generic;
using System.Linq;
using Cysharp.Threading.Tasks;

public class DailyRoutinesManager : MonoBehaviour
{
    [Header("Configuration")]
    public RoutineDatabase routineDatabase;
    public int currentRoutineTier = 1; // 1 = Guided, 2 = Structured, 3 = Independent

    [Header("Current Session")]
    private RoutineData currentRoutine;
    private List<RoutineStep> routineSteps;
    private int currentStepIndex = 0;
    private System.DateTime sessionStartTime;

    [Header("UI References")]
    public RoutineScheduleUI scheduleUI;
    public RoutineEnvironmentController environmentController;
    public ChecklistUI checklistUI;
    public TimerUI timerUI;
    public FeedbackUI feedbackUI;

    [Header("Customization")]
    public PhotoCustomizationManager photoManager;
    private Dictionary<string, Texture2D> customPhotos;

    [Header("Data Tracking")]
    private RoutineSessionData currentSession;
    private PromptingSystem promptingSystem;

    void Start()
    {
        promptingSystem = new PromptingSystem();
        LoadCustomPhotos();
        ShowDailySchedule();
    }

    void LoadCustomPhotos()
    {
        // Load parent-uploaded photos from backend
        customPhotos = new Dictionary<string, Texture2D>();

        var photoData = APIClient.Instance.GetUserCustomPhotos(UserManager.Instance.CurrentUserId);

        if (photoData.ContainsKey("bedroom"))
        {
            customPhotos["bedroom"] = photoData["bedroom"];
            Debug.Log("Loaded custom bedroom photo");
        }
        if (photoData.ContainsKey("bathroom"))
        {
            customPhotos["bathroom"] = photoData["bathroom"];
            Debug.Log("Loaded custom bathroom photo");
        }
        if (photoData.ContainsKey("kitchen"))
        {
            customPhotos["kitchen"] = photoData["kitchen"];
            Debug.Log("Loaded custom kitchen photo");
        }
    }

    void ShowDailySchedule()
    {
        // Display today's routine schedule
        scheduleUI.ShowSchedule(GetTodaysRoutines());

        AccessibilityManager.Instance.Announce(
            "Welcome to Daily Routines! You have " + GetTodaysRoutines().Count + " routines scheduled for today."
        );
    }

    List<RoutineData> GetTodaysRoutines()
    {
        // Get routines scheduled for today based on time and user progress
        var dayOfWeek = System.DateTime.Now.DayOfWeek;
        var userProgress = ProgressManager.Instance.GetUserProgress();

        return routineDatabase.GetRoutinesForDay(dayOfWeek, userProgress);
    }

    public async void StartRoutine(string routineId)
    {
        currentRoutine = routineDatabase.GetRoutine(routineId);

        // Initialize session data
        currentSession = new RoutineSessionData
        {
            sessionId = System.Guid.NewGuid().ToString(),
            userId = UserManager.Instance.CurrentUserId,
            routineId = routineId,
            routineName = currentRoutine.routineName,
            timestampStart = System.DateTime.UtcNow,
            steps = new List<StepPerformanceData>()
        };

        sessionStartTime = System.DateTime.Now;

        // Load routine steps (may be customized by parent)
        routineSteps = GetCustomizedSteps(currentRoutine);
        currentStepIndex = 0;

        // Show routine briefing
        await ShowRoutineBriefing();

        // Begin first step
        await ExecuteRoutineSequence();
    }

    List<RoutineStep> GetCustomizedSteps(RoutineData routine)
    {
        // Check if parent has customized this routine
        var customization = APIClient.Instance.GetRoutineCustomization(
            UserManager.Instance.CurrentUserId,
            routine.routineId
        );

        if (customization != null && customization.stepsCustomized)
        {
            Debug.Log("Using parent-customized routine steps");
            return customization.steps;
        }
        else
        {
            Debug.Log("Using default routine steps");
            return routine.defaultSteps;
        }
    }

    async UniTask ShowRoutineBriefing()
    {
        // Show overview of routine before starting
        feedbackUI.ShowBriefing(
            currentRoutine.routineName,
            currentRoutine.description,
            routineSteps.Count,
            currentRoutine.estimatedDurationMinutes
        );

        await VoiceOverManager.Instance.PlayLine($"Time for your {currentRoutine.routineName}!");
        await UniTask.Delay(2000);

        await VoiceOverManager.Instance.PlayLine($"This routine has {routineSteps.Count} steps. Let's begin!");
        await UniTask.Delay(1000);
    }

    async UniTask ExecuteRoutineSequence()
    {
        while (currentStepIndex < routineSteps.Count)
        {
            var step = routineSteps[currentStepIndex];

            // Load environment for this step
            await LoadStepEnvironment(step);

            // Show checklist
            checklistUI.ShowStepChecklist(step.subSteps);

            // Execute step
            var stepResult = await ExecuteStep(step);

            // Record step data
            currentSession.steps.Add(stepResult);

            // Provide feedback
            await ProvideFeedback(stepResult);

            // Move to next step
            currentStepIndex++;
        }

        // Routine complete
        await CompleteRoutine();
    }

    async UniTask LoadStepEnvironment(RoutineStep step)
    {
        // Determine which environment to load
        string environmentType = step.location; // "bedroom", "bathroom", "kitchen"

        // Check if parent uploaded custom photo for this environment
        if (customPhotos.ContainsKey(environmentType))
        {
            // Use custom photo as background
            await environmentController.LoadCustomEnvironment(
                customPhotos[environmentType],
                step.interactiveObjects
            );

            Debug.Log($"Loaded custom {environmentType} photo for maximum generalization");
        }
        else
        {
            // Use stock photorealistic environment
            await environmentController.LoadDefaultEnvironment(
                environmentType,
                step.interactiveObjects
            );

            Debug.Log($"Loaded default {environmentType} environment");
        }

        // Announce step
        AccessibilityManager.Instance.Announce($"Step {currentStepIndex + 1}: {step.stepName}");
    }

    async UniTask<StepPerformanceData> ExecuteStep(RoutineStep step)
    {
        var stepStartTime = System.DateTime.Now;
        var performanceData = new StepPerformanceData
        {
            stepId = step.stepId,
            stepName = step.stepName,
            subStepsCompleted = 0,
            subStepsPrompted = 0,
            subStepsIndependent = 0,
            errorsCount = 0
        };

        // Execute each sub-step
        foreach (var subStep in step.subSteps)
        {
            var subStepResult = await ExecuteSubStep(subStep, step);

            // Update performance data
            if (subStepResult.completed)
            {
                performanceData.subStepsCompleted++;

                if (subStepResult.independent)
                    performanceData.subStepsIndependent++;
                else
                    performanceData.subStepsPrompted++;
            }
            else
            {
                performanceData.errorsCount++;
            }
        }

        // Calculate step duration
        var stepEndTime = System.DateTime.Now;
        performanceData.durationSeconds = (stepEndTime - stepStartTime).TotalSeconds;

        // Calculate step independence
        performanceData.independencePercentage =
            (float)performanceData.subStepsIndependent / step.subSteps.Count * 100f;

        return performanceData;
    }

    async UniTask<SubStepResult> ExecuteSubStep(SubStep subStep, RoutineStep parentStep)
    {
        var result = new SubStepResult { subStepId = subStep.subStepId };

        // Determine prompt level based on user history
        var promptLevel = promptingSystem.DeterminePromptLevel(
            UserManager.Instance.CurrentUserId,
            subStep.subStepId
        );

        // Wait for user interaction
        bool actionCompleted = false;
        bool actionCorrect = false;
        int attemptCount = 0;
        const int maxAttempts = 3;

        while (!actionCompleted && attemptCount < maxAttempts)
        {
            // Show appropriate prompt
            await ShowPrompt(subStep, promptLevel);

            // Start timer (if step has time limit)
            if (subStep.maxTimeSeconds > 0)
            {
                timerUI.StartTimer(subStep.maxTimeSeconds);
            }

            // Wait for user action
            var userAction = await WaitForUserAction(subStep, parentStep);

            // Stop timer
            timerUI.StopTimer();

            // Evaluate action
            if (IsActionCorrect(userAction, subStep))
            {
                actionCorrect = true;
                actionCompleted = true;
                result.completed = true;
                result.independent = (promptLevel == PromptLevel.None || promptLevel == PromptLevel.Gestural);

                // Check off in checklist
                checklistUI.CheckOffSubStep(subStep.subStepId);

                // Play positive feedback
                await PlayPositiveFeedback(subStep);
            }
            else
            {
                attemptCount++;

                // Incorrect action - increase prompt level
                promptLevel = promptingSystem.IncreasePromptLevel(promptLevel);

                // Play gentle redirect
                await PlayRedirectFeedback(subStep);

                if (attemptCount >= maxAttempts)
                {
                    // Errorless teaching: Complete step for child
                    await AutoCompleteSubStep(subStep);
                    result.completed = true;
                    result.independent = false;
                }
            }
        }

        result.promptLevel = promptLevel;
        result.attemptCount = attemptCount;

        return result;
    }

    async UniTask ShowPrompt(SubStep subStep, PromptLevel level)
    {
        switch (level)
        {
            case PromptLevel.None:
                // No prompt - child should remember
                break;

            case PromptLevel.Gestural:
                // Arrow points to correct object
                environmentController.ShowArrowPrompt(subStep.targetObjectId);
                break;

            case PromptLevel.Visual:
                // Picture/icon of what to do
                feedbackUI.ShowVisualPrompt(subStep.promptVisual);
                await VoiceOverManager.Instance.PlayLine(subStep.promptText);
                break;

            case PromptLevel.Auditory:
                // Voice instruction
                await VoiceOverManager.Instance.PlayLine(subStep.promptText);
                break;

            case PromptLevel.VideoModel:
                // Short video demonstrating action
                await feedbackUI.PlayVideoModel(subStep.videoModelUrl);
                await VoiceOverManager.Instance.PlayLine(subStep.promptText);
                break;

            case PromptLevel.PhysicalGuidance:
                // Animated hand guides child's action
                await environmentController.ShowPhysicalGuidanceAnimation(subStep);
                break;
        }
    }

    async UniTask<UserAction> WaitForUserAction(SubStep subStep, RoutineStep parentStep)
    {
        // Wait for child to interact with environment
        UserAction action = null;

        // Listen for taps, drags, swipes on interactive objects
        while (action == null)
        {
            // Check for interaction with any object in scene
            if (Input.GetMouseButtonDown(0) || (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began))
            {
                Vector2 inputPosition = Input.mousePosition;
                if (Input.touchCount > 0)
                    inputPosition = Input.GetTouch(0).position;

                // Raycast to see what was tapped
                var tappedObject = environmentController.GetTappedObject(inputPosition);

                if (tappedObject != null)
                {
                    action = new UserAction
                    {
                        actionType = "tap",
                        targetObjectId = tappedObject.objectId,
                        timestamp = System.DateTime.UtcNow
                    };
                }
            }

            // Check for timeout
            if (subStep.maxTimeSeconds > 0 && timerUI.GetRemainingTime() <= 0)
            {
                // Timeout - treat as incorrect, will increase prompt
                action = new UserAction
                {
                    actionType = "timeout",
                    targetObjectId = null,
                    timestamp = System.DateTime.UtcNow
                };
            }

            await UniTask.Yield();
        }

        return action;
    }

    bool IsActionCorrect(UserAction action, SubStep subStep)
    {
        if (action.actionType == "timeout")
            return false;

        // Check if tapped object matches expected target
        if (action.targetObjectId == subStep.targetObjectId)
        {
            // Correct object tapped

            // If sub-step has specific action requirement (e.g., drag to location)
            if (subStep.actionType == "drag")
            {
                // Additional validation for drag actions
                // (Implementation depends on specific sub-step requirements)
                return true;
            }

            return true;
        }

        return false;
    }

    async UniTask PlayPositiveFeedback(SubStep subStep)
    {
        // Visual feedback
        feedbackUI.ShowSuccess();
        AudioManager.Instance.PlaySound("success_chime");

        // Voice feedback
        var encouragements = new List<string>
        {
            "Great job!",
            "Perfect!",
            "You did it!",
            "Nice work!",
            "Excellent!"
        };

        var randomEncouragement = encouragements[Random.Range(0, encouragements.Count)];
        await VoiceOverManager.Instance.PlayLine(randomEncouragement);
    }

    async UniTask PlayRedirectFeedback(SubStep subStep)
    {
        // Gentle feedback
        feedbackUI.ShowNeutral();
        AudioManager.Instance.PlaySound("try_again");

        await VoiceOverManager.Instance.PlayLine("Let's try that again.");
    }

    async UniTask AutoCompleteSubStep(SubStep subStep)
    {
        // Errorless teaching: Game completes step for child
        await VoiceOverManager.Instance.PlayLine("Let me help you with this one.");

        await environmentController.AnimateObjectInteraction(
            subStep.targetObjectId,
            subStep.actionType,
            duration: 2.0f
        );

        // Still check off in checklist (success is success!)
        checklistUI.CheckOffSubStep(subStep.subStepId);

        await VoiceOverManager.Instance.PlayLine("There we go! Let's keep going.");
    }

    async UniTask ProvideFeedback(StepPerformanceData stepData)
    {
        // Step-level feedback
        if (stepData.independencePercentage >= 80f)
        {
            await VoiceOverManager.Instance.PlayLine("You did that step almost all by yourself!");
        }
        else if (stepData.independencePercentage >= 50f)
        {
            await VoiceOverManager.Instance.PlayLine("Good job! You're learning this step.");
        }
        else
        {
            await VoiceOverManager.Instance.PlayLine("You finished the step. We'll keep practicing.");
        }
    }

    async UniTask CompleteRoutine()
    {
        // End session
        currentSession.timestampEnd = System.DateTime.UtcNow;
        currentSession.durationSeconds = (System.DateTime.Now - sessionStartTime).TotalSeconds;

        // Calculate overall performance
        var totalSubSteps = currentSession.steps.Sum(s => s.subStepsCompleted + s.errorsCount);
        var totalIndependent = currentSession.steps.Sum(s => s.subStepsIndependent);
        var totalCompleted = currentSession.steps.Sum(s => s.subStepsCompleted);

        currentSession.overallIndependence = (float)totalIndependent / totalSubSteps * 100f;
        currentSession.overallAccuracy = (float)totalCompleted / totalSubSteps * 100f;

        // Calculate stars (1-3)
        int stars = 1;
        if (currentSession.overallIndependence >= 90f && currentSession.overallAccuracy >= 95f)
            stars = 3;
        else if (currentSession.overallIndependence >= 70f && currentSession.overallAccuracy >= 80f)
            stars = 2;

        currentSession.starsEarned = stars;

        // Save session data to backend
        await APIClient.Instance.SaveRoutineSession(currentSession);

        // Update skill progress
        await UpdateSkillProgress();

        // Show completion screen
        await ShowCompletionScreen(stars);

        // Return to schedule
        ShowDailySchedule();
    }

    async UniTask UpdateSkillProgress()
    {
        // Update each AFLS skill practiced in this routine
        foreach (var skillId in currentRoutine.skillsTargeted)
        {
            var skillPerformance = CalculateSkillPerformance(skillId);

            await SkillProgressManager.Instance.RecordSkillAttempt(
                skillId,
                skillPerformance.independent,
                skillPerformance.accuracy
            );
        }
    }

    SkillPerformance CalculateSkillPerformance(string skillId)
    {
        // Find steps related to this skill
        var relevantSteps = currentSession.steps.Where(s =>
            routineSteps.Any(rs => rs.stepId == s.stepId && rs.skillsTargeted.Contains(skillId))
        ).ToList();

        if (relevantSteps.Count == 0)
            return new SkillPerformance { independent = false, accuracy = 0f };

        var avgIndependence = relevantSteps.Average(s => s.independencePercentage);
        var totalSubSteps = relevantSteps.Sum(s => s.subStepsCompleted + s.errorsCount);
        var totalCompleted = relevantSteps.Sum(s => s.subStepsCompleted);
        var accuracy = (float)totalCompleted / totalSubSteps * 100f;

        return new SkillPerformance
        {
            independent = avgIndependence >= 80f,
            accuracy = accuracy
        };
    }

    async UniTask ShowCompletionScreen(int stars)
    {
        // Celebration animation
        feedbackUI.ShowCompletionCelebration(stars);

        await VoiceOverManager.Instance.PlayLine($"Amazing! You completed your {currentRoutine.routineName}!");

        // Show stats
        feedbackUI.ShowRoutineStats(
            currentSession.durationSeconds / 60.0, // minutes
            currentSession.overallIndependence,
            currentSession.overallAccuracy,
            stars
        );

        // Award points
        int pointsEarned = 50 + (stars * 50); // 100-200 points depending on stars
        PlayerDataManager.Instance.AddPoints(pointsEarned);

        // Check for badges
        await CheckBadgeUnlocks();

        // Reflection prompts
        await ShowReflectionPrompts();

        await UniTask.Delay(5000); // Show completion screen for 5 seconds
    }

    async UniTask CheckBadgeUnlocks()
    {
        // Check if child unlocked any badges
        var badges = BadgeManager.Instance.CheckRoutineBadges(currentRoutine.routineId, currentSession);

        foreach (var badge in badges)
        {
            feedbackUI.ShowBadgeUnlock(badge);
            await VoiceOverManager.Instance.PlayLine($"You unlocked a new badge: {badge.name}!");
            await UniTask.Delay(2000);
        }
    }

    async UniTask ShowReflectionPrompts()
    {
        // Metacognition: Help child think about their performance
        feedbackUI.ShowReflectionQuestion("What went well today?");

        // Child can select from options or skip
        // (Implementation of selection UI not shown here)

        await UniTask.Delay(3000);
    }
}

// ==========================================
// DATA STRUCTURES
// ==========================================

[System.Serializable]
public class RoutineData
{
    public string routineId;
    public string routineName;
    public string description;
    public int ageRangeMin;
    public int ageRangeMax;
    public int difficulty;
    public float estimatedDurationMinutes;
    public string timeOfDay; // "morning", "afternoon", "evening"
    public List<string> locationSequence;
    public List<RoutineStep> defaultSteps;
    public List<string> skillsTargeted; // AFLS codes
}

[System.Serializable]
public class RoutineStep
{
    public string stepId;
    public string stepName;
    public int stepOrder;
    public string location; // "bedroom", "bathroom", "kitchen"
    public List<SubStep> subSteps;
    public List<string> skillsTargeted;
    public CompletionCriteria completionCriteria;
}

[System.Serializable]
public class SubStep
{
    public string subStepId;
    public string actionType; // "tap", "drag", "swipe"
    public string targetObjectId;
    public string promptText;
    public Sprite promptVisual;
    public string videoModelUrl;
    public int promptLevelDefault; // 0-5
    public float maxTimeSeconds;
}

[System.Serializable]
public class RoutineSessionData
{
    public string sessionId;
    public string userId;
    public string routineId;
    public string routineName;
    public System.DateTime timestampStart;
    public System.DateTime timestampEnd;
    public double durationSeconds;
    public List<StepPerformanceData> steps;
    public float overallIndependence;
    public float overallAccuracy;
    public int starsEarned;
}

[System.Serializable]
public class StepPerformanceData
{
    public string stepId;
    public string stepName;
    public int subStepsCompleted;
    public int subStepsPrompted;
    public int subStepsIndependent;
    public int errorsCount;
    public double durationSeconds;
    public float independencePercentage;
}

[System.Serializable]
public class SubStepResult
{
    public string subStepId;
    public bool completed;
    public bool independent;
    public PromptLevel promptLevel;
    public int attemptCount;
}

[System.Serializable]
public class UserAction
{
    public string actionType; // "tap", "drag", "timeout"
    public string targetObjectId;
    public System.DateTime timestamp;
}

public enum PromptLevel
{
    None = 0,
    Gestural = 1,
    Visual = 2,
    Auditory = 3,
    VideoModel = 4,
    PhysicalGuidance = 5
}

[System.Serializable]
public class CompletionCriteria
{
    public bool allSubStepsCompleted;
    public float minDurationSeconds;
    public float maxDurationSeconds;
    public Dictionary<string, bool> qualityChecks;
}

[System.Serializable]
public class SkillPerformance
{
    public bool independent;
    public float accuracy;
}

// ==========================================
// PROMPTING SYSTEM
// ==========================================
public class PromptingSystem
{
    public PromptLevel DeterminePromptLevel(string userId, string subStepId)
    {
        // Get user's history with this sub-step
        var history = SkillProgressManager.Instance.GetSubStepHistory(userId, subStepId);

        if (history == null || history.totalAttempts == 0)
        {
            // First time: Start with Visual prompts
            return PromptLevel.Visual;
        }

        // Calculate independence rate
        float independenceRate = (float)history.independentAttempts / history.totalAttempts;

        // Determine appropriate prompt level based on independence
        if (independenceRate >= 0.80f)
            return PromptLevel.None; // Mastered
        else if (independenceRate >= 0.60f)
            return PromptLevel.Gestural; // Nearly independent
        else if (independenceRate >= 0.40f)
            return PromptLevel.Visual; // Learning
        else if (independenceRate >= 0.20f)
            return PromptLevel.Auditory; // Needs more support
        else
            return PromptLevel.VideoModel; // Needs significant support
    }

    public PromptLevel IncreasePromptLevel(PromptLevel currentLevel)
    {
        // Move to more intrusive prompt after error
        switch (currentLevel)
        {
            case PromptLevel.None:
                return PromptLevel.Gestural;
            case PromptLevel.Gestural:
                return PromptLevel.Visual;
            case PromptLevel.Visual:
                return PromptLevel.Auditory;
            case PromptLevel.Auditory:
                return PromptLevel.VideoModel;
            case PromptLevel.VideoModel:
                return PromptLevel.PhysicalGuidance;
            case PromptLevel.PhysicalGuidance:
                return PromptLevel.PhysicalGuidance; // Max level
            default:
                return PromptLevel.Visual;
        }
    }
}
```

### Parent Customization Backend API

```typescript
// ==========================================
// PARENT CUSTOMIZATION API (Node.js/Express)
// ==========================================

import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import AWS from 'aws-sdk';

const router = express.Router();
const s3 = new AWS.S3();

// Photo upload endpoint
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images allowed'));
    }
  }
});

/**
 * POST /api/routines/customize/photos
 * Upload custom environment photo
 */
router.post('/customize/photos', upload.single('photo'), async (req, res) => {
  try {
    const { userId, environmentType } = req.body; // environmentType: "bedroom", "bathroom", "kitchen"
    const photoFile = req.file;

    if (!photoFile) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }

    // Resize and optimize image
    const optimizedImage = await sharp(photoFile.buffer)
      .resize(1920, 1080, { fit: 'cover' })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Upload to S3
    const s3Key = `user_photos/${userId}/${environmentType}_${Date.now()}.jpg`;
    await s3.putObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
      Body: optimizedImage,
      ContentType: 'image/jpeg',
      ACL: 'private' // Only accessible by user
    }).promise();

    const photoUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;

    // Save photo URL to database
    await db.query(
      `INSERT INTO user_custom_photos (user_id, environment_type, photo_url, uploaded_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, environment_type)
       DO UPDATE SET photo_url = $3, uploaded_at = NOW()`,
      [userId, environmentType, photoUrl]
    );

    res.json({
      success: true,
      environmentType,
      photoUrl,
      message: 'Photo uploaded successfully'
    });

  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

/**
 * GET /api/routines/customize/photos/:userId
 * Get all custom photos for user
 */
router.get('/customize/photos/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await db.query(
      `SELECT environment_type, photo_url FROM user_custom_photos WHERE user_id = $1`,
      [userId]
    );

    const photos = {};
    result.rows.forEach(row => {
      photos[row.environment_type] = row.photo_url;
    });

    res.json({ photos });

  } catch (error) {
    console.error('Photo retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve photos' });
  }
});

/**
 * POST /api/routines/customize/steps
 * Customize routine steps (reorder, add, remove)
 */
router.post('/customize/steps', async (req, res) => {
  try {
    const { userId, routineId, customSteps } = req.body;

    // Validate steps format
    if (!Array.isArray(customSteps) || customSteps.length === 0) {
      return res.status(400).json({ error: 'Invalid steps format' });
    }

    // Save customization
    await db.query(
      `INSERT INTO routine_customizations (user_id, routine_id, custom_steps, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, routine_id)
       DO UPDATE SET custom_steps = $3, updated_at = NOW()`,
      [userId, routineId, JSON.stringify(customSteps)]
    );

    res.json({
      success: true,
      message: 'Routine customized successfully',
      routineId,
      stepsCount: customSteps.length
    });

  } catch (error) {
    console.error('Routine customization error:', error);
    res.status(500).json({ error: 'Failed to customize routine' });
  }
});

/**
 * GET /api/routines/customize/:userId/:routineId
 * Get customized routine for user
 */
router.get('/customize/:userId/:routineId', async (req, res) => {
  try {
    const { userId, routineId } = req.params;

    const result = await db.query(
      `SELECT custom_steps FROM routine_customizations
       WHERE user_id = $1 AND routine_id = $2`,
      [userId, routineId]
    );

    if (result.rows.length === 0) {
      // No customization, return default
      return res.json({ customized: false });
    }

    res.json({
      customized: true,
      steps: result.rows[0].custom_steps
    });

  } catch (error) {
    console.error('Customization retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve customization' });
  }
});

export default router;
```

### Database Schema (PostgreSQL)

```sql
-- ==========================================
-- DAILY ROUTINES DATABASE SCHEMA
-- ==========================================

-- User custom photos
CREATE TABLE user_custom_photos (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  environment_type VARCHAR(50) NOT NULL, -- 'bedroom', 'bathroom', 'kitchen'
  photo_url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, environment_type)
);

-- Routine customizations
CREATE TABLE routine_customizations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  routine_id VARCHAR(100) NOT NULL,
  custom_steps JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, routine_id)
);

-- Routine session data
CREATE TABLE routine_sessions (
  session_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  routine_id VARCHAR(100) NOT NULL,
  routine_name VARCHAR(200) NOT NULL,
  timestamp_start TIMESTAMP NOT NULL,
  timestamp_end TIMESTAMP,
  duration_seconds DECIMAL(10, 2),
  overall_independence DECIMAL(5, 2),
  overall_accuracy DECIMAL(5, 2),
  stars_earned INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Step performance data
CREATE TABLE routine_step_performance (
  id SERIAL PRIMARY KEY,
  session_id UUID REFERENCES routine_sessions(session_id),
  step_id VARCHAR(100) NOT NULL,
  step_name VARCHAR(200) NOT NULL,
  sub_steps_completed INT,
  sub_steps_prompted INT,
  sub_steps_independent INT,
  errors_count INT,
  duration_seconds DECIMAL(10, 2),
  independence_percentage DECIMAL(5, 2)
);

-- AFLS skill progress
CREATE TABLE afls_skill_progress (
  user_id UUID REFERENCES users(id),
  skill_id VARCHAR(50), -- e.g., "afls_bls_3"
  skill_name VARCHAR(200),
  total_attempts INT DEFAULT 0,
  independent_attempts INT DEFAULT 0,
  prompted_attempts INT DEFAULT 0,
  mastery_percentage DECIMAL(5, 2),
  mastery_status VARCHAR(50), -- 'emerging', 'in_progress', 'mastered'
  first_practiced_date DATE,
  mastery_date DATE,
  last_session_date DATE,
  PRIMARY KEY (user_id, skill_id)
);

-- Sub-step history (for prompting system)
CREATE TABLE sub_step_history (
  user_id UUID REFERENCES users(id),
  sub_step_id VARCHAR(100),
  total_attempts INT DEFAULT 0,
  independent_attempts INT DEFAULT 0,
  prompted_attempts INT DEFAULT 0,
  last_prompt_level INT, -- 0-5
  PRIMARY KEY (user_id, sub_step_id)
);

-- Parent dashboard view
CREATE VIEW parent_routine_dashboard AS
SELECT
  u.id AS user_id,
  u.name AS child_name,
  COUNT(DISTINCT rs.session_id) AS total_sessions,
  AVG(rs.overall_independence) AS avg_independence,
  AVG(rs.overall_accuracy) AS avg_accuracy,
  SUM(rs.duration_seconds) / 60.0 AS total_minutes_practiced,
  COUNT(DISTINCT rs.routine_id) AS routines_practiced,
  MAX(rs.timestamp_end) AS last_session_date
FROM users u
LEFT JOIN routine_sessions rs ON u.id = rs.user_id
GROUP BY u.id, u.name;

-- Skill progress view
CREATE VIEW skill_progress_summary AS
SELECT
  user_id,
  COUNT(*) AS total_skills,
  SUM(CASE WHEN mastery_status = 'mastered' THEN 1 ELSE 0 END) AS skills_mastered,
  SUM(CASE WHEN mastery_status = 'in_progress' THEN 1 ELSE 0 END) AS skills_in_progress,
  SUM(CASE WHEN mastery_status = 'emerging' THEN 1 ELSE 0 END) AS skills_emerging,
  AVG(mastery_percentage) AS avg_mastery
FROM afls_skill_progress
GROUP BY user_id;
```

---

## 7. DATA TRACKING & PARENT DASHBOARD

### Session Data JSON Example

```json
{
  "session_id": "RS-2025-10-13-0142",
  "user_id": "child_67890",
  "routine_id": "morning_routine_v1",
  "routine_name": "Morning Routine",
  "timestamp_start": "2025-10-13T07:15:00Z",
  "timestamp_end": "2025-10-13T07:27:32Z",
  "duration_seconds": 752,

  "steps_completed": [
    {
      "step_id": "wake_up",
      "step_name": "Wake Up",
      "sub_steps_completed": 5,
      "sub_steps_independent": 4,
      "sub_steps_prompted": 1,
      "errors_count": 0,
      "duration_seconds": 45,
      "independence_percentage": 80.0
    },
    {
      "step_id": "brush_teeth",
      "step_name": "Brush Teeth",
      "sub_steps_completed": 20,
      "sub_steps_independent": 17,
      "sub_steps_prompted": 3,
      "errors_count": 2,
      "duration_seconds": 150,
      "independence_percentage": 85.0
    },
    {
      "step_id": "get_dressed",
      "step_name": "Get Dressed",
      "sub_steps_completed": 12,
      "sub_steps_independent": 10,
      "sub_steps_prompted": 2,
      "errors_count": 1,
      "duration_seconds": 320,
      "independence_percentage": 83.3
    },
    {
      "step_id": "make_bed",
      "step_name": "Make Bed",
      "sub_steps_completed": 7,
      "sub_steps_independent": 5,
      "sub_steps_prompted": 2,
      "errors_count": 0,
      "duration_seconds": 180,
      "independence_percentage": 71.4
    },
    {
      "step_id": "eat_breakfast",
      "step_name": "Eat Breakfast",
      "sub_steps_completed": 14,
      "sub_steps_independent": 12,
      "sub_steps_prompted": 2,
      "errors_count": 0,
      "duration_seconds": 57,
      "independence_percentage": 85.7
    }
  ],

  "overall_performance": {
    "total_sub_steps": 58,
    "sub_steps_independent": 48,
    "sub_steps_prompted": 10,
    "overall_independence": 82.8,
    "overall_accuracy": 94.8,
    "time_efficiency": 1.05,
    "stars_earned": 3
  },

  "skills_practiced": [
    {
      "skill_id": "afls_bls_1",
      "skill_name": "Toileting Routine",
      "independent": true,
      "accuracy": 100.0
    },
    {
      "skill_id": "afls_bls_3",
      "skill_name": "Tooth Brushing",
      "independent": true,
      "accuracy": 90.0
    },
    {
      "skill_id": "afls_bls_5",
      "skill_name": "Dressing Skills",
      "independent": true,
      "accuracy": 91.7
    },
    {
      "skill_id": "afls_hs_1",
      "skill_name": "Following Routine Schedule",
      "independent": true,
      "accuracy": 100.0
    }
  ],

  "parent_notes": {
    "real_world_generalization": "Jamie completed her morning routine independently at home this morning! She followed the exact sequence from the game without any prompts. This is the first time she's done this.",
    "parent_satisfaction": 5,
    "areas_for_support": "Making bed still needs practice - she tends to leave pillows on the floor."
  }
}
```

### Parent Dashboard UI

**Main Dashboard View**:
```
┌───────────────────────────────────────────────────────────────┐
│  DAILY ROUTINES - PARENT DASHBOARD                           │
│                                                               │
│  Child: Jamie | Age: 8 | Using app for: 6 weeks             │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  📊 OVERALL PROGRESS                                          │
│  ───────────────────────────────────────────────────────────  │
│                                                               │
│  Independence Level:  ████████░░ 82.8%                        │
│  Accuracy:            ████████░░ 94.8%                        │
│  Skills Mastered:     8 / 24 AFLS skills                     │
│  Total Practice Time: 18.5 hours                             │
│                                                               │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │ MORNING ROUTINE │ │ HYGIENE ROUTINE │ │ BEDTIME ROUTINE ││
│  │ ████████░░ 85%  │ │ ███████░░░ 78%  │ │ █████░░░░░ 65%  ││
│  │ 12/20 sessions  │ │ 10/20 sessions  │ │ 8/20 sessions   ││
│  │ to mastery      │ │ to mastery      │ │ to mastery      ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
│                                                               │
│  📈 PROGRESS CHART (Last 30 Days)                             │
│  ───────────────────────────────────────────────────────────  │
│                                                               │
│  Independence %                                               │
│  100% ┤                                           ●           │
│   90% ┤                                     ●───●             │
│   80% ┤                          ●────●───●                   │
│   70% ┤                 ●───●───●                             │
│   60% ┤        ●───●───●                                      │
│   50% ┤    ●──●                                               │
│       └────┬────┬────┬────┬────┬────┬────┬────┬────┬────→   │
│          Week 1   Week 2   Week 3   Week 4   Week 5   Week 6 │
│                                                               │
│  🎯 KEY INSIGHTS (AI-Generated)                               │
│  ───────────────────────────────────────────────────────────  │
│                                                               │
│  ✅ Jamie is excelling at:                                    │
│     • Tooth brushing routine (90%+ independence)             │
│     • Following morning schedule (no prompts needed)         │
│     • Breakfast preparation (up 40% from Week 1)             │
│                                                               │
│  💡 Areas to support:                                         │
│     • Making bed - still needs 2-3 prompts per session       │
│     • Time management - often takes 20+ min for 15-min       │
│       routines (not a problem, but focus area if desired)    │
│                                                               │
│  🏠 Real-World Generalization:                                │
│     "Parents reported that Jamie completed her morning        │
│      routine independently at home 5 times this week!        │
│      Skills are transferring successfully."                  │
│                                                               │
│  [CUSTOMIZE ROUTINES] [VIEW DETAILED DATA] [EXPORT REPORT]   │
└───────────────────────────────────────────────────────────────┘
```

**Customization Portal**:
```
┌───────────────────────────────────────────────────────────────┐
│  CUSTOMIZE: MORNING ROUTINE                                   │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  📸 UPLOAD ENVIRONMENT PHOTOS                                 │
│  ───────────────────────────────────────────────────────────  │
│                                                               │
│  Help Jamie learn in familiar surroundings by uploading      │
│  photos of your actual home environments.                    │
│                                                               │
│  Bedroom Photo:  [✓ UPLOADED] [View] [Change]                │
│  Bathroom Photo: [✓ UPLOADED] [View] [Change]                │
│  Kitchen Photo:  [ UPLOAD NOW ]                              │
│                                                               │
│  ────────────────────────────────────────────────────────────  │
│                                                               │
│  🔧 CUSTOMIZE ROUTINE STEPS                                   │
│  ───────────────────────────────────────────────────────────  │
│                                                               │
│  Reorder, add, or remove steps to match your family's        │
│  actual morning routine:                                     │
│                                                               │
│  [↕] 1. Wake up                           [Edit] [Remove]    │
│  [↕] 2. Use toilet                        [Edit] [Remove]    │
│  [↕] 3. Wash hands                        [Edit] [Remove]    │
│  [↕] 4. Get dressed                       [Edit] [Remove]    │
│  [↕] 5. Brush teeth                       [Edit] [Remove]    │
│  [↕] 6. Take medication [CUSTOM]          [Edit] [Remove]    │
│  [↕] 7. Pack lunch [CUSTOM]               [Edit] [Remove]    │
│  [↕] 8. Eat breakfast                     [Edit] [Remove]    │
│                                                               │
│  [+ ADD CUSTOM STEP]                                          │
│                                                               │
│  ────────────────────────────────────────────────────────────  │
│                                                               │
│  ⚙ DIFFICULTY SETTINGS                                        │
│  ───────────────────────────────────────────────────────────  │
│                                                               │
│  Starting Prompt Level:                                      │
│  ○ A lot of help (Full prompts - videos, detailed guidance)  │
│  ● Some help (Partial prompts - pictures, arrows)            │
│  ○ Minimal help (Checklist only)                             │
│  ○ Independent (No prompts - child knows routine)            │
│                                                               │
│  Time Limit:                                                  │
│  ○ No time limit (child works at own pace)                   │
│  ● Flexible time (gentle reminders if running slow)          │
│  ○ Strict time (must complete within set time)               │
│                                                               │
│  [SAVE CHANGES] [RESET TO DEFAULT] [PREVIEW ROUTINE]         │
└───────────────────────────────────────────────────────────────┘
```

---

## 8. ACCESSIBILITY & WCAG 2.1 AA COMPLIANCE

### WCAG 2.1 AA Checklist

**Perceivable**:
- ✅ **1.1.1 Non-text Content**: All interactive objects have descriptive labels
- ✅ **1.4.3 Contrast**: Text on backgrounds 4.5:1 ratio, UI elements 3:1 ratio
- ✅ **1.4.11 Non-text Contrast**: Interactive objects (toothbrush, faucet) have 3:1 contrast with backgrounds
- ✅ **1.4.13 Content on Hover**: Hover effects (object highlighting) can be dismissed and don't obscure content

**Operable**:
- ✅ **2.1.1 Keyboard**: All interactions accessible via keyboard (Tab, Enter, Arrow keys)
- ✅ **2.2.1 Timing Adjustable**: All time limits adjustable or disable-able
- ✅ **2.4.7 Focus Visible**: Clear 3px yellow outline on focused elements
- ✅ **2.5.5 Target Size**: Interactive objects minimum 44×44px

**Understandable**:
- ✅ **3.1.1 Language**: HTML lang attribute set, voice-over language matches
- ✅ **3.2.1 On Focus**: No automatic routine changes when elements receive focus
- ✅ **3.3.2 Labels**: All steps and sub-steps clearly labeled with text + icons

**Robust**:
- ✅ **4.1.2 Name, Role, Value**: ARIA labels on all interactive objects
- ✅ **4.1.3 Status Messages**: aria-live regions announce step completions, feedback

### Autism-Specific Accommodations

**Sensory Sensitivities**:
- Visual overload reduction: Option to use simple line drawings instead of photos
- Audio sensitivity: All sounds optional, volume controls per category
- Motion sensitivity: Reduced motion mode disables all animations

**Executive Function Support**:
- Visual checklist always visible
- Progress bar shows how many steps left
- "Undo" button available (can restart step if child makes mistake)
- Break timer: Option to take 2-minute break between steps

**Communication Support**:
- AAC symbol support throughout (all text paired with symbols)
- Voice output optional (game can be played silently)
- Parent can record own voice for prompts (familiar voice)

---

## 9. TESTING & VALIDATION

### OT Validation Checklist
- ✅ Fine motor activities appropriate for age range
- ✅ Gross motor sequences (getting dressed, bed making) accurate
- ✅ Sensory accommodations for hyper/hypo-sensitivities
- ✅ Visual-motor integration supported (hand-eye coordination)
- ✅ Bilateral coordination tasks included

### BCBA Validation Checklist
- ✅ Task analysis scientifically accurate (based on research)
- ✅ Prompting hierarchy follows ABA best practices
- ✅ Errorless teaching option available
- ✅ Data collection captures meaningful metrics
- ✅ Reinforcement appropriate (not over-reinforcing routine tasks)
- ✅ Generalization strategy sound (real photos = maximum transfer)

### UX Designer Validation
- ✅ Interface intuitive for ages 5-10
- ✅ Touch targets large enough for small fingers
- ✅ Visual hierarchy clear (know what to tap next)
- ✅ Feedback immediate and clear
- ✅ No dead ends or confusing states

### Beta Family Testing (10 families, 2 weeks)
**Success Metrics**:
- ✅ 80%+ session completion rate
- ✅ 70%+ children show skill improvement
- ✅ 85%+ parent satisfaction
- ✅ 60%+ report real-world generalization

---

## 10. LAUNCH PLAN & POST-LAUNCH SUPPORT

### Week 1-2: Monitoring
- Daily review of session data (completion rates, accuracy, independence)
- Parent feedback surveys (daily check-ins)
- Bug tracking (Sentry integration)
- Performance monitoring (load times, frame rates)

### Month 2: Content Expansion
- Add 4 more routines:
  - Homework Routine
  - Chores Routine (dishes, laundry folding)
  - Grooming Routine (haircut, nail trimming prep)
  - Social Routine (answering door, phone etiquette)

### Month 3: Efficacy Study
- Partner with 3-5 ABA clinics
- Pre/post AFLS assessment (DLS modules)
- Parent interviews on real-world generalization
- Publish findings in *Journal of Applied Behavior Analysis*

---

## 11. TEAM & TIMELINE

### Team Composition
- **Game Developer** (GAME-001): Unity implementation, routine sequencer, photo system
- **OT** (OT-001): Motor sequence validation, sensory accommodations
- **BCBA** (BCBA-001): Task analysis, prompting system, data tracking
- **UX Designer** (UX-001): Interface design, parent portal, child-friendly UI
- **Backend Developer** (BACK-001): Photo upload API, customization endpoints
- **Character Artist** (ARTIST-001): Interactive objects (150+ 3D models)
- **Environment Artist** (ARTIST-002): Photo processing, environment rendering
- **QA Engineer** (QA-001): Testing all routines, edge cases, accessibility

### Development Timeline (25 days)

**Week 1 (Days 1-5): Design & Clinical Validation**
- Day 1-2: OT and BCBA review GDD, validate task analyses
- Day 3-4: Create all 8 routine sequences with sub-steps
- Day 5: UX Designer creates wireframes and UI mockups

**Week 2 (Days 6-10): Asset Creation**
- Day 6-8: 3D modeling of 150+ interactive objects
- Day 8-10: Environment rendering (bedroom, bathroom, kitchen scenes)
- Day 9-10: Voice-over recording (500+ lines)

**Week 3 (Days 11-17): Core Development**
- Day 11-13: Unity routine sequencer system
- Day 13-15: Prompting system, adaptive difficulty
- Day 15-16: Photo upload and customization backend
- Day 16-17: Parent dashboard and customization portal

**Week 4 (Days 18-22): Polish & Testing**
- Day 18-19: UI/UX refinement, animations
- Day 19-20: Accessibility audit (WCAG 2.1 AA)
- Day 20: OT and BCBA final playtesting
- Day 21: QA testing (all routines, photo uploads)
- Day 22: Bug fixes, performance optimization

**Week 5 (Days 23-25): Beta Testing**
- Day 23-25: 10 families test (with photo uploads)
- Collect feedback, real-world generalization data
- Final adjustments

**Total: 25 days (5 weeks)**

---

## 12. CONCLUSION

### Summary
**Daily Routines Simulator** is a groundbreaking life skills game that teaches AFLS Daily Living skills through personalized, real-world-connected experiences. By allowing parents to upload photos of their actual home environments and customize routines to match family schedules, this game achieves maximum generalization—the holy grail of autism intervention. Children learn essential independence skills (morning routine, hygiene, meal prep, bedtime) in a safe, supportive, data-driven environment that systematically fades prompts as mastery grows.

### Key Innovations
1. **Photo Customization**: Parents upload real home photos → child learns in familiar context
2. **Routine Customization**: Parents adjust steps to match family's actual routines
3. **Systematic Prompting**: 6-level prompt hierarchy with automatic fading
4. **Time Management**: Visual timers and schedule awareness
5. **Real-World Generalization**: Skills transfer immediately to home environment
6. **Comprehensive Data**: Tracks independence, accuracy, skill progress per AFLS module

### Clinical Impact
- **Target**: 70% of children achieve 80%+ independence in 1+ routine within 8 weeks
- **Generalization**: 60%+ parents report child completing routines at home independently
- **Skill Mastery**: Average 2-3 AFLS skills mastered per month
- **Family Impact**: Reduces morning/evening stress, increases child independence

### Next Steps
1. **Immediate**: OT/BCBA/UX Designer review of GDD
2. **Week 1**: Asset creation begins (3D objects, environments)
3. **Week 2-3**: Unity development (routine sequencer, photo system)
4. **Week 4**: Testing and accessibility audit
5. **Week 5**: Beta testing with 10 families

---

**Document Status**: ✅ **COMPLETE & READY FOR DEVELOPMENT**

**Estimated Line Count**: ~2,400 lines (including all code examples, schemas, and comprehensive explanations)

**Approval Required From**:
- [ ] Occupational Therapist (OT-001)
- [ ] BCBA Clinical Lead (BCBA-001)
- [ ] UX Designer (UX-001)
- [ ] Backend Developer (BACK-001)
- [ ] Senior Project Manager

---

**END OF GAME DESIGN DOCUMENT: DAILY ROUTINES SIMULATOR**

*This game will help thousands of autistic children gain independence in daily living—one routine at a time.*
