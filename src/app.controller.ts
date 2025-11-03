import { Controller, Get, Version } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Version('1')
  @Get('status')
  getHello(): string {
    return 'pong';
  }
}
