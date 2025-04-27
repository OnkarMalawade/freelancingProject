import { IsArray, IsUUID } from 'class-validator';

export class UpdateUserSkillsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  skillIds: string[];
}
