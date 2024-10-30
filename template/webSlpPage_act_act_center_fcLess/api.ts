
import golangParams from '/src/service/golangParams'
import { request } from '/src/service/instance'
import type { ActTime, GiftItem } from './api.d'

// config
export interface GetConfigRes {
  act_id: number
  day: number
  start_time: number
  end_time: number
  left_time: number
  message: string
  refresh_cost: number
  success: true
  ver: string
}
export interface GetConfigParams { }
export function getConfig(params: GetConfigParams) {
  return request<GetConfigRes>({
    method: 'get',
    url: '/go/act/mystery-shop/config',
    headers: { 'Content-Type': 'application/json' },
    params: {
      format: 'json',
      ...golangParams(),
      ...params
    },
  })
}

// home
export interface GetHomeRes {
  choose_cards: {
    pk_id: number
    rwd: GiftItem
  }[]
  rewards: GiftItem[]
  is_buy: number
  status: number // 0: 未操作、1：未翻牌、2：已翻牌
}
export interface GetHomeParams { }
export function getHome(params: GetHomeParams) {
  return request<GetHomeRes>({
    method: 'get',
    url: '/go/act/mystery-shop/home',
    headers: { 'Content-Type': 'application/json' },
    params: {
      format: 'json',
      ...golangParams(),
      ...params
    },
  })
}