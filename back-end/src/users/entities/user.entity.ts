import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  roles: string;

  @Column()
  bio: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  securityQuestion: string;

  @Column()
  securityAnswer: string;
}
