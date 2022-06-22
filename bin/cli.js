#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const tty = require('tty')
const util = require('util')
const nopt = require('nopt')
const {default: lint} = require('@commitlint/lint')
const {default: read} = require('@commitlint/read')
const {default: load} = require('@commitlint/load')
const {default: format} = require('@commitlint/format')
const {version} = require('../package.json')
const usage = fs.readFileSync(path.join(__dirname, './usage.txt'), 'utf8')

const log = util.debuglog('lint')
const HELP_URL = 'https://github.com/logdna/commitlint-config-mezmo'
const ROOT = path.join(__dirname, '..')
const CONFIG = path.join(ROOT, 'index.js')

const options = {
  pwd: path
, config: path
, to: String
, from: String
}

const shorthands = {
  h: ['--help']
, v: ['--version']
, p: ['--cwd']
, c: ['--config']
, t: ['--to']
, f: ['--from']
}

module.exports = main

if (module === require.main) {
  const input = nopt(options, shorthands, process.argv, 2)
  if (input.help) return console.log(usage.trim())
  if (input.version) return console.log(version.trim())

  main({
    pwd: process.cwd()
  , from: 'origin/main'
  , to: 'HEAD'
  , config: CONFIG
  , ...input
  }).then((out) => {
    process.exitCode = out.valid ? 0 : 1

    const formatted = format(out, {
      colors: tty.isatty(2)
    , helpUrl: HELP_URL
    })
    process.stderr.write(formatted)
  }).catch(handleCatch)
}

async function main(flags) {
  const pwd = path.resolve(process.cwd(), flags.pwd)
  log('Reading commits from %s', pwd)
  const {rules, ...opts} = toConfig(await load({'extends': flags.config}))
  const commits = await read({
    from: flags.from
  , to: flags.to
  , cwd: pwd
  })

  log('Linting %d commits', commits.length)
  const results = await Promise.all(
    commits
      .reduce((acc, commit) => {
        acc.push(lint(commit.trim(), rules, opts))
        return acc
      }, [])
  )

  return results.reduce((acc, linted) => {
    acc.valid = acc.valid && linted.valid
    acc.errorCount += linted.errors.length
    acc.warningCount += linted.warnings.length
    acc.results.push(linted)
    return acc
  }, {
    valid: true
  , errorCount: 0
  , warrningCount: 0
  , results: []
  })
}

function toConfig(loaded) {
  const {rules, ...opts} = loaded
  return {
    parserOpts: opts.parserPreset.parserOpts
  , rules
  , ...opts
  }
}

/* istanbul ignore next */
function handleCatch(err) {
  process.nextTick(() => {
    throw err
  })
}
