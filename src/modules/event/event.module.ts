import { Module } from '@nestjs/common';
import { Neo4jEventRepository } from './neo4j-event.repository';
import { EventRepository } from './event.repository';

@Module({
  providers: [{ provide: EventRepository, useClass: Neo4jEventRepository }],
  exports: [EventRepository],
})
export class EventModule {}
