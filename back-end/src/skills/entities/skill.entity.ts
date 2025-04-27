import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  skillId: string;

  @Column({ unique: true })
  skillName: string;

  @ManyToMany(() => User, (user) => user.skills)
  users: User[];
}
