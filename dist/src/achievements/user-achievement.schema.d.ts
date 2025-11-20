import { Document, Types } from 'mongoose';
export type UserAchievementDocument = UserAchievement & Document;
export declare class UserAchievement {
    userId: Types.ObjectId;
    achievementId: Types.ObjectId;
    achievedAt: Date;
    notified: boolean;
}
export declare const UserAchievementSchema: import("mongoose").Schema<UserAchievement, import("mongoose").Model<UserAchievement, any, any, any, Document<unknown, any, UserAchievement, any, {}> & UserAchievement & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserAchievement, Document<unknown, {}, import("mongoose").FlatRecord<UserAchievement>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<UserAchievement> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
