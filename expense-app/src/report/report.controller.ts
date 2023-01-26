import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ReportType } from 'src/data';
import { ReportService } from './report.service';
import {
  CreateReportDto,
  ReportResponseDto,
  UpdateReportDto,
} from 'src/dtos/report.dto';

@Controller('report/:type')
export class ReportController {
  constructor(
    private readonly reportService: ReportService, // inject the ReportService into the controller
  ) {}

  @Get()
  getAllReports(
    @Param('type', new ParseEnumPipe(ReportType)) type: string,
  ): ReportResponseDto[] {
    // ParseEnumPipe ensures that the type is a valid ReportType
    const reportType =
      type === 'income' ? ReportType.INCOME : ReportType.EXPENSE;
    return this.reportService.getAllReports(reportType);
  }

  @Get(':id')
  getReportById(
    @Param('type', new ParseEnumPipe(ReportType)) type: string,
    @Param('id', ParseUUIDPipe) id: string, // ParseUUIDPipe ensures that the id is a valid UUID
  ): ReportResponseDto {
    const reportType =
      type === 'income' ? ReportType.INCOME : ReportType.EXPENSE;
    return this.reportService.getReportById(reportType, id);
  }

  @Post()
  createReport(
    @Param('type', new ParseEnumPipe(ReportType)) type: string,
    @Body() body: CreateReportDto,
  ): ReportResponseDto {
    const reportType =
      type === 'income' ? ReportType.INCOME : ReportType.EXPENSE;
    return this.reportService.createReport(reportType, body);
  }

  @Put(':id')
  updateReport(
    @Param('type', new ParseEnumPipe(ReportType)) type: string,
    @Param('id') id: string, // ParseUUIDPipe ensures that the id is a valid UUID
    @Body() { amount, source }: UpdateReportDto,
  ): ReportResponseDto {
    const reportType =
      type === 'income' ? ReportType.INCOME : ReportType.EXPENSE;
    return this.reportService.updateReport(reportType, id, { amount, source });
  }

  @Delete(':id')
  deleteReport(
    @Param('type', new ParseEnumPipe(ReportType)) type: string,
    @Param('id', ParseUUIDPipe) id: string, // ParseUUIDPipe ensures that the id is a valid UUID
  ) {
    const reportType =
      type === 'income' ? ReportType.INCOME : ReportType.EXPENSE;
    return this.reportService.deleteReport(reportType, id);
  }
}
