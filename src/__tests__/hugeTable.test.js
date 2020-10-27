import fs from 'fs';
import { join } from 'path';

import { pzfxParser } from '..';

/*
  Test files from
  https://github.com/cran/pzfx/tree/master/inst/testdata
  */

const readFileSync = fs.readFileSync;
const pathFiles = join(__dirname, '/../../data/');
const data = readFileSync(join(pathFiles, 'hugetable.pzfx'));
const parsedFile = pzfxParser(data);

describe('test myModule', () => {
  it('Check information', () => {
    const parsedFile = pzfxParser(data);
    const information = parsedFile.information;

    expect(information.ExperimentDate).toStrictEqual('2018-10-16');
    expect(information.ExperimentID).toStrictEqual('');
    expect(information.Experimenter).toStrictEqual('');
    expect(information.NotebookID).toStrictEqual('');
    expect(information.Project).toStrictEqual('');
    expect(information.Protocol).toStrictEqual('');
    expect(information.notes).toStrictEqual('');
  });

  it('Check table', () => {
    const hugeTable = parsedFile.hugeTable;
    const table = parsedFile.table;
    expect(hugeTable[0].title).toStrictEqual('Data 1');
    expect(table).toHaveLength(0);
    expect(hugeTable[0].y).toHaveLength(1);
    expect(hugeTable[0].y[0].label).toStrictEqual('Y');
    expect(hugeTable[0].y[0].data).toHaveLength(53);
    expect(hugeTable[0].y[0].data[0]).toStrictEqual([1, 2, 3]);
  });
});
