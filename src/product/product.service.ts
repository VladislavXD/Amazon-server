import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { productReturnObject, productReturnObjectFullest } from './product-object';
import { ProductDto } from './dto/product.dto';
import { generateSlug } from 'src/utils/generate-slug';
import { PaginationService } from 'src/pagination/pagination.service';
import { EnumProductSort, GetAllProductDto } from './dto/getAllProduct.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService
  ){}

  async getAll(dto: GetAllProductDto){
    const {sort, searchTerm} = dto  

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

    const {perPage, skip} = this.paginationService.getPagination(dto)
    const products = await this.prisma.product.findMany({
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
      skip,
      take: perPage,
      select: productReturnObject
    })

    return {
      products,
      length: await this.prisma.product.count({
        where: prismaSearchTermFilter
      })
    }
  }
  
  async byId(id: number){
    const product = await this.prisma.product.findUnique({
      where: {
        id
      },
      select: productReturnObjectFullest
    })

    if(!product) throw new Error("product not found")

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
    const currentProduct = await this.byId(id)

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


}
