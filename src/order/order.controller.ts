import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Auth()
  getAll(@CurrentUser('id') userId: number){
    return this.orderService.getAll(userId)
  }
}
