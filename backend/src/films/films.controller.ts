import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { ListResponseDto } from '../common/dto/list-response.dto';
import { FilmDto, ScheduleDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmService: FilmsService) {}

  @Get()
  findAll(): Promise<ListResponseDto<FilmDto>> {
    return this.filmService.findAll();
  }

  @Get(':id/schedule')
  getSchedule(@Param('id') id: string): Promise<ListResponseDto<ScheduleDto>> {
    return this.filmService.getSchedule(id);
  }
}
