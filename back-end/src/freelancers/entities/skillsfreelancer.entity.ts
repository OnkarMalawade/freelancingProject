import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Freelancer } from './freelancer.entity';

@Entity()
export class SkillsFreelancer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  skillName: string;

  @ManyToOne(() => Freelancer, (freelancer) => freelancer.skills)
  freelancer: Freelancer;
}
