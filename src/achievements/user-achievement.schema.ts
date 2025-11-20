import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserAchievementDocument = UserAchievement & Document;

@Schema({ timestamps: true })
export class UserAchievement {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Achievement', required: true })
  achievementId: Types.ObjectId;

  @Prop({ required: true })
  achievedAt: Date;

  @Prop({ default: false })
  notified: boolean;
}

export const UserAchievementSchema = SchemaFactory.createForClass(UserAchievement);
