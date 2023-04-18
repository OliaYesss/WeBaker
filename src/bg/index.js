import { getTodayKey } from "../shared/calcDuration"
import { StorageState } from "../shared/storageState"

const EVENT = {
  activeTabChanged: 'activeTabChanged',
  tabUpdated: 'tabUpdated',
  windowFocusChanged: 'windowFocusChanged'
}

async function handleChange(_event, tab) {
  const { siteMap, currentSession, sessionMap } = await StorageState.get()
  const currentTimestamp = Date.now()
  let newSession = null

  if (tab) {
    const siteId = Object.keys(siteMap).find(siteId => (
      tab.url.includes(siteMap[siteId].domain) && siteMap[siteId].status
    ))

    if (currentSession && siteId === currentSession.siteId) {
      newSession = currentSession
    } else if (siteId) {
      newSession = {
        siteId,
        startTimestamp: currentTimestamp
      }
    }
  }

  // console.log(_event, currentSession, newSession)

  if (newSession && currentSession && currentSession.siteId === newSession.siteId) {
    return
  }

  if (currentSession) {
    const todayKey = getTodayKey()
    const duration = currentTimestamp - currentSession.startTimestamp

    if (!sessionMap[currentSession.siteId]) {
      sessionMap[currentSession.siteId] = {}
    }

    if (!sessionMap[currentSession.siteId][todayKey]) {
      sessionMap[currentSession.siteId][todayKey] = 0
    }

    sessionMap[currentSession.siteId][todayKey] += duration

    StorageState.set({ currentSession: newSession, sessionMap })
  } else {
    StorageState.set({ currentSession: newSession })
  }
}

function main() {
  // listen tab change
  chrome.tabs.onActivated.addListener(async () => {
    const [ tab ] = await chrome.tabs.query( { active: true, lastFocusedWindow: true })
    handleChange(EVENT.activeTabChanged, tab)
  })

  // listent tab update
  chrome.tabs.onUpdated.addListener((_tabId, _changeInfo, tab) => {
    handleChange(EVENT.tabUpdated, tab)
  })

  // listen browser focus
  chrome.windows.onFocusChanged.addListener(async (window) => {
    if (window === chrome.windows.WINDOW_ID_NONE) {
      handleChange(EVENT.windowFocusChanged, null)
    } else {
      const [ tab ] = await chrome.tabs.query( { active: true, lastFocusedWindow: true })
      handleChange(EVENT.windowFocusChanged, tab)
    }
  })
}

main()
