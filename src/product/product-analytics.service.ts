import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductAnalyticsService {
  constructor(private prisma: PrismaService) {}

  // Получить статистику просмотров за период
  async getViewsStatistics(days: number = 30) {
    const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const stats = await this.prisma.productViews.groupBy({
      by: ['productId'],
      where: {
        viewedAt: {
          gte: dateFrom
        }
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 20
    });

    // Получаем информацию о товарах
    const productIds = stats.map(stat => stat.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: true
      }
    });

    return stats.map(stat => {
      const product = products.find(p => p.id === stat.productId);
      return {
        product,
        viewsCount: stat._count.id
      };
    });
  }

  // Получить тренды просмотров по дням
  async getViewsTrends(days: number = 7) {
    const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const trends = await this.prisma.$queryRaw`
      SELECT 
        DATE(viewed_at) as date,
        COUNT(*) as views_count
      FROM "ProductViews"
      WHERE viewed_at >= ${dateFrom}
      GROUP BY DATE(viewed_at)
      ORDER BY date ASC
    `;

    return trends;
  }

  // Получить самые просматриваемые категории
  async getMostViewedCategories(days: number = 30) {
    const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const categoryStats = await this.prisma.productViews.groupBy({
      by: ['productId'],
      where: {
        viewedAt: {
          gte: dateFrom
        }
      },
      _count: {
        id: true
      }
    });

    // Получаем категории через продукты
    const productIds = categoryStats.map(stat => stat.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      },
      include: {
        category: true
      }
    });

    // Группируем по категориям
    const categoriesMap = new Map();
    
    categoryStats.forEach(stat => {
      const product = products.find(p => p.id === stat.productId);
      if (product?.category) {
        const categoryId = product.category.id;
        const current = categoriesMap.get(categoryId) || {
          category: product.category,
          viewsCount: 0
        };
        current.viewsCount += stat._count.id;
        categoriesMap.set(categoryId, current);
      }
    });

    return Array.from(categoriesMap.values())
      .sort((a, b) => b.viewsCount - a.viewsCount)
      .slice(0, 10);
  }
}
