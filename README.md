# pzfx-parser

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

Returns a JSON with data about project information and tables from PZFX files.

Note: This package does not return information about graphs, layouts or results parts of the file


## Installation

`$ npm i pzfx-parser`

## Usage

```js
import { readFileSync } from 'fs';

import { pzfxParser } from 'fcs-parser';

const buffer = readFileSync('pathToFile');
let parsed = pzfxParser(buffer);

console.log(parsed);
```

## [API Documentation](https://cheminfo.github.io/pzfx-parser/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/pzfx-parser.svg
[npm-url]: https://www.npmjs.com/package/pzfx-parser
[ci-image]: https://github.com/cheminfo/pzfx-parser/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/cheminfo/pzfx-parser/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/pzfx-parser.svg
[codecov-url]: https://codecov.io/gh/cheminfo/pzfx-parser
[download-image]: https://img.shields.io/npm/dm/pzfx-parser.svg
[download-url]: https://www.npmjs.com/package/pzfx-parser
