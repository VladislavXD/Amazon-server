import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('cors-test')
  corsTest(@Req() req: Request) {
    return {
      message: 'CORS test successful',
      origin: req.headers.origin,
      userAgent: req.headers['user-agent'],
      method: req.method,
      timestamp: new Date().toISOString()
    };
  }
}
