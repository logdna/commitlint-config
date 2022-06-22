'use strict'

const RELEASE_COMMIT_REGEX = /^release:/

module.exports = ignoreReleaseCommit

function ignoreReleaseCommit(commit) {
  const [header] = commit.split('\n')
  return RELEASE_COMMIT_REGEX.test(header)
}
