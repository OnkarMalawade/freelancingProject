// src/milestones/milestones.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('milestones')
@UseGuards(JwtAuthGuard)
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post()
  @Roles('client')
  @UseGuards(RolesGuard)
  create(@Body() createMilestoneDto: CreateMilestoneDto, @Req() req) {
    return this.milestonesService.create(createMilestoneDto, req.user.userId);
  }

  @Get()
  findAll(@Query('projectId') projectId: string) {
    return this.milestonesService.findAll(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.milestonesService.findOne(id);
  }

  @Patch(':id')
  @Roles('client')
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateMilestoneDto: UpdateMilestoneDto,
    @Req() req,
  ) {
    return this.milestonesService.update(
      id,
      updateMilestoneDto,
      req.user.userId,
    );
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req,
  ) {
    return this.milestonesService.updateStatus(id, status, req.user.userId);
  }

  @Delete(':id')
  @Roles('client')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.milestonesService.remove(id, req.user.userId);
  }
}
