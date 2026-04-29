import { Node } from 'neo4j-driver';
import { EventBase } from './domain/event';
import { isStringArray } from 'src/utils/isStringArray';

export const eventMapper = {
  toDomain(node: Node): EventBase {
    const props = node.properties as Record<string, unknown>;

    if (typeof props.id !== 'string' || typeof props.type !== 'string') {
      throw new Error('Invalid Event node shape');
    }

    return {
      id: props.id,
      type: props.type,
      date: typeof props.date === 'string' ? props.date : undefined,
      placeId: typeof props.placeId === 'string' ? props.placeId : undefined,
      participants: isStringArray(props.participants) ? props.participants : [],
      sourceIds: isStringArray(props.sourceIds) ? props.sourceIds : [],
    };
  },

  toPersistence(event: EventBase) {
    return {
      id: event.id,
      type: event.type,
      date: event.date ?? null,
      placeId: event.placeId ?? null,
      participants: event.participants,
      sourceIds: event.sourceIds ?? [],
    };
  },
};
