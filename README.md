# Webaker

#### Video Demo: https://youtu.be/qOi5OgXIM2w

#### Description:

Webaker is a simple and helpful Chrome Extension that helps reduce time spent on social sites and improve your effectiveness throughout the day. It keeps track of allowed daily usage time and visualizes your activity on websites that take your attention too frequently.
So it will be beneficial if you love wasting time on websites like Instagram, Facebook, Twitter, or YouTube.

Allowed Daily Usage Time is set to 30 mins per day. If you overspend Allowed Daily Usage Time, Webaker will notify you. Default websites are ready to be tracked. You don't need to adjust them only if you want to.

##### Features

###### Setup Page:
On the Setup Page, you can Find Switcher for quick tracking setup. And you are ready to go!

Also, here you can find Displaying of Daily Usage Time just for quick access and understanding of how much time did you spent today on a particular site. If You would like to clear your daily usage data, You can easily do this by simply clicking on the "Clear Daily Usage Data" button. You can find it at the footing of our Extension popup.

###### Settings page:
30 mins of Allowed Daily Usage Time per site can be changed on this page. So, it can be can be arranged for your goals and needs.
Only active sites can be displayed on this page (this can be managed from the Setup page by Switcher).

A new site can be added for further tracking via the “Add New Site” button. You should name it and add a domain. An added site can be edited via the “Edit” button and can be removed from the list via the “Trash” button.

###### Dashboard page:
On this page you can find a list of sites with Weekly Usage sorted in DESC order for a better experience.

If You would like to start from scratch one day you can do this by simply clicking on the “Clear Weekly Usage Data” button.

Here you can see an Explore Usage (chart icon) that leads to a chart with visualized information about a particular site.
The chart “Explore Usage” displays data for the last seven days.

##### Development:

###### How to install:
```bash
$ npm install --force
```

###### How to build:
```bash
$ npm run build
```


###### How to develop:
```bash
$ npm run watch
```

##### Installation
1. Build extension or copy `/dist` folder locally
2. Open `chrome://extensions/`
3. Click on the tooggle to enable `Developer mode` on right in the nav bar
4. Click on the `Load unpack` and find `/dist` folder locally
5. Click on `manifest.json` inside this folder
6. Enjoy extension!

##### App architecture
The application contains three endpoints for `extension background service worker` (`./src/bg/index.js`), `content script` (`./src/cs/index.js`), and `extension popup` (`./src/popup/index.js`).

Also, the application consists of two endpoints to build an app:
- `./build/build.js` - to build a web extension app
- `./build/watch.js` - to build an app during development. Script listen for changes inside `src` folder and call `build` function on each change.

##### Background Service Worker
Extension background service worker responsible for tracking users' time on particular websites. It listens when the user uses a browser and goes to different websites and when the user opens followed sites, it tracks session time on them.

##### Content Script
Extension content script responsible for notifying a user about overspending of Allowed Daily Usage Time on the particular website.

##### Extension Popup
Extension Popup is the place where user can set up an extension, see usage statistics and manage extension.

##### Technologies
1. `Node.JS` - used for building application (use file systems and path modules).
2. `Esbuild` - used to build application to be compatible to run in the browser.
3. `React` - used for UI in `content script `and `extension settings popup`.
4. `Chartist` - used to build a graphic of weekly usage.
5. `Chrome extension APIs` - used to track user activities in browser.
