declare module 'csv-parse/sync' {
  export interface ParseOptions {
    columns?: boolean | string[];
    skip_empty_lines?: boolean;
    trim?: boolean;
  }
  export function parse<
    TRecord extends Record<string, string> = Record<string, string>,
  >(input: string, options?: ParseOptions): TRecord[];
}
