import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/pagination/pagination.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, PaginationService],
})
export class ProductModule {}
