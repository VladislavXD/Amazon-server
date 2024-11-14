import { Controller, Get } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}


  @Get()
  @Auth()
  getMain (@CurrentUser('id') id: number){
    return this.statisticService.getMain(id)
  }
}
