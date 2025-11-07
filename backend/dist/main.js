"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const helmet_1 = require("helmet");
const cookieParser = require("cookie-parser");
function validateJwtSecrets() {
    const jwtSecret = process.env.JWT_SECRET;
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
    const nodeEnv = process.env.NODE_ENV || 'development';
    const isProduction = nodeEnv === 'production';
    const weakSecrets = [
        'your-secret-key',
        'secret',
        'changeme',
        'password',
        '123456',
        'default',
        'test',
    ];
    if (!jwtSecret) {
        console.error('❌ FATAL ERROR: JWT_SECRET environment variable is not set!');
        console.error('   Set JWT_SECRET in your .env file');
        process.exit(1);
    }
    if (!refreshSecret) {
        console.error('❌ FATAL ERROR: REFRESH_TOKEN_SECRET environment variable is not set!');
        console.error('   Set REFRESH_TOKEN_SECRET in your .env file');
        process.exit(1);
    }
    if (weakSecrets.some((weak) => jwtSecret.toLowerCase().includes(weak))) {
        console.error('❌ FATAL ERROR: JWT_SECRET appears to be a weak or default value!');
        console.error("   Generate a strong secret using: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"");
        process.exit(1);
    }
    if (weakSecrets.some((weak) => refreshSecret.toLowerCase().includes(weak))) {
        console.error('❌ FATAL ERROR: REFRESH_TOKEN_SECRET appears to be a weak or default value!');
        console.error("   Generate a strong secret using: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"");
        process.exit(1);
    }
    const minLength = isProduction ? 32 : 16;
    if (jwtSecret.length < minLength) {
        console.error(`❌ FATAL ERROR: JWT_SECRET is too short! Minimum ${minLength} characters required (${isProduction ? 'production' : 'development'} mode)`);
        console.error("   Generate a strong secret using: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"");
        process.exit(1);
    }
    if (refreshSecret.length < minLength) {
        console.error(`❌ FATAL ERROR: REFRESH_TOKEN_SECRET is too short! Minimum ${minLength} characters required (${isProduction ? 'production' : 'development'} mode)`);
        console.error("   Generate a strong secret using: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"");
        process.exit(1);
    }
    if (jwtSecret === refreshSecret) {
        console.error('❌ FATAL ERROR: JWT_SECRET and REFRESH_TOKEN_SECRET must be different!');
        console.error('   Generate two different secrets');
        process.exit(1);
    }
    if (isProduction) {
        console.log('✅ JWT secrets validated successfully (production mode)');
    }
    else {
        console.log('✅ JWT secrets validated successfully (development mode)');
    }
}
async function bootstrap() {
    validateJwtSecrets();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.use((0, helmet_1.default)({
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
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
        frameguard: {
            action: 'deny',
        },
        hidePoweredBy: true,
        noSniff: true,
        referrerPolicy: {
            policy: 'strict-origin-when-cross-origin',
        },
        dnsPrefetchControl: {
            allow: false,
        },
        ieNoOpen: true,
        crossOriginEmbedderPolicy: true,
        crossOriginOpenerPolicy: { policy: 'same-origin' },
        crossOriginResourcePolicy: { policy: 'same-origin' },
    }));
    app.enableCors({
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            'http://localhost:3004',
            'http://localhost:3005',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['X-Total-Count', 'X-Page-Number'],
        maxAge: 3600,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('arQ API')
        .setDescription('Quranic Arabic Grammar LMS API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map