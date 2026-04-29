import { Node } from 'neo4j-driver';
import { PersonBase } from './domain/person';
import { isStringArray } from 'src/utils/isStringArray';

export const personMapper = {
  toDomain(node: Node): PersonBase {
    const props = node.properties as Record<string, unknown>;

    if (typeof props.id !== 'string') {
      throw new Error('Invalid Person node shape');
    }

    return {
      id: props.id,
      names: isStringArray(props.names) ? props.names : [],
      gender: typeof props.gender === 'string' ? props.gender : undefined,
    };
  },

  toPersistence(person: PersonBase) {
    return {
      id: person.id,
      names: person.names,
      gender: person.gender ?? null,
    };
  },
};
