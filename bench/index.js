/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */

const turf = require('@turf/turf')
const Tar = require('tar-js')
const { saveAs } = require('file-saver')

const Benchmark = require('../third_party/benchmark').Benchmark

const { ready, withAstro } = require('../dist/astro')

const {
    generatePolygon,
    generateTranslatedPair,
    tarAppend,
    runAndWaitOnSuite,
    MIN_POLYGON,
    ITER,
    STEP,
} = require('./utils')

function benchmarkArea(feature) {
    return withAstro(feature, (astro) => {
        let temp
        const suite = new Benchmark.Suite()
            .add('astro.area', () => (temp = astro.area()), {
                onCycle() {
                    if (temp) {
                        temp.destroy()
                        temp = null
                    }
                },
            })
            .add('turf.area', () => turf.area(feature))

        return runAndWaitOnSuite(suite)
    })
}

function benchmarkUnion(a, b) {
    return withAstro(a, b, (astroA, astroB) => {
        let temp
        const suite = new Benchmark.Suite()
            .add('astro.union', () => (temp = astroA.union(astroB)), {
                onCycle() {
                    if (temp) {
                        temp.destroy()
                        temp = null
                    }
                },
            })
            .add('turf.union', () => turf.union(a, b))

        return runAndWaitOnSuite(suite)
    })
}

function benchmarkDifference(a, b) {
    return withAstro(a, b, (astroA, astroB) => {
        let temp
        const suite = new Benchmark.Suite()
            .add('astro.difference', () => (temp = astroA.difference(astroB)), {
                onCycle() {
                    if (temp) {
                        temp.destroy()
                        temp = null
                    }
                },
            })
            .add('turf.difference', () => turf.difference(a, b))

        return runAndWaitOnSuite(suite)
    })
}

function benchmarkIntersect(a, b) {
    return withAstro(a, b, (astroA, astroB) => {
        let temp
        const suite = new Benchmark.Suite()
            .add('astro.intersect', () => (temp = astroA.intersect(astroB)), {
                onCycle() {
                    if (temp) {
                        temp.destroy()
                        temp = null
                    }
                },
            })
            .add('turf.intersect', () => turf.intersect(a, b))

        return runAndWaitOnSuite(suite)
    })
}

ready.then(async () => {
    const tape = new Tar()

    // Create polygons of n-size.
    const polygons = []
    const max = MIN_POLYGON + ITER * STEP
    for (let i = MIN_POLYGON; i < max; i += STEP) {
        polygons.push(generatePolygon(i))
    }

    // Area algorithm.
    for (let i = 0; i < polygons.length; i++) {
        const feature = polygons[i]

        console.log(`area-${i}`)
        const result = await benchmarkArea(feature)

        await tarAppend(tape, `area-${i}.json`, JSON.stringify(result))
    }

    // Boolean operations.
    for (let i = 0; i < polygons.length; i++) {
        const a = polygons[i]
        const b = generateTranslatedPair(a)
        /**
         * @type {{ [name: string]: number }}
         */
        let result = {}

        // Benchmark union.

        console.log(`union-${i}`)
        result = await benchmarkUnion(a, b)
        await tarAppend(tape, `union-${i}.json`, JSON.stringify(result))

        // Benchmark difference.

        console.log(`difference-${i}`)
        result = await benchmarkDifference(a, b)
        await tarAppend(tape, `difference-${i}.json`, JSON.stringify(result))

        // Benchmark intersect.

        console.log(`intersect-${i}`)
        result = await benchmarkIntersect(a, b)
        await tarAppend(tape, `intersect-${i}.json`, JSON.stringify(result))
    }

    const blob = new Blob([tape.out], { type: 'data:application/tar;charset=utf-8' })
    saveAs(blob, 'run.tar')
})
