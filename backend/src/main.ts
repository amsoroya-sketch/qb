import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

/**
 * Validate JWT secrets on application startup
 * Prevents running with weak or missing secrets in production
 */
function validateJwtSecrets() {
  const jwtSecret = process.env.JWT_SECRET;
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isProduction = nodeEnv === 'production';

  // Weak/default secrets to check against
  const weakSecrets = [
    'your-secret-key',
    'secret',
    'changeme',
    'password',
    '123456',
    'default',
    'test',
  ];

  // Check JWT_SECRET exists
  if (!jwtSecret) {
    console.error('❌ FATAL ERROR: JWT_SECRET environment variable is not set!');
    console.error('   Set JWT_SECRET in your .env file');
    process.exit(1);
  }

  // Check REFRESH_TOKEN_SECRET exists
  if (!refreshSecret) {
    console.error('❌ FATAL ERROR: REFRESH_TOKEN_SECRET environment variable is not set!');
    console.error('   Set REFRESH_TOKEN_SECRET in your .env file');
    process.exit(1);
  }

  // Check JWT_SECRET is not a weak/default value
  if (weakSecrets.some((weak) => jwtSecret.toLowerCase().includes(weak))) {
    console.error('❌ FATAL ERROR: JWT_SECRET appears to be a weak or default value!');
    console.error(
      "   Generate a strong secret using: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
    process.exit(1);
  }

  // Check REFRESH_TOKEN_SECRET is not a weak/default value
  if (weakSecrets.some((weak) => refreshSecret.toLowerCase().includes(weak))) {
    console.error('❌ FATAL ERROR: REFRESH_TOKEN_SECRET appears to be a weak or default value!');
    console.error(
      "   Generate a strong secret using: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
    process.exit(1);
  }

  // Check JWT_SECRET length (minimum 32 characters in production, 16 in dev)
  const minLength = isProduction ? 32 : 16;
  if (jwtSecret.length < minLength) {
    console.error(
      `❌ FATAL ERROR: JWT_SECRET is too short! Minimum ${minLength} characters required (${isProduction ? 'production' : 'development'} mode)`,
    );
    console.error(
      "   Generate a strong secret using: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
    process.exit(1);
  }

  // Check REFRESH_TOKEN_SECRET length
  if (refreshSecret.length < minLength) {
    console.error(
      `❌ FATAL ERROR: REFRESH_TOKEN_SECRET is too short! Minimum ${minLength} characters required (${isProduction ? 'production' : 'development'} mode)`,
    );
    console.error(
      "   Generate a strong secret using: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
    process.exit(1);
  }

  // Check that JWT_SECRET and REFRESH_TOKEN_SECRET are different
  if (jwtSecret === refreshSecret) {
    console.error('❌ FATAL ERROR: JWT_SECRET and REFRESH_TOKEN_SECRET must be different!');
    console.error('   Generate two different secrets');
    process.exit(1);
  }

  // Success message
  if (isProduction) {
    console.log('✅ JWT secrets validated successfully (production mode)');
  } else {
    console.log('✅ JWT secrets validated successfully (development mode)');
  }
}

async function bootstrap() {
  // Validate JWT secrets before starting the application
  validateJwtSecrets();

  const app = await NestFactory.create(AppModule);

  // Enable cookie parser middleware
  app.use(cookieParser());

  // Security Headers
  app.use(
    helmet({
      // Content Security Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            'https://cdn.jsdelivr.net',
            'https://unpkg.com',
          ],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
          fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
          connectSrc: ["'self'", 'https://api.sentry.io'],
          mediaSrc: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          upgradeInsecureRequests: [],
          blockAllMixedContent: [],
        },
      },
      // Strict-Transport-Security (HSTS)
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      // X-Frame-Options
      frameguard: {
        action: 'deny',
      },
      // Hide X-Powered-By
      hidePoweredBy: true,
      // X-Content-Type-Options
      noSniff: true,
      // Referrer-Policy
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
      // X-DNS-Prefetch-Control
      dnsPrefetchControl: {
        allow: false,
      },
      // X-Download-Options
      ieNoOpen: true,
      // Cross-Origin policies
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'same-origin' },
    }),
  );

  // CORS Configuration
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3004', // Frontend dev server
      'http://localhost:3005', // Playwright test server
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Number'],
    maxAge: 3600, // Cache preflight for 1 hour
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('arQ API')
    .setDescription('Quranic Arabic Grammar LMS API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
