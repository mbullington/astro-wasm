export const ready = Module.ready

export const getModule = () => Module

export class Astro {
    // Create from internal pointer.
    static fromPtr(ptr) {
        const newObj = Object.create(Astro.prototype)
        newObj.ptr = ptr
        return newObj
    }

    constructor(geojson) {
        // TODO: We assume this is a Polygon.
        const coordinates = geojson.geometry.coordinates

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
            _delete_linear_ring(ringPtr)
        }

        this.ptr = polygonPtr
    }

    // Cleanup pointers.
    destroy() {
        _delete_polygon(this.ptr)
    }

    area() {
        return _polygon_area(this.ptr)
    }

    union(other) {
        return Astro.fromPtr(_polygon_union(this.ptr, other.ptr))
    }

    difference(other) {
        return Astro.fromPtr(_polygon_difference(this.ptr, other.ptr))
    }

    intersect(other) {
        return Astro.fromPtr(_polygon_intersect(this.ptr, other.ptr))
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
