import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class AuthService {
    private userService;
    private jwtService;
    private eventEmitter;
    constructor(userService: UserService, jwtService: JwtService, eventEmitter: EventEmitter2);
    validateUser(username: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            weight: any;
            height: any;
        };
    }>;
}
