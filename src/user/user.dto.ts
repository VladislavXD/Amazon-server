import { IsEmail, IsOptional, IsString, MinLength, isString } from "class-validator";

export class UserDto{
  @IsEmail()
  email: string

  @IsString()
  @IsOptional()
  password: string

  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  avatarUrl: string

  @IsString()
  @IsOptional()
  phonne?: string
}