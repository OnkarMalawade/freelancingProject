import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Skill } from '../skills/entities/skill.entity'; // ADD THIS

@Module({
  imports: [TypeOrmModule.forFeature([User, Skill])], // ADD Skill here
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
