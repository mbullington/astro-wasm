
#include <mapbox/geometry/wagyu/wagyu.hpp>

#include "common.hpp"
#include "geometry.hpp"

using namespace std;
using mapbox::geometry::wagyu::wagyu;
using mapbox::geometry::wagyu::polygon_type;

typedef wagyu<double> Clipper;

EXPORT MultiPolygon *polygon_union(Polygon *polygon1, Polygon *polygon2) asm("polygon_union");

MultiPolygon *polygon_union(Polygon *polygon1, Polygon *polygon2) {
    Clipper clipper;

    clipper.add_polygon(*polygon1);
    clipper.add_polygon(*polygon2);

    MultiPolygon *result = create_multi_polygon();
    clipper.execute(
        mapbox::geometry::wagyu::clip_type_union,
        *result,
        mapbox::geometry::wagyu::fill_type_even_odd, 
        mapbox::geometry::wagyu::fill_type_even_odd
    );

    return result;
}