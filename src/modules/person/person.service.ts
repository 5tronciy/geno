import { Injectable } from '@nestjs/common';
import { PersonRepository } from './person.repository';
import { Person } from './domain/person';
import { ExtensionService } from '../extension/extension.service';

@Injectable()
export class PersonService {
  constructor(
    private readonly repo: PersonRepository,
    private readonly extensions: ExtensionService,
  ) {}

  async getById(id: string): Promise<Person> {
    const person = await this.repo.getById(id);

    if (!person) {
      throw new Error(`Person ${id} not found`);
    }

    return person;
  }

  async create(person: Person): Promise<void> {
    if (!person.id) {
      throw new Error('Person.id is required');
    }

    await this.repo.save(person);
  }
}
