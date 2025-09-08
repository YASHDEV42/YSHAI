import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { MailerModule } from '../mailer/mailer.module';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  // import passport and jwt modules
  // passport is a middleware for authentication from express
  // jwt is json web token, a standard for securely transmitting information between parties as a JSON object
  // here we configure jwt with a secret and an expiration time
  imports: [
    UsersModule,
    MailerModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],

  // provide the auth service and strategies for dependency injection
  providers: [AuthService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
