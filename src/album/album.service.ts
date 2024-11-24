import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { TrackService } from '../track/track.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album) private albumRepository: Repository<Album>,
    private readonly trackService: TrackService,
  ) {}

  async create(dto: CreateAlbumDto): Promise<Album> {
    const { name, artistId, year } = dto;

    const newAlbum = this.albumRepository.create({
      name,
      artistId,
      year,
    });

    await this.albumRepository.save(newAlbum);

    return newAlbum;
  }

  async findAll(): Promise<Album[]> {
    const albums = this.albumRepository.find();

    return albums;
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.albumRepository.findOne({ where: { id } });

    if (!album) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Artist with such id = ${id} does not exist`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return album;
  }

  async findMany(ids: string[]): Promise<Album[]> {
    const albums = await this.albumRepository.findBy({ id: In(ids) });
    return albums;
  }

  async getFavorites(): Promise<Album[]> {
    const albums = await this.albumRepository.find({
      where: { isFavorite: true },
    });
    return albums;
  }

  async setFavorite(albumId: string, action: 'add' | 'remove'): Promise<void> {
    switch (action) {
      case 'remove': {
        const album = await this.albumRepository.findOne({
          where: { id: albumId, isFavorite: true },
        });

        if (!album) {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: `Album with such id = ${albumId} does not exist in the favourites`,
            },
            HttpStatus.NOT_FOUND,
          );
        }

        album.isFavorite = false;
        await this.albumRepository.save(album);
        break;
      }

      default: {
        const album = await this.albumRepository.findOne({
          where: { id: albumId },
        });

        if (!album) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              error: `Album with such albumId = ${albumId} does not exist`,
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }

        album.isFavorite = true;
        await this.albumRepository.save(album);
        break;
      }
    }
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
    const { name, artistId, year } = dto;
    const album = await this.findOne(id);

    album.name = name;
    album.artistId = artistId;
    album.year = year;

    await this.albumRepository.save(album);

    return album;
  }

  async remove(id: string): Promise<void> {
    const album = await this.findOne(id);
    await this.albumRepository.delete({ id: album.id });

    await this.trackService.invalidateAlbum(id);
  }

  async invalidateArtist(artistId: string): Promise<void> {
    const album = await this.albumRepository.findOne({ where: { artistId } });

    if (album) {
      album.artistId = null;
      await this.albumRepository.save(album);
    }
  }
}
