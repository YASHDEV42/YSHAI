import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function main() {
  process.env.SKIP_DB = 'true';
  const app = await NestFactory.create(AppModule, { logger: false });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('YSHAI API')
    .setDescription('Generated for Orval client')
    .setVersion('1.0')
    .addCookieAuth('accessToken', {
      type: 'apiKey',
      in: 'cookie',
      name: 'accessToken',
    })
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  writeFileSync(
    join(process.cwd(), 'swagger-spec.json'),
    JSON.stringify(doc, null, 2),
  );
  await app.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
