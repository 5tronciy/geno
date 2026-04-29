export interface Event {
  id: string;
  type: string; // birth, death, marriage, custom
  date?: string;
  placeId?: string;
  participants: string[];
  citations?: Citation[];
  sourceIds?: string[];
}

export interface Citation {
  sourceId: string;
  page?: string;
  text?: string;
}
