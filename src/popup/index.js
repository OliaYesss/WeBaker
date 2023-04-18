import React from 'react'
import ReactDOM from 'react-dom/client'

import { ADDED_BY_USER_START_ID, StorageState } from '../shared/storageState'

import './index.css'
import { NavBar } from './components/NavBar';
import { SetupPage } from './pages/Setup';
import { SettingsPage } from './pages/Settings';
import { DashboardPage } from './pages/Dashboard';
import { DASHBOARD_PAGE, NAV_BAR_PAGES, SETTINGS_PAGE, SETUP_PAGE, SITE_ACTIVITY_PAGE } from './utils/base';
import { dateToKey, getTodayKey } from '../shared/calcDuration';
import { SiteActivityPage } from './pages/SiteActivity';

// Open to debug: chrome-extension://cnccaohjgmadhbppgdhdfncgoahmpjph/popup/index.html

function SettingsPopup(props) {
  const [siteMap, setSiteMap] = React.useState(props.storageState.siteMap)
  const [sessionMap, setSessionMap] = React.useState(props.storageState.sessionMap)
  const [page, setPage] = React.useState(SETUP_PAGE)
  const [activitySiteId, setActivitySiteId] = React.useState(null)

  const saveSiteMap = (newSiteMap) => {
    setSiteMap(newSiteMap)
    StorageState.set({ siteMap: newSiteMap })
  }

  const handleToggleClick = (siteId) => {
    const newSiteMap = {
      ...siteMap,
      [siteId]: {
        ...siteMap[siteId],
        status: !siteMap[siteId].status
      }
    }

    saveSiteMap(newSiteMap)
  }

  const handleMaxDurationInMinsChange = (siteId, value) => {
    const newSiteMap = {
      ...siteMap,
      [siteId]: {
        ...siteMap[siteId],
        maxDurationInMins: value
      }
    }

    saveSiteMap(newSiteMap)
  }

  const handleAddSite = (name, domain) => {
    const siteId = Math.max(
      Math.max(...Object.keys(siteMap).map(x => parseInt(x))) + 1,
      ADDED_BY_USER_START_ID
    )

    const newSiteMap = {
      ...siteMap,
      [siteId]: {
        name,
        domain,
        status: true,
        maxDurationInMins: 30
      }
    }

    saveSiteMap(newSiteMap)
  }

  const handleEditSite = (siteId, name, domain) => {
    const newSiteMap = {
      ...siteMap,
      [siteId]: {
        ...siteMap[siteId],
        name,
        domain
      }
    }

    saveSiteMap(newSiteMap)
  }

  const handleDeleteSite = (siteId) => {
    const newSiteMap = { ...siteMap }

    delete newSiteMap[siteId]

    saveSiteMap(newSiteMap)
  }


  const saveSessionMap = (newSessionMap) => {
    setSessionMap(newSessionMap)
    StorageState.set({ sessionMap: newSessionMap })
  }

  const handleClearDailyUsageData = () => {
    const todayKey = getTodayKey()
    const newSessionMap = Object.keys(sessionMap).reduce((memo, key) => {
      const newSiteSessionMap = { ...sessionMap[key] }

      delete newSiteSessionMap[todayKey]

      return {
        ...memo,
        [key]: newSiteSessionMap
      }
    }, {})

    saveSessionMap(newSessionMap)
  }

  const handleClearWeeklyUsageData = () => {
    const dateKeys = []
    let curDate = new Date()

    for (let i = 0; i < 7; i++) {
      dateKeys.push(dateToKey(curDate))
      curDate.setDate(curDate.getDate() - 1)
    }

    const newSessionMap = Object.keys(sessionMap).reduce((memo, key) => {
      const newSiteSessionMap = { ...sessionMap[key] }

      dateKeys.forEach(dateKey => {
        delete newSiteSessionMap[dateKey]
      })

      return {
        ...memo,
        [key]: newSiteSessionMap
      }
    }, {})

    saveSessionMap(newSessionMap)
  }

  const handleOpenSiteActivityPage = (siteId) => {
    setPage(SITE_ACTIVITY_PAGE)
    setActivitySiteId(siteId)
  }

  const handleCloseSiteActivityPage = () => {
    setPage(DASHBOARD_PAGE)
    setActivitySiteId(null)
  }

  return (
    <div className='popup'>
      {
        page !== SITE_ACTIVITY_PAGE &&
        <NavBar pages={NAV_BAR_PAGES} onClick={setPage} />
      }

      {
        page === SETUP_PAGE && 
        <SetupPage
          siteMap={siteMap}
          sessionMap={sessionMap}
          handleToggleClick={handleToggleClick}
          handleClearDailyUsageData={handleClearDailyUsageData} 
          currentSession={props.storageState.currentSession}
        />
      }

      {
        page === SETTINGS_PAGE &&
        <SettingsPage
          siteMap={siteMap}
          handleMaxDurationInMinsChange={handleMaxDurationInMinsChange}
          handleAddSite={handleAddSite}
          handleEditSite={handleEditSite}
          handleDeleteSite={handleDeleteSite}
        />
      }

      {
        page === DASHBOARD_PAGE &&
        <DashboardPage
          siteMap={siteMap}
          sessionMap={sessionMap}
          handleClearWeeklyUsageData={handleClearWeeklyUsageData}
          openSiteActivityPage={handleOpenSiteActivityPage}
          currentSession={props.storageState.currentSession}
        />
      }

      {
        page === SITE_ACTIVITY_PAGE &&
        <SiteActivityPage
          siteMap={siteMap}
          sessionMap={sessionMap}
          currentSession={props.storageState.currentSession}
          closePage={handleCloseSiteActivityPage}
          activitySiteId={activitySiteId}
        />
      }
    </div>
  )
}

StorageState
  .get()
  .then(storageState => {
    const root = ReactDOM.createRoot(document.getElementById('root'))
    root.render(<SettingsPopup storageState={storageState} />)    
  })
