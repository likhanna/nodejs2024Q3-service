import { OmitType } from '@nestjs/swagger';
import { Track } from '../entities/track.entity';

export class UpdateTrackDto extends OmitType(Track, ['id'] as const) {}
