import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getUserParamsFromContext } from '../get-user-params-from-context';

export const AuthorisedUserParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return getUserParamsFromContext(ctx);
  },
);
