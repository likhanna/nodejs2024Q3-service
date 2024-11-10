import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { v4 as uuidv4 } from 'uuid';
import { TrackService } from '../track/track.service';

@Injectable()
export class AlbumService {
  private readonly albumRepository: Album[] = [];

  constructor(private readonly trackService: TrackService) {}

  create(dto: CreateAlbumDto): Album {
    const { name, artistId, year } = dto;

    const newAlbum = new Album({
      id: uuidv4(),
      name,
      artistId,
      year,
    });

    this.albumRepository.push(newAlbum);
    return newAlbum;
  }

  findAll(): Album[] {
    return this.albumRepository;
  }

  findOne(id: string): Album {
    const album = this.albumRepository.find((it) => it.id === id);

    if (!album) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Artist with this id does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return album;
  }

  update(id: string, dto: UpdateAlbumDto): Album {
    const { name, artistId, year } = dto;
    const album = this.findOne(id);

    album.name = name;
    album.artistId = artistId;
    album.year = year;

    return album;
  }

  remove(id: string): void {
    const album = this.findOne(id);
    const index = this.albumRepository.findIndex((it) => it.id === album.id);
    this.albumRepository.splice(index, 1);

    this.trackService.invalidateAlbum(id);
  }

  invalidateArtist(artistId: string): void {
    this.albumRepository.forEach((it) => {
      if (it.artistId === artistId) {
        it.artistId = null;
      }
    });
  }
}
