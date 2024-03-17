import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { UserStorage } from 'src/shared/user.storage';
import { SharedContextService } from 'src/shared/shared-context.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private sharedContextService: SharedContextService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'SECRET',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      return null;
    }

    UserStorage.set(user);

    this.sharedContextService.set('currentUser', user.id);

    return {
      id: payload.sub,
      username: payload.username,
    };
  }
}
