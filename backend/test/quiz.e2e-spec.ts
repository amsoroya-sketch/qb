import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Quiz API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminAccessToken: string;
  let userAccessToken: string;
  let adminUserId: string;
  let regularUserId: string;
  let testQuizId: string;
  let testQuizAttemptId: string;
  let testQuestions: any[] = [];

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

    // Clean database for quiz-related data
    await prisma.quizAttempt.deleteMany();
    await prisma.quizQuestion.deleteMany();
    await prisma.quiz.deleteMany();
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
    const adminUser = {
      email: 'admin-quiz@example.com',
      password: 'Admin123456!',
      name: 'Quiz Admin User',
    };

    const regularUser = {
      email: 'user-quiz@example.com',
      password: 'User123456!',
      name: 'Quiz Regular User',
    };

    it('/auth/register (POST) - should register admin user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(adminUser)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.user.email).toBe(adminUser.email);

      adminUserId = response.body.data.user.id;

      // Extract accessToken from cookie
      const cookies = response.headers['set-cookie'];
      if (cookies) {
        const cookieArray = Array.isArray(cookies) ? cookies : [cookies];
        const accessTokenCookie = cookieArray.find((cookie: string) =>
          cookie.startsWith('accessToken='),
        );
        if (accessTokenCookie) {
          adminAccessToken = accessTokenCookie.split(';')[0].split('=')[1];
        }
      }

      // Update user role to ADMIN
      await prisma.user.update({
        where: { id: adminUserId },
        data: { role: 'ADMIN' },
      });

      // Create UserProgress for admin (needed for XP updates)
      await prisma.userProgress.create({
        data: {
          userId: adminUserId,
          currentXP: 0,
          currentLevel: 1,
          currentStreak: 0,
          longestStreak: 0,
          lessonsCompleted: 0,
          exercisesCompleted: 0,
          totalTimeSpent: 0,
          averageAccuracy: 0,
        },
      });
    });

    it('/auth/register (POST) - should register regular user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(regularUser)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data.user.email).toBe(regularUser.email);

      regularUserId = response.body.data.user.id;

      // Extract accessToken from cookie
      const cookies = response.headers['set-cookie'];
      if (cookies) {
        const cookieArray = Array.isArray(cookies) ? cookies : [cookies];
        const accessTokenCookie = cookieArray.find((cookie: string) =>
          cookie.startsWith('accessToken='),
        );
        if (accessTokenCookie) {
          userAccessToken = accessTokenCookie.split(';')[0].split('=')[1];
        }
      }

      // Create UserProgress for regular user
      await prisma.userProgress.create({
        data: {
          userId: regularUserId,
          currentXP: 0,
          currentLevel: 1,
          currentStreak: 0,
          longestStreak: 0,
          lessonsCompleted: 0,
          exercisesCompleted: 0,
          totalTimeSpent: 0,
          averageAccuracy: 0,
        },
      });
    });
  });

  describe('POST /quiz - Admin Create Quiz', () => {
    it('should create quiz successfully (admin)', async () => {
      const response = await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Verb Aspect Quiz',
          titleArabic: 'اختبار زمن الفعل',
          description: 'Test your knowledge of verb aspects',
          type: 'TOPIC',
          minPassScore: 80,
          xpReward: 100,
          isPublished: true,
          questions: [
            {
              question: 'What is the aspect of this verb: كَتَبَ?',
              questionArabic: 'ما هو زمن هذا الفعل: كَتَبَ؟',
              type: 'VERB_CONJUGATION',
              correctAnswer: 'PERF',
              options: [
                { value: 'PERF', label: 'Perfect (ماضي)' },
                { value: 'IMPF', label: 'Imperfect (مضارع)' },
                { value: 'IMPV', label: 'Imperative (أمر)' },
              ],
              explanation: 'كَتَبَ is in the perfect aspect (past tense)',
              grammarFocus: 'aspect',
              order: 1,
              points: 1,
            },
            {
              question: 'What is the aspect of this verb: يَكْتُبُ?',
              questionArabic: 'ما هو زمن هذا الفعل: يَكْتُبُ؟',
              type: 'VERB_CONJUGATION',
              correctAnswer: 'IMPF',
              options: [
                { value: 'PERF', label: 'Perfect (ماضي)' },
                { value: 'IMPF', label: 'Imperfect (مضارع)' },
                { value: 'IMPV', label: 'Imperative (أمر)' },
              ],
              explanation: 'يَكْتُبُ is in the imperfect aspect (present tense)',
              grammarFocus: 'aspect',
              order: 2,
              points: 1,
            },
          ],
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Verb Aspect Quiz');
      expect(response.body.type).toBe('TOPIC');
      expect(response.body.minPassScore).toBe(80);
      expect(response.body.xpReward).toBe(100);
      expect(response.body.isPublished).toBe(true);
      expect(response.body.questions).toHaveLength(2);
      expect(response.body.totalQuestions).toBe(2);
      expect(response.body.totalPoints).toBe(2);

      testQuizId = response.body.id;
      testQuestions = response.body.questions;
    });

    it('should return 403 if not admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          title: 'Unauthorized Quiz',
          type: 'TOPIC',
        })
        .expect(403);

      expect(response.body.message).toContain('Forbidden');
    });

    it('should return 401 if not authenticated', async () => {
      await request(app.getHttpServer())
        .post('/quiz')
        .send({
          title: 'Unauthenticated Quiz',
          type: 'TOPIC',
        })
        .expect(401);
    });

    it('should validate required fields - missing title', async () => {
      await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          type: 'TOPIC',
        })
        .expect(400);
    });

    it('should validate required fields - missing type', async () => {
      await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Test Quiz',
        })
        .expect(400);
    });

    it('should create quiz without questions', async () => {
      const response = await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Empty Quiz',
          type: 'PRACTICE',
          minPassScore: 70,
          xpReward: 50,
          isPublished: false,
        })
        .expect(201);

      expect(response.body.questions).toHaveLength(0);
      expect(response.body.totalQuestions).toBe(0);
      expect(response.body.isPublished).toBe(false);
    });
  });

  describe('PATCH /quiz/:id - Admin Update Quiz', () => {
    it('should update quiz successfully (admin)', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/quiz/${testQuizId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Updated Verb Aspect Quiz',
          description: 'Updated description',
          minPassScore: 85,
        })
        .expect(200);

      expect(response.body.title).toBe('Updated Verb Aspect Quiz');
      expect(response.body.description).toBe('Updated description');
      expect(response.body.minPassScore).toBe(85);
      expect(response.body.xpReward).toBe(100); // Unchanged
    });

    it('should return 403 if not admin', async () => {
      await request(app.getHttpServer())
        .patch(`/quiz/${testQuizId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          title: 'Unauthorized Update',
        })
        .expect(403);
    });

    it('should return 404 if quiz not found', async () => {
      const fakeQuizId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .patch(`/quiz/${fakeQuizId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Non-existent Quiz',
        })
        .expect(404);
    });

    it('should update timeLimit', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/quiz/${testQuizId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          timeLimit: 900,
        })
        .expect(200);

      expect(response.body.timeLimit).toBe(900);
    });
  });

  describe('POST /quiz/:id/questions - Admin Add Question', () => {
    it('should add question to quiz successfully (admin)', async () => {
      const response = await request(app.getHttpServer())
        .post(`/quiz/${testQuizId}/questions`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          question: 'What is the imperative form of كَتَبَ?',
          questionArabic: 'ما هو صيغة الأمر لـ كَتَبَ؟',
          type: 'VERB_CONJUGATION',
          correctAnswer: 'اُكْتُبْ',
          options: [
            { value: 'اُكْتُبْ', label: 'Write (imperative)' },
            { value: 'كَتَبَ', label: 'Wrote' },
            { value: 'يَكْتُبُ', label: 'Writes' },
          ],
          explanation: 'The imperative form is اُكْتُبْ',
          grammarFocus: 'aspect',
          order: 3,
          points: 2,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.question).toContain('imperative form');
      expect(response.body.points).toBe(2);
      expect(response.body.order).toBe(3);
      expect(response.body).toHaveProperty('correctAnswer'); // Admin can see correct answer
    });

    it('should return 403 if not admin', async () => {
      await request(app.getHttpServer())
        .post(`/quiz/${testQuizId}/questions`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          question: 'Unauthorized Question',
          type: 'MULTIPLE_CHOICE',
          correctAnswer: 'A',
          order: 4,
        })
        .expect(403);
    });

    it('should return 404 if quiz not found', async () => {
      const fakeQuizId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .post(`/quiz/${fakeQuizId}/questions`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          question: 'Question for non-existent quiz',
          type: 'MULTIPLE_CHOICE',
          correctAnswer: 'A',
          order: 1,
        })
        .expect(404);
    });

    it('should validate required fields - missing question', async () => {
      await request(app.getHttpServer())
        .post(`/quiz/${testQuizId}/questions`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          type: 'MULTIPLE_CHOICE',
          correctAnswer: 'A',
          order: 5,
        })
        .expect(400);
    });

    it('should validate required fields - missing type', async () => {
      await request(app.getHttpServer())
        .post(`/quiz/${testQuizId}/questions`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          question: 'Test question',
          correctAnswer: 'A',
          order: 5,
        })
        .expect(400);
    });

    it('should validate required fields - missing correctAnswer', async () => {
      await request(app.getHttpServer())
        .post(`/quiz/${testQuizId}/questions`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          question: 'Test question',
          type: 'MULTIPLE_CHOICE',
          order: 5,
        })
        .expect(400);
    });
  });

  describe('POST /quiz/generate - Admin Generate Quiz', () => {
    it('should generate quiz from grammar focus successfully (admin)', async () => {
      const response = await request(app.getHttpServer())
        .post('/quiz/generate')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          grammarFocus: 'aspect',
          questionCount: 5,
          title: 'Auto-Generated Aspect Quiz',
          minPassScore: 75,
          timeLimit: 600,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Auto-Generated Aspect Quiz');
      expect(response.body.type).toBe('PRACTICE');
      expect(response.body.minPassScore).toBe(75);
      expect(response.body.questions.length).toBeGreaterThan(0);
      expect(response.body.isPublished).toBe(true);
    });

    it('should return 403 if not admin', async () => {
      await request(app.getHttpServer())
        .post('/quiz/generate')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          grammarFocus: 'case',
          questionCount: 5,
        })
        .expect(403);
    });

    it('should validate required fields - missing grammarFocus', async () => {
      await request(app.getHttpServer())
        .post('/quiz/generate')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          questionCount: 5,
        })
        .expect(400);
    });

    it('should use default values for optional fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/quiz/generate')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          grammarFocus: 'root',
        })
        .expect(201);

      expect(response.body.title).toContain('Root');
      expect(response.body.minPassScore).toBe(80); // Default
      expect(response.body.timeLimit).toBe(600); // Default
    });

    it('should validate questionCount range - minimum', async () => {
      await request(app.getHttpServer())
        .post('/quiz/generate')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          grammarFocus: 'aspect',
          questionCount: 3, // Less than min 5
        })
        .expect(400);
    });

    it('should validate questionCount range - maximum', async () => {
      await request(app.getHttpServer())
        .post('/quiz/generate')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          grammarFocus: 'aspect',
          questionCount: 25, // Greater than max 20
        })
        .expect(400);
    });
  });

  describe('GET /quiz - User List Quizzes', () => {
    it('should list published quizzes', async () => {
      const response = await request(app.getHttpServer())
        .get('/quiz')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const quiz = response.body[0];
      expect(quiz).toHaveProperty('id');
      expect(quiz).toHaveProperty('title');
      expect(quiz).toHaveProperty('type');
      expect(quiz).toHaveProperty('minPassScore');
      expect(quiz).toHaveProperty('xpReward');
      expect(quiz).toHaveProperty('totalQuestions');
      expect(quiz).toHaveProperty('totalPoints');
      expect(quiz.isPublished).toBe(true);
    });

    it('should filter quizzes by type', async () => {
      const response = await request(app.getHttpServer())
        .get('/quiz?type=TOPIC')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((quiz: any) => {
        expect(quiz.type).toBe('TOPIC');
      });
    });

    it('should filter quizzes by stage', async () => {
      // Create a quiz with stage
      const quizWithStage = await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Stage 2 Quiz',
          type: 'COMPREHENSIVE',
          stage: 2,
          isPublished: true,
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/quiz?stage=2')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((quiz: any) => {
        expect(quiz.stage).toBe(2);
      });
    });

    it('should include user stats (bestScore, attemptCount)', async () => {
      const response = await request(app.getHttpServer())
        .get('/quiz')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      const quiz = response.body.find((q: any) => q.id === testQuizId);
      expect(quiz).toBeDefined();
      // Before any attempts, these should be 0 or undefined
      expect([undefined, 0]).toContain(quiz.attemptCount);
    });

    it('should return 401 if not authenticated', async () => {
      await request(app.getHttpServer()).get('/quiz').expect(401);
    });
  });

  describe('GET /quiz/:id - User Get Quiz Details', () => {
    it('should get quiz details', async () => {
      const response = await request(app.getHttpServer())
        .get(`/quiz/${testQuizId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', testQuizId);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('questions');
      expect(Array.isArray(response.body.questions)).toBe(true);
      expect(response.body.questions.length).toBeGreaterThan(0);
    });

    it('should return 404 if quiz not found', async () => {
      const fakeQuizId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .get(`/quiz/${fakeQuizId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(404);
    });

    it('should return 401 if not authenticated', async () => {
      await request(app.getHttpServer()).get(`/quiz/${testQuizId}`).expect(401);
    });
  });

  describe('POST /quiz/:id/start - User Start Quiz', () => {
    it('should start quiz and create attempt', async () => {
      const response = await request(app.getHttpServer())
        .post(`/quiz/${testQuizId}/start`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(201);

      expect(response.body).toHaveProperty('quizId', testQuizId);
      expect(response.body).toHaveProperty('attemptId');
      expect(response.body).toHaveProperty('questions');
      expect(response.body).toHaveProperty('timeLimit');
      expect(response.body).toHaveProperty('totalQuestions');
      expect(response.body).toHaveProperty('totalPoints');
      expect(response.body).toHaveProperty('startedAt');

      testQuizAttemptId = response.body.attemptId;
      expect(Array.isArray(response.body.questions)).toBe(true);
      expect(response.body.questions.length).toBeGreaterThan(0);
    });

    it('should return questions without correct answers', async () => {
      // Create new quiz and start it
      const newQuiz = await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Test Quiz for Hidden Answers',
          type: 'PRACTICE',
          isPublished: true,
          questions: [
            {
              question: 'Test question',
              type: 'MULTIPLE_CHOICE',
              correctAnswer: 'SECRET_ANSWER',
              options: [
                { value: 'A', label: 'Option A' },
                { value: 'SECRET_ANSWER', label: 'Option B' },
              ],
              order: 1,
              points: 1,
            },
          ],
        })
        .expect(201);

      const startResponse = await request(app.getHttpServer())
        .post(`/quiz/${newQuiz.body.id}/start`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(201);

      const question = startResponse.body.questions[0];
      expect(question).not.toHaveProperty('correctAnswer');
      expect(question).toHaveProperty('question');
      expect(question).toHaveProperty('options');
    });

    it('should return 404 if quiz not found', async () => {
      const fakeQuizId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .post(`/quiz/${fakeQuizId}/start`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(404);
    });

    it('should return 403 if quiz not published', async () => {
      // Create unpublished quiz
      const unpublishedQuiz = await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Unpublished Quiz',
          type: 'PRACTICE',
          isPublished: false,
          questions: [
            {
              question: 'Test',
              type: 'MULTIPLE_CHOICE',
              correctAnswer: 'A',
              order: 1,
            },
          ],
        })
        .expect(201);

      await request(app.getHttpServer())
        .post(`/quiz/${unpublishedQuiz.body.id}/start`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(403);
    });

    it('should return 400 if quiz has no questions', async () => {
      // Create quiz without questions
      const emptyQuiz = await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Empty Quiz',
          type: 'PRACTICE',
          isPublished: true,
        })
        .expect(201);

      await request(app.getHttpServer())
        .post(`/quiz/${emptyQuiz.body.id}/start`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(400);
    });

    it('should return time limit if quiz has one', async () => {
      const response = await request(app.getHttpServer())
        .get(`/quiz/${testQuizId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      if (response.body.timeLimit) {
        const startResponse = await request(app.getHttpServer())
          .post(`/quiz/${testQuizId}/start`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(201);

        expect(startResponse.body.timeLimit).toBe(response.body.timeLimit);
      }
    });

    it('should return 401 if not authenticated', async () => {
      await request(app.getHttpServer())
        .post(`/quiz/${testQuizId}/start`)
        .expect(401);
    });
  });

  describe('POST /quiz/attempt/:attemptId/answer - User Submit Answer', () => {
    let questionId: string;

    beforeAll(async () => {
      // Get questions from the test quiz
      const quizDetails = await request(app.getHttpServer())
        .get(`/quiz/${testQuizId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);

      questionId = quizDetails.body.questions[0].id;
    });

    it('should submit correct answer', async () => {
      const response = await request(app.getHttpServer())
        .post(`/quiz/attempt/${testQuizAttemptId}/answer`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          attemptId: testQuizAttemptId,
          questionId: questionId,
          userAnswer: 'PERF',
        })
        .expect(200);

      expect(response.body).toHaveProperty('questionId', questionId);
      expect(response.body).toHaveProperty('isCorrect');
      expect(response.body).toHaveProperty('correctAnswer');
      expect(response.body).toHaveProperty('pointsEarned');
      expect(response.body).toHaveProperty('currentScore');
      expect(response.body).toHaveProperty('questionsAnswered');
      expect(response.body).toHaveProperty('totalQuestions');

      if (response.body.isCorrect) {
        expect(response.body.pointsEarned).toBeGreaterThan(0);
      }
    });

    it('should submit incorrect answer', async () => {
      const response = await request(app.getHttpServer())
        .post(`/quiz/attempt/${testQuizAttemptId}/answer`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          attemptId: testQuizAttemptId,
          questionId: questionId,
          userAnswer: 'WRONG_ANSWER',
        })
        .expect(200);

      expect(response.body).toHaveProperty('isCorrect');
      expect(response.body).toHaveProperty('correctAnswer');
      expect(response.body.correctAnswer).not.toBe('WRONG_ANSWER');
    });

    it('should return immediate feedback', async () => {
      const response = await request(app.getHttpServer())
        .post(`/quiz/attempt/${testQuizAttemptId}/answer`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          attemptId: testQuizAttemptId,
          questionId: questionId,
          userAnswer: 'PERF',
        })
        .expect(200);

      expect(response.body).toHaveProperty('explanation');
      expect(response.body).toHaveProperty('currentScore');
      expect(typeof response.body.currentScore).toBe('number');
    });

    it('should update attempt.answers JSON', async () => {
      await request(app.getHttpServer())
        .post(`/quiz/attempt/${testQuizAttemptId}/answer`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          attemptId: testQuizAttemptId,
          questionId: questionId,
          userAnswer: 'PERF',
        })
        .expect(200);

      // Verify in database
      const attempt = await prisma.quizAttempt.findUnique({
        where: { id: testQuizAttemptId },
      });

      expect(attempt).toBeDefined();
      expect(attempt!.answers).toBeDefined();
      const answers = attempt!.answers as any;
      expect(answers[questionId]).toBeDefined();
      expect(answers[questionId]).toHaveProperty('userAnswer');
      expect(answers[questionId]).toHaveProperty('isCorrect');
      expect(answers[questionId]).toHaveProperty('pointsEarned');
    });

    it('should return 404 if attempt not found', async () => {
      const fakeAttemptId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .post(`/quiz/attempt/${fakeAttemptId}/answer`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          attemptId: fakeAttemptId,
          questionId: questionId,
          userAnswer: 'PERF',
        })
        .expect(404);
    });

    it('should return 403 if attempt not owned by user', async () => {
      // Admin starts a quiz
      const adminStartResponse = await request(app.getHttpServer())
        .post(`/quiz/${testQuizId}/start`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(201);

      const adminAttemptId = adminStartResponse.body.attemptId;

      // Regular user tries to submit answer to admin's attempt
      await request(app.getHttpServer())
        .post(`/quiz/attempt/${adminAttemptId}/answer`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          attemptId: adminAttemptId,
          questionId: questionId,
          userAnswer: 'PERF',
        })
        .expect(403);
    });

    it('should validate required fields - missing questionId', async () => {
      await request(app.getHttpServer())
        .post(`/quiz/attempt/${testQuizAttemptId}/answer`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          attemptId: testQuizAttemptId,
          userAnswer: 'PERF',
        })
        .expect(400);
    });

    it('should validate required fields - missing userAnswer', async () => {
      await request(app.getHttpServer())
        .post(`/quiz/attempt/${testQuizAttemptId}/answer`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          attemptId: testQuizAttemptId,
          questionId: questionId,
        })
        .expect(400);
    });
  });

  describe('POST /quiz/attempt/:attemptId/complete - User Complete Quiz', () => {
    let completeAttemptId: string;
    let completeQuizId: string;

    beforeAll(async () => {
      // Create a fresh quiz for completion tests
      const quizResponse = await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Completion Test Quiz',
          type: 'PRACTICE',
          minPassScore: 80,
          xpReward: 50,
          isPublished: true,
          questions: [
            {
              question: 'Question 1',
              type: 'MULTIPLE_CHOICE',
              correctAnswer: 'A',
              options: [
                { value: 'A', label: 'Correct' },
                { value: 'B', label: 'Wrong' },
              ],
              order: 1,
              points: 1,
            },
            {
              question: 'Question 2',
              type: 'MULTIPLE_CHOICE',
              correctAnswer: 'B',
              options: [
                { value: 'A', label: 'Wrong' },
                { value: 'B', label: 'Correct' },
              ],
              order: 2,
              points: 1,
            },
          ],
        })
        .expect(201);

      completeQuizId = quizResponse.body.id;

      // Start quiz
      const startResponse = await request(app.getHttpServer())
        .post(`/quiz/${completeQuizId}/start`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(201);

      completeAttemptId = startResponse.body.attemptId;

      // Submit all answers
      for (const question of startResponse.body.questions) {
        await request(app.getHttpServer())
          .post(`/quiz/attempt/${completeAttemptId}/answer`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            attemptId: completeAttemptId,
            questionId: question.id,
            userAnswer: question.options[0].value, // Submit first option
          })
          .expect(200);
      }
    });

    it('should complete quiz and calculate score', async () => {
      const response = await request(app.getHttpServer())
        .post(`/quiz/attempt/${completeAttemptId}/complete`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('attemptId', completeAttemptId);
      expect(response.body).toHaveProperty('quizId', completeQuizId);
      expect(response.body).toHaveProperty('score');
      expect(response.body).toHaveProperty('passed');
      expect(response.body).toHaveProperty('xpEarned');
      expect(response.body).toHaveProperty('timeSpent');
      expect(response.body).toHaveProperty('totalQuestions', 2);
      expect(response.body).toHaveProperty('correctAnswers');
      expect(response.body).toHaveProperty('totalPoints');
      expect(response.body).toHaveProperty('pointsEarned');
      expect(response.body).toHaveProperty('completedAt');
      expect(response.body).toHaveProperty('answers');

      expect(typeof response.body.score).toBe('number');
      expect(response.body.score).toBeGreaterThanOrEqual(0);
      expect(response.body.score).toBeLessThanOrEqual(100);
    });

    it('should award XP if passed', async () => {
      // Create new quiz and complete it with all correct answers
      const passQuiz = await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Pass Test Quiz',
          type: 'PRACTICE',
          minPassScore: 50,
          xpReward: 100,
          isPublished: true,
          questions: [
            {
              question: 'Easy question',
              type: 'MULTIPLE_CHOICE',
              correctAnswer: 'CORRECT',
              options: [{ value: 'CORRECT', label: 'Right' }],
              order: 1,
              points: 1,
            },
          ],
        })
        .expect(201);

      const startResponse = await request(app.getHttpServer())
        .post(`/quiz/${passQuiz.body.id}/start`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .post(`/quiz/attempt/${startResponse.body.attemptId}/answer`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          attemptId: startResponse.body.attemptId,
          questionId: startResponse.body.questions[0].id,
          userAnswer: 'CORRECT',
        })
        .expect(200);

      const completeResponse = await request(app.getHttpServer())
        .post(`/quiz/attempt/${startResponse.body.attemptId}/complete`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      if (completeResponse.body.passed) {
        expect(completeResponse.body.xpEarned).toBe(100);
      } else {
        expect(completeResponse.body.xpEarned).toBe(0);
      }
    });

    it('should mark as passed/failed based on minPassScore', async () => {
      // Quiz with high pass score
      const highPassQuiz = await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'High Pass Score Quiz',
          type: 'PRACTICE',
          minPassScore: 90,
          xpReward: 50,
          isPublished: true,
          questions: [
            {
              question: 'Q1',
              type: 'MULTIPLE_CHOICE',
              correctAnswer: 'A',
              options: [{ value: 'A', label: 'A' }],
              order: 1,
              points: 1,
            },
          ],
        })
        .expect(201);

      const startResponse = await request(app.getHttpServer())
        .post(`/quiz/${highPassQuiz.body.id}/start`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .post(`/quiz/attempt/${startResponse.body.attemptId}/answer`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          attemptId: startResponse.body.attemptId,
          questionId: startResponse.body.questions[0].id,
          userAnswer: 'A',
        })
        .expect(200);

      const completeResponse = await request(app.getHttpServer())
        .post(`/quiz/attempt/${startResponse.body.attemptId}/complete`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      expect(completeResponse.body).toHaveProperty('passed');
      expect(typeof completeResponse.body.passed).toBe('boolean');

      if (completeResponse.body.score >= 90) {
        expect(completeResponse.body.passed).toBe(true);
      } else {
        expect(completeResponse.body.passed).toBe(false);
      }
    });

    it('should update UserProgress', async () => {
      const initialProgress = await prisma.userProgress.findUnique({
        where: { userId: regularUserId },
      });

      // Create and complete a passing quiz
      const progressQuiz = await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Progress Update Quiz',
          type: 'PRACTICE',
          minPassScore: 50,
          xpReward: 75,
          isPublished: true,
          questions: [
            {
              question: 'Q',
              type: 'MULTIPLE_CHOICE',
              correctAnswer: 'YES',
              options: [{ value: 'YES', label: 'Yes' }],
              order: 1,
              points: 1,
            },
          ],
        })
        .expect(201);

      const startResponse = await request(app.getHttpServer())
        .post(`/quiz/${progressQuiz.body.id}/start`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .post(`/quiz/attempt/${startResponse.body.attemptId}/answer`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          attemptId: startResponse.body.attemptId,
          questionId: startResponse.body.questions[0].id,
          userAnswer: 'YES',
        })
        .expect(200);

      const completeResponse = await request(app.getHttpServer())
        .post(`/quiz/attempt/${startResponse.body.attemptId}/complete`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      if (completeResponse.body.passed) {
        const updatedProgress = await prisma.userProgress.findUnique({
          where: { userId: regularUserId },
        });

        expect(updatedProgress!.currentXP).toBeGreaterThan(initialProgress!.currentXP);
      }
    });

    it('should require all questions answered', async () => {
      // Create new quiz
      const incompleteQuiz = await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Incomplete Quiz',
          type: 'PRACTICE',
          isPublished: true,
          questions: [
            {
              question: 'Q1',
              type: 'MULTIPLE_CHOICE',
              correctAnswer: 'A',
              options: [{ value: 'A', label: 'A' }],
              order: 1,
              points: 1,
            },
            {
              question: 'Q2',
              type: 'MULTIPLE_CHOICE',
              correctAnswer: 'B',
              options: [{ value: 'B', label: 'B' }],
              order: 2,
              points: 1,
            },
          ],
        })
        .expect(201);

      const startResponse = await request(app.getHttpServer())
        .post(`/quiz/${incompleteQuiz.body.id}/start`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(201);

      // Only answer first question
      await request(app.getHttpServer())
        .post(`/quiz/attempt/${startResponse.body.attemptId}/answer`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          attemptId: startResponse.body.attemptId,
          questionId: startResponse.body.questions[0].id,
          userAnswer: 'A',
        })
        .expect(200);

      // Try to complete without answering all questions
      await request(app.getHttpServer())
        .post(`/quiz/attempt/${startResponse.body.attemptId}/complete`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(400);
    });

    it('should return 404 if attempt not found', async () => {
      const fakeAttemptId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .post(`/quiz/attempt/${fakeAttemptId}/complete`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(404);
    });

    it('should return 403 if attempt not owned by user', async () => {
      // Admin completes their own quiz
      const adminQuiz = await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Admin Quiz',
          type: 'PRACTICE',
          isPublished: true,
          questions: [
            {
              question: 'Q',
              type: 'MULTIPLE_CHOICE',
              correctAnswer: 'A',
              options: [{ value: 'A', label: 'A' }],
              order: 1,
              points: 1,
            },
          ],
        })
        .expect(201);

      const adminStart = await request(app.getHttpServer())
        .post(`/quiz/${adminQuiz.body.id}/start`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .post(`/quiz/attempt/${adminStart.body.attemptId}/answer`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          attemptId: adminStart.body.attemptId,
          questionId: adminStart.body.questions[0].id,
          userAnswer: 'A',
        })
        .expect(200);

      // Regular user tries to complete admin's attempt
      await request(app.getHttpServer())
        .post(`/quiz/attempt/${adminStart.body.attemptId}/complete`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(403);
    });
  });

  describe('GET /quiz/attempts - User Get Attempts', () => {
    it('should get user quiz history', async () => {
      const response = await request(app.getHttpServer())
        .get('/quiz/attempts')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      if (response.body.length > 0) {
        const attempt = response.body[0];
        expect(attempt).toHaveProperty('id');
        expect(attempt).toHaveProperty('quizId');
        expect(attempt).toHaveProperty('quizTitle');
        expect(attempt).toHaveProperty('score');
        expect(attempt).toHaveProperty('passed');
        expect(attempt).toHaveProperty('xpEarned');
        expect(attempt).toHaveProperty('timeSpent');
        expect(attempt).toHaveProperty('completedAt');
      }
    });

    it('should filter by quizId', async () => {
      const response = await request(app.getHttpServer())
        .get(`/quiz/attempts?quizId=${testQuizId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((attempt: any) => {
        expect(attempt.quizId).toBe(testQuizId);
      });
    });

    it('should include score and passed status', async () => {
      const response = await request(app.getHttpServer())
        .get('/quiz/attempts')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      if (response.body.length > 0) {
        const attempt = response.body[0];
        expect(typeof attempt.score).toBe('number');
        expect(typeof attempt.passed).toBe('boolean');
        expect(attempt.score).toBeGreaterThanOrEqual(0);
        expect(attempt.score).toBeLessThanOrEqual(100);
      }
    });

    it('should return 401 if not authenticated', async () => {
      await request(app.getHttpServer()).get('/quiz/attempts').expect(401);
    });
  });

  describe('GET /quiz/:id/leaderboard - User Get Leaderboard', () => {
    it('should get top scores', async () => {
      const response = await request(app.getHttpServer())
        .get(`/quiz/${testQuizId}/leaderboard`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      if (response.body.length > 0) {
        const entry = response.body[0];
        expect(entry).toHaveProperty('userId');
        expect(entry).toHaveProperty('userName');
        expect(entry).toHaveProperty('score');
        expect(entry).toHaveProperty('timeSpent');
        expect(entry).toHaveProperty('completedAt');
        expect(entry).toHaveProperty('rank');
      }
    });

    it('should include rank', async () => {
      const response = await request(app.getHttpServer())
        .get(`/quiz/${testQuizId}/leaderboard`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      response.body.forEach((entry: any, index: number) => {
        expect(entry.rank).toBe(index + 1);
      });
    });

    it('should limit results (default 10)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/quiz/${testQuizId}/leaderboard`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should respect custom limit', async () => {
      const response = await request(app.getHttpServer())
        .get(`/quiz/${testQuizId}/leaderboard?limit=5`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should return 404 if quiz not found', async () => {
      const fakeQuizId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .get(`/quiz/${fakeQuizId}/leaderboard`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(404);
    });

    it('should return 401 if not authenticated', async () => {
      await request(app.getHttpServer())
        .get(`/quiz/${testQuizId}/leaderboard`)
        .expect(401);
    });
  });

  describe('DELETE /quiz/:id - Admin Delete Quiz', () => {
    it('should delete quiz without attempts (admin)', async () => {
      // Create quiz with no attempts
      const quizToDelete = await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Quiz To Delete',
          type: 'PRACTICE',
          isPublished: true,
        })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/quiz/${quizToDelete.body.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(204);

      // Verify quiz is deleted
      await request(app.getHttpServer())
        .get(`/quiz/${quizToDelete.body.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(404);
    });

    it('should unpublish quiz with attempts (admin)', async () => {
      // Create quiz and make an attempt
      const quizWithAttempt = await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Quiz With Attempt',
          type: 'PRACTICE',
          isPublished: true,
          questions: [
            {
              question: 'Q',
              type: 'MULTIPLE_CHOICE',
              correctAnswer: 'A',
              options: [{ value: 'A', label: 'A' }],
              order: 1,
              points: 1,
            },
          ],
        })
        .expect(201);

      const quizId = quizWithAttempt.body.id;

      // User starts the quiz (creates attempt)
      await request(app.getHttpServer())
        .post(`/quiz/${quizId}/start`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(201);

      // Delete quiz (should unpublish instead of delete)
      await request(app.getHttpServer())
        .delete(`/quiz/${quizId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(204);

      // Verify quiz still exists but is unpublished
      const quizCheck = await prisma.quiz.findUnique({
        where: { id: quizId },
      });

      expect(quizCheck).toBeDefined();
      expect(quizCheck!.isPublished).toBe(false);
    });

    it('should return 403 if not admin', async () => {
      const quizToDelete = await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Quiz Delete Test',
          type: 'PRACTICE',
          isPublished: true,
        })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/quiz/${quizToDelete.body.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(403);
    });

    it('should return 404 if quiz not found', async () => {
      const fakeQuizId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .delete(`/quiz/${fakeQuizId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(404);
    });

    it('should return 401 if not authenticated', async () => {
      await request(app.getHttpServer()).delete(`/quiz/${testQuizId}`).expect(401);
    });
  });

  describe('Complete Quiz Flow - End to End', () => {
    it('should complete full quiz flow: create → start → submit answers → complete → verify score', async () => {
      // 1. Create quiz (admin)
      const createResponse = await request(app.getHttpServer())
        .post('/quiz')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Complete Flow Quiz',
          titleArabic: 'اختبار التدفق الكامل',
          description: 'Full flow test',
          type: 'TOPIC',
          minPassScore: 80,
          xpReward: 100,
          timeLimit: 600,
          isPublished: true,
          questions: [
            {
              question: 'What is 2+2?',
              type: 'MULTIPLE_CHOICE',
              correctAnswer: '4',
              options: [
                { value: '3', label: 'Three' },
                { value: '4', label: 'Four' },
                { value: '5', label: 'Five' },
              ],
              explanation: '2+2 equals 4',
              order: 1,
              points: 1,
            },
            {
              question: 'What is 3+3?',
              type: 'MULTIPLE_CHOICE',
              correctAnswer: '6',
              options: [
                { value: '5', label: 'Five' },
                { value: '6', label: 'Six' },
                { value: '7', label: 'Seven' },
              ],
              explanation: '3+3 equals 6',
              order: 2,
              points: 1,
            },
          ],
        })
        .expect(201);

      const flowQuizId = createResponse.body.id;
      expect(createResponse.body.questions).toHaveLength(2);
      expect(createResponse.body.totalQuestions).toBe(2);

      // 2. Start quiz (user)
      const startResponse = await request(app.getHttpServer())
        .post(`/quiz/${flowQuizId}/start`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(201);

      const attemptId = startResponse.body.attemptId;
      const questions = startResponse.body.questions;
      expect(questions).toHaveLength(2);
      expect(startResponse.body.timeLimit).toBe(600);

      // 3. Submit answers for all questions
      const answers = [
        { questionId: questions[0].id, userAnswer: '4' }, // Correct
        { questionId: questions[1].id, userAnswer: '6' }, // Correct
      ];

      for (const answer of answers) {
        const submitResponse = await request(app.getHttpServer())
          .post(`/quiz/attempt/${attemptId}/answer`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            attemptId: attemptId,
            questionId: answer.questionId,
            userAnswer: answer.userAnswer,
          })
          .expect(200);

        expect(submitResponse.body).toHaveProperty('isCorrect');
        expect(submitResponse.body).toHaveProperty('currentScore');
      }

      // 4. Complete quiz
      const completeResponse = await request(app.getHttpServer())
        .post(`/quiz/attempt/${attemptId}/complete`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      expect(completeResponse.body.attemptId).toBe(attemptId);
      expect(completeResponse.body.quizId).toBe(flowQuizId);
      expect(completeResponse.body.totalQuestions).toBe(2);
      expect(completeResponse.body.correctAnswers).toBe(2);
      expect(completeResponse.body.score).toBe(100); // All correct
      expect(completeResponse.body.passed).toBe(true); // Score >= 80
      expect(completeResponse.body.xpEarned).toBe(100); // Passed, so full XP
      expect(completeResponse.body.answers).toHaveLength(2);

      // 5. Verify quiz appears in attempts
      const attemptsResponse = await request(app.getHttpServer())
        .get('/quiz/attempts')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      const thisAttempt = attemptsResponse.body.find((a: any) => a.id === attemptId);
      expect(thisAttempt).toBeDefined();
      expect(thisAttempt.quizId).toBe(flowQuizId);
      expect(thisAttempt.score).toBe(100);
      expect(thisAttempt.passed).toBe(true);

      // 6. Verify leaderboard entry
      const leaderboardResponse = await request(app.getHttpServer())
        .get(`/quiz/${flowQuizId}/leaderboard`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      expect(leaderboardResponse.body.length).toBeGreaterThan(0);
      const userEntry = leaderboardResponse.body.find(
        (e: any) => e.userId === regularUserId,
      );
      expect(userEntry).toBeDefined();
      expect(userEntry.score).toBe(100);
      expect(userEntry).toHaveProperty('rank');

      // 7. Verify UserProgress was updated
      const userProgress = await prisma.userProgress.findUnique({
        where: { userId: regularUserId },
      });
      expect(userProgress).toBeDefined();
      expect(userProgress!.currentXP).toBeGreaterThanOrEqual(100); // At least the quiz XP
    });
  });
});
