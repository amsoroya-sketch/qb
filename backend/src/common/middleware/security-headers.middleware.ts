import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Content Security Policy (CSP)
    // Protects against XSS by controlling what resources can be loaded
    const cspDirectives = [
      "default-src 'self'", // Only allow resources from same origin by default
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com", // Scripts - allow self and CDNs for dev (tighten in prod)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Styles - allow self and Google Fonts
      "img-src 'self' data: https: blob:", // Images - allow self, data URIs, HTTPS images
      "font-src 'self' data: https://fonts.gstatic.com", // Fonts - allow self and Google Fonts
      "connect-src 'self' https://api.sentry.io", // AJAX/WebSocket - allow self and Sentry
      "media-src 'self'", // Audio/Video - only from same origin
      "object-src 'none'", // Disable plugins (Flash, etc.)
      "frame-ancestors 'none'", // Prevent embedding in iframes (clickjacking protection)
      "base-uri 'self'", // Restrict <base> tag to same origin
      "form-action 'self'", // Forms can only submit to same origin
      'upgrade-insecure-requests', // Upgrade HTTP to HTTPS
      'block-all-mixed-content', // Block mixed HTTP/HTTPS content
    ];

    res.setHeader('Content-Security-Policy', cspDirectives.join('; '));

    // Strict-Transport-Security (HSTS)
    // Forces HTTPS for 1 year, includes subdomains
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    // X-Frame-Options
    // Prevents clickjacking by disallowing embedding in iframes
    res.setHeader('X-Frame-Options', 'DENY');

    // X-Content-Type-Options
    // Prevents MIME-type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // X-XSS-Protection
    // Legacy XSS protection for older browsers
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Referrer-Policy
    // Controls how much referrer information is sent
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions-Policy (formerly Feature-Policy)
    // Disable unnecessary browser features
    const permissionsPolicyDirectives = [
      'geolocation=()', // Disable geolocation
      'microphone=()', // Disable microphone
      'camera=()', // Disable camera
      'payment=()', // Disable payment
      'usb=()', // Disable USB
      'magnetometer=()', // Disable magnetometer
      'accelerometer=()', // Disable accelerometer
      'gyroscope=()', // Disable gyroscope
      'interest-cohort=()', // Disable FLoC tracking
    ];

    res.setHeader('Permissions-Policy', permissionsPolicyDirectives.join(', '));

    // X-Powered-By
    // Remove to avoid revealing server technology
    res.removeHeader('X-Powered-By');

    // X-DNS-Prefetch-Control
    // Disable DNS prefetching for privacy
    res.setHeader('X-DNS-Prefetch-Control', 'off');

    // X-Download-Options
    // Prevent IE from executing downloads in site context
    res.setHeader('X-Download-Options', 'noopen');

    // Cross-Origin-Embedder-Policy (COEP)
    // Prevents loading cross-origin resources without explicit permission
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

    // Cross-Origin-Opener-Policy (COOP)
    // Isolates browsing context from cross-origin windows
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

    // Cross-Origin-Resource-Policy (CORP)
    // Controls which origins can include this resource
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

    next();
  }
}
