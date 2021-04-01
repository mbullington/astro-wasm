const Tar = require('tar-js')

const { circle, transformTranslate, getCoords } = require('@turf/turf')

const RADIUS_KM = 400

// Exported parameters for our polygon sizes.
const MIN_POLYGON = 3
const ITER = 20
const STEP = 10

// 90deg north is right.
const RIGHT_DEG = 90

/**
 * Generates an n-sided polygon of a circle.
 *
 * @param {number} n
 */
function generatePolygon(n) {
    return circle([0, 0], RADIUS_KM + RADIUS_KM * (n / (MIN_POLYGON + ITER * STEP)), {
        steps: n,
    })
}

/**
 * Weirdly specific to use for boolean operation benchmarks.
 *
 * Translate right (90deg north) by the radius.
 */
function generateTranslatedPair(polygon) {
    const n = getCoords(polygon)[0].length
    const radius = RADIUS_KM + RADIUS_KM * (n / (MIN_POLYGON + ITER * STEP))

    return transformTranslate(polygon, radius, RIGHT_DEG)
}

/**
 * Appends file to the passed TAR tape.
 *
 * @param {Tar} tape
 * @param {string} name
 * @param {any} data
 * @returns {Promise<Uint8Array>}
 */
function tarAppend(tape, name, data) {
    return new Promise((resolve) => {
        Tar.prototype.append.call(tape, name, data, (array) => resolve(array))
    })
}

/**
 * Runs the current suite and then returns a map with the ops/second of each
 * test.
 *
 * @param {any} suite
 * @returns {Promise<{ [name: string]: number }>} Ops per second.
 */
function runAndWaitOnSuite(suite) {
    return new Promise((resolve, reject) => {
        const opsPerSecond = {}

        suite
            .on('cycle', (event) => {
                const { name, hz } = event.target
                opsPerSecond[name] = hz
            })
            .on('complete', () => {
                // eslint-disable-next-line no-console
                console.log(opsPerSecond)
                resolve(opsPerSecond)
            })
            .on('error', (e) => reject(e))
            .run()
    })
}

module.exports = {
    RADIUS_KM,
    MIN_POLYGON,
    ITER,
    STEP,
    generatePolygon,
    generateTranslatedPair,
    tarAppend,
    runAndWaitOnSuite,
}
