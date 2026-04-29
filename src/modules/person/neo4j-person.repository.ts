import { Injectable } from '@nestjs/common';
import { Person } from './domain/person';
import { personMapper } from './person.mapper';
import { PersonRepository } from './person.repository';
import { Neo4jService } from '../database/neo4j.service';
import { extensionMapper } from '../extension/extension.mapper';
import { Node } from 'neo4j-driver';

@Injectable()
export class Neo4jPersonRepository implements PersonRepository {
  constructor(private readonly neo4j: Neo4jService) {}

  async getById(id: string): Promise<Person | null> {
    return await this.neo4j.readOne(
      `MATCH (p:Person {id: $id})
        OPTIONAL MATCH (p)-[:HAS_EXTENSION]->(e:Extension)
        RETURN p, collect(e) AS extensions`,
      { id },
      (record) => {
        const node = this.neo4j.getNode(record, 'p');
        const extensions = record.get('extensions') as Node[];
        return {
          ...personMapper.toDomain(node),
          extensions: extensions.map((e) => extensionMapper.toDomain(e)),
        };
      },
    );
  }

  async save(person: Person): Promise<void> {
    await this.neo4j.write(
      `MERGE (p:Person {id:$id})
       SET p.names=$names,
           p.gender=$gender`,
      personMapper.toPersistence(person),
    );
  }
}
