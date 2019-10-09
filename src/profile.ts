import { readFile } from 'fs-extra'
const CpuProfile = require('cpuprofile').Profile

export type ProfileSampleOutput = {
  functionName: string
  selfTime: number
  totalTime: number
}
export type Profile = {
  bottomUpNodes: unknown[]
  endTime: number
  nodes: unknown[]
  remainingNodeInfos: unknown[]
  samples: number[]
  samplingInterval: number
  startTime: number
  timeDeltas: number[]
  translatedRoot: any
  formattedBottomUpProfile: () => ProfileSampleOutput[]
}

export const create = async (filename: string) => {
  const profileRawContents = await readFile(filename, {
    encoding: 'utf8'
  })
  return CpuProfile.createFromObject(JSON.parse(profileRawContents)) as Profile
}

export const getDurationMs = (profile: Profile) => (profile.endTime - profile.startTime) / 1e3
