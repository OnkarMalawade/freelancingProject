// src/users/dto/add-skills.dto.ts
import { IsArray, IsUUID } from 'class-validator';

export class AddSkillsDto {
  @IsArray()
  @IsUUID(4, { each: true })
  skillIds: string[];
}
