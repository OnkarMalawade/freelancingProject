import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('milestones')
export class Milestone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cid: number;

  @Column()
  mid: number;

  @Column()
  fid: number;

  @Column()
  mileStonesMsg: string;

  @Column()
  dates: Date;
}
