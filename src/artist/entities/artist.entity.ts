import { Exclude } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Artist extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column()
  @IsBoolean()
  grammy: boolean;

  @Exclude()
  @Column({ default: false })
  isFavorite: boolean;
}
