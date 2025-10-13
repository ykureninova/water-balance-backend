import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
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

  // Регистрация пользователя
  @Post('register')
  async register(@Body() dto: AuthDto) {
    // Проверка обязательных полей
    if (
      !dto.username ||
      !dto.password ||
      dto.weight === undefined ||
      dto.height === undefined ||
      dto.waterNorm === undefined
    ) {
      throw new BadRequestException('All fields are required');
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Создаем пользователя
    const user = await this.userService.createUser({
      username: dto.username,
      password: hashedPassword,
      weight: dto.weight,
      height: dto.height,
      waterNorm: dto.waterNorm,
    });

    // ✅ Исправленная проблемная строка
    const userDoc = user as UserDocument; // явное приведение типа
   return { message: 'User registered', userId: (user as any)._id.toString() };
  }

  // Логин пользователя
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
