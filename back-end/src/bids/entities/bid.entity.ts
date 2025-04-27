import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  bidId: string;

  @Column()
  projectId: string;

  @Column()
  freelancerId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  bidAmount: number;

  @Column('date')
  bidDate: Date;

  @Column('text', { nullable: true })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Project, (project) => project.bids)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => User, (user) => user.bids)
  @JoinColumn({ name: 'freelancerId' })
  freelancer: User;
}
