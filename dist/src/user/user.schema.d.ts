import { Document, Types } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    _id: Types.ObjectId;
    username: string;
    password: string;
    weight: number;
    height: number;
    lastActivity: Date;
    currentStreak: number;
    lastGoalDate?: Date;
    currentNoCaffeineStreak: number;
    lastNoCaffeineDate?: Date;
    totalWaterConsumed: number;
    comparePassword?: (candidatePassword: string) => Promise<boolean>;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
