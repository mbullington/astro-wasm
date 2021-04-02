export const ready = Module.ready

export const getModule = () => Module

export class AstroError extends Error {
    constructor(...args) {
        super(...args)
        this.type = 'AstroError'
    }
}

// Define bindings for GeoJSON geometry types.
const GEOMETRIES = {
    Polygon: {
        create(coordinates) {
            let i = 0
            const polygonPtr = _create_polygon()
            for (; i < coordinates.length; i++) {
                const ring = coordinates[i]

                // Per ring.
                const ringPtr = _create_linear_ring()
                let j = 0
                for (; j < ring.length; j++) {
                    const lngLat = ring[j]
                    _push_linear_ring(ringPtr, lngLat[0], lngLat[1])
                }

                _push_polygon(polygonPtr, ringPtr)
                // Destroy since _push_polygon has copied the contents into new memory.
                _delete_linear_ring(ringPtr)
            }

            return polygonPtr
        },
        toGeoJSON(ptr) {
            // TODO:
            const coordinates = []

            return {
                type: 'Polygon',
                coordinates,
            }
        },
        destroy(ptr) {
            _delete_polygon(ptr)
        },
    },
    MultiPolygon: {
        create(coordinates) {
            const createPolygon = GEOMETRIES.Polygon.create
            const destroyPolygon = GEOMETRIES.Polygon.destroy

            let i = 0
            const multiPolygonPtr = _create_multi_polygon()
            for (; i < coordinates.length; i++) {
                const polygon = coordinates[i]
                const polygonPtr = createPolygon(polygon)

                _push_multi_polygon(multiPolygonPtr, polygonPtr)
                // Destroy since _push_multi_polygon has copied the contents into new memory.
                destroyPolygon(polygon)
            }

            return multiPolygonPtr
        },
        toGeoJSON(ptr) {
            // TODO:
            const coordinates = []

            return {
                type: 'MultiPolygon',
                coordinates,
            }
        },
        destroy(ptr) {
            _delete_multi_polygon(ptr)
        },
    },
}

export class Astro {
    /**
     * Creates Astro from internal pointer representation.
     *
     * @param {number} ptr
     * @param {string} type Either Polygon or MultiPolygon.
     * @returns {Astro}
     */
    static fromPtr(ptr, type) {
        const newObj = Object.create(Astro.prototype)

        Object.assign(newObj, {
            ptr,
            type: type || 'Polygon',
            properties: {},
        })

        return newObj
    }

    /**
     * Create new Astro instance from GeoJSON object.
     *
     * @param {object} geojson
     */
    constructor(geojson) {
        // FIXME:
        if (geojson.type === 'FeatureCollection') {
            throw new AstroError("Astro currently doesn't support FeatureCollection")
        }

        let geometry
        let properties = {}
        // Support both features and geometries directly.
        if (geojson.type === 'Feature') {
            geometry = geojson.geometry
            properties = geojson.properties
        } else {
            geometry = geojson
        }

        const { type, coordinates } = geometry

        // ### CLASS PROPERTIES ###

        this.type = type
        this.properties = properties
        // Initialized below based on geometry type.
        this.ptr = undefined

        // ### INITIALIZE POINTER ###

        if (!GEOMETRIES[type]) {
            throw new AstroError("Astro currently doesn't support all geometries")
        }

        this.ptr = GEOMETRIES[type].create(coordinates)
    }

    /**
     * Cleanup pointers when done. **Must** be called for any derivative functions right now.
     */
    destroy() {
        const { type, ptr } = this
        GEOMETRIES[type].destroy(ptr)
    }

    area() {
        const { type, ptr } = this

        if (type === 'MultiPolygon') {
            return _polygon_area_multi(ptr)
        }
        return _polygon_area(ptr)
    }

    union(other) {
        let ptr1 = this.ptr
        let ptr2 = other.ptr
        // Normalize as MultiPolygons.
        if (this.type === 'Polygon') {
            const polygonPtr = ptr1
            ptr1 = _create_multi_polygon()
            _push_multi_polygon(ptr1, polygonPtr)
        }
        if (other.type === 'Polygon') {
            const polygonPtr = ptr2
            ptr2 = _create_multi_polygon()
            _push_multi_polygon(ptr2, polygonPtr)
        }

        return Astro.fromPtr(_polygon_union(ptr1, ptr2), 'MultiPolygon')
    }

    difference(other) {
        let ptr1 = this.ptr
        let ptr2 = other.ptr
        // Normalize as MultiPolygons.
        if (this.type === 'Polygon') {
            const polygonPtr = ptr1
            ptr1 = _create_multi_polygon()
            _push_multi_polygon(ptr1, polygonPtr)
        }
        if (other.type === 'Polygon') {
            const polygonPtr = ptr2
            ptr2 = _create_multi_polygon()
            _push_multi_polygon(ptr2, polygonPtr)
        }

        return Astro.fromPtr(_polygon_difference(ptr1, ptr2), 'MultiPolygon')
    }

    intersect(other) {
        let ptr1 = this.ptr
        let ptr2 = other.ptr
        // Normalize as MultiPolygons.
        if (this.type === 'Polygon') {
            const polygonPtr = ptr1
            ptr1 = _create_multi_polygon()
            _push_multi_polygon(ptr1, polygonPtr)
        }
        if (other.type === 'Polygon') {
            const polygonPtr = ptr2
            ptr2 = _create_multi_polygon()
            _push_multi_polygon(ptr2, polygonPtr)
        }

        return Astro.fromPtr(_polygon_intersect(ptr1, ptr2), 'MultiPolygon')
    }

    toGeoJSON() {
        const { type, ptr, properties } = this

        return {
            type: 'Feature',
            geometry: GEOMETRIES[type].toGeoJSON(ptr),
            properties,
        }
    }
}

export function withAstro(...args) {
    if (args.length < 2) {
        throw new Error('withAstro not called with enough arguments!')
    }

    const cb = args[args.length - 1]
    const instances = args.splice(0, args.length - 1).map((feature) => new Astro(feature))

    const res = cb(...instances)
    // Make sure to clean up manual memory.
    instances.forEach((astro) => astro.destroy())
    return res
}
