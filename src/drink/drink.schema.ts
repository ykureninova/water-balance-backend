import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DrinkTypeDocument = DrinkType & Document;

@Schema()
export class DrinkType {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: false })
  caffeinated: boolean;
}

export const DrinkTypeSchema = SchemaFactory.createForClass(DrinkType);
