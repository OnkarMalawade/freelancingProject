import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  password?: string;

  @IsOptional()
  roles?: string;

  @IsOptional()
  bio?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  securityQuestion?: string;

  @IsOptional()
  securityAnswer?: string;
}
