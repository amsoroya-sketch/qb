# Game Design Document: Emotion Recognition
## SkillBridge Educational Gaming Platform

**Game ID**: GAME-002
**Development Priority**: Month 1, Week 3-4
**Status**: Design Phase
**Document Version**: 1.0
**Last Updated**: October 12, 2025

---

## 1. GAME OVERVIEW

### Game Title
**Emotion Recognition: Feelings Explorer**

### High-Level Concept
An interactive emotion identification game where children learn to recognize and label facial expressions and emotional states. Players progress from identifying basic emotions (happy, sad) to complex emotions and contextual understanding (Why is this person excited? What made them angry?).

### Target Audience
- **Primary**: Autistic children ages 3-7
- **Difficulty Level**: 2-4 (Early learner to emerging communicator)
- **Prerequisites**:
  - Basic visual discrimination (completed Color Matching or equivalent)
  - Attending to faces for 3-5 seconds
  - Pointing or AAC selection capability

### Core Learning Objectives

**Primary Skills** (ABLLS-R Framework):
- **C1**: Identifies "happy" and "sad" faces (80% accuracy across 10 trials)
- **C2**: Identifies "angry" and "scared" faces (80% accuracy)
- **C3**: Identifies "surprised" and "excited" faces (80% accuracy)
- **C4**: Labels emotions when asked "How does this person feel?" (verbal or AAC)
- **C5**: Identifies emotions in context (e.g., "Show me the happy birthday child")

**Secondary Skills** (VB-MAPP):
- **Listener Responding Level 1**: Responds to emotion labels by pointing
- **Tact Level 1**: Labels emotions using words or AAC symbols
- **Intraverbal**: Answers "What makes you happy/sad?" questions

**Social-Emotional Competencies**:
- Emotion vocabulary expansion (6-12 emotions)
- Understanding emotion-situation relationships
- Foundation for empathy development
- Self-awareness of own emotional states

### Game Duration
- **Per Session**: 5-10 minutes
- **Per Level**: 2-3 minutes
- **Total Levels**: 15 (5 worlds × 3 difficulty tiers)
- **Estimated Mastery Time**: 4-6 weeks (3-4 sessions/week)

---

## 2. CLINICAL FRAMEWORK

### ABLLS-R Alignment

**Section C: Visual Performance - Social/Emotional**

| ABLLS-R Code | Skill Description | Game Implementation |
|--------------|-------------------|---------------------|
| C1 | Identifies happy/sad faces | Level 1: 2-choice trials with clear happy/sad photos |
| C2 | Identifies angry/scared faces | Level 2: 4-choice trials adding angry/scared |
| C3 | Identifies surprised/excited | Level 3: 6-choice trials, full emotion set |
| C4 | Labels emotions (expressive) | "Tell me how they feel" prompts with AAC/voice |
| C5 | Contextual emotion identification | Scenarios: "Show me the sad child who dropped ice cream" |
| C6-C7 | Complex emotions/mixed feelings | Advanced: confused, frustrated, proud, embarrassed |
| C10 | Identifies own emotions | Self-reflection mode: "How are YOU feeling right now?" |

**Baseline Assessment**:
- Pre-game: Assess C1-C3 with 5 trials per emotion
- Placement:
  - 0-40% accuracy → Start Level 1 (happy/sad only)
  - 41-70% accuracy → Start Level 2 (4 emotions)
  - 71%+ accuracy → Start Level 3 (all emotions + context)

### VB-MAPP Milestones

**Level 1 (0-18 months developmental)**:
- Listener Responding 5: Selects correct emotion from 2 choices when named
- Tact 5: Labels 2-3 emotions when shown facial expressions

**Level 2 (18-30 months)**:
- Listener Responding 9: Selects from 6 emotions when named
- Tact 9: Labels 6+ emotions spontaneously
- Intraverbal 3: Answers "What makes you happy?" with 1-2 examples

**Level 3 (30-48 months)**:
- Listener Responding 12: Follows contextual prompts ("Show me the angry boy who can't find his toy")
- Tact 12: Describes why someone feels a certain way
- Intraverbal 8: Engages in emotion-based conversations

### Teaching Methodology (ABA Principles)

**1. Discrete Trial Training (DTT) Integration**
```
SD (Discriminative Stimulus): "Touch the happy face"
Response: Child selects happy face
Consequence:
  - Correct → Immediate reinforcement (stars, animation, praise)
  - Incorrect → Corrective feedback (highlight correct answer, re-present trial)
```

**2. Errorless Learning Progression**
- **0-second delay**: Correct answer highlighted immediately (first 3 trials)
- **2-second delay**: Highlighting after 2 seconds (next 5 trials)
- **5-second delay**: Independent responding (mastery phase)
- **No prompt**: Maintenance trials (post-mastery)

**3. Naturalistic Teaching Opportunities**
- After correct responses: "Yes! She's happy because she got a present. What makes YOU happy?"
- Parent involvement prompts: "Take a photo of someone in your house who looks happy"
- Generalization probes: Photos from child's daily life imported into game

