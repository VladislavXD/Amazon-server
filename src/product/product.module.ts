import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '../prisma.service';
import { PaginationService } from '../pagination/pagination.service';
import { ProductAnalyticsService } from './product-analytics.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, PaginationService, ProductAnalyticsService],
})
export class ProductModule {}
