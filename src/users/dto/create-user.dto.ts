import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength, Max, MaxLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: 'The name of the user',
        example: 'Michael Scott',
    })
    @IsNotEmpty({ message: 'The name is required.' })
    @IsString({ message: 'The name must be a valid string.' })
    name: string;

    @ApiProperty({
        description: 'The email address of the user',
        example: 'michael.scott@dundermifflin.com',
    })
    @IsNotEmpty({ message: 'The email is required.' })
    @IsEmail({}, { message: 'The email must be a valid email address.' })
    email: string;

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