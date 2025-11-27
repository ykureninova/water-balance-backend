import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DrinkType, DrinkTypeSchema } from './drink.schema';
import { DrinkService } from './drink.service';
import { DrinkController } from './drink.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DrinkType.name, schema: DrinkTypeSchema },
    ]),
  ],
  controllers: [DrinkController],
  providers: [DrinkService],
  exports: [DrinkService],
})
export class DrinkModule {}
