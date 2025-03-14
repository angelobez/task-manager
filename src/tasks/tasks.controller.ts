import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, Req, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import JwtAuthenticationGuard from '../auth/jwt-authentication.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { Status } from '@prisma/client';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Req() request) {
    const userId = request.user.id;
    return this.tasksService.create(createTaskDto, userId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async findAll(
    @Req() request: RequestWithUser,
    @Query('status') status?: Status,
    @Query('search') search?: string
  ) {
    const userId = request.user.id;
    return this.tasksService.getTasks(userId, status, search);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request) {
    const userId = request.user.id;
    return this.tasksService.findOne(id, userId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() request
  ) {
    const userId = request.user.id;
    return this.tasksService.update(id, updateTaskDto, userId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request) {
    const userId = request.user.id;
    return this.tasksService.remove(id, userId);
  }
}
