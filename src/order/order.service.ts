import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrderDto } from './order.dto';
import { productReturnObject } from 'src/product/product-object';

import * as YooKassa from 'yookassa'
import { PaymentStatusDto } from './payment-status.dto';
import { EnumOrderStatus } from '@prisma/client';



const yooKassa = new YooKassa({
  shopId: "1118760",
  secretKey: 'test_hqDP4EabQy4hHEpGUVA_92yZSF-zFIkVMHILEi3Stvg'
})


@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService){}

  async getAll(userId: number){
    return this.prisma.order.findMany({
      where:{
        userId
      },
      orderBy: {
        createdAt: 'desc'
      },

      include: {
        items: {
          include: {
            product: {
              select: productReturnObject
            }
          }
        },
      }
    })
  }


  async placeOrder(dto: OrderDto, userId: number){
    const total = dto.items.reduce((acc, item)=> {
        return acc + item.price * item.quantity
    }, 0)


    const order =  await this.prisma.order.create({
      data: {
        status: dto.status,
        items: {
          create: dto.items
        },
        total,
        user:{
          connect: {
            id: userId
          }
        }
      }
    }); 




    const payment = await yooKassa.createPayment({
      amount: {
        value: total.toFixed(2),
        currency: "RUB"
      },
      payment_method_data: {
          type: "bank_card"
      },
      confirmation: {
        type: "redirect",
        return_url: "https://the-amazon.vercel.app/thanks"
      },
      description: `Order #${order.id}`
    });


    return payment

  }

  


  async updateStatus(dto: PaymentStatusDto){
    if (dto.event === 'payment.waiting_for_capture'){
      const payment = await yooKassa.capturePayment(dto.object.id)
      return payment
    }

    if (dto.event === 'payment.succeeded'){
      const orderId = Number(dto.object.description.split
        ('#')[1])
      console.log('orderId', orderId);
      await this.prisma.order.update({
        where: {
          id: orderId
        },
        data: {
          status: EnumOrderStatus.PAYED
        }
      })
      
      
      return true
    }
    return true
  }

}
