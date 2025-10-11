import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthDto } from './auth.dto';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  // Регистрация
  @Post('register')
  async register(@Body() dto: AuthDto) {
    if (!dto.username || !dto.password || !dto.weight || !dto.height || !dto.waterNorm) {
      throw new BadRequestException('All fields are required');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.createUser({
      username: dto.username,
      password: hashedPassword,
      weight: dto.weight,
      height: dto.height,
      waterNorm: dto.waterNorm,
    });

    return { message: 'User registered', userId: user.id };
  }

  // Логин
  @Post('login')
  async login(@Body() dto: AuthDto) {
    if (!dto.username || !dto.password) {
      throw new BadRequestException('Username and password are required');
    }

    const user = await this.authService.validateUser(dto.username, dto.password);
    if (!user) return { message: 'Invalid credentials' };

    return this.authService.login(user);
  }
}
