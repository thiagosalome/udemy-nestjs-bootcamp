import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { CustomInterceptor } from './custom.interceptor';
import { SummaryModule } from './summary/summary.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [SummaryModule, ReportModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR, // Register the interceptor. A interceptor is something that lies in between the request or response
      useClass: ClassSerializerInterceptor, // Use the ClassSerializerInterceptor. Its possible to create your own interceptor
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CustomInterceptor,
    // },
  ],
})
export class AppModule {}
