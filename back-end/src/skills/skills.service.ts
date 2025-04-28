import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) {}

  async create(createSkillDto: CreateSkillDto) {
    const existingSkill = await this.skillsRepository.findOne({
      where: { skillName: createSkillDto.skillName },
    });

    if (existingSkill) {
      throw new ConflictException('Skill already exists');
    }

    const skill = this.skillsRepository.create(createSkillDto);
    return this.skillsRepository.save(skill);
  }

  async findAll() {
    return this.skillsRepository.find();
  }

  async findOne(id: number) {
    const skill = await this.skillsRepository.findOne({
      where: { id }, // ✅ Corrected here
    });

    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    return skill;
  }

  async findByName(name: string) {
    return this.skillsRepository.findOne({ where: { skillName: name } });
  }

  async remove(id: number) {
    const skill = await this.findOne(id);
    return this.skillsRepository.remove(skill);
  }
}
