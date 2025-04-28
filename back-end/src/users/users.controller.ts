import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddSkillsDto } from './dto/add-skills.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // @Roles('admin')
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Post('skills/:id')
  async addSkills(
    @Param('id') id: number,
    @Body('skillIds') skillIds: number[],
  ) {
    return this.usersService.addSkillsToUser(id, skillIds);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  updateProfile(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Delete('me/skills/:skillId')
  removeSkill(@Param('skillId') skillId: number, @Request() req) {
    return this.usersService.removeSkill(req.user.id, skillId);
  }

  @Get('me/skills')
  getUserSkills(@Request() req) {
    return this.usersService.getUserSkills(req.user.id);
  }

  @Post('me/profile-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/profile-images',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const imageUrl = `${process.env.API_URL || 'http://localhost:3000'}/uploads/profile-images/${file.filename}`;
    return this.usersService.updateProfileImage(req.user.id, imageUrl);
  }
}
