import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
  ) {}

  async create(dto: CreateArtistDto): Promise<Artist> {
    const { name, grammy } = dto;

    const newArtist = this.artistRepository.create({
      name,
      grammy,
    });

    await this.artistRepository.save(newArtist);

    return newArtist;
  }

  async findAll(): Promise<Artist[]> {
    const artists: Artist[] = await this.artistRepository.find();

    return artists;
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id } });

    if (!artist) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Artist with such id = ${id} does not exist`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return artist;
  }

  async findMany(ids: string[]): Promise<Artist[]> {
    const artists = await this.artistRepository.findBy({ id: In(ids) });
    return artists;
  }

  async getFavorites(): Promise<Artist[]> {
    const artists = await this.artistRepository.find({
      where: { isFavorite: true },
    });
    return artists;
  }

  async setFavorite(artistId: string, action: 'add' | 'remove'): Promise<void> {
    switch (action) {
      case 'remove': {
        const artist = await this.artistRepository.findOne({
          where: { id: artistId, isFavorite: true },
        });

        if (!artist) {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: `Artist with such artistId = ${artistId} does not exist in the favourites`,
            },
            HttpStatus.NOT_FOUND,
          );
        }

        artist.isFavorite = false;
        await this.artistRepository.save(artist);
        break;
      }

      default: {
        const artist = await this.artistRepository.findOne({
          where: { id: artistId },
        });

        if (!artist) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              error: `Artist with such artistId = ${artistId} does not exist`,
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }

        artist.isFavorite = true;
        await this.artistRepository.save(artist);
        break;
      }
    }
  }

  async update(id: string, dto: UpdateArtistDto): Promise<Artist> {
    const { name, grammy } = dto;
    const artist = await this.findOne(id);

    artist.name = name;
    artist.grammy = grammy;

    await this.artistRepository.save(artist);

    return artist;
  }

  async remove(id: string): Promise<void> {
    const artist = await this.findOne(id);
    await this.artistRepository.delete({ id: artist.id });

    await this.trackService.invalidateArtist(id);
    await this.albumService.invalidateArtist(id);
  }
}
