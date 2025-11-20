import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthDto } from './auth.dto';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    register(dto: AuthDto): Promise<{
        message: string;
        userId: any;
    }>;
    login(dto: AuthDto): Promise<{
        access_token: string;
    } | {
        message: string;
    }>;
}
