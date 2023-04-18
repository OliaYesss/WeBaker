(() => {
  // src/shared/calcDuration.js
  function dateToKey(date) {
    return date.toLocaleDateString();
  }
  function getTodayKey() {
    return dateToKey(new Date());
  }

  // src/shared/storageState.js
  var DEFAULT_SITE_MAP = {
    0: {
      domain: "facebook.com",
      name: "Facebook",
      status: true,
      maxDurationInMins: 30
    },
    1: {
      domain: "instagram.com",
      name: "Instagram",
      status: true,
      maxDurationInMins: 30
    },
    2: {
      domain: "twitter.com",
      name: "Twitter",
      status: true,
      maxDurationInMins: 30
    },
    3: {
      domain: "youtube.com",
      name: "YouTube",
      status: true,
      maxDurationInMins: 30
    }
  };
  var ADDED_BY_USER_START_ID = Math.max(...Object.keys(DEFAULT_SITE_MAP).map((x) => parseInt(x))) + 1;
  var StorageState = class {
    static get() {
      return chrome.storage.local.get(null).then((state) => ({
        ...state,
        currentSession: state.currentSession ?? null,
        sessionMap: state.sessionMap ?? {},
        siteMap: state.siteMap ?? DEFAULT_SITE_MAP
      }));
    }
    static set(newValue) {
      return chrome.storage.local.set(newValue);
    }
    static removeSessonMap() {
      return chrome.storage.local.set({ sessionMap: {} });
    }
  };

  // src/bg/index.js
  var EVENT = {
    activeTabChanged: "activeTabChanged",
    tabUpdated: "tabUpdated",
    windowFocusChanged: "windowFocusChanged"
  };
  async function handleChange(_event, tab) {
    const { siteMap, currentSession, sessionMap } = await StorageState.get();
    const currentTimestamp = Date.now();
    let newSession = null;
    if (tab) {
      const siteId = Object.keys(siteMap).find((siteId2) => tab.url.includes(siteMap[siteId2].domain) && siteMap[siteId2].status);
      if (currentSession && siteId === currentSession.siteId) {
        newSession = currentSession;
      } else if (siteId) {
        newSession = {
          siteId,
          startTimestamp: currentTimestamp
        };
      }
    }
    if (newSession && currentSession && currentSession.siteId === newSession.siteId) {
      return;
    }
    if (currentSession) {
      const todayKey = getTodayKey();
      const duration = currentTimestamp - currentSession.startTimestamp;
      if (!sessionMap[currentSession.siteId]) {
        sessionMap[currentSession.siteId] = {};
      }
      if (!sessionMap[currentSession.siteId][todayKey]) {
        sessionMap[currentSession.siteId][todayKey] = 0;
      }
      sessionMap[currentSession.siteId][todayKey] += duration;
      StorageState.set({ currentSession: newSession, sessionMap });
    } else {
      StorageState.set({ currentSession: newSession });
    }
  }
  function main() {
    chrome.tabs.onActivated.addListener(async () => {
      const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      handleChange(EVENT.activeTabChanged, tab);
    });
    chrome.tabs.onUpdated.addListener((_tabId, _changeInfo, tab) => {
      handleChange(EVENT.tabUpdated, tab);
    });
    chrome.windows.onFocusChanged.addListener(async (window) => {
      if (window === chrome.windows.WINDOW_ID_NONE) {
        handleChange(EVENT.windowFocusChanged, null);
      } else {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        handleChange(EVENT.windowFocusChanged, tab);
      }
    });
  }
  main();
})();
//# sourceMappingURL=index.js.map
