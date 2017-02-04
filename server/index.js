require('dotenv').load()

const chalk = require('chalk')
const app = require('./app')

const host = process.env.HOST
const port = process.env.SERVER_PORT
const server = app.listen(port)

chalk.enabled = true

server.on('listening', () =>
  console.log(chalk.green('[Server]'), chalk.yellow(`Application started at http://${host}:${port}`))
)
