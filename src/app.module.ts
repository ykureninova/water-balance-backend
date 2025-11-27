import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from './user/user.module';
import { WaterModule } from './water/water.module';
import { AuthModule } from './auth/auth.module';
import { AchievementModule } from './achievement/achievement.module';
import { DrinkModule } from './drink/drink.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGO_URI');
        console.log("*** USING MONGO URI:", uri);

        return {
          uri: uri,
        };
      },
    }),

    UserModule,
    WaterModule,
    AuthModule,
    AchievementModule,
    DrinkModule,
  ],
})
export class AppModule {}
