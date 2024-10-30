import Reac, { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import Modal from '/src/components/Modal/Modal'
import style from './index.module.less'

interface Props {
  className?: string
  children: Reac.ReactNode
  titleIcon?: string
  onClose?: () => void
}
export default function ComBaseModal(props: Props) {

  const { className, children, titleIcon, onClose = Modal.hide } = props

  return (
    <div className={`${style.comBaseModal} ${className}`}>
      <div className="comBaseModal-cnt">
        {
          titleIcon &&
          <div className="modalTitle rc">
            <img className='modalTitle-icon' src={titleIcon} />
          </div>
        }
        <div className="modalMain">
          {children}
        </div>
      </div>
      <div onClick={onClose} className="comBaseModal-exit"></div>
    </div>
  )
}
