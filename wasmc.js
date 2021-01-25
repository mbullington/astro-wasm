// Reference:
// https://github.com/rsms/js-wasmc
module({
    name: 'astro',
    out: 'dist/astro.js',
    jsentry: 'src/index.js',
    sources: 'src/*.cpp',
    cflags: ['--bind'],
})
