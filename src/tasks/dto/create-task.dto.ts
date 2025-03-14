import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsEnum,
    IsDateString,
} from 'class-validator';
import { Status } from '@prisma/client';

export class CreateTaskDto {
    @IsNotEmpty({ message: 'The task title is required.' })
    @IsString({ message: 'The title must be a valid string.' })
    title: string;

    @IsOptional()
    @IsString({ message: 'The description must be a valid string.' })
    description: string | null;

    @IsOptional()
    @IsEnum(Status, {
        message: 'The status must be PENDING, IN_PROGRESS, or DONE.',
    })
    status?: Status;

    @IsOptional()
    @IsDateString({}, { message: 'The due date must be a valid date string.' })
    dueDate?: Date | null;
}