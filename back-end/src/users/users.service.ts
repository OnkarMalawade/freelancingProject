import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const user = this.userRepository.create(createUserDto);
    return await instanceToPlain(this.userRepository.save(user));
  }

  async findAll() {
    return await instanceToPlain(this.userRepository.find());
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return instanceToPlain(user);
  }

  async findByEmail(email: string) {
    return await instanceToPlain(
      this.userRepository.findOne({ where: { email } }),
    );
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id); // check if user exists
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id); // check if user exists
    await this.userRepository.delete(id);
    return { message: 'User deleted successfully' };
  }

  async updatePassword(id: number, newPassword: string) {
    const user = await this.findOne(id); // check if user exists
    return this.userRepository.update(id, { password: newPassword });
  }
}