**4. Data Collection (Per Trial)**
```json
{
  "trial_id": "EMO-2025-001-0142",
  "target_emotion": "happy",
  "distractors": ["sad", "angry"],
  "prompt_level": "independent",
  "response_latency_seconds": 2.3,
  "correct": true,
  "reinforcement_type": "star_animation",
  "session_id": "S-4872"
}
```

### SLP Clinical Input

**Emotion Label Hierarchy** (From Simple → Complex):
1. **Tier 1** (Ages 2-4): Happy, Sad, Angry, Scared
2. **Tier 2** (Ages 4-6): Surprised, Excited, Tired, Sick
3. **Tier 3** (Ages 6-8): Frustrated, Proud, Embarrassed, Confused, Jealous, Disappointed

**AAC Integration Requirements**:
- Core emotion vocabulary symbols (PCS, SymbolStix, Tobii Dynavox compatible)
- Voice output for each emotion label (child-friendly voice)
- Symbol + word pairing (for emerging readers)
- Touch targets: 200×200px minimum (AAC standard)

**Pragmatic Language Goals**:
- Commenting: "He looks happy!"
- Requesting information: "Why is she sad?"
- Answering questions: "How do you feel?" → "I feel excited!"

---

## 3. GAME MECHANICS

### Core Gameplay Loop

**Phase 1: Emotion Presentation** (3 seconds)
```
1. Face appears on screen (photo, illustration, or cartoon)
2. Optional audio: "Look at this face!"
3. Emotion is clearly displayed (exaggerated expression)
```

**Phase 2: Instruction** (2-5 seconds)
```
1. Audio + visual text: "Touch the [HAPPY] face"
2. AAC symbol appears next to text (for non-readers)
3. Choices appear: 2-6 face options in card format
```

**Phase 3: Child Response** (10-second timer)
```
1. Child selects one face by touch/click
2. Timer bar shows remaining time (optional, for older kids)
3. System records: selection, latency, prompt level
```

**Phase 4: Feedback** (2-4 seconds)
```
Correct Response:
  - Selected face enlarges with celebratory animation
  - Star bursts from face, added to progress bar
  - Positive audio: "Yes! That's a HAPPY face!"
  - +10 points, +1 star

Incorrect Response:
  - Selected face shakes gently (no harsh sounds)
  - Gentle audio: "Hmm, let's try again"
  - Correct face glows with pulsing border
  - Re-present same trial after 3-second delay
  - Track as "error correction trial"
```

**Phase 5: Inter-Trial Interval** (1-2 seconds)
```
1. Transition animation (face cards shuffle)
2. Progress indicator updates (+1 trial completed)
3. Next trial begins
```

### Difficulty Levels

#### **Level 1: Basic Emotions (Difficulty 2)**
**Target Skills**: C1 - Happy/Sad identification

**Setup**:
- 2 emotions only: Happy, Sad
- 10 trials per emotion (20 total)
- Large, clear facial photos
- High-contrast expressions
- 0-second prompt delay (errorless learning)

**Trial Structure**:
```
Trial 1-3: "Touch the HAPPY face" [Happy | Sad] - Correct answer glows immediately
Trial 4-6: "Touch the SAD face" [Happy | Sad] - 2-second delay before highlight
Trial 7-10: "Touch the HAPPY face" [Happy | Sad] - Independent (no prompt)
Trial 11-20: Mixed happy/sad trials - Mastery phase
```

**Mastery Criteria**: 90% accuracy on trials 7-20 (18/20 correct)

**Visual Assets**:
- 10 unique happy faces (diverse ages, genders, ethnicities)
- 10 unique sad faces (diverse representation)
- Cartoon versions of same faces (for sensory sensitivities)

#### **Level 2: Expanding Vocabulary (Difficulty 3)**
**Target Skills**: C2 - Angry/Scared identification

**Setup**:
- 4 emotions: Happy, Sad, Angry, Scared
- 8 trials per emotion (32 total)
- Reduced prompt delay (2-second delay only)
- Mix of photos and illustrations

**Trial Structure**:
```
Set 1 (Trials 1-8): Happy vs Sad (review)
Set 2 (Trials 9-16): Angry vs Scared (new skills, with prompting)
Set 3 (Trials 17-24): 4-choice mixed (Happy/Sad/Angry/Scared)
Set 4 (Trials 25-32): Mastery trials (all 4 emotions, random order)
```

**Mastery Criteria**: 85% accuracy on Set 4 (27/32 correct)

**Visual Assets**:
- 8 unique faces per emotion × 4 emotions = 32 faces
- Both photo-realistic and cartoon styles
- Age-appropriate for 3-7 year range

#### **Level 3: Full Emotion Set (Difficulty 4)**
**Target Skills**: C3 - Surprised/Excited + full vocabulary

**Setup**:
- 6 emotions: Happy, Sad, Angry, Scared, Surprised, Excited
- 6 trials per emotion (36 total)
- Independent responding (no prompts unless 2 consecutive errors)
- Contextual scenarios introduced

