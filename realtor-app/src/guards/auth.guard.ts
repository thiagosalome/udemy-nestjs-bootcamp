import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  // This method return true or false depending if you want authorize the user to use the endpoint
  canActivate(context: ExecutionContext) {
    // 1 - Determine the UserTypes that can execute the called endpoint
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(), // Inform from where we are getting our metadata
      context.getClass(), // Inform from where we are getting our metadata
    ]); // Getting the roles defined in role.decorator.ts

    console.log('roles', roles);
    // 2 - Grab the JWT from the request header and verify it
    // 3 - Database request to get user by id
    // 4 - Determine if the user has permissions
    return true;
  }
}
