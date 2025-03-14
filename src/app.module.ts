import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from '@nestjs/passport';
import { PrismaModule } from './prisma.module';
import JwtAuthenticationGuard from './auth/jwt-authentication.guard';
import { JwtStrategy } from './auth/jwt.strategy';
import { HealthModule } from './health/health.module';

@Module({
  imports: [AuthModule, TasksModule, UsersModule, PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      })
    }),
    HealthModule
  ],
  controllers: [AppController],
  providers: [AppService
  ],
})
export class AppModule { }
