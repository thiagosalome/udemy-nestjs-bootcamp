import { SetMetadata } from '@nestjs/common';
import { UserType } from '@prisma/client';

export const Roles = (...roles: UserType[]) => {
  // With this SetMetadata I can access the information anywhere in the application
  // This metadata will be accessed by auth.guard.ts
  return SetMetadata('roles', roles);
};
