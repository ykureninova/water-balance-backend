import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DrinkType } from '../drink/drink.schema';
import { User } from '../user/user.schema';

export type WaterDocument = Water &
  Document & {
    createdAt: Date;
    updatedAt: Date;
  };

@Schema({ timestamps: true })
export class Water {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: 'DrinkType', required: true })
  drinkType: Types.ObjectId;

  @Prop({ default: false })
  caffeinated: boolean;
}

export const WaterSchema = SchemaFactory.createForClass(Water);
