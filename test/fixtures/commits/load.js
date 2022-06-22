'use strict'

const path = require('path')
const fs = require('fs')
const glob = require('glob')

module.exports = function loadFiles(dir) {
  return glob.sync('**/*.txt', {
    cwd: dir
  })
    .reduce((acc, filename) => {
      const {name} = path.parse(filename)
      acc[name] = fs.readFileSync(path.join(dir, filename), 'utf8')
      return acc
    }, {})
}
