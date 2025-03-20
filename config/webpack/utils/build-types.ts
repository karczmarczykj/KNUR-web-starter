import { PathLike } from 'fs';

export type BuildType = 'development' | 'production' | 'test';

export interface FrontendParams {
  service: string;
  entry: PathLike;
  buildType: BuildType;
}

export interface ComponentsInterface {
  backend: string[];
  frontend: string[];
};

