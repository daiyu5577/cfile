
import golangParams from '/src/service/golangParams'
import { request } from '/src/service/instance'
import type { ActTime, LevelItem, RankUserItem, rankRwdItem, RecordItem } from './api.d'

// home
export interface GetHomeRes {
  cnt: any
}
export interface GetHomeParams { }
export function getHome(params: GetHomeParams) {
  return request<GetHomeRes>({
    method: 'get',
    url: '/go/act/summer-dream/home',
    headers: { 'Content-Type': 'application/json' },
    params: {
      format: 'json',
      ...golangParams(),
      ...params
    },
  })
}

