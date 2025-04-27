import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client_id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('simple-array')
  skills_required: string[];

  @Column('decimal', { precision: 10, scale: 2 })
  budget_min: number;

  @Column('decimal', { precision: 10, scale: 2 })
  budget_max: number;

  @Column('date')
  deadline: string;

  @Column({ nullable: true })
  attachment: string;
}
