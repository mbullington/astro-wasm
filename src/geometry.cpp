#include <algorithm>

#include "geometry.hpp"

using namespace std; 
using namespace mapbox::geometry;

// LineString type.

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

Polygon *create_polygon() {
    return new Polygon();
}

void push_polygon(Polygon *polygon, LinearRing *linear_ring) {
    polygon->push_back(*linear_ring);
}

void delete_polygon(Polygon *polygon) {
    delete polygon;
}
