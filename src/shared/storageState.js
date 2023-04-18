const DEFAULT_SITE_MAP = {
  0: {
    domain: 'facebook.com',
    name: 'Facebook',
    status: true,
    maxDurationInMins: 30
  },
  1: {
    domain: 'instagram.com',
    name: 'Instagram',
    status: true,
    maxDurationInMins: 30
  },
  2: {
    domain: 'twitter.com',
    name: 'Twitter',
    status: true,
    maxDurationInMins: 30
  },
  3: {
    domain: 'youtube.com',
    name: 'YouTube',
    status: true,
    maxDurationInMins: 30
  }
}

export const ADDED_BY_USER_START_ID = Math.max(...Object.keys(DEFAULT_SITE_MAP).map(x => parseInt(x))) + 1

export class StorageState {
  static get() {
    return chrome.storage.local.get(null).then(state => ({
      ...state,
      currentSession: state.currentSession ?? null,
      sessionMap: state.sessionMap ?? {},
      siteMap: state.siteMap ?? DEFAULT_SITE_MAP
    }))
  }

  static set(newValue) {
    return chrome.storage.local.set(newValue)
  }

  static removeSessonMap() {
    return chrome.storage.local.set({ sessionMap: {} })
  }
}
