import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsEnum,
    IsDateString,
} from 'class-validator';
import { Status } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
    @ApiProperty({
        description: 'The task title',
        example: 'Watch Threat Level Midnight',
    })
    @IsNotEmpty({ message: 'The task title is required.' })
    @IsString({ message: 'The title must be a valid string.' })
    title: string;


    @ApiPropertyOptional({
        description: 'An optional task description',
        example: 'My masterpiece. Directed by me. Starring me.',
    })
    @IsOptional()
    @IsString({ message: 'The description must be a valid string.' })
    description: string | null;

    @ApiPropertyOptional({
        description: 'The task status',
        enum: Status,
        example: Status.PENDING,
    })
    @IsOptional()
    @IsEnum(Status, {
        message: 'The status must be PENDING, IN_PROGRESS, or DONE.',
    })
    status?: Status;

    @ApiPropertyOptional({
        description: 'The due date of the task in ISO format',
        example: '2025-12-31T23:59:59.000Z',
        type: String,
        format: 'date-time',
    }) @ApiPropertyOptional({
        description: 'The due date of the task in ISO format',
        example: '2025-12-31T23:59:59.000Z',
        type: String,
        format: 'date-time',
    })
    @IsOptional()
    @IsDateString({}, { message: 'The due date must be a valid date string.' })
    dueDate?: Date | null;
}