**Trial Structure**:
```
Set 1 (Trials 1-12): Review 4 emotions from Level 2
Set 2 (Trials 13-24): Introduce Surprised + Excited with prompting
Set 3 (Trials 25-30): 6-choice trials (all emotions)
Set 4 (Trials 31-36): Contextual trials (scenarios)
```

**Contextual Trial Example**:
```
Visual: Child at birthday party with wrapped present, big smile, hands raised
Audio: "This child just got a birthday present! How do they feel?"
Choices: [Happy | Excited | Surprised]
Correct Answer: Excited (with audio explanation: "Yes! They're EXCITED to open the present!")
```

**Mastery Criteria**: 80% accuracy on all trials (29/36 correct)

#### **Level 4-5: Advanced Skills (Difficulty 5-6)**

**Level 4: Complex Emotions**
- Add: Frustrated, Proud, Confused, Tired
- 10 emotions total
- Contextual understanding required
- "Why do you think they feel ___?" questions

**Level 5: Mixed Emotions & Empathy**
- "How would YOU feel if...?" scenarios
- Matching emotions to stories
- Identifying multiple emotions in one scenario
- Real photos from child's life (parent-uploaded)

### Controls & Interaction

**Input Methods**:
1. **Touchscreen** (Primary): Tap face cards
2. **Mouse/Trackpad**: Click face cards
3. **Keyboard**: Number keys 1-6 map to face positions
4. **Switch Access**: 2-switch scanning (compatible with jelly bean switches)
5. **Eye Gaze**: Dwell-time selection (2-second dwell on face)
6. **AAC Device**: External AAC sends selection commands via API

**Accessibility Settings**:
- Touch target size: 200×200px default, adjustable to 300×300px
- Response time limit: 10 seconds default, adjustable 5-30 seconds
- Prompt level: Auto-adjust based on performance or manual override
- Visual style: Photo-realistic, cartoon, or line drawings
- Audio: On/Off, volume control, voice pitch adjustment

---

## 4. PROGRESSION & ADAPTIVE DIFFICULTY

### Adaptive Algorithm

```csharp
public class EmotionAdaptiveDifficulty
{
    private int consecutiveCorrect = 0;
    private int consecutiveErrors = 0;
    private float sessionAccuracy = 0f;

    public DifficultyAdjustment EvaluatePerformance(TrialResult result)
    {
        if (result.correct)
        {
            consecutiveCorrect++;
            consecutiveErrors = 0;

            // Advance if mastery demonstrated
            if (consecutiveCorrect >= 5 && sessionAccuracy > 0.85f)
            {
                return DifficultyAdjustment.IncreaseEmotionCount;
            }
        }
        else
        {
            consecutiveErrors++;
            consecutiveCorrect = 0;

            // Provide more support if struggling
            if (consecutiveErrors >= 3)
            {
                return DifficultyAdjustment.AddPrompting;
            }
            else if (consecutiveErrors >= 2)
            {
                return DifficultyAdjustment.ReduceChoices;
            }
        }

        return DifficultyAdjustment.None;
    }

    public enum DifficultyAdjustment
    {
        None,
        ReduceChoices,      // 6 emotions → 4 emotions
        AddPrompting,       // Independent → 2-second prompt
        IncreaseEmotionCount, // 2 emotions → 4 emotions
        AddContextual       // Simple ID → contextual understanding
    }
}
```

### Reinforcement Schedule

**Variable Ratio (VR-3 average)**:
- Stars awarded on: 1st, 3rd, 4th, 7th, 9th, 12th... correct responses
- Unpredictable timing maintains motivation
- Special animations every 5th star collected

**Token Economy**:
- 10 stars = 1 gem
- 5 gems = Unlock new face set (cultural, animals, characters)
- 20 gems = Unlock self-reflection mode (take photo of your own emotions)

---

## 5. VISUAL & AUDIO DESIGN

### Visual Assets Required

#### **Facial Expression Photos** (Priority: High)
```
Emotion Set 1 (Level 1):
- EMO-PHO-001 through EMO-PHO-020: Happy faces (10), Sad faces (10)
  - Ages: Toddler (2), Child (4), Teen (2), Adult (2) per emotion
  - Ethnicities: Caucasian (2), Black (2), Asian (2), Latino (2), Middle Eastern (2)
  - Genders: Mix of boys/girls, men/women
  - Specifications: 1024×1024px, PNG, clear face visible, neutral background

Emotion Set 2 (Level 2):
- EMO-PHO-021 through EMO-PHO-052: Angry (8), Scared (8), + Happy/Sad alternatives (16)

Emotion Set 3 (Level 3):
- EMO-PHO-053 through EMO-PHO-100: Surprised (8), Excited (8), + full set alternatives

Total Photos Needed: 100 facial expressions
```

