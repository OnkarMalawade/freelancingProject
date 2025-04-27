import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SkillsFreelancer } from './skillsfreelancer.entity';

@Entity('freelancers')
export class Freelancer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  title: string;

  @Column('text')
  bio: string;

  @OneToMany(() => SkillsFreelancer, (skill) => skill.freelancer)
  skills: SkillsFreelancer[];

  @Column('int')
  experience: number; // years

  @Column('decimal', { precision: 10, scale: 2 })
  hourly_rate: number;

  @Column({ nullable: true })
  profile_image: string; // image path
}
