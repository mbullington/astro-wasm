export const ready = Module.ready

export function area(geojson) {
    // TODO: We assume this is a Polygon.
    const coordinates = geojson.geometry.coordinates

    let i = 0
    const polygonPtr = _create_polygon()
    for (; i < coordinates.length; i++) {
        const ring = coordinates[i]

        // Per ring.
        const ringPtr = _create_linestring()
        let j = 0
        for (; j < ring.length; j++) {
            const lngLat = ring[j]
            _push_linestring(ringPtr, lngLat[0], lngLat[1])
        }

        _push_polygon(polygonPtr, ringPtr)
    }

    const result = _polygon_area(polygonPtr)

    // Cleanup.
    _delete_polygon(polygonPtr)
    return result
}
