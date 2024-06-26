import React, { useState, useEffect, useRef, useContext } from 'react'
import { useIsLoad, delayCall } from '../hooks'
import {
  navigateBack,
  onReturnToWeb,
  setTitle,
  showChargeBalance
} from '/src/native'
import { useNavigate } from 'react-router-dom'
import { getQuery } from '@ola/utils'
import dayjs from 'dayjs'
import Toast from '/src/common/Toast/Toast'
import Modal from '/src/components/Modal/Modal'
import { getHome } from '../api'
import styles from './index.module.less'

// transition
import { TransitionGroup, CSSTransition } from 'react-transition-group'

export default function Home() {

  const navigate = useNavigate()

  const isLoad = useIsLoad(130)

  const httpGetHome = () => {
    httpGetHome()
  }

  useEffect(() => {
    Toast.loading()
    getHome({})
      .then((data) => { })
      .finally(Toast.hide)
    onReturnToWeb(httpGetHome)
  }, [])

  return (
    <div className={`${styles.home} ${isLoad ? 'load-home' : ''}`}>
      <div className="home-cnt">
        <h3>Home</h3>
      </div>
    </div>
  )
}
