// constants
const OVERRUSTLE_URL = 'https://overrustlelogs.net/Destinygg%20chatlog'
const MAX_BANNED_USER_MESSAGES = 5
const BANNED_DAYS = 5

// imports
const https = require('https')

module.exports.handler = async (event, context) => {
  const promiseArr = []

  for (let i = 0; i < BANNED_DAYS; i++) {
    promiseArr.unshift(getLogs(i))
  }

  const logsArr = await Promise.all(promiseArr)
  const logs = [].concat.apply([], logsArr)
  const segments = parseLogs(logs)

  return {
    headers: { 'Access-Control-Allow-Origin': '*' },
    statusCode: 200,
    body: JSON.stringify(segments),
  };
}

function getLogs(daysBack = 0) {
  return new Promise(resolve => {
    const date = new Date()

    date.setDate(date.getDate() - daysBack)

    const month = getMonthName(date)
    const year = date.getFullYear()
    const urlDate = date.toISOString().split('T')[0]
    const url = `${OVERRUSTLE_URL}/${month}%20${year}/${urlDate}.txt`

    https.get(url, resp => {
      let data = ''

      resp.on('data', chunk => data += chunk)
      resp.on('end', () => resolve(parseLogString(data)))
    })
  })
}

function parseLogString(logString) {
  const outputArr = logString.split('\n')

  // remove empty line
  outputArr.pop()

  return outputArr
}

function parseLogs(logs) {
  const outputArr = []
  const logMap = {}

  logs.forEach(message => {
    const [user] = message.match(/(?<=\] ).+?(?=:)/)

    // add message to log map
    if (!logMap[user]) logMap[user] = []
    logMap[user].push(message)

    // check if destiny
    const isDestiny = user === 'Destiny'
    if (!isDestiny) return

    // check if ban command
    const isBan = message.indexOf('!ipban') > -1
    if (!isBan) return

    // get banned user
    const banUser = message.split(' ')[6]
    if (!banUser) return

    // banned user has messages
    const hasMessages = logMap[banUser]
    if (!hasMessages) return

    // add ban object to output array
    const banObj = getBanObj(banUser, message, logMap)
    outputArr.unshift(banObj)
  })

  return outputArr
}


function getBanObj(user, banMessage, logMap) {
  // build ban object
  const [, date] = banMessage.match(/\[(.*?)\]/)
  const duration = banMessage.split(' ')[5]
  const reason = banMessage.split(' ').splice(7).join(' ')
  const banObj = { user, reason, duration, date, messages: [] }

  // add last 5 messages from banned user
  for (let i = 0; i < MAX_BANNED_USER_MESSAGES && i < logMap[user].length; i++) {
    const message = logMap[user][i]

    banObj.messages.push({
      time: message.match(/\[(.*?)\]/)[1],
      message: message.split(' ').splice(4).join(' ')
    })
  }

  return banObj
}

function getMonthName(date) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return monthNames[date.getMonth()]
}
