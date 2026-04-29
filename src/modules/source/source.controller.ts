import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { SourceService } from './source.service';
import type { Source } from './domain/source';

@Controller('sources')
export class SourceController {
  constructor(private readonly service: SourceService) {}

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  create(@Body() body: Source) {
    return this.service.create(body);
  }
}
