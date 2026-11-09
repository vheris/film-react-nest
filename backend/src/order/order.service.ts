import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { FilmsRepository } from '../repository/films.repository';
import { Film } from '../films/schemas/film.schema';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

interface SessionSeats {
  filmId: string;
  sessionId: string;
  seats: string[];
}

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const tickets = dto?.tickets;
    if (!Array.isArray(tickets) || tickets.length === 0) {
      throw this.error('Не выбрано ни одного билета');
    }

    const films = new Map<string, Film>();
    const bySession = new Map<string, SessionSeats>();

    for (const ticket of tickets) {
      let film = films.get(ticket.film);
      if (!film) {
        film = await this.filmsRepository.findFilmById(ticket.film);
        if (!film) {
          throw this.error(`Фильм ${ticket.film} не найден`);
        }
        films.set(ticket.film, film);
      }

      const session = film.schedule.find((s) => s.id === ticket.session);
      if (!session) {
        throw this.error(`Сеанс ${ticket.session} не найден`);
      }

      const place = `${ticket.row}:${ticket.seat}`;
      if (
        !this.inRange(ticket.row, session.rows) ||
        !this.inRange(ticket.seat, session.seats)
      ) {
        throw this.error(`Места ${place} не существует`);
      }

      if (session.taken.includes(place)) {
        throw this.error(`Место ${place} уже занято`);
      }

      const key = `${ticket.film}:${ticket.session}`;
      const group = bySession.get(key) ?? {
        filmId: ticket.film,
        sessionId: ticket.session,
        seats: [],
      };
      if (group.seats.includes(place)) {
        throw this.error(`Место ${place} указано в заказе дважды`);
      }
      group.seats.push(place);
      bySession.set(key, group);
    }

    for (const group of bySession.values()) {
      const saved = await this.filmsRepository.takeSeats(
        group.filmId,
        group.sessionId,
        group.seats,
      );
      if (!saved) {
        throw this.error('Выбранные места уже заняты');
      }
    }

    const items = tickets.map((ticket) => ({ ...ticket, id: randomUUID() }));
    return { total: items.length, items };
  }

  private inRange(value: number, max: number): boolean {
    return Number.isInteger(value) && value >= 1 && value <= max;
  }

  private error(message: string): BadRequestException {
    return new BadRequestException({ error: message });
  }
}
