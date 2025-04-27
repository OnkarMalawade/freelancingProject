import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

@Entity()
export class SkillsProjectRequired {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  skillName: string;

  @ManyToOne(() => Project, (project) => project.requiredSkills)
  project: Project;
}
