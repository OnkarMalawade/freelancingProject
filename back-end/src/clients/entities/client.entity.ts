import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  company_name: string;

  @Column('text')
  bio: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  profile_image: string; // profile image path
}
