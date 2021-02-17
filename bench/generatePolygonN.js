const { circle } = require('@turf/turf')

const RADIUS_KM = 400

module.exports = (n) => {
    return circle([0, 0], RADIUS_KM, {
        steps: n,
    })
}
