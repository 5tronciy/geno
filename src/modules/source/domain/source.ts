import { Extension } from 'src/modules/extension/domain/extension';

export interface SourceBase {
  id: string;
  title: string;
  citation?: string;
}

export interface Source extends SourceBase {
  extensions: Extension[];
}
