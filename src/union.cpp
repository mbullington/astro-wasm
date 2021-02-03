
#include "../third_party/martinez/polygon.h"
#include "../third_party/martinez/martinez.h"

#include "common.hpp"
#include "geometry.hpp"

using namespace std;

EXPORT MultiPolygon *polygon_union(Polygon *polygon1, Polygon *polygon2) asm("polygon_union");

MultiPolygon *polygon_union(Polygon *polygon1, Polygon *polygon2) {
    martinez::Polygon subj;
    martinez::Polygon clip;

    // Add contours for polygon1.
    int i = 0;
    for (; i < polygon1->size(); i++) {
        LinearRing ring = polygon1->at(i);
        martinez::Contour *contour = &subj.pushbackContour(ring);
    }

    // Add contours for polygon2.
    i = 0;
    for (; i < polygon2->size(); i++) {
        LinearRing ring = polygon2->at(i);
        martinez::Contour *contour = &clip.pushbackContour(ring);
    }

    martinez::Polygon *result = new martinez::Polygon();

    martinez::Martinez mr (subj, clip);
    mr.compute(martinez::Martinez::UNION, *result);

    // TODO: fix this
    return ((MultiPolygon *) result);
}