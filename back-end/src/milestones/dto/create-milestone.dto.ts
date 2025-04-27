import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMilestoneDto {
  @IsNumber()
  cid: number;

  @IsNumber()
  mid: number;

  @IsNumber()
  fid: number;

  @IsString()
  @IsNotEmpty()
  mileStonesMsg: string;

  @IsNotEmpty()
  dates: Date;
}
