import { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import dayjs from 'dayjs'

export const formatTime = (countTime: number, fromat = 'hh:mm:ss', fromatType: 'day' | 'hour') => {
  const allSecord = Math.floor(countTime * 1)
  const addZero = (s: string) => (s.length >= 2 ? s : `0${s}`)
  const oneD = 24 * 60 * 60
  const oneH = 60 * 60
  const oneM = 60
  let d = '0'
  let dd = addZero(d)
  let h = '0'
  let hh = addZero(h)
  let m = '0'
  let mm = addZero(h)
  let s = '0'
  let ss = addZero(h)

  if (fromatType == 'day') {
    d = `${Math.floor(allSecord / oneD)}`
    dd = addZero(d)
    h = `${Math.floor((allSecord % oneD) / oneH)}`
    hh = addZero(h)
    m = `${Math.floor((allSecord % oneH) / oneM)}`
    mm = addZero(m)
    s = `${Math.floor(allSecord % oneM)}`
    ss = addZero(s)
  } else {
    h = `${Math.floor(allSecord / oneH)}`
    hh = addZero(h)
    m = `${Math.floor((allSecord % oneH) / oneM)}`
    mm = addZero(m)
    s = `${Math.floor(allSecord % oneM)}`
    ss = addZero(s)
  }
  const timeObj = {
    d,
    dd,
    h,
    hh,
    m,
    mm,
    s,
    ss
  }
  return fromat.replace(
    /(dd|d|hh|h|mm|m|ss|s)/g,
    (v) => timeObj[v as keyof typeof timeObj]
  )
}

// 倒计时
interface CountTimeProps {
  time: number | undefined // 剩余时间（秒）
  wacthState?: any
  callback?: () => any
  onProgress?: (t: number) => any
  fromat?: string
  fromatType: 'day' | 'hour'
}
const oneSecond = 1

export const useCountTime = (props: CountTimeProps) => {

  const timer = useRef(-1)
  const callbackFn = useRef(() => { })

  const { time = 0, callback = () => { }, onProgress = () => { }, fromat = 'hh:mm:ss', fromatType = 'hour', wacthState } = props

  const [targetTime, setTargetTime] = useState(0)
  const [countTime, setCountTime] = useState<number>()

  useEffect(() => {
    callbackFn.current = callback
  })

  useEffect(() => {
    if (countTime === undefined) return
    timer.current = setTimeout(() => {
      if (countTime <= oneSecond) {
        callbackFn.current?.()
        return
      }
      const difference = targetTime - dayjs().unix()
      setCountTime(difference <= oneSecond ? 0 : difference)
      onProgress(difference <= oneSecond ? 0 : difference)
    }, 1000)
    return () => clearTimeout(timer.current)
  }, [countTime])

  useEffect(() => {
    if (!time || time <= 0) {
      clearTimeout(timer.current)
      setCountTime(undefined)
      return
    }
    setTargetTime(dayjs().unix() + time)
    setCountTime(time)
  }, [time, wacthState])

  const timeStr = useMemo(() => formatTime(countTime || 0, fromat, fromatType), [countTime])

  return timeStr
}

interface ScrollProps {
  scrollDOM: Element | null
  callBack: (type: 'loadMore') => void
  hasMore: boolean
  isLoading: boolean
  offset?: number
}
export const useScroll = (props: ScrollProps) => {

  const { scrollDOM, callBack, offset = 20, hasMore, isLoading } = props

  const timer = useRef(0)

  useEffect(() => {
    if (!scrollDOM || !callBack) return
    const onscroll = (e: Event) => {
      if (timer) clearTimeout(timer.current)
      if (!hasMore || isLoading) return
      timer.current = setTimeout(() => {
        const evect = e.target as HTMLDivElement
        const scrollHeight = evect.scrollHeight
        const offsetHeight = evect.offsetHeight
        const scrollTop = evect.scrollTop
        if (offsetHeight + scrollTop >= scrollHeight - offset) {
          callBack('loadMore')
        }
        timer.current = 0
      }, 20);
    }
    scrollDOM?.addEventListener('scroll', onscroll)
    return () => scrollDOM?.removeEventListener('scroll', onscroll)
  }, [scrollDOM, callBack])

}

export const useIsLoad = (t = 0) => {
  const [isLoad, setIsLoad] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setIsLoad(true)
    }, t);

  }, [])
  return isLoad
}

export const delayCall = (fn: () => any, t = 0) => {
  setTimeout(fn, t)
}

