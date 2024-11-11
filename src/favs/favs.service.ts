import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { Fav } from './entities/fav.entity';
import { FavoritesResponse } from './dto/response-fav.dto';

@Injectable()
export class FavsService {
  private readonly favsRepository: Fav = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  findAll(): FavoritesResponse {
    const artists = this.artistService.findMany(this.favsRepository.artists);
    const albums = this.albumService.findMany(this.favsRepository.albums);
    const tracks = this.trackService.findMany(this.favsRepository.tracks);

    return {
      artists,
      albums,
      tracks,
    };
  }

  addTrack(trackId: string): string {
    this.trackService.findOne(trackId, HttpStatus.UNPROCESSABLE_ENTITY);
    this.favsRepository.tracks.push(trackId);

    return `Track ${trackId} was successfully added to favourites`;
  }

  removeTrack(trackId: string): void {
    const index = this.favsRepository.tracks.findIndex((it) => it === trackId);

    if (index < 0) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Track with id = ${trackId} does not exist in the favourites`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    this.favsRepository.tracks.splice(index, 1);
  }

  addAlbum(albumId: string): string {
    this.albumService.findOne(albumId, HttpStatus.UNPROCESSABLE_ENTITY);
    this.favsRepository.albums.push(albumId);

    return `Album ${albumId} was successfully added to favourites`;
  }

  removeAlbum(albumId: string): void {
    const index = this.favsRepository.albums.findIndex((it) => it === albumId);

    if (index < 0) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Album with id = ${albumId} does not exist in the favourites`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    this.favsRepository.albums.splice(index, 1);
  }

  addArtist(artistId: string): string {
    this.artistService.findOne(artistId, HttpStatus.UNPROCESSABLE_ENTITY);
    this.favsRepository.artists.push(artistId);

    return `Artist ${artistId} was successfully added to favourites`;
  }

  removeArtist(artistId: string): void {
    const index = this.favsRepository.artists.findIndex(
      (it) => it === artistId,
    );

    if (index < 0) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Artist with id = ${artistId} does not exist in the favourites`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    this.favsRepository.artists.splice(index, 1);
  }
}
