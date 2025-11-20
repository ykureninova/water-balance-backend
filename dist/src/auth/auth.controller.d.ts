import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    register(body: {
        username: string;
        password: string;
        weight: number;
        height: number;
    }): Promise<{
        message: string;
        userId: any;
    }>;
    login(body: {
        username: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            weight: any;
            height: any;
        };
    }>;
}
