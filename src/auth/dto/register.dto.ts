import { IsNotEmpty, IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({
        description: 'The email address of the user',
        example: 'michael.scott@dundermifflin.com',
        required: true,
    })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @ApiProperty({
        description: 'The full name of the user',
        example: 'Michael Scott',
        required: true,
        minLength: 2,
        maxLength: 50,
    })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
    name: string;

    @ApiProperty({
        description: 'The password for the user account',
        example: 'thatswhatshesaid123',
        minLength: 6,
        maxLength: 20,
    })
    @IsNotEmpty({ message: 'The password is required.' })
    @IsString({ message: 'The password must be a valid string.' })
    @MinLength(6, { message: 'The password must be at least 6 characters long.' })
    @MaxLength(20, { message: 'The password must be at most 20 characters long.' })
    password: string;
}

export default RegisterDto;