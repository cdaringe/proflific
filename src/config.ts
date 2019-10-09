import * as io from 'io-ts'

export const CliOutput = io.type({
  flags: io.partial({
    dirname: io.string,
    sort: io.keyof({
      // https://github.com/gcanti/io-ts#union-of-string-literals
      mtime: null,
      lex: null
    })
  })
})

export type CliOutput = io.TypeOf<typeof CliOutput>
export type UnvalidatedConfig = CliOutput['flags']
export type Config = UnvalidatedConfig & {
  dirname: string
}
