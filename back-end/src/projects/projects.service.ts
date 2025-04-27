import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignProjectDto } from './dto/assign-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    clientId: string,
  ): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      clientId,
    });

    return this.projectsRepository.save(project);
  }

  async findAll(filters?: any): Promise<Project[]> {
    const queryBuilder = this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.client', 'client')
      .leftJoinAndSelect('project.assignedFreelancer', 'assignedFreelancer')
      .leftJoinAndSelect('project.bids', 'bids');

    if (filters) {
      if (filters.clientId) {
        queryBuilder.andWhere('project.clientId = :clientId', {
          clientId: filters.clientId,
        });
      }

      if (filters.assignedFreelancerId) {
        queryBuilder.andWhere(
          'project.assignedFreelancerId = :assignedFreelancerId',
          { assignedFreelancerId: filters.assignedFreelancerId },
        );
      }

      if (filters.category) {
        queryBuilder.andWhere('project.category = :category', {
          category: filters.category,
        });
      }

      if (filters.minBudget) {
        queryBuilder.andWhere('project.budget >= :minBudget', {
          minBudget: filters.minBudget,
        });
      }

      if (filters.maxBudget) {
        queryBuilder.andWhere('project.budget <= :maxBudget', {
          maxBudget: filters.maxBudget,
        });
      }

      // Only show unassigned projects for freelancers browsing
      if (filters.unassignedOnly) {
        queryBuilder.andWhere('project.assignedFreelancerId IS NULL');
      }
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { projectId: id },
      relations: [
        'client',
        'assignedFreelancer',
        'bids',
        'bids.freelancer',
        'milestones',
      ],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userId: string,
  ): Promise<Project> {
    const project = await this.findOne(id);

    // Only the client who created the project can update it
    if (project.clientId !== userId) {
      throw new ForbiddenException('You can only update your own projects');
    }

    // Don't allow changing the client
    delete updateProjectDto.clientId;

    this.projectsRepository.merge(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async assignFreelancer(
    id: string,
    assignProjectDto: AssignProjectDto,
    userId: string,
  ): Promise<Project> {
    const project = await this.findOne(id);

    // Only the client who created the project can assign a freelancer
    if (project.clientId !== userId) {
      throw new ForbiddenException(
        'You can only assign freelancers to your own projects',
      );
    }

    project.assignedFreelancerId = assignProjectDto.freelancerId;
    return this.projectsRepository.save(project);
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id);

    // Only the client who created the project can delete it
    if (project.clientId !== userId) {
      throw new ForbiddenException('You can only delete your own projects');
    }

    const result = await this.projectsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }
}
