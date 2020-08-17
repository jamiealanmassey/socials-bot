// Grab libraries
const Discord = require('discord.js')
const date = require('date-and-time')

const botUtils = require('./bot-utils')
const botMedia = require('./bot-media')
const botTwitter = require('./bot-twitter')

// Grab authorisation data and initialise discord.js
const config = require('./config.json')

const client = new Discord.Client();
const hearts = [
    config.bot_status_emoji.pass,
    config.bot_status_emoji.success,
    config.bot_status_emoji.success_warning,
    config.bot_status_emoji.failure
]

client.on('ready', () => {
    console.log(botUtils.logify('Successfully connected to server'))
    /*botMedia.downloadBatch([
        'https://images.gog-statics.com/99707f6415785f01a466ea80d8ade4ae215673f24cf708def9fdea373127e5f2_product_card_v2_mobile_slider_639.jpg',
        'https://images.gog-statics.com/e328d7a664292e21d6d78d097b7822c20751c162ea0baa8199d1ffd03aa639af_product_card_v2_mobile_slider_639.jpg'
    ])
    .then(() => { 
        console.log(botUtils.logify('Successfully downloaded image')) 
    })
    .catch((error) => { 
        console.log(botUtils.logify('Encountered one or more error when downloading images in batch')) 
        console.log(botUtils.logify(`Error was ${error}`))
    })*/

    /*botMedia.retrieveAll('./media/')
        .then(data => {
            if (data) {
                console.log(botUtils.logify(`Successfully retrieved ${data.length} images`))
                data.forEach(image => { console.log(botUtils.logify(`Successful image data is ${sizeof(image)} bytes in size`)) })
            }
        })
        .catch(error => {
            console.log(botUtils.logify('Encountered one or more error when retrieving images in batch')) 
            console.log(botUtils.logify(`Error was ${error}`))
        })*/

    /*botMedia.retrieveAll('./media/')
        .then(mediaDatas => {
            botTwitter.uploadMediaBatch(mediaDatas)
                .catch(error => console.log(botUtils.logify(`Errored with ${JSON.stringify(error)}`)))
        })*/
    
   /* botMedia.retrieve('./media/e328d7a6642922c20751c162ea0baa8199d1ffd03aa639af_product_card_v2_mobile_slider_639.jpg')
        .then(data => {
            botTwitter.uploadMedia(data)
                .catch(error => console.log(botUtils.logify(`Errored with ${JSON.stringify(error)}`)))
        })*/

    /*botTwitter.update('This is a test status')
        .then(() => { console.log(botUtils.logify(`Successfully executed Twitter algorithm`)) })
        .catch((error) => { 
            console.log(botUtils.logify(`Errored with ${JSON.stringify(error)}`))
        })*/

    /*botTwitter.updateWithMedia('This is a test status')
        .then(() => { console.log(botUtils.logify(`Successfully executed Twitter algorithm`)) })
        .catch((error) => {
            console.log(botUtils.logify(`Errored with ${JSON.stringify(error)}`))
        })*/
})

client.on('message', message => {
    if (message.member.hasPermission(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
        var messageTrimmed = message.content.trim()
        var messageSplit = messageTrimmed.split('\n')
        var commands = new Map()
        var commandEnds = 0
        var commandName = ''//item.substr(0, commandEnds - 1)
        var commandContents = ''//item.substr(commandEnds)
        var commandTryFlush = function() {
            if (commandName !== '') {
                if (!commands.get(commandName)) {
                    commands.set(commandName, [])
                }

                commands.get(commandName).push(commandContents)
                commandEnds = 0
                commandName = ''
                commandContents = ''
            }
        }

        messageSplit.forEach(item => {
            if (item.startsWith('!')) {
                commandTryFlush()
                commandEnds = item.indexOf(' ')
                commandName = item.substr(0, commandEnds)
                commandContents += item.substr(commandEnds + 1)
            } else {
                commandContents += item === '' ? '\n\n' : item
            }
        })

        commandTryFlush()
        var retrieveFirstContents = function(commandName) {
            let element = commands.get(commandName)
            return element ? element[0] : ''
        }

        var retrieveMedia = function() {
            let imageExpr = /(http?s:\/\/)+(.*)\.(jpe?g|png|gif|bmp)+/gi
            let medias = commands.get('!media')
            let mediaResult = ''
            if (medias) {
                mediaResult += '_**MEDIA ATTACHMENTS**_\n'
                medias.forEach(item => { mediaResult += item.match(imageExpr) ? `${item}\n` : '' })
            }

            return mediaResult
        }

        var retrieveSocials = function() {
            var socialsResult = ''
            socialsResult += `${hearts[0]}Twitter\n`
            socialsResult += `${hearts[0]}Development Blog\n`
            return socialsResult
        }

        var retrieveSocials2 = function() {
            var socialsResult = ''
            socialsResult += `${hearts[1]}Twitter\n`
            socialsResult += `${hearts[0]}Development Blog\n`
            return socialsResult
        }

        var retrieveSocials3 = function() {
            var socialsResult = ''
            socialsResult += `${hearts[1]}Twitter\n`
            socialsResult += `${hearts[2]}Development Blog\n`
            return socialsResult
        }

        var retrievePings = function() {
            var pingsResult = ''
            var pings = commands.get('!ping')
            if (pings) {
                pingsResult += '_**BROADCASTED MENTIONS**_\n'
                pings.forEach(item => { pingsResult += `@${item} ` })
            }
            
            return pingsResult
        }

        const now = new Date()
        const formattedDate = date.format(now, 'DD/MM/YYYY')
        const resultData = {
            message: null,
            title: `:rotating_light: **${retrieveFirstContents('!title')} - ${formattedDate}**  :rotating_light:`,
            content: `${retrieveFirstContents('!content')}`,
            media: `${retrieveMedia()}`,
            socials: `_**SOCIAL CHANNELS STATUS**_\n${retrieveSocials()}`,
            pings: `${retrievePings()}`,
            compiled: function() {
                return `${this.title}\n${this.content}${this.media}\n${this.socials}\n${this.pings}`
            }
        }

        var execute = (async () => {
            if (commands.get('!content')) {
                message.channel.send(resultData.compiled())
                    .then(message => {
                        resultData.message = message
                        setTimeout(() => {
                            if (resultData.message) {
                                resultData.socials = `_**SOCIAL CHANNELS STATUS**_\n${retrieveSocials2()}`
                                resultData.message.edit(resultData.compiled())
                            }
                        }, 5000)

                        setTimeout(() => {
                            if (resultData.message) {
                                resultData.socials = `_**SOCIAL CHANNELS STATUS**_\n${retrieveSocials3()}`
                                resultData.message.edit(resultData.compiled())
                            }
                        }, 7500)
                    })
                    .catch(error => { console.log(error) })
            }
        })()

        message.delete()
            .then(msg => console.log(botUtils.logify(`Relayed social update sent by ${msg.author.username} to all social channels`)))
            .catch(console.log(botUtils.logify(console.error)))
    }
})

client.login(config.bot_token)
