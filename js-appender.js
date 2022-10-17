/**
 * Appends ".js" to module imports that do not end with ".js".
 * 
 * Reformatted & inspired from the following script
 * https://github.com/microsoft/TypeScript/issues/16577#issuecomment-310426634
 * by https://github.com/quantuminformation
 * 
 * Author: Artur Madjidov
 * License: MIT
 */
"use strict";

const fs = require('fs');
const path = require('path');
const { argv } = require('process');

if (!argv[2]) throw new Error('No directory or file given');

let givenPath = path.resolve(argv[2]);
let fielPaths = [];
let fileStats = fs.lstatSync(givenPath);
if (fileStats.isFile())
  fielPaths.push(givenPath);
else if (fileStats.isDirectory())
  fielPaths = fs.readdirSync(givenPath).map(s => path.resolve(givenPath, s));
else
  throw new Error('Unsupported file type');

fielPaths.forEach((filepath) => {
  fs.readFile(filepath, 'utf8', (err, data) => {
    if (err) throw err;
    if (!data.match(/import .* from\s+['"]\.\//g)) return;

    let newData = data.replace(
      /(import .* from\s+['"])([^'"]*)(?<!\.js)(?=['"])/g, '$1$2.js');

    console.log(`Appending '.js' extensions to imports inside of ${filepath}`);
    fs.writeFile(filepath, newData, function (err) {
      if (err) throw err;
      console.log(`Appended '.js' extensions to imports inside of  ${filepath}`);
    });
  })
})