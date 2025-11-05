import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { TokenBlacklistService } from '../services/token-blacklist.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private tokenBlacklist: TokenBlacklistService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // First try to extract from cookie
        (request: Request) => {
          return request?.cookies?.accessToken;
        },
        // Fallback to Authorization header (for backward compatibility)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.get('JWT_ACCESS_SECRET'),
      passReqToCallback: true, // Pass request to validate method
    });
  }

  async validate(req: Request, payload: { sub: string; email: string; role: string }) {
    // Extract token from cookie or Authorization header
    const token = req?.cookies?.accessToken || ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Check if token is blacklisted
    const isBlacklisted = await this.tokenBlacklist.isBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been revoked');
    }

    // Check if all user tokens are blacklisted (e.g., after password change)
    const areAllBlacklisted = await this.tokenBlacklist.areAllUserTokensBlacklisted(payload.sub);
    if (areAllBlacklisted) {
      throw new UnauthorizedException('All tokens for this user have been revoked');
    }

    // Verify user still exists
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        progress: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password: _password, ...sanitizedUser } = user;
    // Add 'sub' property for compatibility with @CurrentUser('sub') decorator
    return { ...sanitizedUser, sub: payload.sub };
  }
}
