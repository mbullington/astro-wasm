const DEBUG = false
// const DEBUG = true

const SIMD = false
// const SIMD = true

const FLAGS = ['-std=c++11', '-s ALLOW_MEMORY_GROWTH=1']
if (!DEBUG) {
    FLAGS.push('-O3')
    FLAGS.push('-flto')
    FLAGS.push('-ffast-math')
} else {
    FLAGS.push('-O0')
    FLAGS.push('--profiling')
}

if (SIMD) {
    FLAGS.push('-msimd128')
}

// Add include for submodules.
//
// IMPORTANT: For wasmc, the __dirname is mounted to /src for Docker.
const CFLAGS = ['-I/src/third_party/geometry.hpp/include']

const LFLAGS = ['-lm']

// Reference:
// https://github.com/rsms/js-wasmc

const common = {
    jsentry: 'src/index.js',
    sources: ['src/*.cpp', 'third_party/martinez/*.cpp'],
    cflags: [...FLAGS, ...CFLAGS],
    lflags: [...FLAGS, ...LFLAGS],
}

// Available as window.astro
module({
    ...common,
    name: 'astro',
    out: 'dist/astro.js',
})

// ES module.
module({
    ...common,
    name: 'astro-es',
    out: 'dist/astro.es.js',
    outwasm: 'dist/astro.wasm',
    format: 'es',
})

// Node.js
module({
    ...common,
    name: 'astro-node',
    out: 'dist/astro.node.js',
    target: 'node',
    embed: true,
})
