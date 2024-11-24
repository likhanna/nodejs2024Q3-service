import { Injectable } from '@nestjs/common';

import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { FavoritesResponse } from './dto/response-fav.dto';

@Injectable()
export class FavsService {
  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  async findAll(): Promise<FavoritesResponse> {
    const artists = await this.artistService.getFavorites();
    const albums = await this.albumService.getFavorites();
    const tracks = await this.trackService.getFavorites();

    return {
      artists,
      albums,
      tracks,
    };
  }

  async addTrack(trackId: string): Promise<string> {
    await this.trackService.setFavorite(trackId, 'add');

    return `Track ${trackId} was successfully added to favourites`;
  }

  async removeTrack(trackId: string): Promise<void> {
    await this.trackService.setFavorite(trackId, 'remove');
  }

  async addAlbum(albumId: string): Promise<string> {
    await this.albumService.setFavorite(albumId, 'add');

    return `Album ${albumId} was successfully added to favourites`;
  }

  async removeAlbum(albumId: string): Promise<void> {
    await this.albumService.setFavorite(albumId, 'remove');
  }

  async addArtist(artistId: string): Promise<string> {
    await this.artistService.setFavorite(artistId, 'add');

    return `Artist ${artistId} was successfully added to favourites`;
  }

  async removeArtist(artistId: string): Promise<void> {
    await this.artistService.setFavorite(artistId, 'remove');
  }
}
