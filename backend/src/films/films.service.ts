import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { FilmsListResponseDto, ScheduleListResponseDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<FilmsListResponseDto> {
    const items = await this.filmsRepository.findAll();
    return { total: items.length, items };
  }

  async getSchedule(id: string): Promise<ScheduleListResponseDto> {
    const items = await this.filmsRepository.findScheduleByFilmId(id);
    if (!items) {
      throw new NotFoundException(`Фильм с id ${id} не найден`);
    }
    return { total: items.length, items };
  }
}
