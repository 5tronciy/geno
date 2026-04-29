import { Node } from 'neo4j-driver';
import { SourceBase } from './domain/source';

export const sourceMapper = {
  toDomain(node: Node): SourceBase {
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

  toPersistence(source: SourceBase) {
    return {
      id: source.id,
      title: source.title,
      citation: source.citation ?? null,
    };
  },
};
