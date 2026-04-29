export interface Family {
  id: string;
  parents: string[];
  children: string[];
  eventIds?: string[]; // marriage, divorce
}
