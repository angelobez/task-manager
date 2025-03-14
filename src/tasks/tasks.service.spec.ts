import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma.service';
import TestUtil from '../common/test/TestUtil';
import { Status } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;

  const prismaServiceMock = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, {
        provide: PrismaService,
        useValue: prismaServiceMock
      }],
    }).compile();

    service = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTasks', () => {
    it('should return an array of tasks', async () => {
      const task = TestUtil.giveMeAValidTask();
      prismaServiceMock.task.findMany.mockResolvedValue([task, task, task]);
      const tasks = await service.getTasks('userId');
      expect(tasks).toHaveLength(3);
      expect(prismaServiceMock.task.findMany).toHaveBeenCalledTimes(1)
    });

    it('should filter tasks by search term', async () => {
      const task = TestUtil.giveMeAValidTask();
      prismaServiceMock.task.findMany.mockResolvedValue([task]);

      await service.getTasks('userId', undefined, 'searchTerm');

      expect(prismaServiceMock.task.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'userId',
          OR: [
            { title: { contains: 'searchTerm', mode: 'insensitive' } },
            { description: { contains: 'searchTerm', mode: 'insensitive' } },
          ],
        },
      });
    });

    describe('create', () => {
      it('should create a new task', async () => {
        const task = TestUtil.giveMeAValidTask();
        const createTaskDto = {
          title: task.title,
          description: task.description,
          status: Status.PENDING,
          dueDate: new Date(),
        };

        prismaServiceMock.task.create.mockResolvedValue(task);

        const result = await service.create(createTaskDto, 'userId');

        expect(result).toEqual(task);
        expect(prismaServiceMock.task.create).toHaveBeenCalledWith({
          data: {
            ...createTaskDto,
            userId: 'userId',
          },
        });
      });

      it('should create a task without dueDate', async () => {
        const task = TestUtil.giveMeAValidTask();
        const createTaskDto = {
          title: task.title,
          description: task.description,
          status: Status.PENDING,
          userId: task.userId,
        };

        prismaServiceMock.task.create.mockResolvedValue(task);

        await service.create(createTaskDto, 'userId');

        expect(prismaServiceMock.task.create).toHaveBeenCalledWith({
          data: {
            ...createTaskDto,
            dueDate: null,
            userId: 'userId',
          },
        });
      });
    });


    describe('findOne', () => {
      it('should return a task if it exists and belongs to the user', async () => {
        const task = TestUtil.giveMeAValidTask();
        prismaServiceMock.task.findUnique.mockResolvedValue(task);

        const result = await service.findOne(task.id, task.userId);

        expect(result).toEqual(task);
        expect(prismaServiceMock.task.findUnique).toHaveBeenCalledWith({
          where: { id: task.id },
        });
      });

      it('should throw an error if task does not exist', async () => {
        prismaServiceMock.task.findUnique.mockResolvedValue(null);

        await expect(service.findOne('taskId', 'userId')).rejects.toThrow(
          new HttpException('Task not found or access denied.', HttpStatus.NOT_FOUND),
        );
      });

      it('should throw an error if task belongs to different user', async () => {
        const task = TestUtil.giveMeAValidTask();
        prismaServiceMock.task.findUnique.mockResolvedValue(task);

        await expect(service.findOne(task.id, 'differentUserId')).rejects.toThrow(
          new HttpException('Task not found or access denied.', HttpStatus.NOT_FOUND),
        );
      });
    });

    describe('update', () => {
      it('should update a task', async () => {
        const task = TestUtil.giveMeAValidTask();
        const updateTaskDto = {
          title: 'Updated Title',
          status: Status.DONE,
        };

        prismaServiceMock.task.findUnique.mockResolvedValue(task);
        prismaServiceMock.task.update.mockResolvedValue({ ...task, ...updateTaskDto });

        const result = await service.update(task.id, updateTaskDto, task.userId);

        expect(result).toEqual({ ...task, ...updateTaskDto });
        expect(prismaServiceMock.task.update).toHaveBeenCalledWith({
          where: { id: task.id },
          data: updateTaskDto,
        });
      });

      it('should throw an error when updating non-existent task', async () => {
        prismaServiceMock.task.findOne.mockResolvedValue(null);

        await expect(
          service.update('taskId', { title: 'Updated' }, 'userId'),
        ).rejects.toThrow(
          new HttpException('Task not found or access denied.', HttpStatus.NOT_FOUND),
        );
      });
    });

    describe('remove', () => {
      it('should delete a task', async () => {
        const task = TestUtil.giveMeAValidTask();
        prismaServiceMock.task.findOne.mockResolvedValue(task);
        prismaServiceMock.task.delete.mockResolvedValue(task);

        const result = await service.remove(task.id, task.userId);

        expect(result).toEqual({ message: 'Task deleted successfully.' });
        expect(prismaServiceMock.task.delete).toHaveBeenCalledWith({
          where: { id: task.id },
        });
        expect(prismaServiceMock.task.findUnique).toHaveBeenCalledWith({
          where: { id: task.id },
        });
        expect(prismaServiceMock.task.delete).toHaveBeenCalledTimes(1);
      });

      it('should throw an error when deleting non-existent task', async () => {
        prismaServiceMock.task.findUnique.mockResolvedValue(null);

        await expect(service.remove('taskId', 'userId')).rejects.toThrow(
          new HttpException('Task not found or access denied.', HttpStatus.NOT_FOUND),
        );
      });
    });
  });
});
