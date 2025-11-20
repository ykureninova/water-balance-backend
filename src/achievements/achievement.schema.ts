import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AchievementDocument = Achievement & Document;

@Schema()
export class Achievement {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  condition: string;

  @Prop({ default: '' })
  icon: string;

  @Prop({ default: 0 })
  points: number;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);
