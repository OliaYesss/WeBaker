import React from 'react'
import ReactDOM from 'react-dom/client'
import format from 'format-duration'

import { calcDailyDuration, getRuntimeUsageDuration } from "../shared/calcDuration"
import { StorageState } from "../shared/storageState"

import './index.css'
import { Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';

const emojis = [
  // basic
  ...generateEmojisInRange(128512, 128580),
  ...generateEmojisInRange(129296, 129327),
  // transport
  ...generateEmojisInRange(128642, 128708),
  // animals
  ...generateEmojisInRange(128064, 128069),
  ...generateEmojisInRange(128034, 128034),
  ...generateEmojisInRange(128584, 128586),
  ...generateEmojisInRange(128000, 128063)
]

function generateEmojisInRange(startCode, endCode) {
  const emojis = []

  for (let code = startCode; code <= endCode; code++) {
    emojis.push(String.fromCodePoint(code))
  }

  return emojis
}

function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)]
}

function Notification(props) {
  const [show, setShow] = React.useState(true)

  if (!show) {
    return null
  }

  return (
    <div className='notificationWrapper' onClick={() => setShow(false)}>
      <div className='closeWrapper'>
        <CloseIcon sx={{ fontSize: 40, color: '#fff' }} />
      </div>
      <Typography variant="h1" gutterBottom>
        Enough for today! {getRandomEmoji()}
      </Typography>
      <Typography variant="h2" gutterBottom>
        You already spent {props.siteInfo.time} on {props.siteInfo.name}.
      </Typography>
    </div>
  )
}


function render(siteInfo) {
  const rootElement = document.createElement('div')

  rootElement.setAttribute('id', 'webaker')
  document.body.appendChild(rootElement)

  const root = ReactDOM.createRoot(rootElement)
  
  root.render(<Notification siteInfo={siteInfo} />)
}

StorageState
  .get()
  .then(storageState => {
    const { siteMap, sessionMap, currentSession } = storageState
    const url = document.location.href

    const siteId = Object.keys(siteMap).find(siteId => (
      url.includes(siteMap[siteId].domain) && siteMap[siteId].status
    ))

    const curSite = siteMap[siteId]
    const curSessionMap = sessionMap[siteId]

    if (!curSite || !curSessionMap) {
      return
    }

    const durationInMs = getRuntimeUsageDuration(calcDailyDuration(curSessionMap), siteId, currentSession)
    const durationInMins = Math.floor(durationInMs / (1000 * 60))

    if (curSite.maxDurationInMins > durationInMins) {
      return
    }

    const siteInfo = {
      name: curSite.name ?? curSite.domain,
      time: format(durationInMs)
    }

    render(siteInfo)
  })
