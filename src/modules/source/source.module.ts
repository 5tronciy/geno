import { Module } from '@nestjs/common';
import { SourceRepository } from './source.repository';
import { Neo4jSourceRepository } from './neo4j-source.repository';

@Module({
  providers: [{ provide: SourceRepository, useClass: Neo4jSourceRepository }],
  exports: [SourceRepository],
})
export class SourceModule {}
