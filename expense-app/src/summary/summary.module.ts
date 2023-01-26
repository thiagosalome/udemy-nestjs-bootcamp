import { Module } from '@nestjs/common';
import { ReportModule } from 'src/report/report.module';
// import { ReportService } from 'src/report/report.service';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';

@Module({
  imports: [ReportModule], // A better practice is to import the ReportModule
  controllers: [SummaryController],
  providers: [
    SummaryService,
    // ReportService, // Put the ReportService allows us to use it in taht module, but its not a good practice
  ],
})
export class SummaryModule {}
