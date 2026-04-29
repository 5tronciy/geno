import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { FamilyService } from './family.service';
import type { Family } from './domain/family';

@Controller('families')
export class FamilyController {
  constructor(private readonly service: FamilyService) {}

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  create(@Body() body: Family) {
    return this.service.create(body);
  }
}
