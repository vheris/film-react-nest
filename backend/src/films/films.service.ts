import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { ListResponseDto } from '../common/dto/list-response.dto';
import { FilmDto, ScheduleDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<ListResponseDto<FilmDto>> {
    const items = await this.filmsRepository.findAll();
    return { total: items.length, items };
  }

  async getSchedule(id: string): Promise<ListResponseDto<ScheduleDto>> {
    const items = await this.filmsRepository.findScheduleByFilmId(id);
    if (!items) {
      throw new NotFoundException(`Фильм с id ${id} не найден`);
    }
    return { total: items.length, items };
  }
}
