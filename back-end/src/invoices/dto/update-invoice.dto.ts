// src/invoices/dto/update-invoice.dto.ts
import { IsBoolean } from 'class-validator';

export class UpdateInvoiceDto {
  @IsBoolean()
  isPaid: boolean;
}
