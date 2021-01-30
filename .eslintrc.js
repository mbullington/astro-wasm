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
        _create_linear_ring: 'readonly',
        _push_linear_ring: 'readonly',
        _delete_linear_ring: 'readonly',
        _create_polygon: 'readonly',
        _push_polygon: 'readonly',
        _delete_polygon: 'readonly',
        // area.cpp
        _polygon_area: 'readonly',
    },
})
