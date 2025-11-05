import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { TokenBlacklistService } from '../services/token-blacklist.service';
import { Request } from 'express';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private config;
    private prisma;
    private tokenBlacklist;
    constructor(config: ConfigService, prisma: PrismaService, tokenBlacklist: TokenBlacklistService);
    validate(req: Request, payload: {
        sub: string;
        email: string;
        role: string;
    }): Promise<{
        sub: string;
        progress: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currentXP: number;
            currentLevel: number;
            currentStreak: number;
            longestStreak: number;
            lastActiveDate: Date | null;
            lessonsCompleted: number;
            exercisesCompleted: number;
            totalTimeSpent: number;
            averageAccuracy: import("@prisma/client/runtime/library").Decimal;
            userId: string;
        } | null;
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
