// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { existsSync, mkdirSync } from 'fs';
import cookieParser from 'cookie-parser';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';

async function bootstrap() {
  // Ensure upload directory exists
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Authorization',
      credentials: true,
    },
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      skipUndefinedProperties: true,
      exceptionFactory: (errors) => {
        if (
          errors.length &&
          errors[0].target instanceof Object &&
          'file' in errors[0].target
        ) {
          // Skip file-based validation
          return [];
        }
        return errors;
      },
    }),
  );

  app.useStaticAssets(uploadDir, {
    prefix: '/media',
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('YSHAI API')
    .setDescription(
      'The YSHAI backend API documentation. This API manages posts, teams, media, AI generation, moderation, analytics, billing, and more.',
    )
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .addTag('Meta')
    .addTag('Accounts')
    .addTag('Posts')
    .addTag('Media')
    .addTag('AI')
    .addTag('Admin')
    .addTag('Notifications')
    .addTag('Analytics')
    .addTag('Billing')
    .addTag('Webhooks')
    .addTag('Moderation')
    .addTag('Teams')
    .addCookieAuth('accessToken', {
      type: 'apiKey',
      in: 'cookie',
      name: 'accessToken',
      description: 'HttpOnly JWT access token cookie',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  writeFileSync(
    join(process.cwd(), 'swagger-spec.json'),
    JSON.stringify(document, null, 2),
  );
  app.getHttpAdapter().get('/api-json', (req, res: Response) => {
    res.json(document);
  });
  // Use environment port
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
