
#include "../third_party/martinez/polygon.h"
#include "../third_party/martinez/martinez.h"

#include "common.hpp"
#include "geometry.hpp"

using namespace std;

EXPORT Polygon *polygon_union(Polygon *polygon1, Polygon *polygon2) asm("polygon_union");
EXPORT Polygon *polygon_difference(Polygon *polygon1, Polygon *polygon2) asm("polygon_difference");
EXPORT Polygon *polygon_intersect(Polygon *polygon1, Polygon *polygon2) asm("polygon_intersect");

Polygon *polygon_clipping(Polygon *polygon1, Polygon *polygon2, martinez::Martinez::BoolOpType op) {
    martinez::Polygon subj;
    martinez::Polygon clip;

    // Add contours for polygon1.
    size_t size1 = polygon1->size();
    subj.reserve(size1);
    int i = 0;
    for (; i < size1; i++) {
        LinearRing ring = polygon1->at(i);
        martinez::Contour *contour = &subj.pushbackContour(ring);
    }

    // Add contours for polygon2.
    size_t size2 = polygon2->size();
    clip.reserve(size2);
    i = 0;
    for (; i < size2; i++) {
        LinearRing ring = polygon2->at(i);
        martinez::Contour *contour = &clip.pushbackContour(ring);
    }

    martinez::Polygon mrResult;

    martinez::Martinez mr (subj, clip);
    mr.compute(op, mrResult);

    Polygon *result = new Polygon();
    // Add coutours back.
    result->reserve(mrResult.ncontours());
    for (auto it = mrResult.begin(); it != mrResult.end(); ++it) {
        result->push_back(it->points);
    }

    return result;
}

Polygon *polygon_union(Polygon *polygon1, Polygon *polygon2) {
    return polygon_clipping(polygon1, polygon2, martinez::Martinez::UNION);
}

Polygon *polygon_difference(Polygon *polygon1, Polygon *polygon2) {
    return polygon_clipping(polygon1, polygon2, martinez::Martinez::DIFFERENCE);
}

Polygon *polygon_intersect(Polygon *polygon1, Polygon *polygon2) {
    return polygon_clipping(polygon1, polygon2, martinez::Martinez::INTERSECTION);
}