import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { PersonService } from './person.service';
import type { Person } from './domain/person';

@Controller('persons')
export class PersonController {
  constructor(private readonly service: PersonService) {}

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  create(@Body() body: Person) {
    return this.service.create(body);
  }
}