#### **Cartoon Face Illustrations** (Alternative Style)
```
- EMO-CART-001 through EMO-CART-100: Cartoon versions of all 100 faces
- Style: Simple, exaggerated features (big eyes, clear mouth shapes)
- Color palette: Warm, autism-friendly (no harsh reds/bright yellows)
- Specifications: Vector SVG preferred, 1024×1024px raster fallback
```

#### **Emotion Icons/Symbols**
```
- EMO-ICON-001: Happy (yellow circle with big smile)
- EMO-ICON-002: Sad (blue circle with downturned mouth)
- EMO-ICON-003: Angry (red circle with furrowed brows)
- EMO-ICON-004: Scared (purple circle with wide eyes, open mouth)
- EMO-ICON-005: Surprised (orange circle with raised eyebrows, O mouth)
- EMO-ICON-006: Excited (green circle with big smile, sparkles)
- Specifications: 256×256px, transparent background, AAC-compatible
```

#### **UI Elements**
```
- EMO-UI-001: Emotion card frame (rounded rectangle, subtle shadow)
- EMO-UI-002: Selected card highlight (thick border, glow effect)
- EMO-UI-003: Correct answer animation (star burst, particle effects)
- EMO-UI-004: Progress bar segments (0-100%, color-coded)
- EMO-UI-005: World map with 5 "emotion islands"
- EMO-UI-006: Timer bar (optional, for older learners)
```

#### **Contextual Scenario Backgrounds**
```
- EMO-BG-001: Birthday party (balloons, cake, presents)
- EMO-BG-002: Playground (swings, slide, sandbox)
- EMO-BG-003: Classroom (desks, chalkboard, books)
- EMO-BG-004: Home living room (couch, TV, toys)
- EMO-BG-005: Doctor's office (exam table, medical equipment)
- Specifications: 1920×1080px, muted colors (not distracting from faces)
```

### Audio Assets

#### **Voice-Over Instructions**
```
- EMO-VO-001: "Touch the HAPPY face" (warm, friendly child voice)
- EMO-VO-002: "Touch the SAD face"
- EMO-VO-003: "Touch the ANGRY face"
- EMO-VO-004: "Touch the SCARED face"
- EMO-VO-005: "Touch the SURPRISED face"
- EMO-VO-006: "Touch the EXCITED face"
- EMO-VO-007: "How does this person feel?"
- EMO-VO-008: "Why do you think they feel ___?"
```

#### **Feedback Audio**
```
- EMO-SFX-001: Correct answer (cheerful chime, ascending notes)
- EMO-SFX-002: Incorrect (gentle "hmm" sound, non-punitive)
- EMO-SFX-003: Star collected (sparkle sound)
- EMO-SFX-004: Level complete (triumphant fanfare, 3 seconds)
- EMO-SFX-005: Gem unlocked (magical shimmer sound)
```

#### **Background Music**
```
- EMO-MUS-001: Calm exploration theme (60 BPM, major key, light instrumentation)
- EMO-MUS-002: Celebration theme (plays on level completion)
- Specifications: Looping, no sudden volume changes, LUFS -16 to -18
```

---

## 6. TECHNICAL IMPLEMENTATION

### Unity Architecture

