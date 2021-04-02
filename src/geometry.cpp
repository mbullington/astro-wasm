#include <algorithm>

#include "geometry.hpp"

using namespace std; 
using namespace mapbox::geometry;

// LineString type.

EXPORT LinearRing *create_linear_ring() asm("create_linear_ring");
EXPORT void push_linear_ring(LinearRing *linear_ring, double lng, double lat) asm("push_linear_ring");
EXPORT void delete_linear_ring(LinearRing *linear_ring) asm("delete_linear_ring");

LinearRing *create_linear_ring() {
    return new LinearRing();
}

void push_linear_ring(LinearRing *linear_ring, double lng, double lat) {
    linear_ring->push_back(LngLat(lng, lat));
}

void delete_linear_ring(LinearRing *linear_ring) {
    delete linear_ring;
}

// Polygon type.

EXPORT Polygon *create_polygon() asm("create_polygon");
EXPORT void push_polygon(Polygon *polygon, LinearRing *ring) asm("push_polygon");
EXPORT void delete_polygon(Polygon *polygon) asm("delete_polygon");

Polygon *create_polygon() {
    return new Polygon();
}

void push_polygon(Polygon *polygon, LinearRing *linear_ring) {
    polygon->push_back(*linear_ring);
}

void delete_polygon(Polygon *polygon) {
    delete polygon;
}

// MultiPolygon type.

EXPORT MultiPolygon *create_multi_polygon() asm("create_multi_polygon");
EXPORT void push_multi_polygon(MultiPolygon *multi_polygon, Polygon *polygon) asm("push_multi_polygon");
EXPORT void delete_multi_polygon(MultiPolygon *multi_polygon) asm("delete_multi_polygon");

MultiPolygon *create_multi_polygon() {
    return new MultiPolygon();
}

void push_multi_polygon(MultiPolygon *multi_polygon, Polygon *polygon) {
    multi_polygon->push_back(*polygon);
}

void delete_multi_polygon(MultiPolygon *multi_polygon) {
    delete multi_polygon;
}
