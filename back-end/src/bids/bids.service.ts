import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private bidsRepository: Repository<Bid>,
    private projectsService: ProjectsService,
  ) {}

  async create(createBidDto: CreateBidDto, freelancerId: string): Promise<Bid> {
    // Check if project exists
    const project = await this.projectsService.findOne(createBidDto.projectId);

    // Check if the project is already assigned
    if (project.assignedFreelancerId) {
      throw new ConflictException(
        'This project has already been assigned to a freelancer',
      );
    }

    // Check if the freelancer has already bid on this project
    const existingBid = await this.bidsRepository.findOne({
      where: {
        projectId: createBidDto.projectId,
        freelancerId,
      },
    });

    if (existingBid) {
      throw new ConflictException('You have already bid on this project');
    }

    const bid = this.bidsRepository.create({
      ...createBidDto,
      freelancerId,
      bidDate: new Date(),
    });

    return this.bidsRepository.save(bid);
  }

  async findAll(filters?: any): Promise<Bid[]> {
    const queryBuilder = this.bidsRepository
      .createQueryBuilder('bid')
      .leftJoinAndSelect('bid.project', 'project')
      .leftJoinAndSelect('bid.freelancer', 'freelancer');

    if (filters) {
      if (filters.projectId) {
        queryBuilder.andWhere('bid.projectId = :projectId', {
          projectId: filters.projectId,
        });
      }

      if (filters.freelancerId) {
        queryBuilder.andWhere('bid.freelancerId = :freelancerId', {
          freelancerId: filters.freelancerId,
        });
      }
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Bid> {
    const bid = await this.bidsRepository.findOne({
      where: { bidId: id },
      relations: ['project', 'freelancer'],
    });

    if (!bid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }

    return bid;
  }

  async update(
    id: string,
    updateBidDto: UpdateBidDto,
    freelancerId: string,
  ): Promise<Bid> {
    const bid = await this.findOne(id);

    // Only the freelancer who created the bid can update it
    if (bid.freelancerId !== freelancerId) {
      throw new ForbiddenException('You can only update your own bids');
    }

    // Check if the project is already assigned
    const project = await this.projectsService.findOne(bid.projectId);
    if (project.assignedFreelancerId) {
      throw new ConflictException(
        'This project has already been assigned to a freelancer',
      );
    }

    // Don't allow changing the project or freelancer
    delete updateBidDto.projectId;
    delete updateBidDto.freelancerId;

    this.bidsRepository.merge(bid, updateBidDto);
    return this.bidsRepository.save(bid);
  }

  async remove(id: string, freelancerId: string): Promise<void> {
    const bid = await this.findOne(id);

    // Only the freelancer who created the bid can delete it
    if (bid.freelancerId !== freelancerId) {
      throw new ForbiddenException('You can only delete your own bids');
    }

    // Check if the project is already assigned
    const project = await this.projectsService.findOne(bid.projectId);
    if (project.assignedFreelancerId) {
      throw new ConflictException(
        'This project has already been assigned to a freelancer',
      );
    }

    const result = await this.bidsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }
  }
}
