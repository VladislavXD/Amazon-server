  import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { CategoryModule } from './category/category.module';
import { StatisticModule } from './statistic/statistic.module';
import { PaginationModule } from './pagination/pagination.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, ProductModule, ReviewModule, CategoryModule, StatisticModule, PaginationModule, OrderModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
