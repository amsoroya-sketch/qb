# Game Design Document: Color Matching Puzzle
## SkillBridge Educational Gaming Platform

**Game ID**: GAME-001
**Development Priority**: Month 1, Week 3
**Status**: Design Phase
**Document Version**: 1.0
**Last Updated**: October 12, 2025

---

## 1. EXECUTIVE SUMMARY

### Game Overview
**Color Matching Puzzle** is a foundational visual discrimination game designed to teach color recognition, matching, and sorting skills to autistic children ages 2-5. Using drag-and-drop mechanics, children match colorful objects to corresponding containers, building essential pre-academic skills while experiencing immediate success and positive reinforcement.

### Core Value Proposition
- **First Game Experience**: Designed as child's introduction to SkillBridge platform
- **High Success Rate**: Errorless teaching ensures 90%+ initial success
- **Universal Appeal**: Works across all sensory profiles and communication levels
- **Quick Wins**: 5-10 minute sessions with immediate skill demonstration
- **Foundation Builder**: Prepares for more complex matching, sorting, and categorization

### Key Innovation
Adaptive difficulty that automatically adjusts based on real-time performance, ensuring each child stays in their Zone of Proximal Development without frustration or boredom.

---

## 2. LEARNING OBJECTIVES & CLINICAL FRAMEWORK

### Primary Skills (ABLLS-R Framework)

#### Skill 1: Match Identical Colors (ABLLS-R B1-B3)
**Clinical Description**: Child demonstrates ability to match identical colors when presented with 2-12 color options, indicating visual discrimination and color perception development.

**Developmental Sequence**:
1. **B1 - Gross Matching** (Ages 2-3): Match 2-3 primary colors (red, blue, yellow) with high contrast
   - Success Criteria: 8/10 correct trials
   - Mastery: 90% accuracy across 3 sessions
   - Typical Development: Emerges 18-24 months

2. **B2 - Refined Matching** (Ages 3-4): Match 6 colors including secondary colors (green, orange, purple)
   - Success Criteria: 15/18 correct trials
   - Mastery: 85% accuracy across 3 sessions
   - Typical Development: 24-36 months

3. **B3 - Advanced Matching** (Ages 4-5): Match 12 colors including tertiary and shades (pink, brown, gray, black, white, pastels)
   - Success Criteria: 20/24 correct trials
   - Mastery: 80% accuracy across 3 sessions
   - Typical Development: 36-48 months

#### Skill 2: Sort by Color Category (ABLLS-R C12)
**Clinical Description**: Child can group multiple objects by color, demonstrating categorization and set-making abilities.

**Teaching Progression**:
1. **Phase 1**: Sort 4-6 objects into 2 color groups
2. **Phase 2**: Sort 9-12 objects into 3 color groups
3. **Phase 3**: Sort 16-20 objects into 4+ color groups with distractors

**Mastery Criteria**:
- 80% accuracy without prompting
- Completion within age-appropriate timeframe (2-4 minutes)
- Generalization across 3 different object sets

#### Skill 3: Receptive Color Identification (ABLLS-R G2)
**Clinical Description**: Child can touch/select named color when given verbal or AAC instruction ("Touch red", "Find the blue one").

**Instruction Modalities**:
- Voice: Adult speaks color name
- AAC: Symbol + text displayed
- Text: Written color name (for emerging readers)
- Combined: Multi-modal reinforcement

### Secondary Skills (Incidental Learning)

#### Fine Motor Development
- **Pincer Grasp**: Tapping/touching items on screen
- **Drag Control**: Sustained touch and movement
- **Release Precision**: Dropping at target location
- **Hand-Eye Coordination**: Visual tracking + motor planning

**OT Alignment**: Supports AFLS Basic Living Skills (dressing requires color discrimination for clothing selection)

#### Executive Function
- **Visual Scanning**: Systematic search of available options
- **Planning**: Determining which item matches which container
- **Error Monitoring**: Recognizing mismatches and self-correcting
- **Task Completion**: Finishing all items in set

#### Receptive Language
- **Following Instructions**: "Put the red ball in the red bucket"
- **Spatial Concepts**: "In the bucket", "on top of the lid"
- **Conditional Language**: "If it's blue, put it here"

### Clinical Rationale (BCBA Perspective)

**Why This Skill First?**
1. **Universal Prerequisite**: Color discrimination underlies countless daily living and academic tasks
2. **High Success Probability**: Visual matching has lower cognitive load than auditory or social tasks
3. **Immediate Feedback**: Correct/incorrect is unambiguous, enabling clear reinforcement
4. **Generalization Potential**: Color recognition transfers to clothing, food, toys, books, signs
5. **Parent Engagement**: Parents easily understand and can support at home

**Evidence Base**:
- Discrete Trial Training (DTT) for matching tasks: 85-95% effectiveness (Lovaas, 2003)
- Visual discrimination as pivotal skill for academic readiness (Sundberg, 2008)
- Errorless learning reduces frustration and increases engagement (Weeks & Gaylord-Ross, 1981)

---

## 3. CORE GAMEPLAY MECHANICS

### Primary Mechanic: Drag-and-Drop Color Matching

#### User Flow (Complete Interaction)
```
1. GAME START
   ↓
2. TUTORIAL (First-time users only)
   - Animated hand demonstrates drag-and-drop
   - Voice-over: "Drag the red ball to the red bucket!"
   - Errorless: Only red ball and red bucket available
   - Success celebration triggers
   ↓
3. LEVEL BEGINS
   - Scene loads: 2-4 colored containers at bottom
   - Objects appear at top: 4-12 colorful items
   - Instruction appears: "Match the colors!" (voice + text + AAC symbol)
   ↓
4. CHILD INTERACTION
   - Touches/clicks object → Object lifts slightly + scales 110%
   - Drags toward container → Visual trail follows finger/mouse
   - Hovers over correct container → Container glows, gentle sound
   - Hovers over wrong container → No glow, neutral (no punishment)
   ↓
5. DROP EVENT
   Option A - CORRECT MATCH:
     - Object snaps into container with satisfying "pop"
     - Sparkle effect + cheerful sound (ding, chime)
     - Voice encouragement: "Great matching!" / "You found red!"
     - Object stays in container, container checkmark appears

   Option B - INCORRECT MATCH:
     - Object bounces back gently to starting position
     - Neutral sound (soft "boop" not harsh buzzer)
     - Container shakes slightly "no" (subtle, not startling)
     - Helpful prompt appears if 3rd error: Arrow points to correct container
   ↓
6. COMPLETION
   - All objects matched correctly
   - CELEBRATION SEQUENCE:
     * Confetti/balloons animation (2 seconds)
     * Upbeat music sting
     * Character appears: "Wow! You matched all the colors!"
     * Points awarded: +10 per correct, +5 bonus for no errors
     * Star rating displayed: ⭐⭐⭐ (3 stars = perfect, 2 = 1-2 errors, 1 = 3+ errors)
   ↓
7. PROGRESSION DECISION
   - If 90%+ accuracy → Next level (more colors/items)
   - If 70-89% accuracy → Repeat level with different objects
   - If <70% accuracy → Reduce level difficulty
   ↓
8. CONTINUE OR EXIT
   - "Play Again?" button (larger, left side)
   - "All Done" button (smaller, right side)
   - Auto-save progress to backend API
```

### Advanced Mechanics

#### Multi-Touch Support (Tablet Optimization)
- Simultaneous drag of multiple objects (if developmentally appropriate)
- Two-finger pinch to zoom scene (accessibility for low vision)
- Parent hand + child hand can interact together (co-play mode)

#### Voice Command Alternative
For children with severe motor challenges:
```
Child says: "Red ball"
→ Game highlights red ball
→ Child says: "Red bucket"
→ Game moves ball to bucket automatically
→ Same celebration as manual drag
```

#### AAC Device Integration
Compatible with:
- **Proloquo2Go**: Core vocabulary board displays color symbols
- **TD Snap**: Grid display with color + container symbols
- **LAMP**: Motor planning sequences for color selection

**AAC Interaction Flow**:
```
Child touches color symbol on AAC → "RED"
Child touches action symbol → "PUT IN"
Game highlights red objects
Child touches object via AAC grid → Object selected
Child touches container symbol → Object moves
Celebration + AAC voice output: "I matched red!"
```

### Game Loop Variations

#### Mode 1: Free Play (Default)
- No timer pressure
- Child works at own pace
- Can drag objects in any order
- Unlimited retries on errors

#### Mode 2: Timed Challenge (Optional, Ages 5+)
- 60-second timer displayed
- Bonus points for speed
- Not penalized for slowness (timer just stops rewarding bonus)
- For children who thrive on competitive element

#### Mode 3: Memory Match (Advanced)
- Objects flash briefly then hide
- Child must remember which object was which color
- Combines color discrimination + working memory

#### Mode 4: Co-op Mode (Multiplayer)
- Parent and child each control different colors
- Takes turns dragging objects
- Teaches turn-taking + shared goals
- Celebration shared between both players

---

## 4. DIFFICULTY PROGRESSION SYSTEM

### Adaptive Difficulty Engine

#### Difficulty Parameters (7 Variables)
1. **Number of Colors**: 2 → 3 → 4 → 6 → 8 → 12
2. **Number of Objects**: 4 → 6 → 8 → 12 → 16 → 20
3. **Color Similarity**: High contrast → Similar hues → Shades/tints
4. **Distractor Objects**: None → 1 → 2 → 4 wrong-colored items
5. **Container Layout**: 2 large buckets → 4 medium → 6 small
6. **Object Variety**: Identical shapes → Mixed shapes → Complex objects
7. **Instruction Clarity**: "Match colors" → "Sort by color" → "Find all the red ones"

#### Dynamic Adjustment Algorithm

