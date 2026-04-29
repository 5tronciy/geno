import { Injectable } from '@nestjs/common';
import { ExtensionRepository } from './extension.repository';
import { Extension } from './domain/extension';

@Injectable()
export class ExtensionService {
  constructor(private readonly repo: ExtensionRepository) {}

  addToNode(label: string, nodeId: string, ext: Extension) {
    return this.repo.addToNode(label, nodeId, ext);
  }

  getByNode(label: string, nodeId: string) {
    return this.repo.getByNode(label, nodeId);
  }

  remove(label: string, nodeId: string, extensionId: string) {
    return this.repo.delete(label, nodeId, extensionId);
  }
}
