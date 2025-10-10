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

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });

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
    .addTag('Auth')
    .addTag('Users')
    .addTag('Teams')
    .addTag('Posts')
    .addTag('Media')
    .addTag('AI')
    .addTag('Admin')
    .addTag('Accounts')
    .addTag('Notifications')
    .addTag('Analytics')
    .addTag('Billing')
    .addTag('Webhooks')
    .addTag('Meta')
    .addTag('Moderation')
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
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
