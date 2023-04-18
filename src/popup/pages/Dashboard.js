import React from 'react'
import format from 'format-duration'
import Button from '@mui/material/Button';
import { calcWeeklyDuration, getRuntimeUsageDuration } from '../../shared/calcDuration';
import { PopupConfirm } from '../components/PopupConfirm';
import { TableWrapper } from '../components/TableWrapper';
import { IconButton } from '../components/IconButton';

function calcWeeklyRuntimeDuration(sessionMap, currentSession) {
  return (siteId) => getRuntimeUsageDuration(calcWeeklyDuration(sessionMap[siteId]), siteId, currentSession)
}

export function DashboardPage(props) {
  const calcWeeklyRuntimeDurationForSite = calcWeeklyRuntimeDuration(props.sessionMap, props.currentSession)
  const [showPopup, setShowPopup] = React.useState(false)

  const handlePopupClick = (isAccept) => {
    if (isAccept) {
      props.handleClearWeeklyUsageData()
    }

    setShowPopup(false)
  }

  return (
    <>
      {
        showPopup &&
        <PopupConfirm
          text="⚠️ Are you sure you want to clean weekly usage data?"
          onAccept={() => handlePopupClick(true)}
          onReject={() => handlePopupClick(false)}
        />
      }

      <TableWrapper
        head={['Site name', 'Weekly Usage', 'Explore Usage']}
        rows={Object.keys(props.siteMap)
          .sort((a, b) => calcWeeklyRuntimeDurationForSite(a) > calcWeeklyRuntimeDurationForSite(b) ? -1 : 1)
          .map((siteId) => {
            const site = props.siteMap[siteId]
            
            return [
              site.name ?? site.domain,
              format(calcWeeklyRuntimeDurationForSite(siteId)),
              <IconButton onClick={() => props.openSiteActivityPage(siteId)} text="📉" styles={{ fontSize: 20 }} />
            ]
          })
        }
      />

      <div className="button">
        <Button variant="outlined" onClick={() => setShowPopup(true)}>Clear Weekly Usage Data</Button>
      </div>
    </>
  )
}