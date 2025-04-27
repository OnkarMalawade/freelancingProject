// src/files/dto/file-upload.dto.ts
import { IsOptional, IsUUID } from 'class-validator';

export class FileUploadDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  milestoneId?: string;

  @IsOptional()
  @IsUUID()
  messageId?: string;
}
