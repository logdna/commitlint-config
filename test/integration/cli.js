'use strict'

const crypto = require('crypto')
const os = require('os')
const fs = require('fs')
const path = require('path')
const util = require('util')
const execa = require('execa')
const rimraf = util.promisify(require('rimraf'))
const {test, threw} = require('tap')
const ROOT = path.join(__dirname, '..', '..')
const BIN = path.join(ROOT, 'bin')
const usage = fs.readFileSync(path.join(BIN, 'usage.txt'), 'utf8')
const cli = path.join(BIN, 'cli.js')

const {mkdtemp} = fs.promises

const COMMIT_ERROR = `
feat: This commit is Invalid because there is no body
`.trim()

const COMMIT_PASS = `
feat: This commit is valid

It has a body, and a reference

Fixes: #2
`.trim()

function mktmp() {
  return mkdtemp(path.join(os.tmpdir(), 'commitlint-'))
}

async function init(cwd) {
  await execa('git', ['config', '--global', 'init.defaultBranch', 'main'], {cwd})
  await execa('git', ['init'], {cwd})
  await execa('touch', ['README.md'], {cwd})
  await execa('git', ['add', 'README.md'], {cwd})
  await execa('git', ['commit', '-m', 'initial commit'], {cwd})
}

async function commit(file, content, msg, cwd) {
  await fs.promises.appendFile(path.join(cwd, file), content)
  await execa('git', ['add', file], {cwd})
  await execa('git', ['commit', '-m', msg], {cwd})
}

async function branch(cwd, error = true) {
  const branch_name = crypto.randomBytes(5).toString('hex')
  const commit = error ? COMMIT_ERROR : COMMIT_PASS
  await execa('git', ['checkout', '-b', branch_name], {cwd})
  await execa('touch', [branch_name], {cwd})
  await execa('git', ['add', branch_name], {cwd})
  await execa('git', ['commit', '-m', commit], {cwd})
  return branch_name
}

test('cli', async (t) => {
  t.test('exports', async (t) => {
    const exported = require(cli)
    t.type(exported, 'function', 'main function exported')
  })
  t.test('--help', async (t) => {
    const {stdout} = await execa(cli, ['--help'])
    t.equal(stdout, usage.trim(), 'output from --help')
  })

  t.test('--version', async (t) => {
    const {stdout} = await execa(cli, ['--version'])
    const {version} = require(path.join(ROOT, 'package.json'))
    t.equal(stdout, version, 'output from --version')
  })

  t.test('failed lint', async (t) => {
    const cwd = await mktmp()
    t.teardown(async () => {
      await rimraf(cwd)
    })

    await init(cwd)
    await branch(cwd, true)

    const {stderr, exitCode} = await execa.node(cli, ['-f', 'main'], {
      cwd
    }).catch((out) => {
      return out
    })

    t.equal(exitCode, 1, 'exit code')
    t.match(stderr, /body may not be empty/gi, 'missing body error')
    t.match(stderr, /footer may not be empty/gi, 'missing footer error')
    t.match(stderr, /references may not be empty/gi, 'missing referror')
    t.match(stderr, /found 3 problems, 0 warnings/, 'Error and warning count are correct')
  })

  t.test('failed lint - arbitrary location', async (t) => {
    const cwd = await mktmp()
    t.teardown(async () => {
      await rimraf(cwd)
    })

    await init(cwd)
    await branch(cwd, true)
    await commit('README.md', '## Test', COMMIT_PASS, cwd)

    const {stderr, exitCode} = await execa.node(cli, [
      '-f', 'main', '--pwd', cwd
    ]).catch((out) => {
      return out
    })
    t.equal(exitCode, 1, 'exit code')
    t.match(stderr, /body may not be empty/gi, 'missing body error')
    t.match(stderr, /footer may not be empty/gi, 'missing footer error')
    t.match(stderr, /references may not be empty/gi, 'missing referror')
    t.match(stderr, /found 3 problems, 0 warnings/, 'Error and warning count are correct')
  })

  t.test('successful lint', async (t) => {
    const cwd = await mktmp()
    t.teardown(async () => {
      await rimraf(cwd)
    })

    await init(cwd)
    await branch(cwd, false)

    await execa.node(cli, ['-f', 'main'], {cwd}).catch((out) => {
      t.equal(out.exitCode, 0, 'exit code')
    })
  })
}).catch(threw)
