// Command: nest g service prisma
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Prisma is going to be a class tha we can utilize in order to interact with the database
@Injectable() // extends: Take all classes, methods and properts inside this class and put them in PrismaService // implements: We want to follow the same structure as the class the PrismaService implements
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  onModuleInit() {
    this.$connect();
  }

  onModuleDestroy() {
    this.$disconnect();
  }
}
