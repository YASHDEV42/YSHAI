// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  // Ensure upload directory exists
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
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
    .addTag('auth')
    .addTag('users')
    .addTag('teams')
    .addTag('posts')
    .addTag('media')
    .addTag('ai')
    .addTag('moderation')
    .addTag('analytics')
    .addTag('billing')
    .addTag('notifications')
    .addTag('webhooks')
    .addTag('meta')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Use environment port
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
}

bootstrap();
