import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    createUser(data: {
        username: string;
        password: string;
        weight: number;
        height: number;
    }): Promise<UserDocument>;
    findByUsername(username: string): Promise<UserDocument | null>;
    getUser(id: string): Promise<UserDocument>;
    getAllUsers(): Promise<UserDocument[]>;
    updateLastActivity(userId: string): Promise<UserDocument>;
    updateUser(userId: string, updateData: Partial<UserDocument>): Promise<UserDocument>;
}
