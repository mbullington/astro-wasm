#pragma once

#include <mapbox/geometry/point.hpp>
#include <mapbox/geometry/polygon.hpp>
#include <mapbox/geometry/multi_polygon.hpp>

#include "common.hpp"

using namespace std;

// Convenience types.

typedef mapbox::geometry::point<double> LngLat;
typedef mapbox::geometry::linear_ring<double> LinearRing;
typedef mapbox::geometry::polygon<double> Polygon;
typedef mapbox::geometry::multi_polygon<double> MultiPolygon;

// LineString type.

EXPORT LinearRing *create_linear_ring() asm("create_linear_ring");
EXPORT void push_linear_ring(LinearRing *linear_ring, double lng, double lat) asm("push_linear_ring");
EXPORT void delete_linear_ring(LinearRing *linear_ring) asm("delete_linear_ring");

// Polygon type.

EXPORT Polygon *create_polygon() asm("create_polygon");
EXPORT void push_polygon(Polygon *polygon, LinearRing *ring) asm("push_polygon");
EXPORT void delete_polygon(Polygon *polygon) asm("delete_polygon");

// MultiPolygon type.

EXPORT MultiPolygon *create_multi_polygon() asm("create_multi_polygon");
EXPORT void push_multi_polygon(MultiPolygon *multi_polygon, Polygon *polygon) asm("push_multi_polygon");
EXPORT void delete_multi_polygon(MultiPolygon *multi_polygon) asm("delete_multi_polygon");