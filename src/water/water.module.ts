import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WaterController } from './water.controller';
import { WaterService } from './water.service';
import { Water, WaterSchema } from './water.schema';
import { User, UserSchema } from '../user/user.schema';
import { DrinkType, DrinkTypeSchema } from '../drink/drink.schema';

import { AchievementModule } from '../achievement/achievement.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Water.name, schema: WaterSchema },
      { name: User.name, schema: UserSchema },
      { name: DrinkType.name, schema: DrinkTypeSchema },
    ]),

    forwardRef(() => AchievementModule),
  ],
  controllers: [WaterController],
  providers: [WaterService],
  exports: [
    WaterService,
    MongooseModule,
  ],
})
export class WaterModule {}
