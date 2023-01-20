import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { data, ReportType } from './data';
import { v4 as uuid } from 'uuid';

@Controller('report/:type')
export class AppController {
  @Get()
  getAllReports(@Param('type') type: string) {
    return data.report.filter((report) => report.type === type);
  }

  @Get(':id')
  getReportById(@Param('type') type: string, @Param('id') id: string) {
    return data.report.find(
      (report) => report.type === type && report.id === id,
    );
  }

  @Post()
  createReport(
    @Body() { amount, source }: { amount: number; source: string },
    @Param('type') type: string,
  ) {
    const newReport = {
      id: uuid(),
      amount,
      source,
      created_at: new Date(),
      updated_at: new Date(),
      type: type === 'income' ? ReportType.INCOME : ReportType.EXPENSE,
    };

    data.report.push(newReport);

    return newReport;
  }

  @Put(':id')
  updateReport(
    @Body() { amount, source }: { amount: number; source: string },
    @Param('type') type: string,
    @Param('id') id: string,
  ) {
    const report = data.report.find(
      (report) => report.type === type && report.id === id,
    );

    if (report) {
      report.amount = amount;
      report.source = source;
      report.updated_at = new Date();
    }

    return report;
  }

  @Delete(':id')
  deleteReport(@Param('type') type: string, @Param('id') id: string) {
    const report = data.report.find(
      (report) => report.type === type && report.id === id,
    );

    if (report) {
      data.report = data.report.filter((report) => report.id !== id);
    }

    return;
  }
}
