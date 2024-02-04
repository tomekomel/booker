import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { parseBearerToken } from './parse-bearer-token';
import { ConfigService } from '@nestjs/config';
import * as Jose from 'jose';

@Injectable()
export class AuthorisationMiddleware implements NestMiddleware {
  public readonly logger = new Logger(AuthorisationMiddleware.name);
  private keyFetcher: Jose.JWTVerifyGetKey;

  constructor(private configService: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (
      this.configService.get('NODE_ENV') === 'development' &&
      this.configService.get('DO_NOT_AUTHORISE') === 'true'
    ) {
      this.logger.log('Local Environment: Skipping authorisation');

      req.body.brokerId = 'Local';
    } else {
      const token = parseBearerToken(req.headers);
      if (!token) {
        this.logger.debug(
          `No token was found in request, headers: ${JSON.stringify(req.headers)}`,
        );
        throw new UnauthorizedException('No token was found in your request');
      }

      try {
        const decodedToken = Jose.decodeJwt(token);
        if (decodedToken.userId) {
          req.body.userId = decodedToken.userId;
        }
      } catch (error: unknown) {
        throw new UnauthorizedException(`Token verification failed`);
      }
    }

    next();
  }
}
