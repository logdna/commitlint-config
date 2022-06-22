'use strict'

module.exports = [
  require('./versioner.js')
, require('./semantic-release.js')
, require('./dependabot.js')
, require('./doc-only.js')
, require('./minor-chore-deps.js')
, require('./renovate-init.js')
, require('./snyk.js')
, require('./wip.js')
]
