/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */
const Benchmark = require('benchmark').Benchmark
const turf = require('@turf/turf')

const { ready, Astro } = require('../dist/astro')
const generatePolygonN = require('./generatePolygonN')

const fs = require('fs')
const path = require('path')

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

ready.then(async () => {
    // Make directory ahead of time.
    try {
        fs.mkdirSync(path.join(__dirname, 'run'))
    } catch (e) {
        console.warn(e)
    }

    // Create polygons of n-size.
    const polygons = []
    for (let i = 3; i < 200; i += 5) {
        polygons.push(generatePolygonN(i))
    }

    // Benchmark area.
    for (let i = 0; i < polygons.length; i++) {
        const feature = polygons[i]
        const result = await benchmarkArea(feature)

        fs.writeFileSync(path.join(__dirname, 'run', `area-${i}.json`), JSON.stringify(result))
    }

    // Benchmark union.
    for (let i = 0; i < polygons.length - 1; i++) {
        const a = polygons[i]
        const b = polygons[i + 1]
        const result = await benchmarkUnion(a, b)

        fs.writeFileSync(path.join(__dirname, 'run', `union-${i}.json`), JSON.stringify(result))
    }
})
