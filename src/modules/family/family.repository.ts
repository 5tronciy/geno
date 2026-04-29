import { Family } from './domain/family';

export abstract class FamilyRepository {
  abstract getById(id: string): Promise<Family | null>;
  abstract save(family: Family): Promise<void>;
}
