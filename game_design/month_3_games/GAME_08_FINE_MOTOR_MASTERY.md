# Game Design Document: Fine Motor Mastery
## SkillBridge Educational Gaming Platform

**Game ID**: GAME-008
**Development Priority**: Month 3, Week 1-2
**Status**: Design Phase
**Document Version**: 1.0
**Last Updated**: October 13, 2025

---

## 1. GAME OVERVIEW

### Game Title
**Fine Motor Mastery: Daily Skills Adventure**

### High-Level Concept
An interactive occupational therapy game that teaches essential daily living fine motor skills through engaging simulations and practice activities. Children master critical self-care tasks (buttoning, zipping, tying shoelaces) and functional motor skills (cutting, tracing, pouring) in a safe, encouraging virtual environment. The game features realistic physics-based interactions, haptic feedback, and progressive difficulty to build muscle memory and motor coordination for real-world independence.

### Target Audience
- **Primary**: Autistic children ages 3-7
- **Difficulty Level**: 2-5 (Early learner to intermediate skills)
- **Prerequisites**:
  - Basic finger isolation (can point with index finger)
  - Visual tracking ability (follows objects with eyes)
  - Sustained attention of 5-8 minutes
  - Touch or switch access capability

### Core Learning Objectives

**Primary Skills** (AFLS - Assessment of Functional Living Skills):
- **AFLS-BA-38**: Buttons large buttons (1-inch diameter, 80% independence)
- **AFLS-BA-39**: Unbuttons large buttons (80% independence)
- **AFLS-BA-40**: Operates zippers (pull up/down with starter engaged, 75% independence)
- **AFLS-BA-41**: Fastens/unfastens hook-and-loop (Velcro) closures (90% independence)
- **AFLS-BA-42**: Snaps snap fasteners (large snaps, 70% independence)
- **AFLS-BA-45**: Ties shoelaces (bunny ears or standard knot, 60% independence by age 7)
- **AFLS-BA-28**: Uses scissors to cut paper (straight line, curved line, shapes)
- **AFLS-BA-29**: Traces lines and shapes (pre-writing skills)
- **AFLS-HLS-15**: Pours liquid from pitcher to cup (minimal spillage)
- **AFLS-BA-35**: Uses tweezers/pincer grasp for small object manipulation

**Secondary Skills** (Occupational Therapy Foundations):
- **Bilateral Coordination**: Using two hands together in coordinated manner
- **Hand-Eye Coordination**: Visual-motor integration for precise movements
- **Pincer Grasp**: Thumb-index finger opposition strength
- **In-Hand Manipulation**: Rotating, shifting objects within hand
- **Finger Isolation**: Moving individual fingers independently
- **Wrist Stability**: Maintaining wrist position during fine movements
- **Force Modulation**: Applying appropriate pressure (not too hard/soft)
- **Motor Planning**: Sequencing multi-step motor actions

**Functional Life Skills Impact**:
- Dressing independently (buttons, zippers, snaps on clothing)
- Shoe tying (critical for school participation)
- Scissor use (classroom activities, art, crafts)
- Writing readiness (pencil grip, line tracing)
- Self-feeding (pouring drinks, using utensils)
- Sensory bin exploration (tweezers for small objects)

### Game Duration
- **Per Session**: 8-12 minutes
- **Per Station**: 60-90 seconds
- **Total Stations**: 8 (can complete 4-6 per session)
- **Estimated Mastery Time**: 6-10 weeks (4-5 sessions/week)

### Critical Design Philosophy: Occupational Therapy-Driven

**OT Expert Collaboration** (Mandatory):
1. **Anatomically Accurate Movements**: Finger/hand positions must match real-world motor patterns
2. **Progressive Resistance**: Difficulty calibrated to build actual muscle strength
3. **Sensory Integration**: Haptic feedback, visual cues, auditory cues combined
4. **Error Tolerance**: Developmental expectations (3-year-old ≠ 7-year-old precision)
5. **Transfer to Real Life**: Game skills must generalize to physical objects

**OT Sign-Off Required**: All motor patterns validated by pediatric occupational therapist before development.

---

## 2. CLINICAL FRAMEWORK

### AFLS (Assessment of Functional Living Skills) Alignment

**Module: Basic Living Skills - Self-Care Domain**

