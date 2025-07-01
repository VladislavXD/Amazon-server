import { IsEnum, IsOptional, IsString } from "class-validator";
import { paginationDto } from "../../pagination/pagination.dto";

export enum EnumProductSort{
  HIGH_PRICE = 'high-price',
  LOW_PRICE = 'low-price',
  NEWEST = 'newest',
  OLDEST = 'oldest'
}


export class GetAllProductDto extends paginationDto{
  @IsOptional()
  @IsEnum(EnumProductSort)
  sort?: EnumProductSort

  @IsOptional()
  @IsString()
  searchTerm?: string


	@IsOptional()
	@IsString()
	ratings?: string

	@IsOptional()
	@IsString()
	minPrice?: string

	@IsOptional()
	@IsString()
	maxPrice?: string

	@IsOptional()
	@IsString()
	categoryId?: string

	@IsOptional()
	@IsString()
	categorySlug?: string

}