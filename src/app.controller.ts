import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('status')
  getHello(): string {
    return 'pong';
  }
}
