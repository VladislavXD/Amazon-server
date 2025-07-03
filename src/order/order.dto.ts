import { EnumOrderStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsEnum, IsNumber, IsOptional, ValidateNested } from "class-validator";

export class OrderDto{
  @IsOptional()
  @IsEnum(EnumOrderStatus)
  status: EnumOrderStatus

  @IsArray()
  @ArrayMinSize(1, { message: 'Заказ должен содержать хотя бы один товар' })
  @ValidateNested({each: true})
  @Type(()=> OrderItemDto)
  items: OrderItemDto[]
}


export class OrderItemDto {
  @IsNumber()
  quantity: number 

  @IsNumber()
  price: number

  @IsNumber()
  productId: number
}
