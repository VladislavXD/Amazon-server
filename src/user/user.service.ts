import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { returnUserObject } from './user-object';
import { Prisma } from '@prisma/client';
import { UserDto } from './user.dto';
import { hash } from 'argon2';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService){}


  async byId(id: number, selectObject: Prisma.UserSelect = {}){
    const user = await this.prisma.user.findUnique({
      where: {
        id
      },
      select: {
       ...returnUserObject,
        favorites: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            slug: true
          }
        },
        ...selectObject
      }
    })

    if(!user) throw new Error("User not found")

    return user
  }



  async updateProfile(id: number, dto: UserDto) {
		const isSameUser = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})

		if (isSameUser && id !== isSameUser.id)
			throw new BadRequestException('Email already in use')

		const user = await this.byId(id)

		return this.prisma.user.update({
			where: {
				id
			},
			data: {
				email: dto.email,
				name: dto.name,
				avatarUrl: dto.avatarUrl,
				phone: dto.phonne,
				password: dto.password ? await hash(dto.password) : user.password,
        description: dto.description 
			}
		})
	}


    
  async toggleFavorite(userId: number, productId: number){
    const user = await this.byId(userId)

    if(!user) throw new NotFoundException("User not found")


      const isExists = user.favorites.some(product => product.id == productId)

      await this.prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          favorites: {
            [isExists ? 'disconnect' : 'connect']: {
              id: productId
            }
          }
        }
      })
      return {message: 'Success'}
  }


  // async updateAvatar(userId: number, file: Express.Multer.File) {
  //   if (!file) {
  //     throw new BadRequestException('No file uploaded');
  //   }

  //   const avatarsPath = join(process.cwd(), 'public', 'uploads', 'avatars');

  //   // 1. Получаем текущего пользователя
  //   const currentUser = await this.prisma.user.findUnique({
  //     where: { id: userId },
  //     select: { avatarUrl: true }
  //   });

  //   // 2. Удаляем старый файл
  //   if (currentUser?.avatarUrl && !currentUser.avatarUrl.includes('defauld_avatar.png')) {
  //     const oldFileName = currentUser.avatarUrl.split('/').pop();
  //     const oldFilePath = join(avatarsPath, oldFileName);

  //     if (existsSync(oldFilePath)) {
  //       try {
  //         unlinkSync(oldFilePath);
  //         console.log('Old avatar deleted:', oldFilePath);
  //       } catch (err) {
  //         console.error('Error deleting old avatar:', err);
  //       }
  //     }
  //   }

  //   // 3. Сохраняем новый
  //   const avatarUrl = `${file.filename}`;

  //   const updatedUser = await this.prisma.user.update({
  //     where: { id: userId },
  //     data: { avatarUrl },
  //     select: {
  //       id: true,
  //       email: true,
  //       name: true,
  //       avatarUrl: true,
  //     }
  //   });

  //   return { 
  //     message: 'Avatar uploaded successfully',
  //     avatarUrl,
  //     user: updatedUser
  //   };
  // }

}



