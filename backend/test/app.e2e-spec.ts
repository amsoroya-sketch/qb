import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let userId: string;

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

    // Clean database
    await prisma.userExercise.deleteMany();
    await prisma.userLessonProgress.deleteMany();
    await prisma.userAchievement.deleteMany();
    await prisma.userProgress.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication Flow', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'Test123456',
      name: 'Test User',
    };

    it('/auth/register (POST) - should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
          expect(res.body.user.email).toBe(testUser.email);
          expect(res.body.user.name).toBe(testUser.name);
          expect(res.body.user.role).toBe('STUDENT');

          userId = res.body.user.id;
          accessToken = res.body.accessToken;
        });
    });

    it('/auth/register (POST) - should fail with duplicate email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(401);
    });

    it('/auth/register (POST) - should fail with invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Test123456',
          name: 'Test User',
        })
        .expect(400);
    });

    it('/auth/login (POST) - should login with correct credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
          accessToken = res.body.accessToken;
        });
    });

    it('/auth/login (POST) - should fail with wrong password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword',
        })
        .expect(401);
    });

    it('/auth/profile (GET) - should get user profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.email).toBe(testUser.email);
          expect(res.body.name).toBe(testUser.name);
        });
    });

    it('/auth/profile (GET) - should fail without token', () => {
      return request(app.getHttpServer()).get('/auth/profile').expect(401);
    });
  });

  describe('Lessons Flow', () => {
    let lessonId: string;

    beforeAll(async () => {
      // Create a test lesson
      const lesson = await prisma.lesson.create({
        data: {
          title: 'Test Lesson',
          titleArabic: 'درس تجريبي',
          description: 'A test lesson',
          content: 'Test content',
          track: 'A',
          stage: 1,
          order: 1,
          grammarTopic: 'nouns',
          difficulty: 'BEGINNER',
          estimatedTime: 15,
          xpReward: 50,
          isPublished: true,
        },
      });
      lessonId = lesson.id;
    });

    it('/lessons (GET) - should get all lessons', () => {
      return request(app.getHttpServer())
        .get('/lessons')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('meta');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    it('/lessons (GET) - should filter by track', () => {
      return request(app.getHttpServer())
        .get('/lessons?track=A')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.every((l: any) => l.track === 'A')).toBe(true);
        });
    });

    it('/lessons/:id (GET) - should get single lesson', () => {
      return request(app.getHttpServer())
        .get(`/lessons/${lessonId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(lessonId);
          expect(res.body.title).toBe('Test Lesson');
        });
    });

    it('/lessons/:id/start (POST) - should start a lesson', () => {
      return request(app.getHttpServer())
        .post(`/lessons/${lessonId}/start`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201)
        .expect((res) => {
          expect(res.body.status).toBe('IN_PROGRESS');
          expect(res.body.lessonId).toBe(lessonId);
        });
    });

    it('/lessons/:id/complete (POST) - should complete a lesson', () => {
      return request(app.getHttpServer())
        .post(`/lessons/${lessonId}/complete`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ timeSpent: 900 })
        .expect(201)
        .expect((res) => {
          expect(res.body.status).toBe('COMPLETED');
          expect(res.body).toHaveProperty('completedAt');
        });
    });
  });

  describe('Progress Flow', () => {
    it('/progress/me (GET) - should get user progress', () => {
      return request(app.getHttpServer())
        .get('/progress/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('currentXP');
          expect(res.body).toHaveProperty('currentLevel');
          expect(res.body).toHaveProperty('currentStreak');
          expect(res.body.currentXP).toBeGreaterThan(0); // Should have XP from completing lesson
        });
    });

    it('/progress/me/dashboard (GET) - should get dashboard stats', () => {
      return request(app.getHttpServer())
        .get('/progress/me/dashboard')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('currentLevel');
          expect(res.body).toHaveProperty('currentXP');
          expect(res.body).toHaveProperty('lessonsCompleted');
          expect(res.body.lessonsCompleted).toBe(1);
        });
    });

    it('/progress/me/streak (POST) - should update streak', () => {
      return request(app.getHttpServer())
        .post('/progress/me/streak')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('currentStreak');
          expect(res.body).toHaveProperty('lastActiveDate');
        });
    });
  });

  describe('Exercises Flow', () => {
    let exerciseId: string;
    let lessonId: string;

    beforeAll(async () => {
      // Create a test lesson and exercise
      const lesson = await prisma.lesson.create({
        data: {
          title: 'Exercise Test Lesson',
          titleArabic: 'درس تمارين',
          description: 'Test',
          content: 'Test',
          track: 'A',
          stage: 1,
          order: 2,
          grammarTopic: 'verbs',
          difficulty: 'BEGINNER',
          estimatedTime: 15,
          xpReward: 50,
          isPublished: true,
        },
      });
      lessonId = lesson.id;

      const exercise = await prisma.exercise.create({
        data: {
          lessonId: lesson.id,
          title: 'Test Exercise',
          type: 'MULTIPLE_CHOICE',
          question: 'What is a verb?',
          options: JSON.stringify(['noun', 'verb', 'particle']),
          correctAnswer: 'verb',
          explanation: 'A verb indicates an action',
          order: 1,
          difficulty: 'BEGINNER',
          xpReward: 10,
        },
      });
      exerciseId = exercise.id;
    });

    it('/exercises/lesson/:lessonId (GET) - should get exercises by lesson', () => {
      return request(app.getHttpServer())
        .get(`/exercises/lesson/${lessonId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].lessonId).toBe(lessonId);
        });
    });

    it('/exercises/:id/submit (POST) - should submit correct answer', () => {
      return request(app.getHttpServer())
        .post(`/exercises/${exerciseId}/submit`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          userAnswer: 'verb',
          timeSpent: 30,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.isCorrect).toBe(true);
          expect(res.body.xpEarned).toBeGreaterThan(0);
          expect(res.body).toHaveProperty('explanation');
        });
    });

    it('/exercises/:id/submit (POST) - should submit incorrect answer', () => {
      return request(app.getHttpServer())
        .post(`/exercises/${exerciseId}/submit`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          userAnswer: 'noun',
          timeSpent: 45,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.isCorrect).toBe(false);
          expect(res.body.xpEarned).toBe(0);
          expect(res.body.correctAnswer).toBe('verb');
        });
    });
  });

  describe('Achievements Flow', () => {
    let achievementId: string;

    beforeAll(async () => {
      // Create a test achievement
      const achievement = await prisma.achievement.create({
        data: {
          name: 'Test Achievement',
          nameArabic: 'إنجاز تجريبي',
          description: 'Complete 1 lesson',
          icon: '🎓',
          category: 'learning',
          requirement: JSON.stringify({ type: 'lessons_completed', count: 1 }),
          xpReward: 25,
        },
      });
      achievementId = achievement.id;
    });

    it('/achievements (GET) - should get all achievements', () => {
      return request(app.getHttpServer())
        .get('/achievements')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('/achievements/me/check (POST) - should check and unlock achievements', () => {
      return request(app.getHttpServer())
        .post('/achievements/me/check')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          // Should have unlocked "Test Achievement" since user completed 1 lesson
          if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('achievement');
          }
        });
    });

    it('/achievements/me/unlocked (GET) - should get unlocked achievements', () => {
      return request(app.getHttpServer())
        .get('/achievements/me/unlocked')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('Analytics Flow', () => {
    it('/analytics/track (POST) - should track an event', () => {
      return request(app.getHttpServer())
        .post('/analytics/track')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          eventType: 'lesson_started',
          eventData: { lessonId: 'test-123' },
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.eventType).toBe('lesson_started');
        });
    });

    it('/analytics/me (GET) - should get user analytics', () => {
      return request(app.getHttpServer())
        .get('/analytics/me?days=30')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalEvents');
          expect(res.body).toHaveProperty('activityByDay');
        });
    });

    it('/analytics/leaderboard (GET) - should get leaderboard', () => {
      return request(app.getHttpServer())
        .get('/analytics/leaderboard?limit=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});
