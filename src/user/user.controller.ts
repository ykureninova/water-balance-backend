import { Controller, Post, Body, Get, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  async createUser(@Body() body: { username: string; password: string; weight: number; height: number }) {
    if (!body.weight || !body.height) {
      throw new BadRequestException('Weight and height are required');
    }

    return this.userService.createUser({
      username: body.username,
      password: body.password,
      weight: body.weight,
      height: body.height,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req) {
    return this.userService.getUser(req.user.userId);
  }
}
