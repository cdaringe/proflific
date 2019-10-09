import ava, { TestInterface } from 'ava'
import { derive } from '../src/proflific'
import { resolve } from 'path'

const test = ava as TestInterface<{}>

const FIXTURE_DIRNAME = resolve(__dirname, 'fixture')

test('proflific', async t => {
  const res = await derive({
    dirname: FIXTURE_DIRNAME
  })
  t.truthy(res.length > 0)
})
