import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: false, unique: true, sparse: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, enum: ['male', 'female'], default: 'female' })
  gender: string;

  @Prop({ required: false })
  weight: number;

  @Prop({ required: false })
  height: number;

  @Prop({ required: false })
  activity: number;

  @Prop({ required: true, default: 2000 })
  waterNorm: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Water' }] })
  waters: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
