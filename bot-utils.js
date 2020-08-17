const date = require('date-and-time')

const logify = function (message) {
    const now = new Date()
    const formatted = date.format(now, 'DD/MM/YY-HH:mm:ss')
    return `[${formatted}] ${message}`
}

module.exports = {
    logify
}
