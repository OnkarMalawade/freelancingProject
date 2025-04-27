import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Bid } from '../../bids/entities/bid.entity';
import { Milestone } from '../../milestones/entities/milestone.entity';
import { Message } from '../../messages/entities/message.entity';
import { File } from '../../files/entities/file.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  projectId: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  budget: number;

  @Column('date')
  deadline: Date;

  @Column()
  clientId: string;

  @Column({ nullable: true })
  assignedFreelancerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.clientProjects)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @ManyToOne(() => User, (user) => user.assignedProjects)
  @JoinColumn({ name: 'assignedFreelancerId' })
  assignedFreelancer: User;

  @OneToMany(() => Bid, (bid) => bid.project)
  bids: Bid[];

  @OneToMany(() => Milestone, (milestone) => milestone.project)
  milestones: Milestone[];

  @OneToMany(() => Message, (message) => message.project)
  messages: Message[];

  @OneToMany(() => File, (file) => file.project)
  files: File[];
}
