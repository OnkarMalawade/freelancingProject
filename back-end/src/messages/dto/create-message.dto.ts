import { IsNotEmpty, IsNumber, IsString, IsIn } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  mid: number; // sender id

  @IsString()
  @IsIn(['client', 'freelancer'])
  senderRole: string;

  @IsNumber()
  cid: number; // receiver id

  @IsString()
  @IsIn(['client', 'freelancer'])
  receiverRole: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
