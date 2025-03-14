import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) { }

  async getTasks(userId: string, status?: Status, search?: string) {
    const filters: any = {
      userId,
    };

    if (status) {
      filters.status = status;
    }

    if (search) {
      filters.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prismaService.task.findMany({
      where: filters,
    });
  }

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const { title, description, status, dueDate } = createTaskDto;
    return this.prismaService.task.create({
      data: {
        title,
        description,
        status: status || Status.PENDING,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prismaService.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      throw new HttpException('Task not found or access denied.', HttpStatus.NOT_FOUND);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.findOne(id, userId);
    return this.prismaService.task.update({
      where: { id: task.id },
      data: updateTaskDto,
    });
  }

  async remove(id: string, userId: string) {
    const task = await this.findOne(id, userId);
    await this.prismaService.task.delete({ where: { id: task.id } });
    return { message: 'Task deleted successfully.' };
  }
}
