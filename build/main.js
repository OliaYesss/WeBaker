const { build } = require('esbuild')
const path = require('path')
const fs = require('fs')

const DIST_PATH = path.join(__dirname, '../dist')
const SRC_PATH = path.join(__dirname, '../src')

function getFilePaths(pathToFile) {
  return {
    input: path.join(SRC_PATH, pathToFile),
    output: path.join(DIST_PATH, pathToFile)
  }
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = exists && stats.isDirectory()
  
  if (isDirectory) {
    fs.mkdirSync(dest)
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      )
    })
  } else {
    fs.copyFileSync(src, dest)
  }
}

const PATHS = {
  popup: {
    js: getFilePaths('/popup/index.js'),
    css: getFilePaths('/popup/index.css'),
    html: getFilePaths('/popup/index.html')
  },
  cs: {
    js: getFilePaths('/cs/index.js'),
    css: getFilePaths('/cs/index.css')
  },
  bg: {
    js: getFilePaths('/bg/index.js')
  },
  manifest: getFilePaths('/manifest.json'),
  static: getFilePaths('/static')
}

function getScriptBuildConfig(filePaths) {
  return {
    entryPoints: [filePaths.input],
    bundle: true,
    sourcemap: true,
    loader: {
      '.js': 'jsx',
      '.woff2': 'dataurl',
      '.woff': 'dataurl'
    },
    outfile: filePaths.output
  }
}

const BUILD_SCRIPT_CONFIG_LIST = [
  getScriptBuildConfig(PATHS.popup.js),
  getScriptBuildConfig(PATHS.cs.js),
  getScriptBuildConfig(PATHS.bg.js)
]

const COPY_FILE_LIST = [
  // PATHS.popup.css,
  // PATHS.cs.css,
  PATHS.popup.html,
  PATHS.manifest
]

async function main() {
  let isError = false

  fs.rmSync(DIST_PATH, { recursive: true, force: true })

  for (const config of BUILD_SCRIPT_CONFIG_LIST) {
    try {
      await build(config)
    } catch (err) {
      isError = true
      console.log(err)
    }
  }

  for (const filePaths of COPY_FILE_LIST) {
    fs.copyFileSync(filePaths.input, filePaths.output)
  }

  copyRecursiveSync(PATHS.static.input, PATHS.static.output)

  console.log(`[${new Date().toLocaleTimeString()}] Project was build!`)

  return isError
}

exports.buildProject = main
exports.SRC_PATH = SRC_PATH
