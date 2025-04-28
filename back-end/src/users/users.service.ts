import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddSkillsDto } from './dto/add-skills.dto';
import { Skill } from '../skills/entities/skill.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);

    if (user.password) {
      const salt = await bcrypt.genSalt(10); // 10 is standard
      user.password = await bcrypt.hash(user.password, salt);
    }

    return this.usersRepository.save(user);
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    // Prevent email from being updated
    if ('email' in updateUserDto) {
      delete updateUserDto['email'];
    }

    // If password needs to be updated, hash it
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    // Merge existing user and updated fields
    const updatedUser = this.usersRepository.merge(user, updateUserDto);

    await this.usersRepository.save(updatedUser);
    return this.findOne(id);
  }

  async addSkills(userId: number, addSkillsDto: AddSkillsDto) {
    const user = await this.findOne(userId);
    const skills = await this.skillsRepository.findByIds(addSkillsDto.skillIds);
    user.skills = [...(user.skills || []), ...skills];
    return this.usersRepository.save(user);
  }

  async removeSkill(userId: number, skillId: number) {
    const user = await this.findOne(userId);
    user.skills = user.skills.filter((skill) => skill.id !== skillId);
    return this.usersRepository.save(user);
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id } as any, // 👈 added `as any`
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async getUserSkills(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId } as any, // 👈 added `as any`
      relations: ['skills'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.skills;
  }

  async updateProfileImage(userId: number, imageUrl: string) {
    const user = await this.findOne(userId);
    user.image = imageUrl;
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User with email ${email} not found');
    }
    return user;
  }

  async addSkillsToUser(userId: number, skillIds: number[]): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['skills'], // Important: load existing skills
    });

    if (!user) {
      throw new Error('User not found');
    }

    const skills = await this.skillsRepository.findByIds(skillIds);

    if (!skills.length) {
      throw new Error('Skills not found');
    }

    user.skills = [...user.skills, ...skills]; // merge existing + new
    return await this.usersRepository.save(user);
  }
}
