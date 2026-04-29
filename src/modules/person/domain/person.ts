import { Extension } from 'src/modules/extension/domain/extension';

export interface PersonBase {
  id: string;
  names: string[];
  gender?: string;
  familyIds?: string[];
  eventIds?: string[];
}

export interface Person extends PersonBase {
  extensions: Extension[];
}
