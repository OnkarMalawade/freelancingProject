// src/messages/entities/message.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { File } from '../../files/entities/file.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  messageId: string;

  @Column({ type: 'text' })
  text: string;

  @Column()
  senderId: string;

  @Column()
  projectId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @ManyToOne(() => Project, (project) => project.messages)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @OneToMany(() => File, (file) => file.message)
  files: File[];
}
