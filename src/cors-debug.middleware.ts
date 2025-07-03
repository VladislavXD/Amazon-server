import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsDebugMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('=== CORS DEBUG ===');
    console.log('Method:', req.method);
    console.log('Origin:', req.headers.origin);
    console.log('User-Agent:', req.headers['user-agent']);
    console.log('Referer:', req.headers.referer);
    console.log('Host:', req.headers.host);
    console.log('==================');
    
    next();
  }
}