```python
# Pseudocode for adaptive difficulty

def adjust_difficulty(session_performance):
    accuracy = session_performance['correct'] / session_performance['total']
    avg_time_per_item = session_performance['duration'] / session_performance['items']

    # SUCCESS - Increase Difficulty
    if accuracy >= 0.90 and avg_time_per_item < 8.0:  # 90%+ correct, <8 sec/item
        if consecutive_successes >= 3:
            current_level += 1
            add_complexity()  # More colors, more objects, or both

    # STRUGGLING - Decrease Difficulty
    elif accuracy < 0.70 or avg_time_per_item > 20.0:  # <70% correct or >20 sec/item
        if consecutive_struggles >= 2:
            current_level -= 1
            simplify()  # Fewer colors, fewer objects, add prompts
            enable_errorless_mode()  # Highlight correct container

    # OPTIMAL CHALLENGE - Maintain Level
    else:  # 70-89% accuracy, moderate pace
        current_level = current_level  # Stay in Zone of Proximal Development
        vary_content()  # Different objects, keep same difficulty

def add_complexity():
    if num_colors < 12:
        num_colors += 2
    if num_objects < 20:
        num_objects += 4
    if distractor_count < 4:
        distractor_count += 1

def simplify():
    if num_colors > 2:
        num_colors -= 1
    if num_objects > 4:
        num_objects -= 2
    distractor_count = 0
    container_size = 'large'  # Make targets bigger
```

### Level Progression Chart

| Level | Colors | Objects | Distractors | Container Size | Target Age | Est. Session |
|-------|--------|---------|-------------|----------------|------------|--------------|
| **1** | 2 (Red, Blue) | 4 | 0 | Extra Large (150px) | 2-3 years | 2-3 min |
| **2** | 3 (+ Yellow) | 6 | 0 | Large (120px) | 2.5-3 years | 3-4 min |
| **3** | 3 | 8 | 1 | Large | 3 years | 4-5 min |
| **4** | 4 (+ Green) | 8 | 1 | Medium (100px) | 3-4 years | 4-5 min |
| **5** | 4 | 12 | 2 | Medium | 3-4 years | 5-6 min |
| **6** | 6 (+ Orange, Purple) | 12 | 2 | Medium | 4 years | 5-7 min |
| **7** | 6 | 16 | 3 | Small (80px) | 4-5 years | 6-8 min |
| **8** | 8 (+ Pink, Brown) | 16 | 4 | Small | 4-5 years | 7-9 min |
| **9** | 10 (+ Gray, Black) | 18 | 4 | Small | 5 years | 8-10 min |
| **10** | 12 (+ White, Pastels) | 20 | 5 | Tiny (60px) | 5+ years | 10-12 min |

**Progressive Challenge Examples**:

**Level 1 (Beginner)**:
- Red ball, red car → Red bucket ✅
- Blue ball, blue car → Blue bucket ✅
- Clear, simple, high success rate

**Level 5 (Intermediate)**:
- Red ball, yellow star, blue car, red apple → Red bucket
- Green leaf, yellow banana, blue circle, green frog → Green bucket
- Blue train, red flower, green tree, yellow sun → (Multiple buckets)
- Added: 1 purple ball (distractor - no purple bucket)

**Level 10 (Advanced)**:
- 12 different colors with subtle variations (crimson vs scarlet)
- 20 complex objects (striped shirt, gradient balloon)
- 5 distractor objects in non-target colors
- Small containers requiring precise dropping
- Challenges even typically-developing 5-year-olds

---

## 5. SCAFFOLDING & PROMPTING SYSTEM

### Prompting Hierarchy (Least-to-Most Support)

#### Level 0: Independent (Goal State)
- No prompts or hints provided
- Child performs entirely on own
- Data recorded as "independent response"

#### Level 1: Observational Prompt (Minimal Support)
- After 15 seconds of inactivity: Brief animation plays
  - Character points generally at objects and containers
  - Voice: "You're matching colors!"
  - Not directive, just re-engagement

#### Level 2: Gestural Prompt (Mild Support)
- After 2 incorrect attempts OR 30 seconds inactivity:
  - Arrow appears pointing between correct object and container
  - Arrow pulses gently (1 Hz)
  - Voice: "Try the red one!"
  - Arrow fades after 5 seconds

#### Level 3: Partial Physical Prompt (Moderate Support)
- After 3 incorrect attempts:
  - Correct object glows/pulses
  - Correct container glows simultaneously
  - Color connection line appears briefly
  - Voice: "The red ball goes in the red bucket!"

#### Level 4: Full Physical Prompt / Errorless (Maximum Support)
- After 4 incorrect attempts OR child appears frustrated:
  - Object automatically starts moving slowly toward correct container
  - Child can still intercept and complete drag
  - If no interaction, object completes journey automatically
  - Full celebration plays (child still experiences success)
  - Voice: "Let's match red together!"

### Prompt Fading Strategy

**Session-by-Session Fading**:
```
Session 1: Full prompts available, used liberally (70% prompted responses acceptable)
Session 2: Increase wait time before prompts (20 → 30 seconds)
Session 3: Skip Level 4 prompts, max Level 3
Session 4-5: Skip Level 3, max Level 2
Session 6+: Independent expected, Level 1 only if needed
```

**Mastery Criterion**:
- 80% independent (no prompts) across 3 consecutive sessions
- Response latency <15 seconds per item
- Generalization: Skills transfer to different object sets

### Errorless Teaching Mode (Optional Setting)

For children with history of frustration or severe developmental delays:
- Enable via Settings → "Support Level" → "Maximum Help"
- All responses guided to success
- No incorrect responses possible
- Gradually fade as confidence builds over weeks

---

## 6. USER EXPERIENCE DESIGN

### Visual Design Language

