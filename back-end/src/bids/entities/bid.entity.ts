import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum BidStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  project_id: number;

  @Column()
  freelancer_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  bid_amount: number;

  @Column('text')
  cover_letter: string;

  @Column()
  estimated_days: number;

  @Column({
    type: 'enum',
    enum: BidStatus,
    default: BidStatus.PENDING,
  })
  status: BidStatus;
}
