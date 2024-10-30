import React, { useState, useMemo, useEffect, useRef, SetStateAction } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { getUserInfo, isInApp, navigateBack, getSystemInfoSync } from '/src/native'
import Home from './Home'
// import Rule from './Rule'
import { getQuery } from '@ola/utils'
import styles from './index.module.less'

// images
import backIcon2 from "./images/back2.png"

export default function EntryComp() {

  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    isInApp ? navigateBack() : navigate(-1)
  }

  return (
    <div className={styles.entryComp}>
      <div onClick={handleBack} className="back-box rc">
        <img className='backIcon2 atouch' src={backIcon2} alt="" />
      </div>
      <Routes>
        <Route index element={<Home />} />
        {/* <Route path='rule' element={<Rule />} /> */}
      </Routes>
    </div>
  )
}
