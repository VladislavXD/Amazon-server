export class ProductViewDto {
  productId: number
  userId?: number
  viewsCount?: number
}

export class PopularProductsDto {
  limit?: number = 10
  timeRange?: 'day' | 'week' | 'month' | 'all' = 'all'
}

export class RecentlyViewedDto {
  userId: number
  limit?: number = 10
}
