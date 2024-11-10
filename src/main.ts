import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { parse as parseYAML } from 'yaml';

import 'dotenv/config';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const file = readFileSync(pathResolve('./doc/api.yaml'), 'utf8');
  const document = parseYAML(file);
  SwaggerModule.setup('/api', app, document);

  await app.listen(4000, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
