import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const test = {
      name: 'Ok',
      asd: 'asdaksdj qwkjdq wd',
      gfdfasddfgdfg: 'aferger',
      gfdfasddfgdfgvdfgdfg: 'aferger',
      gf: 'aferger',
    };
    return this.appService.getHello();
  }
}
