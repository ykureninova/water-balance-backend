import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';

export type WaterDocument = Water & Document;

@Schema({ timestamps: true })
export class Water {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: false })
  isCaffeinated: boolean;
}

export const WaterSchema = SchemaFactory.createForClass(Water);
