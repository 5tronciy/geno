import { Module } from '@nestjs/common';
import { FamilyController } from './family.controller';
import { FamilyService } from './family.service';
import { FamilyRepository } from './family.repository';
import { Neo4jFamilyRepository } from './neo4j-family.repository';
import { ExtensionModule } from '../extension/extension.module';

@Module({
  imports: [ExtensionModule],
  controllers: [FamilyController],
  providers: [
    FamilyService,
    { provide: FamilyRepository, useClass: Neo4jFamilyRepository },
  ],
  exports: [FamilyRepository],
})
export class FamilyModule {}
