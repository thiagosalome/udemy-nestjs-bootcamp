// Command: nest g service prisma
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// PrismaClient is a class that we can utilize in order to interact with the database. The idea when we use the extends is inherit the class properties
// Implements means that we want to follow the same structure that the classes

// To create this service is just run 'nest g service prisma'
@Injectable() // extends: Take all classes, methods and properts inside this class and put them in PrismaService // implements: We want to follow the same structure as the class the PrismaService implements
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // This classes implements this methods because it implements OnModuleInit
  onModuleInit() {
    this.$connect();
  }

  // This classes implements this methods because it implements OnModuleDestroy
  onModuleDestroy() {
    this.$disconnect();
  }
}
