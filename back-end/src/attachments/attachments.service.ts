import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import { CreateAttachmentDto } from './dto/create-attachment.dto';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
  ) {}

  async create(createAttachmentDto: CreateAttachmentDto) {
    const attachment = this.attachmentRepository.create({
      filename: createAttachmentDto.filename,
      filepath: createAttachmentDto.filepath,
      mimetype: createAttachmentDto.mimetype,
      message: { id: createAttachmentDto.messageId }, // relation
    });
    return await this.attachmentRepository.save(attachment);

    //   await this.attachmentRepository
    // .createQueryBuilder()
    // .insert()
    // .into(Attachment)
    // .values({
    //   filename: file.filename,
    //   filepath: file.path,
    //   mimetype: file.mimetype,
    //   message: { id: messageId },
    // })
    // .execute();
  }

  async findAll() {
    return await this.attachmentRepository.find({ relations: ['message'] });
  }

  async findOne(id: number) {
    return await this.attachmentRepository.findOne({
      where: { id },
      relations: ['message'],
    });
  }

  async remove(id: number) {
    await this.attachmentRepository.delete(id);
  }
}
