const FLAGS = ['-std=c++11']

// Add include for submodules.
//
// IMPORTANT: For wasmc, the __dirname is mounted to /src for Docker.
const CFLAGS = ['-I/src/geometry.hpp/include', '-I/src/wagyu/include']

// Reference:
// https://github.com/rsms/js-wasmc
module({
    name: 'astro',
    out: 'dist/astro.js',
    jsentry: 'src/index.js',
    sources: 'src/*.cpp',
    cflags: [...FLAGS, ...CFLAGS],
    lflags: FLAGS,
    // Node.js only options.
    target: 'node',
    embed: true,
})
