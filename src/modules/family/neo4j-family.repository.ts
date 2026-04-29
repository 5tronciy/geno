import { Injectable } from '@nestjs/common';
import { Node } from 'neo4j-driver';
import { Family } from './domain/family';
import { familyMapper } from './family.mapper';
import { FamilyRepository } from './family.repository';
import { Neo4jService } from '../database/neo4j.service';
import { extensionMapper } from '../extension/extension.mapper';

@Injectable()
export class Neo4jFamilyRepository implements FamilyRepository {
  constructor(private readonly neo4j: Neo4jService) {}

  async getById(id: string): Promise<Family | null> {
    return await this.neo4j.readOne(
      `MATCH (f:Family {id: $id})
       OPTIONAL MATCH (f)-[:HAS_EXTENSION]->(ext:Extension)
       RETURN f, collect(ext) AS extensions`,
      { id },
      (record) => {
        const node = this.neo4j.getNode(record, 'f');
        const extensions = record.get('extensions') as Node[];
        return {
          ...familyMapper.toDomain(node),
          extensions: extensions.map((e) => extensionMapper.toDomain(e)),
        };
      },
    );
  }

  async save(family: Family): Promise<void> {
    await this.neo4j.write(
      `MERGE (f:Family {id:$id})
       SET f.parents=$parents,
           f.children=$children,
           f.eventIds=$eventIds`,
      familyMapper.toPersistence(family),
    );
  }
}
