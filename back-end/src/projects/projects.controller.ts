import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AssignProjectDto } from './dto/assign-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles('client')
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user.userId);
  }

  @Get()
  findAll(@Query() filters: any, @Request() req) {
    // Apply different filters based on user role
    if (req.user.role === 'client') {
      filters.clientId = req.user.userId;
    } else if (req.user.role === 'freelancer') {
      // For freelancers, either show projects assigned to them or unassigned projects
      if (filters.showAssigned === 'true') {
        filters.assignedFreelancerId = req.user.userId;
      } else {
        filters.unassignedOnly = true;
      }
    }

    return this.projectsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles('client')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req,
  ) {
    return this.projectsService.update(id, updateProjectDto, req.user.userId);
  }

  @Patch(':id/assign')
  @Roles('client')
  assignFreelancer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignProjectDto: AssignProjectDto,
    @Request() req,
  ) {
    return this.projectsService.assignFreelancer(
      id,
      assignProjectDto,
      req.user.userId,
    );
  }

  @Delete(':id')
  @Roles('client')
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.projectsService.remove(id, req.user.userId);
  }
}
