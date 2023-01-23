import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { data, ReportType } from './data';

interface Report {
  amount: number;
  source: string;
}

@Injectable()
export class AppService {
  // It`s a common practice to have this method be called exactly the same as the controller method
  getAllReports(type: ReportType) {
    return data.report.filter((report) => report.type === type);
  }

  getReportById(type: ReportType, id: string) {
    return data.report.find(
      (report) => report.type === type && report.id === id,
    );
  }

  createReport(type: ReportType, { amount, source }: Report) {
    const newReport = {
      id: uuid(),
      amount: amount,
      source: source,
      created_at: new Date(),
      updated_at: new Date(),
      type,
    };

    data.report.push(newReport);

    return newReport;
  }

  updateReport(type: ReportType, id: string, { amount, source }: Report) {
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

  deleteReport(type: ReportType, id: string) {
    const report = data.report.find(
      (report) => report.type === type && report.id === id,
    );

    if (report) {
      data.report = data.report.filter((report) => report.id !== id);
    }

    return;
  }
}
