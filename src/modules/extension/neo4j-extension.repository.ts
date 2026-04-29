import { Injectable } from '@nestjs/common';
import { ExtensionRepository } from './extension.repository';
import { Extension } from './domain/extension';
import { Neo4jService } from '../database/neo4j.service';
import { extensionMapper } from './extension.mapper';
import { Node } from 'neo4j-driver';

@Injectable()
export class Neo4jExtensionRepository implements ExtensionRepository {
  constructor(private readonly neo4j: Neo4jService) {}

  async addToNode(
    label: string,
    nodeId: string,
    ext: Extension,
  ): Promise<void> {
    await this.neo4j.write(
      `
      MATCH (n:${label} {id: $nodeId})
      MERGE (e:Extension {id: $id})
      SET e.url = $url,
          e.value = $value
      MERGE (n)-[:HAS_EXTENSION]->(e)
      `,
      {
        nodeId,
        ...ext,
      },
    );
  }

  async getByNode(label: string, nodeId: string): Promise<Extension[]> {
    return this.neo4j.readMany(
      `
      MATCH (n:${label} {id: $nodeId})
      OPTIONAL MATCH (n)-[:HAS_EXTENSION]->(e:Extension)
      RETURN e
      `,
      { nodeId },
      (record) => {
        const node = record.get('e') as Node;
        return extensionMapper.toDomain(node);
      },
    );
  }

  async delete(
    label: string,
    nodeId: string,
    extensionId: string,
  ): Promise<void> {
    await this.neo4j.write(
      `
      MATCH (n:${label} {id: $nodeId})
      MATCH (n)-[r:HAS_EXTENSION]->(e:Extension {id: $extensionId})
      DELETE r
      `,
      { nodeId, extensionId },
    );
  }
}
