import { readFileSync, existsSync } from 'fs';

export type ParseFunction<T> = (input: string[]) => T;

interface ReaderOptions<T> {
  path?: string;
  splitter?: RegExp;
  parser: ParseFunction<T>;
};

export const readAs = <T>(options: ReaderOptions<T>): T => {
  const fileExists = existsSync(options.path || './input');
  if (fileExists) {
    const fileContent = readFileSync(options.path || "./input", 'utf-8');
    const splittedContent = fileContent.split(options.splitter || /\n/);
    return options.parser(splittedContent);
  } else {
    throw new Error('File does not exists');
  }
};