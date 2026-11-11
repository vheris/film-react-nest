import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { Film, FilmSchema } from './schemas/film.schema';
import { FilmsRepository } from '../repository/films.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository],
  exports: [FilmsRepository],
})
export class FilmsModule {}
