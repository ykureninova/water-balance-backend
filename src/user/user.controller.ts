import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  createUser(
    @Body() body: { username: string; password: string; weight?: number; height?: number; waterNorm?: number }
  ) {
    // Передаем все поля, включая обязательный password
    return this.userService.createUser({
      username: body.username,
      password: body.password,
      weight: body.weight,
      height: body.height,
      waterNorm: body.waterNorm,
    });
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(Number(id));
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
