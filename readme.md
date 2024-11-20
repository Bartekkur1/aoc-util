# aoc-util

`aoc-util` is a TypeScript utility library designed to help with reading input files for Advent of Code challenges. It provides functions to read input from local files or fetch input from the Advent of Code website, with support for caching.

## Installation

To install the package, use npm:

```sh
npm install aoc-util
```

## Functions

###

readAs

Reads input from a local file and processes it using a custom parser.

#### Parameters

- options (object):

- path (string, optional): The path to the input file. Defaults to `./input`.

- splitter (RegExp, optional): A regular expression to split the file content. Defaults to `/\n/`.

- parser (function): A function to process the split content. It takes an array of strings as input and returns the processed result.

#### Example

```ts
import { readAs } from "aoc-util";

const result = readAs({
  path: "./custom/path/123",
  splitter: /\./,
  parser: (input) => input.join(""),
});

console.log(result); // Output: 'line1line2line3'
```

###

readLevel

Fetches input for a specific level and year from the Advent of Code website, with support for caching.

#### Parameters

- options (object):

- level (number): The level (day) of the challenge.

- year (number, optional): The year of the challenge. Defaults to the current year.

- splitter (RegExp, optional): A regular expression to split the fetched content. Defaults to `/\n/`.

- parser (function): A function to process the split content. It takes an array of strings as input and returns the processed result.

#### Example

```ts
import { readLevel } from "aoc-util";

const result = await readLevel({
  level: 1,
  year: 2021,
  parser: (input) => input.join(""),
});

console.log(result); // Output: '123'
```

## Environment Variables

- AOC_SESSION: The session cookie for accessing the Advent of Code website. This environment variable must be set to fetch input from the website.

It can be found inside website requests to AoC page, I have not found yet any other way to acquire this.
Its also important that you only paste in the session value:


If you have session=123

Don't do this ❌
export AOC_SESSION=session=123

Do this ✅
export AOC_SESSION=123


Best way to approach this I think will be just adding dotenv into your project and holding session in there.

## Testing

To run the tests, use the following command:

```sh
npm test
```
