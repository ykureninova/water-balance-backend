import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';
import { Achievement, AchievementSchema } from './user-achievement.schema';

import { WaterModule } from '../water/water.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserAchievement', schema: AchievementSchema },
    ]),

    forwardRef(() => WaterModule),
    UserModule,
  ],
  controllers: [AchievementController],
  providers: [AchievementService],
  exports: [AchievementService],
})
export class AchievementModule {}
