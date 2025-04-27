import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';
import { File } from '../../files/entities/file.entity';

@Entity('milestones')
export class Milestone {
  @PrimaryGeneratedColumn('uuid')
  milestoneId: string;

  @Column()
  title: string;

  @Column('date')
  dueDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  status: string; // 'pending', 'completed', 'paid'

  @Column()
  projectId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Project, (project) => project.milestones)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @OneToOne(() => Invoice, (invoice) => invoice.milestone)
  invoice: Invoice;

  @OneToMany(() => File, (file) => file.milestone)
  files: File[];
}
