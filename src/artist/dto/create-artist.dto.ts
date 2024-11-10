import { OmitType } from '@nestjs/swagger';
import { Artist } from '../entities/artist.entity';

export class CreateArtistDto extends OmitType(Artist, ['id'] as const) {}
