import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateFreelancerDto {
  @IsNumber()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsOptional()
  @IsArray()
  skills?: string[];

  @IsNumber()
  experience: number;

  @IsNumber()
  hourly_rate: number;

  @IsOptional()
  @IsString()
  profile_image?: string;
}
