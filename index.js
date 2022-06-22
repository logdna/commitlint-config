'use strict'

module.exports = {
  parserPreset: {
    parserOpts: {
      commentChar: '#'
    , breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/
    , headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/
    , headerCorrespondence: ['type', 'scope', 'subject']
    , issuePrefixes: ['#']
    , referenceActions: [
        'close'
      , 'closes'
      , 'closed'
      , 'fix'
      , 'fixes'
      , 'fixed'
      , 'resolve'
      , 'resolves'
      , 'resolved'
      ]
    }
  }
, ignores: require('./lib/ignores/index.js')
, rules: {
    'body-empty': [2, 'never']
  , 'body-leading-blank': [2, 'always']
  , 'body-max-line-length': [2, 'always', 72]
  , 'body-min-length': [2, 'always', 20]
  , 'footer-empty': [2, 'never']
  , 'footer-leading-blank': [1, 'always']
  , 'footer-max-line-length': [2, 'always', 72]
  , 'header-max-length': [2, 'always', 72]
  , 'references-empty': [2, 'never']
  , 'scope-case': [2, 'always', 'lower-case']
  , 'subject-case': [2, 'always', [
      'sentence-case'
    , 'start-case'
    , 'lower-case'
    ]]
  , 'subject-empty': [2, 'never']
  , 'subject-full-stop': [2, 'never', '.']
  , 'type-case': [2, 'always', 'lower-case']
  , 'type-empty': [2, 'never']
  , 'type-enum': [2, 'always', [
      'build', 'ci', 'chore', 'doc', 'feat', 'fix'
    , 'lib', 'perf', 'refactor', 'style', 'test'
    ]]
  }
}
