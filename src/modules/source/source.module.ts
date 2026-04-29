import { Module } from '@nestjs/common';
import { SourceController } from './source.controller';
import { SourceService } from './source.service';
import { SourceRepository } from './source.repository';
import { Neo4jSourceRepository } from './neo4j-source.repository';
import { ExtensionModule } from '../extension/extension.module';

@Module({
  imports: [ExtensionModule],
  controllers: [SourceController],
  providers: [
    SourceService,
    { provide: SourceRepository, useClass: Neo4jSourceRepository },
  ],
  exports: [SourceRepository],
})
export class SourceModule {}