```csharp
// ==========================================
// EMOTION RECOGNITION MANAGER
// ==========================================
using UnityEngine;
using System.Collections.Generic;
using System.Linq;

public class EmotionRecognitionManager : MonoBehaviour
{
    [Header("Game Settings")]
    public int emotionCount = 2; // Start with 2 emotions
    public float trialTimeLimit = 10f;
    public PromptLevel currentPromptLevel = PromptLevel.Errorless;

    [Header("References")]
    public EmotionCardDisplay[] emotionCards;
    public AudioSource voiceOverSource;
    public AudioSource feedbackSource;
    public UIProgressBar progressBar;
    public ParticleSystem correctParticles;

    [Header("Data")]
    public EmotionDatabase emotionDatabase;
    private SessionData currentSession;
    private List<TrialData> trials = new List<TrialData>();
    private int currentTrialIndex = 0;
    private float trialStartTime;

    private EmotionAdaptiveDifficulty adaptiveSystem;

    void Start()
    {
        adaptiveSystem = new EmotionAdaptiveDifficulty();
        currentSession = new SessionData
        {
            sessionId = System.Guid.NewGuid().ToString(),
            startTime = System.DateTime.UtcNow,
            userId = PlayerDataManager.Instance.CurrentUserId,
            gameName = "Emotion Recognition"
        };

        GenerateTrials();
        StartTrial();
    }

    void GenerateTrials()
    {
        // Get emotions appropriate for current difficulty level
        List<EmotionType> activeEmotions = GetActiveEmotions(emotionCount);

        // Create 10 trials per active emotion
        foreach (EmotionType emotion in activeEmotions)
        {
            for (int i = 0; i < 10; i++)
            {
                trials.Add(new TrialData
                {
                    targetEmotion = emotion,
                    distractorEmotions = GetDistractors(emotion, emotionCount - 1),
                    emotionImage = emotionDatabase.GetRandomImage(emotion),
                    promptLevel = currentPromptLevel
                });
            }
        }

        // Shuffle trials for random presentation
        trials = trials.OrderBy(x => Random.value).ToList();
    }

    List<EmotionType> GetActiveEmotions(int count)
    {
        // Emotion hierarchy: Happy/Sad → Angry/Scared → Surprised/Excited
        List<EmotionType> hierarchy = new List<EmotionType>
        {
            EmotionType.Happy,
            EmotionType.Sad,
            EmotionType.Angry,
            EmotionType.Scared,
            EmotionType.Surprised,
            EmotionType.Excited
        };

        return hierarchy.Take(count).ToList();
    }

    List<EmotionType> GetDistractors(EmotionType target, int distractorCount)
    {
        List<EmotionType> allEmotions = GetActiveEmotions(emotionCount);
        allEmotions.Remove(target);
        return allEmotions.OrderBy(x => Random.value).Take(distractorCount).ToList();
    }

    void StartTrial()
    {
        if (currentTrialIndex >= trials.Count)
        {
            EndSession();
            return;
        }

        TrialData trial = trials[currentTrialIndex];
        trialStartTime = Time.time;

        // Display emotion cards
        List<EmotionType> allEmotionsThisTrial = new List<EmotionType>(trial.distractorEmotions);
        allEmotionsThisTrial.Add(trial.targetEmotion);
        allEmotionsThisTrial = allEmotionsThisTrial.OrderBy(x => Random.value).ToList();

        for (int i = 0; i < emotionCards.Length; i++)
        {
            if (i < allEmotionsThisTrial.Count)
            {
                emotionCards[i].SetEmotion(
                    allEmotionsThisTrial[i],
                    emotionDatabase.GetRandomImage(allEmotionsThisTrial[i])
                );
                emotionCards[i].gameObject.SetActive(true);
                emotionCards[i].OnSelected += OnEmotionSelected;
            }
            else
            {
                emotionCards[i].gameObject.SetActive(false);
            }
        }

        // Play instruction audio
        PlayInstruction(trial.targetEmotion);

        // Apply prompting if needed
        if (trial.promptLevel == PromptLevel.Errorless)
        {
            StartCoroutine(HighlightCorrectAnswer(0f, trial.targetEmotion));
        }
        else if (trial.promptLevel == PromptLevel.Delayed2Second)
        {
            StartCoroutine(HighlightCorrectAnswer(2f, trial.targetEmotion));
        }

        // Start timer
        StartCoroutine(TrialTimer(trial));
    }

    void PlayInstruction(EmotionType emotion)
    {
        AudioClip instruction = emotionDatabase.GetInstructionAudio(emotion);
        voiceOverSource.clip = instruction;
        voiceOverSource.Play();
    }

    IEnumerator<WaitForSeconds> HighlightCorrectAnswer(float delay, EmotionType correctEmotion)
    {
        yield return new WaitForSeconds(delay);

        foreach (EmotionCardDisplay card in emotionCards)
        {
            if (card.CurrentEmotion == correctEmotion)
            {
                card.ShowPrompt();
            }
        }
    }

    IEnumerator<WaitForSeconds> TrialTimer(TrialData trial)
    {
        float elapsed = 0f;
        while (elapsed < trialTimeLimit)
        {
            elapsed += Time.deltaTime;
            // Update UI timer if enabled
            yield return null;
        }

        // Time expired - record as no response and retry
        RecordTrial(trial, false, trialTimeLimit, null);
        RetryTrial();
    }

    void OnEmotionSelected(EmotionType selected)
    {
        StopAllCoroutines(); // Stop timer

        TrialData trial = trials[currentTrialIndex];
        float responseLatency = Time.time - trialStartTime;
        bool correct = (selected == trial.targetEmotion);

        RecordTrial(trial, correct, responseLatency, selected);

        if (correct)
        {
            GiveCorrectFeedback();

            // Check if difficulty adjustment needed
            var adjustment = adaptiveSystem.EvaluatePerformance(new TrialResult { correct = true });
            ApplyDifficultyAdjustment(adjustment);

            // Move to next trial after delay
            Invoke("NextTrial", 2f);
        }
        else
        {
            GiveIncorrectFeedback(trial.targetEmotion);

            // Check if support needed
            var adjustment = adaptiveSystem.EvaluatePerformance(new TrialResult { correct = false });
            ApplyDifficultyAdjustment(adjustment);

            // Retry same trial after delay
            Invoke("RetryTrial", 3f);
        }
    }

    void GiveCorrectFeedback()
    {
        feedbackSource.clip = emotionDatabase.correctSound;
        feedbackSource.Play();
        correctParticles.Play();

        // Award star
        PlayerDataManager.Instance.AddStars(1);
        progressBar.IncrementProgress();
    }

    void GiveIncorrectFeedback(EmotionType correctAnswer)
    {
        feedbackSource.clip = emotionDatabase.incorrectSound;
        feedbackSource.Play();

        // Highlight correct answer
        foreach (EmotionCardDisplay card in emotionCards)
        {
            if (card.CurrentEmotion == correctAnswer)
            {
                card.PulseHighlight();
            }
        }
    }

    void RecordTrial(TrialData trial, bool correct, float latency, EmotionType? selected)
    {
        trial.correct = correct;
        trial.responseLatency = latency;
        trial.selectedEmotion = selected;
        trial.timestamp = System.DateTime.UtcNow;

        // Send to backend API
        APIManager.Instance.RecordTrial(currentSession.sessionId, trial);
    }

    void ApplyDifficultyAdjustment(DifficultyAdjustment adjustment)
    {
        switch (adjustment)
        {
            case DifficultyAdjustment.ReduceChoices:
                emotionCount = Mathf.Max(2, emotionCount - 1);
                Debug.Log($"Difficulty reduced: Now using {emotionCount} emotions");
                break;

            case DifficultyAdjustment.AddPrompting:
                currentPromptLevel = PromptLevel.Delayed2Second;
                Debug.Log("Adding prompting support");
                break;

            case DifficultyAdjustment.IncreaseEmotionCount:
                emotionCount = Mathf.Min(6, emotionCount + 1);
                Debug.Log($"Difficulty increased: Now using {emotionCount} emotions");
                break;
        }
    }

    void NextTrial()
    {
        currentTrialIndex++;
        StartTrial();
    }

    void RetryTrial()
    {
        // Mark as error correction trial
        trials[currentTrialIndex].isErrorCorrection = true;
        StartTrial();
    }

    void EndSession()
    {
        currentSession.endTime = System.DateTime.UtcNow;
        currentSession.totalTrials = trials.Count;
        currentSession.correctTrials = trials.Count(t => t.correct);
        currentSession.accuracy = (float)currentSession.correctTrials / currentSession.totalTrials;

        // Send session summary to backend
        APIManager.Instance.EndSession(currentSession);

        // Show results screen
        GameManager.Instance.ShowResultsScreen(currentSession);
    }
}

// ==========================================
// DATA STRUCTURES
// ==========================================

public enum EmotionType
{
    Happy,
    Sad,
    Angry,
    Scared,
    Surprised,
    Excited,
    Frustrated,
    Proud,
    Confused,
    Tired
}

public enum PromptLevel
{
    Errorless,      // 0-second delay, immediate highlight
    Delayed2Second, // 2-second delay before highlight
    Delayed5Second, // 5-second delay
    Independent     // No prompting
}

[System.Serializable]
public class TrialData
{
    public EmotionType targetEmotion;
    public List<EmotionType> distractorEmotions;
    public Sprite emotionImage;
    public PromptLevel promptLevel;
    public bool correct;
    public float responseLatency;
    public EmotionType? selectedEmotion;
    public System.DateTime timestamp;
    public bool isErrorCorrection = false;
}

[System.Serializable]
public class SessionData
{
    public string sessionId;
    public string userId;
    public string gameName;
    public System.DateTime startTime;
    public System.DateTime endTime;
    public int totalTrials;
    public int correctTrials;
    public float accuracy;
    public int emotionSetSize; // 2, 4, 6 emotions
}
```

