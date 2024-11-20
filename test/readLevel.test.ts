import { readLevel } from "../src/util/readLevel";

describe('readLevel', () => {

  beforeEach(() => {
    process.env.AOC_SESSION = "123";
    jest.spyOn(Date.prototype, 'getFullYear').mockReturnValue(2000);
    jest.spyOn(require('fs'), 'mkdirSync').mockImplementation(() => { });
    jest.spyOn(require('fs'), 'writeFileSync').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should read the input for the current year by default', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => ({
      status: 200,
      text: () => Promise.resolve('1\n2\n3')
    } as any));

    await readLevel({
      level: 1,
      parser: (input) => input
    });

    expect(fetchSpy).toHaveBeenCalledWith('https://adventofcode.com/2000/day/1/input', {
      headers: {
        cookie: 'session=123'
      }
    });
  });

  it('Should read the input for the provided year', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => ({
      status: 200,
      text: () => Promise.resolve('1\n2\n3')
    } as any));

    await readLevel({
      level: 1,
      year: 2047,
      parser: (input) => input
    });

    expect(fetchSpy).toHaveBeenCalledWith('https://adventofcode.com/2047/day/1/input', {
      headers: {
        cookie: 'session=123'
      }
    });
  });

  it('Should read the input for the provided level', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => ({
      status: 200,
      text: () => Promise.resolve('1\n2\n3')
    } as any));

    await readLevel({
      level: 19,
      parser: (input) => input
    });

    expect(fetchSpy).toHaveBeenCalledWith('https://adventofcode.com/2000/day/19/input', {
      headers: {
        cookie: 'session=123'
      }
    });
  });

  it('Should read the input for the provided level and year', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => ({
      status: 200,
      text: () => Promise.resolve('1\n2\n3')
    } as any));

    await readLevel({
      level: 14,
      year: 2039,
      parser: (input) => input
    });

    expect(fetchSpy).toHaveBeenCalledWith('https://adventofcode.com/2039/day/14/input', {
      headers: {
        cookie: 'session=123'
      }
    });
  });

  it('Should throw an error if the AOC_SESSION environment variable is not set', async () => {
    delete process.env.AOC_SESSION;
    await expect(
      readLevel({
        level: 1,
        parser: (input) => input
      })
    ).rejects.toThrow('AOC_SESSION environment variable not set');
    process.env.AOC_SESSION = "123";
  });

  it('Should throw an error if the input is not found', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => ({
      status: 404
    } as any));

    await expect(
      readLevel({
        level: 1,
        parser: (input) => input
      })
    ).rejects.toThrow('AOC Level input not found');
  });

  it('Should use the provided splitter', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => ({
      status: 200,
      text: () => Promise.resolve('1.2.3')
    } as any));

    const result = await readLevel({
      level: 1,
      parser: (input) => input,
      splitter: /\./
    });

    expect(result).toEqual(['1', '2', '3']);
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('Should use the provided parser', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => ({
      status: 200,
      text: () => Promise.resolve('1\n2\n3')
    } as any));

    const result = await readLevel({
      level: 1,
      parser: (input) => input.join('')
    });

    expect(result).toEqual('123');
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('Should use the default splitter if not provided', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => ({
      status: 200,
      text: () => Promise.resolve('1\n2\n3')
    } as any));

    const result = await readLevel({
      level: 1,
      parser: (input) => input
    });

    expect(result).toEqual(['1', '2', '3']);
    expect(fetchSpy).toHaveBeenCalled
  });

  it('Should create a cache dir if it does not exist', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => ({
      status: 200,
      text: () => Promise.resolve('1\n2\n3')
    } as any));

    jest.spyOn(require('fs'), 'existsSync').mockReturnValue(false);
    const mkdirSpy = jest.spyOn(require('fs'), 'mkdirSync').mockImplementation(() => { });

    await readLevel({
      level: 1,
      parser: (input) => input
    });

    expect(mkdirSpy).toHaveBeenCalledWith('./aoc-cache');
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('Should persist the fetch response in cache', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => ({
      status: 200,
      text: () => Promise.resolve('1\n2\n3')
    } as any));

    const writeSpy = jest.spyOn(require('fs'), 'writeFileSync').mockImplementation(() => { });

    await readLevel({
      level: 1,
      parser: (input) => input
    });

    expect(writeSpy).toHaveBeenCalledWith('./aoc-cache/adventofcodecom2000day1input', '1\n2\n3');
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('Should read the input from cache if it exists', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => ({
      status: 200,
      text: () => Promise.resolve('1\n2\n3')
    } as any));

    jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
    jest.spyOn(require('fs'), 'readFileSync').mockReturnValue('1\n2\n3');

    const writeSpy = jest.spyOn(require('fs'), 'writeFileSync').mockImplementation(() => { });

    await readLevel({
      level: 1,
      parser: (input) => input
    });

    expect(writeSpy).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});