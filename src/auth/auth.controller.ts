import { Controller, Post, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string; weight: number; height: number }) {
    if (!body) {
      throw new BadRequestException('Request body is required');
    }

    if (!body.username || !body.password || !body.weight || !body.height) {
      throw new BadRequestException('All fields are required');
    }

    const user = await this.userService.createUser({
      username: body.username,
      password: body.password,
      weight: body.weight,
      height: body.height,
    });

    return { 
      message: 'User registered successfully', 
      userId: (user as any)._id?.toString()
    };
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    if (!body) {
      throw new BadRequestException('Request body is required');
    }

    if (!body.username || !body.password) {
      throw new BadRequestException('Username and password are required');
    }

    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }
}
