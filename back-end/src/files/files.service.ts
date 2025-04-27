// src/files/files.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { FileUploadDto } from './dto/file-upload.dto';
import { ProjectsService } from '../projects/projects.service';
import { MilestonesService } from '../milestones/milestones.service';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    private projectsService: ProjectsService,
    private milestonesService: MilestonesService,
    private messagesService: MessagesService,
  ) {}

  async upload(
    file: Express.Multer.File,
    fileUploadDto: FileUploadDto,
    userId: string,
  ) {
    // Validate project access if projectId is provided
    if (fileUploadDto.projectId) {
      const project = await this.projectsService.findOne(
        fileUploadDto.projectId,
      );
      if (
        project.clientId !== userId &&
        project.assignedFreelancerId !== userId
      ) {
        throw new ForbiddenException('You do not have access to this project');
      }
    }

    // Validate milestone access if milestoneId is provided
    if (fileUploadDto.milestoneId) {
      const milestone = await this.milestonesService.findOne(
        fileUploadDto.milestoneId,
      );
      const project = await this.projectsService.findOne(milestone.projectId);
      if (
        project.clientId !== userId &&
        project.assignedFreelancerId !== userId
      ) {
        throw new ForbiddenException(
          'You do not have access to this milestone',
        );
      }
    }

    // Validate message access if messageId is provided
    if (fileUploadDto.messageId) {
      await this.messagesService.findOne(fileUploadDto.messageId, userId);
    }

    // Generate file path and URL
    const fileUrl = `uploads/${file.filename}`;

    const fileEntity = this.filesRepository.create({
      filename: file.originalname,
      fileUrl,
      uploaderId: userId,
      ...fileUploadDto,
    });

    return this.filesRepository.save(fileEntity);
  }

  async findAll(query: {
    projectId?: string;
    milestoneId?: string;
    messageId?: string;
  }) {
    return this.filesRepository.find({
      where: { ...query },
      relations: ['uploader'],
    });
  }

  async findOne(id: string) {
    const file = await this.filesRepository.findOne({
      where: { fileId: id },
      relations: ['uploader', 'project', 'milestone', 'message'],
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    return file;
  }

  async remove(id: string, userId: string) {
    const file = await this.findOne(id);

    if (file.uploaderId !== userId) {
      throw new ForbiddenException('You can only delete files you uploaded');
    }

    return this.filesRepository.remove(file);
  }
}
