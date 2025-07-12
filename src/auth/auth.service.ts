import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthDto } from './dto/auth.dto';
import { faker } from '@faker-js/faker';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { refreshToken } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService, 
    private jwt: JwtService){}
  

  async login(dto: AuthDto){
    const user = await this.validateUser(dto)
    const tokens = await this.issueTokens(user.id)

    return {
      user: this.returnUserFields(user),
      ...tokens
    } 
  } 


  async getNewToken (dto: refreshToken){
    const result  = await this.jwt.verify(dto.refreshToken)


    if(!result) throw new UnauthorizedException('Invalid refresh token')


    const user = await this.prisma.user.findUnique({
      where: {id: result.id}
    })

    const tokens = await this.issueTokens(user.id)

    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }


  async register(dto: AuthDto){
    const oldUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    })

    if(oldUser) throw new BadRequestException('User already exists')


    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: faker.name.firstName(),
        avatarUrl: 'defultAvatar.png',
        phone: faker.phone.number({style: 'national'}),
        password: await hash(dto.password),
        description: 'write something about yourself',
      }
    })


    const tokens = await this.issueTokens(user.id)

    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }

  private async issueTokens(userId: number) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})

		return { accessToken, refreshToken }
	}

  

  private returnUserFields(user: User){
    return {
      id: user.id,
      email: user.email.toLowerCase()
      
    }
  }


  private async validateUser(dto: AuthDto){
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      }
    })


    if (!user) throw new NotFoundException("User not found")

    const isValid = await verify(user.password, dto.password)


    if(!isValid) throw new UnauthorizedException('Invalid password or email')
    
      return user
  }
}





