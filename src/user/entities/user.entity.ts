import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from 'typeorm';

const bigint: ValueTransformer = {
  to: (entityValue: number) => entityValue.toString(),
  from: (databaseValue: string): number => parseInt(databaseValue, 10),
};

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column()
  version!: number;

  @Column({ type: 'bigint', transformer: bigint })
  createdAt!: number;

  @Column({ type: 'bigint', transformer: bigint })
  updatedAt!: number;
}
