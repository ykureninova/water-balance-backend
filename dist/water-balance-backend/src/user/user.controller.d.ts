import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    createUser(body: {
        username: string;
        password: string;
        weight?: number;
        height?: number;
        waterNorm?: number;
    }): Promise<import("./user.schema").UserDocument>;
    getUser(id: string): Promise<import("./user.schema").UserDocument>;
    getAllUsers(): Promise<import("./user.schema").UserDocument[]>;
}
