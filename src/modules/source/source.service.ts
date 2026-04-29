import { Injectable } from '@nestjs/common';
import { SourceRepository } from './source.repository';
import { Source } from './domain/source';
import { ExtensionService } from '../extension/extension.service';

@Injectable()
export class SourceService {
  constructor(
    private readonly repo: SourceRepository,
    private readonly extensions: ExtensionService,
  ) {}

  async getById(id: string): Promise<Source> {
    const source = await this.repo.getById(id);

    if (!source) {
      throw new Error(`Source ${id} not found`);
    }

    return source;
  }

  async create(source: Source): Promise<void> {
    if (!source.id) {
      throw new Error('Source.id is required');
    }

    await this.repo.save(source);
  }
}
