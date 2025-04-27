// src/messages/messages.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto, @Req() req) {
    return this.messagesService.create(createMessageDto, req.user.userId);
  }

  @Get()
  findAll(@Query('projectId') projectId: string, @Req() req) {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    return this.messagesService.findAll(projectId, req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.messagesService.findOne(id, req.user.userId);
  }
}
