import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsListResponseDto, ScheduleListResponseDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmService: FilmsService) {}

  @Get()
  findAll(): Promise<FilmsListResponseDto> {
    return this.filmService.findAll();
  }

  @Get(':id/schedule')
  getSchedule(@Param('id') id: string): Promise<ScheduleListResponseDto> {
    return this.filmService.getSchedule(id);
  }
}
