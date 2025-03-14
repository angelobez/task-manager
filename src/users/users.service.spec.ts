import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const prismaServiceMock = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {
        provide: PrismaService,
        useValue: prismaServiceMock
      }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const expectedUser = {
        id: 'userId',
        ...createUserDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaServiceMock.user.create.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
      expect(prismaServiceMock.user.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if creation fails', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      prismaServiceMock.user.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createUserDto)).rejects.toThrow('Database error');
    });
  });

  describe('getByEmail', () => {
    it('should return a user when found by email', async () => {
      const expectedUser = {
        id: 'userId',
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaServiceMock.user.findUnique.mockResolvedValue(expectedUser);

      const result = await service.getByEmail('test@example.com');

      expect(result).toEqual(expectedUser);
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException when user is not found by email', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(service.getByEmail('nonexistent@example.com')).rejects.toThrow(
        new HttpException(
          'User with this email does not exist',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('getById', () => {
    it('should return a user when found by id', async () => {
      const expectedUser = {
        id: 'userId',
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaServiceMock.user.findUnique.mockResolvedValue(expectedUser);

      const result = await service.getById('userId');

      expect(result).toEqual(expectedUser);
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'userId' },
      });
      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException when user is not found by id', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(service.getById('nonexistent-id')).rejects.toThrow(
        new HttpException(
          'User with this id does not exist',
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should throw an error if database query fails', async () => {
      prismaServiceMock.user.findUnique.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.getById('userId')).rejects.toThrow('Database error');
    });
  });
});