| AFLS Code | Skill Description | Game Implementation | Target Mastery |
|-----------|-------------------|---------------------|----------------|
| **BA-38** | Buttons large buttons (1" diameter) | Button Station: Virtual shirt with 5 buttons | 80% success (4/5 correct) |
| **BA-39** | Unbuttons large buttons | Button Station: Unbuttoning mode | 80% success |
| **BA-40** | Pulls zipper up and down (starter engaged) | Zipper Station: Jacket zipper simulation | 75% success |
| **BA-41** | Fastens/unfastens hook-and-loop closures | Velcro Station: Shoe straps, jacket panels | 90% success (easiest skill) |
| **BA-42** | Snaps snap fasteners (large 1cm snaps) | Snap Station: Coat snaps, 3-5 snaps | 70% success |
| **BA-45** | Ties shoelaces (bow/bunny ears method) | Shoelace Station: Step-by-step tying | 60% success (complex!) |
| **BA-28** | Cuts with scissors (straight/curved lines) | Cutting Station: Paper with dotted lines | 75% accuracy |
| **BA-29** | Traces lines and shapes | Tracing Station: Pre-writing activities | 80% within boundaries |
| **HLS-15** | Pours liquid (pitcher to cup) | Pouring Station: Physics-based liquid | 70% no spillage |
| **BA-35** | Uses pincer grasp (tweezers/tongs) | Tweezers Station: Pick up small objects | 75% success |

**Baseline Assessment Protocol**:
- Pre-game: OT or parent completes AFLS-BA checklist (items 28-45)
- Placement algorithm:
  - 0-30% mastery → Start with Velcro, large buttons (Level 1)
  - 31-60% mastery → Start with zippers, snaps, cutting (Level 2)
  - 61%+ mastery → Start with shoelaces, tracing, tweezers (Level 3)

### Occupational Therapy Developmental Milestones

**Ages 3-4 (Early Skills)**:
- **Buttons**: 1-2 large buttons with adult assistance
- **Zippers**: Pulls zipper up/down (adult fastens starter)
- **Velcro**: Fastens/unfastens independently
- **Scissors**: Snips paper (single cuts)
- **Pouring**: Pours with two-hand support, some spillage OK

**Ages 4-5 (Emerging Independence)**:
- **Buttons**: 3-4 buttons independently on own clothing
- **Zippers**: Engages starter, zips up/down independently
- **Snaps**: Large snaps with some effort
- **Scissors**: Cuts along straight lines (6+ consecutive snips)
- **Tracing**: Traces thick vertical/horizontal lines
- **Pincer Grasp**: Uses tweezers for large beads (1cm+)

**Ages 5-6 (Functional Skills)**:
- **Buttons**: 5+ buttons quickly, small buttons emerging
- **Zippers**: All jacket zippers, backpack zippers
- **Snaps**: All snaps including smaller (0.5cm)
- **Scissors**: Cuts curved lines, simple shapes (circles, squares)
- **Tracing**: Traces diagonal lines, simple shapes
- **Pouring**: Pours accurately with one hand (small amounts)
- **Shoelaces**: Practices bunny ears method (may not master yet)

**Ages 6-7 (Mastery & Refinement)**:
- **Buttons**: All buttons including tiny shirt buttons
- **Shoelaces**: Ties independently using bunny ears or standard knot
- **Scissors**: Cuts complex shapes, cuts out pictures
- **Tracing**: Traces letters, numbers with good form
- **Pincer Grasp**: Uses tweezers for tiny objects (3mm beads)
- **Pouring**: Pours accurately from heavy pitcher

### Teaching Methodology (OT Evidence-Based Practices)

**1. Motor Learning Principles**

```
SKILL ACQUISITION STAGES:
1. Cognitive Stage (Understanding the task)
   - Watch video demonstration
   - Slow-motion breakdown of steps
   - Visual cues for hand placement

2. Associative Stage (Practicing the pattern)
   - Guided practice with gestural prompts
   - Immediate feedback on technique
   - Repetition with variation (different buttons, colors)

3. Autonomous Stage (Automatic execution)
   - Independent trials without prompts
   - Speed challenges (maintain accuracy)
   - Generalization to new contexts
```

**2. Multi-Sensory Cueing System**

```csharp
public class MultiSensoryFeedback
{
    // VISUAL: Color-coded finger positions
    private void ShowVisualCue(MotorAction action)
    {
        // Highlight where fingers should be placed
        // Example: Green circle shows "pinch here", yellow shows "pull here"
    }

    // HAPTIC: Vibration patterns (mobile/tablet controllers)
    private void ProvideHapticFeedback(MotorAction action, bool correct)
    {
        if (correct)
        {
            // Short, pleasant pulse (200ms, light intensity)
            Haptics.PlayPattern("success", intensity: 0.3f);
        }
        else
        {
            // Gentle double tap (not harsh, just "try again" cue)
            Haptics.PlayPattern("redirect", intensity: 0.2f);
        }
    }

    // AUDITORY: Real-world sounds
    private void PlayAudioCue(MotorAction action, bool correct)
    {
        if (correct)
        {
            // Real button "click", zipper "zzzzip", snap "pop"
            AudioManager.Play($"{action.type}_sound");
        }
    }
}
```

**3. Graduated Prompting System**

**Prompt Level 1: Full Physical Guidance** (Virtual hand-over-hand)
- Animated hand demonstrates exact movement
- Player's cursor/finger follows automatically
- Used for: Initial skill introduction (first 2-3 trials)

**Prompt Level 2: Gestural + Visual**
- Arrow shows direction to move
- Highlighted hotspot shows where to touch
- Used for: Learning phase (trials 4-10)

**Prompt Level 3: Verbal + Minimal Visual**
- Audio: "Pinch the button"
- Small indicator (no full highlight)
- Used for: Mastery phase (trials 11-20)

**Prompt Level 4: Independent**
- No prompts, child performs independently
- Tracks speed and accuracy
- Used for: Maintenance phase (trials 20+)

**4. Shaping & Successive Approximations**

```
EXAMPLE: Buttoning Progression

Week 1: Large 1.5" button + huge buttonhole (impossible to fail)
Week 2: Standard 1" button + large buttonhole
Week 3: Standard 1" button + normal buttonhole
Week 4: Smaller 0.75" button + normal buttonhole
Week 5: Multiple buttons in sequence (5 buttons on shirt)
Week 6: Speed challenge (button 5 buttons in under 60 seconds)
```

**5. Data Collection (Per Motor Trial)**

```json
{
  "trial_id": "FM-2025-001-0047",
  "station": "button_station",
  "AFLS_code": "BA-38",
  "timestamp": "2025-10-13T10:15:32Z",

  "motor_performance": {
    "completed": true,
    "time_seconds": 8.2,
    "accuracy_score": 0.85,
    "grip_strength": "appropriate",
    "hand_position": "correct_pincer_grasp",
    "attempts_needed": 2,
    "prompt_level": "gestural"
  },

  "physics_data": {
    "force_applied_newtons": 0.8,
    "pull_angle_degrees": 87,
    "steadiness_rating": "good",
    "bilateral_coordination": true
  },

  "skill_breakdown": {
    "finger_isolation": "success",
    "pincer_grasp": "success",
    "pull_through": "needed_retry",
    "button_hold": "success"
  }
}
```

### OT Clinical Input (Mandatory Review)

**Pediatric OT Validation Checklist**:
- [ ] Motor patterns match real-world movements (no "game shortcuts")
- [ ] Difficulty progression developmentally appropriate (3yo vs 7yo)
- [ ] Haptic feedback intensity appropriate (not overwhelming for sensory-sensitive children)
- [ ] Visual cues anatomically accurate (finger positions correct)
- [ ] Physics simulation realistic (button tension, zipper resistance)
- [ ] Transfer potential high (skills will generalize to real objects)
- [ ] Safety considerations (no frustration leading to tablet throwing)

**OT Sign-Off Required**: Cannot proceed to development without OT approval.

---

## 3. GAME MECHANICS

### Core Gameplay Loop

**Phase 1: Station Selection** (5-10 seconds)
```
1. Main hub: 8 activity stations arranged in circle
2. Visual: Each station shows icon + name + difficulty level
   - Button Station (⚫ 2/5 stars)
   - Zipper Station (⬆️ 2/5 stars)
   - Velcro Station (✋ 1/5 stars) - Easiest
   - Snap Station (❤️ 3/5 stars)
   - Shoelace Station (👟 5/5 stars) - Hardest
   - Cutting Station (✂️ 3/5 stars)
   - Tracing Station (✏️ 3/5 stars)
   - Pouring Station (🥤 3/5 stars)
   - Tweezers Station (🔧 4/5 stars)
3. Child selects station by tapping/clicking
4. Optional: Auto-select next recommended station (adaptive algorithm)
```

**Phase 2: Station Introduction** (5-10 seconds)
```
1. Zoom into selected station
2. Narrator: "Welcome to Button Station! Let's practice buttoning!"
3. Show goal: "Button 5 buttons to complete the activity"
4. Display expected time: "Most kids finish in 60-90 seconds"
5. Accessibility announcement: Full screen reader description
```

**Phase 3: Demonstration (Optional, First Visit Only)** (10-20 seconds)
```
1. Animated video: Real hands demonstrating skill
2. Slow motion: Breaks down into 3-4 steps
   Example for Buttoning:
   - Step 1: Pinch button between thumb and index finger
   - Step 2: Hold buttonhole fabric with other hand
   - Step 3: Push button through hole
   - Step 4: Pull button all the way through
3. Replay option available anytime
4. Skip option for returning players
```

**Phase 4: Guided Practice** (30-60 seconds)
```
IF: First time at station OR low skill level
   → Prompt Level 1-2 (Full guidance)
   → Visual overlays show finger placement
   → Animated helper hand demonstrates
   → Audio: "Pinch the button here"

ELSE IF: Returning player with some success
   → Prompt Level 3 (Minimal guidance)
   → Small visual cues only
   → Audio hints on demand

ELSE: Confident player
   → Prompt Level 4 (Independent)
   → No help unless requested
   → Timer displayed for speed tracking
```

**Phase 5: Active Motor Practice** (60-120 seconds per station)

*This is the core gameplay. Examples for each station:*

---

### Station 1: Button Station

**Visual Setup**:
- Virtual shirt displayed (bright colors, child-appealing design)
- 5 buttons arranged vertically (like real shirt)
- Buttonholes clearly visible
- Buttons: 1-inch diameter (developmentally appropriate for ages 3-5)

**Interaction**:
```
STEP 1: Select Button
- Player taps/drags button with finger (touch) or mouse
- Button highlights, physics engine activates
- Haptic: Light pulse on touch

STEP 2: Align with Buttonhole
- Player drags button toward corresponding buttonhole
- Visual aid: Dotted line shows path
- When close: Buttonhole glows green (target zone)

STEP 3: Push Through
- Player must apply pressure (press harder on screen, hold mouse button)
- Physics: Button compresses slightly, then pops through hole
- Audio: Satisfying "click" sound
- Haptic: Stronger pulse on success
- Animation: Button slides through, fabric shifts

STEP 4: Celebrate & Repeat
- Checkmark appears over completed button
- Progress: "1 of 5 buttons complete!"
- Move to next button
- After all 5: "Great job! You buttoned the whole shirt!"
```

**Physics Simulation**:
```csharp
public class ButtonPhysics : MonoBehaviour
{
    [Header("Button Properties")]
    public float buttonDiameter = 0.025f; // 1 inch in meters
    public float buttonThickness = 0.003f; // 3mm
    public float holeStretchResistance = 2.5f; // Force needed to push through

    [Header("Feedback Thresholds")]
    public float alignmentThreshold = 0.005f; // 5mm tolerance
    public float forceThreshold = 0.5f; // Newtons (gentle for kids)

    private bool isAligned = false;
    private float appliedForce = 0f;

    void Update()
    {
        // Check if button is aligned with buttonhole
        float distance = Vector3.Distance(button.position, buttonhole.position);
        isAligned = distance < alignmentThreshold;

        // Detect pressure/force from touch/click
        if (Input.touchPressure > 0)
        {
            appliedForce = Input.touchPressure * forceMultiplier;
        }
        else if (Input.GetMouseButton(0))
        {
            appliedForce = 1.0f; // Standard force for mouse
        }

        // Button through if aligned and enough force
        if (isAligned && appliedForce >= forceThreshold)
        {
            StartCoroutine(ButtonThrough());
        }
        else if (isAligned && appliedForce < forceThreshold)
        {
            // Visual cue: "Press harder!"
            ShowFeedback("Try pressing a bit harder!");
        }
    }

    IEnumerator ButtonThrough()
    {
        // Animate button sliding through buttonhole
        float progress = 0f;
        Vector3 startPos = button.position;
        Vector3 endPos = buttonhole.position + Vector3.forward * buttonThickness;

        while (progress < 1f)
        {
            progress += Time.deltaTime * 2f; // 0.5 second animation
            button.position = Vector3.Lerp(startPos, endPos, progress);

            // Haptic feedback during push
            if (progress == 0.5f) Haptics.Pulse(0.3f, 100);

            yield return null;
        }

        // Success feedback
        AudioManager.Play("button_click");
        Haptics.Pulse(0.5f, 200);
        ParticleEffects.PlayConfetti(button.position);

        RecordSuccess("BA-38", timeElapsed, attemptsNeeded);
    }
}
```

**Adaptive Difficulty**:
- **Level 1**: 1.5" buttons, huge buttonholes (impossible to miss)
- **Level 2**: 1" buttons (standard), large buttonholes
- **Level 3**: 1" buttons, normal buttonholes
- **Level 4**: 0.75" buttons (small), normal holes
- **Level 5**: 5 buttons in under 30 seconds (speed challenge)

---

### Station 2: Zipper Station

**Visual Setup**:
- Virtual jacket laid flat (colorful, child-friendly design)
- Zipper pull visible (large, easy to grab)
- Teeth of zipper clearly visible
- Zipper slider (the part that moves) highlighted

**Interaction**:
```
EASY MODE (Ages 3-4): Starter Already Engaged
- Player simply drags zipper pull upward
- Visual: Arrow shows "Pull up!"
- Track follows smoothly along teeth
- Audio: "Zzzzzzzip" sound as zipper moves
- Success: Jacket closes, "Great zipping!"

MEDIUM MODE (Ages 5-6): Engage Starter, Then Zip
- Step 1: Align zipper slider with bottom stop
- Step 2: Insert pin into slider (tap to insert)
- Step 3: Pull zipper up
- If misaligned: Visual feedback "Try again, line them up"

HARD MODE (Ages 6-7): Full Independence + Unzip/Re-Zip
- Unzip jacket first (pull down)
- Then re-zip (engage starter + pull up)
- Timed challenge: Complete in under 20 seconds
```

**Physics Simulation**:
```csharp
public class ZipperPhysics : MonoBehaviour
{
    public Transform zipperPull;
    public Transform zipperTrack;
    public float zipperLength = 0.3f; // 30cm jacket zipper

    private float zipperProgress = 0f; // 0 = bottom, 1 = top
    private bool starterEngaged = false;

    void Update()
    {
        if (!starterEngaged && difficulty >= 2)
        {
            // Player must align and engage starter
            CheckStarterAlignment();
        }
        else
        {
            // Player can now drag zipper up/down
            HandleZipperDrag();
        }
    }

    void CheckStarterAlignment()
    {
        // Check if pin is close enough to slider
        float distance = Vector3.Distance(pin.position, slider.position);

        if (distance < 0.01f) // 1cm tolerance
        {
            // Visual: Green glow
            slider.GetComponent<Renderer>().material.color = Color.green;

            // If player taps, engage
            if (Input.GetMouseButtonDown(0) || Input.touchCount > 0)
            {
                starterEngaged = true;
                AudioManager.Play("zipper_click");
                Haptics.Pulse(0.3f, 100);
            }
        }
        else
        {
            slider.GetComponent<Renderer>().material.color = Color.white;
        }
    }

    void HandleZipperDrag()
    {
        // Track finger/mouse position relative to zipper track
        Vector3 inputPos = GetInputWorldPosition();
        float dragAlongTrack = Vector3.Dot(inputPos - zipperTrack.position, zipperTrack.up);

        // Update zipper progress (0-1)
        zipperProgress = Mathf.Clamp01(dragAlongTrack / zipperLength);

        // Move zipper pull along track
        zipperPull.position = zipperTrack.position + zipperTrack.up * (zipperProgress * zipperLength);

        // Play continuous "zipping" sound
        if (zipperProgress != previousProgress)
        {
            AudioManager.PlayLooping("zipper_zip", volume: 0.5f);
            Haptics.Pulse(0.2f, 50); // Continuous light feedback
        }

        // Success if fully zipped (progress >= 0.95)
        if (zipperProgress >= 0.95f && !completed)
        {
            CompleteZipping();
        }
    }

    void CompleteZipping()
    {
        completed = true;
        AudioManager.Stop("zipper_zip");
        AudioManager.Play("success_chime");
        Haptics.Pulse(0.5f, 200);

        // Visual: Jacket closes with animation
        JacketVisualize.AnimateClose();

        RecordSuccess("BA-40", timeElapsed, attemptsNeeded);
    }
}
```

---

### Station 3: Shoelace Station (Most Complex!)

**Visual Setup**:
- Virtual shoe (bright colors, kid-friendly design)
- Two laces: Left (blue) and Right (red) for easy differentiation
- Step-by-step visual guide overlaid on shoe

**Interaction** (Bunny Ears Method):
```
STEP 1: Make First Loop ("Bunny Ear")
- Player drags blue lace to form loop
- System detects loop shape (must be closed circle)
- Visual: Blue loop glows when correct
- Audio: "Great! You made one bunny ear!"

STEP 2: Make Second Loop
- Player drags red lace to form second loop
- System checks: Both loops similar size
- Visual: Red loop glows when correct

STEP 3: Cross Loops
- Player drags one loop over the other
- System checks: Loops intersect correctly
- Visual: X appears where loops cross

STEP 4: Tuck and Pull
- Player drags one loop through hole created by cross
- System detects: Loop goes through opening
- Player pulls both loops (drag outward motion)
- Audio: "Pull tight!"

STEP 5: Verify Knot
- System checks knot tightness (loops still intact, no slippage)
- Visual: Green checkmark if successful
- If failed: Animated replay shows where it went wrong
```

**Physics Simulation** (Most Complex!):
```csharp
public class ShoelacePhysics : MonoBehaviour
{
    [Header("Lace Properties")]
    public LineRenderer blueL ace;
    public LineRenderer redLace;
    public int laceSegments = 20; // Smooth curve

    [Header("Knot Detection")]
    private List<Vector3> blueLoopPoints = new List<Vector3>();
    private List<Vector3> redLoopPoints = new List<Vector3>();
    private bool loopsCreated = false;
    private bool loopsCrossed = false;

    void Update()
    {
        // Track lace positions as player drags
        UpdateLacePhysics();

        // Check for loop formation
        if (!loopsCreated)
        {
            DetectLoops();
        }
        else if (!loopsCrossed)
        {
            DetectLoopCross();
        }
        else
        {
            DetectTuckAndPull();
        }
    }

    void DetectLoops()
    {
        // Check if blue lace forms closed loop
        bool blueLoopClosed = IsLoopClosed(blueLace.GetPositions());
        bool redLoopClosed = IsLoopClosed(redLace.GetPositions());

        if (blueLoopClosed && redLoopClosed)
        {
            loopsCreated = true;
            AudioManager.Play("loop_success");
            ShowFeedback("Great! Now cross the bunny ears!");
        }
    }

    bool IsLoopClosed(Vector3[] points)
    {
        // Check if start and end points are close (closed loop)
        float distance = Vector3.Distance(points[0], points[points.Length - 1]);
        return distance < 0.02f; // 2cm tolerance
    }

    void DetectLoopCross()
    {
        // Check if the two loops intersect
        Vector3 intersectionPoint;
        bool intersects = LineIntersection(blueLoopPoints, redLoopPoints, out intersectionPoint);

        if (intersects)
        {
            loopsCrossed = true;
            AudioManager.Play("cross_success");

            // Highlight intersection point
            SpawnVisualMarker(intersectionPoint, Color.yellow);
            ShowFeedback("Perfect! Now tuck one loop through!");
        }
    }

    void DetectTuckAndPull()
    {
        // Complex: Check if one loop passes through opening
        // Simplified: Check if loop position moved through intersection zone

        bool blueTucked = CheckLoopTucked(blueLoopPoints, intersectionZone);
        bool pulled = CheckBothLoopsPulled();

        if (blueTucked && pulled)
        {
            CompleteKnot();
        }
    }

    void CompleteKnot()
    {
        // Verify knot integrity
        bool knotTight = VerifyKnotTightness();

        if (knotTight)
        {
            AudioManager.Play("success_fanfare");
            Haptics.Pulse(0.7f, 300);
            ParticleEffects.PlayFireworks(shoe.position);

            ShowFeedback("AMAZING! You tied your shoe!");
            RecordSuccess("BA-45", timeElapsed, attemptsNeeded);

            // Award bonus points (hardest skill!)
            PlayerDataManager.Instance.AddStars(5);
        }
        else
        {
            ShowFeedback("Almost! Try pulling the loops tighter.");
        }
    }
}
```

**Adaptive Difficulty**:
- **Level 1**: Guided mode (each step prompted, can't proceed until correct)
- **Level 2**: Hints available (player can ask for help anytime)
- **Level 3**: Independent (no prompts, just success/fail)
- **Level 4**: Speed challenge (tie correctly in under 60 seconds)
- **Level 5**: Real-world practice mode (switch to actual shoe after mastery!)

---

### Station 4: Cutting Station

**Visual Setup**:
- Virtual paper sheet (white or colored)
- Dotted line path (straight, curved, or shape outline)
- Scissors (animated, follows finger/mouse)
- Hand position guide (shows proper thumb/finger placement)

**Interaction**:
```
GRIP PHASE:
- Two finger holes visible on scissors
- Visual: "Put thumb here (green), fingers here (blue)"
- Player must position touch points correctly
- Haptic: Pulse when fingers correctly placed

CUTTING PHASE:
- Player drags scissors along dotted line
- System tracks: Position accuracy, speed, steadiness
- Audio: Realistic "snip snip" sound with each cut
- Visual: Paper separates along cut line
- If too far from line: Visual "Oops! Try to stay on the line"

SUCCESS CRITERIA:
- 75% of cut within 1cm of dotted line
- Smooth motion (no jerky movements)
- Appropriate speed (not too fast/slow)
```

**Physics Simulation**:
```csharp
public class ScissorsPhysics : MonoBehaviour
{
    public Transform scissors;
    public LineRenderer cuttingPath;
    public GameObject paper;

    private List<Vector3> cutPoints = new List<Vector3>();
    private float deviationFromLine = 0f;

    void Update()
    {
        // Track scissors position along paper
        Vector3 scissorsPos = scissors.position;

        // Project onto paper plane
        Vector3 cutPosition = ProjectOntoPlane(scissorsPos, paper.transform);

        // If player is "cutting" (holding mouse/touch)
        if (Input.GetMouseButton(0) || Input.touchCount > 0)
        {
            // Record cut position
            cutPoints.Add(cutPosition);

            // Check deviation from target line
            float distance = DistanceToTargetLine(cutPosition);
            deviationFromLine += distance;

            // Visual feedback
            if (distance < 0.01f) // Within 1cm
            {
                // Good cut: Green trail
                cuttingPath.startColor = Color.green;
            }
            else
            {
                // Off-track: Yellow trail
                cuttingPath.startColor = Color.yellow;
            }

            // Audio: Cutting sound
            if (cutPoints.Count % 5 == 0) // Every 5 points
            {
                AudioManager.Play("scissors_snip");
                Haptics.Pulse(0.2f, 50);
            }

            // Visual: Separate paper along cut
            SeparatePaperMesh(cutPosition);
        }

        // Check if cutting complete
        if (cutPoints.Count > 50 && ReachedEndOfLine())
        {
            EvaluateCut();
        }
    }

    void EvaluateCut()
    {
        // Calculate accuracy
        float avgDeviation = deviationFromLine / cutPoints.Count;
        float accuracy = 1f - Mathf.Clamp01(avgDeviation / 0.02f); // 2cm max deviation

        if (accuracy >= 0.75f)
        {
            AudioManager.Play("success_chime");
            ShowFeedback($"Great cutting! {accuracy * 100:F0}% accuracy!");
            RecordSuccess("BA-28", timeElapsed, accuracy);
        }
        else
        {
            ShowFeedback("Good try! Let's practice staying on the line.");
            RecordAttempt("BA-28", false);
        }
    }
}
```

---

### Station 5: Tracing Station

**Visual Setup**:
- Large worksheet with dotted line path (shape, letter, or pattern)
- Virtual crayon/pencil (bright colors, fun designs)
- Starting point clearly marked (green dot)
- Ending point marked (star)

**Interaction**:
```
TRACE PHASE:
- Player drags finger/mouse from start to end
- System tracks: Path accuracy, smoothness, speed
- Visual: Line appears behind finger in bright color
- Audio: Gentle "swoosh" sound while tracing
- If going outside boundaries: Visual "wobble" effect

SUCCESS CRITERIA:
- 80% of trace within boundary lines (5mm tolerance)
- Smooth motion (no excessive shakiness)
- Start and end points reached
```

**Progressive Shapes**:
- **Level 1**: Straight lines (vertical, horizontal)
- **Level 2**: Diagonal lines, L-shapes
- **Level 3**: Curves, circles
- **Level 4**: Complex shapes (squares, triangles, stars)
- **Level 5**: Letters (starting with A, B, C)

---

### Station 6: Pouring Station

**Visual Setup**:
- Pitcher filled with colored liquid (juice, water)
- Empty cup on table
- Visual guides: Dotted line shows pour trajectory

**Interaction**:
```
LIFT PHASE:
- Player taps pitcher to "grab" it
- Drag upward to lift
- Haptic: Vibration simulates weight

TILT PHASE:
- Player rotates device or drags to tilt pitcher
- Liquid simulation: Fluid pours out in real-time
- Visual: Liquid level lowers in pitcher, rises in cup

POURING PHASE:
- Player must maintain angle (45-60 degrees)
- Too steep: "Slow down! Pouring too fast!"
- Too shallow: "Tilt a bit more to pour"

SUCCESS CRITERIA:
- 70% of liquid lands in cup (minimal spillage)
- Cup filled to target line (not overfilled)
```

**Physics Simulation** (Liquid):
```csharp
public class PouringPhysics : MonoBehaviour
{
    public Transform pitcher;
    public Transform cup;
    public ParticleSystem liquidParticles;

    private float pitcherVolume = 500f; // 500ml
    private float cupVolume = 0f;
    private float spilledVolume = 0f;

    void Update()
    {
        // Check pitcher tilt angle
        float tiltAngle = Vector3.Angle(pitcher.up, Vector3.up);

        if (tiltAngle > 45f && pitcherVolume > 0)
        {
            // Start pouring
            float pourRate = (tiltAngle - 45f) / 45f; // 0-1 based on tilt
            float volumePoured = pourRate * 50f * Time.deltaTime; // ml per second

            // Update volumes
            pitcherVolume -= volumePoured;

            // Check if liquid lands in cup
            Vector3 pourOrigin = pitcher.transform.Find("Spout").position;
            Vector3 cupCenter = cup.position;
            float distance = Vector3.Distance(pourOrigin, cupCenter);

            if (distance < 0.1f) // Within 10cm of cup
            {
                // Landing in cup
                cupVolume += volumePoured;
                AudioManager.Play("liquid_pour", volume: 0.5f);
            }
            else
            {
                // Spilled
                spilledVolume += volumePoured;
                AudioManager.Play("liquid_splash", volume: 0.3f);

                // Visual: Spillage on table
                SpawnSpillDecal(pourOrigin);
            }

            // Particle effect for liquid stream
            liquidParticles.Emit((int)(volumePoured * 10));
        }

        // Check for completion
        if (cupVolume >= 200f && cupVolume <= 250f) // Target range
        {
            CompletePour();
        }
        else if (cupVolume > 250f)
        {
            ShowFeedback("Oops! You overfilled the cup. Try again!");
        }
    }

    void CompletePour()
    {
        float accuracy = 1f - (spilledVolume / 500f); // 0-1 based on spillage

        if (accuracy >= 0.7f)
        {
            AudioManager.Play("success_chime");
            ShowFeedback($"Great pouring! Only {spilledVolume:F0}ml spilled!");
            RecordSuccess("HLS-15", timeElapsed, accuracy);
        }
        else
        {
            ShowFeedback("Good try! Let's practice pouring more carefully.");
        }
    }
}
```

---

### Station 7: Tweezers Station

**Visual Setup**:
- Sensory bin filled with colorful beads (various sizes)
- Target container (bowl or jar)
- Virtual tweezers (opens/closes based on input)

**Interaction**:
```
GRIP PHASE:
- Player pinches screen (two-finger gesture) or clicks mouse
- Tweezers close proportionally to pinch pressure
- Visual: Tweezers close, shows grip strength meter

PICK-UP PHASE:
- Position tweezers over bead
- Close tweezers around bead
- If grip too weak: Bead falls
- If grip too strong: Bead shoots away (crushed)
- Proper grip: Bead lifts up

TRANSFER PHASE:
- Player drags tweezers (with bead) to target container
- Bead must stay in tweezers (steady hand required)
- If too shaky: Bead falls

RELEASE PHASE:
- Player opens tweezers (releases pinch)
- Bead drops into container
- Audio: "Plink!" sound

SUCCESS CRITERIA:
- 75% of beads successfully transferred (15/20 beads)
- Appropriate force modulation (not too hard/soft)
```

---

### Station 8: Snap/Velcro Station

**Snap Interaction**:
```
- Player aligns snap halves (male/female parts)
- Visual: Green glow when aligned
- Player presses down firmly
- Haptic: Strong pulse on successful snap
- Audio: Satisfying "SNAP!" sound
```

**Velcro Interaction**:
```
FASTENING:
- Player drags hook side to loop side
- When close: Magnetic attraction (simulated)
- Audio: "Riiiiip" sound when pressing together
- Easiest station (confidence builder!)

UNFASTENING:
- Player pulls apart (drag gesture)
- Requires firm pull (force threshold)
- Audio: Loud "RRRRRIP!" tearing sound
- Haptic: Vibration during pull
```

---

**Phase 6: Immediate Feedback & Data Recording** (2-5 seconds)
```
SUCCESSFUL COMPLETION:
- Visual: Green checkmark, star burst animation
- Audio: Success chime specific to station
- Haptic: Celebratory pulse pattern
- Narrator: "Great job! You completed [station name]!"
- Data saved: Time, accuracy, attempts, prompt level
- Stars awarded: +3 stars

NEEDS IMPROVEMENT:
- Visual: Yellow "Try Again" icon (not red, not harsh)
- Audio: Gentle redirect tone
- Haptic: Double tap (redirect, not failure)
- Narrator: "Let's try again! You can do it!"
- Offer replay demonstration
- Data saved: Attempt marked as "needs practice"
```

**Phase 7: Return to Hub** (3 seconds)
```
1. Station completion summary displays:
   - Time: "You finished in 45 seconds!"
   - Accuracy: "85% accuracy!"
   - Stars earned: "+3 stars"
2. Skill progress indicator updates
3. Return to main hub (8 stations visible)
4. Next recommendation: "Try Zipper Station next!"
```

### Controls & Interaction

**Input Methods**:
1. **Touchscreen** (Primary - Tablet/iPad):
   - Single finger drag: Move objects
   - Two-finger pinch: Tweezers, grip strength
   - Press harder: Force modulation (buttons, snaps)
   - Tilt device: Pouring station

2. **Mouse/Trackpad**:
   - Click and drag: All movements
   - Hold click: Apply pressure
   - Scroll wheel: Tilt/rotate (pouring, cutting)

3. **Stylus/Apple Pencil**:
   - Precise tracing for cutting/tracing stations
   - Pressure sensitivity for force modulation

4. **Switch Access** (Accessibility):
   - Single switch: Step through action sequence
   - Dual switch: Select + activate
   - Auto-scanning mode with dwell time

5. **Eye Gaze** (Advanced Accessibility):
   - Dwell selection (2 seconds) to grab objects
   - Gaze tracking for dragging (experimental)

**Accessibility Settings**:
- **Touch target size**: 150px (default) up to 300px (motor impairment)
- **Force sensitivity**: Adjustable pressure thresholds (gentle to firm)
- **Time limits**: None (self-paced) or optional timed challenges
- **Visual supports**: Show/hide finger position guides
- **Haptic intensity**: 0-100% or disable entirely
- **Audio volume**: Independent control per category (narrator, effects, music)

---

## 4. PROGRESSION & ADAPTIVE DIFFICULTY

### Skill-Based Adaptive System

```csharp
public class FineMotorAdaptiveDifficulty
{
    private Dictionary<string, SkillProgress> skillProgress = new Dictionary<string, SkillProgress>();

    public class SkillProgress
    {
        public string AFLS_code;
        public int totalAttempts;
        public int successfulAttempts;
        public float currentAccuracy;
        public int currentDifficultyLevel; // 1-5
        public DateTime lastPracticed;
    }

    public DifficultyAdjustment EvaluatePerformance(string AFLS_code, bool success, float accuracy)
    {
        var skill = skillProgress[AFLS_code];
        skill.totalAttempts++;

        if (success)
        {
            skill.successfulAttempts++;
            skill.currentAccuracy = (float)skill.successfulAttempts / skill.totalAttempts;

            // Check for mastery (increase difficulty)
            if (skill.currentAccuracy >= 0.85f && skill.totalAttempts >= 10)
            {
                if (skill.currentDifficultyLevel < 5)
                {
                    skill.currentDifficultyLevel++;
                    return DifficultyAdjustment.IncreaseDifficulty;
                }
                else
                {
                    return DifficultyAdjustment.SkillMastered;
                }
            }
        }
        else
        {
            // Check if struggling (decrease difficulty or add support)
            skill.currentAccuracy = (float)skill.successfulAttempts / skill.totalAttempts;

            if (skill.currentAccuracy < 0.50f && skill.totalAttempts >= 5)
            {
                return DifficultyAdjustment.AddPrompts;
            }
        }

        return DifficultyAdjustment.None;
    }

    public enum DifficultyAdjustment
    {
        None,
        AddPrompts,           // Increase prompting level
        SimplifyTask,         // Make task easier (larger buttons, etc.)
        IncreaseDifficulty,   // Make task harder (smaller buttons, speed challenge)
        SkillMastered,        // Celebrate mastery, unlock next skill
        AddVariation          // Same difficulty, different context
    }
}
```

### Progressive Difficulty Tiers

#### **Tier 1: Foundation (Ages 3-4)**
**Focus**: Large targets, high success rate (90%+), confidence building

**Stations Available**:
- ✅ Velcro Station (Easiest!)
- ✅ Button Station (1.5" buttons)
- ✅ Zipper Station (pre-engaged starter)
- ✅ Cutting Station (straight lines only, thick dotted lines)

**Prompting**: Full guidance (Level 1-2 prompts)
**Time Limits**: None (self-paced)
**Success Threshold**: 2/3 correct = advance

---

#### **Tier 2: Building Skills (Ages 4-5)**
**Focus**: Standard-sized targets, independence emerging (75%+ success)

**Stations Available**:
- ✅ All Tier 1 stations (harder versions)
- ✅ Snap Station (large 1cm snaps)
- ✅ Pouring Station (small pitcher, wide cup)
- ✅ Tracing Station (straight/curved lines)

**Prompting**: Gestural prompts (Level 2-3)
**Time Limits**: Optional (recommended 60-90 seconds)
**Success Threshold**: 3/4 correct = advance

---

#### **Tier 3: Functional Skills (Ages 5-6)**
**Focus**: Real-world complexity, multiple steps (70%+ success)

**Stations Available**:
- ✅ All Tier 2 stations (standard difficulty)
- ✅ Shoelace Station (bunny ears method, full guidance)
- ✅ Tweezers Station (medium beads, 1cm)
- ✅ Cutting Station (curved lines, simple shapes)

**Prompting**: Minimal (Level 3, hints on request)
**Time Limits**: Encouraged (promotes fluency)
**Success Threshold**: 7/10 correct = advance

---

#### **Tier 4: Mastery (Ages 6-7)**
**Focus**: Speed, precision, independence (80%+ success)

**Stations Available**:
- ✅ All previous stations (hardest versions)
- ✅ Shoelace Station (independent, no prompts)
- ✅ Tweezers Station (tiny beads, 3mm)
- ✅ Cutting Station (complex shapes, pictures)
- ✅ Tracing Station (letters, numbers)

**Prompting**: Independent (Level 4, no prompts)
**Time Limits**: Speed challenges unlocked
**Success Threshold**: 8/10 correct = mastery

---

#### **Tier 5: Expert Challenges (Ages 7+)**
**Focus**: Real-world readiness, timed challenges, competitive mode

**Challenges**:
- ⚡ Speed Buttoning: 5 buttons in under 30 seconds
- ⚡ Shoelace Sprint: Tie both shoes in under 90 seconds
- ⚡ Precision Cutting: Cut complex pattern with 90%+ accuracy
- ⚡ Perfect Pouring: Pour 3 cups with <5% spillage
- ⚡ Tracing Mastery: Write your name in cursive

**Prompting**: None (fully independent)
**Time Limits**: All challenges timed
**Success Threshold**: Beat your personal best!

---

### Reinforcement Schedule

**Immediate Reinforcement** (Every Successful Trial):
- Visual: Checkmark, star animation
- Audio: Station-specific success sound
- Haptic: Satisfying pulse
- Narrator praise: "Great job!"

**Token Economy**:
- +3 stars per station completion
- +5 stars for mastery (all 5 difficulty levels)
- +10 stars for Tier 5 challenges

**Star Rewards**:
- 25 stars: Unlock new shirt/jacket colors (customization)
- 50 stars: Unlock new scissors designs
- 100 stars: Unlock multiplayer co-op mode (coming soon)
- 200 stars: Certificate of Motor Mastery (printable!)

**Variable Ratio Reinforcement**:
- Not every success gets verbal praise (avoid satiation)
- VR-3 average: Praise on 1st, 3rd, 6th, 8th... successes
- Special animations: Every 5th success gets bonus animation

---

## 5. VISUAL & AUDIO DESIGN

### Visual Assets Required

#### **3D Models (Unity Assets)**

**Clothing Items**:
```
SHIRT (Button Station):
- 5 models: Different colors (red, blue, green, yellow, purple)
- Buttons: 5 per shirt, various sizes (0.75" to 1.5")
- Poly count: <5000 triangles (mobile-optimized)
- Textures: 1024×1024 diffuse, normal, specular

JACKET (Zipper Station):
- 5 models: Different styles (hoodie, coat, vest)
- Zipper: Animated teeth, movable pull
- Materials: Fabric shader (realistic cloth)

SHOE (Shoelace Station):
- 3 models: Sneaker, boot, dress shoe
- Laces: Physics-based rope simulation
- Colors: Red, blue, black, white laces
```

**Tools & Objects**:
```
SCISSORS:
- 3 designs: Child-safe (rounded), standard, fancy (decorative)
- Animated: Blades open/close
- Hand guides: Transparent finger holes showing grip

TWEEZERS:
- 2 types: Straight, angled
- Animated: Open/close based on pinch input
- Metallic shader (realistic reflection)

PITCHER & CUP:
- Pitcher: 500ml capacity, transparent to show liquid level
- Cup: 250ml, various colors
- Liquid: Shader with realistic flow simulation

BEADS (Tweezers Station):
- Sizes: Small (3mm), Medium (1cm), Large (2cm)
- Colors: 10 colors (rainbow + metallic)
- Materials: Glossy plastic shader
```

**Environments**:
```
MAIN HUB:
- Circular room with 8 stations arranged around perimeter
- Each station: Podium with icon, name, difficulty stars
- Lighting: Bright, cheerful (warm color temperature)
- Background: Soft gradient (calming colors)

STATION ENVIRONMENTS:
- Simple, distraction-free backgrounds
- Neutral colors (white, light blue, beige)
- Soft shadows (depth without visual clutter)
- UI elements: Clear, high contrast
```

#### **UI Elements**

**HUD (Heads-Up Display)**:
```
- Top Left: Timer (optional, can disable)
- Top Right: Star count + progress bar
- Bottom Center: Current task instruction
- Bottom Right: Hint button (animated pulsing if available)
```

**Visual Prompts**:
```
- Finger position guides: Transparent hand overlays (green = correct, yellow = adjust)
- Dotted line paths: Movement guidance (cutting, tracing)
- Glow effects: Target areas (green = go, yellow = caution, red = stop)
- Arrows: Directional cues (pull up, push down, drag left)
```

**Feedback Animations**:
```
- Success: Green checkmark + sparkle particles (2 second loop)
- Retry: Yellow question mark + gentle bounce
- Mastery: Gold trophy + fireworks + confetti
- Progress: Filling progress bar with color gradient
```

### Audio Assets

#### **Voice-Over (Narrator - Child-Friendly Voice)**

**Station Introductions** (10 recordings):
```
- "Welcome to Button Station! Let's practice buttoning!"
- "Time for Zipper Station! Can you zip this jacket?"
- "Shoelace Station is challenging! Let's tie those laces!"
- ... (8 stations total, plus 2 hub prompts)
```

**Instructional Prompts** (50+ recordings):
```
BUTTON STATION:
- "Pinch the button between your thumb and finger"
- "Line up the button with the buttonhole"
- "Push the button through - you can do it!"
- "Great! Now pull it all the way through"

ZIPPER STATION:
- "Grab the zipper pull"
- "Pull up to zip the jacket"
- "Nice and steady - keep going!"

SHOELACE STATION:
- "Make a loop with the blue lace"
- "Now make a loop with the red lace"
- "Cross the bunny ears"
- "Tuck one ear through the hole"
- "Pull tight!"

GENERAL:
- "Try again! You're learning!"
- "That's it! Perfect!"
- "Almost there - keep going!"
```

**Feedback Prompts** (30 recordings):
```
POSITIVE:
- "Excellent work!"
- "You're getting so good at this!"
- "Wow! That was fast!"
- "Perfect! You mastered [skill]!"

REDIRECTING (Gentle, Never Harsh):
- "Let's try that again together"
- "Almost! Try pushing a bit harder"
- "Hmm, let's line it up better"
- "Good try! Watch the demonstration again?"
```

**Recording Specifications**:
- Format: WAV 48kHz 16-bit mono
- Voice: Child actor (age 8-10) or warm adult voice
- Tone: Encouraging, patient, friendly
- Processing: Light compression, normalize -3dB
- Export: OGG Vorbis (WebGL), AAC (mobile)

#### **Sound Effects**

**Station-Specific Sounds** (Realistic):
```
BUTTON:
- "button_click.wav": Satisfying snap when button goes through hole (300ms)

ZIPPER:
- "zipper_zip.wav": Continuous "zzzzip" sound while dragging (looping)
- "zipper_click.wav": Click when starter engages (100ms)

SNAP:
- "snap_pop.wav": Loud, satisfying "POP!" when snap closes (200ms)

VELCRO:
- "velcro_rip.wav": Tearing sound when pulling apart (500ms)
- "velcro_press.wav": Muted rustling when pressing together (300ms)

SCISSORS:
- "scissors_snip.wav": Cutting sound (150ms, varies in pitch)

SHOELACE:
- "lace_swish.wav": Soft fabric sound when manipulating (200ms)

POURING:
- "liquid_pour.wav": Trickling water sound (looping)
- "liquid_splash.wav": Splash when spilling (300ms)

TWEEZERS:
- "tweezers_pinch.wav": Metallic click when closing (100ms)
- "bead_drop.wav": Light "plink" when bead drops (150ms)
```

**UI Sounds**:
```
- "success_chime.wav": Cheerful ascending notes (C-E-G major chord, 500ms)
- "retry_tone.wav": Neutral "hmm" tone (not harsh, 300ms)
- "star_collect.wav": Sparkle sound (200ms)
- "button_tap.wav": UI button press (soft tap, 100ms)
- "level_up.wav": Triumphant fanfare (2 seconds)
```

**Audio Specifications**:
- All SFX: <500KB each
- No sudden loud noises (WCAG guideline: <85dB equivalent)
- Adjustable volume per category (narrator, SFX, music)
- Mute option available (sensory accommodation)

#### **Background Music**

**Track 1: "Motor Skills Journey"** (Main Hub)
```
- Instruments: Xylophone, acoustic guitar, light percussion
- Tempo: 100 BPM (moderate, not rushed)
- Duration: 3:00 loop
- Mood: Encouraging, playful, patient
- Key: C Major (bright, positive)
```

**Track 2: "Focus Time"** (During Stations)
```
- Instruments: Piano, soft strings, light bells
- Tempo: 80 BPM (calm, focused)
- Duration: 4:00 loop
- Mood: Concentrated, supportive, gentle
- Key: G Major (warm, stable)
```

**Track 3: "Mastery Celebration"** (Skill Mastered)
```
- Instruments: Full orchestra, brass fanfare
- Tempo: 120 BPM (exciting!)
- Duration: 30 seconds (short celebration)
- Mood: Triumphant, joyful, proud
```

**Music Specifications**:
- LUFS: -18 (very quiet background presence, won't distract)
- Seamless loops (crossfade transitions)
- Mute option (some autistic children prefer silence)
- Volume independent from SFX/voice

---

## 6. TECHNICAL IMPLEMENTATION

### Unity Architecture

```csharp
// ==========================================
// FINE MOTOR MASTERY GAME MANAGER
// ==========================================
using UnityEngine;
using System.Collections.Generic;
using System.Linq;

public class FineMotorMasteryManager : MonoBehaviour
{
    [Header("Game Configuration")]
    public int currentTier = 1; // 1-5 difficulty tiers
    public StationDatabase stationDatabase;
    public FineMotorAdaptiveDifficulty adaptiveSystem;

    [Header("Current Session")]
    private SessionData currentSession;
    private List<StationAttempt> sessionAttempts = new List<StationAttempt>();
    private int stationsCompletedThisSession = 0;

    [Header("UI References")]
    public StationSelectorUI stationSelector;
    public HUDManager hudManager;
    public FeedbackUI feedbackUI;
    public HapticFeedbackController haptics;

    void Start()
    {
        InitializeSession();
        LoadMainHub();
    }

    void InitializeSession()
    {
        currentSession = new SessionData
        {
            sessionId = System.Guid.NewGuid().ToString(),
            gameId = "fine_motor_mastery_v1",
            userId = PlayerDataManager.Instance.CurrentUserId,
            timestampStart = System.DateTime.UtcNow,
            currentTier = currentTier
        };

        adaptiveSystem = new FineMotorAdaptiveDifficulty();
        adaptiveSystem.LoadProgress(currentSession.userId);
    }

    void LoadMainHub()
    {
        // Display 8 station icons in circular arrangement
        stationSelector.DisplayStations(stationDatabase.GetAvailableStations(currentTier));

        // Accessibility announcement
        AccessibilityManager.Instance.Announce("Main Hub. Choose a station to practice your skills.");
    }

    public void OnStationSelected(StationType stationType)
    {
        // Load selected station
        StationData station = stationDatabase.GetStation(stationType, currentTier);
        StartStation(station);
    }

    async void StartStation(StationData station)
    {
        // Introduction
        await PlayNarration(station.introNarration);

        // Show demonstration (first visit only)
        if (station.isFirstVisit)
        {
            bool skipDemo = await ShowDemonstration(station);
            if (!skipDemo)
            {
                // Player watched demo, mark as not first visit
                station.isFirstVisit = false;
            }
        }

        // Determine prompting level based on skill progress
        PromptLevel promptLevel = adaptiveSystem.GetRecommendedPromptLevel(station.AFLS_code);

        // Start station activity
        await RunStation(station, promptLevel);
    }

    async UniTask RunStation(StationData station, PromptLevel promptLevel)
    {
        float startTime = Time.time;
        int attemptsNeeded = 0;
        bool completed = false;

        // Instantiate station-specific controller
        BaseStationController stationController = InstantiateStationController(station.type);
        stationController.Initialize(station, promptLevel);

        // Run station until completion or exit
        while (!completed)
        {
            attemptsNeeded++;

            // Wait for player to complete motor task
            MotorTaskResult result = await stationController.WaitForCompletion();

            if (result.success)
            {
                // Success feedback
                completed = true;
                await ProvideFeedback_Success(station, result);

                // Record data
                RecordStationAttempt(station, result, Time.time - startTime, attemptsNeeded, promptLevel);

                // Check for difficulty adjustment
                var adjustment = adaptiveSystem.EvaluatePerformance(station.AFLS_code, true, result.accuracy);
                await HandleDifficultyAdjustment(adjustment, station);
            }
            else
            {
                // Gentle redirect
                await ProvideFeedback_Retry(station, result);

                // Check if player needs more support
                if (attemptsNeeded >= 3)
                {
                    // Offer demonstration replay or increase prompting
                    bool replayDemo = await OfferDemonstrationReplay();
                    if (replayDemo)
                    {
                        await ShowDemonstration(station);
                    }
                    else
                    {
                        // Increase prompting level
                        promptLevel = PromptLevel.FullGuidance;
                        stationController.SetPromptLevel(promptLevel);
                    }
                }
            }
        }

        // Return to main hub
        Destroy(stationController.gameObject);
        LoadMainHub();
    }

    async UniTask ProvideFeedback_Success(StationData station, MotorTaskResult result)
    {
        // Visual feedback
        feedbackUI.ShowSuccess(result.accuracy);

        // Audio feedback
        AudioManager.Play(station.successSound);
        await PlayNarration($"Great job! You completed {station.name}!");

        // Haptic feedback
        haptics.PlayPattern("success", intensity: 0.5f, duration: 200);

        // Particle effects
        ParticleEffects.PlayConfetti(Camera.main.transform.position);

        // Award stars
        int starsEarned = CalculateStars(result.accuracy);
        PlayerDataManager.Instance.AddStars(starsEarned);
        hudManager.AnimateStarCollect(starsEarned);

        await UniTask.Delay(2000); // 2 second celebration
    }

    async UniTask ProvideFeedback_Retry(StationData station, MotorTaskResult result)
    {
        // Gentle redirect (NO HARSH FEEDBACK)
        feedbackUI.ShowRetry(result.failureReason);

        // Audio feedback
        AudioManager.Play("retry_tone");
        await PlayNarration(result.redirectPrompt ?? "Let's try that again! You can do it!");

        // Haptic feedback
        haptics.PlayPattern("redirect", intensity: 0.2f, duration: 100);

        await UniTask.Delay(1500); // Brief pause before retry
    }

    async UniTask HandleDifficultyAdjustment(DifficultyAdjustment adjustment, StationData station)
    {
        switch (adjustment)
        {
            case DifficultyAdjustment.IncreaseDifficulty:
                await PlayNarration("You're doing so well! Let's try a harder version!");
                station.difficultyLevel++;
                break;

            case DifficultyAdjustment.SkillMastered:
                await PlayNarration($"Amazing! You mastered {station.name}!");
                feedbackUI.ShowMasteryBadge(station.AFLS_code);
                PlayerDataManager.Instance.AddStars(10); // Bonus stars for mastery
                break;

            case DifficultyAdjustment.AddPrompts:
                // Silently increase support (no announcement to avoid discouragement)
                break;
        }
    }

    void RecordStationAttempt(StationData station, MotorTaskResult result, float timeElapsed, int attempts, PromptLevel promptLevel)
    {
        var attempt = new StationAttempt
        {
            stationId = station.id,
            stationType = station.type,
            AFLS_code = station.AFLS_code,
            timestamp = System.DateTime.UtcNow,

            success = result.success,
            timeSeconds = timeElapsed,
            accuracy = result.accuracy,
            attemptsNeeded = attempts,
            promptLevel = promptLevel,

            motorData = result.motorData
        };

        sessionAttempts.Add(attempt);

        // Send to backend API
        APIClient.Instance.RecordMotorAttempt(currentSession.sessionId, attempt);

        // Update skill progress
        SkillProgressManager.Instance.RecordAttempt(station.AFLS_code, result.success);
    }

    int CalculateStars(float accuracy)
    {
        // Award 1-5 stars based on accuracy
        if (accuracy >= 0.95f) return 5;
        if (accuracy >= 0.85f) return 4;
        if (accuracy >= 0.75f) return 3;
        if (accuracy >= 0.65f) return 2;
        return 1;
    }

    void EndSession()
    {
        currentSession.timestampEnd = System.DateTime.UtcNow;
        currentSession.totalStationsCompleted = stationsCompletedThisSession;
        currentSession.attempts = sessionAttempts;

        // Send session summary to backend
        APIClient.Instance.EndSession(currentSession);

        // Show summary screen
        UIManager.Instance.ShowSessionSummary(currentSession);
    }
}

// ==========================================
// BASE STATION CONTROLLER (Abstract)
// ==========================================

public abstract class BaseStationController : MonoBehaviour
{
    protected StationData stationData;
    protected PromptLevel promptLevel;
    protected float startTime;

    public virtual void Initialize(StationData data, PromptLevel prompts)
    {
        stationData = data;
        promptLevel = prompts;
        startTime = Time.time;
    }

    public abstract UniTask<MotorTaskResult> WaitForCompletion();

    public virtual void SetPromptLevel(PromptLevel newLevel)
    {
        promptLevel = newLevel;
        ApplyPrompts();
    }

    protected abstract void ApplyPrompts();
}

// ==========================================
// BUTTON STATION CONTROLLER
// ==========================================

public class ButtonStationController : BaseStationController
{
    [Header("Button References")]
    public List<VirtualButton> buttons;
    public Transform shirt;

    private int buttonsCompleted = 0;
    private int totalButtons = 5;

    public override void Initialize(StationData data, PromptLevel prompts)
    {
        base.Initialize(data, prompts);

        // Setup buttons based on difficulty level
        float buttonSize = GetButtonSize(data.difficultyLevel);
        foreach (var button in buttons)
        {
            button.SetSize(buttonSize);
        }

        ApplyPrompts();
    }

    public override async UniTask<MotorTaskResult> WaitForCompletion()
    {
        buttonsCompleted = 0;

        // Wait for player to button all 5 buttons
        while (buttonsCompleted < totalButtons)
        {
            // Wait for next button to be completed
            bool success = await buttons[buttonsCompleted].WaitForButtonComplete();

            if (success)
            {
                buttonsCompleted++;
                AudioManager.Play("button_click");
                Haptics.Pulse(0.3f, 100);

                // Visual feedback
                buttons[buttonsCompleted - 1].ShowCheckmark();
            }
            else
            {
                // Button attempt failed, provide feedback
                return new MotorTaskResult
                {
                    success = false,
                    failureReason = "Button not aligned correctly",
                    redirectPrompt = "Line up the button with the hole and try again!"
                };
            }
        }

        // All buttons completed
        float accuracy = CalculateButtonAccuracy();

        return new MotorTaskResult
        {
            success = true,
            accuracy = accuracy,
            motorData = new MotorPerformanceData
            {
                timeElapsed = Time.time - startTime,
                gripStrength = "appropriate",
                handPosition = "correct_pincer_grasp",
                bilateralCoordination = true
            }
        };
    }

    protected override void ApplyPrompts()
    {
        switch (promptLevel)
        {
            case PromptLevel.FullGuidance:
                // Show animated hand demonstrating
                ShowAnimatedHandGuide(true);
                ShowHighlightedButtonholes(true);
                ShowDirectionalArrows(true);
                break;

            case PromptLevel.Gestural:
                // Show visual cues only
                ShowAnimatedHandGuide(false);
                ShowHighlightedButtonholes(true);
                ShowDirectionalArrows(true);
                break;

            case PromptLevel.MinimalVisual:
                // Small indicators only
                ShowAnimatedHandGuide(false);
                ShowHighlightedButtonholes(false);
                ShowDirectionalArrows(false);
                ShowSmallIndicators(true);
                break;

            case PromptLevel.Independent:
                // No visual prompts
                HideAllPrompts();
                break;
        }
    }

    float GetButtonSize(int difficultyLevel)
    {
        // Return button diameter in meters
        switch (difficultyLevel)
        {
            case 1: return 0.038f; // 1.5 inches (very large)
            case 2: return 0.025f; // 1 inch (standard)
            case 3: return 0.020f; // 0.8 inches
            case 4: return 0.019f; // 0.75 inches (small)
            case 5: return 0.015f; // 0.6 inches (tiny)
            default: return 0.025f;
        }
    }

    float CalculateButtonAccuracy()
    {
        // Calculate based on: alignment precision, force appropriateness, time
        // Simplified for example
        float avgTime = buttons.Average(b => b.completionTime);
        float expectedTime = 8f; // 8 seconds per button

        float timeAccuracy = Mathf.Clamp01(expectedTime / avgTime);
        return timeAccuracy;
    }
}

// ==========================================
// VIRTUAL BUTTON (Physics-Based)
// ==========================================

public class VirtualButton : MonoBehaviour
{
    public Transform button;
    public Transform buttonhole;
    public float diameter = 0.025f; // 1 inch

    [Header("Physics")]
    public float alignmentThreshold = 0.005f; // 5mm tolerance
    public float forceThreshold = 0.5f; // Newtons

    private bool isAligned = false;
    private bool isCompleted = false;
    public float completionTime = 0f;

    public void SetSize(float newDiameter)
    {
        diameter = newDiameter;
        button.localScale = Vector3.one * diameter;
    }

    public async UniTask<bool> WaitForButtonComplete()
    {
        float startTime = Time.time;
        float timeout = 30f; // 30 second timeout

        isCompleted = false;

        while (!isCompleted && (Time.time - startTime) < timeout)
        {
            // Check alignment
            float distance = Vector3.Distance(button.position, buttonhole.position);
            isAligned = distance < alignmentThreshold;

            // Visual feedback
            if (isAligned)
            {
                buttonhole.GetComponent<Renderer>().material.color = Color.green;
            }
            else
            {
                buttonhole.GetComponent<Renderer>().material.color = Color.white;
            }

            // Check force applied
            float appliedForce = GetAppliedForce();

            // If aligned and enough force, button goes through
            if (isAligned && appliedForce >= forceThreshold)
            {
                await AnimateButtonThrough();
                completionTime = Time.time - startTime;
                isCompleted = true;
                return true;
            }

            await UniTask.Yield();
        }

        // Timeout or failure
        return false;
    }

    float GetAppliedForce()
    {
        // Detect pressure from touch or mouse hold
        if (Input.touchSupported && Input.touchCount > 0)
        {
            Touch touch = Input.GetTouch(0);
            return touch.pressure * 2f; // Scale to Newtons
        }
        else if (Input.GetMouseButton(0))
        {
            return 1.0f; // Standard mouse force
        }

        return 0f;
    }

    async UniTask AnimateButtonThrough()
    {
        // Animate button sliding through buttonhole
        Vector3 startPos = button.position;
        Vector3 endPos = buttonhole.position + Vector3.forward * 0.003f; // 3mm forward

        float duration = 0.5f;
        float elapsed = 0f;

        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float t = elapsed / duration;
            button.position = Vector3.Lerp(startPos, endPos, t);
            await UniTask.Yield();
        }
    }

    public void ShowCheckmark()
    {
        // Spawn checkmark visual
        GameObject checkmark = Instantiate(checkmarkPrefab, button.position, Quaternion.identity);
        Destroy(checkmark, 2f);
    }
}

// ==========================================
// ZIPPER STATION CONTROLLER
// ==========================================

public class ZipperStationController : BaseStationController
{
    [Header("Zipper References")]
    public Transform zipperPull;
    public Transform zipperTrack;
    public Transform zipperSlider;
    public Transform pin;

    [Header("Configuration")]
    public float zipperLength = 0.3f; // 30cm
    public bool starterPreEngaged = true; // Difficulty 1-2: true, 3+: false

    private float zipperProgress = 0f; // 0 = bottom, 1 = top
    private bool starterEngaged = false;

    public override void Initialize(StationData data, PromptLevel prompts)
    {
        base.Initialize(data, prompts);

        // Difficulty 1-2: Starter pre-engaged
        starterPreEngaged = (data.difficultyLevel <= 2);
        starterEngaged = starterPreEngaged;

        ApplyPrompts();
    }

    public override async UniTask<MotorTaskResult> WaitForCompletion()
    {
        // Phase 1: Engage starter (if needed)
        if (!starterPreEngaged)
        {
            bool engaged = await WaitForStarterEngagement();
            if (!engaged)
            {
                return new MotorTaskResult
                {
                    success = false,
                    failureReason = "Zipper starter not aligned",
                    redirectPrompt = "Line up the bottom of the zipper and tap to click it in!"
                };
            }
        }

        // Phase 2: Zip up
        bool zipped = await WaitForZipping();

        if (zipped)
        {
            return new MotorTaskResult
            {
                success = true,
                accuracy = CalculateZipperAccuracy(),
                motorData = new MotorPerformanceData
                {
                    timeElapsed = Time.time - startTime,
                    gripStrength = "appropriate",
                    handPosition = "pincer_grasp",
                    bilateralCoordination = true
                }
            };
        }
        else
        {
            return new MotorTaskResult
            {
                success = false,
                failureReason = "Zipper not fully closed",
                redirectPrompt = "Keep pulling the zipper all the way to the top!"
            };
        }
    }

    async UniTask<bool> WaitForStarterEngagement()
    {
        float timeout = 20f;
        float startTime = Time.time;

        while (!starterEngaged && (Time.time - startTime) < timeout)
        {
            // Check alignment
            float distance = Vector3.Distance(pin.position, zipperSlider.position);

            if (distance < 0.01f) // 1cm tolerance
            {
                // Visual cue: Green glow
                zipperSlider.GetComponent<Renderer>().material.color = Color.green;

                // Wait for tap
                if (Input.GetMouseButtonDown(0) || (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began))
                {
                    // Engage!
                    starterEngaged = true;
                    AudioManager.Play("zipper_click");
                    Haptics.Pulse(0.3f, 100);
                    return true;
                }
            }
            else
            {
                zipperSlider.GetComponent<Renderer>().material.color = Color.white;
            }

            await UniTask.Yield();
        }

        return false; // Timeout
    }

    async UniTask<bool> WaitForZipping()
    {
        float timeout = 30f;
        float startTime = Time.time;

        while (zipperProgress < 0.95f && (Time.time - startTime) < timeout)
        {
            // Track drag input
            Vector3 dragPos = GetDragPosition();

            if (dragPos != Vector3.zero)
            {
                // Calculate progress along track
                float dragAlongTrack = Vector3.Dot(dragPos - zipperTrack.position, zipperTrack.up);
                zipperProgress = Mathf.Clamp01(dragAlongTrack / zipperLength);

                // Update zipper pull position
                zipperPull.position = zipperTrack.position + zipperTrack.up * (zipperProgress * zipperLength);

                // Audio/haptic feedback
                AudioManager.PlayLooping("zipper_zip", volume: 0.5f);
                Haptics.Pulse(0.2f, 50);
            }
            else
            {
                AudioManager.Stop("zipper_zip");
            }

            await UniTask.Yield();
        }

        AudioManager.Stop("zipper_zip");
        return zipperProgress >= 0.95f;
    }

    Vector3 GetDragPosition()
    {
        if (Input.touchCount > 0)
        {
            Touch touch = Input.GetTouch(0);
            Ray ray = Camera.main.ScreenPointToRay(touch.position);
            RaycastHit hit;
            if (Physics.Raycast(ray, out hit))
            {
                return hit.point;
            }
        }
        else if (Input.GetMouseButton(0))
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit hit;
            if (Physics.Raycast(ray, out hit))
            {
                return hit.point;
            }
        }

        return Vector3.zero;
    }

    float CalculateZipperAccuracy()
    {
        // Based on smoothness, speed, completeness
        float timeElapsed = Time.time - startTime;
        float expectedTime = 10f; // 10 seconds
        return Mathf.Clamp01(expectedTime / timeElapsed);
    }

    protected override void ApplyPrompts()
    {
        // Similar to button station, show appropriate prompts based on level
    }
}

// ==========================================
// DATA STRUCTURES
// ==========================================

public enum StationType
{
    Button,
    Zipper,
    Velcro,
    Snap,
    Shoelace,
    Cutting,
    Tracing,
    Pouring,
    Tweezers
}

public enum PromptLevel
{
    FullGuidance,    // Animated hand-over-hand
    Gestural,        // Visual arrows and highlights
    MinimalVisual,   // Small indicators only
    Independent      // No prompts
}

[System.Serializable]
public class StationData
{
    public string id;
    public string name;
    public StationType type;
    public string AFLS_code;
    public int difficultyLevel; // 1-5
    public int tier; // 1-5

    public string introNarration;
    public string successSound;
    public bool isFirstVisit;
}

[System.Serializable]
public class MotorTaskResult
{
    public bool success;
    public float accuracy; // 0-1
    public string failureReason;
    public string redirectPrompt;
    public MotorPerformanceData motorData;
}

[System.Serializable]
public class MotorPerformanceData
{
    public float timeElapsed;
    public string gripStrength; // "too_weak", "appropriate", "too_strong"
    public string handPosition; // "correct_pincer_grasp", "incorrect", etc.
    public bool bilateralCoordination;
    public float forceApplied;
    public float steadiness; // 0-1, based on jitter
}

[System.Serializable]
public class StationAttempt
{
    public string stationId;
    public StationType stationType;
    public string AFLS_code;
    public System.DateTime timestamp;

    public bool success;
    public float timeSeconds;
    public float accuracy;
    public int attemptsNeeded;
    public PromptLevel promptLevel;

    public MotorPerformanceData motorData;
}

[System.Serializable]
public class SessionData
{
    public string sessionId;
    public string gameId;
    public string userId;
    public System.DateTime timestampStart;
    public System.DateTime timestampEnd;

    public int currentTier;
    public int totalStationsCompleted;
    public List<StationAttempt> attempts;
}
```

### Haptic Feedback System

```csharp
public class HapticFeedbackController : MonoBehaviour
{
    public static HapticFeedbackController Instance;

    private Dictionary<string, HapticPattern> patterns = new Dictionary<string, HapticPattern>();

    void Awake()
    {
        if (Instance == null) Instance = this;

        // Define haptic patterns
        patterns["success"] = new HapticPattern
        {
            pulses = new List<HapticPulse>
            {
                new HapticPulse { intensity = 0.3f, duration = 100 },
                new HapticPulse { intensity = 0.5f, duration = 200, delay = 150 }
            }
        };

        patterns["redirect"] = new HapticPattern
        {
            pulses = new List<HapticPulse>
            {
                new HapticPulse { intensity = 0.2f, duration = 100 },
                new HapticPulse { intensity = 0.2f, duration = 100, delay = 150 }
            }
        };

        patterns["button_click"] = new HapticPattern
        {
            pulses = new List<HapticPulse>
            {
                new HapticPulse { intensity = 0.3f, duration = 100 }
            }
        };
    }

    public void PlayPattern(string patternName, float intensity = 1f, int duration = 200)
    {
        if (!SettingsManager.Instance.HapticsEnabled) return;

        if (patterns.ContainsKey(patternName))
        {
            StartCoroutine(ExecutePattern(patterns[patternName], intensity));
        }
        else
        {
            // Fallback: Simple pulse
            Pulse(intensity, duration);
        }
    }

    public void Pulse(float intensity, int durationMs)
    {
        if (!SettingsManager.Instance.HapticsEnabled) return;

        // Platform-specific haptic API
#if UNITY_IOS
        iOSHapticFeedback.Trigger();
#elif UNITY_ANDROID
        AndroidVibration.Vibrate(durationMs);
#else
        // Desktop: No haptics available
#endif
    }

    IEnumerator ExecutePattern(HapticPattern pattern, float intensityMultiplier)
    {
        foreach (var pulse in pattern.pulses)
        {
            if (pulse.delay > 0)
            {
                yield return new WaitForSeconds(pulse.delay / 1000f);
            }

            Pulse(pulse.intensity * intensityMultiplier, pulse.duration);
        }
    }
}

[System.Serializable]
public class HapticPattern
{
    public List<HapticPulse> pulses;
}

[System.Serializable]
public class HapticPulse
{
    public float intensity; // 0-1
    public int duration; // milliseconds
    public int delay; // milliseconds before this pulse
}
```

---

## 7. DATA TRACKING & ANALYTICS

### Per-Station Attempt Data Collection

```json
{
  "attempt_id": "FM-2025-10-13-0089",
  "session_id": "S-6234",
  "user_id": "U-1234",
  "game_id": "fine_motor_mastery_v1",
  "timestamp": "2025-10-13T14:22:18Z",

  "station_data": {
    "station_id": "button_station_01",
    "station_type": "button",
    "station_name": "Button Station",
    "AFLS_code": "BA-38",
    "difficulty_level": 2,
    "tier": 1
  },

  "attempt_data": {
    "success": true,
    "time_seconds": 42.5,
    "accuracy": 0.87,
    "attempts_needed": 1,
    "prompt_level": "gestural"
  },

  "motor_performance": {
    "grip_strength": "appropriate",
    "hand_position": "correct_pincer_grasp",
    "finger_isolation": "successful",
    "bilateral_coordination": true,
    "force_applied_newtons": 0.8,
    "steadiness_rating": 0.82,
    "response_latency": 2.3
  },

  "skill_breakdown": {
    "pincer_grasp": "success",
    "button_alignment": "success",
    "push_through_buttonhole": "success_after_retry",
    "pull_completion": "success"
  },

  "feedback_provided": {
    "visual": "success_checkmark",
    "audio": "button_click",
    "haptic": "success_pulse",
    "narrator": "Great job!"
  },

  "stars_earned": 4
}
```

### Session Summary

```json
{
  "session_id": "S-6234",
  "user_id": "U-1234",
  "start_time": "2025-10-13T14:15:00Z",
  "end_time": "2025-10-13T14:27:30Z",
  "duration_minutes": 12.5,

  "stations_completed": 5,
  "station_breakdown": [
    {
      "station": "button",
      "AFLS_code": "BA-38",
      "success": true,
      "accuracy": 0.87,
      "time": 42.5,
      "stars": 4
    },
    {
      "station": "zipper",
      "AFLS_code": "BA-40",
      "success": true,
      "accuracy": 0.92,
      "time": 38.2,
      "stars": 5
    },
    {
      "station": "velcro",
      "AFLS_code": "BA-41",
      "success": true,
      "accuracy": 0.95,
      "time": 25.1,
      "stars": 5
    },
    {
      "station": "cutting",
      "AFLS_code": "BA-28",
      "success": false,
      "accuracy": 0.68,
      "time": 65.3,
      "stars": 0,
      "retry_needed": true
    },
    {
      "station": "cutting_retry",
      "AFLS_code": "BA-28",
      "success": true,
      "accuracy": 0.78,
      "time": 58.0,
      "stars": 3
    }
  ],

  "overall_performance": {
    "success_rate": 0.80,
    "avg_accuracy": 0.84,
    "total_stars_earned": 17,
    "skills_practiced": ["BA-38", "BA-40", "BA-41", "BA-28"],
    "new_skills_mastered": [],
    "skills_in_progress": ["BA-28"]
  },

  "adaptive_adjustments": [
    {
      "timestamp": "2025-10-13T14:22:00Z",
      "adjustment": "increased_difficulty",
      "skill": "BA-41",
      "reason": "95% accuracy achieved, advancing to Level 3"
    },
    {
      "timestamp": "2025-10-13T14:25:00Z",
      "adjustment": "added_prompts",
      "skill": "BA-28",
      "reason": "First attempt failed, offering demonstration replay"
    }
  ],

  "next_recommendations": {
    "focus_skills": ["BA-28_cutting", "BA-45_shoelaces"],
    "recommended_stations": ["cutting", "tracing", "shoelace"],
    "tier": 1
  }
}
```

### Progress Tracking (PostgreSQL Schema)

```sql
CREATE TABLE fine_motor_progress (
  user_id UUID REFERENCES users(id),
  AFLS_code VARCHAR(20), -- e.g., "BA-38"
  skill_name VARCHAR(100),

  -- Acquisition phase
  current_phase VARCHAR(20) CHECK (current_phase IN ('acquisition', 'fluency', 'maintenance', 'mastered')),

  -- Trial data
  total_attempts INT DEFAULT 0,
  successful_attempts INT DEFAULT 0,
  current_accuracy DECIMAL(4,3),

  -- Difficulty progression
  current_difficulty_level INT DEFAULT 1, -- 1-5
  current_tier INT DEFAULT 1, -- 1-5
  prompt_level VARCHAR(20), -- 'full_guidance', 'gestural', 'minimal', 'independent'

  -- Dates
  first_practiced_date TIMESTAMP,
  mastery_date TIMESTAMP,
  last_session_date TIMESTAMP,

  PRIMARY KEY (user_id, AFLS_code)
);

CREATE TABLE fine_motor_sessions (
  session_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,

  tier INT, -- 1-5
  stations_completed INT,
  success_rate DECIMAL(4,3),
  avg_accuracy DECIMAL(4,3),
  total_stars_earned INT,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fine_motor_attempts (
  attempt_id UUID PRIMARY KEY,
  session_id UUID REFERENCES fine_motor_sessions(session_id),
  station_id VARCHAR(50),
  station_type VARCHAR(20),
  AFLS_code VARCHAR(20),
  timestamp TIMESTAMP NOT NULL,

  success BOOLEAN,
  time_seconds DECIMAL(6,2),
  accuracy DECIMAL(4,3),
  attempts_needed INT,
  prompt_level VARCHAR(20),

  -- Motor performance data
  grip_strength VARCHAR(20),
  hand_position VARCHAR(50),
  bilateral_coordination BOOLEAN,
  force_applied DECIMAL(4,2),
  steadiness_rating DECIMAL(4,3),

  stars_earned INT
) PARTITION BY RANGE (timestamp);

-- Parent Dashboard View
CREATE VIEW parent_fine_motor_dashboard AS
SELECT
  u.id AS user_id,
  u.name AS child_name,
  p.AFLS_code,
  p.skill_name,
  p.current_phase,
  p.current_accuracy,
  p.current_difficulty_level,
  p.current_tier,
  p.total_attempts,
  p.successful_attempts,
  p.last_session_date,
  COUNT(DISTINCT s.session_id) AS total_sessions,
  AVG(s.success_rate) AS avg_session_success_rate,
  SUM(s.total_stars_earned) AS lifetime_stars
FROM users u
JOIN fine_motor_progress p ON u.id = p.user_id
LEFT JOIN fine_motor_sessions s ON u.id = s.user_id
GROUP BY u.id, u.name, p.AFLS_code, p.skill_name, p.current_phase,
         p.current_accuracy, p.current_difficulty_level, p.current_tier,
         p.total_attempts, p.successful_attempts, p.last_session_date;
```

---

## 8. ACCESSIBILITY & ACCOMMODATIONS

### WCAG 2.1 AA Compliance + Motor Accessibility

**Perceivable**:
- ✅ **1.1.1 Non-text Content**: All UI elements have descriptive labels (buttons, zippers, scissors, etc.)
- ✅ **1.4.3 Contrast**: UI text 4.5:1 contrast, visual guides 3:1 contrast
- ✅ **1.4.11 Non-text Contrast**: Button highlights, zipper paths 3:1 contrast
- ✅ **1.4.13 Content on Hover**: Visual prompts persist, not dismissed by mouse movement

**Operable**:
- ✅ **2.1.1 Keyboard**: Full keyboard/switch access (spacebar to activate, arrows to navigate)
- ✅ **2.2.1 Timing Adjustable**: No time limits OR adjustable 30-90 seconds OR unlimited
- ✅ **2.4.7 Focus Visible**: Clear focus indicators on all interactive elements
- ✅ **2.5.1 Pointer Gestures**: All multi-touch gestures have single-pointer alternatives
- ✅ **2.5.2 Pointer Cancellation**: Actions triggered on touch-up, not touch-down (prevents accidental activation)
- ✅ **2.5.5 Target Size**: Minimum 150×150px (exceeds 44×44px WCAG requirement) for motor impairments
- ✅ **2.5.8 Target Size (Minimum)**: Enhanced - adjustable up to 300×300px for severe motor impairments

**Understandable**:
- ✅ **3.1.1 Language of Page**: HTML lang="en", clear narration
- ✅ **3.2.1 On Focus**: No automatic actions when elements receive focus
- ✅ **3.3.2 Labels or Instructions**: Every station has clear visual + audio instructions

**Robust**:
- ✅ **4.1.2 Name, Role, Value**: ARIA labels on all interactive elements
- ✅ **4.1.3 Status Messages**: Aria-live regions announce successes, attempts, feedback

### Motor Accessibility Features (Critical for This Game!)

**Touch Target Customization**:
```
- Size options: 150px (default), 200px, 250px, 300px (severe impairment)
- Spacing: Minimum 50px between targets (prevents accidental touches)
- Magnetic snapping: Targets "attract" finger/mouse within 20px radius
- Dwell-time activation: Can enable 2-second dwell instead of tap
```

**Force Modulation Support**:
```
- Pressure sensitivity adjustable:
  - High sensitivity: Light touch = full force (for low strength)
  - Standard: Normal pressure required
  - Low sensitivity: Firm press required (for tremors/overshooting)

- Force feedback:
  - Visual meter shows current force applied
  - Haptic pulse when target force reached
  - Audio cue: "Press harder" or "Gentle press"
```

**Tremor/Stability Accommodations**:
```
- Smoothing algorithm: Averages last 5 touch positions (reduces jitter)
- Snap-to-grid: Aligns dragged objects to nearest valid position
- Steady-hold assistance: Object "locks" once held steady for 1 second
- Slow-motion mode: All animations 50% speed (more time to react)
```

**Switch Access (1-2 Switch Users)**:
```
- Auto-scanning mode: Highlights targets sequentially
- Scanning speed: Adjustable 1-10 seconds per target
- Selection: Switch press when desired target highlighted
- Action: Second switch activates, OR auto-activate after 2 seconds

Example Flow (Button Station with 1 switch):
1. System highlights first button (3 second dwell)
2. System highlights buttonhole (3 second dwell)
3. System highlights "Push" action (3 second dwell)
4. Switch press confirms action
5. Button automatically animates through
```

**Eye Gaze Support** (Experimental):
```
- Dwell selection: 2-second gaze on target = selection
- Blink activation: Double-blink confirms action
- Smooth pursuit: Dragging via eye tracking (requires calibration)
- Fallback: Switch to auto-complete mode if eye tracking unreliable
```

### Autism-Specific Accommodations

**Sensory Sensitivities**:
1. **Visual**:
   - Simple mode: Remove background details, solid colors only
   - High contrast mode: Black/white with bright color highlights
   - Reduced animation: Disable particle effects, smooth transitions only

2. **Auditory**:
   - Volume controls: Separate sliders (narrator, effects, music)
   - Voice options: Male/female voice, pitch adjustment ±20%
   - Mute option: Visual-only mode (text instructions + visual feedback)
   - No sudden loud sounds: All audio <75dB equivalent

3. **Haptic**:
   - Intensity: 0-100% adjustable or disable entirely
   - Pattern: Simple pulse vs. complex patterns
   - Some autistic children find haptics soothing, others overwhelming

**Executive Function Support**:
- Visual schedule: "You've completed 3/8 stations! 5 more to go!"
- Station preview: Shows what activity involves before starting
- Break reminder: After 10 minutes, prompt "Do you want a break?"
- Predictable structure: Same flow every session (hub → station → feedback → hub)

**Anxiety Reduction**:
- No failure states: "Try again" instead of "Wrong!"
- Unlimited attempts: Can retry any station as many times as needed
- Opt-out available: Pause button always visible, can exit without penalty
- Familiar environment: Same hub, same stations every session

---

## 9. TESTING & VALIDATION

### Occupational Therapy Validation Protocol (Mandatory)

**Phase 1: OT Expert Review** (Day 1-3) ⚠️ CRITICAL
- [ ] **MANDATORY**: Review all motor patterns for anatomical accuracy
- [ ] Verify finger positions match real-world grasp patterns (pincer, tripod, etc.)
- [ ] Validate physics simulations (button tension, zipper resistance, fabric drag)
- [ ] Confirm developmental appropriateness of difficulty progression (3yo vs 7yo)
- [ ] Assess haptic feedback intensity (not overwhelming for sensory-sensitive children)
- [ ] Verify force thresholds (appropriate for child strength levels)
- [ ] Confirm bilateral coordination requirements (both hands used appropriately)
- [ ] Validate transfer potential (will skills generalize to real buttons, zippers, etc.?)
- **Sign-off Required**: OT-001 (MANDATORY - Cannot develop without approval)

**Specific OT Validation Checklist**:
```
BUTTON STATION:
- [ ] Pincer grasp position anatomically correct (thumb opposed to index finger)
- [ ] Button diameter progression appropriate (1.5" → 1" → 0.75")
- [ ] Force required to push through realistic (0.5-1.5 Newtons)
- [ ] Buttonhole size appropriate for difficulty level
- [ ] Bilateral coordination required (one hand holds buttonhole fabric)

ZIPPER STATION:
- [ ] Zipper pull grip size appropriate for child hands
- [ ] Upward pulling motion smooth and natural
- [ ] Starter engagement mimics real-world difficulty
- [ ] Resistance increases with zipper teeth tension

SHOELACE STATION:
- [ ] Lace manipulation matches real-world physics (not too stiff/floppy)
- [ ] Loop formation requires proper finger dexterity
- [ ] Bunny ears method broken into developmentally appropriate steps
- [ ] Knot-tying sequence matches OT teaching protocols

CUTTING STATION:
- [ ] Scissor grip position matches standard tripod grip
- [ ] Blade opening/closing motion realistic
- [ ] Paper resistance appropriate
- [ ] Hand position guides show correct thumb/finger placement

POURING STATION:
- [ ] Pitcher weight simulated realistically (full vs empty)
- [ ] Tilt angle required matches real-world pouring (45-60 degrees)
- [ ] Liquid flow physics accurate (viscosity, splash)
- [ ] Bilateral coordination required (stabilize cup with other hand)
```

**Phase 2: BCBA Review** (Day 2-4)
- [ ] Verify AFLS skill mappings (BA-38 through BA-45, HLS-15)
- [ ] Review prompting hierarchy (errorless → independent)
- [ ] Approve reinforcement schedule (immediate + variable ratio)
- [ ] Confirm data collection captures skill acquisition phases
- [ ] Validate adaptive difficulty algorithm (mastery criteria)
- **Sign-off Required**: BCBA-001

**Phase 3: Accessibility Specialist Review** (Day 3-5)
- [ ] WCAG 2.1 AA compliance audit (all criteria)
- [ ] Motor accessibility features testing (touch targets, force modulation, tremor support)
- [ ] Switch access testing (1-switch and 2-switch modes)
- [ ] Eye gaze compatibility testing (if supported)
- [ ] Screen reader testing (VoiceOver, TalkBack)
- [ ] Keyboard navigation testing (all stations accessible without mouse)
- **Sign-off Required**: A11Y-001

**Phase 4: Parent & Child Beta Testing** (Day 10-15)
- [ ] Test with 8 children (ages 3-7, varying skill levels)
- [ ] Collect usability feedback from parents
- [ ] Measure engagement (sustained attention >8 minutes)
- [ ] Verify skill transfer to real-world objects (buttons, zippers, etc.)
- [ ] Test switch access with 2 children using assistive tech
- [ ] Collect OT feedback from clinic therapists observing play
- **Threshold**: 6/8 families report positive experience, 5/8 children show engagement

### OT Transfer-of-Skills Study (Post-Launch)

**Week 4 After Launch**: Real-World Transfer Assessment
- Recruit 15 children who have used Fine Motor Mastery for 4 weeks
- Pre/Post AFLS assessment (BA-28 through BA-45 items)
- OT observes child attempting real-world tasks:
  - Button actual shirt
  - Zip actual jacket
  - Tie actual shoelaces
  - Cut paper with real scissors
  - Pour water from real pitcher
- **Success Criterion**: 70%+ of children show improvement on ≥3 AFLS items
- **Publication Goal**: Submit findings to *American Journal of Occupational Therapy*

### Unit Tests

```csharp
[Test]
public void TestButtonPhysics_CorrectAlignment()
{
    // Arrange
    VirtualButton button = new VirtualButton();
    button.button.position = new Vector3(0, 0, 0);
    button.buttonhole.position = new Vector3(0, 0, 0); // Perfectly aligned

    // Act
    bool aligned = button.CheckAlignment();

    // Assert
    Assert.IsTrue(aligned);
}

[Test]
public void TestZipperPhysics_FullZip()
{
    // Arrange
    ZipperStationController zipper = new ZipperStationController();
    zipper.Initialize(difficultyLevel: 2);

    // Act: Simulate dragging zipper pull from 0% to 100%
    for (float progress = 0f; progress <= 1f; progress += 0.1f)
    {
        zipper.SetZipperProgress(progress);
    }

    // Assert
    Assert.AreEqual(1f, zipper.zipperProgress);
    Assert.IsTrue(zipper.IsZipperComplete());
}

[Test]
public void TestAdaptiveDifficulty_IncreaseAfterMastery()
{
    // Arrange
    FineMotorAdaptiveDifficulty adaptive = new FineMotorAdaptiveDifficulty();
    string AFLS_code = "BA-38";

    // Act: Simulate 10 successful attempts with 90% accuracy
    for (int i = 0; i < 10; i++)
    {
        adaptive.EvaluatePerformance(AFLS_code, success: true, accuracy: 0.90f);
    }

    // Assert: Difficulty should increase
    var adjustment = adaptive.EvaluatePerformance(AFLS_code, true, 0.90f);
    Assert.AreEqual(DifficultyAdjustment.IncreaseDifficulty, adjustment);
}

[Test]
public void TestHapticFeedback_IntensityScaling()
{
    // Arrange
    HapticFeedbackController haptics = new HapticFeedbackController();
    haptics.SetIntensity(0.5f); // 50% intensity

    // Act
    haptics.PlayPattern("success", intensity: 1.0f);

    // Assert: Verify intensity was scaled
    float appliedIntensity = haptics.GetLastAppliedIntensity();
    Assert.AreEqual(0.5f, appliedIntensity, 0.01f);
}

[Test]
public void TestAccessibility_TouchTargetSize()
{
    // Arrange
    SettingsManager.Instance.TouchTargetSize = 300; // 300px for motor impairment

    // Act
    VirtualButton button = new VirtualButton();
    button.ApplyAccessibilitySettings();

    // Assert
    Assert.AreEqual(300f, button.GetColliderRadius());
}
```

---

## 10. LAUNCH & POST-LAUNCH

### Success Metrics

**Clinical Effectiveness**:
- **Primary**: 70%+ of children show improvement in ≥3 AFLS skills (pre/post assessment)
- **Secondary**: Average 2-3 fine motor skills mastered per month
- **Transfer**: 60%+ parents report child successfully using real-world objects (actual buttons, zippers) after 4 weeks

**Engagement**:
- **Average Session**: 10+ minutes sustained attention
- **Completion Rate**: 70%+ children complete 4+ stations per session
- **Retention**: 50%+ return for 4+ sessions in first week

**Motor Performance**:
- **Accuracy Improvement**: Average accuracy increases 15%+ from first to tenth session
- **Speed Improvement**: Time to complete station decreases 20%+ over 4 weeks
- **Independence**: 60%+ children move from "full guidance" to "minimal visual" prompting within 3 weeks

**Accessibility**:
- **Zero** critical WCAG violations reported
- **90%+** of children with motor disabilities can access using switch/eye gaze/adaptive controls
- **100%** of stations playable with keyboard-only input

### Post-Launch Monitoring

**Week 1-2**: Bug fixes, UX adjustments
- Monitor physics simulations for edge cases (button gets stuck, zipper unrealistic)
- Check haptic feedback intensity on various devices
- Verify audio synchronization with animations
- Test on low-end devices (Android 4GB RAM, older iPads)

**Week 3-4**: Analyze motor performance data
- Identify which AFLS skills have <60% success rate (need difficulty adjustment)
- Review which stations children avoid (too hard? too boring?)
- Assess if prompting system is effective (are children progressing to independence?)
- Check for accessibility bugs (switch access, eye gaze issues)

**Month 2**: OT-validated enhancements
- Add new stations based on OT feedback (e.g., lacing beads, using utensils)
- Adjust physics simulations based on real-world comparison data
- Add more customization (different shirt patterns, shoe styles)
- Implement multiplayer co-op mode (practice with sibling/peer)

**Month 3**: Real-world validation study
- Partner with 3-5 OT clinics
- Pre/post AFLS testing with game vs. control group
- Parent interviews on skill generalization
- Publish findings in *American Journal of Occupational Therapy* or *Journal of Autism and Developmental Disorders*

---

## 11. TEAM & TIMELINE

### Team Composition

- **Game Developer** (GAME-001): Unity implementation, physics simulations, haptic system
- **Occupational Therapist** (OT-001): **CRITICAL** - Motor pattern validation, AFLS alignment, difficulty calibration
- **BCBA** (BCBA-001): Skill acquisition tracking, prompting system, reinforcement
- **Accessibility Specialist** (A11Y-001): Switch access, motor accommodations, WCAG compliance
- **3D Artist** (ARTIST-001): Clothing models, tool models (scissors, tweezers), animations
- **UI/UX Designer** (UX-001): HUD design, visual prompts, feedback animations
- **Sound Designer** (SOUND-001): Voice-over recording, realistic SFX (button clicks, zipper sounds)
- **QA Engineer** (QA-001): Testing, physics validation, accessibility audit
- **Project Manager** (PM-001): Coordination, timeline management, OT liaison

### Development Timeline (22-25 days)

**Week 1 (Days 1-5): Design & Clinical Validation**
- Day 1-2: **OT reviews GDD, validates motor patterns** (CRITICAL)
- Day 2: BCBA reviews AFLS skill mappings
- Day 3: Accessibility Specialist reviews motor accommodations plan
- Day 4: OT provides detailed feedback on physics requirements (button tension, zipper resistance, etc.)
- Day 5: GDD revisions based on OT feedback, final approval
- Deliverable: **OT-approved GDD with all sign-offs**

**Week 2 (Days 6-10): Asset Creation**
- Day 6-7: 3D models (shirts, jackets, shoes, scissors, tweezers, pitcher, cup)
- Day 7-8: Texture painting, rigging, animations
- Day 8-9: Voice-over recording (100+ narrator lines, 50+ instructions)
- Day 9-10: Sound effects (button clicks, zipper zips, scissors snips, etc.)
- Deliverable: All 3D models, textures, audio assets ready for Unity

**Week 3 (Days 11-17): Core Development**
- Day 11-12: Unity scene setup, main hub creation
- Day 12-14: **Physics simulations (button, zipper, shoelace, cutting, pouring)**
  - **Critical**: OT reviews physics in-progress (Day 13 checkpoint)
- Day 14-15: Station controllers (button, zipper, velcro, snap, shoelace)
- Day 15-16: Station controllers (cutting, tracing, pouring, tweezers)
- Day 16-17: Haptic feedback system, multi-sensory cueing
- Day 17: Data tracking, API integration, adaptive difficulty system
- Deliverable: Alpha build with all 8 stations playable

**Week 4 (Days 18-22): Polish, Accessibility & Testing**
- Day 18: UI/UX polish, HUD implementation, visual prompts
- Day 19: **Accessibility implementation** (switch access, touch target customization, force modulation)
- Day 19-20: **OT playtesting** (validates motor patterns in actual gameplay)
- Day 20: Accessibility audit (WCAG 2.1 AA + motor accessibility)
- Day 21: QA testing (automated + manual, physics validation, device testing)
- Day 22: Bug fixes, performance optimization (60fps on mid-tier devices)
- Deliverable: Beta build ready for family testing

**Week 5 (Days 23-25): Beta Testing**
- Day 23-25: 8 families test (ages 3-7, including 2 switch access users)
- OT observes beta sessions, provides final feedback
- Collect data: Motor performance, engagement, skill transfer observations
- Deliverable: Final adjustments based on beta feedback, launch preparation

**Total: 25 days** (5 weeks)

---

## 12. CONCLUSION

### Summary

**Fine Motor Mastery: Daily Skills Adventure** is an OT-validated, physics-based fine motor skills game that teaches critical self-care and functional living skills through realistic, engaging simulations. Aligned with AFLS assessment framework (BA-28 through BA-45, HLS-15), this game provides systematic motor skill development with the explicit goal of real-world skill transfer. Advanced accessibility features ensure children with motor impairments can participate fully.

### Key Innovations

1. **Physics-Based Realism**: Button tension, zipper resistance, liquid pouring use Unity physics to mirror real-world feel
2. **OT-Driven Design**: Every motor pattern validated by pediatric OT, ensuring anatomical accuracy
3. **Multi-Sensory Feedback**: Visual + auditory + haptic cues support motor learning (unlike traditional OT apps with visual-only feedback)
4. **Motor Accessibility**: Touch target customization (150-300px), force modulation, tremor support, switch access
5. **Adaptive Difficulty**: 5 difficulty levels per station, automatic progression based on mastery
6. **Real-World Transfer Focus**: Game designed explicitly for generalization to actual buttons, zippers, shoelaces
7. **8 Functional Skills**: Comprehensive coverage of daily living motor tasks (dressing, cutting, pouring, etc.)
8. **Graduated Prompting**: Errorless learning → independence, fades support as child succeeds

### Clinical Impact

- **Target**: 70% of children improve ≥3 AFLS fine motor skills within 6 weeks
- **Data-Driven**: Every motor attempt tracked (grip strength, force, accuracy, time)
- **OT Integration**: Data exportable to OT progress notes, IEP goal tracking
- **Evidence-Based**: Built on motor learning principles, systematic instruction, shaping

### Real-World Validation

**Post-Launch Study Plan**:
- Partner with 3-5 pediatric OT clinics
- Pre/post AFLS assessment (8-10 weeks)
- Control group (traditional OT only) vs. Game + OT group
- Measure: AFLS score improvement, real-world skill demonstration
- **Hypothesis**: Game + OT group shows 30%+ greater improvement than control

### Next Steps

1. **Immediate**: **OT review of this GDD** (MANDATORY before development)
2. **Week 1**: Begin asset creation (3D models, textures, audio)
3. **Week 2-3**: Unity development + physics implementation (with OT checkpoints)
4. **Week 4**: Accessibility audit + OT playtesting
5. **Week 5**: Beta testing with 8 families + OT observation

**Document Status**: ✅ Complete, Ready for OT Review
**Estimated Development Cost**: $20,000-28,000 (25 days × team rates)
**Expected ROI**: Very High (fine motor skills are foundational for self-care independence, high parent demand)

---

**⚠️ CRITICAL REMINDER FOR DEVELOPMENT TEAM**:

This game teaches MOTOR SKILLS that must transfer to REAL-WORLD objects. Unlike cognitive games where the goal is in-game mastery, this game's success is measured by whether a child can **actually button a real shirt, zip a real jacket, tie real shoelaces** after playing.

**Occupational Therapist approval is NON-NEGOTIABLE.**

If ANY motor pattern is anatomically incorrect, if physics simulations don't match real-world feel, if difficulty progression is developmentally inappropriate, the OT WILL reject it, and we MUST revise.

Our goal: **Real-world independence**. A child who can button 5 virtual buttons but cannot button their own shirt has NOT benefited from this game.

**Success = Child demonstrates mastery of physical objects in real life, not just in-game.**

---

**END OF GAME DESIGN DOCUMENT**

*This document will be updated based on OT review feedback and beta testing results. Motor patterns must be validated before development proceeds.*
