import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const userId = user._id.toString();
    const timestamp = new Date();
    
    await this.userService.updateLastActivity(userId);
    this.eventEmitter.emit('user.login', {
      userId,
      timestamp
    });

    const { password: _, ...result } = user.toObject();
    return result;
  }

  async login(user: any) {
    const payload = { 
      username: user.username, 
      userId: user._id.toString() 
    };
    
    return { 
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id.toString(),
        username: user.username,
        weight: user.weight,
        height: user.height
      }
    };
  }
}
