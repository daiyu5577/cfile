export interface ActTime {
  end: number
  start: number
}

export interface LevelItem {
  level: number
  batch_prop: number
  name: string
  need_save: number
  win_num: number
}

export interface RankUserItem {
  cost: number
  cost_desc: string
  desc: string
  icon: string
  msg: string
  name: string
  order: number
  rid: number
  uid: number
}

export interface rankRwdItem {
  cate_name: string
  icon: string
  id: number
  money: number
  name: string
  num: number
  tag: string
  typ: string
}

export interface RecordItem {
  content: string
  create_time: number
  id: number
  level_name: string
  title: string
  title_sub: string
  uid: number
}