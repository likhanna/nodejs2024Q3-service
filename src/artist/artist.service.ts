import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuidv4 } from 'uuid';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { map, selectFromMap } from '../utils/common';

@Injectable()
export class ArtistService {
  private readonly artistRepository: Artist[] = [];

  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
  ) {}

  create(dto: CreateArtistDto): Artist {
    const { name, grammy } = dto;

    const newArtist = new Artist({
      id: uuidv4(),
      name,
      grammy,
    });

    this.artistRepository.push(newArtist);
    return newArtist;
  }

  findAll(): Artist[] {
    return this.artistRepository;
  }

  findOne(id: string, status = HttpStatus.NOT_FOUND): Artist {
    const artist = this.artistRepository.find((it) => it.id === id);

    if (!artist) {
      throw new HttpException(
        {
          status,
          error: `Artist with such id = ${id} does not exist`,
        },
        status,
      );
    }

    return artist;
  }

  findMany(ids: string[]): Artist[] {
    const artistMap = map(this.artistRepository, (it) => it.id);
    return selectFromMap(ids, artistMap);
  }

  update(id: string, dto: UpdateArtistDto): Artist {
    const { name, grammy } = dto;
    const artist = this.findOne(id);

    artist.name = name;
    artist.grammy = grammy;

    return artist;
  }

  remove(id: string): void {
    const artist = this.findOne(id);
    const index = this.artistRepository.findIndex((it) => it.id === artist.id);
    this.artistRepository.splice(index, 1);

    this.trackService.invalidateArtist(id);
    this.albumService.invalidateArtist(id);
  }
}
