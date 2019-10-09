# proflific

`.cpuprofile` derived metric etl > disk utility

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Coverage Status](https://coveralls.io/repos/github/cdaringe/pouchy/badge.svg?branch=master)](https://coveralls.io/github/cdaringe/pouchy?branch=master) [![TypeScript package](https://img.shields.io/badge/language-typescript-blue)](https://www.typescriptlang.org)
<!-- [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)  -->
<!-- [![CircleCI](https://circleci.com/gh/cdaringe/pouchy.svg?style=svg)](https://circleci.com/gh/cdaringe/pouchy)  -->

*input*: a directory of `.cpuprofile` files

*output*: csv stream of aggregated metrics targetted at analyzing cpu usage over long durations of time


long running cpu profiling is expensive.  proflific takes samples and outputs plotable datas so you can see what callers are becoming more _prolific_ over time

## usage

`npx proflific --help`:

```sh

  proflific is .cpuprofile derived metric etl > disk utility

  Usage
    $ proflific

  Options
    --dirname <dirname> # default $PWD
    --sort <mtime|lex> # default: lex, lexgraphical sort
```

for usage as a library, import directly from source. it is aggresively typed, and organized simply for your convenience
