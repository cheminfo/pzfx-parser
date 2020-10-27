import fs from 'fs';
import { join } from 'path';

import { pzfxParser } from '..';

/*
  Test files from
  https://github.com/cran/pzfx/tree/master/inst/testdata
  */

const readFileSync = fs.readFileSync;
const pathFiles = join(__dirname, '/../../data/');

describe('test myModule', () => {
  const data = readFileSync(join(pathFiles, 'table.pzfx'));
  it('Check information', () => {
    const parsedFile = pzfxParser(data);
    const information = parsedFile.information;
    expect(information.ExperimentDate).toStrictEqual('2018-07-30');
    expect(information.ExperimentID).toStrictEqual(1234);
    expect(information.Experimenter).toStrictEqual('hello world');
    expect(information.NotebookID).toStrictEqual(5678);
    expect(information.Project).toStrictEqual('test');
    expect(information.Protocol).toStrictEqual('none');
    expect(information.notes).toStrictEqual('New file');
  });

  it('Check table', () => {
    const parsedFile = pzfxParser(data);
    const table = parsedFile.table;
    const hugeTable = parsedFile.hugeTable;
    expect(hugeTable).toHaveLength(0);
    expect(table[0].title).toStrictEqual('Data 1');
    expect(table[0].y).toHaveLength(2);
    expect(table[0].y[0].label).toStrictEqual('A');
    expect(table[0].y[1].label).toStrictEqual('B');
    expect(table[0].y[0].data).toHaveLength(3);
    expect(table[0].y[0].data[0]).toStrictEqual([100, 110, 120]);
    expect(table[0].y[1].data[0]).toStrictEqual([10, 20, 30]);
  });
});
