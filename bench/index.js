/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */
const Benchmark = require('benchmark').Benchmark

const { ready, getModule, Astro } = require('../dist/astro')
const turf = require('@turf/turf')

const data = require('./data')

const [astro, ...astroOthers] = data.features.map((feature) => new Astro(feature))

ready.then(() => {
    console.log(getModule())
    console.log(`Sanity check: ${astro.area()} ${turf.area(data.features[0])}`)

    new Benchmark.Suite()
        .add('astro.area', () => {
            astro.area()
        })
        .add('turf.area', () => {
            turf.area(data.features[0])
        })
        .on('cycle', function (event) {
            console.log(String(event.target))
        })
        .on('complete', function () {
            console.log('Fastest is ' + this.filter('fastest').map('name'))
        })
        .run()

    console.log(`Sanity check: ${astro.union.apply(astro, astroOthers)}`)

    new Benchmark.Suite()
        .add('astro.union', () => {
            astro.union(astroOthers[0])
        })
        .add('turf.union', () => {
            turf.union(data.features[0], data.features[1])
        })
        .on('cycle', function (event) {
            console.log(String(event.target))
        })
        .on('complete', function () {
            console.log('Fastest is ' + this.filter('fastest').map('name'))
        })
        .run()
})
