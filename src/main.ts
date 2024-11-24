import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { parse as parseYAML } from 'yaml';

import 'dotenv/config';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;

  const app = await NestFactory.create(AppModule);

  const logger = app.get(LoggerService);
  app.useLogger(logger);

  process.on('unhandledRejection', (e) => {
    logger.error(
      'unhandledRejection',
      e instanceof Error ? e.stack : String(e),
    );
  });

  process.on('uncaughtException', (e) => {
    logger.error('uncaughtException', e.stack);
    process.exit(1);
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const file = readFileSync(pathResolve('./doc/api.yaml'), 'utf8');
  const document = parseYAML(file);
  SwaggerModule.setup('/doc', app, document);

  await app.listen(PORT, () =>
    console.log(
      `\nServer started on port = ${PORT}. Swagger hosted on: \x1b[34mhttp://localhost:${PORT}/doc/\x1b[0m`,
    ),
  );
}
bootstrap();
