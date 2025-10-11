import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaterController } from './water.controller';
import { WaterService } from './water.service';
import { Water } from './water.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Water]),
    UserModule,                        
  ],
  controllers: [WaterController],
  providers: [WaterService],
})
export class WaterModule {}
