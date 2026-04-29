import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { PersonRepository } from './person.repository';
import { Neo4jPersonRepository } from './neo4j-person.repository';
import { ExtensionModule } from '../extension/extension.module';

@Module({
  imports: [ExtensionModule],
  controllers: [PersonController],
  providers: [
    PersonService,
    {
      provide: PersonRepository,
      useClass: Neo4jPersonRepository,
    },
  ],
  exports: [PersonRepository],
})
export class PersonModule {}
