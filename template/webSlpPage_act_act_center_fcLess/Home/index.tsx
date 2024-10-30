import React, { useState, useEffect, useRef, useContext } from 'react'
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
import { getHome, getConfig, GetConfigRes } from '../api'
import { useIsLoad, useCountTime } from '../hooks'
import { useGlobalContext } from '/src/context/globalContext'
import styles from './index.module.less'

// transition
import { TransitionGroup, CSSTransition } from 'react-transition-group'

export default function Home() {

  const navigate = useNavigate()

  const isLoad = useIsLoad(100)

  const { available, updateMyAvailable } = useGlobalContext()

  // 活动配置
  const [actConfig, setActConfig] = useState<GetConfigRes>()

  // get home
  const httpGetHome = () => {
    Toast.loading()
    getHome({})
      .then((res) => { })
      .finally(Toast.hide)
  }

  // 获取活动配置
  const httpGetConfig = () => {
    Toast.loading()
    getConfig({})
      .then(res => {
        setActConfig(res)
        httpGetHome()
      })
      .finally(Toast.hide)
  }

  useEffect(() => {
    httpGetConfig()
    updateMyAvailable()
    onReturnToWeb(() => {
      updateMyAvailable()
    })
  }, [])

  return (
    <div className={`${styles.home} ${isLoad ? 'load-home' : ''}`}>
      <div className="home-cnt">
        <h3>Home</h3>
      </div>
    </div>
  )
}
