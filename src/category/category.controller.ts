import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CategoryDto } from './category.dto';

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	// get profile
	// toggleFavorite
	// updateProfile

	@Get()
	async getAll() {
		return this.categoryService.getAll()
	}
	@Get('by-slug/:slug')
	async getByslugl(@Param('slug') slug: string) {
		return this.categoryService.bySlug(slug)
	}
	@Get(':id')
	async getBysId(@Param('id') id: string) {
		return this.categoryService.byId(+id)
	}


	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put(':id')
	async update(@Param('id') id: string,
               @Body() dto: CategoryDto) {
		return this.categoryService.update(+id, dto)
	}


	@Auth()
	@HttpCode(200)
	@Post()
	async create(){
		return this.categoryService.create()
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@HttpCode(200)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.categoryService.delete(+id)
	}
}



