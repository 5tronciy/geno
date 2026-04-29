import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { EventService } from './event.service';
import type { Event } from './domain/event';

@Controller('events')
export class EventController {
  constructor(private readonly service: EventService) {}

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  create(@Body() body: Event) {
    return this.service.create(body);
  }
}
