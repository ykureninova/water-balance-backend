import { Controller, Get, Post, Body } from '@nestjs/common';
import { DrinkService } from './drink.service';

@Controller('drink')
export class DrinkController {
  constructor(private readonly drinkService: DrinkService) {}

  @Get('all')
  getAll() {
    return this.drinkService.getAll();
  }

  @Post('create')
  createDrink(
    @Body() body: { name: string; caffeinated: boolean },
  ) {
    return this.drinkService.create(body.name, body.caffeinated);
  }
}
