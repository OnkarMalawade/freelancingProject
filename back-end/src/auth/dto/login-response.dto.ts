export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    userId: string;
    name: string;
    email: string;
    role: string;
  };
}
