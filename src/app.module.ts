import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from './user/user.module';
import { WaterModule } from './water/water.module';
import { AuthModule } from './auth/auth.module';
import { AchievementsModule } from './achievements/achievements.module';
import { AppController } from './app.controller';  
import { AppService } from './app.service';        

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        if (!uri) throw new Error('MONGO_URI is not set in .env');
        return { uri };
      },
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    WaterModule,
    AuthModule,
    AchievementsModule,
  ],
  controllers: [AppController],  
  providers: [AppService],       
})
export class AppModule {}
