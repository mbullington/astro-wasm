/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */
const Benchmark = require('../third_party/benchmark').Benchmark
const turf = require('@turf/turf')

const Tar = require('./tarExtra')

const { ready, Astro } = require('../dist/astro')
const generatePolygonN = require('./generatePolygonN')

function benchmarkArea(feature) {
    return new Promise((resolve, reject) => {
        const astro = new Astro(feature)
        const opsPerSecond = {}

        new Benchmark.Suite()
            .add('astro.area', () => astro.area())
            .add('turf.area', () => turf.area(feature))
            .on('cycle', (event) => {
                const { name, hz } = event.target
                opsPerSecond[name] = hz
            })
            .on('complete', () => resolve(opsPerSecond))
            .on('error', (e) => reject(e))
            .run()
    })
}

function benchmarkUnion(a, b) {
    return new Promise((resolve, reject) => {
        const astroA = new Astro(a)
        const astroB = new Astro(b)

        const opsPerSecond = {}

        new Benchmark.Suite()
            .add('astro.union', () => astroA.union(astroB))
            .add('turf.union', () => turf.union(a, b))
            .on('cycle', (event) => {
                const { name, hz } = event.target
                opsPerSecond[name] = hz
            })
            .on('complete', () => resolve(opsPerSecond))
            .on('error', (e) => reject(e))
            .run()
    })
}

function benchmarkIntersect(a, b) {
    return new Promise((resolve, reject) => {
        const astroA = new Astro(a)
        const astroB = new Astro(b)

        const opsPerSecond = {}

        new Benchmark.Suite()
            .add('astro.intersect', () => astroA.intersect(astroB))
            .add('turf.intersect', () => turf.intersect(a, b))
            .on('cycle', (event) => {
                const { name, hz } = event.target
                opsPerSecond[name] = hz
            })
            .on('complete', () => resolve(opsPerSecond))
            .on('error', (e) => reject(e))
            .run()
    })
}

ready.then(async () => {
    const tape = new Tar()

    // Create polygons of n-size.
    const polygons = []
    for (let i = 3; i < 202; i += 10) {
        polygons.push(generatePolygonN(i))
    }

    // Benchmark area.
    for (let i = 0; i < polygons.length; i++) {
        const feature = polygons[i]

        console.log(`area-${i}`)
        const result = await benchmarkArea(feature)

        console.log(result)
        await tape.appendAsync(`area-${i}.json`, JSON.stringify(result))
    }

    // Benchmark union.
    for (let i = 0; i < polygons.length - 1; i++) {
        const a = polygons[i]
        const b = turf.transformTranslate(polygons[i + 1], 20, 90)

        console.log(`union-${i}`)
        const result = await benchmarkUnion(a, b)

        await tape.appendAsync(`union-${i}.json`, JSON.stringify(result))
    }

    // Benchmark intersect.
    for (let i = 0; i < polygons.length - 1; i++) {
        const a = polygons[i]
        const b = turf.transformTranslate(polygons[i + 1], 20, 90)

        console.log(`intersect-${i}`)
        const result = await benchmarkIntersect(a, b)

        await tape.appendAsync(`intersect-${i}.json`, JSON.stringify(result))
    }
})
