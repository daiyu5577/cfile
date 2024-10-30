import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef, useMemo } from 'react'
import styles from './index.module.less'

interface Props {
  className?: string
  defValue?: number
  minValue?: number
  maxValue: number // 当前用户余额可购买的最大数量
  onceMax?: number // 单次能购买的最大限制
  addTxt?: string
  minusTxt?: string
  maxTxt?: string
  onChange?: (v: string) => void
}

export interface RefParams {
  value: string
}

function InputCount(props: Props, ref: React.ForwardedRef<RefParams | undefined>) {

  const { className = '', defValue = 1, minValue = 1, maxValue, onceMax = 99, addTxt = '+', minusTxt = '-', maxTxt = 'MAX', onChange } = props

  const iptDOM = useRef<HTMLInputElement>(null)

  const [value, setValue] = useState<string>(`${defValue}`)

  const max = useMemo(() => {
    return Math.min(onceMax, maxValue <= minValue ? minValue : maxValue)
  }, [props])

  const handleAdd = () => {
    let valueNum = Number(value)
    let curTimes = valueNum >= max ? max : valueNum + 1
    setValue(`${curTimes}`);
  }

  const handleMinus = () => {
    let valueNum = Number(value)
    let curTimes = valueNum <= minValue ? minValue : valueNum - 1
    setValue(`${curTimes}`);
  }

  const handleMax = () => {
    setValue(`${max}`)
  }

  const handleChange = (val: string) => {
    // console.log('change', val)
    if (val == '') {
      setValue('')
      return
    }
    if (!/^[0-9]+$/.test(`${val}`)) return
    const num = Number(val)
    if (num <= minValue) {
      setValue(`${minValue}`)
      return
    }
    if (num >= max) {
      setValue(`${max}`)
      return
    }
    setValue(`${num}`)
  }

  const handleBlur = (val: string) => {
    if (!/^[0-9]+$/.test(`${val}`)) {
      setValue(`${minValue}`)
    }
  }

  useImperativeHandle(ref, () => ({
    value
  }))

  useEffect(() => {
    onChange?.(value)
  }, [value])

  return (
    <div className={`${className} ${styles.inputCount} rc`}>
      <div className="count-box rc">
        <div onClick={handleMinus} className={`count-left rc ${Number(value) <= minValue ? 'disabled' : ''}`}>{minusTxt}</div>
        <div className="count-center">
          <input
            ref={iptDOM}
            type="text"
            autoComplete={'off'}
            value={value}
            onInput={(e) => handleChange(e.currentTarget.value)}
            onBlur={(e) => handleBlur(e.currentTarget.value)}
          />
        </div>
        <div onClick={handleAdd} className={`count-right rc ${Number(value) >= max ? 'disabled' : ''}`}>{addTxt}</div>
      </div>
      <div onClick={handleMax} className={`count-max rc ${Number(value) >= max ? 'disabled' : ''}`}>{maxTxt}</div>
    </div>
  )
}

export default forwardRef<RefParams | undefined, Props>(InputCount)
