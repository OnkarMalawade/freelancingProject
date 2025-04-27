import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { SkillsProjectRequired } from './entities/skills-projects.entity'; // <-- ADD this import

@Module({
  imports: [TypeOrmModule.forFeature([Project, SkillsProjectRequired])], // <-- ADD SkillsProjectRequired here
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
