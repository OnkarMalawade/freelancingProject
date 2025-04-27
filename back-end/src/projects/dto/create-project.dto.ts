import {
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateProjectDto {
  @IsNumber()
  client_id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  skillsRequired?: string[];

  @IsNumber()
  budget_min: number;

  @IsNumber()
  budget_max: number;

  @IsString()
  deadline: string;

  @IsOptional()
  @IsString()
  attachment?: string;
}
