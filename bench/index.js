/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */
const Benchmark = require('../third_party/benchmark').Benchmark
const turf = require('@turf/turf')

const Tar = require('./tarExtra')

const { ready, Astro } = require('../dist/astro')

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
    const astro = new Astro(feature)
    const suite = new Benchmark.Suite()
        .add('astro.area', () => astro.area())
        .add('turf.area', () => turf.area(feature))

    return runAndWaitOnSuite(suite)
}

function benchmarkUnion(a, b) {
    const astroA = new Astro(a)
    const astroB = new Astro(b)

    const suite = new Benchmark.Suite()
        .add('astro.union', () => astroA.union(astroB))
        .add('turf.union', () => turf.union(a, b))

    return runAndWaitOnSuite(suite)
}

function benchmarkIntersect(a, b) {
    const astroA = new Astro(a)
    const astroB = new Astro(b)

    const suite = new Benchmark.Suite()
        .add('astro.intersect', () => astroA.intersect(astroB))
        .add('turf.intersect', () => turf.intersect(a, b))

    return runAndWaitOnSuite(suite)
}

ready.then(async () => {
    const tape = new Tar()

    // Create polygons of n-size.
    const polygons = []
    const max = MIN_POLYGON + ITER * STEP
    for (let i = MIN_POLYGON; i < max; i += STEP) {
        polygons.push(generatePolygon(i))
    }

    // Benchmark area.
    for (let i = 0; i < polygons.length; i++) {
        const feature = polygons[i]

        console.log(`area-${i}`)
        const result = await benchmarkArea(feature)

        await tarAppend(tape, `area-${i}.json`, JSON.stringify(result))
    }

    // Benchmark union.
    for (let i = 0; i < polygons.length - 1; i++) {
        const a = polygons[i]
        const b = generateTranslatedPair(a)

        console.log(`union-${i}`)
        const result = await benchmarkUnion(a, b)

        await tarAppend(tape, `union-${i}.json`, JSON.stringify(result))
    }

    // Benchmark intersect.
    for (let i = 0; i < polygons.length - 1; i++) {
        const a = polygons[i]
        const b = generateTranslatedPair(a)

        console.log(`intersect-${i}`)
        const result = await benchmarkIntersect(a, b)

        await tarAppend(tape, `intersect-${i}.json`, JSON.stringify(result))
    }
})
