const { circle } = require('@turf/turf')

const RADIUS_KM = 400

module.exports = (n) => {
    return circle([0, 0], RADIUS_KM + RADIUS_KM * n, {
        steps: n,
    })
}

module.exports.RADIUS_KM = RADIUS_KM
