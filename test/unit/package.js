'use strict'

const {test, threw} = require('tap')
const fixtures = require('../fixtures/commits/index.js')
const {testCommit} = require('../common/bootstrap.js')

test('package', async (t) => {
  t.test('valid cases', async (t) => {
    for (const [name, commit] of Object.entries(fixtures.valid)) {
      testCommit(t, {
        commit
      , report: {
          valid: true
        , errors: []
        , warnings: []
        }
      }, name)
    }
  })

  t.test('error cases', async (t) => {
    testCommit(t, {
      commit: fixtures.error['missing-body']
    , report: {
        valid: false
      , errors: [{
          level: 2
        , valid: false
        , name: 'body-empty'
        , message: 'body may not be empty'
        }]
      , warnings: []
      }
    })

    testCommit(t, {
      commit: fixtures.error['invalid-fixes-ref']
    , report: {
        valid: false
      , errors: [
          {
            level: 2
          , valid: false
          , name: 'footer-empty'
          , message: 'footer may not be empty'
          }
        , {
            level: 2
          , valid: false
          , name: 'references-empty'
          , message: 'references may not be empty'
          }
        ]
      , warnings: []
      }
    })

    testCommit(t, {
      commit: fixtures.error['missing-issue-ref']
    , report: {
        valid: false
      , errors: [
          {
            level: 2
          , valid: false
          , name: 'references-empty'
          , message: 'references may not be empty'
          }
        ]
      , warnings: []
      }
    })

    testCommit(t, {
      commit: fixtures.error['missing-footer']
    , report: {
        valid: false
      , errors: [
          {
            level: 2
          , valid: false
          , name: 'footer-empty'
          , message: 'footer may not be empty'
          }
        , {
            level: 2
          , valid: false
          , name: 'references-empty'
          , message: 'references may not be empty'
          }
        ]
      , warnings: []
      }
    })

    testCommit(t, {
      commit: fixtures.error['deps-breaking']
    , report: {
        valid: false
      , errors: [
          {
            level: 2
          , valid: false
          , name: 'references-empty'
          , message: 'references may not be empty'
          }
        ]
      , warnings: []
      }
    })
  })

}).catch(threw)
