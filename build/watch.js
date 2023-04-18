const fs = require('fs')
const { buildProject, SRC_PATH } = require('./main')


function debounce(func, timeout) {
  let timer

  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => { func.apply(this, args) }, timeout)
  }
}

function watch() {
  const debouncedBuildProject = debounce(buildProject, 1000)

  buildProject() 
  
  fs.watch(SRC_PATH, { recursive: true }, () => {
    debouncedBuildProject()
  })
}

watch()
