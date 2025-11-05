import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Patch,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.register(dto);

    // Set tokens as HttpOnly cookies
    this.setAuthCookies(response, result.accessToken, result.refreshToken);

    return {
      success: true,
      data: {
        user: result.user,
      },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Extract real IP address (considering proxies/load balancers)
    const ipAddress = this.getClientIp(req);
    const result = await this.authService.login(dto, ipAddress);

    // Set tokens as HttpOnly cookies
    this.setAuthCookies(response, result.accessToken, result.refreshToken);

    return {
      success: true,
      data: {
        user: result.user,
      },
    };
  }

  /**
   * Extract client IP address, handling proxies and load balancers
   */
  private getClientIp(req: Request): string {
    // Check for proxy headers in order of preference
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      // x-forwarded-for can be a comma-separated list, take the first one
      const ips = (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',');
      return ips[0].trim();
    }

    const realIp = req.headers['x-real-ip'];
    if (realIp) {
      return typeof realIp === 'string' ? realIp : realIp[0];
    }

    // Fallback to direct connection IP
    return req.ip || req.socket.remoteAddress || 'unknown';
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token rotation' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    // Read refresh token from HttpOnly cookie
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const tokens = await this.authService.refreshTokens(refreshToken);

    // Set new tokens as HttpOnly cookies
    this.setAuthCookies(response, tokens.accessToken, tokens.refreshToken);

    return {
      success: true,
      message: 'Tokens refreshed successfully',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'User retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@Req() req: Request) {
    return {
      success: true,
      data: req.user,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user (blacklist current token and clear cookies)' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    // Blacklist the access token from cookie
    const accessToken = req.cookies?.accessToken;
    if (accessToken) {
      await this.authService.logout(accessToken);
    }

    // Clear auth cookies
    this.clearAuthCookies(response);

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid current password' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(
    @CurrentUser('sub') userId: string,
    @Body() dto: ChangePasswordDto,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const ipAddress = this.getClientIp(req);
    await this.authService.changePassword(userId, dto, ipAddress);

    // Clear cookies to force re-login
    this.clearAuthCookies(response);

    return {
      success: true,
      message: 'Password changed successfully. Please login again.',
    };
  }

  /**
   * Set authentication cookies (HttpOnly, Secure, SameSite)
   */
  private setAuthCookies(response: Response, accessToken: string, refreshToken: string): void {
    const isProduction = process.env.NODE_ENV === 'production';

    // Access Token Cookie (15 minutes)
    response.cookie('accessToken', accessToken, {
      httpOnly: true, // Cannot be accessed by JavaScript (XSS protection)
      secure: isProduction, // Only sent over HTTPS in production
      sameSite: 'strict', // CSRF protection
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/', // Available for all routes
    });

    // Refresh Token Cookie (7 days)
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/v1/auth', // Only sent to auth endpoints (more secure)
    });
  }

  /**
   * Clear authentication cookies (for logout)
   */
  private clearAuthCookies(response: Response): void {
    response.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth',
    });
  }
}
