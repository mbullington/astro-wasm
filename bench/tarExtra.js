const Tar = require('tar-js')

Tar.prototype.appendAsync = function (...args) {
    return new Promise((resolve) => {
        Tar.prototype.append.call(this, ...args, () => resolve())
    })
}

module.exports = Tar
