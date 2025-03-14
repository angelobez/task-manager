import { IsNotEmpty, IsString, IsEmail, MinLength, Max, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'The name is required.' })
    @IsString({ message: 'The name must be a valid string.' })
    name: string;

    @IsNotEmpty({ message: 'The email is required.' })
    @IsEmail({}, { message: 'The email must be a valid email address.' })
    email: string;

    @IsNotEmpty({ message: 'The password is required.' })
    @IsString({ message: 'The password must be a valid string.' })
    @MinLength(6, { message: 'The password must be at least 6 characters long.' })
    @MaxLength(20, { message: 'The password must be at most 20 characters long.' })
    password: string;
}