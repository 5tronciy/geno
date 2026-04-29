import { Injectable } from '@nestjs/common';
import { Node } from 'neo4j-driver';
import { Source } from './domain/source';
import { sourceMapper } from './source.mapper';
import { SourceRepository } from './source.repository';
import { Neo4jService } from '../database/neo4j.service';
import { extensionMapper } from '../extension/extension.mapper';

@Injectable()
export class Neo4jSourceRepository implements SourceRepository {
  constructor(private readonly neo4j: Neo4jService) {}

  async getById(id: string): Promise<Source | null> {
    return await this.neo4j.readOne(
      `MATCH (s:Source {id: $id})
       OPTIONAL MATCH (s)-[:HAS_EXTENSION]->(ext:Extension)
       RETURN s, collect(ext) AS extensions`,
      { id },
      (record) => {
        const node = this.neo4j.getNode(record, 's');
        const extensions = record.get('extensions') as Node[];
        return {
          ...sourceMapper.toDomain(node),
          extensions: extensions.map((e) => extensionMapper.toDomain(e)),
        };
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
