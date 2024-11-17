import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Track extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ nullable: true })
  @IsString()
  @ValidateIf((object, value) => value !== null)
  artistId: string | null;

  @Column({ nullable: true })
  @IsString()
  @ValidateIf((object, value) => value !== null)
  albumId: string | null;

  @Column()
  @IsNumber()
  duration: number;

  @Exclude()
  @Column({ default: false })
  isFavorite: boolean;
}
