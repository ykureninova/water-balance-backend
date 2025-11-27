import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AchievementDocument = Achievement & Document;

@Schema({ timestamps: true })
export class Achievement {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  achievedAt: Date;
}

const AchievementSchemaBase = SchemaFactory.createForClass(Achievement);

AchievementSchemaBase.index({ user: 1, code: 1 }, { unique: true });

export const AchievementSchema = AchievementSchemaBase;
