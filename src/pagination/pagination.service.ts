import { Injectable } from '@nestjs/common';
import { paginationDto } from './pagination.dto';

@Injectable()
export class PaginationService {
  getPagination(dto: paginationDto, defaultPerPage = 30){
    const page = dto.page ?  +dto.page : 1
    const perPage = dto.perPage ? +dto.perPage : defaultPerPage

    const skip = (page - 1) * perPage

    return { perPage, skip  }
  }
}