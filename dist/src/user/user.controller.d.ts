import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    createUser(body: {
        username: string;
        password: string;
        weight: number;
        height: number;
    }): Promise<import("./user.service").UserWithoutPassword>;
    getProfile(req: any): Promise<import("./user.service").UserWithoutPassword>;
}
