import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { SkillsProjectRequired } from './entities/skills-projects.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(SkillsProjectRequired)
    private readonly skillsProjectRequiredRepository: Repository<SkillsProjectRequired>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const { skillsRequired, ...projectData } = createProjectDto;

    const project = this.projectRepository.create(projectData);
    const savedProject = await this.projectRepository.save(project);

    if (skillsRequired && skillsRequired.length > 0) {
      const skillsEntities = skillsRequired.map((skillName) => {
        const skill = new SkillsProjectRequired();
        skill.skillName = skillName;
        skill.project = savedProject;
        return skill;
      });

      await this.skillsProjectRequiredRepository.save(skillsEntities);
    }

    return savedProject;
  }

  async findAll() {
    return this.projectRepository.find({ relations: ['skillsRequired'] });
  }

  async findOne(id: number) {
    return this.projectRepository.findOne({
      where: { id },
      relations: ['skillsRequired'],
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const { skillsRequired, ...projectData } = updateProjectDto;

    await this.projectRepository.update(id, projectData);

    if (skillsRequired && skillsRequired.length > 0) {
      // Delete old skills
      await this.skillsProjectRequiredRepository.delete({ project: { id } });

      const project = await this.projectRepository.findOneBy({ id });
      if (!project) {
        throw new Error('Project not found');
      }

      const skillsEntities = skillsRequired.map((skillName) => {
        const skill = new SkillsProjectRequired();
        skill.skillName = skillName;
        skill.project = project;
        return skill;
      });

      await this.skillsProjectRequiredRepository.save(skillsEntities);
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.skillsProjectRequiredRepository.delete({ project: { id } });
    await this.projectRepository.delete(id);
  }
}
