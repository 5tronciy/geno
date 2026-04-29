import { Injectable } from '@nestjs/common';
import { Event } from './domain/event';
import { eventMapper } from './event.mapper';
import { EventRepository } from './event.repository';
import { Neo4jService } from '../database/neo4j.service';

@Injectable()
export class Neo4jEventRepository implements EventRepository {
  constructor(private readonly neo4j: Neo4jService) {}

  async getById(id: string): Promise<Event | null> {
    return await this.neo4j.readOne(
      'MATCH (e:Event {id:$id}) RETURN e',
      { id },
      (record) => {
        const node = this.neo4j.getNode(record, 'e');
        return eventMapper.toDomain(node);
      },
    );
  }

  async save(event: Event): Promise<void> {
    await this.neo4j.write(
      `MERGE (e:Event {id:$id})
       SET e.type=$type,
           e.date=$date,
           e.place=$place,
           e.participants=$participants,
           e.sourceIds=$sourceIds`,
      eventMapper.toPersistence(event),
    );
  }
}
