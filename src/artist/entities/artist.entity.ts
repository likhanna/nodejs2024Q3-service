import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class Artist {
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsBoolean()
  grammy: boolean;

  constructor(partial: Partial<Artist>) {
    Object.assign(this, partial);
  }
}