---

## 7. DATA TRACKING & ANALYTICS

### Per-Trial Data Collection

```json
{
  "trial_id": "EMO-2025-10-12-0001",
  "session_id": "S-4872",
  "user_id": "U-1234",
  "game_name": "Emotion Recognition",
  "timestamp": "2025-10-12T14:32:18Z",
  "target_emotion": "happy",
  "distractor_emotions": ["sad", "angry"],
  "emotion_count": 3,
  "prompt_level": "independent",
  "response": "happy",
  "correct": true,
  "response_latency_seconds": 2.3,
  "is_error_correction": false,
  "ABLLS_R_code": "C1",
  "reinforcement_delivered": "star_animation"
}
```

### Session Summary

```json
{
  "session_id": "S-4872",
  "user_id": "U-1234",
  "start_time": "2025-10-12T14:30:00Z",
  "end_time": "2025-10-12T14:38:45Z",
  "duration_minutes": 8.75,
  "total_trials": 30,
  "correct_trials": 26,
  "accuracy": 0.867,
  "emotion_breakdown": {
    "happy": {"trials": 10, "correct": 9, "accuracy": 0.90},
    "sad": {"trials": 10, "correct": 9, "accuracy": 0.90},
    "angry": {"trials": 10, "correct": 8, "accuracy": 0.80}
  },
  "avg_response_latency": 2.8,
  "adaptive_adjustments": [
    {"timestamp": "2025-10-12T14:35:00Z", "adjustment": "increase_emotion_count"}
  ],
  "stars_earned": 26,
  "level_completed": 2,
  "next_recommended_level": 3
}
```

### Progress Tracking (PostgreSQL Schema)

