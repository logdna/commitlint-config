'use strict'

const VERSION_COMMIT_REGEX = new RegExp(
  '^\\d{4}-\\d{2}-\\d{2}, version \\d{1,4}\\.\\d{1,4}\\.\\d{1,4} \\(stable\\) release$'
, 'i'
)

module.exports = ignoreVersionerCommit

function ignoreVersionerCommit(commit) {
  const [header] = commit.split('\n')
  return VERSION_COMMIT_REGEX.test(header)
}
