import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone } from './entities/milestone.entity';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectRepository(Milestone)
    private readonly milestoneRepository: Repository<Milestone>,
  ) {}

  async create(createMilestoneDto: CreateMilestoneDto) {
    const milestone = this.milestoneRepository.create(createMilestoneDto);
    return await this.milestoneRepository.save(milestone);

    //  await this.milestoneRepository
    // .createQueryBuilder()
    // .insert()
    // .into(Milestone)
    // .values({
    //   cid: createMilestoneDto.cid,
    //   mid: createMilestoneDto.mid,
    //   fid: createMilestoneDto.fid,
    //   mileStonesMsg: createMilestoneDto.mileStonesMsg,
    //   dates: createMilestoneDto.dates,
    // })
    // .execute();
  }

  async findAll() {
    return await this.milestoneRepository.find();
  }

  async findOne(id: number) {
    return await this.milestoneRepository.findOneBy({ id });
  }

  async update(id: number, updateMilestoneDto: UpdateMilestoneDto) {
    await this.milestoneRepository.update(id, updateMilestoneDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.milestoneRepository.delete(id);
  }
}
