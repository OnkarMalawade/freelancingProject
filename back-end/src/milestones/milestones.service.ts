// src/milestones/milestones.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Milestone } from './entities/milestone.entity';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectRepository(Milestone)
    private milestonesRepository: Repository<Milestone>,
    private projectsService: ProjectsService,
  ) {}

  async create(createMilestoneDto: CreateMilestoneDto, userId: string) {
    // Check if project exists and user is the client
    const project = await this.projectsService.findOne(
      createMilestoneDto.projectId,
    );
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.clientId !== userId) {
      throw new ForbiddenException('Only the client can create milestones');
    }

    const milestone = this.milestonesRepository.create(createMilestoneDto);
    return this.milestonesRepository.save(milestone);
  }

  async findAll(projectId?: string) {
    if (projectId) {
      return this.milestonesRepository.find({ where: { projectId } });
    }
    return this.milestonesRepository.find();
  }

  async findOne(id: string) {
    const milestone = await this.milestonesRepository.findOne({
      where: { milestoneId: id },
    });
    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }
    return milestone;
  }

  async update(
    id: string,
    updateMilestoneDto: UpdateMilestoneDto,
    userId: string,
  ) {
    const milestone = await this.findOne(id);
    const project = await this.projectsService.findOne(milestone.projectId);

    // Only client can update milestones
    if (project.clientId !== userId) {
      throw new ForbiddenException('Only the client can update milestones');
    }

    await this.milestonesRepository.update(id, updateMilestoneDto);
    return this.findOne(id);
  }

  async updateStatus(id: string, status: string, userId: string) {
    const milestone = await this.findOne(id);
    const project = await this.projectsService.findOne(milestone.projectId);

    // Validate who can update to what status
    if (status === 'completed' && project.assignedFreelancerId !== userId) {
      throw new ForbiddenException(
        'Only the assigned freelancer can mark milestone as completed',
      );
    }

    if (status === 'approved' && project.clientId !== userId) {
      throw new ForbiddenException('Only the client can approve milestones');
    }

    await this.milestonesRepository.update(id, { status });
    return this.findOne(id);
  }

  async remove(id: string, userId: string) {
    const milestone = await this.findOne(id);
    const project = await this.projectsService.findOne(milestone.projectId);

    if (project.clientId !== userId) {
      throw new ForbiddenException('Only the client can delete milestones');
    }

    return this.milestonesRepository.remove(milestone);
  }
}
