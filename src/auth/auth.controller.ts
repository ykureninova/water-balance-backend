import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../user/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // Реєстрація
  @Post('register')
  async register(@Body() dto: AuthDto) {
    if (!dto.username || !dto.password) {
      throw new BadRequestException('Username and password are required');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = (await this.userService.createUser({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      gender: dto.gender,
      weight: dto.weight,
      height: dto.height,
      activity: dto.activity,
      waterNorm: dto.waterNorm,
    })) as UserDocument;

    // одразу логінимо — повертаємо токен
    return this.authService.login(user);
  }

  // Логін
  @Post('login')
  async login(@Body() dto: AuthDto) {
    if (!dto.username || !dto.password) {
      throw new BadRequestException('Username and password are required');
    }

    const user = await this.authService.validateUser(
      dto.username,
      dto.password,
    );
    if (!user) return { message: 'Invalid credentials' };

    return this.authService.login(user);
  }
}
