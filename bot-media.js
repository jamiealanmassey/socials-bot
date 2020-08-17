const fetch = require('node-fetch')
const path = require('path')
const fs = require('fs')

const botUtils = require('./bot-utils')

const download = async function(url) {
    botUtils.logify(`Downloading image ${url}`)
    const result = await fetch(url)
    const stream = fs.createWriteStream('./media/' + path.basename(url))
    await new Promise((resolve, reject) => {
        result.body.pipe(stream)
        result.body.on('error', (err) => {
            reject(err)
        })

        stream.on('finish', () => {
            resolve()
        })
    })
}

const downloadBatch = async function(urls) {
    const downloadPromises = []
    for (var i = 0; i < urls.length; i++) {
        downloadPromises.push(download(urls[i]))
    }

    return Promise.all(downloadPromises)
}

const retrieve = function(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, { encoding: 'base64' }, (error, data) => {
            if (error) {
                reject(error)
            } else {
                botUtils.logify(`Successfully retrieved ${file} from file system.`)
                resolve(data)
            }
        })
    })
}

const retrieveAllAsync = function(filesDir, files) {
    let retrievalPromises = []
    files.forEach(file => {
        retrievalPromises.push(retrieve(filesDir + file))
    })

    return Promise.all(retrievalPromises)
}

const retrieveAll = function(filesDir) {
    return new Promise((resolve, reject) => {
        fs.readdir(filesDir, (error, files) => {
            if (error) {
                reject(error)
            } else {
                retrieveAllAsync(filesDir, files)
                    .then(results => { 
                        resolve(results)
                    })
                    .catch(error => { 
                        reject(error)
                    })
            }
        })
    })
}

const flushAll = function(filesDir) {
    return new Promise((resolve, reject) => {
        fs.readdir(filesDir, (error, files) => {
            if (error) {
                reject(error)
            } else {
                files.forEach(item => {
                    botUtils.logify(`Cleaning up file ${item}`)
                    fs.unlinkSync(filesDir + item)
                })
                resolve()
            }
        })
    })
}

module.exports = {
    download,
    downloadBatch,
    retrieve,
    retrieveAll,
    flushAll
}
