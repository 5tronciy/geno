import { Module, Global } from '@nestjs/common';
import * as neo4j from 'neo4j-driver';
import type { Driver } from 'neo4j-driver';
import { Neo4jService } from './neo4j.service';

@Global()
@Module({
  providers: [
    {
      provide: 'NEO4J_DRIVER',
      useFactory: (): Driver => {
        return neo4j.driver(
          'bolt://localhost:7687',
          neo4j.auth.basic('neo4j', 'password'),
        );
      },
    },
    Neo4jService,
  ],
  exports: ['NEO4J_DRIVER', Neo4jService],
})
export class DatabaseModule {}
