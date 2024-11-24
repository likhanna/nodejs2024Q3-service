import { Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { TrackModule } from '../track/track.module';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from '../artist/entities/artist.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Artist, Album, Track]),
    ArtistModule,
    AlbumModule,
    TrackModule,
    AuthModule,
  ],
  controllers: [FavsController],
  providers: [FavsService],
})
export class FavsModule {}
