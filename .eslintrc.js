const config = require('eslint-config-mbullington')({
    typescript: false,
    graphql: false,
    react: false,
    vue: false,
})

module.exports = Object.assign(config, {
    globals: {
        Module: 'readonly',
        // geometry.cpp
        _create_linestring: 'readonly',
        _push_linestring: 'readonly',
        _delete_linestring: 'readonly',
        _create_polygon: 'readonly',
        _push_polygon: 'readonly',
        _delete_polygon: 'readonly',
        // area.cpp
        _polygon_area: 'readonly',
    },
})
