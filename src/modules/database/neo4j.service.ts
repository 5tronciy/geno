import { Injectable, Inject } from '@nestjs/common';
import type {
  Driver,
  Session,
  Record as Neo4jRecord,
  Node,
} from 'neo4j-driver';

@Injectable()
export class Neo4jService {
  constructor(@Inject('NEO4J_DRIVER') private driver: Driver) {}

  async readOne<T>(
    query: string,
    params: any,
    mapper: (record: Neo4jRecord) => T,
  ): Promise<T | null> {
    const session: Session = this.driver.session();

    try {
      const result = await session.run(query, params);
      if (!result.records.length) return null;
      return mapper(result.records[0]);
    } finally {
      await session.close();
    }
  }

  async readMany<T>(
    query: string,
    params: any,
    mapper: (record: Neo4jRecord) => T,
  ): Promise<T[]> {
    const session = this.driver.session();

    try {
      const result = await session.run(query, params);
      return result.records.map(mapper);
    } finally {
      await session.close();
    }
  }

  async write(query: string, params: any): Promise<void> {
    const session: Session = this.driver.session();

    try {
      await session.run(query, params);
    } finally {
      await session.close();
    }
  }

  getNode(record: Neo4jRecord, key: string): Node {
    return record.get(key) as Node;
  }
}
