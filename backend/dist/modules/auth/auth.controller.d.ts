import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto, response: Response): Promise<{
        success: boolean;
        data: {
            user: any;
        };
    }>;
    login(dto: LoginDto, req: Request, response: Response): Promise<{
        success: boolean;
        data: {
            user: any;
        };
    }>;
    private getClientIp;
    refresh(req: Request, response: Response): Promise<{
        success: boolean;
        message: string;
    }>;
    getCurrentUser(req: Request): Promise<{
        success: boolean;
        data: Express.User | undefined;
    }>;
    logout(req: Request, response: Response): Promise<{
        success: boolean;
        message: string;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto, req: Request, response: Response): Promise<{
        success: boolean;
        message: string;
    }>;
    private setAuthCookies;
    private clearAuthCookies;
}
