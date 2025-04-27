import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateClientDto {
  @IsNumber()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  company_name: string;

  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  profile_image?: string;
}
