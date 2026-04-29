import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { Neo4jEventRepository } from './neo4j-event.repository';
import { ExtensionModule } from '../extension/extension.module';

@Module({
  imports: [ExtensionModule],
  controllers: [EventController],
  providers: [
    EventService,
    { provide: EventRepository, useClass: Neo4jEventRepository },
  ],
  exports: [EventRepository],
})
export class EventModule {}
