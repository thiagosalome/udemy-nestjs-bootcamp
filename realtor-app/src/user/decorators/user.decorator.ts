import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserInfo {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

/*
  This decorator get the user information from request, that is available thanks to the user.interceptor.ts,
  and it pass to the requests who use @User decorator
*/
export const User = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
