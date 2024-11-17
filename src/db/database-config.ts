import { ConfigModule } from '@nestjs/config';
import { DataSourceOptions, Migration } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';

import 'dotenv/config';


ConfigModule.forRoot();

const { DB_HOST, DB_HOST_DOCKER, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } =
  process.env;

const url = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST_DOCKER}:${DB_PORT}/${DB_NAME}`;

console.log('DB_HOST:', DB_HOST);
console.log('DB_HOST_DOCKER:', DB_HOST_DOCKER);
console.log('DB_PORT:', DB_PORT);
console.log('DB_USER:', DB_USER);
console.log('DB_PASSWORD:', DB_PASSWORD);
console.log('DB_NAME:', DB_NAME);
console.log('URL:', url);

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  url,
  entities: [User, Artist, Album, Track],
  synchronize: false,
  logging: true,
  migrationsRun: true,
};
