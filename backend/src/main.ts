// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import * as path from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  // Ensure uploads directory exists
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  // Create Nest App
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Authorization',
    },
  });

  app.use(cookieParser());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: false,
      skipUndefinedProperties: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  // Static Assets (Media Uploads)
  app.useStaticAssets(uploadDir, {
    prefix: '/media',
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('YSHAI API')
    .setDescription(
      'Backend API for YSHAI: social media scheduling, AI generation, analytics, billing, teams, and more.',
    )
    .setVersion('1.0')
    .addCookieAuth('accessToken', {
      type: 'apiKey',
      in: 'cookie',
      name: 'accessToken',
      description: 'HttpOnly access token',
    })
    .addTag('Auth')
    .addTag('Users')
    .addTag('Meta')
    .addTag('Accounts')
    .addTag('Posts')
    .addTag('Media')
    .addTag('AI')
    .addTag('Notifications')
    .addTag('Analytics')
    .addTag('Billing')
    .addTag('Moderation')
    .addTag('Webhooks')
    .addTag('Teams')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI + /api-json automatically
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'api-json',
  });

  // Also save swagger-spec.json locally
  writeFileSync(
    path.join(process.cwd(), 'swagger-spec.json'),
    JSON.stringify(document, null, 2),
  );
  // Start Server
  // ----------------------------
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

  await app.listen(port);
  console.log(` Server running: http://localhost:${port}`);
  console.log(` Swagger UI: http://localhost:${port}/docs`);
  console.log(` Swagger JSON: http://localhost:${port}/api-json`);
}

bootstrap().catch((err) => {
  console.error('❌ Bootstrap failed:', err);
  process.exit(1);
});
