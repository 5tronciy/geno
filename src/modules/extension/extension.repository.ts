import { Extension } from './domain/extension';

export abstract class ExtensionRepository {
  abstract addToNode(
    label: string,
    nodeId: string,
    ext: Extension,
  ): Promise<void>;

  abstract getByNode(label: string, nodeId: string): Promise<Extension[]>;

  abstract delete(
    label: string,
    nodeId: string,
    extensionId: string,
  ): Promise<void>;
}
