import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  createUser(
    @Body()
    body: {
      username: string;
      password: string;
      email?: string;
      weight?: number;
      height?: number;
      waterNorm?: number;
    },
  ) {
    if (!body.username || !body.password) {
      throw new BadRequestException('Username and password are required');
    }

    return this.userService.createUser({
      username: body.username,
      password: body.password,
      email: body.email,
      weight: body.weight,
      height: body.height,
      waterNorm: body.waterNorm,
    });
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Request() req) {
    return this.userService.getUser(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('me/settings')
  updateSettings(
    @Request() req,
    @Body()
    body: {
      username?: string;
      email?: string;
      password?: string;
      gender?: 'male' | 'female';
      weight?: number;
      height?: number;
      activity?: number;
      waterNorm?: number;
    },
  ) {
    if (!body) {
      throw new BadRequestException('No data provided');
    }
    return this.userService.updateUserSettings(req.user.userId, body);
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }
}
