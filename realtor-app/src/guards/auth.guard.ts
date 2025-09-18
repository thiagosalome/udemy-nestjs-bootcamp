import { CanActivate } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  // This method return true or false depending if you want authorize the user to use the endpoint
  canActivate() {
    return true;
  }
}
