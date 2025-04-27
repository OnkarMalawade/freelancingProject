// src/messages/messages.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private projectsService: ProjectsService,
  ) {}

  async create(createMessageDto: CreateMessageDto, userId: string) {
    // Check if the project exists and user has access to it
    const project = await this.projectsService.findOne(
      createMessageDto.projectId,
    );

    // Verify that the user is either the client or the assigned freelancer
    if (
      project.clientId !== userId &&
      project.assignedFreelancerId !== userId
    ) {
      throw new ForbiddenException('You do not have access to this project');
    }

    const message = this.messagesRepository.create({
      ...createMessageDto,
      senderId: userId,
    });

    return this.messagesRepository.save(message);
  }

  async findAll(projectId: string, userId: string) {
    // Verify user has access to the project
    const project = await this.projectsService.findOne(projectId);

    if (
      project.clientId !== userId &&
      project.assignedFreelancerId !== userId
    ) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return this.messagesRepository.find({
      where: { projectId },
      relations: ['sender', 'files'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string, userId: string) {
    const message = await this.messagesRepository.findOne({
      where: { messageId: id },
      relations: ['sender', 'project', 'files'],
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    // Check if user has access to this message
    const project = await this.projectsService.findOne(message.projectId);

    if (
      project.clientId !== userId &&
      project.assignedFreelancerId !== userId
    ) {
      throw new ForbiddenException('You do not have access to this message');
    }

    return message;
  }
}
