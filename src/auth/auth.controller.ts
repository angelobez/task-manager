import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, Get } from '@nestjs/common';
import { Response } from 'express';
// import RegisterDto from './dto/register.dto';
// import RequestWithUser from './requestWithUser.interface';
// import { LocalAuthenticationGuard } from './localAuthentication.guard';
// import JwtAuthenticationGuard from './jwt-authentication.guard';
import { AuthService } from './auth.service';
import RegisterDto from './dto/register.dto';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import RequestWithUser from './requestWithUser.interface';
// import RegisterDto from './register.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('register')
    async register(@Body() registrationData: RegisterDto) {
        return this.authService.register(registrationData);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('log-in')
    async login(@Req() request: RequestWithUser, @Res() response: Response) {
        // const user = request.user;

        const { user } = request;
        const cookie = this.authService.getCookieWithJwtToken(user.id);
        response.setHeader('Set-Cookie', cookie);
        // user.password = undefined;
        return response.send(user);
    }

    // async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    //     const { user } = request;
    //     const cookie = this.authService.getCookieWithJwtToken(user.id);
    //     response.setHeader('Set-Cookie', cookie);
    //     user.password = undefined;
    //     return response.send(user);
    // }

    // @UseGuards(JwtAuthenticationGuard)
    // @Post('log-out')
    // async logOut(@Res() response: Response) {
    //     response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    //     return response.sendStatus(200);
    // }

    // @UseGuards(JwtAuthenticationGuard)
    // @Get()
    // authenticate(@Req() request: RequestWithUser) {
    //     const user = request.user;
    //     user.password = undefined;
    //     return user;
    // }
}
