import { Person } from './domain/person';

export abstract class PersonRepository {
  abstract getById(id: string): Promise<Person | null>;
  abstract save(person: Person): Promise<void>;
}
