import { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import ola from '/src/ola'
import { GiftItem } from '../../api.d'
import Gift from '../../components/Gift'
import style from './index.module.less'

interface Props {
  giftItem: Partial<GiftItem>
  className?: string
}

export default function GiftIconItem(props: Props) {

  const { giftItem, className } = props

  return (
    <div className={`${style.gift} ${className}`}>
      <div className="gift-icon rc">
        <Gift src={giftItem.icon as string} />
        {!!giftItem.tag && <div className="gift-tag">{giftItem.tag}</div>}
      </div>
      <div className="gift-name ellipsis">{giftItem.name}{giftItem.cate_name}</div>
    </div>
  )
}
