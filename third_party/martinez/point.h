// ------------------------------------------------------------------
// Clase Point - Punto en el plano
// ------------------------------------------------------------------

#ifndef POINT_H
#define POINT_H

#include <mapbox/geometry/point.hpp>

using namespace std;

namespace martinez {
	using namespace martinez;

	typedef mapbox::geometry::point<double> Point;

	double point_dist(const Point& a, const Point& b);
}

#endif
