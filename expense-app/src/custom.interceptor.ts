// An interceptor is an entity inside of NestJS. Its similar to middlewares

import { ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common';
import { map } from 'rxjs';

// This interceptor is used to transform the data that is returned from the API
export class CustomInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const response = {
          ...data,
          createdAt: data.created_at,
        };

        delete response.updated_at;
        delete response.created_at;

        return response;
      }),
    );
  }
}
