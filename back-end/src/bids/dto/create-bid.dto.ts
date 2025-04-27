import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  project_id: number;

  @IsNumber()
  freelancer_id: number;

  @IsNumber()
  bid_amount: number;

  @IsString()
  @IsNotEmpty()
  cover_letter: string;

  @IsNumber()
  estimated_days: number;
}
