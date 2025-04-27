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
  ForbiddenException,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ProjectsService } from '../projects/projects.service';

@Controller('bids')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BidsController {
  constructor(
    private readonly bidsService: BidsService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Post()
  @Roles('freelancer')
  create(@Body() createBidDto: CreateBidDto, @Request() req) {
    return this.bidsService.create(createBidDto, req.user.userId);
  }

  @Get()
  async findAll(@Query() filters: any, @Request() req) {
    // Apply different filters based on user role
    if (req.user.role === 'freelancer') {
      filters.freelancerId = req.user.userId;
    } else if (req.user.role === 'client' && filters.projectId) {
      // Validate that the client owns the project
      const project = await this.projectsService.findOne(filters.projectId);
      if (project.clientId !== req.user.userId) {
        throw new ForbiddenException(
          'You can only view bids for your own projects',
        );
      }
    } else if (req.user.role === 'client') {
      // Get all projects owned by the client
      const projects = await this.projectsService.findAll({
        clientId: req.user.userId,
      });
      const projectIds = projects.map((project) => project.projectId);

      // If no projects, return empty array
      if (projectIds.length === 0) {
        return [];
      }

      // Custom query to find bids for all client's projects
      return this.bidsService.findAll({
        projectIds: projectIds,
      });
    }

    return this.bidsService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    const bid = await this.bidsService.findOne(id);

    // Check if user has access to this bid
    if (
      req.user.role === 'freelancer' &&
      bid.freelancerId !== req.user.userId
    ) {
      throw new ForbiddenException('You can only view your own bids');
    } else if (req.user.role === 'client') {
      const project = await this.projectsService.findOne(bid.projectId);
      if (project.clientId !== req.user.userId) {
        throw new ForbiddenException(
          'You can only view bids for your own projects',
        );
      }
    }

    return bid;
  }

  @Patch(':id')
  @Roles('freelancer')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBidDto: UpdateBidDto,
    @Request() req,
  ) {
    return this.bidsService.update(id, updateBidDto, req.user.userId);
  }

  @Delete(':id')
  @Roles('freelancer')
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.bidsService.remove(id, req.user.userId);
  }
}
