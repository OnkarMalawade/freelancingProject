// src/invoices/dto/create-invoice.dto.ts
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsUUID()
  milestoneId: string;
}
