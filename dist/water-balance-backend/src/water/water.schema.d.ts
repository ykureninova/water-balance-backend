import { Document, Types } from 'mongoose';
export type WaterDocument = Water & Document;
export declare class Water {
    user: Types.ObjectId;
    amount: number;
}
export declare const WaterSchema: import("mongoose").Schema<Water, import("mongoose").Model<Water, any, any, any, Document<unknown, any, Water, any, {}> & Water & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Water, Document<unknown, {}, import("mongoose").FlatRecord<Water>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Water> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
