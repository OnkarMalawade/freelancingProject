import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const message = this.messageRepository.create(createMessageDto);
    return await this.messageRepository.save(message);

    //  await this.messageRepository
    // .createQueryBuilder()
    // .insert()
    // .into(Message)
    // .values({
    //   mid: createMessageDto.mid,
    //   cid: createMessageDto.cid,
    //   content: createMessageDto.content,
    // })
    // .execute();

    //   await this.messageRepository
    // .createQueryBuilder()
    // .insert()
    // .into(Message)
    // .values({
    //   mid: createMessageDto.mid,
    //   senderRole: createMessageDto.senderRole,
    //   cid: createMessageDto.cid,
    //   receiverRole: createMessageDto.receiverRole,
    //   content: createMessageDto.content,
    // })
    // .execute();
  }

  async findAll() {
    return await this.messageRepository.find();
  }

  async findOne(id: number) {
    return await this.messageRepository.findOneBy({ id });
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    await this.messageRepository.update(id, updateMessageDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.messageRepository.delete(id);
  }
}
