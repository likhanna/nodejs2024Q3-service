import {
  ConsoleLogger,
  ConsoleLoggerOptions,
  Injectable,
} from '@nestjs/common';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { mkdir, writeFile, stat } from 'node:fs/promises';

import 'dotenv/config';

enum Log {
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  LOG = 'log',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

@Injectable()
export class LoggerService extends ConsoleLogger {
  private readonly level: number;
  private readonly fileSize: number;
  private prefix = Date.now();

  constructor(context: string, options: ConsoleLoggerOptions) {
    super(context, { ...options, logLevels: Object.values(Log) });
    this.level = Number(process.env.LOG_LEVEL) || 2;
    this.fileSize = Number(process.env.MAX_LOG_SIZE_KB) || 10;
  }

  error(msg: string, stackOrContext?: string) {
    if (this.level >= 0) {
      this.createLog(Log.ERROR, `${msg}\n${stackOrContext}`);
    }
  }

  warn(msg: string, context?: string) {
    if (this.level >= 1) {
      this.createLog(Log.WARN, `${msg}`, context);
    }
  }

  log(msg: string, context?: string) {
    if (this.level >= 2) {
      this.createLog(Log.LOG, `${msg}`, context);
    }
  }

  verbose(msg: string, context?: string) {
    if (this.level >= 3) {
      this.createLog(Log.VERBOSE, `${msg}`, context);
    }
  }

  debug(msg: string, context?: string) {
    if (this.level >= 4) {
      this.createLog(Log.DEBUG, `${msg}`, context);
    }
  }

  private async writeFile(message: string, fileName: string) {
    const folder = join(process.cwd(), 'logs');

    if (!existsSync(folder)) {
      await mkdir(folder, { recursive: true });
    }

    let filePath = resolve(folder, `${this.prefix}-${fileName}.log`);

    if (!existsSync(filePath)) {
      await writeFile(filePath, '');
    }

    const { size } = await stat(filePath);

    if (size / 1000 >= this.fileSize) {
      this.prefix = Date.now();
    }

    filePath = resolve(folder, `${this.prefix}-${fileName}.log`);
    await writeFile(filePath, message, { flag: 'a' });
  }

  private async createLog(level: string, message: string, context?: string) {
    const log = `[${this.getTimestamp()}] [${level.toUpperCase()}] [${
      context || ''
    }] - [${message}]\n`;

    super[level](log);
    await this.writeFile(log, level === Log.ERROR ? 'errors' : 'logs');
  }
}
