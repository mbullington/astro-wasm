/* eslint-disable no-magic-numbers */
const { ready, area } = require('./dist/astro')

const feature = {
    type: 'Feature',
    properties: {},
    geometry: {
        type: 'Polygon',
        coordinates: [
            [
                [56.407465808, 56.070662718],
                [46.675541374, 73.401268724],
                [-0.074070487, 68.079327429],
                [6.364498811, 46.099017775],
                [56.407465808, 56.070662718],
            ],
        ],
    },
}

// eslint-disable-next-line no-console
ready.then((module) => {
    console.log(area(feature))
})
