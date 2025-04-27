import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateBidDto {
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  bidAmount: number;

  @IsOptional()
  @IsString()
  message?: string;
}
