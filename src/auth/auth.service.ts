import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // usernameOrEmail + password
  async validateUser(identifier: string, password: string) {
    const user: any =
      (await this.userService.findByUsernameOrEmail(identifier)) || null;
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      userId: user._id,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
