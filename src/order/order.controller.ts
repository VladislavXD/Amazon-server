import { Body, Controller, Get, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { OrderDto } from './order.dto';
import { PaymentStatusDto } from './payment-status.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Auth()
  getAll(@CurrentUser('id') userId: number){
    return this.orderService.getAll(userId)
  }


  
  
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  placeOrder(@Body() dto: OrderDto, @CurrentUser('id') userId: number) {
    return this.orderService.placeOrder(dto, userId);
  }


  @Post('status')
  @HttpCode(200)  
  async updateStatus(@Body() dto:PaymentStatusDto) {
    return this.orderService.updateStatus(dto);
  }
}
