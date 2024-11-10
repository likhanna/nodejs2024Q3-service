import { OmitType } from '@nestjs/swagger';
import { Track } from '../entities/track.entity';

export class CreateTrackDto extends OmitType(Track, ['id'] as const) {}
