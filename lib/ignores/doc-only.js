'use strict'

const DOC_ONLY_REGEX = /^doc\(wiki\)/

module.exports = ignoreDocCommit

function ignoreDocCommit(commit) {
  const [header] = commit.split('\n')
  return DOC_ONLY_REGEX.test(header)
}
