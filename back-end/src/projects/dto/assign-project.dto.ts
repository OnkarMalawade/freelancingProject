import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignProjectDto {
  @IsNotEmpty()
  @IsUUID()
  freelancerId: string;
}
