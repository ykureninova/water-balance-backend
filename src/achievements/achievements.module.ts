import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { User, UserSchema } from '../user/user.schema';
import { Achievement, AchievementSchema } from './achievement.schema';
import { UserAchievement, UserAchievementSchema } from './user-achievement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Achievement.name, schema: AchievementSchema },
      { name: UserAchievement.name, schema: UserAchievementSchema },
    ]),
    EventEmitterModule.forRoot(),
  ],
  providers: [AchievementsService],
  controllers: [AchievementsController],
  exports: [AchievementsService],
})
export class AchievementsModule {}
