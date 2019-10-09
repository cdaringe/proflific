import { Config } from './config'
import { create } from './profile'
import { fromProfile } from './metrics'
import { isAbsolute, resolve } from 'path'
import { ProflificError } from './error'
import { readdir, stat } from 'fs-extra'
import naturalSort from 'typescript-natural-sort'
import { format as createCsvWriteStream } from 'fast-csv'
import bluebird = require('bluebird')

export const getMetaProfiles = (config: Config) =>
  readdir(config.dirname)
    .then(filenames =>
      Promise.all(
        filenames
          .filter(filename => filename.match(/\.cpuprofile$/))
          .map(filename => (isAbsolute(filename) ? filename : resolve(config.dirname, filename)))
          .map(filename =>
            stat(filename).then(filestat => ({
              filename,
              stat: filestat
            }))
          )
      )
    )
    .then(metaProfiles =>
      metaProfiles.sort((a, b) => {
        if (config.sort === 'mtime') return a.stat.mtime > b.stat.mtime ? 1 : -1
        return naturalSort(a.filename, b.filename)
      })
    )

export const derive = async (config: Config) => {
  const metaProfiles = await getMetaProfiles(config)
  if (!metaProfiles.length) {
    throw new ProflificError(`no .cpuprofile files found in ${config.dirname}`)
  }
  return bluebird.map(
    metaProfiles,
    async (meta, fileOrderIndex) => {
      const { filename } = meta
      const profile = await create(filename)
      const metric = fromProfile(profile)
      const csvStream = createCsvWriteStream({ headers: fileOrderIndex === 0 })
      csvStream.pipe(process.stdout)
      Object.entries(metric).forEach(([functionName, metricValue]) =>
        csvStream.write({ functionName, filename, fileOrderIndex, ...metricValue })
      )
      csvStream.end()
    },
    {
      concurrency: 1
    }
  )
}
