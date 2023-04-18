export function dateToKey(date) {
  return date.toLocaleDateString()
}

export function getTodayKey() {
  return dateToKey(new Date)
}

export function calcWeeklyDuration(sessionMap) {
  if (!sessionMap) {
    return 0
  }

  let res = 0
  let curDay = new Date()

  for (let i = 0; i < 7; i++) {
    res += sessionMap[dateToKey(curDay)] ?? 0
    curDay.setDate(curDay.getDate() - 1)
  }

  return res
}

export function calcDailyDuration(sessionMap) {
  if (!sessionMap) {
    return 0
  }

  const todayKey = getTodayKey()
  return sessionMap[todayKey] ?? 0
}

export function getRuntimeUsageDuration(duration, durationSiteId, currentSession) {
  const nowTimestamp = Date.now()

  return duration + (
    currentSession && currentSession.siteId === durationSiteId
    ? nowTimestamp - currentSession.startTimestamp
    : 0
  )
}
