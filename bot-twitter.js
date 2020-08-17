const botMedia = require('./bot-media')
const botUtils = require('./bot-utils')
const socials = require('./socials.json')

const Twit = require('twit')

var clientTwitter = new Twit({
    consumer_key: process.env.twitter_consumer_key,
    consumer_secret: process.env.twitter_consumer_secret, 
    access_token: process.env.twitter_access_token_key,
    access_token_secret: process.env.twitter_access_token_secret,
    timeout_ms: 30*1000,
    strictSSL: true
})

const uploadMedia = function(mediaData) {
    return new Promise((resolve, reject) => {
        clientTwitter.post('media/upload', {
            media_data: mediaData
        })
        .then((result) => {
            botUtils.logify(`Twitter created media id from uploaded media`)
            botUtils.logify(`Twitter media id is ${result.data.media_id_string}`)
            resolve(result.data.media_id_string)
        })
        .catch((error) => {
            reject(error)
        })
    })
}

const uploadMediaBatch = async function(mediaDatas) {
    const mediaPromises = []
    for (var i = 0; i < mediaDatas.length; i++) {
        mediaPromises.push(uploadMedia(mediaDatas[i]))
    }

    return Promise.all(mediaPromises)
}

const update = function(status, media_ids) {
    return new Promise((resolve, reject) => {
        clientTwitter.post('statuses/update', {
            status: status,
            media_ids: media_ids
        },
        (error, tweet, response) => {
            if (error) {
                reject(error)
            } else {
                botUtils.logify(`Tweet was successfully sent!`)
                botUtils.logify(`Tweet content was ${response.text}`)
                resolve(tweet, response)
            }
        })
    })
}

const updateWithMedia = function(statusText) {
    return new Promise((resolve, reject) => {
        botMedia.retrieveAll('./media/')
            .then((results) => {
                uploadMediaBatch(results)
                    .then((resultMediaIDs) => {
                        botUtils.logify(resultMediaIDs)
                        update(statusText, resultMediaIDs)
                        .then((tweet, response) => {
                            resolve(tweet, response)
                        })
                        .catch((error) => {
                            reject(error)
                        })
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
            .catch((error) => {
                reject(error)
            })
    })
}

module.exports = {
    uploadMedia,
    uploadMediaBatch,
    update,
    updateWithMedia
}
