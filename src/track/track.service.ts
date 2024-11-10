import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrackService {
  private readonly trackRepository: Track[] = [];

  create(dto: CreateTrackDto): Track {
    const { name, albumId, artistId, duration } = dto;

    const newTrack = new Track({
      id: uuidv4(),
      name,
      albumId,
      artistId,
      duration,
    });

    this.trackRepository.push(newTrack);
    return newTrack;
  }

  findAll(): Track[] {
    return this.trackRepository;
  }

  findOne(id: string) {
    const track = this.trackRepository.find((it) => it.id === id);

    if (!track) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Track with this id does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return track;
  }

  update(id: string, dto: UpdateTrackDto): Track {
    const { name, albumId, artistId, duration } = dto;
    const track = this.findOne(id);

    track.name = name;
    track.albumId = albumId;
    track.artistId = artistId;
    track.duration = duration;

    return track;
  }

  remove(id: string): void {
    const track = this.findOne(id);
    const index = this.trackRepository.findIndex((it) => it.id === track.id);
    this.trackRepository.splice(index, 1);
  }
}
