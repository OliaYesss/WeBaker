const { buildProject } = require('./main')

buildProject().then(isError => process.exit(isError ? 1 : 0))
