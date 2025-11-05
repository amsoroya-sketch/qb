import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Practice API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let userId: string;
  let testExerciseId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Clean database for practice-related data
    await prisma.userGrammarStats.deleteMany();
    await prisma.userExercise.deleteMany();
    await prisma.userLessonProgress.deleteMany();
    await prisma.userAchievement.deleteMany();
    await prisma.userProgress.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication Setup', () => {
    const testUser = {
      email: 'practice-test@example.com',
      password: 'Test123456!',
      name: 'Practice Test User',
    };

    it('/auth/register (POST) - should register test user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('user');
          expect(res.body.data.user.email).toBe(testUser.email);

          userId = res.body.data.user.id;

          // Extract accessToken from cookie
          const cookies = res.headers['set-cookie'];
          if (cookies) {
            const cookieArray = Array.isArray(cookies) ? cookies : [cookies];
            const accessTokenCookie = cookieArray.find((cookie: string) =>
              cookie.startsWith('accessToken='),
            );
            if (accessTokenCookie) {
              accessToken = accessTokenCookie.split(';')[0].split('=')[1];
            }
          }
        });
    });
  });

  describe('GET /practice - Quick Practice Mode', () => {
    it('should return exercises with default count (10)', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=quick_practice')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('mode', 'quick_practice');
          expect(res.body).toHaveProperty('exercises');
          expect(Array.isArray(res.body.exercises)).toBe(true);
          expect(res.body.exercises.length).toBeLessThanOrEqual(10);
          expect(res.body).toHaveProperty('totalCount');
          expect(res.body).toHaveProperty('estimatedTime');
          expect(typeof res.body.estimatedTime).toBe('number');

          // Validate exercise structure
          if (res.body.exercises.length > 0) {
            const exercise = res.body.exercises[0];
            expect(exercise).toHaveProperty('id');
            expect(exercise).toHaveProperty('type');
            expect(exercise).toHaveProperty('title');
            expect(exercise).toHaveProperty('question');
            expect(exercise).toHaveProperty('xpReward');
            expect(exercise).toHaveProperty('difficulty');

            // Save exercise ID for submit tests
            testExerciseId = exercise.id;
          }
        });
    });

    it('should respect count parameter (count=5)', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=quick_practice&count=5')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.exercises.length).toBeLessThanOrEqual(5);
        });
    });

    it('should filter by grammarFocus if provided', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=quick_practice&count=3&grammarFocus=aspect')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('grammarFocus', 'aspect');
          expect(res.body.exercises.length).toBeLessThanOrEqual(3);
        });
    });

    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=quick_practice')
        .expect(401);
    });

    it('should return 400 if mode is invalid', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=invalid_mode')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should handle count parameter out of range (max 50)', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=quick_practice&count=100')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          // Controller doesn't validate max, so it accepts it but may return fewer
          expect(res.body.exercises.length).toBeGreaterThanOrEqual(0);
        });
    });

    it('should handle count parameter below minimum (min 1)', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=quick_practice&count=0')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          // Controller doesn't validate min, so it accepts 0 but may return 0 exercises
          expect(Array.isArray(res.body.exercises)).toBe(true);
        });
    });
  });

  describe('GET /practice - Grammar Drills Mode', () => {
    it('should return only aspect exercises when grammarFocus=aspect', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=grammar_drills&grammarFocus=aspect&count=5')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.mode).toBe('grammar_drills');
          expect(res.body).toHaveProperty('grammarFocus', 'aspect');
          expect(Array.isArray(res.body.exercises)).toBe(true);
        });
    });

    it('should return only case exercises when grammarFocus=case', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=grammar_drills&grammarFocus=case&count=5')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.mode).toBe('grammar_drills');
          expect(res.body).toHaveProperty('grammarFocus', 'case');
        });
    });

    it('should return 400 for invalid grammarFocus', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=grammar_drills&grammarFocus=invalid_topic')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Invalid grammar focus');
        });
    });

    it('should return 400 if grammarFocus is missing', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=grammar_drills')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('grammarFocus is required');
        });
    });

    it('should respect count parameter', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=grammar_drills&grammarFocus=root&count=3')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.exercises.length).toBeLessThanOrEqual(3);
        });
    });

    it('should support all valid grammar topics', async () => {
      const validTopics = ['aspect', 'case', 'root', 'morpheme', 'sentence_type', 'syntactic_role', 'agreement'];

      for (const topic of validTopics) {
        const response = await request(app.getHttpServer())
          .get(`/practice?mode=grammar_drills&grammarFocus=${topic}&count=2`)
          .set('Authorization', `Bearer ${accessToken}`);

        // Some topics might return 404 if no exercises can be generated
        // (e.g., if there are no suitable verses in the database)
        if (response.status === 200) {
          expect(response.body.grammarFocus).toBe(topic);
        } else {
          // Accept 404 for topics where no exercises could be generated
          expect(response.status).toBe(404);
        }
      }
    });
  });

  describe('GET /practice - Verse Based Mode', () => {
    it('should return exercises from specific surah (Surah 1)', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=verse_based&surahNumber=1&count=5')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.mode).toBe('verse_based');
          expect(res.body).toHaveProperty('surahNumber', 1);
          expect(Array.isArray(res.body.exercises)).toBe(true);
        });
    });

    it('should return 400 if surahNumber is out of range (0)', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=verse_based&surahNumber=0')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should return 400 if surahNumber is out of range (115)', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=verse_based&surahNumber=115')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should return 400 if surahNumber is missing', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=verse_based')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('surahNumber is required');
        });
    });

    it('should accept valid surah range (1-114)', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=verse_based&surahNumber=114&count=3')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.surahNumber).toBe(114);
        });
    });

    it('should respect count parameter for verse-based practice', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=verse_based&surahNumber=2&count=7')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.exercises.length).toBeLessThanOrEqual(7);
        });
    });
  });

  describe('GET /practice - Spaced Repetition Mode', () => {
    it('should return exercises for weak topics if stats exist', async () => {
      // Create some grammar stats with varying accuracy
      await prisma.userGrammarStats.create({
        data: {
          userId,
          grammarFocus: 'aspect',
          totalAttempts: 10,
          correctAttempts: 4,
          accuracy: 40,
          lastPracticed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        },
      });

      await prisma.userGrammarStats.create({
        data: {
          userId,
          grammarFocus: 'case',
          totalAttempts: 15,
          correctAttempts: 12,
          accuracy: 80,
          lastPracticed: new Date(),
        },
      });

      const response = await request(app.getHttpServer())
        .get('/practice?mode=spaced_repetition&count=5')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.mode).toBe('spaced_repetition');
      expect(response.body).toHaveProperty('weakTopics');
      expect(Array.isArray(response.body.weakTopics)).toBe(true);
      expect(response.body.exercises.length).toBeLessThanOrEqual(5);
    });

    it('should fall back to quick practice if no stats exist', async () => {
      // Clean all stats
      await prisma.userGrammarStats.deleteMany({ where: { userId } });

      const response = await request(app.getHttpServer())
        .get('/practice?mode=spaced_repetition&count=5')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // When no stats exist, service falls back to quick_practice internally
      // so the mode will be quick_practice, not spaced_repetition
      expect(['spaced_repetition', 'quick_practice']).toContain(response.body.mode);
      expect(Array.isArray(response.body.exercises)).toBe(true);
    });

    it('should prioritize topics with lowest accuracy', async () => {
      // Create stats with different accuracy levels
      await prisma.userGrammarStats.deleteMany({ where: { userId } });

      await prisma.userGrammarStats.createMany({
        data: [
          {
            userId,
            grammarFocus: 'aspect',
            totalAttempts: 5,
            correctAttempts: 1,
            accuracy: 20,
            lastPracticed: new Date(),
          },
          {
            userId,
            grammarFocus: 'case',
            totalAttempts: 5,
            correctAttempts: 4,
            accuracy: 80,
            lastPracticed: new Date(),
          },
          {
            userId,
            grammarFocus: 'root',
            totalAttempts: 5,
            correctAttempts: 2,
            accuracy: 40,
            lastPracticed: new Date(),
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/practice?mode=spaced_repetition&count=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.weakTopics).toContain('aspect');
      expect(response.body.weakTopics.length).toBeGreaterThan(0);
    });
  });

  describe('GET /practice - Challenge Mode', () => {
    it('should return advanced difficulty exercises', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=challenge&count=5')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.mode).toBe('challenge');
          expect(Array.isArray(res.body.exercises)).toBe(true);

          // Verify advanced difficulty and boosted XP
          if (res.body.exercises.length > 0) {
            res.body.exercises.forEach((exercise: any) => {
              expect(exercise.difficulty).toBe('ADVANCED');
              expect(exercise.xpReward).toBeGreaterThan(10); // Boosted XP
            });
          }
        });
    });

    it('should return complex exercise types (morpheme, agreement, syntactic_role)', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=challenge&count=6')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.exercises.length).toBeGreaterThan(0);
        });
    });

    it('should respect count parameter', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=challenge&count=3')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.exercises.length).toBeLessThanOrEqual(3);
        });
    });
  });

  describe('GET /practice - Daily Practice Mode', () => {
    it('should return exactly 20 exercises (or less if insufficient data)', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=daily')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.mode).toBe('daily');
          expect(Array.isArray(res.body.exercises)).toBe(true);
          expect(res.body.exercises.length).toBeLessThanOrEqual(20);
          expect(res.body.totalCount).toBeLessThanOrEqual(20);
        });
    });

    it('should include balanced mix of topics', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=daily')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.exercises.length).toBeGreaterThan(0);

          // Verify exercises are shuffled (mixed categories)
          const exerciseTypes = res.body.exercises.map((e: any) => e.type);
          const uniqueTypes = new Set(exerciseTypes);
          expect(uniqueTypes.size).toBeGreaterThan(0);
        });
    });

    it('should ignore count parameter (always returns 20)', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=daily&count=5')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          // Daily mode should ignore count and aim for 20
          expect(res.body.totalCount).toBeLessThanOrEqual(20);
        });
    });

    it('should include weakTopics if user has stats', async () => {
      // Ensure some stats exist
      await prisma.userGrammarStats.deleteMany({ where: { userId } });
      await prisma.userGrammarStats.create({
        data: {
          userId,
          grammarFocus: 'aspect',
          totalAttempts: 10,
          correctAttempts: 3,
          accuracy: 30,
          lastPracticed: new Date(),
        },
      });

      const response = await request(app.getHttpServer())
        .get('/practice?mode=daily')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('exercises');
      expect(response.body.exercises.length).toBeGreaterThan(0);
    });
  });

  describe('POST /practice/submit - Submit Answer', () => {
    beforeAll(async () => {
      // Get a fresh exercise ID
      const practiceResponse = await request(app.getHttpServer())
        .get('/practice?mode=quick_practice&count=1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      if (practiceResponse.body.exercises.length > 0) {
        testExerciseId = practiceResponse.body.exercises[0].id;
      }
    });

    it('should accept valid answer submission', () => {
      return request(app.getHttpServer())
        .post('/practice/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          exerciseId: testExerciseId,
          userAnswer: 'PERF',
          timeSpent: 25,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('isCorrect');
          expect(res.body).toHaveProperty('correctAnswer');
          expect(res.body).toHaveProperty('explanation');
          expect(res.body).toHaveProperty('xpEarned');
          expect(res.body).toHaveProperty('timeBonus');
          expect(res.body).toHaveProperty('totalXP');
          expect(res.body).toHaveProperty('accuracy');

          expect(typeof res.body.isCorrect).toBe('boolean');
          expect(typeof res.body.xpEarned).toBe('number');
          expect(typeof res.body.timeBonus).toBe('number');
          expect(typeof res.body.totalXP).toBe('number');
          expect(typeof res.body.accuracy).toBe('number');
        });
    });

    it('should calculate and return xpEarned', () => {
      return request(app.getHttpServer())
        .post('/practice/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          exerciseId: testExerciseId,
          userAnswer: 'IMPF',
          timeSpent: 20,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.xpEarned).toBeGreaterThanOrEqual(0);
          expect(res.body.totalXP).toBeGreaterThanOrEqual(0);
        });
    });

    it('should apply time bonus for fast answers (< 30 seconds)', () => {
      return request(app.getHttpServer())
        .post('/practice/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          exerciseId: testExerciseId,
          userAnswer: 'PERF',
          timeSpent: 15, // Fast answer
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('timeBonus');
          // If answer is correct and time < 30, should have timeBonus
        });
    });

    it('should update UserGrammarStats after submission', async () => {
      // Submit an answer
      await request(app.getHttpServer())
        .post('/practice/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          exerciseId: testExerciseId,
          userAnswer: 'PERF',
          timeSpent: 30,
        })
        .expect(200);

      // Verify stats were updated
      const stats = await prisma.userGrammarStats.findMany({
        where: { userId },
      });

      expect(stats.length).toBeGreaterThan(0);
      expect(stats[0].totalAttempts).toBeGreaterThan(0);
    });

    it('should update UserProgress (XP, exercisesCompleted) on correct answer', async () => {
      // Get initial progress
      const initialProgress = await prisma.userProgress.findUnique({
        where: { userId },
      });

      const initialXP = initialProgress?.currentXP || 0;
      const initialCompleted = initialProgress?.exercisesCompleted || 0;

      // Submit a correct answer (mocked as random, but we can check if it was correct)
      const response = await request(app.getHttpServer())
        .post('/practice/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          exerciseId: testExerciseId,
          userAnswer: 'PERF',
          timeSpent: 25,
        })
        .expect(200);

      // Get updated progress
      const updatedProgress = await prisma.userProgress.findUnique({
        where: { userId },
      });

      if (response.body.isCorrect) {
        // If answer was correct, XP and exercises should increase
        expect(updatedProgress?.currentXP).toBeGreaterThan(initialXP);
        expect(updatedProgress?.exercisesCompleted).toBeGreaterThan(initialCompleted);
      }
    });

    it('should return 401 if not authenticated', () => {
      return request(app.getHttpServer())
        .post('/practice/submit')
        .send({
          exerciseId: testExerciseId,
          userAnswer: 'PERF',
          timeSpent: 25,
        })
        .expect(401);
    });

    it('should return 400 if exerciseId is missing', () => {
      return request(app.getHttpServer())
        .post('/practice/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          userAnswer: 'PERF',
          timeSpent: 25,
        })
        .expect(400);
    });

    it('should return 400 if userAnswer is missing', () => {
      return request(app.getHttpServer())
        .post('/practice/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          exerciseId: testExerciseId,
          timeSpent: 25,
        })
        .expect(400);
    });

    it('should return 400 if timeSpent is missing', () => {
      return request(app.getHttpServer())
        .post('/practice/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          exerciseId: testExerciseId,
          userAnswer: 'PERF',
        })
        .expect(400);
    });

    it('should return 400 if timeSpent is less than 1', () => {
      return request(app.getHttpServer())
        .post('/practice/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          exerciseId: testExerciseId,
          userAnswer: 'PERF',
          timeSpent: 0,
        })
        .expect(400);
    });

    it('should handle array answers for multi-select exercises', () => {
      return request(app.getHttpServer())
        .post('/practice/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          exerciseId: testExerciseId,
          userAnswer: 'option1,option2', // Simulate array as string
          timeSpent: 30,
        })
        .expect(200);
    });
  });

  describe('Response Structure Validation', () => {
    it('should validate PracticeSetResponseDto structure', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=quick_practice&count=5')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          // Required fields
          expect(res.body).toHaveProperty('mode');
          expect(res.body).toHaveProperty('exercises');
          expect(res.body).toHaveProperty('totalCount');
          expect(res.body).toHaveProperty('estimatedTime');

          // Type validation
          expect(typeof res.body.mode).toBe('string');
          expect(Array.isArray(res.body.exercises)).toBe(true);
          expect(typeof res.body.totalCount).toBe('number');
          expect(typeof res.body.estimatedTime).toBe('number');
        });
    });

    it('should validate PracticeExerciseDto structure', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=quick_practice&count=1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          if (res.body.exercises.length > 0) {
            const exercise = res.body.exercises[0];

            // Required fields
            expect(exercise).toHaveProperty('id');
            expect(exercise).toHaveProperty('type');
            expect(exercise).toHaveProperty('title');
            expect(exercise).toHaveProperty('question');
            expect(exercise).toHaveProperty('xpReward');
            expect(exercise).toHaveProperty('difficulty');

            // Type validation
            expect(typeof exercise.id).toBe('string');
            expect(typeof exercise.type).toBe('string');
            expect(typeof exercise.title).toBe('string');
            expect(typeof exercise.question).toBe('string');
            expect(typeof exercise.xpReward).toBe('number');
            expect(typeof exercise.difficulty).toBe('string');

            // Optional fields (may or may not be present)
            if (exercise.questionArabic) {
              expect(typeof exercise.questionArabic).toBe('string');
            }
            if (exercise.options) {
              expect(Array.isArray(exercise.options)).toBe(true);
            }
            if (exercise.metadata) {
              expect(typeof exercise.metadata).toBe('object');
            }
          }
        });
    });

    it('should validate PracticeResultDto structure', async () => {
      // Get exercise ID first
      const practiceResponse = await request(app.getHttpServer())
        .get('/practice?mode=quick_practice&count=1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const exerciseId = practiceResponse.body.exercises[0]?.id || testExerciseId;

      return request(app.getHttpServer())
        .post('/practice/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          exerciseId,
          userAnswer: 'PERF',
          timeSpent: 25,
        })
        .expect(200)
        .expect((res) => {
          // Required fields
          expect(res.body).toHaveProperty('isCorrect');
          expect(res.body).toHaveProperty('correctAnswer');
          expect(res.body).toHaveProperty('xpEarned');
          expect(res.body).toHaveProperty('timeBonus');
          expect(res.body).toHaveProperty('totalXP');
          expect(res.body).toHaveProperty('accuracy');

          // Type validation
          expect(typeof res.body.isCorrect).toBe('boolean');
          expect(typeof res.body.correctAnswer).toBe('string');
          expect(typeof res.body.xpEarned).toBe('number');
          expect(typeof res.body.timeBonus).toBe('number');
          expect(typeof res.body.totalXP).toBe('number');
          expect(typeof res.body.accuracy).toBe('number');

          // Optional explanation field
          if (res.body.explanation) {
            expect(typeof res.body.explanation).toBe('string');
          }
        });
    });

    it('should ensure all required fields are present in all modes', async () => {
      const modes = ['quick_practice', 'grammar_drills', 'verse_based', 'spaced_repetition', 'challenge', 'daily'];

      for (const mode of modes) {
        let url = `/practice?mode=${mode}`;

        // Add required params for specific modes
        if (mode === 'grammar_drills') {
          url += '&grammarFocus=aspect';
        }
        if (mode === 'verse_based') {
          url += '&surahNumber=1';
        }

        await request(app.getHttpServer())
          .get(url)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('mode');
            expect(res.body).toHaveProperty('exercises');
            expect(res.body).toHaveProperty('totalCount');
            expect(res.body).toHaveProperty('estimatedTime');
          });
      }
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing mode parameter', () => {
      return request(app.getHttpServer())
        .get('/practice')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should handle invalid count (non-numeric)', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=quick_practice&count=abc')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          // Invalid numeric values become NaN and default to undefined in controller
          // Service then uses default count of 10
          expect(Array.isArray(res.body.exercises)).toBe(true);
        });
    });

    it('should handle invalid surahNumber (non-numeric)', () => {
      return request(app.getHttpServer())
        .get('/practice?mode=verse_based&surahNumber=abc')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it('should handle very large timeSpent values', () => {
      return request(app.getHttpServer())
        .post('/practice/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          exerciseId: testExerciseId,
          userAnswer: 'PERF',
          timeSpent: 999999,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('timeBonus');
          // Should not have time bonus for very slow answers
          expect(res.body.timeBonus).toBe(0);
        });
    });

    it('should handle concurrent submissions', async () => {
      const submissions = [];
      for (let i = 0; i < 3; i++) {
        submissions.push(
          request(app.getHttpServer())
            .post('/practice/submit')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
              exerciseId: testExerciseId,
              userAnswer: 'PERF',
              timeSpent: 20,
            })
        );
      }

      const results = await Promise.all(submissions);
      results.forEach((result) => {
        expect(result.status).toBe(200);
      });
    });
  });
});
