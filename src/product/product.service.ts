import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { productReturnObject, productReturnObjectFullest } from './product-object';
import { ProductDto } from './dto/product.dto';
import { generateSlug } from '../utils/generate-slug';
import { PaginationService } from '../pagination/pagination.service';
import { EnumProductSort, GetAllProductDto } from './dto/getAllProduct.dto';
import { Prisma } from '@prisma/client';
import { ProductViewDto, PopularProductsDto, RecentlyViewedDto } from './dto/product-view.dto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService
  ){}

  async getAll(dto: GetAllProductDto){
    const {sort, searchTerm, categorySlug} = dto  

    const prismaSort:Prisma.ProductOrderByWithRelationInput[] = []

    

    if(sort == EnumProductSort.LOW_PRICE)
      {prismaSort.push({price: 'asc'})}
    else if(sort == EnumProductSort.HIGH_PRICE)
      {prismaSort.push({price: 'desc'})}
    else if(sort == EnumProductSort.OLDEST)
      {prismaSort.push({createdAt: 'asc'})}
    else
      {prismaSort.push({createdAt: 'desc'})}


    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm ? {
      OR: [
        
        {
          category: {
            name: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        },

        {
          name: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },

        {
          description: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        }
        
      ]
    } : {}

    const prismaCategoryFilter: Prisma.ProductWhereInput = categorySlug ? {
      category: {
        slug: categorySlug
      }
    } : {}

    const {perPage, skip} = this.paginationService.getPagination(dto)
    const products = await this.prisma.product.findMany({
      where: {
        ...prismaSearchTermFilter,
        ...prismaCategoryFilter
      },
      orderBy: prismaSort,
      skip,
      take: perPage,
      select: productReturnObject
    })

    return {
      products,
      length: await this.prisma.product.count({
        where: {
          ...prismaSearchTermFilter,
          ...prismaCategoryFilter
        }
      })
    }
  }
  
  async byId(id: number, userId?: number){
    const product = await this.prisma.product.findUnique({
      where: {
        id
      },
      select: productReturnObjectFullest
    })

    if(!product) throw new Error("product not found")

    // Автоматически добавляем просмотр при получении товара
    if (userId) {
      await this.addView({ productId: id, userId }).catch(() => {
        // Игнорируем ошибки добавления просмотра
      });
    }

    return  product
  }

  async byCategory(categorySlug: string) {

		const products = await this.prisma.product.findMany({
			where: {
				category: {
          slug: categorySlug
        }
			},
			select: productReturnObjectFullest
		})

    return products
	}

  async bySlug(slug: string){
    const productSlug = await this.prisma.product.findUnique({
      where: {
        slug
      },
      select: productReturnObjectFullest
    })

    if(!productSlug) throw new NotFoundException("product not found")

    return productSlug
  }

  async create(){
    const product = await  this.prisma.product.create({
      data: {
        description: '',
        name: '',
        price: 0,
        slug: ''
      }
    })

    return product.id
  }



  async getSimelar(id: number){
    const currentProduct = await this.byId(id) // Убираем userId для внутреннего вызова

    if(!currentProduct) {throw new NotFoundException("Current Product not found")}
    
    const productExists = await this.prisma.product.findUnique({
      where: {
        name: currentProduct.name
      }
    })

    if(!productExists) throw new NotFoundException('Product not found')

    const products = await this.prisma.product.findMany({
      where: {
        category: {
          name: currentProduct.category.name
        },
        NOT: {
          id: currentProduct.id
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: productReturnObject
    })
    
    return products
  }
  

  
  async update(id: number, dto: ProductDto ) {
    const {description, images, price, name, categoryId} = dto


		return this.prisma.product.update({
			where: {
				id
			},
      data: {
        description,
        images,
        price,
        name,
        slug: generateSlug(name),
        category: {
          connect: {
            id: categoryId
          }
        }
      }
		})
	}


  async delete(id: number ) {

		return this.prisma.product.delete({
			where: {
				id
			}
		})
	}


  
  // Методы для работы с просмотрами товаров

async addView(dto: ProductViewDto) {
  const { productId, userId } = dto;

  // Проверяем, существует ли продукт
  const product = await this.prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  // 1. Увеличиваем общий счетчик просмотров
  await this.prisma.product.update({
    where: { id: productId },
    data: {
      viewsCount: {
        increment: 1,
      },
    },
  });

  // 2. Если пользователь авторизован — сохраняем просмотр в историю
  if (userId) {
    const lastView = await this.prisma.productViews.findFirst({
      where: {
        productId,
        userId,
      },
      orderBy: {
        viewedAt: 'desc',
      },
    });

    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);

    if (lastView && lastView.viewedAt > hourAgo) {
      // Не добавляем повторную запись
      return { message: 'View counted, already recorded in history recently.' };
    }

    await this.prisma.productViews.create({
      data: {
        productId,
        userId,
      },
    });

    return { message: 'View counted and saved to history.' };
  }

  return { message: 'View counted.' };
}


  

  async getPopularProducts(dto: PopularProductsDto) {
    const { limit = 10, timeRange = 'all' } = dto;

    let dateFilter: Date | undefined;
    
    switch (timeRange) {
      case 'day':
        dateFilter = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    const products = await this.prisma.product.findMany({
      select: {
        ...productReturnObject,
        _count: {
          select: {
            views: dateFilter ? {
              where: {
                viewedAt: {
                  gte: dateFilter
                }
              }
            } : true
          }
        }
      },
      orderBy: {
        views: {
          _count: 'desc'
        }
      },
      take: limit
    });

    return products.map(product => ({
      ...product,
      viewsCount: product._count.views
    }));
  }

  async getRecentlyViewed(dto: RecentlyViewedDto) {
    const { userId, limit = 10 } = dto;

    const recentViews = await this.prisma.productViews.findMany({
      where: {
        userId
      },
      orderBy: {
        viewedAt: 'desc'
      },
      take: limit,
      distinct: ['productId'],
      include: {
        product: {
          select: productReturnObject
        }
      }
    });

    return recentViews.map(view => ({
      ...view.product,
      viewedAt: view.viewedAt
    }));
  }

  async getViewsCount(productId: number) {
    const count = await this.prisma.product.findUnique({
      where: {id: productId},
      select: {
        viewsCount: true
      }
    });

    return { productId, viewsCount: count.viewsCount };
  }
}
