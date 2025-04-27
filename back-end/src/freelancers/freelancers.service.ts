import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Freelancer } from './entities/freelancer.entity';
import { CreateFreelancerDto } from './dto/create-freelancer.dto';
import { UpdateFreelancerDto } from './dto/update-freelancer.dto';

@Injectable()
export class FreelancersService {
  constructor(
    @InjectRepository(Freelancer)
    private readonly freelancerRepository: Repository<Freelancer>,
  ) {}

  async create(createFreelancerDto: CreateFreelancerDto) {
    const freelancer = this.freelancerRepository.create(createFreelancerDto);
    return await this.freelancerRepository.save(freelancer);
  }

  async findAll() {
    return await this.freelancerRepository.find();
  }

  async findOne(id: number) {
    return await this.freelancerRepository.findOneBy({ id });
  }

  async update(id: number, updateFreelancerDto: UpdateFreelancerDto) {
    await this.freelancerRepository.update(id, updateFreelancerDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.freelancerRepository.delete(id);
  }
}
