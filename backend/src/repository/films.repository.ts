import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Film, FilmDocument, Schedule } from '../films/schemas/film.schema';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {}

  private toFilmDto(film: Film): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  private toScheduleDto(s: Schedule): ScheduleDto {
    return {
      id: s.id,
      daytime: s.daytime,
      hall: s.hall,
      rows: s.rows,
      seats: s.seats,
      price: s.price,
      taken: s.taken,
    };
  }

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().lean();
    return films.map((film) => this.toFilmDto(film));
  }

  async findFilmById(id: string): Promise<Film | null> {
    return this.filmModel.findOne({ id }).lean();
  }

  async takeSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<boolean> {
    const result = await this.filmModel.updateOne(
      {
        id: filmId,
        schedule: { $elemMatch: { id: sessionId, taken: { $nin: seats } } },
      },
      { $push: { 'schedule.$.taken': { $each: seats } } },
    );
    return result.modifiedCount === 1;
  }

  async findScheduleByFilmId(id: string): Promise<ScheduleDto[] | null> {
    const film = await this.filmModel.findOne({ id }).lean();
    if (!film) return null;
    return film.schedule.map((s) => this.toScheduleDto(s));
  }
}
