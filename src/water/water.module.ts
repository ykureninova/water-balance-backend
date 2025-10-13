import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WaterController } from './water.controller';
import { WaterService } from './water.service';
import { Water, WaterSchema } from './water.schema';
import { User, UserSchema } from '../user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Water.name, schema: WaterSchema },
      { name: User.name, schema: UserSchema }, // ✅ добавляем UserModel
    ]),
  ],
  controllers: [WaterController],
  providers: [WaterService],
})
export class WaterModule {}
