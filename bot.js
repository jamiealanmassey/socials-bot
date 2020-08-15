// Grab libraries
const Discord = require('discord.js')
const date = require('date-and-time')

// Grab authorisation data and initialise discord.js
const config = require('./config.json')
const socials = require('./socials.json')

const client = new Discord.Client();
const hearts = [
    config.bot_status_emoji.pass,
    config.bot_status_emoji.success,
    config.bot_status_emoji.success_warning,
    config.bot_status_emoji.failure
]

function logify(message) {
    const now = new Date()
    const formatted = date.format(now, 'DD/MM/YY-HH:mm:ss')
    return `[${formatted}] ${message}`
}

function postTwitter(message, images) {
    return 3
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
            }).trim()

            console.log(logify('-- RECEIEVED MESSAGE --'))
            console.log(logify(message.content.trim()))
            console.log(logify('-- TRANSFORMED MESSAGE --'))
            console.log(logify(result))
            console.log(logify('-- FOUND IMAGE LINKS --'))
            images.forEach(elem => console.log(logify(elem)))
            console.log(logify(''))

            const now = new Date()
            const formattedDate = date.format(now, 'DD/MM/YYYY')

            const resultTwitterStatus = hearts[postTwitter(result.trim(), images)]
            const resultFacebookStatus = hearts[0]
            const resultTwitter = `${resultTwitterStatus}_Twitter_`
            const resultFacebook = `${resultFacebookStatus}_Facebook_`
            const resultMsg = `**${config.bot_update_header} - ${formattedDate}**\n${message.content}\n\n**Social Channel Post Status**\n${resultTwitter}\n${resultFacebook}\n\n`
            message.channel.send(resultMsg)
            message.delete()
                .then(msg => console.log(logify(`Relayed social update sent by ${msg.author.username} to all social channels`)))
                .catch(console.log(logify(console.error)))
        }
    }
})

client.login(config.bot_token)