```sql
CREATE TABLE emotion_recognition_progress (
  user_id UUID REFERENCES users(id),
  emotion_type VARCHAR(20),
  current_phase VARCHAR(20), -- 'acquisition', 'mastery', 'maintenance'
  total_trials INT DEFAULT 0,
  correct_trials INT DEFAULT 0,
  current_accuracy DECIMAL(4,3),
  last_session_date TIMESTAMP,
  mastery_date TIMESTAMP,
  ABLLS_R_code VARCHAR(10),
  PRIMARY KEY (user_id, emotion_type)
);

CREATE TABLE emotion_recognition_sessions (
  session_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  total_trials INT,
  correct_trials INT,
  accuracy DECIMAL(4,3),
  emotion_count INT, -- 2, 4, or 6
  prompt_level VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE emotion_recognition_trials (
  trial_id UUID PRIMARY KEY,
  session_id UUID REFERENCES emotion_recognition_sessions(session_id),
  timestamp TIMESTAMP NOT NULL,
  target_emotion VARCHAR(20),
  distractor_emotions TEXT[], -- Array of emotion names
  correct BOOLEAN,
  response_latency DECIMAL(5,2),
  selected_emotion VARCHAR(20),
  is_error_correction BOOLEAN DEFAULT FALSE,
  ABLLS_R_code VARCHAR(10)
) PARTITION BY RANGE (timestamp);
```

---

## 8. ACCESSIBILITY & ACCOMMODATIONS

### WCAG 2.1 AA Compliance

**Perceivable**:
- ✅ **1.1.1 Non-text Content**: All emotion faces have alt text ("Happy child smiling")
- ✅ **1.4.3 Contrast**: Text-to-background ratio 4.5:1 minimum
- ✅ **1.4.11 Non-text Contrast**: Emotion card borders 3:1 contrast
- ✅ **1.4.12 Text Spacing**: Line height 1.5x, letter spacing adjustable

**Operable**:
- ✅ **2.1.1 Keyboard**: Full keyboard navigation (Tab, Enter, numbers 1-6)
- ✅ **2.4.7 Focus Visible**: Clear focus indicator (3px blue border)
- ✅ **2.5.5 Target Size**: Touch targets 200×200px minimum

**Understandable**:
- ✅ **3.1.1 Language of Page**: HTML lang="en"
- ✅ **3.2.1 On Focus**: No automatic changes when cards receive focus

**Robust**:
- ✅ **4.1.2 Name, Role, Value**: ARIA labels on all interactive elements

### Autism-Specific Accommodations

**Sensory Sensitivities**:
1. **Visual Overload Reduction**:
   - Calm mode: Reduce animation speed by 50%
   - High contrast mode: Black/white faces only
   - Minimal UI: Hide timer, reduce decorations

2. **Auditory Sensitivities**:
   - Volume control: 0-100% in 10% increments
   - Voice pitch adjustment: -20% to +20%
   - Mute option: Visual-only mode

3. **Vestibular/Motion**:
   - Reduce motion: Disable particle effects, subtle transitions only

**Executive Function Support**:
- Visual schedule: "First 10 faces, then break, then 10 more"
- Progress indicators: "5 out of 10 done!"
- Predictable structure: Same trial format every time

**Communication Support**:
- AAC integration: Import child's personal AAC vocabulary
- Pause button: Child can request break using AAC
- Parent join mode: Parent can provide live prompts

---

## 9. TESTING & VALIDATION

### Unit Tests

```csharp
[Test]
public void TestEmotionSelection_Correct()
{
    // Arrange
    EmotionRecognitionManager manager = new EmotionRecognitionManager();
    manager.GenerateTrials();
    TrialData trial = manager.GetCurrentTrial();

    // Act
    manager.OnEmotionSelected(trial.targetEmotion);

    // Assert
    Assert.IsTrue(trial.correct);
    Assert.AreEqual(1, manager.GetStarsEarned());
}

[Test]
public void TestAdaptiveDifficulty_Increase()
{
    // Arrange
    EmotionAdaptiveDifficulty adaptive = new EmotionAdaptiveDifficulty();

    // Act: Simulate 5 consecutive correct responses
    for (int i = 0; i < 5; i++)
    {
        adaptive.EvaluatePerformance(new TrialResult { correct = true });
    }

    // Assert
    var adjustment = adaptive.EvaluatePerformance(new TrialResult { correct = true });
    Assert.AreEqual(DifficultyAdjustment.IncreaseEmotionCount, adjustment);
}
```

### Clinical Validation Protocol

**Phase 1: BCBA Review** (Day 1-2)
- [ ] Review all ABLLS-R skill mappings (C1-C5)
- [ ] Verify teaching hierarchy (errorless → independent)
- [ ] Approve reinforcement schedule (VR-3)
- [ ] Confirm data collection aligns with ABA standards
- **Sign-off Required**: BCBA-001

**Phase 2: SLP Review** (Day 2-3)
- [ ] Verify emotion label hierarchy (Tier 1 → 2 → 3)
- [ ] Approve AAC symbol integration
- [ ] Confirm voice-over scripts (child-friendly language)
- [ ] Test pragmatic language prompts ("Why do you think...?")
- **Sign-off Required**: SLP-001

