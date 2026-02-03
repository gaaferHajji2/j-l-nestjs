export interface PopulateOptions {
  path: string;
  select?: string;
  model?: string;
  populate?: PopulateOptions | PopulateOptions[];
}
