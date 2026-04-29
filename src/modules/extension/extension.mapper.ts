import { Node } from 'neo4j-driver';
import { Extension } from './domain/extension';

export const extensionMapper = {
  toDomain(node: Node): Extension {
    const props = node.properties as Record<string, unknown>;

    if (
      typeof props.id !== 'string' ||
      typeof props.url !== 'string' ||
      typeof props.value !== 'string'
    ) {
      throw new Error('Invalid Extension node');
    }

    return {
      id: props.id,
      url: props.url,
      key: typeof props.key === 'string' ? props.key : undefined,
      value: props.value,
    };
  },

  toPersistence(extension: Extension) {
    return {
      id: extension.id,
      url: extension.url,
      key: extension.key,
      value: extension.value,
    };
  },
};
