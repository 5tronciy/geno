import { Injectable } from '@nestjs/common';
import { Family } from './domain/family';
import { familyMapper } from './family.mapper';
import { FamilyRepository } from './family.repository';
import { Neo4jService } from '../database/neo4j.service';

@Injectable()
export class Neo4jFamilyRepository implements FamilyRepository {
  constructor(private readonly neo4j: Neo4jService) {}

  async getById(id: string): Promise<Family | null> {
    return await this.neo4j.readOne(
      'MATCH (f:Family {id:$id}) RETURN f',
      { id },
      (record) => {
        const node = this.neo4j.getNode(record, 'f');
        return familyMapper.toDomain(node);
      },
    );
  }

  async save(family: Family): Promise<void> {
    await this.neo4j.write(
      `MERGE (f:Family {id:$id})
       SET f.parents=$parents,
           f.children=$children`,
      familyMapper.toPersistence(family),
    );
  }
}
