import { Injectable } from '@nestjs/common';
import { Node } from 'neo4j-driver';
import { Event } from './domain/event';
import { eventMapper } from './event.mapper';
import { EventRepository } from './event.repository';
import { Neo4jService } from '../database/neo4j.service';
import { extensionMapper } from '../extension/extension.mapper';

@Injectable()
export class Neo4jEventRepository implements EventRepository {
  constructor(private readonly neo4j: Neo4jService) {}

  async getById(id: string): Promise<Event | null> {
    return await this.neo4j.readOne(
      `MATCH (e:Event {id: $id})
       OPTIONAL MATCH (e)-[:HAS_EXTENSION]->(ext:Extension)
       RETURN e, collect(ext) AS extensions`,
      { id },
      (record) => {
        const node = this.neo4j.getNode(record, 'e');
        const extensions = record.get('extensions') as Node[];
        return {
          ...eventMapper.toDomain(node),
          extensions: extensions.map((e) => extensionMapper.toDomain(e)),
        };
      },
    );
  }

  async save(event: Event): Promise<void> {
    await this.neo4j.write(
      `MERGE (e:Event {id:$id})
       SET e.type=$type,
           e.date=$date,
           e.placeId=$placeId,
           e.participants=$participants,
           e.sourceIds=$sourceIds`,
      eventMapper.toPersistence(event),
    );
  }
}
