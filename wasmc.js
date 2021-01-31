const FLAGS = ['-std=c++11']

// Add include for submodules.
//
// IMPORTANT: For wasmc, the __dirname is mounted to /src for Docker.
const CFLAGS = ['-O3', '-I/src/third_party/geometry.hpp/include']

const LFLAGS = ['-lm']

// Reference:
// https://github.com/rsms/js-wasmc
module({
    name: 'astro',
    out: 'dist/astro.js',
    jsentry: 'src/index.js',
    sources: ['src/*.cpp', 'third_party/martinez/*.cpp'],
    cflags: [...FLAGS, ...CFLAGS],
    lflags: [...FLAGS, ...LFLAGS],
    // Node.js only options.
    target: 'node',
    embed: true,
})
