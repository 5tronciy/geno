import { Node } from 'neo4j-driver';
import { isStringArray } from 'src/utils/isStringArray';
import { Family } from './domain/family';

export const familyMapper = {
  toDomain(node: Node): Family {
    const props = node.properties as Record<string, unknown>;

    if (
      typeof props.id !== 'string' ||
      !isStringArray(props.parents) ||
      !isStringArray(props.children)
    ) {
      throw new Error('Invalid Family node shape');
    }

    return {
      id: props.id,
      parents: isStringArray(props.parents) ? props.parents : [],
      children: isStringArray(props.children) ? props.parents : [],
    };
  },

  toPersistence(family: Family) {
    return {
      id: family.id,
      parents: family.parents,
      children: family.children,
    };
  },
};
