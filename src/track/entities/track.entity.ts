import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

export class Track {
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  artistId: string | null;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  albumId: string | null;

  @IsNumber()
  duration: number;

  constructor(partial: Partial<Track>) {
    Object.assign(this, partial);
  }
}
