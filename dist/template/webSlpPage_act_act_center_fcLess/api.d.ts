export interface ActTime {
  end: number
  start: number
}

// typ
// gift.cost 金币 + 钻石
// gift.unlock 解锁权 - 金币
// commodity 直接购买物品 - 钻石
// act.toolb | act.toolb 活动道具 - 金币
// gift.score ｜ pretend 装扮 - 金币
export interface GiftItem {
  cate_name: string
  icon: string
  id: number
  name: string
  num: number
  price: number
  tag: string
  typ: string
}