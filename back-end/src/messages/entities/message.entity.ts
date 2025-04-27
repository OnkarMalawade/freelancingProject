import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Attachment } from '../../attachments/entities/attachment.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mid: number; // sender's user id

  @Column()
  senderRole: string; // 'client' or 'freelancer'

  @Column()
  cid: number; // receiver's user id

  @Column()
  receiverRole: string; // 'client' or 'freelancer'

  @Column('text')
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @OneToMany(() => Attachment, (attachment) => attachment.message)
  attachments: Attachment[];
}
