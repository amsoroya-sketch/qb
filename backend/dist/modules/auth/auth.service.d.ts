import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { AccountLockoutService } from './services/account-lockout.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { AuditLogService } from '../../common/middleware/audit-log.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private config;
    private tokenBlacklist;
    private accountLockout;
    private refreshTokenService;
    private auditLog;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService, tokenBlacklist: TokenBlacklistService, accountLockout: AccountLockoutService, refreshTokenService: RefreshTokenService, auditLog: AuditLogService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        familyId: string;
        user: any;
    }>;
    login(dto: LoginDto, ipAddress?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        familyId: string;
        user: any;
    }>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        familyId: string;
    }>;
    private generateTokens;
    private sanitizeUser;
    logout(token: string): Promise<void>;
    changePassword(userId: string, dto: ChangePasswordDto, ipAddress?: string): Promise<void>;
}
