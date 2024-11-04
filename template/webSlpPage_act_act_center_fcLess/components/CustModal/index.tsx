import React, { useEffect, useState, useRef, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { createPortal } from 'react-dom';
import style from './index.module.less'

interface Props {
  children: React.ReactNode
  otherStyle?: React.CSSProperties
}

export default function BaseModal(props: Props) {

  const { children, otherStyle } = props

  return (
    createPortal(
      <div className={style.baseModal} style={{ ...otherStyle }}>
        <div className="baseModal-cnt">
          {children}
        </div>
      </div>,
      document.body
    ) as React.ReactNode
  )
}
