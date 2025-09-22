import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './home/home.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './user/interceptors/user.interceptor';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [UserModule, PrismaModule, HomeModule],
  controllers: [AppController],
  providers: [
    AppService,
    // This interceptor was created to grab the JWT, decode it and pass to the @User decorator
    // It was used here because we want to use in every single endpoint out there
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    {
      provide: APP_GUARD,
      // We are going to use AuthGuard in every single request, because even if an endpoint doesn't have a Role decorator, the AuthGuard do a by pass on these cases
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
