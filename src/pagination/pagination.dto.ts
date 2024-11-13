import { Optional } from "@nestjs/common";
import { IsString } from "class-validator";

export class paginationDto{
  @IsString()
  page?: string

  @IsString()
  @Optional()
  perPage?: string
}