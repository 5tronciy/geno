import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { PersonModule } from './modules/person/person.module';
import { FamilyModule } from './modules/family/family.module';
import { EventModule } from './modules/event/event.module';
import { SourceModule } from './modules/source/source.module';
import { ExtensionModule } from './modules/extension/extension.module';

@Module({
  imports: [
    DatabaseModule,
    PersonModule,
    FamilyModule,
    EventModule,
    SourceModule,
    ExtensionModule,
  ],
})
export class AppModule {}
