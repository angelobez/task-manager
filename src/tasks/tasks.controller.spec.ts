import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Status } from '@prisma/client';
import TestUtil from '../common/test/TestUtil';
import { Task } from './entities/task.entity';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTasksService = {
    create: jest.fn(),
    getTasks: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{
        provide: TasksService,
        useValue: mockTasksService
      }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: Status.PENDING,
        dueDate: new Date(),
      };

      const mockRequest = {
        user: { id: 'userId' },
      };

      const expectedTask = TestUtil.giveMeAValidTask();
      mockTasksService.create.mockResolvedValue(expectedTask);

      const result = await controller.create(createTaskDto, mockRequest);

      expect(result).toEqual(expectedTask);
      expect(mockTasksService.create).toHaveBeenCalledWith(
        createTaskDto,
        'userId',
      );
    });
  });

  describe('findAll', () => {
    it('should return all tasks for a user', async () => {
      const mockRequest = {
        user: { id: 'userId' },
      } as RequestWithUser;

      const expectedTasks = [
        TestUtil.giveMeAValidTask(),
        TestUtil.giveMeAValidTask(),
      ];
      mockTasksService.getTasks.mockResolvedValue(expectedTasks);

      const result = await controller.findAll(mockRequest);

      expect(result).toEqual(expectedTasks);
      expect(mockTasksService.getTasks).toHaveBeenCalledWith(
        'userId',
        undefined,
        undefined,
      );
    });
  });

  it('should return filtered tasks by status', async () => {
    const mockRequest = {
      user: { id: 'userId' },
    } as RequestWithUser;

    const expectedTasks = [TestUtil.giveMeAValidTask()];
    mockTasksService.getTasks.mockResolvedValue(expectedTasks);

    const result = await controller.findAll(
      mockRequest,
      Status.PENDING,
      undefined,
    );

    expect(result).toEqual(expectedTasks);
    expect(mockTasksService.getTasks).toHaveBeenCalledWith(
      'userId',
      Status.PENDING,
      undefined,
    );
  });

  it('should return searched tasks', async () => {
    const mockRequest = {
      user: { id: 'userId' },
    } as RequestWithUser;

    const expectedTasks = [TestUtil.giveMeAValidTask()];
    mockTasksService.getTasks.mockResolvedValue(expectedTasks);

    const result = await controller.findAll(
      mockRequest,
      undefined,
      'searchTerm',
    );

    expect(result).toEqual(expectedTasks);
    expect(mockTasksService.getTasks).toHaveBeenCalledWith(
      'userId',
      undefined,
      'searchTerm',
    );
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      const mockRequest = {
        user: { id: 'userId' },
      } as RequestWithUser;

      const expectedTask = TestUtil.giveMeAValidTask();
      mockTasksService.findOne.mockResolvedValue(expectedTask);

      const result = await controller.findOne('taskId', mockRequest);

      expect(result).toEqual(expectedTask);
      expect(mockTasksService.findOne).toHaveBeenCalledWith('taskId', 'userId');
    });

    it('should handle task not found', async () => {
      const mockRequest = {
        user: { id: 'userId' },
      };

      mockTasksService.findOne.mockRejectedValue(
        new HttpException('Task not found or access denied.', HttpStatus.NOT_FOUND),
      );

      await expect(controller.findOne('taskId', mockRequest)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        status: Status.DONE,
      };

      const mockRequest = {
        user: { id: 'userId' },
      } as RequestWithUser;

      const expectedTask = TestUtil.giveMeAValidTask();
      mockTasksService.update.mockResolvedValue(expectedTask);

      const result = await controller.update('taskId', updateTaskDto, mockRequest);

      expect(result).toEqual(expectedTask);
      expect(mockTasksService.update).toHaveBeenCalledWith(
        'taskId',
        updateTaskDto,
        'userId',
      );
    });

    it('should handle update of non-existent task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
      };

      const mockRequest = {
        user: { id: 'userId' },
      };

      mockTasksService.update.mockRejectedValue(
        new HttpException('Task not found or access denied.', HttpStatus.NOT_FOUND),
      );

      await expect(
        controller.update('taskId', updateTaskDto, mockRequest),
      ).rejects.toThrow(HttpException);
    });
  });


  describe('remove', () => {
    it('should delete a task', async () => {
      const mockRequest = {
        user: { id: 'userId' },
      };

      const expectedResponse = { message: 'Task deleted successfully.' };
      mockTasksService.remove.mockResolvedValue(expectedResponse);

      const result = await controller.remove('taskId', mockRequest);

      expect(result).toEqual(expectedResponse);
      expect(mockTasksService.remove).toHaveBeenCalledWith('taskId', 'userId');
    });

    it('should handle deletion of non-existent task', async () => {
      const mockRequest = {
        user: { id: 'userId' },
      };

      mockTasksService.remove.mockRejectedValue(
        new HttpException('Task not found or access denied.', HttpStatus.NOT_FOUND),
      );

      await expect(controller.remove('taskId', mockRequest)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
