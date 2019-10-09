import { Profile, ProfileSampleOutput, getDurationMs } from './profile'
import { groupBy } from 'lodash'

export type MetricValue = {
  percentSelfDuringSample: number
  percentTotalDuringSample: number
  totalInvocations: number
  totalSelfTime: number
  totalTotalTime: number
}
export type Metric = {
  [functionName: string]: MetricValue
}

const samplesToMetricValue: (subsamples: ProfileSampleOutput[], profile: Profile) => MetricValue = (
  subsamples,
  profile
) => {
  const totalInvocations = subsamples.length
  const totalTotalTime = subsamples.reduce((total, curr) => total + curr.totalTime, 0)
  const totalSelfTime = subsamples.reduce((total, curr) => total + curr.selfTime, 0)
  return {
    totalTotalTime,
    totalSelfTime,
    totalInvocations,
    percentSelfDuringSample: totalSelfTime / getDurationMs(profile),
    percentTotalDuringSample: totalTotalTime / getDurationMs(profile)
  }
}

export const fromProfile = (profile: Profile) => {
  const bottumUp = profile.formattedBottomUpProfile()
  const groupedByFunctionName: {
    [fnName: string]: ProfileSampleOutput[]
  } = groupBy(bottumUp, 'functionName')
  return Object.entries(groupedByFunctionName).reduce(
    (agg, [fnName, samples]) => ({
      [fnName]: samplesToMetricValue(samples, profile),
      ...agg
    }),
    {} as Metric
  )
}