#### Art Style: Soft Realism with Cartoon Charm
- **Objects**: Semi-realistic but friendly (rounded edges, slight gradient shading)
- **Containers**: Clearly defined, simple shapes (buckets, baskets, boxes)
- **Characters**: Diverse, inclusive, non-patronizing (avoid baby talk aesthetics for older kids)
- **Backgrounds**: Soft, uncluttered, neutral colors (won't compete with game objects)

#### Color Palette Specifications

**Primary Colors (Level 1-3)**:
- Red: #E74C3C (RGB 231, 76, 60) - Pure red, high saturation
- Blue: #3498DB (RGB 52, 152, 219) - Clear blue, not navy
- Yellow: #F1C40F (RGB 241, 196, 15) - Bright yellow, not orange-yellow

**Secondary Colors (Level 4-6)**:
- Green: #2ECC71 (RGB 46, 204, 113) - Fresh green, not lime
- Orange: #E67E22 (RGB 230, 126, 34) - True orange
- Purple: #9B59B6 (RGB 155, 89, 182) - Medium purple

**Advanced Colors (Level 7-10)**:
- Pink: #FFC0CB (RGB 255, 192, 203) - Soft pink
- Brown: #8B4513 (RGB 139, 69, 19) - Saddle brown
- Gray: #95A5A6 (RGB 149, 165, 166) - Neutral gray
- Black: #2C3E50 (RGB 44, 62, 80) - Soft black (not pure #000)
- White: #ECF0F1 (RGB 236, 240, 241) - Off-white with slight gray
- Pastel variations of above

#### Sensory Profile Adaptations

**Calm Profile** (Low Sensory Stimulation):
- Pastel versions of all colors (reduce saturation by 40%)
- Matte textures, no gloss or shine
- Minimal particle effects (3-5 sparkles max)
- Slow animations (0.5x speed)
- Soft ambient sounds only (no music)
- Gentle celebrations (small checkmark, quiet "ding")

**Energetic Profile** (High Sensory Stimulation):
- Vibrant, saturated colors (+20% saturation)
- Glossy, shiny surfaces
- Abundant particle effects (confetti, stars, sparkles)
- Fast animations (1.2x speed)
- Upbeat background music
- Enthusiastic celebrations (fireworks, cheering, dance)

**Focused Profile** (Distraction-Free):
- High contrast black/white interface
- Colors only on game objects (not UI/background)
- Zero decorative elements
- No background music
- Minimal sound effects (only essential feedback)
- Text prompts instead of animations

**Custom Profile**:
- Slider controls for all above parameters
- Save per-child settings
- Quick toggle between profiles mid-session

#### Animation Principles

**Object Animations**:
- **Pickup**: Scale to 110%, slight rotation (5°), soft shadow expands
- **Drag**: Object follows finger/mouse with slight lag (80ms) for natural feel
- **Drop (Correct)**: Snap to center of container (0.2s ease-out), scale pulse 100→110→100%
- **Drop (Incorrect)**: Gentle bounce back (0.3s elastic), no harsh movement
- **Celebration**: Object jiggles happily in container (2 bounces)

**Container Animations**:
- **Idle**: Subtle breathing effect (scale 100→102→100% over 3 seconds)
- **Hover (Correct)**: Glow effect, scale 105%, gentle pulse
- **Drop (Correct)**: Small hop (3px up, 0.1s), confetti burst from edges
- **Full Container**: Satisfied bounce, checkmark appears above

**Accessibility Consideration**:
- All animations can be disabled via "Reduced Motion" setting
- Alternative feedback: static glow + sound + text confirmation

### Audio Design

#### Background Music Options
1. **Calm**: Soft piano melody, 60 BPM, major key, minimal instrumentation
2. **Energetic**: Upbeat ukulele + xylophone, 120 BPM, playful bounce
3. **Focused**: White noise / soft nature sounds (rainfall, forest ambience)
4. **Silent**: No background music (parent can play own music)

**Music Volume**: Default 30%, adjustable 0-100%

#### Sound Effects Library

**Interaction Sounds**:
- Object pickup: Soft "pop" (200Hz, 0.1s)
- Object drag: Quiet friction sound (looping while dragging)
- Hover correct container: Gentle chime (C5 note, 0.2s)
- Drop correct: Satisfying "bloop" + sparkle chime cascade
- Drop incorrect: Neutral "boop" (no harsh buzzer)
- All objects matched: Success fanfare (3-second melody)

**Voice-Over Options**:
- **Voice 1**: Female, warm, encouraging (adult voice)
- **Voice 2**: Male, friendly, patient (adult voice)
- **Voice 3**: Child voice, excited, relatable (peer model)
- **Voice 4**: AAC text-to-speech (for consistency with child's device)
- **No Voice**: Visual + text only

**Voice-Over Script** (Color Matching Game):
```
INTRO:
"Welcome to Color Matching! Let's match things by color!"

DURING PLAY (random rotation):
- "You're doing great!"
- "Nice matching!"
- "You found [color]!"
- "Keep going!"

CORRECT MATCH:
- "That's right! [Color] and [color] match!"
- "Perfect! The [object] goes in the [color] bucket!"
- "Yes! Great matching!"

GENTLE REDIRECT (not failure language):
- "Hmm, let's try again!"
- "Almost! Try another one!"
- "Which one is [color]?"

COMPLETION:
- "Wow! You matched all the colors! Amazing work!"
- "You did it! All the colors are matched!"
- "Incredible! You're a color matching expert!"

MASTERY ACHIEVED (after 3 successful sessions):
- "You've mastered this level! Ready for a new challenge?"
```

**Language Localization** (Phase 2):
- Spanish voice-overs (professional voice talent)
- Mandarin voice-overs
- AAC symbol sets (culture-neutral where possible)
- Text translations: 10 languages

### User Interface Layout

#### Screen Layout (16:9 aspect ratio, responsive)

```
┌─────────────────────────────────────────────────────┐
│ [⚙Settings] [Pause⏸]           [Progress Bar] [?Help]│  ← Top Bar
├─────────────────────────────────────────────────────┤
│                                                       │
│              INSTRUCTION TEXT AREA                    │  ← Clear, large font
│         "Match the colors!" [🔊 Voice]               │
│                                                       │
├─────────────────────────────────────────────────────┤
│                                                       │
│     [🔴Red Ball] [🔵Blue Car] [🟡Yellow Star]         │  ← Objects to drag
│     [🟢Green Leaf] [🟠Orange] [🟣Purple Flower]       │     (Top 40% of screen)
│                                                       │
│                                                       │
├─────────────────────────────────────────────────────┤
│                                                       │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐            │  ← Drop containers
│   │         │  │         │  │         │            │     (Bottom 30%)
│   │  RED    │  │  BLUE   │  │ YELLOW  │            │
│   │ BUCKET  │  │ BUCKET  │  │ BUCKET  │            │
│   └─────────┘  └─────────┘  └─────────┘            │
│                                                       │
└─────────────────────────────────────────────────────┘
```

**Responsive Adaptations**:
- **Phone Portrait**: Vertical layout, containers stacked
- **Tablet Landscape**: Wider spacing, larger touch targets
- **Desktop**: Mouse-optimized, keyboard shortcuts enabled

#### Button Specifications

**Touch Target Sizes** (WCAG AAA Compliance):
- Minimum: 44x44 pixels (iOS) / 48x48 dp (Android)
- Recommended: 60x60 pixels for primary actions
- Spacing: 8px minimum between interactive elements

**Button States**:
- Default: Solid color, clear icon/text
- Hover: Scale 105%, slight glow
- Press: Scale 95%, darker shade
- Disabled: 40% opacity, gray filter
- Focus (keyboard): 2px yellow outline

### Accessibility Features (WCAG 2.1 AA + Autism-Specific)

#### Visual Accessibility

**Color Contrast**:
- Text on background: 4.5:1 ratio minimum (AA standard)
- UI elements: 3:1 ratio minimum
- High contrast mode: 7:1 ratio (AAA standard)

**Colorblind Modes**:
- Deuteranopia (red-green): Add patterns/symbols to colors
- Protanopia: Similar accommodation
- Tritanopia (blue-yellow): Pattern overlays
- Setting: "Colorblind Mode" → Game adds stripes, dots, or letters to objects

**Low Vision Support**:
- Pinch-to-zoom: 200% magnification without breaking layout
- Screen reader compatible: All elements labeled
- High contrast themes: Black background, white text, neon colors
- Large text option: 1.5x font size across all text

#### Motor Accessibility

**Touch Accommodations**:
- Touch and hold duration: Adjustable 0.5-3.0 seconds
- Accidental touch prevention: Ignore taps <100ms
- Drag sensitivity: Low/Medium/High settings
- Large drop zones: Containers accept drops within 20px halo

**Alternative Input Methods**:
- Keyboard navigation:
  - Tab: Cycle through objects
  - Arrow keys: Select container
  - Enter: Drop object
  - Esc: Cancel drag
- Switch access: Single-switch scanning (2 seconds per item)
- Eye gaze: Dwell-time selection (1.5 seconds)
- Voice control: "Select red ball", "Drop in blue bucket"

#### Cognitive Accessibility

**Executive Function Support**:
- Visual checklist: Shows which objects matched vs. remaining
- Undo button: Allows reversal of last action
- Pause anytime: Game freezes, no penalty
- Clear feedback: Immediate, unambiguous response to actions

**Autism-Specific Accommodations**:
- Predictable structure: Same layout every session
- Visual schedule: Progress bar shows how much left
- Warning before transitions: "2 more objects!" countdown
- Escape to calm space: Button to calming breathing exercise
- No sudden surprises: All animations/sounds telegraphed

#### Auditory Accessibility

**Deaf/Hard of Hearing**:
- All audio has visual equivalent:
  - Voice-overs → Text appears + icon
  - Sound effects → Visual effects (sparkles, checkmarks)
  - Background music → Ambient visual themes (particles floating)
- Captions: 100% of speech captioned
- ASL option: Video avatar signs instructions (future feature)

#### Screen Reader Support (WCAG A Standard)

**Semantic HTML + ARIA Labels**:
```html
<div role="application" aria-label="Color Matching Puzzle Game">
  <button aria-label="Settings" aria-description="Adjust game preferences">⚙</button>

  <div role="region" aria-label="Objects to match">
    <img src="red_ball.png" alt="Red ball"
         aria-description="Draggable object, color red"
         tabindex="0" role="button">
  </div>

  <div role="region" aria-label="Containers">
    <div aria-label="Red bucket container, drop red objects here"
         role="button" aria-dropeffect="move">
      <span aria-live="polite" aria-atomic="true">
        Red bucket, currently empty
      </span>
    </div>
  </div>

  <div aria-live="assertive" aria-atomic="true">
    <!-- Real-time feedback announced immediately -->
    Correct! Red ball matched to red bucket. 3 objects remaining.
  </div>
</div>
```

**Screen Reader Announcements**:
- Game start: "Color Matching Puzzle. Match 6 objects by color. 3 containers available."
- Object selected: "Red ball selected. Find the red container."
- Correct match: "Correct! Red ball matched. 2 objects remaining."
- Level complete: "Congratulations! All colors matched. You earned 60 points and 3 stars!"

---

## 7. CONTENT SPECIFICATIONS

### Game Assets Required

#### 3D/2D Objects (120 total unique assets)

**Primary Object Sets** (Used across levels):

**Set 1: Basic Shapes (Level 1-3)**
- Balls: Red, Blue, Yellow (3 assets)
- Cubes: Red, Blue, Yellow (3 assets)
- Stars: Red, Blue, Yellow (3 assets)
- Simple, unambiguous colors

**Set 2: Common Objects (Level 4-6)**
- Fruits: Apple (red), Banana (yellow), Orange (orange), Grapes (purple), Lime (green), Blueberries (blue) - 6 assets
- Vehicles: Car (red), Truck (blue), Bus (yellow), Train (green) - 4 assets
- Animals: Bird, Fish, Frog, Butterfly (various colors) - 4 assets per color = 16 assets

**Set 3: Complex Objects (Level 7-10)**
- Clothing: Shirt, Hat, Socks, Shoes (12 colors each) - 48 assets
- School Items: Crayon, Pencil, Book, Backpack (10 colors) - 40 assets
- Nature: Flowers, Leaves, Rocks, Clouds (various colors)

**Asset Specifications**:
- Format: PNG with alpha transparency
- Size: 512x512px source (will scale down)
- DPI: 144 (retina-ready)
- Color space: sRGB
- File size: <100KB per asset (optimized)
- Style: Consistent shading, lighting from top-left
- Orientation: Front-facing, centered

#### Containers (12 unique assets)

**Container Types**:
1. **Bucket** (Levels 1-4): Large, cylindrical, clear color bands
2. **Basket** (Levels 5-7): Woven texture, colored handles
3. **Box** (Levels 8-10): Square, smaller, precise placement needed

**Each Container**:
- 12 color variants (matches color palette)
- Empty state (base)
- Filling states (1-5 objects inside, layered)
- Full state (satisfied checkmark)
- Hover state (glow effect)

**Specifications**:
- Format: PNG with alpha
- Size: 400x400px (buckets), 300x300px (boxes)
- Animations: Unity Animator Controller
  - Idle: Subtle scale breathing
  - Hover: Glow shader + pulse
  - Fill: Pop + settle animation

#### Background Environments (4 themes)

**Theme 1: Playroom** (Default)
- Soft carpet floor texture
- Toy shelf in background (blurred)
- Window showing blue sky
- Warm, inviting, familiar

**Theme 2: Garden** (Nature)
- Grass texture floor
- Flowers and trees background
- Sunny day, birds flying
- Calming, outdoor feel

**Theme 3: Space** (Adventure)
- Starfield background
- Planets in distance
- Rocket ship decoration
- Exciting, imaginative

**Theme 4: Minimal** (Focused Profile)
- Solid gradient background (gray to light gray)
- No decorations
- Pure focus on game objects

**Specifications**:
- Resolution: 1920x1080px (scales to device)
- Layered PSD source files
- Parallax layers (foreground, midground, background) for depth
- Optimized WebGL textures <2MB total

#### UI Elements

**Buttons** (Vector SVG, scalable):
- Settings gear icon
- Pause button
- Help (question mark icon)
- Play again (circular arrow)
- Exit/Home (house icon)
- Volume controls (speaker icons)

**Progress Indicators**:
- Progress bar (horizontal, fills left-to-right)
- Star rating (empty, half, full states)
- Checklist items (checkbox unchecked/checked)

**Feedback Graphics**:
- Confetti particles (100 individual pieces)
- Sparkle particles (star shapes, various sizes)
- Checkmark icon (green, animated draw-in)
- Arrow prompt (pulsing, directional)

#### Character Mascot (Optional Encouragement)

**Design Brief**:
- Gender-neutral, friendly creature (not overly childish)
- Expressive face (happy, surprised, encouraging)
- Animated reactions:
  - Idle: Gentle breathing, blinks
  - Encouragement: Thumbs up, claps hands
  - Celebration: Jumps, confetti throw
  - Thinking: Hand on chin (during pauses)

**Specs**:
- Spine 2D animation (skeletal)
- 8 animation states @ 24fps
- Color variants match child's selected theme

---

### Audio Asset Library

#### Music Tracks

**Track 1: "Color Garden"** (Calm Profile)
- Instrument: Solo piano + soft strings
- Tempo: 60 BPM
- Key: C Major
- Duration: 3:00 (seamless loop)
- Mood: Peaceful, focused
- File: WAV 44.1kHz stereo, export OGG for WebGL

**Track 2: "Rainbow Bounce"** (Energetic Profile)
- Instruments: Ukulele, xylophone, light percussion
- Tempo: 120 BPM
- Key: G Major
- Duration: 2:30 (loop)
- Mood: Playful, upbeat
- File: Same specs as Track 1

**Track 3: "Gentle Focus"** (Ambient)
- Sound: White noise + nature sounds (birds, stream)
- No musical structure
- Duration: 10:00 (long loop, unnoticeable seam)

#### Sound Effects (58 total)

**Interaction SFX**:
| Event | Sound | Frequency | Duration | Volume |
|-------|-------|-----------|----------|--------|
| Object pickup | Soft pop | 200Hz | 0.1s | 60% |
| Drag (loop) | Quiet friction | Broadband | Looping | 30% |
| Hover correct | Chime C5 | 523Hz | 0.2s | 70% |
| Drop correct | Bloop + sparkles | 300Hz + cascade | 0.5s | 80% |
| Drop incorrect | Neutral boop | 150Hz | 0.2s | 50% |
| Container full | Success ding | C6 | 0.3s | 90% |
| Level complete | Fanfare melody | Multi | 3.0s | 100% |

**Voice-Over Recordings** (3 voice actors × 50 lines = 150 files):
- Professional child voice actor (age 7-9)
- Female adult voice (warm, encouraging tone)
- Male adult voice (friendly, patient tone)

**Recording Specs**:
- Format: WAV 48kHz 16-bit mono
- Processing: Light compression, normalize -3dB
- Noise floor: <-60dB
- Export: OGG Vorbis for WebGL, AAC for mobile

---

## 8. DATA TRACKING & ANALYTICS

### Session Data Schema (Backend API)

```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "game_id": "color_matching_puzzle_v1",
  "user_id": "user_12345",
  "child_profile_id": "child_67890",
  "timestamp_start": "2025-10-15T14:30:00Z",
  "timestamp_end": "2025-10-15T14:38:32Z",
  "duration_seconds": 512,
  "completed": true,

  "game_configuration": {
    "difficulty_level": 3,
    "num_colors": 3,
    "num_objects": 8,
    "num_distractors": 1,
    "sensory_profile": "calm",
    "voice_enabled": true,
    "prompts_enabled": true
  },

  "performance_metrics": {
    "total_trials": 9,
    "correct_first_attempt": 6,
    "correct_with_prompts": 2,
    "incorrect_attempts": 7,
    "accuracy_percentage": 66.7,
    "mastery_achieved": false,

    "prompt_data": {
      "no_prompt_trials": 6,
      "level_1_prompts": 1,
      "level_2_prompts": 1,
      "level_3_prompts": 1,
      "level_4_prompts": 0,
      "prompt_dependency_score": 33.3
    },

    "timing_data": {
      "avg_response_time_ms": 8450,
      "fastest_response_ms": 2100,
      "slowest_response_ms": 22000,
      "response_times": [8400, 6200, 22000, 4500, 12000, 7800, 3200, 9100, 2100]
    }
  },

  "skills_practiced": [
    {
      "skill_id": "ablls_b1_match_identical_colors",
      "skill_name": "Match Identical Colors",
      "framework": "ABLLS-R",
      "category": "B1-B3",
      "trials_this_session": 8,
      "correct_this_session": 6,
      "accuracy_this_session": 75.0,
      "cumulative_trials": 47,
      "cumulative_correct": 39,
      "cumulative_accuracy": 83.0,
      "mastery_status": "in_progress",
      "sessions_until_mastery": 1
    },
    {
      "skill_id": "ablls_c12_sort_by_color",
      "skill_name": "Sort by Color Category",
      "framework": "ABLLS-R",
      "category": "C12",
      "trials_this_session": 1,
      "correct_this_session": 0,
      "accuracy_this_session": 0,
      "cumulative_trials": 5,
      "cumulative_correct": 2,
      "cumulative_accuracy": 40.0,
      "mastery_status": "emerging",
      "sessions_until_mastery": 8
    }
  ],

  "behavioral_observations": {
    "engagement_score": 8.5,
    "frustration_indicators": 1,
    "help_requests": 2,
    "spontaneous_comments": 0,
    "breaks_requested": 0,
    "session_abandoned": false
  },

  "errors_detailed": [
    {
      "trial_number": 3,
      "object": "red_ball",
      "incorrect_container": "blue_bucket",
      "correct_container": "red_bucket",
      "error_type": "color_confusion",
      "prompt_given": "level_2_gestural",
      "corrected": true,
      "timestamp": "2025-10-15T14:33:15Z"
    },
    {
      "trial_number": 5,
      "object": "yellow_star",
      "incorrect_container": "red_bucket",
      "correct_container": "yellow_bucket",
      "error_type": "distractor_selected",
      "prompt_given": "level_1_observational",
      "corrected": true,
      "timestamp": "2025-10-15T14:35:42Z"
    }
  ],

  "rewards_earned": {
    "points": 70,
    "stars": 2,
    "badges": ["color_matcher_bronze"],
    "unlocks": []
  },

  "next_session_recommendation": {
    "difficulty_change": "maintain",
    "reasoning": "66% accuracy - within optimal challenge zone (60-80%)",
    "focus_skills": ["color_discrimination_red_vs_pink"],
    "suggested_game": "color_matching_puzzle_v1",
    "estimated_sessions_to_mastery": 2
  }
}
```

### Parent Dashboard Visualizations

#### 1. Progress Over Time Chart
```
Skill Mastery: Match Identical Colors (ABLLS-R B1)

100% ┤                                            ⭐ MASTERED
 90% ┤                                      ●────●
 80% ┤                              ●─────●
 70% ┤                       ●─────●
 60% ┤                 ●─────●
 50% ┤           ●─────●
 40% ┤      ●───●
 30% ┤  ●──●
     └─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────→
         Day 1   Day 3  Day 5  Day 7  Day 9 Day 11 Day 13

Key Insight: "Emma improved 60% in 2 weeks! She's ready for more colors."
```

#### 2. Skills Breakdown (Circular Progress)
```
Visual Skills              Communication Skills        Motor Skills
┌─────────────┐           ┌─────────────┐            ┌─────────────┐
│    85%      │           │    45%      │            │    70%      │
│   ████████  │           │   ████      │            │   ██████    │
│   ████████  │           │   ████      │            │   ██████    │
│             │           │             │            │             │
└─────────────┘           └─────────────┘            └─────────────┘
  6/7 Mastered              3/8 In Progress           5/7 Mastered
```

#### 3. Session Summary Table
| Date | Game Played | Duration | Accuracy | Stars | Skills Worked |
|------|-------------|----------|----------|-------|---------------|
| Oct 15 | Color Matching | 8m 32s | 67% | ⭐⭐ | Color Discrimination |
| Oct 14 | Color Matching | 6m 18s | 75% | ⭐⭐⭐ | Matching Colors |
| Oct 13 | Color Matching | 12m 05s | 55% | ⭐ | Sorting by Category |

#### 4. Strengths & Challenges (AI-Generated Insights)
**Strengths** 💪:
- "Emma is excellent at matching primary colors (90% accuracy on red, blue, yellow)"
- "Her response time is improving - now 30% faster than Week 1"
- "She stays engaged for full sessions without needing breaks"

**Areas to Support** 🎯:
- "Pink vs Red discrimination needs practice - consider real-world activities like sorting laundry"
- "Occasionally selects wrong container due to spatial confusion (left/right) - practice position words"

#### 5. Real-Time Celebration Feed
```
🎉 New Achievement Unlocked!
   "Color Matcher Bronze" - Matched 50 objects correctly

⭐ Skill Mastered!
   "Match Red & Blue" (ABLLS-R B1) - 3 consecutive sessions at 90%+

🔓 New Game Unlocked!
   "Rainbow Sort" - Ready for 6 colors now!
```

### Clinical Dashboard (for BCBAs/Therapists)

#### Acquisition Curve Analysis
```python
# Typical learning curve for color matching
# BCBAs can compare individual child to norm

Expected Trials to Mastery: 30-50 trials (norm)
Emma's Trials to Mastery: 42 trials (within norm)
Learning Rate: 2.1% improvement per session (average)
```

#### Prompt Dependency Tracking
```
Session-by-Session Prompt Fading

100% ┤ ████████  ← Full prompts
 80% ┤ ██████
 60% ┤ ████      ← Partial prompts
 40% ┤ ██        ← Minimal prompts
 20% ┤ ▓
  0% ┤ ░░░░░     ← Independent
     └───┬───┬───┬───┬───┬───┬───→
       Sess1 Sess3 Sess5 Sess7 Sess9

Goal: 80%+ independent responses by Session 10
Emma's Progress: On track ✓
```

#### Error Pattern Analysis
```
Most Common Errors:
1. Red vs Pink confusion (12 errors) - Add discrimination training
2. Left vs Right container (8 errors) - Spatial concept practice
3. Timeout/No response (3 trials) - Check engagement, consider breaks

Recommendation:
- Add "Shades of Red" mini-game focusing on pink/red/crimson distinction
- Incorporate spatial language in real-world activities
```

### Data Privacy & HIPAA Compliance

**Encryption**:
- All session data encrypted at rest (AES-256)
- TLS 1.3 in transit
- Database: PostgreSQL with pgcrypto extension

**Access Controls**:
- Parents: See only their child's data
- Therapists: See only assigned clients (with parent consent)
- Researchers: Anonymized aggregate data only (opt-in)

**Data Retention**:
- Active users: Indefinite storage (for progress tracking)
- Inactive users: 1-year retention, then anonymize
- Deleted accounts: 30-day soft delete, then permanent erasure

**Compliance Checklist**:
- ✅ HIPAA Business Associate Agreement (BAA) with AWS
- ✅ COPPA compliant (parental consent for children <13)
- ✅ GDPR compliant (right to access, delete, export data)
- ✅ FERPA compliant (educational records protection)

---

## 9. TECHNICAL IMPLEMENTATION

### Unity Development Specifications

#### Project Setup
- **Unity Version**: 2022.3 LTS (Long-Term Support)
- **Render Pipeline**: Universal Render Pipeline (URP) 14.x
- **Platform Target**: WebGL, iOS, Android
- **Scripting Backend**: IL2CPP (better performance, smaller builds)
- **API Compatibility**: .NET Standard 2.1

#### Project Structure
```
Assets/
├── Scenes/
│   ├── MainMenu.unity
│   ├── ColorMatchingGame.unity
│   └── CelebrationScene.unity
├── Scripts/
│   ├── GameManagers/
│   │   ├── ColorMatchingManager.cs (main game logic)
│   │   ├── DifficultyController.cs (adaptive difficulty)
│   │   ├── ProgressTracker.cs (session data)
│   │   └── AudioManager.cs (sound control)
│   ├── UI/
│   │   ├── DragDropHandler.cs (touch/mouse interaction)
│   │   ├── ContainerController.cs (bucket behavior)
│   │   ├── FeedbackAnimator.cs (correct/incorrect)
│   │   └── AccessibilityManager.cs (a11y features)
│   ├── Networking/
│   │   ├── APIClient.cs (backend communication)
│   │   ├── SessionUploader.cs (data sync)
│   │   └── AuthManager.cs (user authentication)
│   └── Utilities/
│       ├── ColorPalette.cs (color definitions)
│       ├── SensoryProfiler.cs (profile switching)
│       └── AnalyticsLogger.cs (event tracking)
├── Prefabs/
│   ├── Objects/ (draggable items)
│   ├── Containers/ (buckets, baskets)
│   ├── UI/ (buttons, panels)
│   └── Effects/ (particles, animations)
├── Materials/
├── Textures/
├── Audio/
│   ├── Music/
│   ├── SFX/
│   └── VoiceOvers/
├── Animations/
└── Plugins/
    ├── TextMeshPro/
    ├── DOTween/ (animation library)
    └── UniTask/ (async utilities)
```

#### Core Script: ColorMatchingManager.cs

```csharp
using UnityEngine;
using System.Collections.Generic;
using System.Linq;
using UnityEngine.EventSystems;
using Cysharp.Threading.Tasks;

public class ColorMatchingManager : MonoBehaviour
{
    [Header("Game Configuration")]
    [SerializeField] private int currentLevel = 1;
    [SerializeField] private List<ColorData> availableColors;
    [SerializeField] private Transform objectSpawnArea;
    [SerializeField] private Transform containerArea;

    [Header("Prefabs")]
    [SerializeField] private GameObject objectPrefab;
    [SerializeField] private GameObject containerPrefab;
    [SerializeField] private GameObject celebrationEffectPrefab;

    [Header("Difficulty Settings")]
    [SerializeField] private DifficultyConfig difficultyConfig;

    [Header("Audio")]
    [SerializeField] private AudioClip correctSound;
    [SerializeField] private AudioClip incorrectSound;
    [SerializeField] private AudioClip completionSound;

    // Runtime tracking
    private List<DraggableObject> spawnedObjects = new List<DraggableObject>();
    private List<ColorContainer> spawnedContainers = new List<ColorContainer>();
    private SessionData currentSession;
    private int correctMatches = 0;
    private int totalAttempts = 0;

    // Prompting system
    private PromptLevel currentPromptLevel = PromptLevel.None;
    private int consecutiveErrors = 0;

    private void Start()
    {
        InitializeSession();
        SetupLevel();
    }

    private void InitializeSession()
    {
        currentSession = new SessionData
        {
            sessionId = System.Guid.NewGuid().ToString(),
            gameId = "color_matching_puzzle_v1",
            userId = UserManager.Instance.CurrentUser.Id,
            timestampStart = System.DateTime.UtcNow,
            difficultyLevel = currentLevel,
            configuration = GetCurrentConfiguration()
        };
    }

    private void SetupLevel()
    {
        ClearPreviousLevel();

        // Get difficulty parameters for current level
        var config = difficultyConfig.GetLevelConfig(currentLevel);

        // Spawn containers
        for (int i = 0; i < config.numColors; i++)
        {
            ColorData color = availableColors[i];
            var container = Instantiate(containerPrefab, containerArea).GetComponent<ColorContainer>();
            container.Initialize(color, OnObjectDropped);
            spawnedContainers.Add(container);
        }

        // Spawn objects to match
        List<ColorData> objectColors = new List<ColorData>();
        for (int i = 0; i < config.objectsPerColor; i++)
        {
            foreach (var color in availableColors.Take(config.numColors))
            {
                objectColors.Add(color);
            }
        }

        // Add distractors (wrong-colored objects)
        for (int i = 0; i < config.numDistractors; i++)
        {
            var distractorColor = availableColors[config.numColors + i % (availableColors.Count - config.numColors)];
            objectColors.Add(distractorColor);
        }

        // Shuffle and spawn
        objectColors = objectColors.OrderBy(x => Random.value).ToList();
        foreach (var color in objectColors)
        {
            var obj = Instantiate(objectPrefab, objectSpawnArea).GetComponent<DraggableObject>();
            obj.Initialize(color, GetRandomObjectSprite(color));
            spawnedObjects.Add(obj);
        }

        // Announce level start (accessibility)
        AccessibilityManager.Instance.Announce($"Level {currentLevel}. Match {config.numColors} colors. {objectColors.Count} objects to sort.");
    }

    private void OnObjectDropped(DraggableObject obj, ColorContainer container)
    {
        totalAttempts++;
        bool isCorrect = obj.Color.colorName == container.Color.colorName;

        // Record attempt
        currentSession.RecordAttempt(obj, container, isCorrect, currentPromptLevel);

        if (isCorrect)
        {
            HandleCorrectMatch(obj, container);
        }
        else
        {
            HandleIncorrectMatch(obj, container);
        }

        // Check for level completion
        if (correctMatches >= GetRequiredMatches())
        {
            OnLevelComplete();
        }
    }

    private void HandleCorrectMatch(DraggableObject obj, ColorContainer container)
    {
        correctMatches++;
        consecutiveErrors = 0;

        // Visual feedback
        container.PlaySuccessAnimation();
        Instantiate(celebrationEffectPrefab, obj.transform.position, Quaternion.identity);

        // Audio feedback
        AudioManager.Instance.PlaySound(correctSound);

        // Voice encouragement
        VoiceOverManager.Instance.PlayRandomEncouragement();

        // Accessibility announcement
        AccessibilityManager.Instance.Announce($"Correct! {obj.Color.colorName} matched. {GetRemainingObjects()} objects left.");

        // Disable dragging on matched object
        obj.SetInteractable(false);
        obj.transform.SetParent(container.transform);

        // Reduce prompt level if doing well
        if (correctMatches % 3 == 0 && currentPromptLevel > PromptLevel.None)
        {
            currentPromptLevel--;
        }
    }

    private void HandleIncorrectMatch(DraggableObject obj, ColorContainer container)
    {
        consecutiveErrors++;

        // Gentle feedback
        obj.ReturnToOriginalPosition();
        container.PlayIncorrectAnimation(); // Gentle shake

        // Non-punitive audio
        AudioManager.Instance.PlaySound(incorrectSound, volume: 0.3f);

        // Provide help if struggling
        if (consecutiveErrors >= 2)
        {
            currentPromptLevel = PromptLevel.Gestural;
            ShowPrompt(obj);
        }

        if (consecutiveErrors >= 3)
        {
            currentPromptLevel = PromptLevel.PartialPhysical;
            HighlightCorrectContainer(obj);
        }

        if (consecutiveErrors >= 4)
        {
            currentPromptLevel = PromptLevel.FullPhysical;
            await AutoCompleteMatch(obj); // Errorless teaching
        }

        // Accessibility
        AccessibilityManager.Instance.Announce($"Try again. Find the {obj.Color.colorName} container.");
    }

    private void ShowPrompt(DraggableObject obj)
    {
        // Show arrow pointing to correct container
        ColorContainer correctContainer = spawnedContainers.Find(c => c.Color == obj.Color);
        ArrowPrompt.Instance.ShowArrow(obj.transform, correctContainer.transform);
    }

    private void HighlightCorrectContainer(DraggableObject obj)
    {
        ColorContainer correctContainer = spawnedContainers.Find(c => c.Color == obj.Color);
        correctContainer.Highlight(duration: 3f);
        obj.Highlight(duration: 3f);
    }

    private async UniTask AutoCompleteMatch(DraggableObject obj)
    {
        // Errorless teaching: Automatically move to correct container
        ColorContainer correctContainer = spawnedContainers.Find(c => c.Color == obj.Color);

        await obj.AnimateToContainer(correctContainer, duration: 1.5f);

        // Still provide full celebration (success is success!)
        HandleCorrectMatch(obj, correctContainer);

        VoiceOverManager.Instance.PlayLine("Let's match this one together!");
    }

    private async void OnLevelComplete()
    {
        // Calculate performance
        float accuracy = (float)correctMatches / totalAttempts * 100f;
        int stars = GetStarRating(accuracy);

        // End session
        currentSession.timestampEnd = System.DateTime.UtcNow;
        currentSession.completed = true;
        currentSession.accuracy = accuracy;
        currentSession.stars = stars;

        // Upload to backend
        await APIClient.Instance.UploadSession(currentSession);

        // Celebration scene
        await CelebrationController.Instance.ShowCelebration(stars, accuracy);

        // Determine next level
        if (accuracy >= 90f && consecutiveErrors == 0)
        {
            currentLevel++;
            AccessibilityManager.Instance.Announce($"Amazing! Moving to level {currentLevel}!");
        }
        else if (accuracy < 70f)
        {
            currentLevel = Mathf.Max(1, currentLevel - 1);
            AccessibilityManager.Instance.Announce("Let's try this level again with some help!");
        }

        // Ask to continue or exit
        UIManager.Instance.ShowContinueDialog(
            onContinue: () => SetupLevel(),
            onExit: () => SceneManager.LoadScene("MainMenu")
        );
    }

    private int GetStarRating(float accuracy)
    {
        if (accuracy >= 95f && consecutiveErrors == 0) return 3;
        if (accuracy >= 80f) return 2;
        return 1;
    }

    private void ClearPreviousLevel()
    {
        foreach (var obj in spawnedObjects) Destroy(obj.gameObject);
        foreach (var container in spawnedContainers) Destroy(container.gameObject);
        spawnedObjects.Clear();
        spawnedContainers.Clear();
        correctMatches = 0;
        totalAttempts = 0;
        consecutiveErrors = 0;
    }

    // Helper methods
    private int GetRequiredMatches()
    {
        var config = difficultyConfig.GetLevelConfig(currentLevel);
        return config.numColors * config.objectsPerColor;
    }

    private int GetRemainingObjects()
    {
        return GetRequiredMatches() - correctMatches;
    }

    private Sprite GetRandomObjectSprite(ColorData color)
    {
        // Return random sprite matching this color from sprite library
        return SpriteLibrary.Instance.GetRandomSprite(color);
    }

    private GameConfiguration GetCurrentConfiguration()
    {
        return new GameConfiguration
        {
            difficultyLevel = currentLevel,
            numColors = difficultyConfig.GetLevelConfig(currentLevel).numColors,
            sensoryProfile = SensoryProfiler.Instance.CurrentProfile,
            voiceEnabled = SettingsManager.Instance.VoiceEnabled,
            promptsEnabled = SettingsManager.Instance.PromptsEnabled
        };
    }
}

// Supporting classes

[System.Serializable]
public class ColorData
{
    public string colorName;
    public Color color;
    public Sprite containerSprite;
    public List<Sprite> objectSprites;
}

public enum PromptLevel
{
    None = 0,
    Observational = 1,
    Gestural = 2,
    PartialPhysical = 3,
    FullPhysical = 4
}

[System.Serializable]
public class DifficultyConfig
{
    public List<LevelConfig> levels;

    public LevelConfig GetLevelConfig(int level)
    {
        return levels[Mathf.Clamp(level - 1, 0, levels.Count - 1)];
    }
}

[System.Serializable]
public class LevelConfig
{
    public int numColors;
    public int objectsPerColor;
    public int numDistractors;
    public float containerSize;
}
```

#### DraggableObject.cs (Touch/Mouse Interaction)

```csharp
using UnityEngine;
using UnityEngine.EventSystems;
using DG.Tweening; // DOTween animation library

public class DraggableObject : MonoBehaviour, IBeginDragHandler, IDragHandler, IEndDragHandler, IPointerDownHandler
{
    public ColorData Color { get; private set; }
    private Vector3 originalPosition;
    private Transform originalParent;
    private Canvas canvas;
    private RectTransform rectTransform;
    private CanvasGroup canvasGroup;
    private bool isDraggable = true;

    [SerializeField] private float dragScale = 1.1f;
    [SerializeField] private GameObject highlightEffect;

    public void Initialize(ColorData color, Sprite sprite)
    {
        this.Color = color;
        GetComponent<Image>().sprite = sprite;
        rectTransform = GetComponent<RectTransform>();
        canvasGroup = GetComponent<CanvasGroup>();
        canvas = GetComponentInParent<Canvas>();
        originalPosition = transform.position;
        originalParent = transform.parent;
    }

    public void OnPointerDown(PointerEventData eventData)
    {
        if (!isDraggable) return;

        // Haptic feedback (mobile only)
        Handheld.Vibrate();

        // Audio feedback
        AudioManager.Instance.PlaySound("pickup");

        // Accessibility announcement
        AccessibilityManager.Instance.Announce($"{Color.colorName} object selected");
    }

    public void OnBeginDrag(PointerEventData eventData)
    {
        if (!isDraggable) return;

        // Visual feedback: Scale up slightly
        transform.DOScale(Vector3.one * dragScale, 0.2f);

        // Reduce opacity slightly to see underneath
        canvasGroup.alpha = 0.8f;

        // Allow dragging through other UI elements
        canvasGroup.blocksRaycasts = false;

        // Bring to front
        transform.SetAsLastSibling();
    }

    public void OnDrag(PointerEventData eventData)
    {
        if (!isDraggable) return;

        // Follow finger/mouse position
        rectTransform.anchoredPosition += eventData.delta / canvas.scaleFactor;

        // Check if hovering over containers (for glow effect)
        CheckContainerHover(eventData);
    }

    public void OnEndDrag(PointerEventData eventData)
    {
        if (!isDraggable) return;

        // Restore scale
        transform.DOScale(Vector3.one, 0.2f);
        canvasGroup.alpha = 1f;
        canvasGroup.blocksRaycasts = true;

        // Check if dropped on container
        var results = new List<RaycastResult>();
        EventSystem.current.RaycastAll(eventData, results);

        ColorContainer targetContainer = null;
        foreach (var result in results)
        {
            targetContainer = result.gameObject.GetComponent<ColorContainer>();
            if (targetContainer != null) break;
        }

        if (targetContainer != null)
        {
            // Dropped on a container
            ColorMatchingManager.Instance.OnObjectDropped(this, targetContainer);
        }
        else
        {
            // Dropped in empty space - return to original position
            ReturnToOriginalPosition();
        }
    }

    public void ReturnToOriginalPosition()
    {
        transform.DOMove(originalPosition, 0.3f).SetEase(Ease.OutBack);
        transform.SetParent(originalParent);
    }

    public async UniTask AnimateToContainer(ColorContainer container, float duration)
    {
        // Errorless teaching animation
        await transform.DOMove(container.transform.position, duration).SetEase(Ease.InOutQuad).AsyncWaitForCompletion();
        transform.SetParent(container.transform);
    }

    public void Highlight(float duration)
    {
        highlightEffect.SetActive(true);
        DOVirtual.DelayedCall(duration, () => highlightEffect.SetActive(false));
    }

    public void SetInteractable(bool interactable)
    {
        isDraggable = interactable;
        canvasGroup.alpha = interactable ? 1f : 0.5f;
    }

    private void CheckContainerHover(PointerEventData eventData)
    {
        var results = new List<RaycastResult>();
        EventSystem.current.RaycastAll(eventData, results);

        foreach (var result in results)
        {
            var container = result.gameObject.GetComponent<ColorContainer>();
            if (container != null)
            {
                // Notify container of hover (for glow effect)
                container.OnHover(this);
                break;
            }
        }
    }
}
```

### Backend API Integration

#### API Endpoints (RESTful)

**Base URL**: `https://api.skillbridge.com/v1`

**Authentication**: JWT Bearer token in header

```
Authorization: Bearer <token>
```

#### Endpoint 1: Start Session
```http
POST /sessions/start

Request Body:
{
  "game_id": "color_matching_puzzle_v1",
  "user_id": "user_12345",
  "child_profile_id": "child_67890",
  "configuration": {
    "difficulty_level": 3,
    "sensory_profile": "calm",
    "voice_enabled": true
  }
}

Response:
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-10-15T14:30:00Z",
  "status": "active"
}
```

#### Endpoint 2: Log Game Events (Real-Time)
```http
POST /sessions/:session_id/events

Request Body:
{
  "event_type": "object_dropped",
  "timestamp": "2025-10-15T14:33:15Z",
  "data": {
    "object_color": "red",
    "container_color": "blue",
    "is_correct": false,
    "prompt_level": 2,
    "response_time_ms": 8400
  }
}

Response:
{
  "event_id": "evt_12345",
  "recorded": true
}
```

#### Endpoint 3: Complete Session
```http
POST /sessions/:session_id/complete

Request Body:
{
  "timestamp_end": "2025-10-15T14:38:32Z",
  "duration_seconds": 512,
  "performance_metrics": {
    "total_trials": 9,
    "correct_responses": 6,
    "accuracy_percentage": 66.7,
    "prompt_dependency": 33.3
  },
  "rewards_earned": {
    "points": 70,
    "stars": 2
  }
}

Response:
{
  "session_completed": true,
  "next_recommended_level": 3,
  "skills_updated": [
    {
      "skill_id": "ablls_b1",
      "new_mastery_percentage": 83.0,
      "status": "in_progress"
    }
  ],
  "achievements_unlocked": ["color_matcher_bronze"]
}
```

#### Endpoint 4: Get User Progress
```http
GET /users/:user_id/progress?game_id=color_matching_puzzle_v1

Response:
{
  "current_level": 3,
  "total_sessions": 12,
  "total_playtime_minutes": 87,
  "skills": [
    {
      "skill_id": "ablls_b1",
      "skill_name": "Match Identical Colors",
      "mastery_percentage": 83.0,
      "sessions_practiced": 12,
      "status": "in_progress",
      "estimated_sessions_to_mastery": 2
    }
  ],
  "achievements": ["color_matcher_bronze"],
  "points_total": 840
}
```

### Performance Optimization

#### WebGL Build Optimization
```csharp
// Build settings for optimal WebGL performance

// Enable compression
PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Brotli;

// Code optimization
PlayerSettings.SetScriptingBackend(BuildTargetGroup.WebGL, ScriptingImplementation.IL2CPP);
PlayerSettings.SetIl2CppCompilerConfiguration(BuildTargetGroup.WebGL, Il2CppCompilerConfiguration.Master);

// Asset optimization
EditorUserBuildSettings.webGLOptimizationLevel = WebGLOptimizationLevel.Speed;

// Memory management
PlayerSettings.WebGL.memorySize = 256; // MB, adjust based on testing

// Disable unnecessary features
PlayerSettings.SetUseDefaultGraphicsAPIs(BuildTarget.WebGL, false);
PlayerSettings.SetGraphicsAPIs(BuildTarget.WebGL, new[] { GraphicsDeviceType.OpenGLES3 });
```

#### Asset Loading (Addressables)
```csharp
// Load assets asynchronously to reduce initial load time
using UnityEngine.AddressableAssets;
using UnityEngine.ResourceManagement.AsyncOperations;

public class AssetLoader : MonoBehaviour
{
    public async UniTask<Sprite> LoadSprite(string address)
    {
        var handle = Addressables.LoadAssetAsync<Sprite>(address);
        await handle.Task;

        if (handle.Status == AsyncOperationStatus.Succeeded)
        {
            return handle.Result;
        }
        else
        {
            Debug.LogError($"Failed to load sprite: {address}");
            return null;
        }
    }
}
```

#### Memory Management
```csharp
// Unload unused assets after level completion
private void OnLevelComplete()
{
    // Clear references
    spawnedObjects.Clear();
    spawnedContainers.Clear();

    // Force garbage collection
    System.GC.Collect();

    // Unload unused assets
    Resources.UnloadUnusedAssets();
}
```

---

## 10. TESTING & VALIDATION

### Test Plan Overview

#### Phase 1: Internal Testing (Week 3, Days 1-2)
**Testers**: 5 team members
**Duration**: 2 days
**Focus**: Functionality, bugs, performance

**Test Cases**:
1. **Happy Path**: Complete game from start to finish, all objects matched correctly
2. **Error Handling**: Intentionally make mistakes, verify gentle feedback
3. **Prompt System**: Trigger all prompt levels, verify appropriate assistance
4. **Adaptive Difficulty**: Play 5 consecutive sessions, verify level increases
5. **Accessibility**: Test with screen reader, keyboard-only, switch access
6. **Performance**: Measure load times, frame rate, memory usage
7. **Multi-Device**: Test on Windows, Mac, iOS, Android, various screen sizes
8. **Edge Cases**: Rapid tapping, dragging outside boundaries, network disconnection

**Exit Criteria**:
- Zero critical bugs (crashes, data loss)
- <5 minor bugs (cosmetic issues)
- Load time <3 seconds
- Frame rate 60fps on mid-tier devices

#### Phase 2: Clinical Testing (Week 3, Days 3-4)
**Testers**: BCBA, SLP, OT
**Duration**: 2 days
**Focus**: Educational validity, clinical alignment

**Validation Checklist**:
- ✅ Skills accurately map to ABLLS-R B1-B3 framework
- ✅ Difficulty progression aligns with developmental milestones
- ✅ Prompting hierarchy follows ABA best practices
- ✅ Reinforcement schedule appropriate (not overly frequent or sparse)
- ✅ Error correction non-punitive and supportive
- ✅ Data collection captures meaningful clinical metrics
- ✅ Mastery criteria scientifically sound (80% over 3 sessions)
- ✅ Generalization opportunities embedded

**BCBA Sign-Off Form**:
```
Clinical Validation: Color Matching Puzzle

Reviewer: Dr. [Name], BCBA-D
Date: October 15, 2025

Skill Alignment:      [X] Approved  [ ] Needs Revision
Prompting System:     [X] Approved  [ ] Needs Revision
Reinforcement:        [X] Approved  [ ] Needs Revision
Data Collection:      [X] Approved  [ ] Needs Revision
Safety/Ethics:        [X] Approved  [ ] Needs Revision

Overall Recommendation: [X] APPROVED FOR BETA TESTING

Comments:
"Excellent alignment with ABLLS-R B1-B3. Prompting hierarchy
follows evidence-based practices. Suggest adding option to
reduce session length for children with shorter attention spans
(5-question mode). Otherwise, ready for beta families."

Signature: _________________ Date: __________
```

#### Phase 3: Accessibility Audit (Week 3, Day 5)
**Tester**: Accessibility Specialist
**Duration**: 1 day
**Focus**: WCAG 2.1 AA compliance, autism-specific accommodations

**Audit Tools**:
- axe DevTools (automated testing)
- NVDA screen reader (Windows)
- VoiceOver screen reader (macOS/iOS)
- Pa11y (command-line testing)
- Manual keyboard navigation

**WCAG 2.1 AA Checklist** (50 criteria):
- ✅ 1.1.1 Non-text Content: All images have alt text
- ✅ 1.3.1 Info and Relationships: Semantic HTML structure
- ✅ 1.4.3 Contrast: Text 4.5:1, UI elements 3:1
- ✅ 1.4.10 Reflow: Responsive down to 320px width
- ✅ 2.1.1 Keyboard: All functions keyboard accessible
- ✅ 2.1.2 No Keyboard Trap: Can navigate in/out of game
- ✅ 2.4.3 Focus Order: Logical tab order
- ✅ 2.4.7 Focus Visible: Clear focus indicators
- ✅ 2.5.1 Pointer Gestures: No multi-point gestures required
- ✅ 2.5.2 Pointer Cancellation: Actions on button release
- ✅ 3.2.1 On Focus: No unexpected context changes
- ✅ 3.3.1 Error Identification: Errors clearly announced
- ✅ 4.1.2 Name, Role, Value: ARIA labels correct
- ✅ 4.1.3 Status Messages: aria-live regions implemented

**Autism-Specific Checklist** (32 criteria):
- ✅ Sensory customization: 4 profiles available
- ✅ Predictable layout: Consistent across sessions
- ✅ Visual schedule: Progress bar shows completion
- ✅ Escape option: Calm space accessible anytime
- ✅ No sudden surprises: All transitions announced
- ✅ Clear feedback: Unambiguous correct/incorrect
- ✅ Executive function support: Checklist shows remaining items
- ✅ AAC integration: Symbol support implemented

**Audit Report**:
```
Accessibility Audit: Color Matching Puzzle

Auditor: [Name], CPACC (Certified Professional in Accessibility Core Competencies)
Date: October 18, 2025

WCAG 2.1 Level AA: PASS ✅
- 50/50 criteria met
- Zero violations detected

Autism-Specific: PASS ✅
- 32/32 accommodations implemented

Recommendations:
1. Add ASL video option for instructions (future feature)
2. Consider adding tactile feedback for haptic devices
3. Test with actual AAC devices (not just emulation)

Overall: APPROVED FOR BETA LAUNCH

Signature: _________________ Date: __________
```

#### Phase 4: Beta Family Testing (Week 4, 7 days)
**Testers**: 10 families with autistic children (ages 2-5)
**Duration**: 1 week
**Focus**: Real-world usability, engagement, learning outcomes

**Recruitment Criteria**:
- Diverse autism profiles (verbal, minimally verbal, non-verbal)
- Range of sensory needs (hyper/hypo-sensitive)
- Ages 2-5 years
- Parental consent + child assent
- Willing to provide daily feedback

**Data Collection**:
- Daily parent surveys (5 questions, 2 minutes)
- Session analytics (automatically logged)
- Video recordings (optional, with consent)
- Weekly interviews (15 minutes, virtual)

**Parent Survey Questions**:
1. Did your child complete the session? (Yes/No)
2. Approximate engagement level (1-5 scale)
3. Any frustration or distress? (Yes/No, describe)
4. Did you notice skill improvement? (Yes/No/Too early to tell)
5. Any technical issues? (Free text)

**Success Metrics** (Must Achieve to Launch):
- ✅ 80%+ session completion rate (not abandoned mid-game)
- ✅ 70%+ children show skill improvement after 3 sessions
- ✅ 85%+ parent satisfaction (4/5 or 5/5 rating)
- ✅ <10% technical issues (crashes, bugs)
- ✅ Zero safety concerns or adverse events

**Beta Test Results** (Simulated Example):
```
Beta Test Summary: Color Matching Puzzle
Test Period: October 20-27, 2025
Participants: 10 families, 12 children (2 families had siblings)

Completion Rate: 92% ✅
- 11/12 children completed majority of sessions
- 1 child struggled due to motor challenges (added switch access support)

Skill Improvement: 83% ✅
- 10/12 children showed measurable improvement (accuracy increased 15-40%)
- 2 children maintained baseline (were already proficient)

Parent Satisfaction: 91% ✅
- 9/10 families rated 4/5 or 5/5
- 1 family rated 3/5 (requested longer sessions, noted for future)

Technical Issues: 5% ✅
- 1 crash on older Android device (fixed)
- 1 audio sync issue on Safari (fixed)

Safety: 100% ✅
- Zero adverse events
- Zero reports of frustration/distress
- 3 families reported "calming effect" during gameplay

Qualitative Feedback:
- "My son loves the colors and sounds!"
- "Finally a game that actually teaches something!"
- "He's now identifying colors in real life - we're amazed!"
- "Wish there were more levels - he's already on level 8!"

Recommendation: APPROVED FOR PRODUCTION LAUNCH
```

### Bug Tracking & Prioritization

**Bug Severity Levels**:
- **P0 - Critical**: Crash, data loss, security vulnerability (fix immediately)
- **P1 - High**: Major feature broken, affects most users (fix within 24 hours)
- **P2 - Medium**: Minor feature issue, workaround exists (fix within 1 week)
- **P3 - Low**: Cosmetic issue, edge case (fix in next sprint)

**Example Bug Report**:
```
Bug ID: BUG-0042
Severity: P1 (High)
Status: Fixed
Reported By: Beta Tester #7
Date: October 23, 2025

Title: Objects sometimes disappear when dragged to edge of screen

Description:
When dragging an object to the very edge of the screen (within 10px
of border), the object sometimes disappears entirely and does not
return to original position. Child becomes confused and frustrated.

Steps to Reproduce:
1. Start Level 3
2. Drag red ball to far left edge of screen
3. Release touch
4. Object vanishes

Expected: Object should return to original position (elastic snap back)
Actual: Object disappears, child cannot complete level

Root Cause:
Boundary detection not accounting for object size. Rect transform
going off-canvas causing Unity to despawn object.

Fix Applied:
Added boundary clamping in DraggableObject.OnDrag():
rectTransform.anchoredPosition = ClampToCanvas(rectTransform.anchoredPosition);

Tested: 50 drag attempts to edge, zero disappearances
Deployed: October 24, 2025
```

---

## 11. POST-LAUNCH SUPPORT & ITERATION

### Week 1-2: Monitoring & Hotfixes

**Metrics Dashboard** (Real-Time):
- Crash rate: Target <0.1% sessions
- Load time p95: Target <3 seconds
- Completion rate: Target >80%
- Average accuracy: Monitor for unexpected drops
- Parent ratings: Target >4.2/5 average

**Daily Standup Checklist**:
- Review overnight crash reports (Sentry)
- Check analytics for engagement anomalies (Mixpanel)
- Read parent feedback submissions (Intercom)
- Identify any P0/P1 bugs
- Deploy hotfixes if needed

**Common Post-Launch Issues** (Anticipated):
| Issue | Likelihood | Mitigation |
|-------|-----------|------------|
| iOS Safari audio lag | High | Preload audio on touch event |
| Android low-end device frame drops | Medium | Add "performance mode" setting |
| Parent confusion about difficulty settings | Medium | Add onboarding tooltip |
| Children requesting more content | High | Tease "coming soon" games in UI |

### Month 2: Content Expansion

**Additional Features** (Based on Beta Feedback):
1. **More Levels**: Extend to Level 15 (currently 10)
   - Add metallic colors (gold, silver, copper)
   - Add gradient challenges (ombre sorting)
   - Estimated: 20 hours development

2. **Theme Customization**: Allow child to pick environment
   - Playroom, Garden, Space, Ocean (4 themes)
   - Saves engagement through novelty
   - Estimated: 40 hours development

3. **Progress Sharing**: Parent can share achievements via social media
   - "Emma mastered color matching!" with graphic
   - Increases viral growth
   - Estimated: 16 hours development

4. **Offline Mode**: Play without internet, sync when reconnected
   - Critical for families with limited data plans
   - Estimated: 32 hours development

### Month 3: Research & Validation

**Efficacy Study Design**:
- **Participants**: 100 children (50 experimental, 50 control)
- **Duration**: 6 weeks
- **Measure**: ABLLS-R B1-B3 pre-test and post-test
- **Hypothesis**: Children using game show 30% faster skill acquisition
- **Analysis**: Pre-registered, peer-reviewed publication target

**Outcome Goals**:
- Publish in *Journal of Applied Behavior Analysis*
- Present findings at ABAI conference
- Use data for marketing: "Clinically proven to accelerate learning"

---

## 12. APPENDICES

### Appendix A: Complete Skill Mapping Table

| ABLLS-R Skill | Code | Game Mechanic | Level Introduced | Mastery Criteria |
|---------------|------|---------------|------------------|------------------|
| Match identical colors (2 colors) | B1 | Drag red/blue to buckets | Level 1 | 90% accuracy, 3 sessions |
| Match identical colors (3 colors) | B2 | Add yellow bucket | Level 2 | 85% accuracy, 3 sessions |
| Match identical colors (4-6 colors) | B2 | Add green, orange, purple | Levels 4-6 | 85% accuracy, 3 sessions |
| Match identical colors (8+ colors) | B3 | Add pink, brown, gray, etc | Levels 7-10 | 80% accuracy, 3 sessions |
| Sort objects by color category | C12 | Distractor objects introduced | Level 3+ | 80% accuracy, sustained |
| Receptive color identification | G2 | Voice/AAC commands "Find red" | All levels | Follow instruction 80%+ |

### Appendix B: Voice-Over Script (Complete)

**[Full 200-line voice-over script would be here - including intro, play, feedback, completion, mastery, error redirect, encouragement, celebration lines in 3 voice variations]**

### Appendix C: Asset Delivery Checklist

**Art Assets** (Due: Week 2):
- [ ] 120 object sprites (PNG 512x512)
- [ ] 12 container sprites (PNG 400x400, 3 states each)
- [ ] 4 background scenes (PNG 1920x1080)
- [ ] 20 UI button icons (SVG vector)
- [ ] Character mascot (Spine 2D, 8 animations)
- [ ] Particle effects (PNG sprite sheets)

**Audio Assets** (Due: Week 2):
- [ ] 3 background music tracks (OGG, 2-3 min loop)
- [ ] 15 sound effects (OGG, <1 sec each)
- [ ] 150 voice-over lines (3 voices × 50 lines, WAV 48kHz)

**Technical Assets** (Due: Week 3):
- [ ] Unity project files
- [ ] Backend API integrated
- [ ] Database schema migrated
- [ ] CI/CD pipeline configured
- [ ] Analytics integrated

### Appendix D: Team Hours Breakdown

| Role | Team Member | Hours | Deliverables |
|------|-------------|-------|--------------|
| Game Designer | Sarah Chen | 24h | GDD, mechanics, balancing |
| Unity Developer | Marcus Lee | 96h | Full game implementation |
| 2D Artist | Aisha Patel | 48h | Objects, containers, UI |
| Animator | Jordan Kim | 32h | Character, feedback animations |
| Sound Designer | Taylor Brooks | 20h | Music, SFX, voice direction |
| Frontend Dev | Casey Wong | 40h | Web integration, UI polish |
| Backend Dev | Alex Rivera | 24h | API endpoints, data schema |
| BCBA Validation | Dr. Emily Foster | 12h | Clinical review, sign-off |
| SLP Review | Dr. James Liu | 4h | Communication aspects |
| OT Review | Dr. Sofia Rodriguez | 6h | Motor, sensory accommodations |
| QA Engineer | Morgan Taylor | 32h | Testing, bug tracking |
| Accessibility Specialist | Jamie Nguyen | 12h | WCAG audit, a11y implementation |
| **TOTAL** | | **350 hours** | Fully functional game |

**Timeline**: 4 weeks (Week 3 of Month 1)
**Budget** (if outsourcing): ~$35,000 at $100/hour average
**With In-House Team**: No additional cost (salaried)

---

## 13. SUCCESS CRITERIA & DEFINITION OF DONE

### Definition of Done (Before Launch)

**Technical**:
- ✅ Builds successfully for WebGL, iOS, Android (zero errors)
- ✅ Loads in <3 seconds on mid-tier devices (tested)
- ✅ Maintains 60fps during gameplay (profiled)
- ✅ Zero critical (P0) bugs, <5 minor (P2) bugs
- ✅ Passes automated test suite (100% pass rate)
- ✅ Backend API calls succeed >99.9% (load tested)
- ✅ Data correctly syncs to database (verified)

**Clinical**:
- ✅ 100% BCBA sign-off (written approval)
- ✅ SLP approval for language components
- ✅ OT approval for motor/sensory aspects
- ✅ Skills accurately map to ABLLS-R framework (validated)
- ✅ Mastery criteria scientifically sound (peer reviewed)

**Accessibility**:
- ✅ WCAG 2.1 Level AA compliant (zero violations)
- ✅ Screen reader functional (tested with NVDA, VoiceOver)
- ✅ Keyboard navigable (100% functionality)
- ✅ All 32 autism-specific accommodations implemented
- ✅ Colorblind modes functional (tested with simulators)

**User Experience**:
- ✅ Beta test completion rate >80%
- ✅ Parent satisfaction >85% (4/5 or 5/5 rating)
- ✅ Skill improvement visible in 70%+ children
- ✅ Zero adverse events (frustration, distress)
- ✅ Technical issues <10% of sessions

**Documentation**:
- ✅ GDD finalized and approved by PM
- ✅ Code documented (comments on complex functions)
- ✅ API documentation complete (Swagger/OpenAPI)
- ✅ Parent help guide written (in-app + PDF)
- ✅ Clinical rationale documented (for marketing)

### Post-Launch Success Metrics (Month 1)

**Engagement**:
- Target: 70%+ of children who start game complete at least 3 sessions
- Target: Average 8+ minutes per session (shows sustained interest)
- Target: 40%+ return within 24 hours (daily engagement)

**Learning Outcomes**:
- Target: 60%+ children show measurable skill improvement (accuracy increases)
- Target: 30%+ achieve mastery (80%+ accuracy) within 10 sessions
- Target: 80%+ parent-reported real-world generalization ("Uses colors at home")

**Technical Performance**:
- Target: <0.5% crash rate
- Target: p95 load time <3 seconds
- Target: 99.5%+ API success rate

**Business**:
- Target: 80%+ monthly retention (children play monthly)
- Target: NPS (Net Promoter Score) >50
- Target: <5% churn within first month

---

**Document Status**: ✅ **COMPLETE & READY FOR DEVELOPMENT**
**Approval Required From**:
- [ ] Senior Project Manager
- [ ] BCBA Clinical Lead
- [ ] Solution Architect
- [ ] Game Development Lead

**Next Steps**:
1. PM assigns tasks in project management tool (GitHub Projects)
2. Art team begins asset creation (Week 2)
3. Unity developer starts infrastructure setup (Week 2)
4. Clinical team reviews and approves GDD (Week 2)
5. Development sprint begins (Week 3)

---

**END OF GAME DESIGN DOCUMENT: COLOR MATCHING PUZZLE**
