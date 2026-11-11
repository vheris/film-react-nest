import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { ListResponseDto } from '../common/dto/list-response.dto';
import { CreateOrderDto, OrderResultDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(200)
  create(
    @Body() dto: CreateOrderDto,
  ): Promise<ListResponseDto<OrderResultDto>> {
    return this.orderService.create(dto);
  }
}
