import { IsString } from "class-validator";

export class refreshToken{
  @IsString()
  refreshToken: string
}