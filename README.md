## commitlint-config-mezmo

[Commitlint][] Configuration to enforce commit message best practices on public repositories

## Installation

```bash
$ npm install commitlint @logdna/commitlint-config-mezmo
```

## Usage

To enable commit linting, you need two things in `package.json`

1. `npm` script exposing commitlint
2. `commitlint` configuration that extends the logdna base configuration
Adding a script to expose `commitlint` in the package.json `scripts`.
Below is an example of linting all commits on the active branch that have not been merged into main
```json
"commitlint": {
  "extends": "@logdna/commitlint-config-mezmo"
},
"scripts": {
  "commitlint": "commitlint --from=origin/main --to=HEAD",
  "pretest": "npm run commitlint"
}
```

### Command Line Tool

This package may additionally be installed globally as a command lint tool (`commitlint-mezmo`)

```bash
$ npm install -g @logdna/commitlint-config-mezmo
$ commitlint-mezmo <options>
```

or executed immediately with `npx`

```bash
$ npx @logdna/commitlint-config-mezmo -f origin/master
```

#### OPTIONS

```bash
  -h, --help                 show help and usage
  -v, --version              show version
  -f, --from [origin/main]   the git ref where linting should begin
  -t, --to [HEAD]            the git ref where linting should end
  -p, --pwd <path>           set the root directory
  --config <path>            path to an alternate commitlint config module
```

## Commit Format

Commit message should follow the [Conventional Commit Standard][], and be be
written in imperative form.

* A proper title - This summarizes what was done in the commit
* A descriptive commit body. This says WHY the change was made in addition to
what it was. A blank line should start and end the commit body.
* `BREAKING CHANGE:` (case-sensitive) in the footer to indicate a `major` change
* Break lines of text at 72 columns.  This is for readability.
* `Fixes:` tag at the bottom of the body to associate the changes with an open issue

Example:

```shell
fix(test): Add tests for component XYZ

The component for XYZ was missing a test which resulted in a
production bug.  There was an unchecked reference that caused
a `TypeError`.  This change adds the reference fix and a
corresponding test.

Fixes: #35
```

## Valid Types
The first bit of the commit message is the `type`, which has a finite list
of acceptable values:

* `build`
* `ci`
* `chore`
* `doc`
* `feat`
* `fix`
* `lib`
* `perf`
* `refactor`
* `style`
* `test`

The `scope` is required, but is not validated.

Example:

```txl
pkg(initial): The first commit of this package

This is the initial commit for the project scaffolding and code.

Fixes: #1
```
## Ignored Commits

There are certain commits formats that will be ingored by the linter. These tend to be
commits that are generated by known tools we use or commits that we have determined
should not be linted in the sake of developer performance.

* Commits generated by depenency managers (dependabot / renovate)
* Commits generated by secerity tools (snyk)
* Commits generated by versioning and release tools (versioner, semantic-release)
* Commits that are titled `doc(wiki)`
* Commits that are titled `wip:`
* Dependency commits, `chore(deps):`,  that are *non-breaking*

**Examples**:

Documentation commit only:
```bash
doc(wiki): Adding additional clarifying documentation

Adding some additional documentation that should make using this
more obvious to the casual contributor
```

Commits denoting something is still a work in progress

```txl
wip: this will be ignored
```

A `minor` or `patch` dependency update
```txl
chore(deps): Bump some-package@1.2.3
```

## Authors

* [**Darin Spivey**](mailto:darin.spivey@logdna.com) &lt;darin.spivey@logdna.com&gt;
* [**Eric Satterwhite**](mailto:eric.satterwhite@logdna.com) &lt;eric.satterwhite@logdna.com&gt;

[Commitlint]: https://commitlint.js.org
[Conventional Commit Standard]: https://www.conventionalcommits.org/en/v1.0.0/