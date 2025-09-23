import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

interface JWTPayload {
  name: string;
  id: number;
  iat: number;
  exp: number;
}
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  // This method return true or false depending if you want authorize the user to use the endpoint
  async canActivate(context: ExecutionContext) {
    // 1 - Determine the UserTypes that can execute the called endpoint
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(), // Inform from where we are getting our metadata
      context.getClass(), // Inform from where we are getting our metadata
    ]); // Getting the roles defined in role.decorator.ts

    // We only will verify the JWT if there are roles in the array
    if (roles?.length) {
      // 2 - Grab the JWT from the request header and verify it
      const request = context.switchToHttp().getRequest();
      const token = request?.headers?.authorization?.split('Bearer ')[1];

      try {
        const payload = (await jwt.verify(
          token,
          process.env.JSON_TOKEN_KEY,
        )) as JWTPayload;

        // 3 - Database request to get user by id
        const user = await this.prismaService.user.findUnique({
          where: {
            id: payload.id,
          },
        });

        if (!user) return false;

        // 4 - Determine if the user has permissions
        // Get the array of available user types (ex: ADMIN) and check if the user type of the user is available
        if (roles.includes(user.user_type)) return true;
        return false;
      } catch (error) {
        console.log('error', error);
        return false;
      }
    }

    return true;
  }
}
