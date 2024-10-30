import { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import ola from '/src/ola'
import style from './index.module.less'

interface Props {
  className?: string
  typ?: string
  src: string
  clipSize?: number
}

export default function Gift(props: Props) {

  const { className, src, typ, clipSize = 150 } = props

  return (
    <img className={`${style.gift} ${className} ${typ == 'pretend' ? 'gift-pretend' : ''}`} src={`${ola.app.config.oss}${src}?x-oss-process=image/resize,w_${clipSize},limit_0,m_lfit`} alt="" />
  )
}
