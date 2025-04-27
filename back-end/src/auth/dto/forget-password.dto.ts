import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgetPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  securityAnswer: string;

  @IsNotEmpty()
  newPassword: string;
}
