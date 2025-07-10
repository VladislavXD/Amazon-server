import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetAllProductDto } from './dto/getAllProduct.dto';
import { Auth, OptionalJwtAuthGuard } from '../auth/decorators/auth.decorator';
import { ProductDto } from './dto/product.dto';
import { ProductViewDto, PopularProductsDto, RecentlyViewedDto } from './dto/product-view.dto';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { ProductAnalyticsService } from './product-analytics.service';

@Controller('products')
export class ProductController {
	constructor(
		private readonly productService: ProductService,
		private readonly analyticsService: ProductAnalyticsService
	) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: GetAllProductDto) {
		return this.productService.getAll(queryDto)
	}

	@Get('similar/:id')
	async getSimilar(@Param('id') id: string) {
		return this.productService.getSimelar(+id)
	}

	@Get('by-slug/:slug')
	async getProductBySlug(@Param('slug') slug: string) {
		return this.productService.bySlug(slug)
	}

	@Get('by-category/:categorySlug')
	async getProductsByCategory(@Param('categorySlug') categorySlug: string) {
		return this.productService.byCategory(categorySlug)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	async createProduct() {
		return this.productService.create()
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
		return this.productService.update(+id, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async deleteProduct(@Param('id') id: string) {
		return this.productService.delete(+id)
	}

	@Get(':id')
	async getProduct(@Param('id') id: string, @CurrentUser('id') userId?: number) {
		return this.productService.byId(+id, userId)
	}



	//  работа с просмотрами
	@Post('view/:id')
	@HttpCode(200)
	@UseGuards(OptionalJwtAuthGuard)
	async addView(@Param('id') id: string, @CurrentUser('id') userId?: number ) {
		return this.productService.addView({ 
			productId: +id, 
			userId
		});
	}

	@Get('popular/list')
	async getPopularProducts(@Query() dto: PopularProductsDto) {
		return this.productService.getPopularProducts(dto);
	}

	@Get('recently-viewed/list')
	@Auth()
	async getRecentlyViewed(@CurrentUser('id') id: number, @Query() dto: Omit<RecentlyViewedDto, 'userId'>) {
		return this.productService.getRecentlyViewed({ 
			userId: id, 
			...dto 
		});
	}

	@Get('views-count/:id')
	async getViewsCount(@Param('id') id: string) {
		return this.productService.getViewsCount(+id);
	}

	// аналитика для админки
	
	@Get('analytics/statistics')
	@Auth()
	async getViewsStatistics(@Query('days') days?: string) {
		return this.analyticsService.getViewsStatistics(days ? +days : 30);
	}

	@Get('analytics/trends')
	@Auth()
	async getViewsTrends(@Query('days') days?: string) {
		return this.analyticsService.getViewsTrends(days ? +days : 7);
	}

	@Get('analytics/categories')
	@Auth()
	async getMostViewedCategories(@Query('days') days?: string) {
		return this.analyticsService.getMostViewedCategories(days ? +days : 30);
	}
}