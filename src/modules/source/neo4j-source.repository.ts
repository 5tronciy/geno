import { Injectable } from '@nestjs/common';
import { Source } from './domain/source';
import { sourceMapper } from './source.mapper';
import { SourceRepository } from './source.repository';
import { Neo4jService } from '../database/neo4j.service';

@Injectable()
export class Neo4jSourceRepository implements SourceRepository {
  constructor(private readonly neo4j: Neo4jService) {}

  async getById(id: string): Promise<Source | null> {
    return await this.neo4j.readOne(
      'MATCH (s:Source {id:$id}) RETURN s',
      { id },
      (record) => {
        const node = this.neo4j.getNode(record, 's');
        return sourceMapper.toDomain(node);
      },
    );
  }

  async save(source: Source): Promise<void> {
    await this.neo4j.write(
      `MERGE (s:Source {id:$id})
       SET s.title=$title,
           s.citation=$citation`,
      sourceMapper.toPersistence(source),
    );
  }
}
