import { Injectable } from '@nestjs/common';
import { FamilyRepository } from './family.repository';
import { Family } from './domain/family';
import { ExtensionService } from '../extension/extension.service';

@Injectable()
export class FamilyService {
  constructor(
    private readonly repo: FamilyRepository,
    private readonly extensions: ExtensionService,
  ) {}

  async getById(id: string): Promise<Family> {
    const family = await this.repo.getById(id);

    if (!family) {
      throw new Error(`Family ${id} not found`);
    }

    return family;
  }

  async create(family: Family): Promise<void> {
    if (!family.id) {
      throw new Error('Family.id is required');
    }

    await this.repo.save(family);
  }
}
