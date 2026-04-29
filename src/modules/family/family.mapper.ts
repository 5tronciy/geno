import { Node } from 'neo4j-driver';
import { isStringArray } from 'src/utils/isStringArray';
import { FamilyBase } from './domain/family';

export const familyMapper = {
  toDomain(node: Node): FamilyBase {
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
      parents: props.parents,
      children: props.children,
      eventIds: isStringArray(props.eventIds) ? props.eventIds : [],
    };
  },

  toPersistence(family: FamilyBase) {
    return {
      id: family.id,
      parents: family.parents,
      children: family.children,
      eventIds: family.eventIds ?? [],
    };
  },
};
