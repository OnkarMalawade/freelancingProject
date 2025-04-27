import { Module } from '@nestjs/common';
import { FreelancersService } from './freelancers.service';
import { FreelancersController } from './freelancers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Freelancer } from './entities/freelancer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Freelancer])],
  controllers: [FreelancersController],
  providers: [FreelancersService],
})
export class FreelancersModule {}
