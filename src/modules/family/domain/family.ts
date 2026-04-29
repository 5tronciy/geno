import { Extension } from 'src/modules/extension/domain/extension';

export interface FamilyBase {
  id: string;
  parents: string[];
  children: string[];
  eventIds?: string[];
}

export interface Family extends FamilyBase {
  extensions: Extension[];
}
