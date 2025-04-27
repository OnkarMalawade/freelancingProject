import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SkillsProjectRequired } from './skills-projects.entity';
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

  @OneToMany(() => SkillsProjectRequired, (skill) => skill.project)
  requiredSkills: SkillsProjectRequired[];

  @Column('decimal', { precision: 10, scale: 2 })
  budget_min: number;

  @Column('decimal', { precision: 10, scale: 2 })
  budget_max: number;

  @Column('date')
  deadline: string;

  @Column({ nullable: true })
  attachment: string;
}
