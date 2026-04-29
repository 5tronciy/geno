import { Module } from '@nestjs/common';
import { FamilyRepository } from './family.repository';
import { Neo4jFamilyRepository } from './neo4j-family.repository';

@Module({
  providers: [{ provide: FamilyRepository, useClass: Neo4jFamilyRepository }],
  exports: [FamilyRepository],
})
export class FamilyModule {}
