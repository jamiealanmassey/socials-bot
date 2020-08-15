// Grab libraries
var Discord = require('discord.js')
var logger = require('winston')

// Grab authorisation data and initialise discord.js
const token = require('./token.json')
const client = new Discord.Client();

// Configure logger settings
logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console, { colorize: true })
logger.level = 'debug'

client.on('ready', () => {
    logger.info('Connected')
    logger.info('Logged in as: ')
    logger.info(`${bot.username} - (${bot.id})`)
})

client.on('message', function(user, userID, channelID, message, evt) {
    logger.info(`${bot.username} - user is ${user}`)
    logger.info(`${bot.username} - userID is ${userID}`)
    logger.info(`${bot.username} - channelID is ${channelID}`)
    logger.info(`${bot.username} - message is [${message}]`)
    logger.info(`${bot.username} - event is ${evt}`)
})
