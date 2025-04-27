// src/files/files.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Query,
  Body,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadDto } from './dto/file-upload.dto';
import { extname } from 'path';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedFileTypes = [
          '.jpg',
          '.jpeg',
          '.png',
          '.pdf',
          '.doc',
          '.docx',
          '.xls',
          '.xlsx',
          '.txt',
        ];
        const ext = extname(file.originalname).toLowerCase();
        if (allowedFileTypes.includes(ext)) {
          cb(null, true);
        } else {
          cb(new Error('Unsupported file type'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() fileUploadDto: FileUploadDto,
    @Req() req,
  ) {
    return this.filesService.upload(file, fileUploadDto, req.user.userId);
  }

  @Get()
  findAll(
    @Query('projectId') projectId: string,
    @Query('milestoneId') milestoneId: string,
    @Query('messageId') messageId: string,
  ) {
    return this.filesService.findAll({ projectId, milestoneId, messageId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.filesService.remove(id, req.user.userId);
  }
}
