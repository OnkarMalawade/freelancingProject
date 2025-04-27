import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsDateString,
} from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  budget: number;

  @IsNotEmpty()
  @IsDateString()
  deadline: Date;
}
