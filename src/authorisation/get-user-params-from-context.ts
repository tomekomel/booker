import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { parseBearerToken } from './parse-bearer-token';
import * as Jose from 'jose';
import { UserParamsInterface } from './user-params.interface';

export function getUserParamsFromContext(
  ctx: ExecutionContext,
): UserParamsInterface {
  const request = ctx.switchToHttp().getRequest();
  const token = parseBearerToken(request.headers);

  if (!token)
    throw new UnauthorizedException('No token was found in your request');

  const decodedToken: Jose.JWTPayload = Jose.decodeJwt(token);

  if (!decodedToken.userId || decodedToken.role === '') {
    throw new UnauthorizedException(
      'Missing properties in your authorisation token',
    );
  }

  return {
    userId: Number(decodedToken.userId),
    role: decodedToken.role.toString(),
  };
}
