import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Bid } from '../../bids/entities/bid.entity';
import { Message } from '../../messages/entities/message.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';
import { File } from '../../files/entities/file.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  role: string; // 'client' or 'freelancer'

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Project, (project) => project.client)
  clientProjects: Project[];

  @OneToMany(() => Project, (project) => project.assignedFreelancer)
  assignedProjects: Project[];

  @OneToMany(() => Bid, (bid) => bid.freelancer)
  bids: Bid[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => File, (file) => file.uploader)
  uploadedFiles: File[];

  @OneToMany(() => Invoice, (invoice) => invoice.client)
  clientInvoices: Invoice[];

  @OneToMany(() => Invoice, (invoice) => invoice.freelancer)
  freelancerInvoices: Invoice[];

  @ManyToMany(() => Skill, (skill) => skill.users)
  @JoinTable({
    name: 'user_skills',
    joinColumn: { name: 'userId', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'skillId', referencedColumnName: 'skillId' },
  })
  skills: Skill[];
}
