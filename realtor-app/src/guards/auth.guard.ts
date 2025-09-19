import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  // This method return true or false depending if you want authorize the user to use the endpoint
  async canActivate(context: ExecutionContext) {
    // 1 - Determine the UserTypes that can execute the called endpoint
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(), // Inform from where we are getting our metadata
      context.getClass(), // Inform from where we are getting our metadata
    ]); // Getting the roles defined in role.decorator.ts

    // We only will verify the JWT if there are roles in the array
    if (roles.length) {
      // 2 - Grab the JWT from the request header and verify it
      const request = context.switchToHttp().getRequest();
      const token = request?.headers?.authorization?.split('Bearer ')[1];

      console.log('token', token);
      try {
        const user = await jwt.verify(token, process.env.JSON_TOKEN_KEY);
        console.log('user', user);
        return true;
      } catch (error) {
        console.log('error', error);
        return false;
      }
    }

    // 3 - Database request to get user by id
    // 4 - Determine if the user has permissions
    return true;
  }
}
