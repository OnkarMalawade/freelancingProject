import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column('simple-array')
  skills: string[]; // ['React', 'Node.js', 'AWS']

  @Column('int')
  experience: number; // years

  @Column('decimal', { precision: 10, scale: 2 })
  hourly_rate: number;

  @Column({ nullable: true })
  profile_image: string; // image path
}
