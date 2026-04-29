import { Source } from './domain/source';

export abstract class SourceRepository {
  abstract getById(id: string): Promise<Source | null>;
  abstract save(source: Source): Promise<void>;
}
