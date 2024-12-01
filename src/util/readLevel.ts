import * as fs from 'fs';
import { ReaderOptions } from "./readAs";

type ReadLevelOptions<T> = Omit<ReaderOptions<T>, 'path'> & {
  level: number;
  year?: number;
};

const buildURL = (level: number, year?: number) => {
  const urlYear = year || new Date().getFullYear();
  return `https://adventofcode.com/${urlYear}/day/${level}/input`;
};

const readEnvSession = () => {
  const session = process.env.AOC_SESSION;
  if (!session) {
    throw new Error('AOC_SESSION environment variable not set');
  }
  return session;
};

const urlToFileName = (url: string): string => url.replace(/[\/|\:|.]/g, '').slice(5);

const assertCacheDirExists = () => {
  if (!fs.existsSync('./aoc-cache')) {
    fs.mkdirSync('./aoc-cache');
  }
};

const cacheExists = (url: string): boolean => {
  const fileName = urlToFileName(url);
  assertCacheDirExists();
  return fs.existsSync(`./aoc-cache/${fileName}`);
};

const readCache = (url: string): string => {
  const fileName = urlToFileName(url);
  return fs.readFileSync(`./aoc-cache/${fileName}`, 'utf-8');
};

const saveCache = (url: string, content: string) => {
  const fileName = urlToFileName(url);
  assertCacheDirExists();
  fs.writeFileSync(`./aoc-cache/${fileName}`, content);
};

/**
 * By default reads the input for the current year
 */
export const readLevel = async <T>({
  level,
  year,
  splitter,
  parser
}: ReadLevelOptions<T>) => {
  let responseText: string = "";
  const url = buildURL(level, year);

  if (cacheExists(url)) {
    responseText = readCache(url);
  } else {
    const session = readEnvSession();
    const response = await fetch(url, {
      headers: {
        cookie: `session=${session}`
      }
    });

    if (response.status === 404) {
      throw new Error('AOC Level input not found');
    }

    responseText = await response.text();
    saveCache(url, responseText);
  }

  const splittedContent = responseText.split(splitter || /\n/);
  return parser(splittedContent);
};