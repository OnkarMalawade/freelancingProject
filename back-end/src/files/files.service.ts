import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async create(createFileDto: CreateFileDto): Promise<File> {
    const file = this.fileRepository.create(createFileDto);
    return await this.fileRepository.save(file);
  }

  // await this.fileRepository
  // .createQueryBuilder()
  // .insert()
  // .into(File)
  // .values({
  //   fileUrl: file.path,
  //   filetype: file.mimetype,
  //   mid,
  // })
  // .execute();

  async findAll(): Promise<File[]> {
    return await this.fileRepository.find();
  }

  async findOne(id: number): Promise<File> {
    const file = await this.fileRepository.findOneBy({ fileID: id });
    if (!file) {
      throw new Error('File not found');
    }
    return file;
  }

  async remove(id: number): Promise<void> {
    const file = await this.fileRepository.findOneBy({ fileID: id });
    if (!file) {
      throw new Error('File not found');
    }
    await this.fileRepository.delete(id);
  }
}
