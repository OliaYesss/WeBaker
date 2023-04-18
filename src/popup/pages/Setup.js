import React from 'react'
import Button from '@mui/material/Button';

import { AntSwitch } from '../components/ANTSwitcher';
import format from 'format-duration'
import { calcDailyDuration, getRuntimeUsageDuration } from '../../shared/calcDuration';
import { PopupConfirm } from '../components/PopupConfirm';
import { TableWrapper } from '../components/TableWrapper';

export function SetupPage(props) {
  const [showPopup, setShowPopup] = React.useState(false)

  const handlePopupClick = (isAccept) => {
    if (isAccept) {
      props.handleClearDailyUsageData()
    }

    setShowPopup(false)
  }

  return (
    <>
      {
        showPopup &&
        <PopupConfirm
          text="🧹 Are you sure you want to clean daily usage data?"
          onAccept={() => handlePopupClick(true)}
          onReject={() => handlePopupClick(false)}
        />
      }

      <TableWrapper
        head={[null, 'Site name', 'Daily Usage']}
        rows={Object.keys(props.siteMap).map((siteId) => {
          const site = props.siteMap[siteId]
          const sessionMap = props.sessionMap[siteId]

          return [
            <AntSwitch checked={site.status} onClick={() => props.handleToggleClick(siteId)} />,
            site.name ?? site.domain,
            format(getRuntimeUsageDuration(calcDailyDuration(sessionMap), siteId, props.currentSession))
          ]
        })}
      />

      <div className="button">
        <Button 
          variant="outlined" 
          onClick={() => setShowPopup(true)}>
          Clear Daily Usage Data
        </Button>
      </div>
    </>
  )
}