import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
  imports: [PrismaModule],
  controllers: [HomeController],
  providers: [
    HomeService,
    {
      provide: APP_INTERCEPTOR, // Register the interceptor. A interceptor is something that lies in between the request or response
      useClass: ClassSerializerInterceptor, // Use the ClassSerializerInterceptor. Its possible to create your own interceptor
    },
  ],
})
export class HomeModule {}
