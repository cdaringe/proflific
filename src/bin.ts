import { CliOutput, Config, UnvalidatedConfig } from './config'
import { derive } from './proflific'
import { isLeft } from 'fp-ts/lib/Either'
import { lstat } from 'fs-extra'
import { PathReporter } from 'io-ts/lib/PathReporter'
import meow from 'meow'
import { ProflificError } from './error'

const parsed: CliOutput = meow(
  `
proflific is .cpuprofile derived metric etl > disk

Usage
  $ proflific

Options
  --dirname <dirname> # default $PWD
  --sort <mtime|lex> # default: lex, lexgraphical sort
`,
  {
    flags: {
      dirname: {
        type: 'string'
      },
      sort: {
        type: 'string'
      }
    }
  }
) as any

async function run () {
  const args = CliOutput.decode(parsed)
  if (isLeft(args)) {
    throw new ProflificError(`bad input detected\n\n${PathReporter.report(args).join(', ')}\n`)
  } else {
    const config: UnvalidatedConfig = {
      ...args.right.flags
    }
    const dirname = (config.dirname = config.dirname || process.cwd())
    const createBadDirnameError = (dirname: string) =>
      new ProflificError(`proflific input dir ${dirname} is not a directory`)
    await lstat(config.dirname)
      .then(stat => {
        if (!stat.isDirectory) throw createBadDirnameError(dirname)
      })
      .catch(() => {
        throw createBadDirnameError(dirname)
      })
    await derive(config as Config)
  }
}

async function go () {
  try {
    await run()
  } catch (err) {
    if (err instanceof ProflificError) {
      console.error('[error]', err.message)
      process.exit(1)
    }
    throw err
  }
}
go()
