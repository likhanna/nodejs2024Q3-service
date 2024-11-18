import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track) private trackRepository: Repository<Track>,
  ) {}

  async create(dto: CreateTrackDto): Promise<Track> {
    const { name, albumId, artistId, duration } = dto;

    const newTrack = this.trackRepository.create({
      name,
      albumId,
      artistId,
      duration,
    });

    await this.trackRepository.save(newTrack);

    return newTrack;
  }

  async findAll(): Promise<Track[]> {
    const tracks = await this.trackRepository.find();

    return tracks;
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.trackRepository.findOne({ where: { id } });

    if (!track) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Track with id = ${id} does not exist`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return track;
  }

  async findMany(ids: string[]): Promise<Track[]> {
    const tracks = await this.trackRepository.findBy({ id: In(ids) });
    return tracks;
  }

  async getFavorites(): Promise<Track[]> {
    const tracks = await this.trackRepository.find({
      where: { isFavorite: true },
    });
    return tracks;
  }

  async setFavorite(trackId: string, action: 'add' | 'remove'): Promise<void> {
    switch (action) {
      case 'remove': {
        const track = await this.trackRepository.findOne({
          where: { id: trackId, isFavorite: true },
        });

        if (!track) {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: `Track with such trackId = ${trackId} does not exist in the favourites`,
            },
            HttpStatus.NOT_FOUND,
          );
        }

        track.isFavorite = false;
        await this.trackRepository.save(track);
        break;
      }

      default: {
        const track = await this.trackRepository.findOne({
          where: { id: trackId },
        });

        if (!track) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              error: `Track with such trackId = ${trackId} does not exist`,
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }

        track.isFavorite = true;
        await this.trackRepository.save(track);
        break;
      }
    }
  }

  async update(id: string, dto: UpdateTrackDto): Promise<Track> {
    const { name, albumId, artistId, duration } = dto;
    const track = await this.findOne(id);

    track.name = name;
    track.albumId = albumId;
    track.artistId = artistId;
    track.duration = duration;

    await this.trackRepository.save(track);

    return track;
  }

  async remove(id: string): Promise<void> {
    const track = await this.findOne(id);

    await this.trackRepository.delete({ id: track.id });
  }

  async invalidateAlbum(albumId: string): Promise<void> {
    const track = await this.trackRepository.findOne({ where: { albumId } });

    if (track) {
      track.albumId = null;
      await this.trackRepository.save(track);
    }
  }

  async invalidateArtist(artistId: string): Promise<void> {
    const track = await this.trackRepository.findOne({ where: { artistId } });

    if (track) {
      track.artistId = null;
      await this.trackRepository.save(track);
    }
  }
}
