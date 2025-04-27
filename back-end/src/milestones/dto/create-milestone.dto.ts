// src/milestones/dto/create-milestone.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsUUID,
  IsIn,
} from 'class-validator';

export class CreateMilestoneDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDateString()
  dueDate: Date;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsIn(['pending', 'in_progress', 'completed', 'approved'])
  status: string;

  @IsNotEmpty()
  @IsUUID()
  projectId: string;
}
