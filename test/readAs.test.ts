import { readAs } from "../src";
import * as fs from 'fs';

jest.mock('fs');

describe('readAs', () => {

  it('Should throw error if file does not exists', () => {
    expect(
      () => readAs({ parser: (input: string[]) => input })
    ).toThrow('File does not exists');
  });

  it('Should read file with default path', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
    expect(
      () => readAs({ parser: (input: string[]) => input })
    ).toThrow('File does not exists');
    expect(fs.existsSync).toHaveBeenCalledWith('./input');
  });

  it('Should read file with custom path', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
    expect(
      () => readAs({ path: './custom/path/123', parser: (input: string[]) => input })
    ).toThrow('File does not exists');
    expect(fs.existsSync).toHaveBeenCalledWith('./custom/path/123');
  });

  it('Should read file with custom splitter', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => 'line1.line2.line3');
    expect(
      readAs({ splitter: /\./, parser: (input: string[]) => input })
    ).toEqual(['line1', 'line2', 'line3']);
    expect(fs.readFileSync).toHaveBeenCalledWith('./input', 'utf-8');
  });

  it('Should read file with custom parser', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => 'line1\nline2\nline3');
    expect(
      readAs({ parser: (input: string[]) => input.join('') })
    ).toEqual('line1line2line3');
    expect(fs.readFileSync).toHaveBeenCalledWith('./input', 'utf-8');
  });

  it('Should read file with custom path, splitter and parser', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => 'line1.line2.line3');
    expect(
      readAs({ path: './custom/path/123', splitter: /\./, parser: (input: string[]) => input })
    ).toEqual(['line1', 'line2', 'line3']);
    expect(fs.readFileSync).toHaveBeenCalledWith('./custom/path/123', 'utf-8');
  });

  it('Should read file with custom path and splitter', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => 'line1.line2.line3');
    expect(
      readAs({ path: './custom/path/123', splitter: /\./, parser: (input: string[]) => input })
    ).toEqual(['line1', 'line2', 'line3']);
    expect(fs.readFileSync).toHaveBeenCalledWith('./custom/path/123', 'utf-8');
  });

  it('Should read file with custom path and parser', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => 'line1\nline2\nline3');
    expect(
      readAs({ path: './custom/path/123', parser: (input: string[]) => input.join('') })
    ).toEqual('line1line2line3');
    expect(fs.readFileSync).toHaveBeenCalledWith('./custom/path/123', 'utf-8');
  });

  it('Should read file with custom splitter and parser', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => 'line1.line2.line3');
    expect(
      readAs({ splitter: /\./, parser: (input: string[]) => input.join('') })
    ).toEqual('line1line2line3');
    expect(fs.readFileSync).toHaveBeenCalledWith('./input', 'utf-8');
  });

});