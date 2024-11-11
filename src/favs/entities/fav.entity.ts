import { IsUUID } from 'class-validator';

export class Fav {
  @IsUUID('4', { each: true })
  artists: string[];

  @IsUUID('4', { each: true })
  albums: string[];
  tracks: string[];

  constructor(partial: Partial<Fav>) {
    Object.assign(this, partial);
  }
}
