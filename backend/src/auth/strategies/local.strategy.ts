import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { User } from 'src/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    console.log(`Validating user with email: ${email} from local strategy`);
    const result = await this.authService.validateUser(email, password);
    if (!result) {
      console.log('Validation failed: Invalid email or password');
      throw new UnauthorizedException();
    }
    console.log('Validation successful');
    return result;
  }
}
