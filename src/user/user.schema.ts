import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  weight: number;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  waterNorm: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Water' }] })
  waters: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
