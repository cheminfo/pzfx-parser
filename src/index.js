import { parse } from 'fast-xml-parser';

/**
 * Returns a JSON with data about project information and tables from PZFX files.
 * @param {String} pzfx - File with the PZFX data.
 * @return {Object} [Object.information] Metadata of the experiment.
 * @return {Array} [Object.table] Table data from file.
 * @return {Array} [Object.hugeTable] Huge table data from file.
 */

export function pzfxParser(pzfx) {
  pzfx = ensureText(pzfx);

  if (typeof pzfx !== 'string') throw new TypeError('pzfx must be a string');

  const parsed = parse(pzfx, {
    textNodeName: '_data',
    attributeNamePrefix: '',
    parseAttributeValue: true,
    attrNodeName: '_attr',
    ignoreAttributes: false,
  });

  const table = parseTable(parsed.GraphPadPrismFile.Table);
  const hugeTable = parseTable(parsed.GraphPadPrismFile.HugeTable);
  const constant = parsed.GraphPadPrismFile.Info.Constant;
  let information = {};
  for (let i = 0; i < constant.length; i++) {
    information[constant[i].Name.replace(/ /g, '')] = constant[i].Value;
  }
  information.notes = checkLabel(parsed.GraphPadPrismFile.Info.Notes);

  return {
    parsed: parsed,
    information: information,
    table: table,
    hugeTable: hugeTable,
  };
}

function parseTable(table) {
  let dataTable = [];
  if (!table) return dataTable;
  if (Array.isArray(table)) {
    for (let i = 0; i < table.length; i++) {
      let element = Object.assign(table[i]._attr, {
        title: table[i].Title,
      });
      if (table[0].XColumn) {
        element.x = {
          label: checkLabel(table[i].XColumn.Title),
          data: table[i].XColumn.Subcolumn.d,
        };
      }
      let y = [];
      if (Array.isArray(table[i].YColumn)) {
        for (let j = 0; j < table[i].YColumn.length; j++) {
          y.push({
            label: checkLabel(table[i].YColumn[j].Title),
            data: Array.isArray(table[i].YColumn[j].Subcolumn)
              ? table[i].YColumn[j].Subcolumn.map((x) => x.d)
              : table[i].YColumn[j].Subcolumn.d,
          });
        }
        element.y = y;
      } else {
        y.push({
          label: checkLabel(table[i].YColumn.Title),
          data: Array.isArray(table[i].YColumn.Subcolumn)
            ? table[i].YColumn.Subcolumn.map((x) => x.d)
            : table[i].YColumn.Subcolumn.d,
        });
        element.y = y;
      }
      dataTable.push(element);
    }
  } else {
    let element = Object.assign(table._attr, {
      title: table.Title,
    });
    if (table.XColumn) {
      element.x = {
        label: checkLabel(table.XColumn.Title),
        data: table.XColumn.Subcolumn.d,
      };
    }
    let y = [];
    if (Array.isArray(table.YColumn)) {
      for (let j = 0; j < table.YColumn.length; j++) {
        y.push({
          label: checkLabel(table.YColumn[j].Title),
          data: Array.isArray(table.YColumn[j].Subcolumn)
            ? table.YColumn[j].Subcolumn.map((x) => x.d)
            : table.YColumn[j].Subcolumn.d,
        });
      }
    } else {
      y.push({
        label: checkLabel(table.YColumn.Title),
        data: Array.isArray(table.YColumn.Subcolumn)
          ? table.YColumn.Subcolumn.map((x) => x.d)
          : table.YColumn.Subcolumn.d,
      });
    }

    element.y = y;
    dataTable.push(element);
  }

  return dataTable;
}

function checkLabel(input) {
  let result;
  if (typeof input === 'object') {
    let entries = Object.entries(input)[0];
    result = entries.filter((item) => item._data)[0]._data;
  } else {
    return input;
  }
  return result;
}

/*
  https://github.com/cheminfo/mzData/blob/master/src/util/ensureText.js
  */
export function ensureText(data, options = {}) {
  const { encoding = 'utf8' } = options;
  if (typeof Buffer !== 'undefined' && data instanceof Buffer) {
    return data.toString(encoding);
  }
  if (typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer) {
    return new TextDecoder(encoding).decode(data);
  }
  return data;
}
