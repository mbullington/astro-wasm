
#include <mapbox/geometry/wagyu/wagyu.hpp>

#include "common.hpp"
#include "geometry.hpp"

using namespace std;
using mapbox::geometry::wagyu::wagyu;
using mapbox::geometry::wagyu::polygon_type;

typedef wagyu<double> Clipper;

EXPORT MultiPolygon *polygon_union(Polygon **polygon_arr, int length) asm("polygon_union");

MultiPolygon *polygon_union(Polygon **polygon_arr, int length) {
    Clipper clipper;

    int i = 0;
    for(; i < length; i++) {
        clipper.add_polygon(*polygon_arr[i], polygon_type::polygon_type_subject);
    }

    MultiPolygon *result = create_multi_polygon();
    clipper.execute(
        mapbox::geometry::wagyu::clip_type_union,
        *result,
        mapbox::geometry::wagyu::fill_type_even_odd, 
        mapbox::geometry::wagyu::fill_type_even_odd
    );

    return result;
}