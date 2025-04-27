import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateInvoiceDto {
  @IsNumber()
  project_id: number;

  @IsNumber()
  client_id: number;

  @IsNumber()
  freelancer_id: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  payment_date?: Date;
}
