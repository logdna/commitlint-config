'use strict'

const RENOVATE_INIT_REGEX = /^add renovate\.json(?:5)?$/i

module.exports = ignoreRenovateInit

function ignoreRenovateInit(commit) {
  return RENOVATE_INIT_REGEX.test(commit.trim())
}
