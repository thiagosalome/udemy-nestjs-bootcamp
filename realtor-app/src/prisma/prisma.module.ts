// Command: nest g module prisma
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// To create this module is just run 'nest g module prisma'
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
