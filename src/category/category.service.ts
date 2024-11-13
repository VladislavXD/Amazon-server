import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { returnCategoryObject } from './category.object';
import { PrismaService } from 'src/prisma.service';
import { CategoryDto } from './category.dto';
import { generateSlug } from 'src/utils/generate-slug';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService){}


  async byId(id: number){
    const category = await this.prisma.category.findUnique({
      where: {
        id
      },
      select: returnCategoryObject
    })

    if(!category) throw new Error("category not found")

    return category
  }

  async bySlug(slug: string){
    const categorySlug = await this.prisma.category.findUnique({
      where: {
        slug
      },
      select: returnCategoryObject
    })

    if(!categorySlug) throw new NotFoundException("category not found")

    return categorySlug
  }

  async getAll( ){
    return this.prisma.category.findMany({
      select: returnCategoryObject
    })
  }


  async create(){
    return this.prisma.category.create({
      data: {
        name: '',
        slug: ''
      }
    })
  }

  async update(id: number, dto: CategoryDto) {

		return this.prisma.category.update({
			where: {
				id
			},
			data: {
        name: dto.name,
        slug: generateSlug(dto.name)
			}
		})
	}

  async delete(id: number ) {

		return this.prisma.category.delete({
			where: {
				id
			}
		})
	}
}
