import { Document } from 'mongoose';
export type AchievementDocument = Achievement & Document;
export declare class Achievement {
    id: string;
    name: string;
    description: string;
    category: string;
    condition: string;
    icon: string;
    points: number;
}
export declare const AchievementSchema: import("mongoose").Schema<Achievement, import("mongoose").Model<Achievement, any, any, any, Document<unknown, any, Achievement, any, {}> & Achievement & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Achievement, Document<unknown, {}, import("mongoose").FlatRecord<Achievement>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Achievement> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
