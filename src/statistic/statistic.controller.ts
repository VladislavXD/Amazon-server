import { Controller, Get } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}


  @Get()
  @Auth()
  getMain (@CurrentUser('id') id: number){
    return this.statisticService.getMain(id)
  }
}
