const FLAGS = ['-std=c++11']

// Reference:
// https://github.com/rsms/js-wasmc
module({
    name: 'astro',
    out: 'dist/astro.js',
    jsentry: 'src/index.js',
    sources: 'src/*.cpp',
    cflags: FLAGS,
    lflags: FLAGS,
    // Node.js only options.
    target: 'node',
    embed: true,
})
