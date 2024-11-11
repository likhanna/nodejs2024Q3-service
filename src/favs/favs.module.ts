import { Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { TrackModule } from '../track/track.module';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';

@Module({
  controllers: [FavsController],
  providers: [FavsService],
  imports: [ArtistModule, AlbumModule, TrackModule],
})
export class FavsModule {}
