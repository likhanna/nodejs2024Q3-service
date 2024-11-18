import { OmitType } from '@nestjs/swagger';
import { Artist } from '../entities/artist.entity';

export class UpdateArtistDto extends OmitType(Artist, ['id'] as const) {}
