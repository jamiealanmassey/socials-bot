// Grab libraries
const Discord = require('discord.js')
const date = require('date-and-time')

// Grab authorisation data and initialise discord.js
const config = require('./config.json')
const socials = require('./socials.json')
const client = new Discord.Client();

function logify(message) {
    const now = new Date()
    const formatted = date.format(now, 'DD/MM/YY-HH:mm:ss')
    return `[${formatted}] ${message}`
}

client.on('ready', () => {
    console.log(logify('Successfully connected to server'))
})

client.on('message', message => {
    if (message.member.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
        if (message.content.charAt(0) === '!') {
            const parsed = message.content.split(' ')
            if (parsed.length >= 2) {
                if (parsed[0] === 'focus') {
                    // TODO: set config to focus this channel instead
                }
            }
        }
        else {
            var images = []
            var imageExpr = /(http?s:\/\/)+(.*)\.(jpe?g|png|gif|bmp)+/gi
            var result = message.content.replace(imageExpr, function(x) {
                images.push(x)
                return ''
            })

            console.log(logify('-- RECEIEVED MESSAGE --'))
            console.log(logify(message.content.trim()))
            console.log(logify('-- TRANSFORMED MESSAGE --'))
            console.log(logify(result.trim()))
            console.log(logify('-- FOUND IMAGE LINKS --'))
            images.forEach(elem => console.log(logify(elem)))
            console.log(logify(''))
        }
    }
})

client.login(config.bot_token)
