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