**Phase 3: Autistic Advocate Review** (Day 3-4)
- [ ] Ensure no emotion-policing language (e.g., avoid "You should feel happy")
- [ ] Verify representation (diverse faces, neurodiverse-affirming)
- [ ] Confirm no forced eye contact requirements
- [ ] Check self-regulation supports (pause button accessible)
- **Sign-off Required**: ADVOCATE-001 (VETO POWER)

**Phase 4: Parent Testing** (Day 5-7)
- [ ] Test with 5 beta families
- [ ] Collect usability feedback
- [ ] Verify generalization (child recognizes emotions in real life)
- [ ] Measure engagement (>5 min sustained attention)
- **Threshold**: 4/5 families report positive experience

---

## 10. LAUNCH & POST-LAUNCH

### Success Metrics

**Clinical Effectiveness**:
- **Primary**: 80%+ of children show improvement in emotion identification (pre/post assessment)
- **Secondary**: Average 1.5 new emotions mastered per week
- **Generalization**: 70%+ parents report child identifying emotions in daily life

**Engagement**:
- **Average Session**: 7+ minutes
- **Completion Rate**: 75%+ of children complete 10+ trials per session
- **Retention**: 60%+ of children return for 3+ sessions in first week

**Accessibility**:
- **Zero** critical WCAG violations reported
- **90%+** of children with motor disabilities can access using switch/eye gaze
- **100%** of AAC users can participate via device integration

### Post-Launch Monitoring

**Week 1-2**: Bug fixes, UX adjustments
**Week 3-4**: Analyze data for emotion-specific difficulties (e.g., if "scared" has <70% accuracy, add more training)
**Month 2**: Add advanced emotions (frustrated, proud) based on user progression
**Month 3**: Add parent-upload photo feature (recognize emotions in family photos)

---

## 11. TEAM & TIMELINE

### Team Composition
- **Game Developer** (GAME-001): Lead developer, Unity implementation
- **SLP** (SLP-001): Clinical validation, emotion hierarchy
- **BCBA** (BCBA-001): ABA methodology, data systems
- **Frontend Developer** (FRONT-001): UI/UX, accessibility
- **Illustrator/Designer** (ARTIST-001): 100 facial expressions, emotion icons
- **QA Engineer** (QA-001): Testing, WCAG compliance
- **Project Manager** (PM-001): Coordination, timeline management

### Development Timeline (20 days)

**Week 1 (Days 1-5): Design & Validation**
- Day 1: BCBA review of GDD
- Day 2: SLP review + AAC planning
- Day 3: Autistic Advocate review
- Day 4: Final GDD approval, asset list finalized
- Day 5: AI resource generation begins (100 facial expressions via FLUX/DALL-E)

**Week 2 (Days 6-10): Core Development**
- Day 6-7: Unity game mechanics implementation
- Day 8-9: Adaptive difficulty system, data tracking
- Day 10: Integration with backend API

**Week 3 (Days 11-15): Polish & Testing**
- Day 11-12: UI/UX refinement, accessibility testing
- Day 13: QA testing (automated + manual)
- Day 14: Bug fixes
- Day 15: Clinical review of prototype

**Week 4 (Days 16-20): Beta Testing**
- Day 16-19: Beta testing with 5 families
- Day 20: Final adjustments, launch preparation

**Total: 20 days** (4 weeks)

---

## 12. CONCLUSION

### Summary
**Emotion Recognition: Feelings Explorer** is a clinically-validated, autism-specific game designed to teach emotion identification from basic (happy/sad) to complex emotions (frustrated, proud). With adaptive difficulty, errorless learning, AAC integration, and comprehensive data tracking, this game provides a systematic approach to developing critical social-emotional understanding.

### Key Innovations
1. **Adaptive Emotion Count**: Automatically adjusts between 2-6 emotions based on performance
2. **Errorless Learning Protocol**: Prevents frustration, builds confidence
3. **AAC-First Design**: Non-verbal learners fully supported from day one
4. **Contextual Understanding**: Goes beyond simple matching to "Why are they happy?"
5. **Real-World Generalization**: Parent prompts + photo uploads bridge game → life

### Clinical Impact
- **Target**: 80% of children improve emotion identification by 2+ emotions within 4 weeks
- **Data-Driven**: Every trial tracked, progress visible to parents/therapists
- **Evidence-Based**: Built on ABA principles (DTT, errorless learning, VR reinforcement)

### Next Steps
1. **Immediate**: BCBA/SLP/Advocate review of this GDD
2. **Week 1**: Begin asset generation (100 facial expressions)
3. **Week 2-3**: Unity development
4. **Week 4**: Beta testing

**Document Status**: ✅ Complete, Ready for Review
**Estimated Development Cost**: $12,000-18,000 (20 days × team rates)
**Expected ROI**: High (foundational skill for 100% of autistic children)

---

**END OF GAME DESIGN DOCUMENT**

*This document is a living specification and will be updated based on clinical review feedback and beta testing results.*
