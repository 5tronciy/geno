import { Module } from '@nestjs/common';
import { ExtensionService } from './extension.service';
import { ExtensionRepository } from './extension.repository';
import { Neo4jExtensionRepository } from './neo4j-extension.repository';

@Module({
  providers: [
    ExtensionService,
    {
      provide: ExtensionRepository,
      useClass: Neo4jExtensionRepository,
    },
  ],
  exports: [ExtensionService],
})
export class ExtensionModule {}
