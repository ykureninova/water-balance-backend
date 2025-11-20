import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  weight: number;

  @Prop({ required: true })
  height: number;

  @Prop({ default: Date.now })
  lastActivity: Date;

  @Prop({ default: 0 })
  currentStreak: number;

  @Prop({ type: Date })
  lastGoalDate?: Date;

  @Prop({ default: 0 })
  currentNoCaffeineStreak: number;

  @Prop({ type: Date })
  lastNoCaffeineDate?: Date;

  @Prop({ default: 0 })
  totalWaterConsumed: number;

  // Метод для сравнения паролей
  comparePassword?: (candidatePassword: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};
