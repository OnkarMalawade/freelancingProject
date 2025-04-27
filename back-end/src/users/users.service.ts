import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserSkillsDto } from './dto/update-user-skills.dto';
import { Skill } from '../skills/entities/skill.entity';
import { AddSkillsDto } from './dto/add-skills.dto';
import { SkillsService } from '../skills/skills.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private skillsService: SkillsService,
  ) {}

  async addSkills(userId: string, addSkillsDto: AddSkillsDto) {
    const user = await this.findOne(userId);

    // Get all the skills
    const skillPromises = addSkillsDto.skillIds.map((skillId) =>
      this.skillsService.findOne(skillId),
    );

    const skills = await Promise.all(skillPromises);

    // Add skills to user's skills array
    if (!user.skills) {
      user.skills = [];
    }

    user.skills = [...user.skills, ...skills];

    return this.usersRepository.save(user);
  }

  async removeSkill(userId: string, skillId: string) {
    const user = await this.findOne(userId);
    await this.skillsService.findOne(skillId); // Ensure skill exists

    if (!user.skills) {
      return user;
    }

    user.skills = user.skills.filter((skill) => skill.skillId !== skillId);

    return this.usersRepository.save(user);
  }

  async getUserSkills(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { userId },
      relations: ['skills'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.skills || [];
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    // Check if user with this email already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: [
        'userId',
        'name',
        'email',
        'role',
        'bio',
        'image',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { userId: id },
      relations: ['skills'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async updateUserSkills(
    id: string,
    updateSkillsDto: UpdateUserSkillsDto,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (updateSkillsDto.skillIds && updateSkillsDto.skillIds.length > 0) {
      const skillPromises = updateSkillsDto.skillIds.map((skillId) =>
        this.skillsService.findOne(skillId),
      );
      const skills = await Promise.all(skillPromises);
      user.skills = skills;
    } else {
      user.skills = [];
    }

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async updateProfileImage(id: string, imageUrl: string): Promise<User> {
    const user = await this.findOne(id);
    user.image = imageUrl;
    return this.usersRepository.save(user);
  }
}
