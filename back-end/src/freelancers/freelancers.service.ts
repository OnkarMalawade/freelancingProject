import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Freelancer } from './entities/freelancer.entity';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';
import { SkillsFreelancer } from './entities/skillsfreelancer.entity';

@Injectable()
export class FreelancersService {
  constructor(
    @InjectRepository(Freelancer)
    private readonly freelancerRepository: Repository<Freelancer>,
    @InjectRepository(SkillsFreelancer)
    private readonly skillsFreelancerRepository: Repository<SkillsFreelancer>,
  ) {}

  async create(createFreelancerDto: CreateFreelancerDto) {
    const { skills, ...freelancerData } = createFreelancerDto;

    const freelancer = this.freelancerRepository.create(freelancerData);
    const savedFreelancer = await this.freelancerRepository.save(freelancer);

    if (skills && skills.length > 0) {
      const skillsEntities = skills.map((skillName) => {
        const skill = new SkillsFreelancer();
        skill.skillName = skillName;
        skill.freelancer = savedFreelancer;
        return skill;
      });

      await this.skillsFreelancerRepository.save(skillsEntities);
    }

    return savedFreelancer;
  }

  async findAll() {
    return this.freelancerRepository.find({ relations: ['skills'] });
  }

  async findOne(id: number) {
    return this.freelancerRepository.findOne({
      where: { id },
      relations: ['skills'],
    });
  }

  async update(id: number, updateFreelancerDto: UpdateFreelancerDto) {
    const { skills, ...freelancerData } = updateFreelancerDto;

    await this.freelancerRepository.update(id, freelancerData);

    if (skills && skills.length > 0) {
      // Delete old skills
      await this.skillsFreelancerRepository.delete({ freelancer: { id } });

      // Save new skills
      const freelancer = await this.freelancerRepository.findOneBy({ id });
      if (!freelancer) {
        throw new Error('Freelancer not found');
      }

      const skillsEntities = skills.map((skillName) => {
        const skill = new SkillsFreelancer();
        skill.skillName = skillName;
        skill.freelancer = freelancer;
        return skill;
      });

      await this.skillsFreelancerRepository.save(skillsEntities);
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.skillsFreelancerRepository.delete({ freelancer: { id } });
    await this.freelancerRepository.delete(id);
  }
}
