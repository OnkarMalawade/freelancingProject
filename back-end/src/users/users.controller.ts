import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  Request,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserSkillsDto } from './dto/update-user-skills.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

import { AddSkillsDto } from './dto/add-skills.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Post('skills')
  @UseGuards(JwtAuthGuard)
  addSkills(@Body() addSkillsDto: AddSkillsDto, @Req() req) {
    return this.usersService.addSkills(req.user.userId, addSkillsDto);
  }

  @Delete('skills/:skillId')
  @UseGuards(JwtAuthGuard)
  removeSkill(@Param('skillId') skillId: string, @Req() req) {
    return this.usersService.removeSkill(req.user.userId, skillId);
  }

  @Get('skills')
  @UseGuards(JwtAuthGuard)
  getUserSkills(@Req() req) {
    return this.usersService.getUserSkills(req.user.userId);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    // Allow users to view their own profile or admins to view any profile
    if (req.user.userId !== id && req.user.role !== 'admin') {
      throw new ForbiddenException('You can only view your own profile');
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    // Allow users to update their own profile or admins to update any profile
    if (req.user.userId !== id && req.user.role !== 'admin') {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/skills')
  updateSkills(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSkillsDto: UpdateUserSkillsDto,
    @Request() req,
  ) {
    // Allow users to update their own skills or admins to update any user's skills
    if (req.user.userId !== id && req.user.role !== 'admin') {
      throw new ForbiddenException('You can only update your own skills');
    }
    return this.usersService.updateUserSkills(id, updateSkillsDto);
  }

  @Post(':id/profile-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/profile-images',
        filename: (req, file, cb) => {
          const fileName = `${uuid()}${extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
    }),
  )
  async uploadProfileImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    // Allow users to upload their own profile image or admins to upload any user's image
    if (req.user.userId !== id && req.user.role !== 'admin') {
      throw new ForbiddenException(
        'You can only upload your own profile image',
      );
    }

    const imageUrl = `${process.env.API_URL || 'http://localhost:3000'}/uploads/profile-images/${file.filename}`;
    return this.usersService.updateProfileImage(id, imageUrl);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
