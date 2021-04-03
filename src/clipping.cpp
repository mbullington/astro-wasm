
#include "../third_party/martinez/polygon.h"
#include "../third_party/martinez/martinez.h"

#include "common.hpp"
#include "geometry.hpp"

using namespace std;

EXPORT MultiPolygon *polygon_union(MultiPolygon *multi1, MultiPolygon *multi2) asm("polygon_union");
EXPORT MultiPolygon *polygon_difference(MultiPolygon *multi1, MultiPolygon *multi2) asm("polygon_difference");
EXPORT MultiPolygon *polygon_intersect(MultiPolygon *multi1, MultiPolygon *multi2) asm("polygon_intersect");

MultiPolygon *polygon_clipping(MultiPolygon *multi1, MultiPolygon *multi2, martinez::Martinez::BoolOpType op) {
    martinez::Polygon subj;
    martinez::Polygon clip;

    // Add contours for multi1 to subj.
    for (auto & polygon : *multi1) {
        size_t size1 = polygon.size();
        subj.reserve(size1);
        int i = 0;
        for (; i < size1; i++) {
            LinearRing ring = polygon[i];
            subj.pushbackContour(ring);
        }
    }

    // Add contours for polygon2 to clip.
    for (auto & polygon : *multi2) {
        size_t size1 = polygon.size();
        clip.reserve(size1);
        int i = 0;
        for (; i < size1; i++) {
            LinearRing ring = polygon[i];
            clip.pushbackContour(ring);
        }
    }

    martinez::Polygon mrResult;

    martinez::Martinez mr (subj, clip);
    mr.compute(op, mrResult);

    MultiPolygon *result = new MultiPolygon();
    // Add coutours back.
    result->reserve(mrResult.ncontours());
    for (auto it = mrResult.begin(); it != mrResult.end(); ++it) {
        Polygon polygon;
        polygon.push_back(it->points);
        result->push_back(polygon);
    }

    return result;
}

MultiPolygon *polygon_union(MultiPolygon *multi1, MultiPolygon *multi2) {
    return polygon_clipping(multi1, multi2, martinez::Martinez::UNION);
}

MultiPolygon *polygon_difference(MultiPolygon *multi1, MultiPolygon *multi2) {
    return polygon_clipping(multi1, multi2, martinez::Martinez::DIFFERENCE);
}

MultiPolygon *polygon_intersect(MultiPolygon *multi1, MultiPolygon *multi2) {
    return polygon_clipping(multi1, multi2, martinez::Martinez::INTERSECTION);
}