import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelancersService } from './freelancers.service';
import { FreelancersController } from './freelancers.controller';
import { Freelancer } from './entities/freelancer.entity';
import { SkillsFreelancer } from './entities/skillsfreelancer.entity'; // <-- ADD this import

@Module({
  imports: [TypeOrmModule.forFeature([Freelancer, SkillsFreelancer])], // <-- ADD SkillsFreelancer here
  controllers: [FreelancersController],
  providers: [FreelancersService],
})
export class FreelancersModule {}
