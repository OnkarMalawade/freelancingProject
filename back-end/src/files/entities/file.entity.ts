import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { Milestone } from '../../milestones/entities/milestone.entity';
import { Message } from '../../messages/entities/message.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  fileId: string;

  @Column()
  filename: string;

  @Column()
  fileUrl: string;

  @Column()
  uploaderId: string;

  @Column({ nullable: true })
  projectId: string;

  @Column({ nullable: true })
  milestoneId: string;

  @Column({ nullable: true })
  messageId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.uploadedFiles)
  @JoinColumn({ name: 'uploaderId' })
  uploader: User;

  @ManyToOne(() => Project, (project) => project.files, { nullable: true })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => Milestone, (milestone) => milestone.files, {
    nullable: true,
  })
  @JoinColumn({ name: 'milestoneId' })
  milestone: Milestone;

  @ManyToOne(() => Message, (message) => message.files, { nullable: true })
  @JoinColumn({ name: 'messageId' })
  message: Message;
}
