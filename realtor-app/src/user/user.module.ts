// Command: nest g module user
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [PrismaModule], // Its a good pratic import a module and in this module define what you want to export
  controllers: [AuthController],
  providers: [AuthService],
})
export class UserModule {}
