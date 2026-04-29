import { Node } from 'neo4j-driver';
import { Source } from './domain/source';

export const sourceMapper = {
  toDomain(node: Node): Source {
    const props = node.properties as Record<string, unknown>;

    if (typeof props.id !== 'string' || typeof props.title !== 'string') {
      throw new Error('Invalid Source node shape');
    }

    return {
      id: props.id,
      title: props.title,
      citation: typeof props.citation === 'string' ? props.citation : undefined,
    };
  },

  toPersistence(source: Source) {
    return {
      id: source.id,
      title: source.title,
      citation: source.citation ?? null,
    };
  },
};
