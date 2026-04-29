import { Extension } from 'src/modules/extension/domain/extension';

export interface EventBase {
  id: string;
  type: string; // birth, death, marriage, custom
  date?: string;
  placeId?: string;
  participants: string[];
  sourceIds?: string[];
}

export interface Event extends EventBase {
  extensions: Extension[];
}

export interface Citation {
  sourceId: string;
  page?: string;
  text?: string;
}
