import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import {
    IsOptional,
    IsString,
    IsEnum,
    IsDateString,
} from 'class-validator';
import { Status } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @ApiPropertyOptional({
        description: 'The task title to update',
        example: 'Updated task title',
    })
    @IsOptional()
    @IsString({ message: 'The title must be a valid string.' })
    title?: string;

    @ApiPropertyOptional({
        description: 'The updated task description',
        example: 'Updated description for the task',
    })
    @IsOptional()
    @IsString({ message: 'The description must be a valid string.' })
    description?: string | null;

    @ApiPropertyOptional({
        description: 'The updated task status',
        enum: Status,
        example: Status.DONE,
    })
    @IsOptional()
    @IsEnum(Status, {
        message: 'The status must be PENDING, IN_PROGRESS, or DONE.',
    })
    status?: Status;

    @ApiPropertyOptional({
        description: 'The updated due date in ISO format',
        example: '2025-12-31T23:59:59.000Z',
        type: String,
        format: 'date-time',
    })
    @IsOptional()
    @IsDateString({}, { message: 'The due date must be a valid date string.' })
    dueDate?: Date | null;
}