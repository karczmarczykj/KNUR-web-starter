import { PathLike } from 'fs';

export type BuildType = 'development' | 'production' | 'test';

export interface FrontendParams {
  component: string;
  entry: PathLike;
  buildType: BuildType;
}

